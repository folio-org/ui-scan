import React from 'react';
import { Component } from 'react';
import { connect } from '@folio/stripes-connect';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import makePathFunction from '@folio/stripes-components/util/makePathFunction';


class ScanCheckoutSettings extends React.Component {

  static manifest = Object.freeze({
    userIdentifierPref: {
      type: 'okapi',
      records: 'configs',
      path: 'configurations/entries?query=(module=SCAN and config_name=pref_patron_identifier)'
    }
  });

  constructor(props){
    super(props);

    this.state = {
      selectedIdentifier: {}
    }


  }

  componentDidMount() {
  //  this.setState({selectedIdentifier: this.props.data.userIdentifierPref[0].value});
  }

  render() {
    console.log("manifest", this.props.data)
    let selectedIdentifier = this.props.data.userIdentifierPref || [];
    if (selectedIdentifier.length > 0)
      selectedIdentifier = selectedIdentifier[0].value;

    return <p>Current identifier preference is {selectedIdentifier}</p>;
  }

}

export default connect(ScanCheckoutSettings, '@folio/ui-scan');
