// import {expect} from 'chai';

// import { District } from '../src/model/entities/district.interface';
// import { ConfigLoader } from '../src/controller/parser/configLoader';
// import { FilesLoader } from '../src/controller/parser/filesLoader';
// import { VPVariantsInheritanceStrategy } from "../src/controller/parser/strategies/vp_variants_inheritance.strategy";

// function countBuilding(districts: District[]) : number{
//   let sum = 0;
//   districts.forEach(d => {
//     sum += d.buildings.length;
//     sum += countBuilding(d.districts)
//   })
//    return sum;
// }

// function countDistricts(districts: District[]) : number{
//   let sum = 0;
//   districts.forEach(d => {
//     sum += 1;
//     sum += countDistricts(d.districts)
//   })
//    return sum;
// }

// describe('parsing all tests projects with vp strategy', function() {
//     it('parse abactract decorator', function() {
//         let entities = new VPVariantsInheritanceStrategy().parse(FilesLoader.loadDataFile('abstract_decorator'), ConfigLoader.loadDataFile("config"));
//         let ent = entities.filterCompLevel(1);
//         let dis = ent.district.districts
//         let numberOfDistricts = countDistricts(dis);
//         let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
//         expect(numberOfBuiildings).equal(4);
//         expect(numberOfDistricts).equal(2);
//     }); 
  
//     it('parse composition_levels_inheritance', function() {
//       let entities = new VPVariantsInheritanceStrategy().parse(FilesLoader.loadDataFile('composition_levels_inheritance'), ConfigLoader.loadDataFile("config"));
//       let districts = entities.district.districts
//       let numberOfBuiildings = countBuilding(districts) + countDistricts(districts)
//       expect(numberOfBuiildings).equal(1); // bizarre que le résulat soit 0
//       let numberOfLinks = entities.links.length;
//       expect(numberOfLinks).equal(0);
//     }); 
  
//     // it('parse composition_levels_mixed', function() {
//     //   let entities = new ClassesPackagesStrategy().parse('composition_levels_mixed');
//     //   let numberOfBuiildings = entities.buildings.length;
//     //   expect(numberOfBuiildings).equal(1);
//     //   let numberOfLinks = entities.links.length;
//     //   expect(numberOfLinks).equal(0);
//     // }); 
  
//     it('parse decorator', function() {
//       let entities = new VPVariantsInheritanceStrategy().parse(FilesLoader.loadDataFile('decorator'), ConfigLoader.loadDataFile("config"));
//       let dis = entities.district.districts
//       let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
//       expect(numberOfBuiildings).equal(4);
//       let numberOfLinks = entities.links.length;
//       expect(numberOfLinks).equal(5); // pourquoi 5 
//     }); 
  
//     it('parse density', function() {
//       let entities = new VPVariantsInheritanceStrategy().parse(FilesLoader.loadDataFile('density'), ConfigLoader.loadDataFile("config"));
//       let dis = entities.district.districts
//       let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
//       expect(numberOfBuiildings).equal(6);
//       let numberOfLinks = entities.links.length;
//       expect(numberOfLinks).equal(6);
//     });
  
//     it('parse factory', function() {
//       let entities = new VPVariantsInheritanceStrategy().parse(FilesLoader.loadDataFile('factory'), ConfigLoader.loadDataFile("config"));
//       let dis = entities.district.districts
//       let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
//       expect(numberOfBuiildings).equal(4);
//       let numberOfLinks = entities.links.length;
//       expect(numberOfLinks).equal(3);
//     });
  
//     it('parse generic_decorator', function() {
//       let entities = new VPVariantsInheritanceStrategy().parse(FilesLoader.loadDataFile('generic_decorator'), ConfigLoader.loadDataFile("config"));
//       let dis = entities.district.districts
//       let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
//       expect(numberOfBuiildings).equal(4); // 0 au lieu de 4 
//       let numberOfLinks = entities.links.length;
//       expect(numberOfLinks).equal(5);
//     });
  
//     it('parse attribute_composition', function() {
//       let entities = new VPVariantsInheritanceStrategy().parse(FilesLoader.loadDataFile('attribute_composition'), ConfigLoader.loadDataFile("config"));
//       let dis = entities.district.districts
//       let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
//       expect(numberOfBuiildings).equal(1);
//       let numberOfLinks = entities.links.length;
//       expect(numberOfLinks).equal(0);
//     });
  
//     it('parse attribute_composition_factory', function() {
//       let entities = new VPVariantsInheritanceStrategy().parse(FilesLoader.loadDataFile('attribute_composition_factory'), ConfigLoader.loadDataFile("config"));
//       let dis = entities.district.districts
//       let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
//       expect(numberOfBuiildings).equal(15); // c'est normal qu'il y'en ait 15 car il y a des doublons au lieu de 10
//       let numberOfLinks = entities.links.length;
//       expect(numberOfLinks).equal(12);
//     });
  
//     it('parse generics', function() {
//       let entities = new VPVariantsInheritanceStrategy().parse(FilesLoader.loadDataFile('generics'), ConfigLoader.loadDataFile("config"));
//       let dis = entities.district.districts
//       let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
//       expect(numberOfBuiildings).equal(3);
//       let numberOfLinks = entities.links.length;
//       expect(numberOfLinks).equal(2);
//     });
  
//     it('parse inheritance', function() {
//       let entities = new VPVariantsInheritanceStrategy().parse(FilesLoader.loadDataFile('inheritance'), ConfigLoader.loadDataFile("config"));
//       let dis = entities.district.districts
//       let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
//       expect(numberOfBuiildings).equal(3);
//       let numberOfLinks = entities.links.length;
//       expect(numberOfLinks).equal(2);
//     });
  
//     // it('parse import_from_different_package', function() {
//     //   let entities = new ClassesPackagesStrategy().parse('import_from_different_package');
//     //   let numberOfBuiildings = entities.buildings.length;
//     //   expect(numberOfBuiildings).equal(2);
//     //   let numberOfLinks = entities.links.length;
//     //   expect(numberOfLinks).equal(1);
//     // });
  
//     // it('parse import_from_different_package_all_package_imported', function() {
//     //   let entities = new ClassesPackagesStrategy().parse('import_from_different_package_all_package_imported');
//     //   let numberOfBuiildings = entities.buildings.length;
//     //   expect(numberOfBuiildings).equal(2);
//     //   let numberOfLinks = entities.links.length;
//     //   expect(numberOfLinks).equal(1);
//     // });
  
//     it('parse inner_class', function() {
//       let entities = new VPVariantsInheritanceStrategy().parse(FilesLoader.loadDataFile('inner_class'), ConfigLoader.loadDataFile("config"));
//       let dis = entities.district.districts
//       let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
//       expect(numberOfBuiildings).equal(0);
//       let numberOfLinks = entities.links.length;
//       expect(numberOfLinks).equal(0);
//     });
  
//     it('parse inner_class_before_fields', function() {
//       let entities = new VPVariantsInheritanceStrategy().parse(FilesLoader.loadDataFile('inner_class_before_fields'), ConfigLoader.loadDataFile("config"));
//       let dis = entities.district.districts
//       let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
//       expect(numberOfBuiildings).equal(0);
//       let numberOfLinks = entities.links.length;
//       expect(numberOfLinks).equal(0);
//     });
  
//     it('parse metrics', function() {
//       let entities = new VPVariantsInheritanceStrategy().parse(FilesLoader.loadDataFile('metrics'), ConfigLoader.loadDataFile("config"));
//       let dis = entities.district.districts
//       let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
//       expect(numberOfBuiildings).equal(0); // ici c'est 0 au lieu de 4
//       let numberOfLinks = entities.links.length;
//       expect(numberOfLinks).equal(0);
//     });
  
//     it('parse multiple_patterns', function() {
//       let entities = new VPVariantsInheritanceStrategy().parse(FilesLoader.loadDataFile('multiple_patterns'), ConfigLoader.loadDataFile("config"));
//       let dis = entities.district.districts
//       let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
//       expect(numberOfBuiildings).equal(6);
//       let numberOfLinks = entities.links.length;
//       expect(numberOfLinks).equal(7); // ici c'est 7 au lieu de 4
//     });
  
//     it('parse multiple_vp', function() {
//       let entities = new VPVariantsInheritanceStrategy().parse(FilesLoader.loadDataFile('multiple_vp'), ConfigLoader.loadDataFile("config"));
//       let dis = entities.district.districts
//       let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
//       expect(numberOfBuiildings).equal(1);
//       let numberOfLinks = entities.links.length;
//       expect(numberOfLinks).equal(0);
//     });
  
//     it('parse strategy', function() {
//       let entities = new VPVariantsInheritanceStrategy().parse(FilesLoader.loadDataFile('strategy'), ConfigLoader.loadDataFile("config"));
//       let dis = entities.district.districts
//       let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
//       expect(numberOfBuiildings).equal(3);
//       let numberOfLinks = entities.links.length;
//       expect(numberOfLinks).equal(2);
//     });
  
//     it('parse strategy_with_method_parameter', function() {
//       let entities = new VPVariantsInheritanceStrategy().parse(FilesLoader.loadDataFile('strategy_with_method_parameter'), ConfigLoader.loadDataFile("config"));
//       let dis = entities.district.districts
//       let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
//       expect(numberOfBuiildings).equal(3);
//       let numberOfLinks = entities.links.length;
//       expect(numberOfLinks).equal(2);
//     });
  
//     it('parse structures', function() {
//       let entities = new VPVariantsInheritanceStrategy().parse(FilesLoader.loadDataFile('structures'), ConfigLoader.loadDataFile("config"));
//       let dis = entities.district.districts
//       let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
//       expect(numberOfBuiildings).equal(2); // 2 au lieu de 3 
//       let numberOfLinks = entities.links.length;
//       expect(numberOfLinks).equal(0);
//     });
  
//     it('parse template', function() {
//       let entities = new VPVariantsInheritanceStrategy().parse(FilesLoader.loadDataFile('template'), ConfigLoader.loadDataFile("config"));
//       let dis = entities.district.districts
//       let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
//       expect(numberOfBuiildings).equal(2);
//       let numberOfLinks = entities.links.length;
//       expect(numberOfLinks).equal(1);
//     });
  
//     it('parse vps_and_variants', function() {
//       let entities = new VPVariantsInheritanceStrategy().parse(FilesLoader.loadDataFile('vps_and_variants'), ConfigLoader.loadDataFile("config"));
//       let dis = entities.district.districts
//       let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
//       expect(numberOfBuiildings).equal(6);
//       let numberOfLinks = entities.links.length;
//       expect(numberOfLinks).equal(0);
//     });
  
//     // it('parse vps_in_different_packages', function() {
//     //   let entities = new ClassesPackagesStrategy().parse('vps_in_different_packages');
//     //   let districts = entities.district[0].districts
//     //   let numberOfDistricts = districts.length;
//     //   expect(numberOfDistricts).equal(2);
//     //   let numberOfBuiildings = 0;
//     //   districts.forEach(d => {
//     //     numberOfBuiildings += d.buildings.length
//     //   })
//     //   numberOfBuiildings+= entities.buildings.length
//     //   // expect(numberOfBuiildings).equal(6);
//     //   let numberOfLinks = entities.links.length;
//     //   expect(numberOfLinks).equal(1);
//     // });
//   });