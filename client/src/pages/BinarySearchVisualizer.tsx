import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';
import SpriteAnimation, { SpriteState } from '@/components/SpriteAnimation';
import ArrayElement from '@/components/ArrayElement';
import RainEffect from '@/components/RainEffect';
import WindBlownText from '@/components/WindBlownText';
import { useTypewriter } from '@/hooks/useTypewriter';
import { Play, RotateCcw, Sparkles, ArrowUp } from 'lucide-react';
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
  const [array, setArray] = useState<number[]>([7, 3, 18, 12, 25, 42, 31, 56, 67]);
  const [target, setTarget] = useState<string>('3');
  const [searchState, setSearchState] = useState<'idle' | 'searching' | 'found' | 'notfound'>('idle');
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [secondIndex, setSecondIndex] = useState<number | null>(null); // For bubble sort comparison
  const [eliminatedIndices, setEliminatedIndices] = useState<Set<number>>(new Set());
  const [spriteState, setSpriteState] = useState<SpriteState>('IDLE');
  const [spritePosition, setSpritePosition] = useState({ x: 100, y: 450 }); // Adjusted sprite position
  const [stepCount, setStepCount] = useState(0);
  const [searchBoundaries, setSearchBoundaries] = useState<{ left: number; right: number } | null>(null);
  const [arrayOffset, setArrayOffset] = useState(200); // Dynamic offset for array positioning
  const [showSlashEffect, setShowSlashEffect] = useState(false); // Visual slash effect
  const [isSorting, setIsSorting] = useState(false); // New state for sorting
  const [sortingStep, setSortingStep] = useState<{ i: number, j: number } | null>(null); // Track current sorting positions
  const [swappingElements, setSwappingElements] = useState<{ index: number, direction: 'left' | 'right' } | null>(null); // Track swapping elements
  const [isReady, setIsReady] = useState(false); // New state to control visibility
  const [showContent, setShowContent] = useState(false); // New state for fade-in animation
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // New state for tracking which element is being edited
  const [fadeOutText, setFadeOutText] = useState(false); // New state for text fade-out animation
  const [isRainActive, setIsRainActive] = useState(false); // New state to control rain effect
  const arrayRef = useRef<HTMLDivElement>(null);
  const [isProblemOpen, setIsProblemOpen] = useState(false);
  const [problemText, setProblemText] = useState<string>("");
  const [problemTitle, setProblemTitle] = useState<string>("Samurai and the Hidden Plank");
  const [problemBody, setProblemBody] = useState<string>("");
  const [showUnsortedDialog, setShowUnsortedDialog] = useState(false);

  // Add new state for button positioning
  const [isButtonExpanded, setIsButtonExpanded] = useState(false);

  // Initialize typewriter effect for the descriptive text
  const { displayText } = useTypewriter({
    text: "Follow the warrior's journey as he searches through the ancient scrolls using the sacred binary search technique",
    speed: 30,
    delay: 500
  });

  // Handle fade-in animation when content becomes visible
  useEffect(() => {
    if (isReady) {
      // Small delay to ensure DOM is ready before starting animation
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  useEffect(() => {
    fetch('/api/problem-statement')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((text) => {
        // Check if the response looks like HTML
        if (text.trim().startsWith('<') || text.includes('<html') || text.includes('<!DOCTYPE')) {
          throw new Error('Received HTML instead of plain text');
        }
        setProblemText(text);
      })
      .catch((error) => {
        console.error('Error fetching problem statement from API:', error);
        // Fallback to loading from the local public directory
        return fetch('/problem_statement.txt')
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
          })
          .then((text) => {
            console.log('Successfully loaded problem statement from local file');
            setProblemText(text);
          })
          .catch((localError) => {
            console.error('Error fetching problem statement from local file:', localError);
            setProblemText("Failed to load problem statement.");
          });
      });
  }, []);

  useEffect(() => {
    if (!problemText) {
      setProblemTitle("Samurai and the Hidden Plank");
      setProblemBody("");
      return;
    }

    // Check if we received an error message
    if (problemText === "Failed to load problem statement.") {
      setProblemTitle("Problem Statement");
      setProblemBody("Failed to load problem statement.");
      return;
    }

    // Check if we received a 404 message
    if (problemText === "Problem statement file not found.") {
      setProblemTitle("Problem Statement");
      setProblemBody("Problem statement file not found.");
      return;
    }

    const lines = problemText.split(/\r?\n/);
    // find first non-empty line as title
    const firstNonEmptyIndex = lines.findIndex((l) => l.trim().length > 0);
    if (firstNonEmptyIndex === -1) {
      setProblemTitle("Samurai and the Hidden Plank");
      setProblemBody("");
      return;
    }

    const titleLine = lines[firstNonEmptyIndex].trim();
    // body is everything after the title line
    const bodyLines = lines.slice(firstNonEmptyIndex + 1);
    setProblemTitle(titleLine);
    setProblemBody(bodyLines.join("\n").trimStart());
  }, [problemText]);

  const generateNewArray = () => {
    const size = 5 + Math.floor(Math.random() * 5); // Now generates 5-9 elements
    const newArray: number[] = [];
    let current = Math.floor(Math.random() * 10) + 1;

    for (let i = 0; i < size; i++) {
      newArray.push(current);
      current += Math.floor(Math.random() * 10) + 3;
    }

    // Shuffle the array to make it unsorted
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    setArray(newArray);
    setTarget(newArray[Math.floor(Math.random() * newArray.length)].toString());
    resetSearch();
  };

  const resetSearch = () => {
    setSearchState('idle');
    setCurrentIndex(null);
    setSecondIndex(null);
    setEliminatedIndices(new Set());
    setSpriteState('IDLE');
    setSpritePosition({ x: 100, y: 450 }); // Keep sprite in adjusted position
    setStepCount(0);
    setSearchBoundaries(null);
    setArrayOffset(200); // Reset array offset
    setShowSlashEffect(false); // Reset slash effect
    setIsSorting(false);
    setSortingStep(null);
    setSwappingElements(null); // Reset swapping elements
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

  // New bubble sort function with animations
  const bubbleSort = async () => {
    if (isSorting) return;

    setIsSorting(true);
    setSearchState('searching'); // Disable other controls during sorting
    let newArray = [...array];
    const n = newArray.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Highlight elements being compared
        setSortingStep({ i: j, j: j + 1 });
        setCurrentIndex(j);
        setSecondIndex(j + 1);
        setSpriteState('IDLE'); // Use idle animation instead of attack

        // Keep sprite in fixed position during sorting
        // Removed the sprite position update that was causing the shift

        await sleep(300); // Increased speed (was 600)

        if (newArray[j] > newArray[j + 1]) {
          // Animate the swap with visual trail
          setSwappingElements({ index: j, direction: 'left' });
          setSwappingElements({ index: j + 1, direction: 'right' });

          // Wait for animation
          await sleep(200);

          // Actually swap the elements
          const temp = newArray[j];
          newArray = [...newArray];
          newArray[j] = newArray[j + 1];
          newArray[j + 1] = temp;
          setArray(newArray);

          // Reset swapping state
          setSwappingElements(null);

          // Visual feedback for swap
          await sleep(100); // Shorter delay for faster animation
        }

        // Reset highlights
        setCurrentIndex(null);
        setSecondIndex(null);
      }
    }

    // Sorting complete
    setSpriteState('THINKING');
    await sleep(500); // Shorter completion delay
    setSpriteState('IDLE');
    setIsSorting(false);
    setSearchState('idle');
    setSortingStep(null);
  };

  // Helper function to check if array is sorted
  const isArraySorted = (arr: number[]): boolean => {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        return false;
      }
    }
    return true;
  };

  const handleElementEdit = (index: number, newValue: number) => {
    const newArray = [...array];
    newArray[index] = newValue;
    setArray(newArray);
    setEditingIndex(null);

    // If the target was this element, update the target as well
    if (target === array[index].toString()) {
      setTarget(newValue.toString());
    }
  };

  const startSearch = () => {
    const targetNum = parseInt(target);
    if (isNaN(targetNum)) return;

    // Check if array is sorted before starting search
    if (!isArraySorted(array)) {
      setShowUnsortedDialog(true);
      return;
    }

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
      {/* Problem Statement Button - always present but changes behavior based on state */}
      <div className={`absolute z-20 transition-all duration-700 ease-in-out ${isReady ? 'top-4 left-4' : 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'}`}>
        {!isReady ? (
          // Before ready: Show in-place when expanded
          isButtonExpanded ? (
            <div className="w-full max-w-3xl">
              <div className="bg-gradient-to-br from-amber-900 to-red-900 border-2 border-amber-700/50 rounded-lg shadow-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl text-amber-100 font-serif tracking-wide" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                    {problemTitle}
                  </h2>
                  <Button
                    onClick={() => setIsButtonExpanded(false)}
                    className="h-8 px-3 bg-amber-800 hover:bg-amber-700 text-amber-100 font-serif"
                    style={{ fontFamily: 'Merriweather, serif' }}
                  >
                    Close
                  </Button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap text-amber-100 leading-relaxed font-serif" style={{ fontFamily: 'Merriweather, serif' }}>
                  {problemBody}
                </div>
                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={() => setIsButtonExpanded(false)}
                    className="h-10 px-6 bg-gradient-to-r from-amber-700 to-red-800 hover:from-amber-600 hover:to-red-700 border-2 border-amber-500/60 text-amber-100 font-serif font-bold shadow-md hover:shadow-amber-500/20"
                    style={{ fontFamily: 'Merriweather, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // Before ready: Show button when not expanded
            <Button
              className="h-12 px-6 text-lg bg-gradient-to-r from-amber-800 to-red-800 hover:from-amber-700 hover:to-red-700 border-2 border-amber-500/60 text-amber-100 font-serif font-bold shadow-lg hover:shadow-amber-500/20 transition-all duration-300"
              style={{ fontFamily: 'Merriweather, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
              onClick={() => setIsButtonExpanded(true)}
            >
              Problem Statement
            </Button>
          )
        ) : (
          // After ready: Always show as dialog button
          <Dialog open={isProblemOpen} onOpenChange={setIsProblemOpen}>
            <DialogTrigger asChild>
              <Button
                className="h-10 px-4 bg-gradient-to-r from-amber-800 to-red-800 hover:from-amber-700 hover:to-red-700 border-2 border-amber-500/60 text-amber-100 font-serif font-bold shadow-md hover:shadow-amber-500/20"
                style={{ fontFamily: 'Merriweather, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
              >
                Problem Statement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl bg-gradient-to-br from-amber-950 to-red-950 border-amber-700/50">
              <DialogHeader>
                <DialogTitle className="text-2xl text-amber-100 font-serif tracking-wide" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  {problemTitle}
                </DialogTitle>
              </DialogHeader>
              <div className="max-h-[70vh] overflow-y-auto whitespace-pre-wrap text-amber-100 leading-relaxed font-serif" style={{ fontFamily: 'Merriweather, serif' }}>
                {problemBody}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

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
        <RainEffect isActive={isRainActive} />
      </div>

      {/* Content */}
      <div className="relative z-10 h-screen flex flex-col">
        <div className="text-center py-4 px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 drop-shadow-lg tracking-wide" data-testid="text-title" style={{ fontFamily: 'Libre Baskerville, serif', textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(255,215,0,0.3)' }}>
            The Samurai's Quest
          </h1>
          <div
            className="text-2xl md:text-3xl text-white/90 max-w-3xl mx-auto drop-shadow font-serif py-2"
            style={{
              fontFamily: 'Merriweather, serif',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            }}
          >
            {fadeOutText ? (
              <WindBlownText
                text="Follow the warrior's journey as he searches through the ancient scrolls using the sacred binary search technique"
                isActive={fadeOutText}
                onCompletion={() => setIsReady(true)}
              />
            ) : (
              <>
                {displayText}
                <span className="ml-1 animate-pulse">|</span>
              </>
            )}
          </div>
        </div>

        {/* Sprite - always visible */}
        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col justify-end pb-6 px-4">
            <div className="w-full max-w-2xl">
              <div className="relative h-80 flex flex-col justify-end items-center">
                {/* Sprite Animation - always visible */}
                <SpriteAnimation
                  state={spriteState}
                  position={spritePosition}
                  scale={7}
                />

                {/* Array and other elements - only visible when ready with fade-in */}
                {isReady && (
                  <div className={`transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
                    <div
                      ref={arrayRef}
                      className="flex flex-col gap-2 justify-center items-center mb-4 transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateX(${arrayOffset}px)` }}
                    >
                      {(() => {
                        // Find min and max values in the current array for scaling
                        const minValue = Math.min(...array);
                        const maxValue = Math.max(...array);
                        
                        return array.map((value, index) => (
                          <ArrayElement
                            key={index}
                            value={value}
                            index={index}
                            isActive={currentIndex === index || secondIndex === index}
                            isTarget={searchState === 'found' && currentIndex === index}
                            isEliminated={eliminatedIndices.has(index)}
                            highlight={sortingStep?.i === index || sortingStep?.j === index} // Highlight during sorting
                            isSwapping={swappingElements?.index === index}
                            swapDirection={swappingElements?.index === index ? swappingElements.direction : undefined}
                            onEdit={handleElementEdit}
                            isEditing={editingIndex === index}
                            minValue={minValue}
                            maxValue={maxValue}
                          />
                        ));
                      })()}
                    </div>

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
                )}
              </div>
            </div>
          </div>

          {/* Control Card - only visible when ready with fade-in */}
          {isReady && (
            <div className={`w-96 p-6 flex items-end pb-6 transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
              <Card className="p-8 w-full bg-gradient-to-br from-amber-900/90 to-red-900/90 backdrop-blur-sm border-2 border-amber-600/50 shadow-2xl" style={{ boxShadow: '0 0 30px rgba(255,215,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
                <h3 className="text-xl font-bold mb-6 text-amber-100 font-serif tracking-wide" style={{ fontFamily: 'Libre Baskerville, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Sacred Scrolls</h3>

                <div className="space-y-6">
                  <div>
                    <label className="text-base text-amber-200 mb-3 block font-serif font-semibold" style={{ fontFamily: 'Merriweather, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Seek the Sacred Number</label>
                    <Input
                      type="number"
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      disabled={searchState === 'searching'}
                      className="font-mono h-12 text-lg bg-amber-800/50 border-amber-600/70 text-amber-100 placeholder:text-amber-300 focus:border-amber-400 focus:ring-amber-400/50"
                      data-testid="input-target"
                      placeholder="Enter the sacred number..."
                    />
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={startSearch}
                      disabled={searchState === 'searching' || isSorting}
                      className="w-full h-12 text-lg bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 border-2 border-red-500/50 text-red-100 font-serif font-bold shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                      data-testid="button-search"
                      style={{ fontFamily: 'Merriweather, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Begin the Quest
                    </Button>

                    <Button
                      onClick={nextStep}
                      disabled={!searchBoundaries || searchState === 'found' || searchState === 'notfound' || isSorting}
                      className="w-full h-12 text-lg bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 border-2 border-amber-500/50 text-amber-100 font-serif font-bold shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
                      variant="secondary"
                      data-testid="button-next-step"
                      style={{ fontFamily: 'Merriweather, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Next Step
                    </Button>

                    {/* New Sort Array Button */}
                    <Button
                      onClick={bubbleSort}
                      disabled={searchState === 'searching' || isSorting}
                      className="w-full h-12 text-lg bg-gradient-to-r from-green-700 to-green-800 hover:from-green-600 hover:to-green-700 border-2 border-green-500/50 text-green-100 font-serif font-bold shadow-lg hover:shadow-green-500/25 transition-all duration-300 mt-2"
                      variant="secondary"
                      style={{ fontFamily: 'Merriweather, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                    >
                      <ArrowUp className="w-5 h-5 mr-2" />
                      Sort Scrolls
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={generateNewArray}
                      disabled={searchState === 'searching' || isSorting}
                      variant="outline"
                      className="h-12 border-2 border-amber-600/50 text-amber-200 hover:bg-amber-800/30 hover:border-amber-500 font-serif font-bold transition-all duration-300"
                      data-testid="button-new-array"
                      style={{ fontFamily: 'Merriweather, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      New Scrolls
                    </Button>

                    <Button
                      onClick={resetSearch}
                      disabled={searchState === 'searching' || isSorting}
                      variant="outline"
                      className="h-12 border-2 border-amber-600/50 text-amber-200 hover:bg-amber-800/30 hover:border-amber-500 font-serif font-bold transition-all duration-300"
                      data-testid="button-reset"
                      style={{ fontFamily: 'Merriweather, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Reset Quest
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* "I am ready" button - only show if not ready */}
          {!isReady && (
            <div className="w-96 p-6 flex items-end pb-6">
              <div className="w-full flex flex-col items-center">
                <Button
                  onClick={() => {
                    setFadeOutText(true);
                    setIsRainActive(true); // Activate rain when ready
                    // Set a timeout to ensure content appears even if animation fails
                    setTimeout(() => {
                      setIsReady(true);
                    }, 1000); // Reduced timeout to 1 second
                  }}
                  className="h-16 px-8 text-2xl bg-gradient-to-r from-amber-700 to-red-800 hover:from-amber-600 hover:to-red-700 border-2 border-amber-500/60 text-amber-100 font-serif font-bold shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
                  style={{ fontFamily: 'Merriweather, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                >
                  I am ready
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Unsorted Array Dialog */}
      <AlertDialog open={showUnsortedDialog} onOpenChange={setShowUnsortedDialog}>
        <AlertDialogContent className="max-w-md bg-gradient-to-br from-amber-900 to-red-900 border-2 border-amber-600 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-center text-amber-100 font-serif tracking-wide" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              The Way of the Samurai
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className="text-center text-amber-200 font-serif text-lg leading-relaxed" style={{ fontFamily: 'Merriweather, serif' }}>
            An unsorted array is like wild bamboo; no clean cut can be made there. The blade of binary search cuts only through order.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowUnsortedDialog(false)}
              className="bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 border-2 border-amber-500/50 text-amber-100 font-serif font-bold shadow-lg hover:shadow-amber-500/25 transition-all duration-300 w-full py-3"
              style={{ fontFamily: 'Merriweather, serif' }}
            >
              Understood
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}