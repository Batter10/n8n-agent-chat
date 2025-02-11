import { ROLES } from './roles';

export const PLATFORM_OWNER_EMAILS = [
  'aleksschouten15@gmail.com',
  'batterassist1@gmail.com',
  'aleksschouten@live.nl'
];

const users = [
  // Platform Owner accounts
  {
    id: 'owner1',
    email: 'aleksschouten15@gmail.com',
    role: ROLES.OWNER,
    name: 'Aleks Schouten',
    isOwner: true,
    status: 'active'
  },
  {
    id: 'owner2',
    email: 'batterassist1@gmail.com',
    role: ROLES.OWNER,
    name: 'Aleks Schouten',
    isOwner: true,
    status: 'active'
  },
  {
    id: 'owner3',
    email: 'aleksschouten@live.nl',
    role: ROLES.OWNER,
    name: 'Aleks Schouten',
    isOwner: true,
    status: 'active'
  },

  // Test Company Admin
  {
    id: 'admin1',
    email: 'testbeh123@gmail.com',
    role: ROLES.COMPANY_ADMIN,
    name: 'Test Beheerder',
    companyId: 'company1',
    status: 'active'
  },

  // Test Regular User
  {
    id: 'user1',
    email: 'testalg123@gmail.com',
    role: ROLES.USER,
    name: 'Test Gebruiker',
    companyId: 'company1',
    status: 'active'
  }
];

export function isOwnerEmail(email) {
  return PLATFORM_OWNER_EMAILS.includes(email.toLowerCase());
}

export function getUserByEmail(email) {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

export function getUserRole(email) {
  const user = getUserByEmail(email);
  return user ? user.role : null;
}

export default users;