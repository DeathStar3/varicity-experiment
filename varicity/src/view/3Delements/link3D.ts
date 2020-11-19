import { Color3, MeshBuilder, Scene, Vector3 } from '@babylonjs/core';
import { Curve3, LinesMesh } from '@babylonjs/core';
import { Building3D } from './building3D';

export class Link3D {
    scene: Scene;

    src: Building3D;
    dest: Building3D
    type: string;

    curve: Curve3;
    line: LinesMesh;

    constructor(src: Building3D, dest: Building3D, type: string, scene: Scene) {
        this.src = src;
        this.dest = dest;
        this.type = type;
    }

    render(config: any) {
        this.curve = Curve3.CreateQuadraticBezier(this.src.top, this.src.top.add(new Vector3(0, (this.src.top.y + this.dest.top.y) / 2, 0)), this.dest.top, 25);
        this.line = MeshBuilder.CreateLines("curve", {points: this.curve.getPoints()}, this.scene);
        if(config.link.colors) {
            for(let c of config.link.colors) {
                if(c.name == this.type) {
                    this.line.color = Color3.FromHexString(c.color);
                    return;
                }
            }
        }
    }
}