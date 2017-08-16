import React from 'react';
import Pluggable from '@folio/stripes-components/lib/Pluggable';

export default props => (
  <Pluggable {...props} type="find-user" embededModule={"@folio/users"}>
    <span />{/* nothing to render here */}
  </Pluggable>
);
