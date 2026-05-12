'use client';

import { useCallback, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

export interface CropResult {
  pixels: Area;
  zoom: number;
  rotation: number;
}

interface Props {
  imageSrc: string;
  aspect: number;
  initialCrop?: { x: number; y: number };
  initialZoom?: number;
  initialRotation?: number;
  onComplete: (result: CropResult) => void;
}

export function ImageCropper({
  imageSrc,
  aspect,
  initialCrop = { x: 0, y: 0 },
  initialZoom = 1,
  initialRotation = 0,
  onComplete,
}: Props) {
  const [crop, setCrop] = useState(initialCrop);
  const [zoom, setZoom] = useState(initialZoom);
  const [rotation, setRotation] = useState(initialRotation);

  const handleCropComplete = useCallback(
    (_: Area, areaPixels: Area) => {
      onComplete({ pixels: areaPixels, zoom, rotation });
    },
    [onComplete, zoom, rotation],
  );

  return (
    <div className="space-y-3">
      <div className="relative h-80 w-full overflow-hidden rounded-xl bg-charcoal/90 sm:h-96">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropComplete={handleCropComplete}
          showGrid
          objectFit="cover"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-[var(--color-border)] bg-white px-4 py-3">
        <div className="flex flex-1 items-center gap-2 min-w-[180px]">
          <ZoomOut className="h-4 w-4 text-[var(--color-muted)]" />
          <input
            type="range"
            min={1}
            max={4}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            aria-label="Zoom"
            className="flex-1 accent-[var(--color-earth-brown)]"
          />
          <ZoomIn className="h-4 w-4 text-[var(--color-muted)]" />
        </div>
        <button
          type="button"
          onClick={() => setRotation((r) => (r + 90) % 360)}
          className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-3 py-1.5 font-body text-xs text-charcoal hover:bg-[var(--color-cream)]"
        >
          <RotateCw className="h-3.5 w-3.5" />
          Rotate
        </button>
      </div>

      <p className="font-body text-xs text-[var(--color-muted)]">
        Drag to reposition. Use the slider to zoom. The result is locked to the aspect ratio shown.
      </p>
    </div>
  );
}
