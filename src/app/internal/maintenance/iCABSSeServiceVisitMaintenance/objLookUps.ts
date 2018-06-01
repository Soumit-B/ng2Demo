export class ObjLookUps {
    public LookUpRefs = {
        Contract: {
            table: 'Contract',
            query: {
                BusinessCode: '',
                ContractNumber: ''
            },
            fields: ['ContractName']
        },
        Premise: {
            table: 'Premise',
            query: {
                BusinessCode: '',
                ContractNumber: '',
                PremiseNumber: ''
            },
            fields: ['PremiseName']
        },
        Product: {
            table: 'Product',
            query: {
                BusinessCode: '',
                ProductCode: ''
            },
            fields: ['ProductDesc']
        },
        VisitType: {
            table: 'VisitType',
            query: {
                BusinessCode: '',
                VisitTypeCode: ''
            },
            fields: ['VisitTypeDesc']
        },
        VisitNarrative: {
            table: 'VisitNarrative',
            query: {
                BusinessCode: '',
                VisitNarrativeCode: ''
            },
            fields: ['VisitNarrativeDesc']
        },
        Employee: {
            table: 'Employee',
            query: {
                BusinessCode: '',
                EmployeeCode: ''
            },
            fields: ['EmployeeSurname']
        },
        ManualVisitReason: {
            table: 'ManualVisitReason',
            query: {
                BusinessCode: '',
                ManualVisitReasonCode: ''
            },
            fields: ['ManualVisitReasonDesc']
        },
        NoSignatureReason: {
            table: 'NoSignatureReason',
            query: {
                BusinessCode: '',
                ReasonNumber: ''
            },
            fields: ['ReasonDesc']
        },
        NoServiceReason: {
            table: 'NoServiceReason',
            query: {
                BusinessCode: '',
                NoServiceReasonCode: ''
            },
            fields: ['NoServiceReasonDesc']
        }
    };
}
