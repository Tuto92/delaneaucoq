import { useState, useEffect } from 'react';
import { Sun, Moon, ShoppingBag, Menu, X, ChefHat } from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  cart: CartItem[];
  onOpenCart: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export default function Header({ cart, onOpenCart, onScrollToSection }: HeaderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Calculate total items in cart
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    // 1. Theme Initialization (Prioritize saved choice, then system preference)
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    // 2. Scroll detection for sticky background style
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  const navItems = [
    { label: 'Accueil', id: 'hero' },
    { label: 'La Carte', id: 'menu' },
    { label: 'Réserver', id: 'reservation' },
    { label: 'Click & Collect', id: 'click-collect-section' },
    { label: 'Contact', id: 'contact' }
  ];

  const handleNavClick = (sectionId: string) => {
    onScrollToSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-stone-950/95 backdrop-blur-md shadow-md border-b border-stone-200 dark:border-stone-900 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <button 
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-2 group cursor-pointer text-left"
        >
          <div className="bg-amber-600 group-hover:bg-amber-700 text-white p-2 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md">
            <ChefHat className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-serif text-xl md:text-2xl font-bold tracking-tight text-stone-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              De l'Âne au Coq
            </h1>
            <p className="text-[10px] uppercase font-mono tracking-widest text-amber-600 dark:text-amber-500 font-semibold leading-none mt-0.5">
              Tradition & terroir
            </p>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-600 after:transform after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Actions Group (Cart, Theme, Mobile toggle) */}
        <div className="flex items-center gap-3">
          
          {/* Shopping Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300 transition-all duration-200 cursor-pointer flex items-center justify-center min-w-[44px] min-h-[44px]"
            aria-label="Voir le panier de Click & Collect"
            title="Voir le panier"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-stone-950 animate-bounce">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Theme Toggle (Sun represents switching to light mode in dark, Moon represents switching to dark in light) */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300 transition-all duration-200 cursor-pointer flex items-center justify-center min-w-[44px] min-h-[44px]"
            aria-label={theme === 'light' ? "Passer en mode sombre" : "Passer en mode clair"}
            title={theme === 'light' ? "Activer le mode sombre" : "Activer le mode clair"}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5 text-stone-700" />
            ) : (
              <Sun className="h-5 w-5 text-amber-400" />
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300 cursor-pointer flex items-center justify-center min-w-[44px] min-h-[44px]"
            aria-label="Ouvrir le menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-[70px] bg-white/95 dark:bg-stone-950/95 backdrop-blur-lg border-b border-stone-200 dark:border-stone-900 shadow-xl py-6 px-4 md:hidden flex flex-col gap-4 animate-fade-in animate-slide-down">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="text-left py-3 px-4 rounded-xl font-medium text-stone-700 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors text-lg"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
