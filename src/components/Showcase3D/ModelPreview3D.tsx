import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import {
  MODELS_METADATA,
  getProceduralModel,
} from './proceduralModels';
import {
  RotateCcw,
  Maximize2,
  Box,
  Layers,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  X,
} from 'lucide-react';

interface ModelPreview3DProps {
  onSelectModelForQuote?: (modelName: string, material: string) => void;
}

export const ModelPreview3D: React.FC<ModelPreview3DProps> = ({
  onSelectModelForQuote,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const prefersReducedMotion = useReducedMotion();

  // Active state
  const [activeModelId, setActiveModelId] = useState<string>('bracket');
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [isTouchActive, setIsTouchActive] = useState<boolean>(false);
  const [isUserInteracting, setIsUserInteracting] = useState<boolean>(false);

  // Active metadata
  const activeMeta =
    MODELS_METADATA.find((m) => m.id === activeModelId) || MODELS_METADATA[0];

  // Refs for WebGL scene management
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Helper to safely dispose of three.js objects
  const disposeGroup = (group: THREE.Group) => {
    group.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else if (mesh.material) {
          mesh.material.dispose();
        }
      }
    });
  };

  // Swap active model within the existing single WebGL canvas
  const updateModelInScene = useCallback(
    (modelId: string, wireframe: boolean) => {
      const scene = sceneRef.current;
      if (!scene) return;

      if (modelGroupRef.current) {
        scene.remove(modelGroupRef.current);
        disposeGroup(modelGroupRef.current);
        modelGroupRef.current = null;
      }

      const newGroup = getProceduralModel(modelId, wireframe);
      modelGroupRef.current = newGroup;
      scene.add(newGroup);

      // Reset camera view slightly for the new model
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
      }
    },
    []
  );

  // Initialize Three.js WebGL Scene (Single Canvas reused throughout lifecycle)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
    camera.position.set(3.5, 2.5, 4.5);
    cameraRef.current = camera;

    // Renderer (strictly 1 context, capped resolution for low-end hardware)
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    // OrbitControls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 2.5;
    controls.maxDistance = 7.5;
    controls.autoRotate = !prefersReducedMotion;
    controls.autoRotateSpeed = 1.5;
    controlsRef.current = controls;

    // Pause auto-rotation on user drag, resume after 3s of idle
    const handleInteractionStart = () => {
      setIsUserInteracting(true);
      controls.autoRotate = false;
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };

    const handleInteractionEnd = () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = setTimeout(() => {
        setIsUserInteracting(false);
        if (!prefersReducedMotion) {
          controls.autoRotate = true;
        }
      }, 3000);
    };

    controls.addEventListener('start', handleInteractionStart);
    controls.addEventListener('end', handleInteractionEnd);

    // Studio Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const amberFill = new THREE.DirectionalLight(0xff7a00, 1.2);
    amberFill.position.set(-5, -2, -4);
    scene.add(amberFill);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.9);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    // Add initial procedural model
    updateModelInScene(activeModelId, isWireframe);

    // Responsive resize handler
    const handleResize = () => {
      const container = containerRef.current;
      if (!container || !renderer || !camera) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // 60FPS RAF Render loop
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      rafIdRef.current = requestAnimationFrame(animate);
    };
    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      controls.removeEventListener('start', handleInteractionStart);
      controls.removeEventListener('end', handleInteractionEnd);

      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);

      if (modelGroupRef.current) {
        disposeGroup(modelGroupRef.current);
      }
      controls.dispose();
      renderer.dispose();
    };
  }, [prefersReducedMotion, updateModelInScene]);

  // Handle model change or wireframe toggle
  useEffect(() => {
    updateModelInScene(activeModelId, isWireframe);
  }, [activeModelId, isWireframe, updateModelInScene]);

  // Reset camera view
  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(3.5, 2.5, 4.5);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  return (
    <section
      id="models"
      className="relative py-28 bg-[#0A0A0B] border-t border-white/5 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A00]" />
              <span className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase font-semibold">
                ILLUSTRATIVE GEOMETRIES // CAPABILITY PREVIEW
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight uppercase">
              SEE THE PRECISION WE PRINT
            </h2>
          </div>

          <p className="max-w-md text-zinc-300 text-base font-sans leading-relaxed">
            Interactive preview of achievable geometric tolerances, snap-fits, and internal infill structures printed from client-supplied CAD models. We manufacture strictly to your engineering specifications with zero tooling lock-in.
          </p>
        </div>

        {/* Model Selector Tabs (Categorized & Browsable) */}
        <div className="flex flex-wrap items-center gap-2.5 mb-8">
          {MODELS_METADATA.map((model) => {
            const isSelected = activeModelId === model.id;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => setActiveModelId(model.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-sm text-xs sm:text-sm font-mono uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#FF7A00] text-black font-bold shadow-[0_0_15px_rgba(255,122,0,0.35)]'
                    : 'bg-[#121214] text-zinc-300 hover:text-white border border-white/10 hover:border-white/25'
                }`}
              >
                <Box className="w-4 h-4 shrink-0" />
                <span>{model.name}</span>
              </button>
            );
          })}
        </div>

        {/* 3D Viewport & Specification Deck Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left / Center: Interactive WebGL Canvas Viewport (7 Columns) */}
          <div
            ref={containerRef}
            onClick={() => setIsTouchActive(true)}
            className="lg:col-span-7 relative h-[380px] sm:h-[440px] lg:h-[480px] rounded-sm bg-[#121216] border border-white/10 overflow-hidden group shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          >
            {/* Blueprint Grid Background Pattern */}
            <div className="absolute inset-0 bg-tech-grid opacity-35 pointer-events-none" />

            {/* Technical Reticle Marks */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/30 pointer-events-none" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/30 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white/30 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/30 pointer-events-none" />

            {/* Client Printing Disclaimer Badge */}
            <div className="absolute top-4 left-6 z-10 flex items-center gap-2 px-3 py-1 rounded-sm bg-black/75 border border-white/10 backdrop-blur-md pointer-events-none max-w-[210px] sm:max-w-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] shrink-0" />
              <span className="text-xs font-mono text-zinc-300 uppercase tracking-wider truncate">
                Illustrative Part <span className="hidden sm:inline">// Printed from Customer CAD</span>
              </span>
            </div>

            {/* Interactive Mode State (Mobile Touch Safe-Scroll Shield) */}
            <canvas
              ref={canvasRef}
              className={`w-full h-full cursor-grab active:cursor-grabbing transition-opacity ${
                !isTouchActive ? 'pointer-events-none sm:pointer-events-auto' : 'pointer-events-auto'
              }`}
            />

            {/* Mobile Tap-to-Activate Scroll Guard Overlay */}
            {!isTouchActive && (
              <div
                onClick={() => setIsTouchActive(true)}
                className="absolute inset-0 z-20 sm:hidden flex items-center justify-center bg-black/30 cursor-pointer pointer-events-auto"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsTouchActive(true);
                  }}
                  className="px-4 py-2 rounded-full bg-[#FF7A00] text-black font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,122,0,0.5)] flex items-center gap-2"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Tap to Rotate 3D Model</span>
                </button>
              </div>
            )}

            {/* Mobile Exit 3D View Button (Restores page scroll immediately) */}
            {isTouchActive && (
              <div className="absolute top-4 right-4 z-20 sm:hidden">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsTouchActive(false);
                  }}
                  className="px-2.5 py-1.5 rounded-sm bg-black/80 border border-white/20 text-xs font-mono text-white flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5 text-[#FF7A00]" />
                  <span>Exit 3D View</span>
                </button>
              </div>
            )}

            {/* Viewport Floating Controls Toolbar */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between gap-3 pointer-events-none">
              {/* Left: Interaction Guide */}
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-400 bg-black/75 border border-white/10 px-3 py-1.5 rounded-sm backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-[#FF7A00]" />
                <span>
                  {isUserInteracting
                    ? 'Interactive Drag Mode Active'
                    : '360° Drag to Rotate • Auto-rotating when idle'}
                </span>
              </div>

              {/* Right: Quick View Actions */}
              <div className="flex items-center gap-2 pointer-events-auto ml-auto">
                {/* Wireframe Slicing Toggle */}
                <button
                  type="button"
                  onClick={() => setIsWireframe(!isWireframe)}
                  className={`px-3 py-1.5 rounded-sm font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 border transition-all ${
                    isWireframe
                      ? 'bg-[#FF7A00] text-black border-[#FF7A00] font-bold shadow-[0_0_12px_rgba(255,122,0,0.4)]'
                      : 'bg-[#16161A]/90 text-zinc-200 border-white/15 hover:border-white/30 backdrop-blur-md'
                  }`}
                  title="Toggle 3D Print Layer Wireframe"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{isWireframe ? 'Layer Wireframe [ON]' : 'Wireframe'}</span>
                </button>

                {/* Reset Camera View */}
                <button
                  type="button"
                  onClick={handleResetCamera}
                  className="p-1.5 rounded-sm bg-[#16161A]/90 text-zinc-300 hover:text-white border border-white/15 hover:border-white/30 backdrop-blur-md transition-colors"
                  title="Reset Camera Angle"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Engineering Specification & Manufacturing Data Deck (5 Columns) */}
          <div className="lg:col-span-5 p-5 sm:p-6 rounded-sm bg-[#121216] border border-white/10 flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div>
              <div className="flex items-center justify-between mb-2 text-xs font-mono">
                <span className="text-[#FF7A00] uppercase font-bold tracking-wider">
                  MODEL {MODELS_METADATA.findIndex((m) => m.id === activeModelId) + 1} // 05
                </span>
                <span className="text-zinc-400 uppercase">
                  {activeMeta.category}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-2">
                {activeMeta.name}
              </h3>

              <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed mb-4">
                {activeMeta.description}
              </p>

              {/* Manufacturing Parameter Badges */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <div className="p-2.5 rounded-sm bg-[#18181D] border border-white/5">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase block mb-0.5">
                    Recommended Material
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-semibold text-white">
                    {activeMeta.materialRecommendation}
                  </span>
                </div>

                <div className="p-2.5 rounded-sm bg-[#18181D] border border-white/5">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase block mb-0.5">
                    Batch Print Time
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-semibold text-[#FF7A00]">
                    ~{activeMeta.printTimeEstimate}
                  </span>
                </div>
              </div>

              {/* Achievable Additive Features Checklist */}
              <div className="space-y-2 mb-4">
                <span className="text-xs font-mono text-zinc-400 uppercase font-medium block">
                  Demonstrated Additive Capabilities:
                </span>
                {activeMeta.manufacturingFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs sm:text-sm text-zinc-200 font-sans"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF7A00] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Intake CTA */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center gap-1.5 mb-3 text-xs font-mono text-zinc-400">
                <Info className="w-3.5 h-3.5 text-[#FF7A00] shrink-0" />
                <span>Upload your own CAD to receive a direct engineering quotation.</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onSelectModelForQuote) {
                    onSelectModelForQuote(
                      activeMeta.name,
                      activeMeta.materialRecommendation
                    );
                  }
                }}
                className="w-full py-2.5 px-5 rounded-sm bg-[#FF7A00] hover:bg-[#FF8F1F] text-black font-mono font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-between shadow-[0_0_20px_rgba(255,122,0,0.35)] transition-all"
              >
                <span>Quote Similar CAD Geometry</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ModelPreview3D;
