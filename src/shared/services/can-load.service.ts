import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Logger } from '@nsalaun/ng2-logger';

@Injectable()
export class CanLoadService implements CanLoad {
    constructor(
        private router: Router,
        private logger: Logger) {
    }

    canLoad(route: any): boolean {
        if (navigator && typeof navigator['onLine'] !== 'undefined' && navigator.onLine === false && process.env.NODE_ENV !== 'DEV') {
            this.setDisplay('none');
            setTimeout(() => {
                this.router.navigate([], { skipLocationChange: true, preserveQueryParams: true });
            }, 0);
            return false;
        }
        return true;
    }

    private setDisplay(val: string): void {
        document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = val;
        document.querySelector('icabs-app .ajax-overlay')['style'].display = val;
    }
}
