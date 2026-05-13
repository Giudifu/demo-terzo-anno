import { Float } from "@react-three/drei";

function ProceduralTechAsset() {
  return (
    <group scale={1.5}>
      {/* Nucleo */}
      <mesh>
        <octahedronGeometry args={[1]} />
        <meshStandardMaterial color="#00ffff" wireframe />
      </mesh>
      {/* Anelli esterni */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.2, 0.05, 16, 100]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[1.4, 0.05, 16, 100]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

export function AssetLab() {
  return (
    <group position={[0, 0, -15]}>
      <Float speed={4} rotationIntensity={2} floatIntensity={1}>
        <ProceduralTechAsset />
      </Float>

      {/* Piedistallo alzato per Z-Fighting */}
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[2, 2, 0.1, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}
