/// <reference types="vite/client" />

// Allow TypeScript to understand CSS imports (side-effect imports)
declare module '*.css';

// three.js - stub types so components type-check without @types/three
declare module 'three' {
  export interface IUniform {
    value: unknown;
  }
  export class Vector2 {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    set(x: number, y: number): this;
  }
  export class Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number);
    set(x: number, y: number, z: number): this;
  }
  export class Color {
    r: number;
    g: number;
    b: number;
    constructor(hex?: string | number);
  }
  export class Object3D {}
  export class BufferGeometry {
    dispose(): void;
  }
  export class Material {
    dispose(): void;
  }
  export class ShaderMaterial extends Material {
    uniforms: Record<string, IUniform>;
    constructor(params?: Record<string, unknown>);
  }
  export class Mesh extends Object3D {
    material: Material | Material[];
    geometry: BufferGeometry;
    scale: Vector3;
    constructor(geometry?: BufferGeometry, material?: Material | Material[]);
  }
  export class Scene extends Object3D {
    add(object: Object3D): void;
  }
  export class OrthographicCamera extends Object3D {
    position: Vector3;
    constructor(left: number, right: number, top: number, bottom: number, near?: number, far?: number);
  }
  export class WebGLRenderer {
    domElement: HTMLCanvasElement;
    setSize(width: number, height: number, updateStyle?: boolean): void;
    setPixelRatio(value: number): void;
    render(scene: Scene, camera: OrthographicCamera): void;
    dispose(): void;
    constructor(params?: Record<string, unknown>);
  }
  export class PlaneGeometry extends BufferGeometry {
    constructor(width?: number, height?: number);
  }
  export class Clock {
    constructor();
    getElapsedTime(): number;
  }
  export const UniformsUtils: { merge(u: unknown[]): unknown };
  export const DoubleSide: number;
  export const FrontSide: number;
  export const BackSide: number;
  export const ClampToEdgeWrapping: number;
  export const LinearFilter: number;
  export const LinearMipmapLinearFilter: number;
  export const RGBAFormat: number;
  export const UnsignedByteType: number;
  export const LinearEncoding: number;
  export const RepeatWrapping: number;
  export const MirroredRepeatWrapping: number;
  export const NearestFilter: number;
  export const NearestMipmapNearestFilter: number;
  export const RGBFormat: number;
  export const RedFormat: number;
  export const RedIntegerFormat: number;
  export const RGBAIntegerFormat: number;
  export const RGB_ETC1_Format: number;
  export const RGB_S3TC_DXT1_Format: number;
  export const RGBA_S3TC_DXT5_Format: number;
  export const SRGBTransfer: number;
  export const LinearTransfer: number;
  export const UnsignedShortType: number;
  export const FloatType: number;
  export const HalfFloatType: number;
  export const UnsignedIntType: number;
  export const ShortType: number;
  export const UnsignedShort4444Type: number;
  export const UnsignedShort5551Type: number;
  export const UnsignedInt248Type: number;
  export const DepthFormat: number;
  export const DepthStencilFormat: number;
  export const sRGBEncoding: number;
  export const LinearSRGBEncoding: number;
}
