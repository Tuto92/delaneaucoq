import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Calendar, User, Mail, Phone, Clock, Users, Shield, Check, ListTodo, AlertTriangle, AlertCircle, Sparkles } from 'lucide-react';
import { Reservation, TimeSlot } from '../types';
import { AVAILABLE_SLOTS_LUNCH, AVAILABLE_SLOTS_DINNER } from '../data';

interface ReservationFormProps {
  onReservationSuccess: (res: Reservation) => void;
  // Shared capacities to sync walk-ins with reservation form
  lunchSlots: TimeSlot[];
  dinnerSlots: TimeSlot[];
  onUpdateSlotCapacity: (slotTime: string, service: 'lunch' | 'dinner', covers: number, isWalkIn: boolean) => boolean;
}

export default function ReservationForm({ 
  onReservationSuccess, 
  lunchSlots, 
  dinnerSlots, 
  onUpdateSlotCapacity 
}: ReservationFormProps) {
  const [formData, setFormData] = useState<Reservation>({
    name: '',
    email: '',
    phone: '',
    date: new Date().toISOString().split('T')[0], // Default to today
    timeSlot: '',
    guestCount: 2,
    specialRequests: ''
  });

  const [service, setService] = useState<'lunch' | 'dinner'>('lunch');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAdminConsole, setShowAdminConsole] = useState(false);
  const [adminPassword, setAdminConsolePassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  // Admin Walk-in parameters
  const [walkInGuests, setWalkInGuests] = useState(2);
  const [walkInSlot, setWalkInSlot] = useState('12:30');
  const [walkInService, setWalkInService] = useState<'lunch' | 'dinner'>('lunch');

  // Log of simulated transactions & double-channel alerts for user demonstration
  const [logs, setLogs] = useState<Array<{ id: string; type: 'sql' | 'api' | 'success'; text: string; time: string }>>([]);

  const addLog = (type: 'sql' | 'api' | 'success', text: string) => {
    const time = new Date().toLocaleTimeString('fr-FR');
    setLogs((prev) => [{ id: Math.random().toString(), type, text, time }, ...prev].slice(0, 8));
  };

  // Check scheduling rules based on French calendar / traditional bistro laws
  const getDayOfWeek = (dateString: string) => {
    const d = new Date(dateString);
    return d.getDay(); // 0 = Sunday, 6 = Saturday
  };

  const dayOfWeek = getDayOfWeek(formData.date);
  const isSunday = dayOfWeek === 0;
  const isSaturday = dayOfWeek === 6;

  // Set default slot when service changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, timeSlot: '' }));
  }, [service, formData.date]);

  const activeSlots = service === 'lunch' ? lunchSlots : dinnerSlots;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'guestCount' ? parseInt(value) : value
    }));
  };

  const handleBookingSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Validations
    if (isSunday) {
      setErrorMessage("Le restaurant est fermé le dimanche. Veuillez choisir un autre jour.");
      return;
    }

    if (isSaturday && service === 'lunch') {
      setErrorMessage("Nous sommes fermés le samedi midi. Nous vous accueillons avec plaisir le samedi soir à partir de 19h00 !");
      return;
    }

    if (!formData.timeSlot) {
      setErrorMessage("Veuillez sélectionner un créneau horaire.");
      return;
    }

    // Start simulated Postgres lock & transaction sequence
    setBookingStatus('checking');
    addLog('sql', `BEGIN TRANSACTION;`);
    addLog('sql', `SELECT capacite_max, capacite_reservee, capacite_walkin FROM creneaux WHERE date_heure = '${formData.date} ${formData.timeSlot}' FOR UPDATE;`);
    
    setTimeout(() => {
      // Find the slot capacity
      const slot = activeSlots.find(s => s.time === formData.timeSlot);
      if (!slot) {
        setBookingStatus('error');
        setErrorMessage("Le créneau sélectionné est invalide.");
        addLog('sql', "ROLLBACK; -- Créneau inexistant");
        return;
      }

      // Check if there is enough space left
      const reserved = slot.totalCapacity - slot.availableCapacity;
      const willExceed = reserved + formData.guestCount > slot.totalCapacity;

      if (willExceed) {
        setBookingStatus('error');
        setErrorMessage(`CRENEAU_COMPLET : Désolé, il ne reste plus que ${slot.availableCapacity} place(s) disponible(s) pour le créneau de ${formData.timeSlot}.`);
        addLog('sql', `RAISE EXCEPTION 'CRENEAU_COMPLET'; ROLLBACK;`);
        return;
      }

      // Book the seats successfully
      const success = onUpdateSlotCapacity(formData.timeSlot, service, formData.guestCount, false);
      if (!success) {
        setBookingStatus('error');
        setErrorMessage("Une erreur s'est produite lors de la réservation.");
        addLog('sql', "ROLLBACK;");
        return;
      }

      // Commit transaction
      addLog('sql', `INSERT INTO reservations (nom, email, telephone, nb_personnes, statut) VALUES ('${formData.name}', '${formData.email}', '${formData.phone}', ${formData.guestCount}, 'confirmee');`);
      addLog('sql', `UPDATE creneaux SET capacite_reservee = capacite_reservee + ${formData.guestCount} WHERE id = '${formData.timeSlot}';`);
      addLog('sql', "COMMIT; -- Réservation confirmée avec succès !");

      // Double-Channel alert log (Slide 53)
      addLog('api', `[Notifications_Log] Enregistrement de 2 alertes client (SMS + E-mail) en attente...`);
      
      setTimeout(() => {
        addLog('api', `[Resend API] E-mail de confirmation envoyé à ${formData.email} !`);
        addLog('api', `[Twilio API] SMS envoyé au ${formData.phone} (Code table : DEL${Math.floor(100 + Math.random() * 900)})`);
        addLog('success', `Fulfillment achevé avec succès !`);
        
        setBookingStatus('success');
        onReservationSuccess({ ...formData });

        // Reset reservation fields (keep contact details)
        setFormData(prev => ({
          ...prev,
          timeSlot: '',
          specialRequests: ''
        }));
      }, 1000);

    }, 1200);
  };

  // Walk-ins logging by Restaurateur (Slide 53-54)
  const handleWalkInSubmit = (e: FormEvent) => {
    e.preventDefault();
    const success = onUpdateSlotCapacity(walkInSlot, walkInService, walkInGuests, true);
    
    if (success) {
      addLog('sql', `[GÉRANT] Enregistrement d'un Walk-in : ${walkInGuests} couverts au créneau ${walkInSlot} (${walkInService === 'lunch' ? 'Midi' : 'Soir'}).`);
      addLog('sql', `INSERT INTO walkins (creneau, nb_personnes) VALUES ('${walkInSlot}', ${walkInGuests});`);
      addLog('sql', `UPDATE creneaux SET capacite_walkin = capacite_walkin + ${walkInGuests} WHERE id = '${walkInSlot}';`);
      addLog('success', `Walk-in ajouté ! La capacité grand public a diminué en temps réel.`);
      
      // Flash temporary success
      alert(`Walk-in de ${walkInGuests} personnes enregistré avec succès sur le créneau de ${walkInSlot} !`);
    } else {
      alert(`Erreur : Capacité insuffisante sur le créneau de ${walkInSlot} !`);
    }
  };

  const handleAdminAuth = (e: FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'chef92') {
      setIsAdminAuthenticated(true);
      setShowAdminConsole(true);
      addLog('success', `[ADMIN] Authentification du Gérant réussie.`);
    } else {
      alert('Mot de passe incorrect (Astuce démo: chef92)');
    }
  };

  return (
    <section id="reservation" className="py-20 px-4 bg-white dark:bg-stone-950">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left column: Context & Interactive Logs (Slide 50-53) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-600 dark:text-amber-500 uppercase tracking-widest font-bold">
              <Sparkles className="h-4 w-4" /> Réservation Instantanée
            </div>
            
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-stone-950 dark:text-white leading-tight">
              Réservez votre table en quelques clics
            </h2>
            
            <p className="text-stone-600 dark:text-stone-400 text-sm font-light leading-relaxed">
              Pour garantir la fraîcheur de nos approvisionnements et vous recevoir dans les meilleures conditions, 
              notre moteur de réservation est synchronisé en temps réel avec la salle.
            </p>

            <div className="space-y-2 text-xs text-stone-500 dark:text-stone-400">
              <p className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" /> Confirmation immédiate par SMS & E-mail
              </p>
              <p className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" /> Gestion stricte anti-surbooking (Verrou SQL)
              </p>
              <p className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" /> Annulation gratuite en un clic depuis le message
              </p>
            </div>
          </div>

          {/* REAL-TIME TRANSACTION TERMINAL (Slide 50-53) */}
          <div className="bg-stone-900 border border-stone-850 p-4 rounded-2xl shadow-inner font-mono text-[11px] text-stone-300 space-y-3 mt-6">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <span className="flex items-center gap-1.5 text-stone-400 font-semibold text-xs">
                <ListTodo className="h-4 w-4 text-amber-500" /> Journal de Transaction & APIs
              </span>
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="max-h-[160px] overflow-y-auto space-y-2 scrollbar-none">
              {logs.length === 0 ? (
                <p className="text-stone-600 italic">En attente de réservations ou d'actions gérant...</p>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex gap-2">
                    <span className="text-stone-600">{log.time}</span>
                    <span className={
                      log.type === 'sql' 
                        ? 'text-amber-400' 
                        : log.type === 'api' 
                        ? 'text-cyan-400' 
                        : 'text-emerald-400 font-bold'
                    }>
                      {log.text}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-[10px] text-stone-500">
              <span>DB: PostgreSQL 16</span>
              <span>API: Resend / Twilio</span>
            </div>
          </div>
        </div>

        {/* Right column: Interactive Form */}
        <div className="lg:col-span-7 bg-stone-50 dark:bg-stone-900/30 p-6 sm:p-8 rounded-2xl border border-stone-200 dark:border-stone-900/60 shadow-md">
          {bookingStatus === 'success' ? (
            <div className="text-center py-12 space-y-6 animate-fade-in">
              <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shadow-md animate-bounce">
                <Check className="h-8 w-8" strokeWidth={3} />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">Votre table est réservée !</h3>
                <p className="text-stone-600 dark:text-stone-400 text-sm font-light max-w-md mx-auto">
                  Merci pour votre confiance. Un e-mail de confirmation vient de vous être envoyé, doublé d'un SMS de rappel avec les codes de votre table.
                </p>
              </div>
              <button 
                onClick={() => setBookingStatus('idle')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
              >
                Faire une autre réservation
              </button>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-6 animate-fade-in">
              
              {/* Date & Service Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Date Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-amber-600" /> Date du Repas
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={handleInputChange}
                    className="w-full bg-white dark:bg-stone-950 px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-850 text-stone-800 dark:text-stone-200 focus:border-amber-600 focus:outline-none transition-colors"
                  />
                </div>

                {/* Service Selection Toggle */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-amber-600" /> Service
                  </label>
                  <div className="grid grid-cols-2 bg-stone-200/50 dark:bg-stone-950 p-1 rounded-xl border border-stone-200 dark:border-stone-850">
                    <button
                      type="button"
                      onClick={() => setService('lunch')}
                      className={`py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 ${
                        service === 'lunch'
                          ? 'bg-white dark:bg-stone-850 text-amber-600 dark:text-white shadow-sm'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                      }`}
                    >
                      Midi (Déjeuner)
                    </button>
                    <button
                      type="button"
                      onClick={() => setService('dinner')}
                      className={`py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 ${
                        service === 'dinner'
                          ? 'bg-white dark:bg-stone-850 text-amber-600 dark:text-white shadow-sm'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                      }`}
                    >
                      Soir (Dîner)
                    </button>
                  </div>
                </div>

              </div>

              {/* Guest Count & Time Slot Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Guest Count Select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-amber-600" /> Nombre de couverts
                  </label>
                  <select
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleInputChange}
                    className="w-full bg-white dark:bg-stone-950 px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-850 text-stone-800 dark:text-stone-200 focus:border-amber-600 focus:outline-none transition-colors"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                      <option key={n} value={n}>{n} {n > 1 ? 'personnes' : 'personne'}</option>
                    ))}
                  </select>
                </div>

                {/* Time Slot Select (Displays real-time capacity left!) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-amber-600" /> Heure du repas
                  </label>
                  <select
                    name="timeSlot"
                    required
                    value={formData.timeSlot}
                    onChange={handleInputChange}
                    disabled={isSunday || (isSaturday && service === 'lunch')}
                    className="w-full bg-white dark:bg-stone-950 px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-850 text-stone-800 dark:text-stone-200 focus:border-amber-600 focus:outline-none transition-colors disabled:opacity-50"
                  >
                    <option value="">Sélectionnez l'heure</option>
                    {activeSlots.map((slot) => {
                      const isNearlyFull = slot.availableCapacity > 0 && slot.availableCapacity <= 4;
                      const isFull = slot.availableCapacity === 0;
                      return (
                        <option 
                          key={slot.time} 
                          value={slot.time}
                          disabled={isFull}
                        >
                          {slot.time} {isFull ? '(COMPLET)' : isNearlyFull ? `(Plus que ${slot.availableCapacity} places !)` : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

              </div>

              {/* Sunday & Saturday Lunch Warning Overlays */}
              {isSunday && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 p-4 rounded-xl flex items-start gap-3 animate-fade-in text-red-800 dark:text-red-400 text-xs font-sans">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                  <div>
                    <span className="font-bold">Restaurant fermé le dimanche</span>
                    <p className="mt-0.5 font-light">Le restaurant De l'Âne au Coq ferme ses portes le dimanche pour permettre à nos équipes de se reposer. Veuillez sélectionner un autre jour de la semaine.</p>
                  </div>
                </div>
              )}

              {isSaturday && service === 'lunch' && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 p-4 rounded-xl flex items-start gap-3 animate-fade-in text-amber-800 dark:text-amber-400 text-xs font-sans">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600" />
                  <div>
                    <span className="font-bold">Fermé le samedi midi</span>
                    <p className="mt-0.5 font-light">Le samedi midi, nous faisons le plein de produits frais au marché. Nous vous accueillons avec plaisir le samedi soir pour le service de 19h00.</p>
                  </div>
                </div>
              )}

              {/* Contact Details */}
              <div className="space-y-4 pt-2 border-t border-stone-200/50 dark:border-stone-850">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Name Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                      <User className="h-3 w-3 text-stone-400" /> Nom Complet
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Jean Dupont"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white dark:bg-stone-950 px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-850 text-stone-800 dark:text-stone-200 focus:border-amber-600 focus:outline-none text-sm"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                      <Mail className="h-3 w-3 text-stone-400" /> Adresse E-mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="jean.dupont@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white dark:bg-stone-950 px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-850 text-stone-800 dark:text-stone-200 focus:border-amber-600 focus:outline-none text-sm"
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                      <Phone className="h-3 w-3 text-stone-400" /> Numéro Mobile
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+33 6 12 34 56 78"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-white dark:bg-stone-950 px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-850 text-stone-800 dark:text-stone-200 focus:border-amber-600 focus:outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Special Requests */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-stone-500 dark:text-stone-400">
                    Demandes particulières (Allergies, chaise haute, anniversaire...)
                  </label>
                  <textarea
                    name="specialRequests"
                    rows={2}
                    placeholder="Ex: Une chaise haute pour bébé, allergie aux fruits de mer..."
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    className="w-full bg-white dark:bg-stone-950 px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-850 text-stone-800 dark:text-stone-200 focus:border-amber-600 focus:outline-none text-sm"
                  />
                </div>
              </div>

              {/* Error messages */}
              {errorMessage && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 p-4 rounded-xl text-xs text-red-800 dark:text-red-400 font-medium">
                  {errorMessage}
                </div>
              )}

              {/* RGPD Disclaimer (Slide 30) */}
              <p className="text-[10px] text-stone-400 font-light leading-snug">
                En soumettant ce formulaire, vous acceptez que la SARL De l'Âne au Coq collecte et traite vos données personnelles à des fins exclusives de gestion de réservation de table. Aucune donnée n'est revendue à des tiers. Vous pouvez demander leur suppression à tout moment.
              </p>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={bookingStatus === 'checking' || isSunday || (isSaturday && service === 'lunch')}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-serif font-bold text-base py-3.5 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                id="btn-valider-reservation"
              >
                {bookingStatus === 'checking' ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Vérification anti-surbooking (SELECT FOR UPDATE)...
                  </>
                ) : (
                  <>Confirmer ma réservation</>
                )}
              </button>

            </form>
          )}

          {/* ESPACE RESTAURATEUR (Walk-ins) - Syncs covers in real-time! (Slide 53-54) */}
          <div className="mt-8 pt-6 border-t border-dashed border-stone-200 dark:border-stone-850">
            {!isAdminAuthenticated ? (
              <form onSubmit={handleAdminAuth} className="flex gap-2 items-center">
                <span className="text-xs text-stone-500 dark:text-stone-400 font-mono flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5 text-stone-400" /> Mode Restaurateur :
                </span>
                <input
                  type="password"
                  placeholder="Code (chef92)"
                  value={adminPassword}
                  onChange={(e) => setAdminConsolePassword(e.target.value)}
                  className="bg-white dark:bg-stone-950 px-2 py-1 rounded border border-stone-200 dark:border-stone-850 text-xs focus:outline-none w-28"
                />
                <button 
                  type="submit" 
                  className="bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold px-3 py-1 rounded hover:bg-stone-300 dark:hover:bg-stone-700 cursor-pointer"
                >
                  S'identifier
                </button>
              </form>
            ) : (
              <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-amber-500/10 pb-2">
                  <span className="text-xs font-mono text-amber-600 dark:text-amber-500 font-semibold flex items-center gap-1.5">
                    <Shield className="h-4 w-4" /> Console de Passage Gérant (Walk-ins)
                  </span>
                  <button 
                    onClick={() => { setIsAdminAuthenticated(false); setAdminConsolePassword(''); }}
                    className="text-[10px] text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 underline font-mono"
                  >
                    Fermer la console
                  </button>
                </div>

                <form onSubmit={handleWalkInSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                  {/* Walk-in service */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-stone-500 font-mono">Service</label>
                    <select
                      value={walkInService}
                      onChange={(e) => setWalkInService(e.target.value as any)}
                      className="w-full bg-white dark:bg-stone-950 p-1.5 rounded border border-stone-200 dark:border-stone-850 text-xs"
                    >
                      <option value="lunch">Midi</option>
                      <option value="dinner">Soir</option>
                    </select>
                  </div>

                  {/* Walk-in slot */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-stone-500 font-mono">Créneau</label>
                    <select
                      value={walkInSlot}
                      onChange={(e) => setWalkInSlot(e.target.value)}
                      className="w-full bg-white dark:bg-stone-950 p-1.5 rounded border border-stone-200 dark:border-stone-850 text-xs"
                    >
                      {(walkInService === 'lunch' ? AVAILABLE_SLOTS_LUNCH : AVAILABLE_SLOTS_DINNER).map(s => (
                        <option key={s.time} value={s.time}>{s.time}</option>
                      ))}
                    </select>
                  </div>

                  {/* Walk-in Guests count */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-stone-500 font-mono">Couverts Walk-in</label>
                    <select
                      value={walkInGuests}
                      onChange={(e) => setWalkInGuests(parseInt(e.target.value))}
                      className="w-full bg-white dark:bg-stone-950 p-1.5 rounded border border-stone-200 dark:border-stone-850 text-xs"
                    >
                      {[1, 2, 3, 4, 5, 6].map(n => (
                        <option key={n} value={n}>{n} pers.</option>
                      ))}
                    </select>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-mono text-[10px] py-2 rounded font-bold transition-colors cursor-pointer"
                  >
                    LOG WALK-IN
                  </button>
                </form>
                <p className="text-[9px] text-stone-400 font-mono">
                  * Fait Maison logic : cette action met à jour le verrou SQL immédiatement et change la capacité publique.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
