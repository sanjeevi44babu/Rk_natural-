import { Home, Calendar, Users, Settings, User, ClipboardList, Clock, QrCode } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const getNavItems = () => {
    const baseItems = [
      { icon: Home, label: 'Home', path: '/dashboard' },
    ];

    switch (user?.role) {
      case 'admin':
        return [
          ...baseItems,
          { icon: Users, label: 'Users', path: '/users' },
          { icon: Users, label: 'Patients', path: '/patients' },
          { icon: Settings, label: 'Settings', path: '/settings' },
        ];
      case 'supervisor':
        return [
          ...baseItems,
          { icon: Calendar, label: 'Schedule', path: '/schedule' },
          { icon: QrCode, label: 'Scan', path: '/scan-patient' },
          { icon: Settings, label: 'Settings', path: '/settings' },
        ];
      case 'doctor':
        return [
          ...baseItems,
          { icon: Users, label: 'Patients', path: '/patients' },
          { icon: QrCode, label: 'Scan', path: '/scan-patient' },
          { icon: User, label: 'Profile', path: '/profile' },
        ];
      case 'physiotherapist':
        return [
          ...baseItems,
          { icon: Users, label: 'Patients', path: '/patients' },
          { icon: QrCode, label: 'Scan', path: '/scan-patient' },
          { icon: User, label: 'Profile', path: '/profile' },
        ];
      case 'patient':
        return [
          ...baseItems,
          { icon: Calendar, label: 'Appointments', path: '/appointments' },
          { icon: User, label: 'Profile', path: '/profile' },
        ];
      default:
        return baseItems;
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border safe-area-bottom z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-primary text-primary-foreground' : ''
              }`}>
                <Icon size={20} />
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
