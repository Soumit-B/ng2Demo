import { Injectable } from '@angular/core';
import { Logger } from '@nsalaun/ng2-logger';


@Injectable()
export class RouteAwayGlobals {
    private ellipseOpenFlag: boolean = false;
    private saveEnabledFlag: boolean = false;
    private checkDirtyFlag: boolean = false;
    public setEllipseOpenFlag(flag: boolean): void {
        this.ellipseOpenFlag = flag;
    }
    public getEllipseOpenFlag(): boolean {
        return this.ellipseOpenFlag;
    }
    public setSaveEnabledFlag(flag: boolean): void {
        this.saveEnabledFlag = flag;
    }
    public getDirtyFlag(): boolean {
        return this.checkDirtyFlag;
    }
    public setDirtyFlag(flag: boolean): void {
        this.checkDirtyFlag = flag;
    }
    public getSaveEnabledFlag(): boolean {
        return this.saveEnabledFlag;
    }
    public resetRouteAwayFlags(): void {
        this.ellipseOpenFlag = false;
        this.saveEnabledFlag = false;
        this.checkDirtyFlag = false;
    }
}
