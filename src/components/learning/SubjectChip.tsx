import { Subject } from '@/types/learning';
import { cn } from '@/lib/utils';

interface SubjectChipProps {
  subject: Subject;
  isWeak?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const subjectConfig: Record<Subject, { name: string; icon: string; chipClass: string }> = {
  OS: { name: 'Operating Systems', icon: '💻', chipClass: 'chip-os' },
  DBMS: { name: 'Database Management', icon: '🗄️', chipClass: 'chip-dbms' },
  CN: { name: 'Computer Networks', icon: '🌐', chipClass: 'chip-cn' },
  AI: { name: 'Artificial Intelligence', icon: '🤖', chipClass: 'chip-ai' },
  ML: { name: 'Machine Learning', icon: '📊', chipClass: 'chip-ml' },
};

export const SubjectChip = ({ subject, isWeak, size = 'md', showIcon = true }: SubjectChipProps) => {
  const config = subjectConfig[subject];
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium text-white shadow-md transition-all duration-200 hover:scale-105',
        config.chipClass,
        sizeClasses[size],
        isWeak && 'ring-2 ring-destructive ring-offset-2'
      )}
    >
      {showIcon && <span>{config.icon}</span>}
      <span>{subject}</span>
    </span>
  );
};

export const SubjectBadge = ({ subject, score }: { subject: Subject; score: number }) => {
  const config = subjectConfig[subject];
  const isWeak = score < 60;

  return (
    <div className={cn(
      'flex items-center justify-between p-3 rounded-xl border transition-all duration-200 hover:shadow-md',
      isWeak 
        ? 'border-destructive/30 bg-destructive/5' 
        : 'border-success/30 bg-success/5'
    )}>
      <div className="flex items-center gap-2">
        <span className="text-xl">{config.icon}</span>
        <div>
          <p className="font-medium text-foreground">{config.name}</p>
          <p className="text-xs text-muted-foreground">{subject}</p>
        </div>
      </div>
      <div className={cn(
        'text-lg font-bold',
        isWeak ? 'text-destructive' : 'text-success'
      )}>
        {score}%
      </div>
    </div>
  );
};

export { subjectConfig };
