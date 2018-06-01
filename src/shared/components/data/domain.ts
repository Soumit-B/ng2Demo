import { Name } from '../data/name';
import { ICABSFeature } from '../data/feature';

export class ICABSDomain {
    domainname: Name;
    visibility: boolean;
    feature: ICABSFeature[];
}
