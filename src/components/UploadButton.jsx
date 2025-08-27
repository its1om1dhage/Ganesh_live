import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { Camera, CheckCircle, AlertTriangle } from 'lucide-react'; 
import { supabase } from '../supabaseClient';
import imageCompression from 'browser-image-compression';

export const UploadButton = () => {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef(null);

  const compressionOptions = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  const capturePhoto = useCallback(async () => {
    // This function remains the same
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      try {
        setStatus('uploading');
        setShowCamera(false);
        const blob = await (await fetch(imageSrc)).blob();
        const file = new File([blob], "webcam.jpg", { type: "image/jpeg" });
        const compressedFile = await imageCompression(file, compressionOptions);
        const fileName = `${Date.now()}_webcam.jpg`;
        const { error: uploadError } = await supabase.storage.from('photos').upload(fileName, compressedFile);
        if (uploadError) throw uploadError;
        const { error: dbError } = await supabase.from('photos').insert({
          image_path: fileName,
          width: webcamRef.current.video.videoWidth,
          height: webcamRef.current.video.videoHeight
        });
        if (dbError) throw dbError;
        setStatus('success');
        setMessage('Webcam offering received!');
        setTimeout(() => setStatus('idle'), 4000);
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Webcam upload failed.');
        setTimeout(() => setStatus('idle'), 5000);
      }
    }
  }, [webcamRef, setStatus, setMessage]);

  const handleFileUpload = async (event) => {
    // This function remains the same
    try {
      setStatus('uploading');
      if (!event.target.files || event.target.files.length === 0) return;
      const file = event.target.files[0];
      const compressedFile = await imageCompression(file, compressionOptions);
      const fileName = `${Date.now()}_${compressedFile.name.replace(/\s/g, '_')}`;
      const img = new Image();
      img.src = URL.createObjectURL(compressedFile);
      img.onload = async () => {
        const { error: uploadError } = await supabase.storage.from('photos').upload(fileName, compressedFile);
        if (uploadError) throw uploadError;
        const { error: dbError } = await supabase.from('photos').insert({
          image_path: fileName,
          width: img.width,
          height: img.height
        });
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
  
  // CHANGED: Simplified content for a single button
  const content = {
    idle: { icon: <Camera />, text: "Offer Photo" },
    uploading: { icon: <div className="w-5 h-5 border-2 border-t-gold border-navy rounded-full animate-spin" />, text: "Compressing..." },
    success: { icon: <CheckCircle className="text-green-400" />, text: message },
    error: { icon: <AlertTriangle className="text-red-400" />, text: message },
  };

  return (
    <>
      <motion.div 
        className="flex flex-wrap justify-center items-center gap-4 my-8 md:hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
      >
        
        <motion.label 
          htmlFor="photo-upload" 
          className="flex items-center gap-2 px-4 py-2 font-semibold text-gold rounded-lg border border-gold/50 cursor-pointer bg-light-navy/50 backdrop-blur-xl hover:bg-gold/10 hover:border-gold transition-colors" 
          whileTap={{ scale: 0.95 }}
        >
          {content[status].icon}
          <span className="text-sm">{content[status].text}</span>
        </motion.label>
        <input 
          id="photo-upload" 
          type="file" 
          accept="image/*" 
          capture="environment" 
          onChange={handleFileUpload} 
          disabled={status === 'uploading'} 
          className="hidden" 
        />
      </motion.div>
      
      
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