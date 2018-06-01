var fs = require('fs');
var BI = require('./riConversion')();
// var color = require('./colors')().getColors();
var colors = require('colors');
var sh = require('child_process').execSync;
var prompt = require('prompt');

function getAllFiles(path) {
    if (path) {
        return fs.readdirSync(path);
    } else {
        return fs.readdirSync('.');
    }
}

function getHtmFiles(path) {
    var fileList = getAllFiles(path);
    var fileOutputList = [];

    fileList.forEach((file) => {
        if (file.lastIndexOf('.htm') > -1 && file.lastIndexOf('.html') === -1) fileOutputList.push(file);
    });

    return fileOutputList;
}

function readFile(filename) {
    return fs.readFileSync(filename, 'utf8');
}

function writeFile(filenameOut, fileData) {
    fs.writeFileSync(filenameOut, fileData, 'utf8');
}

function convertCode(data, fileName, params) {
    return BI.convert(data, fileName, params);
}

/////
function init() {
    // var shellOutput = sh('cd').toString(); console.log('Shell Output:', shellOutput);
    console.log('     RI CODE CONVERTER     '.red.bold.bgYellow);
    getUserInputs();
}

function getUserInputs() {
    var schema = {
        properties: {
            path: {
                description: 'HTML File Path'.green,
                type: 'string',
                //pattern: /^(?:[a-zA-Z]\:|\\\\[\w\.]+\\[\w.$]+)\\(?:[\w]+\\)*\w([\w.])+$/,
                message: 'Enter a proper path where the HTM file exists',
                default: '',
                required: true
            },
            type: {
                description: 'Type [Maintenance(M), Ellipsis(E), Grid(G)]: '.green,
                type: 'string',
                pattern: /^[megMEG\s]{1}$/,
                message: 'Enter a proper type - Maintenance(M), Ellipsis(E), Grid(G)',
                default: 'm',
                required: true
            },
            modeUpdate: {
                description: 'Update Mode Present (y/n): '.green,
                type: 'string',
                pattern: /^[YNyn\s]{1}$/,
                message: 'Accepts Y or N',
                default: 'y',
                required: true
            },
            modeAdd: {
                description: 'Add Mode Present (y/n): '.green,
                type: 'string',
                pattern: /^[YNyn\s]{1}$/,
                message: 'Accepts Y or N',
                default: 'n',
                required: true
            },
            modeDelete: {
                description: 'Delete Mode Present (y/n): '.green,
                type: 'string',
                pattern: /^[YNyn\s]{1}$/,
                message: 'Accepts Y or N',
                default: 'n',
                required: true
            },
            tabs: {
                description: 'Tabs Present (y/n): '.green,
                type: 'string',
                pattern: /^[YNyn\s]{1}$/,
                message: 'Accepts Y or N',
                default: 'n',
                required: true
            },
            option: {
                description: 'Option Menu Present (y/n): '.green,
                type: 'string',
                pattern: /^[YNyn\s]{1}$/,
                message: 'Accepts Y or N',
                default: 'y',
                required: true
            }
        }
    };

    prompt.start();
    prompt.message = 'Q.';
    prompt.get(schema, function (err, result) {
        var path = result.path;
        if (path.split('\\').pop().indexOf('.') > -1) {
            //Filename
            path = path.split('\\');
            path.splice(-1, 1);
            path = path.join('\\');
        } else {
            //Folder
            path = path;
        }
        result.path = path;
        processFile(result);
    });
}

function processFile(params) {
    var path = params.path.trim();
    var fileList = getHtmFiles(path);
    fileList.forEach((file) => {
        var fileOut = file.replace('.html', '.htm').replace('.htm', '.ts');
        if (path) {
            var data = convertCode(readFile(path + '//' + file), fileOut, params);
            writeFile(path + '//' + fileOut, data);
            console.log('\nFile Conversion Completed >>'.green, fileOut);
        }
    });
}

init();
