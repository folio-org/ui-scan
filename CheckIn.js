import _ from 'lodash';
import React, { PropTypes } from 'react';

import { Field, reduxForm } from 'redux-form';

import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import Button from '@folio/stripes-components/lib/Button';
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';
import { Row, Col } from 'react-bootstrap';
import TextField from '@folio/stripes-components/lib/TextField';

const propTypes = {
  modeSelector: React.PropTypes.element,
  scannedItems: React.PropTypes.arrayOf(React.PropTypes.object),
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  onCancel: PropTypes.func,
  submithandler: PropTypes.func,
};

function CheckIn(props) {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    width: '100%',
    position: 'absolute',
  };

  const itemListFormatter = {
    barcode: loan => `${_.get(loan, ['item', 'barcode'])}`,
    title: loan => `${_.get(loan, ['item', 'title'])}`,
    location: loan => `${_.get(loan, ['item', 'location', 'name'])}`,
    patron: loan => `${_.get(loan, ['patron'])}`,
    'Date Loaned': loan => loan.loanDate.substr(0, 10),
    'Date Returned': loan => loan.returnDate.substr(0, 10),
    status: loan => `${_.get(loan, ['item', 'status', 'name'])}`,
  };

  const {
    handleSubmit,
    reset,  // eslint-disable-line no-unused-vars
    pristine, // eslint-disable-line no-unused-vars
    submitting, // eslint-disable-line no-unused-vars
    onCancel, // eslint-disable-line no-unused-vars
    submithandler,
  } = props;

  return (
    <form onSubmit={handleSubmit(submithandler)}>
      <div style={containerStyle}>
        <Paneset static>
          <Pane paneTitle="Scanned Items" defaultWidth="100%" firstMenu={props.modeSelector}>
            <div style={{ width: '100%', maxWidth: '1024px', margin: 'auto' }}>
              <Row>
                <Col xs={9}>
                  <Field name="item.barcode" placeholder="Enter Barcode" aria-label="Item ID" fullWidth id="barcode" component={TextField} />
                </Col>
                <Col xs={3}>
                  <Button buttonStyle="primary noRadius" fullWidth type="submit">+ Add item</Button>
                </Col>
              </Row>
              <MultiColumnList
                visibleColumns={['barcode', 'title', 'location', 'patron', 'Date Loaned', 'Date Returned', 'status']}
                rowMetadata={['id']}
                contentData={props.scannedItems}
                formatter={itemListFormatter}
                isEmptyMessage="No items have been entered yet."
                fullWidth
              />
            </div>
          </Pane>
        </Paneset>
      </div>
    </form>
  );
}

CheckIn.propTypes = propTypes;

export default reduxForm({
  form: 'CheckIn',
})(CheckIn);
