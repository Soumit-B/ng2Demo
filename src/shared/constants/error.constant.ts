import { Injectable } from '@angular/core';

@Injectable()
export class ErrorConstant {
    public static Message =
    {
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
        Invalid: 'invalid',
        SelectRegion: 'Please select region',
        LoginFail: 'There was an issue with accessing this service. Please try again. If the issue persists, please contact your local support desk.',
        UserFailNetwork: 'There was an issue with accessing this service. Please try again. If the issue persists, please contact your local support desk.',
        UserFailESB: 'There was an issue with signing-in to this service. Please try again. If the issue persists, please contact your local support desk.',
        MenuFail: 'There was an issue retrieving menu options for your user. Please try again. If the issue persists, please contact your local support desk.',
        OtherLoginTimeFail: 'An unknown issue was encountered. Please try again.. If the issue persists, please contact your local support desk.',
        InternetFail: 'There is an issue with network connectivity. Please try again.',
        ServiceTypeError: 'The Service Type can only be either S or P'
    };
}
