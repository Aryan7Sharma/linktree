import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2, ArrowRight, BarChart2, Palette, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const FEATURES = [
  {
    icon: Link2,
    title: 'Unlimited links',
    description: 'Add as many links as you want. Organize them with drag-and-drop.',
  },
  {
    icon: Palette,
    title: 'Beautiful themes',
    description: 'Choose from 6 professionally designed themes that match your brand.',
  },
  {
    icon: BarChart2,
    title: 'Real analytics',
    description: 'Track views, clicks, and CTR. Know what resonates with your audience.',
  },
  {
    icon: Zap,
    title: 'AI-powered',
    description: 'Let AI write your bio and optimize your link titles for maximum clicks.',
  },
];

export function LandingPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  const handleClaim = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-[#1a2f16] text-white selection:bg-[#f97316] selection:text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
            <Link2 size={16} className="text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">OrangeLink</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-sm font-semibold text-white/80 hover:text-white transition-colors"
          >
            Log in
          </button>
          <Button onClick={() => navigate('/signup')} size="sm">
            Sign up free
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left: Copy */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-500/20 border border-brand-500/30 rounded-full text-brand-300 text-xs font-semibold">
              <Zap size={12} />
              AI-powered link in bio
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]">
              Everything you are.{' '}
              <span className="text-brand-400">One link.</span>
            </h1>

            <p className="text-lg text-white/60 max-w-lg mx-auto lg:mx-0">
              Join creators using OrangeLink to share everything they create, curate, and sell —
              from Instagram, TikTok, YouTube, and beyond.
            </p>

            {/* Claim input */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto lg:mx-0">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-medium text-sm">
                  orangelink.io/
                </span>
                <input
                  type="text"
                  placeholder="yourname"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleClaim()}
                  className="w-full h-12 bg-white/10 border border-white/20 text-white placeholder-white/20 rounded-xl pl-32 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <Button onClick={handleClaim} size="md" rightIcon={<ArrowRight size={16} />}>
                Claim yours
              </Button>
            </div>
          </div>

          {/* Right: Mock phone */}
          <div className="shrink-0 relative">
            <div className="w-64 h-[520px] bg-[#354f43] border-[10px] border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative">
              {/* Fake phone content */}
              <div className="flex flex-col items-center px-5 pt-12 space-y-4">
                <div className="w-16 h-16 bg-brand-400 rounded-full border-4 border-white/20" />
                <div className="text-center text-white">
                  <p className="font-bold text-sm">@creator</p>
                  <p className="text-xs opacity-60 mt-0.5">Digital Creator</p>
                </div>
                {['My Latest Video', 'Newsletter', 'Twitter'].map((title, i) => (
                  <div
                    key={i}
                    className="w-full py-2.5 bg-[#f4f2eb] rounded-full text-center text-xs font-semibold text-[#354f43]"
                  >
                    {title}
                  </div>
                ))}
                <div className="text-white/20 text-[10px] font-bold pt-2">OrangeLink</div>
              </div>

              {/* Gradient overlay at bottom */}
              <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#1a2f16] to-transparent" />
            </div>

            {/* Floating stats badges */}
            <div className="absolute -left-12 top-20 bg-white text-gray-900 rounded-xl px-3 py-2 shadow-xl text-xs font-bold animate-bounce">
              12,845 views
            </div>
            <div className="absolute -right-8 bottom-24 bg-brand-500 text-white rounded-xl px-3 py-2 shadow-xl text-xs font-bold">
              +34% CTR
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 hover:bg-white/8 transition-colors"
            >
              <div className="w-10 h-10 bg-brand-500/20 rounded-xl flex items-center justify-center">
                <Icon size={20} className="text-brand-400" />
              </div>
              <h3 className="font-bold text-sm">{title}</h3>
              <p className="text-xs text-white/50 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
