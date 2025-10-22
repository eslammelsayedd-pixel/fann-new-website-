import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Upload, ArrowLeft, Building, Scaling, ListChecks, User, CheckCircle, AlertCircle, Palette, View, FileText, Mail, Phone } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import { regionalEvents } from '../constants';
import { useApiKey } from '../context/ApiKeyProvider';
// To resolve errors related to the custom `<model-viewer>` element, its type definition must be loaded.
// The global JSX augmentations are defined in `../types.ts`, and importing it here makes them available to this file.
import {} from '../types';


// --- Data & Constants ---
const countryCodes = [
    { "name": "United Arab Emirates", "dial_code": "+971", "code": "AE" }, { "name": "Saudi Arabia", "dial_code": "+966", "code": "SA" }, { "name": "Qatar", "dial_code": "+974", "code": "QA" }, { "name": "Oman", "dial_code": "+968", "code": "OM" }, { "name": "Kuwait", "dial_code": "+965", "code": "KW" }, { "name": "Bahrain", "dial_code": "+973", "code": "BH" }, { "name": "Egypt", "dial_code": "+20", "code": "EG" }, { "name": "Jordan", "dial_code": "+962", "code": "JO" }, { "name": "Lebanon", "dial_code": "+961", "code": "LB" }, { "name": "United States", "dial_code": "+1", "code": "US" }, { "name": "United Kingdom", "dial_code": "+44", "code": "GB" }, { "name": "India", "dial_code": "+91", "code": "IN" }, { "name": "Pakistan", "dial_code": "+92", "code": "PK" }, { "name": "Afghanistan", "dial_code": "+93", "code": "AF" }, { "name": "Albania", "dial_code": "+355", "code": "AL" }, { "name": "Algeria", "dial_code": "+213", "code": "DZ" }, { "name": "American Samoa", "dial_code": "+1684", "code": "AS" }, { "name": "Andorra", "dial_code": "+376", "code": "AD" }, { "name": "Angola", "dial_code": "+244", "code": "AO" }, { "name": "Anguilla", "dial_code": "+1264", "code": "AI" }, { "name": "Antarctica", "dial_code": "+672", "code": "AQ" }, { "name": "Antigua and Barbuda", "dial_code": "+1268", "code": "AG" }, { "name": "Argentina", "dial_code": "+54", "code": "AR" }, { "name": "Armenia", "dial_code": "+374", "code": "AM" }, { "name": "Aruba", "dial_code": "+297", "code": "AW" }, { "name": "Australia", "dial_code": "+61", "code": "AU" }, { "name": "Austria", "dial_code": "+43", "code": "AT" }, { "name": "Azerbaijan", "dial_code": "+994", "code": "AZ" }, { "name": "Bahamas", "dial_code": "+1242", "code": "BS" }, { "name": "Bangladesh", "dial_code": "+880", "code": "BD" }, { "name": "Barbados", "dial_code": "+1246", "code": "BB" }, { "name": "Belarus", "dial_code": "+375", "code": "BY" }, { "name": "Belgium", "dial_code": "+32", "code": "BE" }, { "name": "Belize", "dial_code": "+501", "code": "BZ" }, { "name": "Benin", "dial_code": "+229", "code": "BJ" }, { "name": "Bermuda", "dial_code": "+1441", "code": "BM" }, { "name": "Bhutan", "dial_code": "+975", "code": "BT" }, { "name": "Bolivia, Plurinational State of", "dial_code": "+591", "code": "BO" }, { "name": "Bosnia and Herzegovina", "dial_code": "+387", "code": "BA" }, { "name": "Botswana", "dial_code": "+267", "code": "BW" }, { "name": "Brazil", "dial_code": "+55", "code": "BR" }, { "name": "British Indian Ocean Territory", "dial_code": "+246", "code": "IO" }, { "name": "Brunei Darussalam", "dial_code": "+673", "code": "BN" }, { "name": "Bulgaria", "dial_code": "+359", "code": "BG" }, { "name": "Burkina Faso", "dial_code": "+226", "code": "BF" }, { "name": "Burundi", "dial_code": "+257", "code": "BI" }, { "name": "Cambodia", "dial_code": "+855", "code": "KH" }, { "name": "Cameroon", "dial_code": "+237", "code": "CM" }, { "name": "Canada", "dial_code": "+1", "code": "CA" }, { "name": "Cape Verde", "dial_code": "+238", "code": "CV" }, { "name": "Cayman Islands", "dial_code": "+345", "code": "KY" }, { "name": "Central African Republic", "dial_code": "+236", "code": "CF" }, { "name": "Chad", "dial_code": "+235", "code": "TD" }, { "name": "Chile", "dial_code": "+56", "code": "CL" }, { "name": "China", "dial_code": "+86", "code": "CN" }, { "name": "Christmas Island", "dial_code": "+61", "code": "CX" }, { "name": "Cocos (Keeling) Islands", "dial_code": "+61", "code": "CC" }, { "name": "Colombia", "dial_code": "+57", "code": "CO" }, { "name": "Comoros", "dial_code": "+269", "code": "KM" }, { "name": "Congo", "dial_code": "+242", "code": "CG" }, { "name": "Congo, The Democratic Republic of the", "dial_code": "+243", "code": "CD" }, { "name": "Cook Islands", "dial_code": "+682", "code": "CK" }, { "name": "Costa Rica", "dial_code": "+506", "code": "CR" }, { "name": "Cote d'Ivoire", "dial_code": "+225", "code": "CI" }, { "name": "Croatia", "dial_code": "+385", "code": "HR" }, { "name": "Cuba", "dial_code": "+53", "code": "CU" }, { "name": "Cyprus", "dial_code": "+357", "code": "CY" }, { "name": "Czech Republic", "dial_code": "+420", "code": "CZ" }, { "name": "Denmark", "dial_code": "+45", "code": "DK" }, { "name": "Djibouti", "dial_code": "+253", "code": "DJ" }, { "name": "Dominica", "dial_code": "+1767", "code": "DM" }, { "name": "Dominican Republic", "dial_code": "+1849", "code": "DO" }, { "name": "Ecuador", "dial_code": "+593", "code": "EC" }, { "name": "El Salvador", "dial_code": "+503", "code": "SV" }, { "name": "Equatorial Guinea", "dial_code": "+240", "code": "GQ" }, { "name": "Eritrea", "dial_code": "+291", "code": "ER" }, { "name": "Estonia", "dial_code": "+372", "code": "EE" }, { "name": "Ethiopia", "dial_code": "+251", "code": "ET" }, { "name": "Falkland Islands (Malvinas)", "dial_code": "+500", "code": "FK" }, { "name": "Faroe Islands", "dial_code": "+298", "code": "FO" }, { "name": "Fiji", "dial_code": "+679", "code": "FJ" }, { "name": "Finland", "dial_code": "+358", "code": "FI" }, { "name": "France", "dial_code": "+33", "code": "FR" }, { "name": "French Guiana", "dial_code": "+594", "code": "GF" }, { "name": "French Polynesia", "dial_code": "+689", "code": "PF" }, { "name": "Gabon", "dial_code": "+241", "code": "GA" }, { "name": "Gambia", "dial_code": "+220", "code": "GM" }, { "name": "Georgia", "dial_code": "+995", "code": "GE" }, { "name": "Germany", "dial_code": "+49", "code": "DE" }, { "name": "Ghana", "dial_code": "+233", "code": "GH" }, { "name": "Gibraltar", "dial_code": "+350", "code": "GI" }, { "name": "Greece", "dial_code": "+30", "code": "GR" }, { "name": "Greenland", "dial_code": "+299", "code": "GL" }, { "name": "Grenada", "dial_code": "+1473", "code": "GD" }, { "name": "Guadeloupe", "dial_code": "+590", "code": "GP" }, { "name": "Guam", "dial_code": "+1671", "code": "GU" }, { "name": "Guatemala", "dial_code": "+502", "code": "GT" }, { "name": "Guernsey", "dial_code": "+44", "code": "GG" }, { "name": "Guinea", "dial_code": "+224", "code": "GN" }, { "name": "Guinea-Bissau", "dial_code": "+245", "code": "GW" }, { "name": "Guyana", "dial_code": "+592", "code": "GY" }, { "name": "Haiti", "dial_code": "+509", "code": "HT" }, { "name": "Holy See (Vatican City State)", "dial_code": "+379", "code": "VA" }, { "name": "Honduras", "dial_code": "+504", "code": "HN" }, { "name": "Hong Kong", "dial_code": "+852", "code": "HK" }, { "name": "Hungary", "dial_code": "+36", "code": "HU" }, { "name": "Iceland", "dial_code": "+354", "code": "IS" }, { "name": "Indonesia", "dial_code": "+62", "code": "ID" }, { "name": "Iran, Islamic Republic of", "dial_code": "+98", "code": "IR" }, { "name": "Iraq", "dial_code": "+964", "code": "IQ" }, { "name": "Ireland", "dial_code": "+353", "code": "IE" }, { "name": "Isle of Man", "dial_code": "+44", "code": "IM" }, { "name": "Israel", "dial_code": "+972", "code": "IL" }, { "name": "Italy", "dial_code": "+39", "code": "IT" }, { "name": "Jamaica", "dial_code": "+1876", "code": "JM" }, { "name": "Japan", "dial_code": "+81", "code": "JP" }, { "name": "Jersey", "dial_code": "+44", "code": "JE" }, { "name": "Kazakhstan", "dial_code": "+7", "code": "KZ" }, { "name": "Kenya", "dial_code": "+254", "code": "KE" }, { "name": "Kiribati", "dial_code": "+686", "code": "KI" }, { "name": "Korea, Republic of", "dial_code": "+82", "code": "KR" }, { "name": "Kosovo", "dial_code": "+383", "code": "XK" }, { "name": "Kyrgyzstan", "dial_code": "+996", "code": "KG" }, { "name": "Lao People's Democratic Republic", "dial_code": "+856", "code": "LA" }, { "name": "Latvia", "dial_code": "+371", "code": "LV" }, { "name": "Lesotho", "dial_code": "+266", "code": "LS" }, { "name": "Liberia", "dial_code": "+231", "code": "LR" }, { "name": "Libyan Arab Jamahiriya", "dial_code": "+218", "code": "LY" }, { "name": "Liechtenstein", "dial_code": "+423", "code": "LI" }, { "name": "Lithuania", "dial_code": "+370", "code": "LT" }, { "name": "Luxembourg", "dial_code": "+352", "code": "LU" }, { "name": "Macao", "dial_code": "+853", "code": "MO" }, { "name": "Macedonia, The Former Yugoslav Republic of", "dial_code": "+389", "code": "MK" }, { "name": "Madagascar", "dial_code": "+261", "code": "MG" }, { "name": "Malawi", "dial_code": "+265", "code": "MW" }, { "name": "Malaysia", "dial_code": "+60", "code": "MY" }, { "name": "Maldives", "dial_code": "+960", "code": "MV" }, { "name": "Mali", "dial_code": "+223", "code": "ML" }, { "name": "Malta", "dial_code": "+356", "code": "MT" }, { "name": "Marshall Islands", "dial_code": "+692", "code": "MH" }, { "name": "Martinique", "dial_code": "+596", "code": "MQ" }, { "name": "Mauritania", "dial_code": "+222", "code": "MR" }, { "name": "Mauritius", "dial_code": "+230", "code": "MU" }, { "name": "Mayotte", "dial_code": "+262", "code": "YT" }, { "name": "Mexico", "dial_code": "+52", "code": "MX" }, { "name": "Micronesia, Federated States of", "dial_code": "+691", "code": "FM" }, { "name": "Moldova, Republic of", "dial_code": "+373", "code": "MD" }, { "name": "Monaco", "dial_code": "+377", "code": "MC" }, { "name": "Mongolia", "dial_code": "+976", "code": "MN" }, { "name": "Montenegro", "dial_code": "+382", "code": "ME" }, { "name": "Montserrat", "dial_code": "+1664", "code": "MS" }, { "name": "Morocco", "dial_code": "+212", "code": "MA" }, { "name": "Mozambique", "dial_code": "+258", "code": "MZ" }, { "name": "Myanmar", "dial_code": "+95", "code": "MM" }, { "name": "Namibia", "dial_code": "+264", "code": "NA" }, { "name": "Nauru", "dial_code": "+674", "code": "NR" }, { "name": "Nepal", "dial_code": "+977", "code": "NP" }, { "name": "Netherlands", "dial_code": "+31", "code": "NL" }, { "name": "New Caledonia", "dial_code": "+687", "code": "NC" }, { "name": "New Zealand", "dial_code": "+64", "code": "NZ" }, { "name": "Nicaragua", "dial_code": "+505", "code": "NI" }, { "name": "Niger", "dial_code": "+227", "code": "NE" }, { "name": "Nigeria", "dial_code": "+234", "code": "NG" }, { "name": "Niue", "dial_code": "+683", "code": "NU" }, { "name": "Norfolk Island", "dial_code": "+672", "code": "NF" }, { "name": "Northern Mariana Islands", "dial_code": "+1670", "code": "MP" }, { "name": "Norway", "dial_code": "+47", "code": "NO" }, { "name": "Palau", "dial_code": "+680", "code": "PW" }, { "name": "Palestinian Territory, Occupied", "dial_code": "+970", "code": "PS" }, { "name": "Panama", "dial_code": "+507", "code": "PA" }, { "name": "Papua New Guinea", "dial_code": "+675", "code": "PG" }, { "name": "Paraguay", "dial_code": "+595", "code": "PY" }, { "name": "Peru", "dial_code": "+51", "code": "PE" }, { "name": "Philippines", "dial_code": "+63", "code": "PH" }, { "name": "Pitcairn", "dial_code": "+872", "code": "PN" }, { "name": "Poland", "dial_code": "+48", "code": "PL" }, { "name": "Portugal", "dial_code": "+351", "code": "PT" }, { "name": "Puerto Rico", "dial_code": "+1939", "code": "PR" }, { "name": "Réunion", "dial_code": "+262", "code": "RE" }, { "name": "Romania", "dial_code": "+40", "code": "RO" }, { "name": "Russia", "dial_code": "+7", "code": "RU" }, { "name": "Rwanda", "dial_code": "+250", "code": "RW" }, { "name": "Saint Barthélemy", "dial_code": "+590", "code": "BL" }, { "name": "Saint Helena, Ascension and Tristan da Cunha", "dial_code": "+290", "code": "SH" }, { "name": "Saint Kitts and Nevis", "dial_code": "+1869", "code": "KN" }, { "name": "Saint Lucia", "dial_code": "+1758", "code": "LC" }, { "name": "Saint Martin", "dial_code": "+590", "code": "MF" }, { "name": "Saint Pierre and Miquelon", "dial_code": "+508", "code": "PM" }, { "name": "Saint Vincent and the Grenadines", "dial_code": "+1784", "code": "VC" }, { "name": "Samoa", "dial_code": "+685", "code": "WS" }, { "name": "San Marino", "dial_code": "+378", "code": "SM" }, { "name": "Sao Tome and Principe", "dial_code": "+239", "code": "ST" }, { "name": "Senegal", "dial_code": "+221", "code": "SN" }, { "name": "Serbia", "dial_code": "+381", "code": "RS" }, { "name": "Seychelles", "dial_code": "+248", "code": "SC" }, { "name": "Sierra Leone", "dial_code": "+232", "code": "SL" }, { "name": "Singapore", "dial_code": "+65", "code": "SG" }, { "name": "Slovakia", "dial_code": "+421", "code": "SK" }, { "name": "Slovenia", "dial_code": "+386", "code": "SI" }, { "name": "Solomon Islands", "dial_code": "+677", "code": "SB" }, { "name": "Somalia", "dial_code": "+252", "code": "SO" }, { "name": "South Africa", "dial_code": "+27", "code": "ZA" }, { "name": "Spain", "dial_code": "+34", "code": "ES" }, { "name": "Sri Lanka", "dial_code": "+94", "code": "LK" }, { "name": "Sudan", "dial_code": "+249", "code": "SD" }, { "name": "Suriname", "dial_code": "+597", "code": "SR" }, { "name": "Svalbard and Jan Mayen", "dial_code": "+47", "code": "SJ" }, { "name": "Swaziland", "dial_code": "+268", "code": "SZ" }, { "name": "Sweden", "dial_code": "+46", "code": "SE" }, { "name": "Switzerland", "dial_code": "+41", "code": "CH" }, { "name": "Syrian Arab Republic", "dial_code": "+963", "code": "SY" }, { "name": "Taiwan, Province of China", "dial_code": "+886", "code": "TW" }, { "name": "Tajikistan", "dial_code": "+992", "code": "TJ" }, { "name": "Tanzania, United Republic of", "dial_code": "+255", "code": "TZ" }, { "name": "Thailand", "dial_code": "+66", "code": "TH" }, { "name": "Timor-Leste", "dial_code": "+670", "code": "TL" }, { "name": "Togo", "dial_code": "+228", "code": "TG" }, { "name": "Tokelau", "dial_code": "+690", "code": "TK" }, { "name": "Tonga", "dial_code": "+676", "code": "TO" }, { "name": "Trinidad and Tobago", "dial_code": "+1868", "code": "TT" }, { "name": "Tunisia", "dial_code": "+216", "code": "TN" }, { "name": "Turkey", "dial_code": "+90", "code": "TR" }, { "name": "Turkmenistan", "dial_code": "+993", "code": "TM" }, { "name": "Turks and Caicos Islands", "dial_code": "+1649", "code": "TC" }, { "name": "Tuvalu", "dial_code": "+688", "code": "TV" }, { "name": "Uganda", "dial_code": "+256", "code": "UG" }, { "name": "Ukraine", "dial_code": "+380", "code": "UA" }, { "name": "Uruguay", "dial_code": "+598", "code": "UY" }, { "name": "Uzbekistan", "dial_code": "+998", "code": "UZ" }, { "name": "Vanuatu", "dial_code": "+678", "code": "VU" }, { "name": "Venezuela, Bolivarian Republic of", "dial_code": "+58", "code": "VE" }, { "name": "Viet Nam", "dial_code": "+84", "code": "VN" }, { "name": "Virgin Islands, British", "dial_code": "+1284", "code": "VG" }, { "name": "Virgin Islands, U.S.", "dial_code": "+1340", "code": "VI" }, { "name": "Wallis and Futuna", "dial_code": "+681", "code": "WF" }, { "name": "Yemen", "dial_code": "+967", "code": "YE" }, { "name": "Zambia", "dial_code": "+260", "code": "ZM" }, { "name": "Zimbabwe", "dial_code": "+263", "code": "ZW" }
];


// --- Helper Functions & Types ---
interface FormData {
    standWidth: number;
    standLength: number;
    industry: string;
    standLayout: string;
    standType: string;
    standHeight: string;
    doubleDecker: boolean;
    hangingStructure: boolean;
    eventName: string;
    style: string;
    eventStyleDescription: string;
    functionality: string[];
    hostess: boolean;
    logo: File | null;
    logoPreview: string;
    brandColors: string[];
    userFirstName: string;
    userLastName: string;
    userEmail: string;
    userMobileCountryCode: string;
    userMobileNumber: string;
}

interface GeneratedConcept {
    imageUrl: string;
    title: string;
    description: string;
}

const initialFormData: FormData = {
    standWidth: 10,
    standLength: 6,
    industry: '',
    standLayout: '',
    standType: '',
    standHeight: '',
    doubleDecker: false,
    hangingStructure: false,
    eventName: '',
    style: '',
    eventStyleDescription: '',
    functionality: [],
    hostess: false,
    logo: null,
    logoPreview: '',
    brandColors: [],
    userFirstName: '',
    userLastName: '',
    userEmail: '',
    userMobileCountryCode: '+971',
    userMobileNumber: '',
};

const styles = [
    { name: 'Luxury', image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&q=80' },
    { name: 'Minimalist', image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=800&q=80' },
    { name: 'Futuristic', image: 'https://images.unsplash.com/photo-1678393972445-5026e018505e?w=800&q=80' },
    { name: 'Biophilic', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&q=80' },
    { name: 'Industrial', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80' },
    { name: 'Playful', image: 'https://images.unsplash.com/photo-1551232864-3fefa8901183?w=800&q=80' },
];

const functionalityGroups = {
    "Reception & Hospitality": ['Reception Desk', 'Hospitality Bar', 'Lounge Area', 'Charging Stations'],
    "Display & Demonstration": ['Product Displays', 'Interactive Demo Stations', 'VR/AR Demo Zone'],
    "Media & Presentation": ['LED Video Wall', 'Live Presentation Stage'],
    "Meeting & Operations": ['Private Meeting Room', 'Storage Room'],
    "Structural Elements": ['Raised Flooring'],
};

const layoutOptions = [
    { name: 'Linear (1 side open / in-line)', visual: <div className="w-16 h-12 bg-fann-charcoal relative border-t-2 border-l-2 border-r-2 border-fann-light-gray"><div className="absolute inset-x-0 -bottom-px h-1 bg-fann-gold"></div></div>, description: 'One side open to the aisle.' },
    { name: 'Corner (2 sides open)', visual: <div className="w-16 h-12 bg-fann-charcoal relative border-t-2 border-l-2 border-fann-light-gray"><div className="absolute inset-x-0 -bottom-px h-1 bg-fann-gold"></div><div className="absolute inset-y-0 -right-px w-1 bg-fann-gold"></div></div>, description: 'Two open sides, on a corner.' },
    { name: 'Peninsula (3 sides open)', visual: <div className="w-16 h-12 bg-fann-charcoal relative border-t-2 border-fann-light-gray"><div className="absolute inset-x-0 -bottom-px h-1 bg-fann-gold"></div><div className="absolute inset-y-0 -right-px w-1 bg-fann-gold"></div><div className="absolute inset-y-0 -left-px w-1 bg-fann-gold"></div></div>, description: 'Three open sides into an aisle.' },
    { name: 'Island (4 sides open / standalone)', visual: <div className="w-16 h-12 bg-fann-charcoal relative border-2 border-fann-gold"></div>, description: 'Fully standalone with four open sides.' },
];

const steps = [
    { name: 'Brief', icon: Building },
    { name: 'Structure', icon: Scaling },
    { name: 'Functionality', icon: ListChecks },
    { name: 'Aesthetics', icon: Palette },
    { name: 'Review & Contact', icon: User },
];

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error('Failed to convert blob to base64 string'));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const getLayoutDescription = (layout: string): string => {
    switch (layout) {
        case 'Linear (1 side open / in-line)':
            return 'An in-line booth, typically positioned in a row with other stands. It has solid walls on three sides (back, left, and right) and is only open to the aisle from the front.';
        case 'Corner (2 sides open)':
            return 'A corner booth, located at the end of a row. It has two solid walls (back and one side) and is open to aisles on two intersecting sides (front and one side), offering more visibility.';
        case 'Peninsula (3 sides open)':
            return 'A peninsula booth, which juts out into an aisle. It is open to aisles on three sides (front, left, and right) and has one solid back wall connecting it to a row of other stands.';
        case 'Island (4 sides open / standalone)':
            return 'An island booth, a completely standalone structure open to aisles on all four sides. It offers the highest visibility and has no connecting walls to other stands.';
        default:
            return `A standard ${layout} layout.`;
    }
};

const ExhibitionStudioPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedConcepts, setGeneratedConcepts] = useState<GeneratedConcept[]>([]);
    const [isFinished, setIsFinished] = useState(false);
    const [isExtractingColors, setIsExtractingColors] = useState(false);
    const [suggestedColors, setSuggestedColors] = useState<string[]>([]);
    const [selectedConcept, setSelectedConcept] = useState<number | null>(null);
    const [isProposalRequested, setIsProposalRequested] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isCustomEvent, setIsCustomEvent] = useState(false);
    const [isAnalyzingStyle, setIsAnalyzingStyle] = useState(false);
    const [isModelViewerOpen, setIsModelViewerOpen] = useState(false);
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});

    const { ensureApiKey, handleApiError, error: apiKeyError, clearError: clearApiKeyError } = useApiKey();
    const [localError, setLocalError] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const setError = (message: string | null) => {
        clearApiKeyError();
        setLocalError(message);
    };

    const clearAllErrors = () => {
        setLocalError(null);
        clearApiKeyError();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        setFormErrors(prev => ({...prev, [name]: undefined })); // Clear error on change

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    
    const handleFunctionalityChange = (item: string) => {
        setFormData(prev => {
            const newFunctionality = prev.functionality.includes(item)
                ? prev.functionality.filter(i => i !== item)
                : [...prev.functionality, item];
            return { ...prev, functionality: newFunctionality };
        });
    };
    
    const extractColorsFromLogo = async (file: File) => {
        clearAllErrors();
        if (!await ensureApiKey()) return;

        setIsExtractingColors(true);
        setSuggestedColors([]);
        setFormData(prev => ({ ...prev, brandColors: [] }));
        
        try {
            const base64Data = await blobToBase64(file);
             const response = await fetch('/api/extract-colors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64Data, mimeType: file.type })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to extract colors.');
            }
            
            const data = await response.json();
            const extracted = data.colors || [];
            
            if (extracted.length > 0) {
                setSuggestedColors(extracted);
                setFormData(prev => ({ ...prev, brandColors: [extracted[0]] }));
            } else {
                setSuggestedColors(['ERROR']);
                throw new Error("No distinct colors were found in the logo.");
            }
        } catch (e: any) {
            console.error("Error extracting colors:", e);
            handleApiError(e);
        } finally {
            setIsExtractingColors(false);
        }
    };
    
    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            clearAllErrors();
            const file = e.target.files[0];
            const logoPreview = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, logo: file, logoPreview, brandColors: [] }));
            extractColorsFromLogo(file);
        }
    };

    const validateStep = (step: number): boolean => {
        clearAllErrors();
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        switch (step) {
            case 0:
                if (!formData.industry || !formData.eventName) {
                    setError("Please select an industry and event.");
                    return false;
                }
                break;
            case 1:
                if (!formData.standLayout || !formData.standType || !formData.standHeight) {
                    setError("Please complete all structure details.");
                    return false;
                }
                break;
            case 2:
                if (formData.functionality.length === 0) {
                    setError("Please select at least one functionality requirement.");
                    return false;
                }
                break;
            case 3:
                if (!formData.style) {
                    setError("Please select a design style.");
                    return false;
                }
                if (!formData.logo) {
                    setError("Please upload your company logo.");
                    return false;
                }
                if (formData.brandColors.length === 0) {
                    setError("Please provide your brand colors.");
                    return false;
                }
                break;
            case 4:
                if (!formData.userFirstName.trim()) newErrors.userFirstName = "First name is required.";
                if (!formData.userLastName.trim()) newErrors.userLastName = "Last name is required.";

                if (!formData.userEmail.trim()) {
                    newErrors.userEmail = "Email address is required.";
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) {
                    newErrors.userEmail = "Please enter a valid email format.";
                }

                if (!formData.userMobileNumber.trim()) {
                    newErrors.userMobileNumber = "Mobile number is required.";
                } else if (!/^\d{7,15}$/.test(formData.userMobileNumber.replace(/[\s-]/g, ''))) {
                    newErrors.userMobileNumber = "Please enter a valid phone number.";
                }
                
                setFormErrors(newErrors);
                return Object.keys(newErrors).length === 0;
        }
        return true;
    };
    
    const nextStep = () => {
        setFormErrors({});
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length));
        }
    };

    const prevStep = () => {
        clearAllErrors();
        setFormErrors({});
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const generateDesign = async () => {
        clearAllErrors();
        if (!await ensureApiKey()) return;

        setIsLoading(true);
        setGeneratedConcepts([]);

        if (!formData.logo) {
            setError("Logo is missing. Please go back and upload it.");
            setIsLoading(false);
            return;
        }

        try {
            const logoBase64 = await blobToBase64(formData.logo);
            
            const promptData = {
                event: formData.eventName,
                industry: formData.industry,
                dimensions: `${formData.standWidth}m width x ${formData.standLength}m length (${formData.standWidth * formData.standLength} sqm)`,
                layout: formData.standLayout,
                layoutDescription: getLayoutDescription(formData.standLayout),
                type: formData.standType,
                structure: `Maximum height is ${formData.standHeight}. ${formData.doubleDecker ? 'It MUST be a double-decker (two-story) stand.' : ''} ${formData.hangingStructure ? 'It MUST include a prominent hanging structure suspended from the ceiling.' : ''}`,
                style: formData.style,
                functionality: formData.functionality.join(', '),
                colors: formData.brandColors.join(', '),
            };

            const response = await fetch('/api/generate-images', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    logo: logoBase64,
                    mimeType: formData.logo.type,
                    promptData: promptData,
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to generate images.');
            }

            const data = await response.json();
            
            if (!data.concepts || data.concepts.length === 0) {
                 throw new Error("The AI model failed to generate any concepts.");
            }
            
            setGeneratedConcepts(data.concepts);
            setIsFinished(true);
            
        } catch (e: any) {
            handleApiError(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (apiKeyError) return;
        setFormErrors({});

        for (let i = 0; i < steps.length; i++) {
            if (!validateStep(i)) {
                setCurrentStep(i); 
                return;
            }
        }
        
        generateDesign();
    };


    const sendProposalRequest = async () => {
        if (selectedConcept === null) return;
        setIsSending(true);
        
        const fullUserName = `${formData.userFirstName} ${formData.userLastName}`;
        const fullMobileNumber = `${formData.userMobileCountryCode} ${formData.userMobileNumber}`;

        console.log("--- PROPOSAL REQUEST (SIMULATED) ---", { 
            ...formData, 
            fullUserName,
            fullMobileNumber,
            logo: formData.logo?.name, 
            selectedConcept: generatedConcepts[selectedConcept] 
        });
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSending(false);
        setIsProposalRequested(true);
    };

    const error = apiKeyError || localError;
    const isNextButtonDisabled = currentStep === 3 && isExtractingColors || currentStep === 0 && isAnalyzingStyle;
    
    const analyzeShowStyle = async (eventName: string, industry: string) => {
        if (!eventName || !industry) return;
        
        clearAllErrors();
        if (!await ensureApiKey()) return;

        setIsAnalyzingStyle(true);
        try {
            const response = await fetch('/api/analyze-show-style', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    eventName, 
                    industryContext: industry, 
                    availableStyles: styles.map(s => s.name)
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to analyze event style.');
            }

            const data = await response.json();
            if (data.style && data.description) {
                setFormData(p => ({ ...p, style: data.style, eventStyleDescription: data.description }));
            }
        } catch (e: any) {
            console.error('Error analyzing show style:', e);
        } finally {
            setIsAnalyzingStyle(false);
        }
    };
    
     useEffect(() => {
        if (formData.eventName && formData.industry && !isCustomEvent) {
            analyzeShowStyle(formData.eventName, formData.industry);
        }
    }, [formData.eventName, formData.industry, isCustomEvent]);
    
    const events = useMemo(() => {
        const uniqueEvents = new Map<string, { industry: string }>();
        regionalEvents.forEach(event => {
            if (!uniqueEvents.has(event.name)) {
                uniqueEvents.set(event.name, { industry: event.industry });
            }
        });
        return Array.from(uniqueEvents.entries()).map(([name, { industry }]) => ({ name, industry }));
    }, []);
    
    const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedEventName = e.target.value;
        if (selectedEventName === 'custom') {
            setIsCustomEvent(true);
            setFormData(p => ({ ...p, eventName: '', industry: p.industry || '', style: '', eventStyleDescription: '' }));
        } else {
            setIsCustomEvent(false);
            const selectedEvent = events.find(event => event.name === selectedEventName);
            setFormData(p => ({
                ...p,
                eventName: selectedEventName,
                industry: selectedEvent?.industry || p.industry,
                style: '',
                eventStyleDescription: ''
            }));
        }
    };

    // --- RENDER LOGIC ---

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Brief
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif text-white mb-4">Step 1: Project Brief</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="eventName" className="block text-sm font-medium text-fann-light-gray mb-2">Event Name</label>
                                <select id="eventName" value={isCustomEvent ? 'custom' : formData.eventName} onChange={handleEventChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2">
                                    <option value="" disabled>Select an event...</option>
                                    {events.map(e => <option key={e.name} value={e.name}>{e.name}</option>)}
                                    <option value="custom">Other / Not Listed</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="industry" className="block text-sm font-medium text-fann-light-gray mb-2">Industry</label>
                                <input type="text" id="industry" name="industry" value={formData.industry} onChange={handleInputChange} disabled={!isCustomEvent} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2 disabled:bg-fann-charcoal-light/50" />
                            </div>
                        </div>
                        {isCustomEvent && (
                            <input type="text" name="eventName" placeholder="Enter your event name" value={formData.eventName} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2 mt-4" />
                        )}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="standWidth" className="block text-sm font-medium text-fann-light-gray mb-2">Stand Width (m): {formData.standWidth}</label>
                                <input type="range" id="standWidth" name="standWidth" min="3" max="30" value={formData.standWidth} onChange={handleInputChange} className="w-full h-2 bg-fann-charcoal-light rounded-lg appearance-none cursor-pointer accent-fann-gold" />
                            </div>
                            <div>
                                <label htmlFor="standLength" className="block text-sm font-medium text-fann-light-gray mb-2">Stand Length (m): {formData.standLength}</label>
                                <input type="range" id="standLength" name="standLength" min="3" max="30" value={formData.standLength} onChange={handleInputChange} className="w-full h-2 bg-fann-charcoal-light rounded-lg appearance-none cursor-pointer accent-fann-gold" />
                            </div>
                        </div>
                         <div className="text-center text-lg font-bold">Total Area: <span className="text-fann-gold">{formData.standWidth * formData.standLength} sqm</span></div>
                    </div>
                );
            case 1: // Structure
                 return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif text-white mb-4">Step 2: Structural Configuration</h2>
                        <div>
                            <label className="block text-sm font-medium text-fann-light-gray mb-3">Stand Layout (Open Sides)</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {layoutOptions.map(opt => (
                                    <div key={opt.name} onClick={() => setFormData(p => ({ ...p, standLayout: opt.name }))} className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${formData.standLayout === opt.name ? 'border-fann-gold bg-fann-gold/10' : 'border-fann-border hover:border-fann-gold/50'}`}>
                                        <div className="flex justify-center items-center h-16">{opt.visual}</div>
                                        <p className="font-semibold text-sm mt-3 text-center">{opt.name.split(' (')[0]}</p>
                                        <p className="text-xs text-fann-light-gray text-center">{opt.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                         <div className="grid md:grid-cols-2 gap-6 pt-4">
                             <div>
                                <label htmlFor="standType" className="block text-sm font-medium text-fann-light-gray mb-2">Stand Type</label>
                                <select id="standType" name="standType" value={formData.standType} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2">
                                    <option value="" disabled>Select type...</option>
                                    <option>Custom Build</option>
                                    <option>Modular System</option>
                                    <option>Hybrid (Custom + Modular)</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="standHeight" className="block text-sm font-medium text-fann-light-gray mb-2">Maximum Height</label>
                                <select id="standHeight" name="standHeight" value={formData.standHeight} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2">
                                    <option value="" disabled>Select height...</option>
                                    <option>4 meters</option>
                                    <option>6 meters</option>
                                    <option>Venue Maximum</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center space-x-8 pt-4">
                            <label htmlFor="doubleDecker" className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" id="doubleDecker" name="doubleDecker" checked={formData.doubleDecker} onChange={handleInputChange} className="h-4 w-4 rounded accent-fann-teal"/>
                                <span>Double Decker (Two Story)</span>
                            </label>
                             <label htmlFor="hangingStructure" className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" id="hangingStructure" name="hangingStructure" checked={formData.hangingStructure} onChange={handleInputChange} className="h-4 w-4 rounded accent-fann-teal"/>
                                <span>Hanging Structure</span>
                            </label>
                        </div>
                    </div>
                );
            case 2: // Functionality
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif text-white mb-4">Step 3: Functional Zones & Features</h2>
                        <p className="text-fann-light-gray text-sm">Select all the features you require for your stand.</p>
                        <div className="space-y-4">
                        {Object.entries(functionalityGroups).map(([groupName, items]) => (
                            <div key={groupName}>
                                <h3 className="font-semibold text-fann-light-gray mb-2">{groupName}</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {items.map(item => (
                                    <button type="button" key={item} onClick={() => handleFunctionalityChange(item)} className={`p-3 rounded-lg border-2 text-left text-sm transition-colors flex items-center gap-2 ${formData.functionality.includes(item) ? 'border-fann-teal bg-fann-teal/10' : 'border-fann-border hover:border-fann-teal/50'}`}>
                                        <div className={`w-4 h-4 rounded-sm flex-shrink-0 border-2 flex items-center justify-center ${formData.functionality.includes(item) ? 'bg-fann-teal border-fann-teal' : 'border-fann-light-gray'}`}>
                                            {formData.functionality.includes(item) && <CheckCircle size={12} className="text-white"/>}
                                        </div>
                                        <span>{item}</span>
                                    </button>
                                ))}
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                );
            case 3: // Aesthetics
                const handleColorToggle = (color: string) => {
                    setFormData(prev => {
                        const newColors = prev.brandColors.includes(color)
                            ? prev.brandColors.filter(c => c !== color)
                            : [...prev.brandColors, color];
                        return { ...prev, brandColors: newColors };
                    });
                };
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif text-white mb-4">Step 4: Aesthetics & Branding</h2>
                         <div>
                            <label className="block text-sm font-medium text-fann-light-gray mb-3">Design Style</label>
                             <div className="relative">
                                {isAnalyzingStyle && <div className="absolute -top-2 -right-2 z-10 p-1 bg-fann-charcoal rounded-full"><Loader2 className="w-5 h-5 animate-spin text-fann-gold" /></div>}
                                <div className="grid grid-cols-3 gap-3">
                                    {styles.map(s => (
                                        <div key={s.name} onClick={() => setFormData(p => ({...p, style: s.name}))} className={`relative h-28 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${formData.style === s.name ? 'border-fann-gold' : 'border-transparent'}`}>
                                            <img src={s.image} alt={s.name} className="w-full h-full object-cover"/>
                                            <div className="absolute inset-0 bg-black/50 hover:bg-black/30 transition-colors"></div>
                                            <p className="absolute bottom-2 left-2 text-xs font-bold">{s.name}</p>
                                        </div>
                                    ))}
                                </div>
                             </div>
                             {formData.eventStyleDescription && (
                                <p className="text-xs text-fann-light-gray mt-2 bg-fann-charcoal p-2 rounded-md border border-fann-border">
                                    <strong>AI Suggestion for {formData.eventName}:</strong> {formData.eventStyleDescription}
                                </p>
                            )}
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 items-start pt-4">
                            <div>
                                <label className="block text-sm font-medium text-fann-light-gray mb-2">Upload Your Logo (Vector Preferred)</label>
                                <div onClick={() => fileInputRef.current?.click()} className="h-48 w-full bg-fann-charcoal border-2 border-dashed border-fann-border rounded-lg flex items-center justify-center cursor-pointer hover:border-fann-gold transition-colors">
                                    {formData.logoPreview ? <img src={formData.logoPreview} alt="Logo Preview" className="max-h-full max-w-full object-contain p-4" /> : <div className="text-center text-fann-light-gray"><Upload className="mx-auto w-8 h-8 mb-2" /><p>Click to upload</p></div>}
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleLogoChange} className="hidden" accept="image/png, image/jpeg, image/svg+xml, image/webp, image/gif, .svg" />
                            </div>
                            <div>
                                <label htmlFor="brandColors" className="block text-sm font-medium text-fann-light-gray mb-2">Primary Brand Colors</label>
                                <input type="text" id="brandColors" name="brandColors" value={formData.brandColors.join(', ')} onChange={(e) => setFormData(p => ({...p, brandColors: e.target.value.split(',').map(c => c.trim()).filter(c => c)}))} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" placeholder="e.g., #0A192F, Fann Gold, White" />
                                <div className="mt-2 min-h-[4rem]">
                                    {isExtractingColors ? <div className="flex items-center gap-2 text-sm text-fann-light-gray"><Loader2 className="w-4 h-4 animate-spin"/>Analyzing...</div> : suggestedColors.length > 0 && suggestedColors[0] !== 'ERROR' ? (
                                        <div>
                                            <span className="flex items-center gap-1 text-green-400 mb-2 text-sm"><CheckCircle className="w-4 h-4"/>AI suggestions are ready.</span>
                                            <div className="flex flex-wrap gap-2">
                                                {suggestedColors.map(color => {
                                                    const isSelected = formData.brandColors.includes(color);
                                                    return (
                                                        <button type="button" key={color} onClick={() => handleColorToggle(color)} className={`flex items-center text-xs gap-1.5 p-1.5 rounded-md transition-all border ${isSelected ? 'border-fann-gold bg-fann-gold/10' : 'border-fann-border bg-fann-charcoal hover:border-fann-gold/50'}`}>
                                                            <div className="w-5 h-5 rounded border border-white/20" style={{ backgroundColor: color }}></div>
                                                            <span className="font-mono text-fann-light-gray">{color}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : suggestedColors[0] === 'ERROR' ? (
                                         <span className="flex items-center gap-1 text-red-400 text-sm"><AlertCircle className="w-4 h-4"/>Could not extract. Enter manually.</span>
                                    ) : <p className="text-sm text-fann-light-gray">Upload a logo for AI color suggestions.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4: // Review & Contact
                return (
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-serif text-white">Step 5: Review & Contact</h2>
                            <p className="text-fann-light-gray text-sm">Please provide your details. The generated concepts and a proposal link will be sent to your email.</p>
                            
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="userFirstName" className="block text-sm font-medium text-fann-light-gray mb-1">First Name</label>
                                    <input type="text" id="userFirstName" name="userFirstName" value={formData.userFirstName} onChange={handleInputChange} placeholder="e.g., John" aria-invalid={!!formErrors.userFirstName} className={`w-full bg-fann-charcoal border rounded-md px-3 py-2 transition-colors border-fann-border focus:outline-none focus:border-fann-gold focus:ring-1 focus:ring-fann-gold`} />
                                    {formErrors.userFirstName && <p className="text-red-400 text-xs mt-1">{formErrors.userFirstName}</p>}
                                </div>
                                 <div>
                                    <label htmlFor="userLastName" className="block text-sm font-medium text-fann-light-gray mb-1">Last Name</label>
                                    <input type="text" id="userLastName" name="userLastName" value={formData.userLastName} onChange={handleInputChange} placeholder="e.g., Doe" aria-invalid={!!formErrors.userLastName} className={`w-full bg-fann-charcoal border rounded-md px-3 py-2 transition-colors border-fann-border focus:outline-none focus:border-fann-gold focus:ring-1 focus:ring-fann-gold`} />
                                    {formErrors.userLastName && <p className="text-red-400 text-xs mt-1">{formErrors.userLastName}</p>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="userEmail" className="block text-sm font-medium text-fann-light-gray mb-1">Email Address</label>
                                <input type="email" id="userEmail" name="userEmail" value={formData.userEmail} onChange={handleInputChange} placeholder="e.g., j.doe@company.com" aria-invalid={!!formErrors.userEmail} className={`w-full bg-fann-charcoal border rounded-md px-3 py-2 transition-colors border-fann-border focus:outline-none focus:border-fann-gold focus:ring-1 focus:ring-fann-gold`} />
                                {formErrors.userEmail && <p className="text-red-400 text-xs mt-1">{formErrors.userEmail}</p>}
                            </div>

                            <div>
                                <label htmlFor="userMobileNumber" className="block text-sm font-medium text-fann-light-gray mb-1">Mobile Number</label>
                                <div className="flex">
                                    <select name="userMobileCountryCode" value={formData.userMobileCountryCode} onChange={handleInputChange} className="bg-fann-charcoal border border-r-0 border-fann-border rounded-l-md px-3 py-2 focus:outline-none focus:border-fann-gold focus:ring-1 focus:ring-fann-gold">
                                        {countryCodes.map(c => <option key={c.code} value={c.dial_code}>{c.code} {c.dial_code}</option>)}
                                    </select>
                                    <input type="tel" id="userMobileNumber" name="userMobileNumber" value={formData.userMobileNumber} onChange={handleInputChange} placeholder="50 123 4567" aria-invalid={!!formErrors.userMobileNumber} className={`w-full bg-fann-charcoal border rounded-r-md px-3 py-2 transition-colors border-fann-border focus:outline-none focus:border-fann-gold focus:ring-1 focus:ring-fann-gold`} />
                                </div>
                                 {formErrors.userMobileNumber && <p className="text-red-400 text-xs mt-1">{formErrors.userMobileNumber}</p>}
                            </div>
                        </div>
                        <div className="bg-fann-charcoal p-4 rounded-lg">
                             <h3 className="text-lg font-serif text-white mb-3 flex items-center gap-2"><FileText size={20}/> Design Brief Summary</h3>
                             <div className="space-y-2 text-sm text-fann-light-gray">
                                <p><strong>Event:</strong> <span className="text-white">{formData.eventName || 'N/A'}</span></p>
                                <p><strong>Size:</strong> <span className="text-white">{formData.standWidth}m x {formData.standLength}m ({formData.standWidth * formData.standLength} sqm)</span></p>
                                <p><strong>Layout:</strong> <span className="text-white">{formData.standLayout || 'N/A'}</span></p>
                                <p><strong>Structure:</strong> <span className="text-white">{[formData.standType, formData.standHeight, formData.doubleDecker && "Double Decker", formData.hangingStructure && "Hanging Structure"].filter(Boolean).join(', ') || 'N/A'}</span></p>
                                <p><strong>Style:</strong> <span className="text-white">{formData.style || 'N/A'}</span></p>
                                <p><strong>Functionality:</strong> <span className="text-white">{formData.functionality.length > 0 ? formData.functionality.join(', ') : 'N/A'}</span></p>
                             </div>
                        </div>
                    </div>
                );
            default: return null;
        }
    };
    
    if (isLoading) return (
        <div className="min-h-screen flex flex-col justify-center items-center text-center p-4">
            <Loader2 className="w-16 h-16 text-fann-gold animate-spin" />
            <h2 className="text-3xl font-serif text-white mt-6">Building Your Vision...</h2>
            <p className="text-fann-light-gray mt-2 max-w-sm">Our AI is drafting blueprints and rendering concepts. This might take up to a minute.</p>
        </div>
    );
    
    if (isFinished && isProposalRequested) return (
        <AnimatedPage>
            <div className="min-h-screen flex flex-col justify-center items-center text-center p-4">
                <CheckCircle className="w-20 h-20 text-fann-teal mb-6" />
                <h1 className="text-5xl font-serif font-bold text-fann-gold mt-4 mb-4">Thank You!</h1>
                <p className="text-xl text-fann-cream max-w-2xl mx-auto mb-8">Our team has received your concept selection and will prepare a detailed proposal, which will be sent to <strong>{formData.userEmail}</strong> shortly.</p>
                {selectedConcept !== null && <img src={generatedConcepts[selectedConcept].imageUrl} alt="Selected" className="rounded-lg shadow-2xl w-full max-w-lg mt-8" />}
            </div>
        </AnimatedPage>
    );

    if (isFinished) return (
        <AnimatedPage>
             <AnimatePresence>
                {isModelViewerOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModelViewerOpen(false)} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} onClick={e => e.stopPropagation()} className="relative w-full max-w-4xl h-[80vh] bg-fann-charcoal-light rounded-lg">
                            <button onClick={() => setIsModelViewerOpen(false)} className="absolute top-2 right-2 z-10 text-white bg-black/50 rounded-full p-1">&times;</button>
                            <model-viewer
                                src="https://cdn.glitch.global/6a86e927-2ace-4493-9706-e71e9a385203/booth_concept.glb?v=1717593231454"
                                alt="A 3D model of an exhibition stand"
                                camera-controls
                                auto-rotate
                                ar
                                shadow-intensity="1"
                                style={{ width: '100%', height: '100%', borderRadius: '8px' }}
                            ></model-viewer>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <Sparkles className="mx-auto h-16 w-16 text-fann-gold" />
                        <h1 className="text-5xl font-serif font-bold text-fann-gold mt-4 mb-4">Your AI-Generated Concepts</h1>
                        <p className="text-xl text-fann-cream max-w-3xl mx-auto">Click your preferred design. Our team will then prepare a detailed proposal and quotation for you.</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {generatedConcepts.map((concept, index) => (
                            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.15 }} onClick={() => setSelectedConcept(index)} className={`rounded-lg overflow-hidden cursor-pointer border-4 bg-fann-charcoal-light transition-all duration-300 ${selectedConcept === index ? 'border-fann-gold' : 'border-transparent hover:border-fann-gold/50'}`}>
                                <img src={concept.imageUrl} alt={concept.title} className="w-full h-auto object-cover aspect-video" />
                                <div className="p-6">
                                    <h3 className="text-2xl font-serif font-bold text-fann-gold">{concept.title}</h3>
                                    <p className="text-fann-cream mt-2 text-sm">{concept.description}</p>
                                    <button onClick={(e) => { e.stopPropagation(); setIsModelViewerOpen(true); }} className="mt-4 text-sm font-semibold text-fann-teal flex items-center gap-2 hover:underline">
                                        <View size={16} /> View in 3D
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                     <div className="text-center mt-12">
                        <motion.button onClick={sendProposalRequest} disabled={selectedConcept === null || isSending} className="bg-fann-teal text-white font-bold py-4 px-10 rounded-full text-lg uppercase tracking-wider flex items-center justify-center gap-2 disabled:bg-fann-charcoal-light disabled:text-fann-light-gray disabled:cursor-not-allowed" whileHover={{ scale: selectedConcept !== null && !isSending ? 1.05 : 1 }} whileTap={{ scale: selectedConcept !== null && !isSending ? 0.95 : 1 }}>
                            {isSending ? <><Loader2 className="w-6 h-6 animate-spin" /> Sending Request...</> : "Request Detailed Proposal"}
                        </motion.button>
                        {selectedConcept === null && <p className="text-sm text-center text-fann-light-gray mt-3">Please select a design concept to proceed.</p>}
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white flex items-center justify-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-serif font-bold text-fann-gold mb-4">Exhibition Stand Studio</h1>
                        <p className="text-xl text-fann-cream">Follow the steps to generate a bespoke stand concept.</p>
                    </div>

                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            {steps.map((step, index) => (
                                <div key={step.name} className="flex flex-col items-center" style={{ width: `${100 / steps.length}%` }}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border-2 ${currentStep >= index ? 'bg-fann-gold text-fann-charcoal border-fann-gold' : 'bg-fann-charcoal-light text-fann-light-gray border-fann-border'}`}><step.icon size={20} /></div>
                                    <span className={`text-xs mt-2 text-center font-semibold ${currentStep >= index ? 'text-white' : 'text-fann-light-gray'}`}>{step.name}</span>
                                </div>
                            ))}
                        </div>
                        <div className="bg-fann-charcoal-light rounded-full h-1.5"><motion.div className="bg-fann-gold h-1.5 rounded-full" initial={{ width: 0 }} animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} transition={{ type: 'spring', stiffness: 50 }}/></div>
                    </div>

                    <div className="bg-fann-charcoal-light p-8 rounded-lg">
                        <form onSubmit={handleSubmit}>
                            <motion.div key={currentStep} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
                                {renderStepContent()}
                            </motion.div>
                            <div className="mt-8">
                                {error && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm flex items-start gap-3 mb-4">
                                        <div className="flex-shrink-0 pt-0.5"><AlertCircle className="w-5 h-5" /></div>
                                        <div className="flex-grow">
                                            <span className="whitespace-pre-wrap">{error}</span>
                                        </div>
                                    </motion.div>
                                )}
                                <div className="flex justify-between items-center">
                                    <motion.button type="button" onClick={prevStep} disabled={currentStep === 0} className="flex items-center gap-2 text-fann-gold disabled:text-fann-light-gray disabled:cursor-not-allowed" whileHover={{scale: currentStep !== 0 ? 1.05 : 1}} whileTap={{scale: currentStep !== 0 ? 0.95 : 1}}>
                                        <ArrowLeft size={16} /> Back
                                    </motion.button>
                                    
                                    {currentStep < steps.length - 1 ? (
                                        <motion.button type="button" onClick={nextStep} disabled={isNextButtonDisabled} className="bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full w-36 disabled:bg-fann-charcoal-light disabled:text-fann-light-gray disabled:cursor-not-allowed" whileHover={{scale: !isNextButtonDisabled ? 1.05 : 1}} whileTap={{scale: !isNextButtonDisabled ? 0.95 : 1}}>
                                            {isNextButtonDisabled ? <Loader2 className="w-5 h-5 mx-auto animate-spin" /> : 'Next Step'}
                                        </motion.button>
                                    ) : (
                                        <motion.button type="submit" className="bg-fann-teal text-white font-bold py-3 px-8 rounded-full flex items-center gap-2" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                                            <Sparkles size={16} /> Generate My Design
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default ExhibitionStudioPage;