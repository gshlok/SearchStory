import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import RainEffect from '@/components/RainEffect';
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

export default function LandingPage() {
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
                <RainEffect isActive={true} />
            </div>

            {/* Content */}
            <div className="relative z-10 h-screen flex flex-col items-center justify-center">
                <div className="text-center py-8 px-4 max-w-4xl">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 drop-shadow-lg tracking-wide" style={{ fontFamily: 'Libre Baskerville, serif', textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(255,215,0,0.3)' }}>
                        The Samurai's Quest
                    </h1>
                    <p className="text-2xl md:text-3xl text-white/90 mb-12 max-w-2xl mx-auto drop-shadow font-serif" style={{ fontFamily: 'Merriweather, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                        Master the ancient art of search algorithms through the way of the samurai
                    </p>

                    <div className="flex flex-col md:flex-row gap-8 justify-center items-center mt-16">
                        <Link href="/binary">
                            <Button className="h-20 px-10 text-2xl bg-gradient-to-r from-amber-700 to-red-800 hover:from-amber-600 hover:to-red-700 border-2 border-amber-500/60 text-amber-100 font-serif font-bold shadow-lg hover:shadow-amber-500/25 transition-all duration-300" style={{ fontFamily: 'Merriweather, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.8)', minWidth: '280px' }}>
                                Binary Samurai
                            </Button>
                        </Link>

                        <Link href="/linear">
                            <Button className="h-20 px-10 text-2xl bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 border-2 border-blue-500/60 text-blue-100 font-serif font-bold shadow-lg hover:shadow-blue-500/25 transition-all duration-300" style={{ fontFamily: 'Merriweather, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.8)', minWidth: '280px' }}>
                                Linear Samurai
                            </Button>
                        </Link>
                    </div>

                    {/* View Technique button */}
                    <div className="mt-12 flex justify-center">
                        <Link href="/technique">
                            <Button className="h-16 px-8 text-xl bg-gradient-to-r from-purple-700 to-pink-800 hover:from-purple-600 hover:to-pink-700 border-2 border-purple-500/60 text-purple-100 font-serif font-bold shadow-lg hover:shadow-purple-500/25 transition-all duration-300" style={{ fontFamily: 'Merriweather, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.8)', minWidth: '280px' }}>
                                View Technique
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-20 text-amber-200/80 text-lg font-serif max-w-2xl mx-auto" style={{ fontFamily: 'Merriweather, serif' }}>
                        <p className="mb-4">Choose your path, young warrior. Will you master the swift precision of the Binary Samurai,</p>
                        <p>or the thorough determination of the Linear Samurai?</p>
                    </div>
                </div>
            </div>
        </div>
    );
}