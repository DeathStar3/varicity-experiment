import { EvostreetImplem } from './view/evostreet/evostreetImplem';
import { MetricityImplem } from './view/metricity/metricityImplem';
import { FilesLoader } from './controller/parser/filesLoader';
import { ClassesPackagesStrategy } from "./controller/parser/strategies/classes_packages.strategy";
import { initializeUiComponents } from "./controller/ui/ui";
import { VPVariantsStrategy } from "./controller/parser/strategies/vp_variants.strategy";
import { SceneRenderer } from './view/sceneRenderer';

class Main {
    scene: SceneRenderer;

    constructor() {

        initializeUiComponents();

        let keys = FilesLoader.getAllFilenames();
        var evoParent = document.getElementById("evostreet");
        var metricityParent = document.getElementById("metricity");

        for (let key of keys) {
            let childEvo = document.createElement("div");
            let childMetri = document.createElement("div");
            childEvo.innerHTML = key;
            childMetri.innerHTML = key;

            // projets en vision evostreet
            childEvo.addEventListener("click", (ev) => {
                if (this.scene) this.scene.dispose();
                this.scene = new EvostreetImplem();
                let entities = new VPVariantsStrategy().parse(key);
                this.scene.buildScene(entities);
            });

            // projets en vision metricity
            childMetri.addEventListener("click", (ev) => {
                if (this.scene) this.scene.dispose();
                this.scene = new MetricityImplem();
                let entities = new ClassesPackagesStrategy().parse(key);
                this.scene.buildScene(entities);
            });

            evoParent.appendChild(childEvo);
            metricityParent.appendChild(childMetri);
        }
    }
}
new Main();