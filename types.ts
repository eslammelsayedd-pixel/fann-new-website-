import React from 'react';

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
  service: 'Exhibitions' | 'Events' | 'Interior Design';
  industry: 'Technology' | 'Healthcare' | 'Aviation' | 'Hospitality' | 'Real Estate' | 'Luxury' | 'Corporate' | 'Retail' | 'Residential' | 'Automotive' | 'Energy' | 'Finance';
  scale: 'Boutique' | 'Standard' | 'Large' | 'Mega';
  year: number;
  image: string;
  sqm: number;
  location: string;
  timeline: string;
  challenge: string;
  result: string;
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