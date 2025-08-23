import { useEffect, useMemo } from 'react';

export const ParticleBackground = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 50 }).map(() => ({
      size: Math.random() * 3 + 1,
      left: Math.random() * 100,
      duration: Math.random() * 10 + 10, // 10s to 20s
      delay: Math.random() * -20, // Start at different times
    }));
  }, []);

  return (
    <div id="particle-container">
      {particles.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};