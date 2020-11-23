import { FilesLoader } from './controller/parser/filesLoader';
import { ClassesPackagesStrategy } from "./controller/parser/strategies/classes_packages.strategy";
import { SceneRenderer } from "./view/sceneRenderer";
import { initializeUiComponents } from "./controller/ui/ui";

initializeUiComponents();
let keys = FilesLoader.getAllFilenames();
var documentProjectArray = document.getElementById("project_selector");
let scene: SceneRenderer = new SceneRenderer();
for (let key of keys) {
    let child = document.createElement("div");
    child.innerHTML = key;
    child.addEventListener("click", (ev) => {
        let entities = new ClassesPackagesStrategy().parse(key);
        scene.buildScene(entities);
    });
    documentProjectArray.appendChild(child);
}