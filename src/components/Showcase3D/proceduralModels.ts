import * as THREE from 'three';

export interface ModelMetadata {
  id: string;
  name: string;
  category: string;
  materialRecommendation: string;
  printTimeEstimate: string;
  description: string;
  manufacturingFeatures: string[];
}

export const MODELS_METADATA: ModelMetadata[] = [
  {
    id: 'bracket',
    name: 'Industrial Mounting Bracket',
    category: 'Structural Tooling',
    materialRecommendation: 'PETG Technical Slate',
    printTimeEstimate: '3h 15m',
    description:
      'Rigid L-bracket engineered with 90° dual stiffening gussets, slotted M4 alignment channels, and countersunk base bores for factory sensor assemblies.',
    manufacturingFeatures: [
      'Countersunk screw recesses',
      '45° load gusset (no support needed)',
      'High-impact perimeter walls',
    ],
  },
  {
    id: 'gear',
    name: 'Planetary Involute Gear',
    category: 'Kinematics & Power',
    materialRecommendation: 'PA-CF (Carbon Nylon)',
    printTimeEstimate: '2h 45m',
    description:
      '16-tooth precision transmission gear featuring calibrated tooth profile clearances, weight-relief pockets, and a keyed shaft hub for mechanical drivetrains.',
    manufacturingFeatures: [
      'Calibrated tooth tolerance (0.15mm gap)',
      'Integrated shaft keyway',
      'Balanced rotational mass',
    ],
  },
  {
    id: 'enclosure',
    name: 'IoT Telemetry Enclosure',
    category: 'Electronics Housing',
    materialRecommendation: 'ABS Matte Charcoal',
    printTimeEstimate: '4h 10m',
    description:
      'Two-piece friction snap-fit casing designed to house microcontrollers, status LEDs, and antenna pass-throughs with zero fastener requirement.',
    manufacturingFeatures: [
      'Internal PCB standoffs',
      'Perimeter dust seal lip',
      'Cantilever snap-fit latches',
    ],
  },
  {
    id: 'drone-arm',
    name: 'Generative Topology Drone Arm',
    category: 'Aerospace & Robotics',
    materialRecommendation: 'PLA-CF High-Rigidity',
    printTimeEstimate: '5h 20m',
    description:
      'FEA stress-optimized organic truss structure that reduces weight while preserving torsional rigidity under high motor thrust.',
    manufacturingFeatures: [
      'Continuous carbon fiber paths',
      'Zero-draft internal voids',
      'Motor mount clamp ring',
    ],
  },
  {
    id: 'lattice',
    name: 'Damping Octet-Truss Lattice',
    category: 'Additive Architectures',
    materialRecommendation: 'TPU Elastomer (95A)',
    printTimeEstimate: '6h 00m',
    description:
      'Interlocking multi-axis diagonal strut matrix providing progressive shock absorption, lightweighting, and acoustic vibration dampening.',
    manufacturingFeatures: [
      'Triply periodic minimal surface',
      'Gradient infill density',
      'High energy absorption',
    ],
  },
];

// Material configurations
const SOLID_COLOR = 0x22242b;
const WIREFRAME_COLOR = 0xff7a00;
const ACCENT_COLOR = 0xff7a00;

export function createModelMaterials(isWireframe: boolean) {
  if (isWireframe) {
    return {
      main: new THREE.MeshBasicMaterial({
        color: WIREFRAME_COLOR,
        wireframe: true,
      }),
      accent: new THREE.MeshBasicMaterial({
        color: WIREFRAME_COLOR,
        wireframe: true,
      }),
    };
  }

  return {
    main: new THREE.MeshStandardMaterial({
      color: SOLID_COLOR,
      roughness: 0.35,
      metalness: 0.25,
      flatShading: false,
    }),
    accent: new THREE.MeshStandardMaterial({
      color: ACCENT_COLOR,
      roughness: 0.25,
      metalness: 0.4,
      emissive: 0xff7a00,
      emissiveIntensity: 0.15,
    }),
  };
}

// 1. Procedural Mounting Bracket
export function createBracketModel(isWireframe = false): THREE.Group {
  const group = new THREE.Group();
  const mats = createModelMaterials(isWireframe);

  // Horizontal base
  const baseGeom = new THREE.BoxGeometry(2.4, 0.25, 1.6);
  const base = new THREE.Mesh(baseGeom, mats.main);
  base.position.set(0, 0.125, 0);
  group.add(base);

  // Vertical back plate
  const vertGeom = new THREE.BoxGeometry(2.4, 2.0, 0.25);
  const vert = new THREE.Mesh(vertGeom, mats.main);
  vert.position.set(0, 1.15, -0.675);
  group.add(vert);

  // Left Gusset Rib
  const gussetShape = new THREE.Shape();
  gussetShape.moveTo(0, 0);
  gussetShape.lineTo(1.1, 0);
  gussetShape.lineTo(0, 1.6);
  gussetShape.closePath();

  const extrudeSettings = { depth: 0.18, bevelEnabled: false };
  const gussetGeom = new THREE.ExtrudeGeometry(gussetShape, extrudeSettings);

  const gussetLeft = new THREE.Mesh(gussetGeom, mats.accent);
  gussetLeft.rotation.y = Math.PI / 2;
  gussetLeft.position.set(-0.85, 0.25, -0.55);
  group.add(gussetLeft);

  const gussetRight = new THREE.Mesh(gussetGeom, mats.accent);
  gussetRight.rotation.y = Math.PI / 2;
  gussetRight.position.set(0.67, 0.25, -0.55);
  group.add(gussetRight);

  // Screw hole indicators (cylinders)
  const holeGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.3, 12);
  [-0.7, 0.7].forEach((x) => {
    const hole = new THREE.Mesh(holeGeom, mats.accent);
    hole.position.set(x, 0.15, 0.35);
    group.add(hole);
  });

  group.position.set(0, -0.9, 0);
  return group;
}

// 2. Procedural Planetary Gear
export function createGearModel(isWireframe = false): THREE.Group {
  const group = new THREE.Group();
  const mats = createModelMaterials(isWireframe);

  // Central hub
  const hubGeom = new THREE.CylinderGeometry(1.6, 1.6, 0.4, 28);
  const hub = new THREE.Mesh(hubGeom, mats.main);
  group.add(hub);

  // Outer ring rim
  const rimGeom = new THREE.CylinderGeometry(1.85, 1.85, 0.35, 32);
  const rim = new THREE.Mesh(rimGeom, mats.main);
  group.add(rim);

  // Teeth (16 radial extruded teeth)
  const numTeeth = 16;
  const toothGeom = new THREE.BoxGeometry(0.24, 0.4, 0.38);
  for (let i = 0; i < numTeeth; i++) {
    const angle = (i / numTeeth) * Math.PI * 2;
    const tooth = new THREE.Mesh(toothGeom, mats.accent);
    const radius = 1.95;
    tooth.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
    tooth.rotation.y = -angle;
    group.add(tooth);
  }

  // Center axle bore with keyway
  const boreOuter = new THREE.CylinderGeometry(0.55, 0.55, 0.5, 16);
  const bore = new THREE.Mesh(boreOuter, mats.accent);
  group.add(bore);

  // 4 Weight-reduction cutouts
  const cutoutGeom = new THREE.CylinderGeometry(0.28, 0.28, 0.45, 12);
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const cutout = new THREE.Mesh(cutoutGeom, mats.accent);
    cutout.position.set(Math.cos(angle) * 1.1, 0, Math.sin(angle) * 1.1);
    group.add(cutout);
  }

  group.rotation.x = Math.PI / 3;
  return group;
}

// 3. Procedural Electronics Enclosure
export function createEnclosureModel(isWireframe = false): THREE.Group {
  const group = new THREE.Group();
  const mats = createModelMaterials(isWireframe);

  // Bottom base enclosure
  const bodyGeom = new THREE.BoxGeometry(2.4, 1.1, 1.8);
  const body = new THREE.Mesh(bodyGeom, mats.main);
  group.add(body);

  // Top lip seal
  const lipGeom = new THREE.BoxGeometry(2.48, 0.15, 1.88);
  const lip = new THREE.Mesh(lipGeom, mats.accent);
  lip.position.set(0, 0.6, 0);
  group.add(lip);

  // Snap latch ridges
  const latchGeom = new THREE.BoxGeometry(0.08, 0.35, 0.4);
  const latchL = new THREE.Mesh(latchGeom, mats.accent);
  latchL.position.set(1.24, 0.15, 0);
  group.add(latchL);

  const latchR = new THREE.Mesh(latchGeom, mats.accent);
  latchR.position.set(-1.24, 0.15, 0);
  group.add(latchR);

  // USB/Connector cutout recess
  const portGeom = new THREE.BoxGeometry(0.5, 0.22, 0.08);
  const port = new THREE.Mesh(portGeom, mats.accent);
  port.position.set(0, 0.1, 0.92);
  group.add(port);

  // 4 PCB Standoffs inside
  const standoffGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 8);
  [
    [-0.9, -0.6],
    [0.9, -0.6],
    [-0.9, 0.6],
    [0.9, 0.6],
  ].forEach(([x, z]) => {
    const post = new THREE.Mesh(standoffGeom, mats.accent);
    post.position.set(x, 0.55, z);
    group.add(post);
  });

  group.rotation.x = 0.2;
  group.rotation.y = -0.4;
  return group;
}

// 4. Procedural Drone Arm
export function createDroneArmModel(isWireframe = false): THREE.Group {
  const group = new THREE.Group();
  const mats = createModelMaterials(isWireframe);

  // Main spar
  const sparGeom = new THREE.BoxGeometry(2.8, 0.28, 0.35);
  const spar = new THREE.Mesh(sparGeom, mats.main);
  group.add(spar);

  // Motor mount collar at end
  const collarGeom = new THREE.CylinderGeometry(0.65, 0.65, 0.35, 24);
  const collar = new THREE.Mesh(collarGeom, mats.accent);
  collar.position.set(1.4, 0, 0);
  group.add(collar);

  // Inner motor hole
  const innerHoleGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16);
  const innerHole = new THREE.Mesh(innerHoleGeom, mats.main);
  innerHole.position.set(1.4, 0, 0);
  group.add(innerHole);

  // Root mounting clevis at base
  const clevisGeom = new THREE.BoxGeometry(0.6, 0.55, 0.6);
  const clevis = new THREE.Mesh(clevisGeom, mats.main);
  clevis.position.set(-1.35, 0, 0);
  group.add(clevis);

  // Lightening diagonal organic truss ribs
  const ribGeom = new THREE.BoxGeometry(0.5, 0.18, 0.08);
  for (let i = 0; i < 4; i++) {
    const rib = new THREE.Mesh(ribGeom, mats.accent);
    rib.position.set(-0.7 + i * 0.5, 0, 0.18);
    rib.rotation.z = (i % 2 === 0 ? 1 : -1) * 0.45;
    group.add(rib);
  }

  group.rotation.z = -0.15;
  group.rotation.y = 0.3;
  return group;
}

// 5. Procedural Octet Lattice Block
export function createLatticeModel(isWireframe = false): THREE.Group {
  const group = new THREE.Group();
  const mats = createModelMaterials(isWireframe);

  // Bounding frame struts
  const strutGeomX = new THREE.CylinderGeometry(0.06, 0.06, 2.0, 8);
  const strutGeomDiag = new THREE.CylinderGeometry(0.05, 0.05, 2.8, 8);
  const nodeGeom = new THREE.SphereGeometry(0.12, 10, 8);

  const coords = [-1, 1];

  // 8 Corner nodes
  coords.forEach((x) => {
    coords.forEach((y) => {
      coords.forEach((z) => {
        const node = new THREE.Mesh(nodeGeom, mats.accent);
        node.position.set(x, y, z);
        group.add(node);
      });
    });
  });

  // Perimeter X struts
  coords.forEach((y) => {
    coords.forEach((z) => {
      const strut = new THREE.Mesh(strutGeomX, mats.main);
      strut.rotation.z = Math.PI / 2;
      strut.position.set(0, y, z);
      group.add(strut);
    });
  });

  // Perimeter Y struts
  coords.forEach((x) => {
    coords.forEach((z) => {
      const strut = new THREE.Mesh(strutGeomX, mats.main);
      strut.position.set(x, 0, z);
      group.add(strut);
    });
  });

  // Perimeter Z struts
  coords.forEach((x) => {
    coords.forEach((y) => {
      const strut = new THREE.Mesh(strutGeomX, mats.main);
      strut.rotation.x = Math.PI / 2;
      strut.position.set(x, y, 0);
      group.add(strut);
    });
  });

  // Internal cross diagonal struts (showing 3D printed additive truss capability)
  const d1 = new THREE.Mesh(strutGeomDiag, mats.accent);
  d1.rotation.set(0.78, 0, 0.78);
  group.add(d1);

  const d2 = new THREE.Mesh(strutGeomDiag, mats.accent);
  d2.rotation.set(-0.78, 0, 0.78);
  group.add(d2);

  group.rotation.x = 0.4;
  group.rotation.y = 0.6;
  return group;
}

// Factory function
export function getProceduralModel(id: string, isWireframe = false): THREE.Group {
  switch (id) {
    case 'bracket':
      return createBracketModel(isWireframe);
    case 'gear':
      return createGearModel(isWireframe);
    case 'enclosure':
      return createEnclosureModel(isWireframe);
    case 'drone-arm':
      return createDroneArmModel(isWireframe);
    case 'lattice':
      return createLatticeModel(isWireframe);
    default:
      return createBracketModel(isWireframe);
  }
}
