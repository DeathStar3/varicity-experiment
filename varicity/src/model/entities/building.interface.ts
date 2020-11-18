import { Vector3 } from '@babylonjs/core';
export interface Building {
    width: number;
    height: number;

    name: string;

    center: Vector3;
    bot: Vector3;
    top: Vector3;

    locate(center: Vector3, bot: Vector3, top: Vector3);
}