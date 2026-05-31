import React, { useState, useRef, useCallback } from 'react';
import { GripVertical } from 'lucide-react';

interface Props {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeFilters?: string;
  afterFilters?: string;
}

const BeforeAfterSlider: React.FC<Props> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  beforeFilters = 'sepia(0.6) brightness(0.7) contrast(1.1) saturate(0.5) hue-rotate(-10deg)',
  afterFilters = 'brightness(1.05) contrast(1.05) saturate(1.1)',
}) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percent);
  }, []);

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleTouchStart = useCallback(() => {
    isDragging.current = true;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.touches[0].clientX);
  }, [updatePosition]);

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video rounded-xl overflow-hidden cursor-ew-resize select-none border border-white/5"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* After Image (full background — clean satellite view) */}
      <div className="absolute inset-0">
        <img
          src={afterImage}
          alt="After cleanup"
          className="w-full h-full object-cover"
          style={{ filter: afterFilters }}
          draggable={false}
        />
      </div>

      {/* Before Image (clipped — polluted satellite view via CSS filters) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <div
          className="h-full overflow-hidden"
          style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%' }}
        >
          <img
            src={beforeImage}
            alt="Before cleanup"
            className="h-full object-cover"
            style={{
              filter: beforeFilters,
              width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%',
              minWidth: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%',
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* Pollution overlay on before side */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ width: `${position}%` }}
      >
        <div
          className="h-full"
          style={{
            width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%',
            background: 'linear-gradient(135deg, rgba(139,69,19,0.25) 0%, rgba(128,0,0,0.15) 50%, rgba(100,80,40,0.2) 100%)',
          }}
        />
      </div>

      {/* Clean overlay on after side */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          left: `${position}%`,
          width: `${100 - position}%`,
        }}
      >
        <div
          className="h-full"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(34,197,94,0.05) 100%)',
          }}
        />
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_12px_rgba(255,255,255,0.6)] z-20"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        {/* Slider Handle */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-xl border-2 border-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-grab active:cursor-grabbing z-30"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <GripVertical className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Before Label */}
      <div className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-red-500/30 border border-red-500/40 backdrop-blur-md rounded-md">
        <span className="text-[9px] font-black text-red-300 uppercase tracking-[0.2em]">{beforeLabel}</span>
      </div>

      {/* After Label */}
      <div className="absolute top-3 right-3 z-10 px-3 py-1.5 bg-emerald-500/30 border border-emerald-500/40 backdrop-blur-md rounded-md">
        <span className="text-[9px] font-black text-emerald-300 uppercase tracking-[0.2em]">{afterLabel}</span>
      </div>

      {/* Drag hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 bg-black/40 backdrop-blur-sm rounded-md">
        <span className="text-[8px] font-black text-white/60 uppercase tracking-[0.2em]">Drag to compare</span>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
