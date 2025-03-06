import {JournalSetting} from "../journal-setting/journal-setting.module";

export interface Journal {
  JRL_Id?: string;
  JRL_TimeStamp: Date;
  JRL_Abbreviation?: string;
  JRL_Description?: string;
  JRL_CurrencyCode?: string;
  JRL_JournalType_Id?: string;
  JRL_GeneralLedger_Id?: string;
  JRL_BankAccount_Id?: string;
  JRL_LegalEntity_Id?: string;
  JRL_ExactAdministration?: string;
  JRL_ExactJournal?: string;
  JRL_Inactive: boolean;
  journalSettings: JournalSetting[];

}

