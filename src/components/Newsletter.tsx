import { useState, FormEvent } from 'react';
import { Mail, Send, CheckCircle2, Shield, Sparkles } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [optIn, setOptIn] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!optIn) {
      alert("Veuillez accepter le traitement de vos données pour continuer.");
      return;
    }

    setIsSubmitting(true);

    // Simulate database double opt-in capture and email dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail('');
    }, 1200);
  };

  return (
    <section className="py-16 px-4 bg-amber-600 dark:bg-stone-900/60 border-y border-stone-200/20 dark:border-stone-900 font-sans text-white overflow-hidden relative">
      
      {/* Background visual texture decoration */}
      <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12 select-none pointer-events-none">
        <Mail className="w-80 h-80" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center space-y-6">
        
        {/* Intro */}
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1 bg-amber-500/20 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest font-semibold text-white">
            <Sparkles className="h-3.5 w-3.5" /> Le Club Privilège
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Une coupe de Champagne offerte
          </h2>
          <p className="text-stone-100 dark:text-stone-300 text-sm max-w-xl mx-auto font-light leading-relaxed">
            Inscrivez-vous à notre lettre d'information pour recevoir votre cadeau de bienvenue et être informé de nos événements, soirées jazz et nouveaux plats mijotés.
          </p>
        </div>

        {/* Form and successes */}
        {isSubmitted ? (
          <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/20 max-w-lg mx-auto space-y-4 animate-fade-in text-center">
            <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold">Bienvenue au Club Privilège !</h3>
              <p className="text-xs text-stone-200 font-light leading-relaxed">
                Un e-mail de validation (double opt-in) vient d'être envoyé. Confirmez-le pour activer votre invitation :
              </p>
            </div>
            {/* Promo Code Box */}
            <div className="bg-white text-amber-700 py-3.5 rounded-xl border-2 border-dashed border-amber-600/50 flex flex-col items-center justify-center font-mono select-all">
              <span className="text-[10px] uppercase font-bold text-stone-400 font-sans tracking-wider leading-none mb-1">Votre Code de Bienvenue</span>
              <span className="text-2xl font-bold leading-none">CHAMPAGNE2026</span>
            </div>
            <p className="text-[10px] text-stone-300 font-light">
              * Présentez ce code lors de votre prochaine réservation au restaurant. Offre soumise à conditions (1 verre de champagne par convive majeur, pour tout repas pris en salle).
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4 animate-fade-in">
            {/* Form Input Line */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse e-mail (Ex: jean@email.com)"
                className="flex-1 bg-white/15 dark:bg-stone-950/60 border border-white/20 dark:border-stone-850 hover:border-white/40 focus:border-white focus:bg-white focus:text-stone-900 rounded-xl px-4 py-3 text-sm placeholder-white/60 focus:placeholder-stone-400 focus:outline-none transition-all text-white font-medium"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-stone-900 hover:bg-stone-950 text-white font-serif font-bold text-sm px-6 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Envoi...
                  </>
                ) : (
                  <>
                    Rejoindre <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            {/* Consent Double Opt-In checkbox (Slide 30 - Mandatory rule for compliance) */}
            <div className="flex items-start gap-3 text-left">
              <input
                id="optin-newsletter"
                type="checkbox"
                required
                checked={optIn}
                onChange={() => setOptIn(!optIn)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-white/20 accent-amber-600 mt-0.5 cursor-pointer flex-shrink-0"
              />
              <label htmlFor="optin-newsletter" className="text-[10px] text-stone-100 dark:text-stone-300 leading-snug cursor-pointer select-none">
                J'accepte que la SARL De l'Âne au Coq collecte mon adresse e-mail pour m'adresser des newsletters et codes d'invitation. Je certifie avoir pris connaissance de la <strong className="text-white hover:underline cursor-pointer">Politique de Confidentialité RGPD</strong>. Je peux me désinscrire à tout moment grâce au lien présent dans chaque e-mail.
              </label>
            </div>
          </form>
        )}

        {/* Security / Privacy guarantee */}
        <p className="text-[10px] text-stone-200 dark:text-stone-400 font-mono flex items-center justify-center gap-1">
          <Shield className="h-3.5 w-3.5" /> Lettre d'information sécurisée double opt-in RGPD · Pas de spam
        </p>

      </div>
    </section>
  );
}
