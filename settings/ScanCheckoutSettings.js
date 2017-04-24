import React from 'react';
import { Component } from 'react';
import { connect } from '@folio/stripes-connect';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';

class ScanCheckoutSettings extends React.Component { 
  
  constructor(props){
    super(props);
    
    this.state = {}

  }
  
  render() {
    return <p>Hi!</p>;
  }
  
}

export default connect(ScanCheckoutSettings, '@folio/ui-scan');