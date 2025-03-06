import {Journal} from '../journal/journal.module';

export interface BankAccount {
  Id?: string;  // Utilisation de string car Angular et TypeScript utilisent des chaînes pour les UUID (Guid)
  IBAN?: string;
  journals?: Journal[]; // Relation One-to-Many avec Journal
}
