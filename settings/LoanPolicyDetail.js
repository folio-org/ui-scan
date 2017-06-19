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
    //policy: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      confirmDelete: false,
      policy: this.props.initialValues,
      // loanable: false,
      // renewable: false,
    };

    this.validateField = this.validateField.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
  };
  //
  // componentDidMount(){
  //   console.log('renewable: '+ this.props.initialValues.renewable)
  //   this.setState({
  //     loanable: this.props.initialValues.loanable,
  //     renewable: this.props.initialValues.renewable,
  //   });
  // };

  // TODO: This feels like an abuse of the 'validate' parameter, using it to do an
  // immediate save instead of actual validation ....
  validateField(fieldValue, allValues) {
    this.setState({ policy: allValues });
  };

  saveChanges() {
    this.props.parentMutator.loanPolicies.PUT(this.state.policy);
  };

  render() {
    const policy = this.state.policy;
    console.log('renwable2: '+ policy.renewable)

    const renewableOptionFields = policy.renewable ? (
      <div>
        <Field label="Unlimited renewals" name="renewalsPolicy.unlimited" id="unlimitedRenewals" component={Checkbox} />
        <Field label="Number of renewals allowed" name="renewalsPolicy.numberAllowed" id="numRenewals" component={TextField} required rounded />
        <Field
          label="Renew from"
          name="renewalsPolicy.renewFromId"
          id="renewFrom"
          component={Select}
          dataOptions={[{ label: 'System date', value: 1 }]}
        />
        <Field label="Renewal period different from original loan" name="renewalsPolicy.differentPeriod" id="diffRenewPeriod" component={Checkbox} />
        <Field
          label="Alternate fixed due date schedule for renewals"
          name="renewalsPolicy"
          id="altRenewalFixedDueDate"
          component={Select}
          dataOptions={[{ label: 'Quarter', value: 1 }]}
        />
      </div>
    ) : '';

    return (
      <div>
        <h2 style={{ marginTop: '0' }}>About</h2>
        <Field label="Policy name" name="name" id="policyName" component={TextField} required fullWidth rounded validate={this.validateField} onBlur={this.saveChanges} />
        {renewableOptionFields}
        <Field label="Policy description" name="description" id="policyDescription" component={TextArea} fullWidth rounded validate={this.validateField} onBlur={this.saveChanges} />
        <Button title="Delete policy" onClick={this.beginDelete} disabled={this.state.confirmDelete}>Delete policy</Button>
        <hr/>
        <h2>Loans</h2>
        <Field label="Loanable" name="loanable" id="loanable" component={Checkbox} />
        <Field
          label="Loan profile"
          name="loansPolicy.profileId"
          id="loanProfile"
          component={Select}
          dataOptions={[{ label: 'Fixed', value: 1 }, { label: 'Rolling', value: 2 }]}
        />
        // TODO: this should only appear for 'rolling' profile
        <Field label="Loan period" name="loansPolicy.period.duration" id="loanPeriodDuration" component={TextField} rounded />
        <Field
          label=""
          name="loansPolicy.period.intervalId"
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
          name="loansPolicy.closedLibraryDueDateManagementId"
          id="closedLibraryDueDateMgmt"
          component={Select}
          dataOptions={[{ label: 'Move to the end of the next open day', value: 1 }]}
        />
        <Field label="Skip closed dates in intervening period" name="skipClosed" id="skipClosed" component={Checkbox} />

        <Field label="Alternate loan period for items with existing requests" name="loansPolicy.existingRequestsPeriod.duration" id="altLoanPeriod" component={TextField} rounded />
        <Field
          label=""
          name="loansPolicy.existingRequestsPeriod.intervalId"
          id="altLoanPeriodInterval"
          component={Select}
          placeholder="Select interval"
          dataOptions={[]}
        />

        <Field label="Grace period" name="gracePeriod" id="loansPolicy.gracePeriod.duration" component={TextField} rounded />
        <Field
          label=""
          name="loansPolicy.gracePeriod.intervalId"
          id="gracePeriodInterval"
          component={Select}
          placeholder="Select interval"
          dataOptions={[]}
        />

        <fieldset>
          <legend>Renewals</legend>
          <Field label="Renewable" name="renewable" id="renewable" component={Checkbox} onClick={this.saveChanges} />
          {renewableOptionFields}
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
