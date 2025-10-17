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
        "min-w-12 min-h-14 flex items-center justify-center rounded-lg border transition-all duration-500",
        "bg-gradient-to-br from-amber-800/80 to-red-800/80 border-amber-600/60 shadow-lg",
        isActive && "ring-2 ring-amber-400 shadow-xl shadow-amber-400/30 scale-105 z-10 bg-gradient-to-br from-amber-700/90 to-red-700/90",
        isTarget && "bg-gradient-to-br from-green-800/80 to-emerald-800/80 border-green-500/60 ring-2 ring-green-400 shadow-xl shadow-green-400/30",
        isEliminated && "opacity-0 scale-75 pointer-events-none"
      )}
      data-testid={`array-element-${index}`}
      style={{
        boxShadow: isActive 
          ? '0 0 20px rgba(255,215,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)' 
          : isTarget 
            ? '0 0 20px rgba(34,197,94,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
            : '0 0 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
      }}
    >
      <span className={cn(
        "text-lg font-serif font-bold",
        isActive && "text-amber-200",
        isTarget && "text-green-200",
        !isActive && !isTarget && "text-amber-100"
      )}
      style={{ 
        fontFamily: 'Libre Baskerville, serif',
        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
      }}>
        {value}
      </span>
    </div>
  );
}
