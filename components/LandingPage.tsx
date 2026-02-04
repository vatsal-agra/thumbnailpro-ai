import { AdBanner } from './AdBanner';
import { Rocket, Zap, Shield, Sparkles, Youtube, CheckCircle2, ArrowRight, Play, Star } from 'lucide-react';

interface LandingPageProps {
  onStartApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartApp }) => {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative pt-10 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-red-500" />
              <span>Next Gen AI Video Analysis</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
              Thumbnails That Get <br />
              <span className="text-red-500">10x More Clicks</span>
            </h1>

            <p className="text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed">
              Stop guessing. Let Gemini AI analyze your video and generate high-converting thumbnails
              in seconds. Professional quality, zero effort.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onStartApp}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center gap-2 shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)]"
              >
                Create My First Thumbnail <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 rounded-xl font-bold text-lg transition-all flex items-center gap-2">
                <Play className="w-5 h-5" /> Watch Demo
              </button>
            </div>

            <div className="mt-16 flex flex-wrap justify-center gap-8 opacity-50 grayscale contrast-125">
              {/* Mock platform logos */}
              <div className="flex items-center gap-2 text-xl font-bold"><Youtube className="w-6 h-6" /> YouTube</div>
              <div className="flex items-center gap-2 text-xl font-bold font-serif italic text-blue-500 underline underline-offset-4">TikTok</div>
              <div className="flex items-center gap-2 text-xl font-bold font-sans tracking-tighter">Instagram</div>
              <div className="flex items-center gap-2 text-xl font-bold">Twitch</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-zinc-900 bg-zinc-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">500k+</div>
              <div className="text-zinc-500 text-sm">Thumbnails Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">45%</div>
              <div className="text-zinc-500 text-sm">Average CTR Increase</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">10s</div>
              <div className="text-zinc-500 text-sm">Generation Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">99.9%</div>
              <div className="text-zinc-500 text-sm">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything You Need</h2>
            <p className="text-zinc-400">Powered by state-of-the-art Gemini 3 Flash models.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8 text-yellow-500" />,
                title: "Instant Analysis",
                description: "Deep video understanding through metadata and frame analysis."
              },
              {
                icon: <Shield className="w-8 h-8 text-blue-500" />,
                title: "Safe for Brands",
                description: "AI filters ensure your thumbnails are always brand-safe and high quality."
              },
              {
                icon: <Sparkles className="w-8 h-8 text-purple-500" />,
                title: "A/B Ready",
                description: "Get multiple variations including high-clickbait or minimal styles."
              },
              {
                icon: <Rocket className="w-8 h-8 text-red-500" />,
                title: "SEO Optimized",
                description: "AI suggests titles and tags that match your new thumbnail."
              },
              {
                icon: <CheckCircle2 className="w-8 h-8 text-green-500" />,
                title: "Easy Export",
                description: "One-click download in various resolutions optimized for platforms."
              },
              {
                icon: <Star className="w-8 h-8 text-amber-500" />,
                title: "Reference Styles",
                description: "Upload your favorite thumbnails and AI will mimic their vibe."
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-red-500/50 transition-all group">
                <div className="mb-6 transform group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ads Placement */}
      <div className="max-w-4xl mx-auto w-full my-12 px-4">
        <AdBanner position="bottom" />
      </div>



      {/* FAQ or Footer CTA */}
      <section className="py-24 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to revolutionize your channel?</h2>
          <button
            onClick={onStartApp}
            className="px-12 py-5 bg-white text-black rounded-2xl font-black text-xl hover:bg-zinc-200 transition-colors"
          >
            Start For Free
          </button>
          <p className="mt-6 text-zinc-500">No credit card required for the 7-day trial.</p>
        </div>
      </section>
    </div>
  );
};
