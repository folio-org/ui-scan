import React, { PropTypes } from 'react';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import Link from 'react-router-dom/Link';

import Icon from '@folio/stripes-components/lib/Icon';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import NavList from '@folio/stripes-components/lib/NavList';
import NavListSection from '@folio/stripes-components/lib/NavListSection';

import LoanPolicyDetail from './LoanPolicyDetail';

class LoanPolicySelector extends React.Component {
  
  static propTypes = {
    parentMutator: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    policies: PropTypes.arrayOf(
      PropTypes.object,
    ).isRequired,
    policyCreator: PropTypes.func.isRequired,
    paneTitle: PropTypes.string,
  };
  
  constructor(props) {
    super(props);
    
    this.activeLink = this.activeLink.bind(this);
    this.clearSelection = this.clearSelection.bind(this);
    this.linkPath = this.linkPath.bind(this);
  }
  
  activeLink(links) {
    return this.props.location.pathname || linkPath(links[0].key);
  }
  
  linkPath(id) {
    return `${this.props.match.path}/${id}`;
  }
  
  clearSelection() {
    console.log("clear selection")
    this.props.history.push(`${this.props.match.path}/${this.props.policies[0].id}`);
  }
  
  render() {
    const { policies, policyCreator, parentMutator, location, paneTitle } = this.props;
    
    const links = _.sortBy(policies, ['name']).map(p => (
      <Link key={p.id} to={this.linkPath(p.id)}>{p.name}</Link>
    ));
    
    const routes = policies.map(p => (
      <Route
        key={p.id}
        path={this.linkPath(p.id)}
        render={() => (
          <Pane paneTitle={p.name} defaultWidth="fill">
            <LoanPolicyDetail
              clearSelection={this.clearSelection}
              initialValues={p}
              loanPolicies={policies}
              parentMutator={parentMutator}
            />
          </Pane>
        )}
      />
    ));
    
    const LoanPolicyLastMenu = (
      <PaneMenu>
        <button title="Add loan policy" onClick={policyCreator}>
          <Icon icon="plus-sign" />
        </button>
      </PaneMenu>
    );
    
    const activeLink = location.pathname;
  
    return (
      <Paneset nested defaultWidth="80%">
        <Pane defaultWidth="25%" lastMenu={LoanPolicyLastMenu} paneTitle={paneTitle}>
          <NavList>
            <NavListSection activeLink={this.activeLink(links)}>
              {links}
            </NavListSection>
          </NavList>
        </Pane>
 
        <Switch>
          {routes}
          {/* <Route
            key={0}
            path={props.match.path}
            render={routes[0]}
          /> */}
        </Switch>
      </Paneset>
    );
  }
  
}

export default LoanPolicySelector;
