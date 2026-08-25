/**
 * GLSL used by the procedural intelligence core.
 * Ashima/Stefan Gustavson simplex noise (MIT) — inlined so the 3D layer has no
 * runtime dependency beyond three itself.
 */
export const simplex3d = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
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

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

/** Two-octave ridge used for the core's surface turbulence. */
float turbulence(vec3 p){
  return snoise(p) * 0.65 + snoise(p * 2.13 + 11.7) * 0.35;
}
`;

/**
 * Core surface.
 *
 * Vertices ride a moving noise field, and `uChaos` interpolates between an
 * unresolved, boiling mass and a calm sphere — the chaos → intelligence
 * metaphor the whole site is built on.
 *
 * The normal is *recomputed* from the displaced surface rather than passed
 * through from the base geometry. Reusing the sphere's original normal makes
 * the fresnel term read as ~1 everywhere and the object flattens into a
 * silhouette; sampling the displacement at two tangent offsets and taking the
 * cross product costs two extra noise lookups and gives a surface that
 * actually catches light.
 */
export const coreVertexShader = /* glsl */ `
uniform float uTime;
uniform float uChaos;
uniform float uAmplitude;
uniform float uFrequency;
uniform vec2  uPointer;
uniform float uPointerStrength;

varying vec3  vNormal;
varying vec3  vViewDir;
varying float vDisplace;

${simplex3d}

float displacementAt(vec3 p, float t, vec3 pointerDir) {
  float n = turbulence(p * uFrequency + vec3(0.0, t, t * 0.6));
  float facing = max(dot(normalize(p), pointerDir), 0.0);
  float dent = pow(facing, 4.0) * uPointerStrength;
  return n * uAmplitude * mix(0.4, 1.0, uChaos) + dent * 0.16;
}

// Any vector not parallel to n, so cross() below is always well defined.
vec3 orthogonal(vec3 n) {
  return normalize(
    abs(n.x) > abs(n.z) ? vec3(-n.y, n.x, 0.0) : vec3(0.0, -n.z, n.y)
  );
}

void main() {
  float t = uTime * 0.24;
  vec3 pointerDir = normalize(vec3(uPointer, 0.85));

  float displace = displacementAt(position, t, pointerDir);
  vec3 displaced = position + normal * displace;

  // Rebuild the normal from two neighbours on the displaced surface.
  vec3 tangent = orthogonal(normal);
  vec3 bitangent = normalize(cross(normal, tangent));
  float eps = 0.035;

  vec3 a = position + tangent * eps;
  vec3 b = position + bitangent * eps;
  vec3 da = a + normalize(a) * displacementAt(a, t, pointerDir);
  vec3 db = b + normalize(b) * displacementAt(b, t, pointerDir);

  vec3 rebuilt = normalize(cross(da - displaced, db - displaced));
  // Keep the rebuilt normal on the outward-facing side.
  rebuilt *= dot(rebuilt, normal) < 0.0 ? -1.0 : 1.0;

  vDisplace = displace;
  vNormal = normalize(normalMatrix * rebuilt);

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  vViewDir = normalize(-mvPosition.xyz);
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const coreFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uChaos;
uniform vec3  uBase;
uniform vec3  uDeep;
uniform vec3  uSignal;
uniform vec3  uHighlight;

varying vec3  vNormal;
varying vec3  vViewDir;
varying float vDisplace;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 view = normalize(vViewDir);

  // One key light, high and to the left, in view space.
  vec3 key = normalize(vec3(-0.45, 0.75, 0.65));
  float diffuse = max(dot(normal, key), 0.0);

  // Tight specular so the surface reads as polished, not plastic.
  vec3 halfway = normalize(key + view);
  float specular = pow(max(dot(normal, halfway), 0.0), 120.0);

  // Rim only at the true silhouette.
  float fresnel = pow(1.0 - clamp(dot(normal, view), 0.0, 1.0), 6.5);

  // Restraint is the whole point: the body stays near-black and the accent
  // lives at the silhouette and in the specular glints, never across the form.
  vec3 color = uBase;
  color += uDeep * diffuse * 0.7;
  color += uSignal * pow(diffuse, 4.0) * 0.07;
  color += uSignal * fresnel * 1.35;
  color += uHighlight * specular * 0.85;

  // Displacement catches a little light on the ridges.
  color += uHighlight * smoothstep(0.06, 0.3, abs(vDisplace)) * 0.05 * uChaos;

  gl_FragColor = vec4(color, 1.0);
  #include <colorspace_fragment>
}
`;

/** Halo of drifting points orbiting the core. */
export const haloVertexShader = /* glsl */ `
uniform float uTime;
uniform float uSize;
uniform float uChaos;
uniform vec2  uPointer;

attribute float aSeed;
attribute float aScale;

varying float vAlpha;

${simplex3d}

void main() {
  vec3 pos = position;

  float t = uTime * 0.12 + aSeed * 6.2831;
  vec3 drift = vec3(
    snoise(pos * 0.6 + vec3(t, 0.0, 0.0)),
    snoise(pos * 0.6 + vec3(0.0, t, 0.0)),
    snoise(pos * 0.6 + vec3(0.0, 0.0, t))
  );

  pos += drift * mix(0.06, 0.42, uChaos);
  pos.xy += uPointer * 0.09;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  gl_PointSize = uSize * aScale * (9.0 / -mvPosition.z);
  vAlpha = smoothstep(0.0, 1.0, aScale) * mix(0.5, 0.22, uChaos);
}
`;

export const haloFragmentShader = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float falloff = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(uColor, falloff * vAlpha);
  #include <colorspace_fragment>
}
`;
