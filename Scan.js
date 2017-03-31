import _ from 'lodash';
// We have to remove node_modules/react to avoid having multiple copies loaded.
// eslint-disable-next-line import/no-unresolved
import React, { PropTypes } from 'react';
import fetch from 'isomorphic-fetch';
import dateFormat from 'dateformat';
import uuid from 'uuid';
import { SubmissionError } from 'redux-form'

import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Select from '@folio/stripes-components/lib/Select';

// import Automatic from './Automatic';
import CheckIn from './CheckIn';
import CheckOut from './CheckOut';

class Scan extends React.Component {
  static contextTypes = {
    stripes: PropTypes.object,
  }

  static propTypes = {
    data: PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
        }),
      ),
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
    }),
    mutator: PropTypes.shape({
      mode: PropTypes.shape({
        replace: PropTypes.func,
      }),
      patrons: PropTypes.shape({
        replace: PropTypes.func,
      }),
      items: PropTypes.shape({
        replace: PropTypes.func,
      }),
      scannedItems: PropTypes.shape({
        replace: PropTypes.func,
      }),
    }),
  };

  static manifest = Object.freeze({
    mode: {},
    patrons: {},
    items: {},
    scannedItems: {},
  });

  constructor(props, context) {
    super(props);
    this.okapiUrl = context.stripes.okapi.url;
    this.httpHeaders = Object.assign({},
      { 'X-Okapi-Tenant': context.stripes.okapi.tenant, 'X-Okapi-Token': context.stripes.store.getState().okapi.token, 'Content-Type': 'application/json' });

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

  componentWillMount() {
    const { data: { items, scannedItems, mode, patrons }, mutator } = this.props;

    if (_.isEmpty(mode)) {
      mutator.mode.replace('CheckOut');
    }
    if (_.isEmpty(items)) {
      mutator.items.replace([]);
    }
    if (_.isEmpty(scannedItems)) {
      mutator.scannedItems.replace([]);
    }
    if (_.isEmpty(patrons)) {
      mutator.patrons.replace([]);
    }
  }

  onChangeMode(e) {
    const nextMode = e.target.value;
    this.props.mutator.mode.replace(nextMode);
    this.props.mutator.items.replace([]);
    this.props.mutator.scannedItems.replace([]);
    this.props.mutator.patrons.replace([]);
  }

  onClickDone() {
    this.props.mutator.scannedItems.replace([]);
    this.props.mutator.patrons.replace([]);
  }

  onSubmitInCheckOutForm(data) {
    if (data.SubmitMeta.button === 'find_patron') {
      return this.findPatron(data.patron.username);
    } else if (data.SubmitMeta.button === 'add_item') {
      return this.checkout(data.item.barcode);
    }
  }

  checkout(barcode) {
    return fetch(`${this.okapiUrl}/item-storage/items?query=(barcode="${barcode}")`, { headers: this.httpHeaders })
    .then((response) => {
      if (response.status >= 400) {
        console.log('Error fetching item');
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
            this.postLoan(this.props.data.patrons[0].id, item.id).then((loansJson) => {
              this.fetchLoan(loansJson.id);
            })
          }
        })
      }
    })
  }

  onClickCheckin(data) {
    const barcodeValue = document.getElementById('barcode').value;
    const barcodes = barcodeValue.split(' ');
    for (let i = 0; i < barcodes.length; i++) {
      const barcode = barcodes[i].trim();
      if (barcode) {
        // fetch item by barcode to get item id
        return fetch(`${this.okapiUrl}/item-storage/items?query=(barcode="${barcode}")`, { headers: this.httpHeaders })
        .then((itemsResponse) => {
          if (itemsResponse.status >= 400) {
            console.log('Error fetching item');
          } else {
            itemsResponse.json().then((itemsJson) => {
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
                  this.putReturn(loan).then(() => this.fetchLoan(loan.id));
                });
              });
            });
          }
        });
      }
      document.getElementById('barcode').value = '';
    }
  }

  findPatron(username) {
    this.props.mutator.items.replace([]);
    return fetch(`${this.okapiUrl}/users?query=(username="${username}")`, { headers: this.httpHeaders })
    .then((response) => {
      if (response.status >= 400) {
        console.log('Error fetching user');
      } else {
        return response.json().then((json) => {
          if (json.users.length === 0) {
            throw new SubmissionError({ patron: { username: 'User with this ID does not exist', _error: 'Scan failed' } });
          }
          return this.props.mutator.patrons.replace(json.users);
        });
      }
    });
  }

  postLoan(userid, itemid) {
    // today's date, userid, item id
    const loan = {
      id: uuid(),
      userId: userid,
      itemId: itemid,
      loanDate: dateFormat(new Date(), "yyyy-mm-dd'T'HH:MM:ss'Z'"),
      status: {
        name: 'Open',
      },
    };
    return fetch(`${this.okapiUrl}/loan-storage/loans`, {
      method: 'POST',
      headers: this.httpHeaders,
      body: JSON.stringify(loan),
    }).then(response => response.json());
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
    });
  }
}

export default Scan;
