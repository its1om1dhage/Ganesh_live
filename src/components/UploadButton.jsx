import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { Camera, Upload, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '../supabaseClient';

export const UploadButton = () => {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef(null);

  const capturePhoto = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setStatus('uploading');
      setShowCamera(false);
      
      const blob = await (await fetch(imageSrc)).blob();
      const fileName = `${Date.now()}_webcam.jpg`;
      
      const { error: uploadError } = await supabase.storage.from('photos').upload(fileName, blob);
      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from('photos').insert({ image_path: fileName, width: webcamRef.current.video.videoWidth, height: webcamRef.current.video.videoHeight });
      if (dbError) throw dbError;
      
      setStatus('success');
      setMessage('Webcam offering received!');
      setTimeout(() => setStatus('idle'), 4000);
    }
  }, [webcamRef, setStatus, setMessage]);

  const handleFileUpload = async (event) => {
     try {
      setStatus('uploading');
      if (!event.target.files || event.target.files.length === 0) return;
      const file = event.target.files[0];
      const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
      
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = async () => {
        const { error: uploadError } = await supabase.storage.from('photos').upload(fileName, file);
        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase.from('photos').insert({ image_path: fileName, width: img.width, height: img.height });
        if (dbError) throw dbError;

        setStatus('success');
        setMessage('Your offering has been received.');
        setTimeout(() => setStatus('idle'), 5000);
        URL.revokeObjectURL(img.src);
      }
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'An unexpected error occurred.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <>
      {/* This container will now be hidden on medium screens (md) and larger */}
      <motion.div 
        className="flex flex-wrap justify-center items-center gap-4 my-8 md:hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
      >
        <motion.button onClick={() => setShowCamera(true)} className="flex items-center gap-2 px-4 py-2 font-semibold text-gold rounded-lg border border-gold/50 bg-light-navy/50 backdrop-blur-xl hover:bg-gold/10 hover:border-gold transition-colors" whileTap={{ scale: 0.95 }}>
          <Camera size={18}/> Use Camera
        </motion.button>
        <motion.label htmlFor="photo-upload" className="flex items-center gap-2 px-4 py-2 font-semibold text-gold rounded-lg border border-gold/50 cursor-pointer bg-light-navy/50 backdrop-blur-xl hover:bg-gold/10 hover:border-gold transition-colors" whileTap={{ scale: 0.95 }}>
          <Upload size={18} /> Upload File
        </motion.label>
        <input id="photo-upload" type="file" accept="image/*" capture="environment" onChange={handleFileUpload} disabled={status === 'uploading'} className="hidden" />
      </motion.div>
      
      {/* Camera Modal remains the same */}
      {showCamera && (
        <motion.div className="fixed inset-0 bg-navy/80 backdrop-blur-xl z-50 flex flex-col items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="rounded-lg mb-4 w-full max-w-md"
          />
          <div className="flex gap-4">
            <button onClick={capturePhoto} className="px-6 py-3 bg-gold text-navy font-bold rounded-lg">Capture</button>
            <button onClick={() => setShowCamera(false)} className="px-6 py-3 bg-slate/50 text-white font-bold rounded-lg">Cancel</button>
          </div>
        </motion.div>
      )}
    </>
  );
};