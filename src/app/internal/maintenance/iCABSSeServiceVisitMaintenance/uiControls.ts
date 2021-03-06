import { MntConst } from './../../../../shared/services/riMaintenancehelper';

export class UiControls {
    public controls = [
        { name: 'ContractNumber', disabled: true, type: MntConst.eTypeCode, required: true, value: '' },
        { name: 'ContractName', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'PremiseNumber', disabled: true, type: MntConst.eTypeInteger, required: true, value: '' },
        { name: 'PremiseName', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ProductCode', disabled: true, type: MntConst.eTypeCode, required: true, value: '' },
        { name: 'ProductDesc', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'PlanVisitNumber', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'PlanVisitNumber2', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'WasteConsignmentNoteNumber', disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'EmployeeCode', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'EmployeeSurname', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'VehicleRegistration', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ServiceQuantity', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'UndeliveredQuantity', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'DeliveryQuantity', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'ServiceCoverItemNumber', disabled: true, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'ServiceCoverItemDesc', disabled: true, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'PremiseLocationNumber', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ProductComponentCode', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'ProductComponentDesc', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ServicedQuantity', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'ProductComponentRemoved', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ProductComponentRemDesc', disabled: true, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'RemovalQuantity', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'InvoiceUnitValue', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'AdditionalChargeValue', disabled: true, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'SharedInd', disabled: true, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'PrepUsedInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'InfestationInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'WasteCollected', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'SignatureRecordedInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'StandardDuration', disabled: false, type: MntConst.eTypeTime, required: true, value: '' },
        { name: 'OvertimeDuration', disabled: false, type: MntConst.eTypeTime, required: true, value: '' },
        { name: 'ServiceTimeStart', disabled: false, type: MntConst.eTypeTime, required: true, value: '' },
        { name: 'ServiceTimeEnd', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DeliveryNoteNumber', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'WEDSQty', disabled: false, type: MntConst.eTypeDecimal1, required: false, value: '' },
        { name: 'WorkLoadIndexTotal', disabled: true, type: MntConst.eTypeDecimal2, required: false, value: '' },
        { name: 'CustomerVisitRef', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'VisitReference', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'PremiseContactSignature', disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'PremiseContactName', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'PremiseContactReason', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ServiceVisitText', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'SafeToProceedInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },

        { name: 'AddEmployeeCode1', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'AddEmployeeSurname1', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'AddEmployeeCode2', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'AddEmployeeSurname2', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'AddEmployeeCode3', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'AddEmployeeSurname3', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'AddEmployeeCode4', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'AddEmployeeSurname4', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'AddEmployeeCode5', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'AddEmployeeSurname5', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'AddEmployeeCode6', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'AddEmployeeSurname6', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'AddEmployeeCode7', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'AddEmployeeSurname7', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'AddEmployeeCode8', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'AddEmployeeSurname8', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'AddEmployeeCode9', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'AddEmployeeSurname9', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'AddEmployeeCode10', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'AddEmployeeSurname10', disabled: true, type: MntConst.eTypeText, required: false, value: '' },

        { name: 'ServiceDateStart', disabled: false, type: MntConst.eTypeDate, required: true, value: '' },
        { name: 'ServiceDateEnd', disabled: false, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'LastServiceVisitAnnivDate', disabled: false, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'AllowUpdateInd', disabled: true, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'WasteConsNoteIsMand', disabled: true, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'ManualVisitInd', disabled: true, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'GotSignature', disabled: true, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'NameCapturedInd', disabled: true, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'ServiceCoverLocation', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'ServiceVisitDetail', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'WasteConsNoteIsMandatory', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'NoServiceReasonCode', disabled: false, type: MntConst.eTypeCode, required: false, value: '', isCutomDropdown: true },
        { name: 'AlternateProductCode', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'ManualVisitReasonCode', disabled: false, type: MntConst.eTypeCode, required: false, value: '', isCutomDropdown: true },
        { name: 'VisitTypeCode', disabled: false, type: MntConst.eTypeCode, required: true, value: '', isCutomDropdown: true },
        { name: 'VisitNarrativeCode', disabled: false, type: MntConst.eTypeCode, required: false, value: '', isCutomDropdown: true },
        { name: 'ServiceVisitNumber', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'ServiceBranchNumber', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'NegBranchNumber', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'ReasonNumber', disabled: false, type: MntConst.eTypeInteger, required: false, value: '', isCutomDropdown: true },
        { name: 'AdditionalEmployees', disabled: false, type: MntConst.eTypeInteger, required: true, value: '' },
        { name: 'VisitReferenceWarning', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'riGridHandle', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'AccountNumber', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'AccountName', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'VisitTypeNarrative', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ProdReplacement', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'RoutineVisit', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'NoServiceReasonDesc', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ManualVisitReasonDesc', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'PremiseContactSignatureURL', disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'PremiseContactPrintedNameURL', disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'ErrorMessage', disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'menu', disabled: false, type: MntConst.eTypeText, required: false, value: 'Options' },

        { name: 'ServiceCoverRowID', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ServiceVisitRowID', disabled: false, type: MntConst.eTypeText, required: false, value: '' } //ServiceVisit
    ];
}
