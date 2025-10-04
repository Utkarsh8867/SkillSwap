// Mock auth service for development without backend
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@skillswap.com',
    password: 'demo123',
    skills: ['React', 'Node.js', 'JavaScript']
  },
  {
    id: 2,
    name: 'Sarah Wilson',
    email: 'sarah@skillswap.com',
    password: 'demo123',
    skills: ['UI/UX Design', 'Figma', 'Adobe XD']
  }
];

export const mockLoginUser = async (credentials) => {
  await delay(1000); // Simulate network delay
  
  const user = mockUsers.find(u => 
    u.email === credentials.email && u.password === credentials.password
  );
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  const token = `mock_token_${user.id}_${Date.now()}`;
  const { password, ...userWithoutPassword } = user;
  
  return {
    data: {
      token,
      user: userWithoutPassword
    }
  };
};

export const mockRegisterUser = async (userData) => {
  await delay(1000);
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === userData.email);
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  const newUser = {
    id: mockUsers.length + 1,
    name: userData.name,
    email: userData.email,
    password: userData.password,
    skills: []
  };
  
  mockUsers.push(newUser);
  
  const token = `mock_token_${newUser.id}_${Date.now()}`;
  const { password, ...userWithoutPassword } = newUser;
  
  return {
    data: {
      token,
      user: userWithoutPassword
    }
  };
};

export const mockGetMyProfile = async () => {
  await delay(500);
  
  const token = localStorage.getItem('skillswap_token');
  if (!token || !token.startsWith('mock_token_')) {
    throw new Error('Invalid token');
  }
  
  const userId = parseInt(token.split('_')[2]);
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  const { password, ...userWithoutPassword } = user;
  return {
    data: userWithoutPassword
  };
};