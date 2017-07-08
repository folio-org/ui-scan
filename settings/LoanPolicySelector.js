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
  const { policies, policyCreator, parentMutator, location, paneTitle } = props;

  const links = _.sortBy(policies, ['name']).map(p => (
    <Link key={p.id} to={`${props.match.path}/${p.id}`}>{p.name}</Link>
  ));

  const routes = policies.map(p => (
    <Route
      key={p.id}
      path={`${props.match.path}/${p.id}`}
      render={props => (
        <Pane paneTitle={p.name} defaultWidth="fill">
          <LoanPolicyDetail
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

LoanPolicySelector.propTypes = {
  parentMutator: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  policies: PropTypes.arrayOf(
    PropTypes.object,
  ).isRequired,
  policyCreator: PropTypes.func.isRequired,
  paneTitle: PropTypes.string,
};

export default LoanPolicySelector;
