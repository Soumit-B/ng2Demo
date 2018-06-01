import { Injector } from '@angular/core';
import { AjaxObservableConstant } from './../constants/ajax-observable.constant';
import { FormGroup } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Logger } from '@nsalaun/ng2-logger';

import { RiExchange } from './riExchange';
import { LookUp } from './lookup';
import { HttpService } from './http-service';
import { Utils } from './utility';
import { ServiceConstants } from '../constants/service.constants';
import { GlobalizeService } from './globalize.service';

export class MntConst {
    public static readonly eKeyStateNormal: string = 'eKeyStateNormal';
    public static readonly eKeyStateFixed: string = 'eKeyStateFixed';
    public static readonly eKeyOptionNormal: string = 'eKeyOptionNormal';
    public static readonly eKeyOptionSearch: string = 'eKeyOptionSearch';
    public static readonly eKeyOptionRequired: string = 'eKeyOptionRequired';
    public static readonly eKeyStateReadOnly: string = 'eKeyStateReadOnly';

    public static readonly eAlignmentRight: string = 'eAlignmentRight';
    public static readonly eAlignmentLeft: string = 'eAlignmentLeft';
    public static readonly eAlignmentCenter: string = 'eAlignmentCenter';

    public static readonly eTypeCode: string = 'eTypeCode';
    public static readonly eTypeText: string = 'eTypeText';
    public static readonly eTypeTextFree: string = 'eTypeTextFree';
    public static readonly eTypeInteger: string = 'eTypeInteger';
    public static readonly eTypeDecimal1: string = 'eTypeDecimal1';
    public static readonly eTypeDecimal2: string = 'eTypeDecimal2';
    public static readonly eTypeDecimal3: string = 'eTypeDecimal3';
    public static readonly eTypeDecimal4: string = 'eTypeDecimal4';
    public static readonly eTypeDecimal5: string = 'eTypeDecimal5';
    public static readonly eTypeDecimal6: string = 'eTypeDecimal6';
    public static readonly eTypeCodeNumeric: string = 'eTypeCodeNumeric';
    public static readonly eTypeAutoNumber: string = 'eTypeAutoNumber';
    public static readonly eTypeCurrency: string = 'eTypeCurrency';
    public static readonly eTypeDate: string = 'eTypeDate';
    public static readonly eTypeDateText: string = 'eTypeDateText';
    public static readonly eTypeDateNow: string = 'eTypeDateNow';
    public static readonly eTypeTime: string = 'eTypeTime';
    public static readonly eTypeTimeText: string = 'eTypeTimeText';
    public static readonly eTypeTimeNow: string = 'eTypeTimeNow';
    public static readonly eTypeHours: string = 'eTypeHours';
    public static readonly eTypeMinutes: string = 'eTypeMinutes';
    public static readonly eTypeCodeNumericAutoNumber: string = 'eTypeCodeNumericAutoNumber';
    public static readonly eTypeEMail: string = 'eTypeEMail';
    public static readonly eTypeImage: string = 'eTypeImage';
    public static readonly eTypeButton: string = 'eTypeButton';
    public static readonly eTypeCheckBox: string = 'eTypeCheckBox';
    public static readonly eVirtualJoinTypeInner: string = 'eVirtualJoinTypeInner';
    public static readonly eTypeEllipsis: string = 'eTypeEllipsis';
    public static readonly eTypeDropdown: string = 'eTypeDropdown';
    public static readonly eTypeUnknown: string = 'eTypeUnknown';

    public static readonly eFieldStateNormal: string = 'eFieldStateNormal';
    public static readonly eFieldStateFixed: string = 'eFieldStateFixed';
    public static readonly eFieldOptionNormal: string = 'eFieldOptionNormal';
    public static readonly eFieldOptionRequired: string = 'eFieldOptionRequired';
    public static readonly eFieldOptionRequried: string = 'eFieldOptionRequired'; //??

    public static readonly eFieldStateReadOnly: string = 'eFieldStateReadOnly';
    public static readonly eFieldStateRequired: string = 'eFieldStateRequired';

    public static readonly eVirtualKeyStateFixed: string = 'eVirtualKeyStateFixed';
    public static readonly eVirtualKeyStateNormal: string = 'eVirtualKeyStateNormal';
    public static readonly eVirtualKeyStateReadOnly: string = 'eVirtualKeyStateReadOnly';
    public static readonly eVirtualKeyStateRequired: string = 'eVirtualKeyStateRequired';

    public static readonly eVirtualFieldStateFixed: string = 'eVirtualFieldStateFixed';
    public static readonly eVirtualFieldStateNormal: string = 'eVirtualFieldStateNormal';
    public static readonly eVirtualFieldStateReadOnly: string = 'eVirtualFieldStateReadOnly';

    public static readonly eModeUpdate: string = 'eModeUpdate';
    public static readonly eNormalMode: string = 'eNormalMode'; //?
    public static readonly eModeNormal: string = 'eModeNormal';
    public static readonly eModeAdd: string = 'eModeAdd';
    public static readonly eModeSave: string = 'eModeSave';
    public static readonly eModeSaveUpdate: string = 'eModeSaveUpdate';
    public static readonly eModeSaveAdd: string = 'eModeSaveAdd';
    public static readonly eModeCancel: string = 'eModeCancel';
    public static readonly eModeSelect: string = 'eModeSelect';
    public static readonly eModeDelete: string = 'eModeDelete';
    public static readonly eModeFetch: string = 'eModeFetch';
    public static readonly eModeCustom: string = 'eModeCustom';

    //Methods
    public static readonly _GET: string = 'GET';
    public static readonly _POST: string = 'POST';
    //Types
    public static readonly _FN: string = 'FUNCTION';
    public static readonly _TABLE: string = 'TABLE';
    public static readonly _VTABLE: string = 'LOOKUP';
    public static readonly _VTABLEJOION: string = 'LOOKUPJOIN';
    public static readonly _CBO: string = 'CBO'; //CustomBusinessObject
    public static readonly _PDA: string = 'PDA'; //PostDataAdd
    //Status
    public static readonly _INIT: string = 'INIT';
    public static readonly _WIP: string = 'WIP';
    public static readonly _DONE: string = 'SUCCESS';
    public static readonly _FAIL: string = 'ERROR';
}

export class RiMaintenance {
    public BusinessObject: string = '';
    public CustomBusinessObject: string = '';
    public CustomBusinessObjectAdditionalPostData: string = '';
    //Refer to the buttons in the pages
    public CustomBusinessObjectSelect: boolean = false;
    public CustomBusinessObjectConfirm: boolean = false;
    public CustomBusinessObjectInsert: boolean = false;
    public CustomBusinessObjectUpdate: boolean = false;
    public CustomBusinessObjectDelete: boolean = false;
    public CustomBusinessObjectDeleteEx: boolean = false;

    public ButtonCaptionAdd: string = '';
    public ButtonCaptionSelect: string = '';
    public ButtonCaptionUpdate: string = '';
    public ButtonCaptionDelete: string = '';
    public ButtonCaptionSearch: string = '';
    public ButtonCaptionSave: string = '';
    public ButtonCaptionFetch: string = '';
    public ButtonCaptionAbandon: string = '';
    public ButtonCaptionSnapshot: string = '';

    public Enabled: boolean = false;
    public StillExecuting: boolean = false;
    public StillExecutingCBORequest: boolean = false;

    public CurrentMode: string = '';

    public DisplayMessages: boolean = false;
    public FunctionAdd: boolean = false;
    public FunctionSelect: boolean = false;
    public FunctionUpdate: boolean = false;
    public FunctionDelete: boolean = false;
    public FunctionSearch: boolean = false;
    public FunctionSnapShot: boolean = false;
    public CancelEvent: boolean = false;
    public SearchRequired: boolean = false;
    public SelectFunctionalityEx: boolean = false;
    public SuppressErrorMessage: boolean = false;
    public RequestWindowClose: boolean = false;

    public event_list = {
        event_category: [
            { //Search
                name: 'Search',
                event: {
                    order: 1,
                    name: 'Search',
                    desc: 'If the search button is pressed then this event is run after basic field validation is performed.'
                }
            },
            { //SnapShot
                name: 'SnapShot',
                event: [
                    {
                        order: 1,
                        name: 'BeforeSnapShot',
                        desc: 'If the user presses the snapshot button then if a record is currently selected this event is run.'
                    },
                    {
                        order: 2,
                        name: 'SnapShot',
                        desc: 'After the BeforeSnapShot even has run if CancelEvent has not been set then this event will be executed.'
                    }
                ]
            },
            { //Update Mode
                name: 'Update Mode',
                desc: 'When the user presses the update key the following events are fired.',
                event: [
                    {
                        order: 1,
                        name: 'BeforeMode'
                    },
                    {
                        order: 2,
                        name: 'BeforeUpdate'
                    },
                    {
                        order: 3,
                        name: 'CBORequest'
                    },
                    {
                        order: 4,
                        name: 'BeforeUpdateMode'
                    }
                ]
            },
            { //Save Record (Update)
                name: 'Save Record (Update)',
                desc: 'This save event sequence can be stopped at any stage by setting the CancelEvent variable on the maintenance control to true.',
                event: [
                    {
                        order: 1,
                        name: 'SaveRecord',
                        desc: 'This save event sequence can be stopped at any stage by setting the CancelEvent variable on the maintenance control to true.'
                    },
                    {
                        order: 2,
                        name: 'BeforeSave',
                        desc: 'After buttons are disabled this event is fired.'
                    },
                    {
                        order: 3,
                        name: 'BeforeSaveUpdate',
                        desc: 'This event is fired directly after the BeforeSave event (if the event sequence hasn\t been cancelled).'
                    },
                    {
                        order: 4,
                        name: 'BeforeConfirm',
                        desc: 'This event takes place after screen validation but before save confirmation dialog '
                    },
                    {
                        order: 5,
                        name: 'AfterConfirm'
                    },
                    {
                        order: 6,
                        name: 'BeforeEvent'
                    },
                    {
                        order: 7,
                        name: 'AfterSave'
                    },
                    {
                        order: 8,
                        name: 'AfterSaveUpdate'
                    },
                    {
                        order: 9,
                        name: 'AfterEvent'
                    },
                    {
                        order: 10,
                        name: 'AfterNormalAfterSave'
                    },
                    {
                        order: 11,
                        name: 'AfterNormalAfterSaveUpdate'
                    }
                ]
            },
            { //Update Abandon Click
                name: 'Update Abandon Click',
                event: [
                    {
                        order: 1,
                        name: 'BeforeAbandon'
                    },
                    {
                        order: 2,
                        name: 'BeforeAbandonAdd'
                    },
                    {
                        order: 3,
                        name: 'BeforeAbandonUpdate'
                    },
                    {
                        order: 4,
                        name: 'BeforeAbandonSelect'
                    },
                    {
                        order: 5,
                        name: 'AfterAbandon'
                    },
                    {
                        order: 6,
                        name: 'AfterAbandonAdd'
                    },
                    {
                        order: 7,
                        name: 'AfterAbandonUpdate'
                    },
                    {
                        order: 8,
                        name: 'AfterAbandonSelect'
                    }
                ]
            },
            { //Delete Click
                name: 'Delete Click',
                event: [
                    {
                        order: 1,
                        name: 'BeforeMode'
                    },
                    {
                        order: 2,
                        name: 'BeforeDelete'
                    },
                    {
                        order: 3,
                        name: 'BeforeDeleteMode'
                    },
                    {
                        order: 4,
                        name: 'BeforeEvent'
                    },
                    {
                        order: 5,
                        name: 'AfterDelete'
                    },
                    {
                        order: 6,
                        name: 'AfterEvent'
                    }
                ]
            },
            { //Normal Mode
                name: 'Normal Mode',
                event: [
                    {
                        order: 1,
                        name: 'BeforeMode'
                    },
                    {
                        order: 2,
                        name: 'BeforeNormal'
                    },
                    {
                        order: 3,
                        name: 'BeforeNormalMode'
                    },
                    {
                        order: 4,
                        name: 'AfterNormalMode'
                    }
                ]
            },
            { //Select Mode
                name: 'Select Mode',
                event: [
                    {
                        order: 1,
                        name: 'BeforeMode'
                    },
                    {
                        order: 2,
                        name: 'BeforeSelect'
                    },
                    {
                        order: 3,
                        name: 'BeforeSelectMode'
                    }
                ]
            },
            { //Add Mode
                name: 'Add Mode',
                event: [
                    {
                        order: 1,
                        name: 'BeforeMode'
                    },
                    {
                        order: 2,
                        name: 'BeforeAdd'
                    },
                    {
                        order: 3,
                        name: 'BeforeAddMode'
                    }
                ]
            },
            { //Save Record (Add)
                name: 'Save Record (Add)',
                event: [
                    {
                        order: 1,
                        name: 'BeforeSave'
                    },
                    {
                        order: 2,
                        name: 'BeforeSaveAdd'
                    },
                    {
                        order: 3,
                        name: 'BeforeConfirm'
                    },
                    {
                        order: 4,
                        name: 'AfterConfirm'
                    },
                    {
                        order: 5,
                        name: 'BeforeEvent'
                    },
                    {
                        order: 6,
                        name: 'AfterSave'
                    },
                    {
                        order: 7,
                        name: 'AfterSaveAdd'
                    },
                    {
                        order: 8,
                        name: 'AfterEvent'
                    },
                    {
                        order: 9,
                        name: 'AfterNormalAfterSave'
                    },
                    {
                        order: 10,
                        name: 'AfterNormalAfterSaveAdd'
                    }
                ]
            },
            { //Fetch Record
                name: 'Fetch Record',
                event: [
                    {
                        order: 1,
                        name: 'BeforeFetch'
                    },
                    {
                        order: 2,
                        name: 'BeforeEvent'
                    },
                    {
                        order: 3,
                        name: 'AfterFetch'
                    },
                    {
                        order: 4,
                        name: 'AfterEvent'
                    }
                ]
            },
            { //Confirm Prompt
                name: 'Confirm Prompt',
                event: [
                    {
                        order: 1,
                        name: 'BeforeConfirmPrompt'
                    },
                    {
                        order: 2,
                        name: 'AfterConfirmPrompt'
                    }
                ]
            }
        ]
    };

    public grdPremiseMaintenanceControl = true;

    public uiForm: FormGroup;
    public riExchange: RiExchange;

    constructor(
        private logger: Logger,
        private xhr: HttpService,
        private LookUp: LookUp,
        private utils: Utils,
        private serviceConstants: ServiceConstants,
        private globalize: GlobalizeService
    ) { }

    /** ******************************************************************************************************************* */

    /** Returns index for the RI mode passed as string */
    public getEventIndex(mode: string): number {
        let index = -1;
        for (let i = 0; i < this.event_list.event_category.length; i++) {
            if (this.event_list.event_category[i].name === mode) index = i;
        }
        return index;
    }
    /** Returns the function list that needs to be executed in order for the Mode/index passed */
    public getEvents(modeIndex: number): any {
        let eventsArr: any = this.event_list.event_category[modeIndex].event;
        eventsArr = eventsArr.sort(function (a: any, b: any): any { return a.order - b.order; }); //Sort if not ordered
        let eventFn = [];
        for (let i = 0; i < eventsArr.length; i++) {
            if (eventsArr[i].name === 'CBORequest')
                eventFn.push('riExchange_' + eventsArr[i].name);
            else
                eventFn.push('riMaintenance_' + eventsArr[i].name);
        }
        return eventFn;
    }

    /** ******************************************************************************************************************* */

    public AddMode(): any { this.CurrentMode = MntConst.eModeAdd; }
    public DeleteMode(): any { this.CurrentMode = MntConst.eModeDelete; }
    public FetchRecord(): any { /*TODO*/ }
    public UpdateMode(): any { this.CurrentMode = MntConst.eModeUpdate; }
    public SelectMode(): any { this.CurrentMode = MntConst.eModeSave; }
    public RecordSelected(param?: boolean): boolean { /*TODO*/ return true; }
    public Complete(): any { /*TODO*/ }

    //TODO
    public EnableInput(fieldName: string): any { this.riExchange.riInputElement.Enable(this.uiForm, fieldName); }
    public DisableInput(fieldName: string): any {
        //this.logger.log('TODO DisableInput', this, fieldName, 'If Datepicker - update control field');
        this.riExchange.riInputElement.Disable(this.uiForm, fieldName);
    }
    public SetRequiredStatus(fieldName: string, status: boolean): any {
        //this.logger.log('TODO DisableInput', this, fieldName, 'If Datepicker - update control field');
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, fieldName, status);
    }
    public SetErrorStatus(fieldName: string, status: boolean): any {
        //this.logger.log('TODO DisableInput', this, fieldName, 'If Datepicker - update control field');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, fieldName, status);
    }
    public RowID(obj: any, id: string, value: any): any { obj.riExchange.riInputElement.SetValue(obj.uiForm, id, value); }
    public GetRowID(id: string): string { return this.riExchange.riInputElement.GetValue(this.uiForm, id); }

    /** ******************************************************************************************************************* */

    public Q = [];
    public clearQ(): void { this.Q.length = 0; /*this.logger.log('Process Q CLEARED');*/ this.processingFlag = false; }
    public genQ(fnName: string, type: string, method: string, headersArr: any, queryArr: any, bodyArr: any,
        respParamsArr: any, callBk: any, callBkRef: any, action: number): any {
        return {
            name: fnName,
            type: type,
            method: method,
            header: headersArr,
            query: queryArr,
            body: bodyArr,
            respParams: respParamsArr,
            callBk: callBk,
            callBkRef: callBkRef,
            status: MntConst._INIT,
            index: this.Q.length,
            action: action
        };
    }

    /** Deprecated - Sets current RI mode based on the inputs passed and also updates the Q with implemented function in order with reference object  */
    public detectMode(FormGrp: FormGroup, fieldName: [string], obj: [any]): void {
        //New Addition/implementation for Save/Cancel
        let fnNames = [];
        fnNames.push('showSpinner');
        let flag = [];
        for (let i = 0; i < fieldName.length; i++) {
            if (this.riExchange.riInputElement.GetValue(FormGrp, fieldName[i]).trim() === '')
                flag.push(true);
            else
                flag.push(false);
        }
        let flag_primary = flag.shift();
        let flag_secondary = flag.reduce(function (acc: boolean, val: boolean): boolean { return acc && val; }, true);
        if (flag_primary) {
            this.CurrentMode = MntConst.eModeAdd;
            fnNames = fnNames.concat(this.getEvents(this.getEventIndex('Add Mode'))); //Add > Save*
        } else if (flag_secondary) {
            this.CurrentMode = MntConst.eModeAdd;
            fnNames = fnNames.concat(this.getEvents(this.getEventIndex('Add Mode')));
        } else {
            this.CurrentMode = MntConst.eModeUpdate;
            fnNames = fnNames.concat(this.getEvents(this.getEventIndex('Fetch Record'))); //Fetch > Update > Save*
            fnNames = fnNames.concat(this.getEvents(this.getEventIndex('Update Mode')));
        }
        fnNames.push('hideSpinner');

        for (let i = 0; i < fnNames.length; i++) {
            let fnname = fnNames[i];
            for (let j = 0; j < obj.length; j++) {
                if (typeof obj[j][fnname] === 'function') { //Check if the function is implemented
                    //Push to Q for later execution
                    this.Q.push(this.genQ(fnname, MntConst._FN, '', [], [], [], [], j, obj[j], 0));
                    this.processQ(obj[j]);
                }
            }
        }
    }

    public postConfirmFunc = [];
    public execMode(mode: string, obj: [any], seq?: [any]): void {
        let fnNames = [];
        fnNames.push('showSpinner');
        switch (mode) {
            case MntConst.eModeAdd:
                fnNames = fnNames.concat(this.getEvents(this.getEventIndex('Add Mode'))); //Add > Save*
                break;
            case MntConst.eModeUpdate:
                fnNames = fnNames.concat(this.getEvents(this.getEventIndex('Fetch Record'))); //Fetch > Update > Save*
                fnNames = fnNames.concat(this.getEvents(this.getEventIndex('Update Mode')));
                break;
            case MntConst.eModeSaveUpdate:
                fnNames = this.getEvents(this.getEventIndex('Save Record (Update)'));
                this.CurrentMode = MntConst.eModeSave;
                break;
            case MntConst.eModeSaveAdd:
                fnNames = this.getEvents(this.getEventIndex('Save Record (Add)'));
                this.CurrentMode = MntConst.eModeSave;
                break;
            case MntConst.eModeDelete:
                fnNames = this.getEvents(this.getEventIndex('Delete Click'));
                this.CurrentMode = MntConst.eModeDelete;
                break;
            case MntConst.eModeFetch:
                fnNames = fnNames.concat(this.getEvents(this.getEventIndex('Fetch Record'))); //Fetch > Update > Save*
                break;
            case MntConst.eModeSelect:
                fnNames = fnNames.concat(this.getEvents(this.getEventIndex('Select Mode'))); //Seecte*
                break;
            case MntConst.eModeCustom:
                fnNames = fnNames.concat(seq); //custom
                break;
        }

        fnNames.push('hideSpinner');
        this.CurrentMode = mode;
        this.processingFlag = false;

        //Add Confirm Modal popup
        this.postConfirmFunc = [];
        if (this.CurrentMode === MntConst.eModeSaveUpdate || //Update
            this.CurrentMode === MntConst.eModeSaveAdd || //Add
            this.CurrentMode === MntConst.eModeDelete //Delete
        ) {
            this.postConfirmFunc = fnNames.splice(fnNames.indexOf('riMaintenance_BeforeEvent') + 1,
                fnNames.length - fnNames.indexOf('riMaintenance_BeforeEvent'), 'hideSpinner', 'confirm');
            fnNames.splice(0, 0, 'showSpinner');
            this.postConfirmFunc.splice(0, 0, 'showSpinner');
        }
        // this.logger.log('RiMaintenance Mode:', this.CurrentMode, fnNames, this.postConfirmFunc);

        for (let i = 0; i < fnNames.length; i++) {
            let fnname = fnNames[i];
            for (let j = 0; j < obj.length; j++) {
                if (typeof obj[j][fnname] === 'function') { //Check if the function is implemented
                    // this.logger.log('Function Name A:', fnname);
                    //Push to Q for later execution
                    this.Q.push(this.genQ(fnname, MntConst._FN, '', [], [], [], [], '', obj[j], 0));
                    this.processQ(obj[j]);
                }
            }
        }
    }

    public execContinue(mode: string, obj: [any]): any {
        // this.logger.log('Post Confirm Function Name:', this.postConfirmFunc);
        for (let i = 0; i < this.postConfirmFunc.length; i++) {
            let fnname = this.postConfirmFunc[i];
            for (let j = 0; j < obj.length; j++) {
                if (typeof obj[j][fnname] === 'function') { //Check if the function is implemented
                    // this.logger.log('Function Name B:', fnname);
                    //Push to Q for later execution
                    this.Q.push(this.genQ(fnname, MntConst._FN, '', [], [], [], [], '', obj[j], 0));
                    this.processQ(obj[j]);
                }
            }
        }
    }

    //PostDataAdd
    public reqPostDataAddXhr = { method: 'GET', header: [], query: [], body: [], respParam: [] };
    public clear(): any {
        this.reqPostDataAddXhr.method = 'GET';
        this.reqPostDataAddXhr.header.length = 0;
        this.reqPostDataAddXhr.query.length = 0;
        this.reqPostDataAddXhr.body.length = 0;
        this.reqPostDataAddXhr.respParam.length = 0;
    };
    public PostDataAdd(fieldKey: string, fieldValue: any, type: any): any { this.reqPostDataAddXhr.query.push({ key: fieldKey, value: fieldValue, datatype: type }); };
    public ReturnDataAdd(fieldName: string, type: any): any { this.reqPostDataAddXhr.respParam.push({ key: fieldName, datatype: type }); };
    public Execute(obj: any, callback: any, method?: string, action?: number): any {
        let reqMethod = MntConst._GET;
        if (typeof method !== 'undefined') {
            if (method.toUpperCase() === MntConst._POST)
                reqMethod = MntConst._POST;
            else
                reqMethod = MntConst._GET;
        }
        let actionPassed = 6;
        if (typeof action !== 'undefined') {
            actionPassed = action;
        }
        let pda = this.genQ(
                /* Name */ this.BusinessObject,
                /* Type */ MntConst._PDA,
                /* Method */ reqMethod,
                /* Header */ this.reqPostDataAddXhr.header,
                /* Query */ this.reqPostDataAddXhr.query,
                /* Body */[],
                /* Resp Params */ this.reqPostDataAddXhr.respParam,
                /* Callback */ callback,
                /* Callback Ref */ obj,
                /* Action */ actionPassed
        );
        this.Q.push(pda);
        this.reqPostDataAddXhr.header = [];
        this.reqPostDataAddXhr.query = [];
        this.reqPostDataAddXhr.respParam = [];
        this.processQ(obj);
    };

    //Custom Business Object
    private cboObj = { name: '', method: 'POST', query: [], body: [], callback: '' };
    public CBORequestClear(): void {
        this.cboObj.name = '';
        this.cboObj.method = 'POST';
        this.cboObj.query = [];
        this.cboObj.body = [];
        this.cboObj.callback = '';
    }
    public CBORequestAddCS(name: string, type: string): any { this.cboObj.query.push(name); }
    public CBORequestAdd(name: string): any { this.cboObj.body.push(name); }
    public CBORequestExecute(obj: any, callback: any): any {
        let cbo = this.genQ(
                /* Name */ this.CustomBusinessObjectAdditionalPostData,
                /* Type */ MntConst._CBO,
                /* Method */ MntConst._POST,
                /* Header */[],
                /* Query */ this.cboObj.query,
                /* Body */ this.cboObj.body,
                /* Resp Params */[],
                /* Callback */ callback,
                /* Callback Ref */ obj,
                /* Action */ 6
        );
        //this.logger.log('CBO data passed', cbo, obj);
        this.Q.push(cbo);
        this.cboObj = { name: '', method: MntConst._POST, query: [], body: [], callback: '' }; //Reset the fields
        this.processQ(obj);
    }

    //Table - Service Call
    private mntObj = {
        table: '',
        keyFields: [],
        outputFields: {},
        status: MntConst._INIT,
        type: MntConst._TABLE,
        xhrType: MntConst._GET
    };
    public prevRespData: any = '';
    public AddTable(tableName: string): void {
        this.mntObj.table = tableName;
        this.mntObj.keyFields = [];
        this.mntObj.outputFields = {};
    }
    public AddTableKeyCS(fieldName: string, type?: string): void { this.mntObj.keyFields.push(fieldName); }
    public AddTableKey(fieldName: string, type?: string, param1?: string, param2?: string, param3?: string): void { this.mntObj.keyFields.push(fieldName); }
    public AddTableKeyAlignment(fieldName: string, alignment: string): void { if (this.mntObj.outputFields[fieldName]) this.mntObj.outputFields[fieldName]['align'] = alignment; }
    public AddTableField(fieldName: string, type: string, param: string, state: string, paramType: string, param1?: string, param2?: string): void {
        this.mntObj.outputFields[fieldName] = { type: type, optParam: param, state: state, paramType: paramType };

    }
    public AddTableFieldAlignment(fieldName: string, alignment: string): void { this.mntObj.outputFields[fieldName]['align'] = alignment; }
    public AddTableFieldPostData(fieldName: string, postData: boolean): void { this.mntObj.outputFields[fieldName]['postData'] = postData; }
    public AddTableCommit(obj: any, callback?: any, mode?: string): any {
        for (let id in this.mntObj.outputFields) {
            if (id !== '') {
                //this.logger.log('---AddTableCommit', id, this.mntObj.outputFields[id].paramType, this.mntObj.outputFields[id].type, obj);
                if (this.mntObj.outputFields[id].paramType === 'Required') {
                    this.riExchange.updateCtrl(obj.controls, id, 'required', true);
                    this.riExchange.riInputElement.SetRequiredStatus(obj.uiForm, id, true);
                }
                if (this.mntObj.outputFields[id].optParam === 'eFieldOptionRequired') {
                    this.riExchange.updateCtrl(obj.controls, id, 'required', true);
                    this.riExchange.riInputElement.SetRequiredStatus(obj.uiForm, id, true);
                }
                if (this.mntObj.outputFields[id].paramType === 'ReadOnly') {
                    //this.riExchange.updateCtrl(obj.controls, id, 'readonly', true);
                    this.riExchange.updateCtrl(obj.controls, id, 'disabled', true);
                    //this.riExchange.riInputElement.ReadOnly(obj.uiForm, id, true);
                    this.riExchange.riInputElement.Disable(obj.uiForm, id);
                }
                if (this.mntObj.outputFields[id].state === 'eFieldStateReadOnly') {
                    //this.riExchange.updateCtrl(obj.controls, id, 'readonly', true);
                    this.riExchange.updateCtrl(obj.controls, id, 'disabled', true);
                    //this.riExchange.riInputElement.ReadOnly(obj.uiForm, id, true);
                    this.riExchange.riInputElement.Disable(obj.uiForm, id);
                }
                this.riExchange.updateCtrl(obj.controls, id, 'type', this.mntObj.outputFields[id].type);
            }
        }

        let table = this.genQ(
                /* Name */ this.mntObj.table,
                /* Type */ MntConst._TABLE,
                /* Method */(mode) ? mode : MntConst._GET,
                /* Header */[],
                /* Query */ this.mntObj.keyFields,
                /* Body */[],
                /* Resp Params */ this.mntObj.outputFields,
                /* Callback */ callback,
                /* Callback Ref */ obj,
                /* Action */ 0
        );

        switch (this.CurrentMode) {
            case MntConst.eModeUpdate:
                this.Q.push(table);
                this.processQ(obj);
                break;
            default:
                if (callback) callback.call(obj);
        }
    }

    //Virtual Table - Lookup
    public virtualTableObj = {
        table: '',
        keyFields: [],
        outputFields: []
    };
    public AddVirtualTable(tableName: string, alias?: any): void {
        this.virtualTableObj.table = tableName;
        this.virtualTableObj.keyFields = [];
        this.virtualTableObj.outputFields = [];
    }
    public AddVirtualTableKeyCS(fieldName: string, type?: string): void { this.virtualTableObj.keyFields.push(fieldName); }
    public AddVirtualTableKey(fieldName: string, type?: string, state?: string, paramA?: any, paramB?: any, paramC?: any, paramD?: any): void {
        let key = fieldName;
        if (typeof paramC !== 'undefined') {
            key = (paramC === '') ? fieldName : fieldName + '#' + paramC;
        }
        if (typeof paramB !== 'undefined') {
            key = (paramB !== '') ? fieldName + '$' + paramB : key;
        }
        this.virtualTableObj.keyFields.push(key);
    }
    public AddVirtualTableField(fieldName: string, type?: string, state?: any, param?: any, paramA?: any): void {
        let key = fieldName;
        if (typeof paramA !== 'undefined') {
            key = (paramA === '') ? fieldName : fieldName + '^' + paramA;
        }
        this.virtualTableObj.outputFields.push(key);
    }
    public AddVirtualTableCommit(obj: any, callback?: any): void {
        let vtable = this.genQ(
                /* Name */ this.virtualTableObj.table,
                /* Type */ MntConst._VTABLE,
                /* Method */ MntConst._POST,
                /* Header */[],
                /* Query */ this.virtualTableObj.keyFields,
                /* Body */[],
                /* Resp Params */ this.virtualTableObj.outputFields,
                /* Callback */ callback,
                /* Callback Ref */ obj,
                /* Action */ 0
        );
        if (this.joinedTable) {
            vtable.type = MntConst._VTABLEJOION;
        }
        this.Q.push(vtable);
        if (this.joinedTable) {
            this.Q.push(this.joinedTable);
            this.joinedTable = null;
        }
        this.processQ(obj);
    }

    //For vitual table join
    //Virtual Table - Lookup
    public joinedTable: any;
    public virtualTableJoinObj = {
        table: '',
        keyFields: [],
        outputFields: []
    };
    public AddVirtualJoin(tableName: string, state: any, query: string): void {
        this.virtualTableJoinObj.table = tableName;
        this.virtualTableJoinObj.keyFields = [];
        this.virtualTableJoinObj.outputFields = [];
        //Extract fields
        let queryStringArray: Array<string> = query.split(' AND ');
        if (queryStringArray.length === 1) {
            queryStringArray = query.split(' and ');
        }
        if (queryStringArray.length === 1) {
            queryStringArray = query.split(' And ');
        }
        for (let i = 0; i < queryStringArray.length; i++) {
            let q = queryStringArray[i].trim().split('=')[0];
            let field = q.trim().split('.')[1].trim();
            if (field) {
                this.virtualTableJoinObj.keyFields.push(field);
            }
        }
    }
    public AddVirtualJoinField(fieldName: string, type?: string, state?: any, param?: any, paramA?: any): void {
        let key = fieldName;
        if (typeof paramA !== 'undefined') {
            key = (paramA === '') ? fieldName : paramA;
        }
        this.virtualTableJoinObj.outputFields.push(key);
    }
    public AddVirtualJoinCommit(obj: any): void {
        this.joinedTable = this.genQ(
                /* Name */ this.virtualTableJoinObj.table,
                /* Type */ MntConst._VTABLE,
                /* Method */ MntConst._POST,
                /* Header */[],
                /* Query */ this.virtualTableJoinObj.keyFields,
                /* Body */[],
                /* Resp Params */ this.virtualTableJoinObj.outputFields,
                /* Callback */ '',
                /* Callback Ref */ obj,
                /* Action */ 0
        );
    }

    public isModalOpen = false;
    public processingFlag = false;
    private starTableExecuted = -1;
    private startLookUpExec = false;
    public setIndependentVTableLookup(data: boolean): void {
        if (data) {
            this.startLookUpExec = data;
        } else {
            this.startLookUpExec = false;
        }
    }
    public flagXhrProcessing = false;
    private processingQindex = 0;
    public processQ(obj: any): void {
        //this.logger.log('processQ', this.Q.length, this.Q[this.Q.length - 1].name, this.Q[this.Q.length - 1].type, this.Q[this.Q.length - 1], obj);
        let index = -1;
        for (let i = 0; i < this.Q.length; i++) {
            if (this.Q[i].status === MntConst._INIT && !this.processingFlag) {
                index = i;
                break;
            }
        }
        //this.logger.log('processQ start', index, this.Q);

        if (index > -1) {
            //Process Q
            this.processingFlag = true;
            if (obj.ajaxSource) {
                obj.ajaxSource.next('START');
            }
            //this.logger.log('processQ Processing', this.Q[index].name, this.Q[index].type, this.Q[index], obj);
            //this.logger.log('processQ Processing', this.Q[index].name, this.Q[index].type);

            this.processingQindex = index;
            this.Q[index].status = MntConst._WIP;
            let name = this.Q[index].name;
            let action = this.Q[index].action.toString();
            let method = this.Q[index].method;
            let header = this.Q[index].header;
            let query = this.Q[index].query;
            let respParams = this.Q[index].respParams;
            let body = this.Q[index].body;
            let callback = this.Q[index].callBk;
            //let callbackRef = obj; //this.Q[index].callBkRef;
            let callbackRef = this.Q[index].callBkRef;

            let search: URLSearchParams = new URLSearchParams();

            switch (this.Q[index].type) {
                case MntConst._TABLE: {
                    for (let i = 0; i < query.length; i++) {
                        if (query[i] === 'BusinessCode') { //Mandatory Fields
                            search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                            search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                            search.set(this.serviceConstants.Action, action);
                            search.set('ContractTypeCode', callbackRef.pageParams.CurrentContractType);
                        } else {
                            search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                            search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                            search.set(this.serviceConstants.Action, action);
                            search.set(query[i], callbackRef.riExchange.riInputElement.GetValue(callbackRef.uiForm, query[i]));
                        }
                    }
                    if (method === MntConst._GET) {
                        if (name !== '*') {
                            this.flagXhrProcessing = true;
                            this.xhr.xhrGet(
                                callbackRef.xhrParams.method,
                                callbackRef.xhrParams.module,
                                callbackRef.xhrParams.operation,
                                search
                            ).then((data) => {
                                this.flagXhrProcessing = false;
                                this.prevRespData = data;
                                if (data.hasOwnProperty('errorNumber')) {
                                    this.Q[index].status = MntConst._FAIL;
                                    //this.logger.log('Error:', data.errorNumber, data.errorMessage);
                                    if (typeof obj.showAlert === 'function') {
                                        obj.showAlert(data.errorNumber + ' - ' + data.errorMessage);
                                    } else if (typeof obj.parent.showAlert === 'function') {
                                        obj.parent.showAlert(data.errorNumber + ' - ' + data.errorMessage);
                                    }
                                } else {
                                    this.Q[index].status = MntConst._DONE;
                                    this.renderResponse(callbackRef, this.prevRespData, respParams);
                                    //Bug Fix - Start Table Start
                                    if (this.starTableExecuted > 0) {
                                        this.renderResponse(callbackRef, this.prevRespData, this.Q[this.starTableExecuted].respParams);
                                        this.starTableExecuted = -1;
                                    } //Bug Fix - Start Table End
                                }
                                if (typeof callback === 'function') callback.call(obj, this.prevRespData);
                                this.startLookUpExec = true;
                                this.checkErrAndProcessNext(obj);
                            }, (e: any) => { this.flagXhrProcessing = false; });
                        } else {
                            this.starTableExecuted = index; //Bug Fix - Start Table Start
                            this.Q[index].status = MntConst._DONE;
                            this.renderResponse(callbackRef, this.prevRespData, respParams);
                            if (typeof callback === 'function') callback.call(obj, this.prevRespData);
                            // let str = ''; for (let i in this.prevRespData) { str += i + ', '; }
                            // this.logger.log('PREV resp', this.prevRespData, str);
                            this.checkErrAndProcessNext(obj);
                        }
                    } else {
                        this.flagXhrProcessing = true;
                        let formData = {};
                        let formDataObj = method.split('=');
                        formData[formDataObj[0]] = formDataObj[1];
                        formData = this.sanitizeFields(formData);
                        this.xhr.xhrPost(
                            callbackRef.xhrParams.method,
                            callbackRef.xhrParams.module,
                            callbackRef.xhrParams.operation,
                            search,
                            formData
                        ).then((data) => {
                            //TODO - Duplicate lines of coge from GET method above
                            this.flagXhrProcessing = false;
                            this.prevRespData = data;
                            if (data.hasOwnProperty('errorNumber')) {
                                this.Q[index].status = MntConst._FAIL;
                                //this.logger.log('Error:', data.errorNumber, data.errorMessage);
                                if (typeof obj.showAlert === 'function') {
                                    obj.showAlert(data.errorNumber + ' - ' + data.errorMessage);
                                } else if (typeof obj.parent.showAlert === 'function') {
                                    obj.parent.showAlert(data.errorNumber + ' - ' + data.errorMessage);
                                }
                            } else {
                                this.Q[index].status = MntConst._DONE;
                                this.renderResponse(callbackRef, this.prevRespData, respParams);
                                //Bug Fix - Start Table Start
                                if (this.starTableExecuted > 0) {
                                    this.renderResponse(callbackRef, this.prevRespData, this.Q[this.starTableExecuted].respParams);
                                    this.starTableExecuted = -1;
                                } //Bug Fix - Start Table End
                            }
                            if (typeof callback === 'function') callback.call(obj, this.prevRespData);
                            this.startLookUpExec = true;
                            this.checkErrAndProcessNext(obj);
                        });
                    }
                }
                    break;
                case MntConst._VTABLE:
                case MntConst._VTABLEJOION: {
                    if (this.startLookUpExec) {
                        let maxCount = 6;
                        if (this.Q[index].type === MntConst._VTABLEJOION) {
                            maxCount = 1;
                        }
                        let countTable = 0;
                        let lookupIP = [];
                        for (let i = 0; i < this.Q.length; i++) {
                            if ((this.Q[i].type === MntConst._VTABLE || this.Q[i].type === MntConst._VTABLEJOION) &&
                                (this.Q[i].status === MntConst._INIT || this.Q[i].status === MntConst._WIP)) {
                                if (countTable < maxCount) {
                                    let tableObj = this.Q[i];
                                    this.Q[i].status = MntConst._DONE;
                                    if (this.Q[i].callBk) {
                                        callback = this.Q[i].callBk;
                                    }

                                    //Form Table name
                                    let lookupItem = { 'table': tableObj.name, 'query': {}, 'fields': [], 'displayFields': {} };
                                    //Form Query
                                    for (let j = 0; j < tableObj.query.length; j++) {
                                        let _key = tableObj.query[j];
                                        let _keySearch = _key;
                                        let _keyVal = '';
                                        if (_key.indexOf('#') > -1) {
                                            _key = tableObj.query[j].split('#')[0];
                                            _keySearch = tableObj.query[j].split('#')[1];
                                        }
                                        _keyVal = obj.riExchange.riInputElement.GetValue(obj.uiForm, _keySearch);
                                        if (_key.indexOf('$') > -1) {
                                            _key = tableObj.query[j].split('$')[0];
                                            _keySearch = tableObj.query[j].split('$')[1];
                                            _keyVal = _keySearch;
                                        }
                                        if (tableObj.query[j] === 'BusinessCode') {
                                            lookupItem.query['BusinessCode'] = this.utils.getBusinessCode();
                                        } else {
                                            lookupItem.query[_key] = _keyVal;
                                        }
                                    }
                                    //Form fields
                                    for (let k = 0; k < tableObj.respParams.length; k++) {
                                        let field = tableObj.respParams[k].split('^')[0];

                                        let displayFieldName = '';
                                        if (tableObj.respParams[k].indexOf('^') > -1) {
                                            displayFieldName = tableObj.respParams[k].split('^').pop();
                                        } else {
                                            displayFieldName = tableObj.respParams[k];
                                        }

                                        lookupItem.fields.push(field);
                                        lookupItem.displayFields[field] = displayFieldName;
                                    }
                                    //Push lookup object
                                    //this.logger.log('Lookup:', tableObj.name, tableObj, lookupItem);
                                    lookupIP.push(lookupItem);

                                    countTable++;
                                }
                            }
                        }
                        //Do Lookup
                        this.flagXhrProcessing = true;
                        this.LookUp.lookUpPromise(lookupIP).then((data) => {
                            this.flagXhrProcessing = false;
                            //console.log('Response VTABLE', lookupIP, data);
                            let respData = data;
                            if (respData) {
                                for (let i = 0; i < respData.length; i++) {
                                    if (respData[i] !== null) {
                                        if (respData[i].length > 0) {
                                            let _respData = respData[i][0];
                                            let _dispFields = lookupIP[i].displayFields;
                                            for (let j in _respData) {
                                                if (j !== '') {
                                                    if (_dispFields[j]) obj.riExchange.riInputElement.SetValue(obj.uiForm, _dispFields[j], _respData[j]);
                                                } //TODO - Check if checkbox then transform
                                            }
                                        } else {
                                            let _dispFields = lookupIP[i].displayFields;
                                            for (let j in _dispFields) {
                                                if (j !== '') {
                                                    if (_dispFields[j]) obj.riExchange.riInputElement.SetValue(obj.uiForm, _dispFields[j], '');
                                                } //TODO - Check if checkbox then transform
                                            }
                                        }
                                    }
                                }
                                this.checkErrAndProcessNext(obj);
                            }
                            if (typeof callback === 'function') {
                                callback.call(obj, this.prevRespData);
                            }
                        }, (e: any) => { this.flagXhrProcessing = false; });
                    }
                }
                    break;
                case MntConst._CBO: {
                    //Form Query
                    //Mandatory Fields
                    search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                    search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                    search.set(this.serviceConstants.Action, action);
                    for (let i = 0; i < query.length; i++) {
                        if (query[i] === 'BusinessCode') {
                            //Already added
                        } else {
                            search.set(query[i], callbackRef.riExchange.riInputElement.GetValue(callbackRef.uiForm, query[i]));
                        }
                    }
                    //Form Body
                    let formData = {};
                    let CBOparam = name.trim().split('&');
                    for (let i = 0; i < CBOparam.length; i++) {
                        let keyValPair = CBOparam[i].split('=');
                        let functionCheck = keyValPair[0];
                        if (functionCheck.toUpperCase() === 'FUNCTION') {
                            formData['Function'] = keyValPair[1];
                        }
                        formData[keyValPair[0]] = keyValPair[1];
                    }
                    for (let i = 0; i < body.length; i++) {
                        formData[body[i]] = this.riExchange.riInputElement.GetValue(obj.uiForm, body[i]);
                        let dataType = this.getControlType(obj.controls, body[i], 'type');
                        formData[body[i]] = this.respDataFormatReq(dataType, formData[body[i]]);
                    }
                    formData = this.sanitizeFields(formData);
                    //this.logger.log('CBO Req', search, formData, callbackRef, obj);
                    //Execute request
                    this.flagXhrProcessing = true;
                    if (method === MntConst._POST) {
                        this.xhr.xhrPost(
                            callbackRef.xhrParams.method,
                            callbackRef.xhrParams.module,
                            callbackRef.xhrParams.operation,
                            search,
                            formData
                        ).then((data) => {
                            this.flagXhrProcessing = false;
                            //this.logger.log('Response CBO', data);
                            callback.call(obj, data);
                            this.Q[index].status = MntConst._DONE;
                            this.checkErrAndProcessNext(obj);
                        }, (e: any) => { this.flagXhrProcessing = false; });
                    }
                }
                    break;
                case MntConst._PDA: {
                    if (method === MntConst._GET) {
                        //Form Query
                        let search: URLSearchParams = new URLSearchParams();
                        //mandatory Fields
                        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                        search.set(this.serviceConstants.Action, action);
                        for (let i = 0; i < query.length; i++) {
                            let fieldValue = query[i].value;
                            fieldValue = this.respDataFormatReq(query[i].datatype, fieldValue);
                            search.set(query[i].key, fieldValue);
                        }
                        //this.logger.log('PDA Req GET', search);
                        //Execute request
                        this.flagXhrProcessing = true;
                        this.xhr.xhrGet(
                            callbackRef.xhrParams.method,
                            callbackRef.xhrParams.module,
                            callbackRef.xhrParams.operation,
                            search
                        ).then((data) => {
                            this.flagXhrProcessing = false;
                            //this.logger.log('Response PDA GET', data);
                            for (let i = 0; i < respParams.length; i++) {
                                if (data.hasOwnProperty(respParams[i].key)) {
                                    data[respParams[i].key] = this.respDataFormatUI(respParams[i].datatype, data[respParams[i].key]);
                                }
                            }
                            callback.call(obj, data); //TODO Error Data
                            this.Q[index].status = MntConst._DONE;
                            this.checkErrAndProcessNext(obj);
                        }, (e: any) => { this.flagXhrProcessing = false; });
                    } else {
                        //Form Query
                        let search: URLSearchParams = new URLSearchParams();
                        //mandatory Fields
                        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                        search.set(this.serviceConstants.Action, action);

                        //Form Body
                        let formData = {};
                        for (let i = 0; i < query.length; i++) {
                            let fieldValue = query[i].value;
                            if (!fieldValue) {
                                fieldValue = this.riExchange.riInputElement.GetValue(obj.uiForm, query[i].key);
                            }
                            fieldValue = this.respDataFormatReq(query[i].datatype, fieldValue);
                            //this.logger.log('REQ Data', fieldValue, query[i].datatype);
                            fieldValue = (fieldValue === undefined) ? '' : fieldValue;
                            //this.logger.log('PDA POST data', query[i].key, fieldValue, query[i].datatype);
                            formData[query[i].key] = fieldValue;
                        }
                        formData = this.sanitizeFields(formData);
                        //this.logger.log('PDA Req POST', index, name, search, formData);
                        //Execute request
                        this.flagXhrProcessing = true;
                        if (method === MntConst._POST) {
                            this.xhr.xhrPost(
                                callbackRef.xhrParams.method,
                                callbackRef.xhrParams.module,
                                callbackRef.xhrParams.operation,
                                search,
                                formData
                            ).then((data) => {
                                this.flagXhrProcessing = false;
                                //this.logger.log('Response PDA POST', data);
                                for (let i = 0; i < respParams.length; i++) {
                                    if (data.hasOwnProperty(respParams[i].key)) {
                                        data[respParams[i].key] = this.respDataFormatUI(respParams[i].datatype, data[respParams[i].key]);
                                    }
                                }
                                callback.call(obj, data);
                                this.Q[index].status = MntConst._DONE;
                                this.checkErrAndProcessNext(obj);
                            }, (e: any) => { this.flagXhrProcessing = false; });
                        }
                    }
                }
                    break;
                case MntConst._FN: {
                    //TODO & Verify - Function blocks should be executed with delay as it migth return data which might be used in the next execution
                    setTimeout(() => {
                        // this.logger.log('Function Run:', name);
                        if (typeof callbackRef[name] === 'function') {
                            if (!this.CancelEvent) {
                                // this.logger.log('---FUNCTION---', name, this.flagXhrProcessing, this.isModalOpen, this.CancelEvent);
                                if (name === 'confirm') {
                                    if (!this.flagXhrProcessing) {
                                        callbackRef[name].call(obj);
                                    }
                                    else {
                                        this.pendingFnObj = callbackRef[name];
                                        // setTimeout(() => {
                                        //     this.pendingFnObj.call(obj);
                                        //     this.pendingFnObj = null;
                                        // }, 3000);
                                    }
                                } else {
                                    callbackRef[name].call(obj);
                                }
                            } else {
                                if (typeof callbackRef['hideSpinner'] === 'function') callbackRef['hideSpinner'].call(obj);
                            }
                        } else {
                            //TODO - change EVAL implementation !!!!DANGER!!!!
                            // this.logger.error('EVIL EVAL FUNC STRING', callback, callbackRef[name], obj);
                            //eval(callbackRef[name].call(obj));
                            //var f = new Function('x', 'y', 'return x+y'); f(3, 4);
                        }
                    }, 500);
                    this.Q[index].status = MntConst._DONE;
                    this.checkErrAndProcessNext(obj);
                    break;
                }
            }
        } else {
            //this.logger.log('processQ exited');
            if (obj.ajaxSource) {
                obj.ajaxSource.next('COMPLETE');
            }
        }
    }

    private pendingFnObj: any;
    public handleConfirm(obj: any): any {
        if (typeof this.pendingFnObj === 'function') this.pendingFnObj.call(obj);
        this.pendingFnObj = null;
    }

    private renderResponse(obj: any, data: any, respParams: any): any {
        for (let id in data) {
            if (id !== '') {
                let respData = data[id];
                if (respParams.hasOwnProperty(id)) {
                    if (respParams[id].hasOwnProperty('type')) {
                        this.riExchange.updateCtrl(obj.controls, id, 'type', respParams[id].type);
                        respData = this.respDataFormatUI(respParams[id].type, respData);
                        if (respParams[id].type === MntConst.eTypeDate) {
                            this.updateDateField(obj, respData, id, respParams[id]);
                        }
                        //this.logger.log('renderResponse - DATA', id, respData, respParams[id].type, data[id]);
                    }
                    this.riExchange.updateCtrl(obj.controls, id, 'value', respData);
                    obj.riExchange.riInputElement.SetValue(obj.uiForm, id, respData);
                }
            }
        }
    }

    public renderResponseForCtrl(obj: any, data: any): any {
        for (let id in data) {
            if (id) {
                let respData = data[id];
                let ctrlType = this.getControlType(obj.controls, id, 'type');
                if (ctrlType) {
                    respData = this.respDataFormatUI(ctrlType, respData);
                    if (ctrlType === MntConst.eTypeDate) {
                        this.updateDateField(obj, respData, id);
                    }
                    this.riExchange.updateCtrl(obj.controls, id, 'value', respData);
                    obj.riExchange.riInputElement.SetValue(obj.uiForm, id, respData);
                } else {
                    this.riExchange.updateCtrl(obj.controls, id, 'value', respData);
                    obj.riExchange.riInputElement.SetValue(obj.uiForm, id, respData);
                }
            }
        }
    }

    public respDataFormatUI(type: string, value: any): any {
        let returnValue = value;
        switch (type) {
            case MntConst.eTypeCheckBox:
                returnValue = this.utils.convertResponseValueToCheckboxInput(returnValue);
                break;
            case MntConst.eTypeInteger:
                if (typeof returnValue === 'string') returnValue = (returnValue.trim() !== '') ? parseInt(returnValue, 10) : '';
                break;
            case MntConst.eTypeCurrency:
                if (typeof returnValue === 'string') returnValue = (returnValue.trim() !== '') ? this.utils.cCur(returnValue) : '';
                break;
            case MntConst.eTypeDate:
            case MntConst.eTypeDateText:
                if (returnValue) returnValue = this.globalize.parseDateStringToDate(returnValue);
                break;
            case MntConst.eTypeTime:
            case MntConst.eTypeTimeText:
                returnValue = this.utils.secondsToHms(returnValue);
                break;
        }
        return returnValue;
    }

    private respDataFormatReq(type: string, value: any): any {
        let returnValue = value;
        switch (type) {
            case MntConst.eTypeCheckBox:
                returnValue = this.utils.convertCheckboxValueToRequestValue(returnValue);
                break;
            case MntConst.eTypeTime:
                if (returnValue && returnValue.indexOf(':') > -1) {
                    returnValue = this.globalize.parseTimeToFixedFormat(returnValue);
                }
                break;
            case MntConst.eTypeCurrency:
                returnValue = this.globalize.parseCurrencyToFixedFormat(returnValue);
                break;
            case MntConst.eTypeDate:
            case MntConst.eTypeDateText:
                if (returnValue) {
                    returnValue = this.globalize.parseDateToFixedFormat(returnValue);
                }
                break;
            case MntConst.eTypeInteger:
                returnValue = this.globalize.parseIntegerToFixedFormat(returnValue);
                break;
            case MntConst.eTypeDecimal1:
                returnValue = this.globalize.parseDecimal1ToFixedFormat(returnValue);
                break;
            case MntConst.eTypeDecimal2:
                returnValue = this.globalize.parseDecimal2ToFixedFormat(returnValue);
                break;
            case MntConst.eTypeDecimal3:
                returnValue = this.globalize.parseDecimal3ToFixedFormat(returnValue);
                break;
            case MntConst.eTypeDecimal4:
                returnValue = this.globalize.parseDecimal4ToFixedFormat(returnValue);
                break;
            case MntConst.eTypeDecimal5:
                returnValue = this.globalize.parseDecimal5ToFixedFormat(returnValue);
                break;
            case MntConst.eTypeDecimal6:
                returnValue = this.globalize.parseDecimal6ToFixedFormat(returnValue);
                break;
        }
        if (returnValue === null || returnValue === undefined) {
            returnValue = '';
        }
        return returnValue;
    }

    private checkErrAndProcessNext(obj: any): void {
        if (this.Q.length - 1 === this.processingQindex) {
            if (this.pendingFnObj && !this.isModalOpen) {
                this.pendingFnObj.call(obj);
                this.pendingFnObj = null;
            }
        }

        if (!this.CancelEvent) {
            this.processingFlag = false;
            this.processQ(obj);
        } else {
            this.clearQ();
            if (obj.ajaxSource) {
                obj.ajaxSource.next('COMPLETE');
            }
        }
    }

    public updateDateField(obj: any, value: any, id: string, ctrlObj?: any): void {
        //this.logger.log('updateDateField', obj, value, id, ctrlObj);
        if (obj.pageParams['dt' + id]) {
            obj.pageParams['dt' + id].value = value;
            if (ctrlObj) {
                obj.pageParams['dt' + id].disabled = (ctrlObj.disabled) ? true : false;
                obj.pageParams['dt' + id].required = (ctrlObj.paramType === 'Required') ? true : false;
            }
        }
    }

    public getControlType(ctrlObj: any[], id: string, key: string): any {
        for (let i = 0; i < ctrlObj.length; i++) {
            let fieldObj = ctrlObj[i];
            if (fieldObj.name === id) {
                return (!fieldObj[key]) ? '' : fieldObj[key];
            }
        }
        return '';
    }

    private sanitizeFields(formData: any): any {
        for (let i in formData) {
            if (i) {
                if (typeof formData[i] === 'object') {
                    //Regional Settings not reguired here as finally the date is parsed in respDataFormatReq()
                    //If modified, the below lines needs to be modified as well based on the return type
                    let dateConverted = this.utils.formatDate(formData[i]);
                    formData[i] = (dateConverted.length === 10) ? dateConverted : formData[i];
                }
            }
        }
        return formData;
    }
}

export class RiTab {
    public tabObject: any;
    public tabVisited = [];
    private tabLength: number = 0;
    private currentTab: number = 0;

    constructor(
        tabObj: any,
        private utils: Utils
    ) {
        this.tabObject = tabObj;

        let len = 0;
        for (let tab in this.tabObject) {
            if (tab !== '') {
                len++;
                this.tabVisited.push(false);
            }
        }
        this.tabLength = len;
        this.tabVisited[0] = true;
    }
    public TabFocus(tabIndex: number): void {
        this.currentTab = tabIndex;
        //Bug - unable to explicitly remove 'active' class as those are binded. hence below lines added
        let elem = document.querySelector('.nav-tabs').children;
        for (let i = 0; i < elem.length; i++) {
            if (this.utils.hasClass(elem[i], 'error')) {
                this.utils.removeClass(elem[i], 'active');
                this.utils.removeClass(document.querySelector('.tab-content').children[i], 'active');
            }
        }


        let i = 0;
        for (let tab in this.tabObject) {
            if (tab !== '') {
                i++;
                this.tabObject[tab].active = (i === tabIndex) ? true : false;
            }
        }

        //Failsafe
        this.utils.addClass(elem[tabIndex - 1], 'active');
        this.utils.addClass(document.querySelector('.tab-content').children[tabIndex - 1], 'active');

        setTimeout(this.utils.makeTabsRed(this.tabVisited), 200);
        this.tabVisited[tabIndex - 1] = true;
    }
    public TabsToNormal(): void {
        this.TabFocus(1);
        this.utils.makeTabsNormal();
    }
    public TabDraw(): void { /* setTimeout(this.TabFocus(0), 500);*/ }
    public TabSet(): void { /* No Funcionality */ }
    public TabClear(): void {
        for (let tab in this.tabObject) {
            if (tab !== '') {
                this.tabObject[tab].visible = false;
            }
        }
    }
    public TabAdd(tabId: string): void {
        for (let tab in this.tabObject) {
            if (tab !== '') {
                if (this.tabObject[tab].name === tabId) {
                    this.tabObject[tab].visible = true;
                }
            }
        }
    }
    public getCurrentActiveTab(): any {
        let i = 0;
        for (let tab in this.tabObject) {
            if (tab !== '') {
                i++;
                if (this.tabObject[tab].active) {
                    this.currentTab = i;
                    return i;
                }
            }
        }
        // return this.currentTab;
    }
    public getNextActiveTab(tabindex: number): any {
        let i = 0;
        for (let tab in this.tabObject) {
            if (tab !== '') {
                i++;
                if (this.tabObject[tab].visible && i > tabindex && i <= this.tabLength) return i;
            }
        }
        return tabindex;
    }
    public focusFirstField(): any {
        /*let elem = document.querySelector('.tab-content').children[this.currentTab - 1];
        if (elem.querySelector('input:not(.hidden)')) elem.querySelector('input:not(.hidden)')['focus']();
        else if (elem.querySelector('textarea')) elem.querySelector('textarea')['focus']();*/
        this.utils.getFirstFocusableFieldForTab(this.currentTab);
    }
    public focusNextTab(obj: any): void {
        if (obj.relatedTarget || obj.keyCode === 9) {
            let currtab = this.getCurrentActiveTab();
            let focustab = this.getNextActiveTab(currtab);
            if (currtab !== focustab) {
                this.TabFocus(focustab);
                this.focusFirstField();
            } else {
                document.querySelector('#save')['focus']();
            }
        }
    }
}
