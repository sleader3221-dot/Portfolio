import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  PerspectiveCamera,
  Points,
  Raycaster,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { bridge } from "../lib/bridge";
import { buildForms } from "./forms";
import vertexShader from "./shaders/field.vert.glsl?raw";
import fragmentShader from "./shaders/field.frag.glsl?raw";

type Shot = { pos: [number, number, number]; look: [number, number, number] };

/** One camera shot per form. Landscape frames the subject beside the copy; portrait centres it. */
function shots(aspect: number): Shot[] {
  const wide = aspect > 1.05;
  const z = wide ? 1 : 1.75;
  return [
    { pos: [wide ? -2.0 : 0, wide ? 0.5 : 0.6, wide ? 7.2 : 15], look: [wide ? -2.0 : 0, wide ? 0.5 : 0.6, 0] },
    { pos: [wide ? 2.0 : 0, 0.15, 6.2 * z], look: [wide ? 2.0 : 0, 0, 0] },
    { pos: [0.4, 0.9, 6.6 * z], look: [0, 0, 0] },
    { pos: [0, 2.2, 5.6 * z], look: [0, -1.15, -1.8] },
    { pos: [0, 0, 7.6 * z], look: [0, 0, 0] },
  ];
}

const ease = (t: number) => t * t * (3 - 2 * t);

export class Stage {
  readonly renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new PerspectiveCamera(38, 1, 0.05, 80);
  private material: ShaderMaterial;
  private geometry: BufferGeometry;
  private shots: Shot[] = shots(1);
  private ray = new Raycaster();
  private ndc = new Vector2();
  private look = new Vector3();
  private tmp = new Vector3();
  private parallax = { x: 0, y: 0 };
  private pointerLevel = 0;
  private morph = 0;
  private dim = 1;
  private elapsed = 0;
  private last = performance.now();
  private running = false;

  constructor(
    private canvas: HTMLCanvasElement,
    count: number,
    private maxDpr: number,
    private motion: boolean,
  ) {
    this.renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
    this.renderer.setClearColor(0x000000, 0);

    const forms = buildForms(count);
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(forms.positions[0]!, 3));
    forms.positions.slice(1).forEach((arr, i) => g.setAttribute(`aP${i + 1}`, new BufferAttribute(arr, 3)));
    g.setAttribute("aRand", new BufferAttribute(forms.rand, 4));
    this.geometry = g;

    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 0 },
        uIntro: { value: 0 },
        uMotion: { value: motion ? 1 : 0 },
        uSize: { value: 34 },
        uPixelRatio: { value: 1 },
        uRayO: { value: new Vector3() },
        uRayD: { value: new Vector3(0, 0, -1) },
        uPointer: { value: 0 },
        uOpacity: { value: 1 },
        uBone: { value: new Color("#ece7de") },
        uEmber: { value: new Color("#ff5a1f") },
        uUv: { value: new Color("#8f7dff") },
      },
    });

    const points = new Points(g, this.material);
    points.frustumCulled = false;
    this.scene.add(points);
    this.resize();
    // Compile now so the preloader's "compiling" step is honest and the first frame never hitches.
    this.renderer.compile(this.scene, this.camera);
  }

  resize() {
    const w = window.innerWidth, h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, this.maxDpr);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.material.uniforms.uPixelRatio!.value = dpr * (h / 900);
    this.shots = shots(w / h);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.renderer.setAnimationLoop(this.frame);
  }

  stop() {
    this.running = false;
    this.renderer.setAnimationLoop(null);
  }

  private frame = () => {
    const now = performance.now();
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.elapsed += dt;
    const k = 1 - Math.exp(-dt * 5);
    const u = this.material.uniforms;

    // Smooth everything the DOM writes, so scroll jitter never reaches the GPU.
    this.morph += (bridge.morph - this.morph) * (this.motion ? k : 1);
    this.dim += (bridge.dim - this.dim) * k;
    this.parallax.x += (bridge.pointer.x - this.parallax.x) * k * 0.6;
    this.parallax.y += (bridge.pointer.y - this.parallax.y) * k * 0.6;

    u.uTime!.value = this.elapsed;
    u.uMorph!.value = this.morph;
    u.uIntro!.value = bridge.intro;
    u.uOpacity!.value = this.dim;

    // Camera: interpolate between neighbouring shots, add pointer parallax, then the final dive.
    const i = Math.min(this.shots.length - 2, Math.floor(this.morph));
    const f = ease(Math.min(1, Math.max(0, this.morph - i)));
    const a = this.shots[i]!, b = this.shots[i + 1]!;
    const pos = this.camera.position;
    pos.set(
      a.pos[0] + (b.pos[0] - a.pos[0]) * f,
      a.pos[1] + (b.pos[1] - a.pos[1]) * f,
      a.pos[2] + (b.pos[2] - a.pos[2]) * f,
    );
    this.look.set(
      a.look[0] + (b.look[0] - a.look[0]) * f,
      a.look[1] + (b.look[1] - a.look[1]) * f,
      a.look[2] + (b.look[2] - a.look[2]) * f,
    );
    const dive = ease(bridge.dive);
    pos.z -= dive * (pos.z + 9);
    pos.x += this.parallax.x * 0.32 * (1 - dive);
    pos.y += this.parallax.y * 0.2 * (1 - dive);
    this.look.z -= dive * 12;
    this.camera.lookAt(this.look);
    this.camera.rotation.z += Math.sin(this.elapsed * 0.15) * 0.012 * (this.motion ? 1 : 0) + dive * 0.25;

    // Pointer ray in world space (the field has no transform, so world == local).
    const active = bridge.pointer.active ? 1 : 0;
    this.pointerLevel += (active * (this.motion ? 1 : 0) - this.pointerLevel) * k;
    this.ndc.set(bridge.pointer.x, bridge.pointer.y);
    this.camera.updateMatrixWorld();
    this.ray.setFromCamera(this.ndc, this.camera);
    (u.uRayO!.value as Vector3).copy(this.ray.ray.origin);
    (u.uRayD!.value as Vector3).copy(this.tmp.copy(this.ray.ray.direction).normalize());
    u.uPointer!.value = this.pointerLevel;

    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.stop();
    this.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
    this.canvas.width = this.canvas.height = 0;
  }
}
