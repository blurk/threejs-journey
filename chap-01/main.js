import * as THREE from "three";

const canvas = document.getElementById("canvas");

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);

const material = new THREE.MeshBasicMaterial(
  /** @type {import("three").MeshBasicMaterialParameters} */
  { color: "red", wireframe: false }
);
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0.7, -0.6, 1);
mesh.scale.set(2, 0.5, 0.5);
// Change rotation order
mesh.rotation.reorder("YXZ");
mesh.rotation.x = Math.PI * 0.25;
mesh.rotation.y = Math.PI * 0.25;
// scene.add(mesh);

const axisHelper = new THREE.AxesHelper(3);
scene.add(axisHelper);

const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
cube2.position.x = 2;

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
cube3.position.x = -2;

group.add(cube1, cube2, cube3);

const sizes = {
  width: 800,
  height: 600,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 7;
scene.add(camera);

// camera.lookAt(mesh.position);

const renderer = new THREE.WebGLRenderer(
  /** @type {import("three").WebGLRendererParameters} */ { canvas }
);

renderer.setSize(sizes.width, sizes.height);
group.position.y = 1;
group.scale.x = 2;
group.rotation.z = Math.PI * 0.25;
renderer.render(scene, camera);
