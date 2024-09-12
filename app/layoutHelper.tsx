import React, { useState, useRef, useEffect } from "react";
// import { Link, useNavigate, useLocation } from 'react-router-dom';
import Link from "next/link";

// import { useTheme } from '../contexts/ThemeContext';
import { FaSun, FaMoon, FaUser, FaGithub } from "react-icons/fa";

interface LayoutProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
  userRole: string | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  isLoggedIn,
  userRole,
  onLogout,
}) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const handleLogout = () => {
    onLogout();
    navigate("/login");
    setIsAccountMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsAccountMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsAccountMenuOpen(false);
    }, 300); // 300ms delay before closing the menu
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="bg-card text-card-foreground shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-primary">Beojji</span>
              </Link>
            </div>
            {isLoggedIn && (
              <nav className="hidden md:flex space-x-8">
                <Link
                  to="/courses"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive("/courses")
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-primary hover:border-b-2 hover:border-primary"
                  }`}
                >
                  Courses
                </Link>
                <Link
                  to="/my-submissions"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive("/my-submissions")
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-primary hover:border-b-2 hover:border-primary"
                  }`}
                >
                  Submissions
                </Link>
                {userRole === "admin" && (
                  <Link
                    to="/admin"
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      isActive("/admin")
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-primary hover:border-b-2 hover:border-primary"
                    }`}
                  >
                    Admin
                  </Link>
                )}
              </nav>
            )}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <FaSun /> : <FaMoon />}
              </button>
              {isLoggedIn ? (
                <div
                  className="relative"
                  ref={accountMenuRef}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="flex items-center space-x-2 text-sm focus:outline-none">
                    <FaUser className="text-primary" />
                    <span>Account</span>
                  </button>
                  {isAccountMenuOpen && (
                    <div
                      className="absolute right-0 w-48 mt-2 py-2 bg-card rounded-md shadow-xl z-20"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Link
                        to="/my-status"
                        className="block px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        My Status
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-primary hover:text-primary/80"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm font-medium bg-primary text-primary-foreground px-3 py-2 rounded-md hover:bg-primary/90"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">{children}</div>
        </div>
      </main>

      <footer className="bg-card text-card-foreground mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm">
            © 2024 KU-PLRG. All rights reserved.
          </p>
        </div>
      </footer>

      <div className="flex justify-center space-x-4 py-4 bg-card">
        <div className="flex items-center">
          <a
            href="https://github.com/kimjg1119/beojji-frontend"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 flex items-center"
            aria-label="Frontend GitHub"
          >
            <FaGithub size={24} />
            <span className="ml-2 text-sm">Frontend</span>
          </a>
        </div>
        <div className="flex items-center">
          <a
            href="https://github.com/kimjg1119/beojji-backend"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 flex items-center"
            aria-label="Backend GitHub"
          >
            <FaGithub size={24} />
            <span className="ml-2 text-sm">Backend</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Layout;
