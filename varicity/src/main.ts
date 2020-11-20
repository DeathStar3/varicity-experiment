import { ClassesPackagesStrategy } from "./controller/parser/strategies/classes_packages.strategy";
import { SceneRenderer } from "./view/sceneRenderer";
import {initializeUiComponents} from "./controller/ui/ui";

let entities = new ClassesPackagesStrategy().parse("jfreechart-v1.5.0");
initializeUiComponents();
new SceneRenderer(entities);