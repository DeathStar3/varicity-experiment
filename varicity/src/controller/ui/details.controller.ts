import { Building3D } from './../../view/common/3Delements/building3D';

export class DetailsController {

    static displayObjectInfo(obj: Building3D) {
        let parent = document.getElementById("nodes_details");
        parent.innerHTML = "Object details";

        let elementDetails = document.createElement("div");
        parent.appendChild(elementDetails);

        this.populateChildren(obj.elementModel, elementDetails);

        this.showChildrenOnClick(parent);
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

    private static populateChildren(obj: any, parent: HTMLElement) {
        if (Array.isArray(obj)) {
            for (let key of obj) {
                if ((obj[key] == undefined)) { // key is a value
                    this.createEntry(key, parent)
                } else {
                    throw new Error('Not yet implemented');
                }
            }
        } else {
            for (let key in obj) {
                if (!(obj[key] instanceof Object)) { // value of key isn't an object
                    let text: string;
                    console.log(text);
                    text = key + ': ' + obj[key];
                    this.createEntry(text, parent);
                } else {
                    let p = this.createEntry(key + ' :', parent);
                    this.populateChildren(obj[key], p);

                    this.showChildrenOnClick(p);
                }
            }
        }
    }
}