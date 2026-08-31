import { useState, FormEvent } from 'react';
import { ShoppingBag, X, Trash2, ShieldCheck, CreditCard, Clock, CheckCircle2, ChevronRight, AlertCircle, Sparkles, Plus, Minus } from 'lucide-react';
import { MenuItem, CartItem } from '../types';

interface ClickCollectProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, qty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
}

export default function ClickCollect({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}: ClickCollectProps) {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'payment' | 'success'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupTime, setPickupSlotTime] = useState('12:15');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'ticket_restaurant'>('card');
  const [vouchersBrand, setSelectedVoucherBrand] = useState<'swile' | 'edenred' | 'pluxee' | 'bimpli'>('swile');
  const [isPaying, setIsPaying] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');

  // Cart total calculations - recalculated to mirror secure server recalculation
  const computeTotalSecurely = () => {
    // Send only [{id, quantity}] and recalculate based on master menu prices
    return cart.reduce((acc, item) => acc + (item.menuItem.price * item.quantity), 0);
  };

  const totalAmount = computeTotalSecurely();

  const handleCheckoutSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setCheckoutStep('payment');
  };

  const handlePaymentSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsPaying(true);

    // Simulate Stripe Checkout SCA authentication (3D Secure) and webhook fulfillment (Slide 40 & 44)
    setTimeout(() => {
      setIsPaying(false);
      setCheckoutStep('success');
    }, 2000);
  };

  const resetFlow = () => {
    onClearCart();
    setCheckoutStep('cart');
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setPickupSlotTime('12:15');
    setCardNumber('');
    setCardExpiry('');
    setCardCVC('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans select-none">
      
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Slide-out Panel container */}
      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white dark:bg-stone-950 shadow-2xl flex flex-col justify-between border-l border-stone-200 dark:border-stone-900 animate-slide-right">
        
        {/* Header Block */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-amber-600" />
            <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-white">
              Commande Click & Collect
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-850 dark:hover:text-white rounded-full hover:bg-stone-100 dark:hover:bg-stone-900 cursor-pointer transition-colors"
            aria-label="Fermer le panier"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dynamic Inner Step Pages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* STEP 1 : Cart display page */}
          {checkoutStep === 'cart' && (
            <div className="space-y-4 h-full flex flex-col justify-between">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-4 my-auto">
                  <div className="mx-auto w-12 h-12 text-stone-400 bg-stone-100 dark:bg-stone-900 rounded-full flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-serif text-base font-bold text-stone-800 dark:text-stone-300">Votre panier est vide</p>
                    <p className="text-xs text-stone-500 font-light max-w-xs mx-auto">Ajoutez des plats savoureux depuis notre carte digitale pour commander à emporter.</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer transition-colors"
                  >
                    Parcourir la carte
                  </button>
                </div>
              ) : (
                <div className="space-y-4 flex-1">
                  <p className="text-xs text-stone-500 font-mono tracking-wider uppercase">Vos Articles ({cart.reduce((acc, i) => acc + i.quantity, 0)}) :</p>
                  
                  <div className="space-y-3 divide-y divide-stone-100 dark:divide-stone-900/60 max-h-[50vh] overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.menuItem.id} className="flex gap-4 pt-3 first:pt-0 items-start">
                        <div className="flex-1 space-y-1">
                          <h4 className="text-sm font-semibold text-stone-900 dark:text-white leading-tight">
                            {item.menuItem.name}
                          </h4>
                          <p className="text-xs text-stone-500 font-mono">
                            {item.menuItem.price.toFixed(2)} € / pièce
                          </p>
                        </div>

                        {/* Adjust quantities */}
                        <div className="flex items-center gap-1.5 bg-stone-50 dark:bg-stone-900 rounded border border-stone-200 dark:border-stone-850 p-1 flex-shrink-0">
                          <button
                            onClick={() => onUpdateQuantity(item.menuItem.id, Math.max(1, item.quantity - 1))}
                            className="p-1 text-stone-500 hover:text-amber-600 cursor-pointer"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-mono font-bold text-stone-800 dark:text-stone-200 min-w-[16px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity + 1)}
                            className="p-1 text-stone-500 hover:text-amber-600 cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Remove item */}
                        <button
                          onClick={() => onRemoveItem(item.menuItem.id)}
                          className="p-1.5 text-stone-400 hover:text-red-500 rounded hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer transition-colors"
                          title="Retirer l'article"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Summary block */}
                  <div className="pt-4 border-t border-stone-200 dark:border-stone-900 space-y-2 font-serif text-sm">
                    <div className="flex justify-between text-stone-600 dark:text-stone-400">
                      <span>Sous-total Click & Collect</span>
                      <span>{totalAmount.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-stone-600 dark:text-stone-400">
                      <span>Frais de service (Retrait au bar)</span>
                      <span className="text-emerald-500">Gratuit</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-stone-950 dark:text-white pt-2 border-t border-stone-100 dark:border-stone-900">
                      <span>Montant total</span>
                      <span>{totalAmount.toFixed(2)} €</span>
                    </div>
                  </div>

                  {/* Proceed CTA */}
                  <button
                    onClick={() => setCheckoutStep('details')}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-serif font-bold py-3.5 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Passer la commande à emporter <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2 : Personal pick-up details page */}
          {checkoutStep === 'details' && (
            <form onSubmit={handleCheckoutSubmit} className="space-y-5 animate-fade-in">
              <div className="space-y-1">
                <h3 className="font-serif text-base font-bold text-stone-900 dark:text-white">Détails de retrait</h3>
                <p className="text-xs text-stone-500 font-light">Saisissez l'heure souhaitée pour récupérer vos plats cuisinés minute.</p>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-stone-500 dark:text-stone-400">Nom Complet</label>
                <input
                  type="text"
                  required
                  placeholder="Jean Dupont"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-900 px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-850 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-amber-600 text-sm"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-stone-500 dark:text-stone-400">Adresse E-mail</label>
                  <input
                    type="email"
                    required
                    placeholder="jean@email.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-900 px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-850 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-amber-600 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-stone-500 dark:text-stone-400">Mobile</label>
                  <input
                    type="tel"
                    required
                    placeholder="06 12 34 56 78"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-900 px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-850 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-amber-600 text-sm"
                  />
                </div>
              </div>

              {/* Pick-up Hour slot */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-amber-600" /> Créneau de retrait
                </label>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupSlotTime(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-900 px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-850 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-amber-600 text-sm"
                >
                  <option value="12:00">Retrait à 12h00</option>
                  <option value="12:15">Retrait à 12h15</option>
                  <option value="12:30">Retrait à 12h30</option>
                  <option value="12:45">Retrait à 12h45</option>
                  <option value="13:00">Retrait à 13h00</option>
                  <option value="13:15">Retrait à 13h15</option>
                  <option value="13:30">Retrait à 13h30</option>
                  <option value="19:15">Retrait à 19h15 (Soir)</option>
                  <option value="19:30">Retrait à 19h30 (Soir)</option>
                  <option value="20:00">Retrait à 20h00 (Soir)</option>
                </select>
                <div className="bg-amber-500/5 p-3 rounded-lg border border-amber-500/10 flex items-start gap-2 text-[10px] text-amber-700 dark:text-amber-400 font-sans mt-2">
                  <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  <span>
                    Chaque plat est assemblé fraîchement dès votre arrivée pour préserver la croustillance et les saveurs. Veuillez vous présenter au comptoir d'accueil à l'heure sélectionnée.
                  </span>
                </div>
              </div>

              {/* Navigation CTAs */}
              <div className="flex gap-3 pt-4 border-t border-stone-200 dark:border-stone-900 mt-4">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="flex-1 py-3 border border-stone-200 dark:border-stone-850 rounded-xl text-stone-700 dark:text-stone-300 font-medium text-xs hover:bg-stone-100 cursor-pointer"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-serif font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Procéder au paiement
                </button>
              </div>
            </form>
          )}

          {/* STEP 3 : Stripe payment & Ticket restaurant secure simulation */}
          {checkoutStep === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="space-y-5 animate-fade-in">
              <div className="space-y-1">
                <h3 className="font-serif text-base font-bold text-stone-900 dark:text-white">Sécurisé par Stripe Checkout</h3>
                <p className="text-xs text-stone-500 font-light">Le serveur recalcule le montant total ({totalAmount.toFixed(2)} €) pour prévenir les manipulations.</p>
              </div>

              {/* Payment Category selector */}
              <div className="grid grid-cols-2 bg-stone-100 dark:bg-stone-900 p-1 rounded-xl border border-stone-200 dark:border-stone-850">
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('card')}
                  className={`py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    selectedPaymentMethod === 'card'
                      ? 'bg-white dark:bg-stone-850 text-amber-600 dark:text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  Carte Bancaire
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('ticket_restaurant')}
                  className={`py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    selectedPaymentMethod === 'ticket_restaurant'
                      ? 'bg-white dark:bg-stone-850 text-amber-600 dark:text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  Titre-Restaurant
                </button>
              </div>

              {/* Credit card fields */}
              {selectedPaymentMethod === 'card' ? (
                <div className="space-y-3 p-4 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-stone-200 dark:border-stone-850">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                      <CreditCard className="h-3 w-3 text-stone-400" /> Numéro de Carte
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="4242 4242 4242 4242 (Test)"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white dark:bg-stone-950 px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-850 text-stone-800 dark:text-stone-200 text-sm focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-stone-500 dark:text-stone-400">Date d'expiration</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/AA"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-white dark:bg-stone-950 px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-850 text-stone-800 dark:text-stone-200 text-sm focus:outline-none text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-stone-500 dark:text-stone-400">CVC</label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        value={cardCVC}
                        onChange={(e) => setCardCVC(e.target.value)}
                        className="w-full bg-white dark:bg-stone-950 px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-850 text-stone-800 dark:text-stone-200 text-sm focus:outline-none text-center"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Ticket Restaurant Choice */
                <div className="space-y-4 p-4 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-stone-200 dark:border-stone-850 animate-fade-in">
                  <p className="text-[10px] text-stone-500 font-mono uppercase tracking-wider">Sélectionnez votre carte émetteur :</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold text-stone-800">
                    {['swile', 'edenred', 'pluxee', 'bimpli'].map((brand) => (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => setSelectedVoucherBrand(brand as any)}
                        className={`py-2 px-3 border rounded-lg cursor-pointer transition-all flex items-center justify-between ${
                          vouchersBrand === brand
                            ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 shadow-sm'
                            : 'border-stone-200 dark:border-stone-800 text-stone-500'
                        }`}
                      >
                        <span className="capitalize">{brand}</span>
                        {vouchersBrand === brand && <span className="text-[9px] bg-amber-600 text-white rounded-full p-0.5"><CheckCircle2 className="h-3 w-3" /></span>}
                      </button>
                    ))}
                  </div>

                  <p className="text-[10px] text-stone-400 font-light leading-snug">
                    * Conformément au plafond légal en vigueur (25 €/jour). Stripe Checkout gère automatiquement le split-payment pour le reste-à-charge sur votre carte bancaire standard (Slide 46).
                  </p>
                </div>
              )}

              {/* Secure PCI Statement */}
              <p className="text-[10px] text-stone-500 font-mono flex items-center gap-1.5 justify-center">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Données 3D Secure / Conformité PCI-DSS
              </p>

              {/* Payment navigation CTAs */}
              <div className="flex gap-3 pt-4 border-t border-stone-200 dark:border-stone-900 mt-4">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('details')}
                  className="flex-1 py-3 border border-stone-200 dark:border-stone-850 rounded-xl text-stone-700 dark:text-stone-300 font-medium text-xs hover:bg-stone-100 cursor-pointer"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={isPaying}
                  className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-serif font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {isPaying ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Traitement 3DS...
                    </>
                  ) : (
                    <>Valider et payer {totalAmount.toFixed(2)} €</>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4 : Checkout Success Checkmark page */}
          {checkoutStep === 'success' && (
            <div className="text-center py-12 space-y-6 animate-fade-in my-auto h-full flex flex-col justify-center">
              <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shadow-md animate-bounce">
                <CheckCircle2 className="h-8 w-8" strokeWidth={3} />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">Commande confirmée !</h3>
                <p className="text-xs text-stone-500 font-mono">Code de retrait : ANE-COL-{Math.floor(100 + Math.random() * 900)}</p>
                <p className="text-stone-600 dark:text-stone-400 text-sm font-light max-w-xs mx-auto pt-2">
                  Merci <strong>{customerName}</strong> ! Vos plats sont enregistrés. Rendez-vous au comptoir de retrait à <strong>{pickupTime}</strong>. 
                  Un reçu complet avec votre facture vient d'être généré.
                </p>
              </div>
              <button 
                onClick={resetFlow}
                className="bg-amber-600 hover:bg-amber-700 text-white font-serif font-bold text-xs px-6 py-3 rounded-xl cursor-pointer"
              >
                Continuer mes achats
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
