import { Component, ViewChild, Input, Output, ViewContainerRef, ComponentFactoryResolver, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PageDataService } from '../../services/page-data.service';
import { RiExchange } from '../../../shared/services/riExchange';
import { RouteAwayGlobals } from '../../services/route-away-global.service';
export var EllipsisComponent = (function () {
    function EllipsisComponent(resolver, router, pageData, riExchange, routeAwayGlobal) {
        this.resolver = resolver;
        this.router = router;
        this.pageData = pageData;
        this.riExchange = riExchange;
        this.routeAwayGlobal = routeAwayGlobal;
        this.isViewInitialized = false;
        this.childConfigParams = null;
        this.ellipsisData = new EventEmitter();
        this.modalHidden = new EventEmitter();
        this.addModeOn = new EventEmitter();
    }
    EllipsisComponent.prototype.updateComponent = function () {
        if (!this.isViewInitialized) {
            return;
        }
        if (this.componentReference) {
            this.componentReference.destroy();
        }
        if (this.contentComponent) {
            this.componentReference = this.dynamicComponent.createComponent(this.resolver.resolveComponentFactory(this.contentComponent));
        }
    };
    EllipsisComponent.prototype.openModal = function () {
        var _this = this;
        if (!this.disabled) {
            if (this.ellipsisIdentifier) {
                this.pageData.saveEllipsisIdentifier(this.ellipsisIdentifier);
            }
            if (this.componentReference.instance.updateView) {
                this.componentReference.instance.updateView(this.childConfigParams);
            }
            if (this.searchModalRoute && this.searchModalRoute !== '') {
                this.router.navigate([this.searchModalRoute]);
            }
            else {
                this.childModal.show();
            }
            if (this.componentReference.instance.selectedDataEvent) {
                if (this.subscriptionRef) {
                    this.subscriptionRef.unsubscribe();
                }
                this.subscriptionRef = this.componentReference.instance.selectedDataEvent.subscribe(function (data) {
                    _this.sendDataToParent(data);
                });
            }
            this.riExchange.Busy = true;
        }
    };
    EllipsisComponent.prototype.modalClose = function (data) {
        this.modalHidden.emit(data);
    };
    EllipsisComponent.prototype.closeModal = function () {
        this.childModal.hide();
        this.riExchange.Busy = false;
    };
    EllipsisComponent.prototype.onAddNew = function (e) {
        this.addModeOn.emit(e);
    };
    EllipsisComponent.prototype.ngOnInit = function () {
        this.isViewInitialized = true;
        this.updateComponent();
    };
    EllipsisComponent.prototype.ngOnChanges = function (data) {
        if (this.autoOpen === true) {
            this.openModal();
        }
        if ((data.contentComponent && data.contentComponent.previousValue['name']) || (data.refreshComponent && data.refreshComponent.currentValue === true)) {
            this.updateComponent();
        }
        if ((data.closeModalManual && data.closeModalManual.currentValue === true)) {
            this.closeModal();
        }
    };
    EllipsisComponent.prototype.ngOnDestroy = function () {
        if (this.componentReference) {
            this.componentReference.destroy();
            this.componentReference = null;
        }
        if (this.subscriptionRef) {
            this.subscriptionRef.unsubscribe();
        }
    };
    EllipsisComponent.prototype.sendDataToParent = function (valueReceive) {
        this.closeModal();
        this.ellipsisData.emit(valueReceive);
        this.riExchange.Busy = false;
    };
    EllipsisComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-ellipsis',
                    template: "\n        <div class=\"ellipsis\" tabindex=\"-1\" (keyup.enter)=\"openModal()\" [ngClass]=\"{'disabled': disabled, 'hidden': hideIcon }\" (click)=\"openModal()\"></div>\n        <icabs-modal #childModal=\"child\" [config]=\"modalConfig\" (modalClose)=\"modalClose($event)\" [showHeader]=\"showHeader\" [title]=\"title\" [showCloseButton]=\"showCloseButton\">\n            <div #dynamicComponent></div>\n        </icabs-modal>\n    ",
                    styles: ["\n        .ellipsis.disabled {\n            opacity: 0.4;\n        }\n    "]
                },] },
    ];
    EllipsisComponent.ctorParameters = [
        { type: ComponentFactoryResolver, },
        { type: Router, },
        { type: PageDataService, },
        { type: RiExchange, },
        { type: RouteAwayGlobals, },
    ];
    EllipsisComponent.propDecorators = {
        'childModal': [{ type: ViewChild, args: ['childModal',] },],
        'dynamicComponent': [{ type: ViewChild, args: ['dynamicComponent', { read: ViewContainerRef },] },],
        'contentComponent': [{ type: Input },],
        'showHeader': [{ type: Input },],
        'showCloseButton': [{ type: Input },],
        'closeModalManual': [{ type: Input },],
        'disabled': [{ type: Input },],
        'title': [{ type: Input },],
        'childConfigParams': [{ type: Input },],
        'autoOpen': [{ type: Input },],
        'modalConfig': [{ type: Input },],
        'searchModalRoute': [{ type: Input },],
        'searchPageRoute': [{ type: Input },],
        'ellipsisIdentifier': [{ type: Input },],
        'hideIcon': [{ type: Input },],
        'refreshComponent': [{ type: Input },],
        'ellipsisData': [{ type: Output },],
        'modalHidden': [{ type: Output },],
        'addModeOn': [{ type: Output },],
    };
    return EllipsisComponent;
}());
