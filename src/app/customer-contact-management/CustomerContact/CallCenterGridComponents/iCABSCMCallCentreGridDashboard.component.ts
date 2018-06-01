import { Component, NgZone, OnInit, OnDestroy, AfterViewInit, Renderer } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { HttpService } from '../../../../shared/services/http-service';
import { CallCenterActionTypes } from '../../../actions/call-centre-search';
import { ServiceConstants } from '../../../../shared/constants/service.constants';
import { GlobalConstant } from '../../../../shared/constants/global.constant';
import { Utils } from '../../../../shared/services/utility';

@Component({
  selector: 'icabs-call-center-grid-dashboard',
  templateUrl: 'iCABSCMCallCentreGridDashboard.html'
})

export class CallCenterGridDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  public formGroup: FormGroup;
  public fieldVisibility: any = {
    DashboardDrill: true
  };
  public queryCallCentre: URLSearchParams = new URLSearchParams();
  public queryParamsCallCenter: any = {
    action: '0',
    operation: 'ContactManagement/iCABSCMCallCentreGrid',
    module: 'call-centre',
    method: 'ccm/maintenance',
    contentType: 'application/x-www-form-urlencoded'
  };
  public dashboardArray: Array<any> = [];
  private storeSubscription: Subscription;
  private translateSubscription: Subscription;
  private httpSubscription: any;
  private storeData: any;
  constructor(
    private zone: NgZone,
    private fb: FormBuilder,
    private router: Router,
    private store: Store<any>,
    private httpService: HttpService,
    private utils: Utils,
    private serviceConstants: ServiceConstants,
    private renderer: Renderer
    ) {
        this.formGroup = this.fb.group({
          DashboardDrill: [{ value: 'none', disabled: false }]
        });
  }

  ngOnInit(): void {
    this.storeSubscription = this.store.select('callcentresearch').subscribe(data => {
        this.storeData = data;
        if (this.storeData['fieldVisibility'] && this.storeData['fieldVisibility'].tabDashboard) {
          this.fieldVisibility = this.storeData['fieldVisibility'].tabDashboard;
        }
        if (data && data['action']) {
          switch (data['action']) {
              case CallCenterActionTypes.BUILD_GRID:
              this.httpSubscription = this.fetchCallCentreDataPost('GetDashboardDetails', {}, { AccountNumber: this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'AccountNumber') , BusinessCode: this.storeData['code'].business }).subscribe((data) => {
                if (data['status'] === GlobalConstant.Configuration.Failure) {
                  this.store.dispatch({
                    type: CallCenterActionTypes.DISPLAY_ERROR, payload: data['oResponse']
                  });
                } else {
                  if (!data['errorMessage']) {
                    this.buildDashboardElements(data);
                  }
                }
              });
              break;

              case CallCenterActionTypes.BUILD_SPECIFIC_GRID:
              if (this.storeData['gridToBuild'].indexOf('Dashboard') > -1) {
                this.fetchCallCentreDataPost('GetDashboardDetails', {}, { AccountNumber: this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'AccountNumber') , BusinessCode: this.storeData['code'].business }).subscribe((data) => {
                  if (data['status'] === GlobalConstant.Configuration.Failure) {
                    this.store.dispatch({
                      type: CallCenterActionTypes.DISPLAY_ERROR, payload: data['oResponse']
                    });
                  } else {
                    if (!data['errorMessage']) {
                      this.buildDashboardElements(data);
                    }
                  }
                });
              }
              break;
              default:
              break;
          }
      }
    });
  }

  ngAfterViewInit(): void {
    this.store.dispatch({
        type: CallCenterActionTypes.FORM_GROUP, payload: {
            tabDashboard: this.formGroup
        }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.INITIALIZATION, payload: {
        tabDashboard: true
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_VISIBILITY_FIELD, payload: {
        tabDashboard: this.fieldVisibility
      }
    });

  }

  ngOnDestroy(): void {
    if (this.storeSubscription)
        this.storeSubscription.unsubscribe();
    if (this.translateSubscription)
        this.translateSubscription.unsubscribe();
    if (this.httpSubscription) {
        this.httpSubscription.unsubscribe();
    }
  }

  private buildDashboardElements(data: any): void {
    let dashboardArray = [];
    let counter = 0;
    this.dashboardArray = [];
    for (let prop in data) {
      if (data.hasOwnProperty(prop)) {
        counter++;
        let splitArray = data[prop].split('|');
        dashboardArray.push({
          label: splitArray[0],
          value: splitArray[1],
          backgroundColor: splitArray[2]
        });
        if (counter === 3) {
          counter = 0;
          this.dashboardArray.push(dashboardArray);
          dashboardArray = [];
        }
      }
    }
  }

  public dashboardDrillOnChange(event: any): void {
    switch (this.formGroup.controls['DashboardDrill'].value) {
      case 'open':
         this.autoRefineLogsTab('OpenOnly');
         break;

      case 'openoverdue':
         this.autoRefineLogsTab('openoverdue');
         break;

      case 'opencallouts':
         this.autoRefineLogsTab('opencallouts');
         break;

      case 'opencomplaints':
         this.autoRefineLogsTab('opencomplaints');
         break;

      case 'closed31days':
         this.autoRefineLogsTab('closed31days');
         break;

      case 'workorderoverdue':
         this.autoRefineWOTab('overdue');
         break;

      default:
        // code...
        break;
    }
    this.formGroup.controls['DashboardDrill'].setValue('none');
  }

  public fetchCallCentreDataPost(functionName: string, params: Object, formData: Object): any {
    this.queryCallCentre = new URLSearchParams();
    let businessCode = (this.storeData['code'] && this.storeData['code'].business) ? this.storeData['code'].business : this.utils.getBusinessCode();
    let countryCode = (this.storeData['code'] && this.storeData['code'].country) ? this.storeData['code'].country : this.utils.getCountryCode();
    this.queryCallCentre.set(this.serviceConstants.BusinessCode, businessCode);
    this.queryCallCentre.set(this.serviceConstants.CountryCode, countryCode);
    if (functionName !== '') {
      this.queryCallCentre.set(this.serviceConstants.Action, '6');
      this.queryCallCentre.set('Function', functionName);
    }
    for (let key in params) {
      if (key) {
        this.queryCallCentre.set(key, params[key]);
      }
    }
    return this.httpService.makePostRequest(this.queryParamsCallCenter.method, this.queryParamsCallCenter.module, this.queryParamsCallCenter.operation, this.queryCallCentre, formData);
  }

  public autoRefineLogsTab(value: string): void {
    this.storeData['formGroup'].tabLogs.controls['CallLogSearchOn'].setValue(value);
    let click = new CustomEvent('click', { bubbles: true });
    this.renderer.invokeElementMethod(document.querySelector('#tabCont .nav-tabs li:nth-child(6) a'), 'dispatchEvent', [click]);
  }

  public autoRefineWOTab(value: string): void {
    this.storeData['formGroup'].tabWorkOrders.controls['WorkOrderType'].setValue(value);
    let click = new CustomEvent('click', { bubbles: true });
    this.renderer.invokeElementMethod(document.querySelector('#tabCont .nav-tabs li:nth-child(8) a'), 'dispatchEvent', [click]);
  }
}
