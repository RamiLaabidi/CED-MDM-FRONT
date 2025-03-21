export interface NextNumber {
  NEX_Id: string;
  NEX_Name?: string;
  NEX_Description?: string;
  neX_Number: number;
  NEX_StartRange: number;
  NEX_EndRange: number;
  NEX_StartDate: Date;
  NEX_EndDate: Date;
  NEX_CreatedDate: Date;
  NEX_CreatedBy?: string;
  NEX_LastModifiedDate: Date;
  NEX_LastModifiedBy?: string;
  NEX_StartRangeOurRef: number;
  NEX_EnRangeOurRef: number;
  NEX_NumberOurRef: number;
  NEX_OurRef_EntryNumber: boolean;
}
