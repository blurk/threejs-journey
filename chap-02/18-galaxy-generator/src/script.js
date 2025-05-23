import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI({
  width: 360,
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const parameters = {
  count: 100000,
  size: 0.01,
  radius: 5,
  branches: 3,
  spin: 3,
  randomness: 0.2,
  randomnessPower: 4,
  insideColor: "#FF9944",
  outsideColor: "#00BB66",
};

gui.add(parameters, "count").min(100).max(1_000_000).step(100);
gui.add(parameters, "size").min(0.001).max(0.1).step(0.001);
gui.add(parameters, "radius").min(0.01).max(20).step(0.01);
gui.add(parameters, "branches").min(2).max(20).step(1);
gui.add(parameters, "spin").min(-5).max(5).step(0.001);
gui.add(parameters, "randomness").min(0).max(2).step(0.001);
gui.add(parameters, "randomnessPower").min(1).max(10).step(0.001);
gui.addColor(parameters, "insideColor");
gui.addColor(parameters, "outsideColor");

let geometry = null;
let material = null;
let points = null;

const generateGalaxy = () => {
  if (points) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }
  /**
   * Geometry
   */
  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  const colorIn = new THREE.Color(parameters.insideColor);
  const colorOut = new THREE.Color(parameters.outsideColor);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    const radius = Math.random() * parameters.radius;
    const spinAngle = radius * parameters.spin;

    // use modulo so branchAngle never reaches parameter.branches (3 means branchAngle always be 0,1,2)
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() > 0.5 ? -1 : 1);
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() > 0.5 ? -1 : 1);
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() > 0.5 ? -1 : 1);

    positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX; // X
    positions[i3 + 1] = randomY; // Y
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ; // Z

    const mixedColor = colorIn.clone();
    mixedColor.lerp(colorOut, radius / parameters.radius);

    colors[i3 + 0] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  /**
   * Material
   */

  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: true,
    vertexColors: true,
  });

  points = new THREE.Points(geometry, material);
  scene.add(points);
};

generateGalaxy();

gui.onFinishChange(generateGalaxy);

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
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
