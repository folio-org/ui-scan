import _ from 'lodash';
// We have to remove node_modules/react to avoid having multiple copies loaded.
// eslint-disable-next-line import/no-unresolved
import React, { PropTypes } from 'react';

import { Field, reduxForm } from 'redux-form';

import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import Button from '@folio/stripes-components/lib/Button';
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';
import TextField from '@folio/stripes-components/lib/TextField';
import { Row, Col } from 'react-bootstrap';

const propTypes = {
  modeSelector: React.PropTypes.element,
  scannedItems: React.PropTypes.arrayOf(React.PropTypes.object),
  patrons: React.PropTypes.arrayOf(React.PropTypes.object),
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  onCancel: PropTypes.func,
  onClickDone: React.PropTypes.func,
};

function CheckOut(props) {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    width: '100%',
    position: 'absolute',
  };

  if (props.patrons.length !== 0 && props.scannedItems.length !== 0) {
    containerStyle.height = '98.6%';
  }

  const itemListFormatter = {
    title: loan => `${_.get(loan, ['item', 'title'])}`,
    barcode: loan => `${_.get(loan, ['item', 'barcode'])}`,
    loanDate: loan => <td style={{ width: '18em' }}>{loan.loanDate.substr(0, 10)}</td>,
  };

  const patronsListFormatter = {
    Active: user => user.active,
    Name: user => `${_.get(user, ['personal', 'last_name'], '')}, ${_.get(user, ['personal', 'first_name'], '')}`,
    Username: user => user.username,
    Email: user => _.get(user, ['personal', 'email']),
  };

  const {
      handleSubmit,
      reset,  // eslint-disable-line no-unused-vars
      pristine, // eslint-disable-line no-unused-vars
      submitting, // eslint-disable-line no-unused-vars
      onCancel, // eslint-disable-line no-unused-vars
      onSubmit,
  } = props;

  return (
    <form>
      <div style={containerStyle}>
        <Paneset static>
          <Pane defaultWidth="50%" paneTitle="Patron" firstMenu={props.modeSelector}>
            <Row>
              <Col xs={9}>
                <Field name="patron.username" placeholder="Enter Patron's username" aria-label="Patron ID" fullWidth id="patronid" component={TextField} />
              </Col>
              <Col xs={3}>
                <Button
                  buttonStyle="primary noRadius"
                  fullWidth
                  onClick={handleSubmit(values =>
                    onSubmit({
                      ...values,
                      SubmitMeta: { button: 'find_patron' },
                    }))
                  }
                >Find Patron</Button>
              </Col>
            </Row>
            <MultiColumnList
              contentData={props.patrons}
              rowMetadata={['id', 'username']}
              formatter={patronsListFormatter}
              visibleColumns={['Active', 'Name', 'Username', 'Email']}
              fullWidth
              isEmptyMessage={'No patron selected'}
            />
          </Pane>
          <Pane defaultWidth="50%" paneTitle="Scanned Items">
            <Row>
              <Col xs={9}>
                <Field name="item.barcode" placeholder="Enter Barcode" aria-label="Item ID" fullWidth id="barcode" component={TextField} />
              </Col>
              <Col xs={3}>
                <Button
                  buttonStyle="primary noRadius"
                  fullWidth
                  onClick={handleSubmit(values =>
                    onSubmit({
                      ...values,
                      SubmitMeta: { button: 'add_item' },
                    }))
                   }
                >+ Add item</Button>
              </Col>
            </Row>
            <MultiColumnList
              visibleColumns={['title', 'barcode', 'loanDate']}
              rowMetadata={['id']}
              contentData={props.scannedItems}
              formatter={itemListFormatter}
              isEmptyMessage="No items have been entered yet."
              fullWidth
            />
          </Pane>

        </Paneset>
        {props.patrons && props.patrons.length !== 0 ?
          <Button buttonStyle="primary mega" onClick={props.onClickDone} >Done</Button> : null
        }
      </div>
    </form>
  );
}

CheckOut.propTypes = propTypes;

export default reduxForm({
  form: 'CheckOut',
})(CheckOut);
