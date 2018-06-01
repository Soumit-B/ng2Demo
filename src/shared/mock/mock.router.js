var MockRouter = (function () {
    function MockRouter() {
        this.navigate = jasmine.createSpy('navigate');
    }
    return MockRouter;
}());
export { MockRouter };
