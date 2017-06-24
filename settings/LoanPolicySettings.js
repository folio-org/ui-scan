import React, { PropTypes } from 'react';
import _ from 'lodash';

import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Icon from '@folio/stripes-components/lib/Icon';
import NavList from '@folio/stripes-components/lib/NavList';
import NavListSection from '@folio/stripes-components/lib/NavListSection';

import LoanPolicyDetail from './LoanPolicyDetail';

class LoanPolicySettings extends React.Component {

  static propTypes = {
    data: PropTypes.object.isRequired,
    mutator: PropTypes.shape({
      loanPolicies: PropTypes.shape({
        POST: PropTypes.func,
        DELETE: PropTypes.func,
        GET: PropTypes.func,
      }),
    }).isRequired,
  };

  static manifest = Object.freeze({
    loanPolicies: {
      type: 'okapi',
      records: 'loanPolicies',
      path: 'loan-policy-storage/loan-policies',
    },
  });

  constructor(props) {
    super(props);

    this.state = {
      selectedPolicy: null,
    //  loanPolicies: [{id: 1, name: 'Policy 1'}, {id: 2, name: 'Policy 2'}],
    };

    this.clearSelection = this.clearSelection.bind(this);
    this.onSelectRow = this.onSelectRow.bind(this);
    this.createNewPolicy = this.createNewPolicy.bind(this);
  }

  onSelectRow(id, e) {
    e.preventDefault();
    this.setState({ selectedPolicy: _.find(this.props.data.loanPolicies, { id }) });
  }

  clearSelection() {
    this.setState({ selectedPolicy: null });
  }

  createNewPolicy() {
    this.props.mutator.loanPolicies.POST({
      name: 'Untitled loan policy',
      loanable: true,
      loansPolicy: {
        profileId: 2,  // TODO: update when this is switched to a GUID
        closedLibraryDueDateManagementId: 4,  // TODO: update when this is switched to a GUID
      },
      renewable: true,
      renewalsPolicy: {
        unlimited: false,
        renewFromId: 2, // TODO: update when this is switched to a GUID
        differentPeriod: false,
      },
    });
  }

  render() {
    const { data } = this.props;
    const policies = _.sortBy(data.loanPolicies, ['name']);
    const policyDisplay = policies != null ? policies.map(p =>
      <a
        key={p.id}
        href={`#${p.name}`}
        onClick={this.onSelectRow.bind(this, p.id)}
      >
        {p.name ? p.name : 'Untitled loan policy'}
      </a>) : null;

    const LoanPolicyLastMenu = (
      <PaneMenu>
        <button title="Add loan policy" onClick={this.createNewPolicy}>
          <Icon icon="plus-sign" />
        </button>
      </PaneMenu>
    );

    return (
      <Paneset nested>
        <Pane defaultWidth="20%" lastMenu={LoanPolicyLastMenu}>
          <NavList>
            <NavListSection activeLink={this.state.selectedPolicy ? `#${this.state.selectedPolicy.id}` : ''}>
              {policyDisplay}
            </NavListSection>
          </NavList>
        </Pane>
        {this.state.selectedPolicy && <Pane paneTitle={this.state.selectedPolicy.name} defaultWidth="fill">
          <LoanPolicyDetail initialValues={this.state.selectedPolicy} parentMutator={this.props.mutator} clearSelection={this.clearSelection} />
        </Pane>}
      </Paneset>
    );
  }

}

export default LoanPolicySettings;
