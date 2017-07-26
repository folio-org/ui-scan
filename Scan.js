import _ from 'lodash';
import React, { PropTypes } from 'react';
import fetch from 'isomorphic-fetch';
import dateFormat from 'dateformat';
import uuid from 'uuid';
import { SubmissionError, change } from 'redux-form';

import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Select from '@folio/stripes-components/lib/Select';

// import Automatic from './Automatic';
import CheckIn from './CheckIn';
import CheckOut from './CheckOut';
import { patronIdentifierTypes, defaultPatronIdentifier } from './constants';

class Scan extends React.Component {
  static contextTypes = {
    stripes: PropTypes.object,
  }

  static propTypes = {
    data: PropTypes.shape({
      scannedItems: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
        }),
      ),
      patrons: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
        }),
      ),
      userIdentifierPref: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
        }),
      ),
    }),
    mutator: PropTypes.shape({
      mode: PropTypes.shape({
        replace: PropTypes.func,
      }),
      patrons: PropTypes.shape({
        replace: PropTypes.func,
      }),
      scannedItems: PropTypes.shape({
        replace: PropTypes.func,
      }),
    }),
  };

  static defaultProps = {
    data: {},
    mutator: {},
  };

  static manifest = Object.freeze({
    mode: { initialValue: 'CheckOut' },
    patrons: { initialValue: [] },
    scannedItems: { initialValue: [] },
    userIdentifierPref: {
      type: 'okapi',
      records: 'configs',
      path: 'configurations/entries?query=(module=SCAN and configName=pref_patron_identifier)',
    },
  });

  constructor(props, context) {
    super(props);
    this.okapiUrl = context.stripes.okapi.url;
    this.httpHeaders = Object.assign({}, {
      'X-Okapi-Tenant': context.stripes.okapi.tenant,
      'X-Okapi-Token': context.stripes.store.getState().okapi.token,
      'Content-Type': 'application/json',
    });

    this.componentMap = {
      CheckOut,
      CheckIn,
      // Automatic: Automatic,
    };

    this.onChangeMode = this.onChangeMode.bind(this);
    this.onSubmitInCheckOutForm = this.onSubmitInCheckOutForm.bind(this);
    this.onClickDone = this.onClickDone.bind(this);
    this.onClickCheckin = this.onClickCheckin.bind(this);
  }

  onChangeMode(e) {
    const nextMode = e.target.value;
    this.props.mutator.mode.replace(nextMode);
    this.props.mutator.scannedItems.replace([]);
    this.props.mutator.patrons.replace([]);
  }

  onClickDone() {
    this.props.mutator.scannedItems.replace([]);
    this.props.mutator.patrons.replace([]);
  }

  onSubmitInCheckOutForm(data) {
    if (data.SubmitMeta.button === 'find_patron') {
      return this.findPatron(data.patron);
    } else if (data.SubmitMeta.button === 'add_item') {
      return this.checkout(data.item.barcode);
    }
    throw new SubmissionError({ item: { barcode: 'Internal UI error. Expected click on "Find patron" or "Add item" but could not determine, which were clicked.' },
      patron: { identifier: 'Internal UI error. Expected click on "Find patron" or "Add item" but could not determine, which were clicked.' } });
  }

  onClickCheckin(data) {
    // fetch item by barcode to get item id
    return fetch(`${this.okapiUrl}/item-storage/items?query=(barcode="${data.item.barcode}")`, { headers: this.httpHeaders })
    .then((itemsResponse) => {
      if (itemsResponse.status >= 400) {
        throw new SubmissionError({ item: { barcode: `Error ${itemsResponse.status} retrieving item by barcode ${data.item.barcode}`, _error: 'Scan failed' } });
      } else {
        return itemsResponse.json().then((itemsJson) => {
          if (itemsJson.items.length === 0) {
            throw new SubmissionError({ item: { barcode: 'Item with this barcode does not exist', _error: 'Scan failed' } });
          } else {
            const item = JSON.parse(JSON.stringify(itemsJson.items[0]));
            item.status = { name: 'Available' };
            // PUT the item with status 'Available'
            this.putItem(item);
            // PUT the loan with a returnDate and status 'Closed'
            this.fetchLoanByItemId(item.id).then((loansResponse) => {
              loansResponse.json().then((loansJson) => {
                const loan = loansJson.loans[0];
                const now = new Date();
                loan.returnDate = dateFormat(now, "yyyy-mm-dd'T'HH:MM:ss'Z'");
                loan.status = { name: 'Closed' };
                loan.action = 'checkedin';
                this.putReturn(loan).then(() => this.fetchLoan(loan.id));
              });
            });
          }
        });
      }
    });
  }

  clearField(fieldName) {
    this.context.stripes.store.dispatch(change('CheckOut', fieldName, ''));
  }

  checkout(barcode) {
    if (this.props.data.patrons.length === 0) {
      throw new SubmissionError({ patron: { identifier: 'Please fill this out to continue' } });
    }
    return fetch(`${this.okapiUrl}/item-storage/items?query=(barcode="${barcode}")`, { headers: this.httpHeaders })
    .then((response) => {
      if (response.status >= 400) {
        throw new SubmissionError({ item: { barcode: `Okapi error ${response.status} ${response.status} retrieving item by barcode`, _error: 'Scan failed' } });
      } else {
        return response.json().then((itemsJson) => {
          if (itemsJson.items.length === 0) {
            throw new SubmissionError({ item: { barcode: 'Item with this barcode does not exist', _error: 'Scan failed' } });
          } else {
            const item = JSON.parse(JSON.stringify(itemsJson.items[0]));
            item.status = { name: 'Checked out' };
            // PUT the item with status 'Checked out'
            this.putItem(item);
            // PUT the loan with a loanDate and status 'Open'
            return this.postLoan(this.props.data.patrons[0].id, item.id).then((loansJson) => {
              this.fetchLoan(loansJson.id);
              this.clearField('item.barcode');
            });
          }
        });
      }
    });
  }

  findPatron(patron) {
    const patronIdentifier = this.userIdentifierPref();
    this.props.mutator.scannedItems.replace([]);
    return fetch(`${this.okapiUrl}/users?query=(${patronIdentifier.queryKey}="${patron.identifier}")`, { headers: this.httpHeaders })
    .then((response) => {
      if (response.status >= 400) {
        throw new SubmissionError({ patron: { identifier: `Error ${response.status} retrieving patron by ${patronIdentifier.label}`, _error: 'Scan failed' } });
      } else {
        return response.json().then((json) => {
          if (json.users.length === 0) {
            throw new SubmissionError({ patron: { identifier: `User with this ${patronIdentifier.label} does not exist`, _error: 'Scan failed' } });
          }
          return this.props.mutator.patrons.replace(json.users);
        });
      }
    });
  }

  // Return either the currently set user identifier preference or a default value
  // (see constants.js for values)
  userIdentifierPref() {
    const { data: { userIdentifierPref: pref } } = this.props;
    return (pref.length > 0 && pref[0].value != null) ?
      _.find(patronIdentifierTypes, { key: pref[0].value }) :
      defaultPatronIdentifier;
  }

  postLoan(userid, itemid) {
    // today's date, userid, item id
    const loan = {
      id: uuid(),
      userId: userid,
      itemId: itemid,
      loanDate: dateFormat(new Date(), "yyyy-mm-dd'T'HH:MM:ss'Z'"),
      action: 'checkedout',
      status: {
        name: 'Open',
      },
    };
    return fetch(`${this.okapiUrl}/loan-storage/loans`, {
      method: 'POST',
      headers: this.httpHeaders,
      body: JSON.stringify(loan),
    }).then((response) => {
      if (response.status >= 400) {
        throw new SubmissionError({ item: { barcode: `Okapi Error ${response.status} storing loan ${itemid} for patron ${userid}`, _error: 'Scan failed' } });
      } else {
        return response.json();
      }
    });
  }

  putReturn(loan) {
    return fetch(`${this.okapiUrl}/loan-storage/loans/${loan.id}`, {
      method: 'PUT',
      headers: this.httpHeaders,
      body: JSON.stringify(loan),
    });
  }

  putItem(item) {
    fetch(`${this.okapiUrl}/item-storage/items/${item.id}`, {
      method: 'PUT',
      headers: this.httpHeaders,
      body: JSON.stringify(item),
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    }).then(() => {
      // do nothing
    }).catch((error) => {
      console.log(error);
    });
  }

  fetchLoan(loanid) {
    fetch(`${this.okapiUrl}/circulation/loans?query=(id=${loanid})`, {
      headers: this.httpHeaders,
    }).then((response) => {
      response.json().then((json) => {
        const scannedItems = [].concat(this.props.data.scannedItems).concat(json.loans);
        this.props.mutator.scannedItems.replace(scannedItems);
      });
    });
  }

  fetchLoanByItemId(itemid) {
    return fetch(`${this.okapiUrl}/loan-storage/loans?query=(itemId=${itemid} AND status="Open")`, { headers: this.httpHeaders });
  }

  render() {
    const { data: { mode, scannedItems, patrons } } = this.props;

    if (!mode) return <div />;
    const modeOptions = [
      { label: 'Check items out', value: 'CheckOut' },
      /* { label: 'Automatic Mode', value: 'Automatic' }, */
      { label: 'Check items in', value: 'CheckIn' },
    ];

    const modeMenu = (
      <PaneMenu><Select marginBottom0 dataOptions={modeOptions} value={mode} onChange={this.onChangeMode} /></PaneMenu>
    );

    const submithandler = (mode === 'CheckOut' ? this.onSubmitInCheckOutForm : this.onClickCheckin);

    return React.createElement(this.componentMap[mode], {
      onChangeMode: this.onChangeMode,
      modeSelector: modeMenu,
      onClickDone: this.onClickDone,
      submithandler,
      initialValues: {},
      patrons,
      scannedItems,
      parentProps: this.props,
      userIdentifierPref: this.userIdentifierPref(),
    });
  }
}

export default Scan;
