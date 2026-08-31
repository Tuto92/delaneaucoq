import { Star, Clock, ChefHat, MapPin, ArrowRight } from 'lucide-react';

interface HeroProps {
  onScrollToSection: (sectionId: string) => void;
}

export default function Hero({ onScrollToSection }: HeroProps) {
  return (
    <section 
      id="hero" 
      className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 px-4 bg-stone-950 text-white overflow-hidden"
    >
      {/* Background Image with warm gradient overlay to guarantee text legibility */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/src/assets/images/facade_bistrot_1783676445320.jpg" 
          alt="Façade chaleureuse du restaurant De l'Âne au Coq" 
          className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-[10s] ease-out hover:scale-100"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-stone-950/40 z-10" />
      </div>

      <div className="relative z-20 max-w-4xl mx-auto text-center space-y-8 select-none">
        
        {/* Animated Accent Divider */}
        <div className="inline-flex items-center gap-2 bg-amber-600/20 dark:bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-amber-400 text-xs font-mono uppercase tracking-widest animate-fade-in">
          <ChefHat className="h-4 w-4" /> Cuisine 100% Artisanale & Fait Maison
        </div>

        {/* Heading pairing: Garamond editorial style for display (Slide 80-81) */}
        <div className="space-y-4">
          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] animate-letter-spacing">
            Une cuisine sincère,<br />
            <span className="text-amber-500 italic font-medium">du terroir à l'assiette</span>
          </h2>
          
          <p className="font-sans text-stone-300 text-base sm:text-xl max-w-2xl mx-auto font-light leading-relaxed animate-fade-in">
            Bienvenue chez <span className="font-semibold text-white">De l'Âne au Coq</span>, bistrot parisien traditionnel. 
            Découvrez nos recettes mijotées à partir de produits frais de saison à Issy-les-Moulineaux.
          </p>
        </div>

        {/* Quick actions (CTAs) above the fold (Slide 12 & 82) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in">
          <button
            onClick={() => onScrollToSection('reservation')}
            className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-serif font-bold text-lg px-8 py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20 hover:shadow-amber-950/40 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer ripple-btn group"
            id="cta-reserver-hero"
          >
            Réserver une table
            <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => onScrollToSection('menu')}
            className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white font-medium text-base px-8 py-4 rounded-xl border border-white/20 hover:border-white/35 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            id="cta-menu-hero"
          >
            Découvrir notre Carte
          </button>
        </div>

        {/* Animated Quick Trust Stats & Badge (Slide 12 & 81) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-6 pt-12 max-w-3xl mx-auto border-t border-white/10 text-stone-300 animate-fade-in">
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-amber-500 text-2xl sm:text-4xl font-serif font-bold">
              4.9 <Star className="h-5 w-5 sm:h-7 sm:w-7 fill-amber-500 text-amber-500 inline-block align-middle" />
            </div>
            <p className="text-[10px] sm:text-xs uppercase font-mono tracking-wider text-stone-400 mt-1">
              Note Google Maps
            </p>
          </div>

          <div className="text-center border-x border-white/10">
            <div className="text-2xl sm:text-4xl font-serif font-bold text-white">
              201+
            </div>
            <p className="text-[10px] sm:text-xs uppercase font-mono tracking-wider text-stone-400 mt-1">
              Avis authentiques
            </p>
          </div>

          <div className="text-center">
            <div className="text-2xl sm:text-4xl font-serif font-bold text-amber-500">
              €10-20
            </div>
            <p className="text-[10px] sm:text-xs uppercase font-mono tracking-wider text-stone-400 mt-1">
              Gamme de prix
            </p>
          </div>

        </div>

        {/* Quick address & hours - accessible in 1 tap (Slide 12) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs sm:text-sm text-stone-400 pt-4 font-mono select-text">
          <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer" onClick={() => onScrollToSection('contact')}>
            <MapPin className="h-4 w-4 text-amber-500" /> 24 Rue Anatole France, Issy-les-Moulineaux
          </span>
          <span className="hidden sm:inline text-stone-600">|</span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-amber-500" /> Ouvert midi & soir · Fermé Dimanche
          </span>
        </div>

      </div>
    </section>
  );
}
