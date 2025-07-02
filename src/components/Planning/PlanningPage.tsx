import React, { useState } from 'react';
import { Heart, ArrowLeft, Calendar, CheckCircle2, Circle, AlertCircle, Clock, Camera } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import InspirationGallery from '../Gallery/InspirationGallery';

export default function PlanningPage() {
  const { state, dispatch } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const priorityColors = {
    high: 'text-red-600 bg-red-50',
    medium: 'text-yellow-600 bg-yellow-50',
    low: 'text-green-600 bg-green-50'
  };

  const inspirationCategories = [
    'Dress', 'Venue', 'Flowers', 'Decorations', 'Cake', 'Photography', 'Music', 'Invitations'
  ];

  const filteredTasks = state.checklist.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return task.priority === filter;
  });

  const groupedTasks = filteredTasks.reduce((acc, task) => {
    if (!acc[task.timeframe]) {
      acc[task.timeframe] = [];
    }
    acc[task.timeframe].push(task);
    return acc;
  }, {} as Record<string, typeof filteredTasks>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch({ type: 'SET_CURRENT_PAGE', payload: 'dashboard' })}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary-500" />
              <span className="text-2xl font-serif font-semibold text-gray-800">Wedding Planning</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-800 mb-4">Wedding Planning Timeline</h1>
          <p className="text-xl text-gray-600">Stay organized with your comprehensive wedding checklist</p>
        </div>

        {/* Inspiration Gallery Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <Camera className="h-6 w-6 mr-2 text-primary-500" />
                Inspiration Gallery
              </h3>
              <p className="text-gray-600 mt-1">Upload and organize photos for each wedding category</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {inspirationCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="group bg-gradient-to-br from-primary-50 to-sage-50 p-4 rounded-xl hover:shadow-md transition-all transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-100 transition-colors">
                  <Camera className="h-6 w-6 text-primary-500" />
                </div>
                <p className="text-sm font-medium text-gray-700 text-center">{category}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-wrap gap-3">
            {[
              { key: 'all', label: 'All Tasks' },
              { key: 'pending', label: 'Pending' },
              { key: 'completed', label: 'Completed' },
              { key: 'high', label: 'High Priority' },
              { key: 'medium', label: 'Medium Priority' },
              { key: 'low', label: 'Low Priority' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  filter === key
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          {Object.entries(groupedTasks).map(([timeframe, tasks]) => (
            <div key={timeframe} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-primary-500 to-sage-400 px-6 py-4">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <Calendar className="h-6 w-6 mr-2" />
                  {timeframe}
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {tasks.map(task => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        task.completed
                          ? 'border-green-200 bg-green-50'
                          : 'border-gray-200 bg-white hover:border-primary-200'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <button
                          onClick={() => dispatch({ type: 'TOGGLE_CHECKLIST_ITEM', payload: task.id })}
                          className="mt-1"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                          ) : (
                            <Circle className="h-6 w-6 text-gray-400 hover:text-primary-500" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className={`text-lg font-semibold ${task.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                              {task.title}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                                {task.priority} priority
                              </span>
                              <span className="text-sm text-gray-500 flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {task.dueDate}
                              </span>
                            </div>
                          </div>
                          <p className={`text-gray-600 ${task.completed ? 'line-through' : ''}`}>
                            {task.description}
                          </p>
                          <div className="mt-2">
                            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {task.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more tasks.</p>
          </div>
        )}

        {/* Inspiration Gallery Modal */}
        {selectedCategory && (
          <InspirationGallery
            category={selectedCategory}
            isOpen={!!selectedCategory}
            onClose={() => setSelectedCategory(null)}
          />
        )}
      </div>
    </div>
  );
}