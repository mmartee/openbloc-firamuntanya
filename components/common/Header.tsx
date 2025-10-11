
import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Role } from '../../types';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const desktopNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive 
        ? 'bg-gray-700 text-white' 
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
    }`;
  
  const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      isActive 
        ? 'bg-gray-700 text-white' 
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
    }`;


  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" onClick={closeMenu} className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow via-brand-orange to-brand-blue">
              Open Bloc Vic
            </Link>
            {/* Desktop Navigation */}
            <nav className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                 <NavLink to="/analytics" className={desktopNavLinkClasses}>Resultats</NavLink>
                {user && (
                  <>
                    <NavLink to="/" className={desktopNavLinkClasses}>Blocs</NavLink>
                    <NavLink to="/leaderboard" className={desktopNavLinkClasses}>Classificació</NavLink>
                    {(user.role === Role.Admin || user.role === Role.Arbiter) && (
                      <NavLink to="/manage" className={desktopNavLinkClasses}>Gestionar</NavLink>
                    )}
                  </>
                )}
              </div>
            </nav>
          </div>
          {/* Desktop User Area */}
          <div className="hidden md:flex items-center">
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
                <NavLink to="/auth" className={`${desktopNavLinkClasses({isActive: false})} ml-4`}>
                  Login
                </NavLink>
              )}
            </div>
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
                 <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                    aria-controls="mobile-menu"
                    aria-expanded={isMenuOpen}
                >
                    <span className="sr-only">Open main menu</span>
                    {isMenuOpen ? (
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
      </div>
      {/* Mobile Menu Panel */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/analytics" onClick={closeMenu} className={mobileNavLinkClasses}>Resultats</NavLink>
            {user && (
              <>
                <NavLink to="/" onClick={closeMenu} className={mobileNavLinkClasses}>Blocs</NavLink>
                <NavLink to="/leaderboard" onClick={closeMenu} className={mobileNavLinkClasses}>Classificació</NavLink>
                {(user.role === Role.Admin || user.role === Role.Arbiter) && (
                  <NavLink to="/manage" onClick={closeMenu} className={mobileNavLinkClasses}>Gestionar</NavLink>
                )}
              </>
            )}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            {loading ? (
                <div className="px-5"><div className="animate-pulse h-8 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div></div>
            ) : user ? (
                <div className="px-5">
                    <div className="font-medium text-base text-gray-800 dark:text-white">{user.fullName}</div>
                    <div className="font-medium text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                    <div className="mt-3 space-y-1">
                        <NavLink to="/profile" onClick={closeMenu} className={mobileNavLinkClasses}>El Teu Perfil</NavLink>
                        <button onClick={() => { logout(); closeMenu(); }} className={`${mobileNavLinkClasses({isActive: false})} w-full text-left`}>Logout</button>
                    </div>
                </div>
            ) : (
                <div className="px-2">
                    <NavLink to="/auth" onClick={closeMenu} className={mobileNavLinkClasses}>Login</NavLink>
                </div>
            )}
            <div className="mt-3 px-5 flex justify-between items-center">
              <span className="font-medium text-gray-800 dark:text-white">Theme</span>
              <ThemeToggle />
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
