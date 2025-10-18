import { useEffect, useRef } from 'react';

class RainDrop {
  x: number;
  y: number;
  scale: number;
  length: number;
  vx: number;
  vy: number;
  ay: number;
  theta: number;
  offset: number;
  radius: number;
  width: number;
  height: number;

  constructor(width: number, height: number, toInit: boolean, scaleRange: { min: number; max: number }, velocityRange: { min: number; max: number }, 
              velocityRate: number, lengthRate: number, accelerationRate: number, verticalOffsetRate: number, 
              frontThreshold: number, reflectionRadiusRate: number) {
    this.width = width;
    this.height = height;
    this.scale = scaleRange.min + (scaleRange.max - scaleRange.min) * Math.random();
    this.length = lengthRate * this.scale;
    this.vx = (velocityRange.min + (velocityRange.max - velocityRange.min) * Math.random()) * this.scale;
    this.vy = velocityRate * this.scale;
    this.ay = accelerationRate * this.scale;
    this.theta = Math.atan2(this.vy, this.vx);
    this.offset = height * verticalOffsetRate;
    this.x = (Math.random() * (width - height * Math.cos(this.theta)));
    this.y = (toInit ? Math.random() * height : 0) - this.offset;
    this.radius = this.length * reflectionRadiusRate;
  }

  render(context: CanvasRenderingContext2D, toFront: boolean, frontThreshold: number): boolean {
    if (toFront && this.scale < frontThreshold || !toFront && this.scale >= frontThreshold) {
      return true;
    }

    context.save();
    context.strokeStyle = 'rgba(255, 255, 255, 0.8)'; // White raindrops
    
    if (this.y >= this.height * (1 - (1 - this.scale) * 0.6) - this.offset) {
      context.lineWidth = 3;
      context.globalAlpha = (1 - this.radius / this.length / 0.2) * 0.8;
      context.beginPath();
      context.arc(this.x, this.y, this.radius, Math.PI, Math.PI * 2, false);
      context.stroke();
      context.restore();
      
      this.radius *= 1.05;
      return this.radius <= this.length * 0.2;
    } else {
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(this.x, this.y);
      context.lineTo(this.x + this.length * Math.cos(this.theta), this.y + this.length * Math.sin(this.theta));
      context.stroke();
      context.restore();
      
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.ay;
      return true;
    }
  }
}

const RainEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rainDropsRef = useRef<RainDrop[]>([]);
  const animationRef = useRef<number>(0);

  // Configuration constants
  const INIT_RAIN_DROP_COUNT = 500;
  const RAIN_DROP_COUNT = 5;
  const HUE_OFFSET = Math.PI / 1000;
  const LUMINANCE_OFFSET = Math.PI / 1500;

  // Rain drop configuration
  const SCALE_RANGE = { min: 0.2, max: 1 };
  const VELOCITY_RANGE = { min: -1.5, max: -1 };
  const VELOCITY_RATE = 3;
  const LENGTH_RATE = 20;
  const ACCELERATION_RATE = 0.01;
  const VERTICAL_OFFSET_RATE = 0.04;
  const FRONT_THRESHOLD = 0.8;
  const REFLECTION_RADIUS_RATE = 0.02;

  const createRainDrops = (count: number, toInit: boolean, width: number, height: number) => {
    for (let i = 0; i < count; i++) {
      rainDropsRef.current.push(new RainDrop(
        width, height, toInit,
        SCALE_RANGE, VELOCITY_RANGE, VELOCITY_RATE, LENGTH_RATE, 
        ACCELERATION_RATE, VERTICAL_OFFSET_RATE, FRONT_THRESHOLD, REFLECTION_RADIUS_RATE
      ));
    }
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear with transparent background instead of colored background
    context.clearRect(0, 0, width, height);
    
    // Render rain drops (back)
    for (let i = rainDropsRef.current.length - 1; i >= 0; i--) {
      if (!rainDropsRef.current[i].render(context, false, FRONT_THRESHOLD)) {
        rainDropsRef.current.splice(i, 1);
      }
    }
    
    // Render rain drops (front)
    for (let i = rainDropsRef.current.length - 1; i >= 0; i--) {
      if (!rainDropsRef.current[i].render(context, true, FRONT_THRESHOLD)) {
        rainDropsRef.current.splice(i, 1);
      }
    }
    
    // Create new rain drops
    createRainDrops(RAIN_DROP_COUNT, false, width, height);
    
    animationRef.current = requestAnimationFrame(render);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set canvas size
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
    
    // Clear array
    rainDropsRef.current = [];
    
    // Create initial rain drops
    createRainDrops(INIT_RAIN_DROP_COUNT, true, canvas.width, canvas.height);
    
    // Start animation
    animationRef.current = requestAnimationFrame(render);
    
    // Handle resize
    const handleResize = () => {
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        
        // Recreate rain drops on resize
        rainDropsRef.current = [];
        createRainDrops(INIT_RAIN_DROP_COUNT, true, canvas.width, canvas.height);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default RainEffect;