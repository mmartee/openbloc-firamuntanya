
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Role } from '../../types';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const { user, logout, loading } = useAuth();

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive 
        ? 'bg-gray-700 text-white' 
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
    }`;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow via-brand-orange to-brand-blue">
              Open Bloc Vic
            </Link>
            <nav className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                 <NavLink to="/analytics" className={navLinkClasses}>Resultats</NavLink>
                {user && (
                  <>
                    <NavLink to="/" className={navLinkClasses}>Blocs</NavLink>
                    <NavLink to="/leaderboard" className={navLinkClasses}>Classificació</NavLink>
                    {(user.role === Role.Admin || user.role === Role.Arbiter) && (
                      <NavLink to="/manage" className={navLinkClasses}>Gestionar</NavLink>
                    )}
                  </>
                )}
              </div>
            </nav>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <ThemeToggle />
              {loading ? (
                <div className="animate-pulse h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded ml-4"></div>
              ) : user ? (
                <>
                  <NavLink to="/profile" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mr-4 text-sm ml-4">
                    {user.fullName}
                  </NavLink>
                  <button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavLink to="/auth" className={`${navLinkClasses({isActive: false})} ml-4`}>
                  Login
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
