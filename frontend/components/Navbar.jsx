'use client';

import { useRouter } from 'next/navigation';
import { clearAuth, getCurrentUser } from '@/lib/auth';
import { FiLogOut, FiUser, FiCheckSquare } from 'react-icons/fi';

export default function Navbar() {
  const router = useRouter();
  const user = getCurrentUser();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      clearAuth();
      router.push('/login');
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <FiCheckSquare className="text-primary text-3xl mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">
              Task<span className="text-primary">Tracker</span>
            </h1>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                <FiUser className="text-gray-600" />
                <span className="text-gray-700 font-medium">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md hover:shadow-lg"
                aria-label="Logout"
              >
                <FiLogOut />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}