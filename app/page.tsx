import Link from "next/link";
import { AuthNavButtons } from "@/components/auth-nav";
import { Heart, Sparkles, Send, Palette, Share2, Lock, Zap, Music, Image as ImageIcon, ChevronRight, Star } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fff0f3] relative overflow-hidden font-sans text-rose-950 selection:bg-rose-200">
      {/* Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-rose-200/30 rounded-full blur-[80px] sm:blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[250px] h-[250px] sm:w-[500px] sm:h-[500px] bg-pink-200/30 rounded-full blur-[60px] sm:blur-[100px]" />
          <div className="absolute top-[40%] left-[50%] w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] bg-purple-200/20 rounded-full blur-[60px] sm:blur-[100px]" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-white/60 backdrop-blur-xl border-b border-rose-100/50 sticky top-0">
        <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <div className="relative">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500 fill-rose-500 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-rose-400 blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
            </div>
            <span className="text-lg sm:text-2xl font-bold font-display tracking-tight bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              BlushBuild
            </span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <AuthNavButtons />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 pt-10 sm:pt-16 md:pt-20 pb-16 sm:pb-24 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          <div className="flex flex-col items-center space-y-5 sm:space-y-8 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 sm:gap-2.5 bg-white/80 backdrop-blur-md border border-rose-200 rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-default mt-4 sm:mt-8">
              <span className="flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-rose-600">The Cutest Interactive Builder</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold leading-[1.1] sm:leading-[1.05] tracking-tight text-rose-950 drop-shadow-sm px-2">
              Build the perfect
              <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-rose-600 via-pink-500 to-rose-600 bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
                romantic surprise
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-rose-900/80 max-w-2xl leading-relaxed font-medium px-2">
              Create a stunning, personalized page for your crush or partner. Add music, photos, and interactive twists.
              <span className="block mt-2 font-bold text-rose-600">No coding required. Free forever.</span>
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 w-full sm:w-auto pt-4 sm:pt-6 px-2 sm:px-0">
              <Link
                href="/create"
                className="group relative flex items-center justify-center gap-2.5 sm:gap-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-base sm:text-lg md:text-xl font-bold shadow-xl shadow-rose-300/40 hover:shadow-2xl hover:shadow-rose-400/50 hover:-translate-y-1 transition-all active:scale-95 overflow-hidden"
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-white/30 group-hover:fill-white transition-colors relative z-10" />
                <span className="relative z-10">Start Building</span>
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-12 sm:py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-rose-950 mb-3 sm:mb-4">
              Everything you need to make them say <span className="text-rose-600">Yes!</span>
            </h2>
            <p className="text-rose-700/70 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium">
              Build stunning romantic pages with all the bells and whistles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <FeatureCard
              icon={<Palette className="w-5 h-5 sm:w-6 sm:h-6" />}
              title="Beautiful Templates"
              description="Choose from 3 romantic themes: Confessions, Valentines, and Proposals."
              gradient="from-pink-500 to-rose-500"
            />
            <FeatureCard
              icon={<Music className="w-5 h-5 sm:w-6 sm:h-6" />}
              title="Background Music"
              description="Add your special song to set the perfect mood for your message."
              gradient="from-purple-500 to-pink-500"
            />
            <FeatureCard
              icon={<ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
              title="Photo Uploads"
              description="Include your favorite memories to make it extra personal and heartfelt."
              gradient="from-rose-500 to-orange-500"
            />
            <FeatureCard
              icon={<Lock className="w-5 h-5 sm:w-6 sm:h-6" />}
              title="Password Protection"
              description="Lock your page with a password or nickname, keep it just between you two."
              gradient="from-blue-500 to-purple-500"
            />
            <FeatureCard
              icon={<Zap className="w-5 h-5 sm:w-6 sm:h-6" />}
              title="Interactive Twists"
              description="Add a runaway button or heart puzzle to make them work for the 'Yes!'"
              gradient="from-amber-500 to-rose-500"
            />
            <FeatureCard
              icon={<Share2 className="w-5 h-5 sm:w-6 sm:h-6" />}
              title="Instant Sharing"
              description="Get a unique link and QR code to share via text, social, or in person."
              gradient="from-teal-500 to-emerald-500"
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="relative z-10 py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-rose-950 mb-3 sm:mb-4">
              How it works
            </h2>
            <p className="text-rose-700/70 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium">
              Three simple steps to create something unforgettable.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <StepCard
              number="01"
              title="Pick a Template"
              desc="Choose from Confession, Valentine, or Proposal themes."
              icon={<Palette className="w-6 h-6 sm:w-7 sm:h-7 text-white" />}
              gradient="from-pink-500 to-rose-500"
            />
            <StepCard
              number="02"
              title="Customize It"
              desc="Add your message, photos, music, and choose your interactive twist or protection."
              icon={<Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />}
              gradient="from-rose-500 to-orange-500"
            />
            <StepCard
              number="03"
              title="Share & Celebrate"
              desc="Send the link or QR code. Watch the magic happen when they open it!"
              icon={<Send className="w-6 h-6 sm:w-7 sm:h-7 text-white" />}
              gradient="from-purple-500 to-pink-500"
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-14 sm:py-20 md:py-28 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl p-6 sm:p-10 md:p-12 lg:p-16 rounded-2xl sm:rounded-3xl border-2 border-rose-100 shadow-2xl shadow-rose-200/50 text-center">
          <div className="mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-rose-50 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-rose-100 mb-4 sm:mb-6">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 fill-rose-500" />
              <span className="text-xs sm:text-sm font-bold text-rose-700 uppercase tracking-wide">100% Free Forever</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-rose-950 mb-4 sm:mb-6 leading-tight">
            Ready to make them blush?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-rose-700/80 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto font-medium leading-relaxed px-2">
            Create your personalized romantic page in under 2 minutes. No signup, no credit card, just pure romance.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg font-bold shadow-xl shadow-rose-300/40 hover:shadow-2xl hover:shadow-rose-400/50 hover:-translate-y-1 transition-all active:scale-95"
          >
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
            Create Your Page Now
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-6 sm:py-8 px-4 sm:px-6 border-t border-rose-100/50 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-2.5 group">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 fill-rose-500 group-hover:scale-110 transition-transform" />
              <span className="font-display font-bold text-lg sm:text-xl text-rose-800">BlushBuild</span>
            </div>
            <p className="text-xs sm:text-sm text-rose-600/70 text-center max-w-md font-medium px-4">
              Made with love for everyone brave enough to confess their feelings.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StepCard({ number, title, desc, icon, gradient }: { number: string; title: string; desc: string; icon: React.ReactNode; gradient: string }) {
  return (
    <div className="relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-sm border-2 border-rose-100 shadow-lg hover:shadow-2xl hover:shadow-rose-200/50 transition-all duration-300 group hover:-translate-y-2 overflow-hidden">
      <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 sm:mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all`}>
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-bold font-display text-rose-950 mb-2 sm:mb-3">{title}</h3>
      <p className="text-sm sm:text-base text-rose-700/70 leading-relaxed font-medium">{desc}</p>
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-5xl sm:text-7xl font-display font-bold text-rose-100 select-none group-hover:text-rose-200/50 transition-colors">
        {number}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, gradient }: { icon: React.ReactNode; title: string; description: string; gradient: string }) {
  return (
    <div className="group relative p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-white/70 backdrop-blur-sm border border-rose-100 shadow-md hover:shadow-xl hover:shadow-rose-200/40 transition-all duration-300 hover:-translate-y-1">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 sm:mb-5 text-white shadow-lg group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-base sm:text-lg font-bold font-display text-rose-950 mb-1.5 sm:mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-rose-700/70 leading-relaxed font-medium">{description}</p>
    </div>
  );
}
