import { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Sparkles } from '@react-three/drei';
import { useRef } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile'; // Import the hook

function Model(props) {
  // ... (Model component remains the same)
  const { scene } = useGLTF('/ganesha_idol/scene.gltf');
  const modelRef = useRef();
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.002;
    }
  });
  return <primitive object={scene} ref={modelRef} {...props} />;
}

export const GaneshaScene = () => {
  const isMobile = useIsMobile(); // Use the hook

  // CHANGED: Adjust settings based on screen size
  const modelScale = isMobile ? 1.2 : 1.5;
  const modelPosition = isMobile ? [0, -1.8, 0] : [0, -2, 0];
  const sparklesCount = isMobile ? 50 : 100;

  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FFD700" />
        <Suspense fallback={null}>
          <Model scale={modelScale} position={modelPosition} />
          <Sparkles count={sparklesCount} scale={8} size={6} speed={0.4} color="#FF9933" />
          <Environment preset="night" />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};