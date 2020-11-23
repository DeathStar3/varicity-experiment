import { FilesLoader } from './controller/parser/filesLoader';
import { ClassesPackagesStrategy } from "./controller/parser/strategies/classes_packages.strategy";
import { SceneRenderer } from "./view/sceneRenderer";
import {initializeUiComponents} from "./controller/ui/ui";

initializeUiComponents();
let keys = FilesLoader.getAllFilenames();
console.log(keys);
var documentProjectArray = document.getElementById("project_selector");
let scene: SceneRenderer;
for(let key of keys) {
    console.log(key);
    let child = document.createElement("div");
    child.innerHTML = key;
    child.addEventListener("click", (ev) => {
        let entities = new ClassesPackagesStrategy().parse("jfreechart-v1.5.0");
        scene = new SceneRenderer(entities);
    });
    documentProjectArray.appendChild(child);
}