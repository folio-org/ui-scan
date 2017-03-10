import _ from 'lodash';
// We have to remove node_modules/react to avoid having multiple copies loaded.
// eslint-disable-next-line import/no-unresolved
import React, { PropTypes } from 'react';
import fetch from 'isomorphic-fetch';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Select from '@folio/stripes-components/lib/Select';

// import Automatic from './Automatic';
import CheckIn from './CheckIn';
import CheckOut from './CheckOut';

class Scan extends React.Component {
  static contextTypes = {
    store: PropTypes.object,
  }

  static propTypes = {
    data: PropTypes.shape({
      items: PropTypes.arrayOf(
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
      pendingScan: PropTypes.shape({
        replace: PropTypes.func,
      }),
    }),
  };

  static manifest = Object.freeze({
    mode: {},
    patrons: {},
    items: {},
    pendingScan: {},
    itemsx: {
      type: 'okapi',
      path: 'item-storage/items/:{itemid}',
      clear: false,
    },
  });

  constructor(props, context) {
    super(props);

    this.store = context.store;
    this.sys = require('stripes-loader'); // eslint-disable-line
    this.okapiUrl = this.sys.okapi.url;
    this.tenant = this.sys.okapi.tenant;

    this.componentMap = {
      CheckOut,
      CheckIn,
      // Automatic: Automatic,
    };

    this.onChangeMode = this.onChangeMode.bind(this);
    this.onClickFindPatron = this.onClickFindPatron.bind(this);
    this.onClickAddItem = this.onClickAddItem.bind(this);
    this.onClickRemoveItem = this.onClickRemoveItem.bind(this);
    this.onClickCheckout = this.onClickCheckout.bind(this);
    this.onClickCheckin = this.onClickCheckin.bind(this);
  }

  componentWillMount() {
    const { data: { items, mode, patrons, pendingScan }, mutator } = this.props;

    if (_.isEmpty(pendingScan)) {
      mutator.pendingScan.replace({ state: false });
    }

    if (_.isEmpty(mode)) {
      mutator.mode.replace('CheckOut');
    }

    if (!pendingScan || !pendingScan.state) {
      mutator.items.replace([]);
      mutator.patrons.replace([]);
    } else {
      if (_.isEmpty(items)) {
        mutator.items.replace([]);
      }
      if (_.isEmpty(patrons)) {
        mutator.patrons.replace([]);
      }
    }
  }

  onChangeMode(e) {
    const nextMode = e.target.value;
    this.props.mutator.mode.replace(nextMode);
    this.props.mutator.pendingScan.replace({ state: false });
    this.props.mutator.items.replace([]);
    this.props.mutator.patrons.replace([]);
  }

  onClickFindPatron(e) {
    if (e) e.preventDefault();
    this.props.mutator.items.replace([]);
    const username = document.getElementById('patronid').value;
    fetch(`${this.okapiUrl}/users?query=(username="${username}")`,
      { headers: Object.assign({}, {
        'X-Okapi-Tenant': this.tenant,
        'X-Okapi-Token': this.store.getState().okapi.token,
        'Content-Type': 'application/json' }),
      })
    .then((response) => {
      if (response.status >= 400) {
        console.log('Error fetching user');
      } else {
        response.json().then((json) => {
          this.props.mutator.patrons.replace(json.users);
        });
      }
    });
  }

  onClickAddItem(e) {
    if (e) e.preventDefault();
    this.props.mutator.pendingScan.replace({ state: true });
    const barcodeValue = document.getElementById('barcode').value;
    const barcodes = barcodeValue.split(' ');
    for (let i = 0; i < barcodes.length; i++) {
      const barcode = barcodes[i].trim();
      if (barcode) {
        fetch(`${this.okapiUrl}/item-storage/items?query=(barcode="${barcode}")`,
          { headers: Object.assign({}, {
            'X-Okapi-Tenant': this.tenant,
            'X-Okapi-Token': this.store.getState().okapi.token,
            'Content-Type': 'application/json',
          }) })
        .then((response) => {
          if (response.status >= 400) {
            console.log('Error fetching item');
          } else {
            response.json().then((json) => {
              const itemid = json.items[0].id;
              if (this.props.data.items.findIndex(item => item.id === itemid) < 0) {
                const items = [].concat(this.props.data.items).concat(json.items);
                this.props.mutator.items.replace(items);
              }
            });
          }
        });
      }
      document.getElementById('barcode').value = '';
    }
  }

  onClickRemoveItem(itemid) {
    const items = JSON.parse(JSON.stringify(this.props.data.items));
    const index = items.findIndex(item => item.id === itemid);
    items.splice(index, 1);
    this.props.mutator.items.replace(items);
    if (items.length === 0) this.props.mutator.pendingScan.replace({ state: false });
  }

  onClickCheckout() {
    const items = JSON.parse(JSON.stringify(this.props.data.items));
    for (let i = 0; i < items.length; i++) {
      items[i].status.name = 'Checked Out';
      this.putItem(items, i);
    }
    this.props.mutator.pendingScan.replace({ state: false });
  }

  onClickCheckin() {
    const items = JSON.parse(JSON.stringify(this.props.data.items));
    for (let i = 0; i < items.length; i++) {
      items[i].status.name = 'Available';
      this.putItem(items, i);
    }
    this.props.mutator.pendingScan.replace({ state: false });
  }

  putItem(items, i) {
    fetch(`${this.okapiUrl}/item-storage/items/${items[i].id}`, {
      method: 'PUT',
      headers: Object.assign({}, { 'X-Okapi-Tenant': this.tenant, 'X-Okapi-Token': this.store.getState().okapi.token, 'Content-Type': 'application/json' }),
      body: JSON.stringify(items[i]),
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    }).then(() => {
      this.props.mutator.items.replace(items);
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    const { data: { mode, items, patrons } } = this.props;
    if (!mode) return <div />;
    const modeOptions = [
      { label: 'Check items out', value: 'CheckOut' },
      /* { label: 'Automatic Mode', value: 'Automatic' }, */
      { label: 'Check items in', value: 'CheckIn' },
    ];

    const modeMenu = (
      <PaneMenu><Select marginBottom0 dataOptions={modeOptions} value={mode} onChange={this.onChangeMode} /></PaneMenu>
    );

    return React.createElement(this.componentMap[mode], {
      onChangeMode: this.onChangeMode,
      modeSelector: modeMenu,
      onClickFindPatron: this.onClickFindPatron,
      onClickAddItem: this.onClickAddItem,
      onClickRemoveItem: this.onClickRemoveItem,
      onClickCheckout: this.onClickCheckout,
      onClickCheckin: this.onClickCheckin,
      patrons,
      items,
    });
  }
}

export default Scan;
