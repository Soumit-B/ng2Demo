import { InternalGridSearchApplicationModuleRoutes, InternalGridSearchServiceModuleRoutes, InternalMaintenanceServiceModuleRoutes } from './../../base/PageRoutes';
import { URLSearchParams } from '@angular/http';
import { ViewChild } from '@angular/core';
import { PremiseMaintenanceComponent } from './iCABSAPremiseMaintenance';
import { PremiseMaintenance0 } from './iCABSAPremiseMaintenance0';
import { PremiseMaintenance1 } from './iCABSAPremiseMaintenance1';
import { PremiseMaintenance1a } from './iCABSAPremiseMaintenance1a';
import { PremiseMaintenance2 } from './iCABSAPremiseMaintenance2';
import { PremiseMaintenance4 } from './iCABSAPremiseMaintenance4';

import { RiMaintenance, MntConst, RiTab } from './../../../shared/services/riMaintenancehelper';
import { RiExchange } from './../../../shared/services/riExchange';
import { Utils } from './../../../shared/services/utility';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';

export class PremiseMaintenance3 {
    //Duplicated Parent Class objects
    public utils: Utils;
    private xhr: any;
    private xhrParams: any;
    private uiForm: any;
    private controls: any;
    private uiDisplay: any;
    private pageParams: any;
    private attributes: any;
    private formData: any;
    private LookUp: any;
    private logger: any;
    private riExchange: RiExchange;
    private riMaintenance: RiMaintenance;
    private riTab: RiTab;
    private viewChild: any;

    public pgPM0: PremiseMaintenance0;
    public pgPM1: PremiseMaintenance1;
    public pgPM1a: PremiseMaintenance1a;
    public pgPM2: PremiseMaintenance2;
    public pgPM3: PremiseMaintenance3;
    public pgPM4: PremiseMaintenance4;

    constructor(private parent: PremiseMaintenanceComponent) {
        this.utils = this.parent.utils;
        this.logger = this.parent.logger;
        this.xhr = this.parent.xhr;
        this.xhrParams = this.parent.xhrParams;
        this.LookUp = this.parent.LookUp;
        this.uiForm = this.parent.uiForm;
        this.controls = this.parent.controls;
        this.uiDisplay = this.parent.uiDisplay;
        this.viewChild = this.parent.viewChild;
        this.pageParams = this.parent.pageParams;
        this.attributes = this.parent.attributes;
        this.formData = this.parent.formData;
        this.riExchange = this.parent.riExchange;
        this.riMaintenance = this.parent.riMaintenance;
        this.riTab = this.parent.riTab;
    }

    public killSubscription(): void {/* */ }

    public window_onload(): void {
        this.pgPM0 = this.parent.pgPM0;
        this.pgPM1 = this.parent.pgPM1;
        this.pgPM1a = this.parent.pgPM1a;
        this.pgPM2 = this.parent.pgPM2;
        this.pgPM3 = this.parent.pgPM3;
        this.pgPM4 = this.parent.pgPM4;
    }

    public init(): void {
        //Init
        this.pageParams.vbAllowAutoOpenSCScreen = true;
    }

    private doLookup(): any {
        //TODO
        //vSCMultiContactInd = (CAN-FIND(FIRST riRegistry NO-LOCK WHERE riRegistry.RegSection = {&CNFContactPersonRegSection} ) );
        //Belo lookup already executed in PremiseMaintenance(parent)
        // let lookupIP = [{
        //     'table': 'UserAuthority',
        //     'query': { 'BusinessCode': this.pageParams.vBusinessCode, 'UserCode': this.pageParams.gUserCode },
        //     'fields': ['AllowViewOfSensitiveInfoInd', 'AllowUpdateOfContractInfoInd']
        // }];
        // this.LookUp.lookUpPromise(lookupIP).then((data) => {
        //     let recordSet_UserAuthority = data[0];
        //     if (recordSet_UserAuthority.length > 0) {
        //         let record = recordSet_UserAuthority[0];
        //         this.pageParams.glAllowUserAuthView = record.hasOwnProperty('AllowViewOfSensitiveInfoInd') ? record['AllowViewOfSensitiveInfoInd'] : false;
        //         this.pageParams.glAllowUserAuthUpdate = record.hasOwnProperty('AllowUpdateOfContractInfoInd') ? record['AllowUpdateOfContractInfoInd'] : false;
        //     }
        // });
    }

    ////////////////////////////////////////////////Below Code is Grid based //NOT REQUIRED////////////////////////////////////////////////////////
    public totalRecords = 0;
    public itemsPerPage = this.parent.global.AppConstants().tableConfig.itemsPerPage;
    public maxColumn = 3;
    public currentPage = 1;
    public page: number = 1;
    public gridSortHeaders: Array<any> = [];
    public headerClicked: string = '';
    public sortType: string = 'DESC';
    public storeData: any;

    public refreshGrid(): void {
        this.page = 1;
        this.BuildSRAGrid();
    }
    public getCurrentPage(currentPage: any): void {
        if (this.page !== currentPage.value) {
            this.page = currentPage.value;
            this.BuildSRAGrid();
        }
    }
    public getGridInfo(info: any): void {
        this.totalRecords = info.totalRows;
    }
    public sortGrid(event: any): void {
        this.logger.log('sortGrid -- ', event);
    }
    public onGridRowClick(event: any): void {
        let cStrCanUpdate = 'Yes';
        if (!this.riExchange.riInputElement.isDisabled(this.uiForm, 'cmdSRAGenerateText')) {
            cStrCanUpdate = 'No';
        } else {
            cStrCanUpdate = 'Yes';
        }

        switch (event.cellIndex) {
            case 2:
                this.riMaintenance.clear();
                this.riMaintenance.PostDataAdd('GridUniqueID', this.pageParams.GridCacheTime, MntConst.eTypeText);
                this.riMaintenance.PostDataAdd('CanUpdate', cStrCanUpdate, MntConst.eTypeText);
                this.riMaintenance.PostDataAdd('ContractNumber', this.parent.getControlValue('ContractNumber'), MntConst.eTypeText);
                this.riMaintenance.PostDataAdd('PremiseNumber', this.parent.getControlValue('PremiseNumber'), MntConst.eTypeText);
                this.riMaintenance.PostDataAdd('riGridMode', '0', MntConst.eTypeText);
                this.riMaintenance.PostDataAdd('riGridHandle', this.parent.getGridHandle(), MntConst.eTypeText);
                this.riMaintenance.PostDataAdd('ROWID', event.trRowData[0].rowID, MntConst.eTypeText);
                this.riMaintenance.PostDataAdd('Mode', 'SRAToggle', MntConst.eTypeText);
                this.riMaintenance.Execute(this, function (data: any): any {
                    if (!data.hasError) {
                        this.BuildSRAGrid();
                    }
                }, 'POST', 2);
                break;
        }
    }
    public BuildSRAGrid(): void {
        let cStrCanUpdate = 'Yes';
        if (!this.riExchange.riInputElement.isDisabled(this.uiForm, 'cmdSRAGenerateText')) {
            cStrCanUpdate = 'No';
        } else {
            cStrCanUpdate = 'Yes';
        }

        this.parent.Grid.clearGridData();
        let search = new URLSearchParams();
        search.set(this.parent.serviceConstants.Action, '2');
        search.set(this.parent.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.parent.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (!this.pageParams.GridCacheTime) this.pageParams.GridCacheTime = (new Date()).toTimeString().split(' ')[0];
        search.set('GridUniqueID', this.pageParams.GridCacheTime);
        search.set('CanUpdate', cStrCanUpdate);
        search.set('ContractNumber', this.parent.getControlValue('ContractNumber'));
        search.set('PremiseNumber', this.parent.getControlValue('PremiseNumber'));
        search.set('riGridMode', '0');
        search.set('riGridHandle', this.parent.getGridHandle());
        search.set('PageSize', this.itemsPerPage);
        search.set('PageCurrent', this.page.toString());

        let gridIP = {
            method: this.xhrParams.method,
            operation: this.xhrParams.operation,
            module: this.xhrParams.module,
            search: search
        };
        this.parent.Grid.loadGridData(gridIP);
    }
    public PremiseSRADate_OnChange(): void {
        this.parent.pgPM2.riExchange_CBORequest();
    }

    public BuildGblSRARCM(): void {
        //NOT REQUIRED
        // riGridRCM.BusinessObject = "iCABSPremMaintGblSRARCMGrid.p"
        // Set riGridRCM.IEWindow       = Window
        // Set riGridRCM.HTMLdocument   = Document
        // Set riGridRCM.HTMLGridHeader = theadGblSRARCMGrid
        // Set riGridRCM.HTMLGridBody   = tbodyGblSRARCMGrid
        // Set riGridRCM.HTMLGridFooter = tfootGblSRARCMGrid

        // riGridRCM.DefaultBorderColor = "ADD8E6"
        // riGridRCM.DefaultTextColor = "0000FF"
        // riGridRCM.ExportExcel = True
        // riGridRCM.PageSize = 4
        // riGridRCM.FunctionPaging = True
        // riGridRCM.RefreshInterval = 0
        // riGridRCM.HighlightBar = True
        // riGridRCM.Report = True

        // this.riGridRCM.clear()
        // this.riGridRCM.AddColumn("RCMDesc","GblSRARCM","RCMDesc",eTypeTextFree,40,False)
        // this.riGridRCM.AddColumn("RCMSelected","GblSRARCM","RCMSelected",eTypeImage,1,False)
        // this.riGridRCM.complete()
    }

    public BuildGblSRATriggers(): void {
        //NOT REQUIRED
        // riGridTrigger.BusinessObject = "iCABSPremMaintGblSRATriggerGrid.p"
        // Set riGridTrigger.IEWindow       = Window
        // Set riGridTrigger.HTMLdocument   = Document
        // Set riGridTrigger.HTMLGridHeader = theadGblSRATriggerGrid
        // Set riGridTrigger.HTMLGridBody   = tbodyGblSRATriggerGrid
        // Set riGridTrigger.HTMLGridFooter = tfootGblSRATriggerGrid

        // riGridTrigger.DefaultBorderColor = "ADD8E6"
        // riGridTrigger.DefaultTextColor = "0000FF"
        // riGridTrigger.ExportExcel = True
        // riGridTrigger.PageSize = 4
        // riGridTrigger.FunctionPaging = True
        // riGridTrigger.RefreshInterval = 0
        // riGridTrigger.HighlightBar = True
        // riGridTrigger.Report = True

        // this.riGridTrigger.clear()
        // this.riGridTrigger.AddColumn("TriggerDesc","GblSRATrigger","TriggerDesc",eTypeTextFree,40,False)
        // this.riGridTrigger.AddColumn("TriggerSelected","GblSRATrigger","TriggerSelected",eTypeImage,1,False)
        // this.riGridTrigger.complete()
    }

    public BuildSRAHazardEditGrid(): void {
        //NOT REQUIRED
        // riGridSRAHazardEdit.BusinessObject = 'iCABSPremMaintSRAHazEditGrid.p'
        // Set riGridSRAHazardEdit.IEWindow       = Window
        // Set riGridSRAHazardEdit.HTMLdocument   = Document
        // Set riGridSRAHazardEdit.HTMLGridHeader = theadSRAHazardEditGrid
        // Set riGridSRAHazardEdit.HTMLGridBody   = tbodySRAHazardEditGrid
        // Set riGridSRAHazardEdit.HTMLGridFooter = tfootSRAHazardEditGrid

        // riGridSRAHazardEdit.DefaultBorderColor = 'ADD8E6'
        // riGridSRAHazardEdit.DefaultTextColor = '0000FF'
        // riGridSRAHazardEdit.ExportExcel = true
        // riGridSRAHazardEdit.PageSize = 4
        // riGridSRAHazardEdit.FunctionPaging = true
        // riGridSRAHazardEdit.RefreshInterval = 0
        // riGridSRAHazardEdit.HighlightBar = true
        // riGridSRAHazardEdit.Report = true

        // this.riGridSRAHazardEdit.clear()
        // this.riGridSRAHazardEdit.AddColumn('HazardSeq','PremGblSRAHazardRCM','HazardSeq',eTypeInteger,4,true)
        // this.riGridSRAHazardEdit.AddColumn('HazardDesc','PremGblSRAHazardRCM','HazardDesc',eTypeTextFree,40,false)
        // this.riGridSRAHazardEdit.AddColumn('RCMDesc','PremGblSRAHazardRCM','HazardDesc',eTypeText,40,false)
        // this.riGridSRAHazardEdit.AddColumn('LocationDesc','PremGblSRAHazardRCM','LocationDesc',eTypeText,40,false)
        // this.riGridSRAHazardEdit.AddColumn('AddLocationDesc','PremGblSRAHazardRCM','AddLocationDesc',eTypeText,40,false)
        // this.riGridSRAHazardEdit.AddColumn('TriggerDesc','PremGblSRAHazardRCM','TriggerDesc',eTypeText,40,false)
        // this.riGridSRAHazardEdit.AddColumn('AddCustReq','PremGblSRAHazardRCM','AddCustReq',eTypeText,40,false)
        // this.riGridSRAHazardEdit.AddColumn('AddComments','PremGblSRAHazardRCM','AddComments',eTypeText,40,false)
        // this.riGridSRAHazardEdit.AddColumn('PremSRADateEmp','PremGblSRAHazardRCM','PremSRADateEmp',eTypeTextFree,20,false)
        // this.riGridSRAHazardEdit.AddColumn('SafeToProceed','PremGblSRAHazardRCM','SafeToProceed',eTypeImage,1,false)
        // this.riGridSRAHazardEdit.AddColumn('DeleteHazardRCM','PremGblSRAHazardRCM','DeleteHazardRCM',eTypeImage,1,false)

        // this.riGridSRAHazardEdit.AddColumnAlign('HazardSeq',eAlignCenter)

        // this.riGridSRAHazardEdit.complete()
    }

    public riGrid_BeforeExecute(): void {
        //NOT REQUIRED
        // let cStrCanUpdate
        // if ( not cmdSRAGenerateText.disabled ) {
        //   cStrCanUpdate = 'No'
        // } else {
        //   cStrCanUpdate = 'Yes'
        // }
        // riGrid.BusinessObjectPostData = 'BusinessCode='    & this.utils.getBusinessCode() & _
        //                                 '&GridUniqueID='   & GridCacheTime & _
        //                                 '&CanUpdate='      & cStrCanUpdate & _
        //                                 '&ContractNumber=' & ContractNumber.value & _
        //                                 '&PremiseNumber='  & PremiseNumber.value

        // if ( riGrid.Update ) {
        //   riGrid.StartRow    = SelectedSRA.getAttribute('Row')
        //   riGrid.StartColumn = 0
        //   riGrid.RowID       = SelectedSRA.getAttribute('RowID')
        //   riGrid.UpdateHeader = false
        //   riGrid.UpdateBody   = true
        //   riGrid.UpdateFooter = false
        // }
    }

    public riGrid_BodyOnClick(): void {
        //NOT REQUIRED
        // if ( cmdSRAGenerateText.disabled = false ) { //COMMENTED- Only allow when adding/updating etc..
        //   this.SelectedRowFocus(window.event.srcElement.parentElement.parentElement.Children(0).Children(0))
        // }
    }

    public SelectedRowFocus(rsrcElement: any): void { // (byref rsrcElement)
        //NOT REQUIRED
        // rsrcElement.select
        // SelectedSRA.setAttribute 'Row', rsrcElement.parentElement.parentElement.sectionRowIndex
        // SelectedSRA.setAttribute 'Cell', rsrcElement.parentElement.cellIndex
        // SelectedSRA.setAttribute 'RowID', rsrcElement.getAttribute('RowID')
        // rsrcElement.focus
    }

    public riGrid_BodyOnDblClick(): void {
        //NOT REQUIRED
        // if (cmdSRAGenerateText.disabled = false) { //COMMENTED- Only allow when adding/updating etc..
        //   if (window.event.srcElement.Name = 'SRASelected') {
        //     riGrid.Update = true
        //     riGrid.Execute()
        //   }
        // }
    }

    //GblSRARCMGrid
    public riGridRCM_BeforeExecute(): void {
        //NOT REQUIRED
        // let cStrCanUpdate
        // if (vbGblSRAMode = '') {
        //   cStrCanUpdate = 'No'
        // } else {
        //   cStrCanUpdate = 'Yes'
        // }

        // riGridRCM.BusinessObjectPostData = 'BusinessCode=' & this.utils.getBusinessCode() & _
        // '&CanUpdate=' & cStrCanUpdate & _
        // '&GridUniqueID=' & GridCacheTime & _
        // '&ContractNumber=' & ContractNumber.value & _
        // '&PremiseNumber=' & PremiseNumber.value & _
        // '&GblSRATypeCode=' & GBLSRATypeCode.value & _
        // '&HazardSequence=' & HazardSequence.value

        // if (riGridRCM.Update) {
        //   riGridRCM.StartRow = SelectedRCM.getAttribute('Row')
        //   riGridRCM.StartColumn = 0
        //   riGridRCM.RowID = SelectedRCM.getAttribute('RowID')
        //   riGridRCM.UpdateHeader = false
        //   riGridRCM.UpdateBody = true
        //   riGridRCM.UpdateFooter = false
        // }
    }

    public riGridRCM_BodyOnClick(): void {
        //NOT REQUIRED
        // this.SelectedRCMRowFocus(window.event.srcElement.parentElement.parentElement.Children(0))
    }

    public SelectedRCMRowFocus(rsrcElement: any): void {
        //NOT REQUIRED
        // SelectedRCM.setAttribute 'Row', rsrcElement.parentElement.sectionRowIndex
        // SelectedRCM.setAttribute 'Cell', rsrcElement.cellIndex
        // SelectedRCM.setAttribute 'RowID', rsrcElement.getAttribute('AdditionalProperty')
        // rsrcElement.focus
    }

    public riGridRCM_BodyOnDblClick(): void {
        //NOT REQUIRED
        // if (window.event.srcElement.Name = 'RCMSelected') {
        //   riGridRCM.Update = true
        //   riGridRCM.Execute()
        //   this.riExchange.ProcessDoEvents
        //   Do While riExchange.Busy
        //   this.riExchange.ProcessDoEvents()
        //   Loop
        //   this.CheckSafeToProceed
        // }
    }
    //End GblSRARCMGrid

    //Start GblSRATriggerGrid
    public riGridTrigger_BeforeExecute(): void {
        //NOT REQUIRED
        // let cStrCanUpdate
        // if (vbGblSRAMode = '') {
        //   cStrCanUpdate = 'No'
        // } else {
        //   cStrCanUpdate = 'Yes'
        // }

        // riGridTrigger.BusinessObjectPostData = 'BusinessCode=' & this.utils.getBusinessCode() & _
        // '&CanUpdate=' & cStrCanUpdate & _
        // '&GridUniqueID=' & GridCacheTime & _
        // '&ContractNumber=' & ContractNumber.value & _
        // '&PremiseNumber=' & PremiseNumber.value & _
        // '&GblSRATypeCode=' & GBLSRATypeCode.value & _
        // '&HazardSequence=' & HazardSequence.value

        // if (riGridTrigger.Update) {
        //   riGridTrigger.StartRow = SelectedTrigger.getAttribute('Row')
        //   riGridTrigger.StartColumn = 0
        //   riGridTrigger.RowID = SelectedTrigger.getAttribute('RowID')
        //   riGridTrigger.UpdateHeader = false
        //   riGridTrigger.UpdateBody = true
        //   riGridTrigger.UpdateFooter = false
        // }
    }

    public riGridTrigger_BodyOnClick(): void {
        //NOT REQUIRED
        // this.SelectedTriggerRowFocus(window.event.srcElement.parentElement.parentElement.Children(0))
    }

    public SelectedTriggerRowFocus(rsrcElement: any): void {
        //NOT REQUIRED
        // //COMMENTED-rsrcElement.select
        // SelectedTrigger.setAttribute 'Row', rsrcElement.parentElement.sectionRowIndex
        // SelectedTrigger.setAttribute 'Cell', rsrcElement.cellIndex
        // SelectedTrigger.setAttribute 'RowID', rsrcElement.getAttribute('AdditionalProperty')
        // rsrcElement.focus
    }

    public riGridTrigger_BodyOnDblClick(): void {
        //NOT REQUIRED
        // if (window.event.srcElement.Name = 'TriggerSelected') {
        //   riGridTrigger.Update = true
        //   riGridTrigger.Execute()
        //   this.riExchange.ProcessDoEvents
        //   Do While riExchange.Busy
        //   this.riExchange.ProcessDoEvents()
        //   Loop
        //   this.CheckSafeToProceed
        // }
    }
    //End GBL SRATrigger Grid

    public riGridSRAHazardEdit_BeforeExecute(): void {
        //NOT REQUIRED
        // let cStrCanUpdate
        // if (vbGblSRAMode = '') {
        //   cStrCanUpdate = 'No'
        // } else {
        //   cStrCanUpdate = 'Yes'
        // }
        // riGridSRAHazardEdit.BusinessObjectPostData = 'BusinessCode=' & this.utils.getBusinessCode() & _
        // '&CanUpdate=' & cStrCanUpdate & _
        // '&GridUniqueID=' & GridCacheTime & _
        // '&ContractNumber=' & ContractNumber.value & _
        // '&PremiseNumber=' & PremiseNumber.value & _
        // '&GblSRATypeCode=' & GBLSRATypeCode.value

        // if (riGridSRAHazardEdit.Update) {
        //   riGridSRAHazardEdit.StartRow = SelectedSRAHazard.getAttribute('Row')
        //   riGridSRAHazardEdit.StartColumn = 0
        //   riGridSRAHazardEdit.RowID = SelectedRCM.getAttribute('RowID')
        //   riGridSRAHazardEdit.UpdateHeader = false
        //   riGridSRAHazardEdit.UpdateBody = true
        //   riGridSRAHazardEdit.UpdateFooter = false
        // }
    }

    public riGridSRAHazardEdit_BodyOnClick(): void {
        //NOT REQUIRED
        // if (this.riMaintenance.CurrentMode = eModeUpdate AND riGridSRAHazardEdit.CurrentColumnName = 'HazardSeq' ) {
        //   this.SelectedHazardRowFocus(window.event.srcElement.parentElement.parentElement.Children(0).Children(0))
        //   this.PremGblSRAFetch()
        //   this.riTab.TabFocus('Global SRA Input')
        //   cmdQuestionnaireComp.style.display = ''
        //   vbGblSRAMode = 'Edit'
        // }
    }

    public riGridSRAHazardEdit_BodyOnDblClick(): void {
        //NOT REQUIRED
        // if (this.riMaintenance.CurrentMode = eModeUpdate AND riGridSRAHazardEdit.CurrentColumnName = 'DeleteHazardRCM' ) {
        //   this.SelectedHazardRowFocus(window.event.srcElement.parentElement.parentElement.Children(0).Children(0))
        //   this.DeletePremGblSRAHazardRCM()
        //   this.riExchange.ProcessDoEvents
        //   Do While riExchange.Busy
        //   this.riExchange.ProcessDoEvents()
        //   Loop

        //   this.riGridSRAHazardEdit.Execute()
        // }
    }

    public SelectedHazardRowFocus(rsrcElement: any): void {
        //NOT REQUIRED
        // HazardSequence.value = rsrcElement.getAttribute('AdditionalProperty')
        // RCMNumber.value = riGridSRAHazardEdit.Functions.Details.getAttribute('DeleteHazardRCM', 'AdditionalProperty')
        // rsrcElement.focus
    }

    public riTab_TabFocusBefore(): void {
        //NOT REQUIRED
        // if (this.riMaintenance.CurrentMode = MntConst.eModeAdd Or this.riMaintenance.CurrentMode = eModeUpdate ) {
        // switch (){ //riTab.ToTabID
        // Case 'grdGblSRAInput', 'grdGblSRAEdit'
        // thGblSRAControl.style.display = ''
        // Case
        // } else {
        // thGblSRAControl.style.display = 'none'
        // }
        // } else {
        // thGblSRAControl.style.display = 'none'
        // }
    }

    public riTab_TabFocusAfter(): void {
        //NOT REQUIRED
        // //COMMENTED- Refresh The Grid On Entry To The Tab
        // if(riTab.CurrentTabid = 'grdSpecial') {
        //   this.riGrid.Execute()
        // }
    }
    ////////////////////////////////////////////////Above Code is Grid based //NOT REQUIRED////////////////////////////////////////////////////////


    public HazardDesc_onkeydown(obj: any): void {
        if (obj.KeyCode === 34 && this.pageParams.vbGblSRAMode === 'Add') {
            //TODO - Page not ready
            this.parent.navigate('PremHazard', 'Business/iCABSBGblSRAHazardSearch.htm');
            this.SetHazardResponse();
        }
    }

    public LocationDesc_onkeydown(obj: any): void {
        if (obj.KeyCode === 34 && (this.pageParams.vbGblSRAMode === 'Add' || this.pageParams.vbGblSRAMode === 'Edit')) {
            this.parent.setControlValue('GridUniqueID', this.pageParams.GridCacheTime);
            //TODO - Page not ready
            this.parent.navigate('PremSRA', 'Application/iCABSALocationGrid.htm');
        }
    }

    public BuildPremGblSRACache(): void {
        let ctrl = this.uiForm.controls;
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSPremiseMaintGblSRA.p';
        this.riMaintenance.PostDataAdd('Function', 'BuildPremGblSRACache', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('PremiseNumber', ctrl.PremiseNumber.value, MntConst.eTypeInteger);
        this.riMaintenance.PostDataAdd('GblSRATypeCode', ctrl.GblSRATypeCode.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('GridUniqueID', this.pageParams.GridCacheTime, MntConst.eTypeTextFree);
        this.riMaintenance.Execute(this, function (data: any): any {
            this.logger.log('PDA Callback 3A', data);
        });
    }

    public PremGblSRAFetch(): void {
        let ctrl = this.uiForm.controls;
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSPremiseMaintGblSRA.p';
        this.riMaintenance.PostDataAdd('Function', 'FetchGblSRAHazard', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('PremiseNumber', ctrl.PremiseNumber.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('GridUniqueID', this.pageParams.GridCacheTime, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('GblSRATypeCode', ctrl.GblSRATypeCode.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('HazardSequence', ctrl.HazardSequence.value, MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('HazardFreeText', MntConst.eTypeTextFree);
        this.riMaintenance.ReturnDataAdd('LocationDesc', MntConst.eTypeTextFree);
        this.riMaintenance.ReturnDataAdd('AdditionalLocations', MntConst.eTypeTextFree);
        this.riMaintenance.ReturnDataAdd('AdditionalActionComments', MntConst.eTypeTextFree);
        this.riMaintenance.ReturnDataAdd('SafeToProceed', MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('AdditionalCustomerRequirements', MntConst.eTypeTextFree);
        this.riMaintenance.Execute(this, function (data: any): any {
            this.parent.setControlValue('HazardFreeText', data['HazardFreeText']);
            this.parent.setControlValue('LocationDesc', data['LocationDesc']);
            this.parent.setControlValue('AdditionalLocations', data['AdditionalLocations']);
            this.parent.setControlValue('AdditionalActionComments', data['AdditionalActionComments']);
            this.parent.setControlValue('SafeToProceed', data['SafeToProceed']);
            this.parent.setControlValue('AdditionalCustomerRequirements', data['AdditionalCustomerRequirements']);
            this.SetHazardResponse();
            this.CheckSafeToProceed();
        });
    }

    public SetHazardResponse(): void {
        let ctrl = this.uiForm.controls;
        if (ctrl.HazardSequence.value !== '') {
            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSPremiseMaintGblSRA.p';
            this.riMaintenance.PostDataAdd('Function', 'SetHazardResponse', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('GblSRATypeCode', ctrl.GblSRATypeCode.value, MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('HazardSequence', ctrl.HazardSequence.value, MntConst.eTypeInteger);
            this.riMaintenance.ReturnDataAdd('HazardResponse', MntConst.eTypeInteger);
            this.riMaintenance.ReturnDataAdd('HazardDesc', MntConst.eTypeTextFree);
            this.riMaintenance.Execute(this, function (data: any): any {
                this.parent.setControlValue('HazardResponse', data['HazardResponse']);
                this.parent.setControlValue('HazardDesc', data['HazardDesc']);
                this.PremGblSRAEnable();
            });
        }
    }

    public PremGblSRAEnable(): void {
        let ctrl = this.uiForm.controls;
        this.uiDisplay.tblTriggerGrid = true;
        this.uiDisplay.tblTriggerControl = true;
        //riGridTrigger.Execute()
        if (ctrl.HazardResponse.value === '1') { //Require RCM
            this.uiDisplay.trRCMGrid = true;
            this.uiDisplay.tblRCMControl = true;
            //riGridRCM.Execute()
        }
        else {
            if (ctrl.HazardResponse.value === '2') {
                this.uiDisplay.trHazardFree = true; //Require Hazard Free Text
            }
            //TODO HazardFreeText.readonly = false;
            this.riExchange.riInputElement.Enable(this.uiForm, 'LocationDesc');
            this.riExchange.riInputElement.Enable(this.uiForm, 'AdditionalLocations');
            //TODO AdditionalActionComments.readonly = false;
            this.riExchange.riInputElement.Enable(this.uiForm, 'SafeToProceed');
            //TODO AdditionalCustomerRequirements.readonly = false;
        }
    }

    public PremGblSRADisable(): void {
        this.parent.setControlValue('HazardDesc', '');
        this.parent.setControlValue('HazardSequence', '');
        this.parent.setControlValue('HazardResponse', '');
        this.parent.setControlValue('HazardFreeText', '');
        this.parent.setControlValue('LocationCode', '');
        this.parent.setControlValue('LocationDesc', '');
        this.parent.setControlValue('AdditionalLocations', '');
        this.parent.setControlValue('AdditionalActionComments', '');
        this.parent.setControlValue('SafeToProceed', '');
        this.parent.setControlValue('AdditionalCustomerRequirements', '');
        this.uiDisplay.tblTriggerGrid = false;
        this.uiDisplay.tblTriggerControl = false;
        this.uiDisplay.trRCMGrid = false;
        this.uiDisplay.tblRCMControl = false;
        this.uiDisplay.trHazardFree = false;
        //TODO HazardDesc.readonly = true
        //TODO HazardFreeText.readonly = true
        //TODO LocationDesc.readonly = true
        this.riExchange.riInputElement.Disable(this.uiForm, 'AdditionalLocations');
        //TODO AdditionalActionComments.readonly = true
        this.riExchange.riInputElement.Disable(this.uiForm, 'SafeToProceed');
        //TODO AdditionalCustomerRequirements.readonly = true
        if (this.pageParams.vbGblSRAMode === '') {
            this.uiDisplay.thGblSRAControl = false;
            this.uiDisplay.cmdQuestionnaireComp = false;
        }
    }

    public cmdSRAGenerateText_OnClick(): void {
        let ctrl = this.uiForm.controls;
        this.riMaintenance.BusinessObject = 'iCABSPremiseMaintSRAGrid.p';
        this.riMaintenance.clear();
        this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeInteger);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('Function', 'GenerateSRAText', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('PremiseNumber', ctrl.PremiseNumber.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('PremiseSpecialInstructions', ctrl.PremiseSpecialInstructions.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('GridUniqueID', this.pageParams.GridCacheTime, MntConst.eTypeTextFree);
        this.riMaintenance.ReturnDataAdd('PremiseSpecialInstructions', MntConst.eTypeTextFree);
        this.riMaintenance.Execute(this, function (data: any): any {
            this.parent.setControlValue('PremiseSpecialInstructions', data['PremiseSpecialInstructions']);
        }, 'POST');
    }

    public PremGblSRASave(GblSRASaveMode: any): void {
        let ctrl = this.uiForm.controls;
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSPremiseMaintGblSRA.p';
        this.riMaintenance.PostDataAdd('Function', 'Save', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('AddMode', GblSRASaveMode, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('PremiseNumber', ctrl.PremiseNumber.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('GridUniqueID', this.pageParams.GridCacheTime, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('GblSRATypeCode', ctrl.GblSRATypeCode.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('HazardSequence', ctrl.HazardSequence.value, MntConst.eTypeInteger);
        this.riMaintenance.PostDataAdd('HazardResponse', ctrl.HazardResponse.value, MntConst.eTypeInteger);
        this.riMaintenance.PostDataAdd('HazardFreeText', ctrl.HazardFreeText.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('AdditionalLocations', ctrl.AdditionalLocations.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('AdditionalActionComments', ctrl.AdditionalActionComments.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('SafeToProceed', ctrl.SafeToProceed.value, MntConst.eTypeInteger);
        this.riMaintenance.PostDataAdd('AdditionalCustomerRequirements', ctrl.AdditionalCustomerRequirements.value, MntConst.eTypeTextFree);
        this.riMaintenance.Execute(this, function (data: any): any {
            this.pageParams.vbGblSRAMode = ''; //Reset mode
            this.PremGblSRADisable();
        });

    }

    public DeletePremGblSRAHazardRCM(): void {
        let ctrl = this.uiForm.controls;
        this.riMaintenance.BusinessObject = 'iCABSPremiseMaintGblSRA.p';
        this.riMaintenance.clear();
        this.riMaintenance.PostDataAdd('Function', 'DeletePremSRAHazRCM', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('PremiseNumber', ctrl.PremiseNumber.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('GridUniqueID', ctrl.GridUniqueID.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('GblSRATypeCode', ctrl.GblSRATypeCode.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('HazardSequence', ctrl.HazardSequence.value, MntConst.eTypeInteger);
        this.riMaintenance.PostDataAdd('RCMNumber', ctrl.RCMNumber.value, MntConst.eTypeInteger);
        this.riMaintenance.Execute(this, function (data: any): any {
            this.pageParams.vbGblSRAMode = ''; //Reset mode
            this.PremGblSRADisable();
        });
    }

    public CheckSafeToProceed(): void {
        let ctrl = this.uiForm.controls;
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSPremiseMaintGblSRA.p';
        this.riMaintenance.PostDataAdd('Function', 'CheckSafeToProceed', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('PremiseNumber', ctrl.PremiseNumber.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('GridUniqueID', this.pageParams.GridCacheTime, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('GblSRATypeCode', ctrl.GblSRATypeCode.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('HazardSequence', ctrl.HazardSequence.value, MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('NotSafeToProceed', MntConst.eTypeCheckBox);
        this.riMaintenance.Execute(this, function (data: any): any {
            if (data['NotSafeToProceed']) {
                ctrl.SafeToProceed.value = '0';
                this.riExchange.riInputElement.Disable(this.uiForm, 'SafeToProceed');
            }
            else {
                this.riExchange.riInputElement.Enable(this.uiForm, 'SafeToProceed');
            }
        });

    }

    public cmdAddNextHazard_onClick(): void {
        if (this.pageParams.vbGblSRAMode === 'Add') {
            this.PremGblSRASave('Add');
        }
        if (this.pageParams.vbGblSRAMode === 'Edit') {
            this.PremGblSRASave('Edit');
        }
        if (this.pageParams.vbGblSRAMode === '') {
            //Tab not required -->this.riTab.TabFocus('Global SRA Input') //New Tab
            this.uiDisplay.cmdQuestionnaireComp = true;
            this.pageParams.vbGblSRAMode = 'Add';
            this.viewChild.HazardDesc.focus();
        }
    }

    public cmdQuestionnaireComp_onClick(): void {
        if (this.pageParams.vbGblSRAMode === 'Add') {
            this.PremGblSRASave('Add');
        }
        if (this.pageParams.vbGblSRAMode === 'Edit') {
            this.PremGblSRASave('Edit');
        }
        if (this.pageParams.vbGblSRAMode === '') {
            //tab not required -->this.riTab.TabFocus(='Global SRA Edit';) //Edit Tab
            //this.riGridSRAHazardEdit.Execute()
            this.uiDisplay.cmdQuestionnaireComp = true;
        }
    }

    public cmdGeocode_OnClick(): void {
        this.parent.showAlert(MessageConstant.Message.PageNotCovered, 2);
        // this.parent.navigate('Premise', 'Application/iCABSARoutingSearch.htm'); //TODO - Not ready yet
    }

    public cmdProductSales_onclick(event: any): void {
        this.parent.promptContent = MessageConstant.PageSpecificMessage.AddProductSales;
        this.parent.promptModal.show();
        this.parent.callbackPrompts.push(this.parent.pgPM3.cmdProductSalesHandle);
        this.parent.setControlValue('menu', 'Options');
    }

    public cmdProductSalesHandle(): void {
        let dtProductSaleCommenceDate: string = '';
        let ctrl = this.uiForm.controls;
        if (this.pageParams.promptAns) {
            if (this.pageParams.vbEnableProductSaleCommenceDate) {
                //TODO - Page not ready
                this.parent.showAlert(MessageConstant.Message.PageNotCovered, 2); //DELETE
                dtProductSaleCommenceDate = this.utils.formatDate(new Date()); //DELETE

                this.parent.navigate('', 'Application/iCABSAProductSaleCommenceDate.htm');
                this.parent.setControlValue('dtProductSaleCommenceDate', this.riExchange.getParentAttributeValue('ProductSaleCommenceDate'));
            } else {
                dtProductSaleCommenceDate = this.utils.formatDate(new Date());
            }
            if (dtProductSaleCommenceDate !== '') {
                this.riMaintenance.clear();
                this.riMaintenance.BusinessObject = 'iCABSPremiseEntry.p';
                this.riMaintenance.PostDataAdd('Function', 'AddProductSales', MntConst.eTypeText);
                this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeCode);
                this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
                this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeCode);
                this.riMaintenance.PostDataAdd('PremiseNumber', ctrl.PremiseNumber.value, MntConst.eTypeCode);
                this.riMaintenance.PostDataAdd('ProductSaleCommenceDate', dtProductSaleCommenceDate, MntConst.eTypeDate);
                this.riMaintenance.ReturnDataAdd('NewPremiseRowID', MntConst.eTypeText);
                this.riMaintenance.Execute(this, function (data: any): any {
                    let urlStrArr = this.location.path().split('?');
                    let urlStr = urlStrArr[0];
                    let qParams = urlStrArr[1]
                        + '&ContractNumber=' + this.parent.getControlValue('ContractNumber')
                        + '&PremiseNumber=' + this.parent.getControlValue('PremiseNumber')
                        + '&reload=true';
                    this.location.replaceState(urlStr, qParams);
                    this.parent.setControlValue('NewPremiseRowID', data['NewPremiseRowID']);
                    this.parent.navigate('AddFromPremise', ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, {
                        contractTypeCode: 'P'
                    });
                }, 'POST');
            }
        }


    }

    public TechRetentionReasonCode_onkeydown(obj: any): void {
        if (obj.keyCode === 34) {
            //TODO - Page not ready
            this.parent.navigate('Premise', 'Business/iCABSBPremiseTechRetentionReasonsLangSearch.htm');
        }
    }

    public TechRetentionReasonCode_onchange(): void {
        let ctrl = this.uiForm.controls;
        if (ctrl.TechRetentionReasonCode.value !== '') {
            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSExchangeFunctions.p';
            this.riMaintenance.PostDataAdd('PostDesc', 'SetTechRetentionReasonDesc', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('TechRetentionReasonCode', ctrl.TechRetentionReasonCode.value, MntConst.eTypeCode);
            this.riMaintenance.ReturnDataAdd('TechRetentionReasonDesc', MntConst.eTypeText);

            this.riMaintenance.Execute(this, function (data: any): any {
                this.parent.setControlValue('TechRetentionReasonDesc', data['TechRetentionReasonDesc']);
            });
        }
        else {
            this.parent.setControlValue('TechRetentionReasonCode', '');
        }
    }

    public TechRetentionInd_onClick(): void {
        if (this.riExchange.riInputElement.checked(this.uiForm, 'TechRetentionInd')) {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TechRetentionReasonCode', true);
        } else {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TechRetentionReasonCode', false);
            this.parent.setControlValue('TechRetentionReasonCode', '');
            this.parent.setControlValue('TechRetentionReasonDesc', '');
        }
    }
    public CustomerIndicationNumber_onChange(): void { //TODO ctrl not present in html
        this.parent.setControlValue('selCustomerIndicationNumber', this.parent.getControlValue('CustomerIndicationNumber'));
    }

    public SelCustomerIndicationNumber_onChange(): void {
        this.parent.setControlValue('CustomerIndicationNumber', this.parent.getControlValue('selCustomerIndicationNumber'));
    }

    public setPurchaseOrderFields(): void {
        this.parent.isRequesting = true;
        let ctrl = this.uiForm.controls;
        let vbContinuousInd: string;
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSPremiseEntry.p';
        this.riMaintenance.PostDataAdd('Function', 'getContinuousInd', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.parent.businessCode(), MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('ContinuousInd', MntConst.eTypeText);
        this.riMaintenance.Execute(this, function (data: any): any {
            vbContinuousInd = this.utils.customTruthyCheck(data['ContinuousInd']) ? data['ContinuousInd'].trim().toUpperCase() : '';
            if (ctrl.PurchaseOrderNo.value === '' || vbContinuousInd === 'NO') {
                this.uiDisplay.tdPurchaseOrderLineNo = false;
                this.uiDisplay.tdPurchaseOrderExpiryDate = false;
            } else {
                this.uiDisplay.tdPurchaseOrderLineNo = true;
                this.uiDisplay.tdPurchaseOrderExpiryDate = true;
            }
            this.parent.isRequesting = false;
        }, 'POST');
        setTimeout(() => { this.parent.isRequesting = false; }, 3000);
    }

    //Town Validation using Postcode
    public PremisePostcode_onchange(): void {
        let ctrl = this.uiForm.controls;
        if (this.pageParams.SCEnablePostcodeDefaulting && this.pageParams.SCEnableDatabasePAF && ctrl.PremisePostcode.value.trim() !== '') {
            this.riMaintenance.BusinessObject = 'iCABSGetPostCodeTownAndState.p';
            this.riMaintenance.clear();
            this.riMaintenance.PostDataAdd('Function', 'GetPostCodeTownAndState', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('Postcode', ctrl.PremisePostcode.value, MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('State', ctrl.PremiseAddressLine5.value, MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('Town', ctrl.PremiseAddressLine4.value, MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('UniqueRecordFound', MntConst.eTypeCheckBox);
            this.riMaintenance.ReturnDataAdd('Postcode', MntConst.eTypeCode);
            this.riMaintenance.ReturnDataAdd('State', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('Town', MntConst.eTypeText);
            this.riMaintenance.Execute(this, function (data: any): any {
                if (!data['UniqueRecordFound']) {
                    setTimeout(() => {
                        if (this.riMaintenance.isModalOpen) {
                            this.parent.callbackHooks.push(function (): void {
                                this.parent.isModalOpen(true);
                                this.parent.PostCodeSearch.openModal();
                            });
                        } else {
                            this.parent.isModalOpen(true);
                            this.parent.PostCodeSearch.openModal();
                        }
                    }, 200);
                } else {
                    this.parent.setControlValue('PremisePostcode', data['Postcode']);
                    this.parent.setControlValue('PremiseAddressLine5', data['State']);
                    this.parent.setControlValue('PremiseAddressLine4', data['Town']);
                }
            }, 'GET', 0);
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd && this.pageParams.SCEnableRepeatSalesMatching && ctrl.PremisePostcode.value.trim() !== '') {
            this.MatchPremise();
            this.GetMatchPremiseNames();
        }
    }

    public MatchPremise(): void {
        this.parent.isRequesting = true;
        let lPremiseMatchedDone: boolean = false;
        let ctrl = this.uiForm.controls;
        this.riMaintenance.BusinessObject = 'iCABSPremiseEntry.p';
        this.riMaintenance.clear();
        this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeInteger);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('Function', 'CheckMatchedPremise', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('AccountNumber', ctrl.AccountNumber.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('PremiseAddressLine4', ctrl.PremiseAddressLine4.value, MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('PremiseAddressLine5', ctrl.PremiseAddressLine5.value, MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('PremisePostcode', ctrl.PremisePostcode.value, MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('MatchedPremise', MntConst.eTypeCheckBox);
        this.riMaintenance.Execute(this, function (data: any): any {
            this.parent.isRequesting = false;
            if (!data.hasError) {
                if (data['MatchedPremise']) {
                    //TODO - Page not ready
                    this.parent.showAlert(MessageConstant.Message.PageNotCovered, 2);
                    // this.navigate('', 'Application/iCABSAPremiseMatchingGrid');
                }
            } else {
                this.parent.showAlert(data.errorMessage);
            }
        }, 'POST');
        lPremiseMatchedDone = true;
        setTimeout(() => { this.parent.isRequesting = false; }, 3000);
    }

    //************************************************************************************
    //* AFTER ABANDON                                                                    *
    //************************************************************************************
    public riMaintenance_AfterAbandon(): void {
        let ctrl = this.uiForm.controls;
        this.riExchange.riInputElement.Disable(this.uiForm, 'cmdSRAGenerateText');
        //this.HideQuickWindowSet(true);
        //this.CheckCanUpdatePNOLDetails();
        if (ctrl.ContractNumber.value !== '/wsscripts/riHTMLWrapper.p?rifileName=') {
            if (ctrl.InactiveEffectDate.value !== '') {
                this.uiDisplay.labelInactiveEffectDate = true;
                this.uiDisplay.InactiveEffectDate = true;
                if (ctrl.LostBusinessDesc.value !== '') {
                    this.uiDisplay.LostBusinessDesc = true;
                    //TODO title
                    //ctrl.LostBusinessDesc.title = ctrl.LostBusinessDesc2.value + chr(10) + ctrl.LostBusinessDesc3.value;
                } else {
                    this.uiDisplay.LostBusinessDesc = false;
                }
            }
            else {
                this.uiDisplay.labelInactiveEffectDate = false;
                this.uiDisplay.InactiveEffectDate = false;
                this.uiDisplay.LostBusinessDesc = false;
            }
            if (ctrl.ShowValueButton.checked) { //TODO CHECKBOX
                this.uiDisplay.cmdValue = true;
            } else {
                this.uiDisplay.cmdValue = false;
            }
            //TODO CHECKBOX DrivingChargeInd
            if (this.parent.getControlValue('SCEnableDrivingCharges') && this.parent.getControlValue('DrivingChargeInd') && this.pageParams.CurrentContractType !== 'P') {
                this.uiDisplay.tdDrivingChargeValueLab = true;
                this.uiDisplay.tdDrivingChargeValue = true;
            } else {
                this.uiDisplay.tdDrivingChargeValueLab = false;
                this.uiDisplay.tdDrivingChargeValue = false;
            }
            this.riMaintenance_AfterSaveUpdate();
        }
        this.riExchange.riInputElement.Disable(this.uiForm, 'cmdResendPremises');
        if (this.pageParams.vbEnableGlobalSiteRiskAssessment) {
            this.pageParams.vbGblSRAMode = '';
            this.PremGblSRADisable();
        }
    }

    //************************************************************************************
    //* Query Unload HTML Document                                                       *
    //************************************************************************************
    public riExchange_UpdateHTMLDocument(): void {
        let ctrl = this.uiForm.controls;
        if (ctrl.WindowClosingName.value === 'InvoiceNarrativeAmendmentsMade') {
            this.riExchange.getParentAttributeValue('InvoiceNarrativeText');
        }

        //Returned From Contact Person Maintenance With Changes - So Force A Refresh Of The Details
        if (ctrl.forceRefresh.checked !== true && ctrl.WindowClosingName.value === 'AmendmentsMade') {
            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSContactPersonEntryGrids.p';
            this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeInteger);
            this.riMaintenance.PostDataAdd('Function', 'GetContactPersonChanges', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('PremiseNumber', ctrl.PremiseNumber.value, MntConst.eTypeInteger);
            this.riMaintenance.ReturnDataAdd('ContactPersonFound', MntConst.eTypeTextFree);
            this.riMaintenance.ReturnDataAdd('ContactPersonName', MntConst.eTypeTextFree);
            this.riMaintenance.ReturnDataAdd('ContactPersonPosition', MntConst.eTypeTextFree);
            this.riMaintenance.ReturnDataAdd('ContactPersonDepartment', MntConst.eTypeTextFree);
            this.riMaintenance.ReturnDataAdd('ContactPersonTelephone', MntConst.eTypeTextFree);
            this.riMaintenance.ReturnDataAdd('ContactPersonMobile', MntConst.eTypeTextFree);
            this.riMaintenance.ReturnDataAdd('ContactPersonFax', MntConst.eTypeTextFree);
            this.riMaintenance.ReturnDataAdd('ContactPersonEmail', MntConst.eTypeTextFree);
            this.riMaintenance.Execute(this, function (data: any): any {
                if (data['ContactPersonFound'] === 'Y') {
                    this.parent.setControlValue('PremiseContactName', data['ContactPersonName']);
                    this.parent.setControlValue('PremiseContactPosition', data['ContactPersonPosition']);
                    this.parent.setControlValue('PremiseContactDepartment', data['ContactPersonDepartment']);
                    this.parent.setControlValue('PremiseContactTelephone', data['ContactPersonTelephone']);
                    this.parent.setControlValue('PremiseContactMobile', data['ContactPersonMobile']);
                    this.parent.setControlValue('PremiseContactEmail', data['ContactPersonEmail']);
                    this.parent.setControlValue('PremiseContactFax', data['ContactPersonFax']);
                }
            });
        }
        if (ctrl.forceRefresh.checked) {
            this.riMaintenance.FetchRecord();
            ctrl.forceRefresh.checked = false;
        }
    }

    public riMaintenance_AfterSaveUpdate(): void {
        if (this.pageParams.vSCMultiContactInd) {
            this.uiDisplay.tdBtnAmendContact = true;
        }
        if (this.pageParams.ParentMode === 'AddFromPremise' && this.pageParams.vbAllowAutoOpenSCScreen) {
            this.parent.navigate('Premise-Add', InternalGridSearchServiceModuleRoutes.ICABSAPRODUCTSALESSCENTRYGRID.URL_1);
            this.pageParams.vbAllowAutoOpenSCScreen = false;
        }
    }

    public SensitiseContactDetails(lSensitise: boolean): void {
        if (lSensitise) {
            this.riExchange.riInputElement.Enable(this.uiForm, 'PremiseContactName');
            this.riExchange.riInputElement.Enable(this.uiForm, 'PremiseContactPosition');
            this.riExchange.riInputElement.Enable(this.uiForm, 'PremiseContactDepartment');
            this.riExchange.riInputElement.Enable(this.uiForm, 'PremiseContactMobile');
            this.riExchange.riInputElement.Enable(this.uiForm, 'PremiseContactTelephone');
            this.riExchange.riInputElement.Enable(this.uiForm, 'PremiseContactFax');
            this.riExchange.riInputElement.Enable(this.uiForm, 'PremiseContactEmail');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactName', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactPosition', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactTelephone', true);
        } else {
            this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseContactName');
            this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseContactPosition');
            this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseContactDepartment');
            this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseContactMobile');
            this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseContactTelephone');
            this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseContactFax');
            this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseContactEmail');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactName', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactPosition', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactTelephone', false);
        }
    }

    public BtnAmendContact_OnClick(): void {
        this.parent.pgPM3.cmdContactDetails();
    }

    public cmdContactDetails(): void {
        this.parent.navigate('Premise', InternalMaintenanceServiceModuleRoutes.ICABSCMCONTACTPERSONMAINTENANCE, {
            parentMode: 'Premise',
            contractNumber: this.parent.getControlValue('ContractNumber'),
            premiseNumber: this.parent.getControlValue('PremiseNumber')
        });
    }

    public selQuickWindowSet_onchange(event: any): void {
        let target: any = '', srcID = '', srcValue = '', srcRow = 0;
        if (event.id) {
            target = document.querySelector('#' + event.id);
            srcID = target.getAttribute('id');
        } else {
            target = event.target || event.srcElement || event.currentTarget;
            srcID = target.attributes.id.nodeValue;
        }
        srcValue = target.value;
        srcRow = parseInt(srcID.split('').pop(), 10);

        if (srcValue === 'C') {
            this.riMaintenance.EnableInput('WindowStart' + this.utils.numberPadding(srcRow, 2));
            this.riMaintenance.EnableInput('WindowEnd' + this.utils.numberPadding(srcRow, 2));
            this.riMaintenance.EnableInput('WindowStart' + this.utils.numberPadding(srcRow + 7, 2));
            this.riMaintenance.EnableInput('WindowEnd' + this.utils.numberPadding(srcRow + 7, 2));
        } else {
            this.riMaintenance.DisableInput('WindowStart' + this.utils.numberPadding(srcRow, 2));
            this.riMaintenance.DisableInput('WindowEnd' + this.utils.numberPadding(srcRow, 2));
            this.riMaintenance.DisableInput('WindowStart' + this.utils.numberPadding(srcRow + 7, 2));
            this.riMaintenance.DisableInput('WindowEnd' + this.utils.numberPadding(srcRow + 7, 2));
        }

        switch (srcValue) {
            case 'D':
                this.parent.setControlValue('WindowStart' + this.utils.numberPadding(srcRow, 2), this.parent.getControlValue('DefaultWindowStart' + this.utils.numberPadding(srcRow + srcRow - 1, 2)));
                this.parent.setControlValue('WindowEnd' + this.utils.numberPadding(srcRow, 2), this.parent.getControlValue('DefaultWindowEnd' + this.utils.numberPadding(srcRow + srcRow - 1, 2)));
                this.parent.setControlValue('WindowStart' + this.utils.numberPadding(srcRow + 7, 2), this.parent.getControlValue('DefaultWindowStart' + this.utils.numberPadding(srcRow + srcRow, 2)));
                this.parent.setControlValue('WindowEnd' + this.utils.numberPadding(srcRow + 7, 2), this.parent.getControlValue('DefaultWindowEnd' + this.utils.numberPadding(srcRow + srcRow, 2)));
                break;
            case 'U':
                this.parent.setControlValue('WindowStart' + this.utils.numberPadding(srcRow, 2), '00:00');
                this.parent.setControlValue('WindowEnd' + this.utils.numberPadding(srcRow, 2), '00:00');
                this.parent.setControlValue('WindowStart' + this.utils.numberPadding(srcRow + 7, 2), '00:00');
                this.parent.setControlValue('WindowEnd' + this.utils.numberPadding(srcRow + 7, 2), '00:00');
                break;
            case 'A':
                this.parent.setControlValue('WindowStart' + this.utils.numberPadding(srcRow, 2), '00:00');
                this.parent.setControlValue('WindowEnd' + this.utils.numberPadding(srcRow, 2), '11:59');
                this.parent.setControlValue('WindowStart' + this.utils.numberPadding(srcRow + 7, 2), '12:00');
                this.parent.setControlValue('WindowEnd' + this.utils.numberPadding(srcRow + 7, 2), '23:59');
                break;
        }
    }

    public UpdateBusinessDefaultTimes(): void {
        for (let i = 1; i <= 7; i++) {
            this.riMaintenance.DisableInput('WindowStart' + this.utils.numberPadding(i, 2));
            this.riMaintenance.DisableInput('WindowEnd' + this.utils.numberPadding(i, 2));
            this.riMaintenance.DisableInput('WindowStart' + this.utils.numberPadding(i + 7, 2));
            this.riMaintenance.DisableInput('WindowEnd' + this.utils.numberPadding(i + 7, 2));

            this.parent.setControlValue('WindowStart' + this.utils.numberPadding(i, 2), this.parent.getControlValue('DefaultWindowStart' + this.utils.numberPadding(i + i - 1, 2)));
            this.parent.setControlValue('WindowEnd' + this.utils.numberPadding(i, 2), this.parent.getControlValue('DefaultWindowEnd' + this.utils.numberPadding(i + i - 1, 2)));
            this.parent.setControlValue('WindowStart' + this.utils.numberPadding(i + 7, 2), this.parent.getControlValue('DefaultWindowStart' + this.utils.numberPadding(i + i, 2)));
            this.parent.setControlValue('WindowEnd' + this.utils.numberPadding(i + 7, 2), this.parent.getControlValue('DefaultWindowEnd' + this.utils.numberPadding(i + i, 2)));
        }
    }

    public TermiteServiceCheck(): void {
        this.riMaintenance.BusinessObject = 'iCABSPremiseEntry.p';
        this.riMaintenance.clear();
        this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeInteger);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('Function', 'TermiteServiceCheck', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('ContractNumber', this.parent.getControlValue('ContractNumber'), MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('TermiteWarningDesc', MntConst.eTypeText);
        this.riMaintenance.Execute(this, function (data: any): any {
            if (data['TermiteWarningDesc'] !== '') {
                this.parent.showAlert(data['TermiteWarningDesc'], 2);
            }
        }, 'POST');
    }

    public DefaultFromProspect(): void {
        if (this.riExchange.getParentHTMLValue('ProspectNumber') !== '') {
            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSPremiseEntry.p';
            this.riMaintenance.PostDataAdd('Function', 'DefaultFromProspect', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('ProspectNumber', this.riExchange.getParentHTMLValue('ProspectNumber'), MntConst.eTypeInteger);
            this.riMaintenance.PostDataAdd('SICCodeEnable', this.pageParams.vSICCodeEnable, MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('CustomerTypeCode', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('CustomerTypeDesc', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('SICCode', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('SICDesc', MntConst.eTypeText);
            if (this.pageParams.SCCapitalFirstLtr) {
                this.riMaintenance.ReturnDataAdd('PremiseName', MntConst.eTypeTextFree);
                this.riMaintenance.ReturnDataAdd('PremiseAddressLine1', MntConst.eTypeTextFree);
                this.riMaintenance.ReturnDataAdd('PremiseAddressLine2', MntConst.eTypeTextFree);
                this.riMaintenance.ReturnDataAdd('PremiseAddressLine3', MntConst.eTypeTextFree);
                this.riMaintenance.ReturnDataAdd('PremiseAddressLine4', MntConst.eTypeTextFree);
                this.riMaintenance.ReturnDataAdd('PremiseAddressLine5', MntConst.eTypeTextFree);
                this.riMaintenance.ReturnDataAdd('PremiseContactName', MntConst.eTypeTextFree);
                this.riMaintenance.ReturnDataAdd('PremiseContactPosition', MntConst.eTypeTextFree);
            } else {
                this.riMaintenance.ReturnDataAdd('PremiseName', MntConst.eTypeText);
                this.riMaintenance.ReturnDataAdd('PremiseAddressLine1', MntConst.eTypeText);
                this.riMaintenance.ReturnDataAdd('PremiseAddressLine2', MntConst.eTypeText);
                this.riMaintenance.ReturnDataAdd('PremiseAddressLine3', MntConst.eTypeText);
                this.riMaintenance.ReturnDataAdd('PremiseAddressLine4', MntConst.eTypeText);
                this.riMaintenance.ReturnDataAdd('PremiseAddressLine5', MntConst.eTypeText);
                this.riMaintenance.ReturnDataAdd('PremiseContactName', MntConst.eTypeText);
                this.riMaintenance.ReturnDataAdd('PremiseContactPosition', MntConst.eTypeText);
            }
            this.riMaintenance.ReturnDataAdd('PremisePostcode', MntConst.eTypeCode);
            this.riMaintenance.ReturnDataAdd('PremiseVtxGeoCode', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('PremiseOutsideCityLimits', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('PremiseContactTelephone', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('PremiseContactMobile', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('PremiseContactFax', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('PremiseContactEmail', MntConst.eTypeTextFree);
            this.riMaintenance.Execute(this, function (data: any): any {
                if (!data.hasError) {
                    this.parent.setControlValue('CustomerTypeDesc', data['CustomerTypeDesc']);
                    this.parent.setControlValue('SICCode', data['SICCode']);
                    this.parent.setControlValue('SICDesc', data['SICDesc']);
                    this.parent.setControlValue('PremiseName', data['PremiseName']);
                    this.parent.setControlValue('PremiseAddressLine1', data['PremiseAddressLine1']);
                    this.parent.setControlValue('PremiseAddressLine2', data['PremiseAddressLine2']);
                    this.parent.setControlValue('PremiseAddressLine3', data['PremiseAddressLine3']);
                    this.parent.setControlValue('PremiseAddressLine4', data['PremiseAddressLine4']);
                    this.parent.setControlValue('PremiseAddressLine5', data['PremiseAddressLine5']);
                    this.parent.setControlValue('PremisePostcode', data['PremisePostcode']);
                    this.parent.setControlValue('PremiseVtxGeoCode', data['PremiseVtxGeoCode']);
                    this.parent.setControlValue('PremiseContactName', data['PremiseContactName']);
                    this.parent.setControlValue('PremiseContactPosition', data['PremiseContactPosition']);
                    this.parent.setControlValue('PremiseContactTelephone', data['PremiseContactTelephone']);
                    this.parent.setControlValue('PremiseContactMobile', data['PremiseContactMobile']);
                    this.parent.setControlValue('PremiseContactFax', data['PremiseContactFax']);
                    this.parent.setControlValue('PremiseContactEmail', data['PremiseContactEmail']);
                    this.parent.setControlValue('OutsideCityLimits', data['PremiseOutsideCityLimits'] === 'Y');
                } else {
                    this.parent.setControlValue('CustomerTypeCode', '');
                    this.parent.setControlValue('CustomerTypeDesc', '');
                    this.parent.setControlValue('SICCode', '');
                    this.parent.setControlValue('SICDesc', '');
                }
            }, 'POST');
        }
    }

    public GetGblSRAValues(): void {
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSExchangeFunctions.p';
        this.riMaintenance.PostDataAdd('PostDesc', 'SetGblSRAType', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('CustomerTypeCode', this.parent.getControlValue('CustomerTypeCode'), MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('GblSRATypeCode', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('GblSRADesc', MntConst.eTypeText);
        this.riMaintenance.Execute(this, function (data: any): any {
            if (data['GblSRATypeCode'] !== '') {
                this.parent.setControlValue('GblSRATypeCode', data['GblSRATypeCode']);
                this.parent.setControlValue('GblSRADesc', data['GblSRADesc']);
            } else {
                this.parent.setControlValue('GblSRATypeCode', '');
                this.parent.setControlValue('GblSRADesc', '');
            }
        }, 'GET', 0);
    }

    //**********************
    //* BEFORE UPDATE MODE *
    //**********************
    public riMaintenance_BeforeUpdateMode(): void {
        if (this.pageParams.vSCMultiContactInd) {
            this.parent.pgPM3.SensitiseContactDetails(false);
        }

        this.riExchange.riInputElement.Enable(this.uiForm, 'SelServiceNotifyTemplateEmail');
        this.riExchange.riInputElement.Enable(this.uiForm, 'SelServiceNotifyTemplateSMS');

        this.riMaintenance.DisableInput('ServiceBranchNumber');
        this.riMaintenance.DisableInput('PremiseCommenceDate');
        this.pageParams.dtPremiseCommenceDate.disabled = true;
        this.riTab.TabFocus(1);

        let el = document.querySelectorAll('#PremiseNumber');
        //this.parent.PremiseName.nativeElement.focus();
        // setTimeout(() => {
        //     this.renderer.invokeElementMethod(document.getElementById('ContractName'), 'focus', [focus]);
        // }, 0);

        if (this.riExchange.riInputElement.checked(this.uiForm, 'PNOL')) {
            this.riMaintenance.EnableInput('cmdResendPremises');
        }
        if (this.parent.getControlValue('NationalAccountBranch') === 'no') {
            if (parseInt(this.utils.getBranchCode(), 10) !== parseInt(this.parent.getControlValue('ServiceBranchNumber'), 10)) {
                this.riMaintenance.DisableInput('SalesAreaCode');
            }
        }
        this.pageParams.PNOLMode = 'Update';
        this.parent.pgPM1.SetOkToUpgradeToPNOL();

        //Make request to get the default business windows
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetBusinessDefaultWindows';
        this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.CBORequestExecute(this, function (data: any): any {
            if (!data.hasError) {
                this.parent.riMaintenance.renderResponseForCtrl(this, data);
            }
        });
        this.parent.pgPM2.HideQuickWindowSet(true);
        this.parent.pgPM2.WindowPreferredIndChanged();
        if (!this.pageParams.vSICCodeRequire) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'SICCode');
        }
        if (this.pageParams.vbShowPremiseWasteTab) {
            this.parent.pgPM2.WasteConsignmentNoteExemptInd_onClick();
        }

        //Next Waste Consignment Note Number should always be disabled
        this.riMaintenance.DisableInput('NextWasteConsignmentNoteNumber');
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSPremiseEntry.p';
        this.riMaintenance.PostDataAdd('Function', 'GetWindowsType', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('ContractNumber', this.parent.getControlValue('ContractNumber'), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('PremiseNumber', this.parent.getControlValue('PremiseNumber'), MntConst.eTypeCode);
        for (let i = 1; i <= 7; i++) {
            this.riMaintenance.ReturnDataAdd('WindowType' + i, MntConst.eTypeText);
        }
        this.riMaintenance.Execute(this, function (data: any): any {
            for (let i = 1; i <= 7; i++) {
                this.parent.setControlValue('selQuickWindowSet' + i, data['WindowType' + this.utils.numberPadding(i, 2)]);
            }

            for (let i = 1; i <= 7; i++) {
                if (this.parent.getControlValue('selQuickWindowSet' + i) === 'C') {
                    this.riMaintenance.EnableInput('WindowStart' + this.utils.numberPadding(i, 2));
                    this.riMaintenance.EnableInput('WindowEnd' + this.utils.numberPadding(i, 2));
                    this.riMaintenance.EnableInput('WindowStart' + this.utils.numberPadding(i + 7, 2));
                    this.riMaintenance.EnableInput('WindowEnd' + this.utils.numberPadding(i + 7, 2));
                } else {
                    this.riMaintenance.DisableInput('WindowStart' + this.utils.numberPadding(i, 2));
                    this.riMaintenance.DisableInput('WindowEnd' + this.utils.numberPadding(i, 2));
                    this.riMaintenance.DisableInput('WindowStart' + this.utils.numberPadding(i + 7, 2));
                    this.riMaintenance.DisableInput('WindowEnd' + this.utils.numberPadding(i + 7, 2));
                }
            }

            this.parent.isRequestingInitial = false;
        }, 'POST');
    }

    public SICCode_onchange(): void {
        let ctrl = this.uiForm.controls;
        if (ctrl.SICCode.value !== '') {
            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSPremiseEntry.p';
            this.riMaintenance.PostDataAdd('Function', 'GetSICDesc', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('SICCode', ctrl.SICCode.value, MntConst.eTypeCode);
            this.riMaintenance.ReturnDataAdd('SICDesc', MntConst.eTypeText);
            this.riMaintenance.Execute(this, function (data: any): any {
                if (data['SICDescription'] !== '') {
                    this.parent.setControlValue('SICDesc', data['SICDescription']);
                } else {
                    this.riExchange.riInputElement.markAsError(this.uiForm, 'SICCode');
                    // this.parent.setControlValue('SICCode', '');
                    this.parent.setControlValue('SICDesc', '');
                }
            }, 'POST');
        } else {
            this.parent.setControlValue('SICDesc', '');
        }
    }

    public SICCode_onkeydown(obj: any): void {
        if (obj.KeyCode === 34 && this.pageParams.vSICCodeRequire && this.pageParams.vSICCodeEnable) {
            //TODO - Page not ready - Page down out of scope
            this.parent.navigate('LookUp-Premise', 'System/iCABSSSICSearch.htm');
        }
    }

    public PurchaseOrderNo_onChange(): void {
        this.parent.setControlValue('PurchaseOrderLineNo', '');
        this.parent.setControlValue('PurchaseOrderExpiryDate', '');
        this.riExchange.riInputElement.Enable(this.uiForm, 'PurchaseOrderExpiryDate');
        this.parent.dateDisable('PurchaseOrderExpiryDate', false, true);
        this.setPurchaseOrderFields();
        // if (ctrl.PurchaseOrderNo.value !== '' && vbContinuousInd === 'YES') {
        //     this.viewChild.PurchaseOrderExpiryDate.focus();
        // } else {
        //     this.viewChild.ClientReference.focus();
        // }
    }

    public cmdMatchPremise_onClick(): void {
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            this.MatchPremise();
            this.GetMatchPremiseNames();
        }
    }

    public GetMatchPremiseNames(): void {
        let ctrl = this.uiForm.controls;
        this.riMaintenance.BusinessObject = 'iCABSPremiseEntry.p';
        this.riMaintenance.clear();
        this.riMaintenance.PostDataAdd('Function', 'MatchPremiseNames', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeInteger);
        this.riMaintenance.PostDataAdd('MatchedContractNumber', ctrl.MatchedContractNumber.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('MatchedPremiseNumber', ctrl.MatchedPremiseNumber.value, MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('MatchedContractName', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('MatchedPremiseName', MntConst.eTypeText);
        this.riMaintenance.Execute(this, function (data: any): any {
            if (!data.hasError) {
                this.parent.setControlValue('MatchedContractName', data['MatchedContractName']);
                this.parent.setControlValue('MatchedPremiseName', data['MatchedPremiseName']);
            }
        }, 'POST');
    }


    public cmdViewLinkedPremises_onclick(): void {
        //TODO - Page not ready
        //this.parent.showAlert(MessageConstant.Message.PageNotCovered, 2);
        this.parent.navigate('LinkedPremises', InternalGridSearchApplicationModuleRoutes.ICABSALINKEDPREMISESUMMARYGRID, {
            ContractNumber: this.parent.getControlValue('ContractNumber'),
            PremiseNumber: this.parent.getControlValue('PremiseNumber')
        });
    }

    public cmdViewAssociatedPremises_onclick(): void {
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd || this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            //TODO - Page not ready
            this.parent.showAlert(MessageConstant.Message.PageNotCovered, 2);
            //this.parent.navigate('LookUp', 'Application/iCABSAAssociatedPremiseSummaryGrid.htm');
        }
    }


    public riMaintenance_BeforeAdd(): void {
        this.parent.pgPM3.setPurchaseOrderFields();
        this.riExchange.riInputElement.Enable(this.uiForm, 'SelPrintRequired');
        this.parent.setControlValue('SelPrintRequired', 1);
        if (this.pageParams.SCEnablePestNetOnlineProcessing && this.pageParams.SCEnablePestNetOnlineDefaults && this.riExchange.routerParams['CurrentContractTypeURLParameter'] !== '<product>') {
            this.parent.setControlValue('PNOL', true);
            this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetPNOLDefault';
            this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.CBORequestExecute(this, function (data: any): any {
                this.logger.log('CBO Callback 3B', data);
            });
        }
        if (this.pageParams.vbEnableGlobalSiteRiskAssessment) {
            this.pageParams.vbGblSRAMode = '';
            this.PremGblSRADisable();
        }

    }

    public riMaintenance_AfterAbandonAdd(): void {
        this.parent.pgPM3.setPurchaseOrderFields();
        this.riExchange.riInputElement.Disable(this.uiForm, 'SelPrintRequired');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SelServiceNotifyTemplateEmail');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SelServiceNotifyTemplateSMS');
    }

    public riMaintenance_AfterAbandonUpdate(): void {
        this.parent.pgPM3.setPurchaseOrderFields();
        this.riExchange.riInputElement.Disable(this.uiForm, 'SelPrintRequired');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SelServiceNotifyTemplateEmail');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SelServiceNotifyTemplateSMS');

    }

    public CheckPostcode(): void {
        let ctrl = this.uiForm.controls;
        this.riMaintenance.BusinessObject = 'iCABSCheckContractPostcode.p';
        this.riMaintenance.clear();
        if (this.pageParams.vbEnableValidatePostcodeSuburb) {
            this.riMaintenance.PostDataAdd('EnableValidatePostcodeSuburb', this.pageParams.vbEnableValidatePostcodeSuburb, MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('SearchPostcode', ctrl.PremisePostcode.value, MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('SearchState', ctrl.PremiseAddressLine5.value, MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('SearchTown', ctrl.PremiseAddressLine4.value, MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('strFoundPostcode', MntConst.eTypeText);
        }
        else {
            this.riMaintenance.PostDataAdd('EnableValidatePostcodeSuburb', this.pageParams.vbEnableValidatePostcodeSuburb, MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('SearchPostcode', ctrl.PremisePostcode.value, MntConst.eTypeCode);
            this.riMaintenance.ReturnDataAdd('strFoundPostcode', MntConst.eTypeText);
        }
        this.riMaintenance.Execute(this, function (data: any): any {
            if (!data.hasError) {
                if (data['strFoundPostcode'] === 'Yes') {
                    this.parent.ellipsis.premiseNumberEllipsis.childparams.PremisePostcode = this.parent.getControlValue('PremisePostcode');
                    this.parent.ellipsis.premiseNumberEllipsis.childparams.PremiseAddressLine1 = this.parent.getControlValue('PremiseAddressLine1');
                    this.parent.ellipsis.premiseNumberEllipsis.childparams.PremiseAddressLine2 = this.parent.getControlValue('PremiseAddressLine2');
                    this.parent.ellipsis.premiseNumberEllipsis.childparams.PremiseAddressLine3 = this.parent.getControlValue('PremiseAddressLine3');
                    this.parent.ellipsis.premiseNumberEllipsis.childparams.PremiseAddressLine4 = this.parent.getControlValue('PremiseAddressLine4');
                    this.parent.ellipsis.premiseNumberEllipsis.childparams.PremiseAddressLine5 = this.parent.getControlValue('PremiseAddressLine5');
                    this.parent.ellipsis.premiseNumberEllipsis.childparams.showAddNew = false;

                    if (this.pageParams.vbEnableValidatePostcodeSuburb) {
                        this.parent.ellipsis.premiseNumberEllipsis.childparams.parentMode = 'PremisePostcodeSearch';
                    } else {
                        this.parent.ellipsis.premiseNumberEllipsis.childparams.parentMode = 'PremisePostcodeSearchNoSuburb';
                    }
                    this.parent.PremiseSearchMode = 'POSTCODE';
                    this.parent.ellipsis.premiseNumberEllipsis.disabled = false;
                    setTimeout(() => {
                        this.parent.ellipsis.premiseNumberEllipsis.childparams.showAddNew = false;
                        if (this.riMaintenance.isModalOpen) {
                            this.parent.callbackHooks.push(function (): void {
                                this.parent.isModalOpen(true);
                                this.parent.premiseNumberEllipsis.openModal();
                            });
                        } else {
                            this.parent.isModalOpen(true);
                            this.parent.premiseNumberEllipsis.openModal();
                        }
                    }, 200);
                }
            }
        }, 'GET', 0);
    }

    public SelServiceNotifyTemplateEmail_OnChange(): void {
        this.parent.setControlValue('ServiceNotifyTemplateEmail', this.parent.getControlValue('SelServiceNotifyTemplateEmail'));
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactEmail', false);
        if (this.parent.getControlValue('ServiceNotifyTemplateEmail') !== null) {
            if (this.parent.getControlValue('ServiceNotifyTemplateEmail') !== '') {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactEmail', true);
            }
        }
    }

    public SelServiceNotifyTemplateSMS_OnChange(): void {
        this.parent.setControlValue('ServiceNotifyTemplateSMS', this.parent.getControlValue('SelServiceNotifyTemplateSMS'));
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactMobile', false);
        if (this.parent.getControlValue('ServiceNotifyTemplateSMS') !== null) {
            if (this.parent.getControlValue('ServiceNotifyTemplateSMS') !== '') {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactMobile', true);
            }
        }
    }

    public PremiseCommenceDate_onBlur(): void {
        if (this.pageParams.SCEnablePestNetOnlineProcessing && this.pageParams.SCEnablePestNetOnlineDefaults
            && this.riExchange.routerParams['currentContractTypeURLParameter'] !== 'product'
            && this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            // this.pageParams.dtPNOLEffectiveDate.value = this.utils.convertDate(this.parent.getControlValue('PremiseCommenceDate'));
            this.pageParams.dtPNOLEffectiveDate.value = this.parent.globalize.parseDateStringToDate(this.parent.getControlValue('PremiseCommenceDate'));
            this.parent.setControlValue('PNOLEffectiveDate', this.parent.getControlValue('PremiseCommenceDate'));
        }
    }

    public GetCustomerTypeDefault(): void {
        let ctrl = this.uiForm.controls;
        this.riMaintenance.BusinessObject = 'iCABSPremiseEntry.p';
        this.riMaintenance.clear();
        this.riMaintenance.PostDataAdd('Function', 'GetCustomerTypeDefault', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('CustomerTypeCode', ctrl.CustomerTypeCode.value, MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('ServiceNotifyTemplateEmail', MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('ServiceNotifyTemplateSMS', MntConst.eTypeCode);
        this.riMaintenance.Execute(this, function (data: any): any {
            if (!data.hasError) {
                this.parent.setControlValue('SelServiceNotifyTemplateEmail', data['ServiceNotifyTemplateEmail']);
                this.parent.setControlValue('SelServiceNotifyTemplateSMS', data['ServiceNotifyTemplateSMS']);
                this.parent.pgPM3.SelServiceNotifyTemplateEmail_OnChange();
                this.parent.pgPM3.SelServiceNotifyTemplateSMS_OnChange();
            }
        }, 'POST');
    }
}
