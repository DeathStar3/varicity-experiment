import { Mesh } from "@babylonjs/core";

export interface Element3D {

    d3Model: Mesh;

    padding: number;

    getWidth(): number;

    getLength(): number;

    build(config?: any);

    place(x: number, z:number);

    render(config: any);
}