import os
import sys
import glob
from PIL import Image
import cv2

def optimize():
    src_dir = "Images"
    dest_dir = os.path.join("public", "frames")
    os.makedirs(dest_dir, exist_ok=True)
    os.makedirs("public", exist_ok=True)

    files = sorted([f for f in os.listdir(src_dir) if f.lower().endswith(".png")])
    total = len(files)
    print(f"Processing {total} frames from {src_dir} to {dest_dir}...")

    total_orig_bytes = 0
    total_webp_bytes = 0

    # Convert to WebP frames
    for idx, fname in enumerate(files, 1):
        src_path = os.path.join(src_dir, fname)
        dest_fname = f"frame_{idx:03d}.webp"
        dest_path = os.path.join(dest_dir, dest_fname)

        orig_sz = os.path.getsize(src_path)
        total_orig_bytes += orig_sz

        with Image.open(src_path) as img:
            # Save as high-quality WebP
            img.save(dest_path, "WEBP", quality=82, method=4)
            
            # If first frame, also save as poster
            if idx == 1:
                poster_path = os.path.join("public", "hero_poster.webp")
                img.save(poster_path, "WEBP", quality=85)
                print(f"Saved initial poster: {poster_path}")

        webp_sz = os.path.getsize(dest_path)
        total_webp_bytes += webp_sz

        if idx % 40 == 0 or idx == total:
            print(f"Converted {idx}/{total} frames ({idx/total*100:.1f}%)")

    print(f"\nOptimization Results:")
    print(f"Original PNG size: {total_orig_bytes / (1024*1024):.2f} MB")
    print(f"Optimized WebP size: {total_webp_bytes / (1024*1024):.2f} MB")
    print(f"Reduction: {(1 - total_webp_bytes / total_orig_bytes) * 100:.1f}% savings!")

    # Generate MP4 fallback video
    mp4_path = os.path.join("public", "printer_sequence.mp4")
    print(f"\nGenerating MP4 video fallback: {mp4_path} ...")
    
    first_frame = cv2.imread(os.path.join(src_dir, files[0]))
    height, width, layers = first_frame.shape
    fps = 30 # 240 frames @ 30fps = 8.0 seconds
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    video = cv2.VideoWriter(mp4_path, fourcc, fps, (width, height))

    for fname in files:
        fpath = os.path.join(src_dir, fname)
        frame = cv2.imread(fpath)
        video.write(frame)

    video.release()
    cv2.destroyAllWindows()
    
    if os.path.exists(mp4_path):
        mp4_sz = os.path.getsize(mp4_path)
        print(f"MP4 fallback video generated: {mp4_path} ({mp4_sz / (1024*1024):.2f} MB)")

if __name__ == "__main__":
    optimize()
