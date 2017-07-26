import _ from 'lodash';
import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';

import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import Button from '@folio/stripes-components/lib/Button';
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';
import TextField from '@folio/stripes-components/lib/TextField';
import { Row, Col } from 'react-bootstrap';

import MaybeUserSearch from './MaybeUserSearch';

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
  change: PropTypes.func,
};

const contextTypes = {
  history: PropTypes.object,
};

class CheckOut extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.context = context;
    this.anchoredRowFormatter = this.anchoredRowFormatter.bind(this);
    this.selectUser = this.selectUser.bind(this);
    this.onSelectPatronRow = this.onSelectPatronRow.bind(this);
    this.onSelectItemRow = this.onSelectItemRow.bind(this);
  }

  onSelectPatronRow(e, patron) {
    const userId = patron.id;
    const username = patron.username;
    this.context.history.push(`/users/view/${userId}/${username}`);
  }

  onSelectItemRow(e, item) {
    this.context.history.push(`/items/view/${item.itemId}`);
  }

  handleKeyDown(e, handler) {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault();
      handler();
    }
  }

  makeSH(values, source) {
    this.props.submithandler({ ...values, SubmitMeta: { button: source } });
  }

  selectUser(user) {
    const { userIdentifierPref } = this.props;

    if (user[userIdentifierPref.queryKey]) {
      this.props.change('patron.identifier', user[userIdentifierPref.queryKey]);
    } else {
      Object.assign(user, { error: `User ${user.username} does not have a ${userIdentifierPref.label}` });
    }
  }

  getRowURL(data) {
    return ((data.username) ?
      `/users/view/${data.id}/${data.username}` :
      `/items/view/${data.itemId}`);
  }

  anchoredRowFormatter(row) {
    return (
      <a
        href={this.getRowURL(row.rowData)} key={`row-${row.rowIndex}`}
        aria-label={row.labelStrings && row.labelStrings.join('...')}
        role="listitem"
        className={`${row.rowClass}`}
        {...row.rowProps}
      >
        {row.cells}
      </a>
    );
  }

  render() {
    const {
      handleSubmit,
      reset,  // eslint-disable-line no-unused-vars
      pristine, // eslint-disable-line no-unused-vars
      submitting, // eslint-disable-line no-unused-vars
      onCancel, // eslint-disable-line no-unused-vars
      userIdentifierPref,
      modeSelector,
      parentProps,
      patrons,
      scannedItems,
      onClickDone,
    } = this.props;

    console.log('props', patrons, patrons.length);

    const patronsListFormatter = {
      Active: user => user.active,
      Name: user => `${_.get(user, ['personal', 'lastName'], '')}, ${_.get(user, ['personal', 'firstName'], '')}`,
      Username: user => user.username,
      Email: user => _.get(user, ['personal', 'email']),
    };

    const itemListFormatter = {
      title: loan => `${_.get(loan, ['item', 'title'])}`,
      barcode: loan => `${_.get(loan, ['item', 'barcode'])}`,
      loanDate: loan => <td style={{ width: '18em' }}>{loan.loanDate.substr(0, 10)}</td>,
    };

    const containerStyle = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      width: '100%',
      position: 'absolute',
    };

    if (patrons.length && scannedItems.length) {
      containerStyle.height = '98.6%';
    }

    return (
      <form>
        <div style={containerStyle}>
          <Paneset static>
            <Pane defaultWidth="50%" paneTitle="Patron" firstMenu={modeSelector}>
              <Row>
                <Col xs={9}>
                  <Field
                    name="patron.identifier"
                    placeholder={`Enter Patron's ${userIdentifierPref.label}`}
                    aria-label="Patron Identifier"
                    fullWidth
                    id="patron_identifier"
                    component={TextField}
                    startControl={<MaybeUserSearch {...parentProps} selectUser={this.selectUser} />}
                    onKeyDown={(e) => { this.handleKeyDown(e, handleSubmit(values => this.makeSH(values, 'find_patron'))); }}
                  />
                </Col>
                <Col xs={3}>
                  <Button
                    buttonStyle="primary noRadius"
                    fullWidth
                    onClick={handleSubmit(values => this.makeSH(values, 'find_patron'))}
                  >Find Patron</Button>
                </Col>
              </Row>
              <MultiColumnList
                contentData={patrons}
                rowMetadata={['id', 'username']}
                formatter={patronsListFormatter}
                visibleColumns={['Active', 'Name', 'Username', 'Email']}
                autosize
                virtualize
                isEmptyMessage={'No patron selected'}
                rowFormatter={this.anchoredRowFormatter}
                onRowClick={this.onSelectPatronRow}
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
                    onKeyDown={(e) => { this.handleKeyDown(e, handleSubmit(values => this.makeSH(values, 'add_item'))); }}
                  />
                </Col>
                <Col xs={3}>
                  <Button
                    buttonStyle="primary noRadius"
                    fullWidth
                    onClick={handleSubmit(values => this.makeSH(values, 'add_item'))}
                  >+ Add item</Button>
                </Col>
              </Row>
              <MultiColumnList
                visibleColumns={['title', 'barcode', 'loanDate']}
                rowMetadata={['id']}
                contentData={scannedItems}
                formatter={itemListFormatter}
                isEmptyMessage="No items have been entered yet."
                autosize
                virtualize
                rowFormatter={this.anchoredRowFormatter}
                onRowClick={this.onSelectItemRow}
              />
            </Pane>

          </Paneset>
          {patrons && patrons.length ?
            <Button buttonStyle="primary mega" onClick={() => { onClickDone(); reset(); }} >Done</Button> : null
          }
        </div>
      </form>
    );
  }
}

CheckOut.propTypes = propTypes;
CheckOut.contextTypes = contextTypes;

export default reduxForm({
  form: 'CheckOut',
})(CheckOut);
