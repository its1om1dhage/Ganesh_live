import { motion } from 'framer-motion';

const HowToUseItem = ({ number, title, description }) => (
  <motion.div
    className="relative p-6 rounded-lg border border-ivory/20 bg-ivory/10 backdrop-filter backdrop-blur-sm cursor-pointer"
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: number * 0.1 }}
    // This is the new "function" for interactivity on hover
    whileHover={{ 
      scale: 1.05, 
      y: -8, 
      boxShadow: "0px 15px 30px rgba(0,0,0,0.3)",
      borderColor: 'var(--color-gold)'
    }}
  >
    <div className="absolute top-2 left-2 text-ivory/50 text-sm">{number < 10 ? '0' : ''}{number}</div>
    <h3 className="font-semibold text-xl text-gold mb-2">{title}</h3>
    <p className="text-ivory/80">{description}</p>
  </motion.div>
);

export const HowToUse = () => {
  const howToUseSteps = [
    { number: 1, title: 'Allow Camera Access', description: 'Grant permission to your device’s camera to begin capturing live moments of Lord Ganesh.' },
    { number: 2, title: 'Add Your Images', description: 'Click “Capture” for instant photos or use the “Upload” button to import images from your device.' },
    { number: 3, title: 'View Your Canvas', description: 'Watch as your precious Ganesh images seamlessly appear and arrange themselves on the sacred canvas below.' },
    { number: 4, title: 'Share Blessings', description: 'Spread positivity and devotion by sharing your unique Ganesh canvas with friends and family.' },
  ];

  return (
    <motion.section
      className="py-12 px-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ staggerChildren: 0.2 }}
    >
      <div className="text-center mb-8">
        <motion.h2 
          className="font-heading text-4xl text-gold mb-2"
          variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }}
        >
          How to Use This Page
        </motion.h2>
        <motion.p 
          className="text-ivory/80 text-lg"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        >
          Embark on your spiritual journey with these simple steps:
        </motion.p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {howToUseSteps.map((step) => (
          <HowToUseItem key={step.number} {...step} />
        ))}
      </div>
    </motion.section>
  );
};