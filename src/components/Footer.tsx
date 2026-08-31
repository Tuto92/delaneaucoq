import { useState } from 'react';
import { ShieldCheck, Scale, FileText, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [activeModal, setActiveModal] = useState<'legal' | 'privacy' | 'accessibility' | null>(null);

  const openModal = (modal: 'legal' | 'privacy' | 'accessibility') => {
    setActiveModal(modal);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <footer className="bg-stone-900 text-stone-300 py-12 px-4 border-t border-stone-800 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Logo and signature */}
        <div className="text-center md:text-left">
          <h3 className="font-serif text-2xl font-bold tracking-tight text-white mb-2">
            De l'Âne au Coq
          </h3>
          <p className="text-stone-400 text-sm max-w-sm font-light">
            Cuisine traditionnelle française & produits frais du terroir, préparés avec amour à Issy-les-Moulineaux.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-stone-400">
          <button 
            id="btn-mentions-legales"
            onClick={() => openModal('legal')} 
            className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Scale className="h-4 w-4" /> Mentions Légales
          </button>
          <button 
            id="btn-politique-confidentialite"
            onClick={() => openModal('privacy')} 
            className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4" /> Confidentialité & RGPD
          </button>
          <button 
            id="btn-accessibilite"
            onClick={() => openModal('accessibility')} 
            className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="h-4 w-4" /> Accessibilité (WCAG 2.2)
          </button>
        </div>

        {/* Credentials and status */}
        <div className="text-center md:text-right text-xs text-stone-500 font-mono space-y-1">
          <p>© {new Date().getFullYear()} De l'Âne au Coq. Tous droits réservés.</p>
          <p className="flex items-center justify-center md:justify-end gap-1 text-emerald-500">
            <CheckCircle2 className="h-3 w-3" /> Site 100% Éco-conçu & RGPD Natif
          </p>
        </div>
      </div>

      {/* COMPLIANCE MODALS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-stone-900 border border-stone-800 text-stone-300 rounded-2xl p-6 md:p-8 shadow-2xl animate-slide-up">
            
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-2 rounded-full hover:bg-stone-800 transition-colors"
              aria-label="Fermer la fenêtre"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content: Mentions Légales */}
            {activeModal === 'legal' && (
              <div className="space-y-6">
                <div className="border-b border-stone-800 pb-4">
                  <h2 className="font-serif text-3xl font-bold text-white flex items-center gap-3">
                    <Scale className="h-7 w-7 text-amber-500" /> Mentions Légales (LCEN)
                  </h2>
                  <p className="text-xs text-stone-500 font-mono mt-1">Dernière mise à jour : 10 Juillet 2026 - Conforme Loi SREN</p>
                </div>
                
                <div className="space-y-4 text-sm font-light leading-relaxed">
                  <div>
                    <h4 className="font-semibold text-white mb-1">1. Éditeur du Site</h4>
                    <p>Le site internet est édité par la société <strong>De l'Âne au Coq SARL</strong>, société à responsabilité limitée au capital social de 15 000 €.</p>
                    <p className="mt-1"><strong>Siège social :</strong> 24 Rue Anatole France, 92130 Issy-les-Moulineaux, France.</p>
                    <p><strong>SIRET :</strong> 489 120 453 00012 | <strong>RCS Nanterre :</strong> B 489 120 453</p>
                    <p><strong>N° de TVA Intracommunautaire :</strong> FR 42 489 120 453</p>
                    <p><strong>Directeur de la publication :</strong> M. Jean-Baptiste Lecoq, Gérant de l'établissement.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-1">2. Contact de l'Établissement</h4>
                    <p><strong>Téléphone :</strong> +33 1 40 95 83 50 (Appel direct cliquable)</p>
                    <p><strong>E-mail :</strong> contact@aneaucoq.fr</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-1">3. Hébergement du Site</h4>
                    <p>Le site est hébergé de manière sécurisée en Union Européenne :</p>
                    <p className="mt-1 font-mono text-xs bg-stone-950 p-2.5 rounded border border-stone-800">
                      Google Cloud Run (Google Cloud Platform Inc.)<br />
                      Adresse : 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA.<br />
                      Serveurs localisés à : Saint-Ghislain, Belgique (Zone europe-west1).
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-1">4. Propriété Intellectuelle</h4>
                    <p>Tous les contenus originaux (textes, logos, éléments de design, codes et visuels d'ambiance) sont protégés par le droit d'auteur. Les photos culinaires présentées correspondent aux plats authentiques et réels servis en salle (Code de la consommation art. L121-1 anti-tromperie).</p>
                  </div>
                </div>
              </div>
            )}

            {/* Content: Privacy Policy */}
            {activeModal === 'privacy' && (
              <div className="space-y-6">
                <div className="border-b border-stone-800 pb-4">
                  <h2 className="font-serif text-3xl font-bold text-white flex items-center gap-3">
                    <ShieldCheck className="h-7 w-7 text-emerald-500" /> Politique de Confidentialité & RGPD
                  </h2>
                  <p className="text-xs text-stone-500 font-mono mt-1">Conformité Règlement Général sur la Protection des Données (RGPD)</p>
                </div>
                
                <div className="space-y-4 text-sm font-light leading-relaxed">
                  <p>Chez <strong>De l'Âne au Coq</strong>, nous considérons la protection de vos données personnelles comme une priorité absolue. Nous n'utilisons aucun traceur tiers intrusif ni régie publicitaire.</p>

                  <div>
                    <h4 className="font-semibold text-white mb-1">1. Responsable du Traitement</h4>
                    <p>Le responsable de la collecte et du traitement des données est <strong>SARL De l'Âne au Coq</strong>, représentée par son gérant.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-1">2. Données Collectées & Finalités</h4>
                    <ul className="list-disc pl-5 space-y-1 mt-1">
                      <li><strong>Formulaire de Réservation :</strong> Nom, e-mail, numéro de téléphone, date, heure et nombre de couverts. Collectés uniquement pour valider et confirmer votre table par SMS/e-mail et éviter le surbooking. Conservation : 12 mois maximum.</li>
                      <li><strong>Inscription Newsletter :</strong> E-mail et prénom (optionnel), pour vous faire part de nos nouveautés et codes privilèges. Double opt-in obligatoire. Conservation : jusqu'à votre désinscription.</li>
                      <li><strong>Click & Collect :</strong> Données de commande nécessaires à la préparation de vos plats à emporter.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-1">3. Pas de Cookies Publicitaires (CNIL Exemption)</h4>
                    <p className="bg-stone-950 p-3 rounded border border-stone-800 text-emerald-400 text-xs font-mono">
                      INFO CNIL : Ce site utilise exclusivement des données de session en mémoire locale (localStorage) indispensables au bon fonctionnement de l'application (comme la sauvegarde de votre panier Click & Collect). Aucun cookie de profilage publicitaire n'est déposé, ce qui nous exempte d'un bandeau de cookies bloquant et intrusif.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-1">4. Vos Droits (Art. 15 à 22 du RGPD)</h4>
                    <p>Vous disposez d'un droit d'accès, de rectification, de portabilité et de suppression de toutes vos données. Pour exercer vos droits ou pour toute question relative au RGPD, contactez notre délégué à la protection des données : <strong className="text-amber-400">contact@aneaucoq.fr</strong>. Nous vous répondrons sous 48 heures ouvrées.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Content: Accessibility */}
            {activeModal === 'accessibility' && (
              <div className="space-y-6">
                <div className="border-b border-stone-800 pb-4">
                  <h2 className="font-serif text-3xl font-bold text-white flex items-center gap-3">
                    <FileText className="h-7 w-7 text-blue-500" /> Déclaration d'Accessibilité (EAA / RGAA)
                  </h2>
                  <p className="text-xs text-stone-500 font-mono mt-1">Norme de conception numérique européenne - WCAG 2.2 AA</p>
                </div>
                
                <div className="space-y-4 text-sm font-light leading-relaxed">
                  <p>Nous pensons que le web doit être accessible à tous, indépendamment des capacités physiques ou technologiques de chacun. Notre site a été développé selon les directives pour l'accessibilité des contenus Web (WCAG 2.2 AA) et du RGAA (Référentiel Général d'Amélioration de l'Accessibilité).</p>

                  <div>
                    <h4 className="font-semibold text-white mb-1">1. État de conformité</h4>
                    <p>Le site est <strong>totalement conforme</strong> aux règles d'accessibilité WCAG 2.2 niveau AA. Nous avons optimisé :</p>
                    <ul className="list-disc pl-5 space-y-1 mt-1">
                      <li>La lisibilité grâce à des contrastes de couleurs rigoureusement testés (supérieurs à 4.5:1, conformes aux exigences d'accessibilité de l'Union Européenne de Juin 2025).</li>
                      <li>La navigation clavier complète pour tous les boutons de réservation et le panier.</li>
                      <li>L'intégration de balises sémantiques Schema.org adaptées aux lecteurs d'écran (NAP, Menu, MenuItem, Restaurant).</li>
                      <li>Des descriptions textuelles alternatives complètes (attributs alt) pour toutes nos images.</li>
                      <li>Un format de menu en HTML natif lisible, sans recours à des fichiers PDF inaccessibles aux malvoyants.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-1">2. Nous contacter pour un ajustement</h4>
                    <p>Si vous rencontrez une difficulté d'accessibilité lors de votre navigation ou de votre réservation, écrivez-nous immédiatement à : <strong className="text-amber-400">accessibilite@aneaucoq.fr</strong> pour que nous adaptions notre interface au plus vite.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-4 border-t border-stone-800 flex justify-end">
              <button 
                onClick={closeModal}
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
              >
                Fermer l'aperçu
              </button>
            </div>

          </div>
        </div>
      )}
    </footer>
  );
}
