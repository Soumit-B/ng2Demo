import { Injectable } from '@angular/core';
export var ErrorConstant = (function () {
    function ErrorConstant() {
    }
    ErrorConstant.Message = {
        UserNotFound: 'User Code does not exist. Please contact your local administrator.',
        MenuNotFound: 'Error fetching menu details. Please contact your local administrator.',
        TranslationNotFound: 'Error fetching translations. Please contact your local administrator.',
        RecordNotFound: 'Record Not Found',
        ErrorFetchingRecord: 'Error Fetching Record',
        ErrorMessageNotFound: 'Error Message Not Found',
        UnexpectedError: 'Unexpected error, please reload',
        ProgressError: 'ProgressError',
        ProgressErrorMessage: 'Error fetching data, please try again',
        GridFetchError: 'Error fetching grid, please try again',
        TableFetchError: 'Error fetching table, please try again',
        SystemCharacteristicsFetchError: 'System characteristic is unavailable in database, please try again',
        Failure: 'FAILURE',
        Invalid: 'invalid'
    };
    ErrorConstant.decorators = [
        { type: Injectable },
    ];
    ErrorConstant.ctorParameters = [];
    return ErrorConstant;
}());
