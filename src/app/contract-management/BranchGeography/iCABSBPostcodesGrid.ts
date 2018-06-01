import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { GridComponent } from './../../../shared/components/grid/grid';
import { Http, URLSearchParams } from '@angular/http';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({

  templateUrl: 'iCABSBPostcodesGrid.html'
})

export class PostCodeGridComponent extends BaseComponent implements OnInit, OnDestroy {
  public pageId: string = '';
  public branchNumber: any;
  public BranchSearch: any;
  public brunchNumber: string;
  public branchname: string;
  public inputParamsBranch: any = {};
  public method: string = 'contract-management/maintenance';
  public module: string = 'contract-admin';
  public operation: string = 'Business/iCABSBPostcodesGrid';
  public controls: any = [];
  public inputParams: any = {};
  public search: URLSearchParams;
  public totalItems: number = 10;
  public maxColumn: number = 6;
  public itemsPerPage: number = 10;
  public pageCurrent: number = 1;
  public pageSize: number = 10;
  public BranchDefaultCode: string = 'Yes';
  public AllAllocationCode: string = 'All';
  public branchDefaultOption: Array<any>;
  public allocationOption: Array<any>;
  public negBranchNumberSelected: Object = {
    id: '',
    text: ''
  };
  public headerClicked: string = '';
  public sortType: string = '';
  public gridSortHeaders: Array<any> = [
    {
      'fieldName': 'Postcode',
      'colName': 'Postcode',
      'sortType': 'ASC'
    },
    {
      'fieldName': 'State',
      'colName': 'State',
      'sortType': 'ASC'
    },
    {
      'fieldName': 'Town',
      'colName': 'Suburb',
      'sortType': 'ASC'
    },
    {
      'fieldName': 'Allocated',
      'colName': 'Allocated',
      'sortType': 'ASC'
    },
    {
      'fieldName': 'BranchDefault',
      'colName': 'Branch Default',
      'sortType': 'ASC'
    },
    {
      'fieldName': 'ServiceBranchName',
      'colName': 'Service Branch',
      'sortType': 'ASC'
    }
  ];
  public validateProperties: Array<any> = [
    {
      'type': MntConst.eTypeCode,
      'index': 0,
      'align': MntConst.eAlignmentLeft
    },
    {
      'type': MntConst.eTypeCode,
      'index': 1,
      'align': MntConst.eAlignmentLeft
    },
    {
      'type': MntConst.eTypeCode,
      'index': 2,
      'align': MntConst.eAlignmentLeft
    },
    {
      'type': MntConst.eTypeText,
      'index': 3,
      'align': MntConst.eAlignmentLeft
    },
    {
      'type': MntConst.eTypeText,
      'index': 4,
      'align': MntConst.eAlignmentLeft
    },
    {
      'type': MntConst.eTypeImage,
      'index': 5,
      'align': MntConst.eAlignmentLeft
    }];
  ;

  constructor(injector: Injector) {
    super(injector);
    this.pageId = PageIdentifier.ICABSBPOSTCODESGRID;

  }

  @ViewChild('postCodeGrid') postCodeGrid: GridComponent;
  @ViewChild('postCodePagination') postCodePagination: PaginationComponent;

  public ngOnInit(): void {
    super.ngOnInit();

    this.controls = [

    ];

    this.brunchNumber = this.utils.getBranchCode();
    this.initForm();
    this.setUI();
    this.updateView();
    this.lookupBranchName();

  }

  ngOnDestroy(): void {
        super.ngOnDestroy();
  }


  /*# Get and Set Branch Name #*/
  public lookupBranchName(): any {
    let lookupIP = [
      {
        'table': 'Branch',
        'query': {
          'BusinessCode': this.businessCode,
          'BranchNumber': this.utils.getBranchCode()
        },
        'fields': ['BranchName']
      }
    ];

    this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
      let Branch = data[0][0];
      if (Branch) {
        this.negBranchNumberSelected = {
          id: this.brunchNumber,
          text: this.brunchNumber + ' - ' + Branch.BranchName
        };

      }
    });
  }

  public setUI(): void {
    this.branchDefaultOption = [{
      'text': 'All',
      'value': 'All'
    }, {
      'text': 'Yes',
      'value': 'Yes'
    }, {
      'text': 'No',
      'value': 'No'
    }
    ];

    this.allocationOption = [{
      'text': 'All',
      'value': 'All'
    }, {
      'text': 'Yes',
      'value': 'Yes'
    }, {
      'text': 'No',
      'value': 'No'
    }
    ];

  }

  public selectedBranchDefault(CodeValue: string): void {
    this.BranchDefaultCode = CodeValue;
  }

  public selectedAllAllocation(CodeValue: string): void {
    this.AllAllocationCode = CodeValue;
  }


  public initForm(): void {
    this.riExchange.renderForm(this.uiForm, this.controls);
  }

  public onBranchDataReceived(obj: any): void {
    this.brunchNumber = obj.BranchNumber;
    this.BranchSearch = obj.BranchNumber + ' : ' + (obj.hasOwnProperty('BranchName') ? obj.BranchName : obj.Object.BranchName);
  }

  public getCurrentPage(event: any): void {
    this.pageCurrent = event.value;
    this.updateView();
  }

  public updateView(): void {

    this.loadData(this.inputParams);
  }

  public loadData(params: any): void {
    this.setFilterValues(params);
    this.inputParams.method = this.method;
    this.inputParams.operation = this.operation;
    this.inputParams.module = this.module;
    this.inputParams.search = this.search;
    this.postCodeGrid.loadGridData(this.inputParams);

  }

  public setFilterValues(params: any): void {
    this.search = new URLSearchParams();
    this.search.set(this.serviceConstants.Action, '2');
    this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
    this.search.set('BranchNumber', this.brunchNumber);
    this.search.set('SelAllocated', this.AllAllocationCode);
    this.search.set('SelBranchDefault', this.BranchDefaultCode);
    this.search.set('PageCurrent', this.pageCurrent.toString());
    this.search.set('action', '2');
    this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClicked);
    this.search.set(this.serviceConstants.GridSortOrder, this.sortType);
    this.search.set('riGridMode', '0');
    this.search.set('PageSize', this.pageSize.toString());
    this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
  }

  public refresh(event: any): void {
    this.pageCurrent = 1;
    this.loadData(this.inputParams);
  }

  public getGridInfo(info: any): void {
    this.postCodePagination.totalItems = info.totalRows;
  }

  public sortGrid(data: any): void {
    this.headerClicked = data.fieldname;
    this.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
    this.loadData({});
  }

}
