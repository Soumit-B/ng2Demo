import { Component, Input, ViewChildren, ElementRef, ViewContainerRef, ComponentFactoryResolver, EventEmitter, Output } from '@angular/core';
import { RiExchange } from '../../../shared/services/riExchange';
export var TabsComponent = (function () {
    function TabsComponent(resolver, riExchange, el) {
        this.resolver = resolver;
        this.riExchange = riExchange;
        this.el = el;
        this.onTabSelect = new EventEmitter();
        this.cmpArr = [];
        this.isViewInitialized = false;
        this.tabSelected = false;
    }
    TabsComponent.prototype.updateComponent = function () {
        if (!this.isViewInitialized) {
            return;
        }
        if (this.cmpArr) {
            for (var i = 0; i < this.cmpArr.length; i++) {
                this.cmpArr[i].destroy();
            }
        }
        for (var i = 0; i < this.componentList.length; i++) {
            this.cmpArr.push(this.container.toArray()[i].createComponent(this.resolver.resolveComponentFactory(this.componentList[i])));
        }
    };
    TabsComponent.prototype.ngOnInit = function () {
        this.isViewInitialized = true;
    };
    TabsComponent.prototype.ngAfterViewInit = function () {
        this.updateComponent();
    };
    TabsComponent.prototype.ngOnDestroy = function () {
        if (this.cmpArr) {
            for (var i = 0; i < this.cmpArr.length; i++) {
                this.cmpArr[i].destroy();
            }
        }
        this.onTabSelect.unsubscribe();
    };
    TabsComponent.prototype.ngOnChanges = function (data) {
        var _this = this;
        setTimeout(function () {
            if ((data.tabs.previousValue && data.tabs.previousValue.constructor === Array) || (data.componentList.previousValue && data.componentList.previousValue.constructor === Array)) {
                _this.updateComponent();
            }
        }, 0);
    };
    TabsComponent.prototype.alertMe = function () {
    };
    ;
    TabsComponent.prototype.tabFocusTo = function (index, error) {
        if (error === void 0) { error = false; }
        for (var k = 0; k < this.tabs.length; k++) {
            this.tabs[k].active = false;
            document.querySelectorAll('.tab-container > ul li')[k].classList.remove('red-bdr');
        }
        if (error) {
            document.querySelectorAll('.tab-container > ul li')[index].classList.add('red-bdr');
        }
        this.onTabActive(this.tabs[index], index);
    };
    ;
    TabsComponent.prototype.onTabActive = function (tab, index) {
        if (!tab.active) {
            tab.active = true;
            this.onTabSelect.emit({
                tabInfo: tab,
                tabIndex: index
            });
        }
    };
    TabsComponent.prototype.removeTabHandler = function () {
    };
    ;
    TabsComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-tabs',
                    templateUrl: 'tabs.html'
                },] },
    ];
    TabsComponent.ctorParameters = [
        { type: ComponentFactoryResolver, },
        { type: RiExchange, },
        { type: ElementRef, },
    ];
    TabsComponent.propDecorators = {
        'container': [{ type: ViewChildren, args: ['tabRef', { read: ViewContainerRef },] },],
        'tabs': [{ type: Input },],
        'componentList': [{ type: Input },],
        'onTabSelect': [{ type: Output },],
    };
    return TabsComponent;
}());
