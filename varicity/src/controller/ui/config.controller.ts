import { UIController } from './ui.controller';
import { Config } from './../../model/entitiesImplems/config.model';

export class ConfigController {
    public static createConfigFolder(config: Config): void {
        let node = document.getElementById("console");
        let configNode = document.createElement("div");
        configNode.id = "config";
        configNode.innerHTML = "Config parameters";
        node.appendChild(configNode);

        this.populateChildren(config, configNode);

        /* @ts-ignore */
        for (let child of configNode.children) {
            child.style.display = "none";
        }
        configNode.onclick = (me) => {
            if (me.target == configNode) {
                /* @ts-ignore */
                for (let child of configNode.children) {
                    if (child.style.display == "block") child.style.display = "none";
                    else child.style.display = "block";
                }
            }
        }
    }

    private static createKey(key: string, parent: HTMLElement): HTMLElement {
        let node = document.createElement("div");
        node.innerHTML = key;
        node.setAttribute("value", key);
        parent.appendChild(node);
        return node;
    }

    private static createInput(value: string, parent: HTMLElement): HTMLInputElement {
        let input = document.createElement("input");
        input.value = value;
        parent.appendChild(input);
        return input;
    }

    private static findValidParents(node: HTMLElement): string[] {
        let p = node.parentElement
        let arr = [p.getAttribute("value")];
        while (p.parentElement.id != "config") {
            p = p.parentElement;
            arr.push(p.getAttribute("value"));
        }
        return arr.reverse();
    }

    private static populateChildren(config: any, parent: HTMLElement): void {
        if (config instanceof Array) {
            for (let obj of config) {
                if (Config.instanceOfColor(obj)) {
                    let node = this.createKey(obj.name, parent);
                    let input = this.createInput(obj.color, node);

                    input.addEventListener("keyup", (ke) => {
                        if (ke.key == "Enter") {
                            let arr = this.findValidParents(node);
                            UIController.changeConfig(arr, { name: node.getAttribute("value"), color: input.value });
                        }
                    });
                } else this.populateChildren(obj, parent); // it's a string
            }
        }
        else {
            if (!(config instanceof Object)) {
                console.log(config);
                let input = this.createInput(config, parent);

                input.addEventListener("keyup", (ke) => {
                    if (ke.key == "Enter") {
                        if (input.value == "") {
                            parent.removeChild(input);
                        } else {
                            console.log(input.value);
                        }
                    }
                });
            }
            else {
                for (let key in config) {
                    let node = this.createKey(key, parent);
                    this.populateChildren(config[key], node);

                    /* @ts-ignore */
                    for (let child of node.children) {
                        child.style.display = "none";
                    }
                    node.onclick = (me) => {
                        if (me.target == node) {
                            /* @ts-ignore */
                            for (let child of node.children) {
                                if (child.style.display == "block") child.style.display = "none";
                                else child.style.display = "block";
                            }
                        }
                    }
                }
            }
        }
    }
}