import {Journal} from '../journal/journal.module';

export interface GeneralLedger {
  gL_Id ?: string;
  GL_ExactAdministration?: string;
  GL_ExactGeneralLedger?: string;
  GL_Description?: string;
  GL_Inactive: boolean;
  journals?: Journal[];

}
