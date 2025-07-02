import React, { useState, useRef, useEffect } from 'react';
import { Heart, ArrowLeft, Send, Bot, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChatMessage } from '../../types';

export default function ChatPage() {
  const { state, dispatch } = useApp();
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.chatMessages]);

  useEffect(() => {
    // Add welcome message if no messages exist
    if (state.chatMessages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        message: `Hi ${state.user?.name}! I'm your AI wedding planning assistant. I can help you with vendor recommendations, timeline planning, budget advice, and answer any wedding-related questions you might have. What would you like to know?`,
        sender: 'ai',
        timestamp: new Date()
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: welcomeMessage });
    }
  }, [dispatch, state.chatMessages.length, state.user?.name]);

  const getAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
      return `Based on your style profile, here are some budget tips: For a ${state.user?.styleProfile?.style} wedding with ${state.user?.styleProfile?.guestCount} guests, I recommend allocating 40% to venue, 25% to catering, and 12% to photography. Would you like specific vendor recommendations within your budget range?`;
    }
    
    if (lowerMessage.includes('vendor') || lowerMessage.includes('photographer') || lowerMessage.includes('caterer')) {
      return `For your ${state.user?.styleProfile?.style} style wedding, I recommend looking for vendors who specialize in that aesthetic. Based on your ${state.user?.styleProfile?.season} wedding date and ${state.user?.styleProfile?.venue} venue, here are some questions to ask potential vendors: availability, pricing packages, what's included, and portfolio examples matching your style.`;
    }
    
    if (lowerMessage.includes('timeline') || lowerMessage.includes('when') || lowerMessage.includes('schedule')) {
      return `Here's a general timeline: Book your venue 10-12 months ahead, photographer 8-10 months, dress shopping 6-8 months, send invitations 6-8 weeks before, and final details 2-4 weeks prior. Would you like me to create a personalized timeline based on your wedding date?`;
    }
    
    if (lowerMessage.includes('dress') || lowerMessage.includes('attire') || lowerMessage.includes('outfit')) {
      return `For a ${state.user?.styleProfile?.style} wedding, consider styles that complement your theme. With your ${state.user?.styleProfile?.colors?.join(' and ')} color palette, you'll want to ensure your dress fits the overall aesthetic. I recommend starting dress shopping 6-8 months before your wedding to allow time for alterations.`;
    }
    
    if (lowerMessage.includes('flowers') || lowerMessage.includes('decoration') || lowerMessage.includes('decor')) {
      return `Your ${state.user?.styleProfile?.colors?.join(' and ')} color palette will work beautifully for a ${state.user?.styleProfile?.season} wedding! For ${state.user?.styleProfile?.style} style, consider flowers that match the season and venue. I can help you create a mood board and find local florists who specialize in your style.`;
    }
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed') || lowerMessage.includes('help')) {
      return `Wedding planning can feel overwhelming, but you're doing great! Break things down into smaller tasks, delegate when possible, and remember that the most important thing is celebrating your love. Use your checklist to stay organized, and don't hesitate to ask for help from friends and family.`;
    }
    
    // Default response
    return `That's a great question! As your AI wedding assistant, I'm here to help with all aspects of your ${state.user?.styleProfile?.style} wedding planning. I can provide advice on budgeting, vendor selection, timelines, and more. Could you be more specific about what you'd like help with?`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage });

    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: getAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date()
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: aiResponse });
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 flex flex-col">
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
              <span className="text-2xl font-serif font-semibold text-gray-800">AI Wedding Assistant</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 flex flex-col">
        <div className="bg-white rounded-2xl shadow-lg flex-1 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-primary-500 to-sage-400 px-6 py-4">
            <div className="flex items-center space-x-3">
              <Bot className="h-8 w-8 text-white" />
              <div>
                <h3 className="text-xl font-semibold text-white">Wedding Planning Assistant</h3>
                <p className="text-primary-100 text-sm">Ask me anything about your wedding!</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {state.chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md p-4 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'ai' && (
                      <Bot className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                    )}
                    {message.sender === 'user' && (
                      <User className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="leading-relaxed">{message.message}</p>
                      <p
                        className={`text-xs mt-2 ${
                          message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-4 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-primary-500" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex space-x-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about budgets, vendors, timelines, or anything wedding-related..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-primary-500 text-white p-3 rounded-full hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}