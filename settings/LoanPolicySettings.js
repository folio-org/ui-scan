import React, { PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';

import Pane from '@folio/stripes-components/lib/Pane';

class LoanPolicySettings extends React.Component {

  static propTypes = {
    // data: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Pane defaultWidth="fill" fluidContentWidth paneTitle="Loan Policies">
        <Row>
          <Col xs={12}>
            content
          </Col>
        </Row>
      </Pane>
    );
  }

}

export default LoanPolicySettings;
