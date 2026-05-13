import { Float, MeshDistortMaterial } from "@react-three/drei";
import { useState } from "react";

function LightModule({ position, type, color }: { position: [number, number, number], type: string, color: string }) {
  const [active, setActive] = useState(false);

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh 
          onPointerOver={() => setActive(true)} 
          onPointerOut={() => setActive(false)}
        >
          <sphereGeometry args={[0.5, 32, 32]} />
          <MeshDistortMaterial 
            color={active ? color : "#222"} 
            emissive={active ? color : "#000"} 
            emissiveIntensity={active ? 4 : 0}
            speed={active ? 4 : 1}
            distort={active ? 0.4 : 0.2}
            radius={1}
          />
        </mesh>
      </Float>

      {active && (
        <>
          {type === 'point' && <pointLight intensity={2} color={color} distance={5} />}
          {type === 'spot' && <spotLight position={[0, 5, 0]} angle={0.3} intensity={5} color={color} />}
        </>
      )}
    </group>
  );
}

export function LightForge() {
  return (
    <group position={[10, 0, -10]}>
      <LightModule position={[-3, 1.5, 0]} type="point" color="#ff0000" />
      <LightModule position={[0, 1.5, 0]} type="spot" color="#00ff00" />
      <LightModule position={[3, 1.5, 0]} type="point" color="#0000ff" />

      {/* Piedistallo alzato per evitare Z-Fighting */}
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[10, 0.1, 6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}
