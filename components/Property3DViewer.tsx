
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Environment, PerspectiveCamera, ContactShadows, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ModernHouseModel = () => {
  return (
    <group>
      {/* Main Building Mass */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[4, 2, 3]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} transparent opacity={0.9} />
      </mesh>
      
      {/* Second Level / Balcony Area */}
      <mesh position={[1, 2.5, 0.5]} castShadow>
        <boxGeometry args={[2.5, 1, 2]} />
        <meshStandardMaterial color="#6366f1" metalness={0.9} roughness={0.1} transparent opacity={0.7} />
      </mesh>

      {/* Large Glass Windows */}
      <mesh position={[-1.9, 1, 0]}>
        <boxGeometry args={[0.1, 1.5, 2.5]} />
        <meshPhysicalMaterial 
            color="#93c5fd" 
            transmission={1} 
            thickness={0.5} 
            roughness={0}
        />
      </mesh>

      {/* Accent Architectural Element */}
      <mesh position={[2, 1, 1.6]}>
        <boxGeometry args={[0.2, 4, 0.2]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={2} />
      </mesh>

      {/* Base Platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#020617" />
      </mesh>
    </group>
  );
};

const Property3DViewer: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[400px] bg-slate-950 rounded-3xl overflow-hidden relative border border-slate-800">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 pointer-events-none">
        <span className="text-[10px] font-black text-violet-500 uppercase tracking-[0.3em]">Neural Visualization</span>
        <span className="text-[8px] text-slate-500 font-mono">3D_DIGITAL_TWIN_V1.0</span>
      </div>
      
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[8, 5, 8]} fov={40} />
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5} contactShadow={{ opacity: 0.4, blur: 2 }}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
              <ModernHouseModel />
            </Float>
          </Stage>
        </Suspense>
        <OrbitControls 
            enablePan={false} 
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 2.1}
            autoRotate
            autoRotateSpeed={0.5}
        />
        <Environment preset="night" />
      </Canvas>

      <div className="absolute bottom-4 right-4 z-10 text-[9px] text-slate-500 font-bold uppercase tracking-widest bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
        Interact to Rotate / Zoom
      </div>
    </div>
  );
};

export default Property3DViewer;
