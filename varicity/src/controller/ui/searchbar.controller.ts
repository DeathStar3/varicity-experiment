import { Building3D } from './../../view/common/3Delements/building3D';

export class SearchbarController {
    private static map: Map<string, Building3D>;

    public static initMap() {
        this.map = new Map<string, Building3D>();

        /* @ts-ignore */
        let searchbar: HTMLInputElement = document.getElementById("searchbar");
        searchbar.style.display = "block";
        searchbar.setAttribute("previous", "");

        let datalist = document.createElement("datalist");
        datalist.id = "datalist";

        searchbar.appendChild(datalist);
        searchbar.setAttribute("list", "datalist");

        searchbar.addEventListener("keydown", (ev) => {
            if (ev.key === "Enter") {
                // recherche and destroy
                if (searchbar.placeholder === "" && !this.map.has(searchbar.value)) { // the search key doesn't exist 
                    searchbar.style.backgroundColor = "red";
                } else {
                    if (this.map.has(searchbar.value)) { // we take the value because it exists
                        this.map.get(searchbar.value).focus();
                    } else { // we take the placeholder
                        this.map.get(searchbar.placeholder).focus();
                    }
                    searchbar.style.backgroundColor = "";
                    return;
                }
            } else {
                for (let [k, v] of this.map) {
                    if (k.includes(searchbar.value)) {
                        searchbar.placeholder = k;
                        searchbar.style.backgroundColor = "";
                        searchbar.setAttribute("previous", k);

                        // NOT YET IMPLEMENTED : HIGHLIGHTS BUILDING OF NAME BEING TYPED
                        let prev = searchbar.getAttribute("previous");
                        if (prev != "" && this.map.has(prev)) {
                            // this.map.get(prev).highlight(false);
                        }
                        // v.highlight(true);
                        return;
                    }
                }
                searchbar.placeholder = "";
                searchbar.style.backgroundColor = "red";
            }
        });
    }

    public static emptyMap() {
        this.map.clear();

        let datalist = document.getElementById("datalist");

        while (datalist.firstChild) {
            datalist.removeChild(datalist.lastChild);
        }
    }

    public static addEntry(key: string, building: Building3D) {
        this.map.set(key, building);

        let datalist = document.getElementById("datalist");
        let option = document.createElement("option");
        option.innerHTML = key;
        datalist.appendChild(option);
    }
}