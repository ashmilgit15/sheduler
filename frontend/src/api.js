import axios from 'axios';

const API_BASE_URL = 'https://lab-scheduler-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Students
export const getStudents = () => api.get('/students');
export const addStudent = (student) => api.post('/students', student);
export const uploadStudents = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/students/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
export const deleteStudent = (regNo) => api.delete(`/students/${regNo}`);

// Exams
export const getExams = () => api.get('/exams');
export const addExam = (exam) => api.post('/exams', exam);
export const uploadExams = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/exams/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
export const deleteExam = (examId) => api.delete(`/exams/${examId}`);

// Schedules
export const generateSchedule = (data) => api.post('/schedules/generate', data);
export const getSchedules = (params) => api.get('/schedules', { params });
export const moveStudent = (data) => api.put('/schedules/move-student', data);
export const deleteSchedule = (scheduleId) => api.delete(`/schedules/${scheduleId}`);

// Export
export const exportCSV = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return `${API_BASE_URL}/export/csv?${queryString}`;
};
export const exportPDF = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return `${API_BASE_URL}/export/pdf?${queryString}`;
};

export default api;
