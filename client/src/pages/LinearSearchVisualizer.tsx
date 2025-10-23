import { useState, useRef, useEffect } from 'react';
import { Link } from "wouter";
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

export default function LinearSearchVisualizer() {
    const [array, setArray] = useState<number[]>([7, 3, 18, 12, 25, 42, 31, 56, 67]);
    const [target, setTarget] = useState<string>('3');
    const [searchState, setSearchState] = useState<'idle' | 'searching' | 'found' | 'notfound'>('idle');
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const [visitedIndices, setVisitedIndices] = useState<Set<number>>(new Set());
    const [eliminatedIndices, setEliminatedIndices] = useState<Set<number>>(new Set());
    const [spriteState, setSpriteState] = useState<SpriteState>('IDLE');
    const [spritePosition, setSpritePosition] = useState({ x: 100, y: 450 }); // Adjusted sprite position
    const [stepCount, setStepCount] = useState(0);
    const [arrayOffset, setArrayOffset] = useState(200); // Dynamic offset for array positioning
    const [showSlashEffect, setShowSlashEffect] = useState(false); // Visual slash effect
    const [isReady, setIsReady] = useState(false); // New state to control visibility
    const [showContent, setShowContent] = useState(false); // New state for fade-in animation
    const [editingIndex, setEditingIndex] = useState<number | null>(null); // New state for tracking which element is being edited
    const [fadeOutText, setFadeOutText] = useState(false); // New state for text fade-out animation
    const [isRainActive, setIsRainActive] = useState(false); // New state to control rain effect
    // Add new state to track animation completion
    const [isAnimationComplete, setIsAnimationComplete] = useState(true);
    const arrayRef = useRef<HTMLDivElement>(null);
    const [isProblemOpen, setIsProblemOpen] = useState(false);
    const [problemText, setProblemText] = useState<string>("");
    const [problemTitle, setProblemTitle] = useState<string>("Samurai and the Hidden Plank");
    const [problemBody, setProblemBody] = useState<string>("");
    const [showUnsortedDialog, setShowUnsortedDialog] = useState(false);
    // Add new state for zoom warning
    const [showZoomWarning, setShowZoomWarning] = useState(false);

    // Add new state for button positioning
    const [isButtonExpanded, setIsButtonExpanded] = useState(false);

    // Add state for music control
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Initialize typewriter effect for the descriptive text
    const { displayText } = useTypewriter({
        text: "Follow the warrior's journey as he searches through the ancient scrolls using the thorough linear search technique",
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

    // Handle background music
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Set initial volume to 10% to reduce loudness even more
        audio.volume = 0.1;

        const playMusic = async () => {
            try {
                // Ensure volume is set before playing
                audio.volume = 0.1;
                await audio.play();
                setIsMusicPlaying(true);
            } catch (error) {
                console.log("Autoplay prevented, music will play on user interaction");
            }
        };

        // Try to play music when component mounts
        playMusic();

        return () => {
            if (audio) {
                audio.pause();
            }
        };
    }, []);

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
        setVisitedIndices(new Set());
        setEliminatedIndices(new Set());
        setSpriteState('IDLE');
        setSpritePosition({ x: 100, y: 450 }); // Keep sprite in adjusted position
        setStepCount(0);
        setArrayOffset(200); // Reset array offset
        setShowSlashEffect(false); // Reset slash effect
        setIsAnimationComplete(true); // Reset animation state
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

        setSearchState('searching');
        setStepCount(0);
        setVisitedIndices(new Set());
        setEliminatedIndices(new Set());
        setSpriteState('IDLE');
        setSpritePosition({ x: 100, y: 450 }); // Keep sprite in adjusted position
        setIsAnimationComplete(false); // Animation starts, so it's not complete
        setCurrentIndex(null); // Reset current index

        // Automatically trigger the first step
        setTimeout(() => {
            nextStep();
        }, 100);
    };

    const nextStep = async () => {
        // If animation is in progress, don't allow next step
        if (!isAnimationComplete) return;

        const targetNum = parseInt(target);

        // If we've already checked all elements
        if (stepCount >= array.length) {
            setSearchState('notfound');
            setSpriteState('THINKING');
            await sleep(1200);
            setSpriteState('IDLE');
            return;
        }

        // Set animation as in progress
        setIsAnimationComplete(false);

        // Move to next element
        const currentIndex = stepCount;
        setCurrentIndex(currentIndex);
        setStepCount(prev => prev + 1);

        // Update sprite position to current element
        const position = getElementPosition(currentIndex);
        setSpritePosition(position);

        // Add to visited indices
        const newVisited = new Set(visitedIndices);
        newVisited.add(currentIndex);
        setVisitedIndices(newVisited);

        // Wait for visualization
        await sleep(1200);

        // Check if current element is the target
        if (array[currentIndex] === targetNum) {
            setSpriteState('THINKING');
            setSearchState('found');
            await sleep(1500);
            setSpriteState('IDLE');
            setIsAnimationComplete(true); // Animation complete
        } else {
            // Attack animation when element doesn't match
            setSpriteState('ATTACK');
            setShowSlashEffect(true); // Show slash effect
            await sleep(800);

            // Mark element as eliminated
            const newEliminated = new Set(eliminatedIndices);
            newEliminated.add(currentIndex);
            setEliminatedIndices(newEliminated);

            await sleep(800);
            setSpriteState('IDLE');
            setShowSlashEffect(false); // Hide slash effect
            setIsAnimationComplete(true); // Animation complete
        }
    };

    // Add zoom detection effect
    useEffect(() => {
        const detectZoom = () => {
            // Check device pixel ratio
            const devicePixelRatio = window.devicePixelRatio || 1;

            // Check if 1 CSS pixel equals 1 device pixel using a test element
            const testElement = document.createElement('div');
            testElement.style.width = '1in';
            document.body.appendChild(testElement);
            const isOneInch = testElement.offsetWidth === 96;
            document.body.removeChild(testElement);

            // If devicePixelRatio is not 1 or inch test fails, zoom might be active
            return devicePixelRatio !== 1 || !isOneInch;
        };

        const checkZoomAndShowWarning = () => {
            const isZoomed = detectZoom();
            setShowZoomWarning(isZoomed);
        };

        // Check on mount
        checkZoomAndShowWarning();

        // Check when window is resized (zoom changes trigger resize)
        window.addEventListener('resize', checkZoomAndShowWarning);

        return () => {
            window.removeEventListener('resize', checkZoomAndShowWarning);
        };
    }, []);

    return (
        <div className="h-screen relative overflow-hidden md:h-screen">
            {/* Custom scrollbar styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                /* Webkit browsers (Chrome, Safari, Edge) */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 12px;
                    height: 12px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(180deg, #8B5CF6, #6366F1);
                    border-radius: 10px;
                    border: 2px solid rgba(0, 0, 0, 0.1);
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(180deg, #7C3AED, #4F46E5);
                }

                /* Firefox */
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #8B5CF6 rgba(0, 0, 0, 0.1);
                }

                /* For code blocks */
                .code-scrollbar::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }

                .code-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 6px;
                }

                .code-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(180deg, #4F46E5, #3730A3);
                    border-radius: 6px;
                }

                .code-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(180deg, #4338CA, #312E81);
                }

                .code-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #4F46E5 rgba(0, 0, 0, 0.2);
                }
                `
            }} />

            {/* Hidden audio element for background music */}
            <audio
                ref={audioRef}
                loop
                preload="auto"
            >
                <source src="/background-music.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>

            {/* Music control button (optional) */}
            <button
                onClick={() => {
                    const audio = audioRef.current;
                    if (audio) {
                        if (isMusicPlaying) {
                            audio.pause();
                            setIsMusicPlaying(false);
                        } else {
                            audio.volume = 0.1; // Set volume to 10% to reduce loudness even more
                            audio.play().catch(e => console.log("Playback failed:", e));
                            setIsMusicPlaying(true);
                        }
                    }
                }}
                className="absolute top-4 right-4 z-30 p-2 bg-blue-900/50 rounded-full text-blue-100 hover:bg-blue-800 transition-all"
                aria-label={isMusicPlaying ? "Pause music" : "Play music"}
            >
                {isMusicPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}
            </button>

            {/* Home button */}
            <div className="absolute top-4 right-16 z-30">
                <Link to="/">
                    <Button
                        className="h-8 px-3 bg-gradient-to-r from-blue-800 to-indigo-800 hover:from-blue-700 hover:to-indigo-700 border-2 border-blue-500/60 text-blue-100 font-serif font-bold shadow-md hover:shadow-blue-500/20 text-sm"
                        style={{ fontFamily: 'Merriweather, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                    >
                        Home
                    </Button>
                </Link>
            </div>

            {/* Problem Statement Button - always present but changes behavior based on state */}
            <div className={`absolute z-20 transition-all duration-700 ease-in-out ${isReady ? 'top-4 left-4' : 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'}`}>
                {!isReady ? (
                    // Before ready: Show in-place when expanded
                    isButtonExpanded ? (
                        <div className="w-full max-w-3xl">
                            <div className="bg-gradient-to-br from-blue-900 to-indigo-900 border-2 border-blue-700/50 rounded-lg shadow-2xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl text-blue-100 font-serif tracking-wide" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                                        {problemTitle}
                                    </h2>
                                    <Button
                                        onClick={() => setIsButtonExpanded(false)}
                                        className="h-8 px-3 bg-blue-800 hover:bg-blue-700 text-blue-100 font-serif"
                                        style={{ fontFamily: 'Merriweather, serif' }}
                                    >
                                        Close
                                    </Button>
                                </div>
                                <div className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap text-blue-100 leading-relaxed font-serif" style={{ fontFamily: 'Merriweather, serif' }}>
                                    {problemBody}
                                </div>
                                <div className="mt-6 flex justify-center">
                                    <Button
                                        onClick={() => setIsButtonExpanded(false)}
                                        className="h-10 px-6 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 border-2 border-blue-500/60 text-blue-100 font-serif font-bold shadow-md hover:shadow-blue-500/20"
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
                            className="h-12 px-6 text-lg bg-gradient-to-r from-blue-800 to-indigo-800 hover:from-blue-700 hover:to-indigo-700 border-2 border-blue-500/60 text-blue-100 font-serif font-bold shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
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
                                className="h-10 px-4 bg-gradient-to-r from-blue-800 to-indigo-800 hover:from-blue-700 hover:to-indigo-700 border-2 border-blue-500/60 text-blue-100 font-serif font-bold shadow-md hover:shadow-blue-500/20"
                                style={{ fontFamily: 'Merriweather, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                            >
                                Problem Statement
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl bg-gradient-to-br from-blue-950 to-indigo-950 border-blue-700/50">
                            <DialogHeader>
                                <DialogTitle className="text-2xl text-blue-100 font-serif tracking-wide" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                                    {problemTitle}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="max-h-[70vh] overflow-y-auto whitespace-pre-wrap text-blue-100 leading-relaxed font-serif custom-scrollbar" style={{ fontFamily: 'Merriweather, serif' }}>
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
            <div className="relative z-10 h-screen flex flex-col md:h-screen">
                {/* Main content area with padding for mobile navbar */}
                <div className="flex-1 flex flex-col md:flex-1 md:h-auto pb-24 md:pb-0 pt-4 md:pt-0">
                    <div className="text-center py-4 px-4">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 drop-shadow-lg tracking-wide" data-testid="text-title" style={{ fontFamily: 'Libre Baskerville, serif', textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(100,149,237,0.3)' }}>
                            The Linear Samurai's Quest
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
                                    text="Follow the warrior's journey as he searches through the ancient scrolls using the thorough linear search technique"
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
                    <div className="flex-1 flex md:h-[calc(100vh-200px)]">
                        <div className="flex-1 flex flex-col justify-end pb-6 px-4 md:pb-6 md:pt-0 pt-2">
                            <div className="w-full max-w-2xl">
                                <div className="relative h-80 flex flex-col justify-end items-center">
                                    {/* Sprite Animation - always visible */}
                                    <SpriteAnimation
                                        state={spriteState}
                                        position={spritePosition}
                                        scale={7}
                                        onAnimationComplete={() => setIsAnimationComplete(true)}
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
                                                            isActive={currentIndex === index}
                                                            isTarget={searchState === 'found' && currentIndex === index}
                                                            isEliminated={eliminatedIndices.has(index)}
                                                            highlight={visitedIndices.has(index)}
                                                            isSwapping={false}
                                                            swapDirection={undefined}
                                                            onEdit={handleElementEdit}
                                                            isEditing={editingIndex === index}
                                                            minValue={minValue}
                                                            maxValue={maxValue}
                                                        />
                                                    ));
                                                })()}
                                            </div>

                                            {/* Slash Effect - removed the red glow */}
                                            {showSlashEffect && (
                                                <div
                                                    className="absolute pointer-events-none"
                                                    style={{
                                                        left: `${spritePosition.x + 200}px`,
                                                        top: `${spritePosition.y - 200}px`,
                                                        width: '300px',
                                                        height: '400px',
                                                        background: 'transparent',
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
                            <>
                                {/* Desktop Card Layout */}
                                <div className={`w-96 p-6 flex items-end pb-6 transition-opacity duration-1000 hidden md:flex ${showContent ? 'opacity-100' : 'opacity-0'}`}>
                                    <Card className="p-8 w-full bg-gradient-to-br from-blue-900/90 to-indigo-900/90 backdrop-blur-sm border-2 border-blue-600/50 shadow-2xl" style={{ boxShadow: '0 0 30px rgba(100,149,237,0.2), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
                                        <h3 className="text-xl font-bold mb-6 text-blue-100 font-serif tracking-wide" style={{ fontFamily: 'Libre Baskerville, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Sacred Scrolls</h3>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="text-base text-blue-200 mb-3 block font-serif font-semibold" style={{ fontFamily: 'Merriweather, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Seek the Sacred Number</label>
                                                <Input
                                                    type="number"
                                                    value={target}
                                                    onChange={(e) => setTarget(e.target.value)}
                                                    disabled={searchState !== 'idle'}
                                                    className="font-mono h-12 text-lg bg-blue-800/50 border-blue-600/70 text-blue-100 placeholder:text-blue-300 focus:border-blue-400 focus:ring-blue-400/50"
                                                    data-testid="input-target"
                                                    placeholder="Enter the sacred number..."
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <Button
                                                    onClick={startSearch}
                                                    disabled={searchState !== 'idle'}
                                                    className="w-full h-12 text-lg bg-gradient-to-r from-indigo-700 to-indigo-800 hover:from-indigo-600 hover:to-indigo-700 border-2 border-indigo-500/50 text-indigo-100 font-serif font-bold shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
                                                    data-testid="button-search"
                                                    style={{ fontFamily: 'Merriweather, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                                                >
                                                    <Play className="w-5 h-5 mr-2" />
                                                    Begin the Quest
                                                </Button>

                                                <Button
                                                    onClick={nextStep}
                                                    disabled={searchState !== 'searching' || !isAnimationComplete}
                                                    className="w-full h-12 text-lg bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 border-2 border-blue-500/50 text-blue-100 font-serif font-bold shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                                                    variant="secondary"
                                                    data-testid="button-next-step"
                                                    style={{ fontFamily: 'Merriweather, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                                                >
                                                    <Sparkles className="w-5 h-5 mr-2" />
                                                    Next Step
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <Button
                                                    onClick={generateNewArray}
                                                    disabled={searchState === 'searching'}
                                                    variant="outline"
                                                    className="h-12 border-2 border-blue-600/50 text-blue-200 hover:bg-blue-800/30 hover:border-blue-500 font-serif font-bold transition-all duration-300"
                                                    data-testid="button-new-array"
                                                    style={{ fontFamily: 'Merriweather, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                                                >
                                                    <Sparkles className="w-5 h-5 mr-2" />
                                                    New Scrolls
                                                </Button>

                                                <Button
                                                    onClick={resetSearch}
                                                    disabled={searchState === 'searching'}
                                                    variant="outline"
                                                    className="h-12 border-2 border-blue-600/50 text-blue-200 hover:bg-blue-800/30 hover:border-blue-500 font-serif font-bold transition-all duration-300"
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

                                {/* Mobile/Tablet Navbar Layout */}
                                <div className={`fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-900 to-indigo-900 border-t-2 border-blue-600/50 p-2 md:hidden transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`} style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}>
                                    <div className="flex justify-around items-center">
                                        <Button
                                            onClick={startSearch}
                                            disabled={searchState !== 'idle'}
                                            className="flex flex-col items-center justify-center h-16 px-2 text-blue-100"
                                            variant="ghost"
                                        >
                                            <Play className="w-6 h-6 mb-1" />
                                            <span className="text-xs font-serif">Begin</span>
                                        </Button>

                                        <Button
                                            onClick={nextStep}
                                            disabled={searchState !== 'searching' || !isAnimationComplete}
                                            className="flex flex-col items-center justify-center h-16 px-2 text-blue-100"
                                            variant="ghost"
                                        >
                                            <Sparkles className="w-6 h-6 mb-1" />
                                            <span className="text-xs font-serif">Next</span>
                                        </Button>

                                        <Button
                                            onClick={generateNewArray}
                                            disabled={searchState === 'searching'}
                                            className="flex flex-col items-center justify-center h-16 px-2 text-blue-100"
                                            variant="ghost"
                                        >
                                            <Sparkles className="w-6 h-6 mb-1" />
                                            <span className="text-xs font-serif">New</span>
                                        </Button>

                                        <Button
                                            onClick={resetSearch}
                                            disabled={searchState === 'searching'}
                                            className="flex flex-col items-center justify-center h-16 px-2 text-blue-100"
                                            variant="ghost"
                                        >
                                            <RotateCcw className="w-6 h-6 mb-1" />
                                            <span className="text-xs font-serif">Reset</span>
                                        </Button>
                                    </div>

                                    {/* Target Input for Mobile */}
                                    <div className="flex items-center mt-2 px-2">
                                        <label className="text-blue-200 text-xs font-serif mr-2">Target:</label>
                                        <Input
                                            type="number"
                                            value={target}
                                            onChange={(e) => setTarget(e.target.value)}
                                            disabled={searchState !== 'idle'}
                                            className="flex-1 font-mono text-sm bg-blue-800/50 border-blue-600/70 text-blue-100 placeholder:text-blue-300 focus:border-blue-400 focus:ring-blue-400/50"
                                            placeholder="Number..."
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* "I am ready" button - only show if not ready */}
                        {!isReady && (
                            <div className="w-96 p-6 flex items-end pb-6 md:w-96">
                                <div className="w-full flex flex-col items-center">
                                    <Button
                                        onClick={() => {
                                            // Start the music when "I am ready" is clicked
                                            const audio = audioRef.current;
                                            if (audio) {
                                                audio.volume = 0.1; // Set volume to 10% to reduce loudness even more
                                                audio.play().catch(e => console.log("Playback failed:", e));
                                                setIsMusicPlaying(true);
                                            }

                                            setFadeOutText(true);
                                            setIsRainActive(true); // Activate rain when ready
                                            // Set a timeout to ensure content appears even if animation fails
                                            setTimeout(() => {
                                                setIsReady(true);
                                            }, 1000); // Reduced timeout to 1 second
                                        }}
                                        className="h-16 px-8 text-2xl bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 border-2 border-blue-500/60 text-blue-100 font-serif font-bold shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                                        style={{ fontFamily: 'Merriweather, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                                    >
                                        I am ready
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Unsorted Array Dialog */}
            <AlertDialog open={showUnsortedDialog} onOpenChange={setShowUnsortedDialog}>
                <AlertDialogContent className="max-w-md bg-gradient-to-br from-blue-900 to-indigo-900 border-2 border-blue-600 shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl text-center text-blue-100 font-serif tracking-wide" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                            The Way of the Samurai
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription className="text-center text-blue-200 font-serif text-lg leading-relaxed" style={{ fontFamily: 'Merriweather, serif' }}>
                        An unsorted array is like wild bamboo; no clean cut can be made there. The blade of binary search cuts only through order.
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            onClick={() => setShowUnsortedDialog(false)}
                            className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 border-2 border-blue-500/50 text-blue-100 font-serif font-bold shadow-lg hover:shadow-blue-500/25 transition-all duration-300 w-full py-3"
                            style={{ fontFamily: 'Merriweather, serif' }}
                        >
                            Understood
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Zoom Warning Dialog */}
            <AlertDialog open={showZoomWarning} onOpenChange={setShowZoomWarning}>
                <AlertDialogContent className="max-w-md bg-gradient-to-br from-blue-900 to-indigo-900 border-2 border-blue-600 shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl text-center text-blue-100 font-serif tracking-wide" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                            Optimal Viewing Experience
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription className="text-center text-blue-200 font-serif text-lg leading-relaxed" style={{ fontFamily: 'Merriweather, serif' }}>
                        For the best experience with this visualization, we recommend setting your browser zoom to 100%.
                        Press <kbd className="px-2 py-1 bg-blue-800 rounded">Ctrl</kbd> + <kbd className="px-2 py-1 bg-blue-800 rounded">0</kbd> (Windows)
                        or <kbd className="px-2 py-1 bg-blue-800 rounded">Cmd</kbd> + <kbd className="px-2 py-1 bg-blue-800 rounded">0</kbd> (Mac) to reset zoom.
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            onClick={() => setShowZoomWarning(false)}
                            className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 border-2 border-blue-500/50 text-blue-100 font-serif font-bold shadow-lg hover:shadow-blue-500/25 transition-all duration-300 w-full py-3"
                            style={{ fontFamily: 'Merriweather, serif' }}
                        >
                            Continue Anyway
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    );
}