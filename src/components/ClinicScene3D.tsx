import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, RoundedBox } from '@react-three/drei';
import type { DentalCase, VisualCue } from '../game/cases';

const SKIN = ['#f6d7b8', '#eebd8d', '#d19a66', '#a06a3c', '#6f4426'];
const HAIR = ['#2b2b2b', '#6b4a2f', '#c9a06a', '#9aa0a6', '#d94f30'];
const SHIRT = ['#7c6cf0', '#38bdf8', '#34d399', '#f472b6', '#fbbf24', '#f87171'];

function pick<T>(arr: T[], seed: number, salt: number): T {
  return arr[(seed * 7 + salt * 13) % arr.length];
}

const HEAD_POS: [number, number, number] = [0, 1.02, 0.12];
/* mouth built as a relief just above the face surface (head radius 0.16) */
const MOUTH_LOCAL: [number, number, number] = [0, 0.015, 0.158];

/* ---------------- wall sign texture ---------------- */
function useSignTexture(): THREE.CanvasTexture {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 256;
    const g = c.getContext('2d')!;
    g.fillStyle = '#0f2a3a';
    g.beginPath();
    g.roundRect(4, 4, 1016, 248, 28);
    g.fill();
    g.strokeStyle = '#d4a24e';
    g.lineWidth = 8;
    g.beginPath();
    g.roundRect(14, 14, 996, 228, 22);
    g.stroke();
    g.textAlign = 'center';
    g.fillStyle = '#7dd3fc';
    g.font = '800 92px system-ui, sans-serif';
    g.fillText('CLÍNICA DR BASELGA', 512, 122);
    g.fillStyle = '#d4a24e';
    g.font = '600 40px system-ui, sans-serif';
    g.fillText('O D O N T O L O G Í A   &   C I R U G Í A   A V A N Z A D A', 512, 196);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, []);
}

/* ---------------- room ---------------- */
function Room() {
  const sign = useSignTexture();
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[11, 9]} />
        <meshStandardMaterial color="#0e1c33" roughness={0.5} metalness={0.15} />
      </mesh>
      <mesh position={[0, 1.7, -2.3]} receiveShadow>
        <planeGeometry args={[11, 3.4]} />
        <meshStandardMaterial color="#101f38" roughness={0.9} />
      </mesh>
      <mesh position={[-3.4, 1.7, 0]} rotation-y={Math.PI / 2} receiveShadow>
        <planeGeometry args={[9, 3.4]} />
        <meshStandardMaterial color="#0c1830" roughness={0.9} />
      </mesh>
      {/* wall sign */}
      <mesh position={[0, 2.05, -2.28]}>
        <planeGeometry args={[2.9, 0.72]} />
        <meshBasicMaterial map={sign} toneMapped={false} />
      </mesh>
      {/* cyan floor accent strip */}
      <mesh position={[0, 0.006, 1.1]}>
        <boxGeometry args={[6.5, 0.012, 0.035]} />
        <meshStandardMaterial color="#083344" emissive="#22d3ee" emissiveIntensity={1.0} />
      </mesh>
      <ContactShadows position={[0, 0.02, 0]} scale={9} blur={2.4} opacity={0.55} far={3} />
    </group>
  );
}

/* ---------------- dental chair ---------------- */
function DentalChair() {
  const cyan = '#0e7490';
  return (
    <group>
      <mesh position={[0, 0.05, -0.55]} castShadow>
        <cylinderGeometry args={[0.32, 0.38, 0.1, 24]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.32, -0.55]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.5, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.4} />
      </mesh>
      <RoundedBox args={[0.62, 0.15, 0.72]} radius={0.05} position={[0, 0.62, -0.55]} castShadow>
        <meshStandardMaterial color={cyan} roughness={0.35} />
      </RoundedBox>
      <RoundedBox args={[0.6, 0.14, 0.78]} radius={0.05} position={[0, 0.74, -0.12]} rotation-x={-0.42} castShadow>
        <meshStandardMaterial color={cyan} roughness={0.35} />
      </RoundedBox>
      <RoundedBox args={[0.34, 0.1, 0.22]} radius={0.04} position={[0, 0.9, 0.1]} rotation-x={-0.42} castShadow>
        <meshStandardMaterial color="#155e75" roughness={0.4} />
      </RoundedBox>
      {[-0.36, 0.36].map((x) => (
        <RoundedBox key={x} args={[0.08, 0.06, 0.5]} radius={0.02} position={[x, 0.78, -0.5]} castShadow>
          <meshStandardMaterial color="#0b4a5e" roughness={0.4} />
        </RoundedBox>
      ))}
    </group>
  );
}

/* ---------------- teeth ---------------- */
function toothPos(i: number, upper: boolean): [number, number, number] {
  const x = (i - 3.5) * 0.0235;
  const y = MOUTH_LOCAL[1] + (upper ? 0.037 : -0.037);
  const z = MOUTH_LOCAL[2] + 0.012 - Math.abs(i - 3.5) * 0.002;
  return [x, y, z];
}

function Tooth({ index, upper, cue }: { index: number; upper: boolean; cue: VisualCue }) {
  const [x, y, z] = toothPos(index, upper);
  const chipped = cue === 'chip';
  return (
    <group position={[x, y, z]}>
      {cue === 'gumRed' && (
        <mesh position={[0, 0, -0.002]} scale={[0.027, 0.023, 0.008]}>
          <sphereGeometry args={[1, 12, 10]} />
          <meshStandardMaterial color="#d33f3f" roughness={0.6} />
        </mesh>
      )}
      <RoundedBox args={[0.021, chipped ? 0.02 : 0.028, 0.016]} radius={0.005} smoothness={3} castShadow>
        <meshStandardMaterial color="#f7f3e8" roughness={0.25} />
      </RoundedBox>
      {cue === 'stain' && (
        <mesh position={[0.002, 0.002, 0.0085]} scale={[0.007, 0.006, 0.003]}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color="#6b4423" roughness={0.7} />
        </mesh>
      )}
      {cue === 'crack' && (
        <mesh position={[0, 0, 0.0085]} rotation-z={0.35}>
          <boxGeometry args={[0.0032, 0.026, 0.002]} />
          <meshStandardMaterial color="#4a382c" roughness={0.8} />
        </mesh>
      )}
    </group>
  );
}

function Jaw({ dentalCase }: { dentalCase: DentalCase }) {
  const teeth: { i: number; upper: boolean }[] = [];
  for (let i = 0; i < 8; i++) teeth.push({ i, upper: true });
  for (let i = 0; i < 8; i++) teeth.push({ i, upper: false });
  const [mx, my, mz] = MOUTH_LOCAL;
  return (
    <group>
      {/* dark cavity (relief just above the face) */}
      <mesh position={[mx, my - 0.004, mz + 0.002]} scale={[0.1, 0.068, 0.022]}>
        <sphereGeometry args={[1, 20, 14]} />
        <meshStandardMaterial color="#3d0f1c" roughness={0.9} />
      </mesh>
      {/* gum ring */}
      <mesh position={[mx, my, mz + 0.006]} scale={[1.28, 0.82, 1]}>
        <torusGeometry args={[0.075, 0.017, 12, 40]} />
        <meshStandardMaterial color="#b76a72" roughness={0.6} />
      </mesh>
      {/* tongue */}
      <mesh position={[mx, my - 0.038, mz + 0.004]} scale={[0.055, 0.02, 0.045]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color="#a34a5a" roughness={0.6} />
      </mesh>
      {/* lips */}
      <mesh position={[mx, my, mz + 0.016]} scale={[1.32, 0.78, 0.7]}>
        <torusGeometry args={[0.075, 0.023, 14, 40]} />
        <meshStandardMaterial color="#b06a5e" roughness={0.55} />
      </mesh>
      {teeth.map((t) => {
        const idx = t.upper ? t.i : 8 + t.i;
        return (
          <Tooth key={idx} index={t.i} upper={t.upper} cue={idx === dentalCase.tooth ? dentalCase.cue : 'none'} />
        );
      })}
    </group>
  );
}

/* ---------------- patient ---------------- */
function Patient({ dentalCase }: { dentalCase: DentalCase }) {
  const skin = pick(SKIN, dentalCase.id, 1);
  const hairC = pick(HAIR, dentalCase.id, 2);
  const shirt = pick(SHIRT, dentalCase.id, 3);
  const hairStyle = dentalCase.id % 3;
  const torso = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (torso.current) {
      const s = 1 + Math.sin(t * 1.7) * 0.025;
      torso.current.scale.set(1, s, 1);
    }
    if (eyes.current) {
      const blink = t % 3.7 < 0.12 ? 0.12 : 1;
      eyes.current.scale.set(1, blink, 1);
    }
  });

  return (
    <group>
      {/* torso */}
      <group ref={torso} position={[0, 0.88, -0.42]} rotation-x={Math.PI / 2 - 0.18}>
        <mesh castShadow>
          <capsuleGeometry args={[0.17, 0.52, 8, 16]} />
          <meshStandardMaterial color={shirt} roughness={0.7} />
        </mesh>
      </group>
      {/* legs */}
      {[-0.1, 0.1].map((x) => (
        <group key={x} position={[x, 0.8, -1.02]} rotation-x={Math.PI / 2}>
          <mesh castShadow>
            <capsuleGeometry args={[0.085, 0.5, 8, 12]} />
            <meshStandardMaterial color="#1e3a5f" roughness={0.7} />
          </mesh>
        </group>
      ))}
      {[-0.1, 0.1].map((x) => (
        <RoundedBox key={x} args={[0.11, 0.09, 0.2]} radius={0.03} position={[x, 0.74, -1.38]} castShadow>
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </RoundedBox>
      ))}
      {/* arms */}
      {[-0.24, 0.24].map((x) => (
        <group key={x} position={[x, 0.86, -0.35]} rotation-x={Math.PI / 2 - 0.15}>
          <mesh castShadow>
            <capsuleGeometry args={[0.055, 0.42, 6, 10]} />
            <meshStandardMaterial color={shirt} roughness={0.7} />
          </mesh>
        </group>
      ))}
      {/* head */}
      <group position={HEAD_POS}>
        <mesh castShadow>
          <sphereGeometry args={[0.16, 28, 22]} />
          <meshStandardMaterial color={skin} roughness={0.55} />
        </mesh>
        {/* hair */}
        <mesh position={[0, 0.035, -0.02]} castShadow>
          <sphereGeometry args={[0.168, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
          <meshStandardMaterial color={hairC} roughness={0.8} />
        </mesh>
        {hairStyle === 2 && (
          <>
            <mesh position={[-0.15, -0.06, 0.02]} castShadow>
              <capsuleGeometry args={[0.045, 0.12, 6, 10]} />
              <meshStandardMaterial color={hairC} roughness={0.8} />
            </mesh>
            <mesh position={[0.15, -0.06, 0.02]} castShadow>
              <capsuleGeometry args={[0.045, 0.12, 6, 10]} />
              <meshStandardMaterial color={hairC} roughness={0.8} />
            </mesh>
          </>
        )}
        {hairStyle === 1 && (
          <mesh position={[0, 0.1, 0.1]} rotation-x={0.5}>
            <boxGeometry args={[0.2, 0.05, 0.08]} />
            <meshStandardMaterial color={hairC} roughness={0.8} />
          </mesh>
        )}
        {/* eyes */}
        <group ref={eyes}>
          {[-0.058, 0.058].map((x) => (
            <mesh key={x} position={[x, 0.045, 0.145]}>
              <sphereGeometry args={[0.016, 12, 10]} />
              <meshStandardMaterial color="#0f172a" roughness={0.3} />
            </mesh>
          ))}
        </group>
        {/* nose */}
        <mesh position={[0, 0.005, 0.158]}>
          <sphereGeometry args={[0.018, 10, 8]} />
          <meshStandardMaterial color={skin} roughness={0.6} />
        </mesh>
        <Jaw dentalCase={dentalCase} />
      </group>
    </group>
  );
}

/* ---------------- staff ---------------- */
function StaffFigure({
  position,
  rotationY,
  skin,
  coatColor,
  shirtColor,
  maskColor,
  capColor,
  name,
  tool,
}: {
  position: [number, number, number];
  rotationY: number;
  skin: string;
  coatColor: string;
  shirtColor: string;
  maskColor: string;
  capColor: string;
  name: string;
  tool: 'mirror' | 'tray';
}) {
  const body = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (body.current) body.current.position.y = Math.sin(t * 1.4 + position[0]) * 0.008;
  });
  return (
    <group position={position} rotation-y={rotationY}>
      <group ref={body}>
        {/* legs */}
        {[-0.09, 0.09].map((x) => (
          <mesh key={x} position={[x, 0.32, 0]} castShadow>
            <capsuleGeometry args={[0.07, 0.5, 6, 10]} />
            <meshStandardMaterial color="#1e3a5f" roughness={0.7} />
          </mesh>
        ))}
        {/* coat */}
        <mesh position={[0, 1.02, 0]} castShadow>
          <capsuleGeometry args={[0.17, 0.5, 8, 14]} />
          <meshStandardMaterial color={coatColor} roughness={0.65} />
        </mesh>
        {/* shirt V */}
        <mesh position={[0, 1.22, 0.145]}>
          <boxGeometry args={[0.12, 0.16, 0.02]} />
          <meshStandardMaterial color={shirtColor} roughness={0.7} />
        </mesh>
        {/* badge */}
        <mesh position={[0.09, 1.12, 0.155]}>
          <boxGeometry args={[0.07, 0.045, 0.012]} />
          <meshStandardMaterial color="#d4a24e" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* head */}
        <mesh position={[0, 1.52, 0]} castShadow>
          <sphereGeometry args={[0.125, 24, 18]} />
          <meshStandardMaterial color={skin} roughness={0.55} />
        </mesh>
        {/* surgical cap */}
        <mesh position={[0, 1.575, -0.01]}>
          <sphereGeometry args={[0.132, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
          <meshStandardMaterial color={capColor} roughness={0.7} />
        </mesh>
        {/* mask */}
        <RoundedBox args={[0.17, 0.075, 0.06]} radius={0.02} position={[0, 1.47, 0.105]}>
          <meshStandardMaterial color={maskColor} roughness={0.7} />
        </RoundedBox>
        {/* eyes */}
        {[-0.048, 0.048].map((x) => (
          <mesh key={x} position={[x, 1.545, 0.112]}>
            <sphereGeometry args={[0.014, 10, 8]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} />
          </mesh>
        ))}
        {/* right arm reaching forward */}
        <group position={[0.2, 1.28, 0.02]} rotation-x={-0.9} rotation-z={-0.25}>
          <mesh position={[0, -0.2, 0]} castShadow>
            <capsuleGeometry args={[0.05, 0.34, 6, 10]} />
            <meshStandardMaterial color={coatColor} roughness={0.65} />
          </mesh>
          <mesh position={[0, -0.42, 0]}>
            <sphereGeometry args={[0.05, 12, 10]} />
            <meshStandardMaterial color={maskColor} roughness={0.6} />
          </mesh>
          {tool === 'mirror' && (
            <group position={[0, -0.5, 0.02]} rotation-x={0.5}>
              <mesh position={[0, -0.05, 0]}>
                <cylinderGeometry args={[0.008, 0.008, 0.12, 8]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
              </mesh>
              <mesh position={[0, -0.13, 0]} rotation-x={Math.PI / 2}>
                <cylinderGeometry args={[0.032, 0.032, 0.008, 20]} />
                <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.15} />
              </mesh>
            </group>
          )}
        </group>
        {/* left arm down */}
        <group position={[-0.2, 1.28, 0.02]} rotation-z={0.15}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <capsuleGeometry args={[0.05, 0.36, 6, 10]} />
            <meshStandardMaterial color={coatColor} roughness={0.65} />
          </mesh>
          <mesh position={[0, -0.44, 0]}>
            <sphereGeometry args={[0.05, 12, 10]} />
            <meshStandardMaterial color={maskColor} roughness={0.6} />
          </mesh>
        </group>
        {tool === 'tray' && (
          <group position={[0, 0.86, 0.3]}>
            <RoundedBox args={[0.4, 0.025, 0.28]} radius={0.008} castShadow>
              <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.35} />
            </RoundedBox>
            {[0, 1, 2].map((i) => (
              <mesh key={i} position={[-0.12 + i * 0.12, 0.03, 0]} rotation-z={Math.PI / 2}>
                <cylinderGeometry args={[0.008, 0.008, 0.2, 8]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} />
              </mesh>
            ))}
          </group>
        )}
      </group>
      <NameLabel name={name} />
    </group>
  );
}

function NameLabel({ name }: { name: string }) {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 96;
    const g = c.getContext('2d')!;
    g.fillStyle = 'rgba(10,22,40,0.85)';
    g.beginPath();
    g.roundRect(0, 0, 512, 96, 24);
    g.fill();
    g.strokeStyle = '#22d3ee';
    g.lineWidth = 4;
    g.beginPath();
    g.roundRect(4, 4, 504, 88, 20);
    g.stroke();
    g.fillStyle = '#e8f1ff';
    g.font = '700 44px system-ui, sans-serif';
    g.textAlign = 'center';
    g.fillText(name, 256, 64);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [name]);
  return (
    <mesh position={[0, 1.78, 0]}>
      <planeGeometry args={[0.52, 0.098]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} />
    </mesh>
  );
}

/* ---------------- lamp ---------------- */
function Beam({ from, to, r }: { from: [number, number, number]; to: [number, number, number]; r: number }) {
  const { pos, quat, len } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = b.clone().sub(a);
    const len = dir.length();
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    const pos = a.add(b).multiplyScalar(0.5);
    return { pos, quat, len };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <mesh position={pos} quaternion={quat} castShadow>
      <cylinderGeometry args={[r, r, len, 10]} />
      <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.4} />
    </mesh>
  );
}

const LAMP_HEAD: [number, number, number] = [0.12, 2.02, 0.3];
const LAMP_ELBOW: [number, number, number] = [0.95, 2.55, -0.55];
const LAMP_BASE: [number, number, number] = [1.8, 0, -1.35];

function Lamp() {
  const mouthTarget = useMemo(() => new THREE.Object3D(), []);
  return (
    <group>
      <mesh position={[LAMP_BASE[0], 0.06, LAMP_BASE[2]]} castShadow>
        <cylinderGeometry args={[0.22, 0.26, 0.12, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>
      <Beam from={LAMP_BASE} to={[LAMP_BASE[0], 2.7, LAMP_BASE[2]]} r={0.05} />
      <Beam from={[LAMP_BASE[0], 2.7, LAMP_BASE[2]]} to={LAMP_ELBOW} r={0.035} />
      <Beam from={LAMP_ELBOW} to={LAMP_HEAD} r={0.035} />
      {[LAMP_ELBOW].map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <sphereGeometry args={[0.055, 14, 12]} />
          <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.4} />
        </mesh>
      ))}
      <group position={LAMP_HEAD}>
        <mesh castShadow>
          <sphereGeometry args={[0.11, 18, 14]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.06, 0.05]} rotation-x={0.5}>
          <cylinderGeometry args={[0.09, 0.13, 0.1, 20, 1, true]} />
          <meshStandardMaterial color="#0ea5e9" roughness={0.35} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.1, 0.07]} rotation-x={0.5}>
          <circleGeometry args={[0.085, 20]} />
          <meshBasicMaterial color="#fef9c3" toneMapped={false} />
        </mesh>
      </group>
      {/* visible light cone */}
      <mesh position={[0.06, 1.55, 0.28]} rotation-x={-0.12}>
        <cylinderGeometry args={[0.1, 0.42, 0.95, 20, 1, true]} />
        <meshBasicMaterial color="#fef9c3" transparent opacity={0.055} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <spotLight
        position={[LAMP_HEAD[0], LAMP_HEAD[1] - 0.07, LAMP_HEAD[2]]}
        angle={0.55}
        penumbra={0.5}
        intensity={60}
        color="#fff7d6"
        castShadow
        shadow-mapSize={[1024, 1024]}
        target={mouthTarget}
      />
      <primitive object={mouthTarget} position={[HEAD_POS[0], HEAD_POS[1], HEAD_POS[2]]} />
    </group>
  );
}

/* ---------------- furniture ---------------- */
function Furniture() {
  return (
    <group>
      {/* cabinet */}
      <group position={[-1.75, 0, -1.0]} rotation-y={0.35}>
        <RoundedBox args={[0.95, 1.15, 0.5]} radius={0.03} position={[0, 0.575, 0]} castShadow>
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </RoundedBox>
        {[0.32, 0.62, 0.92].map((y) => (
          <mesh key={y} position={[0, y, 0.252]}>
            <boxGeometry args={[0.7, 0.02, 0.01]} />
            <meshStandardMaterial color="#334155" roughness={0.6} />
          </mesh>
        ))}
        {[0.32, 0.62, 0.92].map((y) => (
          <mesh key={y} position={[0, y + 0.1, 0.256]}>
            <boxGeometry args={[0.22, 0.035, 0.02]} />
            <meshStandardMaterial color="#475569" roughness={0.5} />
          </mesh>
        ))}
        <RoundedBox args={[0.16, 0.22, 0.12]} radius={0.02} position={[-0.25, 1.26, 0]}>
          <meshStandardMaterial color="#0ea5e9" roughness={0.4} />
        </RoundedBox>
        <RoundedBox args={[0.12, 0.18, 0.1]} radius={0.02} position={[0.05, 1.24, 0.02]}>
          <meshStandardMaterial color="#34d399" roughness={0.4} />
        </RoundedBox>
        <mesh position={[0.3, 1.22, 0]} rotation-z={0.4}>
          <cylinderGeometry args={[0.05, 0.05, 0.2, 12]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
        </mesh>
      </group>
      {/* plant */}
      <group position={[1.95, 0, -1.15]}>
        <mesh position={[0, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.12, 0.4, 14]} />
          <meshStandardMaterial color="#b45309" roughness={0.7} />
        </mesh>
        {[
          [0, 0.62, 0, 0.22],
          [-0.14, 0.52, 0.05, 0.15],
          [0.14, 0.54, -0.04, 0.16],
        ].map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]} castShadow>
            <sphereGeometry args={[r, 14, 12]} />
            <meshStandardMaterial color={['#16a34a', '#22c55e', '#15803d'][i]} roughness={0.8} />
          </mesh>
        ))}
      </group>
      {/* stool */}
      <group position={[1.35, 0, 1.2]}>
        <mesh position={[0, 0.52, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.09, 18]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.5, 10]} />
          <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.22, 0.26, 0.06, 18]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

/* ---------------- camera rig ---------------- */
const VIEWS = [
  { pos: new THREE.Vector3(3.6, 2.5, 4.8), tgt: new THREE.Vector3(0, 0.85, -0.3) },
  { pos: new THREE.Vector3(1.5, 1.75, 2.15), tgt: new THREE.Vector3(0, 1.0, 0.12) },
  { pos: new THREE.Vector3(-0.14, 1.2, 0.9), tgt: new THREE.Vector3(0, 1.035, 0.26) },
];

function CameraRig({ view }: { view: 1 | 2 | 3 }) {
  const rig = useRef({ azimuth: 0, dolly: 1 });
  const curTgt = useRef(new THREE.Vector3(0, 0.85, -0.3));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const r = rig.current;
      if (k === 'w' || k === '+' || k === '=') r.dolly = Math.max(0.45, r.dolly - 0.12);
      else if (k === 's' || k === '-' || k === '_') r.dolly = Math.min(2.2, r.dolly + 0.12);
      else if (e.key === 'ArrowLeft') r.azimuth = Math.max(-0.9, r.azimuth - 0.14);
      else if (e.key === 'ArrowRight') r.azimuth = Math.min(0.9, r.azimuth + 0.14);
      else if (k === 'r') {
        r.azimuth = 0;
        r.dolly = 1;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useFrame(({ camera }, delta) => {
    const d = Math.min(delta, 0.1);
    const kp = 1 - Math.exp(-d * 3.2);
    const kt = 1 - Math.exp(-d * 4.2);
    const v = VIEWS[view - 1];
    const r = rig.current;
    const offset = v.pos.clone().sub(v.tgt);
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), r.azimuth);
    offset.multiplyScalar(r.dolly);
    const desired = v.tgt.clone().add(offset);
    camera.position.lerp(desired, kp);
    curTgt.current.lerp(v.tgt, kt);
    camera.lookAt(curTgt.current);
  });
  return null;
}

/* ---------------- main ---------------- */
export default function ClinicScene3D({ dentalCase, zoom }: { dentalCase: DentalCase; zoom: 1 | 2 | 3 }) {
  const dentistSkin = '#eebd8d';
  return (
    <div className="scene-frame scene-3d">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ fov: 45, near: 0.05, far: 60, position: [3.6, 2.5, 4.8] }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#070d18']} />
        <fog attach="fog" args={['#070d18', 9, 20]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 3]} intensity={1.1} castShadow shadow-mapSize={[1024, 1024]} />
        <pointLight position={[-2, 2.4, 2]} intensity={6} color="#22d3ee" />
        <pointLight position={[2.5, 1.8, -1.5]} intensity={4} color="#7c6cf0" />

        <Room />
        <DentalChair />
        <Patient dentalCase={dentalCase} />
        <StaffFigure
          position={[0.95, 0, 0.55]}
          rotationY={-Math.PI / 2 + 0.35}
          skin={dentistSkin}
          coatColor="#eef2f7"
          shirtColor="#0ea5e9"
          maskColor="#7dd3fc"
          capColor="#0ea5e9"
          name="Dr Baselga"
          tool="mirror"
        />
        <StaffFigure
          position={[-1.05, 0, 0.85]}
          rotationY={Math.PI / 2 - 0.5}
          skin={pick(SKIN, dentalCase.id, 4)}
          coatColor="#f1f5f9"
          shirtColor="#34d399"
          maskColor="#a5f3d0"
          capColor="#34d399"
          name="Asistente"
          tool="tray"
        />
        <Lamp />
        <Furniture />
        <CameraRig view={zoom} />
      </Canvas>
      <div className="scene-hint">W/S acercar · ←/→ girar · R centrar</div>
    </div>
  );
}
