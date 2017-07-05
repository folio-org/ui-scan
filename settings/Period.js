import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';

import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Select from '@folio/stripes-components/lib/Select';
import TextField from '@folio/stripes-components/lib/TextField';

class Period extends React.Component {

  constructor(props) {
    super(props);

    this.onBlur = this.onBlur.bind(this);

  }

  focusInCurrentTarget = ({ relatedTarget, currentTarget }) => {
    if (relatedTarget === null) return false;

    var node = relatedTarget.parentNode;

    while (node !== null) {
      if (node === currentTarget) return true;
      node = node.parentNode;
    }

    return false;
  }

  onBlur(e) {
    // if (!this.focusInCurrentTarget(e)) {
    //   console.log('table blurred');
    // }

  }

  render() {

    const { label, elementName, intervalOptions } = this.props;
    const nonNull = value => isNaN(value) ? 0 : value

    return (
      <div tabIndex={0} onBlur={this.onBlur}>
        <p>{label}</p>
        <Row>
          <Col xs={2}>
            <Field
              label=""
              name={`${elementName}.duration`}
              component={TextField}
              rounded
              normalize={nonNull}
            />
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
