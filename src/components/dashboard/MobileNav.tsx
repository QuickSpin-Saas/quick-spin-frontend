'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/lib/redux/hooks';
import {
  Home,
  Server,
  Activity,
  DollarSign,
  Settings,
  Users,
  Database,
  LogOut,
  X,
  Menu,
  Building2,
  User
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface MobileNavProps {
  onLogout: () => void;
}

export default function MobileNav({ onLogout }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role;

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const mainNavItems = [
    { title: 'Dashboard', href: '/dashboard', icon: Home },
    { title: 'Services', href: '/dashboard/services', icon: Server },
    { title: 'Activity', href: '/dashboard/activity', icon: Activity },
    { title: 'Billing', href: '/dashboard/billing', icon: DollarSign },
    { title: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const adminNavItems = [
    { title: 'Admin Dashboard', href: '/dashboard/admin', icon: Database },
    { title: 'User Management', href: '/dashboard/admin/users', icon: Users },
  ];

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 rounded-lg hover:bg-accent transition-theme"
        aria-label="Toggle mobile menu"
      >
        <Menu className="w-6 h-6 text-foreground" />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-[280px] bg-background border-r border-border z-50 transform transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header with Close Button */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">QS</span>
              </div>
              <span className="font-semibold text-foreground">QuickSpin</span>
            </div>
            <button
              onClick={closeMenu}
              className="p-1 rounded-md hover:bg-accent transition-theme"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
                Main
              </h3>
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-theme",
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>

            {role === 'admin' && (
              <div className="space-y-1 mt-6">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
                  Admin
                </h3>
                {adminNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-theme",
                      isActive(item.href)
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-accent"
                    )}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </nav>

          {/* Footer with Theme Toggle and Logout */}
          <div className="p-4 border-t border-border space-y-2">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-medium text-foreground">Theme</span>
              <ThemeToggle />
            </div>
            <button
              onClick={() => {
                closeMenu();
                onLogout();
              }}
              className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-theme w-full"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
