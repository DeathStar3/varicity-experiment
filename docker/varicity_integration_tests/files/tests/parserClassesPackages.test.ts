import {expect} from 'chai';

import { ClassesPackagesStrategy } from "../src/controller/parser/strategies/classes_packages.strategy";

describe('parsing all tests projects with classe packages strategy', function() {
  it('parse abactract decorator', function() {
    let entities = new ClassesPackagesStrategy().parse('abstract_decorator');
    let buildings = entities.buildings
    let numberOfBuiildings = buildings.length;
    expect(numberOfBuiildings).equal(4);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(3);
  }); 

  it('parse abactract decorator', function() {
    let entities = new ClassesPackagesStrategy().parse('composition_levels_inheritance');
    let buildings = entities.buildings
    let numberOfBuiildings = buildings.length;
    expect(numberOfBuiildings).equal(1);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(0);
  }); 

  it('parse composition_levels_mixed', function() {
    let entities = new ClassesPackagesStrategy().parse('composition_levels_mixed');
    let buildings = entities.buildings
    let numberOfBuiildings = buildings.length;
    expect(numberOfBuiildings).equal(1);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(0);
  }); 

  it('parse decorator', function() {
    let entities = new ClassesPackagesStrategy().parse('decorator');
    let districts = entities.districts[0].districts[0].districts
    let numberOfDistricts = districts.length;
    expect(numberOfDistricts).equal(1);
    let numberOfBuiildings = 0;
    districts.forEach(d => {
      numberOfBuiildings += d.buildings.length
    })
    expect(numberOfBuiildings).equal(4);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(3);
  }); 

  it('parse density', function() {
    let entities = new ClassesPackagesStrategy().parse('density');
    let buildings = entities.buildings
    let numberOfBuiildings = buildings.length;
    expect(numberOfBuiildings).equal(6);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(4);
  });

  it('parse factory', function() {
    let entities = new ClassesPackagesStrategy().parse('factory');
    let buildings = entities.buildings;
    let numberOfBuiildings = buildings.length;
    expect(numberOfBuiildings).equal(4);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(2);
  });

  it('parse generic_decorator', function() {
    let entities = new ClassesPackagesStrategy().parse('generic_decorator');
    let buildings = entities.buildings;
    let numberOfBuiildings = buildings.length;
    expect(numberOfBuiildings).equal(4);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(3);
  });

  it('parse attribute_composition', function() {
    let entities = new ClassesPackagesStrategy().parse('attribute_composition');
    let buildings = entities.buildings;
    let numberOfBuiildings = buildings.length;
    expect(numberOfBuiildings).equal(1);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(0);
  });

  it('parse attribute_composition_factory', function() {
    let entities = new ClassesPackagesStrategy().parse('attribute_composition_factory');
    let buildings = entities.buildings;
    let numberOfBuiildings = buildings.length;
    expect(numberOfBuiildings).equal(10);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(9);
  });

  it('parse generics', function() {
    let entities = new ClassesPackagesStrategy().parse('generics');
    let buildings = entities.buildings
    let numberOfBuiildings = buildings.length;
    expect(numberOfBuiildings).equal(3);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(2);
  });

  it('parse inheritance', function() {
    let entities = new ClassesPackagesStrategy().parse('inheritance');
    let buildings = entities.buildings
    let numberOfBuiildings = buildings.length;
    expect(numberOfBuiildings).equal(3);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(2);
  });

  it('parse import_from_different_package', function() {
    let entities = new ClassesPackagesStrategy().parse('import_from_different_package');
    let districts = entities.districts
    let numberOfDistricts = districts.length;
    expect(numberOfDistricts).equal(1);
    let numberOfBuiildings = 0;
    districts.forEach(d => {
      numberOfBuiildings += d.buildings.length
    })
    numberOfBuiildings+= entities.buildings.length
    expect(numberOfBuiildings).equal(2);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(1);
  });

  it('parse import_from_different_package_all_package_imported', function() {
    let entities = new ClassesPackagesStrategy().parse('import_from_different_package_all_package_imported');
    let districts = entities.districts
    let numberOfDistricts = districts.length;
    expect(numberOfDistricts).equal(1);
    let numberOfBuiildings = 0;
    districts.forEach(d => {
      numberOfBuiildings += d.buildings.length
    })
    numberOfBuiildings+= entities.buildings.length
    expect(numberOfBuiildings).equal(2);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(1);
  });

  it('parse inner_class', function() {
    let entities = new ClassesPackagesStrategy().parse('inner_class');
    let numberOfBuiildings = entities.buildings.length;
    expect(numberOfBuiildings).equal(0);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(0);
  });

  it('parse inner_class_before_fields', function() {
    let entities = new ClassesPackagesStrategy().parse('inner_class_before_fields');
    let numberOfBuiildings = entities.buildings.length;
    expect(numberOfBuiildings).equal(0);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(0);
  });

  it('parse metrics', function() {
    let entities = new ClassesPackagesStrategy().parse('metrics');
    let numberOfBuiildings = entities.buildings.length;
    expect(numberOfBuiildings).equal(4);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(0);
  });

  it('parse multiple_patterns', function() {
    let entities = new ClassesPackagesStrategy().parse('multiple_patterns');
    let numberOfBuiildings = entities.buildings.length;
    expect(numberOfBuiildings).equal(6);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(4);
  });

  it('parse multiple_vp', function() {
    let entities = new ClassesPackagesStrategy().parse('multiple_vp');
    let numberOfBuiildings = entities.buildings.length;
    expect(numberOfBuiildings).equal(1);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(0);
  });

  it('parse strategy', function() {
    let entities = new ClassesPackagesStrategy().parse('strategy');
    let numberOfBuiildings = entities.buildings.length;
    expect(numberOfBuiildings).equal(3);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(2);
  });

  it('parse strategy_with_method_parameter', function() {
    let entities = new ClassesPackagesStrategy().parse('strategy_with_method_parameter');
    let numberOfBuiildings = entities.buildings.length;
    expect(numberOfBuiildings).equal(3);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(2);
  });

  it('parse structures', function() {
    let entities = new ClassesPackagesStrategy().parse('structures');
    let numberOfBuiildings = entities.buildings.length;
    expect(numberOfBuiildings).equal(3);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(0);
  });

  it('parse template', function() {
    let entities = new ClassesPackagesStrategy().parse('template');
    let numberOfBuiildings = entities.buildings.length;
    expect(numberOfBuiildings).equal(2);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(1);
  });

  it('parse vps_and_variants', function() {
    let entities = new ClassesPackagesStrategy().parse('vps_and_variants');
    let numberOfBuiildings = entities.buildings.length;
    expect(numberOfBuiildings).equal(6);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(0);
  });

  it('parse vps_in_different_packages', function() {
    let entities = new ClassesPackagesStrategy().parse('vps_in_different_packages');
    let districts = entities.districts
    let numberOfDistricts = districts.length;
    expect(numberOfDistricts).equal(2);
    let numberOfBuiildings = 0;
    districts.forEach(d => {
      numberOfBuiildings += d.buildings.length
    })
    numberOfBuiildings+= entities.buildings.length
    // expect(numberOfBuiildings).equal(6);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(1);
  });
});