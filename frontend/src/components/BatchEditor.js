import React, { useState } from 'react';
import { X, ArrowRight, Users, Check } from 'lucide-react';
import { moveStudent } from '../api';

function BatchEditor({ schedule, allSchedules, onClose, onUpdate }) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [targetSchedule, setTargetSchedule] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleMoveStudent = async () => {
    if (!selectedStudent || !targetSchedule) {
      setMessage({ type: 'error', text: 'Please select a student and target batch' });
      return;
    }

    try {
      setLoading(true);
      await moveStudent({
        student_reg_no: selectedStudent,
        from_schedule_id: schedule.schedule_id,
        to_schedule_id: parseInt(targetSchedule)
      });
      
      setMessage({ type: 'success', text: 'Student moved successfully!' });
      setTimeout(() => {
        onUpdate();
        onClose();
      }, 1000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.detail || 'Failed to move student. Check for collision.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter out current schedule from target options
  const availableSchedules = allSchedules.filter(s => s.schedule_id !== schedule.schedule_id);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 scale-in">
      <div className="glass rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto card-hover">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-8 py-6 flex items-center justify-between overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-pink-400/20 animate-pulse"></div>
          <div className="relative flex items-center space-x-4">
            <div className="bg-white/30 backdrop-blur p-3 rounded-2xl shadow-lg">
              <Users className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white neon-glow">Edit Batch</h3>
          </div>
          <button
            onClick={onClose}
            className="relative text-white hover:bg-white hover:bg-opacity-30 rounded-xl p-3 transition-all duration-300 transform hover:scale-110 hover:rotate-90 shadow-lg"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Current Batch Info */}
          <div className="relative overflow-hidden rounded-2xl fade-in-up">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-bold text-gray-900">Current Batch</h4>
                <span className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold rounded-full shadow-lg">
                  {schedule.time_slot}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-700 font-semibold">Date:</span>
                  <span className="ml-2 font-bold text-gray-900">{schedule.date}</span>
                </div>
                <div>
                  <span className="text-gray-700 font-semibold">Total Students:</span>
                  <span className="ml-2 font-bold text-gray-900">{schedule.total_students}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-700 font-semibold">Subject:</span>
                  <span className="ml-2 font-bold text-gray-900">{schedule.subject_code} - {schedule.subject_name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Student Selection */}
          <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
            <label className="block text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Select Student to Move
            </label>
            <select
              value={selectedStudent || ''}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-5 py-4 bg-white/80 backdrop-blur border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 font-medium shadow-lg"
            >
              <option value="">Choose a student...</option>
              {schedule.students.map((student) => (
                <option key={student.reg_no} value={student.reg_no}>
                  {student.reg_no} - {student.name} ({student.branch})
                </option>
              ))}
            </select>
          </div>

          {/* Arrow Indicator */}
          {selectedStudent && (
            <div className="flex justify-center scale-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-xl opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-green-400 to-emerald-500 p-4 rounded-full shadow-2xl float-animation">
                  <ArrowRight className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          )}

          {/* Target Batch Selection */}
          <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
            <label className="block text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-purple-600" />
              Move to Batch
            </label>
            <select
              value={targetSchedule}
              onChange={(e) => setTargetSchedule(e.target.value)}
              disabled={!selectedStudent}
              className="w-full px-5 py-4 bg-white/80 backdrop-blur border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select target batch...</option>
              {availableSchedules.map((sched) => (
                <option key={sched.schedule_id} value={sched.schedule_id}>
                  {sched.time_slot} - {sched.date} ({sched.total_students} students)
                </option>
              ))}
            </select>
            {!selectedStudent && (
              <p className="text-sm text-gray-600 mt-3 font-medium">
                ⚠️ Please select a student first
              </p>
            )}
          </div>

          {/* Message */}
          {message.text && (
            <div className={`p-5 rounded-2xl shadow-xl scale-in ${
              message.type === 'success' 
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' 
                : 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
            }`}>
              <p className="font-bold text-lg">{message.text}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t-2 border-gray-200">
            <button
              onClick={onClose}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg ripple"
            >
              Cancel
            </button>
            <button
              onClick={handleMoveStudent}
              disabled={!selectedStudent || !targetSchedule || loading}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl ripple pulse-btn"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Moving...</span>
                </>
              ) : (
                <>
                  <Check className="h-6 w-6" />
                  <span>Move Student</span>
                </>
              )}
            </button>
          </div>

          {/* Info Box */}
          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 rounded-2xl p-5 shadow-lg">
              <p className="text-sm text-yellow-900 font-semibold">
                <strong className="text-base">⚠️ Note:</strong> The system will prevent moving a student if it creates a scheduling collision 
                (student already scheduled for another exam at the same time).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BatchEditor;
