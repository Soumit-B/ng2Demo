export interface ErrorCallback {
    showErrorModal(data: any): void;
}

export interface QueryParametersCallback {
    getURLQueryParameters(param: any): void;
}

export interface MessageCallback {
    showMessageModal(data: any): void;
}

export interface BackRouteCallback {
    handleBackNavigation(data: any): boolean;
}

export interface RouteCallback {
    handleBookmark(field: string, data: string): void;
}
