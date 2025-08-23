import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, CheckCircle, AlertTriangle } from 'lucide-react'; // Added Camera icon
import { supabase } from '../supabaseClient';

export const UploadButton = () => {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleUpload = async (event) => {
    // ... (rest of the function remains the same)
    try {
      setStatus('uploading');
      setMessage('');
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Please select an image to make an offering.');
      }
      const file = event.target.files[0];
      const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
      const { error: uploadError } = await supabase.storage.from('photos').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { error: dbError } = await supabase.from('photos').insert({ image_path: fileName });
      if (dbError) throw dbError;
      setStatus('success');
      setMessage('Your offering has been received. Om Ganeshaya Namah.');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'An unexpected error occurred.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const content = {
    idle: { icon: <Camera />, text: "Offer a Photo" },
    uploading: { icon: <div className="w-5 h-5 border-2 border-t-gold border-navy rounded-full animate-spin" />, text: "Uploading..." },
    success: { icon: <CheckCircle className="text-green-400" />, text: message },
    error: { icon: <AlertTriangle className="text-red-400" />, text: message },
  };

  return (
    <motion.div 
      className="flex justify-center my-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6 }}
    >
      <motion.label
        htmlFor="photo-upload"
        className="flex items-center justify-center gap-3 px-6 py-3 font-semibold text-gold rounded-lg border border-gold/50 cursor-pointer bg-light-navy/50 backdrop-blur-xl transition-all duration-300 hover:bg-gold/10 hover:border-gold"
        whileTap={{ scale: 0.95 }}
      >
        {content[status].icon}
        <span className="text-sm">{content[status].text}</span>
      </motion.label>
      <input
        id="photo-upload"
        type="file"
        accept="image/*"
        capture="environment" // NEW: This tells mobile devices to open the camera
        onChange={handleUpload}
        disabled={status === 'uploading'}
        className="hidden"
      />
    </motion.div>
  );
};