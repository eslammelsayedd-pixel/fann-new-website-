import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Upload, ArrowLeft, Building, Scaling, ListChecks, User, CheckCircle, AlertCircle, Palette, View, FileText, Mail, Phone, MessageSquareQuote } from 'lucide-react';
import { useApiKey } from '../context/ApiKeyProvider';
// To resolve errors related to the custom `<model-viewer>` element, its type definition must be loaded.
// The global JSX augmentations are defined in `../types.ts`, and importing it here makes them available to this file.
import {} from '../types';
import { useSearchParams } from 'react-router-dom';


// --- Data & Constants ---
const countryCodes = [
    { "name": "United Arab Emirates", "dial_code": "+971", "code": "AE" }, { "name": "Saudi Arabia", "dial_code": "+966", "code": "SA" }, { "name": "Qatar", "dial_code": "+974", "code": "QA" }, { "name": "Oman", "dial_code": "+968", "code": "OM" }, { "name": "Kuwait", "dial_code": "+965", "code": "KW" }, { "name": "Bahrain", "dial_code": "+973", "code": "BH" }, { "name": "Egypt", "dial_code": "+20", "code": "EG" }, { "name": "Jordan", "dial_code": "+962", "code": "JO" }, { "name": "Lebanon", "dial_code": "+961", "code": "LB" }, { "name": "United States", "dial_code": "+1", "code": "US" }, { "name": "United Kingdom", "dial_code": "+44", "code": "GB" }, { "name": "India", "dial_code": "+91", "code": "IN" }, { "name": "Pakistan", "dial_code": "+92", "code": "PK" }, { "name": "Afghanistan", "dial_code": "+93", "code": "AF" }, { "name": "Albania", "dial_code": "+355", "code": "AL" }, { "name": "Algeria", "dial_code": "+213", "code": "DZ" }, { "name": "American Samoa", "dial_code": "+1684", "code": "AS" }, { "name": "Andorra", "dial_code": "+376", "code": "AD" }, { "name": "Angola", "dial_code": "+244", "code": "AO" }, { "name": "Anguilla", "dial_code": "+1264", "code": "AI" }, { "name": "Antarctica", "dial_code": "+672", "code": "AQ" }, { "name": "Antigua and Barbuda", "dial_code": "+1268", "code": "AG" }, { "name": "Argentina", "dial_code": "+54", "code": "AR" }, { "name": "Armenia", "dial_code": "+374", "code": "AM" }, { "name": "Aruba", "dial_code": "+297", "code": "AW" }, { "name": "Australia", "dial_code": "+61", "code": "AU" }, { "name": "Austria", "dial_code": "+43", "code": "AT" }, { "name": "Azerbaijan", "dial_code": "+994", "code": "AZ" }, { "name": "Bahamas", "dial_code": "+1242", "code": "BS" }, { "name": "Bangladesh", "dial_code": "+880", "code": "BD" }, { "name": "Barbados", "dial_code": "+1246", "code": "BB" }, { "name": "Belarus", "dial_code": "+375", "code": "BY" }, { "name": "Belgium", "dial_code": "+32", "code": "BE" }, { "name": "Belize", "dial_code": "+501", "code": "BZ" }, { "name": "Benin", "dial_code": "+229", "code": "BJ" }, { "name": "Bermuda", "dial_code": "+1441", "code": "BM" }, { "name": "Bhutan", "dial_code": "+975", "code": "BT" }, { "name": "Bolivia, Plurinational State of", "dial_code": "+591", "code": "BO" }, { "name": "Bosnia and Herzegovina", "dial_code": "+387", "code": "BA" }, { "name": "Botswana", "dial_code": "+267", "code": "BW" }, { "name": "Brazil", "dial_code": "+55", "code": "BR" }, { "name": "British Indian Ocean Territory", "dial_code": "+246", "code": "IO" }, { "name": "Brunei Darussalam", "dial_code": "+673", "code": "BN" }, { "name": "Bulgaria", "dial_code": "+359", "code": "BG" }, { "name": "Burkina Faso", "dial_code": "+226", "code": "BF" }, { "name": "Burundi", "dial_code": "+257", "code": "BI" }, { "name": "Cambodia", "dial_code": "+855", "code": "KH" }, { "name": "Cameroon", "dial_code": "+237", "code": "CM" }, { "name": "Canada", "dial_code": "+1", "code": "CA" }, { "name": "Cape Verde", "dial_code": "+238", "code": "CV" }, { "name": "Cayman Islands", "dial_code": "+345", "code": "KY" }, { "name": "Central African Republic", "dial_code": "+236", "code": "CF" }, { "name": "Chad", "dial_code": "+235", "code": "TD" }, { "name": "Chile", "dial_code": "+56", "code": "CL" }, { "name": "China", "dial_code": "+86", "code": "CN" }, { "name": "Christmas Island", "dial_code": "+61", "code": "CX" }, { "name": "Cocos (Keeling) Islands", "dial_code": "+61", "code": "CC" }, { "name": "Colombia", "dial_code": "+57", "code": "CO" }, { "name": "Comoros", "dial_code": "+269", "code": "KM" }, { "name": "Congo", "dial_code": "+242", "code": "CG" }, { "name": "Congo, The Democratic Republic of the", "dial_code": "+243", "code": "CD" }, { "name": "Cook Islands", "dial_code": "+682", "code": "CK" }, { "name": "Costa Rica", "dial_code": "+506", "code": "CR" }, { "name": "Cote d'Ivoire", "dial_code": "+225", "code": "CI" }, { "name": "Croatia", "dial_code": "+385", "code": "HR" }, { "name": "Cuba", "dial_code": "+53", "code": "CU" }, { "name": "Cyprus", "dial_code": "+357", "code": "CY" }, { "name": "Czech Republic", "dial_code": "+420", "code": "CZ" }, { "name": "Denmark", "dial_code": "+45", "code": "DK" }, { "name": "Djibouti", "dial_code": "+253", "code": "DJ" }, { "name": "Dominica", "dial_code": "+1767", "code": "DM" }, { "name": "Dominican Republic", "dial_code": "+1849", "code": "DO" }, { "name": "Ecuador", "dial_code": "+593", "code": "EC" }, { "name": "El Salvador", "dial_code": "+503", "code": "SV" }, { "name": "Equatorial Guinea", "dial_code": "+240", "code": "GQ" }, { "name": "Eritrea", "dial_code": "+291", "code": "ER" }, { "name": "Estonia", "dial_code": "+372", "code": "EE" }, { "name": "Ethiopia", "dial_code": "+251", "code": "ET" }, { "name": "Falkland Islands (Malvinas)", "dial_code": "+500", "code": "FK" }, { "name": "Faroe Islands", "dial_code": "+298", "code": "FO" }, { "name": "Fiji", "dial_code": "+679", "code": "FJ" }, { "name": "Finland", "dial_code": "+358", "code": "FI" }, { "name": "France", "dial_code": "+33", "code": "FR" }, { "name": "French Guiana", "dial_code": "+594", "code": "GF" }, { "name": "French Polynesia", "dial_code": "+689", "code": "PF" }, { "name": "Gabon", "dial_code": "+241", "code": "GA" }, { "name": "Gambia", "dial_code": "+220", "code": "GM" }, { "name": "Georgia", "dial_code": "+995", "code": "GE" }, { "name": "Germany", "dial_code": "+49", "code": "DE" }, { "name": "Ghana", "dial_code": "+233", "code": "GH" }, { "name": "Gibraltar", "dial_code": "+350", "code": "GI" }, { "name": "Greece", "dial_code": "+30", "code": "GR" }, { "name": "Greenland", "dial_code": "+299", "code": "GL" }, { "name": "Grenada", "dial_code": "+1473", "code": "GD" }, { "name": "Guadeloupe", "dial_code": "+590", "code": "GP" }, { "name": "Guam", "dial_code": "+1671", "code": "GU" }, { "name": "Guatemala", "dial_code": "+502", "code": "GT" }, { "name": "Guernsey", "dial_code": "+44", "code": "GG" }, { "name": "Guinea", "dial_code": "+224", "code": "GN" }, { "name": "Guinea-Bissau", "dial_code": "+245", "code": "GW" }, { "name": "Guyana", "dial_code": "+592", "code": "GY" }, { "name": "Haiti", "dial_code": "+509", "code": "HT" }, { "name": "Holy See (Vatican City State)", "dial_code": "+379", "code": "VA" }, { "name": "Honduras", "dial_code": "+504", "code": "HN" }, { "name": "Hong Kong", "dial_code": "+852", "code": "HK" }, { "name": "Hungary", "dial_code": "+36", "code": "HU" }, { "name": "Iceland", "dial_code": "+354", "code": "IS" }, { "name": "Indonesia", "dial_code": "+62", "code": "ID" }, { "name": "Iran, Islamic Republic of", "dial_code": "+98", "code": "IR" }, { "name": "Iraq", "dial_code": "+964", "code": "IQ" }, { "name": "Ireland", "dial_code": "+353", "code": "IE" }, { "name": "Isle of Man", "dial_code": "+44", "code": "IM" }, { "name": "Israel", "dial_code": "+972", "code": "IL" }, { "name": "Italy", "dial_code": "+39", "code": "IT" }, { "name": "Jamaica", "dial_code": "+1876", "code": "JM" }, { "name": "Japan", "dial_code": "+81", "code": "JP" }, { "name": "Jersey", "dial_code": "+44", "code": "JE" }, { "name": "Kazakhstan", "dial_code": "+7", "code": "KZ" }, { "name": "Kenya", "dial_code": "+254", "code": "KE" }, { "name": "Kiribati", "dial_code": "+686", "code": "KI" }, { "name": "Korea, Republic of", "dial_code": "+82", "code": "KR" }, { "name": "Kosovo", "dial_code": "+383", "code": "XK" }, { "name": "Kyrgyzstan", "dial_code": "+996", "code": "KG" }, { "name": "Lao People's Democratic Republic", "dial_code": "+856", "code": "LA" }, { "name": "Latvia", "dial_code": "+371", "code": "LV" }, { "name": "Lesotho", "dial_code": "+266", "code": "LS" }, { "name": "Liberia", "dial_code": "+231", "code": "LR" }, { "name": "Libyan Arab Jamahiriya", "dial_code": "+218", "code": "LY" }, { "name": "Liechtenstein", "dial_code": "+423", "code": "LI" }, { "name": "Lithuania", "dial_code": "+370", "code": "LT" }, { "name": "Luxembourg", "dial_code": "+352", "code": "LU" }, { "name": "Macao", "dial_code": "+853", "code": "MO" }, { "name": "Macedonia, The Former Yugoslav Republic of", "dial_code": "+389", "code": "MK" }, { "name": "Madagascar", "dial_code": "+261", "code": "MG" }, { "name": "Malawi", "dial_code": "+265", "code": "MW" }, { "name": "Malaysia", "dial_code": "+60", "code": "MY" }, { "name": "Maldives", "dial_code": "+960", "code": "MV" }, { "name": "Mali", "dial_code": "+223", "code": "ML" }, { "name": "Malta", "dial_code": "+356", "code": "MT" }, { "name": "Marshall Islands", "dial_code": "+692", "code": "MH" }, { "name": "Martinique", "dial_code": "+596", "code": "MQ" }, { "name": "Mauritania", "dial_code": "+222", "code": "MR" }, { "name": "Mauritius", "dial_code": "+230", "code": "MU" }, { "name": "Mayotte", "dial_code": "+262", "code": "YT" }, { "name": "Mexico", "dial_code": "+52", "code": "MX" }, { "name": "Micronesia, Federated States of", "dial_code": "+691", "code": "FM" }, { "name": "Moldova, Republic of", "dial_code": "+373", "code": "MD" }, { "name": "Monaco", "dial_code": "+377", "code": "MC" }, { "name": "Mongolia", "dial_code": "+976", "code": "MN" }, { "name": "Montenegro", "dial_code": "+382", "code": "ME" }, { "name": "Montserrat", "dial_code": "+1664", "code": "MS" }, { "name": "Morocco", "dial_code": "+212", "code": "MA" }, { "name": "Mozambique", "dial_code": "+258", "code": "MZ" }, { "name": "Myanmar", "dial_code": "+95", "code": "MM" }, { "name": "Namibia", "dial_code": "+264", "code": "NA" }, { "name": "Nauru", "dial_code": "+674", "code": "NR" }, { "name": "Nepal", "dial_code": "+977", "code": "NP" }, { "name": "Netherlands", "dial_code": "+31", "code": "NL" }, { "name": "New Caledonia", "dial_code": "+687", "code": "NC" }, { "name": "New Zealand", "dial_code": "+64", "code": "NZ" }, { "name": "Nicaragua", "dial_code": "+505", "code": "NI" }, { "name": "Niger", "dial_code": "+227", "code": "NE" }, { "name": "Nigeria", "dial_code": "+234", "code": "NG" }, { "name": "Niue", "dial_code": "+683", "code": "NU" }, { "name": "Norfolk Island", "dial_code": "+672", "code": "NF" }, { "name": "Northern Mariana Islands", "dial_code": "+1670", "code": "MP" }, { "name": "Norway", "dial_code": "+47", "code": "NO" }, { "name": "Palau", "dial_code": "+680", "code": "PW" }, { "name": "Palestinian Territory, Occupied", "dial_code": "+970", "code": "PS" }, { "name": "Panama", "dial_code": "+507", "code": "PA" }, { "name": "Papua New Guinea", "dial_code": "+675", "code": "PG" }, { "name": "Paraguay", "dial_code": "+595", "code": "PY" }, { "name": "Peru", "dial_code": "+51", "code": "PE" }, { "name": "Philippines", "dial_code": "+63", "code": "PH" }, { "name": "Pitcairn", "dial_code": "+872", "code": "PN" }, { "name": "Poland", "dial_code": "+48", "code": "PL" }, { "name": "Portugal", "dial_code": "+351", "code": "PT" }, { "name": "Puerto Rico", "dial_code": "+1939", "code": "PR" }, { "name": "Réunion", "dial_code": "+262", "code": "RE" }, { "name": "Romania", "dial_code": "+40", "code": "RO" }, { "name": "Russia", "dial_code": "+7", "code": "RU" }, { "name": "Rwanda", "dial_code": "+250", "code": "RW" }, { "name": "Saint Barthélemy", "dial_code": "+590", "code": "BL" }, { "name": "Saint Helena, Ascension and Tristan da Cunha", "dial_code": "+290", "code": "SH" }, { "name": "Saint Kitts and Nevis", "dial_code": "+1869", "code": "KN" }, { "name": "Saint Lucia", "dial_code": "+1758", "code": "LC" }, { "name": "Saint Martin", "dial_code": "+590", "code": "MF" }, { "name": "Saint Pierre and Miquelon", "dial_code": "+508", "code": "PM" }, { "name": "Saint Vincent and the Grenadines", "dial_code": "+1784", "code": "VC" }, { "name": "Samoa", "dial_code": "+685", "code": "WS" }, { "name": "San Marino", "dial_code": "+378", "code": "SM" }, { "name": "Sao Tome and Principe", "dial_code": "+239", "code": "ST" }, { "name": "Senegal", "dial_code": "+221", "code": "SN" }, { "name": "Serbia", "dial_code": "+381", "code": "RS" }, { "name": "Seychelles", "dial_code": "+248", "code": "SC" }, { "name": "Sierra Leone", "dial_code": "+232", "code": "SL" }, { "name": "Singapore", "dial_code": "+65", "code": "SG" }, { "name": "Slovakia", "dial_code": "+421", "code": "SK" }, { "name": "Slovenia", "dial_code": "+386", "code": "SI" }, { "name": "Solomon Islands", "dial_code": "+677", "code": "SB" }, { "name": "Somalia", "dial_code": "+252", "code": "SO" }, { "name": "South Africa", "dial_code": "+27", "code": "ZA" }, { "name": "South Georgia and the South Sandwich Islands", "dial_code": "+500", "code": "GS" }, { "name": "Spain", "dial_code": "+34", "code": "ES" }, { "name": "Sri Lanka", "dial_code": "+94", "code": "LK" }, { "name": "Sudan", "dial_code": "+249", "code": "SD" }, { "name": "Suriname", "dial_code": "+597", "code": "SR" }, { "name": "Svalbard and Jan Mayen", "dial_code": "+47", "code": "SJ" }, { "name": "Swaziland", "dial_code": "+268", "code": "SZ" }, { "name": "Sweden", "dial_code": "+46", "code": "SE" }, { "name": "Switzerland", "dial_code": "+41", "code": "CH" }, { "name": "Syrian Arab Republic", "dial_code": "+963", "code": "SY" }, { "name": "Taiwan, Province of China", "dial_code": "+886", "code": "TW" }, { "name": "Tajikistan", "dial_code": "+992", "code": "TJ" }, { "name": "Tanzania, United Republic of", "dial_code": "+255", "code": "TZ" }, { "name": "Thailand", "dial_code": "+66", "code": "TH" }, { "name": "Timor-Leste", "dial_code": "+670", "code": "TL" }, { "name": "Togo", "dial_code": "+228", "code": "TG" }, { "name": "Tokelau", "dial_code": "+690", "code": "TK" }, { "name": "Tonga", "dial_code": "+676", "code": "TO" }, { "name": "Trinidad and Tobago", "dial_code": "+1868", "code": "TT" }, { "name": "Tunisia", "dial_code": "+216", "code": "TN" }, { "name": "Turkey", "dial_code": "+90", "code": "TR" }, { "name": "Turkmenistan", "dial_code": "+993", "code": "TM" }, { "name": "Turks and Caicos Islands", "dial_code": "+1649", "code": "TC" }, { "name": "Tuvalu", "dial_code": "+688", "code": "TV" }, { "name": "Uganda", "dial_code": "+256", "code": "UG" }, { "name": "Ukraine", "dial_code": "+380", "code": "UA" }, { "name": "Uruguay", "dial_code": "+598", "code": "UY" }, { "name": "Uzbekistan", "dial_code": "+998", "code": "UZ" }, { "name": "Vanuatu", "dial_code": "+678", "code": "VU" }, { "name": "Venezuela, Bolivarian Republic of", "dial_code": "+58", "code": "VE" }, { "name": "Viet Nam", "dial_code": "+84", "code": "VN" }, { "name": "Virgin Islands, British", "dial_code": "+1284", "code": "VG" }, { "name": "Virgin Islands, U.S.", "dial_code": "+1340", "code": "VI" }, { "name": "Wallis and Futuna", "dial_code": "+681", "code": "WF" }, { "name": "Yemen", "dial_code": "+967", "code": "YE" }, { "name": "Zambia", "dial_code": "+260", "code": "ZM" }, { "name": "Zimbabwe", "dial_code": "+263", "code": "ZW" }
];
const aestheticStyles = ['Minimalist & Clean', 'Luxury & Elegant', 'High-Tech & Futuristic', 'Industrial & Raw', 'Biophilic & Natural', 'Bold & Colorful'];
const functionalityOptions = [
    'Reception / Welcome Desk', 'Hostess', 'Casual Meeting Area', 'Private Meeting Room', 'Product Display Zones', 'Live Demo Area', 'Hospitality / Bar', 'Storage Room', 'Video Wall / LED Screen', 'Interactive Station', 'Photo Booth Area'
];

interface FormData {
    event: string;
    industry: string;
    width: number;
    depth: number;
    height: number;
    layout: string;
    layoutDescription: string;
    type: string;
    structure: string;
    functionality: string[];
    style: string;
    logo: File | null;
    logoPreview: string;
    colors: string[];
    specialRequests: string;
    userName: string;
    userEmail: string;
    userMobile: string;
    dialCode: string;
}

const initialFormData: FormData = {
    event: '', industry: '', width: 6, depth: 4, height: 4, layout: 'Corner', layoutDescription: 'Open on two sides.', type: 'Custom Built', structure: 'Single Story', functionality: [], style: 'Minimalist & Clean', logo: null, logoPreview: '', colors: [], specialRequests: '', userName: '', userEmail: '', userMobile: '', dialCode: '+971',
};

const steps = [
    { name: 'Show Details', icon: Building },
    { name: 'Structure', icon: Scaling },
    { name: "Aesthetics", icon: Palette },
    { name: "Review & Contact", icon: User },
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

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

// --- Component ---

const ExhibitionStudioPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentStep, setCurrentStep] = useState(() => {
        const stepParam = searchParams.get('step');
        const initialStep = stepParam ? parseInt(stepParam, 10) : 0;
        return Math.max(0, Math.min(initialStep, steps.length));
    });
    
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedConcepts, setGeneratedConcepts] = useState<any[]>([]);
    const [isFinished, setIsFinished] = useState(false);
    const [isExtractingColors, setIsExtractingColors] = useState(false);
    const [suggestedColors, setSuggestedColors] = useState<string[]>([]);
    const [selectedConcept, setSelectedConcept] = useState<number | null>(null);
    const [isProposalRequested, setIsProposalRequested] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const { ensureApiKey, handleApiError, error: apiKeyError, clearError: clearApiKeyError } = useApiKey();
    const debouncedEventName = useDebounce(formData.event, 1000);

    const analyzeEvent = async (eventName: string) => {
        clearAllErrors();
        if (!eventName || !await ensureApiKey()) return;
        setIsAnalyzing(true);
        try {
            // Fetch industry
            const industryRes = await fetch('/api/analyze-event-industry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventName })
            });
            if (industryRes.ok) {
                const industryData = await industryRes.json();
                setFormData(p => ({ ...p, industry: industryData.industry || '' }));
            }

            // Fetch style
            const styleRes = await fetch('/api/analyze-show-style', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventName, industryContext: formData.industry, availableStyles: aestheticStyles })
            });
            if (styleRes.ok) {
                const styleData = await styleRes.json();
                if (styleData.style && aestheticStyles.includes(styleData.style)) {
                    setFormData(p => ({ ...p, style: styleData.style }));
                }
            }
        } catch (e: any) {
            handleApiError(e);
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    useEffect(() => {
        if (debouncedEventName) {
            analyzeEvent(debouncedEventName);
        }
        if (error) {
            setIsAnalyzing(false);
        }
    }, [debouncedEventName]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [localError, setLocalError] = useState<string | null>(null);
    
    const error = apiKeyError || localError;

    useEffect(() => {
        setSearchParams({ step: currentStep.toString() });
    }, [currentStep, setSearchParams]);

    const setError = (message: string | null) => {
        clearApiKeyError();
        setLocalError(message);
    };

    const clearAllErrors = () => {
        setLocalError(null);
        clearApiKeyError();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = parseInt(value, 10);
        if (numValue >= 1) {
            setFormData(prev => ({ ...prev, [name]: numValue }));
        }
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
        setFormData(prev => ({ ...prev, colors: [] }));
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
                setFormData(prev => ({ ...prev, colors: extracted }));
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

    const handleFileUpload = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            clearAllErrors();
            const logoPreview = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, logo: file, logoPreview, colors: [] }));
            extractColorsFromLogo(file);
        } else {
            setError("Please upload a valid image file (PNG, JPG, SVG, etc.).");
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
        }
    };
    
    const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            handleFileUpload(event.dataTransfer.files[0]);
        }
    };

    const validateStep = (step: number, shouldSetError: boolean): boolean => {
        let errorMessage = '';
        switch (step) {
            case 0:
                if (formData.event.trim() === '') errorMessage = "Please enter the event name.";
                else if (formData.industry.trim() === '') errorMessage = "Please provide the industry for the event.";
                break;
            case 1:
                const { structure, height } = formData;
                if (structure === 'Double Decker' && height < 5) {
                    errorMessage = 'Double Decker stands must have a minimum height of 5 meters.';
                }
                break;
            case 2:
                if (!formData.logo) errorMessage = "Please upload your company logo.";
                else if (formData.colors.length === 0) errorMessage = "Please select or provide your brand colors.";
                break;
            case 3:
                if (!formData.userName.trim() || !formData.userEmail.trim() || !formData.userMobile.trim()) errorMessage = "Please fill in all your contact details.";
                else if (!/\S+@\S+\.\S+/.test(formData.userEmail)) errorMessage = "Please enter a valid email address.";
                break;
        }
        if (errorMessage && shouldSetError) setError(errorMessage);
        return !errorMessage;
    }
    
    const nextStep = () => {
        clearAllErrors();
        if (validateStep(currentStep, true)) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length));
        }
    };

    const prevStep = () => {
        clearAllErrors();
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
                event: formData.event,
                industry: formData.industry,
                dimensions: `${formData.width}m wide x ${formData.depth}m deep x ${formData.height}m high`,
                layout: formData.layout,
                layoutDescription: formData.layoutDescription,
                type: formData.type,
                structure: formData.structure,
                functionality: formData.functionality.join(', ') || 'Not specified',
                style: formData.style,
                colors: formData.colors.join(', '),
                specialRequests: formData.specialRequests,
            };
            const response = await fetch('/api/generate-images', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ logo: logoBase64, mimeType: formData.logo.type, promptData })
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
            setCurrentStep(steps.length);
        } catch (e: any) {
            handleApiError(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (apiKeyError) return;
        clearAllErrors();
        for (let i = 0; i < steps.length; i++) {
            if (!validateStep(i, true)) {
                setCurrentStep(i); 
                return;
            }
        }
        generateDesign();
    };

    const sendProposalRequest = async () => {
        if (selectedConcept === null) return;
        setIsSending(true);
        console.log("--- PROPOSAL REQUEST (SIMULATED) ---", { ...formData, logo: formData.logo?.name, selectedConcept: generatedConcepts[selectedConcept] });
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSending(false);
        setIsProposalRequested(true);
    };

    const isNextButtonDisabled = (currentStep === 2 && isExtractingColors) || isAnalyzing;

    const aiDesignBrief = useMemo(() => {
        let brief = `A photorealistic concept for a bespoke exhibition stand with the following specifications:\n\n`;
        brief += `• Event & Industry: ${formData.event || 'Not specified'} (${formData.industry || 'N/A'})\n`;
        brief += `• Dimensions: ${formData.width}m x ${formData.depth}m x ${formData.height}m\n`;
        brief += `• Layout: ${formData.layout} (${formData.layoutDescription})\n`;
        brief += `• Type: ${formData.type}\n`;
        brief += `• Structure: ${formData.structure}\n`;
        brief += `• Aesthetic Style: ${formData.style}\n`;
        brief += `• Functionality: ${formData.functionality.length > 0 ? formData.functionality.join(', ') : 'Not specified'}\n`;
        brief += `• Brand Colors: ${formData.colors.length > 0 ? formData.colors.join(', ') : 'Not specified'}\n`;
        if (formData.specialRequests) {
            brief += `• Special Requests: ${formData.specialRequests}\n`;
        }
        return brief;
    }, [formData]);

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Show Details
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif text-white mb-4">Step 1: Show Details</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="event" className="block text-sm font-medium text-fann-light-gray mb-2">Exhibition Name</label>
                                <div className="relative">
                                    <input id="event" name="event" type="text" value={formData.event} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" placeholder="e.g., GITEX Global, Arab Health" />
                                    {isAnalyzing && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-fann-light-gray" />}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="industry" className="block text-sm font-medium text-fann-light-gray mb-2">Industry</label>
                                <input id="industry" name="industry" type="text" value={formData.industry} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" placeholder="e.g., Technology, Healthcare" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-fann-light-gray mb-2">Stand Dimensions (in meters)</label>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="width" className="text-xs text-fann-light-gray">Width</label>
                                    <input id="width" name="width" type="number" value={formData.width} onChange={handleDimensionChange} className="w-full mt-1 bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" />
                                </div>
                                <div>
                                    <label htmlFor="depth" className="text-xs text-fann-light-gray">Depth</label>
                                    <input id="depth" name="depth" type="number" value={formData.depth} onChange={handleDimensionChange} className="w-full mt-1 bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" />
                                </div>
                                <div>
                                    <label htmlFor="height" className="text-xs text-fann-light-gray">Height</label>
                                    <select id="height" name="height" value={formData.height} onChange={handleInputChange} className="w-full mt-1 bg-fann-charcoal border border-fann-border rounded-md px-3 py-2">
                                        {[...Array(5)].map((_, i) => <option key={i+2} value={i+2}>{i+2}m</option>)}
                                        <option value="6">6m</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-fann-light-gray mb-2">Stand Layout</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {[ { name: 'Island', desc: 'Open on all four sides.' }, { name: 'Corner', desc: 'Open on two sides.' }, { name: 'Peninsula', desc: 'Open on three sides.' }, { name: 'Inline', desc: 'Open on one side.' } ].map(l => (
                                    <button type="button" key={l.name} onClick={() => setFormData(p => ({ ...p, layout: l.name, layoutDescription: l.desc }))} className={`p-3 rounded-lg border-2 text-left text-sm transition-colors ${formData.layout === l.name ? 'border-fann-teal bg-fann-teal/10' : 'border-fann-border hover:border-fann-teal/50'}`}>
                                        <p className="font-bold">{l.name}</p>
                                        <p className="text-xs text-fann-light-gray">{l.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 1: // Structure
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif text-white mb-4">Step 2: Structural Configuration</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-fann-light-gray mb-2">Stand Type</label>
                                <select id="type" name="type" value={formData.type} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2">
                                    <option>Shell Scheme</option>
                                    <option>Modular</option>
                                    <option>Custom Built</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="structure" className="block text-sm font-medium text-fann-light-gray mb-2">Structure</label>
                                <select id="structure" name="structure" value={formData.structure} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2">
                                    <option>Single Story</option>
                                    <option>Double Decker</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-fann-light-gray mb-2">Functionality Requirements</label>
                            <p className="text-fann-light-gray text-xs mb-3">Select all the features you require for your stand.</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {functionalityOptions.map(item => (
                                    <button type="button" key={item} onClick={() => handleFunctionalityChange(item)} className={`p-3 rounded-lg border-2 text-left text-sm transition-colors flex items-center gap-2 ${formData.functionality.includes(item) ? 'border-fann-teal bg-fann-teal/10' : 'border-fann-border hover:border-fann-teal/50'}`}>
                                        <div className={`w-4 h-4 rounded-sm flex-shrink-0 border-2 ${formData.functionality.includes(item) ? 'bg-fann-teal border-fann-teal' : 'border-fann-light-gray'}`}/>
                                        <span>{item}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 2: // Aesthetics
                const handleColorToggle = (color: string) => {
                    setFormData(prev => {
                        const newColors = prev.colors.includes(color) ? prev.colors.filter(c => c !== color) : [...prev.colors, color];
                        return { ...prev, colors: newColors };
                    });
                };
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif text-white mb-4">Step 3: Aesthetics & Branding</h2>
                        <div>
                            <label htmlFor="style" className="block text-sm font-medium text-fann-light-gray mb-2">Overall Design Style</label>
                            <select id="style" name="style" value={formData.style} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2">
                                {aestheticStyles.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 items-start">
                            <div>
                                <label className="block text-sm font-medium text-fann-light-gray mb-2">Upload Your Logo (Vector Preferred)</label>
                                <div className="relative">
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        onDrop={onDrop}
                                        onDragOver={onDragOver}
                                        onDragLeave={onDragLeave}
                                        className={`h-48 w-full bg-fann-charcoal border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors ${isDragging ? 'border-fann-gold bg-fann-gold/10' : 'border-fann-border hover:border-fann-gold'}`}
                                    >
                                        {formData.logoPreview ? (
                                            <img src={formData.logoPreview} alt="Logo Preview" className={`max-h-full max-w-full object-contain p-4 transition-opacity ${isExtractingColors ? 'opacity-20' : ''}`} />
                                        ) : (
                                            <div className="text-center text-fann-light-gray">
                                                <Upload className="mx-auto w-8 h-8 mb-2" />
                                                <p className="font-semibold">Drop your logo here</p>
                                                <p className="text-sm">or click to browse</p>
                                            </div>
                                        )}
                                    </div>
                                    {isExtractingColors && (
                                        <div className="absolute inset-0 bg-fann-charcoal/80 rounded-lg flex flex-col items-center justify-center pointer-events-none">
                                            <Loader2 className="w-10 h-10 text-fann-gold animate-spin" />
                                            <p className="mt-3 font-semibold text-white">Extracting Colors...</p>
                                        </div>
                                    )}
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleLogoChange} className="hidden" accept="image/png, image/jpeg, image/svg+xml, image/webp, image/gif, .svg" />
                            </div>
                            <div>
                                <label htmlFor="colors" className="block text-sm font-medium text-fann-light-gray mb-2">Primary Brand Colors</label>
                                <input type="text" id="colors" name="colors" value={formData.colors.join(', ')} onChange={(e) => setFormData(p => ({...p, colors: e.target.value.split(',').map(c => c.trim()).filter(c => c)}))} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" placeholder="e.g., #0A192F, Fann Gold, White" />
                                <div className="mt-2 min-h-[4rem]">
                                    {isExtractingColors ? <div className="flex items-center gap-2 text-sm text-fann-light-gray"><Loader2 className="w-4 h-4 animate-spin"/>Analyzing...</div> : suggestedColors.length > 0 && suggestedColors[0] !== 'ERROR' ? (
                                        <div>
                                            <span className="flex items-center gap-1 text-green-400 mb-2 text-sm"><CheckCircle className="w-4 h-4"/>AI suggestions are ready. Click to select/deselect.</span>
                                            <div className="flex flex-wrap gap-2">
                                                {suggestedColors.map(color => {
                                                    const isSelected = formData.colors.includes(color);
                                                    return (<button type="button" key={color} onClick={() => handleColorToggle(color)} className={`flex items-center text-xs gap-1.5 p-1.5 rounded-md transition-all border ${isSelected ? 'border-fann-gold bg-fann-gold/10' : 'border-fann-border bg-fann-charcoal hover:border-fann-gold/50'}`}><div className="w-5 h-5 rounded border border-white/20" style={{ backgroundColor: color }}></div><span className="font-mono text-fann-light-gray">{color}</span></button>);
                                                })}
                                            </div>
                                        </div>
                                    ) : suggestedColors[0] === 'ERROR' ? (<span className="flex items-center gap-1 text-red-400 text-sm"><AlertCircle className="w-4 h-4"/>Could not extract colors. Please enter them manually.</span>) : <p className="text-sm text-fann-light-gray">Upload a logo to see suggestions.</p>}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="specialRequests" className="block text-sm font-medium text-fann-light-gray mb-2 flex items-center gap-2">
                                <MessageSquareQuote size={16} />
                                Special Requests / Creative Mandates (Optional)
                            </label>
                            <textarea
                                id="specialRequests"
                                name="specialRequests"
                                rows={4}
                                value={formData.specialRequests}
                                onChange={handleInputChange}
                                className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2"
                                placeholder="e.g., 'Incorporate a water feature', 'Use a lot of natural wood textures', 'The main color should be a deep blue, not the one from the logo.'"
                            />
                        </div>
                    </div>
                );
            case 3: // Review & Contact
                 return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif text-white text-center">Step 4: Review & Contact</h2>

                        <div className="bg-fann-charcoal p-4 rounded-lg border border-fann-border">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-fann-teal mb-3">
                                <FileText size={20} />
                                AI Design Brief Preview
                            </h3>
                            <p className="text-sm text-fann-light-gray whitespace-pre-wrap font-mono">{aiDesignBrief}</p>
                        </div>
                        
                        <p className="text-center text-fann-light-gray text-sm">Finally, please provide your details so we can send you the generated concepts.</p>
                        <div className="max-w-md mx-auto grid grid-cols-1 gap-4">
                            <div>
                                <label htmlFor="userName" className="block text-xs font-medium text-fann-light-gray mb-1"><User size={14} className="inline-block mr-1"/>Full Name</label>
                                <input type="text" id="userName" name="userName" value={formData.userName} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" />
                            </div>
                            <div>
                                <label htmlFor="userEmail" className="block text-xs font-medium text-fann-light-gray mb-1"><Mail size={14} className="inline-block mr-1"/>Email Address</label>
                                <input type="email" id="userEmail" name="userEmail" value={formData.userEmail} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" />
                            </div>
                            <div>
                                <label htmlFor="userMobile" className="block text-xs font-medium text-fann-light-gray mb-1"><Phone size={14} className="inline-block mr-1"/>Mobile Number</label>
                                <div className="flex">
                                    <select name="dialCode" value={formData.dialCode} onChange={handleInputChange} className="bg-fann-charcoal border border-fann-border rounded-l-md px-2 py-2 text-xs focus:outline-none">
                                        {countryCodes.map(c => <option key={c.code} value={c.dial_code}>{c.code} ({c.dial_code})</option>)}
                                    </select>
                                    <input type="tel" id="userMobile" name="userMobile" value={formData.userMobile} onChange={handleInputChange} className="w-full bg-fann-charcoal border-t border-r border-b border-fann-border rounded-r-md px-3 py-2" />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default: return null;
        }
    };
    
    if (isLoading) return (
        <div className="min-h-[70vh] flex flex-col justify-center items-center text-center p-4">
            <Loader2 className="w-16 h-16 text-fann-gold animate-spin" />
            <h2 className="text-3xl font-serif text-white mt-6">Crafting Your Vision...</h2>
            <p className="text-fann-light-gray mt-2 max-w-sm">Our AI is sketching concepts, applying your brand, and rendering photorealistic previews. This may take up to a minute.</p>
        </div>
    );
    
    if (isFinished && isProposalRequested) return (
        <div className="min-h-[70vh] flex flex-col justify-center items-center text-center p-4">
            <CheckCircle className="w-20 h-20 text-fann-teal mb-6" />
            <h1 className="text-5xl font-serif font-bold text-fann-gold mt-4 mb-4">Thank You!</h1>
            <p className="text-xl text-fann-cream max-w-2xl mx-auto mb-8">Our design team has received your concept selection. A detailed proposal will be prepared and sent to <strong>{formData.userEmail}</strong> shortly.</p>
            {selectedConcept !== null && <img src={generatedConcepts[selectedConcept].imageUrl} alt="Selected Concept" className="rounded-lg shadow-2xl w-full max-w-lg mt-8" />}
        </div>
    );

    if (isFinished) return (
        <div className="pb-20 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <Sparkles className="mx-auto h-12 w-12 text-fann-gold" />
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-fann-gold mt-4 mb-4">Your AI-Generated Concepts</h1>
                    <p className="text-lg text-fann-cream max-w-3xl mx-auto">Review the concepts below and select your favorite to receive a detailed proposal and quotation from our team.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3 space-y-8">
                        {generatedConcepts.map((concept, index) => (
                            <motion.div key={index} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.15 }} onClick={() => setSelectedConcept(index)} className={`rounded-lg overflow-hidden cursor-pointer border-4 transition-all duration-300 bg-fann-charcoal-light ${selectedConcept === index ? 'border-fann-gold' : 'border-transparent hover:border-fann-gold/30'}`}>
                                <img src={concept.imageUrl} alt={`AI Concept ${index + 1}`} className="w-full h-auto object-cover" />
                                <div className="p-6">
                                    <h2 className="text-2xl font-serif font-bold text-fann-gold">{concept.title}</h2>
                                    <p className="text-fann-cream mt-2">{concept.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="lg:col-span-2 self-start sticky top-24">
                        <div className="bg-fann-charcoal-light p-6 rounded-lg">
                            <h3 className="text-2xl font-serif text-fann-gold mb-4">Next Step</h3>
                            <p className="text-fann-light-gray mb-4">Once you've selected your preferred concept, click the button below to notify our design team.</p>
                            <motion.button onClick={sendProposalRequest} disabled={selectedConcept === null || isSending} className="w-full bg-fann-teal text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 disabled:bg-fann-charcoal disabled:text-fann-light-gray disabled:cursor-not-allowed" whileHover={{ scale: selectedConcept !== null && !isSending ? 1.05 : 1 }} whileTap={{ scale: selectedConcept !== null && !isSending ? 0.95 : 1 }}>
                                {isSending ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : "Request Detailed Proposal"}
                            </motion.button>
                            {selectedConcept === null && <p className="text-xs text-center text-fann-light-gray mt-2">Please select a design to proceed.</p>}
                        </div>
                         <button onClick={() => { setIsFinished(false); setCurrentStep(0); }} className="text-fann-light-gray text-sm mt-6 w-full text-center hover:text-white">Start Over</button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <div className="flex justify-between mb-2">
                    {steps.map((step, index) => (
                        <div key={step.name} className="flex flex-col items-center" style={{ width: `${100 / steps.length}%` }}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${currentStep >= index ? 'bg-fann-gold text-fann-charcoal' : 'bg-fann-charcoal-light text-fann-light-gray'}`}><step.icon size={16} /></div>
                            <span className={`text-xs mt-1 text-center ${currentStep >= index ? 'text-white' : 'text-fann-light-gray'}`}>{step.name}</span>
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
                                <div className="flex-grow"><span className="whitespace-pre-wrap">{error}</span></div>
                            </motion.div>
                        )}
                        <div className="flex justify-between items-center">
                            <motion.button type="button" onClick={prevStep} disabled={currentStep === 0} className="flex items-center gap-2 text-fann-gold disabled:text-fann-light-gray disabled:cursor-not-allowed" whileHover={{scale: currentStep !== 0 ? 1.05 : 1}} whileTap={{scale: currentStep !== 0 ? 0.95 : 1}}>
                                <ArrowLeft size={16} /> Back
                            </motion.button>
                            
                            {currentStep < steps.length - 1 ? (
                                <motion.button type="button" onClick={nextStep} disabled={isNextButtonDisabled} className="bg-fann-gold text-fann-charcoal font-bold py-2 px-6 rounded-full w-32 disabled:bg-fann-charcoal-light disabled:text-fann-light-gray disabled:cursor-not-allowed" whileHover={{scale: !isNextButtonDisabled ? 1.05 : 1}} whileTap={{scale: !isNextButtonDisabled ? 0.95 : 1}}>
                                    {isNextButtonDisabled ? <Loader2 className="w-5 h-5 mx-auto animate-spin" /> : 'Next'}
                                </motion.button>
                            ) : (
                                <motion.button type="submit" className="bg-fann-teal text-white font-bold py-2 px-6 rounded-full flex items-center gap-2" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                                    <Sparkles size={16} /> Generate My Concepts
                                </motion.button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExhibitionStudioPage;