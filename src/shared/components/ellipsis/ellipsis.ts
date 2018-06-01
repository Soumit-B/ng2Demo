import { Component, ComponentRef, ViewChild, Input, Output, OnInit, AfterViewInit, OnChanges, OnDestroy, ViewContainerRef, ComponentFactoryResolver, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PageDataService } from '../../services/page-data.service';
import { RiExchange } from '../../../shared/services/riExchange';
import { RouteAwayGlobals } from '../../services/route-away-global.service';

@Component({
    selector: 'icabs-ellipsis',
    template: `
        <div class="ellipsis" tabindex="-1" (keyup.enter)="openModal()" [ngClass]="{'disabled': disabled, 'hidden': hideIcon }" (click)="openModal()"></div>
        <icabs-modal #childModal="child" [config]="modalConfig" (modalClose)="modalClose($event)" [showHeader]="showHeader" [title]="title" [showCloseButton]="showCloseButton">
            <div #dynamicComponent></div>
        </icabs-modal>
    `,
    styles: [`
        .ellipsis.disabled {
            opacity: 0.4;
        }
    `]
})

export class EllipsisComponent implements OnInit, OnChanges, OnDestroy {

    // Private properties
    private componentReference: ComponentRef<any>;
    private isViewInitialized: boolean = false;
    private subscriptionRef: any;
    public configParams: Object;

    @ViewChild('childModal') public childModal;
    @ViewChild('dynamicComponent', { read: ViewContainerRef }) public dynamicComponent: any;
    @Input() contentComponent: any;
    @Input() showHeader: boolean;
    @Input() showCloseButton: boolean;
    @Input() closeModalManual: boolean;
    @Input() disabled: boolean;
    @Input() title: any;
    @Input() childConfigParams: Object = null;
    @Input() autoOpen: boolean;
    @Input() modalConfig: any;
    @Input() searchModalRoute: any;
    @Input() searchPageRoute: any;
    @Input() ellipsisIdentifier: any;
    @Input() hideIcon: any;
    @Input() refreshComponent: boolean;
    @Output() ellipsisData = new EventEmitter();
    @Output() modalHidden = new EventEmitter();
    @Output() addModeOn = new EventEmitter();

    constructor(private resolver: ComponentFactoryResolver, private router: Router, private pageData: PageDataService, private riExchange: RiExchange, private routeAwayGlobal: RouteAwayGlobals) {
    }

    public updateComponent(): void {
        if (!this.isViewInitialized) {
            return;
        }
        if (this.componentReference) {
            this.componentReference.destroy();
        }
        if (this.contentComponent) {
            this.componentReference = this.dynamicComponent.createComponent(this.resolver.resolveComponentFactory(this.contentComponent));
        }
    }

    public openModal(): void {
        if (!this.disabled) {
            if (this.ellipsisIdentifier) {
                this.pageData.saveEllipsisIdentifier(this.ellipsisIdentifier);
            }
            if (this.componentReference.instance.updateView) {
                this.componentReference.instance.updateView(this.childConfigParams);
            }
            if (this.searchModalRoute && this.searchModalRoute !== '') {
                this.router.navigate([this.searchModalRoute]);
            } else {
                this.childModal.show();
            }
            if (this.componentReference.instance.selectedDataEvent) {
                if (this.subscriptionRef) {
                    this.subscriptionRef.unsubscribe();
                }
                this.subscriptionRef = this.componentReference.instance.selectedDataEvent.subscribe(data => {
                    this.sendDataToParent(data);
                });
            }

            this.riExchange.Busy = true;
        }
    }

    public modalClose(data?: any): void {
        this.modalHidden.emit(data);
    }

    public closeModal(): void {
        this.childModal.hide();
        this.riExchange.Busy = false;
    }

    public onAddNew(e: boolean): void {
        this.addModeOn.emit(e);
    }

    public ngOnInit(): void {
        this.isViewInitialized = true;
        this.updateComponent();
    }

    public ngOnChanges(data: any): void {
        if (this.autoOpen === true) {
            this.openModal();
        }
        if ((data.contentComponent && data.contentComponent.previousValue['name']) || (data.refreshComponent && data.refreshComponent.currentValue === true)) {
            this.updateComponent();
        }
        if ((data.closeModalManual && data.closeModalManual.currentValue === true)) {
            this.closeModal();
        }

    }

    public ngOnDestroy(): void {
        if (this.componentReference) {
            this.componentReference.destroy();
            this.componentReference = null;
        }
        if (this.subscriptionRef) {
            this.subscriptionRef.unsubscribe();
        }
    }

    public sendDataToParent(valueReceive: any): void {
        this.closeModal();
        this.ellipsisData.emit(valueReceive);
        this.riExchange.Busy = false;
    }
}
