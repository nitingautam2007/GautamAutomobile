import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* ── Stylized Low-Poly Car ── */
function Car({ color = '#dc2626' }) {
  const group = useRef();

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.15;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
    }
  });

  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({ color, metalness: 0.85, roughness: 0.15 }), [color]);
  const glassMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#88ccff', metalness: 0.3, roughness: 0.05, transparent: true, opacity: 0.55 }), []);
  const tireMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1a1a1a', metalness: 0.1, roughness: 0.85 }), []);
  const rimMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#cccccc', metalness: 0.95, roughness: 0.1 }), []);
  const headlightMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 2 }), []);
  const tailMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ff0000', emissive: '#ff0000', emissiveIntensity: 1.5 }), []);
  const underglowMat = useMemo(() => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.4, transparent: true, opacity: 0.3 }), [color]);

  return (
    <group ref={group} position={[0, -0.3, 0]}>
      {/* Main body - lower */}
      <mesh position={[0, 0.22, 0]} material={bodyMat} castShadow>
        <boxGeometry args={[2.4, 0.32, 1.1]} />
      </mesh>

      {/* Body - upper / cabin */}
      <mesh position={[0.15, 0.52, 0]} material={bodyMat} castShadow>
        <boxGeometry args={[1.4, 0.3, 1.0]} />
      </mesh>

      {/* Hood slope */}
      <mesh position={[-0.75, 0.35, 0]} rotation={[0, 0, 0.25]} material={bodyMat} castShadow>
        <boxGeometry args={[0.7, 0.14, 1.02]} />
      </mesh>

      {/* Trunk slope */}
      <mesh position={[0.85, 0.38, 0]} rotation={[0, 0, -0.15]} material={bodyMat} castShadow>
        <boxGeometry args={[0.5, 0.12, 1.02]} />
      </mesh>

      {/* Windshield */}
      <mesh position={[-0.15, 0.55, 0]} rotation={[0, 0, 0.35]} material={glassMat}>
        <boxGeometry args={[0.5, 0.28, 0.92]} />
      </mesh>

      {/* Rear window */}
      <mesh position={[0.55, 0.55, 0]} rotation={[0, 0, -0.2]} material={glassMat}>
        <boxGeometry args={[0.4, 0.25, 0.92]} />
      </mesh>

      {/* Side windows L */}
      <mesh position={[0.15, 0.54, 0.51]} material={glassMat}>
        <boxGeometry args={[1.2, 0.2, 0.02]} />
      </mesh>

      {/* Side windows R */}
      <mesh position={[0.15, 0.54, -0.51]} material={glassMat}>
        <boxGeometry args={[1.2, 0.2, 0.02]} />
      </mesh>

      {/* Headlights */}
      <mesh position={[-1.22, 0.28, 0.38]} material={headlightMat}>
        <boxGeometry args={[0.05, 0.08, 0.18]} />
      </mesh>
      <mesh position={[-1.22, 0.28, -0.38]} material={headlightMat}>
        <boxGeometry args={[0.05, 0.08, 0.18]} />
      </mesh>

      {/* Tail lights */}
      <mesh position={[1.22, 0.28, 0.38]} material={tailMat}>
        <boxGeometry args={[0.05, 0.06, 0.18]} />
      </mesh>
      <mesh position={[1.22, 0.28, -0.38]} material={tailMat}>
        <boxGeometry args={[0.05, 0.06, 0.18]} />
      </mesh>

      {/* Wheels */}
      {[[-0.7, 0.06, 0.58], [-0.7, 0.06, -0.58], [0.7, 0.06, 0.58], [0.7, 0.06, -0.58]].map((pos, i) => (
        <group key={i} position={pos}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={tireMat} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.1, 16]} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={rimMat}>
            <cylinderGeometry args={[0.1, 0.1, 0.11, 8]} />
          </mesh>
        </group>
      ))}

      {/* Side skirts */}
      <mesh position={[0, 0.1, 0.56]} material={bodyMat}>
        <boxGeometry args={[2.0, 0.06, 0.02]} />
      </mesh>
      <mesh position={[0, 0.1, -0.56]} material={bodyMat}>
        <boxGeometry args={[2.0, 0.06, 0.02]} />
      </mesh>

      {/* Underglow light */}
      <mesh position={[0, 0.01, 0]} material={underglowMat}>
        <boxGeometry args={[2.2, 0.01, 1.0]} />
      </mesh>

      {/* Point light for underglow effect */}
      <pointLight position={[0, 0.05, 0]} color={color} intensity={0.8} distance={2} />
    </group>
  );
}

/* ── Floating Particles ── */
function Particles({ count = 200, color = '#dc2626' }) {
  const mesh = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, [count]);

  const sizes = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) s[i] = Math.random() * 0.02 + 0.005;
    return s;
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color={color} transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

/* ── Spinning Ring / Platform ── */
function Platform() {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * 0.3;
  });

  return (
    <group position={[0, -0.35, 0]}>
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.015, 8, 64]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={1.5} transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.6, 64]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.2} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

/* ── Speed Lines ── */
function SpeedLines() {
  const ref = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(60 * 3);
    for (let i = 0; i < 60; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 3;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      const arr = ref.current.geometry.attributes.position.array;
      for (let i = 0; i < arr.length; i += 3) {
        arr[i] += 0.01;
        if (arr[i] > 6) arr[i] = -6;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={60} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#ffffff" transparent opacity={0.15} sizeAttenuation />
    </points>
  );
}

/* ── Main Exported Scene ── */
export default function Scene3D({ carColor = '#dc2626' }) {
  return (
    <Canvas
      camera={{ position: [3.5, 1.8, 3.5], fov: 40 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow color="#ffffff" />
      <directionalLight position={[-3, 4, -3]} intensity={0.4} color="#ff6666" />
      <spotLight position={[-4, 6, 0]} angle={0.3} penumbra={0.8} intensity={1} color="#dc2626" />

      <Float speed={1.5} rotationIntensity={0} floatIntensity={0.3}>
        <Car color={carColor} />
      </Float>

      <Platform />
      <Particles count={150} color="#dc2626" />
      <SpeedLines />

      <ContactShadows position={[0, -0.35, 0]} opacity={0.5} scale={8} blur={2.5} far={4} color="#000000" />

      {/* Reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.36, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={40}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0a0a0a"
          metalness={0.5}
        />
      </mesh>

      <fog attach="fog" args={['#000000', 8, 25]} />
    </Canvas>
  );
}
