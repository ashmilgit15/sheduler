import React, { useState, useEffect } from 'react';
import { Upload, UserPlus, Trash2, RefreshCw, Download, Users } from 'lucide-react';
import { getStudents, uploadStudents, deleteStudent } from '../api';

function StudentManager() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getStudents();
      setStudents(response.data);
    } catch (error) {
      showMessage('error', 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const response = await uploadStudents(file);
      showMessage('success', response.data.message);
      fetchStudents();
    } catch (error) {
      showMessage('error', error.response?.data?.detail || 'Upload failed');
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  const handleDelete = async (regNo) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      await deleteStudent(regNo);
      showMessage('success', 'Student deleted successfully');
      fetchStudents();
    } catch (error) {
      showMessage('error', 'Failed to delete student');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const downloadTemplate = () => {
    const csvContent = 'reg_no,name,branch,semester\nMES23CS001,John Doe,CSE-A,5';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_template.csv';
    a.click();
  };

  const groupedStudents = students.reduce((acc, student) => {
    const key = `${student.branch}-Sem${student.semester}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(student);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl shadow-2xl p-8 card-hover">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl blur opacity-75 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-green-400 to-blue-500 p-3 rounded-2xl">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold gradient-text">Student Management</h2>
              <p className="text-gray-600 mt-1">Upload and manage student data</p>
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
              onClick={fetchStudents}
              disabled={loading}
              className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 shadow-lg ripple pulse-btn"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="font-semibold">Refresh</span>
            </button>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mt-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl animate-pulse"></div>
          <div className="relative border-2 border-dashed border-white/50 rounded-2xl p-10 text-center hover:border-blue-400 transition-all duration-300 backdrop-blur-sm card-hover">
            <div className="float-animation inline-block">
              <Upload className="h-16 w-16 text-blue-500 mx-auto mb-4" />
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
            <p className="text-sm text-gray-600 mt-3 font-medium">CSV or Excel file with columns: reg_no, name, branch, semester</p>
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

      {/* Students List */}
      <div className="glass rounded-2xl shadow-2xl p-8 card-hover">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Students List ({students.length})
          </h3>
        </div>

        {Object.entries(groupedStudents).map(([group, groupStudents], idx) => (
          <div key={group} className="mb-8 fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-4 h-4 rounded-full shadow-lg animate-pulse ${
                group.includes('CSE-A') ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                group.includes('CSE-B') ? 'bg-gradient-to-r from-green-400 to-green-600' :
                group.includes('CSE-C') ? 'bg-gradient-to-r from-purple-400 to-purple-600' : 
                'bg-gradient-to-r from-orange-400 to-orange-600'
              }`}></div>
              <h4 className="text-xl font-bold text-gray-800">{group}</h4>
              <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-semibold rounded-full">
                {groupStudents.length} students
              </span>
            </div>
            
            <div className="overflow-x-auto rounded-2xl shadow-lg">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-blue-500 to-purple-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Reg No
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Branch
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Semester
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/80 backdrop-blur">
                  {groupStudents.map((student, studentIdx) => (
                    <tr key={student.reg_no} className="border-b border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 card-hover">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {student.reg_no}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs font-semibold rounded-full">
                          {student.branch}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-semibold rounded-full">
                          Sem {student.semester}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => handleDelete(student.reg_no)}
                          className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-xl hover:from-red-500 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 shadow-lg ripple"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {students.length === 0 && !loading && (
          <div className="text-center py-16 scale-in">
            <div className="float-animation inline-block">
              <UserPlus className="h-20 w-20 text-blue-400 mx-auto mb-4" />
            </div>
            <p className="text-xl font-semibold text-gray-700">No students found</p>
            <p className="text-gray-500 mt-2">Upload a CSV file to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentManager;
