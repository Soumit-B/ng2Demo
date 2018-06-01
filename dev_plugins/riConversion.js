var template = require('./template')();
var colors = require('colors');

module.exports = function () {
	var pageType = 'M';
	var modeUpdate = true;
	var modeAdd = true;
	var modeDelete = true;
	var pageTab = true;
	var pageOption = true;

	function init(data, fileName, params) {
		console.log('\nCONVERT:'.green, fileName);
		//console.log('INPUT:', params);

		//Parse Inputs
		pageType = params.type.toUpperCase();
		modeUpdate = (params.modeUpdate.toUpperCase() === 'Y') ? true : false;
		modeAdd = (params.modeAdd.toUpperCase() === 'Y') ? true : false;
		modeDelete = (params.modeDelete.toUpperCase() === 'Y') ? true : false;
		pageTab = (params.tabs.toUpperCase() === 'Y') ? true : false;
		pageOption = (params.option.toUpperCase() === 'Y') ? true : false;

		var dataArray = data.split('\n');
		var flag = false;

		var _SpeedScript = [];
		var _VBScript = [];
		var _generic = [];

		//Iterate the file once
		for (var i = 0; i < dataArray.length; i++) {
			var codeLine = dataArray[i].trim();
			if (codeLine !== '') {
				//Detect programing language
				if (codeLine.toLowerCase().indexOf('<script ') > -1) {
					var lang = getLanguage(codeLine).language.toLowerCase();
					flag = true;
				}

				if (flag) {
					switch (lang) {
						case 'speedscript': _SpeedScript.push(codeLine); break;
						case 'vbscript': _VBScript.push(codeLine); break;
					}
				} else {
					_generic.push(codeLine); //HTML
				}

				if (codeLine.toLowerCase().indexOf('</script>') > -1) flag = false;
			}
		}

		var result = [];
		result.push('/*');
		if (pageType !== 'E') result.push('* Maintenenace page - define route');
		else result.push('* Search/Ellipsis page - route not required');
		result.push('*/');
		result.push('\n');
		result.push('//Import statements goes here');
		result.push('\n');

		var componentName = fileName.split('.')[0].replace(/icabs/gi, '');
		result.push('@Component({ templateUrl: iCABS' + componentName + '.html })');
		result.push('\n');

		if (pageType !== 'E') result.push('export class ' + componentName + 'Component extends BaseComponent implements OnInit, OnDestroy, AfterViewInit, QueryParametersCallback {');
		else result.push('export class ' + componentName + 'Component implements OnInit, OnDestroy, AfterViewInit, QueryParametersCallback {');

		result = result.concat(insertBasicTemplate('iCABS' + componentName));

		result = result.concat(processSpeedScripts(_SpeedScript));

		result = result.concat(processVBScript(_VBScript));

		//result = result.concat(_generic); //These changes needs to be updated in the html file

		result.push('\n');
		result.push('}');
		result.push('\n');
		return result.join('\n');
	}

	function getLanguage(line) {
		var codeLine = line;
		var retData = {};
		codeLine = codeLine.replace(/<script /gi, '').replace(/<\/script>/gi, '').replace(/>/gi, '').replace(/"/g, '');
		codeLine = codeLine.split(' ');
		codeLine.map(function (i) {
			var tempLine = i.replace(/ /g, '').replace(/language/gi, 'language').split('=');
			retData[tempLine[0]] = tempLine[1];
		});
		return retData;
	}

	function getSpaces(n) {
		var space = '	';
		var retStr = '';
		for (var i = 0; i < n; i++) {
			retStr += space;
		}
		return retStr;
	}

	function insertBasicTemplate(filename) {
		var code = [];
		var tempCode = '';

		tempCode += `	
			//TODO - If no grid present
			@ViewChild('Grid') Grid: GridComponent;
			@ViewChild('GridPagination') GridPagination: PaginationComponent;

			public controls = [];

			public queryParams: any;
			public isRequesting = false;
			public promptContent: string = MessageConstant.Message.ConfirmRecord;
			public modalConfig: any = { backdrop: 'static', keyboard: true };

			//Ellipsis
			@ViewChild('PrepCodeEllipsis') PrepCodeEllipsis: EllipsisComponent;
			public ellipsis = {
				PrepCodeEllipsis: {
					disabled: false,
					showCloseButton: true,
					showHeader: true,
					childparams: {
						'parentMode': 'LookUp'
					},
					component: ScreenNotReadyComponent //TODO iCABSBPreparationSearch.htm
				}
			};

			public uiDisplay = {
				cmdGetAddress: true,
				menu: true
			};
			public dropDown = {
				menu: []
			};`;

		tempCode += `
			public pageId: string;
			public xhr: any;
			public xhrParams = {
				module: 'input-req', //TODO
				method: 'input-req', //TODO
				operation: 'input-req' //TODO
			};

			constructor(injector: Injector) {
				super(injector);
				this.pageId = PageIdentifier.` + filename.toUpperCase() + `;
				this.setURLQueryParameters(this);
			}

			private doLookup(): any {
				//TODO If Required
				/*let lookupIP = [
					{
						'table': 'CustomerTypeLanguage',
						'query': { 'BusinessCode': this.utils.getBusinessCode(), 'LanguageCode': this.riExchange.LanguageCode() },
						'fields': ['CustomerTypeCode', 'CustomerTypeDesc']
					}
				];
				this.LookUp.lookUpPromise(lookupIP).then((data) => {
					this.logger.log('Lookup data', data);
				});*/
			}

			private flagInit = false;
			ngOnInit(): void {
				super.ngOnInit();
			}

			ngAfterViewInit(): void {
				this.flagInit = true;
				this.showSpinner();
				this.init();
			}

			ngOnDestroy(): void {
				super.ngOnDestroy();
			}

			public getURLQueryParameters(param: any): void {
				this.queryParams = param;
				this.showSpinner();
				if (this.flagInit) { this.init(); }
			}

			public currentActivity = '';
			public callbackHooks: any = [];
			public callbackPrompts: any = []; `;

		if (pageTab) {
			tempCode += `
			public tab = {
				tab1: { id: 'grdAddress', name: 'Address', visible: false, active: true },
				tab2: { id: 'grdSRA', name: 'Risk Assessment Grid', visible: false, active: false },
				tab3: { id: 'grdSRAText', name: 'Risk Assessment Text', visible: false, active: false },
				tab4: { id: 'grdTimeWindow', name: 'Time Windows', visible: false, active: false }
			};

			private init(): void {
				this.pageParams.vBusinessCode = this.utils.getBusinessCode();
				this.pageParams.vCountryCode = this.utils.getCountryCode();
				this.parentMode = this.riExchange.getParentMode();

				this.getSysCharDtetails();
				this.doLookup();

				this.riTab = new RiTab(this.tab, this.utils);
				this.tab = this.riTab.tabObject;
				this.riTab.TabAdd('Address');
				this.riTab.TabAdd('Risk Assessment Grid');
				this.riTab.TabAdd('Risk Assessment Text');
				this.riTab.TabAdd('Time Windows');

				this.updateButton();
				this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
				this.clearAllFields('save, cancel, delete');
				this.window_onload();
			}`;
		} else {
			tempCode += `
			private init(): void {
				this.pageParams.vBusinessCode = this.utils.getBusinessCode();
				this.pageParams.vCountryCode = this.utils.getCountryCode();
				this.parentMode = this.riExchange.getParentMode();

				this.getSysCharDtetails();
				this.doLookup();

				this.updateButton();
				this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
				this.clearAllFields('save, cancel, delete');
				this.window_onload();
			}`;
		}

		tempCode += `
			public save(mode?: any): void {
				let status = true;
				this.riMaintenance.clearQ();
				status = this.riExchange.validateForm(this.uiForm);

				if (mode) {
					this.riMaintenance.CurrentMode = mode;
				} else {
					//TODO - below lines based on condition
					switch (this.parentMode) {
						case 'PrepMixAdd':
							this.riMaintenance.CurrentMode = MntConst.eModeAdd;
							break;
						case 'PrepMixUpdate':
							this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
							break;
					}
				}

				this.logger.log('SAVE clicked', this.riMaintenance.CurrentMode, this.uiForm.status, status);
				if (this.uiForm.status === 'VALID') {
					status = true;
				} else {
					if (!status) {
						for (let control in this.uiForm.controls) {
							if (this.uiForm.controls[control].invalid) {
								this.logger.log('DEBUG validateForm -- INVALID formControl:', control);
							}
						}
					}
				}

				if (status) {
					this.promptTitle = MessageConstant.Message.ConfirmTitle;
					this.promptContent = MessageConstant.Message.ConfirmRecord;`;
		if (modeUpdate) {
			tempCode += `
					//Update
					if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
						this.riMaintenance.CurrentMode = MntConst.eModeSaveUpdate;
						this.promptContent = MessageConstant.Message.ConfirmRecord;
					}`;
		}

		if (modeAdd) {
			tempCode += `
					//Add
					if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
						this.riMaintenance.CurrentMode = MntConst.eModeSaveAdd;
						this.promptContent = MessageConstant.Message.ConfirmRecord;
					}`;
		}

		if (modeDelete) {
			tempCode += `
					//Delete
					if (this.riMaintenance.CurrentMode === MntConst.eModeDelete) {
						this.promptContent = MessageConstant.Message.DeleteRecord;
					}`;
		}

		tempCode += `
					this.riMaintenance.CancelEvent = false;
					this.riMaintenance.execMode(this.riMaintenance.CurrentMode, [this]);
				}
			}

			public cancel(): void {
				this.routeAwayGlobals.setSaveEnabledFlag(false);
				this.markAsPristine();`;

		if (modeUpdate) {
			tempCode += `
				//Update Mode
				if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate || this.riMaintenance.CurrentMode === MntConst.eModeSaveUpdate) {
					this.riMaintenance.CurrentMode = MntConst.eModeUpdate; //On cancel -> Update mode
					for (let i = 0; i < this.controls.length; i++) {
						this.riExchange.updateCtrl(this.controls, this.controls[i].name, 'value', this.controls[i].value);
						this.setControlValue(this.controls[i].name, this.controls[i].value);
					}
					this.updateButton();
					this.onChangeFn(null, '', 'PrepCode');
				}`
		};

		if (modeAdd) {
			tempCode += `
				//Add Mode
				if (this.riMaintenance.CurrentMode === MntConst.eModeAdd || this.riMaintenance.CurrentMode === MntConst.eModeSaveAdd) {
					this.clearAllFields('save, cancel, delete');
					//TODO - Open ellipsis
				}`;
		}

		tempCode += `
			}`;

		if (modeDelete) {
			tempCode += `
			public delete(): void {
				this.riMaintenance.CurrentMode = MntConst.eModeDelete;
				this.save(this.riMaintenance.CurrentMode);
			}`;
		}

		tempCode += `
			public confirm(): any {
				this.isModalOpen(true);
				this.modalAdvService.emitPrompt(
					new ICabsModalVO(
						this.promptContent,
						null,
						this.confirmed.bind(this),
						this.promptCancel.bind(this)
					)
				);
			}

			public confirmed(obj: any): any {
				this.logger.log('Prompt Confirmed');
				this.isModalOpen(false);
				if (this.callbackPrompts.length > 0) {
					let fn = this.callbackPrompts.pop();
					if (typeof fn === 'function') fn.call(this);
					this.callbackPrompts = [];
				} else {
					this.riMaintenance.CancelEvent = false;
					this.riMaintenance.execContinue(this.riMaintenance.CurrentMode, [this]);
				}
			}

			public promptCancel(): any {
				this.logger.log('Prompt Cancel');
				this.isModalOpen(false);
				if (this.callbackPrompts.length > 0) {
					let fn = this.callbackPrompts.pop();
					if (typeof fn === 'function') fn.call(this);
					this.callbackPrompts = [];
				}
			}

			public showAlert(msgText: string, type?: number, msgObj?: any): void {
				this.logger.log('showAlert', msgText, msgObj);
				if (typeof type === 'undefined') type = 0;
				let fullError = (msgObj) ? msgObj.fullError : '';
				this.isModalOpen(true);
				switch (type) {
					default:
					case 0:
						this.modalAdvService.emitError(new ICabsModalVO(msgText, fullError));
						break;
					case 1:
					case 2:
						this.modalAdvService.emitMessage(new ICabsModalVO(msgText, fullError));
						break;
				}
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
				this.isRequesting = false;
			}

			public markAsPristine(): void {
				for (let i = 0; i < this.controls.length; i++) {
					this.uiForm.controls[this.controls[i].name].markAsPristine();
				}
			}

			public fieldValidateTransform(event: any): void {
				let retObj = this.utils.fieldValidateTransform(event);
				this.setControlValue(retObj.id, retObj.value);
				if (!retObj.status) {
					this.riExchange.riInputElement.markAsError(this.uiForm, retObj.id);
				}
			}

			public updateButton(): void {
				this.utils.getTranslatedval('Save').then((res: string) => { this.setControlValue('save', res); });
				this.utils.getTranslatedval('Cancel').then((res: string) => { this.setControlValue('cancel', res); });
				this.utils.getTranslatedval('Delete').then((res: string) => { this.setControlValue('delete', res); });
			}

			public clearAllFields(ignoreFields?: string): void {
				let ignoreFieldsArray = ignoreFields.split(',').map((val) => { return val.trim(); });
				for (let i = 0; i < this.controls.length; i++) {
					if (ignoreFieldsArray.indexOf(this.controls[i].name) === -1) {
						this.controls[i].value = '';
					}
				}
				this.riExchange.renderForm(this.uiForm, this.controls); //Form Redraw
				this.markAsPristine();
				this.updateButton();
			}

			//Change Function
			public onChangeFn(event: any, id?: string, fieldName?: string): void {
				let target = (event) ? (event.target || event.srcElement || event.currentTarget) : null;
				let idAttr = (target) ? target.attributes.id.nodeValue : (fieldName ? fieldName : '');
				let value = (target) ? target.value : '';

				switch (idAttr) {
					case 'PrepCode':
						this.riMaintenance.AddVirtualTable('Prep');
						this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
						this.riMaintenance.AddVirtualTableKey('PrepCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
						this.riMaintenance.AddVirtualTableField('PrepDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
						this.riMaintenance.AddVirtualTableCommit(this);
						break;
				}
			}

			public EllipsisDataCallback(ellipsisRef: string, dataObj: any): void {
				//TODO
				this.logger.log('Debug EllipsisDataCallback', ellipsisRef, dataObj);
			}
			public EllipsisClosed(ellipsisRef?: string): void {
				//TODO
				this.logger.log('Debug EllipsisClosed', ellipsisRef);
			}

			@ViewChild('routeAwayComponent') public routeAwayComponent;
			public canDeactivate(): Observable<boolean> {
				return super.canDeactivate();
			}`;

		code.push(tempCode);
		return code.join('\n');
	}

	function processSpeedScripts(data) {
		var retData = [];
		for (var i = 0; i < data.length; i++) {
			if (!/[<|/]script/i.test(data[i])) {
				var ignoreList = 'END.' + '|' +
					'DO ON ERROR UNDO, RETURN ERROR RETURN-VALUE:' + '|' +
					'{riModel.i}' + '|' +
					'{riCountryFunctions.i}' + '|' +
					'{riTranslationFunctions.i}' + '|' +
					'{iCABSHTMLFunctions.i}' + '|' +
					'{iCABSSystemCharFunctions.i}' + '|' +
					'/* Includes */';
				ignoreList = ignoreList.toLowerCase().split('|');
				if (ignoreList.indexOf(data[i].toLowerCase()) === -1) retData.push(data[i]);
			}
		}

		//Process SpeedScript Block
		var processedRetData = [];
		processedRetData.push('//SpeedScript');
		var blockProcessFlag = false;
		processedRetData.push('private getSysCharDtetails(): any {');
		var blockSysChar = [];
		var flagIgnore = false;
		var ignoreTempLine = '';

		for (var i = 0; i < retData.length; i++) {
			retData[i] = retData[i].replace(/\s\s+/g, ' '); //Replace all spaces & tabs with single space

			//Detect blocks
			var blockStartIdentifiers = '/*' + '|' +
				'&IF' + '|' +
				'RUN' + '|' +
				'DEFINE' + '|' +
				'FIND' + '|' +
				'DO' + '|' +
				'{&out}' + '|' +
				'IF';
			blockStartIdentifiers = blockStartIdentifiers.toLowerCase().split('|');

			var blockEndIdentifiers = '*/' + '|' +
				'&ENDIF' + '|' +
				'.';
			blockEndIdentifiers = blockEndIdentifiers.toLowerCase().split('|');

			var identifierStart = retData[i].toLowerCase().split(' ')[0];
			var identifierEnd = retData[i].toLowerCase().split(' ').pop();

			var code = '';
			if (blockStartIdentifiers.indexOf(identifierStart) > -1) {
				var codeLine = '';
				//Process SpeedScript line
				switch (identifierStart) {
					case '/*':
						//Ignore comments
						blockProcessFlag = false;
						break;
					case '&if':
						//TODO - Do nothing for now
						blockProcessFlag = false;
						break;
					case 'if':
						blockProcessFlag = true;
						flagIgnore = true;
						break;
					case 'run':
						blockProcessFlag = true;

						codeLine = retData[i];
						codeLine = codeLine.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ')
							.replace(/\{/g, ' { ').replace(/\}/g, ' } ')
							.replace(/\b(run )\b/gi, '')
							.replace(' .', '')
							.replace(/\s\s+/g, ' ');

						if (codeLine.toLowerCase() === 'i_HTMLGetCurrentBusiness ( OUTPUT vBusinessCode )'.toLowerCase()) {
							codeLine = 'this.pageParams.vBusinessCode = this.utils.getBusinessCode();';
						} else {
							//Detect Syschar
							codeLine = codeLine.replace(/\(/gi, '').replace(/\)/gi, '')
								.replace(/\{/gi, '').replace(/\}/gi, '')
								.replace(/INPUT vBusinessCode/gi, '')
								.replace(/,/g, '')
								.replace(/\s\s+/g, ' ');

							codeLine = codeLine.replace(/INPUT &SYSTEMCHAR_/gi, 'this.sysCharConstants.SystemChar')
								.replace(/OUTPUT /gi, 'OUTPUT_');

							var sysCharType = codeLine.split(' ')[0];
							switch (sysCharType.toLowerCase()) {
								case 'i_getbusinesssystemcharrequired':
									blockSysChar.push({
										type: 'Required',
										input: codeLine.split(' ')[1],
										output: (codeLine.split(' ')[2]).replace(/OUTPUT_/i, 'this.pageParams.')
									});
									break;
								case 'i_getbusinesssystemcharlogical':
									blockSysChar.push({
										type: 'Logical',
										input: codeLine.split(' ')[1],
										output: (codeLine.split(' ')[2]).replace(/OUTPUT_/i, 'this.pageParams.') + ',' +
										(codeLine.split(' ')[3]).replace(/OUTPUT_/i, 'this.pageParams.')
									});
									break;
								case 'i_getbusinesssystemcharinteger':
									blockSysChar.push({
										type: 'Integer',
										input: codeLine.split(' ')[1],
										output: (codeLine.split(' ')[2]).replace(/OUTPUT_/i, 'this.pageParams.') + ',' +
										(codeLine.split(' ')[3]).replace(/OUTPUT_/i, 'this.pageParams.')
									});
									break;
								default:
							}
						}
						retData[i] = '';
						break;
					case 'define':
						blockProcessFlag = true;

						retData[i].split(' ').forEach(function (val) {
							if (val) {
								if ('DEFINE VARIABLE AS NO-UNDO NO-UNDO. INITIAL "". .'.toLowerCase().split(' ').indexOf(val.toLowerCase()) === -1) {
									if ('CHARACTER LOGICAL INTEGER'.toLowerCase().split(' ').indexOf(val.toLowerCase()) === -1) {
										codeLine = 'this.pageParams.' + val + ' = ';
									} else {
										switch (val.toLowerCase()) {
											case 'character': codeLine += '\'\';'; break;
											case 'logical': codeLine += 'false;'; break;
											case 'integer': codeLine += '0;'; break;
										}
									}
								}
							}
						});
						if (codeLine) retData[i] = codeLine;

						break;
					case 'find':
						blockProcessFlag = true;
						flagIgnore = true;
						break;
					case 'do':
						blockProcessFlag = true;
						flagIgnore = true;
						break;
					case '{&out}':
						blockProcessFlag = true;
						flagIgnore = true;
						break;
				}

				if (blockProcessFlag) {
					code = retData[i];

					switch (identifierEnd) {
						case '*/':
							blockProcessFlag = false;
							break;
						case '&endif':
							blockProcessFlag = false;
							break;
						default:
							if (identifierEnd.split('').pop() === '.') {
								blockProcessFlag = false;
							}
					}
				}

				if (code) {
					if (!flagIgnore) processedRetData.push(code);
					else {
						ignoreTempLine += code + ' ';
						if (code.split('').pop() === '.') ignoreTempLine += '<|';
						code = '';
					}
				}

			}
		}

		//RUN START-------------------------------------------------------
		var tempLine = '';
		var tempOutLine = '';
		for (var i = 0; i < blockSysChar.length; i++) {
			if (i === 0) { //First
				tempLine += '\nlet sysCharList: number[] = [\n';
				tempLine += '\t' + blockSysChar[i].input + ', //' + blockSysChar[i].type + ' \n';
			} else if (i === blockSysChar.length - 1) { //last
				tempLine += '\t' + blockSysChar[i].input + ' //' + blockSysChar[i].type + ' \n';
				tempLine += '];\n';
			} else { //Rest
				tempLine += '\t' + blockSysChar[i].input + ', //' + blockSysChar[i].type + ' \n';
			}

			switch (blockSysChar[i].type) {
				case 'Required':
					tempOutLine += '\t' + blockSysChar[i].output + ' = records[' + i + '].Required;\n';
					break;
				case 'Logical':
					blockSysChar[i].output.split(',').forEach(function (val, j) {
						if (j == 0) tempOutLine += '\t' + val + ' = records[' + i + '].Required;\n';
						else tempOutLine += '\t' + val + ' = records[' + i + '].Logical;\n';
					});
					break;
				case 'Integer':
					blockSysChar[i].output.split(',').forEach(function (val, j) {
						if (j == 0) tempOutLine += '\t' + val + ' = records[' + i + '].Required;\n';
						else tempOutLine += '\t' + val + ' = records[' + i + '].Integer;\n';
					});
					break;
			}
		}
		processedRetData.push(tempLine);
		processedRetData.push(`let sysCharIP = {
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
			`);
		processedRetData.push(tempOutLine + '\n');
		//RUN END-------------------------------------------------------

		//-------------------------------------------------------
		tempLine = ignoreTempLine.split('<|');

		tempLine.forEach(function (val, i) {
			val = val.trim();
			if (val) {
				if (val.split('').pop() === '.') val = val.substr(0, val.length - 1);
				identifierStart = val.split(' ')[0].toLowerCase();
				switch (identifierStart) {
					case 'if':
						val = val.replace(/\b(if )\b/gi, 'if (');
						val = val.replace(/\b(not)\b/gi, '!');
						val = val.replace(/\b(then)\b/gi, ') {');
						val = val.replace(/\b(assign)\b/gi, '');
						val = val.replace(/\b(available)\b/gi, '');
						val = val.replace(/"/gi, '\'');
						val = val + '; }';
						break;
					case 'find':
					case 'do':
						val = '\n//TODO: ' + val;
						break;
					default:
						val = '//TODO: ' + val;
				}
				processedRetData.push(val);
			}
		});
		//-------------------------------------------------------

		processedRetData.push('\nthis.window_onload();\n});');
		processedRetData.push('}');
		return processedRetData;
	}

	function processVBScript(data) {
		var retData = [];
		retData.push('//VBScript');

		for (var i = 0; i < data.length; i++) {
			if (!/[<|/]script/i.test(data[i])) {
				var ignoreList = '';
				ignoreList = ignoreList.toLowerCase().split('|');
				if (ignoreList.indexOf(data[i].toLowerCase()) === -1) retData.push(data[i]);
			}
		}

		//Process VBScript Block
		var processedRetData = [];
		var blockProcessFlag = false;

		var code = '';
		var dummyflag = false;
		for (var i = 0; i < retData.length; i++) {
			retData[i] = retData[i].replace(/\s\s+/g, ' '); //Replace all spaces & tabs with single space
			dummyflag = false;

			//Detect blocks
			var blockStartIdentifiers = 'SUB' + '|' +
				'FUNCTION' + '|' +
				'IF' + '|' +
				'DO_WHILE' + '|' +
				'<%' + '|' +
				'DO' + '|' +
				'FOR' + '|' +
				'WITH' + '|' +
				'SELECT_CASE';
			blockStartIdentifiers = blockStartIdentifiers.toLowerCase().split('|');

			var blockEndIdentifiers = 'END_SUB' + '|' +
				'END_FUNCTION' + '|' +
				'END_IF' + '|' +
				'LOOP' + '|' +
				'%>' + '|' +
				'END.' + '|' + 'END' + '|' +
				'NEXT' + '|' +
				'END_WITH' + '|' +
				'END_SELECT';
			blockEndIdentifiers = blockEndIdentifiers.toLowerCase().split('|');

			var temp = retData[i].trim();
			temp = temp.replace(/\b(do while)\b/gi, 'DO_WHILE');
			temp = temp.replace(/\b(select case)\b/gi, 'SELECT_CASE');
			temp = temp.replace(/\b(end sub)\b/gi, 'END_SUB');
			temp = temp.replace(/\b(end function)\b/gi, 'END_FUNCTION');
			temp = temp.replace(/\b(end if)\b/gi, 'END_IF');
			temp = temp.replace(/\b(end with)\b/gi, 'END_WITH');
			temp = temp.replace(/\b(end select)\b/gi, 'END_SELECT');
			var identifierStart = temp.toLowerCase().split(' ')[0];
			var identifierEnd = temp.toLowerCase().split(' ').pop();

			// console.log('Debug'.yellow, identifierStart.red, blockStartIdentifiers.indexOf(identifierStart));
			if (blockStartIdentifiers.indexOf(identifierStart) > -1) {
				code = retData[i];
				switch (identifierStart) {
					case 'sub':
					case 'function':
						code = code.replace(/\b(sub)\b/gi, 'public');
						code = code.replace(/\b(function)\b/gi, 'public');
						code += ' (): any {';
						break;
					case 'if':
						code = code.replace(/\b(if)\b/gi, 'if (');
						code = code.replace(/\b(then)\b/gi, ' ');
						code = code.replace(/=/gi, '===');
						code = code.replace(/\b(not)\b/gi, '!');
						code = code.replace(/!===/gi, '!==');
						code += ' ) {';
						break;
					case 'do_while':
						code = code.replace(/\b(do while)\b/gi, 'while (');
						code += ' ) {';
						break;
					case 'select_case':
						code = code.replace(/\b(select case)\b/gi, 'switch (');
						code += ' ) {';
						break;
				}
				retData[i] = code;
				dummyflag = true;
			}

			// console.log('Debug'.yellow, identifierEnd.red, blockEndIdentifiers.indexOf(identifierEnd));
			if (blockEndIdentifiers.indexOf(identifierEnd) > -1) {
				code = retData[i];
				switch (identifierEnd) {
					case 'end_sub':
					case 'end_function':
						code = code.replace(/\b(end sub)\b/gi, '}');
						code = code.replace(/\b(end function)\b/gi, '}');
						break;
					case 'end_if':
						code = code.replace(/\b(end if)\b/gi, '}');
						break;
					case 'end.':
					case 'end':
						code = code.replace(/\b(end.)\b/gi, '}');
						code = code.replace(/\b(end)\b/gi, '}');
						break;
					case 'end_select':
						code = code.replace(/\b(end select)\b/gi, '}');
						break;
					case 'end_with':
						code = code.replace(/\b(end with)\b/gi, '}');
						break;
				}
				retData[i] = code;
				dummyflag = true;
			}

			if (!dummyflag) {
				code = findnreplace(retData[i]);
				switch (identifierStart) {
					case 'case':
						code += ': ';
						break;
					default:
						code += ';';
				}

				retData[i] = code;
			}
		}

		return retData;
	}

	function findnreplace(data) {
		var result = data;
		result = result.replace(/'/gi, '///');
		result = result.replace(/dim /gi, 'let ');
		result = result.replace(/\b(Case)\b/gi, 'case');
		result = result.replace(/\b(Case Else)\b/gi, 'default: ');
		result = result.replace(/\b(elseif)\b/gi, '} else if {');
		result = result.replace(/\b(and)\b/gi, ' && ');
		result = result.replace(/\b(or)\b/gi, ' || ');
		result = result.replace(/\b(not)\b/gi, ' ! ');
		result = result.replace(/ & /gi, ' + ');
		result = result.replace(/Call riExchange.Functions/gi, 'this.riExchange');
		result = result.replace(/riInputElement.SetErrorStatus\(/gi, 'riInputElement.SetErrorStatus(this.uiForm,');
		result = result.replace(/"<%=riT\("/gi, '=\'');
		result = result.replace(/"\)%>"/gi, '\';');
		result = result.replace(/<>/gi, '!==');
		result = result.replace(/"/gi, '\'');
		result = result.replace(/riExchange.Functions./gi, 'this.riExchange.');
		result = result.replace(/riExchange.ParentMode/gi, 'this.parentMode');
		result = result.replace(/False/gi, 'false');
		result = result.replace(/True/gi, 'true');
		result = result.replace(/vbNullString/gi, '\'\'');
		result = result.replace(/\b(eKeyStateNormal)\b/gi, 'MntConst.eKeyStateNormal');
		result = result.replace(/\b(eKeyStateFixed)\b/gi, 'MntConst.eKeyStateFixed');
		result = result.replace(/\b(eKeyOptionNormal)\b/gi, 'MntConst.eKeyOptionNormal');
		result = result.replace(/\b(eAlignmentRight)\b/gi, 'MntConst.eAlignmentRight');
		result = result.replace(/\b(eAlignmentLeft)\b/gi, 'MntConst.eAlignmentLeft');
		result = result.replace(/\b(eAlignmentCenter)\b/gi, 'MntConst.eAlignmentCenter');
		result = result.replace(/\b(eTypeCode)\b/gi, 'MntConst.eTypeCode');
		result = result.replace(/\b(eTypeText)\b/gi, 'MntConst.eTypeText');
		result = result.replace(/\b(eTypeTextFree)\b/gi, 'MntConst.eTypeTextFree');
		result = result.replace(/\b(eTypeInteger)\b/gi, 'MntConst.eTypeInteger');
		result = result.replace(/\b(eTypeCodeNumeric)\b/gi, 'MntConst.eTypeCodeNumeric');
		result = result.replace(/\b(eTypeAutoNumber)\b/gi, 'MntConst.eTypeAutoNumber');
		result = result.replace(/\b(eTypeCurrency)\b/gi, 'MntConst.eTypeCurrency');
		result = result.replace(/\b(eTypeDate)\b/gi, 'MntConst.eTypeDate');
		result = result.replace(/\b(eTypeTime)\b/gi, 'MntConst.eTypeTime');
		result = result.replace(/\b(eTypeDecimal5)\b/gi, 'MntConst.eTypeDecimal5');
		result = result.replace(/\b(eTypeCheckBox)\b/gi, 'MntConst.eTypeCheckBox');
		result = result.replace(/\b(eFieldStateNormal)\b/gi, 'MntConst.eFieldStateNormal');
		result = result.replace(/\b(eFieldOptionNormal)\b/gi, 'MntConst.eFieldOptionNormal');
		result = result.replace(/\b(eFieldOptionRequired)\b/gi, 'MntConst.eFieldOptionRequired');
		result = result.replace(/\b(eFieldOptionRequried)\b/gi, 'MntConst.eFieldOptionRequired');
		result = result.replace(/\b(eFieldStateReadOnly)\b/gi, 'MntConst.eFieldStateReadOnly');
		result = result.replace(/\b(eVirtualKeyStateFixed)\b/gi, 'MntConst.eVirtualKeyStateFixed');
		result = result.replace(/\b(eVirtualKeyStateNormal)\b/gi, 'MntConst.eVirtualKeyStateNormal');
		result = result.replace(/\b(eVirtualFieldStateFixed)\b/gi, 'MntConst.eVirtualFieldStateFixed');
		result = result.replace(/\b(eVirtualFieldStateNormal)\b/gi, 'MntConst.eVirtualFieldStateNormal');
		result = result.replace(/\b(eModeUpdate)\b/gi, 'MntConst.eModeUpdate');
		result = result.replace(/\b(eNormalMode)\b/gi, 'MntConst.eNormalMode');
		result = result.replace(/\b(eModeNormal)\b/gi, 'MntConst.eModeNormal');
		result = result.replace(/\b(eModeAdd)\b/gi, 'MntConst.eModeAdd');
		result = result.replace(/\b(eModeSave)\b/gi, 'MntConst.eModeSave');
		result = result.replace(/\b(eModeCancel)\b/gi, 'MntConst.eModeCancel');
		result = result.replace(/\b(eModeAdd)\b/gi, 'MntConst.eModeAdd');
		result = result.replace(/riMaintenance\./gi, 'this.riMaintenance.');
		result = result.replace(/\b(this.riExchange.Request.)\b/gi, 'this.riMaintenance.');
		result = result.replace(/ _/gi, ' ');
		result = result.replace(/\b(riExchange.GetParentHTMLInputElementAttribute)\b/gi, 'this.riExchange.getParentAttributeValue');
		result = result.replace(/Call /gi, 'this.');
		result = result.replace(/<%/gi, '/*<%');
		result = result.replace(/%>/gi, '%>*/');
		result = result.replace(/\.\./gi, '.');
		result = result.replace(/this.this./gi, 'this.');
		result = result.replace(/MntConst.MntConst./gi, 'MntConst.');
		result = result.replace(/.style.display = 'none'/gi, '= false; //this.uiDisplay');
		result = result.replace(/.style.display = 'block'/gi, '= true; //this.uiDisplay');
		result = result.replace(/.style.display = ''/gi, '= true; //this.uiDisplay');
		return result;
	}

	function getTemplate() {
		var templateData = template.getTemplate();
		return templateData;
	}

	return service = {
		convert: init
	};
};


