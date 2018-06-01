var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { RouteAwayGlobals } from './../../../shared/services/route-away-global.service';
import { BranchServiceAreaSearchComponent } from './../../internal/search/iCABSBBranchServiceAreaSearch';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, ViewChild, EventEmitter, Renderer, HostListener } from '@angular/core';
export var ServicePlanDeliveryNoteGridComponent = (function (_super) {
    __extends(ServicePlanDeliveryNoteGridComponent, _super);
    function ServicePlanDeliveryNoteGridComponent(injector, routeAwayGlobals, rendrer) {
        _super.call(this, injector);
        this.routeAwayGlobals = routeAwayGlobals;
        this.setFocusOnBranchServiceAreaCode = new EventEmitter();
        this.getweekNumber = false;
        this.totalRecords = 1;
        this.pageSize = 15;
        this.itemsPerPage = 10;
        this.curPage = 1;
        this.information2Display = false;
        this.ellipsisConfig = {
            serviceArea: {
                disabled: false,
                showHeader: true,
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    parentMode: 'LookUp-Emp',
                    showAddNew: false
                },
                component: BranchServiceAreaSearchComponent
            }
        };
        this.headerParams = {
            operation: 'Service/iCABSSeServicePlanDeliveryNoteGrid',
            module: 'delivery-note',
            method: 'service-delivery/maintenance'
        };
        this.pageId = '';
        this.controls = [
            { name: 'BranchServiceAreaCode' },
            { name: 'EmployeeSurname', disabled: true },
            { name: 'ServicePStartDate' },
            { name: 'ServicePEndDate' },
            { name: 'ServiceWeekNumber', disabled: true },
            { name: 'GridPageSize' },
            { name: 'GeneratedTypeFilter' },
            { name: 'BranchServiceAreaCodeList' },
            { name: 'ServicePlanNumbersList' },
            { name: 'SelectAction' },
            { name: 'GridName' },
            { name: 'GridCacheTime' },
            { name: 'ReportJobNumber' },
            { name: 'GenerateOption' },
            { name: 'IncludeLocations' },
            { name: 'NumberOfForms' },
            { name: 'previousEndDate' }
        ];
        this.pageId = PageIdentifier.ICABSSESERVICEPLANDELIVERYNOTEGRID;
    }
    ServicePlanDeliveryNoteGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.pageParams.startDate = new Date(this.utils.convertDate(this.getControlValue('ServicePStartDate')));
            this.pageParams.endDate = new Date(this.utils.convertDate(this.getControlValue('ServicePEndDate')));
            this.buildGrid();
        }
        else {
            this.getSysCharDtetails();
        }
    };
    ServicePlanDeliveryNoteGridComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    ServicePlanDeliveryNoteGridComponent.prototype.setDatePickerFormat = function (getDate) {
        if (window['moment'](getDate, 'DD/MM/YYYY', true).isValid()) {
            getDate = this.utils.convertDate(getDate);
        }
        else {
            getDate = this.utils.formatDate(getDate);
        }
        return new Date(getDate);
    };
    ServicePlanDeliveryNoteGridComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var sysCharList = [
            this.sysCharConstants.SystemCharEnableInstallsRemovals,
            this.sysCharConstants.SystemCharPrintServiceDocketsSeparately,
            this.sysCharConstants.SystemCharGenerateAllServicePlanRpts,
            this.sysCharConstants.SystemCharSingleServicePlanPerBranch
        ];
        var sysCharIP = {
            module: this.headerParams.module,
            operation: this.headerParams.operation,
            action: '0',
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe(function (data) {
            if (data.hasError) {
                _this.errorModal.show(data, true);
            }
            else {
                var record = data.records;
                _this.pageParams.enableInstallsRemovals = record[0]['Required'];
                _this.pageParams.printServiceDocketsSeparately = record[1]['Required'];
                _this.pageParams.generateAllServicePlanRpts = record[2]['Required'];
                _this.pageParams.enableSinglePlanPerBranch = record[3]['Required'];
                _this.pageParams.enableSinglePlanPerBranchLog = record[3]['Logical'];
                if (!_this.pageParams.enableSinglePlanPerBranch || !_this.pageParams.enableSinglePlanPerBranchLog) {
                    _this.pageParams.confirmedNullServiceA = true;
                }
                else {
                    _this.pageParams.confirmedNullServiceA = false;
                }
                _this.getLookupCallSearchParameter();
            }
        });
    };
    ServicePlanDeliveryNoteGridComponent.prototype.getLookupCallSearchParameter = function () {
        var _this = this;
        var lookUpSys = [{
                'table': 'SystemParameter',
                'query': {},
                'fields': ['SystemParameterEndOfWeekDay']
            }];
        this.LookUp.lookUpRecord(lookUpSys).subscribe(function (data) {
            if (data.hasError) {
                _this.errorModal.show(data, true);
            }
            else {
                if (data[0][0].SystemParameterEndOfWeekDay < 7) {
                    _this.pageParams.endofWeekDay = data[0][0].SystemParameterEndOfWeekDay;
                }
                else {
                    _this.pageParams.endofWeekDay = 1;
                }
                var today = new Date();
                _this.pageParams.endofWeekDate = ((6 - today.getDay()) + _this.pageParams.endofWeekDay);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.window_onload();
            }
        });
    };
    ServicePlanDeliveryNoteGridComponent.prototype.window_onload = function () {
        this.setControlValue('GridName', 'GenServList');
        this.setControlValue('GeneratedTypeFilter', '0');
        this.setControlValue('GridCacheTime', this.utils.Time());
        this.setControlValue('GridPageSize', this.pageSize);
        this.buildGrid();
        this.setFocusOnBranchServiceAreaCode.emit(true);
        if (this.pageParams.generateAllServicePlanRpts) {
            this.pageParams.showDivGenerate = true;
        }
        else {
            this.pageParams.showDivGenerate = false;
        }
        this.pageParams.showRefreshGrid = true;
        if (this.pageParams.generateAllServicePlanRpts) {
            this.pageParams.showGenerateSel = false;
            this.pageParams.showPrintSelected = false;
            this.pageParams.showSelectAll = false;
            this.pageParams.showSelectNone = false;
        }
        else {
            this.pageParams.showGenerateSel = true;
            this.pageParams.showPrintSelected = true;
            this.pageParams.showSelectAll = true;
            this.pageParams.showSelectNone = true;
        }
        var sDate = this.utils.addDays(new Date(), this.pageParams.endofWeekDate + 1);
        var eDate = this.utils.addDays(new Date(), this.pageParams.endofWeekDate + 7);
        this.pageParams.startDate = new Date(this.utils.convertDate(sDate.toString()));
        this.pageParams.endDate = new Date(this.utils.convertDate(eDate.toString()));
        this.setControlValue('ServicePStartDate', sDate);
        this.setControlValue('ServicePEndDate', eDate);
    };
    ServicePlanDeliveryNoteGridComponent.prototype.buildGrid = function () {
        this.pageParams.addColumns = 0;
        this.riGrid.Clear();
        if ((this.utils.trim(this.getControlValue('BranchServiceAreaCode')) === '' || !this.getControlValue('BranchServiceAreaCode')) && this.pageParams.confirmedNullServiceA) {
            this.riGrid.AddColumn('BranchServiceAreaCode', 'ServicePlan', 'BranchServiceAreaCode', MntConst.eTypeText, 5, true);
            this.riGrid.AddColumnAlign('BranchServiceAreaCode', MntConst.eAlignmentCenter);
            this.riGrid.AddColumnOrderable('BranchServiceAreaCode', true);
            this.pageParams.addColumns = this.pageParams.addColumns + 1;
        }
        this.riGrid.AddColumn('ServicePlanNumber', 'ServicePlan', 'ServicePlanNumber', MntConst.eTypeInteger, 5, true);
        this.riGrid.AddColumnAlign('ServicePlanNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('ServicePlanNumber', true);
        this.riGrid.AddColumn('ServicePlanStartDate', 'ServicePlan', 'ServicePlanStartDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ServicePlanStartDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('ServicePlanStartDate', true);
        this.riGrid.AddColumn('ServicePlanEndDate', 'ServicePlan', 'ServicePlanEndDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ServicePlanEndDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServiceWeekNumber', 'ServicePlan', 'ServiceWeekNumber', MntConst.eTypeInteger, 2);
        this.riGrid.AddColumnAlign('ServiceWeekNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServicePlanNoOfCalls', 'ServicePlan', 'ServicePlanNoOfCalls', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumnAlign('ServicePlanNoOfCalls', MntConst.eAlignmentCenter);
        if (this.pageParams.enableInstallsRemovals) {
            this.riGrid.AddColumn('ServicePlanNoOfExchanges', 'ServicePlan', 'ServicePlanNoOfExchanges', MntConst.eTypeInteger, 4);
            this.riGrid.AddColumnAlign('ServicePlanNoOfExchanges', MntConst.eAlignmentCenter);
            this.pageParams.addColumns = this.pageParams.addColumns + 1;
        }
        this.riGrid.AddColumn('ServicePlanTime', 'ServicePlan', 'ServicePlanTime', MntConst.eTypeText, 5);
        this.riGrid.AddColumnAlign('ServicePlanTime', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServicePlanNettValue', 'ServicePlan', 'ServicePlanNettValue', MntConst.eTypeCurrency, 10);
        this.riGrid.AddColumnAlign('ServicePlanNettValue', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServicePlanStatusDesc', 'ServicePlan', 'ServicePlanStatusDesc', MntConst.eTypeText, 20);
        this.riGrid.AddColumnAlign('ServicePlanStatusDesc', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ReportNumber', 'ServicePlan', 'ReportNumber', MntConst.eTypeInteger, 9);
        if (this.pageParams.printServiceDocketsSeparately) {
            this.riGrid.AddColumn('GenerationDate', 'ServicePlan', 'GenerationDate', MntConst.eTypeDate, 10);
            this.riGrid.AddColumnOrderable('GenerationDate', true);
            this.riGrid.AddColumn('PrintSummaryOnly', 'ServicePlan', 'PrintSummaryOnly', MntConst.eTypeImage, 1, true);
            this.riGrid.AddColumn('PrintPickingListOnly', 'ServicePlan', 'PrintPickingListOnly', MntConst.eTypeImage, 1, true);
            this.riGrid.AddColumn('PrintServiceDocketOnly', 'ServicePlan', 'PrintServiceDocketOnly', MntConst.eTypeImage, 1, true);
            this.riGrid.AddColumn('ServiceDocketPrint', 'ServicePlan', 'ServiceDocketPrint', MntConst.eTypeImage, 1, true);
        }
        else {
            this.riGrid.AddColumn('ServiceDocketPrint', 'ServicePlan', 'ServiceDocketPrint', MntConst.eTypeImage, 1, true);
        }
        if (!this.pageParams.generateAllServicePlanRpts) {
            this.riGrid.AddColumn('SelectLine', 'ServicePlan', 'SelectLine', MntConst.eTypeImage, 1, true);
        }
        this.riGrid.Complete();
    };
    ServicePlanDeliveryNoteGridComponent.prototype.riGrid_BeforeExecute = function () {
        var _this = this;
        this.riGrid.FunctionPaging = true;
        var gridParams = new URLSearchParams();
        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        gridParams.set(this.serviceConstants.CountryCode, this.countryCode());
        gridParams.set('BranchNumber', this.utils.getBranchCode());
        gridParams.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));
        gridParams.set('ServicePStartDate', this.getControlValue('ServicePStartDate'));
        gridParams.set('ServicePEndDate', this.getControlValue('ServicePEndDate'));
        gridParams.set('GeneratedTypeFilter', this.getControlValue('GeneratedTypeFilter'));
        gridParams.set('SelectAction', this.getControlValue('SelectAction'));
        gridParams.set('GridName', this.getControlValue('GridName'));
        gridParams.set('GridCacheTime', this.getControlValue('GridCacheTime'));
        gridParams.set('WeekNumber', this.getControlValue('ServiceWeekNumber'));
        gridParams.set('ServicePlanStatusCode', 'All');
        gridParams.set('GridMode', 'ServiceListing');
        if (this.getControlValue('SelectAction') === 'SelectLine') {
            gridParams.set('ROWID', this.getAttribute('ServicePlanRowID'));
        }
        gridParams.set(this.serviceConstants.GridMode, '0');
        gridParams.set(this.serviceConstants.GridHandle, this.utils.gridHandle);
        gridParams.set(this.serviceConstants.GridCacheRefresh, 'true');
        gridParams.set(this.serviceConstants.PageSize, this.getControlValue('GridPageSize'));
        gridParams.set(this.serviceConstants.PageCurrent, this.curPage.toString());
        gridParams.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        gridParams.set(this.serviceConstants.GridSortOrder, this.riGrid.SortOrder);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, gridParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.hasError) {
                _this.errorModal.modal(data.errorMessage, true);
            }
            else {
                if (_this.pageParams.isSelectAllProcessing) {
                    _this.setControlValue('SelectAction', '');
                    _this.pageParams.isSelectAllProcessing = false;
                    _this.riGrid_BeforeExecute();
                }
                if (_this.riGrid.Update && _this.getControlValue('SelectAction') === 'SelectLine') {
                    _this.riGrid.StartRow = _this.getAttribute('Row');
                    _this.riGrid.StartColumn = 0;
                    _this.riGrid.RowID = _this.getAttribute('ServicePlanRowID');
                    _this.riGrid.UpdateHeader = false;
                    _this.riGrid.UpdateBody = true;
                    _this.riGrid.UpdateFooter = true;
                    _this.setControlValue('SelectAction', '');
                    _this.riGrid_BeforeExecute();
                    return;
                }
                else {
                    _this.riGrid.RefreshRequired();
                }
                _this.totalRecords = _this.pageSize * data.pageData.lastPageNumber;
                _this.riGrid.Execute(data);
            }
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServicePlanDeliveryNoteGridComponent.prototype.ServiceCoverFocus = function (srcElement) {
        var oTR = srcElement.parentElement.parentElement.parentElement;
        srcElement.focus();
        if ((this.utils.trim(this.getControlValue('BranchServiceAreaCode')) === '' || this.getControlValue('BranchServiceAreaCode') === null) && this.pageParams.confirmedNullServiceA) {
            this.setAttribute('ServicePlanRowID', oTR.children[0 + 1].children[0].children[0].getAttribute('RowID'));
            this.setAttribute('BranchServiceAreaCode', oTR.children[0].children[0].innerText);
            this.setAttribute('ServicePlanStartDate', oTR.children[1 + 1].children[0].innerText);
            this.setAttribute('ServicePlanEndDate', oTR.children[2 + 1].children[0].innerText);
            this.setAttribute('Row', oTR.sectionRowIndex);
            this.setAttribute('ServicePlanNumber', oTR.children[0 + 1].children[0].children[0].value);
            this.setAttribute('ReportNumber', oTR.children[8 + this.pageParams.addColumns].children[0].innerText);
        }
        else {
            this.setAttribute('ServicePlanRowID', oTR.children[0].children[0].children[0].getAttribute('RowID'));
            this.setAttribute('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));
            this.setAttribute('ServicePlanStartDate', oTR.children[1].children[0].innerText);
            this.setAttribute('ServicePlanEndDate', oTR.children[2].children[0].innerText);
            this.setAttribute('Row', oTR.sectionRowIndex);
            this.setAttribute('ServicePlanNumber', oTR.children[0].children[0].children[0].value);
            this.setAttribute('ReportNumber', oTR.children[8 + this.pageParams.addColumns].children[0].innerText);
        }
    };
    ServicePlanDeliveryNoteGridComponent.prototype.riGrid_BodyOnDblClick = function (event) {
        var _this = this;
        this.ServiceCoverFocus(event.srcElement);
        switch (this.riGrid.CurrentColumnName) {
            case 'ServicePlanNumber':
                if (this.getAttribute('ServicePlanNumber')) {
                    this.navigate('', 'business/ServicePlanDeliveryNoteGeneration', {
                        'ServicePlanNumber': this.riGrid.Details.GetValue(this.riGrid.CurrentColumnName)
                    });
                }
                break;
            case 'ServiceDocketPrint':
            case 'PrintSummaryOnly':
            case 'PrintPickingListOnly':
            case 'PrintServiceDocketOnly':
                var strURL_1, vReportNumber = void 0;
                vReportNumber = this.getAttribute('ReportNumber');
                var searchParams = new URLSearchParams();
                searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
                searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
                searchParams.set(this.serviceConstants.Action, '0');
                searchParams.set('ReportNumber', vReportNumber.trim(''));
                searchParams.set('PremiseNumber', '0');
                searchParams.set('PrintType', this.riGrid.CurrentColumnName);
                this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams).subscribe(function (data) {
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                    _this.logger.log(data.hasError);
                    if (data.hasError) {
                        data.msg = data.errorMessage || data.fullError;
                        _this.errorModal.show(data, true);
                        return;
                    }
                    else {
                        strURL_1 = data.url;
                        window.open(strURL_1, '_blank');
                    }
                }, function (error) {
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                });
                break;
        }
    };
    ServicePlanDeliveryNoteGridComponent.prototype.riGrid_BodyOnClick = function (event) {
        switch (this.riGrid.CurrentColumnName) {
            case 'SelectLine':
                this.setControlValue('SelectAction', 'SelectLine');
                this.ServiceCoverFocus(event.srcElement);
                this.riGrid.Update = true;
                this.riGrid_BeforeExecute();
                break;
        }
    };
    ServicePlanDeliveryNoteGridComponent.prototype.riGrid_Sort = function (event) {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    };
    ServicePlanDeliveryNoteGridComponent.prototype.cmdSelectAll_onclick = function () {
        this.riGrid.RefreshRequired();
        this.setControlValue('SelectAction', 'SelectAll');
        this.riGrid.Update = true;
        this.riGrid_BeforeExecute();
        this.pageParams.isSelectAllProcessing = true;
    };
    ServicePlanDeliveryNoteGridComponent.prototype.cmdRefreshGrid_onclick = function () {
        this.riGrid.RefreshRequired();
        this.setControlValue('GridCacheTime', this.utils.Time());
        this.setControlValue('SelectAction', '');
        this.riGrid_BeforeExecute();
    };
    ServicePlanDeliveryNoteGridComponent.prototype.cmdSelectNone_onclick = function () {
        this.riGrid.RefreshRequired();
        this.setControlValue('SelectAction', 'SelectNone');
        this.riGrid.Update = true;
        this.riGrid_BeforeExecute();
        this.pageParams.isSelectAllProcessing = true;
    };
    ServicePlanDeliveryNoteGridComponent.prototype.cmdGenerateSel_onclick = function () {
        var _this = this;
        this.promptTitle = 'Confirm Generate';
        this.getTranslatedValue(this.promptTitle, null).subscribe(function (res) {
            if (res) {
                _this.promptTitle = res;
            }
        });
        this.promptContent = 'Are You Sure You Want To Generate the Selected Items?';
        this.getTranslatedValue(this.promptContent, null).subscribe(function (res) {
            if (res) {
                _this.promptContent = res;
            }
        });
        this.promptSaveMode = 'Generate';
        this.promptModal.show();
    };
    ServicePlanDeliveryNoteGridComponent.prototype.cmdPrintSelected_onclick = function () {
        var _this = this;
        this.setControlValue('SelectAction', 'PrintSelected');
        this.promptTitle = 'Confirm Print';
        this.getTranslatedValue(this.promptTitle, null).subscribe(function (res) {
            if (res) {
                _this.promptTitle = res;
            }
        });
        this.promptContent = 'Are You Sure You Want To Print the Selected Items?';
        this.getTranslatedValue(this.promptContent, null).subscribe(function (res) {
            if (res) {
                _this.promptContent = res;
            }
        });
        this.promptSaveMode = 'Print';
        this.promptModal.show();
    };
    ServicePlanDeliveryNoteGridComponent.prototype.promptSave = function (event) {
        switch (this.promptSaveMode) {
            case 'Generate':
                this.setControlValue('SelectAction', 'GenerateSel');
                this.navigate('', 'business/ServicePlanDeliveryNoteGeneration');
                break;
            case 'Print':
                this.cmdReportGeneration_onclick();
                this.setControlValue('SelectAction', '');
                break;
        }
    };
    ServicePlanDeliveryNoteGridComponent.prototype.printReport = function () {
        var _this = this;
        var postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '0');
        var postParams = {};
        var strURL;
        postParams.ReportNumber = this.getControlValue('ReportJobNumber');
        postParams.PremiseNumber = '0';
        postParams.PrintType = '';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, postSearchParams, postParams)
            .subscribe(function (e) {
            if (e.hasError) {
                _this.errorModal.show(e, true);
            }
            else {
                strURL = e.URLReturn;
                _this.navigate('', strURL);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServicePlanDeliveryNoteGridComponent.prototype.document_onkeydown = function (ev) {
        var _this = this;
        var ServicePStartDate = this.utils.convertDate(this.getControlValue('ServicePStartDate').toString());
        var ServicePEndDate = this.utils.convertDate(this.getControlValue('ServicePEndDate').toString());
        if (this.getControlValue('ServicePStartDate') && this.getControlValue('ServicePEndDate')) {
            switch (ev.keyCode) {
                case 106:
                    ev.returnValue = 0;
                    this.pageParams.startDate = this.setDatePickerFormat(this.utils.addDays(new Date(this.pageParams.endofWeekDate), 1).toString());
                    this.pageParams.endDate = this.setDatePickerFormat(this.utils.addDays(new Date(this.pageParams.endofWeekDate), 7).toString());
                    this.getLatestWeekNumber();
                    this.riGrid.RefreshRequired();
                    this.ClearTable();
                    break;
                case 107:
                    ev.returnValue = 0;
                    this.pageParams.startDate = this.setDatePickerFormat(this.utils.addDays(ServicePStartDate, 7).toString());
                    this.pageParams.endDate = this.setDatePickerFormat(this.utils.addDays(ServicePEndDate, 7).toString());
                    this.getLatestWeekNumber();
                    this.riGrid.RefreshRequired();
                    this.ClearTable();
                    break;
                case 109:
                    ev.returnValue = 0;
                    this.pageParams.startDate = this.setDatePickerFormat(this.utils.addDays(ServicePStartDate, -7).toString());
                    this.pageParams.endDate = this.setDatePickerFormat(this.utils.addDays(ServicePEndDate, -7).toString());
                    if (this.pageParams.endDate < new Date()) {
                        var description_1 = 'Plan Week Has Already Passed';
                        this.getTranslatedValue(description_1, null).subscribe(function (res) {
                            if (res) {
                                description_1 = res;
                            }
                            _this.errorModal.show(description_1, false);
                        });
                    }
                    this.getLatestWeekNumber();
                    this.riGrid.RefreshRequired();
                    this.ClearTable();
                    break;
            }
        }
    };
    ServicePlanDeliveryNoteGridComponent.prototype.getLatestWeekNumber = function () {
        var _this = this;
        if (this.getControlValue('ServicePStartDate') && this.getControlValue('ServicePEndDate')) {
            var postSearchParams = this.getURLSearchParamObject();
            postSearchParams.set(this.serviceConstants.Action, '6');
            var postParams = {};
            postParams.Function = 'GetLatestWeekNumber';
            postParams.ServicePStartDate = this.getControlValue('ServicePStartDate');
            postParams.ServicePEndDate = this.getControlValue('ServicePEndDate');
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, postSearchParams, postParams)
                .subscribe(function (e) {
                if (e.hasError) {
                    _this.errorModal.show(e, true);
                }
                else {
                    _this.setControlValue('ServiceWeekNumber', e.WeekNumber);
                }
                _this.riGrid.ResetGrid();
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.errorService.emitError(error);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
    };
    ServicePlanDeliveryNoteGridComponent.prototype.riExchange_CBORequest = function () {
        if (this.getControlValue('previousEndDate') !== this.getControlValue('ServicePStartDate')) {
            if (this.getControlValue('ServicePStartDate') && this.getControlValue('ServicePEndDate')) {
                this.getLatestWeekNumber();
                this.riGrid.RefreshRequired();
                this.ClearTable();
            }
            else {
                this.setControlValue('ServiceWeekNumber', '');
            }
        }
    };
    ServicePlanDeliveryNoteGridComponent.prototype.riGrid_BodyOnKeyDown = function (event) {
        switch (event.keyCode) {
            case 38:
                event.returnValue = 0;
                if (event.srcElement.parentElement.parentElement.parentElement.previousSibling) {
                    if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children) {
                        if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex]) {
                            if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]) {
                                this.ServiceCoverFocus(event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }
                }
                break;
            case 40:
            case 9:
                event.returnValue = 0;
                if (event.srcElement.parentElement.parentElement.parentElement.nextSibling) {
                    if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children) {
                        if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex]) {
                            if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]) {
                                this.ServiceCoverFocus(event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }
                }
                break;
        }
    };
    ServicePlanDeliveryNoteGridComponent.prototype.branchServiceAreaCode_ondeactivate = function (event) {
        if (!this.getControlValue('BranchServiceAreaCode') || this.getControlValue('BranchServiceAreaCode') === '') {
            this.setControlValue('EmployeeSurname', '');
        }
    };
    ServicePlanDeliveryNoteGridComponent.prototype.branchServiceAreaCode_onchange = function (event) {
        var _this = this;
        if (this.getControlValue('BranchServiceAreaCode')) {
            var searchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
            searchParams.set('BranchNumber', this.utils.getBranchCode());
            searchParams.set(this.serviceConstants.Action, '0');
            searchParams.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));
            this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams).subscribe(function (data) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    _this.setControlValue('EmployeeSurname', '');
                    _this.buildGrid();
                    _this.riGrid.RefreshRequired();
                    _this.errorModal.show(data, true);
                    return;
                }
                else {
                    _this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                    _this.buildGrid();
                    _this.riGrid.RefreshRequired();
                }
            }, function (error) {
                _this.setControlValue('EmployeeSurname', '');
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
        else {
            this.setControlValue('EmployeeSurname', '');
            this.buildGrid();
            this.riGrid.RefreshRequired();
        }
    };
    ServicePlanDeliveryNoteGridComponent.prototype.riExchange_UpDateHTMLDocument = function () {
        this.buildGrid();
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    };
    ServicePlanDeliveryNoteGridComponent.prototype.cmdReportGeneration_onclick = function () {
        var _this = this;
        var postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '2');
        postSearchParams.set('BranchNumber', this.utils.getBranchCode());
        var postParams = {};
        postParams.BranchServiceAreaCode = this.getControlValue('BranchServiceAreaCode');
        postParams.ServicePStartDate = this.getControlValue('ServicePStartDate');
        postParams.ServicePEndDate = this.getControlValue('ServicePEndDate');
        postParams.ServicePlanStatusCode = 'All';
        postParams.WeekNumber = this.getControlValue('ServiceWeekNumber');
        postParams.GeneratedTypeFilter = this.getControlValue('GeneratedTypeFilter');
        if (this.pageParams.generateAllServicePlanRpts) {
            postParams.Function = 'BuildReportGenerationListAmbius';
        }
        else {
            postParams.Function = '';
            postParams.GridName = 'GenServList';
            postParams.SelectAction = this.getControlValue('SelectAction');
            postParams.GridCacheTime = this.getControlValue('GridCacheTime');
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, postSearchParams, postParams)
            .subscribe(function (e) {
            if (e.hasError) {
                _this.errorModal.show(e, true);
            }
            else {
                _this.setControlValue('ServicePlanNumbersList', e.ServicePlanNumbersList);
                _this.setControlValue('BranchServiceAreaCodeList', e.BranchServiceAreaCodeList);
                var strServiceAreasNumbers = void 0, strServiceNumbers = void 0, intCount = void 0;
                if (_this.getControlValue('ServicePlanNumbersList') && _this.getControlValue('BranchServiceAreaCodeList')) {
                    if (_this.pageParams.generateAllServicePlanRpts) {
                        strServiceAreasNumbers = _this.getControlValue('BranchServiceAreaCodeList').split(',');
                        strServiceNumbers = _this.getControlValue('ServicePlanNumbersList').split(',');
                        intCount = 0;
                        do {
                            _this.generateServicePlanReportInfo(strServiceAreasNumbers[intCount], strServiceNumbers[intCount]);
                            intCount += 1;
                        } while (intCount < strServiceAreasNumbers.length);
                    }
                    else {
                        _this.setControlValue('ReportJobNumber', e.ReportNumber);
                        if (_this.getControlValue('SelectAction') === 'PrintSelected') {
                            _this.printReport();
                        }
                        else {
                            if (_this.getControlValue('GenerateOption') === 'Both') {
                                _this.setControlValue('GenerateOption', 'Receipts');
                            }
                            _this.generateServicePlanReportInfo(_this.getControlValue('BranchServiceAreaCodeList'), _this.getControlValue('ServicePlanNumbersList'));
                        }
                    }
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServicePlanDeliveryNoteGridComponent.prototype.generateServicePlanReportInfo = function (BSACode, SPNumber) {
        var _this = this;
        var strProgramName, strReportDesc = '';
        if (this.pageParams.generateAllServicePlanRpts) {
            strProgramName = 'iCABSServiceDeliveryNoteReportGeneration.p';
        }
        else {
            switch (this.getControlValue('GenerateOption')) {
                case 'Listing':
                    strProgramName = 'iCABSServiceDeliveryNoteListGeneration.p';
                    strReportDesc = 'Service Listing';
                    break;
                case 'ListingRem':
                    strProgramName = 'iCABSServiceDeliveryNoteListRemGeneration.p';
                    strReportDesc = 'Service Listing - Removals Only';
                    break;
                case 'Receipts':
                    strProgramName = 'iCABSServiceDeliveryNoteReportGeneration.p';
                    strReportDesc = 'Service Receipts';
                    break;
                case 'Both':
                    strProgramName = 'iCABSServiceDeliveryNoteListGeneration.p';
                    strReportDesc = 'Service Listing';
                    break;
                case 'TimeSheet':
                    strProgramName = 'iCABSServiceTimeSheetGeneration.p';
                    strReportDesc = 'Service Worklist and Timesheet';
                    break;
            }
            this.getTranslatedValue(strReportDesc, null).subscribe(function (res) {
                if (res) {
                    strReportDesc = res;
                }
            });
        }
        var strTransReceiptDesc, areaText, planText;
        areaText = 'Area';
        this.getTranslatedValue('Area', null).subscribe(function (res) {
            if (res) {
                areaText = res;
            }
        });
        planText = 'Plan';
        this.getTranslatedValue('Plan', null).subscribe(function (res) {
            if (res) {
                planText = res;
            }
        });
        strTransReceiptDesc = strReportDesc + ' - ' + areaText + ' ' + BSACode + ' - ' + planText + ' ' + SPNumber;
        var strDescription = strTransReceiptDesc;
        var strStartDate = this.utils.formatDate(new Date());
        var date = new Date();
        var strStartTime = this.utils.hmsToSeconds(this.utils.Time());
        var strParamName = 'BusinessCode|BranchNumber|BranchServiceAreaCode|ServicePlanNumber|IncludeLocations|NumberOfForms|RepManDest';
        var strParamValue = this.businessCode() + '|' + this.utils.getBranchCode() + '|' + BSACode + '|' + SPNumber + '|' + 'false' + '|' + '4' + '|' + 'batch|ReportID';
        var postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '0');
        var postParams = {};
        postParams.Description = strDescription;
        postParams.ProgramName = strProgramName;
        postParams.StartDate = strStartDate;
        postParams.StartTime = strStartTime;
        postParams.Report = 'report';
        postParams.ParameterName = strParamName;
        postParams.ParameterValue = strParamValue;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, postSearchParams, postParams)
            .subscribe(function (e) {
            _this.information2Display = true;
            _this.information2 = e.fullError;
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServicePlanDeliveryNoteGridComponent.prototype.onServiceAreaCodeChange = function (data) {
        var _this = this;
        var searchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set('BranchNumber', this.utils.getBranchCode());
        searchParams.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.setControlValue('BranchServiceAreaCode', _this.getControlValue('BranchServiceAreaCode').toUpperCase());
            if (data.hasError) {
                _this.errorModal.show(data.errorMessage, true);
                return;
            }
            _this.setControlValue('EmployeeSurname', data.EmployeeSurname);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServicePlanDeliveryNoteGridComponent.prototype.serviceAreaSearch = function (data) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCode', data.BranchServiceAreaCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', data.EmployeeSurname);
        this.riExchange_UpDateHTMLDocument();
    };
    ServicePlanDeliveryNoteGridComponent.prototype.effectiveDate_onChange = function (value, fieldName) {
        if (value && value.value) {
            if (fieldName === 'ServicePEndDate' && this.getweekNumber) {
                this.setControlValue('previousEndDate', this.getControlValue('ServicePEndDate'));
            }
            this.setControlValue(fieldName, value.value);
            if (fieldName === 'ServicePEndDate') {
                if (this.getweekNumber) {
                    this.riExchange_CBORequest();
                }
                else {
                    this.getweekNumber = true;
                }
            }
        }
        else {
            this.setControlValue(fieldName, '');
        }
    };
    ServicePlanDeliveryNoteGridComponent.prototype.refresh = function () {
        this.setControlValue('GridCacheTime', this.utils.Time());
        this.setControlValue('SelectAction', '');
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    };
    ServicePlanDeliveryNoteGridComponent.prototype.getCurrentPage = function (currentPage) {
        this.curPage = currentPage.value;
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    };
    ServicePlanDeliveryNoteGridComponent.prototype.ClearTable = function () {
        this.riGrid.ResetGrid();
    };
    ServicePlanDeliveryNoteGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSeServicePlanDeliveryNoteGrid.html'
                },] },
    ];
    ServicePlanDeliveryNoteGridComponent.ctorParameters = [
        { type: Injector, },
        { type: RouteAwayGlobals, },
        { type: Renderer, },
    ];
    ServicePlanDeliveryNoteGridComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
        'document_onkeydown': [{ type: HostListener, args: ['document:keydown', ['$event'],] },],
    };
    return ServicePlanDeliveryNoteGridComponent;
}(BaseComponent));
