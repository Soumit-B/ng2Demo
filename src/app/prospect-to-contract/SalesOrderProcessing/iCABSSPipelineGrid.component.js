var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { EmployeeSearchComponent } from './../../../app/internal/search/iCABSBEmployeeSearch';
import { OrderBy } from './../../../shared/pipes/orderBy';
export var PipelineGridComponent = (function (_super) {
    __extends(PipelineGridComponent, _super);
    function PipelineGridComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.inputParams = {
            method: 'prospect-to-contract/maintenance',
            module: 'advantage',
            operation: 'Sales/iCABSSPipelineGrid',
            ActionUpdate: '6'
        };
        this.isFormEnabled = false;
        this.isFormValid = false;
        this.cmdSelectReview = true;
        this.MenuOptionListInclusionType = [{}];
        this.MenuOptionListMenu = [{}];
        this.SelectFilterOptionListMenu = [{}];
        this.showAppointmentHeader = true;
        this.toDay = new Date();
        this.viewBySelected = '';
        this.maxColumn = 20;
        this.pageCurrent = '1';
        this.pageSize = '10';
        this.currentPage = 1;
        this.dateDisable = false;
        this.ProspectStatus = [
            {
                text: 'All',
                value: 'all'
            }
        ];
        this.ProspectOrigin = [];
        this.allOption = [
            {
                text: 'All',
                value: '$$all$$'
            }
        ];
        this.Marketselect = [];
        this.fieldHidden = {
            fromToDate: true,
            tdDiaryDate: true
        };
        this.fieldDisable = {
            CompanyCode: true
        };
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.ellipsisConfig = {
            employee: {
                autoOpen: true,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp'
                },
                modalConfig: this.modalConfig,
                contentComponent: EmployeeSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            }
        };
        this.controls = [
            { name: 'EmployeeCode', readonly: true, disabled: false, required: false },
            { name: 'EmployeeSurname', readonly: true, disabled: true, required: false },
            { name: 'InclusionTypeSelect', readonly: false, disabled: false, required: false },
            { name: 'FromDate', readonly: true, disabled: false, required: false },
            { name: 'ToDate', readonly: true, disabled: false, required: false },
            { name: 'StatusSelect', readonly: false, disabled: false, required: false },
            { name: 'OriginSelect', readonly: true, disabled: false, required: false },
            { name: 'SelectFilter', readonly: true, disabled: false, required: false },
            { name: 'DiaryDate', readonly: true, disabled: false, required: false },
            { name: 'SelectMarketFilter', readonly: true, disabled: false, required: false },
            { name: 'PassProspectNumber', readonly: true, disabled: true, required: false },
            { name: 'PassProspectName', readonly: true, disabled: true, required: false },
            { name: 'menu', readonly: true, disabled: false, required: false },
            { name: 'ProspectContactName', readonly: true, disabled: false, required: false },
            { name: 'ProspectContactPhone', readonly: true, disabled: false, required: false },
            { name: 'ProspectContactMobile', readonly: true, disabled: false, required: false },
            { name: 'ProspectTypeDesc', readonly: true, disabled: false, required: false },
            { name: 'ProspectSourceDesc', readonly: true, disabled: false, required: false },
            { name: 'ProspectAppointmentDetails', readonly: true, disabled: false, required: false },
            { name: 'ProspectNotes', readonly: true, disabled: false, required: false },
            { name: 'RunFrom', readonly: true, disabled: false, required: false },
            { name: 'DiaryProspectNumber', readonly: true, disabled: true, required: false },
            { name: 'PassProspectROWID', readonly: true, disabled: true, required: false },
            { name: 'PassContractROWID', readonly: true, disabled: true, required: false },
            { name: 'PassContactROWID', readonly: true, disabled: true, required: false },
            { name: 'ProspectType', readonly: true, disabled: true, required: false },
            { name: 'PipelineGridProspectNumber', readonly: true, disabled: true, required: false },
            { name: 'ForceApptEntry', readonly: true, disabled: true, required: false },
            { name: 'WarnOldOpenAppt', readonly: true, disabled: true, required: false },
            { name: 'PassWONumber', readonly: true, disabled: true, required: false },
            { name: 'SOPReportQuoteStatus', readonly: true, disabled: true, required: false },
            { name: 'SOPReportBranch', readonly: true, disabled: true, required: false },
            { name: 'SOPReportRegion', readonly: true, disabled: true, required: false },
            { name: 'GridUserCode', readonly: true, disabled: true, required: false }
        ];
        this.pageId = PageIdentifier.ICABSSPIPELINEGRID;
        this.orderBy = injector.get(OrderBy);
    }
    PipelineGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Pipeline Prospects';
        this.window_onload();
    };
    PipelineGridComponent.prototype.ngAfterViewInit = function () {
        this.buildOriginCodes();
        this.buildStatusList();
        this.buildMarketSegment();
    };
    PipelineGridComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    PipelineGridComponent.prototype.window_onload = function () {
        this.pageParams.mode = 'load';
        this.viewBySelected = 'employee';
        this.parentMode = this.riExchange.getParentMode();
        this.setControlValue('RunFrom', this.parentMode);
        this.loadListInclusionType();
        this.loadListMenu();
        this.loadSelectFilterMenu();
        switch (this.parentMode) {
            case 'ContactCentreReview':
                this.cmdSelectReview = false;
                break;
            default:
                break;
        }
        switch (this.pageParams.mode) {
            case 'load':
                this.loadUserForm();
                break;
            default:
                break;
        }
        if (this.parentMode === 'SOPReportGrid' || this.parentMode === 'SOPReportGridProspect' || this.parentMode === 'SOPReportGridQuotesInput') {
            this.setControlValue('FromDate', this.riExchange.getParentHTMLValue('DateFrom'));
            this.fromDate = new Date(this.riExchange.getParentHTMLValue('DateFrom'));
            this.setControlValue('ToDate', this.riExchange.getParentHTMLValue('DateTo'));
            this.toDate = new Date(this.riExchange.getParentHTMLValue('DateTo'));
            if (this.parentMode === 'SOPReportGrid') {
                this.setControlValue('SOPReportBranch', this.riExchange.getParentHTMLValue('SOPReportBranch'));
                this.setControlValue('SOPReportRegion', this.riExchange.getParentHTMLValue('SOPReportRegion'));
                this.setControlValue('InclusionTypeSelect', 'OpenAndClosed');
            }
            if (this.parentMode === 'SOPReportGridProspect' || this.parentMode === 'SOPReportGridQuotesInput') {
                if (this.parentMode === 'SOPReportGridQuotesInput') {
                    this.setControlValue('SOPReportQuoteStatus', 'Input');
                }
                this.setControlValue('SOPReportBranch', this.riExchange.getParentHTMLValue('SOPReportBranch'));
                this.setControlValue('SOPReportRegion', this.riExchange.getParentHTMLValue('SOPReportRegion'));
                this.setControlValue('InclusionTypeSelect', 'OpenAndClosed');
            }
            this.InclusionTypeSelectChange('OpenAndClosed');
            this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('GroupDesc'));
            this.setControlValue('EmployeeSurname', this.riExchange.getParentAttributeValue('GroupCode'));
        }
        else {
            if (this.parentMode === 'DiaryDay') {
                this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('PassEmployeeCode'));
                this.setControlValue('EmployeeSurname', this.riExchange.getParentHTMLValue('PassEmployeeCode'));
                this.setControlValue('DiaryDate', this.riExchange.getParentHTMLValue('PassDiaryDate'));
                this.dtDiaryDate = new Date(this.utils.formatDate(this.riExchange.getParentHTMLValue('PassDiaryDate')));
                this.setControlValue('SelectFilter', 'WITHAPPTON');
                this.SelectFilterChange('WITHAPPTON');
                this.setControlValue('FromDate', this.utils.formatDate(this.utils.removeDays(this.toDay, 90)));
                this.fromDate = new Date(this.utils.formatDate(this.utils.removeDays(this.toDay, 90)));
                this.setControlValue('ToDate', this.utils.TodayAsDDMMYYYY());
                this.toDate = new Date(this.utils.TodayAsDDMMYYYY());
                var diaryDate = this.utils.formatDate(this.getControlValue('DiaryDate'));
                if (diaryDate < this.toDay) {
                    this.setControlValue('InclusionTypeSelect', 'OpenAndClosed');
                    this.InclusionTypeSelectChange('OpenAndClosed');
                }
            }
            this.setControlValue('GridUserCode', this.utils.getUserCode());
            this.setControlValue('FromDate', this.utils.formatDate(this.utils.removeDays(this.toDay, 90)));
            this.fromDate = new Date(this.utils.formatDate(this.utils.removeDays(this.toDay, 90)));
            this.setControlValue('ToDate', this.utils.TodayAsDDMMYYYY());
            this.toDate = new Date(this.utils.TodayAsDDMMYYYY());
            this.setControlValue('DiaryDate', this.toDay);
            this.dtDiaryDate = new Date(this.utils.formatDate(this.toDay));
        }
    };
    PipelineGridComponent.prototype.buildStatusList = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'ProspectStatusLang',
                'query': {
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['ProspectStatusCode', 'ProspectStatusDesc']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var j = 0;
            var lIncludedConverted = false;
            for (var i = 0; i < data[0].length; i++) {
                if (data[0][i].ProspectStatusDesc === 'Converted To Contract' || data[0][i].ProspectStatusDesc === 'Converted To Product Sale' || data[0][i].ProspectStatusDesc === 'Converted To Job') {
                    if (!(lIncludedConverted)) {
                        lIncludedConverted = true;
                        var obj = {
                            text: 'Converted',
                            value: '-99'
                        };
                        _this.ProspectStatus.push(obj);
                        j++;
                    }
                }
                else {
                    var obj = {
                        text: data[0][i].ProspectStatusDesc,
                        value: data[0][i].ProspectStatusCode
                    };
                    _this.ProspectStatus.push(obj);
                    j++;
                }
            }
        });
    };
    PipelineGridComponent.prototype.StatusSelectChange = function (obj) {
        this.uiForm.controls['StatusSelect'].setValue(obj);
        this.loadPipeLineGrid(this.inputParams);
    };
    PipelineGridComponent.prototype.buildOriginCodes = function () {
        var _this = this;
        var ProspectOrigin = [];
        var BusinessSourceList = [];
        var BusinessSourceLangList = [];
        var BusinessOriginList = [];
        var BusinessOriginLangList = [];
        var BusinessOriginDetailList = [];
        var BusinessOriginDetailLangList = [];
        var lookupBusinessSource = [
            {
                'table': 'BusinessSource',
                'query': {
                    'BusinessCode': this.businessCode()
                },
                'fields': ['BusinessCode', 'BusinessSourceCode', 'BusinessSourceSystemDesc', 'SalesDefaultInd']
            },
            {
                'table': 'BusinessSourceLang',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['BusinessCode', 'BusinessSourceCode', 'BusinessSourceDesc']
            },
            {
                'table': 'BusinessOrigin',
                'query': {
                    'BusinessCode': this.businessCode()
                },
                'fields': ['BusinessCode', 'BusinessSourceCode', 'BusinessOriginCode', 'BusinessOriginSystemDesc', 'DetailRequiredInd']
            },
            {
                'table': 'BusinessOriginLang',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['BusinessCode', 'BusinessOriginCode', 'BusinessOriginDesc']
            },
            {
                'table': 'BusinessOriginDetail',
                'query': {
                    'BusinessCode': this.businessCode()
                },
                'fields': ['BusinessCode', 'BusinessOriginCode', 'BusinessOriginDetailCode', 'BusinessOriginDetailSystemDesc']
            },
            {
                'table': 'BusinessOriginDetailLang',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['BusinessCode', 'BusinessOriginCode', 'BusinessOriginDetailCode', 'BusinessOriginDetailDesc']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupBusinessSource).subscribe(function (data) {
            BusinessSourceList = data[0];
            BusinessSourceLangList = data[1];
            BusinessOriginList = data[2];
            BusinessOriginLangList = data[3];
            BusinessOriginDetailList = data[4];
            BusinessOriginDetailLangList = data[5];
            if (BusinessSourceList) {
                BusinessSourceList.forEach(function (i) {
                    var BusinessSource_BusinessCode = i.BusinessCode;
                    var BusinessSource_BusinessSourceCode = i.BusinessSourceCode;
                    var BusinessSource_BusinessSourceSystemDesc = i.BusinessSourceSystemDesc;
                    var filterData = BusinessSourceLangList.find(function (detailObj) { return (detailObj.BusinessSourceCode === i.BusinessSourceCode); });
                    var BusinessSourceLang_desc;
                    if (filterData) {
                        _this.ProspectOrigin.push({
                            text: filterData.BusinessSourceDesc ? filterData.BusinessSourceDesc : i.BusinessSourceSystemDesc,
                            value: filterData.BusinessSourceCode ? filterData.BusinessSourceCode : i.BusinessSourceCode
                        });
                        BusinessSourceLang_desc = filterData.BusinessSourceDesc;
                    }
                    else {
                        BusinessSourceLang_desc = BusinessSource_BusinessSourceSystemDesc;
                    }
                    var intermediateprospectorigincode;
                    var filterData1 = BusinessOriginList.filter(function (detailObj) { return (detailObj.BusinessSourceCode === i.BusinessSourceCode); });
                    if (filterData1.length > 0) {
                        filterData1.forEach(function (i) {
                            var BusinessOrigin_BusinessCode = i.BusinessCode;
                            var BusinessOrigin_BusinessOriginCode = i.BusinessOriginCode;
                            var BusinessOrigin_BusinessOriginSystemDesc = i.BusinessOriginSystemDesc;
                            var DetailRequiredInd = i.DetailRequiredInd;
                            var filterData2 = BusinessOriginLangList.find(function (detailObj) { return (detailObj.BusinessSourceCode === i.BusinessSourceCode); });
                            if (filterData2) {
                                var BusinessOriginLang_BusinessOriginDesc = void 0;
                                if (filterData2.BusinessOriginDesc) {
                                    BusinessOriginLang_BusinessOriginDesc = filterData2.BusinessOriginDesc;
                                    var obj1 = {
                                        text: BusinessSourceLang_desc + '/' + BusinessOriginLang_BusinessOriginDesc,
                                        value: BusinessSource_BusinessSourceCode + '^' + BusinessOrigin_BusinessOriginCode
                                    };
                                    intermediateprospectorigincode = BusinessSourceLang_desc + '/' + BusinessOriginLang_BusinessOriginDesc;
                                    _this.ProspectOrigin.push(obj1);
                                }
                            }
                            else {
                                var obj1 = {
                                    text: BusinessSourceLang_desc + '/' + BusinessOrigin_BusinessOriginSystemDesc,
                                    value: BusinessSource_BusinessSourceCode + '^' + BusinessOrigin_BusinessOriginCode
                                };
                                intermediateprospectorigincode = BusinessSourceLang_desc + '/' + BusinessOrigin_BusinessOriginSystemDesc;
                                _this.ProspectOrigin.push(obj1);
                            }
                            if (DetailRequiredInd) {
                                var filterData3 = BusinessOriginDetailList.filter(function (detailObj) { return (detailObj.BusinessOriginCode === i.BusinessOriginCode); });
                                if (filterData3.length > 0) {
                                    filterData3.forEach(function (i) {
                                        var BusinessOriginDetail_BusinessCode = i.BusinessCode;
                                        var BusinessOriginDetail_BusinessOriginCode = i.BusinessOriginCode;
                                        var BusinessOriginDetail_BusinessOriginDetailCode = i.BusinessOriginDetailCode;
                                        var BusinessOriginDetail_BusinessOriginDetailSystemDesc = i.BusinessOriginDetailSystemDesc;
                                        var filterData4 = BusinessOriginDetailLangList.find(function (detailObj) { return (detailObj.BusinessOriginCode === BusinessOriginDetail_BusinessOriginCode, detailObj.BusinessOriginDetailCode === BusinessOriginDetail_BusinessOriginDetailCode); });
                                        if (filterData4) {
                                            var BusinessOriginDetailLang_BusinessOriginDetailDesc = filterData4.BusinessOriginDetailDesc;
                                            var obj1 = {
                                                text: intermediateprospectorigincode + '/' + BusinessOriginDetailLang_BusinessOriginDetailDesc,
                                                value: BusinessSource_BusinessSourceCode + '^' + BusinessOrigin_BusinessOriginCode + '^' + BusinessOriginDetail_BusinessOriginDetailCode
                                            };
                                            _this.ProspectOrigin.push(obj1);
                                        }
                                        else {
                                            var obj1 = {
                                                text: intermediateprospectorigincode + '/' + BusinessOriginDetail_BusinessOriginDetailSystemDesc,
                                                value: BusinessSource_BusinessSourceCode + '^' + BusinessOrigin_BusinessOriginCode + '^' + BusinessOriginDetail_BusinessOriginDetailCode
                                            };
                                            _this.ProspectOrigin.push(obj1);
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            }
            _this.ProspectOrigin = _this.orderBy.transform(_this.ProspectOrigin, 'text');
            _this.ProspectOrigin = _this.allOption.concat(_this.ProspectOrigin);
        });
    };
    PipelineGridComponent.prototype.OriginSelectChange = function (obj) {
        this.uiForm.controls['OriginSelect'].setValue(obj);
        this.loadPipeLineGrid(this.inputParams);
    };
    PipelineGridComponent.prototype.buildMarketSegment = function () {
        var _this = this;
        var marketSegmentList = [];
        var marketSegmentLangList = [];
        var lookupMarketSegment = [
            {
                'table': 'MarketSegment ',
                'query': {
                    'BusinessCode': this.businessCode()
                },
                'fields': ['BusinessCode', 'MarketSegmentCode', 'MarketSegmentDesc']
            },
            {
                'table': 'MarketSegmentLang ',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['BusinessCode', 'MarketSegmentCode', 'MarketSegmentDesc']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupMarketSegment).subscribe(function (data) {
            marketSegmentList = data[0];
            marketSegmentLangList = data[1];
            if (marketSegmentList.length > 0) {
                marketSegmentList.forEach(function (i) {
                    var MarketSegment_BusinessCode = i.BusinessCode;
                    var MarketSegment_MarketSegmentCode = i.MarketSegmentCode;
                    var MarketSegment_MarketSegmentDesc = i.MarketSegmentDesc;
                    var filterData = marketSegmentLangList.find(function (detailObj) { return (detailObj.MarketSegmentCode === i.MarketSegmentCode); });
                    if (filterData) {
                        _this.Marketselect.push({
                            text: filterData.MarketSegmentDesc ? filterData.MarketSegmentDesc : MarketSegment_MarketSegmentDesc,
                            value: MarketSegment_MarketSegmentCode
                        });
                    }
                    else {
                        _this.Marketselect.push({
                            text: MarketSegment_MarketSegmentDesc,
                            value: MarketSegment_MarketSegmentCode
                        });
                    }
                });
            }
            _this.Marketselect = _this.orderBy.transform(_this.Marketselect, 'text');
            _this.Marketselect = _this.allOption.concat(_this.Marketselect);
        });
    };
    PipelineGridComponent.prototype.marketSelectChange = function (obj) {
        this.uiForm.controls['SelectMarketFilter'].setValue(obj);
        this.loadPipeLineGrid(this.inputParams);
    };
    PipelineGridComponent.prototype.loadSelectFilterMenu = function () {
        this.SelectFilterOptionListMenu = [];
        this.SelectFilterOptionListMenu.push({ value: 'NONE', text: 'No Filter' });
        this.SelectFilterOptionListMenu.push({ value: 'WITHAPPT', text: 'With An Appointment' });
        this.SelectFilterOptionListMenu.push({ value: 'WITHAPPTON', text: 'With An Appointment On' });
        this.SelectFilterOptionListMenu.push({ value: 'NOAPPT', text: 'Without An Appointment' });
        this.SelectFilterOptionListMenu.splice(0, 1);
        this.SelectFilterDropdown.defaultOption = { value: 'NONE', text: 'No Filter' };
    };
    PipelineGridComponent.prototype.SelectFilterChange = function (obj) {
        this.uiForm.controls['SelectFilter'].setValue(obj);
        switch (obj) {
            case 'WITHAPPT':
                this.fieldHidden.tdDiaryDate = true;
                break;
            case 'WITHAPPTON':
                this.fieldHidden.tdDiaryDate = false;
                break;
            case 'NOAPPT':
                this.fieldHidden.tdDiaryDate = true;
                break;
            default:
                this.fieldHidden.tdDiaryDate = true;
                break;
        }
        this.loadPipeLineGrid(this.inputParams);
    };
    PipelineGridComponent.prototype.loadListMenu = function () {
        this.MenuOptionListMenu = [];
        this.MenuOptionListMenu.push({ value: 'None', text: 'Options' });
        this.MenuOptionListMenu.push({ value: 'Contacts', text: 'Contacts' });
        this.MenuOptionListMenu.push({ value: 'ApprovalGrid', text: 'Contract Approval' });
        this.MenuOptionListMenu.push({ value: 'Diary', text: 'Diary' });
        this.MenuOptionListMenu.push({ value: 'DiaryDay', text: 'DiaryDay' });
        this.MenuOptionListMenu.push({ value: 'Prospect', text: 'Prospect' });
        this.MenuOptionListMenu.push({ value: 'NewProspect', text: 'Prospect (New)' });
        this.MenuOptionListMenu.push({ value: 'WorkOrders', text: 'Work Orders' });
        this.MenuOptionListMenu.splice(0, 1);
        this.menuSelectDropdown.defaultOption = { value: 'None', text: 'Options' };
    };
    PipelineGridComponent.prototype.menuSelectChange = function (obj) {
        this.uiForm.controls['menu'].setValue(obj);
        switch (obj) {
            case 'Diary':
                this.setControlValue('DiaryProspectNumber', this.getControlValue('PassProspectNumber'));
                alert('Cannot navigate as iCABSCMDiaryMaintenance.htm page is not ready!!');
                break;
            case 'DiaryDay':
                if (this.getControlValue('SelectFilter') !== 'WITHAPPTON') {
                    this.setControlValue('DiaryDate', this.utils.TodayAsDDMMYYYY());
                    this.dtDiaryDate = new Date(this.utils.formatDate(this.utils.TodayAsDDMMYYYY()));
                }
                this.setControlValue('DiaryProspectNumber', this.getControlValue('PassProspectNumber'));
                alert('Cannot navigate as iCABSCMDiaryMaintenance.htm page is not ready!!');
                break;
            case 'WorkOrders':
                alert('Cannot navigate as iCABSCMWorkOrderGrid.htm page is not ready!!');
                break;
            case 'Contacts':
                alert('Cannot navigate as iCABSCMCustomerContactMaintenance.htm page is not ready!!');
                this.loadPipeLineGrid(this.inputParams);
                break;
            case 'Prospect':
                this.runProspectMaintenance();
                break;
            case 'NewProspect':
                this.navigate('PipelineGridNew', '/prospecttocontract/maintenance/prospect', {
                    'ContactRowID': this.getControlValue('PassContactROWID'),
                    'ProspectNumber': this.getControlValue('PassProspectNumber')
                });
                break;
            case 'ApprovalGrid':
                this.navigate('ApprovalGrid', '/grid/sales/contractapprovalgrid');
                break;
            default:
                break;
        }
    };
    PipelineGridComponent.prototype.loadListInclusionType = function () {
        this.MenuOptionListInclusionType = [];
        this.MenuOptionListInclusionType.push({ value: 'OpenOnly', text: 'Open Prospects' });
        this.MenuOptionListInclusionType.push({ value: 'OpenOnlyWithDateRange', text: 'Open Prospects In Date Range' });
        this.MenuOptionListInclusionType.push({ value: 'OpenAndClosed', text: 'Open And Closed Prospects' });
        this.MenuOptionListInclusionType.push({ value: 'ClosedOnly', text: 'Closed Prospects' });
        this.MenuOptionListInclusionType.splice(0, 1);
        this.InclusionTypeSelectDropdown.defaultOption = { value: 'OpenOnly', text: 'Open Prospects' };
    };
    PipelineGridComponent.prototype.InclusionTypeSelectChange = function (obj) {
        this.uiForm.controls['InclusionTypeSelect'].setValue(obj);
        switch (obj) {
            case 'OpenOnly':
                this.fieldHidden.fromToDate = true;
                break;
            case 'OpenOnlyWithDateRange':
                this.fieldHidden.fromToDate = false;
                break;
            case 'OpenAndClosed':
                this.fieldHidden.fromToDate = false;
                break;
            case 'ClosedOnly':
                this.fieldHidden.fromToDate = false;
                break;
            default:
                this.fieldHidden.fromToDate = true;
                break;
        }
        this.loadPipeLineGrid(this.inputParams);
    };
    PipelineGridComponent.prototype.loadUserForm = function () {
        var _this = this;
        var formdata = {};
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        formdata['USERCODE'] = this.pageParams['gUserCode'];
        formdata['GridUserCode'] = this.pageParams['gUserCode'];
        formdata['Function'] = 'GetEmployeeFromUserCode';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.search, formdata)
            .subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e.errorMessage && e.errorMessage !== '') {
                    setTimeout(function () {
                        _this.errorService.emitError(e);
                    }, 200);
                }
                else {
                    _this.messageService.emitMessage(e);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.setControlValue('EmployeeCode', e.EmployeeCode);
            _this.setControlValue('EmployeeSurname', e.EmployeeSurname);
            _this.loadPipeLineGrid(_this.inputParams);
        }, function (error) {
            _this.errorMessage = error;
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    PipelineGridComponent.prototype.loadPipeLineGrid = function (params) {
        if (this.uiForm.controls['EmployeeCode'].value !== '') {
            this.setFilterValues(params);
            this.inputParams.search = this.search;
            this.postCodeGrid.loadGridData(this.inputParams);
        }
    };
    PipelineGridComponent.prototype.setFilterValues = function (params) {
        this.search = this.getURLSearchParamObject();
        this.search.set('EmployeeCode', this.uiForm.controls['EmployeeCode'].value);
        this.search.set('Status', this.uiForm.controls['StatusSelect'].value);
        this.search.set('OriginCode', this.uiForm.controls['OriginSelect'].value);
        this.search.set('LanguageCode', 'ENG');
        this.search.set('InclusionType', this.uiForm.controls['InclusionTypeSelect'].value);
        this.search.set('SOPReportQuoteStatus', '');
        this.search.set('SOPReportBranch', '');
        this.search.set('SOPReportRegion', '');
        this.search.set('RunFrom', this.uiForm.controls['RunFrom'].value);
        this.search.set('DiaryDate', this.uiForm.controls['DiaryDate'].value);
        this.search.set('Filter', this.uiForm.controls['SelectFilter'].value);
        this.search.set('MarketSegment', this.uiForm.controls['SelectMarketFilter'].value);
        this.search.set('FromDate', this.uiForm.controls['FromDate'].value);
        this.search.set('ToDate', this.uiForm.controls['ToDate'].value);
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', '1115064');
        this.search.set('PageSize', this.pageSize);
        this.search.set('PageCurrent', this.pageCurrent);
        this.search.set('HeaderClickedColumn', '');
        this.search.set('riSortOrder', 'Ascending');
        this.search.set(this.serviceConstants.Action, '2');
    };
    PipelineGridComponent.prototype.refresh = function (event) {
        this.pageCurrent = '1';
    };
    PipelineGridComponent.prototype.getCurrentPage = function (event) {
        this.pageCurrent = event.value;
        this.updateView();
    };
    PipelineGridComponent.prototype.updateView = function () {
        this.loadPipeLineGrid(this.inputParams);
    };
    PipelineGridComponent.prototype.getGridInfo = function (info) {
        this.totalRecords = info.totalRows;
    };
    PipelineGridComponent.prototype.onGridRowDblClick = function (eventObj) {
        var RowTypevalue = eventObj.trRowData[1].additionalData;
        var srcElementName = eventObj.columnClicked.text;
        var columnCellIndex = eventObj.cellIndex;
        var strContractTypeCode;
        if (RowTypevalue !== 'DIARYDATE') {
            this.setControlValue('PassProspectNumber', eventObj.trRowData[0].text);
            this.setControlValue('PassProspectName', eventObj.trRowData[2].text);
            this.setControlValue('PassProspectROWID', eventObj.trRowData[0].rowID);
        }
        switch (columnCellIndex) {
            case 0:
                this.runProspectMaintenance();
                break;
            case 1:
                if (RowTypevalue === 'DIARYDATE') {
                    alert('Cannot navigate as iCABSCMDiaryDayMaintenance.htm page is not ready!!');
                }
                else {
                    switch (RowTypevalue) {
                        case 'C':
                            strContractTypeCode = 'contract';
                            break;
                        case 'J':
                            strContractTypeCode = 'job';
                            break;
                        case 'P':
                            strContractTypeCode = 'product';
                            break;
                        default:
                            break;
                    }
                    this.navigate('PipelineGrid', '/contractmanagement/maintenance/' + strContractTypeCode, {
                        'ContractNumber': eventObj.cellData.text
                    });
                }
                break;
            case 10:
                if (this.uiForm.controls['ForceApptEntry'].value === 'Y') {
                    this.promptDiaryAppointmentContent = MessageConstant.Message.DiaryAppointmentRequiredQues;
                    this.promptDiaryAppointmentTitle = MessageConstant.Message.DiaryAppointmentRequiredTitle;
                    this.promptDiaryAppointmentModal.show();
                }
                else {
                    if (this.checkOldAppointmentExists()) {
                        if (!this.lClosingAppt) {
                            this.navigate('', '/grid/sales/PipelineQuoteGrid');
                            this.loadPipeLineGrid(this.inputParams);
                        }
                    }
                }
                break;
            case 18:
                if (this.checkOldAppointmentExists()) {
                    if (!this.lOldApptExists) {
                        alert('Cannot navigate as iCABSSProspectStatusChange.htm page is not ready!!');
                        this.loadPipeLineGrid(this.inputParams);
                    }
                }
                break;
            default:
                break;
        }
    };
    PipelineGridComponent.prototype.getCellData = function (eventObj) {
        var RowTypevalue = eventObj.trRowData[1].additionalData;
        if (RowTypevalue === 'DIARYDATE') {
            this.setControlValue('DiaryDate', eventObj.trRowData[1].text);
            this.dtDiaryDate = new Date(this.utils.formatDate(eventObj.trRowData[1].text));
            this.setControlValue('PassProspectName', '');
        }
        else {
            var prospectDetails = eventObj.trRowData[7].additionalData.split('|');
            this.setControlValue('PassProspectNumber', eventObj.trRowData[0].text);
            this.setControlValue('PassProspectName', eventObj.trRowData[2].text);
            this.setControlValue('ProspectContactName', prospectDetails[0]);
            this.setControlValue('ProspectContactPhone', prospectDetails[1]);
            this.setControlValue('ProspectContactMobile', prospectDetails[2]);
            this.setControlValue('ProspectSourceDesc', prospectDetails[3]);
            this.setControlValue('ProspectAppointmentDetails', prospectDetails[4]);
            this.setControlValue('ProspectTypeDesc', eventObj.trRowData[3].additionalData);
            this.setControlValue('ProspectNotes', eventObj.trRowData[6].additionalData);
            this.setControlValue('PassProspectROWID', eventObj.trRowData[0].rowID);
            this.setControlValue('PassContractROWID', eventObj.trRowData[1].rowID);
            this.setControlValue('PassContactROWID', eventObj.trRowData[11].additionalData);
            this.setControlValue('ProspectType', eventObj.trRowData[2].additionalData);
            this.setControlValue('PipelineGridProspectNumber', eventObj.trRowData[0].text);
            this.setControlValue('ForceApptEntry', eventObj.trRowData[5].additionalData);
            this.setControlValue('WarnOldOpenAppt', eventObj.trRowData[4].additionalData);
        }
    };
    PipelineGridComponent.prototype.cmdSelectReviewOnClick = function () {
        this.navigate('PipelineProspectGrid', '/ccm/centreReview');
    };
    PipelineGridComponent.prototype.runProspectMaintenance = function () {
        if (this.checkOldAppointmentExists()) {
            if (!this.lOldApptExists) {
                this.navigate('SalesOrder', '/prospecttocontract/maintenance/prospect', {
                    'ContactRowID': this.getControlValue('PassContactROWID'),
                    'ProspectNumber': this.getControlValue('PassProspectNumber')
                });
                this.loadPipeLineGrid(this.inputParams);
            }
        }
    };
    PipelineGridComponent.prototype.checkOldAppointmentExists = function () {
        this.lOldApptExists = false;
        this.lClosingAppt = false;
        if (this.getControlValue('WarnOldOpenAppt') !== '0') {
            this.lOldApptExists = true;
            this.promptAppointmentContent = MessageConstant.Message.OldAppointmentExistsQues;
            this.promptAppointmentTitle = MessageConstant.Message.OldAppointmentExistsTitle;
            this.promptAppointmentModal.show();
        }
        return true;
    };
    PipelineGridComponent.prototype.promptConfirm = function (type) {
        switch (type) {
            case 'close':
                this.lClosingAppt = true;
                this.setControlValue('PassWONumber', this.uiForm.controls['WarnOldOpenAppt'].value);
                alert('Cannot navigate as iCABSCMWorkOrderMaintenance.htm page is not ready!!');
                break;
            case 'diary':
                this.menuSelectChange('Diary');
                break;
            default:
                break;
        }
    };
    PipelineGridComponent.prototype.FromDateSelectedValue = function (value) {
        if (value && value.value) {
            this.uiForm.controls['FromDate'].setValue(value.value);
            this.loadPipeLineGrid(this.inputParams);
        }
    };
    ;
    PipelineGridComponent.prototype.ToDateSelectedValue = function (value) {
        if (value && value.value) {
            this.uiForm.controls['ToDate'].setValue(value.value);
            this.loadPipeLineGrid(this.inputParams);
        }
    };
    ;
    PipelineGridComponent.prototype.DiaryDateSelectedValue = function (value) {
        if (value && value.value) {
            this.uiForm.controls['DiaryDate'].setValue(value.value);
            this.dtDiaryDate = new Date(this.utils.formatDate(value.value));
            this.loadPipeLineGrid(this.inputParams);
        }
    };
    ;
    PipelineGridComponent.prototype.onEllipsisDataReceived = function (data, handle) {
        this.setControlValue('EmployeeCode', data.EmployeeCode);
        this.setControlValue('EmployeeSurname', data.EmployeeSurname);
        this.loadPipeLineGrid(this.inputParams);
    };
    ;
    PipelineGridComponent.prototype.employeeOnBlur = function () {
        this.getEmployeeName();
    };
    PipelineGridComponent.prototype.getEmployeeName = function () {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.inputParams.ActionUpdate);
        query.set(this.serviceConstants.BusinessCode, this.businessCode());
        query.set(this.serviceConstants.CountryCode, this.countryCode());
        this.inputParams.Function = 'GetEmployeeName';
        this.inputParams.EmployeeCode = this.getControlValue('EmployeeCode') ? this.getControlValue('EmployeeCode') : '';
        if (this.inputParams.EmployeeCode) {
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, query, this.inputParams)
                .subscribe(function (data) {
                if (data.status === 'failure') {
                    _this.errorService.emitError(data.info['error']);
                    _this.setControlValue('EmployeeSurname', '');
                }
                else {
                    if ((typeof data !== 'undefined' && data['errorMessage'])) {
                        _this.showErrorModal(data.errorMessage);
                        _this.setControlValue('EmployeeSurname', '');
                    }
                    else {
                        _this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                        _this.loadPipeLineGrid(_this.inputParams);
                        _this.riExchange.riInputElement.SetErrorStatus(_this.uiForm, 'EmployeeCode', false);
                    }
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.errorService.emitError(error);
                _this.riExchange.riInputElement.SetErrorStatus(_this.uiForm, 'EmployeeCode', true);
                _this.setControlValue('EmployeeSurname', '');
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
        else {
            this.setControlValue('EmployeeSurname', '');
        }
    };
    PipelineGridComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show(data, true);
    };
    PipelineGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSPipelineGrid.html'
                },] },
    ];
    PipelineGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    PipelineGridComponent.propDecorators = {
        'postCodeGrid': [{ type: ViewChild, args: ['postCodeGrid',] },],
        'postCodePagination': [{ type: ViewChild, args: ['postCodePagination',] },],
        'InclusionTypeSelectDropdown': [{ type: ViewChild, args: ['InclusionTypeSelectDropdown',] },],
        'menuSelectDropdown': [{ type: ViewChild, args: ['menuSelectDropdown',] },],
        'SelectFilterDropdown': [{ type: ViewChild, args: ['SelectFilterDropdown',] },],
        'StatusSelectDropdown': [{ type: ViewChild, args: ['StatusSelectDropdown',] },],
        'originSelectDropdown': [{ type: ViewChild, args: ['originSelectDropdown',] },],
        'marketSelectDropdown': [{ type: ViewChild, args: ['marketSelectDropdown',] },],
        'promptAppointmentModal': [{ type: ViewChild, args: ['promptAppointmentModal',] },],
        'promptDiaryAppointmentModal': [{ type: ViewChild, args: ['promptDiaryAppointmentModal',] },],
        'pipelineFromDatePicker': [{ type: ViewChild, args: ['pipelineFromDatePicker',] },],
        'pipelineToDatePicker': [{ type: ViewChild, args: ['pipelineToDatePicker',] },],
        'DiaryDatePicker': [{ type: ViewChild, args: ['DiaryDatePicker',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
    };
    return PipelineGridComponent;
}(BaseComponent));
