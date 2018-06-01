import { TestBed } from '@angular/core/testing';
import { GridComponent } from './grid';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpService } from './../../services/http-service';
import { MockHttpService } from './../../mock/mock.http-service';
import { GlobalConstant } from '../../constants/global.constant';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { Logger, LOGGER_LEVEL } from '@nsalaun/ng2-logger';
import { MockDataConstants } from './../../mock/mock.data';
describe('Grid Component - ', function () {
    var compGrid;
    var fixture;
    beforeEach(function () {
        TestBed.configureTestingModule({
            declarations: [GridComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: HttpService, useClass: MockHttpService },
                { provide: LOGGER_LEVEL, useValue: 'LoggerLevel' },
                GlobalConstant,
                AjaxObservableConstant,
                Logger
            ]
        });
        fixture = TestBed.createComponent(GridComponent);
        compGrid = fixture.componentInstance;
        fixture.autoDetectChanges(true);
    });
    it('Should define the Grid component', function () {
        expect(compGrid).toBeDefined(jasmine.any(GridComponent));
    });
    it('Should set table title as MockDataConstants.c_o_MockGridDataError text in case of error response', function () {
        compGrid.loadGridData({
            method: 'mockGetGridDataError',
            module: 'GridModule',
            operation: 'GET',
            search: 'searchData'
        });
        expect(compGrid.tableTitle).toBe(MockDataConstants.c_o_MockGridDataError['errorMessage']);
    });
    it('Should set table title as MockDataConstants.c_o_MockGridData title in case of success', function () {
        compGrid.loadGridData({
            method: 'mockGetGridData',
            module: 'GridModule',
            operation: 'GET',
            search: 'searchData'
        });
        expect(compGrid.tableTitle).toBe(MockDataConstants.c_o_MockGridData['header']['title'][0]['title']);
    });
    it('selectedRowInfo should emit with column and row data', function () {
        var emitterParam = {};
        compGrid.maxColumns = 11;
        compGrid.loadGridData({
            method: 'mockGetGridData',
            module: 'GridModule',
            operation: 'GET',
            search: 'searchData'
        });
        spyOn(compGrid.selectedRowInfo, 'emit');
        emitterParam = {
            rowData: compGrid.gridArray[2],
            cellData: MockDataConstants.c_o_MockGridData['body']['cells'][0]
        };
        expect(compGrid.selectedRowInfo.emit).toHaveBeenCalledWith(emitterParam);
    });
    it('cellFocus should set selected row index to passed row index', function () {
        expect(compGrid.bodyStructure['selected']).toBe(3);
    });
    it('changeSorting should emit with column and row data', function () {
        var emitterParam = {};
        compGrid.maxColumns = 11;
        compGrid.loadGridData({
            method: 'mockGetGridData',
            module: 'GridModule',
            operation: 'GET',
            search: 'searchData'
        });
        spyOn(compGrid.selectedRowInfo, 'emit');
        emitterParam = {
            rowData: compGrid.gridArray[2],
            cellData: MockDataConstants.c_o_MockGridData['body']['cells'][0]
        };
        expect(compGrid.selectedRowInfo.emit).toHaveBeenCalledWith(emitterParam);
    });
});
