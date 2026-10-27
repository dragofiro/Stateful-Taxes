/*import { AKStateForm } from './AK';
import { ALStateForm } from './AL';
import { ARStateForm } from './AR';
import { AZStateForm } from './AZ';
import { CAStateForm } from './CA';
import { COStateForm } from './CO';
import { CTStateForm } from './CT';
import { DEStateForm } from './DE';
import { FLStateForm } from './FL';
import { GAStateForm } from './GA';
import { HIStateForm } from './HI';
import { IAStateForm } from './IA';
import { IDStateForm } from './ID';
import { ILStateForm } from './IL';
import { INStateForm } from './IN';
import { KSStateForm } from './KS';
import { KYStateForm } from './KY';
import { LAStateForm } from './LA';
import { MAStateForm } from './MA';
import { MDStateForm } from './MD';
import { MEStateForm } from './ME';
import { MIStateForm } from './MI';
import { MNStateForm } from './MN';
import { MOStateForm } from './MO';
import { MSStateForm } from './MS';
import { MTStateForm } from './MT';
import { NCStateForm } from './NC';
import { NDStateForm } from './ND';
import { NEStateForm } from './NE';
import { NHStateForm } from './NH';
import { NJStateForm } from './NJ';
import { NMStateForm } from './NM';
import { NVStateForm } from './NV';
import { NYStateForm } from './NY';
import { OHStateForm } from './OH';
import { OKStateForm } from './OK';
import { ORStateForm } from './OR';
import { PAStateForm } from './PA';
import { RIStateForm } from './RI';
import { SCStateForm } from './SC';
import { SDStateForm } from './SD';
import { TNStateForm } from './TN';
import { TXStateForm } from './TX';
import { UTStateForm } from './UT';
import { VAStateForm } from './VA';
import { VTStateForm } from './VT';
import { WAStateForm } from './WA';
import { WIStateForm } from './WI';
import { WVStateForm } from './WV';
import { WYStateForm } from './WY';

export const STATE_REGISTRY = {
  AK: { name: 'Alaska', code: 'AK', formName: 'Form Form', component: AKStateForm, status: 'Available' },
  AL: { name: 'Alabama', code: 'AL', formName: 'Form 40', component: ALStateForm, status: 'Available' },
  AR: { name: 'Arkansas', code: 'AR', formName: 'Form AR1000F', component: ARStateForm, status: 'Available' },
  AZ: { name: 'Arizona', code: 'AZ', formName: 'Form 140', component: AZStateForm, status: 'Available' },
  CA: { name: 'California', code: 'CA', formName: 'Form 540', component: CAStateForm, status: 'Available' },
  CO: { name: 'Colorado', code: 'CO', formName: 'Form 104', component: COStateForm, status: 'Available' },
  CT: { name: 'Connecticut', code: 'CT', formName: 'Form CT-1040', component: CTStateForm, status: 'Available' },
  DE: { name: 'Delaware', code: 'DE', formName: 'Form PIT-RES', component: DEStateForm, status: 'Available' },
  FL: { name: 'Florida', code: 'FL', formName: 'None', component: FLStateForm, status: 'Available' },
  GA: { name: 'Georgia', code: 'GA', formName: 'Form 500', component: GAStateForm, status: 'Available' },
  HI: { name: 'Hawaii', code: 'HI', formName: 'Form N-11', component: HIStateForm, status: 'Available' },
  IA: { name: 'Iowa', code: 'IA', formName: 'Form IA 1040', component: IAStateForm, status: 'Available' },
  ID: { name: 'Idaho', code: 'ID', formName: 'Form 40', component: IDStateForm, status: 'Available' },
  IL: { name: 'Illinois', code: 'IL', formName: 'Form IL-1040', component: ILStateForm, status: 'Available' },
  IN: { name: 'Indiana', code: 'IN', formName: 'Form IT-40', component: INStateForm, status: 'Available' },
  KS: { name: 'Kansas', code: 'KS', formName: 'Form K-40', component: KSStateForm, status: 'Available' },
  KY: { name: 'Kentucky', code: 'KY', formName: 'Form 740', component: KYStateForm, status: 'Available' },
  LA: { name: 'Louisiana', code: 'LA', formName: 'Form IT-540', component: LAStateForm, status: 'Available' },
  MA: { name: 'Massachusetts', code: 'MA', formName: 'Form 1', component: MAStateForm, status: 'Available' },
  MD: { name: 'Maryland', code: 'MD', formName: 'Form 502', component: MDStateForm, status: 'Available' },
  ME: { name: 'Maine', code: 'ME', formName: 'Form 1040ME', component: MEStateForm, status: 'Available' },
  MI: { name: 'Michigan', code: 'MI', formName: 'Form MI-1040', component: MIStateForm, status: 'Available' },
  MN: { name: 'Minnesota', code: 'MN', formName: 'Form M1', component: MNStateForm, status: 'Available' },
  MO: { name: 'Missouri', code: 'MO', formName: 'Form MO-1040', component: MOStateForm, status: 'Available' },
  MS: { name: 'Mississippi', code: 'MS', formName: 'Form 80-105', component: MSStateForm, status: 'Available' },
  MT: { name: 'Montana', code: 'MT', formName: 'Form 2', component: MTStateForm, status: 'Available' },
  NC: { name: 'North Carolina', code: 'NC', formName: 'Form D-400', component: NCStateForm, status: 'Available' },
  ND: { name: 'North Dakota', code: 'ND', formName: 'Form ND-1', component: NDStateForm, status: 'Available' },
  NE: { name: 'Nebraska', code: 'NE', formName: 'Form 1040N', component: NEStateForm, status: 'Available' },
  NH: { name: 'New Hampshire', code: 'NH', formName: 'None', component: NHStateForm, status: 'Available' },
  NJ: { name: 'New Jersey', code: 'NJ', formName: 'Form NJ-1040', component: NJStateForm, status: 'Available' },
  NM: { name: 'New Mexico', code: 'NM', formName: 'Form PIT-1', component: NMStateForm, status: 'Available' },
  NV: { name: 'Nevada', code: 'NV', formName: 'None', component: NVStateForm, status: 'Available' },
  NY: { name: 'New York', code: 'NY', formName: 'IT-201', component: NYStateForm, status: 'Available' },
  OH: { name: 'Ohio', code: 'OH', formName: 'Form IT 1040', component: OHStateForm, status: 'Available' },
  OK: { name: 'Oklahoma', code: 'OK', formName: 'Form 511', component: OKStateForm, status: 'Available' },
  OR: { name: 'Oregon', code: 'OR', formName: 'Form OR-40', component: ORStateForm, status: 'Available' },
  PA: { name: 'Pennsylvania', code: 'PA', formName: 'Form PA-40', component: PAStateForm, status: 'Available' },
  RI: { name: 'Rhode Island', code: 'RI', formName: 'Form RI-1040', component: RIStateForm, status: 'Available' },
  SC: { name: 'South Carolina', code: 'SC', formName: 'Form SC1040', component: SCStateForm, status: 'Available' },
  SD: { name: 'South Dakota', code: 'SD', formName: 'None', component: SDStateForm, status: 'Available' },
  TN: { name: 'Tennessee', code: 'TN', formName: 'None', component: TNStateForm, status: 'Available' },
  TX: { name: 'Texas', code: 'TX', formName: 'None', component: TXStateForm, status: 'Available' },
  UT: { name: 'Utah', code: 'UT', formName: 'Form TC-40', component: UTStateForm, status: 'Available' },
  VA: { name: 'Virginia', code: 'VA', formName: 'Form 760', component: VAStateForm, status: 'Available' },
  VT: { name: 'Vermont', code: 'VT', formName: 'Form IN-111', component: VTStateForm, status: 'Available' },
  WA: { name: 'Washington', code: 'WA', formName: 'None', component: WAStateForm, status: 'Available' },
  WI: { name: 'Wisconsin', code: 'WI', formName: 'Form 1', component: WIStateForm, status: 'Available' },
  WV: { name: 'West Virginia', code: 'WV', formName: 'Form IT-140', component: WVStateForm, status: 'Available' },
  WY: { name: 'Wyoming', code: 'WY', formName: 'None', component: WYStateForm, status: 'Available' },
};
*/