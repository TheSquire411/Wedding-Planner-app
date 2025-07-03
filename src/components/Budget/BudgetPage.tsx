import React, { useState } from 'react';
import { Heart, DollarSign, Plus, Edit3, TrendingUp, TrendingDown, Calculator } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BudgetItem } from '../../types';
import BackButton from '../common/BackButton';
import BudgetCalculator from './BudgetCalculator';

export default function BudgetPage() {
  const { state, dispatch } = useApp();
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tracker' | 'calculator'>('tracker');
  const [editValues, setEditValues] = useState<{ budgeted: number; spent: number; vendor: string; notes: string }>({
    budgeted: 0,
    spent: 0,
    vendor: '',
    notes: ''
  });

  const totalBudget = state.budget.reduce((sum, item) => sum + item.budgeted, 0);
  const totalSpent = state.budget.reduce((sum, item) => sum + item.spent, 0);
  const remaining = totalBudget - totalSpent;

  const handleEdit = (item: BudgetItem) => {
    setEditingItem(item.id);
    setEditValues({
      budgeted: item.budgeted,
      spent: item.spent,
      vendor: item.vendor || '',
      notes: item.notes || ''
    });
  };

  const handleSave = (itemId: string) => {
    const updatedItem: BudgetItem = {
      ...state.budget.find(item => item.id === itemId)!,
      ...editValues
    };
    dispatch({ type: 'UPDATE_BUDGET_ITEM', payload: updatedItem });
    setEditingItem(null);
  };

  const handleSaveBudgetFromCalculator = (breakdown: any[]) => {
    // Convert calculator breakdown to budget items
    const budgetItems: BudgetItem[] = breakdown.map((item, index) => ({
      id: `calc-${Date.now()}-${index}`,
      category: item.category,
      budgeted: item.averageAmount,
      spent: 0,
      vendor: '',
      notes: `Generated from budget calculator - ${item.description}`
    }));

    // Clear existing budget and add new items
    budgetItems.forEach(item => {
      dispatch({ type: 'ADD_BUDGET_ITEM', payload: item });
    });

    // Switch to tracker tab to show the new budget
    setActiveTab('tracker');
    
    alert('Budget breakdown has been saved to your tracker!');
  };

  const getPercentage = (spent: number, budgeted: number) => {
    if (budgeted === 0) return 0;
    return Math.min((spent / budgeted) * 100, 100);
  };

  const getStatusColor = (spent: number, budgeted: number) => {
    const percentage = getPercentage(spent, budgeted);
    if (percentage >= 100) return 'text-red-600 bg-red-50';
    if (percentage >= 80) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <BackButton />
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary-500" />
              <span className="text-2xl font-serif font-semibold text-gray-800">Budget Management</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-800 mb-4">Wedding Budget</h1>
          <p className="text-xl text-gray-600">Track your expenses and plan your perfect wedding budget</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors ${
              activeTab === 'tracker'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <DollarSign className="h-4 w-4" />
            <span className="font-medium">Budget Tracker</span>
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors ${
              activeTab === 'calculator'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Calculator className="h-4 w-4" />
            <span className="font-medium">Budget Calculator</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'tracker' && (
          <div className="space-y-8">
            {/* Budget Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <DollarSign className="h-8 w-8 text-sage-400" />
                  <h3 className="text-lg font-semibold text-gray-800">Total Budget</h3>
                </div>
                <div className="text-3xl font-bold text-gray-800">${totalBudget.toLocaleString()}</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingUp className="h-8 w-8 text-red-500" />
                  <h3 className="text-lg font-semibold text-gray-800">Total Spent</h3>
                </div>
                <div className="text-3xl font-bold text-gray-800">${totalSpent.toLocaleString()}</div>
                <div className="text-sm text-gray-600 mt-2">
                  {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}% of budget
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingDown className={`h-8 w-8 ${remaining >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                  <h3 className="text-lg font-semibold text-gray-800">Remaining</h3>
                </div>
                <div className={`text-3xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(remaining).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {remaining >= 0 ? 'Under budget' : 'Over budget'}
                </div>
              </div>
            </div>

            {/* Budget Categories */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-primary-500 to-sage-400 px-6 py-4">
                <h3 className="text-xl font-semibold text-white">Budget Breakdown</h3>
              </div>
              <div className="p-6">
                {state.budget.length === 0 ? (
                  <div className="text-center py-12">
                    <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Budget Items Yet</h3>
                    <p className="text-gray-500 mb-6">Use the Budget Calculator to generate a personalized budget breakdown</p>
                    <button
                      onClick={() => setActiveTab('calculator')}
                      className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Create Budget Plan
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {state.budget.map(item => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-800">{item.category}</h4>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.spent, item.budgeted)}`}>
                              {getPercentage(item.spent, item.budgeted).toFixed(0)}% used
                            </span>
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 text-gray-600 hover:text-primary-500"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {editingItem === item.id ? (
                          <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Budgeted Amount</label>
                                <input
                                  type="number"
                                  value={editValues.budgeted}
                                  onChange={(e) => setEditValues(prev => ({ ...prev, budgeted: Number(e.target.value) }))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Amount Spent</label>
                                <input
                                  type="number"
                                  value={editValues.spent}
                                  onChange={(e) => setEditValues(prev => ({ ...prev, spent: Number(e.target.value) }))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
                              <input
                                type="text"
                                value={editValues.vendor}
                                onChange={(e) => setEditValues(prev => ({ ...prev, vendor: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Vendor name (optional)"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                              <textarea
                                value={editValues.notes}
                                onChange={(e) => setEditValues(prev => ({ ...prev, notes: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                rows={2}
                                placeholder="Additional notes (optional)"
                              />
                            </div>
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleSave(item.id)}
                                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingItem(null)}
                                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-gray-600">Budgeted: ${item.budgeted.toLocaleString()}</span>
                              <span className="text-gray-600">Spent: ${item.spent.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                              <div
                                className={`h-3 rounded-full transition-all ${
                                  getPercentage(item.spent, item.budgeted) >= 100 ? 'bg-red-500' :
                                  getPercentage(item.spent, item.budgeted) >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${getPercentage(item.spent, item.budgeted)}%` }}
                              ></div>
                            </div>
                            {item.vendor && (
                              <p className="text-sm text-gray-600 mb-2">
                                <strong>Vendor:</strong> {item.vendor}
                              </p>
                            )}
                            {item.notes && (
                              <p className="text-sm text-gray-600">
                                <strong>Notes:</strong> {item.notes}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calculator' && (
          <BudgetCalculator onSaveBudget={handleSaveBudgetFromCalculator} />
        )}
      </div>
    </div>
  );
}