'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { FaMoon, FaSun, FaPlus, FaBars, FaTimes, FaBell, FaEnvelope, FaBookmark, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-200/20 dark:border-gray-700/20">
        <nav className="container-responsive py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="text-xl sm:text-2xl font-bold flex items-center group">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mr-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SkillSwap
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <button
                onClick={toggleTheme}
                className="p-3 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all duration-200 backdrop-blur-sm"
                title="Toggle theme"
              >
                {theme === 'light' ? <FaMoon className="w-4 h-4 text-gray-600" /> : <FaSun className="w-4 h-4 text-yellow-500" />}
              </button>

              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-1">
                    <Link href="/dashboard">
                      <Button variant="ghost" size="sm" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">Dashboard</Button>
                    </Link>
                    <Link href="/messages">
                      <Button variant="ghost" size="sm" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <FaEnvelope className="w-4 h-4 mr-2" />
                        Messages
                      </Button>
                    </Link>
                    <Link href="/notifications">
                      <Button variant="ghost" size="sm" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <FaBell className="w-4 h-4 mr-2" />
                        Notifications
                      </Button>
                    </Link>
                    <Link href="/bookmarks">
                      <Button variant="ghost" size="sm" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <FaBookmark className="w-4 h-4 mr-2" />
                        Bookmarks
                      </Button>
                    </Link>
                  </div>
                  <Link href="/create-post">
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                      <FaPlus className="w-4 h-4 mr-2" />
                      Create Post
                    </Button>
                  </Link>

                  {/* User Menu */}
                  <div className="flex items-center space-x-4">
                    <Link href="/profile" className="flex items-center group p-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all">
                      <img
                        src={user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=6366f1&color=fff`}
                        alt="profile"
                        className="w-10 h-10 rounded-full border-2 border-blue-200 dark:border-blue-600 group-hover:border-blue-400 transition-colors"
                      />
                      <span className="ml-3 font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">
                        {user?.name}
                      </span>
                    </Link>
                    <Link href="/settings">
                      <Button variant="ghost" size="sm" className="p-3 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50">
                        <FaCog className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button onClick={logout} variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20">
                      <FaSignOutAlt className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/login">
                    <Button variant="ghost" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all"
              >
                {theme === 'light' ? <FaMoon className="w-4 h-4 text-gray-600" /> : <FaSun className="w-4 h-4 text-yellow-500" />}
              </button>

              {isAuthenticated && (
                <>
                  <Link href="/create-post" className="p-2">
                    <FaPlus className="w-5 h-5 text-blue-600" />
                  </Link>
                  <Link href="/profile" className="p-1">
                    <img
                      src={user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=6366f1&color=fff`}
                      alt="profile"
                      className="w-8 h-8 rounded-full border-2 border-blue-200 dark:border-blue-600"
                    />
                  </Link>
                </>
              )}

              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all"
              >
                {isMobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="container-responsive py-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" onClick={closeMobileMenu}>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <span>Dashboard</span>
                      </div>
                    </Link>
                    <Link href="/messages" onClick={closeMobileMenu}>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <FaEnvelope className="w-4 h-4" />
                        <span>Messages</span>
                      </div>
                    </Link>
                    <Link href="/notifications" onClick={closeMobileMenu}>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <FaBell className="w-4 h-4" />
                        <span>Notifications</span>
                      </div>
                    </Link>
                    <Link href="/bookmarks" onClick={closeMobileMenu}>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <FaBookmark className="w-4 h-4" />
                        <span>Bookmarks</span>
                      </div>
                    </Link>
                    <Link href="/settings" onClick={closeMobileMenu}>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <FaCog className="w-4 h-4" />
                        <span>Settings</span>
                      </div>
                    </Link>
                    <button
                      onClick={() => { logout(); closeMobileMenu(); }}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full text-left text-red-600 dark:text-red-400"
                    >
                      <FaSignOutAlt className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={closeMobileMenu}>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <span>Login</span>
                      </div>
                    </Link>
                    <Link href="/register" onClick={closeMobileMenu}>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <span>Sign Up</span>
                      </div>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Bottom Navigation */}
      {isAuthenticated && (
        <div className="mobile-nav lg:hidden">
          <Link href="/dashboard" className="flex flex-col items-center py-2 px-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
            <div className="w-6 h-6 mb-1">🏠</div>
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/search" className="flex flex-col items-center py-2 px-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
            <div className="w-6 h-6 mb-1">🔍</div>
            <span className="text-xs">Search</span>
          </Link>
          <Link href="/create-post" className="flex flex-col items-center py-2 px-3 text-blue-600">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mb-1">
              <FaPlus className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs">Create</span>
          </Link>
          <Link href="/messages" className="flex flex-col items-center py-2 px-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
            <FaEnvelope className="w-5 h-5 mb-1" />
            <span className="text-xs">Messages</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center py-2 px-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
            <img
              src={user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}`}
              alt="profile"
              className="w-6 h-6 rounded-full mb-1"
            />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      )}
    </>
  );
};