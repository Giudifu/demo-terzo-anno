import { Float, MeshWobbleMaterial } from "@react-three/drei";
import { useState } from "react";

function CameraModule({ position, fov, onSelect }: { position: [number, number, number], fov: number, onSelect: (fov: number) => void }) {
  const [active, setActive] = useState(false);

  return (
    <group position={position}>
      <Float speed={3} rotationIntensity={2} floatIntensity={1}>
        <mesh 
          onPointerOver={() => setActive(true)} 
          onPointerOut={() => setActive(false)}
          onClick={() => onSelect(fov)}
        >
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <MeshWobbleMaterial 
            color={active ? "#00ffff" : "#444"} 
            emissive={active ? "#00ffff" : "#000"} 
            emissiveIntensity={active ? 2 : 0} 
            wireframe
            factor={active ? 1 : 0}
            speed={2}
          />
        </mesh>
      </Float>
    </group>
  );
}

export function FocusLens({ setFov }: { setFov: (fov: number) => void }) {
  return (
    <group position={[-10, 0, -10]}>
      {/* Moduli Camera con diversi FOV */}
      <CameraModule position={[-3, 1.5, 0]} fov={30} onSelect={setFov} />
      <CameraModule position={[0, 1.5, 0]} fov={50} onSelect={setFov} />
      <CameraModule position={[3, 1.5, 0]} fov={90} onSelect={setFov} />

      {/* Piedistallo */}
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[10, 0.1, 6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}
