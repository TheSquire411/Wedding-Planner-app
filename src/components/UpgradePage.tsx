import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Heart, CheckCircle, Sparkles, Globe, Users, ArrowLeft, Crown, Zap, Camera, Palette } from 'lucide-react';

export default function UpgradePage() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const handleUpgrade = () => {
    // In a real app, this would trigger a payment flow (e.g., with Stripe)
    // For this demo, we'll just update the user's state.
    dispatch({ type: 'UPGRADE_USER_TIER' });
    alert('Congratulations! You are now a Blissful Pro member.');
    navigate('/dashboard');
  };

  const proFeatures = [
    { icon: Sparkles, text: 'Unlimited AI Assistant Chats', description: 'Get unlimited access to our AI wedding planning assistant' },
    { icon: Globe, text: 'Custom Domain for Your Website', description: 'Use your own domain for your wedding website' },
    { icon: Users, text: 'Advanced RSVP Management', description: 'Unlimited guests, custom questions, and detailed analytics' },
    { icon: Camera, text: 'Unlimited Vision Boards & Photos', description: 'Create unlimited mood boards with unlimited photo uploads' },
    { icon: Users, text: 'Collaboration Tools', description: 'Share planning access with family members and wedding planners' },
    { icon: Palette, text: 'AI-Powered Style Recommendations', description: 'Get personalized vendor and style recommendations' },
    { icon: Zap, text: 'Priority Support', description: '24/7 priority customer support for all your questions' },
    { icon: Crown, text: 'Exclusive Templates', description: 'Access to premium website themes and invitation templates' }
  ];

  const freeFeatures = [
    'Basic wedding planning checklist',
    'Simple budget tracker',
    'Basic website builder',
    '5 AI assistant messages',
    '1 vision board with 10 photos',
    'Standard RSVP (up to 50 guests)'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary-500" />
              <span className="text-2xl font-serif font-semibold text-gray-800">Upgrade to Pro</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Crown className="h-16 w-16 text-gold-400" />
            <Sparkles className="h-12 w-12 text-primary-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-800 mb-6">
            Unlock <span className="text-primary-500">Blissful Pro</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get unlimited access to all our premium features and plan the perfect wedding with ease. 
            Join thousands of couples who've upgraded to create their dream wedding.
          </p>
        </div>

        {/* Pricing Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Free Plan</h3>
              <div className="text-4xl font-bold text-gray-600 mb-2">$0</div>
              <p className="text-gray-500">Forever free</p>
            </div>
            <ul className="space-y-3 mb-8">
              {freeFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="text-center">
              <div className="text-sm text-gray-500 font-medium">Current Plan</div>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-primary-500 to-sage-400 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="bg-gold-400 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold mb-2">Blissful Pro</h3>
              <div className="text-5xl font-bold mb-2">$99</div>
              <p className="text-primary-100">One-time payment, lifetime access</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-300 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-white">Everything in Free, plus:</span>
              </li>
              {proFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <feature.icon className="h-5 w-5 text-gold-300 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-white font-medium">{feature.text}</span>
                    <p className="text-primary-100 text-sm mt-1">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={handleUpgrade}
              className="w-full bg-white text-primary-600 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg"
            >
              Upgrade to Pro Now
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full mt-4 text-primary-100 hover:text-white transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-serif font-bold text-gray-800 text-center mb-12">
            Why Couples Love Blissful Pro
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">AI-Powered Planning</h3>
              <p className="text-gray-600">
                Get unlimited access to our AI assistant that helps with vendor recommendations, 
                timeline planning, and answers all your wedding questions.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-sage-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Professional Website</h3>
              <p className="text-gray-600">
                Create a stunning wedding website with your own custom domain, 
                unlimited photos, and advanced RSVP management.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gold-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Collaboration Tools</h3>
              <p className="text-gray-600">
                Share your planning progress with family members and wedding planners. 
                Get everyone involved in creating your perfect day.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-serif font-bold text-gray-800 mb-8">
            What Our Pro Members Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-gray-600 italic mb-4">
                "Upgrading to Pro was the best decision we made! The AI assistant saved us hours of research, 
                and our wedding website looks absolutely stunning."
              </p>
              <div className="font-semibold text-gray-800">- Sarah & Michael</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-gray-600 italic mb-4">
                "The collaboration tools made it so easy to involve our families in the planning process. 
                Everyone could see our progress and contribute ideas."
              </p>
              <div className="font-semibold text-gray-800">- Emma & David</div>
            </div>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">30-Day Money Back Guarantee</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're confident you'll love Blissful Pro. If you're not completely satisfied within 30 days, 
            we'll refund your money, no questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}