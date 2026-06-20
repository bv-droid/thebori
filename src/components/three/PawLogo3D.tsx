"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { PAW_PATHS } from "@/components/brand/Logo";

/* The canonical BØRI paw extruded into real 3D from its SVG (geometry stays canon).
   GREY GLASS at rest — no rotation. As the hold `progress` (0..1) charges, the glass
   heats from the fresnel rim inward and the volume tints to an ember orange. */

// lerp targets — created ONCE (never allocate THREE.Color inside useFrame)
const C_GREY = new THREE.Color("#C2C7CC"); // cool platinum-grey glass at rest
const C_EMBER = new THREE.Color("#FF6A1A"); // ember/signal orange (on-palette, not neon)
const C_ATTEN_REST = new THREE.Color("#AEB7BE");
const C_EMI_REST = new THREE.Color("#46443E"); // СҰР warm-grey self-glow floor
const C_EMI_HOT = new THREE.Color("#FF5A12");
const C_SPEC_REST = new THREE.Color("#FFFFFF");
const C_SPEC_HOT = new THREE.Color("#FFD8B0");
// scratch colors so the constants above are never mutated
const _col = new THREE.Color();
const _att = new THREE.Color();
const _emi = new THREE.Color();
const _spc = new THREE.Color();

function buildPawGeometry() {
  // one path + fill-rule:evenodd so nested contours (letter counters, the gaps
  // inside the claws/wordmark) become real HOLES instead of solid fill — the
  // glass then reads with see-through negative space instead of one blended mass
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 395 407"><path fill-rule="evenodd" d="${PAW_PATHS.join(
    " ",
  )}"/></svg>`;
  const data = new SVGLoader().parse(svg);
  const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
  const geom = new THREE.ExtrudeGeometry(shapes, {
    depth: 26,
    bevelEnabled: true,
    bevelThickness: 4,
    bevelSize: 2.5,
    bevelSegments: 4,
    curveSegments: 16,
  });
  geom.center();
  const s = 0.05;
  geom.scale(s, -s, s); // SVG Y is down → flip
  geom.center();
  geom.computeVertexNormals();
  return geom;
}

function PawMesh({
  progressRef,
  reduced,
}: {
  progressRef: React.RefObject<number>;
  reduced: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const geom = useMemo(buildPawGeometry, []);
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: C_GREY.clone(),
        metalness: 0, // dielectric GLASS, not metal
        roughness: 0.16, // crisp frosted glass; sharpens on charge
        transmission: 0.92, // see-through; never animated to 0 (avoids recompile)
        thickness: 2.8, // volume along refraction ray, tuned to the 0.05 extrude scale
        ior: 1.46,
        attenuationColor: C_ATTEN_REST.clone(),
        attenuationDistance: 6.0,
        clearcoat: 1, // glossy coat → fresnel rim that traces the silhouette on dark
        clearcoatRoughness: 0.08,
        specularIntensity: 1,
        specularColor: C_SPEC_REST.clone(),
        emissive: C_EMI_REST.clone(), // СҰР warm-grey floor so it reads at p=0
        emissiveIntensity: 0.1,
        envMapIntensity: 1.2,
        transparent: true,
        side: THREE.FrontSide,
        toneMapped: false, // bypass ACES so the hot orange ember stays saturated
      }),
    [],
  );

  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    const p = THREE.MathUtils.clamp(progressRef.current ?? 0, 0, 1);

    // NO rotation — pin to front so nothing drifts it.
    m.rotation.set(0, 0, 0);

    const ease = p * p * (3 - 2 * p); // smoothstep: slow start, decisive bloom (heating)
    const rim = Math.pow(p, 0.55); // rim/edge heats earlier than the body

    // 1) surface tint: cool grey → warm-grey ember (subtle; bulk of orange is emissive + volume)
    mat.color.copy(_col.copy(C_GREY).lerp(C_EMBER, ease * 0.45));
    // 2) volumetric heat: attenuation neutral → orange; distance shrinks to concentrate the core
    mat.attenuationColor.copy(_att.copy(C_ATTEN_REST).lerp(C_EMBER, ease));
    mat.attenuationDistance = THREE.MathUtils.lerp(6.0, 1.1, ease);
    // 3) self-illuminated ember so it reads on near-black (emissive added after transmission mix)
    mat.emissive.copy(_emi.copy(C_EMI_REST).lerp(C_EMI_HOT, rim));
    mat.emissiveIntensity = 0.1 + rim * 1.5;
    // 4) crisper & more opaque as it heats so the orange is unmistakable (transmission stays > 0)
    mat.transmission = THREE.MathUtils.lerp(0.92, 0.62, ease);
    mat.roughness = THREE.MathUtils.lerp(0.16, 0.06, ease);
    mat.clearcoatRoughness = THREE.MathUtils.lerp(0.08, 0.03, ease);
    mat.specularColor.copy(_spc.copy(C_SPEC_REST).lerp(C_SPEC_HOT, ease * 0.8));
    mat.envMapIntensity = THREE.MathUtils.lerp(1.2, 1.45, ease);
    // 5) gentle forward scale on charge + heat-shimmer — idle motion only;
    //    skipped entirely under reduced-motion (charge state still responds)
    if (reduced) {
      m.scale.setScalar(1);
      return;
    }
    m.scale.setScalar(1 + ease * 0.07);
    mat.emissiveIntensity += 0.05 * ease * Math.sin(t * 3.0);
  });

  return <mesh ref={ref} geometry={geom} material={mat} />;
}

export function PawLogo3D({
  progress = 0,
  reduced = false,
  className,
}: {
  progress?: number;
  reduced?: boolean;
  className?: string;
}) {
  const progressRef = useRef(progress);
  progressRef.current = progress;

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 38], fov: 35 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[6, 10, 8]} intensity={1.8} color="#cdd2d6" />
        <directionalLight position={[-8, -4, -6]} intensity={0.8} color="#6f767c" />
        {/* dedicated backlight so the static grey glass silhouette reads on the dark bg */}
        <directionalLight position={[0, 6, -10]} intensity={1.4} color="#cdd2d6" />
        <Environment resolution={256}>
          <Lightformer
            form="rect"
            intensity={2}
            color="#d7dbdd"
            position={[0, 4, 6]}
            scale={[10, 6, 1]}
          />
          <Lightformer
            form="rect"
            intensity={1}
            color="#a8b0b8"
            position={[-6, -2, 4]}
            scale={[6, 6, 1]}
          />
        </Environment>
        <PawMesh progressRef={progressRef} reduced={reduced} />
      </Canvas>
    </div>
  );
}
