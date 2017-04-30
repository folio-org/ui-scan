import React from 'react';
import { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
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
      POST: {
        path: 'configurations/entries',
      },
      PUT: {
        path: 'configurations/entries/${userIdentifierPrefRecordId}',
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
    if (prefRecord) {
      // preference has been set previously, can proceed with update here
      this.props.mutator.userIdentifierPrefRecordId.replace(prefRecord.id);
      prefRecord.value = e.target.value;
      this.props.mutator.userIdentifierPref.PUT(prefRecord);
    }
    else {
      // no preference exists, so create a new one
      this.props.mutator.userIdentifierPref.POST(
        {
          "module": "SCAN",
          "config_name": "pref_patron_identifier",
          "value": e.target.value,
        }
      );
    }
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
      return {
        label: i.label,
        value: i.key
      };
    });

    return (
      <Pane defaultWidth={this.props.paneWidth} paneTitle="Check-out">
        <Row>
          <Col xs={12}>
            <label>Scan ID for patron check-out</label>
            <br/>
            <Select
              placeholder="---"
              value={selectedIdentifier}
              dataOptions={identifierTypeOptions}
              onChange={this.onChangeIdentifier}
            />
          </Col>
        </Row>
      </Pane>
    );
  }

}

export default connect(ScanCheckoutSettings, '@folio/ui-scan');
