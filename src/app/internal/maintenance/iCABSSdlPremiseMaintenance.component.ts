import { Component, OnInit, OnChanges, Input, EventEmitter, ViewChild, Output, OnDestroy, Injector } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs';

import { BaseComponent } from '../../base/BaseComponent';
import { InternalMaintenanceSalesModuleRoutes } from './../../base/PageRoutes';
import { InternalMaintenanceModuleRoutes, InternalGridSearchSalesModuleRoutes } from '../../base/PageRoutes';
import { PageIdentifier } from './../../base/PageIdentifier';
import { QueryParametersCallback } from './../../base/Callback';
import { RiMaintenance, MntConst, RiTab } from './../../../shared/services/riMaintenancehelper';
import { Utils } from './../../../shared/services/utility';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridComponent } from './../../../shared/components/grid/grid';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';

import { CustomerTypeSearchComponent } from './../../internal/search/iCABSSCustomerTypeSearch';
import { PestNetOnLineLevelSearchComponent } from './../../internal/search/iCABSBPestNetOnLineLevelSearch.component';
import { InvoiceGroupGridComponent } from './../../internal/grid-search/iCABSAInvoiceGroupGrid';
import { ContractHistoryGridComponent } from '../grid-search/iCABSAContractHistoryGrid';
import { PNOLPremiseSearchGridComponent } from '../grid-search/iCABSAPNOLPremiseSearchGrid.component';

@Component({
    templateUrl: 'iCABSSdlPremiseMaintenance.html'
})

export class SdlPremiseMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, QueryParametersCallback {
    public riTab: RiTab;
    public isRequesting = false;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('Grid') Grid: GridComponent;
    @ViewChild('GridPagination') GridPagination: PaginationComponent;
    public promptTitle: string = MessageConstant.Message.ConfirmTitle;
    public promptContent: string = MessageConstant.Message.ConfirmRecord;
    public showCloseButton = true;
    public modalConfig: any = { backdrop: 'static', keyboard: true };
    public queryParams: any;
    public actionSave: number = 2;

    @ViewChild('customerTypeEllipsis') customerTypeEllipsis: EllipsisComponent;
    @ViewChild('invoiceGrpNumberEllipsis') invoiceGrpNumberEllipsis: EllipsisComponent;
    @ViewChild('pnolLevelEllipsis') pnolLevelEllipsis: EllipsisComponent;
    @ViewChild('siteReferenceEllipsis') siteReferenceEllipsis: EllipsisComponent;

    public ellipsis = {
        customerTypeEllipsis: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            childparams: {
                'parentMode': 'LookUp',
                'currentContractType': ''
            },
            component: CustomerTypeSearchComponent
        },
        pnolLevelEllipsis: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            childparams: {
                'parentMode': 'LookUp',
                'currentContractType': ''
            },
            component: PestNetOnLineLevelSearchComponent
        },
        invoiceGrpNumberEllipsis: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            childparams: {
                'parentMode': 'LookUp',
                'isEllipsis': true,
                'AccountNumber': '',
                'AccountName': '',
                'ContractNumber': '',
                'PremiseNumber': ''
            },
            component: InvoiceGroupGridComponent
        },
        siteReferenceEllipsis: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            childparams: {
                'parentMode': 'LookUp',
                'isEllipsis': true,
                'AccountNumber': '',
                'ContractNumber': '',
                'ContractName': '',
                'SearchPostcode': '',
                'PremiseName': '',
                'PremiseAddressLine1': '',
                'PremiseAddressLine2': '',
                'PremiseAddressLine3': '',
                'PremiseAddressLine4': '',
                'PremiseAddressLine5': '',
                'PremisePostcode': ''
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            component: PNOLPremiseSearchGridComponent
        }
    };

    //BaseComponents
    public controls = [
        { name: 'AccountName', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'AccountNumber', readonly: false, disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'AutoCloseWindow', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'BusinessCode', readonly: false, disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'ClientReference', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'CmdGenerateSRAText', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'cmdGeocode', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'cmdGetAddress', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'CompanyCode', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'ContractCommenceDate', readonly: false, disabled: false, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'ContractName', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ContractTypeCode', readonly: false, disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'CustomerTypeCode', readonly: false, disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'CustomerTypeDesc', readonly: false, disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'DisQuoteTypeCode', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'dlBatchRef', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'dlContractRef', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'dlExtRef', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'dlMasterExtRef', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'dlPremiseRef', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'dlPremiseROWID', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'dlRecordType', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'dlRejectionCode', readonly: false, disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'dlRejectionDesc', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'dlStatusCode', readonly: false, disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'dlStatusDesc', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'GPSCoordinateX', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'GPSCoordinateY', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'InitialdlMasterExtRef', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'InvoiceGroupDesc', readonly: false, disabled: true, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'InvoiceGroupNumber', readonly: false, disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'JobCommenceDate', readonly: false, disabled: false, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'JobExpiryDate', readonly: false, disabled: false, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'POExpiryDate', readonly: false, disabled: false, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'menu', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: 'Options' },
        { name: 'Misc', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'PNOL', readonly: false, disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'PNOLDescription', readonly: false, disabled: true, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'PNOLiCABSLevel', readonly: false, disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'PNOLSetupChargeRequired', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'PNOLSiteRef', readonly: false, disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'POExpiryValue', readonly: false, disabled: false, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'PremiseAddressLine1', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'PremiseAddressLine2', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'PremiseAddressLine3', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'PremiseAddressLine4', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'PremiseAddressLine5', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'PremiseContactEmail', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'PremiseContactFax', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'PremiseContactMobile', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'PremiseContactName', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'PremiseContactPosition', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'PremiseContactTelephone', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'PremiseName', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'PremisePostcode', readonly: false, disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'PremiseSpecialInstructions', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'PurchaseOrderNo', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'QuoteTypeCode', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'RoutingGeonode', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'RoutingScore', readonly: false, disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'RoutingSource', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'SelRoutingSource', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'SubSystem', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'tweh01', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'tweh02', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'tweh03', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'tweh04', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'tweh05', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'tweh06', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'tweh07', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'tweh08', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'tweh09', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'tweh10', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'tweh11', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'tweh12', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'tweh13', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'tweh14', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twem01', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twem02', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twem03', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twem04', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twem05', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twem06', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twem07', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twem08', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twem09', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twem10', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twem11', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twem12', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twem13', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twem14', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsh01', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsh02', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsh03', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsh04', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsh05', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsh06', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsh07', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsh08', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsh09', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsh10', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsh11', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsh12', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsh13', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsh14', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsm01', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsm02', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsm03', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsm04', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsm05', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsm06', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsm07', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsm08', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsm09', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsm10', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsm11', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsm12', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsm13', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'twsm14', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'UpdateableInd', readonly: false, disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'WasteFeeInd', readonly: false, disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'ViewOriginal', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'WindowStarth01', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowStartm01', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndh01', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndm01', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowStarth02', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowStartm02', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndh02', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndm02', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowStarth03', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowStartm03', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndh03', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndm03', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowStarth04', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowStartm04', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndh04', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndm04', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowStarth05', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowStartm05', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndh05', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndm05', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowStarth06', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowStartm06', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndh06', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndm06', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowStarth07', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowStartm07', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndh07', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndm07', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowStarth08', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowStartm08', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndh08', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndm08', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowStarth09', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowStartm09', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndh09', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndm09', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowStarth10', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowStartm10', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndh10', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndm10', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowStarth11', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowStartm11', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndh11', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndm11', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowStarth12', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowStartm12', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndh12', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndm12', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowStarth13', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowStartm13', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndh13', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndm13', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowStarth14', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowStartm14', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndh14', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WindowEndm14', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' }
    ];

    public uiDisplay = {
        cmdGetAddress: true,
        trInvoiceGroupNumber: false,
        trPremiseAddressLine3: false,
        trPNOLFlags1: false,
        trPNOLFlags2: false,
        trHR1: false,
        trHR2: false,
        trGPSRouting1: false,
        trGPSRouting2: false,
        menu: true,
        tdViewOriginal: false,
        tdContractCommenceDateLabel: false,
        tdContractCommenceDate: false,
        tdJobCommenceDateLabel: false,
        tdJobCommenceDate: false,
        tdJobExpiryDateLabel: false,
        tdJobExpiryDate: false,
        CmdGenerateSRAText: false,
        trPNOLLevel: false,
        trPNOLDescription: false
    };
    public dropDown = {
        menu: [],
        twsh: [],
        twsm: [],
        tweh: [],
        twem: []
    };
    public tab = {
        tab1: { id: 'grdAddress', name: 'Address', visible: false, active: true },
        tab2: { id: 'grdSRA', name: 'Risk Assessment Grid', visible: false, active: false },
        tab3: { id: 'grdSRAText', name: 'Risk Assessment Text', visible: false, active: false },
        tab4: { id: 'grdTimeWindow', name: 'Time Windows', visible: false, active: false }
    };
    public pageId: string;
    public xhr: any;
    public xhrParams = {
        module: 'advantage',
        method: 'prospect-to-contract/maintenance',
        operation: 'Sales/iCABSSdlPremiseMaintenance'
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSDLPREMISEMAINTENANCE;
        this.setURLQueryParameters(this);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.genCtrlMap();
    }

    public getURLQueryParameters(param: any): void {
        this.queryParams = param;
        this.init();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private init(): void {
        this.pageParams.vBusinessCode = this.utils.getBusinessCode();
        this.pageParams.vCountryCode = this.utils.getCountryCode();
        this.pageParams.gUserCode = this.utils.getUserCode();
        this.pageParams.MaximumAddressLength = 40;

        this.initDatePickers();

        this.getSysCharDtetails();
        this.doLookup();

        this.riTab = new RiTab(this.tab, this.utils);
        this.tab = this.riTab.tabObject;
        this.riTab.TabAdd('Address');
        this.riTab.TabAdd('Risk Assessment Grid');
        this.riTab.TabAdd('Risk Assessment Text');
        this.riTab.TabAdd('Time Windows');
        this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
    }

    private doLookup(): any {
        let lookupIP = [
            {
                'table': 'CustomerTypeLanguage',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'LanguageCode': this.riExchange.LanguageCode() },
                'fields': ['CustomerTypeCode', 'CustomerTypeDesc']
            },
            {
                'table': 'PestNetOnLineLevel',
                'query': { 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['PNOLiCabsLevel', 'PNOLDescription']
            }
        ];
        this.LookUp.lookUpPromise(lookupIP).then((data) => {
            //TODO
            this.logger.log('Lookup data', data);
        });
    }

    private getSysCharDtetails(): any {
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableAddressLine3, //Logical
            this.sysCharConstants.SystemCharAddressLine5Required, //logical
            this.sysCharConstants.SystemCharEnableHopewiserPAF,
            this.sysCharConstants.SystemCharEnableDatabasePAF,
            this.sysCharConstants.SystemCharAddressLine4Required,
            this.sysCharConstants.SystemCharPostCodeRequired,
            this.sysCharConstants.SystemCharPostCodeMustExistinPAF,
            this.sysCharConstants.SystemCharRunPAFSearchOnFirstAddressLine,
            this.sysCharConstants.SystemCharEnablePNOLLevelProcessingInSOP,
            this.sysCharConstants.SystemCharEnableRouteOptimisationSoftwareIntegration,
            this.sysCharConstants.SystemCharMaximumAddressLength //Integer
        ];
        let sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysCharPromise(sysCharIP).then((data) => {
            let records = data.records;
            this.logger.log('SYSCHAR', records);
            this.pageParams.vSCEnableAddressLine3 = records[0].Required;
            this.pageParams.vSCAddressLine3Logical = records[0].Logical;
            this.pageParams.vSCAddressLine5Required = records[1].Required;
            this.pageParams.vSCAddressLine5Logical = records[1].Logical;
            this.pageParams.vSCEnableHopewiserPAF = records[2].Required;
            this.pageParams.vSCEnableDatabasePAF = records[3].Required;
            this.pageParams.vSCAddressLine4Required = records[4].Required;
            this.pageParams.vSCPostCodeRequired = records[5].Required;
            this.pageParams.vSCPostCodeMustExistInPAF = records[6].Required;
            this.pageParams.vSCRunPAFSearchOn1stAddressLine = records[7].Required;
            this.pageParams.vSCEnablePNOLProcessingInSOP = records[8].Required;
            this.pageParams.vSCEnableRouteOptimisation = records[9].Required;
            this.pageParams.vSCEnableMaxAddress = records[10].Integer;
            this.pageParams.vSCEnableMaxAddressValue = records[10].Integer;

            /* Determine the fields to hide */
            this.pageParams.vDisableFieldList = '';
            if (this.pageParams.vSCEnableAddressLine3) this.pageParams.vDisableFieldList += 'DisableAddressLine3';

            /* Find the default country code */
            this.pageParams.vDefaultCountryCode = this.utils.getCountryCode();

            this.pageParams.storeInitialRefs = false;
            this.pageParams.PipelineAmendMode = '';
            this.pageParams.PipelineAddMode = '';
            this.pageParams.AlreadyPNOL = false;
            this.pageParams.lUpdateContractCommenceDate = false;
            this.pageParams.lUpdateJobCommenceDate = false;

            this.pageParams.FieldDisableList = this.pageParams.vDisableFieldList;
            this.pageParams.MaximumAddressLength = this.pageParams.vSCEnableMaxAddressValue;
            this.pageParams.strDefaultCountryCode = this.pageParams.vDefaultCountryCode;
            this.pageParams.SCEnableHopewiserPAF = this.pageParams.vSCEnableHopewiserPAF ? true : false;
            this.pageParams.SCEnableDatabasePAF = this.pageParams.vSCEnableDatabasePAF ? true : false;
            this.pageParams.SCAddressLine3Logical = this.pageParams.vSCAddressLine3Logical ? true : false;
            this.pageParams.SCAddressLine4Required = this.pageParams.vSCAddressLine4Required ? true : false;
            this.pageParams.SCAddressLine5Required = this.pageParams.vSCAddressLine5Required ? true : false;
            this.pageParams.SCAddressLine5Logical = this.pageParams.vSCAddressLine5Logical ? true : false;
            this.pageParams.SCPostCodeRequired = this.pageParams.vSCPostCodeRequired ? true : false;
            this.pageParams.SCPostCodeMustExistInPAF = this.pageParams.vSCPostCodeMustExistInPAF ? true : false;
            this.pageParams.SCRunPAFSearchOnFirstAddressLine = this.pageParams.vSCRunPAFSearchOn1stAddressLine ? true : false;
            this.pageParams.SCEnablePNOLProcessingInSOP = this.pageParams.vSCEnablePNOLProcessingInSOP ? true : false;
            this.pageParams.SCEnableRouteOptimisation = this.pageParams.vSCEnableRouteOptimisation ? true : false;
            this.window_onload();
        });
    }

    ///////////////////////////////////////////////

    public currentActivity = '';
    public callbackHooks: any = [];
    public callbackPrompts: any = [];
    public save(mode?: any): void {
        let status = true;
        this.riMaintenance.clearQ();
        this.utils.highlightTabs();

        if (mode) {
            this.riMaintenance.CurrentMode = mode;
        } else {
            this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
        }

        if (this.riMaintenance.CurrentMode !== MntConst.eModeDelete) {
            status = this.riExchange.validateForm(this.uiForm);
            if (this.uiForm.status === 'VALID') {
                status = true;
            } else {
                if (!status) {
                    for (let control in this.uiForm.controls) {
                        if (this.uiForm.controls[control].invalid) {
                            this.focusField(control, false, true);
                        }
                    }
                }
            }
        }

        if (status) {
            this.promptTitle = MessageConstant.Message.ConfirmTitle;
            this.promptContent = MessageConstant.Message.ConfirmRecord;
            this.riTab.TabFocus(1);
            if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
                this.riMaintenance.CurrentMode = MntConst.eModeSaveUpdate;
                this.actionSave = 2;
                this.currentActivity = 'SAVE';
                this.promptContent = MessageConstant.Message.ConfirmRecord;
            }
            if (this.riMaintenance.CurrentMode === MntConst.eModeDelete) {
                this.actionSave = 3;
                this.currentActivity = 'DELETE';
                this.promptContent = MessageConstant.Message.DeleteRecord;
            }

            this.riMaintenance.CancelEvent = false;
            this.riMaintenance.execMode(this.riMaintenance.CurrentMode, [this]);
        }
    }
    public cancel(): void {
        this.logger.log('CANCEL');
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        this.markAsPrestine();
        this.riTab.TabsToNormal();
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate || this.riMaintenance.CurrentMode === MntConst.eModeSaveUpdate) {
            this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
            for (let i = 0; i < this.controls.length; i++) {
                this.riExchange.updateCtrl(this.controls, this.controls[i].name, 'value', this.controls[i].value);
                this.setControlValue(this.controls[i].name, this.controls[i].value);
                if (this.controls[i].name.indexOf('Date') > 0) {
                    if (this.pageParams['dt' + this.controls[i].name]) {
                        let dateVal = this.controls[i]['nascentVal'];
                        if (!dateVal) dateVal = '';
                        this.pageParams['dt' + this.controls[i].name].value = (dateVal) ? this.utils.convertDate(dateVal) : dateVal;
                        this.selDate(dateVal, this.controls[i].name);
                        this.routeAwayGlobals.setSaveEnabledFlag(false);
                    }
                }
            }
        }
    }
    public delete(): void {
        this.logger.log('DELETE');
        this.riMaintenance.CurrentMode = MntConst.eModeDelete;
        this.save(this.riMaintenance.CurrentMode);
    }
    public confirm(): any {
        this.promptModal.show();
    }
    public confirmed(obj: any): any {
        if (this.callbackPrompts.length > 0) {
            let fn = this.callbackPrompts.pop();
            this.pageParams.promptAns = true;
            if (typeof fn === 'function') fn.call(this);
            this.callbackPrompts = [];
        } else {
            this.riMaintenance.CancelEvent = false;
            if (this.pageParams.vEnableTransData) {
                this.riMaintenance.execContinue(this.riMaintenance.CurrentMode, [this]);
            } else {
                this.riMaintenance.execContinue(this.riMaintenance.CurrentMode, [this]);
            }
        }
    }
    public promptCancel(): any {
        if (this.callbackPrompts.length > 0) {
            let fn = this.callbackPrompts.pop();
            this.pageParams.promptAns = false;
            if (typeof fn === 'function') fn.call(this);
            this.callbackPrompts = [];
        }
    }
    public showAlert(msgTxt: string, type?: number): void {
        this.logger.log('showAlert', msgTxt);
        let titleModal = '';
        if (typeof type === 'undefined') type = 0;
        switch (type) {
            default:
            case 0: titleModal = MessageConstant.Message.ErrorTitle; break;
            case 1: titleModal = MessageConstant.Message.MessageTitle; break;
            case 2: titleModal = MessageConstant.Message.MessageTitle; break;
        }
        this.isModalOpen(true);
        this.messageModal.show({ msg: msgTxt, title: titleModal }, false);
    }
    public isModalOpen(flag: boolean): void {
        this.riMaintenance.isModalOpen = flag;
    }
    public closeModal(): void {
        this.logger.log('Modal closed');
        this.isModalOpen(false);
        this.riMaintenance.handleConfirm(this);

        if (this.callbackHooks.length > 0) {
            this.callbackHooks.pop().call(this);
            this.callbackHooks = [];
        }
    }
    public showSpinner(): void {
        this.isRequesting = true;
    }
    public hideSpinner(): void {
        setTimeout(() => {
            let formrawData = this.uiForm.getRawValue();
            //Update Data Model with the default values
            for (let i = 0; i < this.controls.length; i++) {
                if (formrawData.hasOwnProperty([this.controls[i].name])) {
                    this.controls[i].value = formrawData[this.controls[i].name];
                    if (this.controls[i].name.indexOf('Date') > 0) {
                        if (this.pageParams['dt' + this.controls[i].name]) {
                            this.controls[i]['nascentVal'] = formrawData[this.controls[i].name]; //Because SelDate() updates the control
                        }
                    }
                }
            }
            this.isRequesting = false;
        }, 2000);
    }
    public markAsPrestine(): void {
        for (let i = 0; i < this.controls.length; i++) {
            this.uiForm.controls[this.controls[i].name].markAsPristine();
        }
    }
    public initialFormState(flag: boolean, flagModal: boolean): void {
        if (!flag) this.clearFlags(); //Remove all UI flags
        this.riExchange.disableFormFields(this.uiForm); //Disable All controls
        if (!flag) this.riExchange.resetCtrl(this.controls); //Reset All Control Values
        this.updateButton(); //Update UI buttons with text

        // this.enablePrimaryFields(); //Enable Contract Number

        this.riExchange.renderForm(this.uiForm, this.controls); //Form Redraw

        //DatePickers initialized
        this.initDatePickers();
        if (!flag) {
            for (let i = 0; i < this.controls.length; i++) {
                if (this.controls[i].name.indexOf('Date') > 0) {
                    if (document.querySelector('#' + this.controls[i].name)) {
                        if (this.pageParams['dt' + this.controls[i].name]) {
                            if (this.pageParams['dt' + this.controls[i].name].value === null) {
                                this.pageParams['dt' + this.controls[i].name].value = void 0;
                            } else {
                                this.pageParams['dt' + this.controls[i].name].value = null;
                            }
                        }

                        let elem = document.querySelector('#' + this.controls[i].name).parentElement;
                        if (elem.firstElementChild.firstElementChild) {
                            let dateField = elem.firstElementChild.firstElementChild.firstElementChild.firstElementChild;
                            let dateFieldID = dateField.getAttribute('id');
                            setTimeout(() => { document.getElementById(dateFieldID)['value'] = ''; }, 200);
                        }
                    }
                }
            }
        }
    }
    public clearFlags(): void {
        // this.uiDisplay.tdContractHasExpired = false;
    }
    public focusField(id: string, flagClear?: boolean, validate?: boolean): void {
        this.logger.log('DEBUG --- focusField', id, flagClear, validate);
        if (id.indexOf('Date') > 0) {
            let tempDate = this.getControlValue(id);

            if (this.pageParams['dt' + id]) {
                this.pageParams['dt' + id].autofocus = true;
                if (flagClear) {
                    this.pageParams['dt' + id].value = null;
                } else {
                    if (typeof tempDate === 'object') {
                        this.pageParams['dt' + id].value = tempDate;
                    } else {
                        if (tempDate) {
                            this.pageParams['dt' + id].value = this.utils.convertDate(this.utils.convertAnyToUKString(tempDate));
                        } else {
                            if (this.pageParams['dt' + id].value === null) {
                                this.pageParams['dt' + id].value = void 0;
                            } else {
                                this.pageParams['dt' + id].value = null;
                            }
                        }
                    }
                }
                if (validate) {
                    this.pageParams['dt' + id].validate = validate;
                }
            }
        } else {
            setTimeout(() => { document.getElementById(id).focus(); }, 200);
        }
    }
    public focusSave(obj: any): void {
        this.riTab.focusNextTab(obj);
    }
    public fieldValidateTransform(event: any): void {
        let retObj = this.utils.fieldValidateTransform(event);
        this.setControlValue(retObj.id, retObj.value);
        if (!retObj.status) {
            this.riExchange.riInputElement.markAsError(this.uiForm, retObj.id);
        }
    }
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public canDeactivate(): Observable<boolean> {
        this.checkFormStatus();
        return super.canDeactivate();
    }
    public checkFormStatus(): void {
        /* Check Form Status */
        for (let i = 0; i < this.controls.length; i++) {
            if (!this.uiForm.controls[this.controls[i].name].pristine) {
                // console.log('NAVIGATE CONTROL >>', this.controls[i].name, this.uiForm.controls[this.controls[i].name].pristine);
                if (this.controls[i].name.toLowerCase().indexOf('date') > -1) {
                    let elem = document.querySelector('#' + this.controls[i].name).parentElement;
                    let dateField = elem.firstElementChild.firstElementChild.firstElementChild.firstElementChild;
                    let checkClassName = 'ng-untouched';
                    if (this.utils.hasClass(dateField, checkClassName)) {
                        // console.log('NAVIGATE --- CONTROL DatePicker', this.controls[i].name, this.utils.hasClass(dateField, checkClassName));
                        this.uiForm.controls[this.controls[i].name].markAsPristine();
                    }
                }
            }
        }

        this.uiForm.controls['menu'].markAsPristine();

        // console.log('DEBUG Form Status:', this.uiForm.pristine, this.riMaintenance.CurrentMode);
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            if (!this.uiForm.pristine) this.routeAwayGlobals.setSaveEnabledFlag(true);
        }
    }

    ///////////////////////////////////////////////

    public updateButton(): void {
        this.utils.getTranslatedval('Save').then((res: string) => { this.setControlValue('save', res); });
        this.utils.getTranslatedval('Cancel').then((res: string) => { this.setControlValue('cancel', res); });
        this.utils.getTranslatedval('Delete').then((res: string) => { this.setControlValue('delete', res); });
        this.utils.getTranslatedval('Get Address').then((res: string) => { this.setControlValue('cmdGetAddress', res); });
        this.utils.getTranslatedval('Geocode').then((res: string) => { this.setControlValue('cmdGeocode', res); });
        this.utils.getTranslatedval('Generate SRA Text').then((res: string) => { this.setControlValue('CmdGenerateSRAText', res); });
    }

    public window_onload(): void {
        this.updateButton();

        this.utils.setTitle('Advantage Premises Maintenance');
        let PipelineAmendMode = this.riExchange.URLParameterContains('PipelineAmend');
        let PipelineAddMode = this.riExchange.URLParameterContains('PipelineAdd');

        this.riExchange.updateCtrl(this.controls, 'dlRecordType', 'value', 'CO');
        this.riExchange.updateCtrl(this.controls, 'dlExtRef', 'value', this.riExchange.getParentHTMLValue('dlExtRef'));
        this.riExchange.updateCtrl(this.controls, 'dlBatchRef', 'value', this.riExchange.getParentHTMLValue('dlBatchRef'));
        this.riExchange.updateCtrl(this.controls, 'dlPremiseROWID', 'value', this.riExchange.getParentHTMLValue('dlPremiseROWID'));

        this.riExchange.updateCtrl(this.controls, 'dlContractRef', 'value', this.riExchange.getParentHTMLValue('dlContractRef'));
        this.riExchange.updateCtrl(this.controls, 'ContractTypeCode', 'value', this.riExchange.getParentHTMLValue('ContractTypeCode'));
        this.riExchange.updateCtrl(this.controls, 'SubSystem', 'value', this.riExchange.getParentHTMLValue('SubSystem'));
        this.riExchange.updateCtrl(this.controls, 'QuoteTypeCode', 'value', this.riExchange.getParentHTMLValue('QuoteTypeCode'));
        this.riExchange.updateCtrl(this.controls, 'DisQuoteTypeCode', 'value', this.riExchange.getParentHTMLValue('DisQuoteTypeCode'));

        if (this.riExchange.getParentHTMLValue('DisQuoteTypeCode') === '') {
            this.setControlValue('DisQuoteTypeCode', this.riExchange.getParentHTMLValue('QuoteTypeCode'));
        }

        if (!(this.pageParams.SCEnableHopewiserPAF || this.pageParams.SCEnableDatabasePAF)) {
            this.uiDisplay.cmdGetAddress = false;
        }

        this.riExchange.updateCtrl(this.controls, 'cmdGetAddress', 'disabled', true);

        this.riExchange.renderForm(this.uiForm, this.controls);

        this.AddHOptions();
        this.AddMOptions();

        this.riMaintenance.BusinessObject = 'riControl.p';
        this.riMaintenance.CustomBusinessObject = 'iCABSdlPremiseMaintenance.p';
        this.riMaintenance.CustomBusinessObjectSelect = true;
        this.riMaintenance.CustomBusinessObjectConfirm = false;
        this.riMaintenance.CustomBusinessObjectInsert = true;
        this.riMaintenance.CustomBusinessObjectUpdate = true;
        this.riMaintenance.CustomBusinessObjectDelete = true;
        this.riMaintenance.FunctionAdd = false;
        this.riMaintenance.FunctionSnapShot = false;
        this.riMaintenance.FunctionDelete = true;
        this.riMaintenance.FunctionSelect = false;

        this.riMaintenance.AddTable('dlPremise');
        this.riMaintenance.AddTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddTableKey('dlBatchRef', MntConst.eTypeTextFree, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
        this.riMaintenance.AddTableKey('dlRecordType', MntConst.eTypeTextFree, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
        this.riMaintenance.AddTableKey('dlExtRef', MntConst.eTypeTextFree, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
        this.riMaintenance.AddTableKey('dlPremiseROWID', MntConst.eTypeTextFree, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');

        this.riMaintenance.AddTableField('dlExtRef', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Required');
        this.riMaintenance.AddTableField('dlBatchRef', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Required');
        this.riMaintenance.AddTableField('dlMasterExtRef', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('dlStatusCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('dlStatusDesc', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('dlRejectionCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('dlRejectionDesc', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('UpdateableInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');

        /// Visible fields
        this.riMaintenance.AddTableField('PremiseAddressLine1', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('PremiseAddressLine2', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');

        if (this.pageParams.SCAddressLine3Logical) {
            this.riMaintenance.AddTableField('PremiseAddressLine3', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        } else {
            this.riMaintenance.AddTableField('PremiseAddressLine3', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }

        this.riMaintenance.AddTableField('PremiseAddressLine4', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');

        if (this.pageParams.SCAddressLine5Logical) {
            this.riMaintenance.AddTableField('PremiseAddressLine5', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        } else {
            this.riMaintenance.AddTableField('PremiseAddressLine5', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }

        this.riMaintenance.AddTableField('PremiseContactEmail', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseContactFax', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseContactMobile', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseContactName', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('PremiseContactPosition', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('PremiseContactTelephone', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('PremiseName', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('PremisePostcode', MntConst.eTypeCode, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('ContractTypeCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateFixed, 'ReadOnly');
        this.riMaintenance.AddTableField('CustomerTypeCode', MntConst.eTypeCode, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('ClientReference', MntConst.eTypeTextFree, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('PurchaseOrderNo', MntConst.eTypeTextFree, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('POExpiryDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('POExpiryValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseSpecialInstructions', MntConst.eTypeTextFree, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('PNOL', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PNOLiCABSLevel', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PNOLSiteRef', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('AccountNumber', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('InvoiceGroupNumber', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('GPSCoordinateX', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('GPSCoordinateY', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('RoutingGeoNode', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('RoutingScore', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('RoutingSource', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('ContractCommenceDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('JobCommenceDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('JobExpiryDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('WasteFeeInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');

        /// Hidden fields
        this.riMaintenance.AddTableField('BusinessCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'ReadOnly');
        this.riMaintenance.AddTableField('ContractName', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');

        let tempObj = '01,02,03,04,05,06,07,08,09,10,11,12,13,14'.split(',');
        for (let i = 0; i < tempObj.length; i++) {
            this.riMaintenance.AddTableField('WindowStarth' + tempObj[i], MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.riMaintenance.AddTableField('WindowStartm' + tempObj[i], MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.riMaintenance.AddTableField('WindowEndh' + tempObj[i], MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.riMaintenance.AddTableField('WindowEndm' + tempObj[i], MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }

        this.riMaintenance.AddTableCommit(this, this.getTableCallbackData);

        this.riMaintenance.Complete();

        this.setRequiredStatus('InvoiceGroupNumber', false);
        this.setRequiredStatus('PremiseSalesEmployee', false);
        this.uiDisplay.trInvoiceGroupNumber = false;

        this.riMaintenance.RowID(this, 'dlPremise', this.riExchange.getParentAttributeValue('dlPremiseRowID')); //TODO - Verify
        this.riExchange.updateCtrl(this.controls, 'dlPremiseROWID', 'value', this.riExchange.getParentAttributeValue('dlPremiseRowID')); //TODO - Verify

        this.riMaintenance.FetchRecord();

        //TODO - Change implementation - below code should be inside callback

        ///This is to allow an Invoice Group to be selected for New quotes for existing accounts which contain mixed Payment Types
        if ((this.getControlValue('QuoteTypeCode') === 'NEW' ||
            this.getControlValue('QuoteTypeCode') === '') &&
            this.getControlValue('AccountNumber') !== '') {
            this.setRequiredStatus('InvoiceGroupNumber', false);
            this.uiDisplay.trInvoiceGroupNumber = true;
        }

        ///************************************************************************************
        ///* Check for fields which are subject to being disabled by Systems Characteristics  *
        ///************************************************************************************

        if (this.pageParams.FieldDisableList.indexOf('DisableAddressLine3') > -1) {
            this.uiDisplay.trPremiseAddressLine3 = false;
        } else {
            this.uiDisplay.trPremiseAddressLine3 = true;
        }

        this.riExchange.updateCtrl(this.controls, 'PNOLDescription', 'disabled', true);

        this.dropDown.menu = [];
        this.dropDown.menu.push({ value: 'ServiceCover', label: 'Service Covers' });
        //IUI-15588 - Not covered in 577 screens
        // if (this.pageParams.SCEnablePNOLProcessingInSOP && this.getControlValue('ContractTypeCode') === 'C') {
        //     this.dropDown.menu.push({ value: 'PNOLSetupCharge', label: 'PestNetOnline Setup Charge' });
        // }

        if (this.getControlValue('QuoteTypeCode') === 'AMD') {
            if (this.riExchange.riInputElement.checked(this.uiForm, 'PNOL')) {
                this.pageParams.AlreadyPnol = true;
                this.uiDisplay.trPNOLFlags1 = true;
                this.uiDisplay.trPNOLFlags2 = true;
                this.setRequiredStatus('PremiseContactEmail', true);
                this.PNOL_OnClick();
            } else {
                this.setRequiredStatus('PremiseContactEmail', false);
            }
        }

        if (this.pageParams.SCEnableRouteOptimisation) {
            this.uiDisplay.trHR1 = true;
            this.uiDisplay.trHR2 = true;
            this.uiDisplay.trGPSRouting1 = true;
            this.uiDisplay.trGPSRouting2 = true;
            this.riExchange.updateCtrl(this.controls, 'SelRoutingSource', 'disabled', true);
        }

        this.setControlValue('menu', 'Options');
        this.riExchange.renderForm(this.uiForm, this.controls);

        this.riMaintenance.execMode(MntConst.eModeUpdate, [this]);
    }

    public getTableCallbackData(): void {
        ///************************************************************************************
        ///* Add Virtual Tables                                                               *
        ///************************************************************************************

        this.riMaintenance.AddVirtualTable('CustomerTypeLanguage');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('LanguageCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '=', this.riExchange.LanguageCode(), '', 'Virtual');
        this.riMaintenance.AddVirtualTableKey('CustomerTypeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('CustomerTypeDesc', MntConst.eTypeText, MntConst.eVirtualFieldStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);

        this.riMaintenance.AddVirtualTable('PestNetOnLineLevel');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('PNOLiCabsLevel', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'PNOLiCABSLevel', 'Virtual');
        this.riMaintenance.AddVirtualTableField('PNOLDescription', MntConst.eTypeTextFree, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);

        if (this.getControlValue('QuoteTypeCode') !== 'NEW' &&
            this.getControlValue('QuoteTypeCode') !== '') { /// allow for SOP phase 1
            /// The next virtual is to allow the AccountName to be picked up by the InvoiceGroupNumber lookup
            this.riMaintenance.AddVirtualTable('Account');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('AccountNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('AccountName', MntConst.eTypeTextFree, MntConst.eVirtualKeyStateNormal, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this);

            this.riMaintenance.AddVirtualTable('InvoiceGroup');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('AccountNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableKey('InvoiceGroupNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('InvoiceGroupDesc', MntConst.eTypeTextFree, MntConst.eVirtualKeyStateNormal, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this);
        }

        this.updateEllipsisParams();
        this.riMaintenanceAfterFetch();
    }

    public updateEllipsisParams(): void {
        this.ellipsis.customerTypeEllipsis.childparams.currentContractType = this.getControlValue('ContractTypeCode');
        this.ellipsis.pnolLevelEllipsis.childparams.currentContractType = this.getControlValue('ContractTypeCode');

        this.ellipsis.invoiceGrpNumberEllipsis.childparams.AccountNumber = this.getControlValue('AccountNumber');
        this.ellipsis.invoiceGrpNumberEllipsis.childparams.AccountName = this.getControlValue('AccountName');
        this.ellipsis.invoiceGrpNumberEllipsis.childparams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.invoiceGrpNumberEllipsis.childparams.PremiseNumber = this.getControlValue('PremiseNumber');

        this.ellipsis.siteReferenceEllipsis.childparams.AccountNumber = this.getControlValue('AccountNumber');
        this.ellipsis.siteReferenceEllipsis.childparams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.siteReferenceEllipsis.childparams.ContractName = this.getControlValue('ContractName');
        this.ellipsis.siteReferenceEllipsis.childparams.SearchPostcode = this.getControlValue('PremisePostcode');
        this.ellipsis.siteReferenceEllipsis.childparams.PremiseName = this.getControlValue('PremiseName');
        this.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine1 = this.getControlValue('PremiseAddressLine1');
        this.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine2 = this.getControlValue('PremiseAddressLine2');
        this.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine3 = this.getControlValue('PremiseAddressLine3');
        this.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine4 = this.getControlValue('PremiseAddressLine4');
        this.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine5 = this.getControlValue('PremiseAddressLine5');
        this.ellipsis.siteReferenceEllipsis.childparams.PremisePostcode = this.getControlValue('PremisePostcode');
    }

    public ViewOriginal_OnClick(): void {
        if (this.riExchange.riInputElement.checked(this.uiForm, 'ViewOriginal')) {
            this.riMaintenance.RowID(this, 'dlPremise', this.getControlValue('InitialdlMasterExtRef'));
            this.riMaintenance.FetchRecord();
        } else {
            this.riMaintenance.RowID(this, 'dlPremise', this.riExchange.getParentAttributeValue('dlPremiseRowID'));
            this.setControlValue('dlPremiseROWID', this.riExchange.getParentAttributeValue('dlPremiseRowID'));
            this.riMaintenance.FetchRecord();
        }
    }

    public riMaintenanceAfterFetch(): void {
        /// first time in store the extRef  &&  MasterExtRef values so we can toggle between original  &&  current views
        if (!this.pageParams.storeInitialRefs) {
            this.setControlValue('InitialdlMasterExtRef', this.getControlValue('dlMasterExtRef'));
            if (this.getControlValue('InitialdlMasterExtRef') === '') {
                this.uiDisplay.tdViewOriginal = false;
            } else {
                this.uiDisplay.tdViewOriginal = true;
            }
            this.pageParams.storeinitialRefs = true;
        }

        this.setControlValue('dlPremiseRef', this.getControlValue('dlExtRef'));

        if (this.getControlValue('ContractCommenceDate') === '') {
            this.pageParams.lUpdateContractCommenceDate = false;
            this.setRequiredStatus('ContractCommenceDate', false);
            this.uiDisplay.tdContractCommenceDateLabel = false;
            this.uiDisplay.tdContractCommenceDate = false;
        } else {
            this.pageParams.lUpdateContractCommenceDate = true;
            this.setRequiredStatus('ContractCommenceDate', true);
            this.uiDisplay.tdContractCommenceDateLabel = true;
            this.uiDisplay.tdContractCommenceDate = true;
        }

        if (this.getControlValue('JobCommenceDate') === '') {
            this.pageParams.lUpdateJobCommenceDate = false;
            this.setRequiredStatus('JobCommenceDate', false);
            this.setRequiredStatus('JobExpiryDate', false);
            this.uiDisplay.tdJobCommenceDateLabel = false;
            this.uiDisplay.tdJobCommenceDate = false;
            this.uiDisplay.tdJobExpiryDateLabel = false;
            this.uiDisplay.tdJobExpiryDate = false;
        } else {
            this.pageParams.lUpdateJobCommenceDate = true;
            this.setRequiredStatus('JobCommenceDate', true);
            this.setRequiredStatus('JobExpiryDate', true);
            this.uiDisplay.tdJobCommenceDateLabel = true;
            this.uiDisplay.tdJobCommenceDate = true;
            this.uiDisplay.tdJobExpiryDateLabel = true;
            this.uiDisplay.tdJobExpiryDate = true;
        }

        this.attributes.dlPremiseRef = this.getControlValue('dlExtRef');

        this.BuildGrid();

        this.DisableTimeWindows();
        this.SetTimeWindows();
        if (!this.riExchange.riInputElement.checked(this.uiForm, 'UpdateableInd')) {
            this.riMaintenance.FunctionUpdate = false;
            this.riMaintenance.FunctionDelete = false;
            this.uiDisplay.CmdGenerateSRAText = false;
            this.uiDisplay.menu = false;
        } else {
            this.riMaintenance.FunctionUpdate = true;
            this.riMaintenance.FunctionDelete = true;
            this.uiDisplay.CmdGenerateSRAText = true;
            this.uiDisplay.menu = true;
        }

        if (this.pageParams.SCEnablePNOLProcessingInSOP) {
            this.uiDisplay.trPNOLFlags1 = true;
            if (this.riExchange.riInputElement.checked(this.uiForm, 'PNOL')) {
                this.setRequiredStatus('PremiseContactEmail', true);
                this.uiDisplay.trPNOLFlags2 = true;
            } else {
                this.setRequiredStatus('PremiseContactEmail', false);
                this.uiDisplay.trPNOLFlags2 = false;
            }
            this.PNOL_OnClick();
        }

        if (this.getControlValue('RoutingSource') === '') {
            this.setControlValue('SelRoutingSource', '');
        } else {
            this.setControlValue('SelRoutingSource', this.getControlValue('RoutingSource'));
        }
    }

    public AddHOptions(): void {
        let hhObj = '00,01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23'.split(',');
        this.dropDown.tweh = [];
        this.dropDown.twsh = [];
        for (let i = 0; i < hhObj.length; i++) {
            this.dropDown.tweh.push({ value: hhObj[i], label: hhObj[i] });
            this.dropDown.twsh.push({ value: hhObj[i], label: hhObj[i] });
        }
    }

    public AddMOptions(): void {
        let mmObj = '00,15,30,45'.split(',');
        this.dropDown.twem = [];
        this.dropDown.twsm = [];
        for (let i = 0; i < mmObj.length; i++) {
            this.dropDown.twem.push({ value: mmObj[i], label: mmObj[i] });
            this.dropDown.twsm.push({ value: mmObj[i], label: mmObj[i] });
        }
    }

    public DisableTimeWindows(): void {
        let tempObj = '01,02,03,04,05,06,07,08,09,10,11,12,13,14'.split(',');
        for (let i = 0; i < tempObj.length; i++) {
            this.riMaintenance.DisableInput('twsh' + tempObj[i]);
            this.riMaintenance.DisableInput('twsm' + tempObj[i]);
            this.riMaintenance.DisableInput('tweh' + tempObj[i]);
            this.riMaintenance.DisableInput('twem' + tempObj[i]);
        }
    }
    public EnableTimeWindows(): void {
        let tempObj = '01,02,03,04,05,06,07,08,09,10,11,12,13,14'.split(',');
        for (let i = 0; i < tempObj.length; i++) {
            this.riMaintenance.EnableInput('twsh' + tempObj[i]);
            this.riMaintenance.EnableInput('twsm' + tempObj[i]);
            this.riMaintenance.EnableInput('tweh' + tempObj[i]);
            this.riMaintenance.EnableInput('twem' + tempObj[i]);
        }
    }
    public SetTimeWindows(): void {
        let tempObj = '01,02,03,04,05,06,07,08,09,10,11,12,13,14'.split(',');
        for (let i = 0; i < tempObj.length; i++) {
            this.setControlValue('twsh' + tempObj[i], this.getControlValue('WindowStarth' + tempObj[i]));
            this.setControlValue('twsm' + tempObj[i], this.getControlValue('WindowStartm' + tempObj[i]));
            this.setControlValue('tweh' + tempObj[i], this.getControlValue('WindowEndh' + tempObj[i]));
            this.setControlValue('twem' + tempObj[i], this.getControlValue('WindowEndm' + tempObj[i]));
        }
    }
    public CheckWindow(): void {
        this.logger.log('CheckWindow---');
        for (let i = 1; i <= 7; i++) {
            if (this.getControlValue('twsh' + this.utils.numberPadding(i, 2)) === '00' &&
                this.getControlValue('twsm' + this.utils.numberPadding(i, 2)) === '00' &&
                this.getControlValue('tweh' + this.utils.numberPadding(i, 2)) === '00' &&
                this.getControlValue('twem' + this.utils.numberPadding(i, 2)) === '00'
            ) {
                this.setControlValue('twsh' + this.utils.numberPadding(i + 7, 2), '00');
                this.setControlValue('twsm' + this.utils.numberPadding(i + 7, 2), '00');
                this.setControlValue('tweh' + this.utils.numberPadding(i + 7, 2), '00');
                this.setControlValue('twem' + this.utils.numberPadding(i + 7, 2), '00');
            }
        }
    }

    public riMaintenance_BeforeUpdate(): void {
        this.riMaintenance.DisableInput('ViewOriginal');
        this.riMaintenance.EnableInput('cmdGetAddress');

        this.SetTimeWindows();
        this.EnableTimeWindows();

        this.PNOL_OnClick();

        this.setRequiredStatus('ContractCommenceDate', this.pageParams.lUpdateContractCommenceDate);
        this.setRequiredStatus('JobCommenceDate', this.pageParams.lUpdateJobCommenceDate);
        this.setRequiredStatus('JobExpiryDate', this.pageParams.lUpdateJobCommenceDate);

        if (!this.pageParams.lUpdateContractCommenceDate) {
            this.riMaintenance.DisableInput('ContractCommenceDate');
        } else {
            this.riMaintenance.EnableInput('ContractCommenceDate');
        }

        if (!this.pageParams.lUpdateJobCommenceDate) {
            this.riMaintenance.DisableInput('JobCommenceDate');
            this.riMaintenance.DisableInput('JobExpiryDate');
        } else {
            this.riMaintenance.EnableInput('JobCommenceDate');
            this.riMaintenance.EnableInput('JobExpiryDate');
        }

        if (this.getControlValue('QuoteTypeCode') === 'AMD' ||
            this.getControlValue('QuoteTypeCode') === 'RED') {
            if (this.riExchange.riInputElement.checked(this.uiForm, 'PNOL')) {
                this.riMaintenance.DisableInput('PNOL');
            }
        }
    }

    public riMaintenance_BeforeMode(): void {
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate || this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.riMaintenance.EnableInput('cmdGeocode');
        } else if (this.riMaintenance.CurrentMode === MntConst.eNormalMode) {
            this.riMaintenance.DisableInput('cmdGeocode');
        }
    }

    public riMaintenance_BeforeSave(): void {
        let tempObj = '01,02,03,04,05,06,07,08,09,10,11,12,13,14'.split(',');
        for (let i = 0; i < tempObj.length; i++) {
            this.setControlValue('WindowStarth' + tempObj[i], this.getControlValue('twsh' + tempObj[i]));
            this.setControlValue('WindowStartm' + tempObj[i], this.getControlValue('twsm' + tempObj[i]));
            this.setControlValue('WindowEndh' + tempObj[i], this.getControlValue('tweh' + tempObj[i]));
            this.setControlValue('WindowEndm' + tempObj[i], this.getControlValue('twem' + tempObj[i]));
        }

        if (this.getControlValue('ClientReference') !== '' ||
            this.getControlValue('PurchaseOrderNo') !== '') {
            this.setRequiredStatus('ClientReference', false);
            this.setRequiredStatus('PurchaseOrderNo', false);
        }

        this.setControlValue('RoutingSource', this.getControlValue('SelRoutingSource'));

        if (this.pageParams.SCEnableRouteOptimisation && this.getControlValue('RoutingSource') === '') {
            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSRoutingSearch.p';
            this.riMaintenance.PostDataAdd('Function', 'GetGeocodeAddress', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('AddressLine1', this.getControlValue('PremiseAddressLine1'), MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('AddressLine2', this.getControlValue('PremiseAddressLine2'), MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('AddressLine3', this.getControlValue('PremiseAddressLine3'), MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('AddressLine4', this.getControlValue('PremiseAddressLine4'), MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('AddressLine5', this.getControlValue('PremiseAddressLine5'), MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('Postcode', this.getControlValue('PremisePostcode'), MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('GPSX', this.getControlValue('GPSCoordinateX'), MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('GPSY', this.getControlValue('GPSCoordinateY'), MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('AddressError', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('GPSX', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('GPSY', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('Score', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('Node', MntConst.eTypeText);
            this.riMaintenance.Execute(this, function (data: any): any {
                if (data.hasError) {
                    this.showAlert(MessageConstant.PageSpecificMessage.unableToGeocode);
                    this.riMaintenance.CancelEvent = true;
                } else {
                    if (data['AddressError'] !== 'Error') {
                        this.setControlValue('RoutingGeonode', data['Node']);
                        this.setControlValue('RoutingScore', data['Score']);
                        this.setControlValue('GPSCoordinateX', data['GPSX']);
                        this.setControlValue('GPSCoordinateY', data['GPSY']);
                        this.setControlValue('SelRoutingSource', 'T');
                        this.setControlValue('RoutingSource', 'T');
                    } else {
                        this.showAlert(MessageConstant.PageSpecificMessage.unableToGeocode);
                        this.riMaintenance.CancelEvent = true;
                    }
                }
            }, 'POST', 1);
        }
    }

    public riMaintenance_AfterSave(): void {
        this.riMaintenance.clear();
        let fieldsArr = this.riExchange.getAllCtrl(this.controls);
        for (let i = 0; i < fieldsArr.length; i++) {
            let id = fieldsArr[i];
            let dataType = this.riMaintenance.getControlType(this.controls, id, 'type');
            let value = this.getControlValue(id);
            this.riMaintenance.PostDataAdd(id, value, dataType);
        }
        this.riMaintenance.Execute(this, function (data: any): any {
            if (data.hasError) {
                this.logger.log('Post data Error', data);
                this.showAlert(MessageConstant.Message.SaveUnSuccessful, 0);
            } else {
                this.logger.log('Post data Saved', data);
                this.showAlert(MessageConstant.Message.SavedSuccessfully, 1);
                this.DisableTimeWindows();
                this.riMaintenance.EnableInput('ViewOriginal');
                this.riMaintenance.DisableInput('cmdGetAddress');
                this.markAsPrestine();
                this.routeAwayGlobals.setSaveEnabledFlag(false);
                if (this.getControlValue('QuoteTypeCode') === 'ADD' ||
                    this.pageParams.ParentMode === 'AddQuote') {
                    this.setControlValue('dlPremiseRef', this.getControlValue('dlExtRef'));
                    this.attributes.dlPremiseRef = this.getControlValue('dlExtRef');
                    this.navigate('AddQuote', InternalMaintenanceSalesModuleRoutes.ICABSSDLSERVICECOVERMAINTENANCE);
                }
            }
        }, 'POST', 2);
    }

    public riMaintenance_AfterAbandon(): void {
        this.DisableTimeWindows();
        this.riMaintenance.EnableInput('ViewOriginal');
        this.riMaintenance.DisableInput('cmdGetAddress');
        this.SetTimeWindows();
    }

    public riMaintenance_BeforeDelete(): void {
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'SubSystem=' + this.getControlValue('SubSystem');
    }

    public riMaintenance_AfterDelete(): void {
        let fields = `dlPremiseROWID, dlBatchRef, dlRecordType, dlExtRef, SubSystem`;
        fields = fields.replace(/\\t/g, '').replace(/\r?\n|\r/g, '').replace(/ /g, '');
        let fieldsArr = fields.split(',');

        this.riMaintenance.clear();
        for (let i = 0; i < fieldsArr.length; i++) {
            let id = fieldsArr[i];
            let dataType = this.riMaintenance.getControlType(this.controls, id, 'type');
            let value = this.getControlValue(id);
            this.riMaintenance.PostDataAdd(id, value, dataType);
        }
        this.riMaintenance.Execute(this, function (data: any): any {
            if (data.hasError) {
                this.logger.log('Post data Error', data);
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            } else {
                this.logger.log('Post data Saved', data);
                this.showAlert(MessageConstant.Message.RecordDeleted, 1);
                this.routeAwayGlobals.setSaveEnabledFlag(false);
                this.riMaintenance.RequestWindowClose = true;
            }
        }, 'POST', 3);
    }

    public menu_onchange(menu: any): void {
        this.logger.log('menu_onchange -- ', menu);
        switch (menu) {
            case 'ServiceCover':
                if (this.getControlValue('QuoteTypeCode') === '') {
                    this.navigate('SOPremise', InternalGridSearchSalesModuleRoutes.ICABSSSOSERVICECOVERGRID, {
                        'dlBatchRef': this.getControlValue('dlBatchRef'),
                        'dlContractRef': (this.getControlValue('dlContractRef')) ? (this.getControlValue('dlContractRef')) : (this.getControlValue('dlPremiseRef').substr(0, this.getControlValue('dlPremiseRef').lastIndexOf('-'))),
                        'dlPremiseRef': this.getControlValue('dlPremiseRef')
                    });
                } else {
                    this.navigate('SOPremise', InternalGridSearchSalesModuleRoutes.ICABSSPIPELINESERVICECOVERGRID);
                }
                break;
            case 'PNOLSetupCharge':
                if (this.riExchange.riInputElement.checked(this.uiForm, 'PNOL') && this.getControlValue('ContractTypeCode') === 'C') {
                    if (this.getControlValue('dlStatusCode') === 'P') {
                        this.navigate('SOPremiseView', 'Sales/iCABSSPNOLSetupChargeEntry.htm'); //iCABSSPNOLSetupChargeEntry.htm //TODO
                    } else {
                        this.navigate('SOPremise', 'Sales/iCABSSPNOLSetupChargeEntry.htm'); //iCABSSPNOLSetupChargeEntry.htm //TODO
                    }
                }
                break;
        }
    }

    public JobCommenceDate_OnChange(): void {
        let ctrl = this.uiForm.controls;
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSdlPremiseMaintenance.p';
        this.riMaintenance.PostDataAdd('Function', 'CalcJobExpiryDate', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.getControlValue('BusinessCode'), MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('JobCommenceDate', this.getControlValue('JobCommenceDate'), MntConst.eTypeDate);
        this.riMaintenance.ReturnDataAdd('JobExpiryDate', MntConst.eTypeDate);
        this.riMaintenance.Execute(this, function (data: any): any {
            this.logger.log('PDA Callback C', data);
            this.setControlValue('JobExpiryDate', data['JobExpiryDate']);
            this.riExchange.Request.BusinessObject = 'iCABSPremiseSRAGrid.p';
        });
    }

    public PremisePostcode_onfocusout(): void {
        if (this.pageParams.SCPostCodeRequired && this.getControlValue('PremisePostcode').trim() === '') {
            this.cmdGetAddress_onclick();
        }
    }

    public CmdGenerateSRAText_onClick(): void {
        if (this.getControlValue('dlStatusCode') !== 'P') {
            this.riMaintenance.clear();
            this.riMaintenance.PostDataAdd('Function', 'GenerateSRAText', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('dlPremiseRowID', this.getControlValue('dlPremiseROWID'), MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('PremiseSpecialInstructions', this.getControlValue('PremiseSpecialInstructions'), MntConst.eTypeTextFree);
            this.riMaintenance.ReturnDataAdd('PremiseSpecialInstructions', MntConst.eTypeTextFree);
            this.riMaintenance.Execute(this, function (data: any): any {
                this.logger.log('PDA Callback D', data);
                this.setControlValue('PremiseSpecialInstructions', data['PremiseSpecialInstructions']);
            }, 'POST', 6);
        }
    }

    public PNOL_OnClick(): void {
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate || this.riMaintenance.CurrentMode === MntConst.eModeSelect) {
            if (this.getControlValue('QuoteTypeCode') === 'AMD' ||
                this.getControlValue('QuoteTypeCode') === 'RED') {

                if (this.pageParams.AlreadyPNOL) {
                    this.uiDisplay.trPNOLLevel = true;
                    this.uiDisplay.trPNOLDescription = true;
                    this.uiDisplay.trPNOLFlags2 = true;
                    this.setRequiredStatus('PremiseContactEmail', true);
                    this.setRequiredStatus('PNOLiCABSLevel', true);
                    this.riMaintenance.EnableInput('PNOLSiteRef');
                    this.setRequiredStatus('PNOLSiteRef', this.getControlValue('ContractTypeCode') === 'J');
                } else {

                    this.setRequiredStatus('PNOLiCABSLevel', false);
                    this.setRequiredStatus('PNOLSiteRef', false);
                    if (this.riExchange.riInputElement.checked(this.uiForm, 'PNOL')) {
                        this.uiDisplay.trPNOLLevel = true;
                        this.uiDisplay.trPNOLDescription = true;
                        this.uiDisplay.trPNOLFlags2 = true;
                        this.setRequiredStatus('PremiseContactEmail', true);
                        this.setRequiredStatus('PNOLiCABSLevel', true);
                        this.riMaintenance.EnableInput('PNOLSiteRef');
                        this.setRequiredStatus('PNOLSiteRef', this.getControlValue('ContractTypeCode') === 'J');
                    } else {
                        this.uiDisplay.trPNOLLevel = false;
                        this.uiDisplay.trPNOLDescription = false;
                        this.uiDisplay.trPNOLFlags2 = false;
                        this.setControlValue('PNOLiCABSLevel', '');
                        this.setControlValue('PNOLDescription', '');
                        this.setControlValue('PNOLSiteRef', '');
                        this.setRequiredStatus('PremiseContactEmail', false);
                    }
                }
            } else {
                this.setRequiredStatus('PNOLiCABSLevel', false);
                this.setRequiredStatus('PNOLSiteRef', false);
                if (this.riExchange.riInputElement.checked(this.uiForm, 'PNOL')) {
                    this.uiDisplay.trPNOLLevel = true;
                    this.uiDisplay.trPNOLDescription = true;
                    this.uiDisplay.trPNOLFlags2 = true;
                    this.setRequiredStatus('PremiseContactEmail', true);
                    this.setRequiredStatus('PNOLiCABSLevel', true);
                    this.riMaintenance.EnableInput('PNOLSiteRef');
                    this.setRequiredStatus('PNOLSiteRef', this.getControlValue('ContractTypeCode') === 'J');
                } else {
                    this.uiDisplay.trPNOLLevel = false;
                    this.uiDisplay.trPNOLDescription = false;
                    this.uiDisplay.trPNOLFlags2 = false;
                    this.setControlValue('PNOLiCABSLevel', '');
                    this.setControlValue('PNOLDescription', '');
                    this.setControlValue('PNOLSiteRef', '');
                    this.setRequiredStatus('PremiseContactEmail', false);
                }
            }
        } /// in update mode
    }

    public ClientReference_onfocusout(): void {
        this.setRequiredStatus('ClientReference', true);
        this.setRequiredStatus('PurchaseOrderNo', true);

        if (this.getControlValue('ClientReference').trim() !== '') {
            this.setRequiredStatus('PurchaseOrderNo', false);
        }
        if (this.getControlValue('PurchaseOrderNo').trim() !== '') {
            this.setRequiredStatus('ClientReference', false);
        }
    }

    public PurchaseOrderNo_onfocusout(): void {
        this.setRequiredStatus('ClientReference', true);
        this.setRequiredStatus('PurchaseOrderNo', true);

        if (this.getControlValue('ClientReference').trim() !== '') {
            this.setRequiredStatus('PurchaseOrderNo', false);
        }
        if (this.getControlValue('PurchaseOrderNo').trim() !== '') {
            this.setRequiredStatus('ClientReference', false);
        }
    }

    public PNOLSiteRef_OnKeyDown(): void {
        //TODO
        //this.navigate('LookUp', 'Application/iCABSAPNOLPremiseSearchGrid.htm');
        // this.invoiceGrpNumberEllipsis.openModal();
    }

    public InvoiceGroupNumber_onkeydown(): void {
        this.invoiceGrpNumberEllipsis.openModal(); //PremiseMaintenanceSearch - iCABSAInvoiceGroupGrid.htm
    }

    public CustomerTypeCode_onkeydown(): void {
        // if (this.riExchange.riInputElement.isLookUpRequested('CustomerTypeCode')) {
        this.customerTypeEllipsis.openModal();
        // }
    }

    //TODO - Not found - required?
    public PremiseSalesEmployee_onkeydown(): void {
        // if (window.event.keyCode = 34) {
        //     riExchange.Mode = 'LookUp-ContractSalesEmployee';: window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBEmployeeSearch.htm';
        // }
    }

    public PNOLiCABSLevel_onkeydown(): void {
        this.pnolLevelEllipsis.openModal();
    }

    public cmdGeocode_OnClick(): void {
        this.showAlert(MessageConstant.Message.PageNotCovered, 2);
        // riExchange.Mode = 'Premise'; window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSARoutingSearch.htm';
    }

    public cmdGetAddress_onclick(): void {
        if (this.pageParams.SCEnableHopewiserPAF) {
            this.showAlert(MessageConstant.Message.PageNotCovered, 2);
            // riExchange.Mode = 'Premise'; window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Model/riMPAFSearch.htm';
        }
    }

    public riExchange_UpDateHTMLDocument(): void {
        //TODO - Not Required ??
        // if (ContractTypeCode.value === 'C' && PNOLSetupChargeRequired.checked this.riExchange.riInputElement.checked(this.uiForm, 'PNOL')) {
        //     PNOLSetupChargeRequired.checked = false;
        //     WindowPath = '/wsscripts/riHTMLWrapper.p?riFileName=Sales/iCABSSPNOLSetupChargeEntry.htm<bottom>';
        //     riExchange.Mode = 'SOPremise'; : window.location = WindowPath;
        // }
    }

    //Grid Functionality below
    public BuildGrid(): void {
        this.Grid.clearGridData();
        let search = new URLSearchParams();
        search.set(this.serviceConstants.Action, '2');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set('riGridMode', '0');
        search.set('dlPremiseRowID', this.riExchange.getParentHTMLValue('dlPremiseROWID'));
        search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        search.set('PageSize', this.itemsPerPage);
        search.set('PageCurrent', this.page.toString());

        let gridIP = {
            method: this.xhrParams.method,
            operation: this.xhrParams.operation,
            module: this.xhrParams.module,
            search: search
        };
        this.Grid.loadGridData(gridIP);
    }

    public GridFocus(rsrcElement: any): void {
        //Not Required
    }

    public onGridRowClick(event: any): void {
        // this.logger.log('onGridRowClick -- ', event, event.cellIndex, event.trRowData[0].text);
        switch (event.cellIndex) {
            case 2:
                this.riMaintenance.clear();
                this.riMaintenance.PostDataAdd('Function', 'CheckBox', MntConst.eTypeText);
                this.riMaintenance.PostDataAdd('SRANumber', event.trRowData[0].text, MntConst.eTypeInteger);
                this.riMaintenance.PostDataAdd('dlPremiseRowID', this.riMaintenance.GetRowID('dlPremiseROWID'), MntConst.eTypeText);
                this.riMaintenance.Execute(this, function (data: any): any {
                    if (!data.hasError) {
                        this.BuildGrid();
                    }
                }, 'POST', 6);
                break;
        }
    }

    public totalRecords = 0;
    public itemsPerPage = this.global.AppConstants().tableConfig.itemsPerPage;
    public maxColumn = 3;
    public currentPage = 1;
    public gridSortHeaders: Array<any> = [];
    public page: number = 1;
    public headerClicked: string = '';
    public sortType: string = 'DESC';
    public storeData: any;

    public refreshGrid(): void {
        this.page = 1;
        this.BuildGrid();
    }
    public getCurrentPage(currentPage: any): void {
        if (this.page !== currentPage.value) {
            this.page = currentPage.value;
            this.BuildGrid();
        }
    }
    public getGridInfo(info: any): void {
        this.totalRecords = info.totalRows;
    }
    public sortGrid(event: any): void {
        //TODO
        this.logger.log('sortGrid -- ', event);
    }

    //DatePickers
    public initDatePickers(): void {
        this.pageParams.dtContractCommenceDate = { value: null, required: false, disabled: false, focus: false };
        this.pageParams.dtJobCommenceDate = { value: null, required: false, disabled: false };
        this.pageParams.dtJobExpiryDate = { value: null, required: false, disabled: false };
        this.pageParams.dtPOExpiryDate = { value: null, required: false, disabled: false };
    }
    public selDate(value: any, id: string, triggerObj?: any): void {
        this.logger.log('DEBUG selDate ', id, value, triggerObj);
        if (value.length === 10 || value === '') { //DD/MM/YYYY
            this.setControlValue(id, value);
            this.riExchange.updateCtrl(this.controls, id, 'value', value);

            this.riExchange.riInputElement.MarkAsDirty(this.uiForm, id);

            if (id.indexOf('DateFrom') !== -1) {
                let newId = id.replace('DateFrom', 'DateTo');
                this.setControlValue(newId, value);
                this.riExchange.updateCtrl(this.controls, newId, 'value', value);
            }

            let normalExec = false;
            if (id.indexOf('PremiseCommenceDate') > -1) {
                if (triggerObj && triggerObj.trigger) {
                    normalExec = true;
                }
            } else {
                normalExec = true;
            }

            let obj: any = this;
            //Change Events //Blur Events //Deactivate events
            for (let j = 0; j < obj.length; j++) {
                //Check if OnChange or OnBlur is implemented
                let fntail = '_OnChange'; if (typeof obj[j][id + fntail] === 'function') { obj[j][id + fntail].call(this); }
                fntail = '_onChange'; if (typeof obj[j][id + fntail] === 'function') { obj[j][id + fntail].call(this); }
                fntail = '_onchange'; if (typeof obj[j][id + fntail] === 'function') { obj[j][id + fntail].call(this); }
                fntail = '_OnBlur'; if (typeof obj[j][id + fntail] === 'function') { obj[j][id + fntail].call(this); }
                fntail = '_onBlur'; if (typeof obj[j][id + fntail] === 'function') { obj[j][id + fntail].call(this); }
                fntail = '_onblur'; if (typeof obj[j][id + fntail] === 'function') { obj[j][id + fntail].call(this); }
                fntail = '_ondeactivate'; if (typeof obj[j][id + fntail] === 'function') { obj[j][id + fntail].call(this); }
            }
        }
    }

    //Change Function
    public onChangeFn(event: any, id?: string): void {
        let target = event.target || event.srcElement || event.currentTarget;
        let idAttr = target.attributes.id.nodeValue;
        let value = target.value;

        this.logger.log('DEBUG onChangeFn --->>', idAttr);
        switch (idAttr) {
            case 'CustomerTypeCode':
                this.riMaintenance.AddVirtualTable('CustomerTypeLanguage');
                this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.AddVirtualTableKey('LanguageCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '=', this.riExchange.LanguageCode(), '', 'Virtual');
                this.riMaintenance.AddVirtualTableKey('CustomerTypeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
                this.riMaintenance.AddVirtualTableField('CustomerTypeDesc', MntConst.eTypeText, MntConst.eVirtualFieldStateNormal, 'Virtual');
                this.riMaintenance.AddVirtualTableCommit(this);
                break;
            case 'PNOLiCABSLevel':
                this.riMaintenance.AddVirtualTable('PestNetOnLineLevel');
                this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.AddVirtualTableKey('PNOLiCabsLevel', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'PNOLiCABSLevel', 'Virtual');
                this.riMaintenance.AddVirtualTableField('PNOLDescription', MntConst.eTypeTextFree, MntConst.eVirtualKeyStateNormal, 'Virtual');
                this.riMaintenance.AddVirtualTableCommit(this);
                break;
            case 'InvoiceGroupNumber':
                break;
        }
    }

    //KeyDown Function
    public onKeydownFn(event: any, id?: string): void {
        let target = event.target || event.srcElement || event.currentTarget;
        let idAttr = target.attributes.id.nodeValue;
        let value = target.value;

        if (event.keyCode === 34) {
            event.preventDefault();
            this.logger.log('DEBUG onKeydownFn --->>', idAttr);
            switch (idAttr) {
                case 'CustomerTypeCode':
                    this.CustomerTypeCode_onkeydown();
                    break;
                case 'PNOLiCABSLevel':
                    this.PNOLiCABSLevel_onkeydown();
                    break;
                case 'InvoiceGroupNumber':
                    this.InvoiceGroupNumber_onkeydown();
                    break;
                case 'PNOLSiteRef':
                    this.PNOLSiteRef_OnKeyDown();
                    break;
            }
        }
    }

    //Ellipsis Data Selection
    public customerTypeEllipsisDataSel(data: any): void {
        if (data) {
            this.setControlValue('CustomerTypeCode', data.CustomerTypeCode);
            this.setControlValue('CustomerTypeDesc', data.CustomerTypeDesc);
        }
    }
    public invoiceGrpNumberEllipsisDataSel(data: any): void {
        if (data) {
            // this.setControlValue('InvoiceGroupNumber', data.InvoiceGroupNumber);
            // this.setControlValue('InvoiceGroupDesc', data.InvoiceGroupDesc);
            this.setControlValue('InvoiceGroupNumber', data.trRowData[0].text);
            this.setControlValue('InvoiceGroupDesc', data.trRowData[1].text);
        }
    }
    public pnolLevelEllipsisDataSel(data: any): void {
        if (data) {
            this.setControlValue('PNOLiCABSLevel', data.PNOLiCABSLevel);
            this.setControlValue('PNOLDescription', data.PNOLDescription);
        }
    }
    public siteReferenceEllipsisDataSel(data: any): void {
        if (data) {
            this.setControlValue('PNOLSiteRef', data.PNOLSiteRef);
            this.setControlValue('PNOLSiteRefDesc', data.PNOLSiteRefDesc);
            this.setControlValue('PNOLiCABSLevel', data.PNOLiCABSLevel);

            if (data.PremiseAddressLine1) {
                this.setControlValue('PremiseAddressLine1', data.PremiseAddressLine1);
                this.setControlValue('PremiseAddressLine2', data.PremiseAddressLine2);
                this.setControlValue('PremiseAddressLine3', data.PremiseAddressLine3);
                this.setControlValue('PremiseAddressLine4', data.PremiseAddressLine4);
                this.setControlValue('PremiseAddressLine5', data.PremiseAddressLine5);
                this.setControlValue('PremisePostcode', data.PremisePostcode);
            }
        }
    }
}
