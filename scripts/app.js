import * as THREE from "three";
import ThreeGlobe from "three-globe";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { createGlowMesh } from "three-glow-mesh";
import countries from "./data/globe.json";

import "../styles/app.css";

class Globe {
  constructor({ canvas }) {
    this.canvas = canvas;

    this.globe = null;

    this.init();
  }

  init() {
    this.initScene();
    this.addLights();
    this.addFog();
    this.initControls();
    this._initGlobe();
    requestAnimationFrame(this.render.bind(this));
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.light = new THREE.AmbientLight(0xbbbbbb, 0.3);
    this.scene.add(this.light);
    this.scene.background = new THREE.Color(0x040d21);

    this.camera = new THREE.PerspectiveCamera();
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antiAlias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  addLights() {
    this.dLight = new THREE.DirectionalLight(0xffffff, 0.8);
    this.dLight.position.set(-800, 2000, 400);
    this.camera.add(this.dLight);

    this.dLight1 = new THREE.DirectionalLight(0x7982f6, 1);
    this.dLight1.position.set(-200, 500, 200);
    this.camera.add(this.dLight1);

    this.dLight2 = new THREE.PointLight(0x8566cc, 0.5);
    this.dLight2.position.set(-200, 500, 200);
    this.camera.add(this.dLight2);

    this.dLight3 = new THREE.PointLight(0x8566cc, 0.5);
    this.dLight3.position.set(200, -500, 200);
    this.camera.add(this.dLight3);

    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 300;

    this.scene.add(this.camera);
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dynamicDampingFactor = 0.01;
    this.controls.enablePan = false;
    this.controls.minDistance = 300;
    this.controls.maxDistance = 300;
    this.controls.rotateSpeed = 0.8;
    this.controls.zoomSpeed = 1;
    this.controls.autoRotate = false;

    this.controls.minPolarAngle = Math.PI / 3.5;
    this.controls.maxPolarAngle = Math.PI - Math.PI / 3;
  }

  addFog() {
    this.fog = new THREE.Fog(0x535ef3, 400, 2000);
    this.scene.fog = this.fog;
  }

  _initGlobe() {
    this.globe = new ThreeGlobe({
      waitForGlobeReady: true,
      animateIn: true,
    });
    this.globe.hexPolygonsData(countries.features);
    this.globe.hexPolygonResolution(3);
    this.globe.hexPolygonMargin(0.65);
    this.globe.showAtmosphere(true);
    this.globe.atmosphereColor("#3a228a");
    this.globe.atmosphereAltitude(0.5);
    this.globeMaterial = this.globe.globeMaterial();
    this.globeMaterial.color = new THREE.Color(0x3a228a);
    this.globeMaterial.emissive = new THREE.Color(0x220038);
    this.globeMaterial.emissiveIntensity = 0.1;
    this.globeMaterial.shininess = 1;

    this.scene.add(this.globe);
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.controls.update();
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }
}

const canvas = document.querySelector("canvas");

const globe = new Globe({ canvas });

window.addEventListener("resize", () => {
  globe.resize();
});
