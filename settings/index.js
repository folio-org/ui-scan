import React from 'react';

import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import NavList from '@folio/stripes-components/lib/NavList';
import NavListSection from '@folio/stripes-components/lib/NavListSection';

import ScanCheckoutSettings from './ScanCheckoutSettings';

class ScanSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedPage: 'Checkout',
      pages: [
        { label: 'Check-out', name: 'Checkout', component: ScanCheckoutSettings },
      ],
    };

    this.onSelectPage = this.onSelectPage.bind(this);
  }

  onSelectPage(e) {
    e.preventDefault();
    const href = e.target.href;
    const page = href.substring(href.indexOf('#') + 1);
    this.setState({ selectedPage: page });
  }

  getPage() {
    const result = this.state.pages.filter(obj => obj.name === this.state.selectedPage);
    return React.createElement(result[0].component);
  }

  render() {
    return (
      <Paneset nested>
        <Pane defaultWidth="25%" paneTitle="Scan">
          <NavList>
            <NavListSection activeLink={`#${this.state.selectedPage}`}>
              <a href="#Checkout" onClick={this.onSelectPage}>Check-out</a>
            </NavListSection>
          </NavList>
        </Pane>
        {this.getPage()}
      </Paneset>
    );
  }
}

export default ScanSettings;
