'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '@/store/slices/uiSlice';
import { RootState } from '@/store';
import { 
  BarChart3, 
  Briefcase, 
  Settings,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Menu,
  Users,
  Zap,
  X,
  LogIn
} from 'lucide-react';
import { clsx } from 'clsx';
import { useState, useEffect } from 'react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Job Openings', href: '/jobs', icon: Briefcase },
  { name: 'Talent Pool', href: '/applicants', icon: Users },
  { name: 'AI Screening', href: '/screening', icon: Zap },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const collapsed = useSelector((state: RootState) => state.ui.sidebarCollapsed);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const toggle = () => dispatch(toggleSidebar());

  return (
    <>
      {/* Mobile Trigger */}
      <button 
        className="lg:hidden fixed top-3 left-4 z-50 p-2.5 bg-primary text-white rounded-xl shadow-lg hover:scale-105 transition-all"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={clsx(
        "fixed lg:relative inset-y-0 left-0 z-40 bg-[var(--background)] flex flex-col transition-all duration-300 ease-in-out h-full overflow-hidden",
        collapsed ? "w-20" : "w-[280px]",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo Section */}
        <div className={clsx(
          "h-16 flex items-center px-6 shrink-0",
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                <Cpu className="text-white" size={18} />
              </div>
              <span className="text-lg font-bold tracking-tight text-[var(--foreground)] font-poppins">UMU AI</span>
            </div>
          )}
          {collapsed && (
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
               <Cpu className="text-white" size={20} />
            </div>
          )}
          
          <button 
            onClick={toggle}
            className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md hover:bg-primary/5 text-muted-content transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-10 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative font-semibold text-sm",
                  isActive 
                    ? "bg-primary text-white shadow-xl shadow-primary/20" 
                    : "text-muted-content hover:text-primary hover:bg-primary/5",
                  collapsed && "justify-center px-0"
                )}
              >
                <item.icon 
                  size={20} 
                  className={clsx(
                    "shrink-0 transition-transform duration-300",
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )} 
                />
                {!collapsed && (
                  <span className="truncate">{item.name}</span>
                )}
                
                {collapsed && (
                  <div className="absolute left-[calc(100%+12px)] px-3 py-2 bg-[var(--foreground)] text-[var(--background)] text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 whitespace-nowrap shadow-xl">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer info - Sign In */}
        <div className="p-4 space-y-2">
           <button className={clsx(
             "w-full flex items-center gap-3 p-3 rounded-2xl bg-primary text-white hover:bg-primary-hover transition-all active:scale-95 shadow-lg shadow-primary/20",
             collapsed ? "justify-center" : ""
           )}>
             <LogIn size={20} />
             {!collapsed && <span className="text-sm font-bold">Sign in</span>}
           </button>
        </div>
      </aside>
    </>
  );
}
