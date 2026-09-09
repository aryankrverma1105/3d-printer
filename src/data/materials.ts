// Materials data configuration for Sologix Energy
// Note: All unverified material numbers have been replaced with qualitative descriptors.
// PLACEHOLDER — confirm with business before launch: verified material data sheets & manufacturer certifications

export interface MaterialItem {
  id: string;
  name: string;
  category: 'Standard' | 'Engineering' | 'Flexible' | 'Composite';
  summary: string;
  thermalResistance: string; // Qualitative
  rigidityStrength: string;  // Qualitative
  impactResistance: string;  // Qualitative
  surfaceFinish: string;
  bestFor: string[];
  recommendedLayerHeight: string;
  availability: string;
}

export const MATERIALS: MaterialItem[] = [
  {
    id: 'pla-cf',
    name: 'PLA / PLA Carbon Fiber',
    category: 'Standard',
    summary: 'High-rigidity standard prototyping material enhanced with microscopic carbon fibers for superior dimensional stability and a matte textured finish.',
    thermalResistance: 'Moderate (Indoor & Form Evaluation)', // PLACEHOLDER — confirm with business before launch
    rigidityStrength: 'High flexural rigidity, low shrinkage', // PLACEHOLDER — confirm with business before launch
    impactResistance: 'Standard / Brittle under sudden shock', // PLACEHOLDER — confirm with business before launch
    surfaceFinish: 'Matte carbon texture, layer lines nearly imperceptible',
    bestFor: ['Visual Prototypes', 'Architectural Models', 'Form-Fit Enclosures', 'Ergonomic Studies'],
    recommendedLayerHeight: '0.12mm - 0.20mm',
    availability: 'Readily Available on all standard production lines',
  },
  {
    id: 'petg',
    name: 'PETG (Polyethylene Terephthalate)',
    category: 'Standard',
    summary: 'Durable, moisture-resistant polymer offering excellent layer adhesion and ductility. Ideal for end-use functional assemblies and liquid-contact enclosures.',
    thermalResistance: 'Enhanced thermal threshold suitable for mild outdoor exposure', // PLACEHOLDER — confirm with business before launch
    rigidityStrength: 'Balanced tensile strength with semi-flexible yield', // PLACEHOLDER — confirm with business before launch
    impactResistance: 'High impact resilience, resists shattering under stress', // PLACEHOLDER — confirm with business before launch
    surfaceFinish: 'Semi-gloss, smooth technical surface',
    bestFor: ['Fluid Containers', 'Snap-Fit Joints', 'Outdoor Housings', 'Mechanical Covers'],
    recommendedLayerHeight: '0.16mm - 0.24mm',
    availability: 'Readily Available with multi-color options',
  },
  {
    id: 'abs-asa',
    name: 'ABS / ASA Industrial',
    category: 'Engineering',
    summary: 'Engineered thermoplastics for demanding mechanical parts requiring heat tolerance, UV resistance, and smooth post-processing capability.',
    thermalResistance: 'High temperature resistance for automotive & engine bay environments', // PLACEHOLDER — confirm with business before launch
    rigidityStrength: 'High structural integrity under mechanical loads', // PLACEHOLDER — confirm with business before launch
    impactResistance: 'High impact & shock absorption', // PLACEHOLDER — confirm with business before launch
    surfaceFinish: 'Satin finish, acetone vapor smoothing compatible',
    bestFor: ['Automotive Interior Parts', 'Industrial Ducting', 'Enclosure Housings', 'Field Testing'],
    recommendedLayerHeight: '0.12mm - 0.20mm',
    availability: 'Available on enclosed chamber production lines',
  },
  {
    id: 'tpu',
    name: 'TPU Elastomer (95A / 85A)',
    category: 'Flexible',
    summary: 'Thermoplastic polyurethane engineered for elastomeric parts requiring repetitive flexing, vibration dampening, and abrasion resistance.',
    thermalResistance: 'Stable across ambient temperatures without embrittlement', // PLACEHOLDER — confirm with business before launch
    rigidityStrength: 'Elastic recovery with exceptional tear resistance', // PLACEHOLDER — confirm with business before launch
    impactResistance: 'Maximum impact dampening & energy absorption', // PLACEHOLDER — confirm with business before launch
    surfaceFinish: 'Rubberized tactile grip with high friction coefficient',
    bestFor: ['Custom Gaskets & Seals', 'Vibration Isolators', 'Protective Bumpers', 'Wearable Grips'],
    recommendedLayerHeight: '0.20mm',
    availability: 'Available via direct-drive precision extruders',
  },
  {
    id: 'pa-cf',
    name: 'PA-CF (High-Performance Carbon Nylon)',
    category: 'Composite',
    summary: 'Ultra-tough engineering polyamide infused with chopped carbon fibers. Delivers metal-replacement stiffness and exceptional thermal endurance.',
    thermalResistance: 'Superior thermal deflection under heavy load', // PLACEHOLDER — confirm with business before launch
    rigidityStrength: 'Outstanding stiffness-to-weight ratio comparable to aluminum brackets', // PLACEHOLDER — confirm with business before launch
    impactResistance: 'Extreme fatigue and cyclic load endurance', // PLACEHOLDER — confirm with business before launch
    surfaceFinish: 'Machined-like graphite matte sheen',
    bestFor: ['Robotic Arms', 'Aerospace Jigs', 'Custom Tooling Fixtures', 'Structural Mounts'],
    recommendedLayerHeight: '0.12mm - 0.16mm',
    availability: 'Hardened nozzle & heated chamber configuration required',
  },
];
