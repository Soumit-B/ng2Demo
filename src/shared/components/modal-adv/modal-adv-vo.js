export var ICabsModalVO = (function () {
    function ICabsModalVO(_msg, _title) {
        if (_msg === void 0) { _msg = ''; }
        if (_title === void 0) { _title = ''; }
        this._msg = _msg;
        this._title = _title;
        this.title = '';
        this.msg = '';
        this.modalType = '';
        this.showHeader = true;
        this.showCloseButton = true;
        this.confirmLabel = 'Confirm';
        this.showConfirmButton = false;
        this.confirmCallback = null;
        this.cancelLabel = 'Cancel';
        this.showCancelButton = false;
        this.cancelCallback = null;
        this.msg = this._msg;
        this.title = this._title;
    }
    return ICabsModalVO;
}());
export var ICabsModalConstants = (function () {
    function ICabsModalConstants() {
    }
    ICabsModalConstants.MODAL_TYPE_ERROR = 'ERROR';
    ICabsModalConstants.MODAL_TYPE_MESSAGE = 'MESSAGE';
    ICabsModalConstants.MODAL_TYPE_PROMPT = 'PROMPT';
    return ICabsModalConstants;
}());
