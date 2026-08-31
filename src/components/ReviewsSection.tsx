import { Star, Quote, MessageSquareDot } from 'lucide-react';
import { REVIEWS } from '../data';

export default function ReviewsSection() {
  return (
    <section className="py-20 px-4 bg-white dark:bg-stone-950 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Title and Intro */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-stone-950 dark:text-white">
            Ce que disent nos clients
          </h2>
          <div className="h-1 w-20 bg-amber-600 mx-auto rounded-full" />
          <p className="text-stone-600 dark:text-stone-400 font-light text-sm">
            Retrouvez les avis réels postés sur notre fiche Google Business Profile (Note de 4.9/5 avec 201 avis).
          </p>
        </div>

        {/* Aggregate Ratings Card */}
        <div className="bg-stone-50 dark:bg-stone-900/40 p-6 rounded-2xl border border-stone-200/80 dark:border-stone-900/60 max-w-xl mx-auto text-center flex flex-col sm:flex-row items-center justify-center gap-6 shadow-sm">
          
          <div className="space-y-1 text-center">
            <div className="text-5xl font-serif font-extrabold text-amber-600 dark:text-amber-500">
              4.9
            </div>
            <div className="flex items-center justify-center text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-5 w-5 fill-amber-500 text-amber-500" />
              ))}
            </div>
            <p className="text-[10px] text-stone-400 font-mono tracking-wider uppercase">sur 5 étoiles</p>
          </div>

          <div className="hidden sm:block h-12 w-[1px] bg-stone-200 dark:bg-stone-850" />

          <div className="text-center sm:text-left space-y-1">
            <h4 className="font-serif text-base font-bold text-stone-900 dark:text-white">
              Une e-réputation d'excellence
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-light">
              98% de recommandations positives sur l'ensemble de nos services. Notre priorité reste la régularité et le fait maison.
            </p>
          </div>

        </div>

        {/* Reviews Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-stone-50 dark:bg-stone-900/20 border border-stone-200/80 dark:border-stone-900/40 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-5 relative group"
            >
              {/* Decorative quotation icon */}
              <div className="absolute top-6 right-6 opacity-5 dark:opacity-10 text-stone-800 dark:text-stone-300 pointer-events-none select-none">
                <Quote className="h-10 w-10" />
              </div>

              <div className="space-y-3">
                {/* Author rating & Date */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-base font-bold text-stone-900 dark:text-white">
                      {review.author}
                    </h4>
                    <p className="text-[10px] font-mono text-stone-400 mt-0.5">{review.date}</p>
                  </div>
                  
                  {/* Stars display */}
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const fullStar = idx < Math.floor(review.rating);
                      const halfStar = !fullStar && idx < review.rating;
                      return (
                        <Star 
                          key={idx} 
                          className={`h-4 w-4 ${fullStar ? 'fill-amber-500 text-amber-500' : halfStar ? 'fill-amber-500/50 text-amber-500' : 'text-stone-300 dark:text-stone-800'}`} 
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Comment body */}
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-light italic">
                  "{review.comment}"
                </p>
              </div>

              {/* Gérant Response Block (Humanizing - Slide 81) */}
              {review.reply && (
                <div className="bg-white/70 dark:bg-stone-950/70 p-4 rounded-xl border border-stone-100 dark:border-stone-900/60 space-y-1.5 animate-fade-in">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-600 dark:text-amber-500">
                    <MessageSquareDot className="h-4 w-4" /> Réponse de Jean-Baptiste (Gérant)
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 font-light leading-relaxed">
                    {review.reply}
                  </p>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
