import { URLSearchParams } from '@angular/http';
export var MntConst = (function () {
    function MntConst() {
    }
    MntConst.eKeyStateNormal = 'eKeyStateNormal';
    MntConst.eKeyStateFixed = 'eKeyStateFixed';
    MntConst.eKeyOptionNormal = 'eKeyOptionNormal';
    MntConst.eAlignmentRight = 'eAlignmentRight';
    MntConst.eAlignmentLeft = 'eAlignmentLeft';
    MntConst.eAlignmentCenter = 'eAlignmentCenter';
    MntConst.eTypeCode = 'eTypeCode';
    MntConst.eTypeText = 'eTypeText';
    MntConst.eTypeTextFree = 'eTypeTextFree';
    MntConst.eTypeInteger = 'eTypeInteger';
    MntConst.eTypeDecimal1 = 'eTypeDecimal1';
    MntConst.eTypeDecimal2 = 'eTypeDecimal2';
    MntConst.eTypeDecimal3 = 'eTypeDecimal3';
    MntConst.eTypeDecimal4 = 'eTypeDecimal4';
    MntConst.eTypeDecimal5 = 'eTypeDecimal5';
    MntConst.eTypeDecimal6 = 'eTypeDecimal6';
    MntConst.eTypeCodeNumeric = 'eTypeCodeNumeric';
    MntConst.eTypeAutoNumber = 'eTypeAutoNumber';
    MntConst.eTypeCurrency = 'eTypeCurrency';
    MntConst.eTypeDate = 'eTypeDate';
    MntConst.eTypeDateText = 'eTypeDateText';
    MntConst.eTypeDateNow = 'eTypeDateNow';
    MntConst.eTypeTime = 'eTypeTime';
    MntConst.eTypeTimeNow = 'eTypeTimeNow';
    MntConst.eTypeHours = 'eTypeHours';
    MntConst.eTypeMinutes = 'eTypeMinutes';
    MntConst.eTypeCodeNumericAutoNumber = 'eTypeCodeNumericAutoNumber';
    MntConst.eTypeEMail = 'eTypeEMail';
    MntConst.eTypeImage = 'eTypeImage';
    MntConst.eTypeButton = 'eTypeButton';
    MntConst.eTypeCheckBox = 'eTypeCheckBox';
    MntConst.eVirtualJoinTypeInner = 'eVirtualJoinTypeInner';
    MntConst.eTypeEllipsis = 'eTypeEllipsis';
    MntConst.eTypeDropdown = 'eTypeDropdown';
    MntConst.eTypeUnknown = 'eTypeUnknown';
    MntConst.eFieldStateNormal = 'eFieldStateNormal';
    MntConst.eFieldStateFixed = 'eFieldStateFixed';
    MntConst.eFieldOptionNormal = 'eFieldOptionNormal';
    MntConst.eFieldOptionRequired = 'eFieldOptionRequired';
    MntConst.eFieldOptionRequried = 'eFieldOptionRequired';
    MntConst.eFieldStateReadOnly = 'eFieldStateReadOnly';
    MntConst.eVirtualKeyStateFixed = 'eVirtualKeyStateFixed';
    MntConst.eVirtualKeyStateNormal = 'eVirtualKeyStateNormal';
    MntConst.eVirtualKeyStateReadOnly = 'eVirtualKeyStateReadOnly';
    MntConst.eVirtualFieldStateFixed = 'eVirtualFieldStateFixed';
    MntConst.eVirtualFieldStateNormal = 'eVirtualFieldStateNormal';
    MntConst.eVirtualFieldStateReadOnly = 'eVirtualFieldStateReadOnly';
    MntConst.eModeUpdate = 'eModeUpdate';
    MntConst.eNormalMode = 'eNormalMode';
    MntConst.eModeNormal = 'eModeNormal';
    MntConst.eModeAdd = 'eModeAdd';
    MntConst.eModeSave = 'eModeSave';
    MntConst.eModeSaveUpdate = 'eModeSaveUpdate';
    MntConst.eModeSaveAdd = 'eModeSaveAdd';
    MntConst.eModeCancel = 'eModeCancel';
    MntConst.eModeSelect = 'eModeSelect';
    MntConst.eModeDelete = 'eModeDelete';
    MntConst.eModeFetch = 'eModeFetch';
    MntConst.eModeCustom = 'eModeCustom';
    MntConst._GET = 'GET';
    MntConst._POST = 'POST';
    MntConst._FN = 'FUNCTION';
    MntConst._TABLE = 'TABLE';
    MntConst._VTABLE = 'LOOKUP';
    MntConst._VTABLEJOION = 'LOOKUPJOIN';
    MntConst._CBO = 'CBO';
    MntConst._PDA = 'PDA';
    MntConst._INIT = 'INIT';
    MntConst._WIP = 'WIP';
    MntConst._DONE = 'SUCCESS';
    MntConst._FAIL = 'ERROR';
    return MntConst;
}());
export var RiMaintenance = (function () {
    function RiMaintenance(logger, xhr, LookUp, utils, serviceConstants) {
        this.logger = logger;
        this.xhr = xhr;
        this.LookUp = LookUp;
        this.utils = utils;
        this.serviceConstants = serviceConstants;
        this.BusinessObject = '';
        this.CustomBusinessObject = '';
        this.CustomBusinessObjectAdditionalPostData = '';
        this.CustomBusinessObjectSelect = false;
        this.CustomBusinessObjectConfirm = false;
        this.CustomBusinessObjectInsert = false;
        this.CustomBusinessObjectUpdate = false;
        this.CustomBusinessObjectDelete = false;
        this.CustomBusinessObjectDeleteEx = false;
        this.ButtonCaptionAdd = '';
        this.ButtonCaptionSelect = '';
        this.ButtonCaptionUpdate = '';
        this.ButtonCaptionDelete = '';
        this.ButtonCaptionSearch = '';
        this.ButtonCaptionSave = '';
        this.ButtonCaptionFetch = '';
        this.ButtonCaptionAbandon = '';
        this.ButtonCaptionSnapshot = '';
        this.Enabled = false;
        this.StillExecuting = false;
        this.StillExecutingCBORequest = false;
        this.CurrentMode = '';
        this.DisplayMessages = false;
        this.FunctionAdd = false;
        this.FunctionSelect = false;
        this.FunctionUpdate = false;
        this.FunctionDelete = false;
        this.FunctionSearch = false;
        this.FunctionSnapShot = false;
        this.CancelEvent = false;
        this.SearchRequired = false;
        this.SelectFunctionalityEx = false;
        this.SuppressErrorMessage = false;
        this.RequestWindowClose = false;
        this.event_list = {
            event_category: [
                {
                    name: 'Search',
                    event: {
                        order: 1,
                        name: 'Search',
                        desc: 'If the search button is pressed then this event is run after basic field validation is performed.'
                    }
                },
                {
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
                {
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
                {
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
                {
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
                {
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
                {
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
                {
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
                {
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
                {
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
                {
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
                {
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
        this.grdPremiseMaintenanceControl = true;
        this.Q = [];
        this.postConfirmFunc = [];
        this.reqPostDataAddXhr = { method: 'GET', header: [], query: [], body: [], respParam: [] };
        this.cboObj = { name: '', method: 'POST', query: [], body: [], callback: '' };
        this.mntObj = {
            table: '',
            keyFields: [],
            outputFields: {},
            status: MntConst._INIT,
            type: MntConst._TABLE,
            xhrType: MntConst._GET
        };
        this.prevRespData = '';
        this.virtualTableObj = {
            table: '',
            keyFields: [],
            outputFields: []
        };
        this.virtualTableJoinObj = {
            table: '',
            keyFields: [],
            outputFields: []
        };
        this.isModalOpen = false;
        this.processingFlag = false;
        this.starTableExecuted = -1;
        this.startLookUpExec = false;
        this.flagXhrProcessing = false;
        this.processingQindex = 0;
    }
    RiMaintenance.prototype.getEventIndex = function (mode) {
        var index = -1;
        for (var i = 0; i < this.event_list.event_category.length; i++) {
            if (this.event_list.event_category[i].name === mode)
                index = i;
        }
        return index;
    };
    RiMaintenance.prototype.getEvents = function (modeIndex) {
        var eventsArr = this.event_list.event_category[modeIndex].event;
        eventsArr = eventsArr.sort(function (a, b) { return a.order - b.order; });
        var eventFn = [];
        for (var i = 0; i < eventsArr.length; i++) {
            if (eventsArr[i].name === 'CBORequest')
                eventFn.push('riExchange_' + eventsArr[i].name);
            else
                eventFn.push('riMaintenance_' + eventsArr[i].name);
        }
        return eventFn;
    };
    RiMaintenance.prototype.AddMode = function () { this.CurrentMode = MntConst.eModeAdd; };
    RiMaintenance.prototype.FetchRecord = function () { };
    RiMaintenance.prototype.UpdateMode = function () { this.CurrentMode = MntConst.eModeUpdate; };
    RiMaintenance.prototype.SelectMode = function () { this.CurrentMode = MntConst.eModeSave; };
    RiMaintenance.prototype.RecordSelected = function (param) { return true; };
    RiMaintenance.prototype.Complete = function () { };
    RiMaintenance.prototype.EnableInput = function (fieldName) { this.riExchange.riInputElement.Enable(this.uiForm, fieldName); };
    RiMaintenance.prototype.DisableInput = function (fieldName) {
        this.riExchange.riInputElement.Disable(this.uiForm, fieldName);
    };
    RiMaintenance.prototype.SetRequiredStatus = function (fieldName, status) {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, fieldName, status);
    };
    RiMaintenance.prototype.SetErrorStatus = function (fieldName, status) {
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, fieldName, status);
    };
    RiMaintenance.prototype.RowID = function (obj, id, value) { obj.riExchange.riInputElement.SetValue(obj.uiForm, id, value); };
    RiMaintenance.prototype.GetRowID = function (id) { return this.riExchange.riInputElement.GetValue(this.uiForm, id); };
    RiMaintenance.prototype.clearQ = function () { this.Q.length = 0; this.processingFlag = false; };
    RiMaintenance.prototype.genQ = function (fnName, type, method, headersArr, queryArr, bodyArr, respParamsArr, callBk, callBkRef, action) {
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
    };
    RiMaintenance.prototype.detectMode = function (FormGrp, fieldName, obj) {
        var fnNames = [];
        fnNames.push('showSpinner');
        var flag = [];
        for (var i = 0; i < fieldName.length; i++) {
            if (this.riExchange.riInputElement.GetValue(FormGrp, fieldName[i]).trim() === '')
                flag.push(true);
            else
                flag.push(false);
        }
        var flag_primary = flag.shift();
        var flag_secondary = flag.reduce(function (acc, val) { return acc && val; }, true);
        if (flag_primary) {
            this.CurrentMode = MntConst.eModeAdd;
            fnNames = fnNames.concat(this.getEvents(this.getEventIndex('Add Mode')));
        }
        else if (flag_secondary) {
            this.CurrentMode = MntConst.eModeAdd;
            fnNames = fnNames.concat(this.getEvents(this.getEventIndex('Add Mode')));
        }
        else {
            this.CurrentMode = MntConst.eModeUpdate;
            fnNames = fnNames.concat(this.getEvents(this.getEventIndex('Fetch Record')));
            fnNames = fnNames.concat(this.getEvents(this.getEventIndex('Update Mode')));
        }
        fnNames.push('hideSpinner');
        for (var i = 0; i < fnNames.length; i++) {
            var fnname = fnNames[i];
            for (var j = 0; j < obj.length; j++) {
                if (typeof obj[j][fnname] === 'function') {
                    this.Q.push(this.genQ(fnname, MntConst._FN, '', [], [], [], [], j, obj[j], 0));
                    this.processQ(obj[j]);
                }
            }
        }
    };
    RiMaintenance.prototype.execMode = function (mode, obj, seq) {
        var fnNames = [];
        fnNames.push('showSpinner');
        switch (mode) {
            case MntConst.eModeAdd:
                fnNames = fnNames.concat(this.getEvents(this.getEventIndex('Add Mode')));
                break;
            case MntConst.eModeUpdate:
                fnNames = fnNames.concat(this.getEvents(this.getEventIndex('Fetch Record')));
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
                fnNames = fnNames.concat(this.getEvents(this.getEventIndex('Fetch Record')));
                break;
            case MntConst.eModeSelect:
                fnNames = fnNames.concat(this.getEvents(this.getEventIndex('Select Mode')));
                break;
            case MntConst.eModeCustom:
                fnNames = fnNames.concat(seq);
                break;
        }
        fnNames.push('hideSpinner');
        this.CurrentMode = mode;
        this.processingFlag = false;
        this.postConfirmFunc = [];
        if (this.CurrentMode === MntConst.eModeSaveUpdate ||
            this.CurrentMode === MntConst.eModeSaveAdd ||
            this.CurrentMode === MntConst.eModeDelete) {
            this.postConfirmFunc = fnNames.splice(fnNames.indexOf('riMaintenance_BeforeEvent') + 1, fnNames.length - fnNames.indexOf('riMaintenance_BeforeEvent'), 'hideSpinner', 'confirm');
            fnNames.splice(0, 0, 'showSpinner');
            this.postConfirmFunc.splice(0, 0, 'showSpinner');
        }
        for (var i = 0; i < fnNames.length; i++) {
            var fnname = fnNames[i];
            for (var j = 0; j < obj.length; j++) {
                if (typeof obj[j][fnname] === 'function') {
                    this.Q.push(this.genQ(fnname, MntConst._FN, '', [], [], [], [], '', obj[j], 0));
                    this.processQ(obj[j]);
                }
            }
        }
    };
    RiMaintenance.prototype.execContinue = function (mode, obj) {
        for (var i = 0; i < this.postConfirmFunc.length; i++) {
            var fnname = this.postConfirmFunc[i];
            for (var j = 0; j < obj.length; j++) {
                if (typeof obj[j][fnname] === 'function') {
                    this.Q.push(this.genQ(fnname, MntConst._FN, '', [], [], [], [], '', obj[j], 0));
                    this.processQ(obj[j]);
                }
            }
        }
    };
    RiMaintenance.prototype.clear = function () {
        this.reqPostDataAddXhr.method = 'GET';
        this.reqPostDataAddXhr.header.length = 0;
        this.reqPostDataAddXhr.query.length = 0;
        this.reqPostDataAddXhr.body.length = 0;
        this.reqPostDataAddXhr.respParam.length = 0;
    };
    ;
    RiMaintenance.prototype.PostDataAdd = function (fieldKey, fieldValue, type) { this.reqPostDataAddXhr.query.push({ key: fieldKey, value: fieldValue, datatype: type }); };
    ;
    RiMaintenance.prototype.ReturnDataAdd = function (fieldName, type) { this.reqPostDataAddXhr.respParam.push({ key: fieldName, datatype: type }); };
    ;
    RiMaintenance.prototype.Execute = function (obj, callback, method, action) {
        var reqMethod = MntConst._GET;
        if (typeof method !== 'undefined') {
            if (method.toUpperCase() === MntConst._POST)
                reqMethod = MntConst._POST;
            else
                reqMethod = MntConst._GET;
        }
        var actionPassed = 6;
        if (typeof action !== 'undefined') {
            actionPassed = action;
        }
        var pda = this.genQ(this.BusinessObject, MntConst._PDA, reqMethod, this.reqPostDataAddXhr.header, this.reqPostDataAddXhr.query, [], this.reqPostDataAddXhr.respParam, callback, obj, actionPassed);
        this.Q.push(pda);
        this.reqPostDataAddXhr.header = [];
        this.reqPostDataAddXhr.query = [];
        this.reqPostDataAddXhr.respParam = [];
        this.processQ(obj);
    };
    ;
    RiMaintenance.prototype.CBORequestClear = function () {
        this.cboObj.name = '';
        this.cboObj.method = 'POST';
        this.cboObj.query = [];
        this.cboObj.body = [];
        this.cboObj.callback = '';
    };
    RiMaintenance.prototype.CBORequestAddCS = function (name, type) { this.cboObj.query.push(name); };
    RiMaintenance.prototype.CBORequestAdd = function (name) { this.cboObj.body.push(name); };
    RiMaintenance.prototype.CBORequestExecute = function (obj, callback) {
        var cbo = this.genQ(this.CustomBusinessObjectAdditionalPostData, MntConst._CBO, MntConst._POST, [], this.cboObj.query, this.cboObj.body, [], callback, obj, 6);
        this.Q.push(cbo);
        this.cboObj = { name: '', method: MntConst._POST, query: [], body: [], callback: '' };
        this.processQ(obj);
    };
    RiMaintenance.prototype.AddTable = function (tableName) {
        this.mntObj.table = tableName;
        this.mntObj.keyFields = [];
        this.mntObj.outputFields = {};
    };
    RiMaintenance.prototype.AddTableKeyCS = function (fieldName, type) { this.mntObj.keyFields.push(fieldName); };
    RiMaintenance.prototype.AddTableKey = function (fieldName, type, param1, param2, param3) { this.mntObj.keyFields.push(fieldName); };
    RiMaintenance.prototype.AddTableKeyAlignment = function (fieldName, alignment) { if (this.mntObj.outputFields[fieldName])
        this.mntObj.outputFields[fieldName]['align'] = alignment; };
    RiMaintenance.prototype.AddTableField = function (fieldName, type, param, state, paramType, param1, param2) {
        this.mntObj.outputFields[fieldName] = { type: type, optParam: param, state: state, paramType: paramType };
    };
    RiMaintenance.prototype.AddTableFieldAlignment = function (fieldName, alignment) { this.mntObj.outputFields[fieldName]['align'] = alignment; };
    RiMaintenance.prototype.AddTableFieldPostData = function (fieldName, postData) { this.mntObj.outputFields[fieldName]['postData'] = postData; };
    RiMaintenance.prototype.AddTableCommit = function (obj, callback, mode) {
        for (var id in this.mntObj.outputFields) {
            if (id !== '') {
                if (this.mntObj.outputFields[id].paramType === 'Required') {
                    this.riExchange.riInputElement.SetRequiredStatus(obj.uiForm, id, true);
                }
                if (this.mntObj.outputFields[id].optParam === 'eFieldOptionRequired') {
                    this.riExchange.riInputElement.SetRequiredStatus(obj.uiForm, id, true);
                }
                if (this.mntObj.outputFields[id].paramType === 'ReadOnly') {
                    this.riExchange.updateCtrl(obj.controls, id, 'disabled', true);
                    this.riExchange.riInputElement.Disable(obj.uiForm, id);
                }
                if (this.mntObj.outputFields[id].state === 'eFieldStateReadOnly') {
                    this.riExchange.updateCtrl(obj.controls, id, 'disabled', true);
                    this.riExchange.riInputElement.Disable(obj.uiForm, id);
                }
                this.riExchange.updateCtrl(obj.controls, id, 'type', this.mntObj.outputFields[id].type);
            }
        }
        var table = this.genQ(this.mntObj.table, MntConst._TABLE, (mode) ? mode : MntConst._GET, [], this.mntObj.keyFields, [], this.mntObj.outputFields, callback, obj, 0);
        switch (this.CurrentMode) {
            case MntConst.eModeUpdate:
                this.Q.push(table);
                this.processQ(obj);
                break;
            default:
                if (callback)
                    callback.call(obj);
        }
    };
    RiMaintenance.prototype.AddVirtualTable = function (tableName, alias) {
        this.virtualTableObj.table = tableName;
        this.virtualTableObj.keyFields = [];
        this.virtualTableObj.outputFields = [];
    };
    RiMaintenance.prototype.AddVirtualTableKeyCS = function (fieldName, type) { this.virtualTableObj.keyFields.push(fieldName); };
    RiMaintenance.prototype.AddVirtualTableKey = function (fieldName, type, state, paramA, paramB, paramC, paramD) {
        var key = fieldName;
        if (typeof paramC !== 'undefined') {
            key = (paramC === '') ? fieldName : fieldName + '#' + paramC;
        }
        if (typeof paramB !== 'undefined') {
            key = (paramB !== '') ? fieldName + '$' + paramB : key;
        }
        this.virtualTableObj.keyFields.push(key);
    };
    RiMaintenance.prototype.AddVirtualTableField = function (fieldName, type, state, param, paramA) {
        var key = fieldName;
        if (typeof paramA !== 'undefined') {
            key = (paramA === '') ? fieldName : fieldName + '^' + paramA;
        }
        this.virtualTableObj.outputFields.push(key);
    };
    RiMaintenance.prototype.AddVirtualTableCommit = function (obj, callback) {
        var vtable = this.genQ(this.virtualTableObj.table, MntConst._VTABLE, MntConst._POST, [], this.virtualTableObj.keyFields, [], this.virtualTableObj.outputFields, callback, obj, 0);
        if (this.joinedTable) {
            vtable.type = MntConst._VTABLEJOION;
        }
        this.Q.push(vtable);
        if (this.joinedTable) {
            this.Q.push(this.joinedTable);
            this.joinedTable = null;
        }
        this.processQ(obj);
    };
    RiMaintenance.prototype.AddVirtualJoin = function (tableName, state, query) {
        this.virtualTableJoinObj.table = tableName;
        this.virtualTableJoinObj.keyFields = [];
        this.virtualTableJoinObj.outputFields = [];
        var queryStringArray = query.split(' AND ');
        if (queryStringArray.length === 1) {
            queryStringArray = query.split(' and ');
        }
        if (queryStringArray.length === 1) {
            queryStringArray = query.split(' And ');
        }
        for (var i = 0; i < queryStringArray.length; i++) {
            var q = queryStringArray[i].trim().split('=')[0];
            var field = q.trim().split('.')[1].trim();
            if (field) {
                this.virtualTableJoinObj.keyFields.push(field);
            }
        }
    };
    RiMaintenance.prototype.AddVirtualJoinField = function (fieldName, type, state, param, paramA) {
        var key = fieldName;
        if (typeof paramA !== 'undefined') {
            key = (paramA === '') ? fieldName : paramA;
        }
        this.virtualTableJoinObj.outputFields.push(key);
    };
    RiMaintenance.prototype.AddVirtualJoinCommit = function (obj) {
        this.joinedTable = this.genQ(this.virtualTableJoinObj.table, MntConst._VTABLE, MntConst._POST, [], this.virtualTableJoinObj.keyFields, [], this.virtualTableJoinObj.outputFields, '', obj, 0);
    };
    RiMaintenance.prototype.setIndependentVTableLookup = function (data) {
        if (data) {
            this.startLookUpExec = data;
        }
        else {
            this.startLookUpExec = false;
        }
    };
    RiMaintenance.prototype.processQ = function (obj) {
        var _this = this;
        var index = -1;
        for (var i = 0; i < this.Q.length; i++) {
            if (this.Q[i].status === MntConst._INIT && !this.processingFlag) {
                index = i;
                break;
            }
        }
        if (index > -1) {
            this.processingFlag = true;
            if (obj.ajaxSource) {
                obj.ajaxSource.next('START');
            }
            this.processingQindex = index;
            this.Q[index].status = MntConst._WIP;
            var name_1 = this.Q[index].name;
            var action = this.Q[index].action.toString();
            var method = this.Q[index].method;
            var header = this.Q[index].header;
            var query = this.Q[index].query;
            var respParams_1 = this.Q[index].respParams;
            var body = this.Q[index].body;
            var callback_1 = this.Q[index].callBk;
            var callbackRef_1 = this.Q[index].callBkRef;
            var search = new URLSearchParams();
            switch (this.Q[index].type) {
                case MntConst._TABLE:
                    {
                        for (var i = 0; i < query.length; i++) {
                            if (query[i] === 'BusinessCode') {
                                search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                                search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                                search.set(this.serviceConstants.Action, action);
                                search.set('ContractTypeCode', callbackRef_1.pageParams.CurrentContractType);
                            }
                            else {
                                search.set(query[i], callbackRef_1.riExchange.riInputElement.GetValue(callbackRef_1.uiForm, query[i]));
                            }
                        }
                        if (method === MntConst._GET) {
                            if (name_1 !== '*') {
                                this.flagXhrProcessing = true;
                                this.xhr.xhrGet(callbackRef_1.xhrParams.method, callbackRef_1.xhrParams.module, callbackRef_1.xhrParams.operation, search).then(function (data) {
                                    _this.flagXhrProcessing = false;
                                    _this.prevRespData = data;
                                    if (data.hasOwnProperty('errorNumber')) {
                                        _this.Q[index].status = MntConst._FAIL;
                                        if (typeof obj.showAlert === 'function') {
                                            obj.showAlert(data.errorNumber + ' - ' + data.errorMessage);
                                        }
                                        else if (typeof obj.parent.showAlert === 'function') {
                                            obj.parent.showAlert(data.errorNumber + ' - ' + data.errorMessage);
                                        }
                                    }
                                    else {
                                        _this.Q[index].status = MntConst._DONE;
                                        _this.renderResponse(callbackRef_1, _this.prevRespData, respParams_1);
                                        if (_this.starTableExecuted > 0) {
                                            _this.renderResponse(callbackRef_1, _this.prevRespData, _this.Q[_this.starTableExecuted].respParams);
                                            _this.starTableExecuted = -1;
                                        }
                                    }
                                    if (typeof callback_1 === 'function')
                                        callback_1.call(obj, _this.prevRespData);
                                    _this.startLookUpExec = true;
                                    _this.checkErrAndProcessNext(obj);
                                }, function (e) { _this.flagXhrProcessing = false; });
                            }
                            else {
                                this.starTableExecuted = index;
                                this.Q[index].status = MntConst._DONE;
                                this.renderResponse(callbackRef_1, this.prevRespData, respParams_1);
                                if (typeof callback_1 === 'function')
                                    callback_1.call(obj, this.prevRespData);
                                this.checkErrAndProcessNext(obj);
                            }
                        }
                        else {
                            this.flagXhrProcessing = true;
                            var formData = {};
                            var formDataObj = method.split('=');
                            formData[formDataObj[0]] = formDataObj[1];
                            this.xhr.xhrPost(callbackRef_1.xhrParams.method, callbackRef_1.xhrParams.module, callbackRef_1.xhrParams.operation, search, formData).then(function (data) {
                                _this.flagXhrProcessing = false;
                                _this.prevRespData = data;
                                if (data.hasOwnProperty('errorNumber')) {
                                    _this.Q[index].status = MntConst._FAIL;
                                    if (typeof obj.showAlert === 'function') {
                                        obj.showAlert(data.errorNumber + ' - ' + data.errorMessage);
                                    }
                                    else if (typeof obj.parent.showAlert === 'function') {
                                        obj.parent.showAlert(data.errorNumber + ' - ' + data.errorMessage);
                                    }
                                }
                                else {
                                    _this.Q[index].status = MntConst._DONE;
                                    _this.renderResponse(callbackRef_1, _this.prevRespData, respParams_1);
                                    if (_this.starTableExecuted > 0) {
                                        _this.renderResponse(callbackRef_1, _this.prevRespData, _this.Q[_this.starTableExecuted].respParams);
                                        _this.starTableExecuted = -1;
                                    }
                                }
                                if (typeof callback_1 === 'function')
                                    callback_1.call(obj, _this.prevRespData);
                                _this.startLookUpExec = true;
                                _this.checkErrAndProcessNext(obj);
                            });
                        }
                    }
                    break;
                case MntConst._VTABLE:
                case MntConst._VTABLEJOION:
                    {
                        if (this.startLookUpExec) {
                            var maxCount = 6;
                            if (this.Q[index].type === MntConst._VTABLEJOION) {
                                maxCount = 1;
                            }
                            var countTable = 0;
                            var lookupIP_1 = [];
                            for (var i = 0; i < this.Q.length; i++) {
                                if ((this.Q[i].type === MntConst._VTABLE || this.Q[i].type === MntConst._VTABLEJOION) &&
                                    (this.Q[i].status === MntConst._INIT || this.Q[i].status === MntConst._WIP)) {
                                    if (countTable < maxCount) {
                                        var tableObj = this.Q[i];
                                        this.Q[i].status = MntConst._DONE;
                                        if (this.Q[i].callBk) {
                                            callback_1 = this.Q[i].callBk;
                                        }
                                        var lookupItem = { 'table': tableObj.name, 'query': {}, 'fields': [], 'displayFields': {} };
                                        for (var j = 0; j < tableObj.query.length; j++) {
                                            var _key = tableObj.query[j];
                                            var _keySearch = _key;
                                            var _keyVal = '';
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
                                            }
                                            else {
                                                lookupItem.query[_key] = _keyVal;
                                            }
                                        }
                                        for (var k = 0; k < tableObj.respParams.length; k++) {
                                            var field = tableObj.respParams[k].split('^')[0];
                                            var displayFieldName = '';
                                            if (tableObj.respParams[k].indexOf('^') > -1) {
                                                displayFieldName = tableObj.respParams[k].split('^').pop();
                                            }
                                            else {
                                                displayFieldName = tableObj.respParams[k];
                                            }
                                            lookupItem.fields.push(field);
                                            lookupItem.displayFields[field] = displayFieldName;
                                        }
                                        lookupIP_1.push(lookupItem);
                                        countTable++;
                                    }
                                }
                            }
                            this.flagXhrProcessing = true;
                            this.LookUp.lookUpPromise(lookupIP_1).then(function (data) {
                                _this.flagXhrProcessing = false;
                                var respData = data;
                                if (respData) {
                                    for (var i = 0; i < respData.length; i++) {
                                        if (respData[i] !== null)
                                            if (respData[i].length > 0) {
                                                var _respData = respData[i][0];
                                                var _dispFields = lookupIP_1[i].displayFields;
                                                for (var j in _respData) {
                                                    if (j !== '') {
                                                        if (_dispFields[j])
                                                            obj.riExchange.riInputElement.SetValue(obj.uiForm, _dispFields[j], _respData[j]);
                                                    }
                                                }
                                            }
                                    }
                                    _this.checkErrAndProcessNext(obj);
                                }
                                if (typeof callback_1 === 'function') {
                                    callback_1.call(obj, _this.prevRespData);
                                }
                            }, function (e) { _this.flagXhrProcessing = false; });
                        }
                    }
                    break;
                case MntConst._CBO:
                    {
                        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                        search.set(this.serviceConstants.Action, action);
                        for (var i = 0; i < query.length; i++) {
                            if (query[i] === 'BusinessCode') {
                            }
                            else {
                                search.set(query[i], callbackRef_1.riExchange.riInputElement.GetValue(callbackRef_1.uiForm, query[i]));
                            }
                        }
                        var formData = {};
                        var CBOparam = name_1.trim().split('&');
                        for (var i = 0; i < CBOparam.length; i++) {
                            var keyValPair = CBOparam[i].split('=');
                            var functionCheck = keyValPair[0];
                            if (functionCheck.toUpperCase() === 'FUNCTION') {
                                formData['Function'] = keyValPair[1];
                            }
                            formData[keyValPair[0]] = keyValPair[1];
                        }
                        for (var i = 0; i < body.length; i++) {
                            formData[body[i]] = this.riExchange.riInputElement.GetValue(obj.uiForm, body[i]);
                            var dataType = this.getControlType(obj.controls, body[i], 'type');
                            formData[body[i]] = this.respDataFormatReq(dataType, formData[body[i]]);
                        }
                        this.flagXhrProcessing = true;
                        if (method === MntConst._POST) {
                            this.xhr.xhrPost(callbackRef_1.xhrParams.method, callbackRef_1.xhrParams.module, callbackRef_1.xhrParams.operation, search, formData).then(function (data) {
                                _this.flagXhrProcessing = false;
                                callback_1.call(obj, data);
                                _this.Q[index].status = MntConst._DONE;
                                _this.checkErrAndProcessNext(obj);
                            }, function (e) { _this.flagXhrProcessing = false; });
                        }
                    }
                    break;
                case MntConst._PDA:
                    {
                        if (method === MntConst._GET) {
                            var search_1 = new URLSearchParams();
                            search_1.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                            search_1.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                            search_1.set(this.serviceConstants.Action, action);
                            for (var i = 0; i < query.length; i++) {
                                var fieldValue = query[i].value;
                                fieldValue = this.respDataFormatReq(query[i].datatype, fieldValue);
                                search_1.set(query[i].key, fieldValue);
                            }
                            this.flagXhrProcessing = true;
                            this.xhr.xhrGet(callbackRef_1.xhrParams.method, callbackRef_1.xhrParams.module, callbackRef_1.xhrParams.operation, search_1).then(function (data) {
                                _this.flagXhrProcessing = false;
                                for (var i = 0; i < respParams_1.length; i++) {
                                    if (data.hasOwnProperty(respParams_1[i].key)) {
                                        data[respParams_1[i].key] = _this.respDataFormatUI(respParams_1[i].datatype, data[respParams_1[i].key]);
                                    }
                                }
                                callback_1.call(obj, data);
                                _this.Q[index].status = MntConst._DONE;
                                _this.checkErrAndProcessNext(obj);
                            }, function (e) { _this.flagXhrProcessing = false; });
                        }
                        else {
                            var search_2 = new URLSearchParams();
                            search_2.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                            search_2.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                            search_2.set(this.serviceConstants.Action, action);
                            var formData = {};
                            for (var i = 0; i < query.length; i++) {
                                var fieldValue = query[i].value;
                                if (!fieldValue) {
                                    fieldValue = this.riExchange.riInputElement.GetValue(obj.uiForm, query[i].key);
                                }
                                fieldValue = this.respDataFormatReq(query[i].datatype, fieldValue);
                                fieldValue = (fieldValue === undefined) ? '' : fieldValue;
                                formData[query[i].key] = fieldValue;
                            }
                            this.flagXhrProcessing = true;
                            if (method === MntConst._POST) {
                                this.xhr.xhrPost(callbackRef_1.xhrParams.method, callbackRef_1.xhrParams.module, callbackRef_1.xhrParams.operation, search_2, formData).then(function (data) {
                                    _this.flagXhrProcessing = false;
                                    for (var i = 0; i < respParams_1.length; i++) {
                                        if (data.hasOwnProperty(respParams_1[i].key)) {
                                            data[respParams_1[i].key] = _this.respDataFormatUI(respParams_1[i].datatype, data[respParams_1[i].key]);
                                        }
                                    }
                                    callback_1.call(obj, data);
                                    _this.Q[index].status = MntConst._DONE;
                                    _this.checkErrAndProcessNext(obj);
                                }, function (e) { _this.flagXhrProcessing = false; });
                            }
                        }
                    }
                    break;
                case MntConst._FN: {
                    setTimeout(function () {
                        if (typeof callbackRef_1[name_1] === 'function') {
                            if (!_this.CancelEvent) {
                                if (name_1 === 'confirm') {
                                    if (!_this.flagXhrProcessing) {
                                        callbackRef_1[name_1].call(obj);
                                    }
                                    else {
                                        _this.pendingFnObj = callbackRef_1[name_1];
                                    }
                                }
                                else {
                                    callbackRef_1[name_1].call(obj);
                                }
                            }
                            else {
                                if (typeof callbackRef_1['hideSpinner'] === 'function')
                                    callbackRef_1['hideSpinner'].call(obj);
                            }
                        }
                        else {
                        }
                    }, 500);
                    this.Q[index].status = MntConst._DONE;
                    this.checkErrAndProcessNext(obj);
                    break;
                }
            }
        }
        else {
            if (obj.ajaxSource) {
                obj.ajaxSource.next('COMPLETE');
            }
        }
    };
    RiMaintenance.prototype.handleConfirm = function (obj) {
        if (typeof this.pendingFnObj === 'function')
            this.pendingFnObj.call(obj);
        this.pendingFnObj = null;
    };
    RiMaintenance.prototype.renderResponse = function (obj, data, respParams) {
        for (var id in data) {
            if (id !== '') {
                var respData = data[id];
                if (respParams.hasOwnProperty(id)) {
                    if (respParams[id].hasOwnProperty('type')) {
                        this.riExchange.updateCtrl(obj.controls, id, 'type', respParams[id].type);
                        respData = this.respDataFormatUI(respParams[id].type, respData);
                        if (respParams[id].type === MntConst.eTypeDate) {
                            this.updateDateField(obj, respData, id, respParams[id]);
                        }
                    }
                    this.riExchange.updateCtrl(obj.controls, id, 'value', respData);
                    obj.riExchange.riInputElement.SetValue(obj.uiForm, id, respData);
                }
            }
        }
    };
    RiMaintenance.prototype.renderResponseForCtrl = function (obj, data) {
        for (var id in data) {
            if (id) {
                var respData = data[id];
                var ctrlType = this.getControlType(obj.controls, id, 'type');
                if (ctrlType) {
                    respData = this.respDataFormatUI(ctrlType, respData);
                    if (ctrlType === MntConst.eTypeDate) {
                        this.updateDateField(obj, respData, id);
                    }
                    this.riExchange.updateCtrl(obj.controls, id, 'value', respData);
                    obj.riExchange.riInputElement.SetValue(obj.uiForm, id, respData);
                }
                else {
                    this.riExchange.updateCtrl(obj.controls, id, 'value', respData);
                    obj.riExchange.riInputElement.SetValue(obj.uiForm, id, respData);
                }
            }
        }
    };
    RiMaintenance.prototype.respDataFormatUI = function (type, value) {
        var returnValue = value;
        switch (type) {
            case MntConst.eTypeCheckBox:
                returnValue = this.utils.convertResponseValueToCheckboxInput(returnValue);
                break;
            case MntConst.eTypeInteger:
                if (typeof returnValue === 'string')
                    returnValue = (returnValue.trim() !== '') ? parseInt(returnValue, 10) : '';
                break;
            case MntConst.eTypeCurrency:
                if (typeof returnValue === 'string')
                    returnValue = (returnValue.trim() !== '') ? this.utils.cCur(returnValue) : '';
                break;
            case MntConst.eTypeDate:
                if (returnValue)
                    returnValue = this.utils.convertDate(this.utils.convertAnyToUKString(returnValue));
                break;
            case MntConst.eTypeDateText:
                if (returnValue)
                    returnValue = this.utils.convertAnyToUKString(returnValue);
                break;
            case MntConst.eTypeTime:
                returnValue = this.utils.secondsToHms(returnValue);
                break;
        }
        return returnValue;
    };
    RiMaintenance.prototype.respDataFormatReq = function (type, value) {
        var returnValue = value;
        switch (type) {
            case MntConst.eTypeCheckBox:
                returnValue = this.utils.convertCheckboxValueToRequestValue(returnValue);
                break;
            case MntConst.eTypeTime:
                returnValue = this.utils.TimeValue(returnValue);
                break;
            case MntConst.eTypeCurrency:
                returnValue = this.utils.CCurToNum(returnValue);
                break;
            case MntConst.eTypeDate:
            case MntConst.eTypeDateText:
                if (returnValue) {
                    if (typeof returnValue === 'object') {
                        returnValue = this.utils.formatDate(returnValue);
                    }
                }
                break;
        }
        if (returnValue === null || returnValue === undefined) {
            returnValue = '';
        }
        return returnValue;
    };
    RiMaintenance.prototype.checkErrAndProcessNext = function (obj) {
        if (this.Q.length - 1 === this.processingQindex) {
            if (this.pendingFnObj && !this.isModalOpen) {
                this.pendingFnObj.call(obj);
                this.pendingFnObj = null;
            }
        }
        if (!this.CancelEvent) {
            this.processingFlag = false;
            this.processQ(obj);
        }
        else {
            this.clearQ();
            if (obj.ajaxSource) {
                obj.ajaxSource.next('COMPLETE');
            }
        }
    };
    RiMaintenance.prototype.updateDateField = function (obj, value, id, ctrlObj) {
        if (obj.pageParams['dt' + id]) {
            obj.pageParams['dt' + id].value = value;
            if (ctrlObj) {
                obj.pageParams['dt' + id].disabled = (ctrlObj.disabled) ? true : false;
                obj.pageParams['dt' + id].required = (ctrlObj.paramType === 'Required') ? true : false;
            }
        }
    };
    RiMaintenance.prototype.getControlType = function (ctrlObj, id, key) {
        for (var i = 0; i < ctrlObj.length; i++) {
            var fieldObj = ctrlObj[i];
            if (fieldObj.name === id) {
                return (!fieldObj[key]) ? '' : fieldObj[key];
            }
        }
        return '';
    };
    return RiMaintenance;
}());
export var RiTab = (function () {
    function RiTab(tabObj, utils) {
        this.utils = utils;
        this.tabLength = 0;
        this.currentTab = 0;
        this.tabObject = tabObj;
        var len = 0;
        for (var tab in this.tabObject) {
            if (tab !== '') {
                len++;
            }
        }
        this.tabLength = len;
    }
    RiTab.prototype.TabFocus = function (tabIndex) {
        this.currentTab = tabIndex;
        var elem = document.querySelector('.nav-tabs').children;
        for (var i_1 = 0; i_1 < elem.length; i_1++) {
            if (this.utils.hasClass(elem[i_1], 'error')) {
                this.utils.removeClass(elem[i_1], 'active');
                this.utils.removeClass(document.querySelector('.tab-content').children[i_1], 'active');
            }
        }
        var i = 0;
        for (var tab in this.tabObject) {
            if (tab !== '') {
                i++;
                this.tabObject[tab].active = (i === tabIndex) ? true : false;
            }
        }
        this.utils.addClass(elem[tabIndex - 1], 'active');
        this.utils.addClass(document.querySelector('.tab-content').children[tabIndex - 1], 'active');
        setTimeout(this.utils.makeTabsRed(), 200);
    };
    RiTab.prototype.TabDraw = function () { };
    RiTab.prototype.TabSet = function () { };
    RiTab.prototype.TabClear = function () {
        for (var tab in this.tabObject) {
            if (tab !== '') {
                this.tabObject[tab].visible = false;
            }
        }
    };
    RiTab.prototype.TabAdd = function (tabId) {
        for (var tab in this.tabObject) {
            if (tab !== '') {
                if (this.tabObject[tab].name === tabId) {
                    this.tabObject[tab].visible = true;
                }
            }
        }
    };
    RiTab.prototype.getCurrentActiveTab = function () {
        var i = 0;
        for (var tab in this.tabObject) {
            if (tab !== '') {
                i++;
                if (this.tabObject[tab].active) {
                    this.currentTab = i;
                    return i;
                }
            }
        }
    };
    RiTab.prototype.getNextActiveTab = function (tabindex) {
        var i = 0;
        for (var tab in this.tabObject) {
            if (tab !== '') {
                i++;
                if (this.tabObject[tab].visible && i > tabindex && i <= this.tabLength)
                    return i;
            }
        }
        return tabindex;
    };
    RiTab.prototype.focusFirstField = function () {
        var elem = document.querySelector('.tab-content').children[this.currentTab - 1];
        if (elem.querySelector('input'))
            elem.querySelector('input').focus();
        else if (elem.querySelector('textarea'))
            elem.querySelector('textarea').focus();
    };
    RiTab.prototype.focusNextTab = function (obj) {
        if (obj.relatedTarget || obj.keyCode === 9) {
            var currtab = this.getCurrentActiveTab();
            var focustab = this.getNextActiveTab(currtab);
            if (currtab !== focustab) {
                this.TabFocus(focustab);
                this.focusFirstField();
            }
            else {
                document.querySelector('#save')['focus']();
            }
        }
    };
    return RiTab;
}());
