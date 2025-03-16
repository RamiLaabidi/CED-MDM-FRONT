import {Journal} from '../journal/journal.module';

export interface GeneralLedger {
  gL_Id ?: string;
  gL_ExactAdministration?: string;
  gL_ExactGeneralLedger?: string;
  gL_Description?: string;
  gL_Inactive: boolean;
  gL_IsSuspenseAccount: boolean;
  gL_IsPrimaryProcess: boolean;
  gL_IsProfitLossAccount: boolean;
  gL_CreatedDate: Date;
  gL_LastModifiedDate: Date;

  journals?: Journal[];

}
