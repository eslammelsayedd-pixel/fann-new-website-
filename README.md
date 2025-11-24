
# FANN WhatsApp Conversion System

This module implements a high-conversion WhatsApp integration designed for mobile-first B2B users.

## Components

### 1. Floating WhatsApp Button (`components/WhatsAppButton.tsx`)
- **Positioning**: Bottom-right (Desktop), Bottom-center (Mobile).
- **Behavior**: Stays fixed on scroll.
- **A/B Testing**: Automatically splits traffic 50/50 between "Icon Only" and "Icon + Text" variants. Persists selection via localStorage.
- **Context-Aware**: Pre-fills message based on the page (Homepage, Portfolio, Services, etc.).

### 2. Exit Intent Popup (`components/ExitIntentPopup.tsx`)
- **Triggers**: 
  - Mouse leaving top of window (Desktop).
  - Scrolling past 50% (Mobile/General).
  - 30 seconds time on page.
- **Offer**: 5% Discount + Free 3D Design.
- **Frequency**: Shows once per session (controlled by `exit_popup_shown` in localStorage).

### 3. Configuration (`whatsappConfig.ts`)
- Edit `MESSAGES` object to change pre-filled text.
- Edit `WHATSAPP_PHONE` to update destination number.

### 4. Analytics (`whatsappTracking.ts`)
- Pushes `whatsapp_click` event to Google Tag Manager (dataLayer).
- Tracks: Page Type, Variant (A/B), Scroll Depth, Time on Page.

## A/B Testing
The A/B test runs automatically. To check which variant is active for a user, check `localStorage.getItem('fann_ab_wa_button_v1')`.

## Deployment
1. Ensure GTM container is published to receive the `whatsapp_click` event.
2. Verify `WHATSAPP_PHONE` is correct format (no plus sign, country code included).
