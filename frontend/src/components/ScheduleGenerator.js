import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Plus, Trash2, Sparkles } from 'lucide-react';
import { getExams, generateSchedule } from '../api';

function ScheduleGenerator() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [date, setDate] = useState('');
  const [maxStudents, setMaxStudents] = useState(3);
  const [timeSlots, setTimeSlots] = useState([
    { slot_name: 'Slot 1', start_time: '09:30', end_time: '12:30' },
    { slot_name: 'Slot 2', start_time: '13:30', end_time: '16:30' }
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await getExams();
      setExams(response.data);
    } catch (error) {
      showMessage('error', 'Failed to fetch exams');
    }
  };

  const addTimeSlot = () => {
    setTimeSlots([
      ...timeSlots,
      { slot_name: `Slot ${timeSlots.length + 1}`, start_time: '', end_time: '' }
    ]);
  };

  const removeTimeSlot = (index) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (index, field, value) => {
    const newSlots = [...timeSlots];
    newSlots[index][field] = value;
    setTimeSlots(newSlots);
  };

  const handleGenerate = async () => {
    if (!selectedExam || !date || timeSlots.length === 0) {
      showMessage('error', 'Please fill all required fields');
      return;
    }

    // Validate time slots
    for (const slot of timeSlots) {
      if (!slot.start_time || !slot.end_time) {
        showMessage('error', 'Please complete all time slot fields');
        return;
      }
    }

    try {
      setLoading(true);
      const response = await generateSchedule({
        exam_id: parseInt(selectedExam),
        date: date,
        time_slots: timeSlots,
        max_students_per_batch: maxStudents
      });
      
      setResult(response.data);
      showMessage('success', `Generated ${response.data.schedules?.length || 0} schedule batches successfully!`);
    } catch (error) {
      showMessage('error', error.response?.data?.detail || 'Failed to generate schedule');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const selectedExamData = exams.find(e => e.exam_id === parseInt(selectedExam));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl shadow-2xl p-8 card-hover">
        <div className="flex items-center space-x-4">
          <div className="relative float-animation">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur-xl opacity-75 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-purple-500 to-indigo-600 p-4 rounded-2xl shadow-2xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">Schedule Generator</h2>
            <p className="text-gray-600 mt-1">Automatically create conflict-free exam schedules</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="glass rounded-2xl shadow-2xl p-8 card-hover">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Exam Selection */}
          <div className="fade-in-up">
            <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Select Exam
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-5 py-4 bg-white/80 backdrop-blur border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 font-medium shadow-lg"
            >
              <option value="">Choose an exam...</option>
              {exams.map((exam) => (
                <option key={exam.exam_id} value={exam.exam_id}>
                  {exam.subject_code} - {exam.subject_name}
                </option>
              ))}
            </select>
            {selectedExamData && (
              <div className="mt-4 p-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl text-sm shadow-lg scale-in">
                <div className="text-gray-800 font-semibold">
                  <strong>Lab:</strong> {selectedExamData.lab_no}
                </div>
                <div className="text-gray-800 font-semibold">
                  <strong>Date Range:</strong> {selectedExamData.date_start} to {selectedExamData.date_end}
                </div>
              </div>
            )}
          </div>

          {/* Date Selection */}
          <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              Exam Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-5 py-4 bg-white/80 backdrop-blur border-2 border-indigo-200 rounded-xl focus:ring-4 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 font-medium shadow-lg"
            />
          </div>

          {/* Max Students */}
          <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Max Students per Batch
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={maxStudents}
              onChange={(e) => setMaxStudents(parseInt(e.target.value))}
              className="w-full px-5 py-4 bg-white/80 backdrop-blur border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 font-medium shadow-lg"
            />
          </div>
        </div>

        {/* Time Slots */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <label className="block text-lg font-bold text-gray-800 flex items-center gap-2">
              <Clock className="h-6 w-6 text-green-600" />
              Time Slots
            </label>
            <button
              onClick={addTimeSlot}
              className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg ripple"
            >
              <Plus className="h-5 w-5" />
              <span>Add Slot</span>
            </button>
          </div>

          <div className="space-y-4">
            {timeSlots.map((slot, index) => (
              <div key={index} className="flex items-center space-x-3 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg card-hover">
                <input
                  type="text"
                  value={slot.slot_name}
                  onChange={(e) => updateTimeSlot(index, 'slot_name', e.target.value)}
                  placeholder="Slot name"
                  className="flex-1 px-4 py-3 bg-white border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 font-medium shadow"
                />
                <input
                  type="time"
                  value={slot.start_time}
                  onChange={(e) => updateTimeSlot(index, 'start_time', e.target.value)}
                  className="px-4 py-3 bg-white border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 font-medium shadow"
                />
                <span className="text-gray-600 font-bold">to</span>
                <input
                  type="time"
                  value={slot.end_time}
                  onChange={(e) => updateTimeSlot(index, 'end_time', e.target.value)}
                  className="px-4 py-3 bg-white border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 font-medium shadow"
                />
                {timeSlots.length > 1 && (
                  <button
                    onClick={() => removeTimeSlot(index)}
                    className="p-3 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-xl hover:from-red-500 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 shadow-lg ripple"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mt-6 p-5 rounded-2xl shadow-xl scale-in ${
            message.type === 'success' 
              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' 
              : 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
          }`}>
            <p className="font-semibold text-lg">{message.text}</p>
          </div>
        )}

        {/* Generate Button */}
        <div className="mt-8">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 px-8 py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold text-lg rounded-2xl hover:from-purple-600 hover:via-pink-600 hover:to-red-600 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 shadow-2xl ripple pulse-btn"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-6 w-6 animate-pulse" />
                <span>Generate Schedule</span>
                <Sparkles className="h-6 w-6 animate-pulse" style={{ animationDelay: '0.5s' }} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result Preview */}
      {result && result.schedules && (
        <div className="glass rounded-2xl shadow-2xl p-8 card-hover scale-in">
          <h3 className="text-2xl font-bold gradient-text mb-6 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600 animate-spin" />
            Generated Schedule Preview
            <Sparkles className="h-6 w-6 text-pink-600 animate-spin" style={{ animationDirection: 'reverse' }} />
          </h3>
          <div className="space-y-4">
            {result.schedules.map((schedule, index) => (
              <div key={index} style={{ animationDelay: `${index * 0.1}s` }} className="fade-in-up glass-dark rounded-2xl p-6 shadow-xl card-hover relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-between mb-3">
                  <span className="font-bold text-white text-lg">Batch {schedule.batch_number}</span>
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-600 text-white text-sm font-bold rounded-full shadow-lg">
                    {schedule.time_slot}
                  </span>
                </div>
                <div className="relative text-sm space-y-2">
                  <div className="text-gray-200"><strong className="text-white">Group:</strong> {schedule.group}</div>
                  <div className="text-gray-200"><strong className="text-white">Students:</strong> {schedule.total_students}</div>
                  <div className="mt-3">
                    <strong className="text-white">Reg Numbers:</strong>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {schedule.students.map((s, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-semibold rounded-full">
                          {s.reg_no}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-5 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl text-center">
            <p className="text-base font-semibold text-gray-800">
              ✨ Schedule has been saved. Go to Dashboard to view and manage it. ✨
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScheduleGenerator;
