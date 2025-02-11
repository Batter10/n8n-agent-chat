export const ROLES = {
  OWNER: 'owner',
  COMPANY_ADMIN: 'company_admin',
  USER: 'user'
};

export const PERMISSIONS = {
  // Platform management
  MANAGE_COMPANIES: 'manage_companies',        // Kan bedrijven toevoegen/verwijderen
  MANAGE_PLATFORM: 'manage_platform',          // Platform instellingen beheren
  VIEW_ANALYTICS: 'view_analytics',            // Platform-brede analytics bekijken
  
  // Company level
  MANAGE_COMPANY_AGENTS: 'manage_company_agents',  // Agents beheren voor hun bedrijf
  MANAGE_COMPANY_USERS: 'manage_company_users',    // Gebruikers beheren binnen bedrijf
  VIEW_COMPANY_ANALYTICS: 'view_company_analytics',// Bedrijfs-analytics bekijken
  
  // Agent usage
  USE_AGENTS: 'use_agents',                    // Agents gebruiken
  VIEW_CHAT_HISTORY: 'view_chat_history'       // Eigen chatgeschiedenis bekijken
};

export const ROLE_PERMISSIONS = {
  [ROLES.OWNER]: [
    PERMISSIONS.MANAGE_COMPANIES,
    PERMISSIONS.MANAGE_PLATFORM,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_COMPANY_AGENTS,
    PERMISSIONS.MANAGE_COMPANY_USERS,
    PERMISSIONS.VIEW_COMPANY_ANALYTICS,
    PERMISSIONS.USE_AGENTS,
    PERMISSIONS.VIEW_CHAT_HISTORY
  ],
  
  [ROLES.COMPANY_ADMIN]: [
    PERMISSIONS.MANAGE_COMPANY_AGENTS,
    PERMISSIONS.MANAGE_COMPANY_USERS,
    PERMISSIONS.VIEW_COMPANY_ANALYTICS,
    PERMISSIONS.USE_AGENTS,
    PERMISSIONS.VIEW_CHAT_HISTORY
  ],
  
  [ROLES.USER]: [
    PERMISSIONS.USE_AGENTS,
    PERMISSIONS.VIEW_CHAT_HISTORY
  ]
};

// Helper functie om te controleren of een gebruiker een bepaalde permissie heeft
export const hasPermission = (userRole, permission) => {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission);
};