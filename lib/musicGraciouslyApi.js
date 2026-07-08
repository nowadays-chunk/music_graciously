import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export const musicApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export function websocketUrl(path) {
  const base = API_BASE_URL.replace(/^http/, 'ws').replace(/\/$/, '');
  return `${base}${path}`;
}

export async function fetchTeacherDashboard(teacherId) {
  const { data } = await musicApi.get(`/api/dashboard/teacher/${teacherId}`);
  return data;
}

export async function fetchStudentDashboard(studentId) {
  const { data } = await musicApi.get(`/api/dashboard/student/${studentId}`);
  return data;
}

export async function fetchClassroomWorkspace(classroomId) {
  const { data } = await musicApi.get(`/api/dashboard/classrooms/${classroomId}/workspace`);
  return data;
}

export async function fetchWallet(userId) {
  const { data } = await musicApi.get(`/api/platform/wallet/${userId}`);
  return data;
}

export async function createClassroom(payload) {
  const { data } = await musicApi.post('/api/platform/classrooms', payload);
  return data;
}

export async function createAssignment(payload) {
  const { data } = await musicApi.post('/api/platform/assignments', payload);
  return data;
}

export async function createPracticeSession(payload) {
  const { data } = await musicApi.post('/api/platform/practice-sessions', payload);
  return data;
}
