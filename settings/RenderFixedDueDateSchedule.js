// We have to remove node_modules/react to avoid having multiple copies loaded.
// eslint-disable-next-line import/no-unresolved
import React from 'react';
import Textfield from '@folio/stripes-components/lib/TextField';
import Button from '@folio/stripes-components/lib/Button';
import { Row, Col } from 'react-bootstrap';
import Datepicker from '@folio/stripes-components/lib/Datepicker';
import { Field } from 'redux-form';

const RenderFixedDueDateSchedule = props => (
  <Row>
    <Col xs={4}>
      <Field
        name={`${props.member}.dateFrom`}
        type="text"
        component={Datepicker}
        placeholder="Date From"
        label="Date From"
        dateFormat="YYYY-MM-DD"
      />
    </Col>
    <Col xs={4}>
      <Field
        name={`${props.member}.dateTo`}
        type="text"
        component={Datepicker}
        placeholder="Date To"
        label="Date To"
        dateFormat="YYYY-MM-DD"
      />
    </Col>
    <Col xs={4}>
      <Field
        name={`${props.member}.dueDate`}
        type="text"
        component={Datepicker}
        placeholder="Due Date "
        label="Due Date"
        dateFormat="YYYY-MM-DD"
      />
    </Col>
  </Row>
);

export default RenderFixedDueDateSchedule;
