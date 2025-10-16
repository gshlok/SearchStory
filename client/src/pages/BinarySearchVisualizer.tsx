import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SpriteAnimation, { SpriteState } from '@/components/SpriteAnimation';
import ArrayElement from '@/components/ArrayElement';
import { Play, RotateCcw, Sparkles } from 'lucide-react';

export default function BinarySearchVisualizer() {
  const [array, setArray] = useState<number[]>([3, 7, 12, 18, 25, 31, 42, 56, 67, 73]);
  const [target, setTarget] = useState<string>('42');
  const [searchState, setSearchState] = useState<'idle' | 'searching' | 'found' | 'notfound'>('idle');
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [eliminatedIndices, setEliminatedIndices] = useState<Set<number>>(new Set());
  const [spriteState, setSpriteState] = useState<SpriteState>('IDLE');
  const [spritePosition, setSpritePosition] = useState({ x: 100, y: 180 });
  const [stepCount, setStepCount] = useState(0);
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
    setSpritePosition({ x: 100, y: 180 });
    setStepCount(0);
  };

  const getElementPosition = (index: number) => {
    if (!arrayRef.current) return { x: 100, y: 180 };
    
    const arrayContainer = arrayRef.current;
    const element = arrayContainer.children[index] as HTMLElement;
    
    if (element) {
      const containerRect = arrayContainer.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      
      return {
        x: elementRect.left - containerRect.left + elementRect.width / 2,
        y: elementRect.top - containerRect.top - 60,
      };
    }
    
    return { x: 100, y: 180 };
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const startSearch = async () => {
    const targetNum = parseInt(target);
    if (isNaN(targetNum)) return;

    setSearchState('searching');
    setStepCount(0);
    setEliminatedIndices(new Set());
    
    let left = 0;
    let right = array.length - 1;
    let steps = 0;

    while (left <= right) {
      steps++;
      setStepCount(steps);
      
      const mid = Math.floor((left + right) / 2);
      
      setSpriteState('RUN');
      const midPosition = getElementPosition(mid);
      setSpritePosition(midPosition);
      
      await sleep(600);
      
      setSpriteState('IDLE');
      setCurrentIndex(mid);
      
      await sleep(800);

      if (array[mid] === targetNum) {
        setSpriteState('ATTACK');
        setSearchState('found');
        await sleep(1000);
        setSpriteState('IDLE');
        return;
      }

      setSpriteState('HURT');
      await sleep(400);
      
      const newEliminated = new Set(eliminatedIndices);
      
      if (array[mid] < targetNum) {
        for (let i = left; i <= mid; i++) {
          newEliminated.add(i);
        }
        left = mid + 1;
      } else {
        for (let i = mid; i <= right; i++) {
          newEliminated.add(i);
        }
        right = mid - 1;
      }
      
      setEliminatedIndices(newEliminated);
      setCurrentIndex(null);
      
      await sleep(600);
      setSpriteState('IDLE');
      await sleep(200);
    }

    setSearchState('notfound');
    setSpriteState('HURT');
    await sleep(800);
    setSpriteState('IDLE');
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-4" data-testid="text-title">
            Binary Search Adventure
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch the sprite hero search through a sorted array using the binary search algorithm
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2 p-8">
            <div className="relative min-h-[400px]">
              <div 
                ref={arrayRef}
                className="flex gap-3 justify-center mb-20 flex-wrap"
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
                scale={1.5}
              />

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-border rounded-full" />
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-card-foreground">Search Controls</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Target Number</label>
                  <Input
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    disabled={searchState === 'searching'}
                    className="font-mono"
                    data-testid="input-target"
                  />
                </div>

                <Button
                  onClick={startSearch}
                  disabled={searchState === 'searching'}
                  className="w-full"
                  data-testid="button-search"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Search
                </Button>

                <Button
                  onClick={generateNewArray}
                  disabled={searchState === 'searching'}
                  variant="outline"
                  className="w-full"
                  data-testid="button-new-array"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  New Array
                </Button>

                <Button
                  onClick={resetSearch}
                  disabled={searchState === 'searching'}
                  variant="outline"
                  className="w-full"
                  data-testid="button-reset"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-card-foreground">Algorithm Stats</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={
                    searchState === 'found' ? 'default' : 
                    searchState === 'searching' ? 'secondary' :
                    searchState === 'notfound' ? 'destructive' : 'outline'
                  } data-testid="badge-status">
                    {searchState === 'idle' && 'Ready'}
                    {searchState === 'searching' && 'Searching...'}
                    {searchState === 'found' && 'Found!'}
                    {searchState === 'notfound' && 'Not Found'}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Steps</span>
                  <Badge variant="outline" data-testid="badge-steps">
                    {stepCount}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Array Size</span>
                  <Badge variant="outline" data-testid="badge-size">
                    {array.length}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Complexity</span>
                  <Badge variant="outline" className="font-mono" data-testid="badge-complexity">
                    O(log n)
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="text-lg font-semibold mb-3 text-foreground">How It Works</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Sprite moves to the middle element</li>
                <li>• Compares value with target</li>
                <li>• Eliminates half of the array</li>
                <li>• Repeats until target is found</li>
                <li>• Much faster than linear search!</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
