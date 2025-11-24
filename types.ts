
import React from 'react';

// This file is the single source of truth for types.
// By including an 'export', this file becomes a module.

export interface NavLink {
  name: string;
  path?: string;
  children?: {
    name: string;
    path: string;
  }[];
}

export interface Project {
  id: number;
  slug: string; // URL friendly identifier
  title: string;
  subtitle?: string; // One-liner for hero sections
  client: string;
  category: 'exhibition' | 'event' | 'interior';
  industry: string;
  year: number;
  image: string; // Thumbnail
  heroImage?: string; // Large banner image
  description: string;
  location: string;
  tags?: string[];
  featured?: boolean;
  
  // Category specific fields
  size?: string; // e.g., "120 sqm"
  configuration?: string; // e.g., "Island" (Exhibitions)
  capacity?: string; // e.g., "350 attendees" (Events)
  eventType?: string; // e.g., "Corporate Summit" (Events)
  spaceType?: string; // e.g., "Corporate Office" (Interiors)

  // Detailed Case Study Data
  challenge?: {
    description: string;
    requirements: string[];
  };
  solution?: {
    description: string;
    highlights: { title: string; description: string }[];
  };
  results?: {
    summary: string;
    stats: { number: string; label: string }[];
  };
  specs?: {
    structure?: { label: string; value: string }[];
    technology?: { label: string; value: string }[];
    materials?: { label: string; value: string }[];
    timeline?: { label: string; value: string }[];
  };
  testimonial?: {
    quote: string;
    authorName: string;
    authorTitle: string;
    authorCompany: string;
    authorPhoto?: string;
  };
  gallery?: {
    image: string;
    caption: string;
    featured?: boolean;
  }[];
  similarProjects?: string[]; // List of slugs
}

export interface Event {
  name: string;
  date: string;
  venue: string;
  country: 'UAE' | 'KSA' | 'Other';
  industry: string;
  description?: string;
}

export interface Testimonial {
  quote: string;
  client: string;
  company: string;
  projectType: string;
}

export interface DesignConfiguration {
  companyName: string;
  boothSize: number;
  boothType: string;
  style: string;
  features: string[];
  brandColors: string[];
  logoUrl?: string;
}

export interface GeneratedDesign {
  conceptName: string;
  detailedDescription: string;
  materials: string[];
  lighting: string;
  technologyFeatures: string[];
}
