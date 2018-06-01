var MockStore = (function () {
    function MockStore() {
        this.dispatch = jasmine.createSpy('dispatch').and.callFake(function () {
            MockStore.mockDispatchStatus = true;
        });
    }
    return MockStore;
}());
export { MockStore };
MockStore.mockDispatchStatus = false;
