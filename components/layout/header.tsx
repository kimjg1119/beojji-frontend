"use client";
import Link from "next/link";
import { FaSun, FaMoon, FaUser } from "react-icons/fa";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import React, { use, useState, useRef, useEffect } from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { UserRoleContext, useUserRole } from "@/lib/contexts/userRoleContext";

function NavButton({ label, href }: { label: string; href: string }) {
  const pathname = usePathname();
  const isActive = href === pathname || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
        isActive
          ? "border-b-2 border-primary text-primary"
          : "text-muted-foreground hover:text-primary hover:border-b-2 hover:border-primary"
      }`}
    >
      {label}
    </Link>
  );
}

export default function Header() {
  const [userRole, setUserRole] = use(UserRoleContext);
  const isLoggedIn = userRole !== null;
  // const userRole = 'admin';
  const { theme, toggleTheme } = useTheme();
  const route = useRouter();
  const navigate = route.push;
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const handleLogout = () => {
    setUserRole(null);
    navigate("/login");
    setIsAccountMenuOpen(false);
  };

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
    <header className="bg-card text-card-foreground shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary">Beojji</span>
            </Link>
          </div>
          {isLoggedIn && (
            <nav className="hidden md:flex space-x-8">
              <NavButton href="/courses" label="Courses" />
              <NavButton href="/my-submissions" label="Submissions" />
              {userRole === "admin" && (
                <NavButton href="/admin" label="Admin" />
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
                      href="/my-status"
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
                  href="/login"
                  className="text-sm font-medium text-primary hover:text-primary/80"
                >
                  Login
                </Link>
                <Link
                  href="/register"
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
  );
}
