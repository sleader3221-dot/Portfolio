// Evidence field — five baked forms blended on the GPU with per-particle stagger.
attribute vec3 aP1;
attribute vec3 aP2;
attribute vec3 aP3;
attribute vec3 aP4;
attribute vec4 aRand; // x delay · y size · z tint · w phase

uniform float uTime;
uniform float uMorph;
uniform float uIntro;
uniform float uMotion;
uniform float uSize;
uniform float uPixelRatio;
uniform vec3 uRayO;
uniform vec3 uRayD;
uniform float uPointer;

varying float vAlpha;
varying float vTint;
varying float vGlow;

// Simplex 3D noise — Ian McEwan, Ashima Arts / Stefan Gustavson (MIT).
vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0 / 7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

vec3 rotX(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z); }
vec3 rotY(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z); }
vec3 rotZ(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c * p.x - s * p.y, s * p.x + c * p.y, p.z); }

// Staggered 0→1 as uMorph passes k → k+1; each particle departs at its own moment.
float stage(float k, float delay) {
  float t = clamp(uMorph - k, 0.0, 1.0);
  float s = delay * 0.45;
  return smoothstep(s, s + 0.55, t);
}

void main() {
  float t = uTime * uMotion;

  vec3 p0 = position;
  p0.z += sin(t * 0.7 + position.y * 2.4) * 0.025;
  vec3 p1 = rotY(aP1, t * 0.14);
  vec3 p2 = rotX(aP2, t * 0.32 + aP2.x * 0.05);
  vec3 p3 = aP3;
  p3.y += snoise(vec3(aP3.xz * 0.3, t * 0.07)) * 0.22;
  vec3 p4 = rotZ(aP4, t * 0.05);

  vec3 p = p0;
  p = mix(p, p1, stage(0.0, aRand.x));
  p = mix(p, p2, stage(1.0, aRand.x));
  p = mix(p, p3, stage(2.0, aRand.x));
  p = mix(p, p4, stage(3.0, aRand.x));

  // Turbulence swells mid-transition and settles when a form is at rest.
  float f = uMorph - floor(uMorph);
  float turb = sin(3.14159265 * f) * uMotion;
  vec3 q = p * 0.65 + t * 0.12;
  vec3 drift = vec3(snoise(q), snoise(q + 17.3), snoise(q + 41.7));
  p += drift * (0.018 + turb * 0.6);

  // Intro: particles arrive from a wide, scattered cloud.
  vec3 dir = normalize(vec3(aRand.w - 0.5, aRand.z - 0.5, aRand.x - 0.5) + 1e-4);
  float arrive = smoothstep(aRand.x * 0.55, aRand.x * 0.55 + 0.45, uIntro);
  p = mix(p + dir * (7.0 + aRand.y * 5.0), p, arrive);

  // Pointer "UV torch": distance to the camera ray, pushes particles aside and lights them violet.
  vec3 op = p - uRayO;
  vec3 away = op - uRayD * dot(op, uRayD);
  float dist = length(away);
  float infl = smoothstep(0.75, 0.0, dist) * uPointer;
  p += normalize(away + 1e-5) * infl * 0.26;
  vGlow = smoothstep(1.25, 0.0, dist) * uPointer;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float depth = -mv.z;
  gl_PointSize = uSize * aRand.y * (1.0 + turb * 0.5 + vGlow * 0.6) * uPixelRatio / depth;

  vAlpha = smoothstep(0.15, 1.6, depth) * smoothstep(26.0, 9.0, depth) * mix(0.35, 1.0, arrive);
  vTint = aRand.z;
}
