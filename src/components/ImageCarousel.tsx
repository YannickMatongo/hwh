/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
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

export default function ImageCarousel({
  images,
  caption,
  prevLabel = "Previous image",
  nextLabel = "Next image",
  goToLabel = "Go to image",
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const total = images.length;

  if (total === 0) return null;

  const goTo = (targetIndex: number, dir: number) => {
    setDirection(dir);
    setIndex((targetIndex + total) % total);
  };

  const goPrev = () => goTo(index - 1, -1);
  const goNext = () => goTo(index + 1, 1);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) goPrev();
    else if (info.offset.x < -SWIPE_THRESHOLD) goNext();
  };

  const current = images[index];

  return (
    <div className="w-full">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
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
            initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full object-cover select-none cursor-grab active:cursor-grabbing"
          />
        </AnimatePresence>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label={prevLabel}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-700 hover:text-[#D32F2F] transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label={nextLabel}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-700 hover:text-[#D32F2F] transition-colors"
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
              onClick={() => goTo(i, i > index ? 1 : -1)}
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
