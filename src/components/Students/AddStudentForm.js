import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { predictDropoutRisk, categorizeRisk } from '../../utils/mlUtils';

const AddStudentForm = ({ students, setStudents, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    attendance: '',
    avgGrade: '',
    behavioralScore: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    
    const attendance = parseInt(formData.attendance);
    if (!formData.attendance || attendance < 0 || attendance > 100) {
      newErrors.attendance = 'Attendance must be between 0-100';
    }
    
    const avgGrade = parseInt(formData.avgGrade);
    if (!formData.avgGrade || avgGrade < 0 || avgGrade > 100) {
      newErrors.avgGrade = 'Grade must be between 0-100';
    }
    
    const behavioralScore = parseInt(formData.behavioralScore);
    if (!formData.behavioralScore || behavioralScore < 1 || behavioralScore > 10) {
      newErrors.behavioralScore = 'Behavioral score must be between 1-10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const attendance = parseInt(formData.attendance);
      const avgGrade = parseInt(formData.avgGrade);
      const behavioralScore = parseInt(formData.behavioralScore);
      
      const riskScore = predictDropoutRisk(attendance, avgGrade, behavioralScore);
      const { level: status } = categorizeRisk(riskScore);
      
      const newStudent = {
        id: `STUD${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        attendance,
        avgGrade,
        behavioralScore,
        riskScore,
        status,
        lastActivity: 'Just added'
      };
      
      setStudents([...students, newStudent]);
      onClose();
      
      // Show success message (you could use a toast library here)
      console.log('Student added successfully:', newStudent);
      
    } catch (error) {
      console.error('Error adding student:', error);
      setErrors({ submit: 'Failed to add student. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Student Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl glass border ${
              errors.name ? 'border-red-400' : 'border-white/30'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/60`}
            placeholder="Enter student name"
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl glass border ${
              errors.email ? 'border-red-400' : 'border-white/30'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/60`}
            placeholder="student@college.edu"
          />
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Phone *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl glass border ${
              errors.phone ? 'border-red-400' : 'border-white/30'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/60`}
            placeholder="+91-9876543210"
          />
          {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Attendance % *
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.attendance}
            onChange={(e) => handleInputChange('attendance', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl glass border ${
              errors.attendance ? 'border-red-400' : 'border-white/30'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/60`}
            placeholder="85"
          />
          {errors.attendance && <p className="text-red-400 text-sm mt-1">{errors.attendance}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Average Grade % *
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.avgGrade}
            onChange={(e) => handleInputChange('avgGrade', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl glass border ${
              errors.avgGrade ? 'border-red-400' : 'border-white/30'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/60`}
            placeholder="78"
          />
          {errors.avgGrade && <p className="text-red-400 text-sm mt-1">{errors.avgGrade}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Behavioral Score (1-10) *
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.behavioralScore}
            onChange={(e) => handleInputChange('behavioralScore', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl glass border ${
              errors.behavioralScore ? 'border-red-400' : 'border-white/30'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/60`}
            placeholder="7"
          />
          {errors.behavioralScore && <p className="text-red-400 text-sm mt-1">{errors.behavioralScore}</p>}
        </div>
      </div>

      {errors.submit && (
        <div className="text-red-400 text-sm text-center">{errors.submit}</div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-6 py-3 glass text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 disabled:opacity-50 disabled:transform-none"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Adding...</span>
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" />
              <span>Add Student</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddStudentForm;