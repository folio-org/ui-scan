export const patronIdentifierTypes = [
  { key: 'BARCODE', label: 'Barcode', queryKey: 'barcode' },
  { key: 'EXTERNAL', label: 'External System ID', queryKey: '' },
  { key: 'FOLIO', label: 'FOLIO Record Number', queryKey: 'id' },
  { key: 'USER', label: 'User ID', queryKey: 'username' },
];

// n.b.: This should be changed to 'barcode' once barcode support is available for users
export const defaultPatronIdentifier = { key: 'USER', label: 'User ID', queryKey: 'username' };

export default '';
