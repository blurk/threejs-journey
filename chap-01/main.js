import * as THREE from "three";

const canvas = document.getElementById("canvas");

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);

const material = new THREE.MeshBasicMaterial(
  /** @type {import("three").MeshBasicMaterialParameters} */
  { color: "red", wireframe: false }
);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const sizes = {
  width: 800,
  height: 600,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0, 1, 3);
scene.add(camera);

const renderer = new THREE.WebGLRenderer(
  /** @type {import("three").WebGLRendererParameters} */ { canvas }
);

renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);
