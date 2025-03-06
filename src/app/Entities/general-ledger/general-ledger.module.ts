import {Journal} from '../journal/journal.module';

export interface GeneralLedger {
  GL_Id?: string;  // Correspond à GL_Id
  GL_ExactAdministration?: string;  // Correspond à GL_ExactAdministration
  GL_ExactGeneralLedger?: string;  // Correspond à GL_ExactGeneralLedger
  //journals?: Journal[];  // Stocke les IDs des journaux liés (One-to-Many)
  journals?: string[];  // Stocke les IDs des journaux liés (One-to-Many)

}
