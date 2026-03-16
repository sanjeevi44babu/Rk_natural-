import { useState } from 'react';
import { Bell, X, Check, CheckCheck, Trash2, Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { useNotifications, Notification } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

export function NotificationBell() {
  const { unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-105 relative"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center rounded-full animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <NotificationDropdown onClose={() => setOpen(false)} />
        </>
      )}
    </div>
  );
}

function NotificationDropdown({ onClose }: { onClose: () => void }) {
  const { notifications, markAsRead, markAllAsRead, clearAll, unreadCount } = useNotifications();

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="text-success" />;
      case 'warning': return <AlertTriangle size={16} className="text-warning" />;
      case 'error': return <AlertCircle size={16} className="text-destructive" />;
      default: return <Info size={16} className="text-secondary" />;
    }
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card border-2 border-card-border rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h3 className="font-bold text-foreground">Notifications</h3>
          <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
        </div>
        <div className="flex gap-1">
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={markAllAsRead}>
              <CheckCheck size={14} className="mr-1" />
              Read All
            </Button>
          )}
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Bell size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={`flex gap-3 p-4 border-b border-border/50 cursor-pointer transition-colors hover:bg-accent/50 ${
                !notification.read ? 'bg-primary/5' : ''
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium truncate ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full text-xs text-destructive hover:text-destructive" onClick={clearAll}>
            <Trash2 size={14} className="mr-1" />
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}
