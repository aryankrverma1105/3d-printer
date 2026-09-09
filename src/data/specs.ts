// Printer fleet and hardware capability parameters
// Note: All hardware details are marked as placeholder copy representing modern high-speed CoreXY additive manufacturing.
// PLACEHOLDER — confirm with business before launch: actual printer fleet hardware capabilities & vendor specs

export interface FleetSpecItem {
  label: string;
  value: string;
  description: string;
}

export const HARDWARE_SPECS: FleetSpecItem[] = [
  {
    label: 'Kinematic Architecture',
    value: 'CoreXY High-Speed Platform', // PLACEHOLDER — confirm with business before launch
    description: 'Precision linear rails with synchronous belt drives designed for high-acceleration additive deposition.',
  },
  {
    label: 'Bed Leveling',
    value: 'Automated Multi-Point Mesh Calibration', // PLACEHOLDER — confirm with business before launch
    description: 'Dual-sensor surface scanning ensures first-layer adhesion and consistent planar accuracy across the entire bed.',
  },
  {
    label: 'Extrusion System',
    value: 'Direct-Drive All-Metal Hotend', // PLACEHOLDER — confirm with business before launch
    description: 'Hardened steel gear drive capable of handling abrasive carbon-fiber filaments and high-temperature engineering polymers.',
  },
  {
    label: 'Layer Resolution Range',
    value: '0.08mm — 0.28mm Layer Deposition', // PLACEHOLDER — confirm with business before launch
    description: 'Micro-step Z-axis lead screws provide fine surface resolution down to 80 microns for aesthetic and functional parts.',
  },
  {
    label: 'Chamber Environment',
    value: 'Enclosed Thermally Regulated Chamber', // PLACEHOLDER — confirm with business before launch
    description: 'Maintains uniform ambient temperature to eliminate layer delamination and part warping in high-shrinkage materials.',
  },
  {
    label: 'Quality Assurance',
    value: 'Visual Layer Inspection & Defect Detection', // PLACEHOLDER — confirm with business before launch
    description: 'Continuous monitoring of extrusion uniformity and toolpath fidelity throughout the entire build cycle.',
  },
];
