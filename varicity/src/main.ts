import { ClassesPackagesStrategy } from "./controller/parser/strategies/classes_packages.strategy";
import { SceneRenderer } from "./view/sceneRenderer";

let entities = new ClassesPackagesStrategy().parse("jfreechart-v1.5.0");
new SceneRenderer(entities);