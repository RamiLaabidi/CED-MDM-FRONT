import {Journal} from '../journal/journal.module';

export interface JournalType {
  jrT_Id?: string;             // Clé primaire (PK)
  JRT_Abbreviation?: string;   // Abréviation du type de journal
  JRT_Description?: string;    // Description du type de journal
  JRT_ExactType?: number;      // Type exact (short en C# → number en TS)
  JRT_Inactive: boolean;       // Indique si le type est inactif (boolean)
  journals?: Journal[];       // Relation One-to-Many avec Journal
}
