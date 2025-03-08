export interface JournalSetting {
  JLS_Id?: string; // Guid
  JLS_LegalEntity_Id?: string; // Guid
  JLS_JournalSettingType_Id?: string;
  JLS_Journal_Id?: string;
  JLS_GeneralLedger_Id?: string;
  JLS_EffectiveDate: Date;
  JLS_TerminationDate?: Date;
  JLS_CreatedDate: Date;
  JLS_LastModifiedDate: Date;
  JLS_ZeroRateForeignTaxCode?: string;
  JLS_EntrySystem?:string;

}

