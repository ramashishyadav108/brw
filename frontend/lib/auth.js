export const setAuth = (token, user) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// Get authentication data
export const getAuth = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) return null;
    
    const user = JSON.parse(userStr);
    return { token, user };
  } catch (error) {
    console.error('Error getting auth:', error);
    return null;
  }
};

// Clear authentication data
export const clearAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const auth = getAuth();
  return !!auth?.token;
};

// Get current user
export const getCurrentUser = () => {
  const auth = getAuth();
  return auth?.user || null;
};