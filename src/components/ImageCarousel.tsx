/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, PanInfo } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselImage {
  src: string;
  alt: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  caption?: string;
  prevLabel?: string;
  nextLabel?: string;
  goToLabel?: string;
}

const SWIPE_THRESHOLD = 50;
const AUTOPLAY_INTERVAL_MS = 4500;
const MANUAL_PAUSE_MS = 4000;

export default function ImageCarousel({
  images,
  caption,
  prevLabel = "Previous image",
  nextLabel = "Next image",
  goToLabel = "Go to image",
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  const [isManualPause, setIsManualPause] = useState(false);
  const manualPauseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = images.length;

  // Autoplay: advances every few seconds unless hovered/touched or recently interacted with manually.
  useEffect(() => {
    if (total <= 1 || isHovering || isManualPause) return;
    const id = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % total);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(id);
  }, [total, isHovering, isManualPause, index]);

  useEffect(() => {
    return () => {
      if (manualPauseTimeout.current) clearTimeout(manualPauseTimeout.current);
    };
  }, []);

  if (total === 0) return null;

  const triggerManualPause = () => {
    setIsManualPause(true);
    if (manualPauseTimeout.current) clearTimeout(manualPauseTimeout.current);
    manualPauseTimeout.current = setTimeout(() => setIsManualPause(false), MANUAL_PAUSE_MS);
  };

  const goTo = (targetIndex: number, dir: number) => {
    setDirection(dir);
    setIndex((targetIndex + total) % total);
  };

  const handleManualGoTo = (targetIndex: number, dir: number) => {
    goTo(targetIndex, dir);
    triggerManualPause();
  };

  const goPrev = () => handleManualGoTo(index - 1, -1);
  const goNext = () => handleManualGoTo(index + 1, 1);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) goPrev();
    else if (info.offset.x < -SWIPE_THRESHOLD) goNext();
  };

  const current = images[index];
  const nextImage = total > 1 ? images[(index + 1) % total] : null;
  const nextNextImage = total > 2 ? images[(index + 2) % total] : null;

  return (
    <div className="w-full">
      <div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onTouchStart={() => setIsHovering(true)}
        onTouchEnd={() => {
          setIsHovering(false);
          triggerManualPause();
        }}
        className="relative w-full h-[300px] sm:h-[380px] md:h-[440px] bg-gray-50 rounded-2xl overflow-hidden"
      >
        {nextNextImage && (
          <div className="hidden sm:block absolute top-[14%] left-[86%] w-[24%] h-[72%] rounded-2xl overflow-hidden shadow-md z-10">
            <img src={nextNextImage.src} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        )}

        {nextImage && (
          <button
            type="button"
            onClick={goNext}
            aria-label={nextLabel}
            className="absolute top-[7%] left-[70%] w-[20%] h-[86%] rounded-2xl overflow-hidden shadow-lg z-20 cursor-pointer"
          >
            <img src={nextImage.src} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 hover:bg-black/15 transition-colors" />
          </button>
        )}

        <div
          className={`absolute left-0 top-0 h-full rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white z-30 transition-transform duration-500 hover:scale-[1.01] ${
            total > 1 ? "w-[76%]" : "w-full"
          }`}
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.img
              key={index}
              src={current.src}
              alt={current.alt}
              draggable={false}
              drag={total > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full object-contain bg-white p-3 sm:p-4 select-none cursor-grab active:cursor-grabbing"
            />
          </AnimatePresence>
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label={prevLabel}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-700 hover:text-[#D32F2F] transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label={nextLabel}
              className="absolute right-[24%] top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-700 hover:text-[#D32F2F] transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="flex items-center justify-center gap-2 mt-5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleManualGoTo(i, i > index ? 1 : -1)}
              aria-label={`${goToLabel} ${i + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-[#D32F2F]" : "w-2.5 bg-gray-200 hover:bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}

      {caption && <p className="text-gray-600 text-sm leading-relaxed text-center mt-4">{caption}</p>}
    </div>
  );
}
