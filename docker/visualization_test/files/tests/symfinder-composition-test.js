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

describe("Tests on composition's data added on", () => {

    beforeAll(async () => {
        await displayComposition("tests/data/compositionType.json", "tests/data/compositionTypeStats.json", []);
    });

    it('generated graph should contain two nodes', () => {
        //expect(d3.selectAll('circle').size()).toBe(7);
        expect(d3.select('circle[name = "foo.bar.Circle"]').empty()).toBeTruthy();

    });
    afterAll(resetPage);
});