import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface ArrayElementProps {
  value: number;
  isActive?: boolean;
  isTarget?: boolean;
  isEliminated?: boolean;
  index: number;
  highlight?: boolean; // New prop for sorting highlight
  isSwapping?: boolean; // New prop for swap animation
  swapDirection?: 'left' | 'right'; // New prop for swap direction
  onEdit?: (index: number, newValue: number) => void; // New prop for editing
  isEditing?: boolean; // New prop to indicate if this element is being edited
}

export default function ArrayElement({ 
  value, 
  isActive, 
  isTarget, 
  isEliminated,
  index,
  highlight,
  isSwapping,
  swapDirection,
  onEdit,
  isEditing
}: ArrayElementProps) {
  const [isEditingValue, setIsEditingValue] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());

  // Update editValue when the prop value changes
  useEffect(() => {
    setEditValue(value.toString());
  }, [value]);

  const handleEditClick = () => {
    if (onEdit) {
      setIsEditingValue(true);
    }
  };

  const handleSave = () => {
    if (onEdit) {
      const numValue = parseInt(editValue);
      if (!isNaN(numValue)) {
        onEdit(index, numValue);
      }
      setIsEditingValue(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value.toString());
    setIsEditingValue(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditingValue) {
    return (
      <div
        className={cn(
          "min-w-12 min-h-14 flex items-center justify-center rounded-lg border transition-all duration-500",
          "bg-gradient-to-br from-amber-800/80 to-red-800/80 border-amber-600/60 shadow-lg",
          isActive && "ring-2 ring-amber-400 shadow-xl shadow-amber-400/30 scale-105 z-10 bg-gradient-to-br from-amber-700/90 to-red-700/90",
          isTarget && "bg-gradient-to-br from-green-800/80 to-emerald-800/80 border-green-500/60 ring-2 ring-green-400 shadow-xl shadow-green-400/30",
          isEliminated && "opacity-0 scale-75 pointer-events-none",
          highlight && "ring-2 ring-blue-400 shadow-xl shadow-blue-400/30 bg-gradient-to-br from-blue-700/90 to-indigo-700/90"
        )}
        style={{
          boxShadow: isActive 
            ? '0 0 20px rgba(255,215,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)' 
            : isTarget 
              ? '0 0 20px rgba(34,197,94,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
              : highlight
                ? '0 0 20px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
                : '0 0 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}
      >
        <input
          type="number"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          autoFocus
          className="w-16 text-center bg-amber-900/50 text-amber-100 border border-amber-600 rounded px-1 font-serif font-bold"
          style={{ 
            fontFamily: 'Libre Baskerville, serif',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-w-12 min-h-14 flex items-center justify-center rounded-lg border transition-all duration-500 cursor-pointer",
        "bg-gradient-to-br from-amber-800/80 to-red-800/80 border-amber-600/60 shadow-lg",
        isActive && "ring-2 ring-amber-400 shadow-xl shadow-amber-400/30 scale-105 z-10 bg-gradient-to-br from-amber-700/90 to-red-700/90",
        isTarget && "bg-gradient-to-br from-green-800/80 to-emerald-800/80 border-green-500/60 ring-2 ring-green-400 shadow-xl shadow-green-400/30",
        isEliminated && "opacity-0 scale-75 pointer-events-none",
        highlight && "ring-2 ring-blue-400 shadow-xl shadow-blue-400/30 bg-gradient-to-br from-blue-700/90 to-indigo-700/90",
        isSwapping && swapDirection === 'left' && "translate-x-[-100%] transition-transform duration-300",
        isSwapping && swapDirection === 'right' && "translate-x-[100%] transition-transform duration-300"
      )}
      onClick={handleEditClick}
      data-testid={`array-element-${index}`}
      style={{
        boxShadow: isActive 
          ? '0 0 20px rgba(255,215,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)' 
          : isTarget 
            ? '0 0 20px rgba(34,197,94,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
            : highlight
              ? '0 0 20px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
              : '0 0 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
      }}
    >
      <span className={cn(
        "text-lg font-serif font-bold",
        isActive && "text-amber-200",
        isTarget && "text-green-200",
        highlight && "text-blue-200",
        !isActive && !isTarget && !highlight && "text-amber-100"
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