/*
 * This file is part of symfinder.
 *
 * symfinder is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * symfinder is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with symfinder. If not, see <http://www.gnu.org/licenses/>.
 *
 * Copyright 2018-2019 Johann Mortara <johann.mortara@univ-cotedazur.fr>
 * Copyright 2018-2019 Xhevahire Tërnava <xhevahire.ternava@lip6.fr>
 * Copyright 2018-2019 Philippe Collet <philippe.collet@univ-cotedazur.fr>
 */

import {NodesFilter} from "./nodes-filter.js";


/**
 * This filter removes nodes which do not use a class of the API. Meaning that the graph will only show the API classes and other classes which use them.
 */
class ApiFilter extends NodesFilter {

    constructor(filterButtonSelector, filterInputSelector, filtersListSelector, nodeFilters, displayGraphFunction) {
        super(filterButtonSelector, filterInputSelector, filtersListSelector, nodeFilters, displayGraphFunction);
    }

    addFilterTitle(){
        console.log(this.filtersList);
        if(this.filtersList.length === 0) {
            $(this.filtersListSelector).append('<h5 id="apiFilterTitle" style="text-align: center; font-weight: bold">Api classes filtered</h5>');
        }
    }

    updateFiltersNumber(){
        document.getElementById('output').innerHTML = this.filtersList.length.toString();
    }

    addFilteringToButton() {
        $(this.filterButtonSelector).on('click', async e => {
            e.preventDefault();
            let input = $(this.filterInputSelector);
            let inputValue = input.val();
            var as = inputValue.split(',');
            input.val("");
            as.forEach(element=> this.addFilter(element.trim()));
            await this.displayGraphFunction();
        });
    }

    addCapacityToRemoveFilter(){
        $(document).on('click', "#close-api", async e => {
            e.preventDefault();
            let removedFilter = $(e.target.parentElement.parentElement).attr("id");
            //console.log(removedFilter);
            $(e.target.parentElement.parentElement).remove();
            this.removeValue(removedFilter);
            //this.removeFilterTitle();
            await this.displayGraphFunction();
        });
    }

    getFilterItem(filter) {
        return '' +
            '<li class="list-group-item d-flex justify-content-between align-items-center" id="' + filter + '" data-toggle="list"\n' +
            '               role="tab" aria-controls="profile">'
            + filter +
            '<button id="close-api" type="button btn-dark" class="close" aria-label="Close">\n' +
            '  <span aria-hidden="true">&times;</span>\n' +
            '</button>' +
            '</li>';
    }



    getLinksListWithMatchingFilter(listToFilter){
        return listToFilter.filter(l => this.filtersList.some(filter => NodesFilter.matchesFilter(l.source, filter)) || this.filtersList.some(filter => NodesFilter.matchesFilter(l.target, filter)))
    }

    getLinksListWithMatchingFilters(listToFilter, filters){
        return listToFilter.filter(l => filters.some(filter => NodesFilter.matchesFilter(l.source, filter)) || filters.some(filter => NodesFilter.matchesFilter(l.target, filter)))
    }

    getNodesListWithMatchingFilter(listToFilter){
        return listToFilter.filter(n => this.filtersList.some(filter => NodesFilter.matchesFilter(n.name, filter)))
    }

    /*getNodesListWithMatchingFilter(listToFilter, filters){
        return listToFilter.filter(n => filters.some(filter => NodesFilter.matchesFilter(n.name, filter)))
    }*/
}

export {ApiFilter};