import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';

import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Select from '@folio/stripes-components/lib/Select';
import TextField from '@folio/stripes-components/lib/TextField';

class Period extends React.Component {

  constructor(props) {
    super(props);

  }

  render() {

    const { label, elementName, intervalOptions } = this.props;

    return (
      <div>
        <p>{label}</p>
        <Row>
          <Col xs={2}>
            <Field label="" name={`${elementName}.duration`} component={TextField} rounded />
          </Col>
          <Col>
            <Field
              label=""
              name={`${elementName}.intervalId`}
              component={Select}
              placeholder="Select interval"
              dataOptions={intervalOptions}
            />
          </Col>
        </Row>
      </div>
    );
  }

}

export default Period;
