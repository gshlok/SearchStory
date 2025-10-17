import { useState } from 'react';
import SpriteAnimation, { SpriteState } from '../SpriteAnimation';
import { Button } from '@/components/ui/button';

export default function SpriteAnimationExample() {
  const [state, setState] = useState<SpriteState>('IDLE');

  return (
    <div className="relative w-full h-96 bg-background border border-border rounded-lg overflow-hidden">
      <SpriteAnimation 
        state={state} 
        position={{ x: 200, y: 200 }} 
        scale={1.5}
        onAnimationComplete={() => {
          if (state === 'ATTACK' || state === 'THINKING') {
            setState('IDLE');
          }
        }}
      />
      
      <div className="absolute bottom-4 left-4 flex gap-2">
        <Button onClick={() => setState('IDLE')} variant={state === 'IDLE' ? 'default' : 'outline'} size="sm" data-testid="button-idle">
          Idle
        </Button>
        <Button onClick={() => setState('ATTACK')} variant={state === 'ATTACK' ? 'default' : 'outline'} size="sm" data-testid="button-attack">
          Attack
        </Button>
        <Button onClick={() => setState('THINKING')} variant={state === 'THINKING' ? 'default' : 'outline'} size="sm" data-testid="button-thinking">
          Thinking
        </Button>
      </div>
    </div>
  );
}
