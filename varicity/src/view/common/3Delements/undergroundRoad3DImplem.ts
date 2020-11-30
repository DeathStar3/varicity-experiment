import { Link3D } from './../3Dinterfaces/link3D.interface';
import { Config } from './../../../model/entitiesImplems/config.model';
import { Color3, Color4, Mesh, MeshBuilder, Scene, Vector3 } from '@babylonjs/core';
import { Curve3, LinesMesh } from '@babylonjs/core';
import { Building3D } from './building3D';

export class UndergroundRoad3DImplem implements Link3D {
    scene: Scene;

    src: Building3D;
    dest: Building3D
    type: string;

    mesh: Mesh;

    force: boolean = false;

    constructor(src: Building3D, dest: Building3D, type: string, scene: Scene) {
        this.src = src;
        this.dest = dest;
        this.type = type;
        this.scene = scene;
    }

    render(config: Config): void {
        throw new Error('Method not implemented.');
    }
    display(force?: boolean): void {
        throw new Error('Method not implemented.');
    }
}