import React, { useEffect } from 'react';
import { Heart, Calendar, DollarSign, CheckSquare, MessageCircle, User, LogOut, Palette, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { defaultChecklist } from '../../data/checklistData';
import { defaultBudgetCategories } from '../../data/budgetData';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.user) return;
    const checklistWithIds = defaultChecklist.map(item => ({ ...item, id: `${Date.now()}-${Math.random()}` }));
    const budgetWithIds = defaultBudgetCategories.map((item, index) => ({
      ...item,
      id: `${Date.now()}-${index}`,
      budgeted: state.user?.styleProfile ? Math.floor(state.user.styleProfile.budget * getBudgetPercentage(item.category)) : 0
    }));

    dispatch({ type: 'INITIALIZE_CHECKLIST', payload: checklistWithIds });
    dispatch({ type: 'INITIALIZE_BUDGET', payload: budgetWithIds });
  }, [dispatch, state.user]);

  const getBudgetPercentage = (category: string): number => {
    const percentages: { [key: string]: number } = {
      'Venue': 0.40, 'Catering': 0.25, 'Photography': 0.12, 'Flowers': 0.08,
      'Music/DJ': 0.05, 'Dress & Attire': 0.05, 'Transportation': 0.02,
      'Decorations': 0.02, 'Stationery': 0.01, 'Miscellaneous': 0.05
    };
    return percentages[category] || 0.05;
  };

  const completedTasks = state.checklist.filter(item => item.completed).length;
  const totalBudget = state.budget.reduce((sum, item) => sum + item.budgeted, 0);
  const totalSpent = state.budget.reduce((sum, item) => sum + item.spent, 0);

  const menuItems = [
    { icon: Calendar, label: 'Planning', page: '/planning' },
    { icon: DollarSign, label: 'Budget', page: '/budget' },
    { icon: Palette, label: 'Vision Board', page: '/vision-board' },
    { icon: Globe, label: 'Website', page: '/website' },
    { icon: MessageCircle, label: 'AI Assistant', page: '/chat' },
  ];

  const handleSignOut = () => {
    dispatch({ type: 'SET_USER', payload: null });
    navigate('/');
  };

  if (!state.user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary-500" />
            <span className="text-2xl font-serif font-semibold text-gray-800">Blissful</span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">{state.user.name}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-800 mb-2">
            Welcome back, {state.user.name}!
          </h1>
          <p className="text-xl text-gray-600">
            {state.user.weddingDate ? `Your big day is ${new Date(state.user.weddingDate).toLocaleDateString()}` : 'Let\'s continue planning your perfect wedding'}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <CheckSquare className="h-8 w-8 text-primary-500" />
              <h3 className="text-lg font-semibold text-gray-800">Tasks Complete</h3>
            </div>
            <div className="text-3xl font-bold text-gray-800">{completedTasks}/{state.checklist.length}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all"
                style={{ width: `${(completedTasks / state.checklist.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <DollarSign className="h-8 w-8 text-sage-400" />
              <h3 className="text-lg font-semibold text-gray-800">Budget Status</h3>
            </div>
            <div className="text-3xl font-bold text-gray-800">${totalSpent.toLocaleString()}</div>
            <div className="text-sm text-gray-600">of ${totalBudget.toLocaleString()} budgeted</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-sage-400 h-2 rounded-full transition-all"
                style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="h-8 w-8 text-gold-400" />
              <h3 className="text-lg font-semibold text-gray-800">Days Until Wedding</h3>
            </div>
            <div className="text-3xl font-bold text-gray-800">
              {state.user.weddingDate ? Math.max(0, Math.ceil((new Date(state.user.weddingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : '---'}
            </div>
            <div className="text-sm text-gray-600">Stay on track!</div>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.page}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 text-left block"
            >
              <item.icon className="h-12 w-12 text-primary-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.label}</h3>
              <p className="text-gray-600">
                {item.label === 'Planning' && 'Manage your wedding timeline and checklist'}
                {item.label === 'Budget' && 'Track expenses and manage your wedding budget'}
                {item.label === 'Vision Board' && 'Create beautiful mood boards for your wedding'}
                {item.label === 'Website' && 'Build your wedding website with RSVP system'}
                {item.label === 'AI Assistant' && 'Get instant answers to your wedding questions'}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}