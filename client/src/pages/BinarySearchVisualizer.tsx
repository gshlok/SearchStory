import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import SpriteAnimation, { SpriteState } from '@/components/SpriteAnimation';
import ArrayElement from '@/components/ArrayElement';
import { Play, RotateCcw, Sparkles } from 'lucide-react';
import layer0 from '@assets/Layer_0000_9_1760630184411.png';
import layer1 from '@assets/Layer_0001_8_1760630184412.png';
import layer2 from '@assets/Layer_0002_7_1760630184412.png';
import layer3 from '@assets/Layer_0003_6_1760630184413.png';
import layer4 from '@assets/Layer_0004_Lights_1760630184413.png';
import layer5 from '@assets/Layer_0005_5_1760630184414.png';
import layer6 from '@assets/Layer_0006_4_1760630184415.png';
import layer7 from '@assets/Layer_0007_Lights_1760630184415.png';
import layer8 from '@assets/Layer_0008_3_1760630184416.png';
import layer9 from '@assets/Layer_0009_2_1760630184417.png';
import layer10 from '@assets/Layer_0010_1_1760630184418.png';
import layer11 from '@assets/Layer_0011_0_1760630184418.png';

export default function BinarySearchVisualizer() {
  const [array, setArray] = useState<number[]>([3, 7, 12, 18, 25, 31, 42, 56, 67, 73]);
  const [target, setTarget] = useState<string>('42');
  const [searchState, setSearchState] = useState<'idle' | 'searching' | 'found' | 'notfound'>('idle');
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [eliminatedIndices, setEliminatedIndices] = useState<Set<number>>(new Set());
  const [spriteState, setSpriteState] = useState<SpriteState>('IDLE');
  const [spritePosition, setSpritePosition] = useState({ x: 100, y: 450 }); // Adjusted sprite position
  const [stepCount, setStepCount] = useState(0);
  const [searchBoundaries, setSearchBoundaries] = useState<{ left: number; right: number } | null>(null);
  const [arrayOffset, setArrayOffset] = useState(200); // Dynamic offset for array positioning
  const [showSlashEffect, setShowSlashEffect] = useState(false); // Visual slash effect
  const arrayRef = useRef<HTMLDivElement>(null);

  const generateNewArray = () => {
    const size = 8 + Math.floor(Math.random() * 5);
    const newArray: number[] = [];
    let current = Math.floor(Math.random() * 10) + 1;
    
    for (let i = 0; i < size; i++) {
      newArray.push(current);
      current += Math.floor(Math.random() * 10) + 3;
    }
    
    setArray(newArray);
    setTarget(newArray[Math.floor(Math.random() * newArray.length)].toString());
    resetSearch();
  };

  const resetSearch = () => {
    setSearchState('idle');
    setCurrentIndex(null);
    setEliminatedIndices(new Set());
    setSpriteState('IDLE');
    setSpritePosition({ x: 100, y: 450 }); // Keep sprite in adjusted position
    setStepCount(0);
    setSearchBoundaries(null);
    setArrayOffset(200); // Reset array offset
    setShowSlashEffect(false); // Reset slash effect
  };

  const getElementPosition = (index: number) => {
    if (!arrayRef.current) return { x: 50, y: 300 };
    
    const arrayContainer = arrayRef.current;
    const element = arrayContainer.children[index] as HTMLElement;
    
    if (element) {
      const containerRect = arrayContainer.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      
      return {
        x: elementRect.left - containerRect.left + elementRect.width / 2,
        y: 300, // Keep sprite at the same vertical level
      };
    }
    
    return { x: 50, y: 300 };
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const startSearch = () => {
    const targetNum = parseInt(target);
    if (isNaN(targetNum)) return;

    setSearchState('searching');
    setStepCount(0);
    setEliminatedIndices(new Set());
    setSearchBoundaries({ left: 0, right: array.length - 1 });
    setSpriteState('IDLE');
    setSpritePosition({ x: 100, y: 450 }); // Keep sprite in adjusted position
  };

  const nextStep = async () => {
    if (!searchBoundaries) return;
    const targetNum = parseInt(target);
    const { left, right } = searchBoundaries;

    if (left > right) {
      setSearchState('notfound');
      setSpriteState('THINKING');
      await sleep(1200);
      setSpriteState('IDLE');
      setSearchBoundaries(null);
      return;
    }

    const mid = Math.floor((left + right) / 2);
    setStepCount(prev => prev + 1);

    // Set current index without moving sprite
    setCurrentIndex(mid);
    await sleep(1200);

    if (array[mid] === targetNum) {
      setSpriteState('THINKING');
      setSearchState('found');
      await sleep(1500);
      setSpriteState('IDLE');
      setSearchBoundaries(null);
      return;
    }

    // Attack animation when eliminating half the array
    setSpriteState('ATTACK');
    setShowSlashEffect(true); // Show slash effect
    await sleep(800);

    const eliminated = new Set(eliminatedIndices);
    let newOffset = arrayOffset;
    
    if (array[mid] < targetNum) {
      // Eliminate left half, move array right
      for (let i = left; i <= mid; i++) {
        eliminated.add(i);
      }
      setSearchBoundaries({ left: mid + 1, right });
      newOffset = arrayOffset + 50; // Move array further right
    } else {
      // Eliminate right half, move array left
      for (let i = mid; i <= right; i++) {
        eliminated.add(i);
      }
      setSearchBoundaries({ left, right: mid - 1 });
      newOffset = arrayOffset - 50; // Move array further left
    }

    setEliminatedIndices(eliminated);
    setArrayOffset(newOffset);
    setCurrentIndex(null);
    await sleep(800);
    setSpriteState('IDLE');
    setShowSlashEffect(false); // Hide slash effect
  };

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Layered Background */}
      <div className="absolute inset-0 z-0">
        <img src={layer11} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <img src={layer10} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <img src={layer9} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <img src={layer8} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <img src={layer7} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <img src={layer6} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <img src={layer5} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <img src={layer4} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <img src={layer3} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <img src={layer2} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <img src={layer1} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <img src={layer0} alt="" className="absolute inset-0 w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-screen flex flex-col">
        <div className="text-center py-4 px-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2 drop-shadow-lg" data-testid="text-title">
            Binary Search Adventure
          </h1>
          <p className="text-sm text-white/90 max-w-2xl mx-auto drop-shadow">
            Watch the sprite hero search through a sorted array using the binary search algorithm
          </p>
        </div>

        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col justify-end pb-6 px-4">
            <div className="w-full max-w-2xl">
              <div className="relative h-80 flex flex-col justify-end items-center">
                <div 
                  ref={arrayRef}
                  className="flex flex-col gap-2 justify-center items-center mb-4 transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(${arrayOffset}px)` }}
                >
                  {array.map((value, index) => (
                    <ArrayElement
                      key={index}
                      value={value}
                      index={index}
                      isActive={currentIndex === index}
                      isTarget={searchState === 'found' && currentIndex === index}
                      isEliminated={eliminatedIndices.has(index)}
                    />
                  ))}
                </div>

                <SpriteAnimation
                  state={spriteState}
                  position={spritePosition}
                  scale={7}
                />

                {/* Slash Effect */}
                {showSlashEffect && (
                  <div 
                    className="absolute pointer-events-none"
                    style={{
                      left: `${spritePosition.x + 200}px`,
                      top: `${spritePosition.y - 200}px`,
                      width: '300px',
                      height: '400px',
                      background: 'linear-gradient(45deg, transparent 40%, rgba(255, 0, 0, 0.3) 50%, transparent 60%)',
                      transform: 'rotate(-15deg)',
                      animation: 'slashEffect 0.8s ease-out',
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="w-96 p-6 flex items-end pb-6">
            <Card className="p-8 w-full bg-card/90 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-6 text-card-foreground">Search Controls</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-base text-muted-foreground mb-3 block">Target Number</label>
                  <Input
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    disabled={searchState === 'searching'}
                    className="font-mono h-12 text-lg"
                    data-testid="input-target"
                  />
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={startSearch}
                    disabled={searchState === 'searching'}
                    className="w-full h-12 text-lg"
                    data-testid="button-search"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Search
                  </Button>

                  <Button
                    onClick={nextStep}
                    disabled={!searchBoundaries || searchState === 'found' || searchState === 'notfound'}
                    className="w-full h-12 text-lg"
                    variant="secondary"
                    data-testid="button-next-step"
                  >
                    Next Step
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={generateNewArray}
                    disabled={searchState === 'searching'}
                    variant="outline"
                    className="h-12"
                    data-testid="button-new-array"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    New Array
                  </Button>

                  <Button
                    onClick={resetSearch}
                    disabled={searchState === 'searching'}
                    variant="outline"
                    className="h-12"
                    data-testid="button-reset"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
