import * as THREE from "three";
import gsap from "gsap";

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
  new THREE.MeshBasicMaterial({ color: 0xffffff })
);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xffffff })
);
cube2.position.x = 1.2;

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xffffff })
);
cube3.position.x = -1.2;

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

renderer.render(scene, camera);

const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // group.rotation.y = elapsedTime * Math.PI * 2;
  // camera.position.y = Math.sin(elapsedTime);
  // camera.position.x = Math.cos(elapsedTime);

  // camera.lookAt(group.position);
};

const loop = (fn) => {
  fn();

  renderer.render(scene, camera);

  window.requestAnimationFrame(loop.bind(undefined, fn));
};

loop(animate);

gsap.to(group.position, {
  x: 2,
  duration: 1,
  delay: 1,
});

gsap.to(group.position, {
  x: 0,
  duration: 1,
  delay: 2,
});
