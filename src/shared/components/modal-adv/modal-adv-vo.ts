
export class ICabsModalVO {
    public title: string = '';
    public msg: any = ''; // It may be string or array
    public fullError: any = ''; // It may be string or array
    public modalType: string = '';
    public showHeader: boolean = true;
    public showCloseButton: boolean = true;
    public data: any;
    public shiftTop: boolean;
    public config: any = null;

    public confirmLabel: string = 'Confirm';
    public confirmCallback: any = null;

    public cancelLabel: string = 'Cancel';
    public cancelCallback: any = null;

    public closeCallback: any = null;

    /**
     * Constractro function.
     * @method constructor
     * @param {string} _msg Message that display on modal body. It may be string or array.
     * @param {string} _fullError Message that display full error info. It may be string or array.
     * @param {any} _confirmCallback Callback function that called after click on Confirm button
     * @param {any} _cancelCallback Callback function that called after click on Cancel button
     */
    constructor(private _msg?: any, private _fullError?: any, private _confirmCallback?: any, private _cancelCallback?: any) {
        this.msg = this._msg;
        this.fullError = this._fullError;
        this.confirmCallback = this._confirmCallback;
        this.cancelCallback = this._cancelCallback;
    }
}

export class ICabsModalConstants {
    public static readonly MODAL_TYPE_ERROR: string = 'ERROR';
    public static readonly MODAL_TYPE_MESSAGE: string = 'MESSAGE';
    public static readonly MODAL_TYPE_PROMPT: string = 'PROMPT';
    public static readonly CONFIRM: string = 'CONFIRM';
    public static readonly CANCEL: string = 'CANCEL';
}
