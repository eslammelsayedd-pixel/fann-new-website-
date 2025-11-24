
export interface DetailedTestimonial {
    id: number;
    quote: string;
    author: string;
    role: string;
    company: string;
    location: string;
    event: string;
    venue: string;
    type: 'Local' | 'International';
}

export const detailedTestimonials: DetailedTestimonial[] = [
    // --- LOCAL UAE/GCC COMPANIES ---
    {
        id: 1,
        quote: "We were worried about the tight timeline for Gulfood, but the FANN team was exceptional. They understood our need for a 'farm-to-table' aesthetic using sustainable materials. The stand was handed over 24 hours before the show opened, perfectly clean and ready.",
        author: "Sarah Johnson",
        role: "Marketing Director",
        company: "Greenheart Organic",
        location: "UAE",
        event: "Gulfood 2024",
        venue: "Dubai World Trade Centre",
        type: "Local"
    },
    {
        id: 2,
        quote: "As a medical supplier, our stand needed to be clinical, clean, and professional. FANN delivered exactly that for Arab Health. The finishing quality on the display counters was excellent, and the project manager was always available on WhatsApp to answer our questions.",
        author: "Fatima Al Zaabi",
        role: "Operations Manager",
        company: "Al Wazzan Medical Supplies",
        location: "UAE",
        event: "Arab Health 2024",
        venue: "Dubai World Trade Centre",
        type: "Local"
    },
    {
        id: 3,
        quote: "GITEX is our biggest event of the year, and we needed a stand that could handle high footfall. FANN designed a layout that flowed perfectly. The LED screen integration was seamless, and the team handled all the technical approvals with DWTC without bothering us.",
        author: "Ahmed Al Mansoori",
        role: "Founder",
        company: "Falcon Automation Systems",
        location: "UAE",
        event: "GITEX Global",
        venue: "Dubai World Trade Centre",
        type: "Local"
    },
    {
        id: 4,
        quote: "We needed a functioning kitchen setup for our tasting sessions at Gulfood. FANN navigated the health and safety regulations at DWTC effortlessly. The stand looked premium, and we received so many compliments on the design from our visitors.",
        author: "Layla Hassan",
        role: "Brand Manager",
        company: "Pearl Gourmet Foods",
        location: "UAE",
        event: "Gulfood",
        venue: "Dubai World Trade Centre",
        type: "Local"
    },
    {
        id: 5,
        quote: "Designing a stand for a furniture company is hard because the stand itself has to match our design quality. FANN nailed the 'luxury living' vibe we wanted for The Big 5. The carpentry work was top-notch, comparable to permanent interior fit-outs.",
        author: "Mohammad Rahman",
        role: "Managing Director",
        company: "Skyline Furniture Design",
        location: "UAE",
        event: "The Big 5",
        venue: "Dubai World Trade Centre",
        type: "Local"
    },
    {
        id: 6,
        quote: "Great value for money. We are an SME and had a strict budget for ADIPEC. FANN gave us a custom look using modular elements that saved us cost without looking cheap. The team was polite, professional, and on time.",
        author: "James Mitchell",
        role: "General Manager",
        company: "Green Earth Environmental",
        location: "UAE",
        event: "ADIPEC 2024",
        venue: "ADNEC Abu Dhabi",
        type: "Local"
    },

    // --- INTERNATIONAL SME COMPANIES ---
    {
        id: 7,
        quote: "Managing a build in Dubai while sitting in Germany is usually stressful, but FANN made it easy. They sent us photo updates daily. The build quality matched German standards, and everything was ready when our team landed in Dubai.",
        author: "Hans Weber",
        role: "CEO",
        company: "BioTech Innovations",
        location: "Germany",
        event: "Arab Health",
        venue: "Dubai World Trade Centre",
        type: "International"
    },
    {
        id: 8,
        quote: "We needed an Italian flair for our packaging stand at Gulfood Manufacturing. FANN's design team really listened to our vision. The colors were matched perfectly to our brand guidelines, and the lighting made our products pop.",
        author: "Marco Rossi",
        role: "Export Manager",
        company: "FreshFlow Packaging",
        location: "Italy",
        event: "Gulfood Manufacturing",
        venue: "Dubai World Trade Centre",
        type: "International"
    },
    {
        id: 9,
        quote: "This was our first time exhibiting at ADIPEC. FANN guided us through the ADNEC regulations and handled the logistics of our heavy machinery display perfectly. A reliable partner for any international company coming to the UAE.",
        author: "David Chen",
        role: "Technical Director",
        company: "TechFlow Europe",
        location: "UK/China",
        event: "ADIPEC",
        venue: "ADNEC Abu Dhabi",
        type: "International"
    },
    {
        id: 10,
        quote: "Simple, elegant, and effective. We wanted a Scandinavian minimalist look for our health tech booth, and FANN respected that simplicity without making it look boring. Handover was smooth and snag-free.",
        author: "Priya Sharma",
        role: "Marketing Lead",
        company: "Nordic Health Systems",
        location: "Sweden",
        event: "Arab Health",
        venue: "Dubai World Trade Centre",
        type: "International"
    }
];
