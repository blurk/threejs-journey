import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import GUI from "lil-gui";

/**
 * Base
 */

// Canvas
const canvas = document.querySelector("#canvas");

// Scene
const scene = new THREE.Scene();

const axisHelper = new THREE.AxesHelper();
scene.add(axisHelper);

/**
 * Lights
 */
const lightAmbient = new THREE.AmbientLight(0xffffff, 1);
// scene.add(lightAmbient);

const lightDirectional = new THREE.DirectionalLight(0xffff00, 0.9);
lightDirectional.position.set(1, 0.25, 0);
// scene.add(lightDirectional);
// const lightDirectionalHelper = new THREE.DirectionalLightHelper(
//   lightDirectional,
//   0.2
// );
// scene.add(lightDirectionalHelper);

const lightHemisphere = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.9);
// scene.add(lightHemisphere);
// const lightHemisphereHelper = new THREE.HemisphereLightHelper(
//   lightHemisphere,
//   0.2
// );
// scene.add(lightHemisphereHelper);

const lightPoint = new THREE.PointLight(0xff9000, 1.5, 2, 2);
lightPoint.position.set(1, -0.5, 1);
// scene.add(lightPoint);
// const lightPointHelper = new THREE.PointLightHelper(lightPoint, 0.2);
// scene.add(lightPointHelper);

const lightRectArea = new THREE.RectAreaLight(0x4e00ff, 6, 1, 1);
lightRectArea.position.set(-1.5, 0, 1.5);
lightRectArea.lookAt(new THREE.Vector3());
scene.add(lightRectArea);
const lightRectAreaHelper = new RectAreaLightHelper(lightRectArea);
scene.add(lightRectAreaHelper);

const lightSpot = new THREE.SpotLight(0x78ff00, 4.5, 10, Math.PI * 0.1, 1, 1);
lightSpot.position.set(0, 2, 3);
// scene.add(lightSpot);
// lightSpot.target.position.x = -0.5;
// scene.add(lightSpot.target);

// const lightSpotHelper = new THREE.SpotLightHelper(lightSpot);
// scene.add(lightSpotHelper);

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

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

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

// Debug
const gui = new GUI();

gui.add(lightAmbient, "intensity").min(0).max(3).step(0.001);
