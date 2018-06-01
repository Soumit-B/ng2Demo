/* TODO >>>
    Changes needs to be done in controlsArr.js
*/

var MntConst = {
    eTypeCode: 'MntConst.eTypeCode',
    eTypeText: 'MntConst.eTypeText',
    eTypeTextFree: 'MntConst.eTypeTextFree',
    eTypeInteger: 'MntConst.eTypeInteger',
    eTypeDecimal1: 'MntConst.eTypeDecimal1',
    eTypeDecimal2: 'MntConst.eTypeDecimal2',
    eTypeDecimal3: 'MntConst.eTypeDecimal3',
    eTypeDecimal4: 'MntConst.eTypeDecimal4',
    eTypeDecimal5: 'MntConst.eTypeDecimal5',
    eTypeDecimal6: 'MntConst.eTypeDecimal6',
    eTypeCodeNumeric: 'MntConst.eTypeCodeNumeric',
    eTypeAutoNumber: 'MntConst.eTypeAutoNumber',
    eTypeCurrency: 'MntConst.eTypeCurrency',
    eTypeDate: 'MntConst.eTypeDate',
    eTypeDateText: 'MntConst.eTypeDateText',
    eTypeDateNow: 'MntConst.eTypeDateNow',
    eTypeTime: 'MntConst.eTypeTime',
    eTypeTimeText: 'MntConst.eTypeTimeText',
    eTypeTimeNow: 'MntConst.eTypeTimeNow',
    eTypeHours: 'MntConst.eTypeHours',
    eTypeMinutes: 'MntConst.eTypeMinutes',
    eTypeCodeNumericAutoNumber: 'MntConst.eTypeCodeNumericAutoNumber',
    eTypeEMail: 'MntConst.eTypeEMail',
    eTypeImage: 'MntConst.eTypeImage',
    eTypeButton: 'MntConst.eTypeButton',
    eTypeCheckBox: 'MntConst.eTypeCheckBox',
    eVirtualJoinTypeInner: 'eVirtualJoinTypeInner',
    eTypeEllipsis: 'MntConst.eTypeEllipsis',
    eTypeDropdown: 'MntConst.eTypeDropdown',
    eTypeUnknown: 'MntConst.eTypeUnknown'
}
var controls = require('./controlsArr')();
var fs = require('fs')
var dumpRIFile = '';

function readFile(filename) {
    return fs.readFileSync(filename, 'utf8');
}

function writeFile(filenameOut, fileData) {
    fs.writeFileSync(filenameOut, fileData, 'utf8');
}

var COLORS = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m"
};

function updateCtrlArr4mVB() {
    for (var i = 0; i < controls.length; i++) {
        if (!getType(controls[i].name)) {
            updateCtrl(controls, controls[i].name, findType(controls[i].name))
        }
    }
}

function getType(ctrlName) {
    var ctrlObj = controls;
    var dataType = '';
    for (var i = 0; i < ctrlObj.length; i++) {
        if (ctrlObj[i].name === ctrlName && ctrlObj[i].hasOwnProperty('type')) {
            dataType = ctrlObj[i].type;
            break;
        }
    }
    return dataType;
}

function findType(ctrlName) {
    var line = '';
    for (var i = 0; i < dumpRIFile.length; i++) {
        line = '';
        if (dumpRIFile[i].indexOf(ctrlName) > 0) {
            line = dumpRIFile[i];
            break;
        } else {
            //For controls such as Time01, WindowStarth01 etc
            var tempCtrl = '"' + ctrlName.slice(0, ctrlName.length - 2);
            if (dumpRIFile[i].indexOf(tempCtrl) > 0) {
                line = dumpRIFile[i];
                break;
            }
        }
    }

    if (line != '') {
        var startIndex = line.indexOf('eType');
        var endIndex = line.indexOf(',', startIndex);
        if (endIndex === -1) startIndex = -1;
        var type = line.substring(startIndex, endIndex);
        type = type ? 'MntConst.' + type : '';
        updateCtrl(controls, ctrlName, type);
        return type;
    } else {
        return '';
    }
}

function formTypeObj() {
    var out = [];
    var result = dumpRIFile.split('\n');
    var len = result.length;
    for (var i = 0; i < len; i++) {
        var a = result[i];
        if (a.indexOf(',eType') > 0) {
            out.push(a.trim());
        } else if (a.indexOf(', eType') > 0) {
            out.push(a.trim());
        }
    }
    dumpRIFile = out;
}

function updateCtrl(ctrlObj, name, dataType) {
    for (var i = 0; i < ctrlObj.length; i++) {
        if (ctrlObj[i].name === name) {
            ctrlObj[i].type = dataType;
            break;
        }
    }
}

function appendDirectives(rawData) {
    var out = [];
    var result = rawData.split('\n');
    var len = result.length;
    for (var i = 0; i < len; i++) {
        var a = result[i];
        var b = '';
        var type = '';
        if (a.indexOf('formControlName') > 0) {
            b = a.substr(a.indexOf('formControlName'));
            b = a.substr(a.indexOf('formControlName')).split('"')[1];
            type = getType(b);
        }

        if (type) {
            type = type.replace('MntConst.', '');
            out.push(a.replace('formControlName', type + ' formControlName'));
        } else {
            out.push(a);
        }
    }
    return out.join('');
}

function init() {
    const args = process.argv;
    console.log(COLORS.FgCyan, '<<<< Form Control Generator >>>> ', COLORS.Reset);
    console.log('      Command: npm run genFormCtrl <PathTo_HTML_file> <PathTo_TS_file> <PathTo_RI-HTM_file>');

    var filePath = args[2];
    var filePathControls = args[3];
    var filePathRI = args[4];

    console.log(COLORS.FgMagenta, '        HTML File Path :', filePath, COLORS.Reset);
    console.log(COLORS.FgMagenta, '        TS File Path   :', filePathControls, COLORS.Reset);
    console.log(COLORS.FgMagenta, '        RI File Path   :', filePathRI, COLORS.Reset);

    if (!filePath || !filePathControls || !filePathRI) return;

    dumpRIFile = readFile(filePathRI);
    formTypeObj();

    updateCtrlArr4mVB();
    writeFile(filePath, appendDirectives(readFile(filePath)));

    var ctrls = '/*\npublic controls = [\n';
    var len = controls.length;
    for (var i = 0; i < len; i++) {
        var out = "           { name: '" + controls[i].name + "'" +
            ", disabled: " + (controls[i].disabled ? controls[i].disabled : false) +
            ", type: " + (controls[i].type ? controls[i].type : "''") +
            ", required: " + (controls[i].required ? controls[i].required : false) +
            ", value: " + (controls[i].value ? "'" + controls[i].value + "'" : "''");

        if (controls[i].hasOwnProperty('ignoreSubmit')) {
            out = out + ", ignoreSubmit: " + (controls[i].ignoreSubmit ? controls[i].ignoreSubmit : false)
        }
        out = out + "}" + (i < len - 1 ? ',' : '');
        ctrls += out + '\n';
    }
    ctrls += '];*/\n';

    writeFile(filePathControls, ctrls + readFile(filePathControls));

    console.log(COLORS.FgGreen, '\n\nDONE', COLORS.Reset);
}
init();
