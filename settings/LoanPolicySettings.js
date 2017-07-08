import React, { PropTypes } from 'react';

import LoanPolicySelector from './LoanPolicySelector';

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

    this.createNewPolicy = this.createNewPolicy.bind(this);
  }

  createNewPolicy() {
    this.props.mutator.loanPolicies.POST({
      name: 'Untitled',
      loanable: true,
      loansPolicy: {
        profileId: '2',  // TODO: update when this is switched to a GUID
        closedLibraryDueDateManagementId: '4',  // TODO: update when this is switched to a GUID
      },
      renewable: true,
      renewalsPolicy: {
        unlimited: false,
        renewFromId: '2', // TODO: update when this is switched to a GUID
        differentPeriod: false,
      },
    }).then(() => {
      //this.props.history.push()
    });
  }

  render() {
    const policies = _.sortBy(this.props.data.loanPolicies, ['name']);

    return (
    
        <LoanPolicySelector
          {...this.props}
          policies={policies}
          policyCreator={this.createNewPolicy}
          parentMutator={this.props.mutator}
          paneTitle="Loan policies"
        />
    );
  }

}

export default LoanPolicySettings;
