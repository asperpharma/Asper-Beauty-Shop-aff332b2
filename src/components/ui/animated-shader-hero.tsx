"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface HeroProps {
  trustBadge?: {
    text: string;
    icons?: string[];
  };
  headline: {
    line1: string;
    line2: string;
  };
  subtitle: string;
  buttons?: {
    primary?: {
      text: string;
      onClick?: () => void;
    };
    secondary?: {
      text: string;
      onClick?: () => void;
    };
  };
  className?: string;
}

// Luxury palette colors in normalized RGB (0-1 range)
// Burgundy: #4A0E19 -> vec3(0.29, 0.055, 0.098)
// Gold: #D4AF37 -> vec3(0.831, 0.686, 0.216)
// Cream: #F3E5DC -> vec3(0.953, 0.898, 0.863)
// Dark Brown: #2C1A1D -> vec3(0.173, 0.102, 0.114)

const defaultShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)

// Luxury palette colors
const vec3 burgundy = vec3(0.29, 0.055, 0.098);
const vec3 gold = vec3(0.831, 0.686, 0.216);
const vec3 cream = vec3(0.953, 0.898, 0.863);
const vec3 darkBrown = vec3(0.173, 0.102, 0.114);
const vec3 maroon = vec3(0.35, 0.08, 0.12);

float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}

float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float
  a=rnd(i),
  b=rnd(i+vec2(1,0)),
  c=rnd(i+vec2(0,1)),
  d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}

float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}

float clouds(vec2 p) {
  float d=1., t=.0;
  for (float i=.0; i<3.; i++) {
    float a=d*fbm(i*10.+p.x*.15+.15*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a);
    d=a;
    p*=2./(i+1.);
  }
  return t;
}

void main(void) {
  vec2 uv=(FC-.5*R)/MN, st=uv*vec2(2,1);
  
  // Base gradient from dark brown to burgundy
  float gradientY = (uv.y + 1.0) * 0.5;
  vec3 col = mix(darkBrown, burgundy, gradientY * 0.8);
  
  // Animated cloud-like texture
  float bg = clouds(vec2(st.x + T * 0.3, -st.y));
  
  // Subtle breathing effect
  uv *= 1.0 - 0.15 * (sin(T * 0.15) * 0.5 + 0.5);
  
  // Gold particle shimmer effect
  for (float i = 1.0; i < 8.0; i++) {
    uv += 0.08 * cos(i * vec2(0.1 + 0.01 * i, 0.6) + i * i + T * 0.4 + 0.1 * uv.x);
    vec2 p = uv;
    float d = length(p);
    
    // Gold shimmer particles
    float shimmer = 0.0008 / d;
    vec3 goldShimmer = gold * shimmer * (0.5 + 0.5 * sin(T + i));
    col += goldShimmer;
    
    // Subtle cream highlights
    float b = noise(i + p + bg * 1.5);
    col += cream * 0.003 * b / length(max(p, vec2(b * p.x * 0.02, p.y)));
    
    // Blend with maroon undertones
    col = mix(col, mix(maroon, burgundy, bg * 0.8), d * 0.4);
  }
  
  // Add subtle gold accent glow at edges
  float edgeGlow = smoothstep(0.8, 1.5, length(uv));
  col = mix(col, gold * 0.3, edgeGlow * 0.2 * (0.5 + 0.5 * sin(T * 0.5)));
  
  // Enhance contrast and richness
  col = pow(col, vec3(0.95));
  col = clamp(col, 0.0, 1.0);
  
  O = vec4(col, 1);
}`;

interface ProgramWithUniforms extends WebGLProgram {
  resolution: WebGLUniformLocation | null;
  time: WebGLUniformLocation | null;
  move: WebGLUniformLocation | null;
  touch: WebGLUniformLocation | null;
  pointerCount: WebGLUniformLocation | null;
  pointers: WebGLUniformLocation | null;
}

class WebGLRenderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  private program: ProgramWithUniforms | null = null;
  private vs: WebGLShader | null = null;
  private fs: WebGLShader | null = null;
  private buffer: WebGLBuffer | null = null;
  private scale: number;
  private shaderSource: string;
  private mouseMove = [0, 0];
  private mouseCoords = [0, 0];
  private pointerCoords = [0, 0];
  private nbrOfPointers = 0;

  private vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

  private vertices = [-1, 1, -1, -1, 1, 1, 1, -1];

  constructor(canvas: HTMLCanvasElement, scale: number) {
    this.canvas = canvas;
    this.scale = scale;
    this.gl = canvas.getContext("webgl2")!;
    this.gl.viewport(0, 0, canvas.width * scale, canvas.height * scale);
    this.shaderSource = defaultShaderSource;
  }

  updateShader(source: string) {
    this.reset();
    this.shaderSource = source;
    this.setup();
    this.init();
  }

  updateMove(deltas: number[]) {
    this.mouseMove = deltas;
  }

  updateMouse(coords: number[]) {
    this.mouseCoords = coords;
  }

  updatePointerCoords(coords: number[]) {
    this.pointerCoords = coords;
  }

  updatePointerCount(nbr: number) {
    this.nbrOfPointers = nbr;
  }

  updateScale(scale: number) {
    this.scale = scale;
    this.gl.viewport(
      0,
      0,
      this.canvas.width * scale,
      this.canvas.height * scale,
    );
  }

  compile(shader: WebGLShader, source: string) {
    const gl = this.gl;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader);
      console.error("Shader compilation error:", error);
    }
  }

  test(source: string) {
    let result = null;
    const gl = this.gl;
    const shader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      result = gl.getShaderInfoLog(shader);
    }
    gl.deleteShader(shader);
    return result;
  }

  reset() {
    const gl = this.gl;
    if (
      this.program && !gl.getProgramParameter(this.program, gl.DELETE_STATUS)
    ) {
      if (this.vs) {
        gl.detachShader(this.program, this.vs);
        gl.deleteShader(this.vs);
      }
      if (this.fs) {
        gl.detachShader(this.program, this.fs);
        gl.deleteShader(this.fs);
      }
      gl.deleteProgram(this.program);
    }
  }

  setup() {
    const gl = this.gl;
    this.vs = gl.createShader(gl.VERTEX_SHADER)!;
    this.fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    this.compile(this.vs, this.vertexSrc);
    this.compile(this.fs, this.shaderSource);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, this.vs);
    gl.attachShader(prog, this.fs);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
    }

    this.program = prog as ProgramWithUniforms;
  }

  init() {
    const gl = this.gl;
    const program = this.program!;

    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.vertices),
      gl.STATIC_DRAW,
    );

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    program.resolution = gl.getUniformLocation(program, "resolution");
    program.time = gl.getUniformLocation(program, "time");
    program.move = gl.getUniformLocation(program, "move");
    program.touch = gl.getUniformLocation(program, "touch");
    program.pointerCount = gl.getUniformLocation(
      program,
      "pointerCount",
    );
    program.pointers = gl.getUniformLocation(program, "pointers");
  }

  render(now = 0) {
    const gl = this.gl;
    const program = this.program;

    if (!program || gl.getProgramParameter(program, gl.DELETE_STATUS)) return;

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

    gl.uniform2f(
      program.resolution,
      this.canvas.width,
      this.canvas.height,
    );
    gl.uniform1f(program.time, now * 1e-3);
    gl.uniform2f(program.move, ...this.mouseMove as [number, number]);
    gl.uniform2f(
      program.touch,
      ...this.mouseCoords as [number, number],
    );
    gl.uniform1i(program.pointerCount, this.nbrOfPointers);
    gl.uniform2fv(program.pointers, this.pointerCoords);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

class PointerHandler {
  private scale: number;
  private active = false;
  private pointers = new Map<number, number[]>();
  private lastCoords = [0, 0];
  private moves = [0, 0];

  constructor(element: HTMLCanvasElement, scale: number) {
    this.scale = scale;

    const map = (
      el: HTMLCanvasElement,
      s: number,
      x: number,
      y: number,
    ) => [x * s, el.height - y * s];

    element.addEventListener("pointerdown", (e) => {
      this.active = true;
      this.pointers.set(
        e.pointerId,
        map(element, this.getScale(), e.clientX, e.clientY),
      );
    });

    element.addEventListener("pointerup", (e) => {
      if (this.count === 1) {
        this.lastCoords = this.first;
      }
      this.pointers.delete(e.pointerId);
      this.active = this.pointers.size > 0;
    });

    element.addEventListener("pointerleave", (e) => {
      if (this.count === 1) {
        this.lastCoords = this.first;
      }
      this.pointers.delete(e.pointerId);
      this.active = this.pointers.size > 0;
    });

    element.addEventListener("pointermove", (e) => {
      if (!this.active) return;
      this.lastCoords = [e.clientX, e.clientY];
      this.pointers.set(
        e.pointerId,
        map(element, this.getScale(), e.clientX, e.clientY),
      );
      this.moves = [this.moves[0] + e.movementX, this.moves[1] + e.movementY];
    });
  }

  getScale() {
    return this.scale;
  }

  updateScale(scale: number) {
    this.scale = scale;
  }

  get count() {
    return this.pointers.size;
  }

  get move() {
    return this.moves;
  }

  get coords() {
    return this.pointers.size > 0
      ? Array.from(this.pointers.values()).flat()
      : [0, 0];
  }

  get first(): number[] {
    return this.pointers.values().next().value || this.lastCoords;
  }
}

const useShaderBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const pointersRef = useRef<PointerHandler | null>(null);

  const resize = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    if (rendererRef.current) {
      rendererRef.current.updateScale(dpr);
    }
  };

  const loop = useCallback((now: number) => {
    if (!rendererRef.current || !pointersRef.current) return;

    rendererRef.current.updateMouse(pointersRef.current.first);
    rendererRef.current.updatePointerCount(pointersRef.current.count);
    rendererRef.current.updatePointerCoords(pointersRef.current.coords);
    rendererRef.current.updateMove(pointersRef.current.move);
    rendererRef.current.render(now);
    animationFrameRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);

    rendererRef.current = new WebGLRenderer(canvas, dpr);
    pointersRef.current = new PointerHandler(canvas, dpr);

    rendererRef.current.setup();
    rendererRef.current.init();

    resize();

    if (rendererRef.current.test(defaultShaderSource) === null) {
      rendererRef.current.updateShader(defaultShaderSource);
    }

    loop(0);

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.reset();
      }
    };
  }, [loop]);

  return canvasRef;
};

const AnimatedShaderHero: React.FC<HeroProps> = ({
  trustBadge,
  headline,
  subtitle,
  buttons,
  className = "",
}) => {
  const canvasRef = useShaderBackground();

  return (
    <div
      className={cn("relative w-full min-h-screen overflow-hidden", className)}
    >
      <style>
        {`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }

        @keyframes gold-pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.3), 0 0 40px rgba(212, 175, 55, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(212, 175, 55, 0.5), 0 0 60px rgba(212, 175, 55, 0.2);
          }
        }

        .animate-gold-pulse {
          animation: gold-pulse 3s ease-in-out infinite;
        }
      `}
      </style>

      {/* WebGL Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
        style={{ touchAction: "none" }}
      />

      {/* Elegant Portrait Background - Very Subtle Overlay */}
      {/* Uncomment hero-portrait-background class below when image is added to public/luxury-beauty-background.jpg */}
      <div className="hero-portrait-background" />

      {/* Hero Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Decorative Gold Accent Lines */}
        <div className="absolute top-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-60" />
        <div className="absolute bottom-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-60" />

        {/* Trust Badge - Luxury Styled */}
        {trustBadge && (
          <div className="animate-fade-in-down mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-br from-gold/20 via-gold/10 to-transparent backdrop-blur-md border-2 border-gold/40 text-white/95 text-sm font-medium shadow-gold-badge hover:shadow-gold-badge-hover hover:border-gold/60 transition-all duration-500 group">
              {trustBadge.icons && (
                <span className="flex gap-1.5">
                  {trustBadge.icons.map((icon, index) => (
                    <span
                      key={index}
                      className="text-gold text-lg drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] group-hover:scale-110 transition-transform duration-500"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {icon}
                    </span>
                  ))}
                </span>
              )}
              <span className="font-body tracking-wider">
                {trustBadge.text}
              </span>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Heading with Luxury Gold Accents */}
          <h1 className="animate-fade-in-up animation-delay-200">
            <span className="block font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {headline.line1}
            </span>
            <span className="block font-display text-4xl md:text-6xl lg:text-7xl font-bold mt-3 bg-gradient-to-r from-gold via-shiny-gold to-gold bg-clip-text text-transparent animate-gradient drop-shadow-[0_0_20px_rgba(212,175,55,0.4)] relative">
              {headline.line2}
              {/* Decorative underline accent */}
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-gold/80 to-transparent opacity-70" />
            </span>
          </h1>

          {/* Luxury Divider */}
          <div className="animate-fade-in-up animation-delay-300 flex justify-center">
            <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-gold/60 to-transparent relative">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.6)]" />
            </div>
          </div>

          {/* Subtitle with Animation */}
          <div className="animate-fade-in-up animation-delay-400">
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-body tracking-wide drop-shadow-[0_1px_5px_rgba(0,0,0,0.3)]">
              {subtitle}
            </p>
          </div>

          {/* CTA Buttons with Luxury Gold Styling */}
          {buttons && (
            <div className="animate-fade-in-up animation-delay-600 flex flex-col sm:flex-row gap-5 justify-center pt-6">
              {buttons.primary && (
                <button
                  onClick={buttons.primary.onClick}
                  className="group relative px-10 py-4 bg-gradient-to-r from-burgundy via-burgundy/90 to-maroon text-white font-semibold rounded-full shadow-gold-xl hover:shadow-gold-hover-xl transform hover:-translate-y-1 transition-all duration-500 border-2 border-transparent hover:border-gold/40 overflow-hidden"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 transition-opacity duration-700" />
                  <span className="relative z-10 font-body tracking-widest uppercase text-sm">
                    {buttons.primary.text}
                  </span>
                </button>
              )}
              {buttons.secondary && (
                <button
                  onClick={buttons.secondary.onClick}
                  className="group relative px-10 py-4 bg-white/5 backdrop-blur-md border-2 border-gold/40 text-white font-semibold rounded-full hover:bg-gold/10 hover:border-gold/60 transition-all duration-500 shadow-gold-lg hover:shadow-gold-hover-lg transform hover:-translate-y-1 overflow-hidden"
                >
                  {/* Gold glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 transition-opacity duration-700" />
                  <span className="relative z-10 font-body tracking-widest uppercase text-sm text-white group-hover:text-gold transition-colors duration-500">
                    {buttons.secondary.text}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimatedShaderHero;
