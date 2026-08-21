'use client';

import { useEffect, useRef } from 'react';

const vertexShader = `
attribute vec3 aPosition;
uniform float uTime;
uniform vec2 uPointer;
varying float vDepth;
void main() {
  float c = cos(uTime * 0.22);
  float s = sin(uTime * 0.22);
  mat3 rotY = mat3(c,0.0,s, 0.0,1.0,0.0, -s,0.0,c);
  vec3 p = rotY * aPosition;
  p.x += uPointer.x * (0.22 + p.z * 0.05);
  p.y += uPointer.y * (0.18 + p.z * 0.04);
  float perspective = 1.0 / (1.35 - p.z * 0.22);
  gl_Position = vec4(p.xy * perspective, 0.0, 1.0);
  gl_PointSize = (9.0 + (p.z + 1.0) * 5.0) * perspective;
  vDepth = p.z;
}`;

const fragmentShader = `
precision mediump float;
varying float vDepth;
void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float d = length(uv);
  if (d > 0.5) discard;
  float glow = smoothstep(0.5, 0.05, d);
  vec3 teal = vec3(0.08, 0.85, 0.72);
  vec3 cyan = vec3(0.05, 0.55, 0.95);
  vec3 color = mix(cyan, teal, clamp((vDepth + 1.0) * 0.5, 0.0, 1.0));
  gl_FragColor = vec4(color, 0.42 + glow * 0.58);
}`;

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

export function Ecosystem3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, vertexShader);
    const fs = compile(gl, gl.FRAGMENT_SHADER, fragmentShader);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const points = new Float32Array([
      0,0,0.15, -.62,.18,-.25, .58,.28,.15, -.35,-.48,.35,
      .34,-.42,-.2, .05,.62,.45, -.08,-.68,-.45, .72,-.12,-.35,
      -.74,-.16,.25, .28,.08,.72, -.26,.34,-.65, .44,.56,-.48,
      -.48,.54,.05, .63,-.5,.48, -.58,-.52,-.22, .08,-.12,-.78
    ]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
    const timeLoc = gl.getUniformLocation(program, 'uTime');
    const pointerLoc = gl.getUniformLocation(program, 'uPointer');

    const pointer = { x: 0, y: 0 };
    const onPointer = (event: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - r.left) / Math.max(r.width, 1) - .5) * .8;
      pointer.y = -((event.clientY - r.top) / Math.max(r.height, 1) - .5) * .8;
    };
    canvas.addEventListener('pointermove', onPointer);

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
      const height = Math.max(1, Math.floor(canvas.clientHeight * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    let frame = 0;
    const start = performance.now();
    const render = (now: number) => {
      resize();
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.uniform1f(timeLoc, reduced ? 0 : (now - start) / 1000);
      gl.uniform2f(pointerLoc, reduced ? 0 : pointer.x, reduced ? 0 : pointer.y);
      gl.drawArrays(gl.POINTS, 0, points.length / 3);
      if (!reduced) frame = requestAnimationFrame(render);
    };
    render(performance.now());

    return () => {
      cancelAnimationFrame(frame);
      canvas.removeEventListener('pointermove', onPointer);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div className="ecosystem-3d" aria-label="3D-модель экосистемы IMDS">
      <canvas ref={canvasRef} className="ecosystem-webgl" data-testid="ecosystem-webgl" aria-hidden="true" />
      <div className="ecosystem-core" aria-hidden="true"><span>IMDS</span></div>
      <div className="ecosystem-ring ring-a" aria-hidden="true" />
      <div className="ecosystem-ring ring-b" aria-hidden="true" />
      <div className="ecosystem-ring ring-c" aria-hidden="true" />
      <div className="ecosystem-caption"><span>connected products</span><strong>07</strong></div>
    </div>
  );
}
