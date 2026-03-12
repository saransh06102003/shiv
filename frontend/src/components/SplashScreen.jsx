import { useEffect, useRef } from "react";

function SplashScreen({ exiting = false }) {
  const canvasHostRef = useRef(null);

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return undefined;

    let cleanup = () => undefined;
    let cancelled = false;

    const initScene = async () => {
      let frameId = null;
      let renderer;

      try {
        const THREE = await import("three");
        if (cancelled || !host) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(32, host.clientWidth / host.clientHeight, 0.1, 100);
        camera.position.set(0, 0.36, 4.2);

        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        renderer.setSize(host.clientWidth, host.clientHeight);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        host.appendChild(renderer.domElement);

        const stage = new THREE.Group();
        scene.add(stage);

        const bottle = new THREE.Group();
        stage.add(bottle);

        const bottleGlassMaterial = new THREE.MeshPhysicalMaterial({
          color: "#f6acc4",
          roughness: 0.14,
          metalness: 0.06,
          clearcoat: 1,
          clearcoatRoughness: 0.08,
          transmission: 0.58,
          thickness: 1.1,
          ior: 1.34
        });

        const liquidMaterial = new THREE.MeshPhysicalMaterial({
          color: "#d84f86",
          roughness: 0.28,
          metalness: 0.1,
          clearcoat: 0.55,
          clearcoatRoughness: 0.2
        });

        const labelMaterial = new THREE.MeshStandardMaterial({
          color: "#fff6f6",
          roughness: 0.35,
          metalness: 0.08
        });

        const capMaterial = new THREE.MeshStandardMaterial({
          color: "#7e445d",
          roughness: 0.22,
          metalness: 0.25
        });

        const ringMaterial = new THREE.MeshStandardMaterial({
          color: "#d6b578",
          roughness: 0.18,
          metalness: 0.78
        });

        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.84, 0.78, 1.8, 64), bottleGlassMaterial);
        body.position.y = 0.05;
        bottle.add(body);

        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.48, 48), bottleGlassMaterial);
        neck.position.y = 1.18;
        bottle.add(neck);

        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.54, 0.72, 48), capMaterial);
        cap.position.y = 1.78;
        bottle.add(cap);

        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.04, 24, 60), ringMaterial);
        ring.position.y = 1.44;
        ring.rotation.x = Math.PI / 2;
        bottle.add(ring);

        const label = new THREE.Mesh(new THREE.CylinderGeometry(0.806, 0.768, 0.5, 64), labelMaterial);
        label.position.y = 0;
        bottle.add(label);

        const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.67, 0.7, 56), liquidMaterial);
        liquid.position.y = -0.48;
        bottle.add(liquid);

        const shadow = new THREE.Mesh(
          new THREE.CircleGeometry(1.45, 42),
          new THREE.MeshBasicMaterial({ color: "#35212c", transparent: true, opacity: 0.14 })
        );
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.set(0, -1.32, 0);
        stage.add(shadow);

        stage.add(new THREE.AmbientLight("#ffffff", 0.62));
        stage.add(new THREE.HemisphereLight("#fff3eb", "#f3cfe1", 0.72));

        const keyLight = new THREE.DirectionalLight("#fff6f1", 1.15);
        keyLight.position.set(2.6, 2.8, 3.2);
        stage.add(keyLight);

        const rimLight = new THREE.PointLight("#ffd8ef", 0.95, 12);
        rimLight.position.set(-2.2, 1.4, 2.1);
        stage.add(rimLight);

        const fillLight = new THREE.PointLight("#f5d7b7", 0.8, 10);
        fillLight.position.set(1.2, -0.8, 2.4);
        stage.add(fillLight);

        const clock = new THREE.Clock();
        const animate = () => {
          const t = clock.getElapsedTime();
          bottle.rotation.y = t * 0.48;
          bottle.rotation.z = Math.sin(t * 0.62) * 0.035;
          bottle.position.y = Math.sin(t * 1.35) * 0.1;
          stage.rotation.y = Math.sin(t * 0.2) * 0.07;

          shadow.material.opacity = 0.12 + (Math.cos(t * 1.35) + 1) * 0.02;
          const shadowScale = 1.03 - Math.sin(t * 1.35) * 0.04;
          shadow.scale.set(shadowScale, shadowScale, 1);

          renderer.render(scene, camera);
          frameId = window.requestAnimationFrame(animate);
        };

        const handleResize = () => {
          if (!host || !renderer) return;
          camera.aspect = host.clientWidth / host.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(host.clientWidth, host.clientHeight);
        };

        animate();
        window.addEventListener("resize", handleResize);

        cleanup = () => {
          window.removeEventListener("resize", handleResize);
          if (frameId) window.cancelAnimationFrame(frameId);

          scene.traverse((node) => {
            if (node.geometry) node.geometry.dispose();
            if (node.material) {
              if (Array.isArray(node.material)) node.material.forEach((mat) => mat.dispose());
              else node.material.dispose();
            }
          });

          renderer.dispose();
          renderer.forceContextLoss();
          if (host.contains(renderer.domElement)) {
            host.removeChild(renderer.domElement);
          }
        };
      } catch (_error) {
        if (renderer) renderer.dispose();
      }
    };

    initScene();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[120] overflow-hidden bg-[radial-gradient(circle_at_20%_10%,rgba(255,220,232,0.78),transparent_48%),radial-gradient(circle_at_80%_18%,rgba(255,232,206,0.7),transparent_45%),linear-gradient(150deg,#fffaf6_0%,#ffeef6_48%,#fff5ea_100%)] transition-opacity duration-500 ${
        exiting ? "opacity-0" : "opacity-100"
      }`}
      aria-label="SkinMatch splash screen"
    >
      <div className="pointer-events-none absolute -left-16 top-20 h-44 w-44 rounded-full bg-rose-200/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-28 h-56 w-56 rounded-full bg-amber-100/55 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        <div className="splash-canvas h-[280px] w-[280px] sm:h-[360px] sm:w-[360px]" ref={canvasHostRef} />

        <div className="splash-logo text-center">
          <p className="font-serif text-4xl font-semibold tracking-tight text-skin-ink sm:text-5xl">SkinMatch</p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-rose-700/65">
            Beauty Discovery
          </p>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;
