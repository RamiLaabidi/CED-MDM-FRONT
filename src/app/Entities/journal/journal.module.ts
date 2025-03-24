import {JournalSetting} from "../journal-setting/journal-setting.module";

export interface Journal {
  jrL_Id?: string;
  jrL_TimeStamp: Date;
  jrL_Abbreviation?: string;
  jrL_Description?: string;
  jrL_CurrencyCode?: string;
  jrL_JournalType_Id?: string;
  jrL_GeneralLedger_Id?: string;
  jrL_BankAccount_Id?: string;
  jrL_LegalEntity_Id?: string;
  jrL_ExactAdministration?: string;
  jrL_ExactJournal?: string;
  jrL_Inactive: boolean;
  journalSettings: JournalSetting[];

}

