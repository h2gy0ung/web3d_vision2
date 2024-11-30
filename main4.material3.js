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
    this._setupModel_map();
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
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load("./christmas_photo_studio_03_4k.hdr", (env) => { //environment, poly heaven 검색
      env.mapping = THREE.EquirectangularReflectionMapping;
      this._scene.background = env;
      this._scene.environment = env;
    });
  }

  _setupControls() {
    this._controls = new OrbitControls(this._camera, this._renderer.domElement);
    this._controls.enableDamping = true;
    
  }
//physics
  _setupModel_map() { //mesh
    
    const textureLoader = new THREE.TextureLoader();
    const map = textureLoader.load("./Glass_Window_002_basecolor.jpg");
    map.colorSpace = THREE.SRGBColorSpace;

    const mapMetalic = textureLoader.load("./Glass_Window_002_metallic.jpg");
    mapMetalic.colorSpace = THREE.NoColorSpace;

    const mapRoughness = textureLoader.load("./Glass_Window_002_roughness.jpg");
    mapRoughness.colorSpace = THREE.NoColorSpace;

    const mapNormal = textureLoader.load("./Glass_Window_002_normal.jpg");
    mapNormal.colorSpace = THREE.NoColorSpace;
    
    const mapHeight = textureLoader.load("./Glass_Window_002_height.png");
    mapHeight.colorSpace = THREE.NoColorSpace;
    
    const mapAO = textureLoader.load("./Glass_Window_002_ambientOcclusion.jpg");
    mapAO.colorSpace = THREE.NoColorSpace;
    
    const mapAlpha = textureLoader.load("./Glass_Window_002_opacity.jpg");
    mapAlpha.colorSpace = THREE.NoColorSpace;
    
    const material = new THREE.MeshStandardMaterial({map: map,
      metalnessMap: mapMetalic,
      roughnessMap: mapRoughness,
      
      normalMap: mapNormal, //노말맵
      aoMap: mapAO,
      aoMapIntensity: 1.5, //오클루전 강도
      alphaMap: mapAlpha,
      displacementMap: mapHeight, //돌출
      displacementScale: 0.1, //돌출 강도
      displacementBias: -0.08, //돌출 바이어스
    });
    const geomBox = new THREE.BoxGeometry(1,1,1,200,200,200);
    const box = new THREE.Mesh(geomBox, material);
    box.position.x = -0.7;
    this._scene.add(box);

    const geomSphere = new THREE.SphereGeometry(0.6,256,128);
    const sphere = new THREE.Mesh(geomSphere, material);
    sphere.position.x = 1;
    this._scene.add(sphere);


  }
  
  update() {
    const delta = this._clock.getDelta();
    //this._bigSphere.rotation.y += delta;
    //this._SpherePivot.rotation.y += delta;

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
