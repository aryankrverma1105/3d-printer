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
  totalFrames = 240,
  framePathPattern = './frames/frame_{num}.webp'
): PreloaderResult {
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const framesRef = useRef<(DrawableFrame | null)[]>(new Array(totalFrames).fill(null));

  useEffect(() => {
    let isCancelled = false;
    let loaded = 0;

    const getUrl = (index: number) => {
      const numStr = String(index + 1).padStart(3, '0');
      return framePathPattern.replace('{num}', numStr);
    };

    // Calculate optimal decode resolution based on device capability
    // Capping at 1280px width on typical laptops/low-end systems saves ~1.2GB of memory!
    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const targetWidth = screenW > 1440 ? 1920 : 1280;

    const loadSingleFrame = async (index: number): Promise<DrawableFrame | null> => {
      const url = getUrl(index);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const blob = await res.blob();

        // Optimized off-main-thread decode with resolution capping
        if (typeof window.createImageBitmap === 'function') {
          try {
            return await createImageBitmap(blob, {
              resizeWidth: targetWidth,
              resizeQuality: 'medium',
            });
          } catch {
            return await createImageBitmap(blob);
          }
        } else {
          // Standard Image element fallback
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
      // Step 1: Immediately load Frame 0 (first frame) for instant hero paint
      const firstFrame = await loadSingleFrame(0);
      if (isCancelled) return;
      if (firstFrame) {
        framesRef.current[0] = firstFrame;
        loaded++;
        setLoadedCount(1);
        setIsReady(true);
      }

      // Step 2: Load keyframe anchors across timeline (every 6th frame) for instant scrub response
      const anchors: number[] = [];
      for (let i = 6; i < totalFrames; i += 6) {
        anchors.push(i);
      }

      for (const idx of anchors) {
        if (isCancelled) return;
        if (!framesRef.current[idx]) {
          const frame = await loadSingleFrame(idx);
          if (frame && !isCancelled) {
            framesRef.current[idx] = frame;
            loaded++;
            // Batch state updates to avoid React render spam
            if (loaded % 10 === 0) {
              setLoadedCount(loaded);
            }
          }
        }
      }

      // Step 3: Stream all remaining frames with concurrency of 4 to keep low-end CPUs cool
      const remaining: number[] = [];
      for (let i = 0; i < totalFrames; i++) {
        if (!framesRef.current[i]) remaining.push(i);
      }

      const batchSize = 4;
      for (let i = 0; i < remaining.length; i += batchSize) {
        if (isCancelled) return;
        const chunk = remaining.slice(i, i + batchSize);
        await Promise.all(
          chunk.map(async (idx) => {
            const frame = await loadSingleFrame(idx);
            if (frame && !isCancelled) {
              framesRef.current[idx] = frame;
              loaded++;
              if (loaded % 20 === 0 || loaded === totalFrames) {
                setLoadedCount(loaded);
              }
            }
          })
        );
      }

      if (!isCancelled) {
        setLoadedCount(loaded);
      }
    };

    runPreloadQueue();

    return () => {
      isCancelled = true;
      // Close bitmaps to free GPU memory on unmount
      framesRef.current.forEach((item) => {
        if (item && 'close' in item && typeof item.close === 'function') {
          item.close();
        }
      });
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
