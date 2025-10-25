import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Settings, LogOut, User, AlertTriangle } from 'lucide-react';

const Header = ({ interventionAlerts, selectedTab, onTabChange }) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const user = JSON.parse(localStorage.getItem('user')) || null;

  return (
    <header className="fixed top-0 left-0 right-0 glass-strong border-b border-white/20 shadow-lg z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow-lg text-shadow">
              SmartEduMine
            </h1>
            
          </div>
          <div className="flex items-center space-x-6">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)} 
                className="relative p-3 rounded-xl glass hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
              >
                <Bell className="h-6 w-6 text-white" />
                {interventionAlerts > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                    {interventionAlerts}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <>
                  {/* Fullscreen translucent overlay to blur/dim background when notifications are open */}
                  <div
                    className="fixed inset-0 z-40 backdrop-blur-sm bg-black/20"
                    onClick={() => setShowNotifications(false)}
                  />

                  <div className="absolute right-0 mt-2 w-80 rounded-xl backdrop-blur-lg bg-white/6 border border-white/10 shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-white/10">
                      <h3 className="text-white font-medium">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {interventionAlerts > 0 ? (
                        Array(interventionAlerts).fill(0).map((_, i) => (
                          <div key={i} className="px-4 py-3 hover:bg-white/10 border-b border-white/5">
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <AlertTriangle className="h-5 w-5 text-amber-400" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm text-white">Student at risk detected</p>
                                <p className="text-xs text-white/60 mt-1">
                                  Student {i + 1} shows signs of potential dropout risk
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-center text-white/60 text-sm">
                          No new notifications
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Settings */}
            <button className="p-3 rounded-xl glass hover:bg-white/20 transition-all duration-300 transform hover:scale-110">
              <Settings className="h-6 w-6 text-white" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <div 
                className="flex items-center space-x-3 glass rounded-xl px-4 py-2 cursor-pointer"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">{user?.name || 'User'}</p>
                  <p className="text-white/70 text-sm capitalize">{user?.role || 'Guest'}</p>
                </div>
              </div>
              
              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl glass-strong border border-white/20 shadow-lg py-1 z-50">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/profile');
                    }}
                    className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/10 w-full text-left"
                  >
                    <User className="mr-3 h-5 w-5" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      navigate('/signin');
                    }}
                    className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/10 w-full text-left"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Tabs removed from header — tabs will be rendered in Dashboard as a separate floating section */}
        </div>
      </div>
    </header>
  );
};

export default Header;