import React, { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import StudentCard from '../UI/StudentCard';
import Modal from '../UI/Modal';
import AddStudentForm from './AddStudentForm';
import StudentDetailModal from './StudentDetailModal';

const StudentsList = ({ students, setStudents, searchTerm, setSearchTerm, filterRisk, setFilterRisk }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRisk === 'all' || student.status.toLowerCase().includes(filterRisk.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="glass-strong rounded-2xl shadow-2xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 glass border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/60"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="pl-10 pr-8 py-3 glass border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-transparent"
              >
                <option value="all" className="bg-gray-800">All Risk Levels</option>
                <option value="low" className="bg-gray-800">Low Risk</option>
                <option value="medium" className="bg-gray-800">Medium Risk</option>
                <option value="high" className="bg-gray-800">High Risk</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <StudentCard 
            key={student.id} 
            student={student} 
            onClick={handleStudentClick}
          />
        ))}
      </div>

      {/* No results message */}
      {filteredStudents.length === 0 && (
        <div className="glass-strong rounded-2xl p-12 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">No students found</h3>
          <p className="text-white/70">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Add Student Modal */}
      <Modal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Student"
      >
        <AddStudentForm
          students={students}
          setStudents={setStudents}
          onClose={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <StudentDetailModal
          show={showDetailModal}
          student={selectedStudent}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  );
};

export default StudentsList;