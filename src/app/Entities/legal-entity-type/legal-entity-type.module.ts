import {Journal} from '../journal/journal.module';
import {LegalEntity} from '../legal-entity/legal-entity.module';

export interface LegalEntityType {
  leT_Id?: string;             // Clé primaire (PK)
  leT_ShortName?: string;   // Abréviation du type de journal
  leT_LongName?: string;    // Description du type de journal
  legalEntities?: LegalEntity[];       // Relation One-to-Many avec Journal
}
//LE_LegalEntityType_Id?: number;      // Type exact (short en C# → number en TS)
