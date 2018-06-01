import { generic } from './generic';
import { prospect } from './prospect';
import { StoreModule } from '@ngrx/store';
import { account } from './account';
import { contract } from './contract';
import { callcentresearch } from './call-centre-search';
import { preview } from './preview';
import { contact } from './contact';
import { invoice } from './invoice';
import { accountMaintenance } from './account-maintenance';
export var Store = StoreModule.provideStore({
    account: account,
    contact: contact,
    contract: contract,
    callcentresearch: callcentresearch,
    preview: preview,
    prospect: prospect,
    generic: generic,
    invoice: invoice,
    accountMaintenance: accountMaintenance
});
