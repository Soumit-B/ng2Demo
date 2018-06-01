export class PremiseMaintenanceAddrRes {

    constructor(private parent: any) {}

    public Interval: any;
    public vInterval: any;

    InitiateResolver(): void {
        this.DeleteFromInputDir(); // check if there are is a file in the input dirctory there shouldn't  be but delete any if there is
        //CloseResolver(); // close the resolver if it is opened
        this.parent.showAlert('The address resolver is starting.This may take a few seconds');
        this.LaunchResolver(); // start the resolver
        this.Interval = setInterval('CreateFile()', 10000); // Create the input file for the address resolver program
        this.vInterval = setInterval('CheckForFile()', 2000); // check for the output file from the address resolver
    }

    InitiateResolverPrem(): void {
        this.DeleteFromInputDir(); // check if there are is a file in the input dirctory there shouldn't be but delete any if there is
        //CloseResolver(); // close the resolver if it is opened
        this.parent.showAlert('You have added or modified a Premise Address. You will have to resolve the address with the address resolver. The address resolver is starting this may take a few seconds');
        this.LaunchResolver(); // start the resolver
        this.Interval = setInterval('CreateFile()', 20000); // Create the input file for the address resolver program
        this.vInterval = setInterval('CheckForFile()', 2000); // check for the output file from the address resolver
    }

    DeleteFromInputDir(): void {
        let InFileNameIn = 'iCABSTransPremMaint_y_001.in';
        let InFilePathIn = 'c:/Program Files/Transdata/FileAddressResolver/input/' + InFileNameIn;
        //TODO
        /*ObjFSO = new ActiveXObject('Scripting.FileSystemObject');
        if (ObjFSO.FileExists(InFilePathIn)) {
            file = ObjFSO.GetFile(InFilePathIn);
            file.Delete();
        }*/
    }

    CheckForFile(): void {
        let OutFileNameIn = 'iCABSTransPremMaint_y_001.in';
        let OutFileNameOut = 'iCABSTransPremMaint_y_001.out';
        let OutFilePathIn = 'c:/Program Files/Transdata/FileAddressResolver/output/' + OutFileNameIn;
        let OutFilePathOut = 'c:/Program Files/Transdata/FileAddressResolver/output/' + OutFileNameOut;
        //TODO
        /*ObjFSO = new ActiveXObject('Scripting.FileSystemObject');
        if (ObjFSO.FileExists(OutFilePathIn)) {
            //this.parent.showAlert('the file exists');
            ReadOutFile();
            clearInterval(vInterval);
            file = ObjFSO.GetFile(OutFilePathIn);
            file.Delete();
        }*/
    }

    ReadOutFile(): void {
        let OutFileNameIn = 'iCABSTransPremMaint_y_001.in';
        let OutFileNameOut = 'iCABSTransPremMaint_y_001.out';
        let strContents = '';
        let FileName = OutFileNameOut;
        //TODO
        /*//  Get the output file from output folder
        let objFSO = new ActiveXObject('Scripting.FileSystemObject');
        let path = objFSO.BuildPath('c:/Program Files/Transdata/FileAddressResolver/output/', FileName);
        if (objFSO.FileExists(path)) {
            strContents = objFSO.OpenTextFile(path, 1).ReadAll();
        }
        let AddressData = strContents.split('|');
        AddressData = strContents.split('|'); // Get content of the output file and pass it back
        //CloseResolver(); // close the resolver if it is opened
        if (AddressData[6] !== '' && AddressData[7] !== '') {
            MapStreetNo.value = AddressData[0];
            MapStreetName.value = AddressData[1];
            MapStreetType.value = AddressData[2];
            MapSuburb.value = AddressData[3];
            MapState.value = AddressData[4];
            MapPostCode.value = AddressData[5];
            MapLongitude.value = AddressData[6];
            MapLatitude.value = AddressData[7];
        }*/
    }

    CreateFile(): boolean {
        let file_Name_In = 'iCABSTransPremMaint_y_001.in';
        let filepath = 'c:/Program Files/Transdata/FileAddressResolver/input/' + file_Name_In;
        //TODO
        let huge_String = '';
        // let huge_String = PremiseName.value + '|' + PremiseAddressLine1.value + '|' + PremiseAddressLine2.value + '|' + PremiseAddressLine3.value + '|' + PremiseAddressLine4.value + '|' + PremiseAddressLine5.value + '|' + PremisePostcode.value;

        try { //create input file in input directory
            //TODO
            /*let fsObj = new ActiveXObject('Scripting.FileSystemObject');
            let counterFileObj = fsObj.OpenTextFile(filepath, 2, true);
            counterFileObj.WriteLine(huge_String);
            counterFileObj.Close();*/
            clearInterval(this.Interval);
            return (true);
        }
        catch (err) {
            return (false);
        }
    }

    LaunchResolver(): void {
        //TODO
        /*let oShell = new ActiveXObject('Shell.Application');
        let commandtorun = 'C:/Program Files/riWebBrowser/iCABSLaunchResolver.vbs';
        oShell.ShellExecute(commandtorun);*/
    }
    CloseResolver(): void {
        //TODO
        /*let oShell = new ActiveXObject('Shell.Application');
        let commandtorun = 'C:/Program Files/riWebBrowser/iCABSCloseResolver.vbs';
        oShell.ShellExecute(commandtorun);*/
    }

    setInputVals(): void {
        this.Interval = setInterval('repeatAlertBox("readin.txt")', 1000);
    }

    repeatAlertBox(OutParamFileNameOut: string): void {
        let OutFileNameOut = OutParamFileNameOut;
        let strContents = '';
        let FileName = OutFileNameOut;
        //TODO
        /*let objFSO = new ActiveXObject('Scripting.FileSystemObject'); // Get output file from output folder
        let path = objFSO.BuildPath('c:/', FileName);
        if (objFSO.FileExists(path)) {
            strContents = objFSO.OpenTextFile(path, 1).ReadAll();
            let AddressData = strContents.split('|');
            AddressData = strContents.split('|'); // Get content of the output file and pass it back
            this.parent.showAlert('the file does exist');
            MapLatitude.value = AddressData[0];
            MapLongitude.value = AddressData[1];
            clearInterval(this.Interval);
        } else {
            this.parent.showAlert('the file doesn\'t exist');
        }*/
    }
}

/*
def let vServiceAdjHrs as char no-undo init '0,1,2'.
def let vServiceAdjHrsSingle as char no-undo.
def let i as int no-undo.

<SCRIPT LANGUAGE='VBScript' SRC='/Scripts/VBScript/riMaintenance.vbs'></SCRIPT>
<SCRIPT LANGUAGE='VBScript' SRC='/Scripts/VBScript/iCABSContractTypeInfo.vbs'></SCRIPT>
<SCRIPT LANGUAGE='VBScript' SRC='/Scripts/VBScript/iCABSExtensionFramework.vbs'></SCRIPT>
*/
