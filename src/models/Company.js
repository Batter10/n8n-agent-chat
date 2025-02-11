export class Company {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.adminUsers = data.adminUsers || [];
    this.users = data.users || [];
    this.agents = data.agents || [];
    this.settings = data.settings || {
      maxUsers: 100,
      maxAgents: 10,
      allowedAgentTypes: ['qa', 'chat', 'process']
    };
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Voeg een admin toe aan het bedrijf
  addAdmin(userId) {
    if (!this.adminUsers.includes(userId)) {
      this.adminUsers.push(userId);
    }
  }

  // Voeg een gebruiker toe aan het bedrijf
  addUser(userId) {
    if (!this.users.includes(userId)) {
      this.users.push(userId);
    }
  }

  // Voeg een agent toe aan het bedrijf
  addAgent(agent) {
    if (this.agents.length >= this.settings.maxAgents) {
      throw new Error('Maximum aantal agents bereikt');
    }
    this.agents.push(agent);
  }

  // Verwijder een agent van het bedrijf
  removeAgent(agentId) {
    this.agents = this.agents.filter(agent => agent.id !== agentId);
  }

  // Controleer of een gebruiker bij dit bedrijf hoort
  hasUser(userId) {
    return this.users.includes(userId) || this.adminUsers.includes(userId);
  }

  // Controleer of een gebruiker admin is van dit bedrijf
  isAdmin(userId) {
    return this.adminUsers.includes(userId);
  }

  // Update bedrijfsinstellingen
  updateSettings(newSettings) {
    this.settings = {
      ...this.settings,
      ...newSettings
    };
    this.updatedAt = new Date().toISOString();
  }

  // Krijg alle actieve agents
  getActiveAgents() {
    return this.agents.filter(agent => agent.status === 'active');
  }

  // Krijg alle agents van een specifiek type
  getAgentsByType(type) {
    return this.agents.filter(agent => agent.type === type);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      adminUsers: this.adminUsers,
      users: this.users,
      agents: this.agents,
      settings: this.settings,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}