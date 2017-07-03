import _ from 'lodash';
import React, { PropTypes } from 'react';

import { Field, reduxForm, SubmissionError } from 'redux-form';

import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import Button from '@folio/stripes-components/lib/Button';
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';
import TextField from '@folio/stripes-components/lib/TextField';
import { Row, Col } from 'react-bootstrap';

import UserSearch from "./lib/UserSearch";

const propTypes = {
  modeSelector: React.PropTypes.element,
  scannedItems: React.PropTypes.arrayOf(React.PropTypes.object),
  patrons: React.PropTypes.arrayOf(React.PropTypes.object),
  handleSubmit: PropTypes.func.isRequired,
  submithandler: PropTypes.func.isRequired,
  reset: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  onCancel: PropTypes.func,
  onClickDone: React.PropTypes.func,
  userIdentifierPref: PropTypes.object,
  parentProps: PropTypes.object,
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
      submithandler,
      userIdentifierPref,
  } = props;

  const handleKeyDown = (e, handler) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault();
      handler();
    }
  };

  const makeSH = (values, source) =>
    submithandler({
      ...values,
      SubmitMeta: { button: source },
    });

  const selectUser = (user) => {    
    if(user[userIdentifierPref.key]) {
      props.change("patron.identifier", user[userIdentifierPref.key]);
    } else {
      user.error = `User ${user.username} does not have a ${userIdentifierPref.label}`
    }
  }

  return (
    <form>
      <div style={containerStyle}>
        <Paneset static>
          <Pane defaultWidth="50%" paneTitle="Patron" firstMenu={props.modeSelector}>
            <Row>
              <Col xs={9}>
                <Field
                  name="patron.identifier"
                  placeholder={`Enter Patron's ${userIdentifierPref.label}`}
                  aria-label="Patron Identifier"
                  fullWidth
                  id="patron_identifier"
                  component={TextField}
                  startControl={<UserSearch {...props.parentProps} selectUser={selectUser} />}
                  onKeyDown={(e) => { handleKeyDown(e, handleSubmit(values => makeSH(values, 'find_patron'))); }}
                />
              </Col>
              <Col xs={3}>
                <Button
                  buttonStyle="primary noRadius"
                  fullWidth
                  onClick={handleSubmit(values => makeSH(values, 'find_patron'))}
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
                <Field
                  name="item.barcode"
                  placeholder="Enter Barcode"
                  aria-label="Item ID"
                  fullWidth
                  id="barcode"
                  component={TextField}
                  onKeyDown={(e) => { handleKeyDown(e, handleSubmit(values => makeSH(values, 'add_item'))); }}
                />
              </Col>
              <Col xs={3}>
                <Button
                  buttonStyle="primary noRadius"
                  fullWidth
                  onClick={handleSubmit(values => makeSH(values, 'add_item'))}
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
          <Button buttonStyle="primary mega" onClick={() => { props.onClickDone(); reset(); }} >Done</Button> : null
        }
      </div>
    </form>
  );
}

CheckOut.propTypes = propTypes;

export default reduxForm({
  form: 'CheckOut',
})(CheckOut);
