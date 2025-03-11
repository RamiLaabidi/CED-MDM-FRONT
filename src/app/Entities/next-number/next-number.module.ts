export interface NextNumber {
  id: string;
  name?: string;
  description?: string;
  number: number;
  startRange: number;
  endRange: number;
  startDate: Date;
  endDate: Date;
  createdDate: Date;
  createdBy?: string;
  lastModifiedDate: Date;
  lastModifiedBy?: string;
}
