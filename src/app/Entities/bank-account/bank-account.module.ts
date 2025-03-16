import {Journal} from '../journal/journal.module';

export interface BankAccount {
  BAC_Id?: string;  // Utilisation de string car Angular et TypeScript utilisent des chaînes pour les UUID (Guid)
  BAC_IBAN?: string;
  BAC_Inactive:  boolean;
  journals?: Journal[]; // Relation One-to-Many avec Journal
}
