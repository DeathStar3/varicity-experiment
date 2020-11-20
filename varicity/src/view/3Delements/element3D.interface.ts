import { Mesh } from "@babylonjs/core";

export interface Element3D {

    d3Model: Mesh;

    padding: number;

    getSize(): number;

    build();

    place(x: number, z:number);

    render(config: any);
}