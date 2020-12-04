import { UIController } from './ui.controller';
import { Animation, Vector3 } from '@babylonjs/core';
import { Building3D } from './../../view/common/3Delements/building3D';

export class DetailsController {

    static displayObjectInfo(obj: Building3D) {
        let parent = document.getElementById("nodes_details");
        parent.innerHTML = "Object details";

        // Display the model
        let elementDetails = document.createElement("div");
        elementDetails.innerHTML = "Model:";
        parent.appendChild(elementDetails);

        this.populateChildren(obj.elementModel, elementDetails);

        // Display the links
        let linksDetails = document.createElement("div");
        linksDetails.innerHTML = "Links:";
        parent.appendChild(linksDetails);

        this.populateLinks(obj, linksDetails);

        this.showChildrenOnClick(elementDetails);
    }

    private static showChildrenOnClick(parent: HTMLElement) {
        /* @ts-ignore */
        for (let child of parent.children) {
            child.style.display = "block";
        }
        parent.onclick = (me) => {
            if (me.target == parent) {
                /* @ts-ignore */
                for (let child of parent.children) {
                    if (child.style.display == "block") child.style.display = "none";
                    else child.style.display = "block";
                }
            }
        }
    }

    private static createEntry(textContent: string, parent: HTMLElement): HTMLElement {
        let el = document.createElement("div");
        el.innerHTML = textContent;
        parent.appendChild(el);
        return el;
    }

    private static populateLinks(obj: Building3D, parent: HTMLElement) {
        for (let l of obj.links) {
            let keyElement = document.getElementById(l.type);
            if (keyElement == undefined) { // we check if we have already declared him
                keyElement = document.createElement("div");
                keyElement.id = l.type;
                keyElement.innerHTML = l.type + ':';
                keyElement.className = "parent";
                parent.appendChild(keyElement);
            }
            let listElement = document.createElement("div");
            let target = (l.src.getName() == obj.getName() ? l.dest : l.src);
            listElement.innerHTML = target.getName();
            listElement.className = "child";
            keyElement.appendChild(listElement);

            listElement.addEventListener("mouseenter", () => {
                target.highlight(true);
            });

            listElement.addEventListener("mouseleave", () => {
                target.highlight(false);
            });

            listElement.addEventListener("click", () => {
                // var ease = new CubicEase();
                // ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
                let cam = UIController.scene.camera;
                cam.focusOn([target.d3Model], true);
                // Animation.CreateAndStartAnimation("an1", cam, "position", 60, 60, cam.position, target.center);
                // Animation.CreateAndStartAnimation("an2", cam, "alpha", 60, 60, cam.alpha, 2 * Math.PI / 3);
                // Animation.CreateAndStartAnimation("an3", cam, "beta", 60, 60, cam.beta, Math.PI / 3);
                // Animation.CreateAndStartAnimation("an4", cam, "radius", 60, 60, cam.radius, 500);
                // 2 * Math.PI / 3, Math.PI / 3, 1000, // alpha, beta, radius
                // cam.position = Vector3.Lerp(cam.position, target.center, 1);
            });
        }
    }

    private static populateChildren(obj: any, parent: HTMLElement) {
        if (Array.isArray(obj)) {
            for (let key of obj) {
                if ((obj[key] == undefined)) { // key is a value
                    this.createEntry(key, parent).className = "child";
                } else {
                    throw new Error('Not yet implemented');
                }
            }
        } else {
            for (let key in obj) {
                if (!(obj[key] instanceof Object)) { // value of key isn't an object
                    let text: string;
                    text = key + ': ' + obj[key];
                    this.createEntry(text, parent).className = "parent";
                } else {
                    let p = this.createEntry(key + ' :', parent);
                    p.className = "parent";
                    this.populateChildren(obj[key], p);

                    this.showChildrenOnClick(p);
                }
            }
        }
    }
}