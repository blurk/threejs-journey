import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const canvas = document.querySelector("#canvas");

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();

const textureDoorColor = textureLoader.load("/textures/door/color.jpg");
const textureDoorAlpha = textureLoader.load("/textures/door/alpha.jpg");
const textureDoorHeight = textureLoader.load("/textures/door/height.jpg");
const textureDoorNormal = textureLoader.load("/textures/door/normal.jpg");
const textureDoorAmbientOcclusion = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const textureDoorMetalness = textureLoader.load("/textures/door/metalness.jpg");
const textureDoorRoughness = textureLoader.load("/textures/door/roughness.jpg");

const textureMatcaps1 = textureLoader.load("/textures/matcaps/1.png");
const textureGradients3 = textureLoader.load("/textures/gradients/3.jpg");
const textureGradients5 = textureLoader.load("/textures/gradients/5.jpg");

textureDoorColor.colorSpace = THREE.SRGBColorSpace;
textureMatcaps1.colorSpace = THREE.SRGBColorSpace;

// Basic
// const material = new THREE.MeshBasicMaterial();
// material.map = textureDoorColor;
// material.wireframe = true;
// material.transparent = true;
// material.opacity = 0.2;
// material.alphaMap = textureDoorAlpha;
// material.side = THREE.DoubleSide;

// Normal
// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;
// material.map = textureDoorNormal;

// Matcap
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = textureMatcaps1;

// Depth
// const material = new THREE.MeshDepthMaterial();

// Lambert
// const material = new THREE.MeshLambertMaterial();

// Phong
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100
// material.specular = new THREE.Color(0x1188ff);

// Toon
// const material = new THREE.MeshToonMaterial();
// textureGradients5.minFilter = THREE.NearestFilter;

// textureGradients5.magFilter = THREE.NearestFilter;
// textureGradients5.generateMipmaps = false;
// material.gradientMap = textureGradients5;

// Standard
// const material = new THREE.MeshStandardMaterial();
// material.metalness = 1;
// material.roughness = 1;
// material.map = textureDoorColor;
// material.aoMap = textureDoorAmbientOcclusion;
// material.aoMapIntensity = 1;
// material.displacementMap = textureDoorHeight;
// material.displacementScale = 0.1;
// material.metalnessMap = textureDoorMetalness;
// material.roughnessMap = textureDoorRoughness;
// material.normalMap = textureDoorNormal;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = textureDoorAlpha;

const material = new THREE.MeshPhysicalMaterial();
material.metalness = 1;
material.roughness = 1;
// material.map = textureDoorColor;
// material.aoMap = textureDoorAmbientOcclusion;
// material.aoMapIntensity = 1;
// material.displacementMap = textureDoorHeight;
// material.displacementScale = 0.1;
// material.metalnessMap = textureDoorMetalness;
// material.roughnessMap = textureDoorRoughness;
// material.normalMap = textureDoorNormal;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = textureDoorAlpha;

// material.clearcoat = 1;
// material.clearcoatRoughness = 0;

// material.sheen = 1;
// material.sheenRoughness = 0.25;
// material.sheenColor.set(1, 1, 1);

// material.iridescence = 1;
// material.iridescenceIOR = 1;
// material.iridescenceThicknessRange = [100, 300];

material.transmission = 1;
material.ior = 1.5;
material.thickness = 0.5;

// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 30);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// scene.add(pointLight);

const rgbeLoader = new RGBELoader();
rgbeLoader.load("/textures/environmentMap/2k.hdr", (envMap) => {
  envMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = envMap;
  scene.environment = envMap;
});

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.position.x = 1.5;

scene.add(sphere, plane, torus);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = -0.1 * elapsedTime;
  plane.rotation.x = -0.1 * elapsedTime;
  torus.rotation.x = -0.1 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

const gui = new GUI({
  width: 314,
  title: "Debug",
  closeFolders: false,
});

gui.add(material, "roughness").min(0).max(1).step(0.0001);
gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "aoMapIntensity").min(0).max(1).step(0.0001);
gui.add(material, "displacementScale").min(0).max(1).step(0.0001);

gui.add(material, "clearcoat").min(0).max(1).step(0.0001);
gui.add(material, "clearcoatRoughness").min(0).max(1).step(0.0001);

gui.add(material, "sheen").min(0).max(1).step(0.0001);
gui.add(material, "sheenRoughness").min(0).max(1).step(0.0001);
gui.addColor(material, "sheenColor");

gui.add(material, "iridescence").min(0).max(1).step(0.0001);
gui.add(material, "iridescenceIOR").min(1).max(2.3333).step(0.0001);
gui.add(material.iridescenceThicknessRange, "0").min(1).max(1000).step(1);
gui.add(material.iridescenceThicknessRange, "1").min(1).max(1000).step(1);

gui.add(material, "transmission").min(0).max(1).step(0.0001);
gui.add(material, "ior").min(1).max(10).step(0.0001);
gui.add(material, "thickness").min(0).max(1).step(0.0001);
