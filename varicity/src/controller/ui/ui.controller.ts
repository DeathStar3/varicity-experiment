import { Scene } from '@babylonjs/core';
import { Config } from '../../model/entitiesImplems/config.model';
import { SceneRenderer } from '../../view/sceneRenderer';
import { ConfigController } from './config.controller';

export class UIController {

    public static scene: SceneRenderer;

    public static createHeader(): void {

    }

    public static createRightSideConsole(config: Config): void {
        ConfigController.createConfigFolder(config);
    }

    public static createFooter(): void {

    }
}