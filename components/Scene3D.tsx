
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

const PARTICLE_COLORS = [
  '#8b5cf6', // Violet 500
  '#6366f1', // Indigo 500
  '#3b82f6', // Blue 500
  '#ec4899', // Pink 500
  '#f8fafc'  // Slate 50
];

// Generate random points in a sphere with more depth variation
const generateParticles = (count: number) => {
  const points = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();

  for (let i = 0; i < count; i++) {
    // Spatial Distribution
    const theta = THREE.MathUtils.randFloatSpread(360);
    const phi = THREE.MathUtils.randFloatSpread(360);
    const r = 10 + Math.random() * 50; 

    points[i * 3] = r * Math.sin(theta) * Math.cos(phi);
    points[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
    points[i * 3 + 2] = r * Math.cos(theta);

    // Solid Color Assignment
    const pickedColor = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
    color.set(pickedColor);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  return { points, colors };
};

const ParticleField = (props: any) => {
  const ref = useRef<THREE.Points>(null!);
  const { points, colors } = useMemo(() => generateParticles(5000), []);
  
  const targetRotation = useRef({ x: 0, y: 0 });
  const targetPosition = useRef({ x: 0, y: 0, scrollY: 0 });
  
  useFrame((state, delta) => {
    // Current scroll position
    const scrollY = window.scrollY;
    
    // Continuous drift
    ref.current.rotation.z += delta * 0.005;

    // Mouse-based Parallax (Subtle)
    targetRotation.current.x = state.pointer.y * 0.015; 
    targetRotation.current.y = state.pointer.x * 0.015;
    
    // Scroll-based vertical shift
    targetPosition.current.scrollY = scrollY * 0.01;
    targetPosition.current.x = -state.pointer.x * 0.1;
    targetPosition.current.y = (-state.pointer.y * 0.1) + targetPosition.current.scrollY;

    const damping = delta * 2.0; 
    
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      targetRotation.current.x,
      damping
    );
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      targetRotation.current.y,
      damping
    );

    ref.current.position.x = THREE.MathUtils.lerp(
        ref.current.position.x,
        targetPosition.current.x,
        damping
    );
    ref.current.position.y = THREE.MathUtils.lerp(
        ref.current.position.y,
        targetPosition.current.y,
        damping
    );
  });

  return (
    <group rotation={[0, 0, Math.PI / 6]}>
      <Points ref={ref} positions={points} colors={colors} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          vertexColors
          size={0.12}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

const Scene3D = () => {
  return (
    <div className="absolute inset-0 -z-10 bg-[#020617] overflow-hidden">
      <Canvas camera={{ position: [0, 0, 35], fov: 60 }}>
        <fog attach="fog" args={['#020617', 20, 75]} />
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.1}>
           <ParticleField />
        </Float>
        <ambientLight intensity={1.5} />
        <pointLight position={[100, 100, 100]} intensity={2} />
      </Canvas>
      
      {/* Visual Depth layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/40 to-slate-950 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_transparent_0%,_#020617_100%)] opacity-60 pointer-events-none" />
      
      {/* Animated Glow Spotlights */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
    </div>
  );
};

export default Scene3D;
