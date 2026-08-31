import { useState } from 'react';
import { Sparkles, Eye, ShoppingCart, Plus, Minus, Info, Flame, AlertCircle } from 'lucide-react';
import { MenuItem } from '../types';
import { MENU_ITEMS } from '../data';

interface DigitalMenuProps {
  onAddToOrder: (item: MenuItem, quantity: number) => void;
}

export default function DigitalMenu({ onAddToOrder }: DigitalMenuProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'entrée' | 'plat' | 'dessert' | 'boisson'>('all');
  const [onlyVegetarian, setOnlyVegetarian] = useState(false);
  const [onlyGlutenFree, setOnlyGlutenFree] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string; desc: string } | null>(null);
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});

  const categories = [
    { label: 'Tous', value: 'all' },
    { label: 'Entrées', value: 'entrée' },
    { label: 'Plats', value: 'plat' },
    { label: 'Desserts', value: 'dessert' },
    { label: 'Boissons', value: 'boisson' }
  ];

  // Filtering logic
  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesVeg = !onlyVegetarian || item.isVegetarian;
    const matchesGF = !onlyGlutenFree || item.isGlutenFree;
    return matchesCategory && matchesVeg && matchesGF;
  });

  const handleQuantityChange = (itemId: string, increment: boolean) => {
    setItemQuantities((prev) => {
      const current = prev[itemId] || 1;
      const next = increment ? current + 1 : Math.max(1, current - 1);
      return { ...prev, [itemId]: next };
    });
  };

  const handleAddClick = (item: MenuItem) => {
    const qty = itemQuantities[item.id] || 1;
    onAddToOrder(item, qty);
    // Reset quantity input local state back to 1
    setItemQuantities((prev) => ({ ...prev, [item.id]: 1 }));
  };

  const getDishImage = (item: MenuItem) => {
    if (item.id === 'p1') {
      // Signature duck confit generated image
      return '/src/assets/images/plat_signature_1783676478217.jpg';
    }
    // High-quality, safe, styled CDN image fallbacks for other dishes
    if (item.category === 'entrée') {
      return `https://picsum.photos/seed/starter_${item.id}/600/450`;
    } else if (item.category === 'plat') {
      return `https://picsum.photos/seed/main_${item.id}/600/450`;
    } else if (item.category === 'dessert') {
      return `https://picsum.photos/seed/dessert_${item.id}/600/450`;
    } else {
      return `https://picsum.photos/seed/beverage_${item.id}/600/450`;
    }
  };

  return (
    <section id="menu" className="py-20 px-4 bg-stone-50 dark:bg-stone-900/40">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Title and Intro */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-stone-950 dark:text-white">
            La Carte Digitale
          </h2>
          <div className="h-1 w-20 bg-amber-600 mx-auto rounded-full" />
          <p className="text-stone-600 dark:text-stone-400 font-light text-base">
            Tous nos plats sont cuisinés sur place de manière artisanale avec des ingrédients frais. 
            Cliquez sur l'icône photo pour admirer le plat en grand.
          </p>
        </div>

        {/* Filter Navigation Control Bar */}
        <div className="space-y-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-4">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value as any)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat.value
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-900/10'
                    : 'bg-white dark:bg-stone-850 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-amber-500'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Special Preferences Toggles (Veg / Gluten Free) */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <label className="flex items-center gap-2.5 cursor-pointer select-none text-stone-700 dark:text-stone-300 group">
              <input
                type="checkbox"
                checked={onlyVegetarian}
                onChange={() => setOnlyVegetarian(!onlyVegetarian)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300 dark:border-stone-700 accent-amber-600 cursor-pointer"
              />
              <span className="group-hover:text-amber-600 transition-colors">🥦 Option Végétarienne</span>
            </label>
            
            <label className="flex items-center gap-2.5 cursor-pointer select-none text-stone-700 dark:text-stone-300 group">
              <input
                type="checkbox"
                checked={onlyGlutenFree}
                onChange={() => setOnlyGlutenFree(!onlyGlutenFree)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300 dark:border-stone-700 accent-amber-600 cursor-pointer"
              />
              <span className="group-hover:text-amber-600 transition-colors">🌾 Sans Gluten</span>
            </label>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {filteredItems.map((item) => {
            const qty = itemQuantities[item.id] || 1;
            const itemImage = getDishImage(item);
            
            return (
              <div 
                key={item.id}
                className="bg-white dark:bg-stone-950 p-5 rounded-2xl border border-stone-200 dark:border-stone-900/60 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row gap-5 group"
              >
                {/* Visual block with hover image zoom and modal trigger */}
                <div className="relative w-full sm:w-36 h-36 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                  <img
                    src={itemImage}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Banner tag for Homemade / Fait Maison */}
                  {item.isHomemade && (
                    <span className="absolute top-2 left-2 bg-amber-600 text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                      🍳 Fait Maison
                    </span>
                  )}
                  {/* Photo inspector Lightbox Overlay button (Slide 82) */}
                  <button
                    onClick={() => setLightboxImage({ url: itemImage, title: item.name, desc: item.description })}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-300 cursor-pointer"
                    aria-label={`Agrandir la photo de ${item.name}`}
                  >
                    <div className="bg-amber-600/90 p-2.5 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <Eye className="h-5 w-5" />
                    </div>
                  </button>
                </div>

                {/* Content details and Actions */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    {/* Header line with Name & Price */}
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {item.name}
                      </h3>
                      <span className="font-serif font-bold text-base text-amber-600 dark:text-amber-400 whitespace-nowrap">
                        {item.price.toFixed(2)} €
                      </span>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-light leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Indicators & Ordering Panel */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-stone-100 dark:border-stone-900/60 mt-3">
                    
                    {/* Allergens & dietary tags (Slide 4) */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.isVegetarian && (
                        <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono font-medium">
                          VÉGÉ
                        </span>
                      )}
                      {item.isGlutenFree && (
                        <span className="bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 text-[10px] px-2 py-0.5 rounded font-mono font-medium">
                          SANS GLUTEN
                        </span>
                      )}
                      
                      {/* Allergen vignettes */}
                      {item.allergens.map((alg) => (
                        <span 
                          key={alg} 
                          className="bg-stone-100 dark:bg-stone-900 text-stone-500 dark:text-stone-400 text-[9px] px-1.5 py-0.5 rounded font-mono border border-stone-200/40 dark:border-stone-850"
                          title={`Contient : ${alg}`}
                        >
                          {alg.slice(0, 3).toUpperCase()}
                        </span>
                      ))}
                    </div>

                    {/* Quantity selectors & Add to Cart button */}
                    {item.category !== 'boisson' || item.id !== 'b4' ? (
                      <div className="flex items-center gap-2">
                        {/* Minus / Plus Selector */}
                        <div className="flex items-center bg-stone-100 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-850">
                          <button
                            onClick={() => handleQuantityChange(item.id, false)}
                            className="p-1.5 text-stone-500 hover:text-amber-600 cursor-pointer"
                            aria-label="Réduire la quantité"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-mono font-bold text-stone-800 dark:text-stone-200 min-w-[20px] text-center">
                            {qty}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, true)}
                            className="p-1.5 text-stone-500 hover:text-amber-600 cursor-pointer"
                            aria-label="Augmenter la quantité"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Add Button */}
                        <button
                          onClick={() => handleAddClick(item)}
                          className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
                          title="Ajouter à emporter"
                        >
                          <ShoppingCart className="h-3.5 w-3.5" /> Ajouter
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-stone-400 italic">En salle uniquement</span>
                    )}

                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Empty Search Fallback */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-stone-950 rounded-2xl border border-dashed border-stone-200 dark:border-stone-800 p-8">
            <AlertCircle className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <p className="font-serif text-lg font-bold text-stone-800 dark:text-stone-200">Aucun plat ne correspond à vos filtres</p>
            <p className="text-xs text-stone-500 mt-1">Essayez d'autres critères ou réinitialisez vos options.</p>
            <button 
              onClick={() => { setOnlyVegetarian(false); setOnlyGlutenFree(false); setSelectedCategory('all'); }} 
              className="mt-4 bg-amber-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-amber-700 cursor-pointer"
            >
              Tout réinitialiser
            </button>
          </div>
        )}

        {/* Legend of Allergens (Mandatory INCO compliance) - Slide 4 & 30 */}
        <div className="bg-white dark:bg-stone-950/80 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-900/60 text-xs text-stone-500 dark:text-stone-400 space-y-2">
          <p className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
            <Info className="h-4 w-4 text-amber-500" /> Allergènes & Réglementation INCO :
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px] pt-1">
            <p><strong>GLU:</strong> Gluten</p>
            <p><strong>LAI:</strong> Produits Laitiers</p>
            <p><strong>OEU:</strong> Oeufs</p>
            <p><strong>MOU:</strong> Moutarde</p>
            <p><strong>FRU:</strong> Fruits à Coque</p>
            <p><strong>CEL:</strong> Céleri</p>
            <p><strong>SUL:</strong> Sulfites</p>
            <p className="text-amber-500 font-semibold font-sans">🍳 Fait Maison : Plats élaborés sur place.</p>
          </div>
        </div>

      </div>

      {/* LIGHTBOX MODAL TRIGGERED BY CLIC ON PHOTO (Slide 82) */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-3xl w-full bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl animate-zoom-in cursor-default" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full transition-colors cursor-pointer z-10"
              aria-label="Fermer la vue"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="aspect-4/3 w-full bg-stone-950">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-6 bg-stone-900 text-stone-200">
              <h4 className="font-serif text-xl font-bold text-white mb-2">{lightboxImage.title}</h4>
              <p className="text-sm font-light text-stone-400">{lightboxImage.desc}</p>
              <p className="text-[10px] text-amber-500 uppercase font-mono tracking-widest font-semibold mt-4">🍳 Recette Authentique De l'Âne au Coq</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
