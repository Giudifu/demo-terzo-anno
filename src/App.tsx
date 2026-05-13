import { Canvas } from '@react-three/fiber'
import { KeyboardControls, Grid, Float, MeshReflectorMaterial, ContactShadows } from '@react-three/drei'
import { Suspense, useState, useEffect } from 'react'
import { Player } from './Player'
import { LightForge } from './LightForge'
import { FocusLens } from './FocusLens'
import { AssetLab } from './AssetLab'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'

function BackgroundElements() {
  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[20, 10, -30]}>
          <boxGeometry args={[4, 4, 4]} />
          <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.1} />
        </mesh>
      </Float>
      <Float speed={3} rotationIntensity={1} floatIntensity={1}>
        <mesh position={[-20, 15, -40]}>
          <octahedronGeometry args={[5]} />
          <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.05} />
        </mesh>
      </Float>
    </group>
  )
}

function Scene({ setZone, setFov, currentFov }: { setZone: (zone: string) => void, setFov: (fov: number) => void, currentFov: number }) {
  const { camera } = useThree();

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = currentFov;
      camera.updateProjectionMatrix();
    }
  }, [currentFov, camera]);

  return (
    <>
      <color attach="background" args={['#d8dee9']} />
      <fog attach="fog" args={['#d8dee9', 20, 80]} />
      
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} />

      <BackgroundElements />
      
      <LightForge />
      <FocusLens setFov={setFov} />
      <AssetLab />

      <ContactShadows 
        position={[0, 0.01, 0]} 
        opacity={0.4} 
        scale={40} 
        blur={2} 
        far={4.5} 
      />

      <Grid 
        infiniteGrid 
        fadeDistance={50} 
        fadeStrength={5} 
        cellSize={1} 
        sectionSize={10} 
        sectionColor="#888888" 
        cellColor="#aaaaaa" 
      />

      <Player onPositionChange={(pos) => {
        if (pos.x > 5 && Math.abs(pos.z + 10) < 5) setZone('Light Forge')
        else if (pos.x < -5 && Math.abs(pos.z + 10) < 5) setZone('Focus Lens')
        else if (pos.z < -10 && Math.abs(pos.x) < 5) setZone('Asset Lab')
        else setZone('Central Hub')
      }} />

      {/* Pavimento Premium Abstergo (Ottimizzato) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={256}
          mixBlur={1}
          mixStrength={50}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#ffffff"
          metalness={0.5}
          mirror={1}
        />
      </mesh>
    </>
  )
}

const map = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
];

function HUD({ zone }: { zone: string }) {
  const getMessage = () => {
    switch(zone) {
      case 'Light Forge': return "Benvenuto nella Fucina delle Luci. Passa il mouse sulle sfere per sperimentare.";
      case 'Focus Lens': return "Sezione Camera: Clicca sui cubi per cambiare il Field of View (FOV).";
      case 'Asset Lab': return "Laboratorio Asset: Qui carichiamo modelli esterni (GLTF). Osserva l'asset fluttuante.";
      default: return "Muoviti tra le piattaforme per iniziare le esercitazioni.";
    }
  }

  return (
    <div className="hud-overlay">
      <div className="hud-header">
        <h1>Abstergo Vibe Academy</h1>
        <p>Location: {zone} | Candidate: 01</p>
      </div>
      
      <div className="hud-footer">
        <div className="instruction-box">
          <strong>[SISTEMA]</strong>
          <p>{getMessage()}</p>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [fov, setFov] = useState(50);
  const [zone, setZone] = useState('Central Hub');

  return (
    <KeyboardControls map={map}>
      <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <Canvas camera={{ position: [5, 5, 5], fov }}>
          <Suspense fallback={null}>
            <Scene setZone={setZone} setFov={setFov} currentFov={fov} />
          </Suspense>
        </Canvas>
        <HUD zone={zone} />
      </div>
    </KeyboardControls>
  )
}
