import { cn } from '@/lib/utils';

interface ArrayElementProps {
  value: number;
  isActive?: boolean;
  isTarget?: boolean;
  isEliminated?: boolean;
  index: number;
}

export default function ArrayElement({ 
  value, 
  isActive, 
  isTarget, 
  isEliminated,
  index 
}: ArrayElementProps) {
  return (
    <div
      className={cn(
        "min-w-16 min-h-20 flex items-center justify-center rounded-lg border transition-all duration-500",
        "bg-card border-card-border",
        isActive && "ring-2 ring-primary shadow-lg shadow-primary/20 scale-105 z-10",
        isTarget && "bg-chart-2/20 border-chart-2 ring-2 ring-chart-2 shadow-lg shadow-chart-2/30",
        isEliminated && "opacity-0 scale-75 pointer-events-none"
      )}
      data-testid={`array-element-${index}`}
    >
      <span className={cn(
        "text-2xl font-mono font-semibold",
        isActive && "text-primary",
        isTarget && "text-chart-2",
        !isActive && !isTarget && "text-card-foreground"
      )}>
        {value}
      </span>
    </div>
  );
}
