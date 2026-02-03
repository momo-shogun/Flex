/* Based on react-bits Backgrounds/Silk - https://github.com/DavidHDev/react-bits */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { forwardRef, useRef, useLayoutEffect, useEffect } from 'react';
import * as THREE from 'three';

const DEFAULT_HEX = '#7B7481';

/** Parse hex to [r,g,b] in 0–1. Returns default if invalid. */
function hexToNormalizedRGB(hex: string): [number, number, number] {
  const h = String(hex).replace('#', '').trim();
  if (h.length !== 6 || !/^[0-9A-Fa-f]+$/.test(h)) {
    return hexToNormalizedRGB(DEFAULT_HEX);
  }
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

function clampNum(value: number, min: number, max: number): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;
uniform vec3 uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;
const float e = 2.71828182845904523536;
float noise(vec2 texCoord) {
  float G = e;
  vec2 r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}
vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2 rot = mat2(c, -s, s, c);
  return rot * uv;
}
void main() {
  float rnd = noise(gl_FragCoord.xy);
  vec2 uv = rotateUvs(vUv * uScale, uRotation);
  vec2 tex = uv * uScale;
  float tOffset = uSpeed * uTime;
  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);
  float pattern = 0.6 +
    0.4 * sin(5.0 * (tex.x + tex.y + cos(3.0 * tex.x + 5.0 * tex.y) + 0.02 * tOffset) +
    sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));
  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`;

interface SilkPlaneProps {
  uniforms: Record<string, THREE.IUniform>;
}

const SilkPlane = forwardRef<THREE.Mesh, SilkPlaneProps>(function SilkPlane(
  { uniforms },
  ref
) {
  const { viewport } = useThree();

  useLayoutEffect(() => {
    if (ref && typeof ref !== 'function' && ref.current) {
      ref.current.scale.set(viewport.width, viewport.height, 1);
    }
  }, [ref, viewport]);

  useFrame((_, delta) => {
    if (ref && typeof ref !== 'function' && ref.current?.material && 'uniforms' in ref.current.material) {
      const u = (ref.current.material as THREE.ShaderMaterial).uniforms;
      if (u.uTime) u.uTime.value += 0.1 * delta;
    }
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
});
SilkPlane.displayName = 'SilkPlane';

export interface SilkProps {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
  className?: string;
}

export function Silk({
  speed = 5,
  scale = 1,
  color = DEFAULT_HEX,
  noiseIntensity = 1.5,
  rotation = 0,
  className = '',
}: SilkProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Stable uniform refs so we never replace the object — only update .value.
  // Replacing uniforms causes Three.js shader material to crash on prop changes.
  const uniformsRef = useRef({
    uSpeed: { value: clampNum(speed, 0, 100) },
    uScale: { value: clampNum(scale, 0.1, 10) },
    uNoiseIntensity: { value: clampNum(noiseIntensity, 0, 5) },
    uRotation: { value: clampNum(rotation, -Math.PI * 2, Math.PI * 2) },
    uColor: { value: new THREE.Vector3(...hexToNormalizedRGB(color)) },
    uTime: { value: 0 },
  });

  useEffect(() => {
    const u = uniformsRef.current;
    u.uSpeed.value = clampNum(speed, 0, 100);
    u.uScale.value = clampNum(scale, 0.1, 10);
    u.uNoiseIntensity.value = clampNum(noiseIntensity, 0, 5);
    u.uRotation.value = clampNum(rotation, -Math.PI * 2, Math.PI * 2);
    const [r, g, b] = hexToNormalizedRGB(color ?? DEFAULT_HEX);
    u.uColor.value.set(r, g, b);
  }, [speed, scale, noiseIntensity, color, rotation]);

  return (
    <div className={`absolute inset-0 w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 1], fov: 50 }} dpr={[1, 2]}>
        <SilkPlane ref={meshRef as React.Ref<THREE.Mesh>} uniforms={uniformsRef.current} />
      </Canvas>
    </div>
  );
}
