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
  onClickDone: React.PropTypes.func,
  userIdentifierPref: PropTypes.object,
  parentProps: PropTypes.object,
  change: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
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

  // eslint-disable-next-line class-methods-use-this
  getRowURL(data) {
    return ((data.username) ?
      `/users/view/${data.id}/${data.username}` :
      `/items/view/${data.itemId}`);
  }
  makeSH(values, source) {
    return this.props.submithandler({ ...values, SubmitMeta: { button: source } });
  }

  // eslint-disable-next-line class-methods-use-this
  isValidEvent(e) {
    return (e.type === 'click' || (e.key === 'Enter' && e.shiftKey === false));
  }

  handleAdd(e, source) {
    if (!this.isValidEvent(e)) return;
    e.preventDefault();
    const handler = this.props.handleSubmit(values => this.makeSH(values, source));
    handler();
  }

  handleDone() {
    this.props.onClickDone();
    this.props.reset();
  }

  selectUser(user) {
    const { userIdentifierPref } = this.props;

    if (user[userIdentifierPref.queryKey]) {
      this.props.change('patron.identifier', user[userIdentifierPref.queryKey]);
    } else {
      Object.assign(user, { error: `User ${user.username} does not have a ${userIdentifierPref.label}` });
    }
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
      userIdentifierPref,
      modeSelector,
      parentProps,
      patrons,
      scannedItems,
      pristine,
      submitting,
    } = this.props;

    const patronsListFormatter = {
      Active: user => user.active,
      Name: user => `${_.get(user, ['personal', 'lastName'], '')}, ${_.get(user, ['personal', 'firstName'], '')}`,
      Username: user => user.username,
      Email: user => _.get(user, ['personal', 'email']),
    };

    const itemListFormatter = {
      title: loan => `${_.get(loan, ['item', 'title'])}`,
      barcode: loan => `${_.get(loan, ['item', 'barcode'])}`,
      'Date loaned': loan => loan.loanDate.substr(0, 10),
      'Date due': loan => loan.dueDate.substr(0, 10),
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
                    onKeyDown={e => this.handleAdd(e, 'find_patron')}
                  />
                </Col>
                <Col xs={3}>
                  <Button
                    buttonStyle="primary noRadius"
                    fullWidth
                    onClick={e => this.handleAdd(e, 'find_patron')}
                    disabled={submitting}
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
                    onKeyDown={e => this.handleAdd(e, 'add_item')}
                  />
                </Col>
                <Col xs={3}>
                  <Button
                    buttonStyle="primary noRadius"
                    fullWidth
                    onClick={e => this.handleAdd(e, 'add_item')}
                    disabled={submitting}
                  >+ Add item</Button>
                </Col>
              </Row>
              <MultiColumnList
                visibleColumns={['title', 'barcode', 'Date loaned', 'Date due']}
                rowMetadata={['id']}
                contentData={scannedItems}
                formatter={itemListFormatter}
                isEmptyMessage="No items have been entered yet."
                fullwidth
                rowFormatter={this.anchoredRowFormatter}
                onRowClick={this.onSelectItemRow}
              />
            </Pane>

          </Paneset>
          {scannedItems.length && patrons.length &&
            <Button buttonStyle="primary mega" onClick={() => this.handleDone()} >Done</Button>
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
