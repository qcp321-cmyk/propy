
import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Line, Html, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { Visitor } from '../types';
import { MousePointer2 } from 'lucide-react';

// Convert Lat/Lng to 3D position
const getPositionFromLatLng = (lat: number, lng: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));
  
  return [x, y, z] as [number, number, number];
};

const GlobePoints = () => {
  const ref = useRef<THREE.Points>(null!);
  
  const particles = useMemo(() => {
    const count = 3500;
    const points = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 4;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      points[i * 3] = x;
      points[i * 3 + 1] = y;
      points[i * 3 + 2] = z;
    }
    return points;
  }, []);

  useFrame((state, delta) => {
    // Base rotation
    ref.current.rotation.y += delta * 0.05;
  });

  return (
    // @ts-ignore - Intrinsic element 'group' not recognized
    <group>
      <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#3b82f6" // Blue-500
          size={0.025}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.6}
        />
      </Points>
      {/* @ts-ignore - Intrinsic element 'mesh' not recognized */}
      <mesh>
        {/* @ts-ignore - Intrinsic element 'sphereGeometry' not recognized */}
        <sphereGeometry args={[3.95, 32, 32]} />
        {/* @ts-ignore - Intrinsic element 'meshBasicMaterial' not recognized */}
        <meshBasicMaterial color="#0f172a" transparent opacity={0.9} />
      {/* @ts-ignore */}
      </mesh>
    {/* @ts-ignore */}
    </group>
  );
};

interface UserMarkerProps {
  lat: number;
  lng: number;
  id: string;
}

const UserMarker: React.FC<UserMarkerProps> = ({ lat, lng, id }) => {
    const pos = getPositionFromLatLng(lat, lng, 4.1);
    const meshRef = useRef<THREE.Mesh>(null!);
    const [scale, setScale] = useState(0);

    useFrame((state, delta) => {
       // Pop-in animation
       if (scale < 1) setScale(s => Math.min(s + delta * 2, 1));
       
       // Pulse effect - Less aggressive
       if (meshRef.current) {
         const t = state.clock.getElapsedTime();
         // Generate a numeric seed from the ID string for the phase offset
         const idSeed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
         // Reduced speed (1.5) and amplitude (0.08) for subtlety
         const scalePulse = 1 + Math.sin(t * 1.5 + idSeed) * 0.08;
         meshRef.current.scale.set(scale * scalePulse, scale * scalePulse, scale * scalePulse);
       }
    });

    return (
        // @ts-ignore - Intrinsic element 'mesh' not recognized
        <mesh ref={meshRef} position={pos}>
            {/* @ts-ignore - Intrinsic element 'sphereGeometry' not recognized */}
            <sphereGeometry args={[0.08, 16, 16]} />
            {/* @ts-ignore - Intrinsic element 'meshBasicMaterial' not recognized */}
            <meshBasicMaterial color="#10b981" toneMapped={false} />
            <Html distanceFactor={15} style={{ pointerEvents: 'none' }}>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping opacity-60" />
            </Html>
        {/* @ts-ignore */}
        </mesh>
    );
};

// Interactive Group Container that rotates
const InteractiveGlobe = ({ visitors, onClick }: { visitors: Visitor[], onClick: () => void }) => {
    const groupRef = useRef<THREE.Group>(null!);

    useFrame((state, delta) => {
        // Continuous rotation
        groupRef.current.rotation.y += delta * 0.1;
    });

    return (
        // @ts-ignore - Intrinsic element 'group' not recognized
        <group ref={groupRef} onClick={(e) => { e.stopPropagation(); onClick(); }}>
            <GlobePoints />
            {visitors.map(v => (
                <UserMarker key={v.id} id={v.id} lat={v.coordinates[0]} lng={v.coordinates[1]} />
            ))}
        {/* @ts-ignore */}
        </group>
    );
};

interface TrafficGlobeProps {
    visitors: Visitor[];
    onInteract: () => void;
}

const TrafficGlobe: React.FC<TrafficGlobeProps> = ({ visitors, onInteract }) => {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-950/50 relative border border-slate-800 group cursor-pointer shadow-inner shadow-black/50">
      <div className="absolute top-4 left-4 z-10 pointer-events-none select-none">
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400 font-mono text-[10px] tracking-widest font-bold">LIVE GLOBE</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">REAL-TIME MAP</span>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-10 pointer-events-none opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
         <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/50 shadow-xl">
            <MousePointer2 className="w-3 h-3 text-violet-400" />
            <span className="text-[10px] text-slate-300 font-medium tracking-wide uppercase">View Metrics</span>
         </div>
      </div>

      <Canvas camera={{ position: [0, 2, 9], fov: 45 }}>
        {/* @ts-ignore - Intrinsic element 'fog' not recognized */}
        <fog attach="fog" args={['#020617', 5, 15]} />
        {/* @ts-ignore - Intrinsic element 'ambientLight' not recognized */}
        <ambientLight intensity={0.5} />
        {/* @ts-ignore - Intrinsic element 'pointLight' not recognized */}
        <pointLight position={[10, 10, 10]} intensity={1} />
        <InteractiveGlobe visitors={visitors} onClick={onInteract} />
      </Canvas>
    </div>
  );
};

export default TrafficGlobe;
