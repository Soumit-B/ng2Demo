import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Injector, Input, EventEmitter, HostListener } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from './../../../base/BaseComponent';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { ICabsModalVO } from './../../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { EllipsisComponent } from './../../../../shared/components/ellipsis/ellipsis';
import { ProductDetailSearchComponent } from './../../../internal/search/iCABSBProductDetailSearch.component';
import { ProductCoverSearchComponent } from './../../../internal/search/iCABSBProductCoverSearch.component';
import { ProductSearchGridComponent } from './../../../internal/search/iCABSBProductSearch';

@Component({
  templateUrl: 'iCABSBProductCoverMaintenance.html'
})

export class ProductCoverMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('productSearchEllipsis') productSearchEllipsis: EllipsisComponent;
  @ViewChild('productDetailSearch') productDetailSearch: EllipsisComponent;
  @ViewChild('productCoverSearch') productCoverSearch: EllipsisComponent;
  @ViewChild('routeAwayComponent') public routeAwayComponent;

  public riMaintenanceCurrentMode: string = '';
  public pageId: string = '';
  public controls: Array<any> = [
    { name: 'ProductCode', disabled: false, type: MntConst.eTypeCode, required: true, commonValidator: true },
    { name: 'ProductDesc', disabled: true, required: true, type: MntConst.eTypeText },
    { name: 'ProductDetailCode', disabled: true, type: MntConst.eTypeCode, required: true, commonValidator: true },
    { name: 'ProductDetailDesc', disabled: true, type: MntConst.eTypeText },
    { name: 'ValidForNewInd', disabled: true, type: MntConst.eTypeCheckBox },
    { name: 'DefaultInd', disabled: true, type: MntConst.eTypeCheckBox },
    { name: 'ROWID', type: MntConst.eTypeCode }
  ];
  public xhrParams: any = {
    module: 'contract-admin',
    method: 'contract-management/admin',
    operation: 'Business/iCABSBProductCoverMaintenance'
  };
  public ellipsis: any = {
    productSearch: {
      autoOpen: false,
      showCloseButton: true,
      childConfigParams: {
        parentMode: 'LookUp'
      },
      modalConfig: {
        backdrop: 'static',
        keyboard: true
      },
      contentComponent: ProductSearchGridComponent,
      showHeader: true,
      isDisabled: false
    },
    productDetailSearch: {
      autoOpen: false,
      showCloseButton: true,
      childConfigParams: {
        parentMode: 'LookUp'
      },
      modalConfig: {
        backdrop: 'static',
        keyboard: true
      },
      contentComponent: ProductDetailSearchComponent,
      showHeader: true,
      isDisabled: true,
      hideIcon: true
    },
    productCoverSearch: {
      showCloseButton: true,
      childConfigParams: {
        parentMode: 'LookUp',
        isShowAddNew: true
      },
      modalConfig: {
        backdrop: 'static',
        keyboard: true
      },
      contentComponent: ProductCoverSearchComponent,
      showHeader: true,
      isDisabled: true,
      hideIcon: false
    }
  };

  constructor(injector: Injector) {
    super(injector);
    this.pageId = PageIdentifier.ICABSBPRODUCTCOVERMAINTENANCE;
    this.browserTitle = this.pageTitle = 'Product Cover Maintenance';
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.setURLQueryParameters(this);
    if (this.isReturning()) {
      this.populateUIFromFormData();
    } else {
      this.windowOnload();
    }
    this.routeAwayUpdateSaveFlag();
    this.routeAwayGlobals.setEllipseOpenFlag(false);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.routeAwayGlobals.resetRouteAwayFlags();
  }

  ngAfterViewInit(): void {
    this.pageParams.isEnableSave = false;
    this.productSearchEllipsis.openModal();
  }

  public getURLQueryParameters(param: any): void {
    this.pageParams.CurrentContractTypeURLParameter = param['currentContractTypeURLParameter'];
    this.pageParams.currentContractType = param['currentContractTypeURLParameter'];
  }
  public setCurrentContractType(): void {
    this.pageParams.currentContractType = this.riExchange.getCurrentContractType();
    this.pageParams.currentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();
  }

  public getModalinfo(e: any): void {
    this.ellipsis.productSearch.autoOpen = false;
    this.ellipsis.productSearch.childConfigParams.parentMode = 'LookUp';
  }

  public windowOnload(): void {
    this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode') || '');
    this.setControlValue('ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc') || '');
    this.ellipsis.productCoverSearch.childConfigParams.productCode = this.getControlValue('ProductCode');
    this.ellipsis.productCoverSearch.childConfigParams.productDesc = this.getControlValue('ProductDesc');
    this.pageParams.isShowDelete = false;

    switch (this.parentMode) {
      case 'Search':
        this.riMaintenanceUpdateMode();
        break;
      case 'SearchAdd':
        this.ellipsis.productDetailSearch.hideIcon = false;
        this.ellipsis.productCoverSearch.hideIcon = true;
        this.riMaintenanceAddMode();
        break;
    }
    if (this.getControlValue('ProductCode') && this.getControlValue('ProductDetailCode')) {
      this.riMaintenanceExecMode(this.riMaintenanceCurrentMode);
    }
  }

  // -------- riMaintenance Start ------

  public riMaintenanceUpdateMode(): void {
    this.riMaintenanceCurrentMode = MntConst.eModeUpdate;
  }

  public riMaintenanceAddMode(): void {
    this.riMaintenanceCurrentMode = MntConst.eModeAdd;
  }

  public riMaintenanceDeleteMode(): void {
    this.riMaintenanceCurrentMode = MntConst.eModeDelete;
  }

  public riMaintenanceAddTableCommit(): void {
    let search: URLSearchParams = this.getURLSearchParamObject();
    search.set(this.serviceConstants.Action, '0');

    let searchData: Object = {};
    searchData['ProductCode'] = this.getControlValue('ProductCode') || '';
    searchData['ProductDetailCode'] = this.getControlValue('ProductDetailCode') || '';

    this.ajaxSource.next(this.ajaxconstant.START);
    this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, searchData).subscribe(
      (data) => {
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        if (data.hasError) {
          this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
          this.riMaintenanceFailToFetchRecord();
        } else {
          this.riMaintenanceFetchRecord(data);
        }
      },
      (error) => {
        this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        this.riMaintenanceFailToFetchRecord();
      });
  }

  public riMaintenanceAddVirtualTableCommit(): void {
    let lookupIP = [
      {
        'table': 'Product',
        'query': {
          'BusinessCode': this.businessCode(),
          'ProductCode': this.getControlValue('ProductCode')
        },
        'fields': ['ProductDesc']
      },
      {
        'table': 'ProductDetail',
        'query': {
          'BusinessCode': this.businessCode(),
          'ProductDetailCode': this.getControlValue('ProductDetailCode')
        },
        'fields': ['ProductDetailDesc']
      }
    ];

    this.ajaxSource.next(this.ajaxconstant.START);
    this.LookUp.lookUpPromise(lookupIP).then(data => {
      this.ajaxSource.next(this.ajaxconstant.COMPLETE);
      if (data.hasError) {
        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
      } else {
        if (data && data.length > 0) {
          let productData = data[0];
          let ProductDetailData = data[1];
          if (productData && productData.length > 0 && productData[0]) {
            this.setControlValue('ProductDesc', productData[0].ProductDesc);
            if (ProductDetailData && ProductDetailData.length > 0 && ProductDetailData[0]) {
              this.setControlValue('ProductDetailDesc', ProductDetailData[0].ProductDetailDesc || '');
              if (this.uiForm.valid && (this.riMaintenanceCurrentMode === MntConst.eModeSaveAdd)) {
                this.confirm();
                this.disableControl('ProductCode', true);
                this.ellipsis.productSearch.isDisabled = true;
                this.disableControl('ProductDetailCode', true);
                this.ellipsis.productDetailSearch.isDisabled = true;
              }
            } else {
              this.setControlValue('ProductDetailCode', '');
              this.setControlValue('ProductDetailDesc', '');
            }
          }
          else {
            this.setControlValue('ProductCode', '');
            this.setControlValue('ProductDesc', '');
            this.disableControl('ProductCode', false);
            this.ellipsis.productSearch.isDisabled = false;
          }
        }
        else {
          this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.RecordNotFound));
        }
      }
    }).catch(error => {
      this.ajaxSource.next(this.ajaxconstant.COMPLETE);
      this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
    });
  }

  public riMaintenanceComplete(): void {
    if (this.getControlValue('ProductCode') && this.getControlValue('ProductDetailCode')) {
      this.riMaintenanceAddVirtualTableCommit();
      this.riMaintenanceAddTableCommit();
    }
  }

  public riMaintenanceFetchRecord(data: any): void {
    this.setControlValue('ValidForNewInd', data.ValidForNewInd);
    this.setControlValue('DefaultInd', data.DefaultInd);
    this.setControlValue('ROWID', data.ttProductCover || '');
    this.enableControls(['ProductDesc', 'ProductDetailDesc']);

    this.backUpPrimaryControls();
    this.setEllipsisChildConfigParams();
    this.markAsPrestine();
    this.riMaintenanceUpdateMode();
    this.riMaintenanceExecMode(this.riMaintenanceCurrentMode);
  }

  public riMaintenanceFailToFetchRecord(): void {
    this.setControlValue('ProductDetailCode', '');
    this.setControlValue('ProductDetailDesc', '');
    this.setControlValue('ValidForNewInd', '');
    this.setControlValue('DefaultInd', '');
    this.setControlValue('ROWID', '');

    this.markAsPrestine();
    this.pageParams.isShowDelete = false;
    this.pageParams.isEnableSave = false;
  }

  public riMaintenanceBeforeAdd(): void {
    this.pageParams.isEnableSave = true;
    this.pageParams.isShowDelete = false;
    this.ellipsis.productDetailSearch.hideIcon = false;
    this.ellipsis.productCoverSearch.hideIcon = true;

    this.enableControls(['ProductDesc', 'ProductDetailDesc']);
    this.setControlValue('ProductDetailCode', '');
    this.setControlValue('ProductDetailDesc', '');
    this.setControlValue('ValidForNewInd', '');
    this.setControlValue('DefaultInd', '');
  }

  public riMaintenanceBeforeSaveAdd(): void {
    this.riMaintenanceAddVirtualTableCommit();
  }

  public riMaintenanceBeforeUpdate(): void {
    this.pageParams.isEnableSave = true;
    this.pageParams.isShowDelete = true;
    this.ellipsis.productDetailSearch.hideIcon = true;
    this.ellipsis.productCoverSearch.hideIcon = false;
    this.disableControl('ProductCode', false);
    this.disableControl('ProductDetailCode', false);
    this.ellipsis.productSearch.isDisabled = false;
  }

  public riMaintenanceBeforeUpdateMode(): void {
    this.pageParams.isEnableSave = true;
    this.pageParams.isShowDelete = true;
    this.setControlValue('ProductCode', this.pageParams.ProductCode || '');
    this.setControlValue('ProductDetailCode', this.pageParams.ProductDetailCode || '');
  }


  public riMaintenanceExecMode(mode: string): void {
    switch (mode) {
      case 'eModeUpdate':
        this.riMaintenanceBeforeUpdate();
        break;
      case 'eModeAdd':
        this.riMaintenanceBeforeAdd();
        break;
      case 'eModeSaveUpdate':
        this.confirm();
        break;
      case 'eModeSaveAdd':
        this.riMaintenanceBeforeSaveAdd();
        break;
      case 'eModeDelete':
        this.confirmDelete();
        break;
    }
  }

  public riMaintenanceExecContinue(mode: string): void {
    switch (mode) {
      case 'eModeSaveUpdate':
        this.riMaintenanceAfterSave();
        break;
      case 'eModeSaveAdd':
        this.riMaintenanceAfterSave();
        break;
      case 'eModeDelete':
        this.riMaintenanceAfterDelete();
        break;
    }
  }

  public riMaintenanceCancelEvent(mode: string): void {
    switch (mode) {
      case 'eModeUpdate':
      case 'eModeSaveUpdate':
        this.riMaintenanceBeforeUpdateMode();
        this.riMaintenanceComplete();
        break;
      case 'eModeAdd':
      case 'eModeSaveAdd':
        this.ellipsis.productSearch.isDisabled = false;
        this.ellipsis.productSearch.autoOpen = true;
        this.ngAfterViewInit();
        this.ellipsis.productCoverSearch.isDisabled = true;
        this.ellipsis.productDetailSearch.isDisabled = true;
        this.ellipsis.productDetailSearch.hideIcon = true;
        this.ellipsis.productCoverSearch.hideIcon = false;
        this.disableControl('ProductCode', false);
        this.riMaintenanceUpdateMode();
        break;
      case 'eModeDelete':
        this.riMaintenanceBeforeUpdateMode();
        this.riMaintenanceComplete();
        break;
    }
  }

  public save(): void {
    this.riExchange.validateForm(this.uiForm);
    if (this.uiForm.status.toUpperCase() === 'VALID') {
      switch (this.riMaintenanceCurrentMode) {
        case 'eModeAdd':
        case 'eModeSaveAdd':
          this.pageParams.actionAfterSave = 1;
          this.riMaintenanceCurrentMode = MntConst.eModeSaveAdd;
          this.riMaintenanceExecMode(this.riMaintenanceCurrentMode);
          break;
        case 'eModeUpdate':
        case 'eModeSaveUpdate':
          this.pageParams.actionAfterSave = 2;
          this.riMaintenanceCurrentMode = MntConst.eModeSaveUpdate;
          this.riMaintenanceExecMode(this.riMaintenanceCurrentMode);
          break;
      }
    }
  }

  public delete(): void {
    this.riMaintenanceDeleteMode();
    this.riExchange.validateForm(this.uiForm);
    if (this.uiForm.status === 'VALID') {
      this.pageParams.actionAfterDelete = 3;
      this.riMaintenanceExecMode(this.riMaintenanceCurrentMode);
    }
  }

  public confirm(): any {
    let modalVO: ICabsModalVO = new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.confirmed.bind(this));
    this.modalAdvService.emitPrompt(modalVO);
  }

  public confirmDelete(): any {
    let modalVO: ICabsModalVO = new ICabsModalVO(MessageConstant.Message.DeleteRecord, null, this.confirmed.bind(this), this.promptDeleteCancel.bind(this));
    this.modalAdvService.emitPrompt(modalVO);
  }
  public confirmed(obj: any): any {
    this.riMaintenanceExecContinue(this.riMaintenanceCurrentMode);
  }
  public promptDeleteCancel(obj: any): any {
    this.riMaintenanceUpdateMode();
  }
  public cancel(): void {
    this.resetControl();
    this.riMaintenanceCancelEvent(this.riMaintenanceCurrentMode);
  }
  public resetControl(): void {
    this.riExchange.resetCtrl(this.controls);
    this.riExchange.renderForm(this.uiForm, this.controls);
    this.markAsPrestine();
    this.pageParams.isShowDelete = false;
    this.pageParams.isEnableSave = false;
  }


  public riMaintenanceAfterSave(): void {
    let search = this.getURLSearchParamObject();
    search.set(this.serviceConstants.Action, this.pageParams.actionAfterSave);

    let formdata: Object = {};
    formdata['ProductCode'] = this.getControlValue('ProductCode');
    formdata['ProductDetailCode'] = this.getControlValue('ProductDetailCode');
    formdata['ValidForNewInd'] = this.getControlValue('ValidForNewInd');
    formdata['DefaultInd'] = this.getControlValue('DefaultInd');
    if (this.riMaintenanceCurrentMode === MntConst.eModeSaveUpdate)
      formdata['ROWID'] = this.getControlValue('ROWID');

    this.ajaxSource.next(this.ajaxconstant.START);
    this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formdata)
      .subscribe(
      (e) => {
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        if (e.hasError) {
          this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
          this.failToSave();
        } else {
          this.markAsPrestine();
          this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.SavedSuccessfully));
          this.backUpPrimaryControls();
          this.riMaintenanceUpdateMode();
          this.riMaintenanceExecMode(this.riMaintenanceCurrentMode);
        }
      },
      (error) => {
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
        this.failToSave();
      });
  }

  public riMaintenanceAfterDelete(): void {
    let search = this.getURLSearchParamObject();
    search.set(this.serviceConstants.Action, this.pageParams.actionAfterDelete);

    let formdata: Object = {};
    formdata['ROWID'] = this.getControlValue('ROWID');

    this.ajaxSource.next(this.ajaxconstant.START);
    this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formdata)
      .subscribe(
      (e) => {
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        if (e.hasError) {
          this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
          this.backUpPrimaryControls();
          this.failToSave();
        } else {
          let modalVO: ICabsModalVO = new ICabsModalVO(MessageConstant.Message.RecordDeleted);
          modalVO.closeCallback = this.riMaintenanceAfterSuccessDelete.bind(this);
          this.modalAdvService.emitMessage(modalVO);
          this.resetControl();
          this.ellipsis.productCoverSearch.isDisabled = true;
        }
      },
      (error) => {
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
        this.backUpPrimaryControls();
        this.failToSave();
      });
  }

  public riMaintenanceAfterSuccessDelete(): void {
    this.ngAfterViewInit();
  }

  /* Method: execAddMode(): Details: Initializes Add Mode */
  public execAddMode(data: string): void {
    this.riMaintenanceAddMode();
    this.riMaintenanceExecMode(this.riMaintenanceCurrentMode);
    this.productDetailSearch.openModal();
  }

  /* ------ Method: failToSave(): Details: If Save is unsuccessfull ---*/
  public failToSave(): void {
    switch (this.riMaintenanceCurrentMode) {
      case MntConst.eModeSaveUpdate:
        this.riMaintenanceCurrentMode = MntConst.eModeUpdate;
        break;
      case MntConst.eModeSaveAdd:
        this.riMaintenanceCurrentMode = MntConst.eModeAdd;
        break;
      case MntConst.eModeDelete:
        this.riMaintenanceCurrentMode = MntConst.eModeUpdate;
        break;
    }
  }

  /* ------ method productDetailCodeOnChange(): productDetailSearch ellipsis return data ---*/
  public productDetailCodeOnChange(data: any): void {
    if (data.ProductDetailCode !== 'undefined' && data.ProductDetailCode !== null) {
      this.setControlValue('ProductDetailCode', data.ProductDetailCode || '');
    }
  }

  /* ------ method productCoverSearchOnReceive(): productCoverSearch ellipsis return data ---*/
  public productCoverSearchOnReceive(data: any): void {
    if (data === 'AddModeOn') this.execAddMode(data);
    else if (data && data.ProductDetailCode !== 'undefined' && data.ProductDetailCode !== null) {
      this.setControlValue('ProductDetailCode', data.ProductDetailCode || '');
      this.setControlValue('ProductDetailDesc', data.ProductDetailDesc || '');
      this.checkFormStatus(this.getProductDetailCode);
    }
  }

  public backUpPrimaryControls(): void {
    this.pageParams.ProductCode = this.getControlValue('ProductCode');
    this.pageParams.ProductDesc = this.getControlValue('ProductDesc');
    this.pageParams.ProductDetailCode = this.getControlValue('ProductDetailCode');
  }

  // Check if uiForm is Dirty
  public doCheck(): void {
    if (this.checkDirtyControls(['ProductCode', 'ProductDetailCode'])) {
      let modalVO: ICabsModalVO = new ICabsModalVO(MessageConstant.Message.DirtyCheck, null, this.confirmOpenFieldChange.bind(this), this.cancelOpenFieldChange.bind(this));
      modalVO.closeCallback = this.cancelOpenFieldChange.bind(this);
      this.modalAdvService.emitPrompt(modalVO);
    } else {
      this.pageParams.methodToCall.call(this);
    }
  }
  // Confirm Call back
  public confirmOpenFieldChange(obj: any): boolean {
    if (obj) {
      this.pageParams.confirmClose = true;
      this.pageParams.methodToCall.call(this);
    }
    return true;
  }
  // cancel Call back
  public cancelOpenFieldChange(obj: any): boolean {
    if (!this.pageParams.confirmClose)
      this.riMaintenanceCancelEvent(this.riMaintenanceCurrentMode);
    this.pageParams.confirmClose = false;
    return false;
  }

  // Check Form Status if UpdateMode is on
  public checkFormStatus(method?: Function): void {
    if (this.riMaintenanceCurrentMode === MntConst.eModeUpdate) {
      this.pageParams.methodToCall = method;
      this.doCheck();
    } else {
      method.call(this);
    }
  }

  /* ------ method getProductCode(): Details: Onchange formControl value ---*/
  public getProductCode(): void {
    if (this.ellipsis.productDetailSearch.hideIcon) {
      this.backUpPrimaryControls();
      this.clearControls(['ProductCode']);
      if (this.pageParams.ellipsisReturn)
        this.restoreFormData(['ProductCode', 'ProductDesc']);
      else
        this.restoreFormData(['ProductCode']);
      this.pageParams.ellipsisReturn = false;
    }
  }
  /* ------ method setEllipsisChildConfigParams(): Details: Set ellipsis inputParams ---*/
  public setEllipsisChildConfigParams(): void {
    this.ellipsis.productCoverSearch.isDisabled = false;
    this.ellipsis.productDetailSearch.isDisabled = false;
    this.ellipsis.productCoverSearch.childConfigParams.productCode = this.getControlValue('ProductCode');
    this.ellipsis.productCoverSearch.childConfigParams.productDesc = this.getControlValue('ProductDesc');
    this.ellipsis.productDetailSearch.childConfigParams.productCode = this.getControlValue('ProductCode');
    this.ellipsis.productDetailSearch.childConfigParams.productDesc = this.getControlValue('ProductDesc');
  }
  /* ------ method productCodeOnChange(): Details: ellipsis return data ---*/
  public productCodeOnChange(data: any): void {
    if (data.ProductCode !== 'undefined' && data.ProductCode !== null) {
      this.setControlValue('ProductCode', data.ProductCode || '');
      this.setControlValue('ProductDesc', data.ProductDesc || '');
      this.pageParams.ellipsisReturn = true;
      this.checkFormStatus(this.getProductCode);
    }
  }
  /* ------ method getProductDetailCode(): Details: Onchange formControl value ---*/
  public getProductDetailCode(): void {
    if (this.ellipsis.productDetailSearch.hideIcon) {
      this.backUpPrimaryControls();
      this.clearControls(['ProductCode', 'ProductDesc', 'ProductDetailCode']);
      this.restoreFormData(['ProductCode', 'ProductDesc', 'ProductDetailCode']);
      this.riMaintenanceComplete();
    }
  }

  /* ------ method restoreFormData(): Details: Restore formControl value ---*/
  public restoreFormData(contrls: Array<string>): void {
    let control: string;
    for (control in contrls) {
      if (control || contrls.indexOf(control) >= 0) {
        let cntrlName: any = contrls[control];
        this.setControlValue(contrls[control], this.pageParams[cntrlName]);
      }
    }
    this.disableControl('ProductDetailCode', false);
    this.setEllipsisChildConfigParams();
  }

  // --------------set form fields as pristine-------------//
  public markAsPrestine(): void {
    this.controls.forEach((i) => {
      this.uiForm.controls[i.name].markAsPristine();
      this.uiForm.controls[i.name].markAsUntouched();
    });
  }

  /*
  *  Alerts user when user is moving away without saving the changes. //CR implementation
  */
  public routeAwayUpdateSaveFlag(): void {
    this.uiForm.statusChanges.subscribe((value: any) => {
      if (this.uiForm.dirty === true) {
        this.routeAwayGlobals.setSaveEnabledFlag(true);
      } else {
        this.routeAwayGlobals.setSaveEnabledFlag(false);
      }
    });
  }

}

