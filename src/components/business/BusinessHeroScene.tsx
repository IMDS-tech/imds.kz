'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

const vertexShader = `
attribute vec3 a_pos;
attribute float a_seed;
uniform float u_time;
uniform float u_aspect;
uniform float u_dpr;
uniform float u_scale;
uniform float u_spin;
uniform float u_size;
uniform vec2 u_ptr;
varying float v_a;
varying float v_seed;
mat3 rotY(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}
mat3 rotX(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);}
void main(){
  vec3 p=a_pos*u_scale;
  p.y+=sin(u_time*0.5+a_seed*9.4)*0.045;
  p*=1.0+0.02*sin(u_time*0.35+a_seed*4.0);
  p=rotY(u_time*u_spin+u_ptr.x*0.55)*p;
  p=rotX(-0.12+u_ptr.y*0.28)*p;
  float z=p.z+3.35;
  float persp=2.0/max(z,0.35);
  gl_Position=vec4(p.x*persp/u_aspect,p.y*persp,0.,1.);
  gl_PointSize=clamp((0.45+a_seed*1.15)*persp*u_size*u_dpr,1.0,26.0*u_dpr);
  v_a=clamp((persp-0.35)*1.25,0.0,1.0)*(0.30+0.70*a_seed);
  v_seed=a_seed;
}`;

const pointFragmentShader = `
precision mediump float;
varying float v_a;
varying float v_seed;
uniform vec3 u_c1;
uniform vec3 u_c2;
void main(){
  vec2 d=gl_PointCoord-0.5;
  float r=length(d);
  float core=smoothstep(0.5,0.0,r);
  float glow=pow(1.0-min(r*2.0,1.0),3.0);
  vec3 c=mix(u_c1,u_c2,smoothstep(0.35,1.0,v_seed));
  float a=(core*0.55+glow*0.65)*v_a;
  gl_FragColor=vec4(c*(0.6+core*0.9),a);
}`;

const lineFragmentShader = `
precision mediump float;
varying float v_a;
varying float v_seed;
uniform vec3 u_c1;
uniform vec3 u_c2;
void main(){
  vec3 c=mix(u_c1,u_c2,v_seed);
  gl_FragColor=vec4(c,v_a*0.95);
}`;

type Geometry = { pos: number[]; seed: number[]; count: number };
type MergedGeometry = Geometry & { spans: Array<[number, number]> };
type SceneLayer = 'back' | 'front';

function field(count: number, rIn: number, rOut: number): Geometry {
  const pos: number[] = [];
  const seed: number[] = [];
  for (let index = 0; index < count; index += 1) {
    const u = Math.random() * 2 - 1;
    const theta = Math.random() * Math.PI * 2;
    const radius = rIn + Math.pow(Math.random(), 0.65) * (rOut - rIn);
    const sphere = Math.sqrt(1 - u * u);
    pos.push(Math.cos(theta) * sphere * radius, u * radius * 0.72, Math.sin(theta) * sphere * radius);
    seed.push(Math.random());
  }
  return { pos, seed, count };
}

function ring(radius: number, tiltX: number, y: number, segments: number, yOffset = 0): Geometry {
  const pos: number[] = [];
  const seed: number[] = [];
  for (let index = 0; index < segments; index += 1) {
    const angle = (index / segments) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const yy = Math.sin(tiltX) * z + yOffset;
    const zz = Math.cos(tiltX) * z;
    pos.push(x, yy + y, zz);
    seed.push(0.35 + 0.65 * (0.5 + 0.5 * Math.sin(angle * 3)));
  }
  return { pos, seed, count: segments };
}

function merge(parts: Geometry[]): MergedGeometry {
  const pos: number[] = [];
  const seed: number[] = [];
  const spans: Array<[number, number]> = [];
  let at = 0;
  parts.forEach((part) => {
    pos.push(...part.pos);
    seed.push(...part.seed);
    spans.push([at, part.count]);
    at += part.count;
  });
  return { pos, seed, spans, count: at };
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, fragmentSource: string) {
  const vertex = compile(gl, gl.VERTEX_SHADER, vertexShader);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    return null;
  }
  return { program, vertex, fragment };
}

function createBuffer(gl: WebGLRenderingContext, values: number[]) {
  const buffer = gl.createBuffer();
  if (!buffer) return null;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);
  return buffer;
}

function mountLayer(
  canvas: HTMLCanvasElement,
  layer: SceneLayer,
  host: HTMLElement,
  onPointer?: (x: number, y: number) => void,
) {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: true,
    premultipliedAlpha: false,
    powerPreference: 'low-power',
  });
  if (!gl) {
    canvas.dataset.webgl = 'unavailable';
    return () => undefined;
  }

  const pointBundle = createProgram(gl, pointFragmentShader);
  const lineBundle = createProgram(gl, lineFragmentShader);
  if (!pointBundle || !lineBundle) {
    canvas.dataset.webgl = 'fallback';
    return () => undefined;
  }

  const mobile = window.matchMedia('(max-width: 760px)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dotCount = mobile ? (layer === 'front' ? 26 : 90) : layer === 'front' ? 70 : 260;
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 2);
  const dots = layer === 'front' ? field(dotCount, 1.9, 2.6) : field(dotCount, 1.15, 2.35);
  const pointPosition = createBuffer(gl, dots.pos);
  const pointSeed = createBuffer(gl, dots.seed);
  if (!pointPosition || !pointSeed) {
    canvas.dataset.webgl = 'fallback';
    return () => undefined;
  }

  let lines: MergedGeometry | null = null;
  let linePosition: WebGLBuffer | null = null;
  let lineSeed: WebGLBuffer | null = null;
  let orbitDots: Geometry | null = null;
  let orbitPosition: WebGLBuffer | null = null;
  let orbitSeed: WebGLBuffer | null = null;

  if (layer === 'back') {
    lines = merge([
      ring(1.62, 0.24, 0.02, 260),
      ring(1.86, -0.38, 0.06, 280),
      ring(1.38, 0.58, -0.04, 240),
      ring(0.58, 1.508, -0.88, 170),
      ring(0.8, 1.514, -0.93, 180),
      ring(1.02, 1.52, -0.98, 190),
      ring(1.26, 1.526, -1.04, 200),
    ]);
    orbitDots = merge([ring(1.62, 0.24, 0.02, 9), ring(1.86, -0.38, 0.06, 7), ring(1.38, 0.58, -0.04, 8)]);
    linePosition = createBuffer(gl, lines.pos);
    lineSeed = createBuffer(gl, lines.seed);
    orbitPosition = createBuffer(gl, orbitDots.pos);
    orbitSeed = createBuffer(gl, orbitDots.seed);
  }

  const colors = { first: [0.07, 0.72, 0.62], second: [0.42, 0.93, 0.9] };
  const pointer = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  const startedAt = performance.now();
  let raf = 0;
  let alive = true;

  function size() {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    return Math.max(0.35, rect.width / Math.max(rect.height, 1));
  }

  function bind(program: WebGLProgram, position: WebGLBuffer, seed: WebGLBuffer) {
    gl.useProgram(program);
    const posLocation = gl.getAttribLocation(program, 'a_pos');
    const seedLocation = gl.getAttribLocation(program, 'a_seed');
    gl.bindBuffer(gl.ARRAY_BUFFER, position);
    gl.enableVertexAttribArray(posLocation);
    gl.vertexAttribPointer(posLocation, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, seed);
    gl.enableVertexAttribArray(seedLocation);
    gl.vertexAttribPointer(seedLocation, 1, gl.FLOAT, false, 0, 0);
  }

  function uniforms(program: WebGLProgram, time: number, aspect: number, spin: number, pointSize: number) {
    gl.uniform1f(gl.getUniformLocation(program, 'u_time'), time);
    gl.uniform1f(gl.getUniformLocation(program, 'u_aspect'), aspect);
    gl.uniform1f(gl.getUniformLocation(program, 'u_dpr'), dpr);
    gl.uniform1f(gl.getUniformLocation(program, 'u_scale'), 1);
    gl.uniform1f(gl.getUniformLocation(program, 'u_spin'), spin);
    gl.uniform1f(gl.getUniformLocation(program, 'u_size'), pointSize);
    gl.uniform2f(gl.getUniformLocation(program, 'u_ptr'), pointer.x, pointer.y);
    gl.uniform3f(gl.getUniformLocation(program, 'u_c1'), colors.first[0], colors.first[1], colors.first[2]);
    gl.uniform3f(gl.getUniformLocation(program, 'u_c2'), colors.second[0], colors.second[1], colors.second[2]);
  }

  function draw() {
    const aspect = size();
    const time = reduced ? 6.2 : (performance.now() - startedAt) / 1000;
    pointer.x += (target.x - pointer.x) * 0.055;
    pointer.y += (target.y - pointer.y) * 0.055;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE);

    if (lines && linePosition && lineSeed) {
      bind(lineBundle.program, linePosition, lineSeed);
      uniforms(lineBundle.program, time, aspect, 0.045, 1);
      lines.spans.forEach(([start, count]) => gl.drawArrays(gl.LINE_LOOP, start, count));
    }

    bind(pointBundle.program, pointPosition, pointSeed);
    uniforms(pointBundle.program, time, aspect, layer === 'front' ? 0.03 : 0.048, layer === 'front' ? 20 : 26);
    gl.drawArrays(gl.POINTS, 0, dots.count);

    if (orbitDots && orbitPosition && orbitSeed) {
      bind(pointBundle.program, orbitPosition, orbitSeed);
      uniforms(pointBundle.program, time, aspect, 0.045, 46);
      gl.drawArrays(gl.POINTS, 0, orbitDots.count);
    }
  }

  function loop() {
    if (!alive) return;
    draw();
    raf = requestAnimationFrame(loop);
  }

  function onMove(event: PointerEvent) {
    const rect = host.getBoundingClientRect();
    target.x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
    target.y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
    onPointer?.(target.x, target.y);
  }

  function onLeave() {
    target.x = 0;
    target.y = 0;
    onPointer?.(0, 0);
  }

  function onVisibility() {
    if (document.hidden) cancelAnimationFrame(raf);
    else if (!reduced && alive) raf = requestAnimationFrame(loop);
  }

  canvas.dataset.webgl = 'ready';
  if (reduced) {
    draw();
    window.addEventListener('resize', draw);
  } else {
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    loop();
  }
  document.addEventListener('visibilitychange', onVisibility);

  return () => {
    alive = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('resize', draw);
    document.removeEventListener('visibilitychange', onVisibility);
    [pointPosition, pointSeed, linePosition, lineSeed, orbitPosition, orbitSeed].forEach((buffer) => buffer && gl.deleteBuffer(buffer));
    gl.deleteProgram(pointBundle.program);
    gl.deleteShader(pointBundle.vertex);
    gl.deleteShader(pointBundle.fragment);
    gl.deleteProgram(lineBundle.program);
    gl.deleteShader(lineBundle.vertex);
    gl.deleteShader(lineBundle.fragment);
  };
}

export function BusinessHeroScene() {
  const hostRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const back = backRef.current;
    const front = frontRef.current;
    const mark = markRef.current;
    if (!host || !back || !front || !mark) return;

    const tilt = (x: number, y: number) => {
      mark.style.transform = `perspective(900px) rotateY(${(x * 9).toFixed(2)}deg) rotateX(${(-y * 7).toFixed(2)}deg) translate3d(${(x * 10).toFixed(1)}px,${(y * 8 - 4).toFixed(1)}px,0)`;
    };

    const destroyBack = mountLayer(back, 'back', host, tilt);
    const destroyFront = mountLayer(front, 'front', host);
    return () => {
      destroyBack();
      destroyFront();
    };
  }, []);

  return (
    <div className="industry-scene" ref={hostRef} aria-hidden="true">
      <canvas ref={backRef} className="back" data-testid="business-webgl" data-webgl="loading" />
      <span className="industry-scene-halo" />
      <div className="industry-scene-mark" ref={markRef}>
        <Image src="/imds-brand-mark.svg" alt="" width={430} height={430} priority />
      </div>
      <canvas ref={frontRef} className="front" data-testid="business-webgl" data-webgl="loading" />
    </div>
  );
}
