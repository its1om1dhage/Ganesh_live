import { useContext } from 'react';
import { PhotosContext } from '../context/PhotosContext';

export const usePhotos = () => {
  const context = useContext(PhotosContext);
  if (!context) {
    throw new Error('usePhotos must be used within a PhotosProvider');
  }
  return context;
};