import { Config } from './../../../model/entitiesImplems/config.model';
import { Color3, Color4, MeshBuilder, Scene, Vector3 } from '@babylonjs/core';
import { Curve3, LinesMesh } from '@babylonjs/core';
import { GradientMaterial } from '@babylonjs/materials';
import { Building3D } from './building3D';

export class Link3D {
    scene: Scene;

    src: Building3D;
    dest: Building3D
    type: string;

    curve: Curve3;
    line: LinesMesh;

    force: boolean = false;

    constructor(src: Building3D, dest: Building3D, type: string, scene: Scene) {
        this.src = src;
        this.dest = dest;
        this.type = type;
        this.scene = scene;
    }

    render(config: Config) {
        this.curve = Curve3.CreateQuadraticBezier(this.src.top, this.src.top.add(new Vector3(0, (this.src.top.y + this.dest.top.y) / 2, 0)), this.dest.top, 25);

        let colors: Color4[] = [];
        let start = Color4.FromColor3(Color3.Red()); // default value
        let end = Color4.FromColor3(Color3.Black()); // darkens with distance

        if (config.link.colors) {
            for (let c of config.link.colors) {
                let done = false;
                if (c.name == this.type) {
                    start = Color4.FromColor3(Color3.FromHexString(c.color));
                    done = true;
                }
                if(done) break;
            }
        }

        for (let i = 0; i < this.curve.getPoints().length; i++) {
                colors.push(Color4.Lerp(start, end, i/this.curve.getPoints().length));
        }

        this.line = MeshBuilder.CreateLines("curve", { points: this.curve.getPoints(), colors: colors }, this.scene);
        this.line.visibility = 0; // defaults at hidden
        
        // this.line = MeshBuilder.CreateLines("curve", {points: this.curve.getPoints()}, this.scene);
        // this.line.visibility = 0; // defaults at hidden
        // if(config.link.colors) {
        //     for(let c of config.link.colors) {
        //         if(c.name == this.type) {
        //             this.line.color = Color3.FromHexString(c.color);
        //             return;
        //         }
        //     }
        // }
    }

    // hide(force?: boolean) {
    //     if(force) this.force = false;
    //     if(!this.force) this.line.visibility = 0;
    // }

    display(force?: boolean) {
        if (force) this.force = !this.force;
        if (!this.force && this.line.visibility == 1) {
            this.line.visibility = 0;
        } else {
            this.line.visibility = 1;
        }
        // this.line.visibility = 1;
    }
}