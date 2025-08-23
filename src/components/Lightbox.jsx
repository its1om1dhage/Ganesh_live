import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePhotoStore } from '../store/photoStore';
import { getImageUrl } from '../supabaseClient';

export const Lightbox = () => {
  const { photos, lightboxIndex, closeLightbox, nextPhoto, prevPhoto } = usePhotoStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeLightbox, nextPhoto, prevPhoto]);

  const photo = lightboxIndex !== null ? photos[lightboxIndex] : null;

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          className="fixed inset-0 bg-navy/80 backdrop-blur-xl flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLightbox}
        >
          <motion.img
            layoutId={`photo-${photo.id}`}
            src={getImageUrl(photo.image_path)}
            alt="Fullscreen offering"
            className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg shadow-2xl shadow-black/50"
            onClick={(e) => e.stopPropagation()}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          />
          <motion.button
            className="absolute top-4 right-4 text-slate hover:text-gold transition-colors"
            onClick={closeLightbox}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.3 } }}
          >
            <X size={32} />
          </motion.button>
          <motion.button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate hover:text-gold transition-colors"
            onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
          >
            <ChevronLeft size={48} />
          </motion.button>
          <motion.button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate hover:text-gold transition-colors"
            onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
          >
            <ChevronRight size={48} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};