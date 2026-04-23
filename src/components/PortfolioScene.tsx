import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// @ts-ignore
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
// @ts-ignore
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
// @ts-ignore
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import {
  PERSONAL, ABOUT, EXPERIENCES, SKILLS,
  EDUCATION, IMPACT_METRICS, NAV_ITEMS
} from '@/lib/data';

gsap.registerPlugin(ScrollTrigger);

/* ======== CAMERA JOURNEY ======== */
const SECTIONS = ['hero', 'about', 'experience', 'skills', 'education', 'impact', 'connect'];
const TOTAL_SECTIONS = SECTIONS.length - 1; // 6 scrollable viewports after hero

const CAMERA_JOURNEY = [
  { x: 0,  y: 30,  z: 300  },  // 0 hero — behind mountains
  { x: -3, y: 28,  z: 200  },  // 1 about — approaching mountains
  { x:  4, y: 35,  z: 60   },  // 2 experience — passing through
  { x:  0, y: 40,  z: -100 },  // 3 skills — open space
  { x: -4, y: 45,  z: -300 },  // 4 education — deeper
  { x:  3, y: 50,  z: -500 },  // 5 impact — approaching nebula
  { x:  0, y: 55,  z: -700 },  // 6 connect — inside nebula
];

/* ======== ANIMATED COUNTER ======== */
function AnimatedCounter({ value, inView }: { value: string; inView: boolean }) {
  const [display, setDisplay] = useState('0');
  const animated = useRef(false);

  useEffect(() => {
    if (!inView || animated.current) return;
    animated.current = true;
    const num = parseInt(value.replace(/[^0-9]/g, ''));
    if (isNaN(num)) { setDisplay(value); return; }
    const start = performance.now();
    const dur = 2000;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      const cur = Math.floor(e * num);
      setDisplay(value.includes('K') && cur >= 1000 ? Math.floor(cur / 1000) + 'K' : String(cur));
      if (p < 1) requestAnimationFrame(tick); else setDisplay(value);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return <>{display}</>;
}

/* ======== CONTACT LINKS ======== */
const LINKS = [
  { icon: '📧', label: 'Email',    value: PERSONAL.email,   href: `mailto:${PERSONAL.email}` },
  { icon: '💼', label: 'LinkedIn', value: 'in/aagam2301',   href: PERSONAL.linkedin },
  { icon: '🐙', label: 'GitHub',   value: 'asheth2310',     href: PERSONAL.github },
  { icon: '📱', label: 'Phone',    value: PERSONAL.phone,   href: `tel:${PERSONAL.phone.replace(/-/g, '')}` },
];

/* ======== MAIN COMPONENT ======== */
export function PortfolioScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const titleRef      = useRef<HTMLHeadingElement>(null);
  const subtitleRef   = useRef<HTMLDivElement>(null);
  const progressRef   = useRef<HTMLDivElement>(null);
  const menuRef       = useRef<HTMLDivElement>(null);
  const sectionRefs   = useRef<(HTMLDivElement | null)[]>([]);

  const smoothCam     = useRef({ x: 0, y: 30, z: 300 });
  const [scrollProg,  setScrollProg]  = useState(0);
  const [curSection,  setCurSection]  = useState(0);
  const [isReady,     setIsReady]     = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());

  const threeRefs = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    composer: any;
    stars: THREE.Points[];
    nebula: THREE.Mesh | null;
    mountains: THREE.Mesh[];
    animationId: number | null;
    targetCameraX: number;
    targetCameraY: number;
    targetCameraZ: number;
    locations: number[];
  }>({
    scene: null, camera: null, renderer: null, composer: null,
    stars: [], nebula: null, mountains: [], animationId: null,
    targetCameraX: 0, targetCameraY: 30, targetCameraZ: 300, locations: [],
  });

  /* ---- THREE.JS INIT ---- */
  useEffect(() => {
    if (!canvasRef.current) return;
    const refs = threeRefs.current;

    // Scene
    refs.scene = new THREE.Scene();
    refs.scene.fog = new THREE.FogExp2(0x000000, 0.00025);

    // Camera
    refs.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    refs.camera.position.set(0, 20, 100);

    // Renderer
    refs.renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    refs.renderer.setSize(window.innerWidth, window.innerHeight);
    refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    refs.renderer.toneMappingExposure = 0.5;

    // Bloom
    refs.composer = new EffectComposer(refs.renderer);
    refs.composer.addPass(new RenderPass(refs.scene, refs.camera));
    refs.composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.8, 0.4, 0.85));

    /* -- Stars -- */
    for (let layer = 0; layer < 3; layer++) {
      const count = 5000;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      const siz = new Float32Array(count);
      for (let j = 0; j < count; j++) {
        const r = 200 + Math.random() * 800;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(Math.random() * 2 - 1);
        pos[j*3]   = r * Math.sin(ph) * Math.cos(th);
        pos[j*3+1] = r * Math.sin(ph) * Math.sin(th);
        pos[j*3+2] = r * Math.cos(ph);
        const c = new THREE.Color();
        const rnd = Math.random();
        if (rnd < 0.7) c.setHSL(0, 0, 0.8 + Math.random() * 0.2);
        else if (rnd < 0.9) c.setHSL(0.08, 0.5, 0.8);
        else c.setHSL(0.6, 0.5, 0.8);
        col[j*3] = c.r; col[j*3+1] = c.g; col[j*3+2] = c.b;
        siz[j] = Math.random() * 2 + 0.5;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      geo.setAttribute('size', new THREE.BufferAttribute(siz, 1));

      const mat = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 }, depth: { value: layer } },
        vertexShader: `
          attribute float size; attribute vec3 color; varying vec3 vColor;
          uniform float time; uniform float depth;
          void main(){
            vColor=color; vec3 p=position;
            float a=time*0.05*(1.0-depth*0.3);
            mat2 rot=mat2(cos(a),-sin(a),sin(a),cos(a));
            p.xy=rot*p.xy;
            vec4 mv=modelViewMatrix*vec4(p,1.0);
            gl_PointSize=size*(300.0/-mv.z);
            gl_Position=projectionMatrix*mv;
          }`,
        fragmentShader: `
          varying vec3 vColor;
          void main(){
            float d=length(gl_PointCoord-vec2(0.5));
            if(d>0.5)discard;
            gl_FragColor=vec4(vColor,1.0-smoothstep(0.0,0.5,d));
          }`,
        transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const pts = new THREE.Points(geo, mat);
      refs.scene.add(pts);
      refs.stars.push(pts);
    }

    /* -- Nebula -- */
    const nebGeo = new THREE.PlaneGeometry(8000, 4000, 100, 100);
    const nebMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x0033ff) },
        color2: { value: new THREE.Color(0xff0066) },
        opacity: { value: 0.3 },
      },
      vertexShader: `
        varying vec2 vUv; varying float vElev; uniform float time;
        void main(){
          vUv=uv; vec3 p=position;
          float e=sin(p.x*0.01+time)*cos(p.y*0.01+time)*20.0;
          p.z+=e; vElev=e;
          gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
        }`,
      fragmentShader: `
        uniform vec3 color1,color2; uniform float opacity,time;
        varying vec2 vUv; varying float vElev;
        void main(){
          float m=sin(vUv.x*10.0+time)*cos(vUv.y*10.0+time);
          vec3 c=mix(color1,color2,m*0.5+0.5);
          float a=opacity*(1.0-length(vUv-0.5)*2.0);
          a*=1.0+vElev*0.01;
          gl_FragColor=vec4(c,a);
        }`,
      transparent: true, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false,
    });
    const nebula = new THREE.Mesh(nebGeo, nebMat);
    nebula.position.z = -1050;
    refs.scene.add(nebula);
    refs.nebula = nebula;

    /* -- Mountains -- */
    const layers = [
      { distance: -50,  height: 60,  color: 0x1a1a2e, opacity: 1   },
      { distance: -100, height: 80,  color: 0x16213e, opacity: 0.8 },
      { distance: -150, height: 100, color: 0x0f3460, opacity: 0.6 },
      { distance: -200, height: 120, color: 0x0a4668, opacity: 0.4 },
    ];
    layers.forEach((l) => {
      const pts: THREE.Vector2[] = [];
      for (let i = 0; i <= 50; i++) {
        const x = (i / 50 - 0.5) * 1000;
        const y = Math.sin(i * 0.1) * l.height + Math.sin(i * 0.05) * l.height * 0.5 + Math.random() * l.height * 0.2 - 100;
        pts.push(new THREE.Vector2(x, y));
      }
      pts.push(new THREE.Vector2(5000, -300));
      pts.push(new THREE.Vector2(-5000, -300));
      const shape = new THREE.Shape(pts);
      const geo = new THREE.ShapeGeometry(shape);
      const mat = new THREE.MeshBasicMaterial({ color: l.color, transparent: true, opacity: l.opacity, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, l.distance, l.distance);
      mesh.userData = { baseZ: l.distance };
      refs.scene.add(mesh);
      refs.mountains.push(mesh);
    });
    refs.locations = refs.mountains.map(m => m.position.z);

    /* -- Atmosphere -- */
    const atmGeo = new THREE.SphereGeometry(600, 32, 32);
    const atmMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: `
        varying vec3 vNormal;
        void main(){ vNormal=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `
        varying vec3 vNormal; uniform float time;
        void main(){
          float i=pow(0.7-dot(vNormal,vec3(0,0,1)),2.0);
          vec3 a=vec3(0.3,0.6,1.0)*i*(sin(time*2.0)*0.1+0.9);
          gl_FragColor=vec4(a,i*0.25);
        }`,
      side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true,
    });
    refs.scene.add(new THREE.Mesh(atmGeo, atmMat));

    /* -- Animate -- */
    const animate = () => {
      refs.animationId = requestAnimationFrame(animate);
      const t = Date.now() * 0.001;

      refs.stars.forEach(s => { if ((s.material as THREE.ShaderMaterial).uniforms) (s.material as THREE.ShaderMaterial).uniforms.time.value = t; });
      if (refs.nebula) (refs.nebula.material as THREE.ShaderMaterial).uniforms.time.value = t * 0.5;

      // Smooth camera
      const sf = 0.04;
      smoothCam.current.x += (refs.targetCameraX - smoothCam.current.x) * sf;
      smoothCam.current.y += (refs.targetCameraY - smoothCam.current.y) * sf;
      smoothCam.current.z += (refs.targetCameraZ - smoothCam.current.z) * sf;
      if (refs.camera) {
        refs.camera.position.set(
          smoothCam.current.x + Math.sin(t * 0.1) * 2,
          smoothCam.current.y + Math.cos(t * 0.15) * 1,
          smoothCam.current.z,
        );
        refs.camera.lookAt(0, 10, -600);
      }

      // Mountain parallax
      refs.mountains.forEach((m, i) => {
        const pf = 1 + i * 0.5;
        m.position.x = Math.sin(t * 0.1) * 2 * pf;
        m.position.y = 50 + Math.cos(t * 0.15) * pf;
      });

      refs.composer?.render();
    };
    animate();
    setIsReady(true);

    /* -- Resize -- */
    const onResize = () => {
      if (!refs.camera || !refs.renderer || !refs.composer) return;
      refs.camera.aspect = window.innerWidth / window.innerHeight;
      refs.camera.updateProjectionMatrix();
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
      refs.composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      refs.stars.forEach(s => { s.geometry.dispose(); (s.material as THREE.Material).dispose(); });
      refs.mountains.forEach(m => { m.geometry.dispose(); (m.material as THREE.Material).dispose(); });
      if (refs.nebula) { refs.nebula.geometry.dispose(); (refs.nebula.material as THREE.Material).dispose(); }
      refs.renderer?.dispose();
    };
  }, []);

  /* ---- GSAP ENTRANCE ---- */
  useEffect(() => {
    if (!isReady) return;
    gsap.set([menuRef.current, titleRef.current, subtitleRef.current, progressRef.current], { visibility: 'visible' });
    const tl = gsap.timeline();
    if (menuRef.current)    tl.from(menuRef.current, { x: -100, opacity: 0, duration: 1, ease: 'power3.out' });
    if (titleRef.current)   tl.from(titleRef.current.querySelectorAll('.title-char'), { y: 200, opacity: 0, duration: 1.5, stagger: 0.04, ease: 'power4.out' }, '-=0.5');
    if (subtitleRef.current) tl.from(subtitleRef.current.querySelectorAll('.subtitle-line'), { y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: 'power3.out' }, '-=0.8');
    if (progressRef.current) tl.from(progressRef.current, { opacity: 0, y: 50, duration: 1, ease: 'power2.out' }, '-=0.5');
    return () => { tl.kill(); };
  }, [isReady]);

  /* ---- SCROLL ---- */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const wh = window.innerHeight;
      const max = document.documentElement.scrollHeight - wh;
      const prog = Math.min(y / max, 1);
      setScrollProg(prog);
      setNavScrolled(y > 80);

      // Fade hero text out over first 40% of first viewport
      const heroFade = Math.max(0, 1 - (y / (wh * 0.4)));
      setHeroOpacity(heroFade);

      const total = prog * TOTAL_SECTIONS;
      const sec = Math.min(Math.floor(total), TOTAL_SECTIONS - 1);
      const frac = total - sec;
      setCurSection(sec);

      const cur = CAMERA_JOURNEY[sec]  || CAMERA_JOURNEY[0];
      const nxt = CAMERA_JOURNEY[sec + 1] || cur;
      const refs = threeRefs.current;
      refs.targetCameraX = cur.x + (nxt.x - cur.x) * frac;
      refs.targetCameraY = cur.y + (nxt.y - cur.y) * frac;
      refs.targetCameraZ = cur.z + (nxt.z - cur.z) * frac;

      // Mountain parallax — hide after passing through
      refs.mountains.forEach((m, i) => {
        const speed = 1 + i * 0.9;
        if (prog > 0.35) m.position.z = 600000;
        else m.position.z = refs.locations[i];
        if (refs.nebula) {
          const tgt = m.userData.baseZ + y * speed * 0.5;
          (refs.nebula as THREE.Mesh).position.z = tgt + prog * speed * 0.01 - 100;
        }
      });
      if (refs.nebula && refs.mountains[3]) refs.nebula.position.z = refs.mountains[3].position.z;

      // Section visibility
      const newVisible = new Set<number>();
      sectionRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.15) {
          newVisible.add(idx);
        }
      });
      setVisibleSections(newVisible);
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = useCallback((idx: number) => {
    if (idx === 0) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    // sectionRefs[0] = About (idx 1), sectionRefs[1] = Experience (idx 2), etc.
    const el = sectionRefs.current[idx - 1];
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const splitTitle = (text: string) =>
    text.split('').map((ch, i) => (
      <span key={i} className="title-char inline-block">{ch === ' ' ? '\u00A0' : ch}</span>
    ));

  /* ======== RENDER ======== */
  return (
    <div ref={containerRef} className="hero-container">
      <canvas ref={canvasRef} className="hero-canvas" />

      {/* ---- NAV ---- */}
      <nav className={`floating-nav ${navScrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          {SECTIONS.map((s, i) => (
            <button
              key={s}
              className={`nav-link ${curSection === i || (i === 0 && scrollProg < 0.02) ? 'active' : ''}`}
              onClick={() => scrollTo(i)}
            >
              {s === 'hero' ? 'Home' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* ---- SIDE MENU ---- */}
      <div ref={menuRef} className="side-menu" style={{ visibility: 'hidden' }}>
        <div className="menu-icon"><span /><span /><span /></div>
        <div className="vertical-text">PORTFOLIO</div>
      </div>

      {/* ---- HERO CONTENT (fixed) ---- */}
      <div className="hero-content" style={{ opacity: heroOpacity, transition: 'opacity 0.15s linear', pointerEvents: heroOpacity < 0.1 ? 'none' : 'auto' }}>
        <div className="status-badge">
          <span className="status-dot" />
          <span className="status-text">{PERSONAL.badge}</span>
        </div>

        <h1 ref={titleRef} className="hero-title" style={{ visibility: 'hidden' }}>
          {splitTitle(PERSONAL.name)}
        </h1>

        <div ref={subtitleRef} className="hero-subtitle" style={{ visibility: 'hidden' }}>
          <p className="subtitle-line">{PERSONAL.subtitle}</p>
          <p className="subtitle-line" style={{ color: 'rgba(129,140,248,0.7)', fontWeight: 500 }}>
            {PERSONAL.title}
          </p>
        </div>
      </div>

      {/* ---- SCROLL PROGRESS ---- */}
      <div ref={progressRef} className="scroll-progress" style={{ visibility: 'hidden' }}>
        <div className="scroll-text">SCROLL</div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${scrollProg * 100}%` }} />
        </div>
        <div className="section-counter">
          {String(curSection).padStart(2, '0')} / {String(TOTAL_SECTIONS).padStart(2, '0')}
        </div>
      </div>

      {/* ======== SCROLL SECTIONS ======== */}
      <div className="scroll-sections">

        {/* Hero spacer — keeps first viewport clean with just the name */}
        <div style={{ height: '100vh' }} aria-hidden="true" />

        {/* ---- 0: ABOUT ---- */}
        <section className="content-section" ref={el => { sectionRefs.current[0] = el; }}>
          <div className={`section-inner ${visibleSections.has(0) ? 'in-view' : ''}`}>
            <span className="s-badge">About Me</span>
            <h2 className="s-heading">Building Systems That <span className="gradient-text">Think & Scale</span></h2>
            <div className="g-card" style={{ padding: '36px 40px', marginBottom: 20 }}>
              {ABOUT.paragraphs.map((p, i) => (
                <p key={i} className="about-bio" style={{ marginBottom: i < ABOUT.paragraphs.length - 1 ? 16 : 0 }}>{p}</p>
              ))}
            </div>
            <div className="about-highlights">
              {ABOUT.highlights.map((h, i) => (
                <div key={i} className="about-highlight">
                  <span style={{ fontSize: 20 }}>{h.icon}</span>
                  <span>{h.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- 1: EXPERIENCE ---- */}
        <section className="content-section" ref={el => { sectionRefs.current[1] = el; }}>
          <div className={`section-inner ${visibleSections.has(1) ? 'in-view' : ''}`}>
            <span className="s-badge">Experience</span>
            <h2 className="s-heading">Where I've <span className="gradient-text">Contributed</span></h2>
            <div className="exp-timeline">
              {EXPERIENCES.map((exp, i) => (
                <div key={i} className="exp-item">
                  <div className="exp-dot" />
                  <div className="g-card" style={{ padding: '28px 32px' }}>
                    <div className="exp-header">
                      <div>
                        <div className="exp-role">{exp.role}</div>
                        <div className="exp-company">{exp.company}</div>
                      </div>
                      <div className="exp-meta">
                        <div className="exp-period">{exp.period}</div>
                        <div className="exp-location">{exp.location}</div>
                      </div>
                    </div>
                    <div className="exp-divider" />
                    <ul className="exp-bullets">
                      {exp.bullets.map((b, j) => (
                        <li key={j} className="exp-bullet">
                          <span className="exp-bullet-icon">▸</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- 2: SKILLS ---- */}
        <section className="content-section" ref={el => { sectionRefs.current[2] = el; }}>
          <div className={`section-inner ${visibleSections.has(2) ? 'in-view' : ''}`}>
            <span className="s-badge">Skills</span>
            <h2 className="s-heading">My <span className="gradient-text">Tech Arsenal</span></h2>
            <div className="skills-grid">
              {SKILLS.map((g, i) => (
                <div key={i} className="g-card" style={{ padding: '24px 28px' }}>
                  <div className="skill-category-label">{g.category}</div>
                  <div className="skill-tags">
                    {g.items.map((item, j) => (
                      <span key={j} className="skill-tag">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- 3: EDUCATION ---- */}
        <section className="content-section" ref={el => { sectionRefs.current[3] = el; }}>
          <div className={`section-inner ${visibleSections.has(3) ? 'in-view' : ''}`}>
            <span className="s-badge">Education</span>
            <h2 className="s-heading">Academic <span className="gradient-text">Foundation</span></h2>
            <div className="edu-grid">
              {EDUCATION.map((edu, i) => (
                <div key={i} className="g-card" style={{ padding: '32px' }}>
                  <div className="edu-icon-box">🎓</div>
                  <div className="edu-degree">{edu.degree}</div>
                  <div className="edu-school">{edu.school}</div>
                  <div className="edu-meta">
                    <span className="edu-period-badge">{edu.period}</span>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
                    <span>{edu.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- 4: IMPACT ---- */}
        <section className="content-section" ref={el => { sectionRefs.current[4] = el; }}>
          <div className={`section-inner ${visibleSections.has(4) ? 'in-view' : ''}`}>
            <span className="s-badge">Impact</span>
            <h2 className="s-heading">Impact of <span className="gradient-text">My Work</span></h2>
            <div className="impact-grid">
              {IMPACT_METRICS.map((m, i) => (
                <div key={i} className="g-card" style={{ padding: '28px' }}>
                  <div className="impact-value gradient-text">
                    <AnimatedCounter value={m.value} inView={visibleSections.has(4)} />
                  </div>
                  <div className="impact-label">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- 5: CONNECT ---- */}
        <section className="content-section" ref={el => { sectionRefs.current[5] = el; }}>
          <div className={`section-inner ${visibleSections.has(5) ? 'in-view' : ''}`} style={{ textAlign: 'center' }}>
            <span className="s-badge">Connect</span>
            <h2 className="s-heading">Let's Work <span className="gradient-text">Together</span></h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
              Currently open for Software Engineer, ML Engineer, and Data roles.
            </p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', marginBottom: 32 }}>
              Graduating May 2026 — available for full-time opportunities.
            </p>
            <div className="connect-links" style={{ maxWidth: 560, margin: '0 auto 32px' }}>
              {LINKS.map((l, i) => (
                <a
                  key={i}
                  href={l.href}
                  target={l.href.startsWith('http') ? '_blank' : undefined}
                  rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="g-card connect-card"
                >
                  <div className="connect-icon-box">{l.icon}</div>
                  <span className="connect-label">{l.label}</span>
                  <span className="connect-value">{l.value}</span>
                </a>
              ))}
            </div>
            <a href={PERSONAL.resumeUrl} target="_blank" rel="noreferrer" className="cta-button">
              Download Resume
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          </div>
        </section>

        {/* ---- FOOTER ---- */}
        <footer style={{ textAlign: 'center', padding: '48px 24px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)' }}>
            © {new Date().getFullYear()} Aagam Sheth — Built with React, Three.js, GSAP & Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
}
