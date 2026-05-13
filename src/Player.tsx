import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, Html } from "@react-three/drei";
import * as THREE from "three";

export function Player({ onPositionChange }: { onPositionChange?: (pos: THREE.Vector3) => void }) {
  const meshRef = useRef<THREE.Group>(null);
  const [, getKeys] = useKeyboardControls();
  const [showBubble, setShowBubble] = useState(false);
  
  const SPEED = 5;
  const cameraTarget = new THREE.Vector3();

  // Chiudi il fumetto dopo 3 secondi
  useEffect(() => {
    if (showBubble) {
      const timer = setTimeout(() => setShowBubble(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showBubble]);

  useFrame((state, delta) => {
    const { forward, backward, left, right } = getKeys();
    
    if (!meshRef.current) return;

    const safeDelta = Math.min(delta, 0.1);
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3(0, 0, Number(backward) - Number(forward));
    const sideVector = new THREE.Vector3(Number(left) - Number(right), 0, 0);

    direction.subVectors(frontVector, sideVector);

    if (direction.length() > 0) {
      direction.normalize().multiplyScalar(SPEED * safeDelta);
      meshRef.current.position.add(direction);

      const targetAngle = Math.atan2(direction.x, direction.z);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetAngle,
        0.15
      );
    }

    const playerPos = meshRef.current.position;
    cameraTarget.set(playerPos.x, playerPos.y + 5, playerPos.z + 10);
    
    state.camera.position.lerp(cameraTarget, 0.1);
    state.camera.lookAt(playerPos.x, playerPos.y + 1, playerPos.z);

    if (onPositionChange) onPositionChange(playerPos);
  });

  return (
    <group ref={meshRef} onClick={() => setShowBubble(true)}>
      {showBubble && (
        <Html position={[0, 2.5, 0]} center distanceFactor={10}>
          <div style={{
            background: 'white',
            padding: '5px 12px',
            borderRadius: '10px',
            border: '2px solid #ff0000',
            whiteSpace: 'nowrap',
            fontFamily: 'monospace',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#000',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            transform: 'translateY(-20px)',
            pointerEvents: 'none'
          }}>
            HELLO CANDIDATE! 👋
          </div>
        </Html>
      )}
      <mesh position={[0, 1, 0]}>
        <capsuleGeometry args={[0.4, 1, 4, 16]} />
        <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.4} />
      </mesh>
      
      {/* Anello energetico alla base */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.45, 0.02, 16, 48]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
      </mesh>

      <mesh position={[0, 1.5, 0.3]}>
        <boxGeometry args={[0.6, 0.1, 0.2]} />
        <meshStandardMaterial color="#000000" emissive="#ff0000" emissiveIntensity={5} />
      </mesh>
    </group>
  );
}
