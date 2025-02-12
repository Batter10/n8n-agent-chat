const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.sessionId = localStorage.getItem('sessionId');
  }

  setSession(sessionId) {
    this.sessionId = sessionId;
    localStorage.setItem('sessionId', sessionId);
  }

  clearSession() {
    this.sessionId = null;
    localStorage.removeItem('sessionId');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.sessionId && { 'x-session-id': this.sessionId }),
      ...options.headers
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  }

  // Auth
  async login(email, password) {
    const data = await this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    this.setSession(data.sessionId);
    return data;
  }

  async logout() {
    this.clearSession();
  }

  // Chat
  async sendMessage(message, sessionId) {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, sessionId })
    });
  }

  // Document Upload
  async uploadDocument(file) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request('/upload', {
      method: 'POST',
      body: formData,
      headers: {
        // Remove Content-Type to let the browser set it with the boundary
        'Content-Type': undefined
      }
    });
  }

  // Chat History
  async getChatHistory() {
    return this.request('/chat-history');
  }
}

export const apiService = new ApiService();