import { useState, useEffect, useRef } from 'react';

interface UseScrollProgressOptions {
  lerpFactor?: number; // 0.1 for very smooth, 1.0 for instant
}

export function useScrollProgress(
  containerRef: React.RefObject<HTMLElement | null>,
  options: UseScrollProgressOptions = {}
) {
  const { lerpFactor = 0.15 } = options;
  const [progress, setProgress] = useState(0);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollableDistance = rect.height - windowHeight;

      if (totalScrollableDistance <= 0) {
        targetProgressRef.current = 0;
        return;
      }

      // Distance scrolled from top of container entering viewport
      const scrolled = -rect.top;
      const rawProgress = scrolled / totalScrollableDistance;
      const clamped = Math.min(Math.max(rawProgress, 0), 1);

      targetProgressRef.current = clamped;
    };

    const updateLoop = () => {
      // Lerp smooth interpolation
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0005) {
        currentProgressRef.current += diff * lerpFactor;
        setProgress(currentProgressRef.current);
      } else if (currentProgressRef.current !== targetProgressRef.current) {
        currentProgressRef.current = targetProgressRef.current;
        setProgress(currentProgressRef.current);
      }
      animationFrameId.current = requestAnimationFrame(updateLoop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    animationFrameId.current = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [containerRef, lerpFactor]);

  return progress;
}
