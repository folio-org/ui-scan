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

const LoanPolicySelector = (props) => {
  
  const { policies, policyCreator, parentMutator, location } = props;
  
  const links = _.sortBy(policies, ['name']).map((p) => {
    return <Link key={p.id} to={`${props.match.path}/${p.id}`}>{p.name}</Link>;
  });
  const firstLink = links[0];
  
  const routes = policies.map((p) => {
    return (
      <Route
        key={p.id}
        path={`${props.match.path}/${p.id}`}
        render={(props) => (
          <Pane paneTitle={p.name} defaultWidth="fill">
            <LoanPolicyDetail initialValues={p} loanPolicies={policies} parentMutator={parentMutator} />
          </Pane>
        )}
      />
    );
  });
  
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
      <Pane defaultWidth="25%" lastMenu={LoanPolicyLastMenu} paneTitle={props.paneTitle || 'Module Settings'}>
        <NavList>
          <NavListSection activeLink={activeLink}>
            {links}
          </NavListSection>
        </NavList>
      </Pane>

      <Switch>
        {routes}
        {/* <Route
          key={0}
          path={props.match.path}
          render={props2 => <Saved {...props2} stripes={stripes} label={props.pages[0].label} />}
        /> */}
      </Switch>
    </Paneset>
  );
  
};

// <Paneset nested>
//   <Pane defaultWidth="25%" lastMenu={LoanPolicyLastMenu} paneTitle={this.props.label}>
//     <NavList>
//       <NavListSection activeLink={this.state.selectedPolicy ? `#${this.state.selectedPolicy.id}` : ''}>
//         {policyDisplay}
//       </NavListSection>
//     </NavList>
//   </Pane>
//   {this.state.selectedPolicy && <Pane paneTitle={this.state.selectedPolicy.name} defaultWidth="fill">
//     <LoanPolicyDetail initialValues={this.state.selectedPolicy} parentMutator={this.props.mutator} clearSelection={this.clearSelection} />
//   </Pane>}
// </Paneset>

LoanPolicySelector.propTypes = {
  policies: PropTypes.arrayOf(
    PropTypes.object,
  ).isRequired,
  policyCreator: PropTypes.func.isRequired,
}

export default LoanPolicySelector;
