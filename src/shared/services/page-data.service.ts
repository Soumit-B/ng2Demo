import { Injectable } from '@angular/core';

@Injectable()
export class PageDataService {
    private data: any;
    private secondaryData: any;
    private ellipsis: string;

    //constructor() {}

    getData(): any {
        return this.data;
    }

    getSecondaryData(): any {
        return this.secondaryData;
    }

    saveData(data: any): void {
        this.data = data;
    }

    saveSecondaryData(data: any): void {
        this.secondaryData = data;
    }

    getEllipsisIdentifier(): any {
        return this.ellipsis;
    }

    saveEllipsisIdentifier(data: any): any {
        this.ellipsis = data;
    }

    clearData(): void {
        this.data = null;
    }

    clearSecondaryData(): void {
        this.secondaryData = null;
    }
}
