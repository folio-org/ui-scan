// We have to remove node_modules/react to avoid having multiple copies loaded.
// eslint-disable-next-line import/no-unresolved
import React from 'react';
import Settings from '@folio/stripes-components/lib/Settings';

import ScanCheckoutSettings from './ScanCheckoutSettings';
import LoanPolicySettings from './LoanPolicySettings';

const pages = [
  {
    route: 'checkout',
    label: 'Check-out',
    component: ScanCheckoutSettings,
  },
  {
    route: 'loanpolicies',
    label: 'Loan policies',
    component: LoanPolicySettings,
  },
];

export default props => <Settings {...props} pages={pages} />;
