import React, { useState, useEffect } from 'react';
import { Upload, BookOpen, Trash2, RefreshCw, Download } from 'lucide-react';
import { getExams, uploadExams, deleteExam } from '../api';

function ExamManager() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await getExams();
      setExams(response.data);
    } catch (error) {
      showMessage('error', 'Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const response = await uploadExams(file);
      showMessage('success', response.data.message);
      fetchExams();
    } catch (error) {
      showMessage('error', error.response?.data?.detail || 'Upload failed');
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  const handleDelete = async (examId) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) return;

    try {
      await deleteExam(examId);
      showMessage('success', 'Exam deleted successfully');
      fetchExams();
    } catch (error) {
      showMessage('error', 'Failed to delete exam');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const downloadTemplate = () => {
    const csvContent = 'exam_id,subject_code,subject_name,lab_no,date_start,date_end,examiner_internal,examiner_external\n1,CSL331,System Software Lab,LAB 4,2025-11-05,2025-11-10,Dr. Verma,Dr. Sharma';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exams_template.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl shadow-2xl p-8 card-hover">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl blur opacity-75 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-orange-400 to-red-500 p-3 rounded-2xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold gradient-text">Exam Management</h2>
              <p className="text-gray-600 mt-1">Upload and manage exam data</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={downloadTemplate}
              className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg ripple"
            >
              <Download className="h-4 w-4" />
              <span className="font-semibold">Template</span>
            </button>
            <button
              onClick={fetchExams}
              disabled={loading}
              className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 shadow-lg ripple pulse-btn"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="font-semibold">Refresh</span>
            </button>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mt-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl animate-pulse"></div>
          <div className="relative border-2 border-dashed border-white/50 rounded-2xl p-10 text-center hover:border-orange-400 transition-all duration-300 backdrop-blur-sm card-hover">
            <div className="float-animation inline-block">
              <Upload className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            </div>
            <label className="cursor-pointer">
              <span className="text-xl font-bold gradient-text hover:scale-105 inline-block transition-transform">
                Click to upload CSV/Excel
              </span>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                disabled={loading}
              />
            </label>
            <p className="text-sm text-gray-600 mt-3 font-medium">
              CSV or Excel file with columns: subject_code, subject_name, lab_no, date_start, date_end, examiner_internal, examiner_external
            </p>
          </div>
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

      {/* Exams List */}
      <div className="glass rounded-2xl shadow-2xl p-8 card-hover">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-orange-600" />
            Exams List ({exams.length})
          </h3>
        </div>

        {exams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exams.map((exam, idx) => (
              <div
                key={exam.exam_id}
                style={{ animationDelay: `${idx * 0.1}s` }}
                className="fade-in-up glass-dark rounded-2xl p-6 card-hover shadow-xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="px-4 py-1.5 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-xs font-bold rounded-full shadow-lg">
                        {exam.subject_code}
                      </span>
                      <span className="px-4 py-1.5 bg-gradient-to-r from-green-400 to-green-600 text-white text-xs font-bold rounded-full shadow-lg">
                        {exam.lab_no}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-4 neon-glow">
                      {exam.subject_name}
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center text-gray-200">
                        <span className="font-semibold w-32">Date Range:</span>
                        <span className="text-white">{exam.date_start} to {exam.date_end}</span>
                      </div>
                      <div className="flex items-center text-gray-200">
                        <span className="font-semibold w-32">Internal:</span>
                        <span className="text-white">{exam.examiner_internal}</span>
                      </div>
                      <div className="flex items-center text-gray-200">
                        <span className="font-semibold w-32">External:</span>
                        <span className="text-white">{exam.examiner_external}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(exam.exam_id)}
                    className="ml-4 p-3 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-xl hover:from-red-500 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 shadow-lg ripple"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-16 scale-in">
              <div className="float-animation inline-block">
                <BookOpen className="h-20 w-20 text-orange-400 mx-auto mb-4" />
              </div>
              <p className="text-xl font-semibold text-gray-700">No exams found</p>
              <p className="text-gray-500 mt-2">Upload a CSV file to get started.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default ExamManager;
