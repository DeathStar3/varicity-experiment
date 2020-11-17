import { Scene } from '@babylonjs/core';
import { Mesh, MeshBuilder, Vector3 } from '@babylonjs/core';
import { District } from '../../model/entities/district.interface';

export class District3D {
    d3element: District;

    constructor(scene: Scene) {
        var quartier: Mesh = MeshBuilder.CreateBox("package", {height: 20, width: 300, depth: 300}, scene);
        quartier.setPositionWithLocalVector(new Vector3(0, -20, 0));
    }
}