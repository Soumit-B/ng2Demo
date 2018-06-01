import { ProductSearchGridComponent } from './../../search/iCABSBProductSearch';
import { PlanVisitSearchComponent } from './../../search/iCABSSePlanVisitSearch.component';
import { EmployeeSearchComponent } from './../../search/iCABSBEmployeeSearch';
import { ScreenNotReadyComponent } from './../../../../shared/components/screenNotReady';

export class ObjEllipsis {
    public ellipsis = {
        PlanVisitNumber: {
            isDisabled: false,
            isCloseButtonEnabled: true,
            isHeaderEnabled: true,
            childparams: {
                parentMode: 'LookUp',
                ContractNumber: '',
                ContractName: '',
                PremiseNumber: '',
                PremiseName: '',
                ProductCode: '',
                ProductDesc: '',
                ServiceCoverRowID: '',
                LastServiceVisitAnnivDate: '', //LookUp-CreditMissedService
                EarliestVisitDueDate: '' //LookUp-PDAICABSActivity
            },
            component: PlanVisitSearchComponent
        },
        PlanVisitNumber2: {
            isDisabled: false,
            isCloseButtonEnabled: true,
            isHeaderEnabled: true,
            childparams: {
                parentMode: 'LookUp',
                ContractNumber: '',
                ContractName: '',
                PremiseNumber: '',
                PremiseName: '',
                ProductCode: '',
                ProductDesc: '',
                ServiceCoverRowID: '',
                LastServiceVisitAnnivDate: '',
                EarliestVisitDueDate: ''
            },
            component: PlanVisitSearchComponent
        },
        EmployeeCode: {
            isDisabled: false,
            isCloseButtonEnabled: true,
            isHeaderEnabled: true,
            childparams: {
                parentMode: 'LookUp-Service-All'
            },
            component: EmployeeSearchComponent
        },
        AdditionalEmployee: {
            isDisabled: false,
            isCloseButtonEnabled: true,
            isHeaderEnabled: true,
            childparams: {
                parentMode: 'LookUp-Service-Additional'
            },
            component: EmployeeSearchComponent
        },
        ProductComponentCode: {
            isDisabled: false,
            isCloseButtonEnabled: true,
            isHeaderEnabled: true,
            childparams: {
                parentMode: 'LookUp',
                SelComponentTypeCode: ''
            },
            component: ProductSearchGridComponent
        }
    };
}
