import { EvostreetImplem } from "../../view/evostreet/evostreetImplem";
import { MetricityImplem } from "../../view/metricity/metricityImplem";
import { ClassesPackagesStrategy } from "../parser/strategies/classes_packages.strategy";
import { VPVariantsInheritanceStrategy } from "../parser/strategies/vp_variants_inheritance.strategy";
import { UIController } from "./ui.controller";
import {EntitiesList} from "../../model/entitiesList";
import {FilesLoader} from "../parser/filesLoader";
import {ConfigLoader} from "../parser/configLoader";
import {VPVariantsCompositionStrategy} from "../parser/strategies/vp_variants_composition.strategy";

export class ProjectController {

    static el : EntitiesList;

    static createProjectSelector(keys: string[]) {
        let parent = document.getElementById("project_selector");
        parent.innerHTML = "Project selection";

        for (let key of keys) {
            let node = document.createElement("div");
            node.innerHTML = key;
            parent.appendChild(node);

            let childEvo = document.createElement("div");
            let childEvoComp = document.createElement("div");
            let childMetri = document.createElement("div");
            childEvo.innerHTML = "EvoStreets View - Inheritance";
            childEvoComp.innerHTML = "EvoStreets View - Composition";
            childMetri.innerHTML = "Metricity View";

            childEvo.className = "child";
            childEvoComp.className = "child";
            childMetri.className = "child";

            // projets en vision evostreet
            childEvo.addEventListener("click", (ev) => {
                if (UIController.scene) UIController.scene.dispose();
                UIController.clearMap();
                this.el = new VPVariantsInheritanceStrategy().parse(FilesLoader.loadDataFile(key), ConfigLoader.loadDataFile("config"));
                let inputElement = document.getElementById("comp-level") as HTMLInputElement;
                inputElement.min = "1";
                const maxLvl = this.el.getMaxCompLevel().toString();
                inputElement.max = maxLvl;
                inputElement.value = maxLvl;

                UIController.scene = new EvostreetImplem(UIController.config, this.el);
                UIController.scene.buildScene();
                parent.childNodes[0].nodeValue = "Project selection: " + key + " / " + childEvo.innerHTML;

                /* @ts-ignore */
                for (let child of parent.children) {
                    child.style.display = "none";
                }
            });

            childEvoComp.addEventListener("click", (ev) => {
                if (UIController.scene) UIController.scene.dispose();
                UIController.clearMap();
                this.el = new VPVariantsCompositionStrategy().parse(FilesLoader.loadDataFile(key), ConfigLoader.loadDataFile("config"));
                let inputElement = document.getElementById("comp-level") as HTMLInputElement;
                inputElement.min = "1";
                const maxLvl = this.el.getMaxCompLevel().toString();
                inputElement.max = maxLvl;
                inputElement.value = maxLvl;

                UIController.scene = new EvostreetImplem(UIController.config, this.el);
                UIController.scene.buildScene();
                parent.childNodes[0].nodeValue = "Project selection: " + key + " / " + childEvo.innerHTML;

                /* @ts-ignore */
                for (let child of parent.children) {
                    child.style.display = "none";
                }
            });

            // projets en vision metricity
            childMetri.addEventListener("click", (ev) => {
                if (UIController.scene) UIController.scene.dispose();
                UIController.clearMap();
                let entities = new ClassesPackagesStrategy().parse(FilesLoader.loadDataFile(key), ConfigLoader.loadDataFile("config"));
                UIController.scene = new MetricityImplem(UIController.config, entities);
                UIController.scene.buildScene();
                parent.childNodes[0].nodeValue = "Project selection: " + key + " / " + childMetri.innerHTML;

                /* @ts-ignore */
                for (let child of parent.children) {
                    child.style.display = "none";
                }
            });

            let filterButton = document.getElementById("filter-button") as HTMLButtonElement;
            filterButton.onclick = () => {
                if (UIController.scene) UIController.scene.dispose();
                UIController.clearMap();
                const lvl = +(document.getElementById("comp-level") as HTMLInputElement).value;
                let filteredEntities = this.el.filterCompLevel(lvl);
                UIController.scene = new EvostreetImplem(UIController.config, filteredEntities);
                UIController.scene.buildScene();
            }

            node.appendChild(childEvo);
            node.appendChild(childEvoComp);
            node.appendChild(childMetri);

            /* @ts-ignore */
            for (let child of node.children) {
                child.style.display = "none";
            }
            node.onclick = (me) => {
                if (me.target == node) {
                    /* @ts-ignore */
                    for (let child of node.children) {
                        if (child.style.display == "block") child.style.display = "none";
                        else child.style.display = "block";
                    }
                }
            }
        }

        /* @ts-ignore */
        for (let child of parent.children) {
            child.style.display = "none";
        }
        parent.onclick = (me) => {
            if (me.target == parent) {
                /* @ts-ignore */
                for (let child of parent.children) {
                    if (child.style.display == "block") child.style.display = "none";
                    else child.style.display = "block";
                }
            }
        }
    }

}