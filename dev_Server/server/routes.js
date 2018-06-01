var router = require('express').Router();
var four0four = require('./utils/404')();
var data = require('./data');

router.get('/test', test);
router.get('/test/:id', testID);
router.post('/testpost', testpost);

// Enter your Routes here
router.get('/mule_auth', muleAuth);
router.get('/user_access', userAccess);
router.get('/contract-management/search', contractSearchpage);
router.get('/usercode', usercode);
router.get('/locale/:localecode', locale);
// router.get('/invoicechargesearch', invoicechargesearch);
router.get('/invoicechargesearch', invoicechargesearch);
router.get('/contractsearch', contractsearch);
router.get('/bill-to-cash/payment', paymentTypesearch);
router.get('/branchSearch', branchSearch);
router.get('/contractDurationSearch', contractDurationSearch);
router.get('/proRataChargeStatusLang', proRataChargeStatusLang);
router.get('/contract-management/search', countrySearch);
router.get('/address_change_grid', addressChangeGrid);
router.get('/businessSearch', businessSearchGrid);
router.get('/contractInvoiceHistory', invoiceHistoryGrid);
router.get('/accountSearch', accountSearch);
router.get('/invoiceFee', invoiceFeeSearch);
router.get('/contract-management/search-stubs/groupAccount', groupAccNumberSearch);
router.get('/accountGrp', accountGroupSearch);
router.get('/contractSearch', contractSearchpage);
router.get('/accPremiseSerch', accountPremiseSearch);
router.get('/acchistorygrid', accountHistoryGrid);
router.get('/bill-to-cash/invoicing', invoiceFreqSearch);
router.get('/applyAPIContractGrid', applyAPIContractGrid);
router.get('/prospectContractGrid', prospectContractGrid);
router.get('/people/search', EmployeeSearchGrid);
router.get('/contract-management/grid', customerInformation);
router.get('/contract-management/invoice', invoiceGroupMaintenance);

// End Routes
router.get('/*', four0four.notFoundMiddleware);

module.exports = router;

// ////////////
function test(req, res) {
    // var IdToken = req.body.token || req.query.token || req.headers['x-access-token'];
    res.status(200).send(data);
}

function testID(req, res) {
    var id = req.params.id;
    res.status(200).send('ID : ' + id);
}

function testpost(req, res) {
    // var obj = {
    //     idtoken: req.headers['access_token']
    // };

    // var body = {
    //     content: req.body
    // };

    // var response = {};
    // response.header = obj;
    // response.body = body;

    // console.log(response);
    // res.status(200).send(response);
}

function usercode(req, res) {
    let obj = require('./JSON/usercode.json');
    res.status(200).send(obj);
}

function muleAuth(req, res) {
    let obj = require('./JSON/mule_auth.json');
    res.status(200).send(obj);
}

function zipSearch(req, res) {
    let obj = require('./JSON/zipSearch.json');
    res.status(200).send(obj);
}

function addressChangeGrid(req, res) {
    let obj = require('./JSON/address_change_grid.json');
    res.status(200).send(obj);
}

function branchSearch(req, res) {
    let obj = require('./JSON/branchSearch.json');
    res.status(200).send(obj);
}

function contractDurationSearch(req, res) {
    let obj = require('./JSON/contract_duration.json');
    res.status(200).send(obj);
}

function invoicechargesearch(req, res) {
    let obj = require('./JSON/iCABSAInvoiceChargeSearch.json');
    res.status(200).send(obj);
}

function contractsearch(req, res) {
    let obj = require('./JSON/iCABSAContractSearch.json');
    res.status(200).send(obj);
}

function userAccess(req, res) {
    let obj = require('./JSON/user-access.json');
    res.status(200).send(obj);
}

function paymentTypesearch(req, res) {
    let obj = require('./JSON/paymentTypeSearch.json');
    res.status(200).send(obj);
}

function proRataChargeStatusLang(req, res) {
    let obj = require('./JSON/proRataChargeStatusLang.json');
    res.status(200).send(obj);
}
function countrySearch(req, res) {
    let obj = require('./JSON/countrySearch.json');
    res.status(200).send(obj);
}
function businessSearchGrid(req, res) {
    let obj = require('./JSON/businessSearch.json');
    res.status(200).send(obj);
}
function invoiceHistoryGrid(req, res) {
    let obj = require('./JSON/contractInvoiceHistory.json');
    res.status(200).send(obj);
}
function accountSearch(req, res) {
    let obj = require('./JSON/accountSearch.json');
    res.status(200).send(obj);
}

function invoiceFeeSearch(req, res) {
    let obj = require('./JSON/invoiceFeeSearch.json');
    res.status(200).send(obj);
}
function groupAccNumberSearch(req, res) {
    let obj = require('./JSON/groupAccNumber.json');
    res.status(200).send(obj);
}
function accountGroupSearch(req, res) {
    let obj = require('./JSON/accountGroupSearch.json');
    res.status(200).send(obj);
}
function contractSearchpage(req, res) {
    let obj = require('./JSON/contractSearch.json');
    res.status(200).send(obj);
}
function accountPremiseSearch(req, res) {
    let obj = require('./JSON/accountPremiseSearch.json');
    res.status(200).send(obj);
}
function accountHistoryGrid(req, res) {
    let obj = require('./JSON/accountHistoryGrid.json');
    res.status(200).send(obj);
}
function invoiceFreqSearch(req, res) {
    let obj = require('./JSON/invoiceFreqSearch.json');
    res.status(200).send(obj);
}

function applyAPIContractGrid(req, res) {
    let obj = require('./JSON/applyAPIContractGrid.json');
    res.status(200).send(obj);
}
function prospectContractGrid(req, res) {
    let obj = require('./JSON/prospectContractGrid.json');
    res.status(200).send(obj);
}
function EmployeeSearchGrid(req, res) {
    let obj = require('./JSON/iCABSBEmployeeSearch.json');
    res.status(200).send(obj);
}
function customerInformation(req, res) {
    let obj = require('./JSON/customerInformation.json');
    res.status(200).send(obj);
}
function invoiceGroupMaintenance(req, res) {
    let obj = require('./JSON/invoiceGroupMaintenance.json');
    res.status(200).send(obj);
}

function locale(req, res) {
    var localeID = req.params.localecode;
    let obj = {};
    switch (localeID) {
        case 'ko_K':
        case 'ko-KR':
            obj = require('./LocaleAWS/KORMini.json');
            break;
        case 'en_GB':
        case 'en-GB':
            obj = require('./LocaleAWS/lang_en.min.json');
            break;
        case 'en_D':
        case 'en-DE':
        case 'en-DK':
            obj = require('./LocaleAWS/UK_D_ENGMIN.json');
            break;
        case 'en_F':
        case 'en-FR':
        case 'en-FI':
            obj = require('./LocaleAWS/UK_F_ENGMini.json');
            break;
        case 'en_K':
        case 'en-KE':
            obj = require('./LocaleAWS/UK_K_ENGMini.json');
            break;
        case 'en_V':
        case 'en-VN':
            obj = require('./LocaleAWS/UK_V_ENGMini.json');
            break;
        case 'en_Z':
        case 'en-ZA':
            obj = require('./LocaleAWS/UK_z_ENGMini.json');
            break;
        default:
            obj = require('./LocaleAWS/lang_en.min.json');
    }
    res.status(200).send(obj);
}