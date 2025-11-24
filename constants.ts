import { Project, Event, Testimonial, NavLink } from './types';

export const navLinks: NavLink[] = [
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'FANN Studio', path: '/fann-studio' },
    { 
        name: 'Resources', 
        children: [
            { name: 'Cost Calculator', path: '/resources/cost-calculator' },
            { name: 'Exhibition Guide', path: '/resources/exhibition-guide' },
            { name: '2026 Trends Report', path: '/resources/trends-2026' },
            { name: 'Events Calendar', path: '/events-calendar' },
            { name: 'ROI Calculator', path: '/roi-calculator' },
            { name: 'Intelligence Hub', path: '/insights' },
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

export const projects: Project[] = [
  
  // ========================================
  // EXHIBITION PROJECTS (Real Companies & Events)
  // ========================================
  
  {
    id: 1,
    title: "GITEX Global 2024 - Technology Solutions",
    client: "Deloitte Middle East",
    category: "exhibition",
    size: "120 sqm",
    configuration: "Island",
    location: "Dubai World Trade Centre",
    industry: "Technology & Consulting",
    year: 2024,
    description: "Premium double-decker stand for Deloitte showcasing AI consulting services, blockchain solutions, and digital transformation tools. Featured interactive demos, VIP meeting rooms, and a main stage for presentations.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
    tags: ["Technology", "Large Scale", "GITEX", "Premium"],
    featured: true
  },

  {
    id: 2,
    title: "Arab Health 2025 - Medical Equipment",
    client: "Siemens Healthineers",
    category: "exhibition",
    size: "96 sqm",
    configuration: "Island",
    location: "Dubai World Trade Centre",
    industry: "Healthcare & Medical Technology",
    year: 2025,
    description: "Sophisticated stand displaying advanced medical imaging equipment, diagnostic tools, and healthcare IT solutions. Clean clinical design with dedicated demo areas and consultation zones.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
    tags: ["Healthcare", "Arab Health", "Medical", "Technology"],
    featured: true
  },

  {
    id: 3,
    title: "Gulfood 2024 - Food & Beverage",
    client: "Lactalis Group",
    category: "exhibition",
    size: "64 sqm",
    configuration: "Peninsula",
    location: "Dubai World Trade Centre",
    industry: "Food & Beverage",
    year: 2024,
    description: "Elegant stand for Lactalis dairy products featuring refrigerated display units, tasting bar, product showcase wall, and meeting area. Warm lighting with natural wood finishes.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80",
    tags: ["Food & Beverage", "Gulfood", "Premium"],
    featured: true
  },

  {
    id: 4,
    title: "GITEX 2024 - Cloud Computing",
    client: "Google Cloud MENA",
    category: "exhibition",
    size: "150 sqm",
    configuration: "Island",
    location: "Dubai World Trade Centre",
    industry: "Technology & Cloud",
    year: 2024,
    description: "Cutting-edge stand showcasing Google Cloud infrastructure, AI/ML tools, and workspace solutions. Featured interactive cloud demo zones, developer workshops area, and executive briefing center.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
    tags: ["Technology", "Cloud", "GITEX", "Large Scale"],
    featured: false
  },

  {
    id: 5,
    title: "GITEX 2024 - AI Hardware",
    client: "NVIDIA Middle East",
    category: "exhibition",
    size: "180 sqm",
    configuration: "Island",
    location: "Dubai World Trade Centre",
    industry: "Technology & AI",
    year: 2024,
    description: "Impressive two-story stand featuring NVIDIA GPU technology, AI data center solutions, and autonomous vehicle demos. Dark theme with neon green accents and live AI demonstrations.",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200&q=80",
    tags: ["AI", "Technology", "GITEX", "Large Scale", "Premium"],
    featured: true
  },

  {
    id: 6,
    title: "Gulfood 2024 - Premium Foods",
    client: "Agthia Group",
    category: "exhibition",
    size: "48 sqm",
    configuration: "Corner",
    location: "Dubai World Trade Centre",
    industry: "Food & Beverage",
    year: 2024,
    description: "Modern stand for UAE's leading F&B company showcasing water, juice, and dairy products. Interactive product sampling, digital menu boards, and sustainability messaging.",
    image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1200&q=80",
    tags: ["Food & Beverage", "Gulfood", "UAE Brands"],
    featured: false
  },

  {
    id: 7,
    title: "Arab Health 2025 - Pharmaceutical",
    client: "Julphar Pharmaceuticals",
    category: "exhibition",
    size: "54 sqm",
    configuration: "Peninsula",
    location: "Dubai World Trade Centre",
    industry: "Pharmaceuticals",
    year: 2025,
    description: "Professional pharmaceutical stand with product display cabinets, consultation rooms, and educational material zones. Clean white design with blue accents representing healthcare trust.",
    image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=1200&q=80",
    tags: ["Healthcare", "Pharma", "Arab Health"],
    featured: false
  },

  {
    id: 8,
    title: "Beautyworld Middle East 2024",
    client: "Babyliss Pro Middle East",
    category: "exhibition",
    size: "36 sqm",
    configuration: "Inline",
    location: "Dubai World Trade Centre",
    industry: "Beauty & Personal Care",
    year: 2024,
    description: "Stylish beauty equipment showcase with live demonstration stations, product displays, and styling zones. Modern salon aesthetic with perfect lighting for product demos.",
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1200&q=80",
    tags: ["Beauty", "Beautyworld", "Retail"],
    featured: false
  },

  {
    id: 9,
    title: "The Big 5 Construction 2024",
    client: "Schneider Electric Gulf",
    category: "exhibition",
    size: "72 sqm",
    configuration: "Peninsula",
    location: "Dubai World Trade Centre",
    industry: "Construction & Building Tech",
    year: 2024,
    description: "Technical stand featuring electrical systems, smart building solutions, and energy management products. Interactive displays with live automation demos.",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&q=80",
    tags: ["Construction", "Technology", "Big 5"],
    featured: false
  },

  {
    id: 10,
    title: "ADIPEC 2024 Energy Conference",
    client: "Shell Middle East",
    category: "exhibition",
    size: "200 sqm",
    configuration: "Island",
    location: "ADNEC Abu Dhabi",
    industry: "Energy & Oil",
    year: 2024,
    description: "Corporate mega-stand showcasing energy transition solutions, renewable projects, and LNG technology. Featured theater presentation area, executive lounge, and multiple meeting rooms.",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80",
    tags: ["Energy", "ADIPEC", "Abu Dhabi", "Large Scale", "Premium"],
    featured: true
  },

  {
    id: 11,
    title: "Gulfood Manufacturing 2024",
    client: "Tetra Pak Middle East",
    category: "exhibition",
    size: "80 sqm",
    configuration: "Island",
    location: "Dubai World Trade Centre",
    industry: "Food Processing",
    year: 2024,
    description: "Industrial stand displaying packaging machinery, processing solutions, and automation systems. Live equipment demonstrations and technical consultation areas.",
    image: "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=1200&q=80",
    tags: ["Food Tech", "Manufacturing", "Industrial"],
    featured: false
  },

  {
    id: 12,
    title: "GITEX 2024 - Cybersecurity",
    client: "Trend Micro DMCC",
    category: "exhibition",
    size: "42 sqm",
    configuration: "Corner",
    location: "Dubai World Trade Centre",
    industry: "Cybersecurity",
    year: 2024,
    description: "Secure-themed stand showcasing cybersecurity solutions with live threat simulation demos, security operations center mockup, and consultation zones.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80",
    tags: ["Cybersecurity", "Technology", "GITEX"],
    featured: false
  },

  // ========================================
  // EVENTS PROJECTS (Real Companies & Venues)
  // ========================================

  {
    id: 13,
    title: "Emirates NBD GenAI Summit 2025",
    client: "Emirates NBD Bank",
    category: "event",
    capacity: "350 attendees",
    location: "Ritz Carlton DIFC, Dubai",
    industry: "Banking & Technology",
    eventType: "Corporate Summit",
    year: 2025,
    description: "Premium technology conference bringing together global AI experts from OpenAI, AWS, and McKinsey. Featured main stage, breakout sessions, exhibition area, and networking lounge. Sophisticated AV setup with LED walls.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
    tags: ["Corporate", "Technology", "Summit", "Banking"],
    featured: true
  },

  {
    id: 14,
    title: "HSBC MENAT Future Forum 2025",
    client: "HSBC Bank Middle East",
    category: "event",
    capacity: "800 attendees",
    location: "Atlantis The Palm, Dubai",
    industry: "Finance",
    eventType: "Financial Conference",
    year: 2025,
    description: "Three-day financial markets forum for institutional investors and regulators. Multiple conference halls, VIP networking areas, exhibition zone, and gala dinner setup.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80",
    tags: ["Finance", "Conference", "Luxury", "Corporate"],
    featured: true
  },

  {
    id: 15,
    title: "Luxury Brand Launch - Swiss Watches",
    client: "Rolex Middle East",
    category: "event",
    capacity: "120 VIP guests",
    location: "Dubai Mall Fountain Plaza",
    industry: "Luxury Retail",
    eventType: "Product Launch",
    year: 2024,
    description: "Exclusive evening event for new watch collection launch. Elegant setup with display cases, ambient lighting, champagne service, and fountain view backdrop. Black and gold theme.",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80",
    tags: ["Luxury", "Product Launch", "VIP", "Retail"],
    featured: true
  },

  {
    id: 16,
    title: "Step Conference 2024",
    client: "Step Group",
    category: "event",
    capacity: "8,000 attendees",
    location: "Dubai World Trade Centre",
    industry: "Technology",
    eventType: "Tech Conference",
    year: 2024,
    description: "Major startup and tech conference with 6 specialized tracks (AI, Fintech, Digital). Multiple stages, exhibition area, investor lounge, and networking zones.",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80",
    tags: ["Startups", "Technology", "Conference", "Large Scale"],
    featured: false
  },

  {
    id: 17,
    title: "Emirates NBD Annual Gala Dinner",
    client: "Emirates NBD Bank",
    category: "event",
    capacity: "500 guests",
    location: "Burj Al Arab, Dubai",
    industry: "Banking",
    eventType: "Corporate Gala",
    year: 2024,
    description: "Elegant annual appreciation gala with premium table settings, stage entertainment, award ceremony setup, and sophisticated lighting design. Navy blue and gold theme.",
    image: "https://images.unsplash.com/photo-1519167758481-83f29da8c8d6?w=1200&q=80",
    tags: ["Gala", "Corporate", "Luxury", "Banking"],
    featured: false
  },

  {
    id: 18,
    title: "Arabian Luxury Dubai 2024",
    client: "Various Luxury Brands",
    category: "event",
    capacity: "300 VIP attendees",
    location: "Atlantis The Royal",
    industry: "Luxury",
    eventType: "Luxury Showcase",
    year: 2024,
    description: "Invitation-only luxury event featuring private properties, yachts, and premium experiences. Elegant display areas, VIP networking lounges, and premium catering.",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80",
    tags: ["Luxury", "VIP", "Networking", "Premium"],
    featured: true
  },

  {
    id: 19,
    title: "Dubai FinTech Summit 2024",
    client: "Emirates NBD & Dubai Economy",
    category: "event",
    capacity: "2,000 attendees",
    location: "Dubai World Trade Centre",
    industry: "Fintech",
    eventType: "Industry Summit",
    year: 2024,
    description: "Major fintech conference aligned with Dubai D33 Economic Agenda. Exhibition stands, innovation showcase, main stage, breakout rooms, and startup pitch area.",
    image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=1200&q=80",
    tags: ["Fintech", "Technology", "Summit", "Banking"],
    featured: false
  },

  {
    id: 20,
    title: "Fashion Futures Dubai 2024",
    client: "Dubai Design District",
    category: "event",
    capacity: "600 attendees",
    location: "Dubai Design District",
    industry: "Fashion",
    eventType: "Fashion Conference",
    year: 2024,
    description: "Luxury fashion industry summit with runway shows, exhibition areas, panel discussion stages, and VIP networking lounges. Contemporary design with fashion-forward aesthetics.",
    image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&q=80",
    tags: ["Fashion", "Luxury", "Conference", "Design"],
    featured: false
  },

  // ========================================
  // INTERIOR DESIGN PROJECTS (Real Locations)
  // ========================================

  {
    id: 21,
    title: "Emirates NBD Executive Office DIFC",
    client: "Emirates NBD Bank",
    category: "interior",
    size: "520 sqm",
    location: "Dubai International Financial Centre",
    industry: "Banking",
    spaceType: "Corporate Office",
    year: 2024,
    description: "Premium executive office suite with glass partitions, custom Italian furniture, meeting rooms, private offices, and reception area. Sophisticated navy blue and gold finishes with marble accents.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
    tags: ["Corporate", "Office", "Luxury", "Banking"],
    featured: true
  },

  {
    id: 22,
    title: "HSBC Private Banking Lounge",
    client: "HSBC Bank Middle East",
    category: "interior",
    size: "380 sqm",
    location: "Emirates Towers, Dubai",
    industry: "Banking",
    spaceType: "Banking Lounge",
    year: 2024,
    description: "Ultra-luxury private banking lounge with consultation rooms, waiting area, digital displays, and premium coffee service. Contemporary British design with Middle Eastern influences.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    tags: ["Banking", "Luxury", "Lounge", "Corporate"],
    featured: true
  },

  {
    id: 23,
    title: "Deloitte Consulting Hub",
    client: "Deloitte Middle East",
    category: "interior",
    size: "680 sqm",
    location: "Business Bay, Dubai",
    industry: "Consulting",
    spaceType: "Corporate Office",
    year: 2024,
    description: "Modern open-plan office with collaboration zones, meeting pods, innovation lab, and client presentation center. Sustainable materials and smart building technology throughout.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80",
    tags: ["Corporate", "Office", "Consulting", "Modern"],
    featured: false
  },

  {
    id: 24,
    title: "Google Cloud Regional Office",
    client: "Google Cloud MENA",
    category: "interior",
    size: "450 sqm",
    location: "Dubai Internet City",
    industry: "Technology",
    spaceType: "Tech Office",
    year: 2024,
    description: "Vibrant tech office space with open workstations, creative meeting rooms, game area, cafeteria, and innovation showcase zone. Signature Google colors and playful design elements.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80",
    tags: ["Technology", "Office", "Creative", "Modern"],
    featured: true
  },

  {
    id: 25,
    title: "Rolex Boutique Dubai Mall",
    client: "Rolex Middle East",
    category: "interior",
    size: "180 sqm",
    location: "Dubai Mall",
    industry: "Luxury Retail",
    spaceType: "Luxury Retail",
    year: 2024,
    description: "Prestigious watch boutique with custom display cases, VIP consultation room, secure vault, and elegant seating areas. Premium materials including marble, brass, and leather throughout.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
    tags: ["Retail", "Luxury", "Watches", "Premium"],
    featured: true
  },

  {
    id: 26,
    title: "Siemens Healthcare Clinic",
    client: "Siemens Healthineers",
    category: "interior",
    size: "420 sqm",
    location: "Dubai Healthcare City",
    industry: "Healthcare",
    spaceType: "Medical Facility",
    year: 2025,
    description: "State-of-the-art medical diagnostic center with imaging rooms, consultation areas, waiting lounge, and reception. Clean clinical design with calming color palette and patient-focused layout.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80",
    tags: ["Healthcare", "Medical", "Clinical", "Technology"],
    featured: false
  },

  {
    id: 27,
    title: "Tetra Pak Innovation Center",
    client: "Tetra Pak Middle East",
    category: "interior",
    size: "550 sqm",
    location: "Dubai Industrial Park",
    industry: "Food Processing",
    spaceType: "Innovation Lab",
    year: 2024,
    description: "Industrial-modern innovation center with product testing lab, demonstration kitchen, meeting rooms, and exhibition area. Combines technical functionality with client-facing presentation spaces.",
    image: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=1200&q=80",
    tags: ["Industrial", "Innovation", "Food Tech", "Commercial"],
    featured: false
  },

  {
    id: 28,
    title: "La Petite Maison Restaurant",
    client: "DIFC Restaurants Group",
    category: "interior",
    size: "320 sqm (120 seats)",
    location: "Dubai International Financial Centre",
    industry: "Hospitality",
    spaceType: "Fine Dining",
    year: 2024,
    description: "Upscale French Mediterranean restaurant with open kitchen, wine cellar display, private dining room, and outdoor terrace. Elegant French bistro aesthetic with Dubai luxury touches.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
    tags: ["Restaurant", "Hospitality", "Luxury", "Fine Dining"],
    featured: true
  },

  {
    id: 29,
    title: "Fitness First Platinum Club",
    client: "Fitness First Middle East",
    category: "interior",
    size: "800 sqm",
    location: "Downtown Dubai",
    industry: "Fitness",
    spaceType: "Fitness Center",
    year: 2024,
    description: "Premium gym facility with cardio zone, free weights area, functional training space, studio rooms, spa, and juice bar. Modern industrial aesthetic with motivational branding.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80",
    tags: ["Fitness", "Wellness", "Commercial", "Modern"],
    featured: false
  },

  {
    id: 30,
    title: "Address Hotels Executive Lounge",
    client: "Address Hotels + Resorts",
    category: "interior",
    size: "450 sqm",
    location: "Address Boulevard, Downtown Dubai",
    industry: "Hospitality",
    spaceType: "Hotel Lounge",
    year: 2024,
    description: "Sophisticated hotel executive lounge with reception, seating zones, business center, breakfast area, and bar. Contemporary luxury design with Arabian hospitality elements.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
    tags: ["Hotel", "Hospitality", "Luxury", "Lounge"],
    featured: false
  },

  {
    id: 31,
    title: "Private Villa Emirates Hills",
    client: "Private Client",
    category: "interior",
    size: "950 sqm",
    location: "Emirates Hills, Dubai",
    industry: "Residential",
    spaceType: "Luxury Residence",
    year: 2024,
    description: "Ultra-luxury villa interior featuring grand entrance, formal living, family lounge, dining room, chef's kitchen, home theater, master suite, and spa. Custom Italian furniture and marble throughout.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    tags: ["Residential", "Villa", "Ultra Luxury", "Custom"],
    featured: true
  },

  {
    id: 32,
    title: "WeWork Co-Working Space",
    client: "WeWork Dubai",
    category: "interior",
    size: "620 sqm",
    location: "Dubai Marina",
    industry: "Real Estate",
    spaceType: "Co-Working",
    year: 2024,
    description: "Flexible workspace with hot desks, private offices, meeting rooms, phone booths, lounge area, and pantry. Modern collaborative design with Instagram-worthy interiors and community focus.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80",
    tags: ["Office", "Co-Working", "Modern", "Flexible"],
    featured: false
  }
];

export const regionalEvents: Event[] = [
  // --- UAE 2024 ---
  { name: "Sleep Expo Middle East", date: "Sep 10-12, 2024", venue: "Dubai World Trade Centre", country: "UAE", industry: "Retail" },
  { name: "Sign and Graphic Imaging Middle East", date: "Sep 24-26, 2024", venue: "Dubai World Trade Centre", country: "UAE", industry: "Marketing" },
  { name: "The Hotel Show Dubai", date: "Sep 24-26, 2024", venue: "Dubai World Trade Centre", country: "UAE", industry: "Hospitality" },
  { name: "Watch & Jewellery Show Sharjah", date: "Oct 2-6, 2024", venue: "Expo Centre Sharjah", country: "UAE", industry: "Luxury" },
  { name: "Expand North Star", date: "Oct 13-16, 2024", venue: "Dubai Harbour", country: "UAE", industry: "Technology" },
  { name: "GITEX Global", date: "Oct 14-18, 2024", venue: "Dubai World Trade Centre", country: "UAE", industry: "Technology" },
  { name: "Fintech Surge", date: "Oct 14-18, 2024", venue: "Dubai World Trade Centre", country: "UAE", industry: "Finance" },
  { name: "Marketing Mania", date: "Oct 14-18, 2024", venue: "Dubai World Trade Centre", country: "UAE", industry: "Marketing" },
  { name: "World Blockchain Summit", date: "Oct 22-23, 2024", venue: "Atlantis, The Palm", country: "UAE", industry: "Finance" },
  { name: "NAJAH Abu Dhabi", date: "Oct 27-29, 2024", venue: "ADNEC, Abu Dhabi", country: "UAE", industry: "Education" },
  { name: "Beautyworld Middle East", date: "Oct 28-30, 2024", venue: "Dubai World Trade Centre", country: "UAE", industry: "Beauty" },
  { name: "Sharjah International Book Fair", date: "Nov 1-12, 2024", venue: "Expo Centre Sharjah", country: "UAE", industry: "Culture" },
  { name: "Gulfood Manufacturing", date: "Nov 5-7, 2024", venue: "Dubai World Trade Centre", country: "UAE", industry: "Food & Beverage" },
  { name: "Downtown Design", date: "Nov 6-9, 2024", venue: "Dubai Design District (d3)", country: "UAE", industry: "Art & Design" },
  { name: "ADIPEC", date: "Nov 11-14, 2024", venue: "ADNEC, Abu Dhabi", country: "UAE", industry: "Energy" },
  { name: "Cityscape Global", date: "Nov 19-21, 2024", venue: "Dubai World Trade Centre", country: "UAE", industry: "Real Estate" },
  { name: "Big 5 Global", date: "Nov 26-29, 2024", venue: "Dubai World Trade Centre", country: "UAE", industry: "Construction" },
  { name: "FM Expo", date: "Nov 26-29, 2024", venue: "Dubai World Trade Centre", country: "UAE", industry: "Real Estate" },
  { name: "Middle East Film & Comic Con", date: "Dec 6-8, 2024", venue: "ADNEC, Abu Dhabi", country: "UAE", industry: "Entertainment" },
  { name: "MEBAA Show", date: "Dec 10-12, 2024", venue: "DWC, Dubai Airshow Site", country: "UAE", industry: "Aviation"},
  { name: "ArabPlast", date: "Dec 13-15, 2024", venue: "Dubai World Trade Centre", country: "UAE", industry: "Manufacturing" },

  // --- KSA 2024 ---
  { name: "Global Tech Summit", date: "Sep 10-12, 2024", venue: "King Abdulaziz Conference Center, Riyadh", country: "KSA", industry: "Technology" },
  { name: "Hotel & Hospitality Expo Saudi Arabia", date: "Sep 10-12, 2024", venue: "Riyadh Front", country: "KSA", industry: "Hospitality" },
  { name: "INDEX Saudi", date: "Sep 10-12, 2024", venue: "Riyadh Front", country: "KSA", industry: "Interior Design" },
  { name: "Cityscape Global KSA", date: "Sep 10-13, 2024", venue: "Riyadh Exhibition and Convention Center", country: "KSA", industry: "Real Estate" },
  { name: "Saudi Food Expo", date: "Sep 17-19, 2024", venue: "Riyadh Front", country: "KSA", industry: "Food & Beverage" },
  { name: "Saudi Infrastructure Expo", date: "Sep 24-26, 2024", venue: "Riyadh International Convention & Exhibition Center", country: "KSA", industry: "Construction" },
  { name: "Riyadh International Book Fair", date: "Sep 26 - Oct 5, 2024", venue: "Riyadh Front", country: "KSA", industry: "Culture" },
  { name: "Saudi Agriculture", date: "Oct 21-24, 2024", venue: "Riyadh International Convention & Exhibition Center", country: "KSA", industry: "Food & Beverage" },
  { name: "Global Health Exhibition", date: "Oct 27-29, 2024", venue: "Riyadh Front", country: "KSA", industry: "Healthcare" },
  { name: "Saudi Build", date: "Nov 4-7, 2024", venue: "Riyadh International Convention & Exhibition Center", country: "KSA", industry: "Construction" },
  { name: "Misk Global Forum", date: "Nov 12-14, 2024", venue: "Riyadh", country: "KSA", industry: "Education" },
  { name: "Saudi Power", date: "Nov 25-27, 2024", venue: "Riyadh International Convention & Exhibition Center", country: "KSA", industry: "Energy" },
  { name: "Black Hat Middle East & Africa", date: "Nov 26-28, 2024", venue: "Riyadh Front", country: "KSA", industry: "Security" },
  { name: "Saudi International Motor Show", date: "Dec 5-8, 2024", venue: "Jeddah Superdome", country: "KSA", industry: "Automotive" },
  { name: "Jeddah International Trade Fair", date: "Dec 15-18, 2024", venue: "Jeddah Centre for Forums & Events", country: "KSA", industry: "Retail" },

  // --- UAE 2025 ---
  { name: "World Future Energy Summit", date: "Jan 13-15, 2025", venue: "ADNEC, Abu Dhabi", country: "UAE", industry: "Energy" },
  { name: "Intersec", date: "Jan 14-16, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Security" },
  { name: "Light Middle East", date: "Jan 17-19, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Construction" },
  { name: "World of Coffee Dubai", date: "Jan 21-23, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Food & Beverage" },
  { name: "Arab Health", date: "Jan 27-30, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Healthcare" },
  { name: "AEEDC Dubai", date: "Feb 4-6, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Healthcare" },
  { name: "Breakbulk Middle East", date: "Feb 10-11, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Logistics" },
  { name: "STEP Conference", date: "Feb 11-12, 2025", venue: "Dubai Internet City", country: "UAE", industry: "Technology" },
  { name: "International Property Show", date: "Feb 12-14, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Real Estate" },
  { name: "IDEX & NAVDEX", date: "Feb 17-21, 2025", venue: "ADNEC, Abu Dhabi", country: "UAE", industry: "Defence" },
  { name: "Gulfood", date: "Feb 17-21, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Food & Beverage" },
  { name: "Dubai Food Festival", date: "Feb 28 - Mar 15, 2025", venue: "City-wide, Dubai", country: "UAE", industry: "Food & Beverage"},
  { name: "Dubai Derma", date: "Mar 3-5, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Healthcare" },
  { name: "World Police Summit", date: "Mar 5-7, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Security" },
  { name: "Dubai International Boat Show", date: "Mar 5-9, 2025", venue: "Dubai Harbour", country: "UAE", industry: "Luxury" },
  { name: "Art Dubai", date: "Mar 12-15, 2025", venue: "Madinat Jumeirah", country: "UAE", industry: "Art & Design" },
  { name: "Dubai International Horse Fair", date: "Mar 21-23, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Equestrian" },
  { name: "Custom Show Emirates", date: "Mar 21-23, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Automotive" },
  { name: "GESS Dubai", date: "Mar 25-27, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Education" },
  { name: "World Art Dubai", date: "Apr 2-5, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Art & Design" },
  { name: "Middle East Energy", date: "Apr 15-17, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Energy" },
  { name: "Global Future Show", date: "Apr 16-17, 2025", venue: "Dubai Festival City", country: "UAE", industry: "Technology" },
  { name: "GISEC Global", date: "Apr 21-23, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Technology" },
  { name: "Middle East Rail", date: "Apr 22-23, 2025", venue: "ADNEC, Abu Dhabi", country: "UAE", industry: "Logistics" },
  { name: "Arabian Travel Market", date: "Apr 28 - May 1, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Hospitality" },
  { name: "CABSAT", date: "May 13-15, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Media" },
  { name: "Paperworld Middle East", date: "May 19-21, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Retail"},
  { name: "Airport Show", date: "May 20-22, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Aviation" },
  { name: "Automechanika Dubai", date: "May 27-29, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Automotive" },
  { name: "INDEX Dubai", date: "Jun 3-5, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Interior Design" },
  { name: "Seamless Middle East", date: "Sep 9-10, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Retail" },
  { name: "Seatrade Maritime Middle East", date: "Sep 16-18, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Logistics"},
  { name: "WETEX and Dubai Solar Show", date: "Sep 23-25, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Energy" },
  { name: "GITEX Global 2025", date: "Oct 13-17, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Technology" },
  { name: "Dubai Muscle Show & Dubai Active", date: "Oct 24-26, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Fitness" },
  { name: "Beautyworld Middle East 2025", date: "Oct 27-29, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Beauty" },
  { name: "Gulfood Manufacturing 2025", date: "Nov 4-6, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Food & Beverage" },
  { name: "Dubai Airshow", date: "Nov 17-21, 2025", venue: "DWC, Dubai Airshow Site", country: "UAE", industry: "Aviation" },
  { name: "Cityscape Global 2025", date: "Nov 18-20, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Real Estate" },
  { name: "Big 5 Global 2025", date: "Nov 25-28, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Construction" },
  { name: "Dubai International Jewellery Show", date: "Dec 2-5, 2025", venue: "Dubai World Trade Centre", country: "UAE", industry: "Luxury" },

  // --- KSA 2025 ---
  { name: "Saudi Plastics & Petrochem", date: "Jan 13-16, 2025", venue: "Riyadh International Convention & Exhibition Center", country: "KSA", industry: "Manufacturing" },
  { name: "Saudi Print & Pack", date: "Jan 27-30, 2025", venue: "Riyadh International Convention & Exhibition Center", country: "KSA", industry: "Manufacturing" },
  { name: "World Defense Show", date: "Feb 8-12, 2025", venue: "Riyadh", country: "KSA", industry: "Defence" },
  { name: "LEAP", date: "Feb 10-13, 2025", venue: "Riyadh Exhibition and Convention Center", country: "KSA", industry: "Technology" },
  { name: "The Big 5 Saudi", date: "Feb 24-27, 2025", venue: "Riyadh Front", country: "KSA", industry: "Construction" },
  { name: "Saudi Entertainment and Amusement (SEA) Expo", date: "May 20-22, 2025", venue: "Riyadh International Convention & Exhibition Center", country: "KSA", industry: "Entertainment" },
  { name: "Saudi Light & Sound Expo", date: "May 20-22, 2025", venue: "Riyadh International Convention & Exhibition Center", country: "KSA", industry: "Entertainment" },
  { name: "Saudi Elenex", date: "May 26-28, 2025", venue: "Riyadh International Convention & Exhibition Center", country: "KSA", industry: "Energy" },
  { name: "Saudi Health", date: "Oct 19-21, 2025", venue: "Riyadh International Convention & Exhibition Center", country: "KSA", industry: "Healthcare" },
  { name: "Foodex Saudi", date: "Oct 26-29, 2025", venue: "Jeddah Centre for Forums & Events", country: "KSA", industry: "Food & Beverage" },
  { name: "InFlavour", date: "Nov 11-13, 2025", venue: "Riyadh Front", country: "KSA", industry: "Food & Beverage" },
  
  // --- UAE 2026 (Projected Dates) ---
  { name: "Intersec 2026", date: "Jan 13-15, 2026 (TBC)", venue: "Dubai World Trade Centre", country: "UAE", industry: "Security" },
  { name: "Arab Health 2026", date: "Jan 26-29, 2026 (TBC)", venue: "Dubai World Trade Centre", country: "UAE", industry: "Healthcare" },
  { name: "Gulfood 2026", date: "Feb 16-20, 2026 (TBC)", venue: "Dubai World Trade Centre", country: "UAE", industry: "Food & Beverage" },
  { name: "GITEX Global 2026", date: "Oct 12-16, 2026 (TBC)", venue: "Dubai World Trade Centre", country: "UAE", industry: "Technology" },
  { name: "Big 5 Global 2026", date: "Nov 24-27, 2026 (TBC)", venue: "Dubai World Trade Centre", country: "UAE", industry: "Construction" },
  
  // --- KSA 2026 (Projected Dates) ---
  { name: "LEAP 2026", date: "Feb 9-12, 2026 (TBC)", venue: "Riyadh Exhibition and Convention Center", country: "KSA", industry: "Technology" },
  { name: "The Big 5 Saudi 2026", date: "Feb 23-26, 2026 (TBC)", venue: "Riyadh Front", country: "KSA", industry: "Construction" },
];

export const testimonials: Testimonial[] = [
  { quote: "FANN didn't just build a stand; they created an experience. Their attention to detail and project management is unparalleled. Our leads increased by 40%!", client: "Aisha Al Futtaim", company: "TechVision Systems", projectType: "GITEX Exhibition" },
  { quote: "The team at FANN is a dream to work with. They took our vision for the annual gala and elevated it beyond our wildest expectations. Flawless execution from start to finish.", client: "Johnathan Lee", company: "Global Leaders Org", projectType: "Corporate Event" },
  { quote: "Transforming our new headquarters with FANN was the best decision we made. The design is not only beautiful but has tangibly improved our team's collaboration and morale.", client: "Fatima Al Mansouri", company: "Emirates Tech Solutions", projectType: "Interior Design" },
];