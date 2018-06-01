import { Component, Input, OnDestroy } from '@angular/core';

@Component({
    selector: 'icabs-spinner',
    template: `
        <div [hidden]="!isDelayedRunning" [attr.data-hidden]="!isDelayedRunning" class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>
        <div [hidden]="!isDelayedRunning" [attr.data-hidden]="!isDelayedRunning" class="screen-overlay"></div>
    `
})
export class SpinnerComponent implements OnDestroy {
    constructor() {
        // statement
    }
    private currentTimeout: any;
    public isDelayedRunning: boolean = false;
    @Input() public delay: number = 300;
    @Input() public set isRunning(value: boolean) {
        if (!value) {
            this.cancelTimeout();
            this.isDelayedRunning = false;
            return;
        }

        if (this.currentTimeout) {
            return;
        }

        this.currentTimeout = setTimeout(() => {
            this.isDelayedRunning = value;
            this.cancelTimeout();
        }, this.delay);
    }

    private cancelTimeout(): void {
        clearTimeout(this.currentTimeout);
        this.currentTimeout = undefined;
    }

    ngOnDestroy(): any {
        this.cancelTimeout();
        //this.riExchange.releaseReference(this);
    }
}


