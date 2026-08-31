import { MenuItem, Review, TimeSlot } from './types';

export const MENU_ITEMS: MenuItem[] = [
  // Entrées
  {
    id: 'e1',
    name: "Oeuf Parfait Bio & Crème de Cèpes",
    description: "Oeuf cuit à basse température, velouté de cèpes parfumé à l'huile de truffe, croûtons au beurre.",
    price: 7.50,
    category: 'entrée',
    isVegetarian: true,
    isGlutenFree: false,
    isHomemade: true,
    allergens: ['Gluten', 'Lait', 'Oeufs']
  },
  {
    id: 'e2',
    name: "Poireaux Crayon Grillés à la Vinaigrette d'Isigny",
    description: "Poireaux braisés croustillants, vinaigrette tiède moutardée, noisettes du Piémont torréfiées.",
    price: 7.00,
    category: 'entrée',
    isVegetarian: true,
    isGlutenFree: true,
    isHomemade: true,
    allergens: ['Moutarde', 'Fruits à coque']
  },
  {
    id: 'e3',
    name: "Rillettes de Canard Maison au Piment d'Espelette",
    description: "Rillettes savoureuses cuites doucement pendant 6 heures, cornichons fins et pain de campagne grillé.",
    price: 8.00,
    category: 'entrée',
    isVegetarian: false,
    isGlutenFree: false,
    isHomemade: true,
    allergens: ['Gluten']
  },

  // Plats
  {
    id: 'p1',
    name: "Confit de Canard Croustillant",
    description: "Cuisse de canard confite lentement, jus réduit au thym, pommes de terre grenailles sautées à la graisse de canard et persillade.",
    price: 16.50,
    category: 'plat',
    isVegetarian: false,
    isGlutenFree: true,
    isHomemade: true,
    allergens: []
  },
  {
    id: 'p2',
    name: "Tartare de Bœuf Charolais au Couteau",
    description: "Bœuf coupé minute au couteau, assaisonnement bistrot traditionnel, frites de pommes de terre fraîches maison et salade verte.",
    price: 15.00,
    category: 'plat',
    isVegetarian: false,
    isGlutenFree: true,
    isHomemade: true,
    allergens: ['Moutarde', 'Oeufs']
  },
  {
    id: 'p3',
    name: "Blanquette de Veau Réconfortante de l'Âne",
    description: "Veau mijoté dans un bouillon crémeux aux petits oignons, carottes fondantes et champignons de Paris, riz basmati parfumé.",
    price: 17.00,
    category: 'plat',
    isVegetarian: false,
    isGlutenFree: true,
    isHomemade: true,
    allergens: ['Lait', 'Céleri']
  },
  {
    id: 'p4',
    name: "Risotto d'Épeautre aux Champignons des Bois",
    description: "Risotto crémeux au bouillon de légumes maison, poêlée de pleurotes et de girolles, parmesan Reggiano 24 mois affiné et herbes fraîches.",
    price: 14.50,
    category: 'plat',
    isVegetarian: true,
    isGlutenFree: false, // Épeautre contient du gluten léger
    isHomemade: true,
    allergens: ['Lait']
  },

  // Desserts
  {
    id: 'd1',
    name: "Crème Brûlée à la Vanille Bourbon",
    description: "Crème onctueuse infusée aux gousses de vanille Bourbon de Madagascar, caramélisée à la cassonade minute.",
    price: 6.50,
    category: 'dessert',
    isVegetarian: true,
    isGlutenFree: true,
    isHomemade: true,
    allergens: ['Lait', 'Oeufs']
  },
  {
    id: 'd2',
    name: "Mi-Cuit au Chocolat Noir & Cœur Caramel",
    description: "Cœur coulant au chocolat Valrhona 70%, insert au caramel beurre salé de Guérande, glace à la vanille de Madagascar.",
    price: 7.50,
    category: 'dessert',
    isVegetarian: true,
    isGlutenFree: false,
    isHomemade: true,
    allergens: ['Gluten', 'Lait', 'Oeufs']
  },
  {
    id: 'd3',
    name: "Tarte Tatin Authentique & Crème d'Isigny",
    description: "Tarte aux pommes caramélisées au beurre frais, pâte feuilletée croustillante, servie tiède avec une cuillère de crème fraîche épaisse de Normandie.",
    price: 7.00,
    category: 'dessert',
    isVegetarian: true,
    isGlutenFree: false,
    isHomemade: true,
    allergens: ['Gluten', 'Lait']
  },

  // Boissons
  {
    id: 'b1',
    name: "Vin Rouge - Château Lalande AOP Bordeaux",
    description: "Robe rubis profond, nez de fruits noirs mûrs. Bouche ronde et veloutée. Idéal avec nos viandes.",
    price: 5.50,
    category: 'boisson',
    isVegetarian: true,
    isGlutenFree: true,
    isHomemade: false,
    allergens: ['Sulfites']
  },
  {
    id: 'b2',
    name: "Vin Blanc - Sancerre Domaine des Brosses",
    description: "Vin blanc sec et fruité, notes d'agrumes et belle minéralité. Parfait en apéritif.",
    price: 6.00,
    category: 'boisson',
    isVegetarian: true,
    isGlutenFree: true,
    isHomemade: false,
    allergens: ['Sulfites']
  },
  {
    id: 'b3',
    name: "Bière Blonde Locale - La Bière d'Issy (33cl)",
    description: "Bière artisanale brassée localement à Issy-les-Moulineaux. Notes florales et amertume équilibrée.",
    price: 5.00,
    category: 'boisson',
    isVegetarian: true,
    isGlutenFree: false,
    isHomemade: false,
    allergens: ['Gluten']
  },
  {
    id: 'b4',
    name: "Café Expresso Exclusif Torréfié en Île-de-France",
    description: "Expresso biologique équitable, torréfié localement. Arôme puissant et notes chocolatées.",
    price: 2.20,
    category: 'boisson',
    isVegetarian: true,
    isGlutenFree: true,
    isHomemade: false,
    allergens: []
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    author: "Thomas G.",
    rating: 5,
    date: "04/07/2026",
    comment: "Un vrai bistrot de quartier comme on les aime ! Le confit de canard est excellent et l'accueil est toujours chaleureux. Je recommande les yeux fermés.",
    reply: "Merci Thomas ! C'est toujours un plaisir de vous accueillir chez nous. À très bientôt pour une nouvelle persillade !"
  },
  {
    id: 'r2',
    author: "Marine L.",
    rating: 5,
    date: "28/06/2026",
    comment: "Une superbe découverte à Issy-les-Moulineaux. Tout est fait maison, la blanquette de veau m'a rappelé celle de ma grand-mère. En plus, ils proposent de super options végétariennes et sans gluten bien identifiées !",
    reply: "Un grand merci Marine pour ce retour chaleureux ! Nous mettons un point d'honneur à cuisiner maison pour tous les goûts. Au plaisir de vous revoir."
  },
  {
    id: 'r3',
    author: "Jean-Pierre M.",
    rating: 4.5,
    date: "15/06/2026",
    comment: "Plats savoureux et copieux, service rapide et efficace pour le midi. Le rapport qualité-prix est imbattable dans le quartier pour du 100% fait maison.",
    reply: "Merci Jean-Pierre ! Nous savons que votre temps est compté le midi, nos équipes font le maximum pour être efficaces sans transiger sur la qualité. Bon appétit !"
  },
  {
    id: 'r4',
    author: "Chloé B.",
    rating: 5,
    date: "02/06/2026",
    comment: "Un délice du début à la fin ! La tarte tatin tiède avec sa crème fraîche d'Isigny est juste à tomber par terre. Service impeccable et terrasse agréable aux beaux jours.",
    reply: "Merci Chloé ! Notre Tatin est effectivement l'une de nos grandes fiertés. On garde une table en terrasse pour votre prochaine visite !"
  }
];

export const AVAILABLE_SLOTS_LUNCH: TimeSlot[] = [
  { time: '12:00', availableCapacity: 8, totalCapacity: 15 },
  { time: '12:30', availableCapacity: 4, totalCapacity: 15 },
  { time: '13:00', availableCapacity: 2, totalCapacity: 15 },
  { time: '13:30', availableCapacity: 11, totalCapacity: 15 },
  { time: '14:00', availableCapacity: 14, totalCapacity: 15 }
];

export const AVAILABLE_SLOTS_DINNER: TimeSlot[] = [
  { time: '19:00', availableCapacity: 12, totalCapacity: 20 },
  { time: '19:30', availableCapacity: 6, totalCapacity: 20 },
  { time: '20:00', availableCapacity: 3, totalCapacity: 20 },
  { time: '20:30', availableCapacity: 1, totalCapacity: 20 },
  { time: '21:00', availableCapacity: 14, totalCapacity: 20 },
  { time: '21:30', availableCapacity: 18, totalCapacity: 20 }
];
