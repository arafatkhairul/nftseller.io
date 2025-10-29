import { Button } from '@/components/ui/button';

interface HeroBannerProps {
    title?: string;
    subtitle?: string;
    buttonText?: string;
    onButtonClick?: () => void;
    backgroundImage?: string;
}

export default function HeroBanner({
    title = "SONIC RACING",
    subtitle = "CROSSWORLDS",
    buttonText = "NOW AVAILABLE",
    onButtonClick,
    backgroundImage = "/images/sonic-racing-bg.jpg"
}: HeroBannerProps) {
    return (
        <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden rounded-3xl my-6 w-full max-w-full group perspective-1000">
            {/* Multi-Layer Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 animate-gradient-shift"></div>

            {/* Dynamic Mesh Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-purple-600/40 to-pink-600/30 animate-pulse"></div>

            {/* Animated Gradient Orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-xl animate-float-slow"></div>
                <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-float-reverse"></div>
                <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-yellow-500/15 to-orange-500/15 rounded-full blur-xl animate-spin-slow"></div>
            </div>

            {/* Holographic Grid Effect */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent transform skew-y-12 animate-slide-right"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-400/10 to-transparent transform -skew-x-12 animate-slide-up"></div>
            </div>

            {/* Enhanced Particle System */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Dynamic Speed Lines */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 animate-speed-line"></div>
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-90 transform translate-y-4 animate-speed-line-delayed"></div>
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-70 transform -translate-y-4 animate-speed-line-reverse"></div>

                {/* Floating Energy Particles */}
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-particle-float shadow-lg shadow-cyan-400/50"></div>
                <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full animate-particle-bounce shadow-lg shadow-pink-400/50"></div>
                <div className="absolute top-1/2 right-1/3 w-2.5 h-2.5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-particle-spin shadow-lg shadow-yellow-400/50"></div>
                <div className="absolute top-1/3 left-1/2 w-1.5 h-1.5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full animate-particle-pulse shadow-lg shadow-green-400/50"></div>

                {/* Glowing Trails */}
                <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent animate-trail-1"></div>
                <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-300/60 to-transparent animate-trail-2"></div>
            </div>

            {/* Enhanced Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                {/* Holographic Title */}
                <div className="mb-2 relative">
                    {/* Glowing Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 blur-2xl animate-pulse"></div>

                    <h1 className="relative text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 transform -skew-x-12 shadow-2xl animate-text-glow filter drop-shadow-2xl">
                        {title}
                    </h1>

                    {/* Holographic Subtitle */}
                    <div className="relative text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-1 transform -skew-x-6 animate-subtitle-glow">
                        <span className="relative z-10 bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent filter drop-shadow-lg">
                            {subtitle}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-purple-400/30 blur-lg animate-pulse"></div>
                    </div>

                    {/* Scanning Line Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent h-1 animate-scan-line"></div>
                </div>

                {/* Enhanced Sonic Character */}
                <div className="absolute right-4 md:right-8 lg:right-16 top-1/2 transform -translate-y-1/2 floating-element group">
                    {/* Energy Aura */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-blue-600/30 rounded-full blur-xl animate-pulse scale-150"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-2xl animate-pulse scale-200 animation-delay-500"></div>

                    {/* Main Character */}
                    <div className="relative w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-2xl animate-character-glow border-2 border-cyan-300/50">
                        <div className="w-14 h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-cyan-300 via-blue-400 to-purple-500 flex items-center justify-center relative overflow-hidden">
                            {/* Inner Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                            <span className="relative z-10 text-white font-bold text-base md:text-lg lg:text-xl text-glow animate-text-pulse">S</span>
                        </div>
                    </div>

                    {/* Speed Trails */}
                    <div className="absolute -left-8 top-1/2 transform -translate-y-1/2">
                        <div className="w-6 h-1 bg-gradient-to-r from-cyan-400 to-transparent rounded-full animate-trail-fast"></div>
                        <div className="w-4 h-0.5 bg-gradient-to-r from-blue-400 to-transparent rounded-full mt-1 animate-trail-fast animation-delay-100"></div>
                        <div className="w-8 h-1 bg-gradient-to-r from-purple-400 to-transparent rounded-full mt-1 animate-trail-fast animation-delay-200"></div>
                    </div>
                </div>

                {/* Racing Cars/Elements */}
                <div className="absolute left-4 md:left-8 lg:left-16 bottom-6 md:bottom-8">
                    <div className="flex space-x-1 md:space-x-2">
                        <div className="w-6 h-3 md:w-8 md:h-4 bg-gradient-to-r from-red-500 to-red-700 rounded-full shadow-lg transform rotate-12"></div>
                        <div className="w-6 h-3 md:w-8 md:h-4 bg-gradient-to-r from-yellow-500 to-yellow-700 rounded-full shadow-lg transform -rotate-6"></div>
                        <div className="w-6 h-3 md:w-8 md:h-4 bg-gradient-to-r from-green-500 to-green-700 rounded-full shadow-lg transform rotate-3"></div>
                    </div>
                </div>

                {/* Enhanced Call to Action Button */}
                <div className="mt-8 relative">
                    {/* Button Aura */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 blur-xl rounded-full animate-pulse scale-150"></div>

                    <Button
                        onClick={onButtonClick}
                        className="relative bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 text-black font-bold px-10 py-4 text-lg rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-yellow-300 animate-button-glow overflow-hidden"
                    >
                        {/* Button Inner Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer"></div>

                        <span className="relative z-10 flex items-center space-x-3">
                            <span className="text-glow font-black tracking-wider">{buttonText}</span>
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-black rounded-full animate-pulse animation-delay-200"></div>
                                <div className="w-2 h-2 bg-black rounded-full animate-pulse animation-delay-400"></div>
                            </div>
                        </span>

                        {/* Holographic Scan */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-scan-button"></div>
                    </Button>
                </div>
            </div>

            {/* Speed Lines Effect */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-40 animate-pulse delay-100"></div>
                <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent opacity-30 animate-pulse delay-200"></div>
            </div>
        </div>
    );
}
