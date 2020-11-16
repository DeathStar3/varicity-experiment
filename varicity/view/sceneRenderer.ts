import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, Color3, Curve3, Color4, StandardMaterial } from "@babylonjs/core";

class SceneRenderer {
    constructor() {
        // create the canvas html element and attach it to the webpage
        var canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        // initialize babylon scene and engine
        var engine: Engine = new Engine(canvas, true);
        var scene = new Scene(engine);

        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
        // var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);

        var quartier: Mesh = MeshBuilder.CreateBox("package", {height: 20, width: 300, depth: 300}, scene);
        quartier.setPositionWithLocalVector(new Vector3(0, -20, 0));
        for(let i =0; i<10; i++) {
            var building: Mesh = MeshBuilder.CreateBox("buildin"+i, { height: 20, width: 10, depth: 10 }, scene);
            building.setPositionWithLocalVector(new Vector3(30* i, 0, 0));
            building.renderOutline = true;
            building.outlineColor = new Color3(0, 1, 0);
            building.outlineWidth = 0.1;
            building.edgesColor = new Color4(1, 0, 0);
            var mat = new StandardMaterial("buildingMat"+i, scene);
            mat.ambientColor = new Color3(1, 0, 0);
            mat.diffuseColor = new Color3(1, 0, 0);
            mat.emissiveColor = new Color3(1, 0, 0);
            mat.specularColor = new Color3(1, 0, 0);
            building.material = mat;
            var curve = Curve3.CreateQuadraticBezier(new Vector3(30*i, 20, 10), new Vector3(30*i+15, 35, 10), new Vector3(30*(i+1), 20, 10), 25);
            MeshBuilder.CreateLines("curve"+i, {points: curve.getPoints()}, scene);
        }

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
            }
        });

        // run the main render loop
        engine.runRenderLoop(() => {
            scene.render();
        });
    }
}
new SceneRenderer();