class N8nService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl || process.env.REACT_APP_N8N_URL;
  }

  async triggerWorkflow(webhookUrl, data) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error triggering workflow:', error);
      throw error;
    }
  }

  async sendMessage({ agentId, webhookUrl, text, sessionId }) {
    return this.triggerWorkflow(webhookUrl, {
      sessionId,
      message: text,
      timestamp: new Date().toISOString(),
    });
  }

  async uploadDocument(webhookUrl, file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }
}

export const n8nService = new N8nService();