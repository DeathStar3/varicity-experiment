import { Color } from '../../model/entities/config.interface';
import { Config } from '../../model/entitiesImplems/config.model';
import { SceneRenderer } from '../../view/sceneRenderer';
import { ConfigController } from './config.controller';

export class UIController {

    public static scene: SceneRenderer;
    public static config: Config;

    public static createHeader(): void {

    }

    public static createRightSideConsole(config: Config): void {
        this.config = config;
        ConfigController.createConfigFolder(config);
    }

    public static createFooter(): void {

    }

    public static changeConfig(arr: string[], value: [string, string] | Color) {
        Config.alterField(this.config, arr, value);
        if (this.scene) {
            this.scene = this.scene.rerender(this.config);
            this.scene.buildScene();
        }
        else {
            console.log("not initialized");
        }
    }
}