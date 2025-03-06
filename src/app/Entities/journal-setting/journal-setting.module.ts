export interface JournalSetting {
  jlsId?: string; // Guid
  jlsLegalEntityId?: string; // Guid
  jlsJournalSettingTypeId?: string;
  jlsJournalId?: string;
  jlsGeneralLedgerId?: string;
  jlsEffectiveDate: Date;
  jlsTerminationDate?: Date;
  jlsCreatedDate: Date;
  jlsLastModifiedDate: Date;
  jlsZeroRateForeignTaxCode?: string;


}

