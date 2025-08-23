import { useEffect, Suspense, lazy } from 'react';
import { usePhotoStore } from './store/photoStore';
import { supabase } from './supabaseClient';
import { Loader } from './components/Loader';
import { Header } from './components/Header';
import { UploadButton } from './components/UploadButton';

const GaneshaScene = lazy(() => import('./components/canvas/GaneshaScene').then(module => ({ default: module.GaneshaScene })));
const Gallery = lazy(() => import('./components/Gallery').then(module => ({ default: module.Gallery })));
const Lightbox = lazy(() => import('./components/Lightbox').then(module => ({ default: module.Lightbox })));

function App() {
  const { fetchPhotos, handleNewUpload } = usePhotoStore();

  useEffect(() => {
    fetchPhotos();

    const channel = supabase
      .channel('public:photos')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'photos' }, (payload) => {
        handleNewUpload(payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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
      </div>

      <Suspense fallback={null}>
        <Lightbox />
      </Suspense>
    </>
  );
}

export default App;