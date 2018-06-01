import { ICABSModule } from './module';
import { Name } from '../data/name';

export class ICABSFeature {
    featurename: Name;
    visibility: boolean;
    module: ICABSModule;
}
