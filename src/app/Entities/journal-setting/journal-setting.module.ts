export interface JournalSetting {
  jlsId?: string; // Guid
  legalEntityId?: string; // Guid
  jlsJournalSettingTypeId?: string;
  jlsJournalId?: string;
  jlsGeneralLedgerId?: string;
  jlsEffectiveDate: Date;
  jlsTerminationDate?: Date;
  jlsCreatedDate: Date;
  jlsLastModifiedDate: Date;
  jlsZeroRateForeignTaxCode?: string;
  entrySystem?:string;

}

