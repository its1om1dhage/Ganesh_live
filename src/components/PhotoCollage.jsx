import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { usePhotoStore } from '../store/photoStore';
import { getImageUrl } from '../supabaseClient';
import { generateFullscreenMosaic } from '../utils/layoutUtils';

// A simple hook to get window dimensions
const useWindowSize = () => {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
};

export const PhotoCollage = ({ onClose }) => {
  const { photos } = usePhotoStore();
  const collageRef = useRef(null);
  const [width, height] = useWindowSize();

  // Generate the layout based on photos and screen size
  const { layouts, gridCols, gridRows } = generateFullscreenMosaic(photos, width, height);

  const downloadCollage = async () => {
    if (!collageRef.current) return;
    const buttons = collageRef.current.querySelector('.collage-buttons');
    if (buttons) buttons.style.display = 'none';
    
    try {
      const canvas = await html2canvas(collageRef.current, {
        backgroundColor: '#0a192f',
        scale: 1.5, // Use a slightly lower scale for performance on large canvases
        useCORS: true,
        windowWidth: collageRef.current.scrollWidth,
        windowHeight: collageRef.current.scrollHeight,
      });
      if (buttons) buttons.style.display = 'flex';
      canvas.toBlob((blob) => {
        saveAs(blob, `ganesha-chaturthi-collage-${new Date().getFullYear()}.png`);
      });
    } catch (error) {
      console.error("Error generating collage:", error);
      if (buttons) buttons.style.display = 'flex';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40 bg-navy overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div ref={collageRef} className="absolute inset-0 p-2">
          <div
            className="w-full h-full grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
              gridTemplateRows: `repeat(${gridRows}, 1fr)`,
            }}
          >
            {photos.map((photo, index) => {
              const layout = layouts[index];
              if (!layout) return null;
              return (
                <motion.div
                  key={photo.id}
                  className="overflow-hidden rounded-lg shadow-lg shadow-black/50"
                  style={{
                    gridRow: `${layout.row} / span ${layout.rowSpan}`,
                    gridColumn: `${layout.col} / span ${layout.colSpan}`,
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
                >
                  <img
                    src={getImageUrl(photo.image_path)}
                    alt={`Collage image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              );
            })}
          </div>

          <div className="collage-buttons absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
            <motion.button
              onClick={downloadCollage}
              className="flex items-center gap-2 px-6 py-3 font-semibold text-gold rounded-lg border border-gold/50 bg-light-navy/50 backdrop-blur-xl hover:bg-gold/10 hover:border-gold transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <Download size={18} /> Download
            </motion.button>
            <motion.button
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-3 font-semibold text-slate rounded-lg border border-slate/50 bg-light-navy/50 backdrop-blur-xl hover:bg-slate/10 hover:border-slate transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <X size={18} /> Close
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};