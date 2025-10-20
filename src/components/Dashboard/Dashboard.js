import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, Users, TrendingUp, Bell, Calendar, Plus, Download, MessageCircle, Search, Filter, Eye, Mail, Phone } from 'lucide-react';

// Import mock data directly (inline for simplicity)
const mockStudentData = [
  { id: 'BBCO22122', name: 'John Doe', email: 'john.doe@college.edu', phone: '+91-9876543210', attendance: 75, avgGrade: 82, behavioralScore: 7, riskScore: 0.3, status: 'Low Risk', lastActivity: '2 hours ago' },
  { id: 'BBCO22120', name: 'Jane Smith', email: 'jane.smith@college.edu', phone: '+91-9876543211', attendance: 45, avgGrade: 65, behavioralScore: 4, riskScore: 0.8, status: 'High Risk', lastActivity: '5 days ago' },
  { id: 'BBCO22129', name: 'Mike Johnson', email: 'mike.johnson@college.edu', phone: '+91-9876543212', attendance: 85, avgGrade: 88, behavioralScore: 8, riskScore: 0.2, status: 'Low Risk', lastActivity: '1 hour ago' },
  { id: 'BBCO22132', name: 'Sarah Wilson', email: 'sarah.wilson@college.edu', phone: '+91-9876543213', attendance: 60, avgGrade: 70, behavioralScore: 5, riskScore: 0.6, status: 'Medium Risk', lastActivity: '1 day ago' },
  { id: 'BBCO22135', name: 'Tom Brown', email: 'tom.brown@college.edu', phone: '+91-9876543214', attendance: 40, avgGrade: 55, behavioralScore: 3, riskScore: 0.9, status: 'High Risk', lastActivity: '3 days ago' },
];

const monthlyTrendData = [
  { month: 'Jan', dropoutRate: 5.2, predictions: 6.1, interventions: 12 },
  { month: 'Feb', dropoutRate: 4.8, predictions: 5.5, interventions: 15 },
  { month: 'Mar', dropoutRate: 6.1, predictions: 6.8, interventions: 18 },
  { month: 'Apr', dropoutRate: 5.5, predictions: 5.9, interventions: 14 },
  { month: 'May', dropoutRate: 4.2, predictions: 4.8, interventions: 11 },
  { month: 'Jun', dropoutRate: 3.9, predictions: 4.2, interventions: 9 },
];

const riskDistribution = [
  { name: 'Low Risk', value: 45, color: '#10B981' },
  { name: 'Medium Risk', value: 30, color: '#F59E0B' },
  { name: 'High Risk', value: 25, color: '#EF4444' },
];

// Prediction function
const predictDropoutRisk = (attendance, avgGrade, behavioralScore) => {
  const attendanceWeight = 0.4;
  const gradeWeight = 0.35;
  const behavioralWeight = 0.25;
  
  const attendanceRisk = (100 - attendance) / 100;
  const gradeRisk = (100 - avgGrade) / 100;
  const behavioralRisk = (10 - behavioralScore) / 10;
  
  const riskScore = (attendanceRisk * attendanceWeight + gradeRisk * gradeWeight + behavioralRisk * behavioralWeight);
  return Math.min(riskScore, 1);
};

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [students, setStudents] = useState(mockStudentData);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [newStudent, setNewStudent] = useState({
    name: '', email: '', phone: '', attendance: '', avgGrade: '', behavioralScore: ''
  });

  const totalStudents = students.length;
  const highRiskStudents = students.filter(s => s.riskScore >= 0.7).length;
  const avgAttendance = (students.reduce((sum, s) => sum + s.attendance, 0) / totalStudents).toFixed(1);
  const interventionAlerts = students.filter(s => s.riskScore >= 0.6).length;

  const addStudent = () => {
    if (newStudent.name && newStudent.attendance && newStudent.avgGrade && newStudent.behavioralScore) {
      const attendance = parseInt(newStudent.attendance);
      const avgGrade = parseInt(newStudent.avgGrade);
      const behavioralScore = parseInt(newStudent.behavioralScore);
      
      const riskScore = predictDropoutRisk(attendance, avgGrade, behavioralScore);
      let status = 'Low Risk';
      if (riskScore >= 0.7) status = 'High Risk';
      else if (riskScore >= 0.4) status = 'Medium Risk';
      
      const student = {
        id: `STUD${Date.now()}`,
        name: newStudent.name,
        email: newStudent.email,
        phone: newStudent.phone,
        attendance, avgGrade, behavioralScore, riskScore, status,
        lastActivity: 'Just added'
      };
      
      setStudents([...students, student]);
      setNewStudent({ name: '', email: '', phone: '', attendance: '', avgGrade: '', behavioralScore: '' });
      setShowAddStudentModal(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRisk === 'all' || student.status.toLowerCase().includes(filterRisk.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const getRiskColor = (riskScore) => {
    if (riskScore >= 0.7) return '#EF4444';
    if (riskScore >= 0.4) return '#F59E0B';
    return '#10B981';
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend, onClick }) => (
    <div onClick={onClick} className="group backdrop-blur-xl bg-white/10 rounded-2xl shadow-xl p-6 border border-white/20 cursor-pointer hover:bg-white/20 hover:scale-105 transform transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-200">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {subtitle && <p className="text-xs text-gray-300 mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-sm text-green-400">{trend}</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}30` }}>
          <Icon className="h-8 w-8" style={{ color }} />
        </div>
      </div>
    </div>
  );

  const StudentCard = ({ student, onClick }) => (
    <div onClick={() => onClick(student)} className="group backdrop-blur-xl bg-white/10 rounded-2xl shadow-xl p-6 border border-white/20 cursor-pointer hover:bg-white/20 hover:scale-105 transform transition-all duration-300" style={{ borderLeft: `4px solid ${getRiskColor(student.riskScore)}` }}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-white text-lg">{student.name}</h3>
          <p className="text-sm text-gray-300">{student.id}</p>
          <p className="text-xs text-gray-400 mt-1">Last seen: {student.lastActivity}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="px-3 py-1 rounded-full text-xs font-medium text-white shadow-lg" style={{ backgroundColor: getRiskColor(student.riskScore) }}>
            {student.status}
          </span>
          <div className="flex space-x-1 mt-2">
            <button className="p-1 rounded-full bg-blue-500/30 hover:bg-blue-500/50 transition-colors">
              <Eye className="h-3 w-3 text-blue-300" />
            </button>
            <button className="p-1 rounded-full bg-green-500/30 hover:bg-green-500/50 transition-colors">
              <Mail className="h-3 w-3 text-green-300" />
            </button>
            <button className="p-1 rounded-full bg-purple-500/30 hover:bg-purple-500/50 transition-colors">
              <Phone className="h-3 w-3 text-purple-300" />
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="backdrop-blur-lg bg-white/20 rounded-xl p-3">
          <p className="text-gray-300 font-medium">Attendance</p>
          <p className="font-bold text-lg text-white">{student.attendance}%</p>
        </div>
        <div className="backdrop-blur-lg bg-white/20 rounded-xl p-3">
          <p className="text-gray-300 font-medium">Avg Grade</p>
          <p className="font-bold text-lg text-white">{student.avgGrade}%</p>
        </div>
        <div className="backdrop-blur-lg bg-white/20 rounded-xl p-3">
          <p className="text-gray-300 font-medium">Behavioral</p>
          <p className="font-bold text-lg text-white">{student.behavioralScore}/10</p>
        </div>
        <div className="backdrop-blur-lg bg-white/20 rounded-xl p-3">
          <p className="text-gray-300 font-medium">Risk Score</p>
          <p className="font-bold text-lg text-white">{(student.riskScore * 100).toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">SmartEduMine</h1>
              <p className="text-sm text-white/80">Academic Performance Analyzer & Dropout Risk Predictor</p>
            </div>
            <div className="flex items-center space-x-6">
              <button className="relative p-3 rounded-xl backdrop-blur-lg bg-white/20 hover:bg-white/30 transition-all">
                <Bell className="h-6 w-6 text-white" />
                <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">{interventionAlerts}</span>
              </button>
              <div className="flex items-center space-x-3 backdrop-blur-lg bg-white/20 rounded-xl px-4 py-2">
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

      {/* Navigation */}
      <nav className="relative backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {[
              { key: 'overview', label: 'Overview', icon: Users },
              { key: 'students', label: 'Students', icon: Users },
              { key: 'analytics', label: 'Analytics', icon: TrendingUp },
              { key: 'predictions', label: 'Predictions', icon: AlertTriangle }
            ].map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setSelectedTab(key)} className={`flex items-center space-x-2 py-4 px-6 font-medium text-sm rounded-t-xl transition-all duration-300 ${selectedTab === key ? 'bg-white/20 text-white border-b-2 border-white transform scale-105' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Students" value={totalStudents} icon={Users} color="#3B82F6" subtitle="Active enrollments" trend="+12% this month" onClick={() => setSelectedTab('students')} />
              <StatCard title="High Risk Students" value={highRiskStudents} icon={AlertTriangle} color="#EF4444" subtitle="Require attention" trend="-8% from last month" onClick={() => setSelectedTab('predictions')} />
              <StatCard title="Average Attendance" value={`${avgAttendance}%`} icon={Calendar} color="#10B981" subtitle="Across all students" trend="+5% improvement" />
              <StatCard title="Intervention Alerts" value={interventionAlerts} icon={Bell} color="#F59E0B" subtitle="Active notifications" trend="3 new today" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-8 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6">Dropout Trends & DMSW Predictions</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.8)" />
                    <YAxis stroke="rgba(255,255,255,0.8)" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="dropoutRate" stroke="#EF4444" strokeWidth={3} name="Actual" />
                    <Line type="monotone" dataKey="predictions" stroke="#3B82F6" strokeWidth={3} name="DMSW" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-8 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6">Risk Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={riskDistribution} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} dataKey="value">
                      {riskDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button onClick={() => setShowAddStudentModal(true)} className="flex items-center justify-center space-x-3 p-6 backdrop-blur-lg bg-white/20 rounded-2xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105 text-white font-medium">
                  <Plus className="h-6 w-6" />
                  <span>Add New Student</span>
                </button>
                <button className="flex items-center justify-center space-x-3 p-6 backdrop-blur-lg bg-white/20 rounded-2xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105 text-white font-medium">
                  <Download className="h-6 w-6" />
                  <span>Export Report</span>
                </button>
                <button className="flex items-center justify-center space-x-3 p-6 backdrop-blur-lg bg-white/20 rounded-2xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105 text-white font-medium">
                  <MessageCircle className="h-6 w-6" />
                  <span>Bulk Messages</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'students' && (
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-6 border border-white/20">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                    <input type="text" placeholder="Search students..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 backdrop-blur-lg bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/60" />
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                    <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)} className="pl-10 pr-8 py-3 backdrop-blur-lg bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white">
                      <option value="all">All Risk Levels</option>
                      <option value="low">Low Risk</option>
                      <option value="medium">Medium Risk</option>
                      <option value="high">High Risk</option>
                    </select>
                  </div>
                </div>
                <button onClick={() => setShowAddStudentModal(true)} className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Add Student</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <StudentCard key={student.id} student={student} onClick={(s) => { setSelectedStudent(s); setShowStudentModal(true); }} />
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'analytics' && (
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">Student Performance Analytics</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={students}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.8)" />
                  <YAxis stroke="rgba(255,255,255,0.8)" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="attendance" fill="#3B82F6" name="Attendance %" />
                  <Bar dataKey="avgGrade" fill="#10B981" name="Avg Grade %" />
                  <Bar dataKey="behavioralScore" fill="#F59E0B" name="Behavioral" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">DMSW Model Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="backdrop-blur-lg bg-white/20 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2">94.5%</div>
                  <div className="text-sm text-white/80">Prediction Accuracy</div>
                </div>
                <div className="backdrop-blur-lg bg-white/20 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">15%</div>
                  <div className="text-sm text-white/80">Improvement</div>
                </div>
                <div className="backdrop-blur-lg bg-white/20 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold text-purple-400 mb-2">0.89</div>
                  <div className="text-sm text-white/80">F1-Score</div>
                </div>
                <div className="backdrop-blur-lg bg-white/20 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold text-yellow-400 mb-2">87</div>
                  <div className="text-sm text-white/80">Students Helped</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'predictions' && (
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="p-8">
              <h3 className="text-xl font-bold text-white mb-6">Risk Prediction Results</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="backdrop-blur-lg bg-white/20 border-b border-white/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white">Student</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white">Attendance</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white">Grade</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white">Behavioral</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white">Risk Score</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-white/5 transition-all duration-200 cursor-pointer" onClick={() => { setSelectedStudent(student); setShowStudentModal(true); }}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">{student.name}</div>
                        <div className="text-xs text-white/60">{student.id}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">{student.attendance}%</td>
                      <td className="px-6 py-4 text-sm text-white">{student.avgGrade}%</td>
                      <td className="px-6 py-4 text-sm text-white">{student.behavioralScore}/10</td>
                      <td className="px-6 py-4 text-sm font-bold text-white">{(student.riskScore * 100).toFixed(1)}%</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${student.riskScore >= 0.7 ? 'bg-red-500/20 text-red-300' : student.riskScore >= 0.4 ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'}`}>
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/30" onClick={() => setShowAddStudentModal(false)} />
          <div className="relative max-w-2xl w-full backdrop-blur-2xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/20">
              <h2 className="text-2xl font-bold text-white">Add New Student</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Student Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} className="px-4 py-3 rounded-xl backdrop-blur-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/60" />
                <input type="email" placeholder="Email" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} className="px-4 py-3 rounded-xl backdrop-blur-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/60" />
                <input type="tel" placeholder="Phone" value={newStudent.phone} onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })} className="px-4 py-3 rounded-xl backdrop-blur-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/60" />
                <input type="number" placeholder="Attendance %" value={newStudent.attendance} onChange={(e) => setNewStudent({ ...newStudent, attendance: e.target.value })} className="px-4 py-3 rounded-xl backdrop-blur-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/60" />
                <input type="number" placeholder="Avg Grade %" value={newStudent.avgGrade} onChange={(e) => setNewStudent({ ...newStudent, avgGrade: e.target.value })} className="px-4 py-3 rounded-xl backdrop-blur-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/60" />
                <input type="number" placeholder="Behavioral Score (1-10)" value={newStudent.behavioralScore} onChange={(e) => setNewStudent({ ...newStudent, behavioralScore: e.target.value })} className="px-4 py-3 rounded-xl backdrop-blur-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/60" />
              </div>
              <div className="flex justify-end space-x-4">
                <button onClick={() => setShowAddStudentModal(false)} className="px-6 py-3 backdrop-blur-lg bg-white/20 text-white rounded-xl font-medium hover:bg-white/30 transition-all duration-300">
                  Cancel
                </button>
                <button onClick={addStudent} className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Add Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/30" onClick={() => setShowStudentModal(false)} />
          <div className="relative max-w-4xl w-full backdrop-blur-2xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/20 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Student Details</h2>
              <button onClick={() => setShowStudentModal(false)} className="p-2 rounded-full hover:bg-white/20 transition-colors text-white">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="backdrop-blur-lg bg-white/20 rounded-2xl p-6 border border-white/30">
                  <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-300">Name</label>
                      <p className="text-white">{selectedStudent.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300">Student ID</label>
                      <p className="text-white">{selectedStudent.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300">Email</label>
                      <p className="text-white">{selectedStudent.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300">Phone</label>
                      <p className="text-white">{selectedStudent.phone}</p>
                    </div>
                  </div>
                </div>
                
                <div className="backdrop-blur-lg bg-white/20 rounded-2xl p-6 border border-white/30">
                  <h3 className="text-lg font-semibold text-white mb-4">Academic Performance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/30 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-white">{selectedStudent.attendance}%</p>
                      <p className="text-sm text-gray-300">Attendance</p>
                    </div>
                    <div className="bg-white/30 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-white">{selectedStudent.avgGrade}%</p>
                      <p className="text-sm text-gray-300">Average Grade</p>
                    </div>
                    <div className="bg-white/30 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-white">{selectedStudent.behavioralScore}/10</p>
                      <p className="text-sm text-gray-300">Behavioral</p>
                    </div>
                    <div className="bg-white/30 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-white">{(selectedStudent.riskScore * 100).toFixed(1)}%</p>
                      <p className="text-sm text-gray-300">Risk Score</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Send Message</span>
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Call Student</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;