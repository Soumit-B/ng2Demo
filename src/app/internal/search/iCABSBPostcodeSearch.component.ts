
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { Component, OnInit, OnChanges, OnDestroy, Input, Output, ViewChild, ElementRef, AfterContentInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { TableComponent } from './../../../shared/components/table/table';
import { TranslateService } from 'ng2-translate';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'ng2-webstorage';
import { Subscription } from 'rxjs/Subscription';
import { Utils } from './../../../shared/services/utility';
import { Logger } from '@nsalaun/ng2-logger';
import { MntConst } from './../../../shared/services/riMaintenancehelper';



@Component({
    templateUrl: 'iCABSBPostcodeSearch.html'
})

export class PostCodeSearchComponent implements OnInit, AfterContentInit, OnChanges, OnDestroy {

    // get parameter from HTML view
    @ViewChild('postcodeTable') postcodeTable: TableComponent;
    @ViewChild('BranchNumberSearchValue') BranchNumberSearch: ElementRef; // call element reference

    @Input() showAddNew: boolean;
    //@Output() openAddMode = new EventEmitter();

    public translateSubscription: Subscription;
    public isRequesting: boolean = false;
    private _error: any;
    public zipCode: any;
    public localeData: any;
    public optionList: Array<any> = [
        { title: 'All Branches', value: 'All' },
        { title: 'Service Branch', value: 'Service' }
    ];
    //config form view data
    public zipForm: FormGroup;
    // style show hide parameters
    public BranchNumberSearchValueVisible: boolean;
    public lstBranchSelectionValueVisible: boolean;
    public StateSearchValueVisible: boolean;
    public PostcodeSearchValueVisible: boolean;
    public TownSearchValueVisible: boolean;

    // set webservice API parameters
    public method: string = 'contract-management/search';
    public module: string = 'contract-admin';
    public operation: string = 'Business/iCABSBPostcodeSearch';
    public search: URLSearchParams;

    // Local parameter
    public BranchNumberSearchValue: any = {};

    // get input from Parent Page
    public inputParams: any;
    public searchValue: Object = {
        'ServiceBranchNumber': '',
        'Postcode': '',
        'State': '',
        'Town': ''
    };

    // input for DropDown lookup
    public dropdown = {
        servicebranch: {
            params: {
                'parentMode': 'ContractSearchLookUp'
            },
            active: {
                id: '',
                text: ''
            },
            disabled: false,
            required: true,
            isError: true
        }
    };

    //tabledata: Array<any>;
    public columns: Array<any> = [
        { title: ' Post Code', name: 'Postcode', sort: '', type: MntConst.eTypeCode },
        { title: 'Service Branch', name: 'ServiceBranchNumber', type: MntConst.eTypeInteger },
        { title: 'State', name: 'State', type: MntConst.eTypeText },
        { title: 'Town', name: 'Town', type: MntConst.eTypeText }
    ];

    // to form the table format
    public itemsPerPage: number = 10;
    public page: number = 1;
    public totalItem: number = 11;
    public paginationStyle = { align: 'text-right' };


    constructor(
        private serviceConstants: ServiceConstants,
        private ellipsis: EllipsisComponent,
        private _formBuilder: FormBuilder,
        private translate: TranslateService,
        private ls: LocalStorageService,
        private localeTranslateService: LocaleTranslationService,
        private utils: Utils,
        private logger: Logger
    ) { }

    ngOnInit(): void {
        this.isRequesting = true;
        this.zipForm = this._formBuilder.group({
            lstBranchSelection: [''],
            BranchNumberSearchValue: [{ value: '8' }],
            PostcodeSearchValue: [''],
            StateSearchValue: [''],
            TownSearchValue: ['']
        });

        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.fetchTranslationContent();
            }
        });
        this.localeTranslateService.setUpTranslation();

    }

    ngAfterContentInit(): void {
        // Component views have been checked
        this.isRequesting = false;
    }

    ngOnChanges(data: any): void {
        if (data.inputParams) {
            this.populateSearchFields();
        }
    }

    ngOnDestroy(): void {
        if (this.translateSubscription) {
            this.translateSubscription.unsubscribe();
        }
    }

    public getCurrentPage(currentPage: number): void {
        this.page = currentPage;
    }

    public onlstBranchSelection(event: any): void {
        if (event === 'Service') {
            this.BranchNumberSearchValueVisible = true;
            this.BranchNumberSearchValue.ServiceBranchNumber = this.utils.getBranchCode();
            this.dropdown.servicebranch.active = {
                id: this.utils.getBranchCode(),
                text: this.utils.getBranchText()
            };
            this.dropdown.servicebranch.active.text = this.utils.getBranchText();
        } else {
            this.BranchNumberSearchValueVisible = false;
            this.dropdown.servicebranch.active = {
                id: '',
                text: ''
            };
        }
    }

    // servicebranch_onchange()
    public servicebranchOnchange(obj: any): void {
        if (obj) {
            if (obj.BranchNumber) {
                this.BranchNumberSearchValue.ServiceBranchNumber = obj.BranchNumber;
            }
            if (obj.BranchName) {
                this.BranchNumberSearchValue.ServiceBranchName = obj.BranchName;
            }
        }
    }

    public selectedData(event: any): any {
        let returnObj: any;
        switch (this.inputParams.parentMode) {
            case 'LookUp':
            case 'LookUp-Service':
            case 'Search':
                returnObj = {
                    'Postcode': event.row.Postcode,
                    'Town': (event.row.Town) ? event.row.Town : '',
                    'State': (event.row.State) ? event.row.State : ''
                };
                break;
            case 'CTDExclusion':
                returnObj = {
                    'Postcode': event.row.Postcode,
                    'ExcludeTown': (event.row.Town) ? event.row.Town : '',
                    'ExcludeState': (event.row.State) ? event.row.State : ''
                };
                break;
            case 'ContactCentreNewContact':
                returnObj = {
                    'CallContactPostcode': event.row.Postcode,
                    'CallAddressLine4': (event.row.Town) ? event.row.Town : '',
                    'CallAddressLine5': (event.row.State) ? event.row.State : ''
                };
                break;
            case 'Premise':
                returnObj = {
                    'PremisePostcode': event.row.Postcode,
                    'PremiseAddressLine4': (event.row.Town) ? event.row.Town : '',
                    'PremiseAddressLine5': (event.row.State) ? event.row.State : ''
                };
                break;
            case 'Prospect':
                returnObj = {
                    'Postcode': event.row.Postcode,
                    'AddressLine4': (event.row.Town) ? event.row.Town : '',
                    'AddressLine5': (event.row.State) ? event.row.State : ''
                };
                break;
            case 'PremiseProspect':
                returnObj = {
                    'PremisePostcode': event.row.Postcode,
                    'PremiseAddressLine4': (event.row.Town) ? event.row.Town : '',
                    'PremiseAddressLine5': (event.row.State) ? event.row.State : ''
                };
                break;
            case 'FixedPriceJob':
                returnObj = {
                    'JobPremisePostcode': event.row.Postcode,
                    'JobPremiseAddressLine4': (event.row.Town) ? event.row.Town : '',
                    'JobPremiseAddressLine5': (event.row.State) ? event.row.State : ''
                };
                break;
            case 'Account':
                returnObj = {
                    'AccountPostcode': event.row.Postcode,
                    'AccountAddressLine4': (event.row.Town) ? event.row.Town : '',
                    'AccountAddressLine5': (event.row.State) ? event.row.State : ''
                };
                break;
            case 'Invoice':
                returnObj = {
                    'InvoicePostcode': event.row.Postcode,
                    'InvoiceAddressLine4': (event.row.Town) ? event.row.Town : '',
                    'InvoiceAddressLine5': (event.row.State) ? event.row.State : ''
                };
                break;
            case 'Statement':
                returnObj = {
                    'StatementPostcode': event.row.Postcode,
                    'StatementAddressLine4': (event.row.Town) ? event.row.Town : '',
                    'StatementAddressLine5': (event.row.State) ? event.row.State : ''
                };
                break;
            case 'Contract':
                returnObj = {
                    'ContractPostcode': event.row.Postcode,
                    'ContractAddressLine4': (event.row.Town) ? event.row.Town : '',
                    'ContractAddressLine5': (event.row.State) ? event.row.State : ''
                };
                break;
            default:
                returnObj = {
                    'Postcode': event.row.Postcode,
                    'Object': event.row
                };
        }
        this.ellipsis.sendDataToParent(returnObj);
    }

    updateView(params: any): void {
        this.inputParams = params;
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.showAddNew = this.inputParams.showAddNew;
        this.populateSearchFields();
        this.loadData();
    }

    public populateSearchFields(): void {
        // this.logger.log('ParentMode Selected ---', this.inputParams.parentMode);
        switch (this.inputParams.parentMode) {
            case 'LookUp':
            case 'LookUp-Service':
            case 'Search':
                this.zipForm.controls['PostcodeSearchValue'].setValue(this.inputParams.PostCode);
                this.zipForm.controls['StateSearchValue'].setValue(this.inputParams.State);
                this.zipForm.controls['TownSearchValue'].setValue(this.inputParams.Town);
                break;
            case 'Prospect':
                this.zipForm.controls['PostcodeSearchValue'].setValue(this.inputParams.PostCode);
                this.zipForm.controls['StateSearchValue'].setValue(this.inputParams.AddressLine5);
                this.zipForm.controls['TownSearchValue'].setValue(this.inputParams.AddressLine4);
                break;
            case 'PremiseProspect':
            case 'Premise':
                this.zipForm.controls['PostcodeSearchValue'].setValue(this.inputParams.PremisePostCode);
                this.zipForm.controls['StateSearchValue'].setValue(this.inputParams.PremiseAddressLine5);
                this.zipForm.controls['TownSearchValue'].setValue(this.inputParams.PremiseAddressLine4);
                break;
            case 'FixedPriceJob':
                this.zipForm.controls['PostcodeSearchValue'].setValue(this.inputParams.JobPremisePostcode);
                this.zipForm.controls['StateSearchValue'].setValue(this.inputParams.JobPremiseAddressLine5);
                this.zipForm.controls['TownSearchValue'].setValue(this.inputParams.JobPremiseAddressLine4);
                break;
            case 'Account':
                this.zipForm.controls['PostcodeSearchValue'].setValue(this.inputParams.AccountPostCode);
                this.zipForm.controls['StateSearchValue'].setValue(this.inputParams.AccountAddressLine5);
                this.zipForm.controls['TownSearchValue'].setValue(this.inputParams.AccountAddressLine4);
                break;
            case 'Invoice':
                this.zipForm.controls['PostcodeSearchValue'].setValue(this.inputParams.InvoicePostCode);
                this.zipForm.controls['StateSearchValue'].setValue(this.inputParams.InvoiceAddressLine5);
                this.zipForm.controls['TownSearchValue'].setValue(this.inputParams.InvoiceAddressLine4);
                break;
            case 'Statement':
                this.zipForm.controls['PostcodeSearchValue'].setValue(this.inputParams.StatementPostcode);
                this.zipForm.controls['StateSearchValue'].setValue(this.inputParams.StatementAddressLine5);
                this.zipForm.controls['TownSearchValue'].setValue(this.inputParams.StatementAddressLine4);
                break;
            case 'Contract':
            case 'ContactCentreNewContact':
                this.zipForm.controls['PostcodeSearchValue'].setValue(this.inputParams.ContractPostcode);
                this.zipForm.controls['StateSearchValue'].setValue(this.inputParams.ContractAddressLine5);
                this.zipForm.controls['TownSearchValue'].setValue(this.inputParams.ContractAddressLine4);
                break;
            case 'CTDExclusion':
                this.zipForm.controls['PostcodeSearchValue'].setValue(this.inputParams.Postcode);
                this.zipForm.controls['StateSearchValue'].setValue(this.inputParams.ExcludeAddressLine5);
                this.zipForm.controls['TownSearchValue'].setValue(this.inputParams.ExcludeAddressLine4);
                break;
            default:
                this.zipForm.controls['PostcodeSearchValue'].setValue(this.inputParams.PostCode);
                this.zipForm.controls['StateSearchValue'].setValue(this.inputParams.State);
                this.zipForm.controls['TownSearchValue'].setValue(this.inputParams.Town);
        }

        if (this.inputParams.parentMode === 'LookUp-Service') {
            this.lstBranchSelectionValueVisible = true;
            // For Defect IUI-5666 - By Lopa - On 18/05/2017
            this.BranchNumberSearchValueVisible = true;
            this.zipForm.controls['lstBranchSelection'].setValue('Service');
            this.BranchNumberSearchValue.ServiceBranchNumber = this.utils.getBranchCode();
            // For defect IUI-4956 - by Maviah
            // this.BranchNumberSearchValueVisible = false;
            // this.zipForm.controls['lstBranchSelection'].setValue('All');
            this.dropdown.servicebranch.active = {
                id: this.utils.getBranchCode(),
                text: this.utils.getBranchText()
            };
        } else {
            this.lstBranchSelectionValueVisible = false;
            this.BranchNumberSearchValueVisible = false;
        }
    }

    public getFormData(value: any, valid: boolean): void {
        switch (this.inputParams.parentMode) {
            case 'LookUp-Service':
                if (value.BranchNumberSearchValue)
                    this.searchValue['ServiceBranchNumber'] = value.BranchNumberSearchValue;
                else
                    this.searchValue['ServiceBranchNumber'] = '';
                break;
            default:
                if (value.PostcodeSearchValue)
                    this.searchValue['Postcode'] = value.PostcodeSearchValue;
                else
                    this.searchValue['Postcode'] = '';
                if (value.StateSearchValue)
                    this.searchValue['State'] = value.StateSearchValue;
                else
                    this.searchValue['State'] = '';
                if (value.TownSearchValue)
                    this.searchValue['Town'] = value.TownSearchValue;
                else
                    this.searchValue['Town'] = '';
        }
        this.loadData();
    }

    public refresh(): void {
        //this.page = 1;
        this.loadData();
    }

    public getSearchParams(): void {
        let sortBy: string = '';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (this.BranchNumberSearchValueVisible) {
            this.search.set('ServiceBranchNumber', this.BranchNumberSearchValue.ServiceBranchNumber ? this.BranchNumberSearchValue.ServiceBranchNumber : this.utils.getBranchCode());
        }

        if (this.zipForm.controls['PostcodeSearchValue']) {
            this.search.set('search.op.Postcode', 'GE');
            this.search.set('Postcode', this.zipForm.controls['PostcodeSearchValue'].value);
        } else {
            this.search.set('Postcode', '');
        }

        if (this.zipForm.controls['StateSearchValue']) {
            this.search.set('search.op.State', 'GE');
            this.search.set('State', this.zipForm.controls['StateSearchValue'].value);
            if (!sortBy && this.zipForm.controls['StateSearchValue'].value) {
                sortBy = 'State';
            }
        }

        if (this.zipForm.controls['TownSearchValue']) {
            this.search.set('search.op.Town', 'GE');
            this.search.set('Town', this.zipForm.controls['TownSearchValue'].value);
            if (!sortBy && this.zipForm.controls['TownSearchValue'].value) {
                sortBy = 'Town';
            }
        }

        if (this.zipForm.controls['PostcodeSearchValue'].value) {
            sortBy = 'Postcode';
        }
        this.search.set('search.sortby', sortBy || 'Postcode');
    }

    public loadData(): void {
        //Check the filter values to be set
        this.getSearchParams();
        this.inputParams.search = this.search;
        this.postcodeTable.loadTableData(this.inputParams);
    }

    public fetchTranslationContent(): void {
        for (let i = 0; i < this.columns.length; i++) {
            this.localeTranslateService.getTranslatedValue(this.columns[i].title, null).subscribe((res: string) => {
                if (res) {
                    this.columns[i].title = res;
                }
            });
        }
    }

    public onAddNew(): void {
        this.ellipsis.onAddNew(true);
        this.ellipsis.closeModal();
    }

}
