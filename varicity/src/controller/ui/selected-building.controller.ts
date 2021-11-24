import { Building } from "../../model/entities/building.interface";

export const SelectedBuildingController = {
    selected: [],
    selectABuilding: function(building: Building) {
        this.selected.push(building);
        this.display();
    },
    unselectABuilding: function (building: Building) {
        const idx = this.selected.indexOf(building);
        this.selected.splice(idx, 1);
        this.display();
    },
    display: function () {
        document.getElementById('selected_buildings').innerHTML = JSON.stringify(this.selected);
    }
}