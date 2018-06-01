describe('component: iCABSACountryCodeSearch', function() {
  var $componentController;

  beforeEach(module('app'));
  beforeEach(inject(function(_$componentController_) {
    $componentController = _$componentController_;
  }));

  it('should expose a object', function() {
    var bindings = {displayHeader: true};
    var ctrl = $componentController('iCABSACountryCodeSearch', null, bindings);

    expect(ctrl.displayHeader).toBeDefined();
    expect(ctrl.displayHeader).toBe(true);
  });

  it('should set undefined binding to true', function() {
    var bindings = {displayHeader: undefined};
    var ctrl = $componentController('iCABSACountryCodeSearch', null, bindings);
    ctrl.$onInit();
    expect(ctrl.displayHeader).toBeDefined();
    expect(ctrl.displayHeader).toBe(true);
  });

  it('should set controller model on service call', function() {
    var service, urlConstant;   
    var bindings = {displayHeader: undefined};
    var ctrl = $componentController('iCABSACountryCodeSearch', null, bindings);

    // Get the service from the injector
    angular.mock.inject(function GetDependencies(urlConstant, $httpBackend) {
      urlConstant = urlConstant;
      $httpBackend
        .when('GET', urlConstant.countrySearchUrl)
        .respond(200, {
              "tableHeader" : [
                {
                  "name": "Select",
                  "sortable": false,
                  "input": true
                }
              ],
              "tableBody" :
              [
                {
                  "select": { "type": "radio", "checked": false, "label": "Select Country" },
                  "code": "APPW",
                  "desc": "APW Descrition"                  
                }
              ]
            });

        // call the function on our service instance
      
      ctrl.getTableData();
      expect($httpBackend.flush).not.toThrow();
      expect(ctrl.countryData).toBeDefined();
      expect(ctrl.countryData.tableHeader[0].name).toBe("Select");
      expect(ctrl.totalItem).toBeDefined();
      expect(ctrl.totalPage).toBeDefined();
      expect(ctrl.enableDataTable).toBe(false);
    });

  });

});
