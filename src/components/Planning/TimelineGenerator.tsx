import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle, Users, MapPin, Camera, Music, Flower, ChefHat, Car, Gift, Bell, Download, Save, Plus, Edit3, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Vendor {
  id: string;
  name: string;
  type: 'photographer' | 'videographer' | 'florist' | 'caterer' | 'dj' | 'band' | 'venue' | 'planner' | 'transportation' | 'other';
  contact: string;
  setupTime: number; // hours needed for setup
  arrivalTime: string; // when they need to arrive
  requirements: string[];
  isConfirmed: boolean;
}

interface TimelineTask {
  id: string;
  title: string;
  description: string;
  category: 'planning' | 'vendor' | 'personal' | 'ceremony' | 'reception' | 'logistics';
  dueDate: Date;
  isFlexible: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedHours: number;
  dependencies: string[];
  vendorId?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  bufferDays: number;
  notes: string;
}

interface TimelineConflict {
  id: string;
  type: 'vendor-overlap' | 'tight-deadline' | 'dependency-issue' | 'resource-conflict';
  severity: 'critical' | 'warning' | 'info';
  description: string;
  affectedTasks: string[];
  suggestions: string[];
}

interface TimelineGeneratorProps {
  onSaveTimeline?: (timeline: TimelineTask[]) => void;
}

export default function TimelineGenerator({ onSaveTimeline }: TimelineGeneratorProps) {
  const { state } = useApp();
  const [weddingDate, setWeddingDate] = useState(state.user?.weddingDate || '');
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [timeline, setTimeline] = useState<TimelineTask[]>([]);
  const [conflicts, setConflicts] = useState<TimelineConflict[]>([]);
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [editingTask, setEditingTask] = useState<TimelineTask | null>(null);
  const [activeView, setActiveView] = useState<'monthly' | 'weekly' | 'day-of'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(0); // months before wedding

  const vendorTypes = [
    { value: 'photographer', label: 'Photographer', icon: Camera },
    { value: 'videographer', label: 'Videographer', icon: Camera },
    { value: 'florist', label: 'Florist', icon: Flower },
    { value: 'caterer', label: 'Caterer', icon: ChefHat },
    { value: 'dj', label: 'DJ', icon: Music },
    { value: 'band', label: 'Band', icon: Music },
    { value: 'venue', label: 'Venue', icon: MapPin },
    { value: 'planner', label: 'Wedding Planner', icon: Users },
    { value: 'transportation', label: 'Transportation', icon: Car },
    { value: 'other', label: 'Other', icon: Gift }
  ];

  const taskCategories = [
    { value: 'planning', label: 'Planning & Coordination', color: 'bg-blue-100 text-blue-800' },
    { value: 'vendor', label: 'Vendor Management', color: 'bg-purple-100 text-purple-800' },
    { value: 'personal', label: 'Personal Preparation', color: 'bg-pink-100 text-pink-800' },
    { value: 'ceremony', label: 'Ceremony Setup', color: 'bg-green-100 text-green-800' },
    { value: 'reception', label: 'Reception Setup', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'logistics', label: 'Day-of Logistics', color: 'bg-gray-100 text-gray-800' }
  ];

  const generateBaseTimeline = (): TimelineTask[] => {
    if (!weddingDate) return [];

    const wedding = new Date(weddingDate);
    const tasks: TimelineTask[] = [];

    // 12+ months before
    tasks.push({
      id: 'set-date-venue',
      title: 'Set Wedding Date & Book Venue',
      description: 'Confirm your wedding date and secure your ceremony and reception venues',
      category: 'planning',
      dueDate: new Date(wedding.getTime() - 365 * 24 * 60 * 60 * 1000),
      isFlexible: false,
      priority: 'critical',
      estimatedHours: 20,
      dependencies: [],
      status: 'pending',
      bufferDays: 0,
      notes: 'This is the foundation of all other planning'
    });

    // 10-12 months before
    tasks.push({
      id: 'book-photographer',
      title: 'Book Photographer & Videographer',
      description: 'Research and book your wedding photographer and videographer',
      category: 'vendor',
      dueDate: new Date(wedding.getTime() - 330 * 24 * 60 * 60 * 1000),
      isFlexible: true,
      priority: 'critical',
      estimatedHours: 15,
      dependencies: ['set-date-venue'],
      status: 'pending',
      bufferDays: 30,
      notes: 'Popular photographers book up quickly'
    });

    // 8-10 months before
    tasks.push({
      id: 'choose-wedding-party',
      title: 'Choose Wedding Party',
      description: 'Select your bridesmaids, groomsmen, and other wedding party members',
      category: 'personal',
      dueDate: new Date(wedding.getTime() - 270 * 24 * 60 * 60 * 1000),
      isFlexible: true,
      priority: 'high',
      estimatedHours: 5,
      dependencies: [],
      status: 'pending',
      bufferDays: 14,
      notes: 'Consider their availability and commitment level'
    });

    // 6-8 months before
    tasks.push({
      id: 'book-caterer-music',
      title: 'Book Caterer & Music',
      description: 'Secure your catering service and entertainment (DJ/band)',
      category: 'vendor',
      dueDate: new Date(wedding.getTime() - 210 * 24 * 60 * 60 * 1000),
      isFlexible: true,
      priority: 'critical',
      estimatedHours: 12,
      dependencies: ['set-date-venue'],
      status: 'pending',
      bufferDays: 21,
      notes: 'Coordinate with venue for setup requirements'
    });

    // 4-6 months before
    tasks.push({
      id: 'order-invitations',
      title: 'Order Wedding Invitations',
      description: 'Design and order your wedding invitations and save the dates',
      category: 'planning',
      dueDate: new Date(wedding.getTime() - 150 * 24 * 60 * 60 * 1000),
      isFlexible: true,
      priority: 'high',
      estimatedHours: 8,
      dependencies: ['choose-wedding-party'],
      status: 'pending',
      bufferDays: 14,
      notes: 'Allow time for proofing and printing'
    });

    // 2-3 months before
    tasks.push({
      id: 'final-venue-walkthrough',
      title: 'Final Venue Walkthrough',
      description: 'Conduct final walkthrough with venue coordinator and key vendors',
      category: 'logistics',
      dueDate: new Date(wedding.getTime() - 75 * 24 * 60 * 60 * 1000),
      isFlexible: false,
      priority: 'critical',
      estimatedHours: 3,
      dependencies: ['book-caterer-music', 'book-photographer'],
      status: 'pending',
      bufferDays: 7,
      notes: 'Coordinate timing with all vendors'
    });

    // 1 month before
    tasks.push({
      id: 'confirm-final-details',
      title: 'Confirm All Final Details',
      description: 'Confirm headcount, timeline, and special requirements with all vendors',
      category: 'vendor',
      dueDate: new Date(wedding.getTime() - 30 * 24 * 60 * 60 * 1000),
      isFlexible: false,
      priority: 'critical',
      estimatedHours: 6,
      dependencies: ['final-venue-walkthrough'],
      status: 'pending',
      bufferDays: 3,
      notes: 'Create detailed timeline for wedding day'
    });

    // 1 week before
    tasks.push({
      id: 'rehearsal-dinner',
      title: 'Wedding Rehearsal & Dinner',
      description: 'Conduct ceremony rehearsal and host rehearsal dinner',
      category: 'ceremony',
      dueDate: new Date(wedding.getTime() - 1 * 24 * 60 * 60 * 1000),
      isFlexible: false,
      priority: 'critical',
      estimatedHours: 4,
      dependencies: ['confirm-final-details'],
      status: 'pending',
      bufferDays: 0,
      notes: 'Usually held the night before the wedding'
    });

    // Wedding day tasks
    const weddingDayTasks = [
      {
        id: 'vendor-setup-start',
        title: 'Vendor Setup Begins',
        description: 'Florist, caterer, and other vendors begin setup',
        category: 'logistics',
        dueDate: new Date(wedding.getTime()),
        isFlexible: false,
        priority: 'critical',
        estimatedHours: 4,
        dependencies: [],
        status: 'pending',
        bufferDays: 0,
        notes: 'Coordinate arrival times to avoid conflicts'
      },
      {
        id: 'bridal-prep',
        title: 'Bridal Party Preparation',
        description: 'Hair, makeup, and getting dressed',
        category: 'personal',
        dueDate: new Date(wedding.getTime()),
        isFlexible: false,
        priority: 'critical',
        estimatedHours: 4,
        dependencies: [],
        status: 'pending',
        bufferDays: 0,
        notes: 'Start early to allow buffer time'
      }
    ];

    return [...tasks, ...weddingDayTasks];
  };

  const detectConflicts = (): TimelineConflict[] => {
    const detectedConflicts: TimelineConflict[] = [];

    // Check for tight deadlines
    timeline.forEach(task => {
      const daysUntilDue = Math.ceil((task.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilDue < task.bufferDays && task.status === 'pending') {
        detectedConflicts.push({
          id: `tight-${task.id}`,
          type: 'tight-deadline',
          severity: daysUntilDue < 0 ? 'critical' : 'warning',
          description: `Task "${task.title}" has insufficient buffer time`,
          affectedTasks: [task.id],
          suggestions: [
            'Consider moving the deadline earlier',
            'Allocate more resources to complete faster',
            'Break down into smaller, manageable tasks'
          ]
        });
      }
    });

    // Check for vendor setup conflicts
    const weddingDayTasks = timeline.filter(task => 
      task.dueDate.toDateString() === new Date(weddingDate).toDateString()
    );

    const vendorSetupTimes = vendors.map(vendor => ({
      vendor,
      startTime: vendor.arrivalTime,
      endTime: new Date(new Date(`2000-01-01 ${vendor.arrivalTime}`).getTime() + vendor.setupTime * 60 * 60 * 1000).toTimeString().slice(0, 5)
    }));

    // Check for overlapping vendor setup times
    for (let i = 0; i < vendorSetupTimes.length; i++) {
      for (let j = i + 1; j < vendorSetupTimes.length; j++) {
        const vendor1 = vendorSetupTimes[i];
        const vendor2 = vendorSetupTimes[j];
        
        if (vendor1.startTime < vendor2.endTime && vendor2.startTime < vendor1.endTime) {
          detectedConflicts.push({
            id: `vendor-overlap-${vendor1.vendor.id}-${vendor2.vendor.id}`,
            type: 'vendor-overlap',
            severity: 'warning',
            description: `${vendor1.vendor.name} and ${vendor2.vendor.name} have overlapping setup times`,
            affectedTasks: [],
            suggestions: [
              'Stagger vendor arrival times',
              'Designate separate setup areas',
              'Coordinate with venue for space allocation'
            ]
          });
        }
      }
    }

    return detectedConflicts;
  };

  const addVendor = (vendorData: Omit<Vendor, 'id'>) => {
    const newVendor: Vendor = {
      ...vendorData,
      id: Date.now().toString()
    };
    setVendors(prev => [...prev, newVendor]);
    setShowVendorForm(false);
  };

  const addCustomTask = (taskData: Omit<TimelineTask, 'id'>) => {
    const newTask: TimelineTask = {
      ...taskData,
      id: Date.now().toString()
    };
    setTimeline(prev => [...prev, newTask]);
    setShowTaskForm(false);
  };

  const generateTimeline = () => {
    const baseTimeline = generateBaseTimeline();
    
    // Add vendor-specific tasks
    const vendorTasks: TimelineTask[] = [];
    vendors.forEach(vendor => {
      if (!vendor.isConfirmed) {
        vendorTasks.push({
          id: `confirm-${vendor.id}`,
          title: `Confirm ${vendor.name}`,
          description: `Finalize contract and details with ${vendor.name}`,
          category: 'vendor',
          dueDate: new Date(new Date(weddingDate).getTime() - 60 * 24 * 60 * 60 * 1000),
          isFlexible: true,
          priority: 'high',
          estimatedHours: 2,
          dependencies: [],
          vendorId: vendor.id,
          status: 'pending',
          bufferDays: 14,
          notes: `Contact: ${vendor.contact}`
        });
      }
    });

    const fullTimeline = [...baseTimeline, ...vendorTasks].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
    setTimeline(fullTimeline);
    
    // Detect conflicts after timeline is set
    setTimeout(() => {
      const newConflicts = detectConflicts();
      setConflicts(newConflicts);
    }, 100);
  };

  const getTasksByTimeframe = (timeframe: 'monthly' | 'weekly' | 'day-of') => {
    const wedding = new Date(weddingDate);
    const now = new Date();

    switch (timeframe) {
      case 'monthly':
        const monthStart = new Date(wedding.getTime() - (selectedMonth + 1) * 30 * 24 * 60 * 60 * 1000);
        const monthEnd = new Date(wedding.getTime() - selectedMonth * 30 * 24 * 60 * 60 * 1000);
        return timeline.filter(task => task.dueDate >= monthStart && task.dueDate <= monthEnd);
      
      case 'weekly':
        const weekStart = new Date(wedding.getTime() - 7 * 24 * 60 * 60 * 1000);
        const weekEnd = wedding;
        return timeline.filter(task => task.dueDate >= weekStart && task.dueDate <= weekEnd);
      
      case 'day-of':
        return timeline.filter(task => task.dueDate.toDateString() === wedding.toDateString());
      
      default:
        return timeline;
    }
  };

  const exportTimeline = () => {
    const csvContent = [
      ['Task', 'Category', 'Due Date', 'Priority', 'Flexible', 'Status', 'Estimated Hours', 'Notes'],
      ...timeline.map(task => [
        task.title,
        task.category,
        task.dueDate.toLocaleDateString(),
        task.priority,
        task.isFlexible ? 'Yes' : 'No',
        task.status,
        task.estimatedHours,
        task.notes
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wedding-timeline-${new Date(weddingDate).toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (weddingDate) {
      generateTimeline();
    }
  }, [weddingDate, vendors]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Calendar className="h-8 w-8 text-primary-500" />
          <h2 className="text-3xl font-serif font-bold text-gray-800">Wedding Planning Timeline</h2>
        </div>
        <p className="text-xl text-gray-600">Personalized timeline with vendor coordination and conflict detection</p>
      </div>

      {/* Wedding Date Input */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Wedding Date</label>
            <input
              type="date"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setShowVendorForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Vendor</span>
            </button>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setShowTaskForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Custom Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Vendors List */}
      {vendors.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirmed Vendors</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {vendors.map(vendor => {
              const VendorIcon = vendorTypes.find(type => type.value === vendor.type)?.icon || Gift;
              return (
                <div key={vendor.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <VendorIcon className="h-5 w-5 text-primary-500" />
                      <span className="font-medium text-gray-800">{vendor.name}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${vendor.isConfirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {vendor.isConfirmed ? 'Confirmed' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Arrival: {vendor.arrivalTime} | Setup: {vendor.setupTime}h</p>
                  <p className="text-sm text-gray-500">{vendor.contact}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-800 mb-2">Timeline Conflicts Detected</h4>
              <div className="space-y-3">
                {conflicts.map(conflict => (
                  <div key={conflict.id} className="bg-white rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-red-800">{conflict.description}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        conflict.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        conflict.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {conflict.severity}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Suggestions:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {conflict.suggestions.map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline View Controls */}
      {timeline.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Timeline View</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                {['monthly', 'weekly', 'day-of'].map(view => (
                  <button
                    key={view}
                    onClick={() => setActiveView(view as any)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      activeView === view
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {view === 'day-of' ? 'Day-of' : view.charAt(0).toUpperCase() + view.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={exportTimeline}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
                {onSaveTimeline && (
                  <button
                    onClick={() => onSaveTimeline(timeline)}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Month selector for monthly view */}
          {activeView === 'monthly' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const monthsBeforeWedding = 11 - i;
                  const monthDate = new Date(new Date(weddingDate).getTime() - monthsBeforeWedding * 30 * 24 * 60 * 60 * 1000);
                  return (
                    <option key={i} value={monthsBeforeWedding}>
                      {monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} ({monthsBeforeWedding} months before)
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* Timeline Tasks */}
          <div className="space-y-4">
            {getTasksByTimeframe(activeView).map(task => {
              const categoryInfo = taskCategories.find(cat => cat.value === task.category);
              return (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(task.status)}
                      <div>
                        <h4 className="font-semibold text-gray-800">{task.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${categoryInfo?.color}`}>
                        {categoryInfo?.label}
                      </span>
                      {!task.isFlexible && (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                          Fixed
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>Due Date:</strong> {task.dueDate.toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Estimated Time:</strong> {task.estimatedHours}h
                    </div>
                    <div>
                      <strong>Buffer Days:</strong> {task.bufferDays}
                    </div>
                    <div>
                      <strong>Dependencies:</strong> {task.dependencies.length || 'None'}
                    </div>
                  </div>
                  
                  {task.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{task.notes}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Generate Timeline Button */}
      {!timeline.length && weddingDate && (
        <div className="text-center">
          <button
            onClick={generateTimeline}
            className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
          >
            Generate Personalized Timeline
          </button>
        </div>
      )}

      {/* Vendor Form Modal */}
      {showVendorForm && (
        <VendorForm
          onSave={addVendor}
          onCancel={() => setShowVendorForm(false)}
          vendorTypes={vendorTypes}
        />
      )}

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          onSave={addCustomTask}
          onCancel={() => setShowTaskForm(false)}
          taskCategories={taskCategories}
          weddingDate={weddingDate}
        />
      )}
    </div>
  );
}

// Vendor Form Component
interface VendorFormProps {
  onSave: (vendor: Omit<Vendor, 'id'>) => void;
  onCancel: () => void;
  vendorTypes: any[];
}

function VendorForm({ onSave, onCancel, vendorTypes }: VendorFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'photographer' as Vendor['type'],
    contact: '',
    setupTime: 2,
    arrivalTime: '08:00',
    requirements: [''],
    isConfirmed: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      requirements: formData.requirements.filter(req => req.trim())
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Vendor</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Vendor['type'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {vendorTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Information</label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Phone or email"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Arrival Time</label>
                <input
                  type="time"
                  value={formData.arrivalTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, arrivalTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Setup Time (hours)</label>
                <input
                  type="number"
                  value={formData.setupTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, setupTime: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="0.5"
                  step="0.5"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isConfirmed}
                  onChange={(e) => setFormData(prev => ({ ...prev, isConfirmed: e.target.checked }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Vendor is confirmed</span>
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Add Vendor
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Task Form Component
interface TaskFormProps {
  onSave: (task: Omit<TimelineTask, 'id'>) => void;
  onCancel: () => void;
  taskCategories: any[];
  weddingDate: string;
}

function TaskForm({ onSave, onCancel, taskCategories, weddingDate }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'planning' as TimelineTask['category'],
    dueDate: '',
    isFlexible: true,
    priority: 'medium' as TimelineTask['priority'],
    estimatedHours: 2,
    dependencies: [],
    status: 'pending' as TimelineTask['status'],
    bufferDays: 7,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      dueDate: new Date(formData.dueDate)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Custom Task</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as TimelineTask['category'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {taskCategories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as TimelineTask['priority'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  max={weddingDate}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Hours</label>
                <input
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="0.5"
                  step="0.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buffer Days</label>
              <input
                type="number"
                value={formData.bufferDays}
                onChange={(e) => setFormData(prev => ({ ...prev, bufferDays: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                min="0"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isFlexible}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFlexible: e.target.checked }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">This deadline is flexible</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={2}
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Add Task
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}