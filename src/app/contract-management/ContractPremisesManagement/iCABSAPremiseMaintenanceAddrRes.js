export var PremiseMaintenanceAddrRes = (function () {
    function PremiseMaintenanceAddrRes(parent) {
        this.parent = parent;
    }
    PremiseMaintenanceAddrRes.prototype.InitiateResolver = function () {
        this.DeleteFromInputDir();
        this.parent.showAlert('The address resolver is starting.This may take a few seconds');
        this.LaunchResolver();
        this.Interval = setInterval('CreateFile()', 10000);
        this.vInterval = setInterval('CheckForFile()', 2000);
    };
    PremiseMaintenanceAddrRes.prototype.InitiateResolverPrem = function () {
        this.DeleteFromInputDir();
        this.parent.showAlert('You have added or modified a Premise Address. You will have to resolve the address with the address resolver. The address resolver is starting this may take a few seconds');
        this.LaunchResolver();
        this.Interval = setInterval('CreateFile()', 20000);
        this.vInterval = setInterval('CheckForFile()', 2000);
    };
    PremiseMaintenanceAddrRes.prototype.DeleteFromInputDir = function () {
        var InFileNameIn = 'iCABSTransPremMaint_y_001.in';
        var InFilePathIn = 'c:/Program Files/Transdata/FileAddressResolver/input/' + InFileNameIn;
    };
    PremiseMaintenanceAddrRes.prototype.CheckForFile = function () {
        var OutFileNameIn = 'iCABSTransPremMaint_y_001.in';
        var OutFileNameOut = 'iCABSTransPremMaint_y_001.out';
        var OutFilePathIn = 'c:/Program Files/Transdata/FileAddressResolver/output/' + OutFileNameIn;
        var OutFilePathOut = 'c:/Program Files/Transdata/FileAddressResolver/output/' + OutFileNameOut;
    };
    PremiseMaintenanceAddrRes.prototype.ReadOutFile = function () {
        var OutFileNameIn = 'iCABSTransPremMaint_y_001.in';
        var OutFileNameOut = 'iCABSTransPremMaint_y_001.out';
        var strContents = '';
        var FileName = OutFileNameOut;
    };
    PremiseMaintenanceAddrRes.prototype.CreateFile = function () {
        var file_Name_In = 'iCABSTransPremMaint_y_001.in';
        var filepath = 'c:/Program Files/Transdata/FileAddressResolver/input/' + file_Name_In;
        var huge_String = '';
        try {
            clearInterval(this.Interval);
            return (true);
        }
        catch (err) {
            return (false);
        }
    };
    PremiseMaintenanceAddrRes.prototype.LaunchResolver = function () {
    };
    PremiseMaintenanceAddrRes.prototype.CloseResolver = function () {
    };
    PremiseMaintenanceAddrRes.prototype.setInputVals = function () {
        this.Interval = setInterval('repeatAlertBox("readin.txt")', 1000);
    };
    PremiseMaintenanceAddrRes.prototype.repeatAlertBox = function (OutParamFileNameOut) {
        var OutFileNameOut = OutParamFileNameOut;
        var strContents = '';
        var FileName = OutFileNameOut;
    };
    return PremiseMaintenanceAddrRes;
}());
