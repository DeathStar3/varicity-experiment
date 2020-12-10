import { ParsingStrategy } from './../parser/strategies/parsing.strategy.interface';
import { EvostreetImplem } from "../../view/evostreet/evostreetImplem";
import { MetricityImplem } from "../../view/metricity/metricityImplem";
import { ClassesPackagesStrategy } from "../parser/strategies/classes_packages.strategy";
import { VPVariantsInheritanceStrategy } from "../parser/strategies/vp_variants_inheritance.strategy";
import { UIController } from "./ui.controller";
import {EntitiesList} from "../../model/entitiesList";
import {FilesLoader} from "../parser/filesLoader";
import {ConfigLoader} from "../parser/configLoader";
import {VPVariantsCompositionStrategy} from "../parser/strategies/vp_variants_composition.strategy";
import {Config} from "../../model/entitiesImplems/config.model";
import {VPVariantsStrategy} from "../parser/strategies/vp_variants.strategy";

export class ProjectController {

    static el : EntitiesList;
    private static previousParser: ParsingStrategy;
    private static filename: string;
    private static compLevel: number = 0;

    static createProjectSelector(keys: string[]) {
        let parent = document.getElementById("project_selector");
        parent.innerHTML = "Project selection";

        for (let key of keys) {
            let node = document.createElement("div");
            node.innerHTML = key;
            parent.appendChild(node);

            let childEvo = document.createElement("div");
            let childMetri = document.createElement("div");
            childEvo.innerHTML = "EvoStreets View";
            childMetri.innerHTML = "Metricity View";

            childEvo.className = "child";
            childMetri.className = "child";

            // projets en vision evostreet
            childEvo.addEventListener("click", () => {
                if (UIController.scene) UIController.scene.dispose();
                UIController.clearMap();
                this.previousParser = new VPVariantsStrategy();
                this.filename = key;
                this.el = this.previousParser.parse(FilesLoader.loadDataFile(key), UIController.config);
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
                let entities = new ClassesPackagesStrategy().parse(FilesLoader.loadDataFile(key), UIController.config);
                this.compLevel = -1;
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
                this.compLevel = lvl;
                let filteredEntities = this.el.filterCompLevel(lvl);
                UIController.scene = new EvostreetImplem(UIController.config, filteredEntities);
                UIController.scene.buildScene();
            }

            const x = (document.getElementById("hierarchy-select") as HTMLSelectElement).value;
            UIController.config.parsing_mode = x;

            let hierarchySelect = document.getElementById("hierarchy-select") as HTMLSelectElement;
            hierarchySelect.onchange = () => {
                const x = (document.getElementById("hierarchy-select") as HTMLSelectElement).value;
                UIController.changeConfig(["parsing_mode"], ["", x]);
            }

            node.appendChild(childEvo);
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

    public static reParse() {
        if (UIController.scene) UIController.scene.dispose();
        UIController.clearMap();
        this.el = this.previousParser.parse(FilesLoader.loadDataFile(this.filename), UIController.config);
        if(this.compLevel > -1) this.el.filterCompLevel(this.compLevel);
        UIController.scene = new EvostreetImplem(UIController.config, this.el);
        UIController.scene.buildScene();
    }
}