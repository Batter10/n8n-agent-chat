import { getUserByEmail, isOwnerEmail } from '../config/users';
import { ROLES, hasPermission } from '../config/roles';

class AuthService {
  constructor() {
    this.currentUser = null;
    // In een echte applicatie zou je hier een JWT token of andere sessie mechanisme gebruiken
  }

  async login(email, password) {
    // In productie zou je hier echte wachtwoord verificatie gebruiken
    if (password !== 'test123') {
      throw new Error('Invalid credentials');
    }

    const user = getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.status !== 'active') {
      throw new Error('Account is not active');
    }

    this.currentUser = user;
    return user;
  }

  async logout() {
    this.currentUser = null;
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isPlatformOwner() {
    return this.currentUser && isOwnerEmail(this.currentUser.email);
  }

  isCompanyAdmin() {
    return this.currentUser && this.currentUser.role === ROLES.COMPANY_ADMIN;
  }

  canManageCompany(companyId) {
    if (!this.currentUser) return false;
    if (this.isPlatformOwner()) return true;
    return this.isCompanyAdmin() && this.currentUser.companyId === companyId;
  }

  canUseAgent(agentId, companyId) {
    if (!this.currentUser) return false;
    if (this.isPlatformOwner()) return true;
    return this.currentUser.companyId === companyId && 
           hasPermission(this.currentUser.role, 'use_agents');
  }

  // Extra veiligheid voor platform owner acties
  async verifyOwnerPassword(password) {
    if (!this.isPlatformOwner()) {
      throw new Error('Unauthorized');
    }
    // In productie zou je hier extra wachtwoord verificatie doen
    return password === 'test123';
  }
}

export const authService = new AuthService();