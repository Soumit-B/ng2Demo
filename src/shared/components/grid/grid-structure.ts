export class GridStructure {
    constructor(public pageData: PageData, public header: Header, public body: Body, public footer: Footer, public errorMessage: string) {
    }
}

export class PageData {
    constructor(public lastPageNumber: Number, public pageNumber: Number) {
    }
}

export class Header {
    constructor(public title: Array<any>, public cells: Array<any>) {
    }
}

export class Body {
    constructor(public cells: Array<any>) {
    }
}

export class Footer {
    constructor(public rows: Array<any>) {
    }
}
