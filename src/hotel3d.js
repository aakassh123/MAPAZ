import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class Hotel3DScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container #${containerId} not found`);
      return;
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.modelGroup = null;
    this.photoGroup = null;
    this.activeMode = 'model'; // 'model' (3D architectural model) or 'photo' (3D luxury photo view)
    this.currentLighting = 'day'; // 'day', 'sunset', 'night'
    this.isRotating = true;
    this.time = 0;
    this.hotspotMeshes = [];
    this.onHotspotSelected = null;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 640;
    const height = this.container.clientHeight || 560;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xdce7f3);
    this.scene.fog = new THREE.FogExp2(0xdce7f3, 0.005);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    // Angled perspective view matching the uploaded photo
    this.camera.position.set(16, 8, 42);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 4. Orbit Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 10, 0);
    this.controls.minDistance = 20;
    this.controls.maxDistance = 85;
    this.controls.maxPolarAngle = Math.PI / 2.02; // Keep camera above ground
    this.controls.minPolarAngle = Math.PI / 6;

    // 5. Lighting Setup
    this.setupLighting();

    // 6. Build the 3D Architectural Model (Matching uploaded building)
    this.build3DArchitecturalModel();

    // 7. Build the 3D Photo View Group
    this.build3DPhotoViewGroup();

    // 8. Setup Hotspots
    this.setupHotspots();

    // 9. Floating UI Mode Toggle (3D Model vs 3D Photo View)
    this.createFloatingModeToggle();

    // 10. Event Listeners
    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.container.addEventListener('mouseleave', this.onMouseLeave.bind(this));

    // Raycaster for clicking 3D hotspots
    this.setupRaycaster();

    // 11. Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLighting() {
    // Ambient
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    this.scene.add(this.ambientLight);

    // Main Sun Directional Light (angled from top-left like in the reference photo)
    this.sunLight = new THREE.DirectionalLight(0xfffaec, 2.6);
    this.sunLight.position.set(-28, 48, 32);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 140;
    this.sunLight.shadow.camera.left = -30;
    this.sunLight.shadow.camera.right = 30;
    this.sunLight.shadow.camera.top = 35;
    this.sunLight.shadow.camera.bottom = -15;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    // Soft sky fill light
    this.fillLight = new THREE.DirectionalLight(0xbad7f5, 1.1);
    this.fillLight.position.set(30, 25, 20);
    this.scene.add(this.fillLight);

    // Entrance warm spotlights (under canopy)
    this.canopySpotlights = [];
    const spotPositions = [-5, -1, 3, 7];
    spotPositions.forEach((x) => {
      const spot = new THREE.PointLight(0xffd57a, 2.8, 12);
      spot.position.set(x, 3.4, 15);
      this.scene.add(spot);
      this.canopySpotlights.push(spot);
    });

    // Circular door warm glow
    this.doorGlow = new THREE.PointLight(0xffc866, 3.5, 9);
    this.doorGlow.position.set(-3.5, 2.0, 13.5);
    this.scene.add(this.doorGlow);
  }

  build3DArchitecturalModel() {
    this.modelGroup = new THREE.Group();

    // Procedural Perforated White Metal Texture for the signature ribbons
    const ribbonCanvas = document.createElement('canvas');
    ribbonCanvas.width = 256;
    ribbonCanvas.height = 512;
    const rCtx = ribbonCanvas.getContext('2d');
    rCtx.fillStyle = '#f8f8f8';
    rCtx.fillRect(0, 0, 256, 512);

    // Laser-cut rectangular / dot perforation pattern
    rCtx.fillStyle = '#c8c8c8';
    const cols = 8;
    const rows = 32;
    const gapX = 256 / cols;
    const gapY = 512 / rows;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        rCtx.fillRect(i * gapX + 6, j * gapY + 4, gapX - 12, gapY - 8);
      }
    }
    const ribbonTexture = new THREE.CanvasTexture(ribbonCanvas);
    ribbonTexture.wrapS = THREE.RepeatWrapping;
    ribbonTexture.wrapT = THREE.RepeatWrapping;
    ribbonTexture.repeat.set(1, 4);

    // Materials
    const whiteRibbonMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.25,
      metalness: 0.15,
      bumpMap: ribbonTexture,
      bumpScale: 0.04,
    });

    const sideWallMat = new THREE.MeshStandardMaterial({
      color: 0xeeece6, // Warm light beige/white
      roughness: 0.65,
      metalness: 0.05,
    });

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x141f2d,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.88,
    });

    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0x2b2e35, // Dark anthracite
      roughness: 0.35,
      metalness: 0.6,
    });

    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.25,
    });

    const pavingMat = new THREE.MeshStandardMaterial({
      color: 0xc8c3b7,
      roughness: 0.7,
      metalness: 0.1,
    });

    // -----------------------------------------------------------------
    // 1. FORECOURT DRIVEWAY & STREET
    // -----------------------------------------------------------------
    const streetGeo = new THREE.PlaneGeometry(90, 80);
    const streetMat = new THREE.MeshStandardMaterial({ color: 0x82848c, roughness: 0.8 });
    const street = new THREE.Mesh(streetGeo, streetMat);
    street.rotation.x = -Math.PI / 2;
    street.position.set(0, -0.05, 10);
    street.receiveShadow = true;
    this.modelGroup.add(street);

    // Paved Forecourt (Light stone tiles)
    const plazaGeo = new THREE.PlaneGeometry(36, 26);
    const plaza = new THREE.Mesh(plazaGeo, pavingMat);
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.set(-2, 0.01, 19);
    plaza.receiveShadow = true;
    this.modelGroup.add(plaza);

    // -----------------------------------------------------------------
    // 2. MAIN BUILDING MASS (4.5 Stories)
    // -----------------------------------------------------------------
    const bWidth = 20;
    const bHeight = 22;
    const bDepth = 24;

    // Concrete core structure
    const coreGeo = new THREE.BoxGeometry(bWidth, bHeight, bDepth);
    const core = new THREE.Mesh(coreGeo, sideWallMat);
    core.position.set(0, bHeight / 2, 0);
    core.castShadow = true;
    core.receiveShadow = true;
    this.modelGroup.add(core);

    // -----------------------------------------------------------------
    // 3. FRONT GLASS CURTAIN WALL (Floors 1 to 4)
    // -----------------------------------------------------------------
    const glassWidth = bWidth - 0.4;
    const glassHeight = 17;
    const glassGeo = new THREE.BoxGeometry(glassWidth, glassHeight, 0.3);
    const glassFacade = new THREE.Mesh(glassGeo, glassMat);
    glassFacade.position.set(0, 4.2 + glassHeight / 2, bDepth / 2 + 0.1);
    this.modelGroup.add(glassFacade);

    // Warm Interior Floors & Curtains visible through glass
    for (let f = 1; f <= 3; f++) {
      const fy = 4.2 + f * 4.4;
      const slabGeo = new THREE.BoxGeometry(bWidth - 1, 0.35, 6);
      const slabMat = new THREE.MeshStandardMaterial({ color: 0xffe2a4, emissive: 0x553e1a, emissiveIntensity: 0.3 });
      const slab = new THREE.Mesh(slabGeo, slabMat);
      slab.position.set(0, fy, bDepth / 2 - 2.8);
      this.modelGroup.add(slab);

      // Warm interior room light
      const roomLight = new THREE.PointLight(0xffdf99, 1.4, 10);
      roomLight.position.set((f % 2 === 0 ? 3 : -3), fy + 1.8, bDepth / 2 - 2);
      this.modelGroup.add(roomLight);
    }

    // Black Steel Vertical Mullions on Glass
    const mullionCount = 5;
    const mullionSpacing = glassWidth / mullionCount;
    for (let m = 0; m <= mullionCount; m++) {
      const mx = -glassWidth / 2 + m * mullionSpacing;
      const mGeo = new THREE.BoxGeometry(0.18, glassHeight, 0.4);
      const mMesh = new THREE.Mesh(mGeo, canopyMat);
      mMesh.position.set(mx, 4.2 + glassHeight / 2, bDepth / 2 + 0.22);
      this.modelGroup.add(mMesh);
    }

    // -----------------------------------------------------------------
    // 4. SIGNATURE WHITE PARAMETRIC LASER-CUT SCREEN / RIBBONS
    // -----------------------------------------------------------------
    // These match the angled geometric branching ribbons from the photo
    const ribbons = [
      // Left vertical ribbon
      { x1: -8.8, y1: 4.2, z1: bDepth / 2 + 0.8, x2: -8.8, y2: 24, z2: bDepth / 2 + 0.8, w: 1.4, d: 0.35, rotZ: 0 },
      // Left angled diagonal ribbon branching inwards
      { x1: -7.2, y1: 4.2, z1: bDepth / 2 + 0.9, x2: -5.6, y2: 24, z2: bDepth / 2 + 0.9, w: 1.6, d: 0.4, rotZ: 0.07 },
      // Center vertical-leaning ribbon
      { x1: -3.8, y1: 4.2, z1: bDepth / 2 + 1.1, x2: -2.6, y2: 24, z2: bDepth / 2 + 1.1, w: 1.8, d: 0.45, rotZ: -0.05 },
      // Center-right diagonal branching truss ribbon
      { x1: 2.2, y1: 4.2, z1: bDepth / 2 + 1.1, x2: 4.4, y2: 24, z2: bDepth / 2 + 1.1, w: 1.9, d: 0.45, rotZ: 0.1 },
      // Far right ribbon
      { x1: 7.8, y1: 4.2, z1: bDepth / 2 + 0.9, x2: 8.8, y2: 24, z2: bDepth / 2 + 0.9, w: 1.5, d: 0.4, rotZ: 0.04 },
    ];

    ribbons.forEach((r) => {
      const h = r.y2 - r.y1;
      const rGeo = new THREE.BoxGeometry(r.w, h, r.d);
      const rMesh = new THREE.Mesh(rGeo, whiteRibbonMat);
      rMesh.position.set((r.x1 + r.x2) / 2, (r.y1 + r.y2) / 2, (r.z1 + r.z2) / 2);
      rMesh.rotation.z = r.rotZ;
      rMesh.castShadow = true;
      this.modelGroup.add(rMesh);

      // Rooftop fold-over caps (ribbons bend onto roof framing like in photo)
      const capGeo = new THREE.BoxGeometry(r.w, 0.4, 4.5);
      const capMesh = new THREE.Mesh(capGeo, whiteRibbonMat);
      capMesh.position.set(r.x2, r.y2 + 0.2, bDepth / 2 - 2.25);
      this.modelGroup.add(capMesh);
    });

    // Angled cross-bracing diagonal ribs (V-shaped branch motifs across facade)
    const diagRibs = [
      { x: -5.5, y: 13, len: 10, rotZ: Math.PI / 4 },
      { x: 3.5, y: 13, len: 11, rotZ: -Math.PI / 4.2 },
      { x: 5.8, y: 9, len: 8, rotZ: Math.PI / 5 },
    ];
    diagRibs.forEach((dr) => {
      const dGeo = new THREE.BoxGeometry(1.2, dr.len, 0.35);
      const dMesh = new THREE.Mesh(dGeo, whiteRibbonMat);
      dMesh.position.set(dr.x, dr.y, bDepth / 2 + 0.95);
      dMesh.rotation.z = dr.rotZ;
      dMesh.castShadow = true;
      this.modelGroup.add(dMesh);
    });

    // Side Facade (East Wall) Diagonal Relief Motif (Matching the photo!)
    const sideDiagGeo = new THREE.BoxGeometry(0.3, 16, 1.2);
    const sideDiag1 = new THREE.Mesh(sideDiagGeo, whiteRibbonMat);
    sideDiag1.position.set(bWidth / 2 + 0.16, 11, 4);
    sideDiag1.rotation.x = Math.PI / 6;
    this.modelGroup.add(sideDiag1);

    const sideDiag2 = new THREE.Mesh(sideDiagGeo, whiteRibbonMat);
    sideDiag2.position.set(bWidth / 2 + 0.16, 13, -2);
    sideDiag2.rotation.x = -Math.PI / 6;
    this.modelGroup.add(sideDiag2);

    // -----------------------------------------------------------------
    // 5. CANTILEVERED ENTRANCE CANOPY (Dark Grey / Anthracite)
    // -----------------------------------------------------------------
    const canopyWidth = bWidth + 0.8;
    const canopyDepth = 5.6;
    const canopyHeight = 0.85;
    const canopyElevation = 3.9;

    const canopyGeo = new THREE.BoxGeometry(canopyWidth, canopyHeight, canopyDepth);
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(0, canopyElevation, bDepth / 2 + canopyDepth / 2 - 0.5);
    canopy.castShadow = true;
    this.modelGroup.add(canopy);

    // Support pillars on sides
    [-canopyWidth / 2 + 0.8, canopyWidth / 2 - 0.8].forEach((px) => {
      const pilGeo = new THREE.BoxGeometry(0.5, canopyElevation, 0.5);
      const pil = new THREE.Mesh(pilGeo, canopyMat);
      pil.position.set(px, canopyElevation / 2, bDepth / 2 + canopyDepth - 1.2);
      pil.castShadow = true;
      this.modelGroup.add(pil);
    });

    // -----------------------------------------------------------------
    // 6. ICONIC CIRCULAR ENTRANCE DOUBLE DOOR (Ground Floor)
    // -----------------------------------------------------------------
    // Outer Stone Wall Portal
    const portalGeo = new THREE.BoxGeometry(6.4, 3.4, 0.4);
    const stoneWallMat = new THREE.MeshStandardMaterial({ color: 0x3d352e, roughness: 0.8 });
    const portal = new THREE.Mesh(portalGeo, stoneWallMat);
    portal.position.set(-3.5, 1.7, bDepth / 2 + 0.05);
    this.modelGroup.add(portal);

    // Circular Frame Ring
    const circleDoorRingGeo = new THREE.TorusGeometry(1.6, 0.14, 16, 48);
    const circleRingMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.4,
    });
    const circleRing = new THREE.Mesh(circleDoorRingGeo, circleRingMat);
    circleRing.position.set(-3.5, 1.7, bDepth / 2 + 0.3);
    this.modelGroup.add(circleRing);

    // Glowing Inner Glass Door Circle
    const doorGlassGeo = new THREE.CircleGeometry(1.5, 32);
    const doorGlassMat = new THREE.MeshStandardMaterial({
      color: 0xffe8b3,
      emissive: 0xffb84d,
      emissiveIntensity: 0.9,
      roughness: 0.1,
    });
    const doorGlass = new THREE.Mesh(doorGlassGeo, doorGlassMat);
    doorGlass.position.set(-3.5, 1.7, bDepth / 2 + 0.28);
    this.modelGroup.add(doorGlass);

    // Vertical Door Handles
    const handleGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.6, 12);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
    [-3.65, -3.35].forEach((hx) => {
      const handle = new THREE.Mesh(handleGeo, handleMat);
      handle.position.set(hx, 1.7, bDepth / 2 + 0.38);
      this.modelGroup.add(handle);
    });

    // Tiered Entrance Steps with Under-tread Warm LED Lighting
    const stepCount = 4;
    for (let s = 0; s < stepCount; s++) {
      const sw = 7.5 + s * 0.4;
      const sh = 0.22;
      const sd = 0.6;
      const stepGeo = new THREE.BoxGeometry(sw, sh, sd);
      const stepMat = new THREE.MeshStandardMaterial({ color: 0x484644, roughness: 0.5 });
      const step = new THREE.Mesh(stepGeo, stepMat);
      step.position.set(-3.5, s * sh + sh / 2, bDepth / 2 + 0.8 + s * sd);
      step.receiveShadow = true;
      this.modelGroup.add(step);

      // Warm LED strip under each step
      const ledGeo = new THREE.BoxGeometry(sw - 0.2, 0.04, 0.06);
      const ledMat = new THREE.MeshBasicMaterial({ color: 0xffdf80 });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(-3.5, s * sh + 0.02, bDepth / 2 + 0.8 + s * sd + sd / 2);
      this.modelGroup.add(led);
    }

    // -----------------------------------------------------------------
    // 7. ROOFTOP SKY GARDEN & TROPICAL TREES
    // -----------------------------------------------------------------
    // Rooftop floor slab
    const roofSlabGeo = new THREE.BoxGeometry(bWidth, 0.5, bDepth);
    const roofSlab = new THREE.Mesh(roofSlabGeo, sideWallMat);
    roofSlab.position.set(0, bHeight + 0.25, 0);
    this.modelGroup.add(roofSlab);

    // Rooftop glass balustrade
    const balustradeGeo = new THREE.BoxGeometry(bWidth - 1, 1.6, 0.15);
    const balustrade = new THREE.Mesh(balustradeGeo, glassMat);
    balustrade.position.set(0, bHeight + 1.2, bDepth / 2 - 0.2);
    this.modelGroup.add(balustrade);

    // 8 3D Tropical Trees & Plants on Rooftop
    const treePositions = [
      { x: -7.5, z: 9.5, s: 1.1 },
      { x: -5.0, z: 8.5, s: 1.35 },
      { x: -2.5, z: 9.2, s: 1.2 },
      { x: 0.5, z: 8.8, s: 1.4 },
      { x: 3.2, z: 9.5, s: 1.25 },
      { x: 5.8, z: 8.6, s: 1.3 },
      { x: 8.0, z: 9.2, s: 1.15 },
    ];

    treePositions.forEach((tp) => {
      const tree = this.buildRooftopPlant(tp.s);
      tree.position.set(tp.x, bHeight + 0.5, tp.z);
      this.modelGroup.add(tree);
    });

    // -----------------------------------------------------------------
    // 8. LUXURY SEDAN CAR (Parked in forecourt matching photo)
    // -----------------------------------------------------------------
    const car = this.buildSedanCar();
    car.position.set(3.8, 0.35, 19.5);
    car.rotation.y = -Math.PI / 8;
    this.modelGroup.add(car);

    // -----------------------------------------------------------------
    // 9. MODERN MINIMALIST STREET LAMP POST
    // -----------------------------------------------------------------
    const lampPost = this.buildStreetLamp();
    lampPost.position.set(1.5, 0, 22.5);
    this.modelGroup.add(lampPost);

    // Green shrubs next to entrance
    const shrubGeo = new THREE.DodecahedronGeometry(1.2, 1);
    const shrubMat = new THREE.MeshStandardMaterial({ color: 0x224c25, roughness: 0.8 });
    const shrub1 = new THREE.Mesh(shrubGeo, shrubMat);
    shrub1.position.set(1.2, 0.9, 14.8);
    this.modelGroup.add(shrub1);

    const shrub2 = new THREE.Mesh(shrubGeo, shrubMat);
    shrub2.scale.set(0.8, 0.8, 0.8);
    shrub2.position.set(2.2, 0.7, 15.5);
    this.modelGroup.add(shrub2);

    this.scene.add(this.modelGroup);
  }

  buildRooftopPlant(scale = 1.0) {
    const group = new THREE.Group();
    // Planter box
    const boxGeo = new THREE.BoxGeometry(1.2, 0.8, 1.2);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.6 });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.y = 0.4;
    group.add(box);

    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.08, 0.12, 1.4, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3b2c, roughness: 0.9 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.2;
    group.add(trunk);

    // Lush Foliage Canopy (Layers of green spheres/cones)
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x28592a,
      roughness: 0.65,
    });
    for (let l = 0; l < 4; l++) {
      const folGeo = new THREE.SphereGeometry(0.7 - l * 0.08, 8, 8);
      folGeo.scale(1.2, 0.8, 1.2);
      const fol = new THREE.Mesh(folGeo, leafMat);
      fol.position.set((Math.random() - 0.5) * 0.3, 1.8 + l * 0.5, (Math.random() - 0.5) * 0.3);
      group.add(fol);
    }

    group.scale.set(scale, scale, scale);
    return group;
  }

  buildSedanCar() {
    const car = new THREE.Group();

    // Body paint (Charcoal metallic matching photo)
    const paintMat = new THREE.MeshStandardMaterial({
      color: 0x3a3d42,
      roughness: 0.2,
      metalness: 0.85,
    });
    const bodyGeo = new THREE.BoxGeometry(2.3, 0.95, 4.8);
    const body = new THREE.Mesh(bodyGeo, paintMat);
    body.position.y = 0.55;
    body.castShadow = true;
    car.add(body);

    // Cabin
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x111622, roughness: 0.1, metalness: 0.9 });
    const cabinGeo = new THREE.BoxGeometry(2.0, 0.8, 2.6);
    const cabin = new THREE.Mesh(cabinGeo, glassMat);
    cabin.position.set(0, 1.25, -0.2);
    car.add(cabin);

    // Wheels
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x181818, roughness: 0.8 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, metalness: 0.9 });
    const wPositions = [
      { x: -1.15, z: 1.4 },
      { x: 1.15, z: 1.4 },
      { x: -1.15, z: -1.4 },
      { x: 1.15, z: -1.4 },
    ];
    wPositions.forEach((wp) => {
      const tireGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.3, 16);
      tireGeo.rotateZ(Math.PI / 2);
      const tire = new THREE.Mesh(tireGeo, tireMat);
      tire.position.set(wp.x, 0.42, wp.z);
      car.add(tire);

      const rimGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.32, 12);
      rimGeo.rotateZ(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.position.set(wp.x, 0.42, wp.z);
      car.add(rim);
    });

    // Red Tail Lights
    const tailMat = new THREE.MeshBasicMaterial({ color: 0xff1e1e });
    [-0.8, 0.8].forEach((tx) => {
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.08), tailMat);
      tail.position.set(tx, 0.65, 2.41);
      car.add(tail);
    });

    return car;
  }

  buildStreetLamp() {
    const lamp = new THREE.Group();
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });

    // Vertical post
    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 5.2, 12);
    const post = new THREE.Mesh(postGeo, whiteMat);
    post.position.y = 2.6;
    lamp.add(post);

    // Horizontal arm
    const armGeo = new THREE.BoxGeometry(1.2, 0.08, 0.08);
    const arm = new THREE.Mesh(armGeo, whiteMat);
    arm.position.set(0.5, 5.2, 0);
    lamp.add(arm);

    // Downlight head
    const headGeo = new THREE.BoxGeometry(0.8, 0.06, 0.18);
    const head = new THREE.Mesh(headGeo, whiteMat);
    head.position.set(0.7, 5.16, 0);
    lamp.add(head);

    return lamp;
  }

  build3DPhotoViewGroup() {
    // 3D Photo View Group: High-definition floating 3D plane with realistic specular sheen & smooth mouse parallax
    this.photoGroup = new THREE.Group();

    const textureLoader = new THREE.TextureLoader();
    const photoTex = textureLoader.load('/images/hotel-modern-building.jpg', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
    });

    // Elegant beveled floating panel
    const photoGeo = new THREE.PlaneGeometry(21, 31.5);
    const photoMat = new THREE.MeshStandardMaterial({
      map: photoTex,
      roughness: 0.25,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    const photoMesh = new THREE.Mesh(photoGeo, photoMat);
    photoMesh.position.set(0, 10, 0);
    this.photoGroup.add(photoMesh);

    // Luxury Golden Frame Backing
    const frameGeo = new THREE.BoxGeometry(21.8, 32.3, 0.5);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x1c1916,
      roughness: 0.35,
      metalness: 0.85,
    });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.set(0, 10, -0.3);
    this.photoGroup.add(frame);

    const goldBorderGeo = new THREE.BoxGeometry(22.2, 32.7, 0.15);
    const goldBorderMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.25,
      emissive: 0x554010,
      emissiveIntensity: 0.3,
    });
    const goldBorder = new THREE.Mesh(goldBorderGeo, goldBorderMat);
    goldBorder.position.set(0, 10, -0.4);
    this.photoGroup.add(goldBorder);

    // Initially hide photoGroup as modelGroup is active
    this.photoGroup.visible = false;
    this.scene.add(this.photoGroup);
  }

  createFloatingModeToggle() {
    // Inject floating mode switcher into the 3D canvas container
    const toggleDiv = document.createElement('div');
    toggleDiv.className = 'canvas-mode-toggle';
    toggleDiv.innerHTML = `
      <button class="mode-btn active" id="btn-mode-model">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        </svg>
        <span>3D Model</span>
      </button>
      <button class="mode-btn" id="btn-mode-photo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        <span>3D Photo</span>
      </button>
    `;
    this.container.appendChild(toggleDiv);

    const btnModel = toggleDiv.querySelector('#btn-mode-model');
    const btnPhoto = toggleDiv.querySelector('#btn-mode-photo');

    btnModel.addEventListener('click', () => {
      this.switchMode('model');
      btnModel.classList.add('active');
      btnPhoto.classList.remove('active');
    });

    btnPhoto.addEventListener('click', () => {
      this.switchMode('photo');
      btnPhoto.classList.add('active');
      btnModel.classList.remove('active');
    });
  }

  switchMode(mode) {
    this.activeMode = mode;
    if (mode === 'model') {
      this.modelGroup.visible = true;
      this.photoGroup.visible = false;
      this.controls.target.set(0, 10, 0);
      this.smoothMoveCamera({ x: 16, y: 8, z: 42 }, { x: 0, y: 10, z: 0 });
    } else {
      this.modelGroup.visible = false;
      this.photoGroup.visible = true;
      this.controls.target.set(0, 10, 0);
      this.smoothMoveCamera({ x: 0, y: 10, z: 38 }, { x: 0, y: 10, z: 0 });
    }
  }

  setupHotspots() {
    this.hotspotData = [
      {
        id: 'sky-garden',
        title: 'Lush Rooftop Sky Garden',
        desc: 'Panoramic open-air penthouse terrace surrounded by tropical greenery, private pergolas, and city skyline views.',
        pos: new THREE.Vector3(0, 23.5, 12),
        cameraTarget: { x: 4, y: 22, z: 26 },
      },
      {
        id: 'parametric-screen',
        title: 'Parametric Perforated Screen',
        desc: 'Signature laser-cut architectural brise-soleil ribbons providing dynamic geometric daylight shading and contemporary elegance.',
        pos: new THREE.Vector3(3.5, 14, 13.5),
        cameraTarget: { x: 6, y: 14, z: 28 },
      },
      {
        id: 'glass-suites',
        title: 'Panoramic Glass Suites',
        desc: 'Full-height acoustic glass walls, automated sheer drapes, plush King suites, and bespoke marble interiors.',
        pos: new THREE.Vector3(-4.5, 11, 13),
        cameraTarget: { x: -6, y: 12, z: 26 },
      },
      {
        id: 'circular-entrance',
        title: 'Iconic Circular Portico & Valet',
        desc: 'Signature circular pivot doors, illuminated cantilevered entrance canopy, warm stone cladding, and executive valet arrivals.',
        pos: new THREE.Vector3(-3.5, 2.5, 14.5),
        cameraTarget: { x: -3.5, y: 2.5, z: 24 },
      },
    ];

    this.hotspotMeshes = [];
    this.hotspotData.forEach((data) => {
      const pinGroup = new THREE.Group();
      pinGroup.position.copy(data.pos);

      // Core pulsing dot
      const dotGeo = new THREE.SphereGeometry(0.55, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0xffd45e });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      pinGroup.add(dot);

      // Outer ring
      const ringGeo = new THREE.RingGeometry(0.8, 1.1, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xd4af37,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      pinGroup.add(ring);

      pinGroup.userData = data;
      this.scene.add(pinGroup);
      this.hotspotMeshes.push(pinGroup);
    });
  }

  setupRaycaster() {
    this.raycaster = new THREE.Raycaster();
    this.mouseCoords = new THREE.Vector2();

    this.container.addEventListener('click', (e) => {
      // Ignore if clicking floating control buttons
      if (e.target.closest('.canvas-floating-controls') || e.target.closest('.canvas-mode-toggle')) {
        return;
      }

      const rect = this.container.getBoundingClientRect();
      this.mouseCoords.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouseCoords.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      this.raycaster.setFromCamera(this.mouseCoords, this.camera);
      const objectsToTest = [];
      if (this.hotspotMeshes) {
        this.hotspotMeshes.forEach((group) => {
          group.traverse((child) => {
            if (child.isMesh) objectsToTest.push(child);
          });
        });
      }

      const intersects = this.raycaster.intersectObjects(objectsToTest);
      if (intersects.length > 0) {
        let parent = intersects[0].object;
        while (parent && (!parent.userData || !parent.userData.id) && parent.parent) {
          parent = parent.parent;
        }
        if (parent && parent.userData && parent.userData.id) {
          const data = parent.userData;
          if (data.cameraTarget) {
            this.smoothMoveCamera(data.cameraTarget, { x: data.pos.x, y: data.pos.y, z: 0 });
          }
          if (this.onHotspotSelected) {
            this.onHotspotSelected(data);
          }
        }
      }
    });
  }

  // Camera Presets
  setCameraPreset(name) {
    if (!this.controls) return;
    this.isRotating = false;

    let targetPos, lookTarget;
    switch (name) {
      case 'facade':
      case 'front':
        targetPos = { x: 0, y: 10, z: 42 };
        lookTarget = { x: 0, y: 10, z: 0 };
        break;
      case 'aerial':
      case 'terrace':
        targetPos = { x: 5, y: 28, z: 34 };
        lookTarget = { x: 0, y: 20, z: 0 };
        break;
      case 'entrance':
      case 'portico':
        targetPos = { x: -3.5, y: 3.5, z: 25 };
        lookTarget = { x: -3.5, y: 2.5, z: 12 };
        break;
      case 'angle':
        targetPos = { x: 22, y: 10, z: 36 };
        lookTarget = { x: 0, y: 10, z: 0 };
        break;
      default:
        targetPos = { x: 16, y: 8, z: 42 };
        lookTarget = { x: 0, y: 10, z: 0 };
    }

    this.smoothMoveCamera(targetPos, lookTarget);
  }

  smoothMoveCamera(newPos, newLookAt) {
    const startPos = this.camera.position.clone();
    const startTarget = this.controls.target.clone();
    const endPos = new THREE.Vector3(newPos.x, newPos.y, newPos.z);
    const endTarget = new THREE.Vector3(newLookAt.x, newLookAt.y, newLookAt.z);

    const duration = 1000;
    const startTime = performance.now();

    const updateCam = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      this.camera.position.lerpVectors(startPos, endPos, ease);
      this.controls.target.lerpVectors(startTarget, endTarget, ease);
      this.controls.update();

      if (progress < 1) {
        requestAnimationFrame(updateCam);
      }
    };

    requestAnimationFrame(updateCam);
  }

  // Zoom controls (+ / -)
  zoomIn() {
    const factor = 0.84;
    const dir = new THREE.Vector3().subVectors(this.camera.position, this.controls.target);
    if (dir.length() * factor > this.controls.minDistance) {
      dir.multiplyScalar(factor);
      this.camera.position.copy(this.controls.target).add(dir);
      this.controls.update();
    }
  }

  zoomOut() {
    const factor = 1.16;
    const dir = new THREE.Vector3().subVectors(this.camera.position, this.controls.target);
    if (dir.length() * factor < this.controls.maxDistance) {
      dir.multiplyScalar(factor);
      this.camera.position.copy(this.controls.target).add(dir);
      this.controls.update();
    }
  }

  toggleAutoRotate() {
    this.isRotating = !this.isRotating;
    return this.isRotating;
  }

  // Lighting Mode Presets
  setLightingMode(mode) {
    this.currentLighting = mode;
    switch (mode) {
      case 'sunset':
        this.scene.background = new THREE.Color(0xf6af83);
        this.scene.fog.color = new THREE.Color(0xf6af83);
        this.ambientLight.color.setHex(0xff7744);
        this.ambientLight.intensity = 1.8;
        this.sunLight.color.setHex(0xff9944);
        this.sunLight.intensity = 3.4;
        this.sunLight.position.set(-36, 18, 16);
        this.fillLight.color.setHex(0x884466);
        this.canopySpotlights.forEach((s) => (s.intensity = 3.5));
        this.doorGlow.intensity = 4.0;
        break;
      case 'twilight':
      case 'night':
        this.scene.background = new THREE.Color(0x0e1424);
        this.scene.fog.color = new THREE.Color(0x0e1424);
        this.ambientLight.color.setHex(0x18243a);
        this.ambientLight.intensity = 0.9;
        this.sunLight.color.setHex(0x406090);
        this.sunLight.intensity = 1.2;
        this.sunLight.position.set(20, 35, 25);
        this.fillLight.color.setHex(0x1a2844);
        this.canopySpotlights.forEach((s) => (s.intensity = 5.5));
        this.doorGlow.intensity = 6.0;
        break;
      case 'day':
      default:
        this.scene.background = new THREE.Color(0xdce7f3);
        this.scene.fog.color = new THREE.Color(0xdce7f3);
        this.ambientLight.color.setHex(0xffffff);
        this.ambientLight.intensity = 1.3;
        this.sunLight.color.setHex(0xfffaec);
        this.sunLight.intensity = 2.6;
        this.sunLight.position.set(-28, 48, 32);
        this.fillLight.color.setHex(0xbad7f5);
        this.canopySpotlights.forEach((s) => (s.intensity = 2.8));
        this.doorGlow.intensity = 3.5;
        break;
    }
  }

  onMouseMove(e) {
    const rect = this.container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    this.mouse.targetX = x * 1.5;
    this.mouse.targetY = y * 1.0;
  }

  onMouseLeave() {
    this.mouse.targetX = 0;
    this.mouse.targetY = 0;
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.time += 0.018;

    // Smooth mouse parallax lerp
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // If in photo mode, apply subtle parallax tilt
    if (this.photoGroup && this.photoGroup.visible) {
      this.photoGroup.rotation.y = this.mouse.x * 0.08;
      this.photoGroup.rotation.x = -this.mouse.y * 0.06;
    }

    // Auto-rotation around target in 3D model mode
    if (this.isRotating && this.controls) {
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 0.55;
    } else if (this.controls) {
      this.controls.autoRotate = false;
    }

    this.controls.update();

    // Pulsing 3D Hotspot Rings
    if (this.hotspotMeshes) {
      this.hotspotMeshes.forEach((h, idx) => {
        const ring = h.children[1];
        if (ring) {
          ring.rotation.z += 0.025;
          const s = 1.0 + Math.sin(this.time * 3 + idx) * 0.18;
          ring.scale.set(s, s, s);
        }
      });
    }

    this.renderer.render(this.scene, this.camera);
  }
}
