import { useEffect, useState } from 'react';
import idleSprite from '@assets/IDLE_1760629410247.png';
import runSprite from '@assets/RUN_1760629410248.png';
import attackSprite from '@assets/ATTACK 1_1760629410245.png';
import hurtSprite from '@assets/HURT_1760629410246.png';

export type SpriteState = 'IDLE' | 'RUN' | 'ATTACK' | 'HURT';

interface SpriteAnimationProps {
  state: SpriteState;
  position: { x: number; y: number };
  scale?: number;
  onAnimationComplete?: () => void;
}

const SPRITE_FRAMES = {
  IDLE: 10,
  RUN: 16,
  ATTACK: 7,
  HURT: 4,
};

const SPRITE_DIMENSIONS = {
  IDLE: { width: 96, height: 96 },
  RUN: { width: 64, height: 64 },
  ATTACK: { width: 137, height: 96 },
  HURT: { width: 96, height: 96 },
};

const SPRITE_SHEETS = {
  IDLE: idleSprite,
  RUN: runSprite,
  ATTACK: attackSprite,
  HURT: hurtSprite,
};

export default function SpriteAnimation({ 
  state, 
  position, 
  scale = 1,
  onAnimationComplete 
}: SpriteAnimationProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const frames = SPRITE_FRAMES[state];
  const dimensions = SPRITE_DIMENSIONS[state];

  useEffect(() => {
    setCurrentFrame(0);
    
    const frameDelay = state === 'ATTACK' || state === 'HURT' ? 80 : 100;
    const interval = setInterval(() => {
      setCurrentFrame(prev => {
        const nextFrame = prev + 1;
        if (nextFrame >= frames) {
          if (state === 'ATTACK' || state === 'HURT') {
            onAnimationComplete?.();
          }
          return 0;
        }
        return nextFrame;
      });
    }, frameDelay);

    return () => clearInterval(interval);
  }, [state, frames, onAnimationComplete]);

  const getSpriteSheet = () => {
    return SPRITE_SHEETS[state];
  };

  return (
    <div
      className="absolute pointer-events-none transition-all duration-500 ease-in-out"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${dimensions.width * scale}px`,
        height: `${dimensions.height * scale}px`,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `url(${getSpriteSheet()})`,
          backgroundPosition: `-${currentFrame * dimensions.width * scale}px 0`,
          backgroundSize: `${dimensions.width * frames * scale}px ${dimensions.height * scale}px`,
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
}
