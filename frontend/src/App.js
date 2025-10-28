import React, { useState, useEffect } from 'react';
import { Calendar, Users, BookOpen, LayoutDashboard, Sparkles, Zap } from 'lucide-react';
import StudentManager from './components/StudentManager';
import ExamManager from './components/ExamManager';
import ScheduleGenerator from './components/ScheduleGenerator';
import ScheduleViewer from './components/ScheduleViewer';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', name: 'Students', icon: Users },
    { id: 'exams', name: 'Exams', icon: BookOpen },
    { id: 'schedule', name: 'Generate Schedule', icon: Calendar },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className={`glass sticky top-0 z-50 transition-all duration-500 ${
        scrolled ? 'shadow-2xl backdrop-blur-xl' : 'shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between fade-in-up">
            <div className="flex items-center space-x-4">
              <div className="relative float-animation">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4 rounded-2xl shadow-2xl transform hover:scale-110 transition-all duration-300">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Lab Exam Scheduler
                </h1>
                <p className="text-sm text-gray-700 mt-1 flex items-center gap-2">
                  <Zap className="h-3 w-3 text-yellow-500" />
                  Conflict-free scheduling made easy
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="glass-dark sticky top-[104px] z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 py-3">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className={`slide-in-left flex items-center space-x-2 px-6 py-3 font-semibold text-sm rounded-xl transition-all duration-300 transform hover:scale-105 ripple ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl'
                      : 'text-white hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${
                    activeTab === tab.id ? 'animate-bounce' : ''
                  }`} />
                  <span>{tab.name}</span>
                  {activeTab === tab.id && (
                    <span className="ml-2 w-2 h-2 bg-white rounded-full animate-ping"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in-up">
        <div className="scale-in">
          {activeTab === 'dashboard' && <ScheduleViewer />}
          {activeTab === 'students' && <StudentManager />}
          {activeTab === 'exams' && <ExamManager />}
          {activeTab === 'schedule' && <ScheduleGenerator />}
        </div>
      </main>

      {/* Footer */}
      <footer className="glass mt-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Sparkles className="h-5 w-5 text-purple-600 animate-spin" />
              <p className="text-lg font-semibold gradient-text">
                Lab Exam Scheduler
              </p>
              <Sparkles className="h-5 w-5 text-blue-600 animate-spin" style={{ animationDirection: 'reverse' }} />
            </div>
            <p className="text-sm text-gray-600">
              Built with React, Tailwind CSS, and FastAPI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
