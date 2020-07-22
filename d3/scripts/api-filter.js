
import {NodesFilter} from "./nodes-filter.js";


/**
 * This filter removes nodes being isolated, meaning that they are not linked to any other node.
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

    getFilterItem(filter) {
        return '' +
            '<li class="list-group-item-api d-flex justify-content-between align-items-center" id="' + filter + '" data-toggle="list-tab-api"\n' +
            '               role="list-tab-api" aria-controls="profile">'
            + filter +
            '<button type="button btn-dark" class="close" aria-label="Close">\n' +
            '  <span aria-hidden="true">&times;</span>\n' +
            '</button>' +
            '</li>';
    }



    getLinksListWithMatchingFilter(listToFilter){
        return listToFilter.filter(l => this.filtersList.some(filter => NodesFilter.matchesFilter(l.source, filter)) || this.filtersList.some(filter => NodesFilter.matchesFilter(l.target, filter)))
    }

    getNodesListWithMatchingFilter(listToFilter){
        return listToFilter.filter(n => this.filtersList.some(filter => NodesFilter.matchesFilter(n.name, filter)))
    }



}

export {ApiFilter};