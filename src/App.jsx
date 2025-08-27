import { useEffect, Suspense, lazy, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';
import { usePhotoStore } from './store/photoStore';
import { supabase } from './supabaseClient';
import { Loader } from './components/Loader';
import { Header } from './components/Header';
import { UploadButton } from './components/UploadButton';

const GaneshaScene = lazy(() => import('./components/canvas/GaneshaScene').then(module => ({ default: module.GaneshaScene })));
const Gallery = lazy(() => import('./components/Gallery').then(module => ({ default: module.Gallery })));
const Lightbox = lazy(() => import('./components/Lightbox').then(module => ({ default: module.Lightbox })));
const PhotoCollage = lazy(() => import('./components/PhotoCollage').then(module => ({ default: module.PhotoCollage })));

function App() {
  const { photos, fetchPhotos, handleNewUpload } = usePhotoStore();
  const [showCollage, setShowCollage] = useState(false);

  // This effect runs once on component mount
  useEffect(() => {
    // 1. Fetch the initial data
    fetchPhotos();

    // 2. Set up the realtime subscription for instant updates
    const channel = supabase
      .channel('public:photos')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'photos' }, (payload) => {
        const newPhoto = payload.new;
        const img = new Image();
        img.src = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/photos/${newPhoto.image_path}`;
        img.onload = () => {
          handleNewUpload({ ...newPhoto, width: img.width, height: img.height });
        };
      })
      .subscribe();
      
    // 3. NEW: Set up a one-minute interval to re-fetch data as a failsafe
    const refreshInterval = setInterval(() => {
      console.log('Refreshing data...');
      fetchPhotos();
    }, 20000); 

    // Cleanup function to remove the subscription and interval when the app closes
    return () => {
      supabase.removeChannel(channel);
      clearInterval(refreshInterval);
    };
  }, [fetchPhotos, handleNewUpload]);

  return (
    <>
      <Suspense fallback={<Loader />}>
        <GaneshaScene />
      </Suspense>
      
      <div className="relative z-10 w-full h-full overflow-y-auto">
        <Header />
        <UploadButton />
        <Suspense fallback={<Loader />}>
          <Gallery />
        </Suspense>

        {photos.length > 0 && (
          <div className="flex justify-center my-12">
            <motion.button 
              onClick={() => setShowCollage(true)} 
              className="flex items-center gap-2 px-6 py-3 font-semibold text-saffron rounded-lg border border-saffron/50 bg-light-navy/50 backdrop-blur-xl hover:bg-saffron/10 hover:border-saffron transition-colors" 
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <LayoutGrid size={18}/> 
              Create Collage
            </motion.button>
          </div>
        )}
      </div>

      <Suspense fallback={null}>
        <Lightbox />
      </Suspense>
      
      <Suspense fallback={null}>
        {showCollage && <PhotoCollage photos={photos} onClose={() => setShowCollage(false)} />}
      </Suspense>
    </>
  );
}

export default App;