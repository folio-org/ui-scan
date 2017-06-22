// We have to remove node_modules/react to avoid having multiple copies loaded.
// eslint-disable-next-line import/no-unresolved
import React from 'react';
import Settings from '@folio/stripes-components/lib/Settings';

import ScanCheckoutSettings from './ScanCheckoutSettings';
import FixedDueDateScheduleSettings from './FixedDueDateScheduleSettings';

const pages = [
  {
    route: 'checkout',
    label: 'Check-out',
    component: ScanCheckoutSettings,
  },
  {
    route: 'fixed-schedules',
    label: 'Fixed due date schedules',
    component: FixedDueDateScheduleSettings,
  }
];

export default props => <Settings {...props} pages={pages} />;
