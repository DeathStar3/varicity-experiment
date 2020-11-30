import { Config } from './../../../model/entitiesImplems/config.model';
import { Mesh } from "@babylonjs/core";

export interface Element3D {

    d3Model: Mesh;

    padding: number;

    getWidth(): number;

    getLength(): number;

    build(config?: Config): void;

    place(x: number, z:number, orientationX?: number, orientationZ?: number): void;

    render(config: Config): void;
}