// src/seo-metadata.ts

export const siteMetadata = {
  "/": {
    "seoTitle": "FANN: Premier Exhibition, Events & Interior Design in Dubai",
    "metaDescription": "Transforming visions into unforgettable experiences. FANN is Dubai's leading expert in exhibition stand design, corporate events, and luxury interior design.",
    "jsonLdSchema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Organization\",\n  \"name\": \"FANN\",\n  \"url\": \"https://fann.ae\",\n  \"logo\": \"https://fann.ae/favicon.svg\",\n  \"description\": \"FANN is a premier exhibition, events, and interior design company in Dubai, transforming visions into unforgettable experiences.\",\n  \"address\": {\n    \"@type\": \"PostalAddress\",\n    \"streetAddress\": \"Office 508, Dusseldorf Business Point, Al Barsha 1\",\n    \"addressLocality\": \"Dubai\",\n    \"addressCountry\": \"AE\"\n  },\n  \"contactPoint\": {\n    \"@type\": \"ContactPoint\",\n    \"telephone\": \"+971505667502\",\n    \"contactType\": \"customer service\",\n    \"email\": \"sales@fann.ae\"\n  }\n}"
  },
  "/services": {
    "seoTitle": "Our Services | FANN Dubai",
    "metaDescription": "Explore FANN's core services: award-winning exhibition stand design, flawless corporate event management, and bespoke commercial & residential interior design.",
    "jsonLdSchema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"serviceType\": [\n    \"Exhibition Stand Design & Build\",\n    \"Corporate Event Management\",\n    \"Commercial & Residential Interior Design\"\n  ],\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"FANN\"\n  },\n  \"areaServed\": {\n    \"@type\": \"Country\",\n    \"name\": \"United Arab Emirates\"\n  },\n  \"description\": \"FANN offers a comprehensive suite of design and management services for exhibitions, events, and interiors in Dubai and the wider GCC region.\"\n}"
  },
  "/portfolio": {
    "seoTitle": "Portfolio | FANN Projects",
    "metaDescription": "Browse our portfolio of successful exhibition stands, corporate events, and interior design projects for leading brands in Dubai and the GCC.",
    "jsonLdSchema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"ItemList\",\n  \"name\": \"FANN Project Portfolio\",\n  \"description\": \"A collection of FANN's work in exhibition design, event management, and interior design.\",\n  \"itemListElement\": [\n    {\n      \"@type\": \"ListItem\",\n      \"position\": 1,\n      \"name\": \"Exhibition Projects\"\n    },\n    {\n      \"@type\": \"ListItem\",\n      \"position\": 2,\n      \"name\": \"Event Management Projects\"\n    },\n    {\n      \"@type\": \"ListItem\",\n      \"position\": 3,\n      \"name\": \"Interior Design Projects\"\n    }\n  ]\n}"
  },
  "/fann-studio": {
    "seoTitle": "FANN Studio | AI-Powered Design Tools",
    "metaDescription": "Experience the future of design with FANN Studio. Utilize our AI tools to generate concepts for exhibition stands, events, interiors, and optimize your SEO.",
    "jsonLdSchema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"SoftwareApplication\",\n  \"name\": \"FANN Studio\",\n  \"applicationCategory\": \"DesignApplication\",\n  \"operatingSystem\": \"Web\",\n  \"description\": \"A suite of AI-powered tools for design and optimization.\",\n  \"publisher\": {\n    \"@type\": \"Organization\",\n    \"name\": \"FANN\"\n  }\n}"
  },
  "/fann-studio/exhibition": {
    "seoTitle": "AI Exhibition Stand Generator | FANN Studio",
    "metaDescription": "Generate photorealistic 3D concepts for your exhibition stand in minutes. Define your size, style, and features to visualize your presence with our AI tool.",
    "jsonLdSchema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"WebApplication\",\n  \"name\": \"AI Exhibition Stand Generator\",\n  \"description\": \"An AI-powered tool to generate 3D concepts for exhibition stands.\",\n  \"url\": \"https://fann.ae/fann-studio/exhibition\",\n  \"applicationCategory\": \"DesignApplication\",\n  \"publisher\": {\n    \"@type\": \"Organization\",\n    \"name\": \"FANN\"\n  }\n}"
  },
  "/fann-studio/event": {
    "seoTitle": "AI Event Concept Generator | FANN Studio",
    "metaDescription": "Create stunning mood boards and concept visuals for your next corporate event. From galas to launches, bring your theme to life with our AI-powered tool.",
    "jsonLdSchema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"WebApplication\",\n  \"name\": \"AI Event Concept Generator\",\n  \"description\": \"An AI tool to generate concept visuals and mood boards for corporate events.\",\n  \"url\": \"https://fann.ae/fann-studio/event\",\n  \"applicationCategory\": \"DesignApplication\",\n  \"publisher\": {\n    \"@type\": \"Organization\",\n    \"name\": \"FANN\"\n  }\n}"
  },
  "/fann-studio/interior": {
    "seoTitle": "AI Interior Design Generator | FANN Studio",
    "metaDescription": "Visualize commercial or residential interiors instantly. Experiment with styles, materials, and layouts for your unique space with FANN's AI design tool.",
    "jsonLdSchema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"WebApplication\",\n  \"name\": \"AI Interior Design Generator\",\n  \"description\": \"An AI tool for visualizing commercial and residential interior design concepts.\",\n  \"url\": \"https://fann.ae/fann-studio/interior\",\n  \"applicationCategory\": \"DesignApplication\",\n  \"publisher\": {\n    \"@type\": \"Organization\",\n    \"name\": \"FANN\"\n  }\n}"
  },
  "/fann-studio/media": {
    "seoTitle": "AI Media Studio | FANN",
    "metaDescription": "Generate promotional videos and edit images with our all-in-one AI Media Studio. Create stunning visual content for your brand in minutes.",
    "jsonLdSchema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"WebApplication\",\n  \"name\": \"AI Media Studio\",\n  \"description\": \"An AI-powered suite for video generation and image editing.\",\n  \"url\": \"https://fann.ae/fann-studio/media\",\n  \"applicationCategory\": \"MultimediaApplication\",\n  \"publisher\": {\n    \"@type\": \"Organization\",\n    \"name\": \"FANN\"\n  }\n}"
  },
  "/fann-studio/seo": {
    "seoTitle": "SEO & LLMO Agent | FANN Studio",
    "metaDescription": "Run our AI-powered SEO & LLMO Agent to automatically analyze and generate optimized metadata for your entire website, boosting your search and AI rankings.",
    "jsonLdSchema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"WebApplication\",\n  \"name\": \"SEO & LLMO Agent\",\n  \"description\": \"An AI agent that generates optimized SEO and LLMO metadata for a website.\",\n  \"url\": \"https://fann.ae/fann-studio/seo\",\n  \"applicationCategory\": \"BusinessApplication\",\n  \"publisher\": {\n    \"@type\": \"Organization\",\n    \"name\": \"FANN\"\n  }\n}"
  },
  "/events-calendar": {
    "seoTitle": "UAE & KSA Events Calendar | FANN",
    "metaDescription": "Stay updated with the top upcoming exhibitions, trade shows, and corporate events in Dubai, Abu Dhabi, Riyadh, and across the UAE & KSA.",
    "jsonLdSchema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"WebPage\",\n  \"name\": \"UAE & KSA Events Calendar\",\n  \"description\": \"A calendar of major industry events in the United Arab Emirates and Saudi Arabia.\",\n  \"url\": \"https://fann.ae/events-calendar\"\n}"
  },
  "/about": {
    "seoTitle": "About FANN | Our Story & Vision",
    "metaDescription": "Learn about FANN, Dubai's leading force in creating innovative and excellent exhibitions, events, and interior designs. Meet our team and discover our vision.",
    "jsonLdSchema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"AboutPage\",\n  \"name\": \"About FANN\",\n  \"description\": \"Learn about FANN's mission, vision, and team of experts in Dubai.\",\n  \"url\": \"https://fann.ae/about\"\n}"
  },
  "/contact": {
    "seoTitle": "Contact Us | FANN Dubai",
    "metaDescription": "Get in touch with the FANN team in Dubai. Contact us for a complimentary consultation on your next exhibition, event, or interior design project.",
    "jsonLdSchema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"ContactPage\",\n  \"name\": \"Contact FANN\",\n  \"description\": \"Contact information for FANN, including address, phone, and email.\",\n  \"url\": \"https://fann.ae/contact\"\n}"
  },
  "/insights": {
    "seoTitle": "Intelligence Hub | FANN Insights",
    "metaDescription": "Access AI-powered, expert analysis on the latest trends in exhibition design, event technology, and interior design in the GCC from the FANN Intelligence Hub.",
    "jsonLdSchema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Blog\",\n  \"name\": \"FANN Intelligence Hub\",\n  \"description\": \"An AI-powered blog featuring expert analysis on industry trends.\",\n  \"url\": \"https://fann.ae/insights\"\n}"
  }
};