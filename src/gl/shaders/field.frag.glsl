uniform vec3 uBone;
uniform vec3 uEmber;
uniform vec3 uUv;
uniform float uOpacity;

varying float vAlpha;
varying float vTint;
varying float vGlow;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float a = pow(smoothstep(0.5, 0.0, d), 1.7);

  vec3 col = mix(uBone, uEmber, step(0.92, vTint));
  col = mix(col, uUv, vGlow * 0.9);
  gl_FragColor = vec4(col * (1.0 + vGlow * 0.8), a * vAlpha * uOpacity * (0.4 + vGlow * 0.55));
}
