import React, { useState, useEffect } from 'react';
import { Calendar, Download, FileText, Filter, RefreshCw, Trash2, Users, Edit } from 'lucide-react';
import { getSchedules, getExams, exportCSV, exportPDF, deleteSchedule } from '../api';
import BatchEditor from './BatchEditor';

function ScheduleViewer() {
  const [schedules, setSchedules] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterExam, setFilterExam] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingSchedule, setEditingSchedule] = useState(null);

  useEffect(() => {
    fetchExams();
    fetchSchedules();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await getExams();
      setExams(response.data);
    } catch (error) {
      console.error('Failed to fetch exams');
    }
  };

  const fetchSchedules = async (date = '', examId = '') => {
    try {
      setLoading(true);
      const params = {};
      if (date) params.date = date;
      if (examId) params.exam_id = examId;
      
      const response = await getSchedules(params);
      setSchedules(response.data);
    } catch (error) {
      showMessage('error', 'Failed to fetch schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchSchedules(filterDate, filterExam);
  };

  const handleClearFilter = () => {
    setFilterDate('');
    setFilterExam('');
    fetchSchedules();
  };

  const handleDelete = async (scheduleId) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;

    try {
      await deleteSchedule(scheduleId);
      showMessage('success', 'Schedule deleted successfully');
      fetchSchedules(filterDate, filterExam);
    } catch (error) {
      showMessage('error', 'Failed to delete schedule');
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
  };

  const handleCloseEditor = () => {
    setEditingSchedule(null);
  };

  const handleUpdateComplete = () => {
    fetchSchedules(filterDate, filterExam);
    showMessage('success', 'Batch updated successfully');
  };

  const handleExportCSV = () => {
    const params = {};
    if (filterDate) params.date = filterDate;
    if (filterExam) params.exam_id = filterExam;
    window.open(exportCSV(params), '_blank');
  };

  const handleExportPDF = () => {
    const params = {};
    if (filterDate) params.date = filterDate;
    if (filterExam) params.exam_id = filterExam;
    window.open(exportPDF(params), '_blank');
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const getBranchColor = (branch) => {
    if (branch.includes('CSE-A')) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (branch.includes('CSE-B')) return 'bg-green-100 text-green-800 border-green-300';
    if (branch.includes('CSE-C')) return 'bg-purple-100 text-purple-800 border-purple-300';
    return 'bg-orange-100 text-orange-800 border-orange-300';
  };

  // Group schedules by date and exam
  const groupedSchedules = schedules.reduce((acc, schedule) => {
    const key = `${schedule.date}_${schedule.exam_id}`;
    if (!acc[key]) {
      acc[key] = {
        date: schedule.date,
        exam_id: schedule.exam_id,
        subject_name: schedule.subject_name,
        subject_code: schedule.subject_code,
        lab_no: schedule.lab_no,
        schedules: []
      };
    }
    acc[key].schedules.push(schedule);
    return acc;
  }, {});

  const groupedArray = Object.values(groupedSchedules);

  return (
    <>
      {/* Batch Editor Modal */}
      {editingSchedule && (
        <BatchEditor
          schedule={editingSchedule}
          allSchedules={schedules}
          onClose={handleCloseEditor}
          onUpdate={handleUpdateComplete}
        />
      )}

    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl shadow-2xl p-8 card-hover">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative float-animation">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-xl opacity-75 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-2xl shadow-2xl">
                <Calendar className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold gradient-text">Schedule Dashboard</h2>
              <p className="text-gray-600 mt-1">View and manage all exam schedules</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => fetchSchedules(filterDate, filterExam)}
              disabled={loading}
              className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 shadow-lg ripple pulse-btn"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="fade-in-up">
            <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cyan-600" />
              Filter by Date
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-5 py-3 bg-white/80 backdrop-blur border-2 border-cyan-200 rounded-xl focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300 font-medium shadow-lg"
            />
          </div>
          <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600" />
              Filter by Exam
            </label>
            <select
              value={filterExam}
              onChange={(e) => setFilterExam(e.target.value)}
              className="w-full px-5 py-3 bg-white/80 backdrop-blur border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 font-medium shadow-lg"
            >
              <option value="">All Exams</option>
              {exams.map((exam) => (
                <option key={exam.exam_id} value={exam.exam_id}>
                  {exam.subject_code} - {exam.subject_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end space-x-2 fade-in-up" style={{ animationDelay: '0.2s' }}>
            <button
              onClick={handleFilter}
              className="flex-1 flex items-center justify-center space-x-2 px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg ripple"
            >
              <Filter className="h-5 w-5" />
              <span>Apply</span>
            </button>
            <button
              onClick={handleClearFilter}
              className="px-5 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-semibold rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg ripple"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="mt-6 flex space-x-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg ripple"
          >
            <FileText className="h-5 w-5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg ripple"
          >
            <Download className="h-5 w-5" />
            <span>Export PDF</span>
          </button>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mt-6 p-5 rounded-2xl shadow-xl scale-in ${
            message.type === 'success' 
              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' 
              : 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
          }`}>
            <p className="font-semibold">{message.text}</p>
          </div>
        )}
      </div>

      {/* Schedules Display */}
      {groupedArray.length > 0 ? (
        <div className="space-y-6">
          {groupedArray.map((group, groupIndex) => (
            <div key={groupIndex} style={{ animationDelay: `${groupIndex * 0.1}s` }} className="glass rounded-2xl shadow-2xl overflow-hidden card-hover fade-in-up">
              {/* Group Header */}
              <div className="relative bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-8 py-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-indigo-400/20 animate-pulse"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-7 w-7 text-white animate-pulse" />
                      <h3 className="text-2xl font-bold text-white neon-glow">
                        {new Date(group.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h3>
                    </div>
                    <div className="mt-3 flex items-center space-x-4 text-white text-sm">
                      <span className="font-bold text-base">{group.subject_code}</span>
                      <span className="text-xl">•</span>
                      <span className="font-medium">{group.subject_name}</span>
                      <span className="text-xl">•</span>
                      <span className="px-4 py-1.5 bg-white/30 backdrop-blur rounded-full font-bold shadow-lg">
                        {group.lab_no}
                      </span>
                    </div>
                  </div>
                  <div className="text-white text-right">
                    <div className="text-4xl font-bold neon-glow">{group.schedules.length}</div>
                    <div className="text-sm font-semibold opacity-90">Batches</div>
                  </div>
                </div>
              </div>

              {/* Schedule Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-cyan-500 to-blue-600">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Batch
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Time Slot
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Branch/Semester
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Students
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/80 backdrop-blur">
                    {group.schedules.map((schedule, index) => {
                      // Group students by branch
                      const studentsByBranch = schedule.students.reduce((acc, student) => {
                        const key = `${student.branch}-Sem${student.semester}`;
                        if (!acc[key]) acc[key] = [];
                        acc[key].push(student);
                        return acc;
                      }, {});

                      return (
                        <tr key={schedule.schedule_id} className="border-b border-gray-200 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-300 card-hover">
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg transform hover:scale-110 transition-transform">
                                {index + 1}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-5 w-5 text-cyan-500" />
                              <span className="text-sm font-bold text-gray-900">
                                {schedule.time_slot}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-wrap gap-2">
                              {Object.keys(studentsByBranch).map((branchKey) => (
                                <span
                                  key={branchKey}
                                  className={`px-4 py-1.5 text-xs font-bold rounded-full shadow-md ${getBranchColor(branchKey)}`}
                                >
                                  {branchKey} ({studentsByBranch[branchKey].length})
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="text-sm text-gray-800 max-w-md font-medium">
                              {schedule.students.map(s => s.reg_no).join(', ')}
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Users className="h-5 w-5 text-blue-500" />
                              <span className="text-base font-bold text-gray-900">
                                {schedule.total_students}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => handleEdit(schedule)}
                                className="p-3 bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-xl hover:from-blue-500 hover:to-indigo-600 transition-all duration-300 transform hover:scale-110 shadow-lg ripple"
                                title="Edit batch"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(schedule.schedule_id)}
                                className="p-3 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-xl hover:from-red-500 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 shadow-lg ripple"
                                title="Delete schedule"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-r from-cyan-100 to-blue-100 px-8 py-5">
                <div className="flex items-center justify-between text-base">
                  <span className="text-gray-700 font-semibold">
                    Total Students: <strong className="text-cyan-800 text-lg">
                      {group.schedules.reduce((sum, s) => sum + s.total_students, 0)}
                    </strong>
                  </span>
                  <span className="text-gray-700 font-semibold">
                    Total Batches: <strong className="text-blue-800 text-lg">{group.schedules.length}</strong>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="glass rounded-2xl shadow-2xl p-16 text-center scale-in">
            <div className="float-animation inline-block">
              <Calendar className="h-24 w-24 text-cyan-400 mx-auto mb-6" />
            </div>
            <h3 className="text-2xl font-bold gradient-text mb-3">No Schedules Found</h3>
            <p className="text-gray-600 text-lg mb-6">
              {filterDate || filterExam 
                ? 'No schedules match your filters. Try adjusting them or clearing filters.'
                : 'Get started by generating a schedule from the Schedule Generator tab.'}
            </p>
          </div>
        )
      )}
    </div>
    </>
  );
}

export default ScheduleViewer;
