import {JournalSetting} from "../journal-setting/journal-setting.module";

export interface Journal {
  JRL_Id?: string;
  JRL_TimeStamp: Date;
  jrL_Abbreviation?: string;
  jrL_Description?: string;
  JRL_CurrencyCode?: string;
  jrL_JournalType_Id?: string;
  JRL_GeneralLedger_Id?: string;
  JRL_BankAccount_Id?: string;
  JRL_LegalEntity_Id?: string;
  JRL_ExactAdministration?: string;
  JRL_ExactJournal?: string;
  JRL_Inactive: boolean;
  journalSettings: JournalSetting[];

}

