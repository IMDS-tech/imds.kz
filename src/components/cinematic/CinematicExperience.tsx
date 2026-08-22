'use client';

import { useEffect, useRef } from 'react';

const CHAPTERS=['origin','dive','products','spotlight','platform','final'] as const;
const PRODUCT_NODES=['beles','mis','resto','omnichannel','analytics','ai','finance'] as const;

const vertexShader = `
attribute vec3 aPosition;
attribute float aSize;
uniform float uTime;
uniform float uScroll;
uniform vec2 uPointer;
varying float vDepth;
varying float vPulse;

void main(){
  float phase=uScroll*6.28318;
  float cy=cos(phase*.16+uTime*.06);
  float sy=sin(phase*.16+uTime*.06);
  float cx=cos(phase*.09);
  float sx=sin(phase*.09);
  mat3 ry=mat3(cy,0.0,sy,0.0,1.0,0.0,-sy,0.0,cy);
  mat3 rx=mat3(1.0,0.0,0.0,0.0,cx,-sx,0.0,sx,cx);
  vec3 p=ry*rx*aPosition;
  float dive=sin(uScroll*3.14159);
  p.z+=dive*.34;
  p.x+=uPointer.x*(.12+p.z*.05);
  p.y+=uPointer.y*(.1+p.z*.04);
  float perspective=1.0/(1.35-p.z*.22);
  vec2 projected=p.xy*perspective;
  projected*=mix(.84,1.18,dive);
  gl_Position=vec4(projected,0.0,1.0);
  gl_PointSize=aSize*perspective*(1.0+dive*.3);
  vDepth=p.z;
  vPulse=.72+.28*sin(uTime*1.7+aPosition.x*9.0+aPosition.y*7.0);
}`;

const fragmentShader = `
precision mediump float;
varying float vDepth;
varying float vPulse;
void main(){
  vec2 uv=gl_PointCoord-vec2(.5);
  float d=length(uv);
  if(d>.5) discard;
  float glow=smoothstep(.5,.02,d);
  vec3 teal=vec3(.06,.92,.75);
  vec3 cyan=vec3(.08,.52,1.0);
  vec3 white=vec3(.76,1.0,.96);
  float depth=clamp((vDepth+1.0)*.5,0.0,1.0);
  vec3 color=mix(cyan,teal,depth);
  color=mix(color,white,glow*.32);
  gl_FragColor=vec4(color,(.18+glow*.78)*vPulse);
}`;

function compile(gl:WebGLRenderingContext,type:number,source:string){
  const shader=gl.createShader(type);
  if(!shader)return null;
  gl.shaderSource(shader,source);
  gl.compileShader(shader);
  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);return null;}
  return shader;
}

function createParticles(count:number){
  const values:number[]=[];
  for(let i=0;i<count;i++){
    const a=i*2.399963;
    const band=.18+(i%11)/13;
    const radius=.14+((i*37)%100)/125;
    const x=Math.cos(a)*radius;
    const y=Math.sin(a)*radius*(.62+band*.22);
    const z=-.82+((i*53)%100)/58;
    const size=3.5+((i*29)%10);
    values.push(x,y,z,size);
  }
  return new Float32Array(values);
}

export function CinematicExperience(){
  const rootRef=useRef<HTMLDivElement>(null);
  const canvasRef=useRef<HTMLCanvasElement>(null);

  useEffect(()=>{
    const root=rootRef.current;
    const canvas=canvasRef.current;
    if(!root||!canvas)return;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small=window.matchMedia('(max-width: 700px)').matches;
    const chapters=Array.from(document.querySelectorAll<HTMLElement>('[data-cinematic-chapter]'));
    const cards=Array.from(document.querySelectorAll<HTMLElement>('[data-3d-card="true"]'));

    let activeChapter='origin';
    const setActiveChapter=(chapter:string)=>{
      if(activeChapter===chapter&&root.dataset.activeChapter===chapter)return;
      activeChapter=chapter;
      root.dataset.activeChapter=chapter;
      chapters.forEach(section=>{section.dataset.active=section.dataset.cinematicChapter===chapter?'true':'false';});
      root.querySelectorAll<HTMLElement>('[data-progress-item]').forEach(item=>{item.dataset.active=item.dataset.progressItem===chapter?'true':'false';});
    };
    const readActiveChapter=()=>{
      const center=window.innerHeight*.5;
      let winner=chapters[0];
      let distance=Number.POSITIVE_INFINITY;
      chapters.forEach(section=>{
        const rect=section.getBoundingClientRect();
        const visible=rect.bottom>0&&rect.top<window.innerHeight;
        if(!visible)return;
        const sectionCenter=Math.max(rect.top,0)+Math.min(rect.height,window.innerHeight)/2;
        const candidate=Math.abs(sectionCenter-center);
        if(candidate<distance){distance=candidate;winner=section;}
      });
      if(winner?.dataset.cinematicChapter)setActiveChapter(winner.dataset.cinematicChapter);
    };
    setActiveChapter('origin');

    const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});
    if(!gl){root.dataset.webgl='fallback';return;}

    const vs=compile(gl,gl.VERTEX_SHADER,vertexShader);
    const fs=compile(gl,gl.FRAGMENT_SHADER,fragmentShader);
    if(!vs||!fs){root.dataset.webgl='fallback';return;}
    const program=gl.createProgram();
    if(!program)return;
    gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)){root.dataset.webgl='fallback';return;}
    gl.useProgram(program);

    const particles=createParticles(small?72:150);
    const buffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,particles,gl.STATIC_DRAW);
    const stride=4*Float32Array.BYTES_PER_ELEMENT;
    const pos=gl.getAttribLocation(program,'aPosition');
    const size=gl.getAttribLocation(program,'aSize');
    gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,3,gl.FLOAT,false,stride,0);
    gl.enableVertexAttribArray(size);gl.vertexAttribPointer(size,1,gl.FLOAT,false,stride,3*Float32Array.BYTES_PER_ELEMENT);
    const timeLoc=gl.getUniformLocation(program,'uTime');
    const scrollLoc=gl.getUniformLocation(program,'uScroll');
    const pointerLoc=gl.getUniformLocation(program,'uPointer');

    let scroll=0;
    let targetScroll=0;
    const pointer={x:0,y:0};
    const targetPointer={x:0,y:0};
    const readScroll=()=>{
      const max=Math.max(document.documentElement.scrollHeight-window.innerHeight,1);
      targetScroll=Math.min(1,Math.max(0,window.scrollY/max));
      root.style.setProperty('--cinematic-progress',String(targetScroll));
      readActiveChapter();
    };
    const onPointer=(event:PointerEvent)=>{
      targetPointer.x=(event.clientX/window.innerWidth-.5)*.75;
      targetPointer.y=-(event.clientY/window.innerHeight-.5)*.55;
      const x=`${(event.clientX/window.innerWidth)*100}%`;
      const y=`${(event.clientY/window.innerHeight)*100}%`;
      root.style.setProperty('--cursor-x',x);
      root.style.setProperty('--cursor-y',y);
      document.documentElement.style.setProperty('--cinematic-cursor-x',x);
      document.documentElement.style.setProperty('--cinematic-cursor-y',y);
    };
    window.addEventListener('scroll',readScroll,{passive:true});
    window.addEventListener('resize',readActiveChapter,{passive:true});
    window.addEventListener('pointermove',onPointer,{passive:true});
    readScroll();

    const cardCleanups=cards.map(card=>{
      const onCardPointer=(event:PointerEvent)=>{
        if(reduced||small)return;
        const rect=card.getBoundingClientRect();
        const x=(event.clientX-rect.left)/Math.max(rect.width,1);
        const y=(event.clientY-rect.top)/Math.max(rect.height,1);
        card.style.setProperty('--tilt-y',`${(x-.5)*10}deg`);
        card.style.setProperty('--tilt-x',`${(.5-y)*9}deg`);
        card.style.setProperty('--card-light-x',`${x*100}%`);
        card.style.setProperty('--card-light-y',`${y*100}%`);
      };
      const resetCard=()=>{
        card.style.setProperty('--tilt-y','0deg');
        card.style.setProperty('--tilt-x','0deg');
      };
      card.addEventListener('pointermove',onCardPointer);
      card.addEventListener('pointerleave',resetCard);
      return()=>{card.removeEventListener('pointermove',onCardPointer);card.removeEventListener('pointerleave',resetCard);};
    });

    const resize=()=>{
      const ratio=Math.min(window.devicePixelRatio||1,small?1.35:2);
      const width=Math.max(1,Math.floor(canvas.clientWidth*ratio));
      const height=Math.max(1,Math.floor(canvas.clientHeight*ratio));
      if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
      gl.viewport(0,0,width,height);
    };

    let frame=0;
    const start=performance.now();
    const render=(now:number)=>{
      resize();
      scroll+=((reduced?0:targetScroll)-scroll)*.055;
      pointer.x+=((reduced?0:targetPointer.x)-pointer.x)*.06;
      pointer.y+=((reduced?0:targetPointer.y)-pointer.y)*.06;
      gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);
      gl.uniform1f(timeLoc,reduced?0:(now-start)/1000);
      gl.uniform1f(scrollLoc,scroll);
      gl.uniform2f(pointerLoc,pointer.x,pointer.y);
      gl.drawArrays(gl.POINTS,0,particles.length/4);
      if(!reduced)frame=requestAnimationFrame(render);
    };
    render(performance.now());
    root.dataset.webgl='ready';

    return()=>{
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll',readScroll);
      window.removeEventListener('resize',readActiveChapter);
      window.removeEventListener('pointermove',onPointer);
      cardCleanups.forEach(cleanup=>cleanup());
      gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
    };
  },[]);

  return <div ref={rootRef} className="cinematic-scene" data-testid="cinematic-scene" data-active-chapter="origin" aria-hidden="true">
    <canvas ref={canvasRef} className="cinematic-canvas" />
    <div className="cursor-spotlight" data-testid="cursor-spotlight" />
    <div className="cinematic-vignette" />
    <div className="cinematic-core"><span>IMDS</span><i /></div>
    <div className="cinematic-orbit orbit-one" />
    <div className="cinematic-orbit orbit-two" />
    <div className="cinematic-orbit orbit-three" />
    {PRODUCT_NODES.map((product,index)=><div key={product} className={`cinematic-node node-${index+1}`} data-product-node={product} />)}
    <div className="cinematic-progress" data-testid="cinematic-progress">
      {CHAPTERS.map((chapter,index)=><span key={chapter} data-progress-item={chapter} data-active={chapter==='origin'?'true':'false'}><b>{String(index+1).padStart(2,'0')}</b><i /></span>)}
    </div>
  </div>;
}
