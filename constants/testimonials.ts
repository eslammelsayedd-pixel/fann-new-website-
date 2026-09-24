
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

// Only real, client-approved testimonials go here (name, company, project).
export const detailedTestimonials: DetailedTestimonial[] = [];
