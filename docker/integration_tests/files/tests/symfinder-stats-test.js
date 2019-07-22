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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with symfinder.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Copyright 2018-2019 Johann Mortara <johann.mortara@etu.univ-cotedazur.fr>
 * Copyright 2018-2019 Xhevahire Tërnava <xhevahire.ternava@lip6.fr>
 * Copyright 2018-2019 Philippe Collet <philippe.collet@univ-cotedazur.fr>
 */

describe("Testing VP and variants calculus for structures", () => {

    var jsonData;

    beforeAll(async () => {
        jsonData = await getJsonData("tests/data/structures-stats.json");
    });

    it('there should be 2 class level VPs', () => {
        expect(jsonData.classLevelVPs).toBe(2);
    });
    it('there should be 1 method level VP', () => {
        expect(jsonData.methodLevelVPs).toBe(1);
    });
    it('the method level VP should be a constructor VP', () => {
        expect(jsonData.constructorsVPs).toBe(1);
    });

});

function getJsonData(file) {
    return new Promise(((resolve, reject) => {
        d3.queue()
            .defer(d3.json, file)
            .await(function (err, data) {
                resolve(data);
            });
    }));
}
