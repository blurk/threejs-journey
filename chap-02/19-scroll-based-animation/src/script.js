import * as THREE from "three";
import GUI from "lil-gui";
import gsap from "gsap";

/**
 * Debug
 */
const gui = new GUI();

const parameters = {
  materialColor: "#ffeded",
};

gui.addColor(parameters, "materialColor").onChange(() => {
  material.color.set(parameters.materialColor);
  particlesMaterial.color.set(parameters.materialColor);
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/textures/gradients/3.jpg");
texture.magFilter = THREE.NearestFilter;

// Scene
const scene = new THREE.Scene();

const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: texture,
});

const objectsDistance = 4;

const meshes = [
  new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material),
  new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material),
  new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material),
];

meshes.forEach((m, index) => {
  m.position.y = -objectsDistance * index;
  m.position.x = index % 2 === 0 ? 2 : -2;
});

scene.add(...meshes);

const particlesCount = 2000;
const positions = new Float32Array(particlesCount * 3);

const particlesMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  size: 0.03,
});
const particlesGeometry = new THREE.BufferGeometry();

for (let i = 0; i < particlesCount; i++) {
  const i3 = i * 3;

  positions[i3 + 0] = (Math.random() - 0.5) * 10;
  positions[i3 + 1] =
    objectsDistance * 0.5 - Math.random() * objectsDistance * meshes.length;
  positions[i3 + 2] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

const particles = new THREE.Points(particlesGeometry, particlesMaterial);

scene.add(particles);

const light = new THREE.DirectionalLight("#fff", 3);
light.position.set(1, 1, 0);
scene.add(light);

/**
 * Sizes
 */
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

/**
 * Camera
 */

const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;

  const newSection = Math.round(scrollY / sizes.height);

  if (newSection !== currentSection) {
    currentSection = newSection;

    gsap.to(meshes[currentSection].rotation, {
      duration: 1.5,
      ease: "power2.inOut",
      y: "+=5",
      x: "+=3",
      z: "+=1",
    });

    const colorFrom = new THREE.Color("#fe0011");

    gsap.from(meshes[currentSection].material.color, {
      duration: 1.5,
      ease: "power2.inOut",
      r: colorFrom.r,
      g: colorFrom.g,
      b: colorFrom.b,
    });
  }
});

const cursor = { x: 0, y: 0 };
window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let prevTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - prevTime;
  prevTime = elapsedTime;

  camera.position.y = (-scrollY / sizes.height) * objectsDistance;

  const parallaxX = cursor.x * 0.5;
  const parallaxY = -cursor.y * 0.5;

  // Move the camera
  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

  for (const mesh of meshes) {
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.2;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
