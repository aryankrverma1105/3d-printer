// Engineering application domains for Sologix Energy

export interface ApplicationItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  leadTime: string; // Qualitative
  geometryType: string;
  typicalMaterials: string[];
}

export const APPLICATIONS: ApplicationItem[] = [
  {
    id: 'functional-prototypes',
    tag: '01 / R&D',
    title: 'Functional Prototyping',
    description: 'Transform digital CAD concepts into real physical prototypes with fast turnaround for ergonomic assessment, physical testing, and stakeholder alignment.',
    leadTime: 'Fast turnaround on demand', // PLACEHOLDER — confirm with business before launch: turnaround SLA
    geometryType: 'High-complexity internal chambers & organic curves',
    typicalMaterials: ['PLA-CF', 'PETG', 'ABS'],
  },
  {
    id: 'industrial-jigs',
    tag: '02 / MANUFACTURING',
    title: 'Custom Tooling, Jigs & Fixtures',
    description: 'Rapidly produce lightweight, custom assembly jigs and inspection fixtures directly on-site to reduce assembly cycle times and prevent workpiece scratching.',
    leadTime: 'Same-week manufacturing', // PLACEHOLDER — confirm with business before launch: turnaround SLA
    geometryType: 'Ergonomic grips, mounting holes, precision guide channels',
    typicalMaterials: ['PA-CF', 'PETG', 'TPU'],
  },
  {
    id: 'electronic-enclosures',
    tag: '03 / HARDWARE',
    title: 'Electronics & Sensor Enclosures',
    description: 'Custom-fit waterproof and dust-resistant housings designed for IoT sensors, PCBs, and battery modules with integrated snap-fits and brass threaded inserts.',
    leadTime: 'Iterative batch production', // PLACEHOLDER — confirm with business before launch: turnaround SLA
    geometryType: 'Thin-wall precision, wire routing passages, snap joints',
    typicalMaterials: ['ABS/ASA', 'PETG', 'PLA'],
  },
  {
    id: 'aerospace-robotics',
    tag: '04 / ROBOTICS',
    title: 'Drone & Robotic Components',
    description: 'Lightweight structural brackets, motor mounts, and air ducts optimized through generative topology to minimize payload mass while preserving stiffness.',
    leadTime: 'On-demand production', // PLACEHOLDER — confirm with business before launch: turnaround SLA
    geometryType: 'Topologically optimized organic trusses & lattice cores',
    typicalMaterials: ['PA-CF', 'ASA'],
  },
  {
    id: 'architectural-models',
    tag: '05 / DESIGN',
    title: 'Architectural & Masterplan Visuals',
    description: 'High-detail topographic scales, facade mockups, and client presentation centerpieces produced with crisp geometric edge retention and zero warp.',
    leadTime: 'Scheduled milestone delivery', // PLACEHOLDER — confirm with business before launch: turnaround SLA
    geometryType: 'Micro-scale geometric grids & cantilevered facades',
    typicalMaterials: ['PLA Matte', 'Specialty Resin'],
  },
  {
    id: 'small-batch',
    tag: '06 / PRODUCTION',
    title: 'Low-Volume Production Runs',
    description: 'Bridge production from 10 to 500+ units without upfront tooling costs or lengthy steel mold lead times. Update design files on the fly between print batches.',
    leadTime: 'Scalable batch schedule', // PLACEHOLDER — confirm with business before launch: turnaround SLA
    geometryType: 'Standardized end-use consumer & commercial components',
    typicalMaterials: ['PETG', 'ABS', 'PA-CF'],
  },
];
