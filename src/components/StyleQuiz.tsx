import React, { useState } from 'react';
import { Heart, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useGemini } from '../hooks/useGemini';
import { StyleProfile } from '../types';

export default function StyleQuiz() {
  const { state, dispatch } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<StyleProfile>>({});
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);

  const { generateVisionBoard } = useGemini({
    onSuccess: (data) => {
      console.log('Generated enhanced style profile:', data);
    },
    onError: (error) => {
      console.error('Failed to enhance style profile:', error);
    }
  });

  const questions = [
    {
      question: "What's your preferred wedding style?",
      key: 'style' as keyof StyleProfile,
      options: [
        'Classic & Elegant',
        'Modern & Minimalist',
        'Rustic & Bohemian',
        'Vintage & Romantic',
        'Beach & Tropical',
        'Garden & Natural'
      ]
    },
    {
      question: "What's your dream color palette?",
      key: 'colors' as keyof StyleProfile,
      options: [
        ['Blush Pink', 'Gold'],
        ['Navy Blue', 'Silver'],
        ['Sage Green', 'Cream'],
        ['Burgundy', 'Rose Gold'],
        ['Lavender', 'Gray'],
        ['Coral', 'Peach']
      ]
    },
    {
      question: "What season is your wedding?",
      key: 'season' as keyof StyleProfile,
      options: ['Spring', 'Summer', 'Fall', 'Winter']
    },
    {
      question: "What's your ideal venue type?",
      key: 'venue' as keyof StyleProfile,
      options: [
        'Garden/Outdoor',
        'Ballroom/Hotel',
        'Beach/Waterfront',
        'Barn/Rustic',
        'Museum/Historic',
        'Rooftop/City View'
      ]
    },
    {
      question: "What's your estimated budget?",
      key: 'budget' as keyof StyleProfile,
      options: [
        { label: 'Under $15,000', value: 15000 },
        { label: '$15,000 - $25,000', value: 25000 },
        { label: '$25,000 - $40,000', value: 40000 },
        { label: '$40,000 - $60,000', value: 60000 },
        { label: 'Over $60,000', value: 75000 }
      ]
    },
    {
      question: "How many guests are you expecting?",
      key: 'guestCount' as keyof StyleProfile,
      options: [
        { label: 'Intimate (Under 50)', value: 40 },
        { label: 'Small (50-100)', value: 75 },
        { label: 'Medium (100-150)', value: 125 },
        { label: 'Large (150-200)', value: 175 },
        { label: 'Very Large (200+)', value: 250 }
      ]
    }
  ];

  const handleAnswer = async (answer: any) => {
    const question = questions[currentStep];
    const updatedAnswers = { ...answers, [question.key]: answer };
    setAnswers(updatedAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete the quiz and enhance with AI
      setIsGeneratingProfile(true);
      
      try {
        // Create the basic style profile
        const styleProfile = updatedAnswers as StyleProfile;
        styleProfile[question.key] = answer;
        
        // Enhance with AI-generated insights
        const enhancedProfile = await generateVisionBoard({
          aesthetic: styleProfile.style,
          venue: styleProfile.venue,
          colors: styleProfile.colors,
          season: styleProfile.season
        });

        // Merge AI insights with user preferences
        const finalProfile = {
          ...styleProfile,
          aiInsights: enhancedProfile
        };
        
        const updatedUser = {
          ...state.user!,
          styleProfile: finalProfile
        };
        
        dispatch({ type: 'SET_USER', payload: updatedUser });
        dispatch({ type: 'SET_CURRENT_PAGE', payload: 'dashboard' });
      } catch (error) {
        console.error('Failed to enhance profile with AI:', error);
        // Fallback to basic profile without AI enhancement
        const updatedUser = {
          ...state.user!,
          styleProfile: updatedAnswers as StyleProfile
        };
        
        dispatch({ type: 'SET_USER', payload: updatedUser });
        dispatch({ type: 'SET_CURRENT_PAGE', payload: 'dashboard' });
      } finally {
        setIsGeneratingProfile(false);
      }
    }
  };

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  if (isGeneratingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-6"></div>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-6 w-6 text-purple-500" />
              <h3 className="text-xl font-semibold text-gray-800">Creating Your Style Profile</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Our AI is analyzing your preferences and generating personalized recommendations...
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• Curating color palettes</p>
              <p>• Finding venue inspiration</p>
              <p>• Selecting design elements</p>
              <p>• Generating style keywords</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : dispatch({ type: 'SET_CURRENT_PAGE', payload: 'signup' })}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-primary-500" />
                <span className="text-lg font-serif font-semibold text-gray-800">Style Quiz</span>
              </div>
              <div className="text-sm text-gray-500">
                {currentStep + 1} of {questions.length}
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className="bg-gradient-to-r from-primary-500 to-sage-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">
              {currentQuestion.question}
            </h2>
            <p className="text-gray-600">Choose the option that best represents your vision</p>
          </div>

          <div className="grid gap-4">
            {currentQuestion.options.map((option, index) => {
              const isObject = typeof option === 'object' && !Array.isArray(option);
              const isArray = Array.isArray(option);
              const displayText = isObject ? option.label : isArray ? option.join(' & ') : option;
              const value = isObject ? option.value : option;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(value)}
                  className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800 font-medium">{displayText}</span>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}