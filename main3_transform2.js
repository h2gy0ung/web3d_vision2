import './style.css'
import * as THREE from 'three'; //***
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class App {
  constructor() {
    console.log("Hello three.js");

    this._setupThreejs();
    this._setupCamera();
    this._setupLight();
    this._setupModel();
    //this.render(); //없어도 됨
    this._setupEvent();
    this._setupControls();

  }

  _setupThreejs() {
    const divContainer = document.querySelector("#app");
    this._divContainer = divContainer;

    let renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(new THREE.Color("#004179"));
    renderer.setPixelRatio(window.devicePixelRatio);
    divContainer.appendChild(renderer.domElement);

    this._renderer = renderer;
    const scene = new THREE.Scene();
    this._scene = scene;
  }

  _setupCamera() { //카메라
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      100
    );
    camera.position.z = (10,20,30);
    this._camera = camera;
  }

  _setupLight() { //광원
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-1, 2, 4);
    this._scene.add(directionalLight);
  }

  _setupControls() {
    this._controls = new OrbitControls(this._camera, this._renderer.domElement);
    this._controls.enableDamping = true;
    
  }

  _setupModel() { 
    const geomSun = new THREE.SphereGeometry(3);
    const matSun = new THREE.MeshStandardMaterial({color: "yellow",flatShading: true});
    const sun = new THREE.Mesh(geomSun, matSun);
    this._scene.add(sun); //부모 자식 관계
    this._sun = sun;

    const axisSun = new THREE.AxesHelper(5);
    this._sun.add(axisSun);

    const geomEarth = new THREE.SphereGeometry(1);
    const matEarth = new THREE.MeshStandardMaterial({color: "blue",flatShading: true});
    const earth = new THREE.Mesh(geomEarth, matEarth);
    sun.add(earth);
    this._earth = earth;
    earth.position.x = 10;

    const geomMoon = new THREE.SphereGeometry(0.3,4,2);
    const matMoon = new THREE.MeshStandardMaterial({color: "gray",flatShading: true});
    const moon = new THREE.Mesh(geomMoon, matMoon);
    earth.add(moon);
    this._moon = moon;
    moon.position.x = 2;
  }
  
  update() {
    const delta = this._clock.getDelta();
    this._sun.rotation.y += delta; //자전
    this._earth.rotation.y += delta; //자전
    this._moon.rotation.y += delta; //공전
    //this._controls.update();
  }

  render() {
    this.update();
    this._renderer.render(this._scene, this._camera);
    requestAnimationFrame(this.render.bind(this));
  }

  _setupEvent() {
    window.addEventListener("resize", this.resize.bind(this));
    this._clock = new THREE.Clock();
    this.resize();
  }

  resize() {

    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    
    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize(width, height);
    this.render();
  }
}

const app = new App();
