'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, Environment } from '@react-three/drei';
import { Suspense, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

// Try different path approaches
const MODEL_PATH = '/robot.glb';

// Preload the model
try {
  useGLTF.preload(MODEL_PATH);
} catch (error) {
  console.warn('Failed to preload model:', error);
}

function Model() {
  const { scene } = useGLTF(MODEL_PATH);
  const modelRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Object3D | null>(null);

  // Find potential arm/hand meshes after model loads
  useEffect(() => {
    if (scene) {
      // Traverse the scene to find objects that might be arms/hands
      scene.traverse((child) => {
        // Look for objects with names that might indicate arms/hands
        if (child.name && (
          child.name.toLowerCase().includes('arm') || 
          child.name.toLowerCase().includes('hand') ||
          child.name.toLowerCase().includes('right')
        )) {
          rightArmRef.current = child;
        }
      });
      
      // If no specific arm found, try to find mesh objects that could be arms
      if (!rightArmRef.current) {
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh && child.name) {
            // Check for common arm/hand naming patterns
            const name = child.name.toLowerCase();
            if (name.includes('upper') || name.includes('limb') || 
                name.includes('forearm') || name.includes('elbow')) {
              rightArmRef.current = child;
            }
          }
        });
      }
    }
  }, [scene]);

  // Add continuous rotation on Y-axis for entire model
  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005;
    }
    
    // Add waving animation to right arm/hand
    if (rightArmRef.current) {
      // Use sine wave for natural waving motion
      const waveTime = state.clock.getElapsedTime();
      const waveAngle = Math.sin(waveTime * 2) * 0.5; // Waving amplitude
      
      // Rotate around X-axis for waving motion
      rightArmRef.current.rotation.x = waveAngle;
      
      // Add slight rotation around Y-axis for more natural motion
      rightArmRef.current.rotation.y = Math.sin(waveTime * 1.5) * 0.2;
    }
  });

  return (
    <Float
      speed={4}
      rotationIntensity={1.8}
      floatIntensity={3}
      floatingRange={[-0.2, 0.2]}
    >
      <primitive 
        ref={modelRef}
        object={scene} 
        scale={0.8}
        position={[0, 0, 0]}
      />
    </Float>
  );
}

function Fallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#818cf8" />
    </mesh>
  );
}

export default function Robot3D() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Test if the model file is accessible
    fetch(MODEL_PATH)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch model: ${response.status} ${response.statusText}`);
        }
        return response.blob();
      })
      .then(() => {
        console.log('Model file is accessible');
      })
      .catch(err => {
        console.error('Model file accessibility check failed:', err);
        setError(`Model not accessible: ${err.message}. Trying from ${window.location.origin}${MODEL_PATH}`);
      });
  }, []);

  return (
    <div className="w-full h-[400px] lg:h-[500px] relative">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 text-red-300 text-sm p-4 rounded-lg">
          <div>
            <p className="font-semibold">3D Model Loading Error</p>
            <p className="mt-2">{error}</p>
            <p className="mt-2">Using path: {MODEL_PATH}</p>
            <p className="mt-2">Full URL: {typeof window !== 'undefined' ? `${window.location.origin}${MODEL_PATH}` : MODEL_PATH}</p>
          </div>
        </div>
      )}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={<Fallback />}>
          {/* Ambient light for overall illumination */}
          <ambientLight intensity={0.5} />
          
          {/* Directional light for shadows and highlights */}
          <directionalLight
            position={[10, 10, 10]}
            intensity={1}
            color="#ffffff"
            castShadow
          />
          
          {/* Purple point light for brand color accent */}
          <pointLight
            position={[-5, 5, 5]}
            color="#818cf8"
            intensity={2}
            distance={20}
          />
          
          {/* Additional fill light */}
          <pointLight
            position={[5, -5, 5]}
            color="#a855f7"
            intensity={1}
            distance={15}
          />
          
          {/* Load and display the 3D model */}
          <Model />
          
          {/* Simple environment for reflections */}
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
