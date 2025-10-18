import React, { useState, useEffect } from 'react';

interface WindBlownTextProps {
  text: string;
  isActive: boolean;
  onCompletion: () => void;
}

const WindBlownText: React.FC<WindBlownTextProps> = ({ text, isActive, onCompletion }) => {
  const [blownChars, setBlownChars] = useState<Set<number>>(new Set());

  // Reset when text changes
  useEffect(() => {
    setBlownChars(new Set());
  }, [text]);

  // Start animation when isActive becomes true
  useEffect(() => {
    if (isActive) {
      let currentIndex = 0;
      const chars = text.split('');
      
      const animateNextChar = () => {
        if (currentIndex < chars.length) {
          setBlownChars(prev => new Set(prev).add(currentIndex));
          currentIndex++;
          
          // Fast delay between characters
          const delay = 1 + Math.random() * 3;
          setTimeout(animateNextChar, delay);
        } else {
          // All characters have been animated
          setTimeout(() => {
            onCompletion();
          }, 100);
        }
      };
      
      // Start the animation
      animateNextChar();
    }
  }, [isActive, text, onCompletion]);

  if (!isActive) {
    return <>{text}</>;
  }

  return (
    <>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className={`inline-block transition-all duration-300 ${
            blownChars.has(index) 
              ? 'animate-windBlownCharFadeOut' 
              : 'opacity-100'
          }`}
          style={{
            animationDelay: blownChars.has(index) ? `${index * 0.001}s` : '0s',
            animationFillMode: 'forwards'
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </>
  );
};

export default WindBlownText;