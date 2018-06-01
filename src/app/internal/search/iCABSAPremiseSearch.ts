import { Component, OnInit, Input, ViewChild, OnDestroy, Injector, Inject, forwardRef, ElementRef } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { CBBService } from './../../../shared/services/cbb.service';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from '../../base/PageIdentifier';
import { Utils } from './../../../shared/services/utility';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { TableComponent } from '../../../shared/components/table/table';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { Subscription } from 'rxjs';

@Component({
    selector: 'icabs-premise-search',
    templateUrl: 'iCABSAPremiseSearch.html'
})
export class PremiseSearchComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('PremiseDetailTable') PremiseDetailTable: TableComponent;
    @Input() inputParams: any;
    //BaseComponents
    public controls = [
        { name: 'ContractNumber', readonly: true, disabled: true, required: false, value: '', type: MntConst.eTypeCode },
        { name: 'ContractName', readonly: true, disabled: true, required: false, value: '', type: MntConst.eTypeText },
        { name: 'CopyContractNumber', readonly: true, disabled: false, required: false, value: '', type: MntConst.eTypeCode },
        { name: 'CopyAccountNumber', readonly: true, disabled: false, required: false, value: '', type: MntConst.eTypeCode },
        { name: 'AccountNumber', readonly: true, disabled: false, required: false, value: '', type: MntConst.eTypeCode },
        { name: 'AccountName', readonly: true, disabled: false, required: false, value: '', type: MntConst.eTypeText },
        { name: 'SearchPostcode', readonly: true, disabled: false, required: false, value: '', type: MntConst.eTypeCode },
        { name: 'InvoiceGroupNumber', readonly: true, disabled: false, required: false, value: '', type: MntConst.eTypeCode }
    ];
    public pageId: string;
    public uiForm: any;

    public enableAddNew = true;
    public showAddNew = true;
    public columns: Array<any>;
    public search = new URLSearchParams();
    public queryParams: any = {
        operation: 'Application/iCABSAPremiseSearch',
        module: 'premises',
        method: 'contract-management/search'
    };
    public parentMode: string = 'normalMode';
    public tdMenuDisplay: boolean = true;
    public itemsPerPage: string = '10';
    public page: string = '1';
    public totalItem: string = '11';
    public tableheading: string = 'Premises Search';
    public isCopyMode: boolean = false;
    private selectedStatus: string = '';
    private EnablePremiseLinking: boolean = false;
    private vEnablePremiseLinking: boolean = false;
    private CurrentContractType: string = 'C'; /// retrofit - assigning default as C
    private CurrentContractTypeURLParameter: string;
    private CurrentContractTypeLabel: string;
    private tdStatusSearch: boolean = true;
    public pageTitle = 'Premises Details';
    public trContractLine: boolean = true;
    public grdServiceBranchSearch: boolean = false;
    public trAccountLine: boolean = false;
    public trPostcodeSearch: boolean = false;
    public trCopyAccountLine: boolean = false;
    public trCopyContractLine: boolean = false;
    public selectedServiceBranch: string = '';
    public inputParamsBranchSearch: any = {
        'parentMode': 'Contract-Search',
        'businessCode': this.utils.getBusinessCode(),
        'countryCode': this.utils.getCountryCode()
    };
    public isAddNewVisible: boolean = false;
    public isAddNewDisabled: boolean = false;
    public tdAddRecord: boolean = true; // add new button
    public contractNumberLabel: string = 'Contract Number';
    public branchCodeList: Array<any>;//CR Changes
    private headerParams: any = {
        method: 'contract-management/search',
        operation: 'Application/iCABSAPremiseSearch',
        module: 'premises'
    };
    public isRfereshDisabled: boolean = false;
    private premisePostCode: string = '';
    private premiseAddressLine4: string = '';
    private premiseAddressLine5: string = '';
    private premiseNumber: string = '';
    public searchBtn: boolean = true;
    private isRecordSelected: boolean = false; // to fix the issue of double click in copy mode IUI-15420
    private speedscriptSubscription: Subscription;

    constructor(injector: Injector,
        private ellipsis: EllipsisComponent,
        private elem: ElementRef,
        public cbbService: CBBService
    ) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAPREMISESEARCH;
    }

    public ngOnInit(): void {
        super.ngOnInit();
        if (this.parentMode === 'normalMode') {
            this.isCopyMode = false;
        }
        this.getSysCharDtetails();
        this.windowOnload();
        this.branchCodeList = this.cbbService.getBranchListByCountryAndBusiness(this.countryCode(), this.businessCode());

    }
    public ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.speedscriptSubscription) {
            this.speedscriptSubscription.unsubscribe();
        }
    }

    public SetCurrentContractType(): void {
        if (this.riExchange.URLParameterContains('job')) {
            this.CurrentContractType = 'J';
            this.CurrentContractTypeURLParameter = '<job>';
        } else if (this.riExchange.URLParameterContains('product')) {
            this.CurrentContractType = 'P';
            this.CurrentContractTypeURLParameter = '<product>';
        } else {
            // Else
            //   this.CurrentContractType = 'C'; // commenting here and making default to C when initializing
            this.CurrentContractTypeURLParameter = '';
        }
        // End If

        let ContractTypesList: any;
        let Count: number;
        let contractTypes: string = this.riExchange.ClientSideValues.Fetch('ContractTypes');
        //to do
        ContractTypesList = [];//contractTypes.split(','); //Split(riExchange.Functions.ClientSideValues.Fetch("ContractTypes"), ",")

        Count = 0;

        // Do While Count <= Ubound(ContractTypesList)
        for (let i = 0; i < ContractTypesList.length; i++) {

            if (ContractTypesList[Count] === this.CurrentContractType) {
                this.CurrentContractTypeLabel = ContractTypesList[Count + 1];
                Count = ContractTypesList.length;
            }
            //End If
            Count = Count + 2;

        }
        //Loop

    }

    //// Begin of windowOnload
    private windowOnload(): void {


        // this.EnablePremiseLinking = (this.vEnablePremiseLinking === true) ? true : false;



        this.SetCurrentContractType(); // to implement
        // Call BuildStatusOptions()
        if (this.CurrentContractType === 'C') {
            this.tdStatusSearch = true;
            this.contractNumberLabel = 'Contract Number';
        } else if (this.CurrentContractType === 'J') {
            this.tdStatusSearch = true;
            this.contractNumberLabel = 'Job Number';
        } else {
            this.tdStatusSearch = false;
            this.contractNumberLabel = 'Number';
        }

        //Renegotiated Premise Search
        if (this.parentMode === 'PremisePostcodeSearch' || this.parentMode === 'PremisePostcodeSearchNoSuburb') {
            this.pageTitle = 'Select Old Premises If Renegotiation';
            /*     riTable.HTMLTableTitle = "<%=riT("Select Old Premises If Renegotiation")%>"
                 labelPremiseDetail.innerText = "<%=riT("Select Old Premises If Renegotiation")%>"
                 labelPremiseDetail.style.fontSize = 20
                 labelPremiseDetail.style.fontWeight = "bold" */
        } else if (this.parentMode === 'ShowPremisesOnInvoiceGroup') {
            this.pageTitle = 'Premises Details';
        } else if (this.parentMode === 'PremiseCopy') {
            this.pageTitle = 'Premises Details';
            this.tableheading = 'Premises Search';
        }
        else {
            this.pageTitle = 'Premises Search';
            /*   document.title = setWindowTitle("<%=riT("Premises Search")%>")
               riTable.HTMLTableTitle = "<%=riT("Premises Search")%>"
               labelPremiseDetail.innerText = "<%=riT("Premises Details")%>"
               labelContractNumber.innerText = "<%=riT("Number")%>" */
        }
        switch (this.parentMode) {

            case 'Contract':
                this.trContractLine = true;
                this.grdServiceBranchSearch = true;
                /*trContractLine.style.display = ""
                grdServiceBranchSearch.style.display = ""
                tdAddRecord.style.display = "" */

                // Call riExchange.GetParentHTMLInputValue("ContractNumber")
                //  Call riExchange.GetParentHTMLInputValue("ContractName")
                //  this.riExchange.GetParentHTMLInputValue('ContractNumber');
                //  this.riExchange.GetParentHTMLInputValue('ContractName');
                break;

            case 'InvoiceGroup':
            case 'InvoiceGroupGetAddress':
            case 'AddInvoiceGroup':
                this.trAccountLine = true;
                this.grdServiceBranchSearch = true;
                this.trContractLine = false; // retrofit
                this.pageTitle = 'Premises Details'; // retrofit
                // this.grdServiceBranchSearch = false; // retrofit
                /*  trAccountLine.style.display = ""
                  grdServiceBranchSearch.style.display = ""
                  tdAddRecord.style.display = "" */

                //  Call riExchange.GetParentHTMLInputValue("AccountNumber")
                //  Call riExchange.GetParentHTMLInputValue("AccountName")
                //  Call riExchange.GetParentHTMLInputValue("InvoiceGroupNumber")
                break;

            case 'ShowPremisesOnInvoiceGroup':
                this.trAccountLine = true;
                this.grdServiceBranchSearch = true;
                this.trContractLine = false;
                this.tdStatusSearch = false;
                /*  trAccountLine.style.display = ""
                  grdServiceBranchSearch.style.display = ""
                  Call riExchange.GetParentHTMLInputValue("AccountNumber")
                  Call riExchange.GetParentHTMLInputValue("AccountName")
                  Call riExchange.GetParentHTMLInputValue("InvoiceGroupNumber") */
                break;

            case 'PremisePostcodeSearch':
            case 'PremisePostcodeSearchNoSuburb':
                this.trPostcodeSearch = true;
                this.trContractLine = false;
                this.tdStatusSearch = false;
                this.grdServiceBranchSearch = false;
                this.searchBtn = false;
                this.trCopyAccountLine = false;
                this.trCopyContractLine = false;
                /*  trPostcodeSearch.style.display = ""
                  SearchPostcode.value = riExchange.GetParentHTMLInputValue("PremisePostcode") */
                break;
            case 'LookUpRenegOldPremise':
                this.trContractLine = true;
                this.grdServiceBranchSearch = true;
                /* trContractLine.style.display = ""
                 grdServiceBranchSearch.style.display = ""
                 Call riExchange.GetParentHTMLInputValue("RenegOldContract", "ContractNumber") */
                break;

            case 'InvGrpPremiseMaintenance':
                this.trContractLine = true;
                this.grdServiceBranchSearch = true;

                if (this.riExchange.URLParameterContains('2')) {
                    // Call riExchange.GetParentHTMLInputValue("ContractNumber2", "ContractNumber")
                    if (this.riExchange.GetParentHTMLInputElementAttribute('ContractNumber2', 'ContractName') !== null) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.GetParentHTMLInputElementAttribute('ContractNumber2', 'ContractName'));
                    } else if (this.riExchange.URLParameterContains('3') || this.riExchange.URLParameterContains('R')) {
                        // Call riExchange.GetParentHTMLInputValue("ContractNumber3", "ContractNumber")
                        if (this.riExchange.GetParentHTMLInputElementAttribute('ContractNumber3', 'ContractName') !== null) {
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.GetParentHTMLInputElementAttribute('ContractNumber3', 'ContractName'));
                        }

                    }
                }
                break;
            case 'PremiseNumber01':
            case 'PremiseNumber02':
            case 'PremiseNumber03':
            case 'PremiseNumber04':
            case 'PremiseNumber05':
            case 'PremiseNumber06':
            case 'PremiseNumber07':
            case 'PremiseNumber08':
            case 'PremiseNumber09':
            case 'PremiseNumber10':
            case 'PremiseNumber11':
            case 'PremiseNumber12':
            case 'PremiseNumber13':
            case 'PremiseNumber14':

                this.trContractLine = true;
                this.grdServiceBranchSearch = true;

                //   Call riExchange.GetParentHTMLInputValue("ContractNumber" + Right(riExchange.ParentMode, 2), "ContractNumber")
                //   'Call riExchange.GetParentHTMLInputValue("ContractName")
                break;
            case 'PremiseCopy':

                this.trCopyAccountLine = true;
                this.tdStatusSearch = true;
                this.trCopyContractLine = true;
                this.grdServiceBranchSearch = true;
                this.trContractLine = false;
                //Call riExchange.GetParentHTMLInputValue("AccountNumber", "CopyAccountNumber")
                if (this.elem.nativeElement.querySelector('#CopyAccountNumber') !== null) {
                    this.elem.nativeElement.querySelector('#CopyAccountNumber').focus();
                }
                // Call CopyAccountNumber.focus()
                break;

            case 'ServiceCoverCopy':

                this.trCopyContractLine = true;
                this.grdServiceBranchSearch = true;

                // Call riExchange.GetParentHTMLInputValue("CopyContractNumber")
                break;
            case 'Search-LinkedToPremise':
                this.trContractLine = true;
                this.grdServiceBranchSearch = true;
                //  Call riExchange.GetParentHTMLInputValue("LinkedToContractNumber", "ContractNumber")
                //   Call riExchange.GetParentHTMLInputValue("LinkedToContractName", "ContractName")
                this.riExchange.GetParentHTMLInputValue('LinkedToContractNumber', 'ContractNumber');
                this.riExchange.GetParentHTMLInputValue('LinkedToContractName', 'ContractName');
                break;

            case 'Search-ScannedPremise':
                this.trContractLine = true;
                this.grdServiceBranchSearch = true;
                // Call riExchange.GetParentHTMLInputValue("ScannedContractNumber", "ContractNumber")
                // Call riExchange.GetParentHTMLInputValue("ScannedContractName", "ContractName")
                this.riExchange.GetParentHTMLInputValue('ScannedContractNumber', 'ContractNumber');
                this.riExchange.GetParentHTMLInputValue('ScannedContractName', 'ContractName');
                break;
            case 'LookUp': // retrofit
                //  if (this.CurrentContractType === 'J') {
                this.pageTitle = 'Premises Details';
                // }
                break;
            default:
                this.grdServiceBranchSearch = true;
            /*  this.trContractLine = true;
               this.grdServiceBranchSearch = true;*/ //check and clarify

            // Call riExchange.GetParentHTMLInputValue("ContractNumber")
            //  Call riExchange.GetParentHTMLInputValue("ContractName")

        }


        /*   Set riTable.IEWindow = Window
           Set riTable.HTMLDocument = Document
           Set riTable.HTMLTableHeader = theadPremise
           Set riTable.HTMLTableBody = tbodyPremise
           Set riTable.HTMLTableFooter = tfootPremise
           riTable.FunctionSnapShot = False
           riTable.BusinessObject = "riControlTable.p"
           riTable.PageSize = 10
           */

        if (this.parentMode === 'PremiseCopy') {
            if (this.elem.nativeElement.querySelector('#CopyAccountNumber') !== null) {
                this.elem.nativeElement.querySelector('#CopyAccountNumber').focus();
            }
        } else {
            //Call cmdSearch_onclick
        }

        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceGroupNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SearchPostcode');

    }
    ////// end of windowOnload
    /*
        public PremiseSearchValue_onkeydown {
            If window.event.keyCode = 34 Then
            riExchange.Mode = "LookUp-PremiseSearch": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBBranchSearch.htm"
            End If
        }
        Sub CopyContractNumber_onkeydown
        If window.event.keyCode = 34 Then
        riExchange.Mode = "LookUp-CopyContractNumber": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAContractSearch.htm<maxwidth>" + CurrentContractTypeURLParameter
        End If
        End sub
        Sub CopyAccountNumber_onkeydown
        If window.event.keyCode = 34 Then
        riExchange.Mode = "LookUp-CopyAccountNumber": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAAccountSearch.htm<maxwidth>"
        End If
        End Sub
    */
    public CopyContractNumber_ondeactivate(): void {
        // Call riTable.Clear
    }

    public CopyAccountNumber_ondeactivate(): void {
        //Call riTable.Clear
    }
    public tableDataLoaded(data: any): void {
        let tableRecords: Array<any> = data.tableData['records'];
        if (tableRecords.length === 0) {
            this.tableheading = 'No record found';
        }
    }

    public onAddNew(data: any): void {
        switch (this.parentMode) {
            case 'InvoiceGroup':
                this.navigate('Contract', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE);
                return;
        }
        let returnObj = {
            'PremiseNumber': '',
            'PremiseName': '',
            'AddMode': true
        };
        this.ellipsis.sendDataToParent(returnObj);
        this.ellipsis.closeModal();
    }

    public buildTableColumns(): void {
        let contractNumber: string = 'Contract';
        let contractName: string = 'ContractName';
        this.columns = [];
        //  if (this.parentMode !== 'Search') {
        if (this.parentMode === 'InvoiceGroup' || this.parentMode === 'ShowPremisesOnInvoiceGroup') {
            this.getTranslatedValue('Prefix', null).subscribe((res: string) => {
                if (res) {
                    this.columns.push({ title: res, name: 'ContractTypePrefix', type: MntConst.eTypeText });
                } else {
                    this.columns.push({ title: 'Prefix', name: 'ContractTypePrefix', type: MntConst.eTypeText });
                }
            });
        }
        if (this.parentMode === 'InvoiceGroup' || this.parentMode === 'ShowPremisesOnInvoiceGroup'
            || this.parentMode === 'InvoiceGroupGetAddress' || this.parentMode === 'AddInvoiceGroup' ||
            this.parentMode === 'PremisePostcodeSearch' || this.parentMode === 'PremisePostcodeSearchNoSuburb' ||
            this.parentMode === 'ServiceCoverCopy') {
            if (this.parentMode === 'PremisePostcodeSearch' || this.parentMode === 'PremisePostcodeSearchNoSuburb') {
                contractNumber = 'Number';
            }
            this.getTranslatedValue(contractNumber, null).subscribe((res: string) => {
                if (res) {
                    this.columns.push({ title: res, name: 'ContractNumber', type: MntConst.eTypeCode });
                } else {
                    this.columns.push({ title: contractNumber, name: 'ContractNumber', type: MntConst.eTypeCode });
                }
            });
        }

        if (this.parentMode === 'PremisePostcodeSearch' || this.parentMode === 'PremisePostcodeSearchNoSuburb') {
            contractName = 'Name';

            this.getTranslatedValue(contractName, null).subscribe((res: string) => {
                if (res) {
                    this.columns.push({ title: res, name: 'ContractName', type: MntConst.eTypeText });
                } else {
                    this.columns.push({ title: contractName, name: 'ContractName', type: MntConst.eTypeText });
                }
            });
        }

        if (this.EnablePremiseLinking) {
            this.getTranslatedValue('Linked Contract', null).subscribe((res: string) => {
                if (res) {
                    this.columns.push({ title: res, name: 'LinkedToContractNumber', type: MntConst.eTypeCode });
                } else {
                    this.columns.push({
                        title: 'Linked Contract', name: 'LinkedToContractNumber', type: MntConst.eTypeCode
                    });
                }
            });
            this.getTranslatedValue('Linked Premises', null).subscribe((res: string) => {
                if (res) {
                    this.columns.push({ title: res, name: 'LinkedToPremiseNumber', type: MntConst.eTypeInteger });
                } else {
                    this.columns.push({
                        title: 'Linked Premises', name: 'LinkedToPremiseNumber', type: MntConst.eTypeInteger
                    });
                }
            });

        }
        if (this.parentMode === 'InvGrpPremiseMaintenance' || this.parentMode === 'InvoiceGroup' ||
            this.parentMode === 'InvoiceGroupGetAddress' || this.parentMode === 'Search' || this.parentMode === 'LookUp' || this.parentMode === 'PremiseCopy'
            || this.parentMode === 'ShowPremisesOnInvoiceGroup' || this.parentMode === 'LookUp-ProRataChargeSummary' || this.parentMode === 'PremisePostcodeSearch' || this.parentMode === 'PremisePostcodeSearchNoSuburb'
            || this.parentMode === 'LookUp-ProRataSearch') {
            this.getTranslatedValue('Premises', null).subscribe((res: string) => {
                if (res) {
                    this.columns.push({ title: res, name: 'PremiseNumber', type: MntConst.eTypeInteger });
                } else {
                    this.columns.push({ title: 'Premises', name: 'PremiseNumber', type: MntConst.eTypeInteger });
                }
            });
            this.getTranslatedValue('Premises Name', null).subscribe((res: string) => {
                if (res) {
                    this.columns.push({ title: res, name: 'PremiseName', type: MntConst.eTypeText });
                } else {
                    this.columns.push({ title: 'Premises Name', name: 'PremiseName', type: MntConst.eTypeText });
                }
            });
        }
        if (this.parentMode !== 'PremisePostcodeSearch' && this.parentMode !== 'PremisePostcodeSearchNoSuburb') {
            this.getTranslatedValue('Address Line 1', null).subscribe((res: string) => {
                if (res) {
                    this.columns.push({ title: res, name: 'PremiseAddressLine1', type: MntConst.eTypeTextFree });
                } else {
                    this.columns.push({ title: 'Address Line 1', name: 'PremiseAddressLine1', type: MntConst.eTypeTextFree });
                }
            });
            this.getTranslatedValue('Town', null).subscribe((res: string) => {
                if (res) {
                    this.columns.push({ title: res, name: 'PremiseAddressLine4', type: MntConst.eTypeTextFree });
                } else {
                    this.columns.push({ title: 'Town', name: 'PremiseAddressLine4', type: MntConst.eTypeTextFree });
                }
            });
        }

        this.getTranslatedValue('Branch', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'ServiceBranchNumber', type: MntConst.eTypeCode });
            } else {
                this.columns.push({ title: 'Branch', name: 'ServiceBranchNumber', type: MntConst.eTypeCode });
            }
        });
        this.getTranslatedValue('Status', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'PortfolioStatusDesc', type: MntConst.eTypeTextFree });
            } else {
                this.columns.push({ title: 'Status', name: 'PortfolioStatusDesc', type: MntConst.eTypeTextFree });
            }
        });
        if (this.parentMode !== 'PremisePostcodeSearch' && this.parentMode !== 'PremisePostcodeSearchNoSuburb') {
            this.getTranslatedValue('Account', null).subscribe((res: string) => {
                if (res) {
                    this.columns.push({ title: res, name: 'AccountNumber', type: MntConst.eTypeCode });
                } else {
                    this.columns.push({ title: 'Account', name: 'AccountNumber', type: MntConst.eTypeCode });
                }
            });

            this.getTranslatedValue('Invoice Group', null).subscribe((res: string) => {
                if (res) {
                    this.columns.push({ title: res, name: 'InvoiceGroupNumber', type: MntConst.eTypeCode });
                } else {
                    this.columns.push({ title: 'Invoice Group', name: 'InvoiceGroupNumber', type: MntConst.eTypeCode });
                }
            });
        }
        this.buildTable();
    }

    private buildTable(): void {
        this.search.set('action', '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('ServiceBranchNumber', this.selectedServiceBranch);
        this.search.set('ContractNumber', '');
        this.search.set('AccountNumber', '');
        this.search.set('PremisePostcodeSearch', 'false');
        if (this.parentMode !== 'PremisePostcodeSearch' && this.parentMode !== 'PremisePostcodeSearchNoSuburb') { // sjkip if perntMode is PremisePostcodeSearch
            if (this.selectedStatus !== 'All' && this.selectedStatus !== 'AllCurrent') {
                this.search.set('PortfolioStatusCode', this.selectedStatus);
            } else {
                this.search.set('PortfolioStatusCode', '');
            }
            if (this.parentMode === 'PremiseCopy') {
                this.search.set('AccountNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'CopyAccountNumber'));
                this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'CopyContractNumber'));
            } else {
                this.search.set('AccountNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber'));
                if (this.parentMode === 'ServiceCoverCopy') {
                    this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'CopyContractNumber'));
                } else {
                    this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
                }
            }
        } else {
            this.search.set('PremisePostcodeSearch', 'true');
        }
        this.search.set('ContractTypeCode', 'C');
        this.search.set('InvoiceGroupNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceGroupNumber'));
        this.search.set('PremisePostcode', this.premisePostCode);
        this.search.set('PremiseAddressLine4', this.premiseAddressLine4);
        this.search.set('PremiseAddressLine5', this.premiseAddressLine5);
        this.search.set('PremiseNumber', this.premiseNumber);
        this.queryParams.search = this.search;
        this.PremiseDetailTable.loadTableData(this.queryParams);
    }

    public tableRowClick(event: any): void {
        if (this.isRecordSelected) {
            return;
        } else {
            this.isRecordSelected = true;

            setTimeout(() => {
                this.isRecordSelected = false;
            }, 1000);
        }
        if (this.parentMode === 'PremiseCopy') {
            this.copyPremisesSearch(event);
            return;
        }
        if (this.parentMode === 'InvoiceGroup') {
            this.riTable_BodyRecordSelected(event.row);
            return;
        }
        if (this.parentMode === 'ShowPremisesOnInvoiceGroup') {
            this.router.navigate([this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
                queryParams: {
                    'PremiseNumber': event.row.PremiseNumber,
                    'PremiseName': event.row.PremiseName,
                    'ContractNumber': event.row.ContractNumber,
                    'ParentMode': this.parentMode
                }
            });
        }
        let returnObj = {
            'PremiseNumber': event.row.PremiseNumber,
            'PremiseName': event.row.PremiseName,
            'ContractNumber': event.row.ContractNumber,
            'ParentMode': this.parentMode
        };
        this.ellipsis.sendDataToParent(returnObj);

    }

    private copyPremisesSearch(data: any): void {
        let postSearchParams: URLSearchParams = new URLSearchParams();
        let _formData: Object = {};

        _formData['ContractNumber'] = data.row.ContractNumber;
        _formData['PremiseNumber'] = data.row.PremiseNumber;
        _formData['NewContractNumber'] = this.getControlValue('ContractNumber');
        _formData['FunctionName'] = 'PremiseCopy';
        postSearchParams.set(this.serviceConstants.Action, '6');
        postSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        postSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());


        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpSubscription = this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, postSearchParams, _formData)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                        //error
                    } else {
                        e.ParentMode = this.parentMode;
                        this.ellipsis.sendDataToParent(e);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public refresh(): void {
        this.PremiseDetailTable.clearTable();
        if ((this.trContractLine && this.getControlValue('ContractNumber')) ||
            (!this.trContractLine && (this.getControlValue('AccountNumber') || this.getControlValue('CopyContractNumber')))) {
            this.buildTableColumns();
        }
    }

    public StatusFilterSelectedValue(data: any): void {
        this.selectedStatus = data;
    }
    public updateView(params: any): void {
        this.isRfereshDisabled = false;
        this.inputParams = params;
        this.setControlValue('ContractNumber', params.ContractNumber);
        if (params.ContractNumber !== '') { /// condition implemented to solve defect #9536 - if no contractnumber is there then should not display contractName
            this.setControlValue('ContractName', params.ContractName);
        } else {
            this.setControlValue('ContractName', '');
            this.isRfereshDisabled = true;
        }
        this.setControlValue('AccountNumber', params.AccountNumber);
        if (params.AccountNumber !== '') {
            this.setControlValue('AccountName', params.AccountName);
        } else {
            this.setControlValue('AccountName', '');
        }
        if (params.InvoiceGroupNumber) {
            this.setControlValue('InvoiceGroupNumber', params.InvoiceGroupNumber);
        }
        if (params.PremisePostcode) {
            this.premisePostCode = params.PremisePostcode;
        }

        if (params.PremiseAddressLine4) {
            this.premiseAddressLine4 = params.PremiseAddressLine4;
        }
        if (params.PremiseAddressLine5) {
            this.premiseAddressLine5 = params.PremiseAddressLine5;
        }
        if (params.PremiseNumber) {
            this.premiseNumber = params.PremiseNumber;
        }
        console.log('PARAMS: ' + JSON.stringify(params)); // leaving this console to debug as many different parent screens will be there
        this.parentMode = params.parentMode;
        if (params.CurrentContractType) { // retrofit -  as when opened from ellispsis there is no value appended for url in new application
            this.CurrentContractType = params.CurrentContractType;
        }
        this.tdAddRecord = params.showAddNew ? true : false;
        // this.inputParamsBranchSearch.parentMode = params.parentMode;
        //   this.inputParamsBranchSearch.ContractTypeCode = params.ContractTypeCode;
        if (this.parentMode === 'PremiseCopy') {
            this.setControlValue('CopyAccountNumber', params.AccountNumber);
            this.setControlValue('CopyContractNumber', params.ContractNumber);
        }
        if (this.parentMode === 'ServiceCoverCopy') {
            this.setControlValue('CopyContractNumber', params.CopyContractNumber);
            this.trContractLine = false;
        }
        if (params.PremisePostcode) {
            this.setControlValue('SearchPostcode', params.PremisePostcode);
        }
        if (this.parentMode === 'PremisePostcodeSearchNoSuburb') {
            this.premiseAddressLine4 = ''; //params.PremiseAddressLine4;
            this.premiseAddressLine5 = ''; //params.PremiseAddressLine5;
        }
        this.inputParamsBranchSearch.businessCode = params.businessCode || this.utils.getBusinessCode();
        this.inputParamsBranchSearch.countryCode = params.countryCode || this.utils.getCountryCode();
        this.getSysCharDtetails();
        this.windowOnload();
        this.refresh();
    }

    private getSysCharDtetails(): void {
        //SysChar
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnablePremiseLinking

        ];
        let sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedscriptSubscription = this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            //   this.vEnablePremiseLinking = record[0]['Required'];
            this.EnablePremiseLinking = record[0]['Required'];
            //this.buildTableColumns();
            this.refresh();
        });
    }

    public ServiceBranchFilterSelectedValue(data: any): void {
        this.selectedServiceBranch = data.BranchNumber;
    }

    public onAddNewButtonClicked(): void {
        switch (this.parentMode) {
            case 'InvoiceGroup':
                this.navigate('Contract', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE);
                return;
        }
        let objForParent: any = {};
        objForParent.addMode = true;
        this.messageService.emitMessage(objForParent);
        this.ellipsis.closeModal();
    }

    public riTable_BodyRecordSelected(dataObj?: any): void {
        let vntReturnData = '';
        let SelectedContractTypeCode = '';

        switch (this.parentMode) {

            case 'Contract':
                //  WindowPath="/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAPremiseMaintenance.htm" + CurrentContractTypeURLParameter
                // riExchange.Mode = "CSearch": window.location = WindowPath
                break;
            case 'InvoiceGroup':
                switch (this.inputParamsBranchSearch.ContractTypeCode) { //SelectedContractTypeCode
                    case 'J':
                        // riExchange.Mode = "IGSearch": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAPremiseMaintenance.htm<job>"
                        let parameterData = {
                            'currentContractType': 'J',
                            'AccountNumber': dataObj.AccountNumber,
                            'ContractNumber': dataObj.ContractNumber,
                            'PremiseNumber': dataObj.PremiseNumber
                        };
                        this.navigate('IGSearch', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, parameterData);
                        break;
                    case 'C':
                        // riExchange.Mode = "IGSearch": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAPremiseMaintenance.htm"
                        break;
                    case 'P':
                    // riExchange.Mode = "IGSearch": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAPremiseMaintenance.htm<product>"
                }
                break;
            case 'PremisePostcodeSearch':
            case 'PremisePostcodeSearchNoSuburb':

                //  Call riExchange.SetParentHTMLInputElementAttribute("ContractNumber", "RenegContract", True)
                //  Call riExchange.SetParentHTMLInputElementAttribute("PremisePostcode", "ContractNumber", vntReturnData(2))
                //  Call riExchange.SetParentHTMLInputElementAttribute("PremisePostcode", "PremiseNumber", vntReturnData(0))
                //  riTable.RequestWindowClose = True
                break;
            case 'InvGrpPremiseMaintenance':
                break;

            case 'ShowPremisesOnInvoiceGroup':
                switch (this.inputParamsBranchSearch.ContractTypeCode) { //SelectedContractTypeCode

                    case 'J':
                        // riExchange.Mode = "IGSearch": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAPremiseMaintenance.htm<job>"
                        break;
                    case 'C':
                        // riExchange.Mode = "IGSearch": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAPremiseMaintenance.htm"
                        break;
                    case 'P':
                        // riExchange.Mode = "IGSearch": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAPremiseMaintenance.htm<product>"
                        break;
                }
                //   'riTable.RequestWindowClose = True
                break;
            case 'PremiseNumber01':
            case 'PremiseNumber02':
            case 'PremiseNumber03':
            case 'PremiseNumber04':
            case 'PremiseNumber05':
            case 'PremiseNumber06':
            case 'PremiseNumber07':
            case 'PremiseNumber08':
            case 'PremiseNumber09':
            case 'PremiseNumber10':
            case 'PremiseNumber11':
            case 'PremiseNumber12':
            case 'PremiseNumber13':
            case 'PremiseNumber14':

                // Call riExchange.SetParentHTMLInputValue(riExchange.ParentMode: case  "": case  vntReturnData(0))

                // riTable.RequestWindowClose = True
                break;
            case 'InvoiceGroupGetAddress':
            case 'AddInvoiceGroup':
                // Call riExchange.SetParentHTMLInputValue('PremiseNumber", "", vntReturnData(0))
                // Call riExchange.SetParentHTMLInputValue("ContractNumber", "", vntReturnData(2))

                //riTable.RequestWindowClose = True
                break;
            default: // Case Else
            case 'PremiseCopy':

                switch (this.parentMode) {

                    case 'LookUp':
                        //  Call riExchange.SetParentHTMLInputValue("PremiseNumber", "", vntReturnData(0))
                        // Call riExchange.SetParentHTMLInputValue("PremiseName", "", vntReturnData(1))
                        break;
                    case 'LookUp-Search':
                        //   Call riExchange.SetParentHTMLInputValue("SearchId", "", vntReturnData(0))
                        //   Call riExchange.SetParentHTMLInputValue("SearchDesc", "", vntReturnData(1))
                        break;
                    case 'LookUp-ProRataSearch':
                        // Call riExchange.SetParentHTMLInputValue("FilterPremise", "", vntReturnData(0))
                        // Call riExchange.SetParentHTMLInputValue("FilterPremiseName", "", vntReturnData(1))
                        break;
                    case 'LookUp-ContractHistory':
                        // Call riExchange.SetParentHTMLInputValue("ContractHistoryFilterValue", "", vntReturnData(0))
                        // Call riExchange.SetParentHTMLInputValue("ContractHistoryFilterDesc", "", vntReturnData(1))
                        break;
                    case 'LookUp-ProRataChargeSummary':
                        // Call riExchange.SetParentHTMLInpuValue("FilterPremise", "", vntReturnData(0))
                        // Call riExchange.SetParentHTMLInputValue("FilterPremiseName", "", vntReturnData(1))
                        break;
                    case 'InvoiceGroupGetAddress':
                    case 'AddInvoiceGroup':
                        // Call riExchange.SetParentHTMLInputValue("PremiseNumber", , vntReturnData(0))
                        break;
                    case 'LookUpRenegOldPremise':
                        // Call riExchange.SetParentHTMLInputValue("RenegOldPremise", , vntReturnData(0))
                        break;
                    case 'LookUp-CopyPremiseNumber':
                    case 'ServiceCoverCopy':
                        // Call riExchange.SetParentHTMLInputValue("CopyPremiseNumber", , vntReturnData(0))
                        break;
                    case 'CallCentreSearch':
                        // Call riExchange.SetParentHTMLInputValue("PremiseNumber", "", vntReturnData(0))
                        // Call riExchange.SetParentHTMLInputValue("PremiseName", "", vntReturnData(1))
                        // Call riExchange.SetParentHTMLInputValue("ProductCode", "", "")
                        // Call riExchange.SetParentHTMLInputValue("ProductDesc", "", "")
                        // Call riExchange.SetParentHTMLInputValue("ServiceCoverNumber", "", "")
                        // Call riExchange.SetParentHTMLInputValue("ServiceCoverRowID", "", "")
                        break;
                    case 'Search-LinkedToPremise':
                        // Call riExchange.SetParentHTMLInputValue("LinkedToPremiseNumber", "", vntReturnData(0))
                        break;
                    case 'Search-ScannedPremise':
                        // Call riExchange.SetParentHTMLInputValue("ScannedPremiseNumber", "", vntReturnData(0))
                        // Call riExchange.SetParentHTMLInputValue("ScannedPremiseName", "", vntReturnData(1))
                        break;
                    default: //case Else
                    // Call riExchange.SetParentHTMLInputValue("PremiseNumber", "", vntReturnData(0))
                    //    Call riExchange.FetchRecord()
                }
            //   riTable.RequestWindowClose = True

        }

    }

    public onBlur(event: any): void {
        let elementValue = event.target.value;
        if (event.target.id === 'ContractNumber') {
            if (elementValue.length > 0 && elementValue.length <= 8) {
                let paddedValue = this.utils.numberPadding(elementValue, 8);
                event.target.value = paddedValue;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', paddedValue);
            }
        }
        else if (event.target.id === 'CopyContractNumber') {
            if (elementValue.length > 0 && elementValue.length <= 8) {
                let paddedValue = this.utils.numberPadding(elementValue, 8);
                event.target.value = paddedValue;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'CopyContractNumber', paddedValue);
                //this.ellipsisConfig.premise.childConfigParams['CopyContractNumber'] = paddedValue;
            }
        }
    }

}
