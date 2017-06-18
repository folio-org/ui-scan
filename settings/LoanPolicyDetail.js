import React, { PropTypes } from 'react';
//import { Row, Col } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';

import Button from '@folio/stripes-components/lib/Button';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import Select from '@folio/stripes-components/lib/Select';
import TextField from '@folio/stripes-components/lib/TextField';
import TextArea from '@folio/stripes-components/lib/TextArea';

class LoanPolicyDetail extends React.Component {

  static propTypes = {
    policy: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      confirmDelete: false,
    };
  };

  render() {
    const { policy } = this.props;

    return (
      <div>
        <h2 style={{ marginTop: '0' }}>About</h2>
        <Field label="Policy name" name="policyName" id="policyName" component={TextField} required fullWidth rounded />
        <Field label="Policy description" name="policyDescription" id="policyDescription" component={TextArea} fullWidth rounded />
        <Button title="Delete policy" onClick={this.beginDelete} disabled={this.state.confirmDelete}>Delete policy</Button>
        <hr/>
        <h2>Loans</h2>
        <Field label="Loanable" name="loanable" id="loanable" component={Checkbox} />
        <Field
          label="Loan profile"
          name="loanProfile"
          id="loanProfile"
          component={Select}
          dataOptions={[{ label: 'Fixed', value: 1 }, { label: 'Rolling', value: 2 }]}
        />
        // TODO: this should only appear for 'rolling' profile
        <Field label="Loan period" name="loanPeriod" id="loanPeriod" component={TextField} rounded />
        <Field
          label=""
          name="loanPeriodInterval"
          id="loanPeriodInterval"
          component={Select}
          placeholder="Select interval"
          dataOptions={[]}
        />
        <Field
          label="Fixed due date schedule"
          name="fixedDueDateSchedule"
          id="fixedDueDateSchedule"
          component={Select}
          dataOptions={[{ label: 'Semester', value: 1 }]}
        />
        <Field
          label="Closed library due date management"
          name="closedLibraryDueDateMgmt"
          id="closedLibraryDueDateMgmt"
          component={Select}
          dataOptions={[{ label: 'Move to the end of the next open day', value: 1 }]}
        />
        <Field label="Skip closed dates in intervening period" name="skipClosed" id="skipClosed" component={Checkbox} />

        <Field label="Alternate loan period for items with existing requests" name="altLoanPeriod" id="altLoanPeriod" component={TextField} rounded />
        <Field
          label=""
          name="altLoanPeriodInterval"
          id="altLloanPeriodInterval"
          component={Select}
          placeholder="Select interval"
          dataOptions={[]}
        />

        <Field label="Grace period" name="gracePeriod" id="gracePeriod" component={TextField} rounded />
        <Field
          label=""
          name="gracePeriodInterval"
          id="gracePeriodInterval"
          component={Select}
          placeholder="Select interval"
          dataOptions={[]}
        />

        <fieldset>
          <legend>Renewals</legend>
          <Field label="Renewable" name="renewable" id="renewable" component={Checkbox} />
          <Field label="Unlimited renewals" name="unlimitedRenewals" id="unlimitedRenewals" component={Checkbox} />
          <Field label="Number of renewals allowed" name="numRenwals" id="numRenwals" component={TextField} required rounded />
          <Field
            label="Renew from"
            name="renewFrom"
            id="renewFrom"
            component={Select}
            dataOptions={[{ label: 'System date', value: 1 }]}
          />
          <Field label="Renewal period different from original loan" name="diffRenewPeriod" id="diffRenewPeriod" component={Checkbox} />
        </fieldset>

        <hr/>
        <h2>Requests</h2>
        <Field label="Requestable" name="requestable" id="requestable" component={Checkbox} />
      </div>
    );

  };

}

export default reduxForm({
  form: 'LoanPolicyForm',
  enableReinitialize: true,
})(LoanPolicyDetail);
