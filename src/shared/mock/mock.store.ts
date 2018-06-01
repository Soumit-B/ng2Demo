export class MockStore {
    static mockDispatchStatus: boolean = false;
    dispatch = jasmine.createSpy('dispatch').and.callFake(() => {
        MockStore.mockDispatchStatus = true;
    });
}
