import './style.css'
import * as THREE from 'three'; //***
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { RGBELoader } from 'three/addons/loaders/RGBELoader';
import GUI from 'three/addons/libs/lil-gui.module.min.js';

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
    renderer.setClearColor(new THREE.Color("#2c3e50"));
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
      60, //화각
      width / height,
      0.1,
      100
    );
    camera.position.set(2,2,3.5);
    this._camera = camera;
  }

  _setupLight() { //광원
    const spotLight = new THREE.SpotLight(
      "#ffffff", 1, 100,THREE.MathUtils.degToRad(30),0.1,2);
    }
    /*const hemisphereLight = new THREE.HemisphereLight(0x0000ff, 0xaa1100, 0.7);
    this._scene.add(hemisphereLight);
  }
    /*const rgbeLoader = new RGBELoader();
    rgbeLoader.load("./christmas_photo_studio_03_4k.hdr", (env) => { //environment, poly heaven 검색
      env.mapping = THREE.EquirectangularReflectionMapping;
      this._scene.background = env;
      this._scene.environment = env;
      this._renderer.toneMapping = THREE.ReinhardToneMapping;
      this._renderer.toneMappingExposure = 0.8;
    });
  }
     */ 
  _setupControls() {
    this._controls = new OrbitControls(this._camera, this._renderer.domElement);
    this._controls.enableDamping = true;
  }
  

  _setupModel() { //mesh
    const axisHelper = new THREE.AxesHelper();
    this._scene.add(axisHelper); 
    
    const material = new THREE.MeshPhysicalMaterial({
      transmission: 0.8,
      color: "#030829",
      metalness: 0.9,
      roughness: 0.1, 
      ior: 1.33, 
      thickness: 0.01,
      sheen: 0.1, 
      sheenColor: "#ffffff",
      sheenRoughness: 0,});
      
    
    const geomGround = new THREE.PlaneGeometry(5,5);
    const ground = new THREE.Mesh(geomGround, material);
    this._scene.add(ground);
    ground.rotation.x = THREE.MathUtils.degToRad(-90);
    ground.position.y = -0.5;

    //반구
    const geomBigSphere = new THREE.SphereGeometry(1,32,16,0,THREE.MathUtils.degToRad(360),
    0,THREE.MathUtils.degToRad(90));
    const bigSphere = new THREE.Mesh(geomBigSphere, material);
    this._scene.add(bigSphere);
    bigSphere.position.y = -0.5;

    const geomSmallSphere = new THREE.SphereGeometry(0.2);
    const smallSphere = new THREE.Mesh(geomSmallSphere, material);
    const smallSpherePivot = new THREE.Object3D();
    bigSphere.add(smallSpherePivot);
    smallSpherePivot.add(smallSphere);
    smallSphere.position.x = 2;
    smallSphere.position.y = 0.5;

    this._smallSpherePivot = smallSpherePivot;
    const geomTorus = new THREE.TorusGeometry(0.3,0.1);

    const cntItems = 8;
    for (let i = 0; i < cntItems; i++) {
      const torus = new THREE.Mesh(geomTorus, material);
      const torusPivot = new THREE.Object3D();
      torusPivot.add(torus);
      bigSphere.add(torusPivot);
      torusPivot.rotation.y = THREE.MathUtils.degToRad(360) / cntItems * i;
      torus.position.set(2,0.5,0);
      
    }
  }
  
  update() {
    const delta = this._clock.getDelta();
    //this._bigSphere.rotation.y += delta;
    this._smallSpherePivot.rotation.y += delta;

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
