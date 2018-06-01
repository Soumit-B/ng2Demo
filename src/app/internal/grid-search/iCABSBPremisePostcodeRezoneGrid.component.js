var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { BranchServiceAreaSearchComponent } from './../search/iCABSBBranchServiceAreaSearch';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, ViewChild } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
export var PremisePostcodeRezoneGridComponent = (function (_super) {
    __extends(PremisePostcodeRezoneGridComponent, _super);
    function PremisePostcodeRezoneGridComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.menu = '';
        this.formKeys = [];
        this.pageVariables = {
            savecancelFlag: true,
            isRequesting: false,
            requiredFormControlsObj: { 'BranchServiceAreaCode': false, 'SeqNumberFrom': false, 'SeqNumberTo': false, 'BranchServiceAreaCodeTo': false },
            requiredFormControlsOptional: { 'ServiceVisitFrequency': false },
            saveClicked: false,
            rezoneAllFlag: true,
            rezoneAllClick: false,
            rezoneColumnTick: false,
            rezonedRowIndex: { rowIndex: '', cellIndex: '' },
            PortfolioStatusType: ['All', 'Current', 'NonCurrent'],
            rezoneColumnClick: false
        };
        this.search = new URLSearchParams();
        this.xhrParams = {
            method: 'service-delivery/maintenance',
            module: 'areas',
            operation: 'Business/iCABSBPremisePostcodeRezoneGrid'
        };
        this.gridConfig = {
            premisePost: {
                maxColumn: 14,
                gridCurPage: 1,
                gridSortHeaders: [],
                pageSize: 10,
                gridSortOrder: 'Descending',
                gridHeaderClickedColumn: '',
                currentPage: 1
            }
        };
        this.promptConfig = {
            forSave: {
                showPromptMessageHeader: true,
                promptConfirmTitle: '',
                promptConfirmContent: MessageConstant.Message.ConfirmRecord
            },
            promptFlag: 'save',
            config: {
                ignoreBackdropClick: true
            },
            isRequesting: false
        };
        this.messageModalConfig = {
            showMessageHeader: true,
            config: {
                ignoreBackdropClick: true
            },
            title: '',
            content: '',
            showCloseButton: true
        };
        this.controls = [{ name: 'BranchServiceAreaCode', readonly: false, disabled: false, required: false },
            { name: 'BranchServiceAreaDesc', readonly: false, disabled: true, required: false },
            { name: 'SeqNumberFrom', readonly: false, disabled: false, required: false },
            { name: 'SeqNumberTo', readonly: false, disabled: false, required: false },
            { name: 'BranchServiceAreaCodeTo', readonly: false, required: false },
            { name: 'BranchServiceAreaDescTo', readonly: false, disabled: true, required: false },
            { name: 'TargetSeqNumber', readonly: false, disabled: false, required: false },
            { name: 'ServiceType', readonly: false, disabled: false, required: false },
            { name: 'SequenceGap', readonly: false, disabled: false, required: false },
            { name: 'ProductGroup', readonly: false, disabled: false, required: false },
            { name: 'PortfolioStatusType', readonly: false, disabled: false, required: false },
            { name: 'ServiceVisitFrequency', readonly: false, disabled: false, required: false },
            { name: 'ContractTypeCode', readonly: false, disabled: false, required: false },
            { name: 'PostcodeFilter', readonly: false, disabled: false, required: false },
            { name: 'StateFilter', readonly: false, disabled: false, required: false },
            { name: 'ProductServiceGroupCode', readonly: false, disabled: false, required: false },
            { name: 'ProductServiceGroupDesc', readonly: false, disabled: false, required: false },
            { name: 'ServiceTypeCode', readonly: false, disabled: false, required: false },
            { name: 'ServiceTypeDesc', readonly: false, disabled: false, required: false },
            { name: 'ErrorMessageDesc', readonly: false, disabled: false, required: false },
            { name: 'TownFilter', readonly: false, disabled: false, required: false },
            { name: 'PassToPDAInd', readonly: false, disabled: false, required: false },
            { name: 'InstallationRequired', readonly: false, disabled: false, required: false },
            { name: 'EngineerRequiredInd', readonly: false, disabled: false, required: false },
            { name: 'FrequencyRequiredInd', readonly: false, disabled: false, required: false },
            { name: 'BusinessContractTypes', readonly: false, disabled: false, required: false },
            { name: 'ServiceCoverRowID', readonly: false, disabled: false, required: false },
            { name: 'ThirdPartyServiceInd', readonly: false, disabled: false, required: false },
            { name: 'CustomerSpecificInd', readonly: false, disabled: false, required: false },
            { name: 'AllowUndo', readonly: false, disabled: false, required: false },
            { name: 'UndoRowids', readonly: false, disabled: false, required: false },
            { name: 'BranchNumber', readonly: false, disabled: false, required: false },
            { name: 'BusinessCode', readonly: false, disabled: false, required: false }
        ];
        this.ellipseConfig = {
            branchServiceAreaSearc: {
                inputParams: {
                    parentMode: 'LookUp',
                    businessCode: this.utils.getBusinessCode(),
                    countryCode: this.utils.getCountryCode()
                },
                isDisabled: false,
                isRequired: false,
                showCloseButton: true,
                config: {
                    ignoreBackdropClick: true
                },
                showHeader: true
            }
        };
        this.dropDownConfig = {
            ContractTypeCode: {
                ContractTypeCodeList: [{ text: 'All', value: 'All' }]
            }
        };
        this.branchServiceAreaSearcComponent = BranchServiceAreaSearchComponent;
        this.pageId = PageIdentifier.ICABSASERVICECOVERSELECTMAINTENANCE;
        this.pageTitle = '';
    }
    PremisePostcodeRezoneGridComponent.prototype.getSelectedRowInfo = function (eventObj) {
        this.pageVariables.rezonedRowIndex = { rowIndex: eventObj.rowIndex, cellIndex: eventObj.cellIndex };
        var imgObj = document.querySelector('icabs-grid > table > tbody > tr:nth-child(' + (parseInt(this.pageVariables.rezonedRowIndex.rowIndex) + 1).toString() + ') > td:nth-child(' + (parseInt(this.pageVariables.rezonedRowIndex.cellIndex) + 1).toString() + ') > div > img');
        if (imgObj) {
            var imgString = imgObj.getAttribute('src');
            if (imgString.indexOf('tick-icon') > -1) {
                this.pageVariables.rezoneColumnTick = true;
            }
            else {
                this.pageVariables.rezoneColumnTick = false;
            }
        }
        if (eventObj.cellIndex === 13) {
            if (this.formValidation('BranchServiceAreaCodeTo') === 0) {
                var branchServiceAreaCodeTo = this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCodeTo');
                if (branchServiceAreaCodeTo === '' || branchServiceAreaCodeTo === undefined) {
                    this.uiForm.controls['BranchServiceAreaCodeTo'].setErrors({ remote: true });
                }
                else {
                    this.uiForm.controls['BranchServiceAreaCodeTo'].clearValidators();
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverRowID', eventObj.cellData.rowID);
                    this.pageVariables.rezoneColumnClick = true;
                    this.search.set('ROWID', eventObj.cellData.rowID);
                    this.lookupSearch('Rezone', eventObj.cellData.rowID);
                }
            }
        }
    };
    PremisePostcodeRezoneGridComponent.prototype.getGridInfo = function (eventObj) {
        this.totalRecords = eventObj.totalRows;
    };
    PremisePostcodeRezoneGridComponent.prototype.sortGrid = function (eventObj) {
        this.gridConfig.premisePost.gridHeaderClickedColumn = eventObj.fieldname;
        this.gridConfig.premisePost.gridSortOrder = eventObj.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.buildGrid();
    };
    PremisePostcodeRezoneGridComponent.prototype.branchServiceAreaSearcDataReceived = function (eventObj) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCode', eventObj.BranchServiceAreaCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaDesc', eventObj.BranchServiceAreaDesc);
        this.PopulateDescriptions('BranchServiceAreaCode');
        this.formValidation('BranchServiceAreaCode');
    };
    PremisePostcodeRezoneGridComponent.prototype.branchServiceDataReceived = function (eventObj) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCodeTo', eventObj.BranchServiceAreaCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaDescTo', eventObj.BranchServiceAreaDesc);
        this.PopulateDescriptions('BranchServiceAreaCodeTo');
        this.formValidation('BranchServiceAreaCodeTo');
    };
    PremisePostcodeRezoneGridComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Service Area Portfolio Rezoning';
        this.initForm();
        this.uiFormValueChanges = this.uiForm.statusChanges.subscribe(function (value) {
            _this.formChanges(value);
        });
        this.getUrlParams();
        this.getFormKeys();
        this.BuildMenuOptions();
        this.sorHeaderColumns();
        this.uiForm.controls['PortfolioStatusType'].setValue('All');
        this.uiForm.controls['FrequencyRequiredInd'].setValue('False');
        this.uiForm.controls['PassToPDAInd'].setValue('False');
        this.uiForm.controls['InstallationRequired'].setValue('False');
        this.uiForm.controls['EngineerRequiredInd'].setValue('False');
        this.uiForm.controls['ThirdPartyServiceInd'].setValue('False');
        this.uiForm.controls['CustomerSpecificInd'].setValue('False');
    };
    PremisePostcodeRezoneGridComponent.prototype.sorHeaderColumns = function () {
        this.gridConfig.premisePost.gridSortHeaders = [{
                'fieldName': 'Area',
                'index': 0,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'SeqNo',
                'index': 1,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'ProductCode',
                'index': 4,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'ServiceTypeCode',
                'index': 7,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'ProductServiceGroupCode',
                'index': 8,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'PremisePostcode',
                'index': 9,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'Suburb',
                'index': 11,
                'sortType': 'ASC'
            }];
    };
    PremisePostcodeRezoneGridComponent.prototype.initForm = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchNumber', this.utils.getBranchCode());
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessCode', this.utils.getBusinessCode());
        this.uiForm.controls['TargetSeqNumber'].setValue(0);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SequenceGap', '10');
        this.riExchange.renderForm(this.uiForm, this.controls);
    };
    PremisePostcodeRezoneGridComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        this.uiFormValueChanges.unsubscribe();
    };
    PremisePostcodeRezoneGridComponent.prototype.getFormKeys = function () {
        for (var j = 0; j < this.controls.length; j++) {
            this.formKeys.push(this.controls[j].name);
        }
    };
    PremisePostcodeRezoneGridComponent.prototype.formChanges = function (obj) {
        if (obj === 'VALID') {
            this.pageVariables.savecancelFlag = false;
        }
        else {
            this.pageVariables.savecancelFlag = true;
        }
        if (!this.uiForm.pristine)
            this.formValidation();
    };
    PremisePostcodeRezoneGridComponent.prototype.promptConfirm = function (eventObj) {
        switch (this.promptConfig.promptFlag) {
            case 'save':
                break;
            default:
                break;
        }
    };
    PremisePostcodeRezoneGridComponent.prototype.promptCancel = function (eventObj) {
        switch (this.promptConfig.promptFlag) {
            case 'save':
                break;
            default:
                break;
        }
    };
    PremisePostcodeRezoneGridComponent.prototype.messageModalClose = function () {
    };
    PremisePostcodeRezoneGridComponent.prototype.BuildMenuOptions = function () {
        this.lookupSearch('BuildMenuOptions');
    };
    PremisePostcodeRezoneGridComponent.prototype.PopulateDescriptions = function (flag) {
        if (flag === 'BranchServiceAreaCode') {
            if (this.uiForm.controls['BranchServiceAreaCode'].value === '') {
                this.uiForm.controls['BranchServiceAreaDesc'].setValue('');
            }
        }
        if (flag === 'BranchServiceAreaCodeTo') {
            if (this.uiForm.controls['BranchServiceAreaCodeTo'].value === '') {
                this.uiForm.controls['BranchServiceAreaDescTo'].setValue('');
            }
            else {
                this.formValidation('BranchServiceAreaCodeTo');
            }
        }
        this.lookupSearch('PopulateDescriptions');
    };
    PremisePostcodeRezoneGridComponent.prototype.lookupSearch = function (key, rowId) {
        var _this = this;
        switch (key) {
            case 'BuildMenuOptions':
                var searchPost = new URLSearchParams();
                var postParams = {};
                postParams['Function'] = 'GetBusinessContractTypes';
                postParams['methodtype'] = 'maintenance';
                searchPost.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                searchPost.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                searchPost.set(this.serviceConstants.Action, '6');
                this.ajaxSource.next(this.ajaxconstant.START);
                this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, searchPost, postParams)
                    .subscribe(function (e) {
                    if (e['status'] === 'failure') {
                        _this.errorService.emitError(e['oResponse']);
                    }
                    else {
                        if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                            _this.errorService.emitError(e['oResponse']);
                        }
                        else if (e['errorMessage']) {
                            _this.errorService.emitError(e);
                        }
                        else {
                            var BusinessContractTypes = e.BusinessContractTypes;
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BusinessContractTypes', BusinessContractTypes);
                            BusinessContractTypes = BusinessContractTypes.split(',');
                            for (var i = 0; i < BusinessContractTypes.length; i++) {
                                if (BusinessContractTypes[i] === 'C') {
                                    _this.dropDownConfig.ContractTypeCode.ContractTypeCodeList.push({ text: 'Contracts', value: 'C' });
                                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractTypeCode', 'C');
                                }
                                if (BusinessContractTypes[i] === 'J') {
                                    _this.dropDownConfig.ContractTypeCode.ContractTypeCodeList.push({ text: 'Jobs', value: 'J' });
                                }
                                if (BusinessContractTypes[i] === 'P') {
                                    _this.dropDownConfig.ContractTypeCode.ContractTypeCodeList.push({ text: 'Product Sales', value: 'P' });
                                }
                            }
                        }
                    }
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                }, function (error) {
                    _this.errorService.emitError(error);
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                });
                break;
            case 'PopulateDescriptions':
                searchPost = new URLSearchParams();
                postParams = {};
                postParams['Function'] = 'GetDescriptions';
                postParams['methodtype'] = 'maintenance';
                postParams['BranchNumber'] = this.utils.getBranchCode();
                postParams['BranchServiceAreaCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode');
                postParams['BranchServiceAreaCodeTo'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCodeTo');
                postParams['ProductServiceGroupCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductServiceGroupCode');
                postParams['ServiceTypeCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceTypeCode');
                postParams['ProductServiceGroupCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductServiceGroupCode');
                searchPost.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                searchPost.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                searchPost.set(this.serviceConstants.Action, '6');
                this.ajaxSource.next(this.ajaxconstant.START);
                this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, searchPost, postParams)
                    .subscribe(function (e) {
                    if (e['status'] === 'failure') {
                        _this.errorService.emitError(e['oResponse']);
                    }
                    else {
                        if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'] && e.oResponse['error'])) {
                            _this.errorService.emitError(e['oResponse']);
                        }
                        else if (e['errorMessage']) {
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ErrorMessageDesc', e.ErrorMessageDesc);
                            if (e.hasOwnProperty('BranchServiceAreaDesc'))
                                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchServiceAreaDesc', e.BranchServiceAreaDesc);
                            if (e.hasOwnProperty('BranchServiceAreaDescTo'))
                                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchServiceAreaDescTo', e.BranchServiceAreaDescTo);
                            if (e.hasOwnProperty('ServiceTypeDesc'))
                                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceTypeDesc', e.ServiceTypeDesc);
                            if (e.hasOwnProperty('ProductServiceGroupDesc'))
                                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductServiceGroupDesc', e.ProductServiceGroupDesc);
                            _this.messageModal.show({ msg: e['errorMessage'], title: 'Message' }, false);
                        }
                        else {
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ErrorMessageDesc', e.ErrorMessageDesc);
                            if (e.hasOwnProperty('BranchServiceAreaDesc'))
                                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchServiceAreaDesc', e.BranchServiceAreaDesc);
                            if (e.hasOwnProperty('BranchServiceAreaDescTo'))
                                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchServiceAreaDescTo', e.BranchServiceAreaDescTo);
                            if (e.hasOwnProperty('ServiceTypeDesc'))
                                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceTypeDesc', e.ServiceTypeDesc);
                            if (e.hasOwnProperty('ProductServiceGroupDesc'))
                                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductServiceGroupDesc', e.ProductServiceGroupDesc);
                        }
                    }
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                }, function (error) {
                    _this.errorService.emitError(error);
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                });
                break;
            case 'Rezone':
                searchPost = new URLSearchParams();
                searchPost.set(this.serviceConstants.Action, '6');
                searchPost.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                searchPost.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                postParams = {};
                postParams['Function'] = 'Rezone';
                postParams['ServiceCoverRowID'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverRowID');
                postParams['TargetSeqNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'TargetSeqNumber');
                postParams['SequenceGap'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'SequenceGap');
                postParams['BranchNumber'] = this.utils.getBranchCode();
                if (this.pageVariables.rezoneColumnTick) {
                    postParams['BranchServiceAreaCodeTo'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode');
                }
                else {
                    postParams['BranchServiceAreaCodeTo'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCodeTo');
                }
                this.ajaxSource.next(this.ajaxconstant.START);
                this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, searchPost, postParams).subscribe(function (data) {
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                    if (data.errorMessage) {
                        if (data.errorMessage !== '') {
                            _this.messageModal.show({ msg: data.errorMessage, title: ' ' }, false);
                        }
                    }
                    else {
                        _this.buildGrid(rowId);
                    }
                });
                break;
            case 'RezoneGroup':
                searchPost = new URLSearchParams();
                postParams = {};
                postParams['methodtype'] = 'maintenance';
                postParams['Function'] = 'RezoneGroup';
                postParams['BranchNumber'] = this.utils.getBranchCode();
                postParams['BranchServiceAreaCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode');
                postParams['BranchServiceAreaCodeTo'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCodeTo');
                postParams['ServiceTypeCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceTypeCode');
                postParams['PostcodeFilter'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PostcodeFilter');
                postParams['StateFilter'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'StateFilter');
                postParams['TownFilter'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'TownFilter');
                postParams['SeqNumberFrom'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'SeqNumberFrom');
                postParams['SeqNumberTo'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'SeqNumberTo');
                postParams['TargetSeqNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'TargetSeqNumber');
                postParams['SequenceGap'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'SequenceGap');
                postParams['ContractTypeCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractTypeCode');
                postParams['PortfolioStatusType'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PortfolioStatusType');
                postParams['ProductServiceGroupCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductServiceGroupCode');
                postParams['ServiceVisitFrequency'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceVisitFrequency');
                postParams['FrequencyRequiredInd'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'FrequencyRequiredInd');
                postParams['PassToPDAInd'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PassToPDAInd');
                postParams['InstallationRequired'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'InstallationRequired');
                postParams['EngineerRequiredInd'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'EngineerRequiredInd');
                postParams['ThirdPartyServiceInd'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ThirdPartyServiceInd');
                postParams['CustomerSpecificInd'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'CustomerSpecificInd');
                postParams['AllowUndo'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'AllowUndo');
                searchPost.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                searchPost.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                searchPost.set(this.serviceConstants.Action, '6');
                this.ajaxSource.next(this.ajaxconstant.START);
                this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, searchPost, postParams)
                    .subscribe(function (e) {
                    if (e['status'] === 'failure') {
                        _this.errorService.emitError(e['oResponse']);
                    }
                    else {
                        if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'] && e.oResponse['error'])) {
                            _this.errorService.emitError(e['oResponse']);
                        }
                        else if (e['errorMessage']) {
                            _this.errorService.emitError(e);
                        }
                        else {
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'UndoRowids', e.UndoRowids);
                            _this.pageVariables.rezoneAllFlag = false;
                            _this.buildGrid();
                        }
                    }
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                }, function (error) {
                    _this.errorService.emitError(error);
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                });
                break;
            case 'UndoRezone':
                searchPost = new URLSearchParams();
                postParams = {};
                postParams['methodtype'] = 'maintenance';
                postParams['Function'] = 'UndoRezone';
                postParams['BranchNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchNumber');
                postParams['BranchServiceAreaCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode');
                postParams['BranchServiceAreaCodeTo'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCodeTo');
                postParams['ServiceTypeCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceTypeCode');
                postParams['PostcodeFilter'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PostcodeFilter');
                postParams['StateFilter'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'StateFilter');
                postParams['TownFilter'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'TownFilter');
                postParams['SeqNumberFrom'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'SeqNumberFrom');
                postParams['SeqNumberTo'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'SeqNumberTo');
                postParams['TargetSeqNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'TargetSeqNumber');
                postParams['SequenceGap'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'SequenceGap');
                postParams['ContractTypeCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractTypeCode');
                postParams['PortfolioStatusType'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PortfolioStatusType');
                postParams['ProductServiceGroupCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductServiceGroupCode');
                postParams['UndoRowids'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'UndoRowids');
                searchPost.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                searchPost.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                searchPost.set(this.serviceConstants.Action, '6');
                this.ajaxSource.next(this.ajaxconstant.START);
                this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, searchPost, postParams)
                    .subscribe(function (e) {
                    if (e['status'] === 'failure') {
                        _this.errorService.emitError(e['oResponse']);
                    }
                    else {
                        if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'] && e.oResponse['error'])) {
                            _this.errorService.emitError(e['oResponse']);
                        }
                        else if (e['errorMessage']) {
                            _this.errorService.emitError(e);
                        }
                        else {
                            var msg = e['errorMessage'];
                        }
                    }
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                    _this.buildGrid();
                    _this.pageVariables.rezoneAllFlag = true;
                }, function (error) {
                    _this.errorService.emitError(error);
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                });
                break;
            default:
                break;
        }
    };
    PremisePostcodeRezoneGridComponent.prototype.invokeLookupSearch = function (queryParams, data) {
        this.ajaxSource.next(this.ajaxconstant.START);
        return this.httpService.lookUpRequest(queryParams, data);
    };
    PremisePostcodeRezoneGridComponent.prototype.getUrlParams = function () {
        var _this = this;
        this.activatedRoute.queryParams.subscribe(function (params) {
            if (params.hasOwnProperty('BranchServiceAreaCode')) {
                _this.uiForm.controls['BranchServiceAreaCode'].setValue(params['BranchServiceAreaCode']);
            }
            if (params.hasOwnProperty('BranchServiceAreaCodeTo')) {
                _this.uiForm.controls['BranchServiceAreaCodeTo'].setValue(params['BranchServiceAreaCodeTo']);
            }
            if (params.hasOwnProperty('SeqNumberFrom')) {
                _this.uiForm.controls['SeqNumberFrom'].setValue(params['SeqNumberFrom']);
            }
            if (params.hasOwnProperty('SeqNumberTo')) {
                _this.uiForm.controls['SeqNumberTo'].setValue(params['SeqNumberTo']);
            }
            if (params.hasOwnProperty('TargetSeqNumber')) {
                _this.uiForm.controls['TargetSeqNumber'].setValue(params['TargetSeqNumber']);
            }
            if (params.hasOwnProperty('PostcodeFilter')) {
                _this.uiForm.controls['PostcodeFilter'].setValue(params['PostcodeFilter']);
            }
            if (params.hasOwnProperty('StateFilter')) {
                _this.uiForm.controls['StateFilter'].setValue(params['StateFilter']);
            }
            if (params.hasOwnProperty('TownFilter')) {
                _this.uiForm.controls['TownFilter'].setValue(params['TownFilter']);
            }
            if (params.hasOwnProperty('ContractTypeCode')) {
                _this.uiForm.controls['ContractTypeCode'].setValue(params['ContractTypeCode']);
            }
            if (params.hasOwnProperty('PortfolioStatusType')) {
                _this.uiForm.controls['PortfolioStatusType'].setValue(params['PortfolioStatusType']);
            }
            if (params.hasOwnProperty('ServiceVisitFrequency')) {
                _this.uiForm.controls['ServiceVisitFrequency'].setValue(params['ServiceVisitFrequency']);
            }
            if (params.hasOwnProperty('FrequencyRequiredInd')) {
                _this.uiForm.controls['FrequencyRequiredInd'].setValue(params['FrequencyRequiredInd']);
            }
            if (params.hasOwnProperty('PassToPDAInd')) {
                _this.uiForm.controls['PassToPDAInd'].setValue(params['PassToPDAInd']);
            }
            if (params.hasOwnProperty('InstallationRequired')) {
                _this.uiForm.controls['InstallationRequired'].setValue(params['InstallationRequired']);
            }
            if (params.hasOwnProperty('EngineerRequiredInd')) {
                _this.uiForm.controls['EngineerRequiredInd'].setValue(params['EngineerRequiredInd']);
            }
            if (params.hasOwnProperty('ThirdPartyServiceInd')) {
                _this.uiForm.controls['ThirdPartyServiceInd'].setValue(params['ThirdPartyServiceInd']);
            }
            if (params.hasOwnProperty('CustomerSpecificInd')) {
                _this.uiForm.controls['CustomerSpecificInd'].setValue(params['CustomerSpecificInd']);
            }
        });
    };
    PremisePostcodeRezoneGridComponent.prototype.buildGrid = function (rowId) {
        if (this.pageVariables.rezoneColumnClick) {
            this.pageVariables.rezoneColumnClick = false;
        }
        else {
            this.search.delete('ROWID');
        }
        this.search.set('BranchNumber', this.utils.getBranchCode());
        this.search.set('BranchServiceAreaCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode'));
        this.search.set('BranchServiceAreaCodeTo', this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCodeTo'));
        this.search.set('SeqNumberFrom', this.riExchange.riInputElement.GetValue(this.uiForm, 'SeqNumberFrom'));
        this.search.set('SeqNumberTo', this.riExchange.riInputElement.GetValue(this.uiForm, 'SeqNumberFrom'));
        this.search.set('TargetSeqNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'TargetSeqNumber'));
        this.search.set('ServiceTypeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceTypeCode'));
        this.search.set('ProductServiceGroupCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductServiceGroupCode'));
        this.search.set('PostcodeFilter', this.riExchange.riInputElement.GetValue(this.uiForm, 'PostcodeFilter'));
        this.search.set('StateFilter', this.riExchange.riInputElement.GetValue(this.uiForm, 'StateFilter'));
        this.search.set('TownFilter', this.riExchange.riInputElement.GetValue(this.uiForm, 'TownFilter'));
        this.search.set('ContractTypeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractTypeCode'));
        this.search.set('PortfolioStatusType', this.riExchange.riInputElement.GetValue(this.uiForm, 'PortfolioStatusType'));
        this.search.set('ServiceVisitFrequency', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceVisitFrequency'));
        this.search.set('FrequencyRequiredInd', this.riExchange.riInputElement.GetValue(this.uiForm, 'FrequencyRequiredInd'));
        this.search.set('PassToPDAInd', this.riExchange.riInputElement.GetValue(this.uiForm, 'PassToPDAInd'));
        this.search.set('InstallationRequired', this.riExchange.riInputElement.GetValue(this.uiForm, 'InstallationRequired'));
        this.search.set('EngineerRequiredInd', this.riExchange.riInputElement.GetValue(this.uiForm, 'EngineerRequiredInd'));
        this.search.set('ThirdPartyServiceInd', this.riExchange.riInputElement.GetValue(this.uiForm, 'ThirdPartyServiceInd'));
        this.search.set('CustomerSpecificInd', this.riExchange.riInputElement.GetValue(this.uiForm, 'CustomerSpecificInd'));
        this.search.set('riSortOrder', this.gridConfig.premisePost.gridSortOrder);
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.gridConfig.premisePost.gridHeaderClickedColumn);
        this.search.set(this.serviceConstants.GridSortOrder, this.gridConfig.premisePost.gridSortOrder);
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, '31720710');
        this.search.set(this.serviceConstants.GridCacheRefresh, 'True');
        this.search.set(this.serviceConstants.GridPageSize, this.gridConfig.premisePost.pageSize.toString());
        this.search.set(this.serviceConstants.GridPageCurrent, this.gridConfig.premisePost.gridCurPage.toString());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, '2');
        var apiParams = {};
        apiParams.module = this.xhrParams.module;
        apiParams.method = this.xhrParams.method;
        apiParams.operation = this.xhrParams.operation;
        apiParams.search = this.search;
        this.premisePostCodeRezoneGrid.itemsPerPage = this.gridConfig.premisePost.pageSize;
        this.premisePostCodeRezoneGrid.loadGridData(apiParams, rowId);
    };
    PremisePostcodeRezoneGridComponent.prototype.cmdUndo_onclick = function () {
        this.pageVariables.saveClicked = true;
        if (this.formValidation() === 0) {
            this.lookupSearch('UndoRezone');
        }
    };
    PremisePostcodeRezoneGridComponent.prototype.cmdRezone_onclick = function () {
        this.pageVariables.saveClicked = true;
        if (this.formValidation() === 0) {
            this.pageVariables.rezoneAllClick = true;
            this.lookupSearch('RezoneGroup');
        }
    };
    PremisePostcodeRezoneGridComponent.prototype.refresh = function () {
        this.buildGrid();
    };
    PremisePostcodeRezoneGridComponent.prototype.cmdProduct_onclick = function () {
        this.messageModal.show({ msg: 'iCABSBPremisePostcodeRezoneProductFilter is under construction', title: 'Message' }, false);
    };
    PremisePostcodeRezoneGridComponent.prototype.getCurrentPage = function (data) {
        this.gridConfig.premisePost.gridCurPage = data.value;
        this.gridConfig.premisePost.currentPage = this.gridConfig.premisePost.gridCurPage;
        this.buildGrid();
    };
    PremisePostcodeRezoneGridComponent.prototype.formValidation = function (keyName) {
        var status = 0;
        if (keyName) {
            if (this.uiForm.controls[keyName].value === null) {
                this.pageVariables.requiredFormControlsObj[keyName] = true;
                status = 1;
            }
            else if (this.uiForm.controls[keyName].value.trim() === '') {
                this.pageVariables.requiredFormControlsObj[keyName] = true;
                status = 1;
            }
            else {
                this.pageVariables.requiredFormControlsObj[keyName] = false;
            }
            if (keyName === 'ServiceVisitFrequency') {
                var ServiceVisitFrequency = this.uiForm.controls['ServiceVisitFrequency'].value;
                if (isNaN(ServiceVisitFrequency)) {
                    this.pageVariables.requiredFormControlsOptional[keyName] = true;
                    status = 1;
                }
                else if (ServiceVisitFrequency.length > 9) {
                    this.pageVariables.requiredFormControlsOptional[keyName] = true;
                    status = 1;
                }
                else {
                    this.pageVariables.requiredFormControlsOptional[keyName] = false;
                    status = 0;
                }
            }
        }
        else {
            if (this.pageVariables.saveClicked) {
                for (var key in this.pageVariables.requiredFormControlsObj) {
                    if (key) {
                        if (this.uiForm.controls[key].value === null) {
                            this.pageVariables.requiredFormControlsObj[key] = true;
                            status = 1;
                        }
                        else if (this.uiForm.controls[key].value.trim() === '') {
                            this.pageVariables.requiredFormControlsObj[key] = true;
                            status = 1;
                        }
                        else {
                            if (key === 'CompanyInvoiceNumber') {
                                if (isNaN(this.uiForm.controls[key].value)) {
                                    this.pageVariables.requiredFormControlsObj[key] = true;
                                    status = 1;
                                }
                                else {
                                    this.pageVariables.requiredFormControlsObj[key] = false;
                                }
                            }
                            else {
                                this.pageVariables.requiredFormControlsObj[key] = false;
                            }
                        }
                    }
                }
            }
        }
        return status;
    };
    PremisePostcodeRezoneGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBPremisePostcodeRezoneGrid.html'
                },] },
    ];
    PremisePostcodeRezoneGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    PremisePostcodeRezoneGridComponent.propDecorators = {
        'premisePostCodeRezoneGrid': [{ type: ViewChild, args: ['premisePostCodeRezoneGrid',] },],
        'apiPagination': [{ type: ViewChild, args: ['ApiGridPagination',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return PremisePostcodeRezoneGridComponent;
}(BaseComponent));
