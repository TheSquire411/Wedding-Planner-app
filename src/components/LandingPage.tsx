import React from 'react';
import { Heart, Calendar, DollarSign, CheckSquare, MessageCircle, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LandingPage() {
  const { dispatch } = useApp();

  const features = [
    {
      icon: Calendar,
      title: 'Smart Planning Timeline',
      description: 'Never miss a deadline with our AI-powered wedding timeline'
    },
    {
      icon: DollarSign,
      title: 'Budget Tracker',
      description: 'Keep your wedding costs under control with detailed budget management'
    },
    {
      icon: CheckSquare,
      title: 'Complete Checklist',
      description: 'Comprehensive checklist covering every aspect of wedding planning'
    },
    {
      icon: MessageCircle,
      title: 'AI Wedding Assistant',
      description: 'Get instant answers to your wedding planning questions'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary-500" />
            <span className="text-2xl font-serif font-semibold text-gray-800">Blissful</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch({ type: 'SET_CURRENT_PAGE', payload: 'login' })}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_CURRENT_PAGE', payload: 'signup' })}
              className="bg-primary-500 text-white px-6 py-2 rounded-full hover:bg-primary-600 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-bounce-subtle inline-block mb-6">
            <Sparkles className="h-12 w-12 text-gold-400 mx-auto" />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-800 mb-6 animate-fade-in">
            Your Perfect Wedding
            <span className="text-primary-500 block">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto animate-slide-up">
            Plan your dream wedding with our AI-powered assistant, smart timeline, and comprehensive tools. 
            From budget tracking to vendor management, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <button
              onClick={() => dispatch({ type: 'SET_CURRENT_PAGE', payload: 'signup' })}
              className="bg-primary-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary-600 transform hover:scale-105 transition-all shadow-lg"
            >
              Start Planning Now
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_CURRENT_PAGE', payload: 'demo' })}
              className="border-2 border-primary-500 text-primary-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              See How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-800 mb-4">
              Everything You Need to Plan Your Perfect Day
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive suite of tools makes wedding planning stress-free and enjoyable
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-primary-50 to-sage-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <feature.icon className="h-12 w-12 text-primary-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-primary-500 to-sage-400">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold text-white mb-6">
            Ready to Start Planning Your Dream Wedding?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of couples who have planned their perfect day with Blissful
          </p>
          <button
            onClick={() => dispatch({ type: 'SET_CURRENT_PAGE', payload: 'signup' })}
            className="bg-white text-primary-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all shadow-lg"
          >
            Get Started for Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white px-6 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-6 w-6 text-primary-500" />
            <span className="text-xl font-serif font-semibold">Blissful</span>
          </div>
          <p className="text-gray-400">© 2024 Blissful. Making wedding planning beautiful and simple.</p>
        </div>
      </footer>
    </div>
  );
}