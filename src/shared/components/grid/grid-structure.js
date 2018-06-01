export var GridStructure = (function () {
    function GridStructure(pageData, header, body, footer, errorMessage) {
        this.pageData = pageData;
        this.header = header;
        this.body = body;
        this.footer = footer;
        this.errorMessage = errorMessage;
    }
    return GridStructure;
}());
export var PageData = (function () {
    function PageData(lastPageNumber, pageNumber) {
        this.lastPageNumber = lastPageNumber;
        this.pageNumber = pageNumber;
    }
    return PageData;
}());
export var Header = (function () {
    function Header(title, cells) {
        this.title = title;
        this.cells = cells;
    }
    return Header;
}());
export var Body = (function () {
    function Body(cells) {
        this.cells = cells;
    }
    return Body;
}());
export var Footer = (function () {
    function Footer(rows) {
        this.rows = rows;
    }
    return Footer;
}());
