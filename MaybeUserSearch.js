import React from 'react';
import Pluggable from '@folio/stripes-components/lib/Pluggable';
import UserSearch from './UserSearch';

export default (props) => (
  <Pluggable {...props} type="find-user">
    <span />{/* nothing to render here */}
  </Pluggable>
);
