import React, { useState } from 'react';
import { Music, Upload, Users, TrendingUp, Play, Headphones, Heart, Radio } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';

const Landing = () => {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const { currentUser } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-[#121212] text-white">
            {/* Hero Section */}
            <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff6b1a]/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                {/* Logo */}
                <div className="relative z-10 mb-8 flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#ff6b1a] to-[#ff8c42] flex items-center justify-center shadow-2xl">
                        <span className="text-4xl">🐆</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight">Pumafy</h1>
                </div>

                {/* Hero Text */}
                <div className="relative z-10 text-center max-w-5xl mb-12">
                    <h2 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
                        <span className="bg-gradient-to-r from-[#ff6b1a] via-[#ff8c42] to-[#ffb366] bg-clip-text text-transparent">
                            Share Your Sound
                        </span>
                        <br />
                        <span className="text-white">Get Discovered</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-400 mb-10 font-light">
                        Upload 30 tracks a day. Build your audience. Connect with music lovers.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="bg-gradient-to-r from-[#ff6b1a] to-[#ff8c42] hover:from-[#ff8c42] hover:to-[#ff6b1a] text-white font-bold px-8 py-4 rounded-full text-lg transition-all transform hover:scale-105 shadow-2xl"
                        >
                            Start Uploading - It's Free
                        </button>
                        <a
                            href="#features"
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-full text-lg transition-all border border-white/20"
                        >
                            Learn More
                        </a>
                    </div>
                </div>

                {/* Stats */}
                <div className="relative z-10 grid grid-cols-3 gap-8 max-w-3xl">
                    <div className="text-center">
                        <div className="text-3xl font-black text-[#ff6b1a]">30</div>
                        <div className="text-sm text-gray-400">Uploads/Day</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-black text-[#ff6b1a]">∞</div>
                        <div className="text-sm text-gray-400">Total Storage</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-black text-[#ff6b1a]">Free</div>
                        <div className="text-sm text-gray-400">Forever</div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
                        <div className="w-1 h-3 bg-white/50 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-black text-center mb-16">
                        Built for <span className="text-[#ff6b1a]">Creators</span>
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature Cards */}
                        <FeatureCard
                            icon={<Upload className="text-[#ff6b1a]" size={32} />}
                            title="Upload Freely"
                            description="Share 30 tracks every day. No limits on total storage. Your music, your rules."
                        />
                        <FeatureCard
                            icon={<TrendingUp className="text-[#ff6b1a]" size={32} />}
                            title="Get Discovered"
                            description="Appear in the community stream. Build your audience organically. Track your plays."
                        />
                        <FeatureCard
                            icon={<Users className="text-[#ff6b1a]" size={32} />}
                            title="Build Your Profile"
                            description="Showcase all your uploads. Share your profile link. Connect with fans."
                        />
                        <FeatureCard
                            icon={<Radio className="text-[#ff6b1a]" size={32} />}
                            title="Real-Time Feed"
                            description="See what's trending now. Discover new artists. Stay connected with the community."
                        />
                        <FeatureCard
                            icon={<Heart className="text-[#ff6b1a]" size={32} />}
                            title="Curate Collections"
                            description="Like your favorite tracks. Build playlists. Support other creators."
                        />
                        <FeatureCard
                            icon={<Headphones className="text-[#ff6b1a]" size={32} />}
                            title="High Quality"
                            description="Crystal clear audio streaming. Album artwork support. Seamless playback."
                        />
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="py-20 px-6 bg-gradient-to-b from-[#121212] to-black">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-black text-center mb-16">
                        How It <span className="text-[#ff6b1a]">Works</span>
                    </h2>

                    <div className="space-y-12">
                        <Step
                            number="1"
                            title="Create Your Account"
                            description="Sign up in seconds. No credit card required. Start for free."
                        />
                        <Step
                            number="2"
                            title="Upload Your Music"
                            description="Drag and drop up to 30 tracks per day. We extract metadata automatically."
                        />
                        <Step
                            number="3"
                            title="Share & Grow"
                            description="Your tracks appear in the community feed. Share your profile. Watch your audience grow."
                        />
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-6xl font-black mb-6">
                        Ready to Share Your <span className="text-[#ff6b1a]">Sound</span>?
                    </h2>
                    <p className="text-xl text-gray-400 mb-10">
                        Join the community. Upload your music. Get discovered today.
                    </p>
                    <button
                        onClick={() => setShowAuthModal(true)}
                        className="bg-gradient-to-r from-[#ff6b1a] to-[#ff8c42] hover:from-[#ff8c42] hover:to-[#ff6b1a] text-white font-bold px-10 py-5 rounded-full text-xl transition-all transform hover:scale-105 shadow-2xl"
                    >
                        Get Started Now
                    </button>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/10">
                <div className="max-w-6xl mx-auto text-center text-gray-500">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#ff6b1a] to-[#ff8c42] flex items-center justify-center">
                            <span className="text-xl">🐆</span>
                        </div>
                        <span className="text-xl font-bold text-white">Pumafy</span>
                    </div>
                    <p className="text-sm">Your school-wide music sharing platform</p>
                    <p className="text-xs mt-2">Upload. Share. Discover.</p>
                </div>
            </footer>

            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-105 hover:border-[#ff6b1a]/50">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
    </div>
);

const Step = ({ number, title, description }) => (
    <div className="flex gap-6 items-start">
        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-[#ff6b1a] to-[#ff8c42] flex items-center justify-center text-2xl font-black shadow-xl">
            {number}
        </div>
        <div>
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            <p className="text-gray-400 text-lg">{description}</p>
        </div>
    </div>
);

export default Landing;
