'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

const vertexShader = `
attribute vec3 aPosition;
attribute float aSize;
uniform float uTime;
uniform vec2 uPointer;
varying float vDepth;
varying float vPulse;
void main(){
  float c=cos(uTime*.08); float s=sin(uTime*.08);
  mat3 ry=mat3(c,0.0,s,0.0,1.0,0.0,-s,0.0,c);
  vec3 p=ry*aPosition;
  p.x += uPointer.x*(.11+p.z*.04);
  p.y += uPointer.y*(.09+p.z*.03);
  float perspective=1.0/(1.5-p.z*.22);
  gl_Position=vec4(p.xy*perspective,0.0,1.0);
  gl_PointSize=aSize*perspective;
  vDepth=p.z;
  vPulse=.72+.28*sin(uTime*1.5+aPosition.x*8.0+aPosition.y*6.0);
}`;

const fragmentShader = `
precision mediump float;
varying float vDepth;
varying float vPulse;
void main(){
  vec2 uv=gl_PointCoord-vec2(.5); float d=length(uv); if(d>.5) discard;
  float glow=smoothstep(.5,.03,d);
  vec3 teal=vec3(.05,.92,.78); vec3 cyan=vec3(.12,.56,1.0);
  float depth=clamp((vDepth+1.0)*.5,0.0,1.0);
  vec3 color=mix(cyan,teal,depth);
  gl_FragColor=vec4(color,(.12+glow*.82)*vPulse);
}`;

function compile(gl:WebGLRenderingContext,type:number,source:string){
  const shader=gl.createShader(type); if(!shader)return null;
  gl.shaderSource(shader,source); gl.compileShader(shader);
  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);return null;}
  return shader;
}

function particles(count:number){
  const values:number[]=[];
  for(let i=0;i<count;i++){
    const a=i*2.399963; const radius=.16+((i*37)%100)/130; const band=.55+((i*17)%35)/100;
    values.push(Math.cos(a)*radius,Math.sin(a)*radius*band,-.8+((i*53)%100)/62,3.5+((i*29)%9));
  }
  return new Float32Array(values);
}

export function BusinessHeroScene(){
  const canvasRef=useRef<HTMLCanvasElement>(null);

  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas)return;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small=window.matchMedia('(max-width: 700px)').matches;
    const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});
    if(!gl){canvas.dataset.webgl='fallback';return;}
    const vs=compile(gl,gl.VERTEX_SHADER,vertexShader); const fs=compile(gl,gl.FRAGMENT_SHADER,fragmentShader);
    if(!vs||!fs){canvas.dataset.webgl='fallback';return;}
    const program=gl.createProgram(); if(!program){canvas.dataset.webgl='fallback';return;}
    gl.attachShader(program,vs); gl.attachShader(program,fs); gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)){canvas.dataset.webgl='fallback';return;}
    gl.useProgram(program);

    const data=particles(small?64:132); const buffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer); gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
    const stride=4*Float32Array.BYTES_PER_ELEMENT;
    const pos=gl.getAttribLocation(program,'aPosition'); const size=gl.getAttribLocation(program,'aSize');
    gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos,3,gl.FLOAT,false,stride,0);
    gl.enableVertexAttribArray(size); gl.vertexAttribPointer(size,1,gl.FLOAT,false,stride,3*Float32Array.BYTES_PER_ELEMENT);
    const timeLoc=gl.getUniformLocation(program,'uTime'); const pointerLoc=gl.getUniformLocation(program,'uPointer');
    const pointer={x:0,y:0}, target={x:0,y:0};
    const onPointer=(event:PointerEvent)=>{target.x=(event.clientX/window.innerWidth-.5)*.65;target.y=-(event.clientY/window.innerHeight-.5)*.5;};
    window.addEventListener('pointermove',onPointer,{passive:true});
    const resize=()=>{const ratio=Math.min(window.devicePixelRatio||1,small?1.25:1.8);const w=Math.max(1,Math.floor(canvas.clientWidth*ratio));const h=Math.max(1,Math.floor(canvas.clientHeight*ratio));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}gl.viewport(0,0,w,h);};
    let frame=0; const start=performance.now();
    const render=(now:number)=>{resize();pointer.x+=((reduced?0:target.x)-pointer.x)*.06;pointer.y+=((reduced?0:target.y)-pointer.y)*.06;gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.uniform1f(timeLoc,reduced?0:(now-start)/1000);gl.uniform2f(pointerLoc,pointer.x,pointer.y);gl.drawArrays(gl.POINTS,0,data.length/4);if(!reduced)frame=requestAnimationFrame(render);};
    canvas.dataset.webgl='ready'; render(performance.now());
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('pointermove',onPointer);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);};
  },[]);

  return <div className="business-webgl-scene" aria-hidden="true">
    <canvas ref={canvasRef} className="business-webgl-canvas" data-testid="business-webgl" data-webgl="loading" />
    <div className="business-webgl-grid" />
    <div className="business-webgl-orbit orbit-1"/><div className="business-webgl-orbit orbit-2"/><div className="business-webgl-orbit orbit-3"/>
    <div className="business-webgl-logo"><Image src="/imds-brand-mark.svg" alt="" width={430} height={430} priority /></div>
    <div className="business-webgl-base"><i/><i/><i/></div>
  </div>;
}
