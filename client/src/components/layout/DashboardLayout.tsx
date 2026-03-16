import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, Users, Calendar, Settings, LogOut, Menu, X, 
  User, ClipboardList, UserCog, Activity, QrCode 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { BottomNav } from '@/components/common/BottomNav';
import { Logo } from '@/components/common/Logo';
import { Avatar } from '@/components/common/Avatar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const getNavItems = () => {
    const baseItems = [
      { icon: Home, label: 'Dashboard', path: '/dashboard' },
    ];

    switch (user?.role) {
      case 'admin':
        return [
          ...baseItems,
          { icon: UserCog, label: 'Doctors', path: '/doctors' },
          { icon: Users, label: 'Supervisors', path: '/supervisors' },
          { icon: Activity, label: 'Physiotherapists', path: '/physiotherapists' },
          { icon: Users, label: 'Users', path: '/users' },
          { icon: Settings, label: 'Settings', path: '/settings' },
        ];
      case 'supervisor':
        return [
          ...baseItems,
          { icon: Users, label: 'Patients', path: '/patients' },
          { icon: Activity, label: 'Physiotherapists', path: '/physiotherapists' },
          { icon: Calendar, label: 'Schedule', path: '/schedule' },
          { icon: Settings, label: 'Settings', path: '/settings' },
        ];
      case 'doctor':
        return [
          ...baseItems,
          { icon: Users, label: 'Patients', path: '/patients' },
          { icon: Calendar, label: 'Appointments', path: '/appointments' },
          { icon: Calendar, label: 'My Schedule', path: '/my-schedule' },
          { icon: ClipboardList, label: 'New Patient', path: '/patients/new' },
          { icon: User, label: 'Profile', path: '/profile' },
        ];
      case 'physiotherapist':
        return [
          ...baseItems,
          { icon: Users, label: 'Patients', path: '/patients' },
          { icon: QrCode, label: 'Scan', path: '/scan-patient' },
          { icon: Calendar, label: 'Appointments', path: '/appointments' },
          { icon: User, label: 'Profile', path: '/profile' },
        ];
      case 'patient':
        return [
          ...baseItems,
          { icon: Calendar, label: 'Appointments', path: '/appointments' },
          { icon: User, label: 'Profile', path: '/profile' },
          { icon: Settings, label: 'Settings', path: '/settings' },
        ];
      default:
        return baseItems;
    }
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-sidebar border-r border-sidebar-border">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-sidebar-border">
            <Logo size="sm" />
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path ||
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={isActive ? 'nav-item-active w-full' : 'nav-item w-full'}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 mb-4">
              <Avatar name={user?.fullName || 'User'} size="md" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.fullName}</p>
                <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="nav-item w-full text-destructive hover:bg-destructive/10"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-sidebar border-r border-sidebar-border z-50 transform transition-transform duration-300 lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <Logo size="sm" showText={false} />
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-xl hover:bg-accent"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={isActive ? 'nav-item-active w-full' : 'nav-item w-full'}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <button
              onClick={handleLogout}
              className="nav-item w-full text-destructive hover:bg-destructive/10"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-background border-b border-border z-30 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-accent"
          >
            <Menu size={20} />
          </button>
          <span className="font-bold text-lg text-primary">MEDDICAL</span>
          <Avatar name={user?.fullName || 'User'} size="sm" />
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-0 min-h-screen">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
