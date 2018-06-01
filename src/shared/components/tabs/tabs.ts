import { ChangeDetectionStrategy, Component, Input, ViewChildren, ElementRef, OnInit, OnChanges, AfterViewInit, OnDestroy, ViewContainerRef, ComponentFactoryResolver, ComponentRef, EventEmitter, Output } from '@angular/core';
import { RiExchange } from '../../../shared/services/riExchange';
@Component({
    selector: 'icabs-tabs',
    templateUrl: 'tabs.html'
})

export class TabsComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    @ViewChildren('tabRef', { read: ViewContainerRef }) container: any;
    @Input() public tabs: Array<any>;
    @Input() public componentList: Array<any>;
    @Output() public onTabSelect = new EventEmitter<any>();

    public cmpRef: ComponentRef<any>;
    public cmpArr: Array<ComponentRef<any>> = [];
    private isViewInitialized: boolean = false;
    private tabSelected: boolean = false;

    constructor(private resolver: ComponentFactoryResolver, private riExchange: RiExchange, private el: ElementRef) { }

    updateComponent(): void {
        if (!this.isViewInitialized) {
            return;
        }
        if (this.cmpArr) {
            for (let i = 0; i < this.cmpArr.length; i++) {
                this.cmpArr[i].destroy();
            }
        }
        for (let i = 0; i < this.componentList.length; i++) {
            this.cmpArr.push(this.container.toArray()[i].createComponent(this.resolver.resolveComponentFactory(this.componentList[i])));
        }

    }

    ngOnInit(): void {
        this.isViewInitialized = true;
    }

    ngAfterViewInit(): void {
        this.updateComponent();
    }

    ngOnDestroy(): void {
        if (this.cmpArr) {
            for (let i = 0; i < this.cmpArr.length; i++) {
                this.cmpArr[i].destroy();
            }
        }
        this.onTabSelect.unsubscribe();
        //this.riExchange.releaseReference(this);
    }

    ngOnChanges(data: any): void {
        setTimeout(() => {
            if ((data.tabs.previousValue && data.tabs.previousValue.constructor === Array) || (data.componentList.previousValue && data.componentList.previousValue.constructor === Array)) {
                this.updateComponent();
            }
        }, 0);
    }

    public alertMe(): void {
        // statement
    };

    public tabFocusTo(index: number, error: boolean = false): void {
        for (let k = 0; k < this.tabs.length; k++) {
            this.tabs[k].active = false;
            document.querySelectorAll('.tab-container > ul li')[k].classList.remove('red-bdr');
        }
        if (error) {
            document.querySelectorAll('.tab-container > ul li')[index].classList.add('red-bdr');
        }
        this.onTabActive(this.tabs[index], index);
    };

    public onTabActive(tab: any, index: number): void {
        if (!tab.active) {
            tab.active = true;

            this.onTabSelect.emit({
                tabInfo: tab,
                tabIndex: index
            });
        }
    }

    public removeTabHandler(): void {
        // event handler
    };
}
