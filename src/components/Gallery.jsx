import { memo } from 'react';
import { motion } from 'framer-motion';
import { usePhotoStore } from '../store/photoStore';
import { getImageUrl } from '../supabaseClient';

const GalleryItem = memo(({ photo, index, openLightbox }) => {
  return (
    <motion.div
      className="aspect-square bg-light-navy rounded-md overflow-hidden cursor-pointer group"
      onClick={() => openLightbox(index)}
      layoutId={`photo-${photo.id}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <img
        src={getImageUrl(photo.image_path)}
        alt={`Ganesh offering ${index + 1}`}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
    </motion.div>
  );
});

export const Gallery = () => {
  const photos = usePhotoStore((state) => state.photos);
  const openLightbox = usePhotoStore((state) => state.openLightbox);
  const loading = usePhotoStore((state) => state.loading);
  const error = usePhotoStore((state) => state.error);

  if (loading) return <div className="text-center text-slate py-10">Loading divine moments...</div>;
  if (error) return <div className="text-center text-red-400 py-10">Error: {error}</div>;
  if (photos.length === 0) return <div className="text-center text-slate py-10">No offerings have been made yet.</div>

  return (
    <motion.div
    
      className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-4 gap-4 p-4 max-w-6xl mx-auto backdrop-blur-sm bg-navy/30 rounded-lg"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
    >
      {photos.map((photo, index) => (
        <GalleryItem key={photo.id} photo={photo} index={index} openLightbox={openLightbox} />
      ))}
    </motion.div>
  );
};