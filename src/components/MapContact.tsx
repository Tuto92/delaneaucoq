import { useState } from 'react';
import { MapPin, Phone, Mail, Instagram, Copy, Check, Navigation, Bus, Car, ChefHat, Sparkles } from 'lucide-react';

export default function MapContact() {
  const [copied, setCopied] = useState(false);

  const address = "24 Rue Anatole France, 92130 Issy-les-Moulineaux, France";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-20 px-4 bg-stone-50 dark:bg-stone-900/40 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-stone-950 dark:text-white">
            Nous Trouver & Nous Contacter
          </h2>
          <div className="h-1 w-20 bg-amber-600 mx-auto rounded-full" />
          <p className="text-stone-600 dark:text-stone-400 font-light text-sm">
            Retrouvez-nous facilement au cœur d'Issy-les-Moulineaux, à quelques pas du Métro Mairie d'Issy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Direct Contact & Accessibility Details (Slide 80 & 81) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* Quick action info card */}
            <div className="bg-white dark:bg-stone-950 p-6 rounded-2xl border border-stone-200 dark:border-stone-900 shadow-md space-y-5">
              
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white border-b border-stone-100 dark:border-stone-900/60 pb-3 flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-amber-600" /> Informations Utiles
              </h3>

              {/* Address with Copiable button (Slide 80) */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">Notre Adresse</span>
                <div className="flex gap-2">
                  <div className="flex-1 bg-stone-50 dark:bg-stone-900 p-3 rounded-xl border border-stone-200/60 dark:border-stone-850 flex items-start gap-2 text-xs text-stone-800 dark:text-stone-200 font-medium">
                    <MapPin className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="select-all">{address}</span>
                  </div>
                  <button
                    onClick={handleCopyAddress}
                    className="p-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center flex-shrink-0 min-w-[44px] min-h-[44px]"
                    aria-label="Copier l'adresse de De l'Âne au Coq"
                    title="Copier l'adresse"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Telephone & Mail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Telephone */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">Téléphone</span>
                  <a
                    href="tel:+33140958350"
                    className="flex items-center gap-2 p-3 bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-850 hover:border-amber-600 rounded-xl text-xs font-semibold text-stone-800 dark:text-stone-200 hover:text-amber-600 transition-colors"
                  >
                    <Phone className="h-4 w-4 text-amber-600 flex-shrink-0" />
                    +33 1 40 95 83 50
                  </a>
                </div>

                {/* E-mail */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">E-mail</span>
                  <a
                    href="mailto:contact@aneaucoq.fr"
                    className="flex items-center gap-2 p-3 bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-850 hover:border-amber-600 rounded-xl text-xs font-semibold text-stone-800 dark:text-stone-200 hover:text-amber-600 transition-colors"
                  >
                    <Mail className="h-4 w-4 text-amber-600 flex-shrink-0" />
                    contact@aneaucoq.fr
                  </a>
                </div>
              </div>

              {/* Instagram social button */}
              <div className="pt-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-750 hover:to-amber-800 text-white rounded-xl shadow-md text-xs font-bold transition-all cursor-pointer"
                >
                  <Instagram className="h-4 w-4" /> Rejoignez-nous sur Instagram (@de_l_ane_au_coq)
                </a>
              </div>

            </div>

            {/* Accessibility / Transport details (Slide 80 - Mandatory guidelines) */}
            <div className="bg-white dark:bg-stone-950 p-6 rounded-2xl border border-stone-200 dark:border-stone-900 shadow-md space-y-4">
              
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white border-b border-stone-100 dark:border-stone-900/60 pb-3 flex items-center gap-2">
                <Navigation className="h-5 w-5 text-amber-600" /> Accessibilité & Parkings
              </h3>

              {/* Public Transport */}
              <div className="flex gap-3 items-start text-xs text-stone-600 dark:text-stone-400 font-light">
                <Bus className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-stone-800 dark:text-stone-200 font-sans">En transports en commun :</span>
                  <p><strong>Métro :</strong> Ligne 12 - Arrêt <span className="font-medium text-stone-900 dark:text-white">Mairie d'Issy</span> (à 4 minutes de marche de l'établissement).</p>
                  <p><strong>Tramway :</strong> Ligne T2 - Arrêt <span className="font-medium text-stone-900 dark:text-white">Les Moulineaux</span> (à 8 minutes).</p>
                  <p><strong>Bus :</strong> Lignes 123, 190 et 290 - Arrêt <span className="font-medium text-stone-900 dark:text-white">Anatole France</span>.</p>
                </div>
              </div>

              {/* By Car & Parking */}
              <div className="flex gap-3 items-start text-xs text-stone-600 dark:text-stone-400 font-light pt-2">
                <Car className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-stone-800 dark:text-stone-200 font-sans">En voiture (Parkings publics proches) :</span>
                  <p><strong>Parking Indigo Hôtel de Ville d'Issy :</strong> Situé au 19 Rue du Général Leclerc (à 3 minutes - Parking couvert surveillé 24h/24).</p>
                  <p><strong>Parking Indigo Coeur d'Issy :</strong> Situé au 3 Avenue Victor Cresson (à 4 minutes de marche).</p>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Google Maps Location Map Iframe (Slide 80) */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-white dark:bg-stone-950 p-6 rounded-2xl border border-stone-200 dark:border-stone-900 shadow-md">
            
            {/* Maps Title bar */}
            <div className="flex items-center justify-between mb-4 border-b border-stone-100 dark:border-stone-900/60 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">Plan Google Maps interactif</span>
                <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-white">De l'Âne au Coq</h4>
              </div>
              <span className="text-xs font-mono font-medium text-amber-600 dark:text-amber-500">R7F9+V6 Issy-les-Moulineaux</span>
            </div>

            {/* Simulated, stylized high-fidelity maps iframe */}
            <div className="relative w-full h-[320px] rounded-xl overflow-hidden border border-stone-200/80 dark:border-stone-900 bg-stone-100">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2627.054366661338!2d2.2691763116821213!3d48.8190226033878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e67a5df762bf57%3A0xb690b2016335adcf!2s24%20Rue%20Anatole%20France%2C%2092130%20Issy-les-Moulineaux%2C%20France!5e0!3m2!1sfr!2sfr!4v1783676500000!5m2!1sfr!2sfr" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation Google Maps de De l'Âne au Coq"
              />
            </div>

            {/* Humanizing element: Gérant signature (Slide 81) */}
            <div className="mt-5 p-4 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-stone-200 dark:border-stone-850 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-stone-100 border border-amber-600/30 flex-shrink-0">
                {/* High-quality styled avatar to represent Chef Jean-Baptiste */}
                <img 
                  src="https://picsum.photos/seed/chef_lecoq/200/200" 
                  alt="Portrait du gérant Jean-Baptiste Lecoq" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-amber-600 dark:text-amber-500 uppercase font-mono tracking-widest font-bold">Le mot du Patron</span>
                <p className="text-xs text-stone-600 dark:text-stone-400 font-light italic leading-snug">
                  "Ici, pas de chichis ni d'ingrédients industriels cachés. Nous épluchons nos légumes tous les matins et cuisons nos canards lentement. Installez-vous et savourez !"
                </p>
                <p className="text-[10px] font-semibold text-stone-800 dark:text-white mt-1">— Jean-Baptiste Lecoq & sa brigade</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
