import type { VercelRequest, VercelResponse } from '@vercel/node';
import url from 'url';
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Google GenAI SDK with server-side API Key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_CLOUD_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// 1. Detect Industry
async function detectIndustry(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const { eventName } = req.body || {};
  if (!eventName) return res.status(400).json({ error: 'eventName is required' });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Analyze this event/exhibition name: "${eventName}". Tell me what specific industry/sector it represents (e.g., Technology, Aviation, Real Estate, Medical, Automotive, Food & Beverage, Fashion, Construction, etc.). Return only the industry name.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            industry: { type: Type.STRING, description: "The primary industry/sector represented by the event" }
          },
          required: ["industry"]
        }
      }
    });

    const result = JSON.parse(response.text?.trim() || '{}');
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('detect-industry error:', error);
    return res.status(200).json({ industry: 'Exhibitions & Events' });
  }
}

// 2. Extract Colors from Logo
async function extractColors(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const { image, mimeType } = req.body || {};
  if (!image) return res.status(400).json({ error: 'image is required' });

  try {
    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/png",
        data: image,
      },
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        imagePart,
        "Analyze this logo/brand image. Extract 3 primary/brand colors as hex codes. Return them in a JSON array."
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            colors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of 3 hex color codes found in the image"
            }
          },
          required: ["colors"]
        }
      }
    });

    const result = JSON.parse(response.text?.trim() || '{}');
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('extract-colors error:', error);
    return res.status(200).json({ colors: ['#D4AF37', '#111111', '#FFFFFF'] });
  }
}

// 3. Grounded Chatbot Advisor
async function chat(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const { history } = req.body || {};
  if (!history || !Array.isArray(history)) return res.status(400).json({ error: 'history is required' });

  try {
    const latestMessage = history[history.length - 1];
    const userPrompt = latestMessage?.parts?.[0]?.text || '';

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: userPrompt,
      config: {
        systemInstruction: "You are FANN Assistant for FANN (fann.ae), an exhibition stand design and build, events and interior fit-out company. Office: 508 Dusseldorf Business Centre, Al Barsha, Dubai. Workshop: Warehouse 10, Um Dera, Umm Al Quwain. We have delivered 200+ projects over 6+ years, mainly across the UAE. Help visitors plan stands and events (e.g. GITEX, ADIPEC, Gulfood) and guide them to share their event, date, stand size and budget via the contact form, WhatsApp or sales@fann.ae. Rules: never offer or promise any discount, percentage off, promo code or special price, and do not state any discount policy; if asked about discounts or pricing, say every project is quoted individually and the team will discuss pricing in a tailored quote. Never invent prices, clients, awards or projects. Be concise and use markdown.",
        tools: [{ googleSearch: {} }]
      }
    });

    const content = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web?.uri)
      .map((chunk: any) => ({
        uri: chunk.web.uri,
        title: chunk.web.title || chunk.web.uri
      }));

    return res.status(200).json({ content, sources });
  } catch (error: any) {
    console.error('chat error:', error);
    return res.status(200).json({
      content: "Thank you for reaching out! I'm currently operating in offline mode. Please feel free to call or WhatsApp us directly at +971 50 566 7502 for any immediate inquiries, or send us a message via our contact form!"
    });
  }
}

// 4. Grounded Insights Generator
async function generateInsights(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'prompt is required' });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert design journalist for FANN Insights & Guides, a publication in the GCC. Write an extremely engaging, high-quality, professional article based on the prompt. Cite industry reports or real examples if possible. Use clean Markdown.",
        tools: [{ googleSearch: {} }]
      }
    });

    const content = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web?.uri)
      .map((chunk: any) => ({
        uri: chunk.web.uri,
        title: chunk.web.title || chunk.web.uri
      }));

    return res.status(200).json({ content, sources });
  } catch (error: any) {
    console.error('generate-insights error:', error);
    return res.status(500).json({ error: 'Failed to generate insights' });
  }
}

// 5. Exhibition Design Generator (Structured + Visuals)
async function generateExhibitionDesign(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const formData = req.body || {};

  try {
    const prompt = `You are a senior exhibition architect with 15 years of buildable, award-winning stands delivered in GCC venues (DWTC, ADNEC, Riyadh Front). Produce four bespoke exhibition stand concepts for a company named "${formData.companyName || 'Our Client'}" operating in the "${formData.detectedIndustry || 'general'}" sector.
Booth Size: ${formData.boothSize || 36} sqm.
Booth Configuration/Type: ${formData.boothType || 'Island'}.
Design Style: ${formData.style || 'Modern Luxury'}.
Key Features Requested: ${(formData.features || []).join(', ') || 'N/A'}.
Brand Colors: ${(formData.brandColors || []).join(', ') || 'Gold, Charcoal, White'}.

Each concept must be engineered, not decorated. For every concept, reason through and embed in the description:
1. Zoning and flow: divide the footprint into attract / engage / convert zones; state the layout logic (reception position versus the primary approach aisle, demo area, meeting space, and roughly 10-15% storage/BOH). Peninsula and island stands must read as genuinely open on the required sides.
2. Sightlines: what a visitor registers in the first 3 seconds from 15-20m down the main aisle - one dominant brand move, visible above neighbouring 2.4m shell-scheme walls.
3. GCC venue constraints: respect typical DWTC rules - max build height around 4m (up to 6m for island stands with venue approval), no rigging assumed, flame-retardant B1 materials, double-decks only when the footprint is 50+ sqm, with stair pitch and 1.1m balustrades noted.
4. Human scale and ergonomics: real dimensions - reception counters 900-1100mm high, doorways 900mm or wider, meeting tables for 4-6 people, clear 1.5m circulation loops.
5. Materials realism: name buildable materials with finish and fixing (for example "fluted oak veneer panels on 18mm MDF carcass" or "powder-coated aluminium frame, matte RAL 9016") - no fantasy materials.
6. Brand application: state exactly where and how the brand appears (3D halo-lit logo at height, brand colour on specified surfaces, LED content zone) using the given brand colours.

Rules: Put the useful facts in specs as short, independently readable bullet strings, not prose. dimensions = exact footprint/height or clear assumptions; materials = named surfaces and finish; features = actual functions and layout; inclusions = build/production scope, excluding anything that requires venue approval. Do not invent confirmed site dimensions or approved engineering. Each list has 2-4 concrete items. description may be one short summary sentence. Each concept must contain at least three concrete dimensions. No empty adjectives such as "stunning", "amazing", "sleek" or "cutting-edge" - show the mechanism, never the hype. The four concepts must be distinct strategies (for example hospitality-led versus demo-led versus brand-theatre versus meetings-led), all buildable by a professional contractor within a real budget. Return the details in JSON structure matching the required schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            industry: { type: Type.STRING },
            conceptA: {
              type: Type.OBJECT,
              properties: {
                conceptName: { type: Type.STRING },
                style: { type: Type.STRING },
                description: { type: Type.STRING },
                specs: { type: Type.OBJECT, properties: { dimensions: { type: Type.ARRAY, items: { type: Type.STRING } }, materials: { type: Type.ARRAY, items: { type: Type.STRING } }, features: { type: Type.ARRAY, items: { type: Type.STRING } }, inclusions: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["dimensions", "materials", "features", "inclusions"] },
                materials: { type: Type.ARRAY, items: { type: Type.STRING } },
                keyFeature: { type: Type.STRING }
              },
              required: ["conceptName", "style", "description", "specs", "materials", "keyFeature"]
            },
            conceptB: {
              type: Type.OBJECT,
              properties: {
                conceptName: { type: Type.STRING },
                style: { type: Type.STRING },
                description: { type: Type.STRING },
                specs: { type: Type.OBJECT, properties: { dimensions: { type: Type.ARRAY, items: { type: Type.STRING } }, materials: { type: Type.ARRAY, items: { type: Type.STRING } }, features: { type: Type.ARRAY, items: { type: Type.STRING } }, inclusions: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["dimensions", "materials", "features", "inclusions"] },
                materials: { type: Type.ARRAY, items: { type: Type.STRING } },
                keyFeature: { type: Type.STRING }
              },
              required: ["conceptName", "style", "description", "specs", "materials", "keyFeature"]
            },
            conceptC: {
              type: Type.OBJECT,
              properties: {
                conceptName: { type: Type.STRING },
                style: { type: Type.STRING },
                description: { type: Type.STRING },
                specs: { type: Type.OBJECT, properties: { dimensions: { type: Type.ARRAY, items: { type: Type.STRING } }, materials: { type: Type.ARRAY, items: { type: Type.STRING } }, features: { type: Type.ARRAY, items: { type: Type.STRING } }, inclusions: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["dimensions", "materials", "features", "inclusions"] },
                materials: { type: Type.ARRAY, items: { type: Type.STRING } },
                keyFeature: { type: Type.STRING }
              },
              required: ["conceptName", "style", "description", "specs", "materials", "keyFeature"]
            },
            conceptD: {
              type: Type.OBJECT,
              properties: {
                conceptName: { type: Type.STRING },
                style: { type: Type.STRING },
                description: { type: Type.STRING },
                specs: { type: Type.OBJECT, properties: { dimensions: { type: Type.ARRAY, items: { type: Type.STRING } }, materials: { type: Type.ARRAY, items: { type: Type.STRING } }, features: { type: Type.ARRAY, items: { type: Type.STRING } }, inclusions: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["dimensions", "materials", "features", "inclusions"] },
                materials: { type: Type.ARRAY, items: { type: Type.STRING } },
                keyFeature: { type: Type.STRING }
              },
              required: ["conceptName", "style", "description", "specs", "materials", "keyFeature"]
            }
          },
          required: ["industry", "conceptA", "conceptB", "conceptC", "conceptD"]
        }
      }
    });

    const result = JSON.parse(response.text?.trim() || '{}');

    // Never mislabel an unrelated stock photo as the user's bespoke render.
    for (const key of ['conceptA', 'conceptB', 'conceptC', 'conceptD']) result[key].image = '';

    // Try custom visual concept generation using gemini-3.1-flash-image
    try {
      const imgPromises = ['conceptA', 'conceptB', 'conceptC', 'conceptD'].map(async (key) => {
        const concept = result[key];
        const imageResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-image',
          contents: {
            parts: [
              {
                text: `Photorealistic architectural visualization of a ${formData.boothSize || 36} sqm ${formData.boothType || 'Island'} exhibition stand inside a busy GCC trade show hall (high dark ceiling with exposed rigging, polished concrete floor, softly blurred neighbouring stands). Concept: "${concept.conceptName}". Style: ${concept.style}. Key feature: ${concept.keyFeature}. Brand colours applied accurately: ${(formData.brandColors || []).join(', ')}. Camera: eye-level 1.6m, 24mm wide-angle lens, three-quarter perspective showing two open sides and the approach aisle. Include 5-8 business-attired visitors for human scale, some engaged at a 1.05m reception counter. Lighting: realistic venue ambient 4500K hall light mixed with warm 3000K stand accent lighting; physically plausible shadows. Materials render with true texture (wood grain, brushed metal, fabric weave). Geometry must be buildable: straight edges, correct perspective, no floating elements, no impossible cantilevers, no warped structures. Use specified materials and dimensions: ${JSON.stringify(concept.specs || {})}. If the client gave no logo, show abstract brand-colour blocks only. No readable signage, gibberish lettering, typographic artifacts, watermarks, duplicated limbs, warped stairs, impossible support or floating panels. Physically based materials and exposure, plausible structural bays and connections; editorial trade-show photography, not a glossy CGI poster.`,
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio: "16:9"
            }
          }
        });

        for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData?.data) {
            concept.image = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      });

      await Promise.allSettled(imgPromises);
    } catch (imageErr: any) {
      console.log("Exhibition image generation fell back to premium stock:", imageErr.message);
    }

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('generate-exhibition-design error:', error);
    return res.status(500).json({ error: 'Failed to generate exhibition design concepts' });
  }
}

// 6. Event Design Generator
async function generateEventDesign(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const formData = req.body || {};

  try {
    const prompt = `You are a senior event production designer with 200+ GCC corporate events staged (Dubai Opera, Atlantis The Palm, Ritz-Carlton Riyadh). Produce four premium event stage and hall design concepts for "${formData.companyName || 'Our Client'}" operating in "${formData.detectedIndustry || 'general'}".
Event Type: ${formData.eventType || 'Corporate Summit'}.
Attendee Capacity: ${formData.attendees || formData.guestCount || 200} guests.
Style: ${formData.style || 'Modern Grandeur'}.
Key Features: ${(formData.features || []).join(', ') || 'N/A'}.
Brand Colors: ${(formData.brandColors || []).join(', ') || 'Gold, Deep Blue, White'}.

Each concept must be production-ready. Reason through and embed:
1. Stage geometry versus capacity: stage width and depth scaled to room and guest count (for example a 12m x 6m stage for 400 banquet seats); sightline logic - every seat, including the worst seat at the back, sees stage and screen; state the seating format (banquet rounds of 8-10, theatre, or mixed).
2. Lighting design as a real spec: fixture types, positions and intent (for example moving-head beams on the FOH truss for keynotes, 2700K table pin-spots, LED battens for wall wash, followspot for speakers) - write the lighting field like a lighting designer's rider.
3. Venue and safety constraints: GCC ballroom realities - rigging points and loads, Dubai Civil Defence egress (1.2m clear aisles, marked exits), haze requires venue approval, fire-retardant drapes and scenic materials.
4. Production logistics: backstage/BOH flow, cable management, power distribution, screen sizing (for example an 8m x 4.5m LED wall readable at 40m), stage access steps and ramps.
5. decorElements: name real, rentable or buildable elements with materials (for example "fluted champagne-gold metal arches" or "fresh white orchid runners on 2.4m banquet rounds") - no vague "elegant decor".
6. engagementTech: only proven, deployable technology (LED wall with branded motion content, projection mapping with lumen spec, live polling, translation headsets) with the purpose each serves.

Rules: specs must be 2-4 short bullet strings per category (dimensions, materials, features, inclusions), with exact stage/screen dimensions, seating math, venue-dependent assumptions, rentable/constructible materials, real production scope. Keep detailedDescription to one sentence. No unverified venue approval or engineering. The concept must include at least three concrete dimensions and the seating math for the given capacity. Ban empty adjectives such as "spectacular", "breathtaking" or "magical" - describe the mechanism that creates the effect. The four concepts must be distinct strategies. Return the details in JSON structure matching the required schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            industry: { type: Type.STRING },
            conceptA: {
              type: Type.OBJECT,
              properties: {
                conceptName: { type: Type.STRING },
                style: { type: Type.STRING },
                detailedDescription: { type: Type.STRING },
                specs: { type: Type.OBJECT, properties: { dimensions: { type: Type.ARRAY, items: { type: Type.STRING } }, materials: { type: Type.ARRAY, items: { type: Type.STRING } }, features: { type: Type.ARRAY, items: { type: Type.STRING } }, inclusions: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["dimensions", "materials", "features", "inclusions"] },
                decorElements: { type: Type.ARRAY, items: { type: Type.STRING } },
                lighting: { type: Type.STRING },
                engagementTech: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["conceptName", "style", "detailedDescription", "specs", "decorElements", "lighting", "engagementTech"]
            },
            conceptB: {
              type: Type.OBJECT,
              properties: {
                conceptName: { type: Type.STRING },
                style: { type: Type.STRING },
                detailedDescription: { type: Type.STRING },
                specs: { type: Type.OBJECT, properties: { dimensions: { type: Type.ARRAY, items: { type: Type.STRING } }, materials: { type: Type.ARRAY, items: { type: Type.STRING } }, features: { type: Type.ARRAY, items: { type: Type.STRING } }, inclusions: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["dimensions", "materials", "features", "inclusions"] },
                decorElements: { type: Type.ARRAY, items: { type: Type.STRING } },
                lighting: { type: Type.STRING },
                engagementTech: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["conceptName", "style", "detailedDescription", "specs", "decorElements", "lighting", "engagementTech"]
            },
            conceptC: {
              type: Type.OBJECT,
              properties: {
                conceptName: { type: Type.STRING },
                style: { type: Type.STRING },
                detailedDescription: { type: Type.STRING },
                specs: { type: Type.OBJECT, properties: { dimensions: { type: Type.ARRAY, items: { type: Type.STRING } }, materials: { type: Type.ARRAY, items: { type: Type.STRING } }, features: { type: Type.ARRAY, items: { type: Type.STRING } }, inclusions: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["dimensions", "materials", "features", "inclusions"] },
                decorElements: { type: Type.ARRAY, items: { type: Type.STRING } },
                lighting: { type: Type.STRING },
                engagementTech: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["conceptName", "style", "detailedDescription", "specs", "decorElements", "lighting", "engagementTech"]
            },
            conceptD: {
              type: Type.OBJECT,
              properties: {
                conceptName: { type: Type.STRING },
                style: { type: Type.STRING },
                detailedDescription: { type: Type.STRING },
                specs: { type: Type.OBJECT, properties: { dimensions: { type: Type.ARRAY, items: { type: Type.STRING } }, materials: { type: Type.ARRAY, items: { type: Type.STRING } }, features: { type: Type.ARRAY, items: { type: Type.STRING } }, inclusions: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["dimensions", "materials", "features", "inclusions"] },
                decorElements: { type: Type.ARRAY, items: { type: Type.STRING } },
                lighting: { type: Type.STRING },
                engagementTech: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["conceptName", "style", "detailedDescription", "specs", "decorElements", "lighting", "engagementTech"]
            }
          },
          required: ["industry", "conceptA", "conceptB", "conceptC", "conceptD"]
        }
      }
    });

    const result = JSON.parse(response.text?.trim() || '{}');

    // Show a clear unavailable state rather than a stock image pretending to be generated.
    for (const key of ['conceptA', 'conceptB', 'conceptC', 'conceptD']) result[key].image = '';

    try {
      const imgPromises = ['conceptA', 'conceptB', 'conceptC', 'conceptD'].map(async (key) => {
        const concept = result[key];
        const imageResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-image',
          contents: {
            parts: [
              {
                text: `Photorealistic architectural photo of a GCC corporate event: "${concept.conceptName}" staged in a luxury hotel ballroom (high ceiling, chandeliers dimmed, dark ambient). Style: ${concept.style}. Lighting design: ${concept.lighting}. Key decor: ${(concept.decorElements || []).join(', ')}. Seating: ${formData.attendees || formData.guestCount || 200} guests in a correctly scaled banquet or theatre layout, realistic crowd density, people in business attire. Camera: rear-of-house elevated 2.5m, 24mm wide lens, showing full stage, LED wall with abstract brand-coloured content, and audience depth. Lighting renders with realistic haze, visible beams from truss positions, warm pin-spots on tables; physically plausible exposure and shadows. Straight geometry, correct perspective, no warped architecture, no floating objects, no illegible text. Concept specifications: ${JSON.stringify(concept.specs || {})}. Honor supplied brand colours, if none use restrained champagne gold and charcoal. No readable signage or typographic artifacts, watermarks, duplicated guests or limbs, impossible rigging or warped geometry. Photographic lens and realistic skin, fabric, lighting and reflections, not illustration or fantasy stage art.`,
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio: "16:9"
            }
          }
        });

        for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData?.data) {
            concept.image = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      });

      await Promise.allSettled(imgPromises);
    } catch (imageErr: any) {
      console.log("Event image generation fell back to stock:", imageErr.message);
    }

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('generate-event-design error:', error);
    return res.status(500).json({ error: 'Failed to generate event design concepts' });
  }
}

// 7. Interior Design Generator
async function generateInteriorDesign(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const formData = req.body || {};

  try {
    const prompt = `You are a senior interior architect delivering luxury commercial fit-outs in DIFC, Downtown Dubai and KAFD. Produce one deeply considered interior design concept for a company named "${formData.companyName || 'Our Client'}" operating in the "${formData.detectedIndustry || 'general'}" sector.
Space Type: ${formData.spaceType || 'Executive Office'}.
Space Area: ${formData.size || formData.spaceArea || 150} sqm.
Design Style: ${formData.style || 'Modern Biophilic'}.
Key Features: ${(formData.features || []).join(', ') || 'N/A'}.
Brand Colors: ${(formData.brandColors || []).join(', ') || 'Charcoal, Wood, Gold'}.

The concept must be buildable and ergonomic. Reason through and embed:
1. Spatial planning for the given area: net usable zoning (reception, open work, focus rooms, collaboration, support) with area allocations that add up to the stated sqm; primary circulation 1.2-1.5m, workstation spacing to modern standards.
2. Materials realism: every material named with finish and application (for example "book-matched Calacatta Viola reception desk with mitred edges", "wide-plank smoked oak flooring", "PET acoustic baffles, NRC 0.85, ceiling-suspended") - materials must be procurable in the UAE market.
3. Lighting design: per-zone spec - 400-500 lux task lighting at desks, 3000K warm ambient in lounges, 4000K in circulation, dimmable scenes; daylight strategy and glare control.
4. Human factors: ergonomic heights (740mm desks, 900mm counters), acoustic privacy strategy for meeting rooms, wayfinding.
5. Brand integration: how the brand colours and identity appear architecturally (feature wall, wayfinding, FF&E accents) without turning the office into a logo showroom.
6. GCC context: climate-appropriate material performance, majlis-inspired hospitality where it fits the brand, local code basics (egress, fire-rated cores).

Rules: specs must be 2-4 short bullet strings per category (dimensions, materials, features, inclusions) with zoning math, three physical dimensions, finish/application, real fit-out scope, and clearly labelled assumptions where no floor plan exists. Keep detailedDescription to one sentence; do not state unverified site or code compliance as fact. Ban empty adjectives such as "elegant", "luxurious" or "stunning" without the mechanism - say what creates the feeling. furnitureStyle entries must be specifiable (for example "tan leather executive task chairs, five-star base"), not vibes. Return the details in JSON structure matching the required schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            designConcept: {
              type: Type.OBJECT,
              properties: {
                conceptName: { type: Type.STRING },
                detailedDescription: { type: Type.STRING },
                specs: { type: Type.OBJECT, properties: { dimensions: { type: Type.ARRAY, items: { type: Type.STRING } }, materials: { type: Type.ARRAY, items: { type: Type.STRING } }, features: { type: Type.ARRAY, items: { type: Type.STRING } }, inclusions: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["dimensions", "materials", "features", "inclusions"] },
                materials: { type: Type.ARRAY, items: { type: Type.STRING } },
                lighting: { type: Type.STRING },
                furnitureStyle: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["conceptName", "detailedDescription", "specs", "materials", "lighting", "furnitureStyle"]
            }
          },
          required: ["designConcept"]
        }
      }
    });

    const result = JSON.parse(response.text?.trim() || '{}');
    result.image = '';

    try {
      const concept = result.designConcept;
      const imageResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: {
          parts: [
            {
              text: `Photorealistic interior design photograph of "${concept.conceptName}" - a ${formData.size || formData.spaceArea || 150} sqm ${formData.spaceType || 'Executive Office'} in a premium GCC tower (floor-to-ceiling glazing, skyline softly out of focus beyond). Style: ${formData.style || 'Modern'}. Lighting: ${concept.lighting}. Furniture language: ${(concept.furnitureStyle || []).join(', ')}. Materials render with true physical texture (stone veining, wood grain, fabric weave, brushed metal). Ceiling discipline (critical): one restrained primary ceiling treatment only - for example flat gypsum board at 2.8-3.2m height with a single recessed cove, or a clean exposed concrete soffit; building services (linear slot diffusers, sprinklers, speakers) are minimal, few, and aligned in one ordered run following real reflected-ceiling-plan logic; no random openings, no decorative voids, no oversized dark channels, no scattered vents or redundant slots; every ceiling element must have an evident mechanical or lighting function. Camera: eye-level 1.5m, 20mm lens, one-point perspective down the main axis; include 2-3 professionals for scale. Lighting: natural daylight balanced with warm 3000K interior accents, soft realistic shadows, correct interior/exterior exposure balance. Architectural accuracy: level horizons, straight verticals, plausible ceiling heights (2.8-3.2m), no warped geometry, no floating furniture, no illegible text or logos. Concept specifications: ${JSON.stringify(concept.specs || {})}. Honor supplied brand colours when present. No readable signage, fake text, logos, watermarks, distorted hands or people, floating furniture or implausible structure. Physically based stone/wood/fabric and daylight, not a glossy CGI poster.`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });

      for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData?.data) {
          result.image = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    } catch (imageErr: any) {
      console.log("Interior image generation fell back to stock:", imageErr.message);
    }

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('generate-interior-design error:', error);
    return res.status(500).json({ error: 'Failed to generate interior design concept' });
  }
}

// 8. ROI Calculator (scenario-based analysis matching the ROICalculatorPage contract)
async function calculateRoi(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const data = req.body || {};

  try {
    const r = (n: number) => Math.round(n);
    const num = (v: any, d: number) => { const n = Number(v); return isFinite(n) && n > 0 ? n : d; };

    const totalInvestment = num(data.total_investment,
      num(data.stand_cost, 75000) + num(data.staff_cost, 15000) + num(data.marketing_cost, 10000) + num(data.logistics_cost, 5000));
    const visitors = num(data.visitors_expected, 500);
    const leads = num(data.leads_expected, 150);
    const dealValue = num(data.avg_deal_value, 25000);
    const closeRate = num(data.close_rate_percent, 10);
    const salesCycle = num(data.sales_cycle_months, 3);
    const ltv = num(data.customer_ltv, 50000);
    const days = num(data.duration_days, 3);
    const eventName = String(data.event_name || 'your exhibition');
    const industry = String(data.industry || 'your sector');

    const buildScenario = (label: string, leadMul: number, closeMul: number, probability: number) => {
      const scLeads = Math.max(1, leads * leadMul);
      const scClose = Math.min(95, closeRate * closeMul);
      const deals = scLeads * (scClose / 100);
      const revenue = deals * dealValue;
      const netProfit = revenue - totalInvestment;
      const costPerLead = totalInvestment / scLeads;
      const costPerAcq = deals > 0.01 ? totalInvestment / deals : totalInvestment;
      const breakEven = Math.max(1, Math.ceil(totalInvestment / dealValue));
      const payback = breakEven <= Math.max(1, Math.round(deals)) ? salesCycle : salesCycle * 2;
      return {
        label,
        probability,
        metrics: {
          cash_roi: {
            net_profit: r(netProfit),
            roi_percentage: r((netProfit / totalInvestment) * 100),
            payback_period_months: r(payback),
            cost_per_lead: r(costPerLead),
            cost_per_acquisition: r(costPerAcq),
            break_even_deals: breakEven
          },
          pipeline_roi: {
            projected_value: r(deals * ltv),
            ltv_impact: r(deals * Math.max(0, ltv - dealValue))
          },
          brand_roi: {
            impressions: r(visitors * days * 6),
            media_value: r((visitors * days * 6 / 1000) * 120)
          },
          network_roi: {
            partnership_value: r(totalInvestment * 0.15)
          }
        }
      };
    };

    const scenarios = {
      conservative: buildScenario('Conservative', 0.7, 0.7, 25),
      realistic: buildScenario('Realistic', 1, 1, 50),
      optimistic: buildScenario('Optimistic', 1.35, 1.25, 25)
    };

    const industryAvgCpl = 450;
    const industryAvgConv = 8;
    const userCpl = scenarios.realistic.metrics.cash_roi.cost_per_lead;
    const verdict = userCpl <= industryAvgCpl
      ? `At AED ${userCpl.toLocaleString()} per lead, your ${eventName} plan beats the GCC exhibition average (AED ${industryAvgCpl}). The model is viable - execution quality will decide the outcome.`
      : `At AED ${userCpl.toLocaleString()} per lead, your ${eventName} plan sits above the GCC exhibition average (AED ${industryAvgCpl}). Tighten lead capture staffing and pre-show meeting bookings to bring cost per lead down.`;

    const strategic_advice = [
      `Pre-book meetings: exhibitors who book 40%+ of their meetings before ${eventName} routinely double effective close rates. Start outreach 6-8 weeks out.`,
      `Staff for capture, not conversation: assign one person purely to qualify and log leads; target ${Math.max(10, Math.round(leads / Math.max(1, days)))} qualified leads per day.`,
      `Follow up within 48 hours: ${industry} leads cool fast after the show. Prepare the follow-up sequence before the doors open.`,
      `Track beyond the first deal: with a customer LTV of AED ${ltv.toLocaleString()}, the pipeline value of this event likely exceeds the immediate cash ROI.`
    ];

    return res.status(200).json({
      scenarios,
      benchmarks: {
        industry_avg_cpl: industryAvgCpl,
        industry_avg_conversion: industryAvgConv,
        verdict
      },
      strategic_advice
    });
  } catch (error: any) {
    console.error('calculate-roi error:', error);
    return res.status(500).json({ error: 'Failed to calculate ROI' });
  }
}

// 9. Cost Calculator
async function calculateStandCost(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const data = req.body || {};

  try {
    const size = Number(data.size) || 36;
    const isCustom = data.type === 'custom' || data.type === 'premium';
    const baseRatePerSqm = isCustom ? 1200 : 600;
    const structureCost = size * baseRatePerSqm;
    
    let technologyCost = 0;
    if (data.features?.includes('Digital Displays') || data.features?.includes('LED Video Wall')) technologyCost += 8000;
    if (data.features?.includes('VR / AR Activation')) technologyCost += 12000;
    if (data.features?.includes('Smart Lead Tech')) technologyCost += 3000;

    let hospitalityCost = 0;
    if (data.features?.includes('Bar / Lounge Area')) hospitalityCost += 5000;
    if (data.features?.includes('Private VIP Meeting Room')) hospitalityCost += 9000;

    let projectManagementAndDesign = Math.round((structureCost + technologyCost + hospitalityCost) * 0.15);
    const totalCost = structureCost + technologyCost + hospitalityCost + projectManagementAndDesign;

    return res.status(200).json({
      estimatedCost: {
        min: Math.round(totalCost * 0.9),
        max: Math.round(totalCost * 1.15)
      },
      breakdown: [
        { category: 'Structure & Fabrication', amount: structureCost },
        { category: 'Technology & AV', amount: technologyCost },
        { category: 'Hospitality & VIP Experience', amount: hospitalityCost },
        { category: 'Design & Project Management (15%)', amount: projectManagementAndDesign }
      ],
      hiddenCosts: [
        'Venue electrical mains connection & consumption fees',
        'Rigging points & truss load fees (charged by venue)',
        'Compressed air, water & drainage hookups',
        'Waste disposal & daily cleaning fees',
        'After-hours build-up & teardown surcharges',
        'Civil defense & authority approval permits'
      ],
      total: totalCost
    });
  } catch (error: any) {
    console.error('calculate-stand-cost error:', error);
    return res.status(500).json({ error: 'Failed to calculate stand cost' });
  }
}

// 10. PDF Report/Guide Generators (Generates gorgeous self-contained HTML that renders/prints perfectly)
async function generateRoiPdf(req: VercelRequest, res: VercelResponse) {
  const { roiData, userData, inputs } = req.body || {};
  // Support the scenario-based calculator result: prefer the realistic scenario.
  const scen = roiData?.scenarios?.realistic?.metrics?.cash_roi;
  if (scen) {
    const inv = Number(inputs?.total_investment)
      || (Number(inputs?.stand_cost)||0) + (Number(inputs?.staff_cost)||0) + (Number(inputs?.marketing_cost)||0) + (Number(inputs?.logistics_cost)||0);
    roiData.metrics = {
      costPerLead: scen.cost_per_lead,
      projectedRevenue: (scen.net_profit || 0) + inv,
      roiPercent: scen.roi_percentage
    };
    roiData.analysis = (roiData?.strategic_advice || []).join('\n\n');
  }
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>FANN Exhibition ROI Strategic Report</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-50 text-slate-800 p-8 font-sans max-w-4xl mx-auto">
      <div class="bg-white p-12 border border-slate-200 shadow-xl rounded-lg">
        <div class="flex justify-between items-center border-b pb-8 mb-8">
          <div>
            <h1 class="text-3xl font-bold tracking-tight text-slate-900">FANN INTELLIGENCE HUB</h1>
            <p class="text-slate-500 uppercase tracking-widest text-xs mt-1">Exhibition ROI & Business Performance Strategy</p>
          </div>
          <div class="text-right">
            <h2 class="text-lg font-bold text-amber-600">Bespoke Strategic Report</h2>
            <p class="text-slate-500 text-sm mt-1">Prepared for ${userData?.name || 'Valued Client'}</p>
          </div>
        </div>

        <div class="mb-10">
          <h3 class="text-lg font-bold text-slate-900 border-b pb-2 mb-4">1. CAMPAIGN METRICS SUMMARY</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-slate-50 p-4 border rounded">
              <span class="text-slate-500 text-xs uppercase block">Total Investment</span>
              <strong class="text-xl text-slate-900">$${inputs?.total_investment || 'N/A'}</strong>
            </div>
            <div class="bg-slate-50 p-4 border rounded">
              <span class="text-slate-500 text-xs uppercase block">Cost Per Lead</span>
              <strong class="text-xl text-slate-900">$${roiData?.metrics?.costPerLead || 'N/A'}</strong>
            </div>
            <div class="bg-slate-50 p-4 border rounded">
              <span class="text-slate-500 text-xs uppercase block">Projected Revenue</span>
              <strong class="text-xl text-slate-900">$${roiData?.metrics?.projectedRevenue || 'N/A'}</strong>
            </div>
            <div class="bg-slate-50 p-4 border rounded bg-amber-50 border-amber-200">
              <span class="text-amber-700 text-xs uppercase block font-semibold">Projected ROI</span>
              <strong class="text-xl text-amber-900">${roiData?.metrics?.roiPercent || 'N/A'}%</strong>
            </div>
          </div>
        </div>

        <div class="mb-10">
          <h3 class="text-lg font-bold text-slate-900 border-b pb-2 mb-4">2. STRATEGIC EXECUTIVE ANALYSIS</h3>
          <div class="text-slate-700 leading-relaxed space-y-4">
            ${(roiData?.analysis || '').split('\n\n').map((para: string) => `<p>${para}</p>`).join('')}
          </div>
        </div>

        <div class="border-t pt-8 mt-12 flex justify-between items-center text-xs text-slate-400">
          <p>© 2026 FANN. Turnkey Exhibition, Event & Interior Architecture. GCC (Dubai | Riyadh)</p>
          <p>fann.ae | info@fann.ae</p>
        </div>
      </div>
    </body>
    </html>
  `;
  return res.status(200).json({ htmlContent });
}

async function generateCostPdf(req: VercelRequest, res: VercelResponse) {
  const { calculation, inputs } = req.body || {};
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>FANN Exhibition Stand Budget Estimate</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-50 text-slate-800 p-8 font-sans max-w-4xl mx-auto">
      <div class="bg-white p-12 border border-slate-200 shadow-xl rounded-lg">
        <div class="flex justify-between items-center border-b pb-8 mb-8">
          <div>
            <h1 class="text-3xl font-bold tracking-tight text-slate-900">FANN</h1>
            <p class="text-slate-500 uppercase tracking-widest text-xs mt-1">Bespoke Exhibition stand budget estimate</p>
          </div>
          <div class="text-right">
            <h2 class="text-lg font-bold text-amber-600">Turnkey Budget Proposal</h2>
            <p class="text-slate-500 text-sm mt-1">Prepared for ${inputs?.contact?.company || 'Valued Client'}</p>
          </div>
        </div>

        <div class="mb-10">
          <h3 class="text-lg font-bold text-slate-900 border-b pb-2 mb-4">1. ESTIMATE SUMMARY</h3>
          <div class="bg-slate-50 p-6 border rounded-lg flex justify-between items-center mb-6">
            <div>
              <span class="text-slate-500 text-xs uppercase block">Total Turnkey Budget</span>
              <h4 class="text-3xl font-bold text-slate-900">AED ${(calculation?.estimatedCost?.min ?? calculation?.total ?? 0).toLocaleString()} - ${(calculation?.estimatedCost?.max ?? calculation?.total ?? 0).toLocaleString()}</h4>
            </div>
            <div class="text-right">
              <span class="text-slate-500 text-xs block">Stand size: <strong>${inputs?.size || 36} sqm</strong></span>
              <span class="text-slate-500 text-xs block">Type: <strong>${inputs?.type || 'Custom'}</strong></span>
            </div>
          </div>

          <table class="w-full text-sm border">
            <thead>
              <tr class="bg-slate-100 border-b text-left">
                <th class="p-3">Category</th>
                <th class="p-3 text-right">Estimated Cost (AED)</th>
              </tr>
            </thead>
            <tbody>
              ${(Array.isArray(calculation?.breakdown) ? calculation.breakdown : []).map((item: any) => `<tr class="border-b">
                <td class="p-3 font-semibold text-slate-800">${item.category}</td>
                <td class="p-3 text-right text-slate-700">AED ${Number(item.amount || 0).toLocaleString()}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>

        <div class="mb-10 text-slate-600 text-sm leading-relaxed">
          <p class="font-semibold text-slate-800 mb-2">Notes & Inclusions:</p>
          <ul class="list-disc list-inside space-y-1">
            <li>Full architectural 3D render designs and structural drawings.</li>
            <li>Sponsorship and venue authority approvals.</li>
            <li>On-site logistics, turnkey installation, and dismantle.</li>
          </ul>
        </div>

        <div class="border-t pt-8 mt-12 flex justify-between items-center text-xs text-slate-400">
          <p>© 2026 FANN. Turnkey Exhibition, Event & Interior Architecture. GCC (Dubai | Riyadh)</p>
          <p>fann.ae | info@fann.ae</p>
        </div>
      </div>
    </body>
    </html>
  `;
  return res.status(200).json({ htmlContent });
}

async function generateGuidePdf(req: VercelRequest, res: VercelResponse) {
  const { guideData, userContext, contactInfo } = req.body || {};
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>FANN Exhibition Success Guide</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-50 text-slate-800 p-8 font-sans max-w-4xl mx-auto">
      <div class="bg-white p-12 border border-slate-200 shadow-xl rounded-lg">
        <div class="flex justify-between items-center border-b pb-8 mb-8">
          <div>
            <h1 class="text-3xl font-bold tracking-tight text-slate-900">FANN INTELLIGENCE HUB</h1>
            <p class="text-slate-500 uppercase tracking-widest text-xs mt-1">Bespoke Exhibition success & guide strategy</p>
          </div>
          <div class="text-right">
            <h2 class="text-lg font-bold text-amber-600">Personalized Playbook</h2>
            <p class="text-slate-500 text-sm mt-1">Prepared for ${contactInfo?.company || 'Valued Exhibitor'}</p>
          </div>
        </div>

        <div class="mb-10 text-slate-700 leading-relaxed space-y-4">
          <h3 class="text-lg font-bold text-slate-900 border-b pb-2 mb-4 uppercase">Exhibition Strategy Playbook for ${userContext?.industry || 'GCC Exhibits'}</h3>
          ${(guideData || '').split('\n\n').map((para: string) => `<p>${para}</p>`).join('')}
        </div>

        <div class="border-t pt-8 mt-12 flex justify-between items-center text-xs text-slate-400">
          <p>© 2026 FANN. Turnkey Exhibition, Event & Interior Architecture. GCC (Dubai | Riyadh)</p>
          <p>fann.ae | info@fann.ae</p>
        </div>
      </div>
    </body>
    </html>
  `;
  return res.status(200).json({ htmlContent });
}

// 11. Custom template generator (Markdown based)
async function generateTemplate(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const { templateType, industry } = req.body || {};

  try {
    const prompt = `Generate a highly professional, highly persuasive ${templateType || 'sales follow-up email'} template customized for the "${industry || 'general'}" sector in the GCC. The template should be beautifully structured, using placeholders like [Your Name], [Company], and [Prospect Name]. Ensure it highlights the value of premium turnkey design and exhibition stand space optimization. Return only the template formatted in clean Markdown.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    return res.status(200).json({ content: response.text || '' });
  } catch (error: any) {
    console.error('generate-template error:', error);
    return res.status(500).json({ error: 'Failed to generate template' });
  }
}

// 12. Complete Exhibition Guide Strategy Planner
async function generateExhibitionGuide(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const { industry, eventName, targetAudience, budgetBracket } = req.body || {};

  try {
    const prompt = `Act as an elite GCC trade show exhibition director and design consultant. Draft a bespoke 5-step Exhibition Guide & Playbook for a company preparing for "${eventName || 'a GCC Trade Show'}" in the "${industry || 'General'}" sector.
Target Audience: ${targetAudience || 'Corporate Decision Makers'}.
Budget Bracket: ${budgetBracket || 'Medium to Premium'}.

Write a highly tactical guide covering space planning, design styles, visitor engagement technology, staff preparation, and post-show conversion. Structure it with elegant headers. Use professional tone and markdown styling.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    return res.status(200).json({ content: response.text || '' });
  } catch (error: any) {
    console.error('generate-exhibition-guide error:', error);
    return res.status(500).json({ error: 'Failed to generate exhibition guide' });
  }
}

// 13. Form submissions (Inquiry, contact, leads) - real delivery to sales@fann.ae
const LEAD_TO = process.env.LEAD_TO_EMAIL || 'sales@fann.ae';
const rateBucket = new Map<string, number[]>();

function clean(v: unknown, max = 2000): string {
  if (v === undefined || v === null) return '';
  return String(v).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (rateBucket.get(ip) || []).filter(t => now - t < 10 * 60 * 1000);
  hits.push(now);
  rateBucket.set(ip, hits);
  return hits.length > 8;
}

async function deliverLead(subject: string, text: string, replyTo?: string): Promise<void> {
  const web3Key = process.env.WEB3FORMS_ACCESS_KEY;
  if (web3Key) {
    const r = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: web3Key, subject, from_name: 'FANN Website', replyto: replyTo, message: text }),
    });
    const d: any = await r.json().catch(() => ({}));
    if (!r.ok || d.success === false) throw new Error(`Web3Forms failed: ${r.status} ${d.message || ''}`);
    return;
  }
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const nodemailer = (await import('nodemailer')).default;
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transport.sendMail({ from: `FANN Website <${process.env.SMTP_USER}>`, to: LEAD_TO, replyTo, subject, text });
    return;
  }
  throw new Error('No lead delivery method configured (set WEB3FORMS_ACCESS_KEY or SMTP_* env vars)');
}

async function handleLead(req: VercelRequest, res: VercelResponse, defaultType: string) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  const b: any = req.body || {};
  if (clean(b.website)) return res.status(200).json({ success: true }); // honeypot: silently drop bots

  const ip = clean((req.headers['x-forwarded-for'] as string) || '', 100).split(',')[0] || 'unknown';
  if (isRateLimited(ip)) return res.status(429).json({ success: false, error: 'Too many submissions. Please try again in a few minutes or WhatsApp us.' });

  const formType = clean(b.formType || b.type || defaultType, 80);
  const name = clean(b.name || [b.firstName, b.lastName].filter(Boolean).join(' '), 120);
  const email = clean(b.email, 160);
  const phone = clean(b.phone, 40);
  const company = clean(b.company, 160);
  const message = clean(b.message || b.details_text || '', 5000);

  const emailOk = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
  if (!email && !phone) return res.status(400).json({ success: false, error: 'Please add an email or phone number so we can reach you.' });

  const skip = new Set(['formType','type','name','firstName','lastName','email','phone','company','message','website','details','page','referrer']);
  const extra: Record<string, unknown> = { ...(typeof b.details === 'object' && b.details ? b.details : {}) };
  for (const k of Object.keys(b)) if (!skip.has(k)) extra[k] = b[k];
  const extraLines = Object.entries(extra)
    .filter(([, v]) => v !== '' && v !== null && v !== undefined)
    .map(([k, v]) => `${k}: ${clean(typeof v === 'object' ? JSON.stringify(v) : v, 1000)}`);

  const text = [
    `New ${formType} from fann.ae`,
    '',
    `Name: ${name || '-'}`,
    `Email: ${email || '-'}`,
    `Phone: ${phone || '-'}`,
    `Company: ${company || '-'}`,
    '',
    message ? `Message:\n${message}\n` : '',
    extraLines.length ? `Details:\n${extraLines.join('\n')}\n` : '',
    `Page: ${clean(b.page, 300) || '-'}`,
    `Referrer: ${clean(b.referrer, 300) || '-'}`,
    `Submitted: ${new Date().toISOString()}`,
  ].join('\n');

  try {
    await deliverLead(`[fann.ae] ${formType}${name ? ' - ' + name : ''}${company ? ' (' + company + ')' : ''}`, text, email || undefined);
    console.log(`Lead delivered: ${formType}`);
    return res.status(200).json({ success: true, message: 'Thank you - we received your request.' });
  } catch (err: any) {
    console.error('Lead delivery failed:', err?.message, '\n', text);
    return res.status(502).json({ success: false, error: 'Sorry, your message could not be sent right now. Please WhatsApp us on +971 50 566 7502 or email sales@fann.ae.' });
  }
}

// SEO files
const SITE = 'https://fann.ae';
const SITEMAP_PATHS = [
  '/', '/services', '/services/custom-exhibition-stands-dubai', '/services/exhibition-stand-fabrication-dubai',
  '/services/interior-fitout-exhibition-spaces-dubai', '/services/modular-exhibition-systems-dubai',
  '/services/turnkey-exhibition-services-uae', '/portfolio', '/about', '/contact', '/privacy-policy',
  '/insights', '/events-calendar', '/fann-studio', '/book-consultation', '/resources/cost-calculator',
  '/resources/exhibition-guide', '/roi-calculator',
  '/portfolio/icons-of-porsche-2025-dubai', '/portfolio/special-olympics-uae-unified-champion-schools-2025', '/portfolio/national-expression-adek-abu-dhabi', '/fit-out-dubai', '/restaurant-fit-out-dubai', '/clinic-fit-out-dubai',
];
function robotsTxt(res: VercelResponse) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  return res.status(200).send(`User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /fann-studio/*/result\n\nSitemap: ${SITE}/sitemap.xml\n`);
}
function sitemapXml(res: VercelResponse) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = SITEMAP_PATHS.map(p => `  <url><loc>${SITE}${p === '/' ? '/' : p}</loc><lastmod>${today}</lastmod><priority>${p === '/' ? '1.0' : p.split('/').length > 2 ? '0.7' : '0.8'}</priority></url>`).join('\n');
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
}
function llmsTxt(res: VercelResponse) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  return res.status(200).send(`# FANN\n> Dubai design-and-build company: exhibition stands (Dubai & Abu Dhabi), event setup (Dubai, Abu Dhabi, Al Ain), interior fit-out and renovation (Dubai & Abu Dhabi), and marble supply.\n\nContact: sales@fann.ae, +971 50 566 7502\nOffice: Office No. 508, Dusseldorf Business Center, Al Barsha, Dubai\nWarehouse: Warehouse No. 10, Um Dera, Umm Al Quwain\n\n${SITEMAP_PATHS.map(p => `- ${SITE}${p}`).join('\n')}\n`);
}

// 14. Video generation handler (mocked with premium high-quality stock loop or dynamic status)
async function generateVideo(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({ 
    success: true, 
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-scifi-city-concept-with-neon-lights-42211-large.mp4',
    message: 'Your high-fidelity 3D walkthrough event/exhibition video was successfully generated.' 
  });
}

// Main handler with router logic
export default async function mainHandler(req: VercelRequest, res: VercelResponse) {
  try {
    const parsedUrl = url.parse(req.url || '', true);
    const pathname = parsedUrl.pathname || '';
    
    // Extract route name, checking query parameter first (for rewritten assets)
    let routeName = parsedUrl.query.route as string;
    if (!routeName) {
      routeName = pathname.replace(/^\/api\//, '').replace(/\/$/, '');
    }

    console.log(`Routing request for API path: /api/${routeName}`);

    switch (routeName) {
      case 'detect-industry':
        return await detectIndustry(req, res);
      case 'extract-colors':
        return await extractColors(req, res);
      case 'chat':
        return await chat(req, res);
      case 'generate-insights':
        return await generateInsights(req, res);
      case 'generate-exhibition-design':
        return await generateExhibitionDesign(req, res);
      case 'generate-event-design':
        return await generateEventDesign(req, res);
      case 'generate-interior-design':
        return await generateInteriorDesign(req, res);
      case 'calculate-roi':
        return await calculateRoi(req, res);
      case 'calculate-stand-cost':
        return await calculateStandCost(req, res);
      case 'generate-roi-pdf':
        return await generateRoiPdf(req, res);
      case 'generate-cost-pdf':
        return await generateCostPdf(req, res);
      case 'generate-guide-pdf':
        return await generateGuidePdf(req, res);
      case 'generate-template':
        return await generateTemplate(req, res);
      case 'generate-exhibition-guide':
        return await generateExhibitionGuide(req, res);
      case 'lead':
        return await handleLead(req, res, 'Website enquiry');
      case 'send-inquiry':
        return await handleLead(req, res, 'Studio enquiry');
      case 'send-contact-form':
        return await handleLead(req, res, 'Contact form');
      case 'submit-lead':
        return await handleLead(req, res, 'Resource download');
      case 'robots':
        return robotsTxt(res);
      case 'sitemap':
        return sitemapXml(res);
      case 'llms':
        return llmsTxt(res);
      case 'generate-video':
        return await generateVideo(req, res);
      default:
        // Return 404 for unknown endpoints
        return res.status(404).json({ error: `API route /api/${routeName} not found` });
    }
  } catch (error: any) {
    console.error('Unified API router error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
      }
