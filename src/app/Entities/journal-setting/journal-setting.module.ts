export interface JournalSetting {
  jlS_Id?: string;
  jlS_LegalEntity_Id?: string;
  jlS_JournalSettingType_Id?: string;
  jlS_Journal_Id?: string;
  jlS_GeneralLedger_Id?: string;
  jlS_EffectiveDate: Date;
  jlS_TerminationDate: Date;
  jlS_CreatedDate: Date;
  jlS_LastModifiedDate: Date;
  jlS_ZeroRateForeignTaxCode?: string;
  jlS_EntrySystem?:string;

}

