import React from 'react';
import { User, Mail, Phone, BookOpen, Calendar } from 'lucide-react';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <main className="relative pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-xl p-8 border border-white/20">
            <div className="flex items-center justify-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-xl">
                <span className="text-white text-4xl font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 backdrop-blur-lg bg-white/10 rounded-xl">
                <User className="h-6 w-6 text-white opacity-75" />
                <div>
                  <p className="text-sm text-white/60">Full Name</p>
                  <p className="text-lg text-white font-medium">{user.name || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 backdrop-blur-lg bg-white/10 rounded-xl">
                <Mail className="h-6 w-6 text-white opacity-75" />
                <div>
                  <p className="text-sm text-white/60">Email Address</p>
                  <p className="text-lg text-white font-medium">{user.email || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 backdrop-blur-lg bg-white/10 rounded-xl">
                <BookOpen className="h-6 w-6 text-white opacity-75" />
                <div>
                  <p className="text-sm text-white/60">Role</p>
                  <p className="text-lg text-white font-medium capitalize">{user.role || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 backdrop-blur-lg bg-white/10 rounded-xl">
                <Calendar className="h-6 w-6 text-white opacity-75" />
                <div>
                  <p className="text-sm text-white/60">Joined Date</p>
                  <p className="text-lg text-white font-medium">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;