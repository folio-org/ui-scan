import React from 'react';
import { Component } from 'react';
import { connect } from '@folio/stripes-connect';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import Select from '@folio/stripes-components/lib/Select';
import makePathFunction from '@folio/stripes-components/util/makePathFunction';


class ScanCheckoutSettings extends React.Component {

  static manifest = Object.freeze({
    userIdentifierPrefRecordId: {},
    userIdentifierPref: {
      type: 'okapi',
      records: 'configs',
      path: 'configurations/entries?query=(module=SCAN and config_name=pref_patron_identifier)',
      PUT: {
        path: 'configurations/entries/${userIdentifierPrefRecordId}'
      }
    }
  });

  constructor(props){
    super(props);

    this.state = {
      //selectedIdentifier: {}
    }

    this.onChangeIdentifier = this.onChangeIdentifier.bind(this);

  }

  onChangeIdentifier(e) {
    console.log("ID type selected", e.target.value);
    let prefRecord = this.props.data.userIdentifierPref[0];
    this.props.mutator.userIdentifierPrefRecordId.replace( prefRecord.id);
    prefRecord.value = e.target.value;
    this.props.mutator.userIdentifierPref.PUT(prefRecord);
  }

  render() {
    let selectedIdentifier = this.props.data.userIdentifierPref || [];
    if (selectedIdentifier.length > 0)
      selectedIdentifier = selectedIdentifier[0].value;

    const identifierTypes = [
      { key: 'BARCODE', label: 'Barcode' },
      { key: 'EXTERNAL', label: 'External System ID' },
      { key: 'FOLIO', label: 'FOLIO Record Number' },
      { key: 'USER', label: 'User ID' }
    ];

    const identifierTypeOptions = identifierTypes.map(i => {
      let selectedValue;
      return {
        label: i.label,
        value: i.key
      };
    });

    return (
      <div>
        <p>Current identifier preference is {selectedIdentifier}</p>
        <Select
          dataOptions={identifierTypeOptions}
          onChange={this.onChangeIdentifier}
        />
      </div>
    );
  }

}

export default connect(ScanCheckoutSettings, '@folio/ui-scan');
