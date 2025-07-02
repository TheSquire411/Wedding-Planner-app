import React, { useState } from 'react';
import { Users, Plus, Trash2, Edit3, Download, Mail, Calendar, CheckCircle, XCircle, Clock, Filter, Search } from 'lucide-react';

interface RSVPResponse {
  id: string;
  guestName: string;
  email: string;
  attending: boolean;
  plusOne?: {
    name: string;
    attending: boolean;
  };
  responses: { [questionId: string]: string };
  submittedAt: Date;
  confirmed: boolean;
}

interface RSVPManagerProps {
  websiteData: any;
  onUpdate: (updates: any) => void;
}

export default function RSVPManager({ websiteData, onUpdate }: RSVPManagerProps) {
  const [activeTab, setActiveTab] = useState<'settings' | 'responses' | 'guests'>('settings');
  const [rsvpResponses, setRsvpResponses] = useState<RSVPResponse[]>([
    {
      id: '1',
      guestName: 'Sarah Johnson',
      email: 'sarah@example.com',
      attending: true,
      plusOne: { name: 'Mike Johnson', attending: true },
      responses: {
        '1': 'Yes, I will attend',
        '2': 'Chicken',
        '3': 'No allergies'
      },
      submittedAt: new Date('2024-01-15'),
      confirmed: true
    },
    {
      id: '2',
      guestName: 'David Smith',
      email: 'david@example.com',
      attending: false,
      responses: {
        '1': 'No, I cannot attend',
        '2': '',
        '3': ''
      },
      submittedAt: new Date('2024-01-12'),
      confirmed: true
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'attending' | 'not-attending' | 'pending'>('all');

  const updateRSVPSettings = (updates: any) => {
    onUpdate({
      rsvp: {
        ...websiteData.rsvp,
        ...updates
      }
    });
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      type: 'text' as const,
      question: 'New Question',
      required: false
    };

    updateRSVPSettings({
      questions: [...websiteData.rsvp.questions, newQuestion]
    });
  };

  const updateQuestion = (questionId: string, updates: any) => {
    const updatedQuestions = websiteData.rsvp.questions.map((q: any) =>
      q.id === questionId ? { ...q, ...updates } : q
    );

    updateRSVPSettings({ questions: updatedQuestions });
  };

  const removeQuestion = (questionId: string) => {
    const updatedQuestions = websiteData.rsvp.questions.filter((q: any) => q.id !== questionId);
    updateRSVPSettings({ questions: updatedQuestions });
  };

  const exportResponses = () => {
    const csvContent = [
      ['Guest Name', 'Email', 'Attending', 'Plus One', 'Plus One Attending', 'Submitted At', ...websiteData.rsvp.questions.map((q: any) => q.question)],
      ...rsvpResponses.map(response => [
        response.guestName,
        response.email,
        response.attending ? 'Yes' : 'No',
        response.plusOne?.name || '',
        response.plusOne?.attending ? 'Yes' : '',
        response.submittedAt.toLocaleDateString(),
        ...websiteData.rsvp.questions.map((q: any) => response.responses[q.id] || '')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rsvp-responses.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const sendReminder = (guestEmail: string) => {
    // In a real app, this would send an email reminder
    alert(`Reminder sent to ${guestEmail}`);
  };

  const filteredResponses = rsvpResponses.filter(response => {
    const matchesSearch = response.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         response.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'attending' && response.attending) ||
                         (filterStatus === 'not-attending' && !response.attending) ||
                         (filterStatus === 'pending' && !response.confirmed);
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: rsvpResponses.length,
    attending: rsvpResponses.filter(r => r.attending).length,
    notAttending: rsvpResponses.filter(r => !r.attending).length,
    pending: rsvpResponses.filter(r => !r.confirmed).length,
    totalGuests: rsvpResponses.reduce((sum, r) => sum + (r.attending ? 1 : 0) + (r.plusOne?.attending ? 1 : 0), 0)
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-5 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-700">Total Responses</span>
          </div>
          <div className="text-2xl font-bold text-blue-800">{stats.total}</div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-700">Attending</span>
          </div>
          <div className="text-2xl font-bold text-green-800">{stats.attending}</div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <XCircle className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium text-red-700">Not Attending</span>
          </div>
          <div className="text-2xl font-bold text-red-800">{stats.notAttending}</div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-700">Pending</span>
          </div>
          <div className="text-2xl font-bold text-yellow-800">{stats.pending}</div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium text-purple-700">Total Guests</span>
          </div>
          <div className="text-2xl font-bold text-purple-800">{stats.totalGuests}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'settings', label: 'RSVP Settings', icon: Edit3 },
          { key: 'responses', label: 'Responses', icon: Users },
          { key: 'guests', label: 'Guest Management', icon: Mail }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors ${
              activeTab === key
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* RSVP Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={websiteData.rsvp.enabled}
                  onChange={(e) => updateRSVPSettings({ enabled: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="font-medium text-gray-700">Enable RSVP System</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">RSVP Deadline</label>
              <input
                type="date"
                value={websiteData.rsvp.deadline}
                onChange={(e) => updateRSVPSettings({ deadline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">RSVP Questions</h3>
              <button
                onClick={addQuestion}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Question</span>
              </button>
            </div>

            <div className="space-y-4">
              {websiteData.rsvp.questions.map((question: any, index: number) => (
                <div key={question.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                      <input
                        type="text"
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <select
                        value={question.type}
                        onChange={(e) => updateQuestion(question.id, { type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="text">Text</option>
                        <option value="select">Dropdown</option>
                        <option value="radio">Radio Buttons</option>
                        <option value="checkbox">Checkboxes</option>
                      </select>
                    </div>
                  </div>

                  {(question.type === 'select' || question.type === 'radio' || question.type === 'checkbox') && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Options (one per line)</label>
                      <textarea
                        value={question.options?.join('\n') || ''}
                        onChange={(e) => updateQuestion(question.id, { options: e.target.value.split('\n').filter(o => o.trim()) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        rows={3}
                        placeholder="Option 1&#10;Option 2&#10;Option 3"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={question.required}
                        onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Required</span>
                    </label>

                    <button
                      onClick={() => removeQuestion(question.id)}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Responses Tab */}
      {activeTab === 'responses' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search guests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Responses</option>
                <option value="attending">Attending</option>
                <option value="not-attending">Not Attending</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <button
              onClick={exportResponses}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plus One
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResponses.map((response) => (
                    <tr key={response.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{response.guestName}</div>
                          <div className="text-sm text-gray-500">{response.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          response.attending
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {response.attending ? 'Attending' : 'Not Attending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {response.plusOne ? (
                          <div>
                            <div>{response.plusOne.name}</div>
                            <div className={`text-xs ${response.plusOne.attending ? 'text-green-600' : 'text-red-600'}`}>
                              {response.plusOne.attending ? 'Attending' : 'Not Attending'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {response.submittedAt.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => sendReminder(response.email)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Mail className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Edit3 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Guest Management Tab */}
      {activeTab === 'guests' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Guest List Management</h3>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <Mail className="h-4 w-4" />
                <span>Send Invitations</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Add Guest</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border-2 border-dashed border-gray-300">
            <div className="text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Guest List Integration</h4>
              <p className="text-gray-500 mb-6">
                Import your guest list from the planning section or add guests manually to send RSVP invitations.
              </p>
              <div className="flex justify-center space-x-4">
                <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Import from Planning
                </button>
                <button className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                  Add Manually
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="font-semibold text-gray-800 mb-4">Invitation Status</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sent</span>
                  <span className="font-medium">45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Opened</span>
                  <span className="font-medium">38</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Responded</span>
                  <span className="font-medium">32</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-medium text-yellow-600">13</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="font-semibold text-gray-800 mb-4">Response Rate</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Overall Rate</span>
                  <span className="font-medium">71%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-500 h-2 rounded-full" style={{ width: '71%' }}></div>
                </div>
                <div className="text-sm text-gray-500">
                  32 of 45 invitations responded
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}