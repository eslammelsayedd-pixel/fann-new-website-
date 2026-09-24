
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
            { name: 'Commercial Fit-Out', path: '/services/commercial-interior-fit-out-dubai' },
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
      { image: '/images/projects/icons-of-porsche/16.webp', caption: 'Twin LED stage walls at dusk' }
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
