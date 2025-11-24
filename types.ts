
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
  title: string;
  client: string;
  category: 'exhibition' | 'event' | 'interior';
  industry: string;
  year: number;
  image: string;
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
}

export interface Event {
  name: string;
  date: string;
  venue: string;
  country: 'UAE' | 'KSA';
  industry: string;
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
