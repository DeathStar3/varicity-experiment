import { UIController } from './controller/ui/ui.controller';
import { ConfigLoader } from './controller/parser/configLoader';
import { EvostreetImplem } from './view/evostreet/evostreetImplem';
import { MetricityImplem } from './view/metricity/metricityImplem';
import { FilesLoader } from './controller/parser/filesLoader';
import { ClassesPackagesStrategy } from "./controller/parser/strategies/classes_packages.strategy";
import { VPVariantsStrategy } from "./controller/parser/strategies/vp_variants.strategy";
import { SceneRenderer } from './view/sceneRenderer';

class Main {

    constructor() {
        let keys = FilesLoader.getAllFilenames();
        let evoParent = document.getElementById("evostreet");
        let metricityParent = document.getElementById("metricity");

        let config = ConfigLoader.loadDataFile("config");

        // UIController.createHeader();
        UIController.createRightSideConsole(config);
        // UIController.createFooter();

        for (let key of keys) {
            let childEvo = document.createElement("div");
            let childMetri = document.createElement("div");
            childEvo.innerHTML = key;
            childMetri.innerHTML = key;

            // projets en vision evostreet
            childEvo.addEventListener("click", (ev) => {
                if (UIController.scene) UIController.scene.dispose();
                let entities = new VPVariantsStrategy().parse(key);
                UIController.scene = new EvostreetImplem(config, entities);
                UIController.scene.buildScene();
            });

            // projets en vision metricity
            childMetri.addEventListener("click", (ev) => {
                if (UIController.scene) UIController.scene.dispose();
                let entities = new ClassesPackagesStrategy().parse(key);
                UIController.scene = new MetricityImplem(config, entities);
                UIController.scene.buildScene();
            });

            evoParent.appendChild(childEvo);
            metricityParent.appendChild(childMetri);
        }
    }
}
new Main();