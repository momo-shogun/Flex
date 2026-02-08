/* Based on react-bits Backgrounds/LightPillar - https://github.com/DavidHDev/react-bits */
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export interface LightPillarProps {
  topColor?: string;
  bottomColor?: string;
  intensity?: number;
  rotationSpeed?: number;
  className?: string;
}

export function LightPillar({
  topColor = '#5227FF',
  bottomColor = '#FF9FFC',
  intensity = 1.0,
  rotationSpeed = 0.3,
  className = '',
}: LightPillarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) setWebGLSupported(false);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !webGLSupported) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'default',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    const parseColor = (hex: string) => {
      const c = new THREE.Color(hex);
      return new THREE.Vector3(c.r, c.g, c.b);
    };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec3 uTopColor;
      uniform vec3 uBottomColor;
      uniform float uIntensity;
      uniform float uRotCos;
      uniform float uRotSin;
      varying vec2 vUv;

      void main() {
        vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
        vec3 ro = vec3(0.0, 0.0, -10.0);
        vec3 rd = normalize(vec3(uv, 1.0));
        float rotC = uRotCos;
        float rotS = uRotSin;
        vec3 col = vec3(0.0);
        float t = 0.1;
        for (int i = 0; i < 60; i++) {
          vec3 p = ro + rd * t;
          p.xz = vec2(rotC * p.x - rotS * p.z, rotS * p.x + rotC * p.z);
          vec3 q = p;
          q.y = p.y * 0.4 + uTime;
          q += cos(q.zxy - uTime * 2.0) * 0.5;
          float d = length(cos(q.xz)) - 0.2;
          d = abs(d) * 0.15 + 0.01;
          float grad = clamp((15.0 - p.y) / 30.0, 0.0, 1.0);
          col += mix(uBottomColor, uTopColor, grad) / d;
          t += d * 1.0;
          if (t > 50.0) break;
        }
        col = tanh(col * 0.005);
        gl_FragColor = vec4(col * uIntensity, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uTopColor: { value: parseColor(topColor) },
        uBottomColor: { value: parseColor(bottomColor) },
        uIntensity: { value: intensity },
        uRotCos: { value: 1.0 },
        uRotSin: { value: 0.0 },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let time = 0;
    let raf = 0;
    const animate = () => {
      time += 0.016 * rotationSpeed;
      material.uniforms.uTime.value = time;
      material.uniforms.uRotCos.value = Math.cos(time * 0.3);
      material.uniforms.uRotSin.value = Math.sin(time * 0.3);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      (material.uniforms.uResolution.value as THREE.Vector2).set(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      material.dispose();
      geometry.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [
    topColor,
    bottomColor,
    intensity,
    rotationSpeed,
    webGLSupported,
  ]);

  if (!webGLSupported) {
    return (
      <div
        className={`absolute inset-0 flex items-center justify-center text-slate-500 ${className}`}
      >
        WebGL not supported
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ background: '#050508' }}
    />
  );
}
