export default function LandingPage() {
  return (
    <div className="h-screen relative overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      {/* Content */}
      <div className="relative z-10 h-screen flex flex-col items-center justify-center">
        <div className="text-center py-8 px-4 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 drop-shadow-lg tracking-wide">
            The Samurai's Quest
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 mb-12 max-w-2xl mx-auto drop-shadow font-serif">
            Master the ancient art of search algorithms through the way of the samurai
          </p>

          <div className="flex flex-col md:flex-row gap-8 justify-center items-center mt-16">
            <button className="h-20 px-10 text-2xl bg-gradient-to-r from-amber-700 to-red-800 border-2 border-amber-500/60 text-amber-100 font-serif font-bold shadow-lg transition-all duration-300" style={{ minWidth: '280px' }}>
              Binary Samurai
            </button>

            <button className="h-20 px-10 text-2xl bg-gradient-to-r from-blue-700 to-indigo-800 border-2 border-blue-500/60 text-blue-100 font-serif font-bold shadow-lg transition-all duration-300" style={{ minWidth: '280px' }}>
              Linear Samurai
            </button>
          </div>

          {/* View Technique button */}
          <div className="mt-12 flex justify-center">
            <button className="h-16 px-8 text-xl bg-gradient-to-r from-purple-700 to-pink-800 border-2 border-purple-500/60 text-purple-100 font-serif font-bold shadow-lg transition-all duration-300" style={{ minWidth: '280px' }}>
              View Technique
            </button>
          </div>

          <div className="mt-20 text-amber-200/80 text-lg font-serif max-w-2xl mx-auto">
            <p className="mb-4">Choose your path, young warrior. Will you master the swift precision of the Binary Samurai,</p>
            <p>or the thorough determination of the Linear Samurai?</p>
          </div>
        </div>
      </div>
    </div>
  );
}