export const patronIdentifierTypes = [
  { key: 'BARCODE', label: 'Barcode', queryKey: 'barcode' },
  { key: 'EXTERNAL', label: 'External System ID', queryKey: 'externalSystemId' },
  { key: 'FOLIO', label: 'FOLIO Record Number', queryKey: 'id' },
  { key: 'USER', label: 'User ID', queryKey: 'username' },
];

// These next sets are temporary Select list options for LoanPolicyDetail.js
// The idea is to eventually replace them with small, controlled vocabularies
// on the server side.
export const loanProfileTypes = [
  { label: 'Fixed', value: 1 },
  { label: 'Rolling', value: 2 },
  { label: 'Indefinite', value: 3 },
];

export const intervalPeriods = [
  { label: 'Minutes', value: 1 },
  { label: 'Hours', value: 2 },
  { label: 'Days', value: 3 },
  { label: 'Weeks', value: 4 },
  { label: 'Months', value: 5 },
];

export const dueDateManagementOptions = [
  { label: 'Keep the current due date', value: 1 },
  { label: 'Move to the end of the previous open day', value: 2 },
  { label: 'Move to the beginning of the next open day', value: 3 },
  { label: 'Move to the end of the next open day', value: 4 },
];

export const renewFromOptions = [
  { label: 'Current due date', value: 1 },
  { label: 'System date', value: 2 },
];

export default '';
