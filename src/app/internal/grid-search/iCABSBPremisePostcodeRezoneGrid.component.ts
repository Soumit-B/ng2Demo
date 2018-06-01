import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { Observable } from 'rxjs';
import { BranchServiceAreaSearchComponent } from './../search/iCABSBBranchServiceAreaSearch';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { GridComponent } from '../../../shared/components/grid/grid';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { ProductServiceGroupSearchComponent } from './../search/iCABSBProductServiceGroupSearch.component';
import { ServiceTypeSearchComponent } from '../../../app/internal/search/iCABSBServiceTypeSearch.component';

@Component({
    templateUrl: 'iCABSBPremisePostcodeRezoneGrid.html'
})

export class PremisePostcodeRezoneGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('premisePostCodeRezoneGrid') premisePostCodeRezoneGrid: GridComponent;
    @ViewChild('ApiGridPagination') apiPagination: PaginationComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('productServiceGroupDropdown') productServiceGroupDropdown: ProductServiceGroupSearchComponent;
    @ViewChild('serviceTypeSearchDropDown') serviceTypeSearchDropDown: ServiceTypeSearchComponent;

    public dropdown = {
        serviceTypeSearch: {
            isRequired: false,
            isDisabled: false,
            params: {
                parentMode: 'LookUp'
            }
        }
    };
    public pageId: string = '';
    public menu = '';
    public formKeys = [];
    public uiFormValueChanges: any;
    public pageVariables = {
        savecancelFlag: true,
        isRequesting: false,
        requiredFormControlsObj: { 'BranchServiceAreaCode': false, 'SeqNumberFrom': false, 'SeqNumberTo': false, 'BranchServiceAreaCodeTo': false },
        nonRequiredFormControlsObj: { 'TargetSeqNumber': false, 'SequenceGap': false },
        requiredFormControlsOptional: { 'ServiceVisitFrequency': false },
        saveClicked: false,
        rezoneAllFlag: true,
        rezoneAllClick: false,
        rezoneColumnTick: false,
        rezonedRowIndex: { rowIndex: '', cellIndex: '' },
        PortfolioStatusType: ['All', 'Current', 'NonCurrent'],
        rezoneColumnClick: false
    };
    public search: URLSearchParams = new URLSearchParams();
    public xhrParams = {
        method: 'service-delivery/maintenance',
        module: 'areas',
        operation: 'Business/iCABSBPremisePostcodeRezoneGrid'
    };
    public gridConfig = {
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
    public totalRecords: number;
    public getSelectedRowInfo(eventObj: any): void {
        this.pageVariables.rezonedRowIndex = { rowIndex: eventObj.rowIndex, cellIndex: eventObj.cellIndex };
        // tslint:disable-next-line:radix
        let imgObj = document.querySelector('icabs-grid > table > tbody > tr:nth-child(' + (parseInt(this.pageVariables.rezonedRowIndex.rowIndex) + 1).toString() + ') > td:nth-child(' + (parseInt(this.pageVariables.rezonedRowIndex.cellIndex) + 1).toString() + ') > div > img');
        if (imgObj) {
            let imgString = imgObj.getAttribute('src');
            if (imgString.indexOf('tick-icon') > -1) {
                this.pageVariables.rezoneColumnTick = true;
            } else {
                this.pageVariables.rezoneColumnTick = false;
            }
        }

        if (eventObj.cellIndex === 13) {
            if (this.formValidation('BranchServiceAreaCodeTo') === 0) {
                let branchServiceAreaCodeTo = this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCodeTo');
                if (branchServiceAreaCodeTo === '' || branchServiceAreaCodeTo === undefined) {
                    this.uiForm.controls['BranchServiceAreaCodeTo'].setErrors({ remote: true });
                } else {
                    this.uiForm.controls['BranchServiceAreaCodeTo'].clearValidators();
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverRowID', eventObj.cellData.rowID);
                    this.pageVariables.rezoneColumnClick = true;
                    this.search.set('ROWID', eventObj.cellData.rowID);
                    this.lookupSearch('Rezone', eventObj.cellData.rowID);
                }
            }
        }
    }
    public onCapitalize(control: any): void {
        if (this.uiForm.controls[control])
            this.uiForm.controls[control].setValue(this.uiForm.controls[control].value.toString().toUpperCase());
    }
    public getGridInfo(eventObj: any): void {
        this.totalRecords = eventObj.totalRows;
    }
    public sortGrid(eventObj: any): void {
        this.gridConfig.premisePost.gridHeaderClickedColumn = eventObj.fieldname;
        this.gridConfig.premisePost.gridSortOrder = eventObj.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.buildGrid();
    }
    public promptConfig = {
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
    public messageModalConfig = {
        showMessageHeader: true,
        config: {
            ignoreBackdropClick: true
        },
        title: '',
        content: '',
        showCloseButton: true
    };
    public controls = [{ name: 'BranchServiceAreaCode', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
    { name: 'BranchServiceAreaDesc', readonly: false, disabled: true, required: false, type: MntConst.eTypeText },
    { name: 'SeqNumberFrom', readonly: false, disabled: false, required: false, type: MntConst.eTypeInteger },
    { name: 'SeqNumberTo', readonly: false, disabled: false, required: false, type: MntConst.eTypeInteger },
    { name: 'BranchServiceAreaCodeTo', readonly: false, required: false, type: MntConst.eTypeCode },
    { name: 'BranchServiceAreaDescTo', readonly: false, disabled: true, required: false, type: MntConst.eTypeText },
    { name: 'TargetSeqNumber', readonly: false, disabled: false, required: false, type: MntConst.eTypeInteger },
    { name: 'ServiceType', readonly: false, disabled: false, required: false },
    { name: 'SequenceGap', readonly: false, disabled: false, required: false, type: MntConst.eTypeInteger },
    { name: 'ProductGroup', readonly: false, disabled: false, required: false },
    { name: 'PortfolioStatusType', readonly: false, disabled: false, required: false },
    { name: 'ServiceVisitFrequency', readonly: false, disabled: false, required: false, type: MntConst.eTypeInteger },
    { name: 'ContractTypeCode', readonly: false, disabled: false, required: false },
    { name: 'PostcodeFilter', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
    { name: 'StateFilter', readonly: false, disabled: false, required: false, type: MntConst.eTypeText },
    { name: 'ProductServiceGroupCode', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
    { name: 'ProductServiceGroupDesc', readonly: false, disabled: false, required: false, type: MntConst.eTypeText },
    { name: 'ServiceTypeCode', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
    { name: 'ServiceTypeDesc', readonly: false, disabled: false, required: false, type: MntConst.eTypeText },
    { name: 'ErrorMessageDesc', readonly: false, disabled: false, required: false },
    { name: 'TownFilter', readonly: false, disabled: false, required: false, type: MntConst.eTypeText },
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

    public ellipseConfig = {
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

    public dropDownConfig = {
        ContractTypeCode: {
            ContractTypeCodeList: [{ text: 'All', value: 'All' }]
        }
    };

    public searchConfigs: any = {
        productServiceGroupSearch: {
            isDisabled: false,
            isRequired: true,
            params: {
                parentMode: 'LookUp',
                ProductServiceGroupString: '',
                SearchValue3: '',
                ProductServiceGroupCode: ''
            },
            active: {
                id: '',
                text: ''
            }
        }
    };

    public branchServiceAreaSearcComponent = BranchServiceAreaSearchComponent;
    public branchServiceAreaSearcDataReceived(eventObj: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCode', eventObj.BranchServiceAreaCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaDesc', eventObj.BranchServiceAreaDesc);
        this.PopulateDescriptions('BranchServiceAreaCode');
        this.formValidation('BranchServiceAreaCode');
    }
    public branchServiceDataReceived(eventObj: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCodeTo', eventObj.BranchServiceAreaCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaDescTo', eventObj.BranchServiceAreaDesc);
        this.PopulateDescriptions('BranchServiceAreaCodeTo');
        this.formValidation('BranchServiceAreaCodeTo');
    }

    public validateProperties: Array<any> = [];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERSELECTMAINTENANCE;
        this.pageTitle = '';
    }
    public ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Service Area Portfolio Rezoning';
        this.initForm();
        this.uiFormValueChanges = this.uiForm.statusChanges.subscribe((value: any) => {
            this.formChanges(value);
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
        this.uiForm.controls['AllowUndo'].setValue('True');
        this.utils.setTitle(this.pageTitle);
        //this.buildGrid();
    }
    public sorHeaderColumns(): void {
        /*this.gridConfig.premisePost.gridSortHeaders = [{
            'fieldName': 'FrequencyRequiredInd',
            'colName': 'Frequency Required Ind',
            'sortType': 'ASC'
        },
        {
            'fieldName': 'PassToPDAInd',
            'colName': 'Pass To PDA Ind',
            'sortType': 'ASC'
        },
        {
            'fieldName': 'InstallationRequired',
            'colName': 'Installation Required',
            'sortType': 'ASC'
        },
        {
            'fieldName': 'EngineerRequiredInd',
            'colName': 'Engineer Required Ind',
            'sortType': 'ASC'
        },
        {
            'fieldName': 'ThirdPartyServiceInd',
            'colName': 'Third Party Service Ind',
            'sortType': 'ASC'
        },
        {
            'fieldName': 'CustomerSpecificInd',
            'colName': 'Customer Specific Ind',
            'sortType': 'ASC'
        },
        {
            'fieldName': 'BranchServiceAreaSeqNo',
            'colName': 'Branch Service Area Seq No',
            'sortType': 'ASC'
        },
        {
            'fieldName': 'BranchServiceAreaCode',
            'colName': 'Branch Service Area Code',
            'sortType': 'ASC'
        },
        {
            'fieldName': 'ProductCode',
            'colName': 'Product Code',
            'sortType': 'ASC'
        },
        {
            'fieldName': 'ServiceTypeCode',
            'colName': 'Service Type Code',
            'sortType': 'ASC'
        },
        {
            'fieldName': 'ProductServiceGroupCode',
            'colName': 'Product Service Group Code',
            'sortType': 'ASC'
        },
        {
            'fieldName': 'PremisePostcode',
            'colName': 'Premise Postcode',
            'sortType': 'ASC'
        },
        {
            'fieldName': 'PremiseTown',
            'colName': 'Premise Town',
            'sortType': 'ASC'
        }];*/
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

        this.validateProperties = [{
            'type': MntConst.eTypeCode,
            'index': 0,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeInteger,
            'index': 1,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeText,
            'index': 2,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeText,
            'index': 3,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeCode,
            'index': 4,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeInteger,
            'index': 5,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': 6,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeCode,
            'index': 7,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeCode,
            'index': 8,
            'align': 'center'
        }, {
            'type': MntConst.eTypeCode,
            'index': 9,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeText,
            'index': 10,
            'align': 'center'
        }];
    }
    public initForm(): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchNumber', this.utils.getBranchCode());
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessCode', this.utils.getBusinessCode());
        //this.riExchange.riInputElement.SetValue(this.uiForm, 'TargetSeqNumber', '0');
        this.uiForm.controls['TargetSeqNumber'].setValue(0);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SequenceGap', '10');
        this.riExchange.renderForm(this.uiForm, this.controls);
    }
    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.uiFormValueChanges.unsubscribe();
    }
    public getFormKeys(): void {
        for (let j = 0; j < this.controls.length; j++) {
            this.formKeys.push(this.controls[j].name);
        }
    }
    public formChanges(obj: any): void {
        if (obj === 'VALID') {
            this.pageVariables.savecancelFlag = false;
        } else {
            this.pageVariables.savecancelFlag = true;
        }
        if (!this.uiForm.pristine)
            this.formValidation();
    }
    public promptConfirm(eventObj: any): void {
        switch (this.promptConfig.promptFlag) {
            case 'save':
                //console.log('Prompt Closing');
                break;
            default:
                break;
        }
    }

    public promptCancel(eventObj: any): void {
        switch (this.promptConfig.promptFlag) {
            case 'save':
                //console.log('Prompt Closing');
                break;
            default:
                break;
        }
    }

    public messageModalClose(): void {
        //console.log('modal closed');
    }

    public BuildMenuOptions(): void {
        this.lookupSearch('BuildMenuOptions');
    }

    public PopulateDescriptions(flag: any): void {
        if (flag === 'BranchServiceAreaCode') {
            if (this.uiForm.controls['BranchServiceAreaCode'].value === '') {
                this.uiForm.controls['BranchServiceAreaDesc'].setValue('');
            }
        }
        if (flag === 'BranchServiceAreaCodeTo') {
            if (this.uiForm.controls['BranchServiceAreaCodeTo'].value === '') {
                this.uiForm.controls['BranchServiceAreaDescTo'].setValue('');
            } else {
                this.formValidation('BranchServiceAreaCodeTo');
            }
        }
        this.lookupSearch('PopulateDescriptions');
    }

    public lookupSearch(key: string, rowId?: any): void {
        switch (key) {
            case 'BuildMenuOptions':
                let searchPost = new URLSearchParams();
                let postParams = {};
                postParams['Function'] = 'GetBusinessContractTypes';
                postParams['methodtype'] = 'maintenance';
                searchPost.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                searchPost.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                searchPost.set(this.serviceConstants.Action, '6');
                this.ajaxSource.next(this.ajaxconstant.START);
                this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module,
                    this.xhrParams.operation, searchPost, postParams)
                    .subscribe(
                    (e) => {
                        if (e['status'] === 'failure') {
                            this.errorService.emitError(e['oResponse']);
                        } else {
                            if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                                this.errorService.emitError(e['oResponse']);
                            } else if (e['errorMessage']) {
                                this.errorService.emitError(e);
                            } else {
                                let BusinessContractTypes = e.BusinessContractTypes;
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessContractTypes', BusinessContractTypes);
                                BusinessContractTypes = BusinessContractTypes.split(',');
                                for (let i = 0; i < BusinessContractTypes.length; i++) {
                                    if (BusinessContractTypes[i] === 'C') {
                                        this.dropDownConfig.ContractTypeCode.ContractTypeCodeList.push({ text: 'Contracts', value: 'C' });
                                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractTypeCode', 'C');
                                    }
                                    if (BusinessContractTypes[i] === 'J') {
                                        this.dropDownConfig.ContractTypeCode.ContractTypeCodeList.push({ text: 'Jobs', value: 'J' });
                                    }
                                    if (BusinessContractTypes[i] === 'P') {
                                        this.dropDownConfig.ContractTypeCode.ContractTypeCodeList.push({ text: 'Product Sales', value: 'P' });
                                    }
                                }
                            }
                        }
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    },
                    (error) => {
                        this.errorService.emitError(error);
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    }
                    );
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
                this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module,
                    this.xhrParams.operation, searchPost, postParams)
                    .subscribe(
                    (e) => {
                        if (e['status'] === 'failure') {
                            this.errorService.emitError(e['oResponse']);
                        } else {
                            if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'] && e.oResponse['error'])) {
                                this.errorService.emitError(e['oResponse']);
                            } else if (e['errorMessage']) {
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'ErrorMessageDesc', e.ErrorMessageDesc);
                                if (e.hasOwnProperty('BranchServiceAreaDesc'))
                                    this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaDesc', e.BranchServiceAreaDesc);
                                if (e.hasOwnProperty('BranchServiceAreaDescTo'))
                                    this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaDescTo', e.BranchServiceAreaDescTo);
                                if (e.hasOwnProperty('ServiceTypeDesc'))
                                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceTypeDesc', e.ServiceTypeDesc);
                                if (e.hasOwnProperty('ProductServiceGroupDesc'))
                                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductServiceGroupDesc', e.ProductServiceGroupDesc);
                                this.messageModal.show({ msg: e['errorMessage'], title: 'Message' }, false);
                            } else {
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'ErrorMessageDesc', e.ErrorMessageDesc);
                                if (e.hasOwnProperty('BranchServiceAreaDesc'))
                                    this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaDesc', e.BranchServiceAreaDesc);
                                if (e.hasOwnProperty('BranchServiceAreaDescTo'))
                                    this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaDescTo', e.BranchServiceAreaDescTo);
                                if (e.hasOwnProperty('ServiceTypeDesc'))
                                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceTypeDesc', e.ServiceTypeDesc);
                                if (e.hasOwnProperty('ProductServiceGroupDesc'))
                                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductServiceGroupDesc', e.ProductServiceGroupDesc);
                            }
                        }
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    },
                    (error) => {
                        this.errorService.emitError(error);
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    }
                    );
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
                } else {
                    postParams['BranchServiceAreaCodeTo'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCodeTo');
                }
                this.ajaxSource.next(this.ajaxconstant.START);
                this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module,
                    this.xhrParams.operation, searchPost, postParams).subscribe(
                    (data) => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        if (data.errorMessage) {
                            if (data.errorMessage !== '') {
                                this.messageModal.show({ msg: data.errorMessage, title: ' ' }, false);
                            }
                        } else {
                            this.buildGrid(rowId);
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
                postParams['FrequencyRequiredInd'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'FrequencyRequiredInd') === 'False' ? 'no' : 'yes';
                postParams['PassToPDAInd'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PassToPDAInd') === 'False' ? 'no' : 'yes';
                postParams['InstallationRequired'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'InstallationRequired') === 'False' ? 'no' : 'yes';
                postParams['EngineerRequiredInd'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'EngineerRequiredInd') === 'False' ? 'no' : 'yes';
                postParams['ThirdPartyServiceInd'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ThirdPartyServiceInd') === 'False' ? 'no' : 'yes';
                postParams['CustomerSpecificInd'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'CustomerSpecificInd') === 'False' ? 'no' : 'yes';
                postParams['AllowUndo'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'AllowUndo');
                searchPost.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                searchPost.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                searchPost.set(this.serviceConstants.Action, '6');
                this.ajaxSource.next(this.ajaxconstant.START);
                this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module,
                    this.xhrParams.operation, searchPost, postParams)
                    .subscribe(
                    (e) => {
                        if (e['status'] === 'failure') {
                            this.errorService.emitError(e['oResponse']);
                        } else {
                            if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'] && e.oResponse['error'])) {
                                this.errorService.emitError(e['oResponse']);
                            } else if (e['errorMessage']) {
                                this.errorService.emitError(e);
                            } else {
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'UndoRowids', e.UndoRowids);
                                this.pageVariables.rezoneAllFlag = false;
                                this.buildGrid();
                            }
                        }
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    },
                    (error) => {
                        this.errorService.emitError(error);
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    }
                    );
                break;
            case 'UndoRezone':
                searchPost = new URLSearchParams();
                postParams = {};
                postParams['methodtype'] = 'maintenance';
                postParams['Function'] = 'UndoRezone';
                postParams['BranchNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchNumber');
                postParams['BranchServiceAreaCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCodeTo');
                postParams['BranchServiceAreaCodeTo'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode');
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
                this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module,
                    this.xhrParams.operation, searchPost, postParams)
                    .subscribe(
                    (e) => {
                        if (e['status'] === 'failure') {
                            this.errorService.emitError(e['oResponse']);
                        } else {
                            if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'] && e.oResponse['error'])) {
                                this.errorService.emitError(e['oResponse']);
                            } else if (e['errorMessage']) {
                                this.errorService.emitError(e);
                            } else {
                                let msg = e['errorMessage'];
                            }
                        }
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        this.buildGrid();
                        this.pageVariables.rezoneAllFlag = true;
                    },
                    (error) => {
                        this.errorService.emitError(error);
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    }
                    );
                break;
            default:
                break;
        }
    }

    public invokeLookupSearch(queryParams: any, data: any): Observable<any> {
        this.ajaxSource.next(this.ajaxconstant.START);
        return this.httpService.lookUpRequest(queryParams, data);
    }

    public getUrlParams(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params.hasOwnProperty('BranchServiceAreaCode')) {
                this.uiForm.controls['BranchServiceAreaCode'].setValue(params['BranchServiceAreaCode']);
            }
            if (params.hasOwnProperty('BranchServiceAreaCodeTo')) {
                this.uiForm.controls['BranchServiceAreaCodeTo'].setValue(params['BranchServiceAreaCodeTo']);
            }
            if (params.hasOwnProperty('SeqNumberFrom')) {
                this.uiForm.controls['SeqNumberFrom'].setValue(params['SeqNumberFrom']);
            }
            if (params.hasOwnProperty('SeqNumberTo')) {
                this.uiForm.controls['SeqNumberTo'].setValue(params['SeqNumberTo']);
            }
            if (params.hasOwnProperty('TargetSeqNumber')) {
                this.uiForm.controls['TargetSeqNumber'].setValue(params['TargetSeqNumber']);
            }
            if (params.hasOwnProperty('PostcodeFilter')) {
                this.uiForm.controls['PostcodeFilter'].setValue(params['PostcodeFilter']);
            }
            if (params.hasOwnProperty('StateFilter')) {
                this.uiForm.controls['StateFilter'].setValue(params['StateFilter']);
            }
            if (params.hasOwnProperty('TownFilter')) {
                this.uiForm.controls['TownFilter'].setValue(params['TownFilter']);
            }
            if (params.hasOwnProperty('ContractTypeCode')) {
                this.uiForm.controls['ContractTypeCode'].setValue(params['ContractTypeCode']);
            }
            if (params.hasOwnProperty('PortfolioStatusType')) {
                this.uiForm.controls['PortfolioStatusType'].setValue(params['PortfolioStatusType']);
            }
            if (params.hasOwnProperty('ServiceVisitFrequency')) {
                this.uiForm.controls['ServiceVisitFrequency'].setValue(params['ServiceVisitFrequency']);
            }
            if (params.hasOwnProperty('FrequencyRequiredInd')) {
                this.uiForm.controls['FrequencyRequiredInd'].setValue(params['FrequencyRequiredInd']);
            }
            if (params.hasOwnProperty('PassToPDAInd')) {
                this.uiForm.controls['PassToPDAInd'].setValue(params['PassToPDAInd']);
            }
            if (params.hasOwnProperty('InstallationRequired')) {
                this.uiForm.controls['InstallationRequired'].setValue(params['InstallationRequired']);
            }
            if (params.hasOwnProperty('EngineerRequiredInd')) {
                this.uiForm.controls['EngineerRequiredInd'].setValue(params['EngineerRequiredInd']);
            }
            if (params.hasOwnProperty('ThirdPartyServiceInd')) {
                this.uiForm.controls['ThirdPartyServiceInd'].setValue(params['ThirdPartyServiceInd']);
            }
            if (params.hasOwnProperty('CustomerSpecificInd')) {
                this.uiForm.controls['CustomerSpecificInd'].setValue(params['CustomerSpecificInd']);
            }
        });
    }

    public buildGrid(rowId?: any): void {
        if (this.pageVariables.rezoneColumnClick) {
            this.pageVariables.rezoneColumnClick = false;
        } else {
            this.search.delete('ROWID');
        }
        this.search.set('BranchNumber', this.utils.getBranchCode());
        this.search.set('BranchServiceAreaCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode'));
        this.search.set('BranchServiceAreaCodeTo', this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCodeTo'));
        this.search.set('SeqNumberFrom', this.riExchange.riInputElement.GetValue(this.uiForm, 'SeqNumberFrom'));
        this.search.set('SeqNumberTo', this.riExchange.riInputElement.GetValue(this.uiForm, 'SeqNumberTo'));
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
        let apiParams: any = {};
        apiParams.module = this.xhrParams.module;
        apiParams.method = this.xhrParams.method;
        apiParams.operation = this.xhrParams.operation;
        apiParams.search = this.search;
        this.premisePostCodeRezoneGrid.itemsPerPage = this.gridConfig.premisePost.pageSize;
        this.premisePostCodeRezoneGrid.loadGridData(apiParams, rowId);
    }

    public cmdUndo_onclick(): void {
        this.pageVariables.saveClicked = true;
        if (this.formValidation() === 0) {
            this.pageVariables.rezoneAllClick = false;
            this.lookupSearch('UndoRezone');
        }
    }

    public cmdRezone_onclick(): void {
        this.pageVariables.saveClicked = true;
        if (this.formValidation() === 0) {
            this.pageVariables.rezoneAllClick = true;
            this.lookupSearch('RezoneGroup');
        }
    }

    public refresh(): void {
        this.buildGrid();
    }

    public cmdProduct_onclick(): void {
        //TO DO: iCABSALostBusinessRequestSearch is not created
        //this.router.navigate(['/iCABSBPremisePostcodeRezoneProductFilter'], { queryParams: { parentMode: 'ProductFilter', mode: 'Request' } });
        this.messageModal.show({ msg: 'iCABSBPremisePostcodeRezoneProductFilter is under construction', title: 'Message' }, false);
    }

    public getCurrentPage(data: any): void {
        this.gridConfig.premisePost.gridCurPage = data.value;
        this.gridConfig.premisePost.currentPage = this.gridConfig.premisePost.gridCurPage;
        this.buildGrid();
    }

    public formValidation(keyName?: any): any {
        let status = 0;
        if (keyName) {
            if (this.uiForm.controls[keyName].value === null) {
                this.pageVariables.requiredFormControlsObj[keyName] = true;
                status = 1;
            } else if (this.uiForm.controls[keyName].value.trim() === '') {
                this.pageVariables.requiredFormControlsObj[keyName] = true;
                status = 1;
            } else if (isNaN(this.uiForm.controls[keyName].value.trim()) && keyName !== 'BranchServiceAreaCode' && keyName !== 'BranchServiceAreaCodeTo') {
                this.pageVariables.requiredFormControlsObj[keyName] = true;
                status = 1;
            }
            else {
                this.pageVariables.requiredFormControlsObj[keyName] = false;
            }
            if (keyName === 'ServiceVisitFrequency') {
                let ServiceVisitFrequency = this.uiForm.controls['ServiceVisitFrequency'].value;
                if (isNaN(ServiceVisitFrequency)) {
                    this.pageVariables.requiredFormControlsOptional[keyName] = true;
                    status = 1;
                } else if (ServiceVisitFrequency.length > 9) {
                    this.pageVariables.requiredFormControlsOptional[keyName] = true;
                    status = 1;
                } else {
                    this.pageVariables.requiredFormControlsOptional[keyName] = false;
                    status = 0;
                }
            }
        } else {
            if (this.pageVariables.saveClicked) {
                for (let key in this.pageVariables.requiredFormControlsObj) {
                    if (key) {
                        if (this.uiForm.controls[key].value === null) {
                            this.pageVariables.requiredFormControlsObj[key] = true;
                            status = 1;
                        } else if (this.uiForm.controls[key].value.trim() === '') {
                            this.pageVariables.requiredFormControlsObj[key] = true;
                            status = 1;
                        } else {
                            if (key === 'CompanyInvoiceNumber') {
                                if (isNaN(this.uiForm.controls[key].value)) {
                                    this.pageVariables.requiredFormControlsObj[key] = true;
                                    status = 1;
                                } else {
                                    this.pageVariables.requiredFormControlsObj[key] = false;
                                }
                            } else {
                                this.pageVariables.requiredFormControlsObj[key] = false;
                            }
                        }
                    }
                }
            }
        }
        return status;
    }

    public formValidationNot(keyName?: any): any {
        let status = 0;
        if (keyName) {
            if (isNaN(this.uiForm.controls[keyName].value.trim())) {
                this.pageVariables.nonRequiredFormControlsObj[keyName] = true;
                status = 1;
            }
            else {
                this.pageVariables.nonRequiredFormControlsObj[keyName] = false;
            }
        }
        return status;

    }

    public setProductServiceGroup(event: any): void {
        if (event.ProductServiceGroupCode)
            this.setControlValue('ProductServiceGroupCode', event.ProductServiceGroupCode);
        if (event.ProductServiceGroupDesc)
            this.setControlValue('ProductServiceGroupDesc', event.ProductServiceGroupDesc);
    }

    public serviceTypeCodeOnKeyDown(data: any): void {
        if (data) {
            this.setControlValue('ServiceTypeCode', data['ServiceTypeCode']);
            this.setControlValue('ServiceTypeDesc', data['ServiceTypeDesc']);
        }
    }
}
