// We have to remove node_modules/react to avoid having multiple copies loaded.
// eslint-disable-next-line import/no-unresolved
import React from 'react';
import Settings from '@folio/stripes-components/lib/Settings';

import ScanCheckoutSettings from './ScanCheckoutSettings';

const pages = [
  {
    route: 'checkout',
    label: 'Check-out',
    component: ScanCheckoutSettings,
  },
];

export default props => <Settings {...props} pages={pages} />;
