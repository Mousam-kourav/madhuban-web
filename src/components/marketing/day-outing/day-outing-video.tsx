'use client';

import { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface DayOutingVideoProps {
  src: string;
  poster: string;
}

export function DayOutingVideo({ src, poster }: DayOutingVideoProps) {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    const next = !muted;
    video.muted = next;
    setMuted(next);
  }

  return (
    <div className="relative mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl shadow-md md:max-w-sm">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="h-auto w-full"
        aria-label="Guests enjoying the day outing experience at Madhuban Eco Retreat"
      />
      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? 'Unmute video' : 'Mute video'}
        className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {muted ? (
          <VolumeX className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Volume2 className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
