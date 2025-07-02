import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './components/LandingPage';
import SignupForm from './components/Auth/SignupForm';
import LoginForm from './components/Auth/LoginForm';
import StyleQuiz from './components/StyleQuiz';
import Dashboard from './components/Dashboard/Dashboard';
import PlanningPage from './components/Planning/PlanningPage';
import BudgetPage from './components/Budget/BudgetPage';
import ChatPage from './components/Chat/ChatPage';
import VisionBoardPage from './components/VisionBoard/VisionBoardPage';
import WebsitePage from './components/Website/WebsitePage';
import GeminiTest from './components/GeminiTest';

function AppContent() {
  const { state } = useApp();

  const renderPage = () => {
    switch (state.currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'signup':
        return <SignupForm />;
      case 'login':
        return <LoginForm />;
      case 'quiz':
        return <StyleQuiz />;
      case 'dashboard':
        return <Dashboard />;
      case 'planning':
        return <PlanningPage />;
      case 'budget':
        return <BudgetPage />;
      case 'chat':
        return <ChatPage />;
      case 'vision-board':
        return <VisionBoardPage />;
      case 'website':
        return <WebsitePage />;
      case 'gemini-test':
        return <GeminiTest />;
      default:
        return <LandingPage />;
    }
  };

  return <div className="app">{renderPage()}</div>;
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;