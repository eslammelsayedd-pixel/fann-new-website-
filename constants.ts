
import { Project, Event, Testimonial, NavLink } from './types';

// New interface for Blog Content
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Markdown supported
  author: string;
  date: string;
  image: string;
  category: string;
  slug: string;
}

export const navLinks: NavLink[] = [
    {
        name: 'Services',
        children: [
            { name: 'All Services', path: '/services' },
            { name: 'Custom Exhibition Stands', path: '/services/custom-exhibition-stands-dubai' },
            { name: 'Modular Systems', path: '/services/modular-exhibition-systems-dubai' },
            { name: 'Turnkey Exhibitions', path: '/services/turnkey-exhibition-services-uae' },
            { name: 'Stand Fabrication', path: '/services/exhibition-stand-fabrication-dubai' },
            { name: 'Commercial Fit-Out', path: '/fit-out-dubai' },
        ]
    },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'FANN Studio', path: '/fann-studio' },
    { 
        name: 'Resources', 
        children: [
            { name: 'Cost Calculator', path: '/resources/cost-calculator' },
            { name: 'Exhibition Guide', path: '/resources/exhibition-guide' },
            { name: 'Events Calendar', path: '/events-calendar' },
            { name: 'ROI Calculator', path: '/roi-calculator' },
            { name: 'Insights & Guides', path: '/insights' },
        ] 
    },
    { 
        name: 'About Us', 
        children: [
            { name: 'About FANN', path: '/about' },
            { name: 'Contact Us', path: '/contact' },
        ] 
    },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'how-to-choose-exhibition-stand-builder-dubai',
    title: 'How to Choose the Right Exhibition Stand Builder in Dubai',
    author: 'FANN Editorial',
    date: 'Oct 24, 2025',
    category: 'Guides',
    image: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=800',
    excerpt: 'Finding a reliable contractor for GITEX or Gulfood can be daunting. We break down the top 5 things to look for in a Dubai partner.',
    content: `
      ## Why Experience in Dubai Venues Matters
      Dubai World Trade Centre (DWTC) and ADNEC have specific regulations. A local builder understands the paperwork...
      
      ## Key Checklist for Your Builder
      1. **In-house production:** Do they have their own workshop?
      2. **Portfolio:** Check their recent work at major shows.
      3. **Logistics:** How do they handle transport and installation?
    `
  }
];

export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'Arabic' },
  { code: 'zh-CN', name: 'Chinese (Simp.)' },
  { code: 'hi', name: 'Hindi' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'ru', name: 'Russian' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'tr', name: 'Turkish' },
];

// Portfolio: only real FANN projects with the client's permission and real photos go here.
// Previous placeholder entries (brand-name projects) were removed on the owner's instruction.
export const projects: Project[] = [
  {
    id: 1,
    slug: 'icons-of-porsche-2025-dubai',
    title: 'Icons of Porsche 2025',
    subtitle: 'Full outdoor event build in Dubai Design District',
    client: 'Icons of Porsche',
    category: 'event',
    industry: 'Automotive',
    year: 2025,
    image: '/images/projects/icons-of-porsche/02.webp',
    heroImage: '/images/projects/icons-of-porsche/14.webp',
    description: 'Icons of Porsche 2025 - Dubai Design District. Full outdoor event build: LED stage walls, esports arena rig, display totems, custom structures.',
    location: 'Dubai Design District, Dubai',
    featured: true,
    eventType: 'Outdoor festival',
    video: { src: '/images/projects/icons-of-porsche/walkthrough.mp4', poster: '/images/projects/icons-of-porsche/video-poster.webp', caption: 'Walk-through of the Icons of Porsche 2025 build at night' },
    gallery: [
      { image: '/images/projects/icons-of-porsche/01.webp', caption: 'Porsche 99X Electric display with custom totems', featured: true },
      { image: '/images/projects/icons-of-porsche/02.webp', caption: 'Electric Field entrance truss with LED wall' },
      { image: '/images/projects/icons-of-porsche/03.webp', caption: 'Lounge and esports arena stage' },
      { image: '/images/projects/icons-of-porsche/04.webp', caption: 'Concept racecar display with information totems' },
      { image: '/images/projects/icons-of-porsche/05.webp', caption: 'Esports arena simulator rigs and leaderboard wall' },
      { image: '/images/projects/icons-of-porsche/06.webp', caption: 'Community Village entrance in timber slats' },
      { image: '/images/projects/icons-of-porsche/07.webp', caption: 'Icons of the Region classic car display' },
      { image: '/images/projects/icons-of-porsche/08.webp', caption: '911 Dakar container build with lighting' },
      { image: '/images/projects/icons-of-porsche/09.webp', caption: 'Icons of Porsche entrance tower with landscaping' },
      { image: '/images/projects/icons-of-porsche/10.webp', caption: 'Icons of the Region display lane' },
      { image: '/images/projects/icons-of-porsche/11.webp', caption: 'Main stage deck with desert landscaping' },
      { image: '/images/projects/icons-of-porsche/12.webp', caption: 'Main stage LED wall and hosts' },
      { image: '/images/projects/icons-of-porsche/13.webp', caption: 'Neon wireframe skyline installation' },
      { image: '/images/projects/icons-of-porsche/14.webp', caption: 'Main stage LED walls and lighting rig' },
      { image: '/images/projects/icons-of-porsche/15.webp', caption: 'Main stage with audience seating' },
      { image: '/images/projects/icons-of-porsche/16.webp', caption: 'Twin LED stage walls at dusk' },
      { image: '/images/projects/icons-of-porsche/17.webp', caption: 'Electric Field entrance truss with LED bars at night' },
      { image: '/images/projects/icons-of-porsche/18.webp', caption: 'Neon wireframe skyline sculpture on a lit sand bed' },
      { image: '/images/projects/icons-of-porsche/19.webp', caption: 'Wireframe skyline sculptures beside the esports arena' },
      { image: '/images/projects/icons-of-porsche/20.webp', caption: 'Skyline sculpture detail with edge-lit base' },
      { image: '/images/projects/icons-of-porsche/21.webp', caption: 'Cyberpunk Taycan display with information totem' },
      { image: '/images/projects/icons-of-porsche/22.webp', caption: 'Sneaker-design Taycan on an edge-lit plinth' },
      { image: '/images/projects/icons-of-porsche/23.webp', caption: 'Esports arena stage with neon skyline sculpture in front' },
      { image: '/images/projects/icons-of-porsche/24.webp', caption: 'AI art kiosk and display totem in the car park lounge' },
      { image: '/images/projects/icons-of-porsche/25.webp', caption: 'Twin skyline sculpture beds with LED edge lighting' },
      { image: '/images/projects/icons-of-porsche/26.webp', caption: 'Electric Field zone: branded truss, LED wall and flag banners' },
      { image: '/images/projects/icons-of-porsche/27.webp', caption: 'Bilingual Electric Field sign with overhead mirrored panels' },
      { image: '/images/projects/icons-of-porsche/28.webp', caption: 'String-art Porsche sculpture in the Art Valley zone' },
      { image: '/images/projects/icons-of-porsche/29.webp', caption: 'Adventure Camp bilingual illuminated sign on timber wall' },
      { image: '/images/projects/icons-of-porsche/30.webp', caption: 'String-art sculpture in front of the Art Valley arches' },
      { image: '/images/projects/icons-of-porsche/31.webp', caption: 'Art Valley arches with lifted safari 911 display' },
      { image: '/images/projects/icons-of-porsche/32.webp', caption: 'Icons of the Region classic car pergola with illuminated sign' },
      { image: '/images/projects/icons-of-porsche/33.webp', caption: 'Design Factory arch with bilingual neon lettering' },
      { image: '/images/projects/icons-of-porsche/34.webp', caption: 'Bilingual Icons of the Region pergola with classic 911s' },
      { image: '/images/projects/icons-of-porsche/35.webp', caption: 'Icons of the Region lane with fabric shade canopies' },
      { image: '/images/projects/icons-of-porsche/36.webp', caption: 'Main stage reveal of the 911 Sport Classic with skyline sculptures' },
      { image: '/images/projects/icons-of-porsche/37.webp', caption: 'Community Village timber entrance at dusk' },
      { image: '/images/projects/icons-of-porsche/38.webp', caption: 'Heritage artwork wall on a black display cube with LED truss' },
      { image: '/images/projects/icons-of-porsche/39.webp', caption: 'Icons of Porsche feature wall with wireframe palm sculptures' },
      { image: '/images/projects/icons-of-porsche/40.webp', caption: 'Single-car display cube with lighting truss' },
      { image: '/images/projects/icons-of-porsche/41.webp', caption: 'Illuminated Icons of Porsche entrance screen' },
      { image: '/images/projects/icons-of-porsche/42.webp', caption: 'Skyline sculptures leading to the esports arena' },
      { image: '/images/projects/icons-of-porsche/43.webp', caption: 'String-art Porsche sculpture in daylight' }
    ],
  },
  {
    id: 2,
    slug: 'special-olympics-uae-unified-champion-schools-2025',
    title: 'Special Olympics UAE - Unified Champion Schools Awarding Ceremony',
    subtitle: 'Ballroom stage and awards ceremony setup, 2024-2025 season',
    client: 'Special Olympics UAE',
    category: 'event',
    industry: 'Education & Community',
    year: 2025,
    image: '/images/projects/special-olympics-ucs-2025/01.webp',
    heroImage: '/images/projects/special-olympics-ucs-2025/03.webp',
    description: 'Unified Champion Schools Awarding Ceremony 2024-2025 for Special Olympics UAE. Full ballroom setup: custom stage with sculpted red arches and LED portrait panels, wide LED screen, illuminated logo, lit stage steps and banquet layout.',
    location: 'UAE',
    featured: true,
    eventType: 'Awards ceremony',
    gallery: [
      { image: '/images/projects/special-olympics-ucs-2025/01.webp', caption: 'Stage with sculpted red arches, LED portrait panels and main screen', featured: true },
      { image: '/images/projects/special-olympics-ucs-2025/02.webp', caption: 'Stage and banquet tables ready for guests' },
      { image: '/images/projects/special-olympics-ucs-2025/03.webp', caption: 'Ballroom with stage lighting and gobo projections' },
      { image: '/images/projects/special-olympics-ucs-2025/04.webp', caption: 'Stage front with lit steps and illuminated logo' },
      { image: '/images/projects/special-olympics-ucs-2025/05.webp', caption: 'Arch detail with LED portrait panel and logo sculpture' }
    ],
  },
  {
    id: 3,
    slug: 'national-expression-adek-abu-dhabi',
    title: 'National Expression - ADEK',
    subtitle: 'Student art gallery and digital screens for the Abu Dhabi Department of Education and Knowledge',
    client: 'ADEK (Abu Dhabi Department of Education and Knowledge)',
    category: 'event',
    industry: 'Education & Culture',
    image: '/images/projects/national-expression-adek/01.webp',
    heroImage: '/images/projects/national-expression-adek/03.webp',
    description: 'National Expression exhibition for ADEK in Abu Dhabi, linked to Louvre Abu Dhabi. We built a walk-through gallery of curved white walls, striped canopies, spotlit artwork displays, seating islands and craft zones, plus outdoor LED screens telling the story of the programme, including the training of around 450 teachers.',
    location: 'Abu Dhabi',
    featured: true,
    eventType: 'Exhibition',
    gallery: [
      { image: '/images/projects/national-expression-adek/01.webp', caption: 'Gallery walkway with striped canopy and framed student artwork', featured: true },
      { image: '/images/projects/national-expression-adek/02.webp', caption: 'Curved exhibition walls lit for the evening opening' },
      { image: '/images/projects/national-expression-adek/03.webp', caption: 'Central seating island between artwork walls' },
      { image: '/images/projects/national-expression-adek/04.webp', caption: 'Arched entrance wall with digital screen' },
      { image: '/images/projects/national-expression-adek/05.webp', caption: 'Framed artwork display under spotlights' },
      { image: '/images/projects/national-expression-adek/06.webp', caption: 'Gallery zones with feature wall graphics' },
      { image: '/images/projects/national-expression-adek/07.webp', caption: 'Planter island and wayfinding wall' },
      { image: '/images/projects/national-expression-adek/08.webp', caption: 'Craft display zone with seating pouffes' },
      { image: '/images/projects/national-expression-adek/09.webp', caption: 'Close-up of artwork walls and spotlights' },
      { image: '/images/projects/national-expression-adek/10.webp', caption: 'Canopy-covered gallery lane' },
      { image: '/images/projects/national-expression-adek/11.webp', caption: 'Wide view of the gallery at night' },
      { image: '/images/projects/national-expression-adek/12.webp', caption: 'Circular portal screen at the entrance' },
      { image: '/images/projects/national-expression-adek/13.webp', caption: 'Outdoor LED screens along the walkway' },
      { image: '/images/projects/national-expression-adek/14.webp', caption: 'Large-format LED screen showing the programme' },
      { image: '/images/projects/national-expression-adek/15.webp', caption: 'LED screen presenting the training of around 450 teachers' }
    ],
  },
];

export const regionalEvents: Event[] = [
  // Dates checked against organiser / venue sites on 24 Sep 2026. Always confirm with the organiser before booking space.
  { name: "INDEX Dubai", date: "Sep 28-30, 2026", venue: "Dubai", country: "UAE", industry: "Interiors & Design", description: "The region's main interiors and fit-out trade fair. Strong fit for joinery, furniture, lighting and finishes brands." },
  { name: "Beautyworld Middle East", date: "Oct 6-8, 2026", venue: "Dubai World Trade Centre", country: "UAE", industry: "Beauty & Wellness", description: "Large beauty, fragrance and wellness show. Stands here need strong lighting, product display and sampling areas." },
  { name: "ADIPEC", date: "Nov 2-5, 2026", venue: "ADNEC, Abu Dhabi", country: "UAE", industry: "Energy", description: "One of the world's largest energy exhibitions. Big double-deck and custom stands; book design and build early." },
  { name: "Automechanika Dubai", date: "Nov 10-12, 2026", venue: "Dubai Exhibition Centre", country: "UAE", industry: "Automotive", description: "Automotive aftermarket trade show for the Middle East and Africa." },
  { name: "Cityscape Global", date: "Nov 16-19, 2026", venue: "Riyadh Exhibition & Convention Centre (Malham)", country: "KSA", industry: "Real Estate", description: "Major real estate show for developers. Model display and immersive sales pavilions are common." },
  { name: "Big 5 Global", date: "Nov 23-26, 2026", venue: "Dubai World Trade Centre", country: "UAE", industry: "Construction", description: "The region's largest construction event, covering building materials, HVAC and finishes." },
  { name: "GITEX Global", date: "Dec 7-11, 2026", venue: "Expo City Dubai (Dubai Exhibition Centre) and DWTC", country: "UAE", industry: "Technology", description: "The world's biggest tech and startup show, moving to Expo City Dubai for 2026. Summit day 7 Dec at DWTC, exhibition 8-11 Dec at Expo City." },
  { name: "Intersec", date: "Jan 12-14, 2027", venue: "Dubai World Trade Centre", country: "UAE", industry: "Security & Safety", description: "Security, fire and safety trade fair." },
  { name: "World Health Expo (WHX) Dubai", date: "Jan 25-28, 2027", venue: "Dubai Exhibition Centre and DWTC", country: "UAE", industry: "Healthcare", description: "Formerly Arab Health. One of the largest healthcare shows in the world." },
  { name: "Gulfood", date: "Mar 15-19, 2027", venue: "Dubai World Trade Centre", country: "UAE", industry: "Food & Beverage", description: "The world's largest annual food and beverage show. Stands often need kitchens, tasting areas and cold storage." },
  { name: "Arabian Travel Market", date: "May 3-6, 2027", venue: "Dubai World Trade Centre", country: "UAE", industry: "Travel & Tourism", description: "Leading travel trade show for hotels, airlines, destinations and tourism boards." },
  { name: "Middle East Energy", date: "May 11-13, 2027", venue: "Dubai Exhibition Centre", country: "UAE", industry: "Energy", description: "Power, lighting and renewable energy exhibition." },
];

// Only real, client-approved testimonials go here.
export const testimonials: Testimonial[] = [];
