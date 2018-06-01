export class NavData {
    pageData: Object;
    pageId: string;
    backroute: string;
    backLabel: string;
    exchangeMode: string;
    pageAttributes: Object;
    formData: Object;
    queryParams: any;
    storeData: any;
    controls: any[];
    mode: string;

    public setMode(data: string): void {
        this.mode = data;
    }

    public getMode(): string {
        return this.mode;
    }

    public setControls(data: any[]): void {
        this.controls = data;
    }

    public getControls(): any[] {
        return this.controls;
    }

    public setExchangeMode(data: string): void {
        this.exchangeMode = data;
    }

    public getExchangeMode(): string {
        return this.exchangeMode;
    }

    public setPageAttributes(data: Object): void {
        this.pageAttributes = data;
    }

    public getPageAttributes(): Object {
        return this.pageAttributes;
    }

    public setFormData(data: Object): void {
        this.formData = data;
    }

    public getFormData(): Object {
        return this.formData;
    }

    public setStoreData(data: Object): void {
        this.storeData = data;
    }

    public getStoreData(): Object {
        return this.storeData;
    }

    public setPageData(data: Object): void {
        this.pageData = data;
    }

    public getPageData(): Object {
        return this.pageData;
    }

    public setPageId(pageId: string): void {
        this.pageId = pageId;
    }

    public getPageId(): string {
        return this.pageId;
    }

    public setBackRoute(route: string): void {
        this.backroute = route;
    }

    public getBackRoute(): string {
        return this.backroute;
    }

    public setBackLabel(label: string): void {
        this.backLabel = label;
    }

    public getBackLabel(): string {
        return this.backLabel;
    }

    public setQueryParams(query: any): void {
        this.queryParams = query;
    }

    public getQueryParams(): any {
        return this.queryParams;
    }
}
