import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, Users, TrendingUp, Bell, Calendar, Plus, Download, MessageCircle, Search, Filter, Eye, Mail, Phone } from 'lucide-react';
import Header from '../Layout/Header';

// Import your existing mockData here

const Dashboard = () => {
  // Your existing state declarations and helper functions here

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-500/10 to-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <Header notificationCount={interventionAlerts} />
      
      {/* Navigation */}
      <nav className="fixed top-20 left-0 right-0 z-30 backdrop-blur-xl bg-slate-800/50 border-b border-slate-600">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between">
            <div className="flex space-x-6">
              {[
                { key: 'overview', label: 'Overview', icon: Users },
                { key: 'students', label: 'Students', icon: Users },
                { key: 'analytics', label: 'Analytics', icon: TrendingUp },
                { key: 'predictions', label: 'Predictions', icon: AlertTriangle }
              ].map(({ key, label, icon: Icon }) => (
                <button 
                  key={key} 
                  onClick={() => setSelectedTab(key)} 
                  className={`flex items-center space-x-2 py-2 px-4 font-medium text-sm rounded-lg transition-all duration-300 
                    ${selectedTab === key 
                      ? 'bg-white/20 text-white transform scale-105' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Search and Filter */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 bg-slate-800/50 border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-white placeholder-slate-400"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              </div>
              
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="bg-slate-800/50 border border-slate-600 rounded-lg py-2 px-4 text-white"
              >
                <option value="all">All Risk Levels</option>
                <option value="high">High Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Low Risk</option>
              </select>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-48 pb-12">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard
              title="Total Students"
              value={totalStudents}
              icon={Users}
              color="#10B981"
              subtitle="Active enrollments"
            />
            <StatCard
              title="High Risk"
              value={highRiskStudents}
              icon={AlertTriangle}
              color="#EF4444"
              subtitle="Need attention"
            />
            <StatCard
              title="Avg Attendance"
              value={`${avgAttendance}%`}
              icon={Calendar}
              color="#3B82F6"
              subtitle="Across all students"
            />
            <StatCard
              title="Alerts"
              value={interventionAlerts}
              icon={Bell}
              color="#F59E0B"
              subtitle="Active notifications"
            />
          </div>

          {/* Add Student Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddStudentModal(true)}
              className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Student</span>
            </button>
          </div>

          {/* Students Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredStudents.map(student => (
              <StudentCard
                key={student.id}
                student={student}
                onClick={student => {
                  setSelectedStudent(student);
                  setShowStudentModal(true);
                }}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;