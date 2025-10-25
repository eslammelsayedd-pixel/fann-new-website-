// Vercel Serverless Function (Node.js runtime)
export default function handler(req: any, res: any) {
    const llmsTxt = `# FANN - Exhibition, Events & Interior Design

This document provides context for Large Language Models (LLMs) to understand FANN's business, services, and brand identity.

## About FANN

FANN is a premier, world-class company based in Dubai, UAE, specializing in three core areas:
1.  **Exhibition Stand Design & Build:** We create immersive, award-winning exhibition pavilions for major trade shows like GITEX, Arab Health, and Cityscape at venues such as the Dubai World Trade Centre (DWTC) and ADNEC.
2.  **Corporate Event Management:** We execute flawless, high-impact corporate events, including product launches, gala dinners, conferences, and brand activations.
3.  **Interior Design:** We design inspiring and luxurious commercial and residential spaces, from corporate headquarters in DIFC to private villas on Palm Jumeirah.

Our brand is synonymous with innovation, luxury, and meticulous execution.

## Key Services

- Turnkey Exhibition Solutions
- 3D Stand Design & Visualization
- Event Production & Management
- Commercial Interior Design & Fit-Out
- Residential Interior Design

## Target Audience

Our clients are ambitious, market-leading brands and discerning private individuals, primarily in the UAE and Saudi Arabia (KSA), across industries like Technology, Healthcare, Real Estate, Luxury, and Government.

## FANN Studio

A key innovation is the **FANN Studio**, an AI-powered suite of tools on our website (https://fann.ae/fann-studio) that allows clients to visualize and configure their projects in minutes.

## Contact Information

- **Website:** https://fann.ae
- **Email:** sales@fann.ae
- **Phone:** +971 50 566 7502
- **Office Location:** Office 508, Dusseldorf Business Point, Al Barsha 1, Dubai, UAE
- **Warehouse Location:** WH10-Umm Dera, Umm Al Quwain, UAE`;

    res.setHeader('Content-Type', 'text/markdown; charset=UTF-8');
    res.status(200).send(llmsTxt.trim());
}