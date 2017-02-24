import React, { PropTypes } from 'react';

import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Select from '@folio/stripes-components/lib/Select';

//import Automatic from './Automatic';
import CheckIn from './CheckIn';
import CheckOut from './CheckOut';

class Scan extends React.Component{

  static contextTypes = {
    store: PropTypes.object,
  }

  constructor(props, context){
    super(props);

    this.store = context.store;
    this.sys = require('stripes-loader'); // eslint-disable-line
    this.okapiUrl = this.sys.okapi.url;
    this.tenant = this.sys.okapi.tenant;

    this.state = {
      mode : 'CheckOut',
      items: [{id: '01', name:'item1', 'due date': '2/28/2017' },{id: '02', name:'item2', 'due date': '2/28/2017'}],
      patron: {},
    }

    this.componentMap = {
      'CheckOut': CheckOut,
      'CheckIn': CheckIn,
      //'Automatic': Automatic,
    };
    
    this.onChangeMode = this.onChangeMode.bind(this);
    this.onClickFindPatron = this.onClickFindPatron.bind(this);
  }

  onChangeMode(e){
    const nextMode = e.target.value;
    this.setState({
      mode: nextMode,
    });
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
          console.log("user json", json.users[0]);
          this.setState({
            patron: json.users[0],
          })
        });
      }
    });
  }

  render() {
    const modeOptions = [
      { label: 'Check items out', value: 'CheckOut' },
      { label: 'Automatic Mode', value: 'Automatic' },
      { label: 'Check items in', value: 'CheckIn' }
    ];
    
    const modeMenu = (
      <PaneMenu><Select marginBottom0 dataOptions={modeOptions} value={this.state.mode} onChange={this.onChangeMode}></Select></PaneMenu>
    );
    
    return React.createElement(this.componentMap[this.state.mode], {onChangeMode: this.onChangeMode, modeSelector: modeMenu, onClickFindPatron: this.onClickFindPatron, patron: this.state.patron, items: this.state.items});
  }
  
}

export default Scan;
