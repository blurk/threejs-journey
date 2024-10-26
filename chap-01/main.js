import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";
import GUI from "lil-gui";

const gui = new GUI({
  width: 314,
  title: "Debug",
  closeFolders: true,
});

// gui.close();
// gui.hide();

const debugObject = {};

// Cursor
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (e) => {
  const { clientX, clientY } = e;
  cursor.x = clientX / sizes.width - 0.5;
  cursor.y = (clientY / sizes.height - 0.5) * -1;
});

const canvas = document.getElementById("canvas");

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1, 4, 4, 4);

// const bufferGeometry = new THREE.BufferGeometry();
// const count = 5000;
// const positionsArray = new Float32Array(count * 3 * 3);

// for (let i = 0; i < positionsArray.length; i += 1) {
//   positionsArray[i] = Math.random() * Math.PI;
// }

// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);

// bufferGeometry.setAttribute("position", positionsAttribute);

debugObject.color = "#349edf";
const material = new THREE.MeshBasicMaterial({
  color: debugObject.color,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
// const mesh = new THREE.Mesh(bufferGeometry, material);
// mesh.position.set(0.7, -0.6, 1);
// mesh.scale.set(2, 0.5, 0.5);
// Change rotation order
// mesh.rotation.reorder("YXZ");
// mesh.rotation.x = Math.PI * 0.25;
// mesh.rotation.y = Math.PI * 0.25;
scene.add(mesh);

const axisHelper = new THREE.AxesHelper(3);
scene.add(axisHelper);

const group = new THREE.Group();
// scene.add(group);

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
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   100
// );
// camera.position.x = 2;
// camera.position.y = 2;
camera.position.z = 2;
scene.add(camera);

// camera.lookAt(mesh.position);

const renderer = new THREE.WebGLRenderer(
  /** @type {import("three").WebGLRendererParameters} */ { canvas }
);

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.render(scene, camera);

const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // group.rotation.y = elapsedTime * Math.PI * 2;
  // camera.position.y = Math.sin(elapsedTime);
  // camera.position.x = Math.cos(elapsedTime);

  mesh.rotation.y = elapsedTime;
};

const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;

const updateCamera = () => {
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  // camera.position.y = cursor.y * 6;
  // camera.lookAt(mesh.position);

  orbitControls.update();
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

const loop = (...fns) => {
  fns.forEach((fn) => {
    fn();
  });

  renderer.render(scene, camera);

  window.requestAnimationFrame(() => loop(...fns));
};

loop(updateCamera);

// gsap.to(group.position, {
//   x: 2,
//   duration: 1,
//   delay: 1,
// });

const guiPosition = gui.addFolder("Position");

guiPosition.add(mesh.position, "x").min(-3).max(3).step(0.01);
guiPosition.add(mesh.position, "y").min(-3).max(3).step(0.01);
guiPosition.add(mesh.position, "z").min(-3).max(3).step(0.01);

gui.add(mesh.material, "wireframe");

debugObject.spin = () => {
  gsap.to(mesh.rotation, { duration: 4, y: mesh.rotation.y + Math.PI * 2 });
};

gui.addColor(debugObject, "color").onChange(function () {
  mesh.material.color.set(debugObject.color);
});

gui.add(debugObject, "spin");

debugObject.subdivision = 2;

gui
  .add(debugObject, "subdivision")
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange((value) => {
    mesh.geometry.dispose();
    mesh.geometry = new THREE.BoxGeometry(1, 1, 1, value, value, value);
  });
