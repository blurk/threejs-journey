import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("#canvas");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const matcapTexture = textureLoader.load("/textures/matcaps/3.png");
matcapTexture.colorSpace = THREE.SRGBColorSpace;

// const axisHelper = new THREE.AxesHelper();
// scene.add(axisHelper);
/** @type {THREE.Mesh[]} */
let donuts = [];
const fontLoader = new FontLoader();
fontLoader.load(
  "/fonts/helvetiker_regular.typeface.json",
  function onLoad(font) {
    console.log("font loaded");
    const textGeometry = new TextGeometry("Wazzaap!", {
      font,
      size: 0.5,
      depth: 0.2,
      curveSegments: 5,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 4,
    });

    // textGeometry.computeBoundingBox();
    // bevelSize for x and y
    // bevelThichness for z
    // textGeometry.translate(
    //   -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
    //   -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
    //   -(textGeometry.boundingBox.max.z - 0.03) * 0.5
    // );

    textGeometry.center();

    // const textMaterial = new THREE.MeshBasicMaterial({
    //   wireframe: true,
    // });

    const material = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture,
    });
    const text = new THREE.Mesh(textGeometry, material);
    scene.add(text);

    const donutGeometry = new THREE.SphereGeometry(0.01, 32, 16);

    for (let i = 0; i < 1000; i++) {
      const donut = new THREE.Mesh(donutGeometry, material);
      donut.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );

      donut.rotateX(Math.random() * Math.PI);
      donut.rotateY(Math.random() * Math.PI);

      const scale = Math.random();
      donut.scale.set(scale, scale, scale);
      donuts.push(donut);
    }

    scene.add(...donuts);
  }
);

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

const SPEED = 0.0001;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  donuts.forEach((donut) => {
    donut.translateX(Math.random() * SPEED);
    donut.translateY(Math.random() * SPEED);
    donut.translateZ(Math.random() * SPEED);
  });

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
