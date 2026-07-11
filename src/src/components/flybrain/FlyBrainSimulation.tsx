import { useEffect, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import useFlyBrainAudio, { AudioPhase } from '../../hooks/useFlyBrainAudio';

/* ── COLORS from Copilot spec ── */
const C = {
  bg: 0x000000,
  avatarBody: 0x00e6c3,
  avatarCircuits: 0xff00ff,
  fly: 0xffaa44,
  connBlue: 0x00bfff,
  connGreen: 0x00ff7f,
  connRed: 0xff4500,
  connViolet: 0x9400d3,
  synapse: 0xffffff,
  chipGold: 0xffd700,
  chipCore: 0x00bfff,
  pulseOrange: 0xffa500,
  pulseBlue: 0x00bfff,
  auraWhite: 0xe0ffff,
  nebulaViolet: 0x9400d3,
  nebulaMagenta: 0xff00ff,
  gridGreen: 0x00ff7f,
  gridBlue: 0x00bfff,
};

/* ── PHASES ── */
type Phase = 'idle' | 'fly' | 'connectome' | 'compress' | 'chip' | 'complete';

interface FlyBrainSimulationProps {
  onPhaseChange: (phase: Phase, message: string) => void;
  onFrequencyChange: (hz: number) => void;
  autoStart?: boolean;
  triggerStart?: number; // incrementing this triggers the sequence
}

/* ── Helper: build a geometric humanoid avatar ── */
function buildAvatar(): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshPhysicalMaterial({
    color: C.avatarBody,
    metalness: 0.1,
    roughness: 0.2,
    transparent: true,
    opacity: 0.75,
    emissive: C.avatarBody,
    emissiveIntensity: 0.25,
    clearcoat: 0.3,
  });
  const wireMat = new THREE.MeshBasicMaterial({
    color: C.avatarCircuits,
    wireframe: true,
    transparent: true,
    opacity: 0.3,
  });

  // Head
  const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.2, 1), mat);
  head.position.y = 1.45;
  group.add(head);
  const headWire = new THREE.Mesh(new THREE.IcosahedronGeometry(0.21, 1), wireMat);
  headWire.position.y = 1.45;
  group.add(headWire);

  // Neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.1, 8), mat);
  neck.position.y = 1.25;
  group.add(neck);

  // Torso
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.55, 8), mat);
  torso.position.y = 0.95;
  group.add(torso);
  const torsoWire = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.15, 0.56, 8), wireMat);
  torsoWire.position.y = 0.95;
  group.add(torsoWire);

  // Heart core (glowing)
  const heartMat = new THREE.MeshBasicMaterial({ color: C.avatarCircuits, transparent: true, opacity: 0.8 });
  const heart = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), heartMat);
  heart.position.y = 0.95;
  group.add(heart);
  group.userData.heart = heart;

  // Shoulders
  [-1, 1].forEach((side) => {
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), mat);
    shoulder.position.set(side * 0.16, 1.15, 0);
    group.add(shoulder);
  });

  // Arms
  [-1, 1].forEach((side) => {
    const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.3, 8), mat);
    upperArm.position.set(side * 0.2, 0.95, 0);
    group.add(upperArm);

    const lowerArm = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.28, 8), mat);
    lowerArm.position.set(side * 0.22, 0.65, 0);
    group.add(lowerArm);

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), mat);
    hand.position.set(side * 0.24, 0.38, 0);
    group.add(hand);
    group.userData[side === -1 ? 'leftHand' : 'rightHand'] = hand;
  });

  // Legs
  [-1, 1].forEach((side) => {
    const upperLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.35, 8), mat);
    upperLeg.position.set(side * 0.07, 0.45, 0);
    group.add(upperLeg);

    const lowerLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.35, 8), mat);
    lowerLeg.position.set(side * 0.07, 0.1, 0);
    group.add(lowerLeg);

    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.1), mat);
    foot.position.set(side * 0.07, -0.1, 0.03);
    group.add(foot);
  });

  group.position.set(0, -0.5, 0);
  return group;
}

/* ── Helper: build fly particle system ── */
function buildFly(): THREE.Points {
  const count = 300;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    // Body: elongated ellipsoid
    const bodyX = (Math.random() - 0.5) * 0.25;
    const bodyY = (Math.random() - 0.5) * 0.15;
    const bodyZ = (Math.random() - 0.5) * 0.6;

    // Wing shapes on sides
    const wingAngle = Math.random() * Math.PI * 2;
    const wingR = 0.2 + Math.random() * 0.3;
    const wingX = Math.cos(wingAngle) * wingR * (Math.random() > 0.5 ? 1 : -1);
    const wingY = Math.sin(wingAngle) * wingR * 0.4;

    if (i < count * 0.6) {
      positions[i * 3] = bodyX;
      positions[i * 3 + 1] = bodyY;
      positions[i * 3 + 2] = bodyZ;
    } else {
      positions[i * 3] = wingX;
      positions[i * 3 + 1] = wingY;
      positions[i * 3 + 2] = bodyZ * 0.5;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color: C.fly,
    size: 0.04,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  return new THREE.Points(geo, mat);
}

/* ── Helper: build connectome (neural network sphere) ── */
function buildConnectome(): { points: THREE.Points; lines: THREE.LineSegments; nodePositions: THREE.Vector3[] } {
  const nodeCount = 400;
  const nodePositions: THREE.Vector3[] = [];
  const posArray = new Float32Array(nodeCount * 3);

  // Two hemispheres
  for (let i = 0; i < nodeCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 1.0 + Math.random() * 0.6;
    const x = Math.sin(phi) * Math.cos(theta) * r;
    const y = Math.sin(phi) * Math.sin(theta) * r;
    const z = Math.cos(phi) * r;
    posArray[i * 3] = x;
    posArray[i * 3 + 1] = y;
    posArray[i * 3 + 2] = z;
    nodePositions.push(new THREE.Vector3(x, y, z));
  }

  const pointGeo = new THREE.BufferGeometry();
  pointGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  const colors = [C.connBlue, C.connGreen, C.connRed, C.connViolet];
  const colorArray = new Float32Array(nodeCount * 3);
  for (let i = 0; i < nodeCount; i++) {
    const c = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
    colorArray[i * 3] = c.r;
    colorArray[i * 3 + 1] = c.g;
    colorArray[i * 3 + 2] = c.b;
  }
  pointGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

  const pointMat = new THREE.PointsMaterial({
    size: 0.04,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const points = new THREE.Points(pointGeo, pointMat);

  // Synapse lines
  const linePositions: number[] = [];
  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      const dist = nodePositions[i].distanceTo(nodePositions[j]);
      if (dist < 0.45 && Math.random() < 0.03) {
        linePositions.push(
          nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
          nodePositions[j].x, nodePositions[j].y, nodePositions[j].z,
        );
      }
    }
  }

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  const lineMat = new THREE.LineBasicMaterial({
    color: C.synapse,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const lines = new THREE.LineSegments(lineGeo, lineMat);

  return { points, lines, nodePositions };
}

/* ── Helper: build FLY-BRAIN chip ── */
function buildChip(): THREE.Group {
  const group = new THREE.Group();

  // Nonagon extrusion
  const shape = new THREE.Shape();
  const sides = 9;
  const radius = 1.2;
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();

  const extrudeSettings = { depth: 0.18, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04 };
  const chipGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  const chipMat = new THREE.MeshPhysicalMaterial({
    color: C.chipGold,
    metalness: 0.9,
    roughness: 0.15,
    emissive: C.chipGold,
    emissiveIntensity: 0.15,
    transparent: true,
    opacity: 0,
    clearcoat: 0.5,
  });
  const chipMesh = new THREE.Mesh(chipGeo, chipMat);
  chipMesh.position.z = -0.09;
  group.add(chipMesh);
  group.userData.chipMesh = chipMesh;
  group.userData.chipMat = chipMat;

  // Inner core (blue)
  const coreGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.22, 32);
  const coreMat = new THREE.MeshBasicMaterial({
    color: C.chipCore,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);
  group.userData.core = core;
  group.userData.coreMat = coreMat;

  // Glow rings
  for (let r = 0; r < 3; r++) {
    const ringGeo = new THREE.TorusGeometry(1.3 + r * 0.15, 0.02, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: r === 0 ? C.chipGold : C.pulseBlue,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.z = r * 0.06 - 0.06;
    group.add(ring);
    if (!group.userData.rings) group.userData.rings = [];
    (group.userData.rings as THREE.Mesh[]).push(ring);
  }

  group.rotation.x = 0.3;
  group.position.z = 0.1;
  return group;
}

/* ── Helper: build toroidal aura ── */
function buildToroidalAura(): THREE.Points {
  const count = 2000;
  const positions = new Float32Array(count * 3);
  const R = 1.8;
  const r = 0.5;

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 2;
    const x = (R + r * Math.cos(phi)) * Math.cos(theta);
    const y = (R + r * Math.cos(phi)) * Math.sin(theta);
    const z = r * Math.sin(phi);
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color: C.auraWhite,
    size: 0.03,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  return new THREE.Points(geo, mat);
}

/* ── Helper: build starfield ── */
function buildStars(): THREE.Points {
  const count = 2000;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.08,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  return new THREE.Points(geo, mat);
}

/* ── Helper: build fractal grid ── */
function buildFractalGrid(): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.LineBasicMaterial({
    color: C.gridBlue,
    transparent: true,
    opacity: 0.08,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  for (let r = 0; r < 4; r++) {
    const size = 1.5 + r * 1.5;
    const segments = 8 + r * 4;
    const geo = new THREE.BufferGeometry();
    const verts: number[] = [];

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      verts.push(Math.cos(angle) * size, 0, Math.sin(angle) * size);
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    const ring = new THREE.Line(geo, mat.clone());
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
  }

  return group;
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function FlyBrainSimulation({ onPhaseChange, onFrequencyChange, autoStart = true, triggerStart }: FlyBrainSimulationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef(0);
  const clockRef = useRef(new THREE.Clock());
  const phaseRef = useRef<Phase>('idle');
  const phaseTimerRef = useRef(0);
  const objectsRef = useRef<Record<string, any>>({});

  const audio = useFlyBrainAudio();
  const [started, setStarted] = useState(false);

  /* ── Phase transition ── */
  const advancePhase = useCallback((newPhase: Phase) => {
    phaseRef.current = newPhase;
    phaseTimerRef.current = 0;
    audio.setPhase(newPhase as AudioPhase);
    onFrequencyChange(
      newPhase === 'chip' || newPhase === 'complete' ? audio.FREQ_PULSE :
      newPhase === 'connectome' || newPhase === 'compress' ? audio.FREQ_TRANSFORM :
      audio.FREQ_BASE
    );
  }, [audio, onFrequencyChange]);

  /* ── Initialization ── */
  useEffect(() => {
    if (!containerRef.current) return;

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── Scene ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(C.bg);
    scene.fog = new THREE.FogExp2(C.bg, 0.0008);
    sceneRef.current = scene;

    // ── Camera ──
    const camera = new THREE.PerspectiveCamera(50, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 100);
    camera.position.set(0, 1.2, 7);
    camera.lookAt(0, 0.3, 0);
    cameraRef.current = camera;

    // ── Lighting ──
    scene.add(new THREE.AmbientLight(0x222244, 0.4));
    const keyLight = new THREE.DirectionalLight(0xffdd88, 0.8);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(C.avatarBody, 0.4);
    rimLight.position.set(-3, 1, -2);
    scene.add(rimLight);

    // ── Stars ──
    const stars = buildStars();
    scene.add(stars);
    objectsRef.current.stars = stars;

    // ── Fractal grid ──
    const grid = buildFractalGrid();
    grid.position.y = -2.5;
    scene.add(grid);
    objectsRef.current.grid = grid;

    // ── Toroidal aura ──
    const aura = buildToroidalAura();
    aura.visible = false;
    scene.add(aura);
    objectsRef.current.aura = aura;

    // ── Avatar ──
    const avatar = buildAvatar();
    avatar.position.set(0, -0.3, 0);
    scene.add(avatar);
    objectsRef.current.avatar = avatar;

    // ── Fly ──
    const fly = buildFly();
    fly.position.set(0, 0.38, 0.5);
    fly.visible = false;
    scene.add(fly);
    objectsRef.current.fly = fly;

    // ── Connectome ──
    const { points: connPoints, lines: connLines } = buildConnectome();
    connPoints.visible = false;
    connLines.visible = false;
    scene.add(connPoints);
    scene.add(connLines);
    objectsRef.current.connPoints = connPoints;
    objectsRef.current.connLines = connLines;

    // ── Chip ──
    const chip = buildChip();
    chip.visible = false;
    scene.add(chip);
    objectsRef.current.chip = chip;

    // ── Central glow point light ──
    const glowLight = new THREE.PointLight(C.chipCore, 0, 8);
    glowLight.position.set(0, 0.4, 0);
    scene.add(glowLight);
    objectsRef.current.glowLight = glowLight;

    // ── Resize handler ──
    const onResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    /* ── Animation Loop ── */
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const time = clockRef.current.getElapsedTime();
      const dt = Math.min(time - (clockRef.current._lastTime ?? time), 0.1);
      // track _lastTime ourselves
      (clockRef.current as any)._lastTime = time;

      const phase = phaseRef.current;
      phaseTimerRef.current += dt;

      const { stars: s, grid: g, aura: a, avatar: av, fly: f,
        connPoints: cp, connLines: cl, chip: ch, glowLight: gl } = objectsRef.current;

      // ── Stars always rotate ──
      if (s) s.rotation.y += 0.0001;

      // ── Grid pulse ──
      if (g) {
        g.rotation.y += 0.002;
        g.children.forEach((child: any, i: number) => {
          if (child.material) {
            child.material.opacity = 0.06 + Math.sin(time * 0.8 + i) * 0.03;
          }
        });
      }

      // ── Avatar breathing ──
      if (av && av.userData.heart) {
        const heartScale = 1 + Math.sin(time * 2.5) * 0.15;
        av.userData.heart.scale.setScalar(heartScale);
        (av.userData.heart.material as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(time * 2.5) * 0.3;
      }

      // ── Phase-specific animation ──
      if (phase === 'fly' && f && f.visible) {
        // Fly hovering
        f.position.y = 0.38 + Math.sin(time * 3) * 0.08;
        f.position.x = Math.sin(time * 1.5) * 0.15;
        f.rotation.y += 0.02;
        f.rotation.z = Math.sin(time * 2) * 0.1;
      }

      if ((phase === 'connectome' || phase === 'compress') && cp && cp.visible) {
        cp.rotation.y += 0.008;
        cp.rotation.x = Math.sin(time * 0.3) * 0.2;
        if (cl && cl.visible) {
          cl.rotation.copy(cp.rotation);
        }
        // Scale down during compress
        if (phase === 'compress') {
          const elapsed = phaseTimerRef.current;
          const targetScale = Math.max(0.15, 1 - elapsed * 0.35);
          cp.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
          if (cl) cl.scale.copy(cp.scale);
        }
      }

      if ((phase === 'chip' || phase === 'complete') && ch && ch.visible) {
        ch.rotation.y += 0.006;
        ch.rotation.x = 0.3 + Math.sin(time * 0.4) * 0.08;
        // Pulse rings
        if (ch.userData.rings) {
          (ch.userData.rings as THREE.Mesh[]).forEach((ring: THREE.Mesh, i: number) => {
            const s = 1 + Math.sin(time * 3 + i) * 0.06;
            ring.scale.setScalar(s);
          });
        }
        // Core pulse
        if (ch.userData.core) {
          const corePulse = 1 + Math.sin(time * 4) * 0.2;
          ch.userData.core.scale.setScalar(corePulse);
          (ch.userData.coreMat as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(time * 4) * 0.3;
        }
        // Chip emissive pulse
        if (ch.userData.chipMat) {
          (ch.userData.chipMat as THREE.MeshPhysicalMaterial).emissiveIntensity =
            0.15 + Math.sin(time * 2.5) * 0.1;
        }
        // Glow light
        if (gl) {
          gl.intensity = 1.5 + Math.sin(time * 3) * 0.8;
        }
      }

      // ── Toroidal aura ──
      if (a && a.visible) {
        a.rotation.x += 0.003;
        a.rotation.y += 0.005;
        a.rotation.z += 0.002;
        // Schumann resonance 7.83 Hz → ~0.128s period → scale pulse
        const schumann = Math.sin(time * 7.83 * Math.PI * 2) * 0.08 + 1;
        a.scale.setSc