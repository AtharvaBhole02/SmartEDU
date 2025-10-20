import React from 'react';
import { Bell, Settings } from 'lucide-react';

const Header = ({ interventionAlerts }) => {
  return (
    <header className="relative glass-strong border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow-lg text-shadow">
              SmartEduMine
            </h1>
            <p className="text-sm text-white/80">
              Academic Performance Analyzer & Dropout Risk Predictor
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <button className="relative p-3 rounded-xl glass hover:bg-white/20 transition-all duration-300 transform hover:scale-110">
              <Bell className="h-6 w-6 text-white" />
              {interventionAlerts > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                  {interventionAlerts}
                </span>
              )}
            </button>
            <button className="p-3 rounded-xl glass hover:bg-white/20 transition-all duration-300 transform hover:scale-110">
              <Settings className="h-6 w-6 text-white" />
            </button>
            <div className="flex items-center space-x-3 glass rounded-xl px-4 py-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">MA</span>
              </div>
              <div>
                <span className="text-white font-medium">Mrs. Mohini Avatade</span>
                <p className="text-white/80 text-xs">Academic Coordinator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;