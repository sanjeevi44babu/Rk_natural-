import { ChevronRight, Phone, Mail, Star } from 'lucide-react';
import { Avatar } from './Avatar';

interface UserCardProps {
  id: string;
  name: string;
  role?: string;
  subtitle?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  rating?: number;
  showActions?: boolean;
  onClick?: () => void;
}

export function UserCard({
  name,
  role,
  subtitle,
  avatar,
  email,
  phone,
  rating,
  showActions = false,
  onClick,
}: UserCardProps) {
  return (
    <div 
      className="user-card animate-fade-in"
      onClick={onClick}
    >
      <Avatar src={avatar} name={name} size="lg" />
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground truncate">{name}</h3>
        {role && (
          <span className="badge-primary inline-block mt-1">{role}</span>
        )}
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
        
        {rating !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                className={star <= rating ? 'text-warning fill-warning' : 'text-muted-foreground'}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-2">
        {showActions && (
          <div className="flex gap-2">
            {phone && (
              <button className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <Phone size={16} />
              </button>
            )}
            {email && (
              <button className="p-2 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors">
                <Mail size={16} />
              </button>
            )}
          </div>
        )}
        {onClick && (
          <ChevronRight size={20} className="text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
