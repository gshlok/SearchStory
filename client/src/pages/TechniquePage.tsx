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

export default function TechniquePage() {
    return (
        <div className="h-screen relative overflow-hidden">
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
            <div className="relative z-10 h-screen flex flex-col">
                {/* Header */}
                <div className="py-6 px-6">
                    <Link to="/">
                        <Button className="bg-gradient-to-r from-amber-700 to-red-800 hover:from-amber-600 hover:to-red-700 border-2 border-amber-500/60 text-amber-100 font-serif font-bold shadow-lg hover:shadow-amber-500/25 transition-all duration-300">
                            ← Back to Home
                        </Button>
                    </Link>
                </div>

                {/* Main Content - Centered Dialogue Boxes */}
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="flex flex-col md:flex-row gap-8 max-w-6xl w-full overflow-auto custom-scrollbar">
                        {/* Linear Search Dialogue */}
                        <div className="flex-1 bg-gradient-to-br from-blue-900 to-indigo-900 border-2 border-blue-700/50 rounded-lg shadow-2xl p-6 overflow-auto max-h-[70vh] custom-scrollbar">
                            <h2 className="text-2xl text-blue-100 font-serif font-bold mb-4 tracking-wide" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                                Linear Search
                            </h2>
                            <div className="space-y-4 overflow-auto custom-scrollbar">
                                <div>
                                    <h3 className="text-lg text-blue-200 font-serif font-semibold mb-2" style={{ fontFamily: 'Merriweather, serif' }}>
                                        Time Complexity
                                    </h3>
                                    <p className="text-blue-100 font-serif" style={{ fontFamily: 'Merriweather, serif' }}>
                                        O(n) - In the worst case, we might need to check every element in the array.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg text-blue-200 font-serif font-semibold mb-2" style={{ fontFamily: 'Merriweather, serif' }}>
                                        Solution in C++
                                    </h3>
                                    <pre className="bg-blue-800/50 p-4 rounded text-blue-100 text-sm overflow-x-auto font-mono max-h-60 overflow-y-auto code-scrollbar">
                                        {`#include <iostream>
#include <vector>
using namespace std;

bool linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            return true;
        }
    }
    return false;
}

int main() {
    vector<int> arr = {3, 9, 14, 26, 37, 41};
    int target = 26;
    
    if (linearSearch(arr, target)) {
        cout << "FOUND" << endl;
    } else {
        cout << "NOT FOUND" << endl;
    }
    
    return 0;
}`}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Binary Search Dialogue */}
                        <div className="flex-1 bg-gradient-to-br from-amber-900 to-red-900 border-2 border-amber-700/50 rounded-lg shadow-2xl p-6 overflow-auto max-h-[70vh] custom-scrollbar">
                            <h2 className="text-2xl text-amber-100 font-serif font-bold mb-4 tracking-wide" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                                Binary Search
                            </h2>
                            <div className="space-y-4 overflow-auto custom-scrollbar">
                                <div>
                                    <h3 className="text-lg text-amber-200 font-serif font-semibold mb-2" style={{ fontFamily: 'Merriweather, serif' }}>
                                        Time Complexity
                                    </h3>
                                    <p className="text-amber-100 font-serif" style={{ fontFamily: 'Merriweather, serif' }}>
                                        O(log n) - By eliminating half of the remaining elements at each step, we quickly narrow down the search space.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg text-amber-200 font-serif font-semibold mb-2" style={{ fontFamily: 'Merriweather, serif' }}>
                                        Solution in C++
                                    </h3>
                                    <pre className="bg-amber-800/50 p-4 rounded text-amber-100 text-sm overflow-x-auto font-mono max-h-60 overflow-y-auto code-scrollbar">
                                        {`#include <iostream>
#include <vector>
using namespace std;

bool binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return true;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return false;
}

int main() {
    vector<int> arr = {3, 9, 14, 26, 37, 41};
    int target = 26;
    
    if (binarySearch(arr, target)) {
        cout << "FOUND" << endl;
    } else {
        cout << "NOT FOUND" << endl;
    }
    
    return 0;
}`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}