import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import DigitalMenu from './components/DigitalMenu';
import ReservationForm from './components/ReservationForm';
import ClickCollect from './components/ClickCollect';
import MapContact from './components/MapContact';
import Newsletter from './components/Newsletter';
import ReviewsSection from './components/ReviewsSection';
import Footer from './components/Footer';
import AudioAmbiance from './components/AudioAmbiance';

import { MenuItem, CartItem, TimeSlot } from './types';
import { AVAILABLE_SLOTS_LUNCH, AVAILABLE_SLOTS_DINNER } from './data';
import { Star, Phone, Calendar, ShoppingBag, Check } from 'lucide-react';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Real-time capacity slots synced globally (prevents surbooking!)
  const [lunchSlots, setLunchSlots] = useState<TimeSlot[]>(AVAILABLE_SLOTS_LUNCH);
  const [dinnerSlots, setDinnerSlots] = useState<TimeSlot[]>(AVAILABLE_SLOTS_DINNER);

  // Discrete Toast Notification System (Slide 81)
  const [toast, setToast] = useState<{ id: string; message: string } | null>(null);

  // Load cart from localStorage on startup (Slide 41)
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('panier');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error("Failed to parse cart from localStorage:", e);
    }
  }, []);

  // Save cart to localStorage whenever it changes (Slide 41)
  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('panier', JSON.stringify(updatedCart));
  };

  const triggerToast = (msg: string) => {
    const id = Math.random().toString();
    setToast({ id, message: msg });
    
    // Dissolve toast after 3 seconds
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3000);
  };

  // Click & Collect handlers
  const handleAddToOrder = (item: MenuItem, qty: number) => {
    const updatedCart = [...cart];
    const existingIndex = updatedCart.findIndex((i) => i.menuItem.id === item.id);

    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += qty;
    } else {
      updatedCart.push({ menuItem: item, quantity: qty });
    }

    saveCartToStorage(updatedCart);
    triggerToast(`🛒 ${qty}x "${item.name}" ajouté à emporter !`);
  };

  const handleUpdateQuantity = (itemId: string, qty: number) => {
    const updatedCart = cart.map((item) => {
      if (item.menuItem.id === itemId) {
        return { ...item, quantity: qty };
      }
      return item;
    });
    saveCartToStorage(updatedCart);
  };

  const handleRemoveItem = (itemId: string) => {
    const itemToRemove = cart.find(i => i.menuItem.id === itemId);
    const updatedCart = cart.filter((item) => item.menuItem.id !== itemId);
    saveCartToStorage(updatedCart);
    if (itemToRemove) {
      triggerToast(`🗑️ "${itemToRemove.menuItem.name}" retiré du panier.`);
    }
  };

  const handleClearCart = () => {
    saveCartToStorage([]);
  };

  // Sync and allocate capacity limits in real-time
  const handleUpdateSlotCapacity = (
    slotTime: string, 
    service: 'lunch' | 'dinner', 
    covers: number,
    isWalkIn: boolean
  ): boolean => {
    let success = false;
    const updateSlots = (slots: TimeSlot[]) => {
      return slots.map((slot) => {
        if (slot.time === slotTime) {
          if (slot.availableCapacity >= covers) {
            success = true;
            return {
              ...slot,
              availableCapacity: slot.availableCapacity - covers
            };
          }
        }
        return slot;
      });
    };

    if (service === 'lunch') {
      const updated = updateSlots(lunchSlots);
      if (success) setLunchSlots(updated);
    } else {
      const updated = updateSlots(dinnerSlots);
      if (success) setDinnerSlots(updated);
    }

    return success;
  };

  // Smooth scroll helper
  const handleScrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-amber-600 selection:text-white">
      
      {/* Dynamic Header with scroll and shopping bag integrations */}
      <Header 
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        onScrollToSection={handleScrollToSection}
      />

      {/* Main Sections Body */}
      <main className="flex-1 bg-stone-50 dark:bg-stone-900/10">
        
        {/* Fullscreen Hero Landing Fold */}
        <Hero onScrollToSection={handleScrollToSection} />

        {/* Categories Digital Menu Grid (HTML Native) */}
        <DigitalMenu onAddToOrder={handleAddToOrder} />

        {/* Real-Time Booking Form & Terminal Dashboard (SQL Simulation) */}
        <ReservationForm 
          lunchSlots={lunchSlots}
          dinnerSlots={dinnerSlots}
          onReservationSuccess={(res) => triggerToast(`🎉 Table réservée le ${res.date} à ${res.timeSlot} !`)}
          onUpdateSlotCapacity={handleUpdateSlotCapacity}
        />

        {/* Social Proof (Customer Testimonials & Gérant replies) */}
        <ReviewsSection />

        {/* Interactive Google Maps Routing & Copiable Contact Details */}
        <MapContact />

        {/* Newsletter Double-Opt In Lead capture */}
        <Newsletter />

      </main>

      {/* Legally Compliant LCEN / RGPD footer */}
      <Footer />

      {/* Option Ambiance Sonore: Custom Brass player */}
      <AudioAmbiance />

      {/* Slide-out Cart Drawer panel */}
      <ClickCollect 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* STICKY BOTTOM BUTTONS ON MOBILE (Slide 12 & 81 - 5 infos à 1 tap) */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-900 grid grid-cols-3 md:hidden h-16 shadow-xl text-stone-700 dark:text-stone-300 font-sans text-xs">
        
        {/* Call CTA */}
        <a 
          href="tel:+33140958350"
          className="flex flex-col items-center justify-center gap-1 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors border-r border-stone-100 dark:border-stone-900/60"
        >
          <Phone className="h-4 w-4 text-amber-600" />
          <span className="font-medium text-[10px] tracking-wide">Appeler</span>
        </a>

        {/* Book CTA */}
        <button
          onClick={() => handleScrollToSection('reservation')}
          className="flex flex-col items-center justify-center gap-1 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors border-r border-stone-100 dark:border-stone-900/60 cursor-pointer"
        >
          <Calendar className="h-4 w-4 text-amber-600" />
          <span className="font-medium text-[10px] tracking-wide">Réserver</span>
        </button>

        {/* Click & Collect Cart Drawer trigger */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center gap-1 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors cursor-pointer relative"
        >
          <div className="relative">
            <ShoppingBag className="h-4 w-4 text-amber-600" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-600 text-white font-mono text-[8px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-white dark:border-stone-950">
                {cart.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            )}
          </div>
          <span className="font-medium text-[10px] tracking-wide">Panier</span>
        </button>

      </div>

      {/* DISCRETE CORNER SLIDE-IN TOAST (Slide 81) */}
      {toast && (
        <div className="fixed bottom-20 left-4 md:bottom-6 md:left-6 z-50 bg-stone-900/95 dark:bg-stone-100/95 backdrop-blur-md border border-stone-800 dark:border-stone-200 text-white dark:text-stone-900 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 max-w-sm animate-fade-in animate-slide-left">
          <div className="bg-emerald-600 text-white p-1 rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="h-3 w-3" strokeWidth={3} />
          </div>
          <p className="text-xs font-medium tracking-wide">{toast.message}</p>
        </div>
      )}

    </div>
  );
}
