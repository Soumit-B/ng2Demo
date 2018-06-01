import { Injectable } from '@angular/core';

@Injectable()
export class VariableService {
    private menuClick: boolean = false;
    private logoutClick: boolean = false;
    private backClick: boolean = false;
    private contractStoreData: any = {};
    private autoCompleteSelection: boolean = false;

    setMenuClick(val: boolean): void {
        this.menuClick = val;
    }

    getMenuClick(): any {
        return this.menuClick;
    }

    setLogoutClick(val: boolean): void {
        this.logoutClick = val;
    }

    getLogoutClick(): any {
        return this.logoutClick;
    }

    setBackClick(val: boolean): void {
        this.backClick = val;
    }

    getBackClick(): any {
        return this.backClick;
    }

    setAutoCompleteSelection(val: boolean): void {
        this.autoCompleteSelection = val;
    }

    getAutoCompleteSelection(): any {
        return this.autoCompleteSelection;
    }

    setContractStoreData(val: any): void {
        this.contractStoreData = val;
    }

    getContractStoreData(): any {
        return this.contractStoreData;
    }
}
