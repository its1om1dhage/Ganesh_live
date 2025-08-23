import { create } from 'zustand';
import { supabase } from '../supabaseClient';

export const usePhotoStore = create((set, get) => ({
  photos: [],
  loading: true,
  lightboxIndex: null,

  fetchPhotos: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching photos:", error);
    } else {
      set({ photos: data || [] });
    }
    set({ loading: false });
  },

  handleNewUpload: (newPhoto) => {
    set((state) => ({ photos: [newPhoto, ...state.photos] }));
  },

  openLightbox: (index) => set({ lightboxIndex: index }),
  closeLightbox: () => set({ lightboxIndex: null }),
  
  nextPhoto: () => {
    const { lightboxIndex, photos } = get();
    if (lightboxIndex !== null) {
      set({ lightboxIndex: (lightboxIndex + 1) % photos.length });
    }
  },

  prevPhoto: () => {
    const { lightboxIndex, photos } = get();
    if (lightboxIndex !== null) {
      set({ lightboxIndex: (lightboxIndex - 1 + photos.length) % photos.length });
    }
  },
}));