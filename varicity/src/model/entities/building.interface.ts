import { Vector3 } from '@babylonjs/core';
export interface Building {
    width: number;
    height: number;

    name: string;

    links: Building[];

    center: Vector3;
    bot: Vector3;
    top: Vector3;

    linkTo(destination: Building);
    locate(center: Vector3, bot: Vector3, top: Vector3);
}