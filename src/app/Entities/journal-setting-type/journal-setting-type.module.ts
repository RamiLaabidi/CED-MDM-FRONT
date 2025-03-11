import {JournalSetting} from '../journal-setting/journal-setting.module';

export interface JournalSettingType {
  JLT_Id?: string; // Guid
  JLT_Description?: string; // Guid
  JLT_Inactive?: boolean;
  journalSettings : JournalSetting[]

}
