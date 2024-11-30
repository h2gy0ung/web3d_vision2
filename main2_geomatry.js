import './style.css'
import * as THREE from 'three'; //***
import { OrbitControls } from 'three/addons/controls/OrbitControls';

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
      75,
      width / height,
      0.1,
      100
    );
    camera.position.z = 3;
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

  _setupModel() { //mesh
    const geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 ); 
    const material = new THREE.MeshBasicMaterial( {color: 0xff5e30} ); 
    const cylinder = new THREE.Mesh( geometry, material ); 
    this._scene.add( cylinder );
    
    this._mesh = cylinder;

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
    const line = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), lineMaterial);

    this.line = line;

    const group = new THREE.Group();
    group.add(this._mesh);
    group.add(this.line);
    this._group = group;
    this._scene.add(group); 
  }
  
  update() {
    const delta = this._clock.getDelta();
    //this._group.rotation.y += delta; turn

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
