import _ from 'lodash';
import React, { PropTypes } from 'react';

import { connect } from '@folio/stripes-connect';

import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Select from '@folio/stripes-components/lib/Select';

//import Automatic from './Automatic';
import CheckIn from './CheckIn';
import CheckOut from './CheckOut';

class Scan extends React.Component{

  static contextTypes = {
    store: PropTypes.object,
  }

  static manifest = Object.freeze ({
    mode: {},
    patrons: {},
    items: {},
    itemsx: {
      type: 'okapi',
      path: 'item-storage/items/:{itemid}',
      clear: false,
    },
  });

  constructor(props, context){
    super(props);

    this.store = context.store;
    this.sys = require('stripes-loader'); // eslint-disable-line
    this.okapiUrl = this.sys.okapi.url;
    this.tenant = this.sys.okapi.tenant;

    this.componentMap = {
      'CheckOut': CheckOut,
      'CheckIn': CheckIn,
      //'Automatic': Automatic,
    };
    
    this.onChangeMode = this.onChangeMode.bind(this);
    this.onClickFindPatron = this.onClickFindPatron.bind(this);
    this.onClickAddItem = this.onClickAddItem.bind(this);
    this.onClickRemoveItem = this.onClickRemoveItem.bind(this);
  }

  componentWillMount() {
    const { data: { items, mode, patrons }, mutator } = this.props;

    if (_.isEmpty(mode)) {
      mutator.mode.replace('CheckOut');
    }
    if (_.isEmpty(items)) {
      mutator.items.replace([]);
    }
    if (_.isEmpty(patrons)) {
      mutator.patrons.replace([]);
    }
  }

  onChangeMode(e){
    const nextMode = e.target.value;
    this.props.mutator.mode.replace(nextMode);
  }

  onClickFindPatron(e) {
    if (e) e.preventDefault();
    let username = document.getElementById('patronid').value;
    fetch(`${this.okapiUrl}/users?query=(username="${username}")`, { headers: Object.assign({}, { 'X-Okapi-Tenant': this.tenant, 'X-Okapi-Token': this.store.getState().okapi.token }) })
    .then((response) => {
      if (response.status >= 400) {
        console.log("Error fetching user");
      } else {
        response.json().then((json) => {
          this.props.mutator.patrons.replace(json.users);
        });
      }
    });
  }

  onClickAddItem(e) {
    if (e) e.preventDefault();
    let itemid = document.getElementById('itemid').value;
    fetch(`${this.okapiUrl}/item-storage/items?query=(id="${itemid}")`, { headers: Object.assign({}, { 'X-Okapi-Tenant': this.tenant, 'X-Okapi-Token': this.store.getState().okapi.token }) })
    .then((response) => {
      if (response.status >= 400) {
        console.log("Error fetching user");
      } else {
        response.json().then((json) => {
          let items = [].concat(this.props.data.items).concat(json.items);
          this.props.mutator.items.replace(items);
        });
      }
    });
    document.getElementById('itemid').value = '';
  }

  onClickRemoveItem(itemid) {
    const index = this.props.data.items.findIndex((item) => { return (item.id === itemid); })
    let items = [].concat(this.props.data.items);
    items.splice(index,1);
    this.props.mutator.items.replace(items);
  }

  render() {
    const { data: { mode, items, patrons } } = this.props;
    if (!mode) return <div/>;
    const modeOptions = [
      { label: 'Check items out', value: 'CheckOut' },
      { label: 'Automatic Mode', value: 'Automatic' },
      { label: 'Check items in', value: 'CheckIn' }
    ];
    
    const modeMenu = (
      <PaneMenu><Select marginBottom0 dataOptions={modeOptions} value={mode} onChange={this.onChangeMode}></Select></PaneMenu>
    );
    
    return React.createElement(this.componentMap[mode],
                               {onChangeMode: this.onChangeMode,
                                modeSelector: modeMenu,
                                onClickFindPatron: this.onClickFindPatron,
                                onClickAddItem: this.onClickAddItem,
                                onClickRemoveItem: this.onClickRemoveItem,
                                patrons,
                                items});
  }
  
}

export default connect(Scan,'@folio/scan');
