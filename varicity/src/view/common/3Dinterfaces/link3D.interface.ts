import { Config } from './../../../model/entitiesImplems/config.model';
import { Mesh, Scene } from '@babylonjs/core';
import { Building3D } from '../3Delements/building3D';

export interface Link3D {
    scene: Scene;

    src: Building3D;
    dest: Building3D
    type: string;

    mesh: Mesh;

    force: boolean;

    render(config: Config): void;

    display(force?: boolean): void;
}