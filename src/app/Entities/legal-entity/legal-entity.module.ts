import {Journal} from '../journal/journal.module';

export interface LegalEntity {
  lE_Id?: string;             // Clé primaire (PK)
  LE_ExactAdministration?: string;   // Abréviation du type de journal
  currencyCode?: string;    // Description du type de journal
  LE_LegalEntityType_Id?: number;      // Type exact (short en C# → number en TS)
  journals?: Journal[];       // Relation One-to-Many avec Journal
}
