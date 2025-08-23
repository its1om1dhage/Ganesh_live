import { motion } from 'framer-motion';

export const Header = () => (
  <motion.header
    className="text-center pt-12 pb-8" // Increased padding
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
  >
    <h1 
      className="font-heading text-6xl md:text-8xl bg-clip-text text-transparent 
                 bg-gradient-to-r from-gold via-saffron to-marigold 
                 bg-[length:200%_auto] animate-gradientShift" // CHANGED: Applied gradient animation
    >
      The Divine Spark
    </h1>
    <p className="font-body text-slate text-lg mt-4">An Interactive Offering to Lord Ganesha</p>
  </motion.header>
);