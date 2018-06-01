import { PaginationModule } from 'ng2-bootstrap/ng2-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { HttpModule } from '@angular/http';
import { TableComponent } from './table';
import { TestBed } from '@angular/core/testing';
import { HttpService } from './../../services/http-service';
import { MockHttpService } from '../../mock/mock.http-service';
import { MockAuthService } from '../../mock/mock.auth.service';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { GlobalConstant } from '../../constants/global.constant';
import { TranslateService, TranslateLoader, TranslateParser } from 'ng2-translate/ng2-translate';
import { AuthService } from '../../../shared/services/auth.service';
import { Logger, LOGGER_LEVEL } from '@nsalaun/ng2-logger';
var dateFormatRegExpCorrect = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
describe('Table Component - ', function () {
    var comp;
    var fixture;
    var inputParams;
    var dummy;
    beforeEach(function () {
        window['gapi'] = {
            auth2: 'mock'
        };
        TestBed.configureTestingModule({
            declarations: [TableComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [Ng2TableModule, PaginationModule, HttpModule],
            providers: [
                { provide: HttpService, useClass: MockHttpService }, { provide: AuthService, useClass: MockAuthService }, { provide: LOGGER_LEVEL, useValue: 'LoggerLevel' }, GlobalConstant, AjaxObservableConstant, TranslateService, TranslateLoader, TranslateParser, Logger
            ]
        });
        fixture = TestBed.createComponent(TableComponent);
        comp = fixture.componentInstance;
        fixture.autoDetectChanges();
    });
    it('loadTableData should load data and emit dataloaded event', function () {
        inputParams = {
            'columns': ['A', 'B', 'C'],
            'search': {
                'set': function (data, value) {
                    dummy = value;
                }
            },
            'method': 'mockGetTableData',
            'module': 'search',
            'operation': 'search'
        };
        spyOn(comp.dataLoaded, 'emit');
        comp.loadTableData(inputParams);
        expect(comp.dataLoaded.emit).toHaveBeenCalledWith({
            value: 'loaded'
        });
    });
    it('loadTableData should load the correct data', function () {
        inputParams = {
            'columns': ['A', 'B', 'C'],
            'search': {
                'set': function (data, value) {
                    dummy = value;
                }
            },
            'method': 'mockGetTableData',
            'module': 'search',
            'operation': 'search'
        };
        spyOn(comp.dataLoaded, 'emit');
        comp.loadTableData(inputParams);
        expect(comp.originalData.records.length).toBe(3);
    });
    it('loadTableData should not load any data if the API is not returning any data', function () {
        inputParams = {
            'columns': ['A', 'B', 'C'],
            'search': {
                'set': function (data, value) {
                    dummy = value;
                }
            },
            'method': 'mockGetTableDataError',
            'module': 'search',
            'operation': 'search'
        };
        comp.loadTableData(inputParams);
        spyOn(comp.dataLoaded, 'emit');
        expect(comp.originalData.errorMessage).toBe('Record Not Found');
    });
    it('changePage should change to respective page', function () {
        var changePage = comp.changePage({ 'page': 2, 'itemsPerPage': '10' }, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
        expect(changePage.length).toBe(5);
    });
    it('changePage should behave accordingly if provide wrong data', function () {
        var page = {
            'page': 2,
            'itemsPerPage': '10'
        };
        var data = [1, 2, 3, 4, 5, 6, 7, 8];
        var changePage = comp.changePage(page, data);
        expect(changePage.length).toBe(0);
    });
    it('onCellClick should emit feeded value', function () {
        var page = {
            'clickpage': 1
        };
        spyOn(comp.selectedData, 'emit');
        comp.onCellClick(page);
        expect(comp.selectedData.emit).toHaveBeenCalledWith({
            'clickpage': 1
        });
    });
    it('formatDate() Should return date in dd/mm/yyyy format', function () {
        var formattedDate = comp.formatDate(new Date());
        expect(dateFormatRegExpCorrect.test(formattedDate)).toBeTruthy();
    });
    it('isDate() should return false if "Invalid Date" string is passed', function () {
        expect(comp.isDate('Invalid Date')).toBeFalsy();
    });
    it('isDate() should return false if a "20170113" string is passed', function () {
        expect(comp.isDate('20170113')).toBeFalsy();
    });
    it('isDate() should return true if a "January 13, 2017" string is passed', function () {
        expect(comp.isDate('January 13, 2017')).toBeTruthy();
    });
});
