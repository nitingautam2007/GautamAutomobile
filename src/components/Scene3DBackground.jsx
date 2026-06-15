import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Floating Wireframe Shape ── */
function FloatingShape({ geometry, position, rotationSpeed = 0.01, floatSpeed = 1, color = '#dc2626', scale = 1 }) {
  const ref = useRef();
  const [px, py, pz] = position;

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x += rotationSpeed;
      ref.current.rotation.y += rotationSpeed * 1.3;
      ref.current.position.y = py + Math.sin(state.clock.elapsedTime * floatSpeed) * 0.3;
    }
  });

  return (
    <mesh ref={ref} position={[px, py, pz]} scale={scale}>
      {geometry}
      <meshStandardMaterial
        color={color}
        wireframe
        transparent
        opacity={0.12}
        emissive={color}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

/* ── Orbiting Ring ── */
function OrbitRing({ radius = 3, speed = 0.2, color = '#dc2626' }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * speed) * 0.5 + 0.3;
      ref.current.rotation.y = state.clock.elapsedTime * speed;
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.008, 8, 100]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} transparent opacity={0.2} />
    </mesh>
  );
}

/* ── Glowing Dots Field ── */
function GlowDots({ count = 80 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 4 + Math.random() * 6;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#dc2626" transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

/* ── Main Background Scene ── */
export default function Scene3DBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#dc2626" />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color="#6666ff" />

      {/* Floating wireframe shapes */}
      <FloatingShape geometry={<octahedronGeometry args={[0.6]} />} position={[-4, 1, -3]} color="#dc2626" floatSpeed={0.8} scale={1} />
      <FloatingShape geometry={<dodecahedronGeometry args={[0.5]} />} position={[4, -1, -4]} color="#ff4444" rotationSpeed={0.008} floatSpeed={1.2} scale={0.9} />
      <FloatingShape geometry={<icosahedronGeometry args={[0.7]} />} position={[3, 2, -5]} color="#cc2222" rotationSpeed={0.005} floatSpeed={0.6} scale={0.7} />
      <FloatingShape geometry={<tetrahedronGeometry args={[0.5]} />} position={[-3, -2, -3]} color="#ff6666" rotationSpeed={0.012} floatSpeed={1} scale={0.8} />
      <FloatingShape geometry={<boxGeometry args={[0.6, 0.6, 0.6]} />} position={[0, 3, -6]} color="#dc2626" rotationSpeed={0.007} floatSpeed={0.9} scale={0.6} />
      <FloatingShape geometry={<octahedronGeometry args={[0.4]} />} position={[-5, 0, -5]} color="#aa3333" rotationSpeed={0.01} floatSpeed={1.1} scale={0.5} />

      {/* Orbit rings */}
      <OrbitRing radius={3.5} speed={0.15} color="#dc2626" />
      <OrbitRing radius={5} speed={-0.1} color="#6666ff" />

      {/* Glowing dot field */}
      <GlowDots count={100} />

      <fog attach="fog" args={['#000000', 6, 18]} />
    </Canvas>
  );
}
