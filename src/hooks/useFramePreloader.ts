import { useState, useEffect, useRef } from 'react';

export type DrawableFrame = ImageBitmap | HTMLImageElement;

interface PreloaderResult {
  frames: (DrawableFrame | null)[];
  loadedCount: number;
  totalFrames: number;
  isReady: boolean;
  loadProgress: number; // 0 to 1
}

export function useFramePreloader(
  totalFrames = 120,
  framePathPattern = './frames/frame_{num}.webp'
): PreloaderResult {
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const framesRef = useRef<(DrawableFrame | null)[]>([]);

  // Keep array sized to totalFrames
  if (framesRef.current.length !== totalFrames) {
    framesRef.current = new Array(totalFrames).fill(null);
  }

  useEffect(() => {
    let isCancelled = false;
    let loaded = 0;

    // Reset buffer for current run
    framesRef.current = new Array(totalFrames).fill(null);

    // Map virtual index (0..totalFrames-1) across the 240 master frames (1..240)
    const getUrl = (index: number) => {
      const fileIndex = Math.min(
        Math.round((index / Math.max(totalFrames - 1, 1)) * 239) + 1,
        240
      );
      const numStr = String(fileIndex).padStart(3, '0');
      return framePathPattern.replace('{num}', numStr);
    };

    const loadSingleFrame = async (index: number): Promise<DrawableFrame | null> => {
      if (framesRef.current[index]) return framesRef.current[index];
      const url = getUrl(index);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const blob = await res.blob();

        if (typeof window.createImageBitmap === 'function') {
          return await createImageBitmap(blob);
        } else {
          return new Promise((resolve) => {
            const img = new Image();
            img.decoding = 'async';
            img.src = URL.createObjectURL(blob);
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
          });
        }
      } catch (err) {
        console.warn(`Frame ${index} load issue:`, err);
        return null;
      }
    };

    const runPreloadQueue = async () => {
      // Step 1: Immediately load Frame 0 for instant hero mount
      const firstFrame = await loadSingleFrame(0);
      if (isCancelled) return;
      if (firstFrame) {
        framesRef.current[0] = firstFrame;
        loaded++;
        setLoadedCount(1);
        setIsReady(true);
      }

      // Step 2: Milestone Backbone (~200ms) - load 16 keyframes across the 240 timeline IN PARALLEL
      // This guarantees the animation can scrub across the full 0% - 100% timeline immediately!
      const milestoneCount = 16;
      const milestones: number[] = [];
      for (let i = 0; i < milestoneCount; i++) {
        const idx = Math.min(
          Math.round((i / Math.max(milestoneCount - 1, 1)) * (totalFrames - 1)),
          totalFrames - 1
        );
        if (!framesRef.current[idx]) {
          milestones.push(idx);
        }
      }

      await Promise.all(
        milestones.map(async (idx) => {
          if (isCancelled) return;
          const frame = await loadSingleFrame(idx);
          if (frame && !isCancelled) {
            framesRef.current[idx] = frame;
            loaded++;
          }
        })
      );

      if (isCancelled) return;
      setLoadedCount(loaded);

      // Step 3: Progressive Fill - load intermediate frames (every 3rd frame) in parallel chunks of 10
      const secondTier: number[] = [];
      for (let i = 0; i < totalFrames; i += 3) {
        if (!framesRef.current[i]) secondTier.push(i);
      }

      const chunkSize = 10;
      for (let i = 0; i < secondTier.length; i += chunkSize) {
        if (isCancelled) return;
        const chunk = secondTier.slice(i, i + chunkSize);
        await Promise.all(
          chunk.map(async (idx) => {
            const frame = await loadSingleFrame(idx);
            if (frame && !isCancelled) {
              framesRef.current[idx] = frame;
              loaded++;
            }
          })
        );
        if (loaded % 20 === 0) {
          setLoadedCount(loaded);
        }
      }

      if (isCancelled) return;
      setLoadedCount(loaded);

      // Step 4: Stream all remaining frames in parallel chunks of 10 with micro-yields
      const remaining: number[] = [];
      for (let i = 0; i < totalFrames; i++) {
        if (!framesRef.current[i]) remaining.push(i);
      }

      for (let i = 0; i < remaining.length; i += chunkSize) {
        if (isCancelled) return;
        const chunk = remaining.slice(i, i + chunkSize);
        await Promise.all(
          chunk.map(async (idx) => {
            const frame = await loadSingleFrame(idx);
            if (frame && !isCancelled) {
              framesRef.current[idx] = frame;
              loaded++;
            }
          })
        );
        if (loaded % 20 === 0 || loaded === totalFrames) {
          setLoadedCount(loaded);
        }
        await new Promise((resolve) => setTimeout(resolve, 5));
      }

      if (!isCancelled) {
        setLoadedCount(loaded);
      }
    };

    runPreloadQueue();

    return () => {
      isCancelled = true;
    };
  }, [totalFrames, framePathPattern]);

  return {
    frames: framesRef.current,
    loadedCount,
    totalFrames,
    isReady,
    loadProgress: totalFrames > 0 ? loadedCount / totalFrames : 0,
  };
}
