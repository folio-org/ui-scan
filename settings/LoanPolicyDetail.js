import React, { PropTypes } from 'react';
//import { Row, Col } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';

import Button from '@folio/stripes-components/lib/Button';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Select from '@folio/stripes-components/lib/Select';
import TextField from '@folio/stripes-components/lib/TextField';
import TextArea from '@folio/stripes-components/lib/TextArea';

import { loanProfileTypes, intervalPeriods, dueDateManagementOptions, renewFromOptions } from '../constants';

class LoanPolicyDetail extends React.Component {

  static propTypes = {
    //policy: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      confirmDelete: false,
      policy: this.props.initialValues,
      rollingProfile: false,
      // loanable: false,
      // renewable: false,
    };

    this.beginDelete = this.beginDelete.bind(this);
    this.deletePolicy = this.deletePolicy.bind(this);
    this.validateField = this.validateField.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
  };

  // TODO: This feels like an abuse of the 'validate' parameter, using it to do an
  // immediate save instead of actual validation ....
  validateField(fieldValue, allValues) {

    // TODO: This is a bad hack to deal with constraints that both fields of
    // a "period" object have to exist in the record. This should be rewritten ASAP
    let period = (allValues.loansPolicy && allValues.loansPolicy.period);
    if (period && period.duration && !period.intervalId) {
      this.props.change('loansPolicy.period.intervalId', 1);
    }
    if (period && period.intervalId && !period.duration) {
      this.props.change('loansPolicy.period.duration', 1);
    }
    let existingPeriod = (allValues.loansPolicy && allValues.loansPolicy.existingRequestsPeriod);
    if (existingPeriod && existingPeriod.duration && !existingPeriod.intervalId) {
      this.props.change('loansPolicy.existingRequestsPeriod.intervalId', 1);
    }
    if (existingPeriod && existingPeriod.intervalId && !existingPeriod.duration) {
      this.props.change('loansPolicy.existingRequestsPeriod.duration', 1);
    }
    let gracePeriod = (allValues.loansPolicy && allValues.loansPolicy.gracePeriod);
    if (gracePeriod && gracePeriod.duration && !gracePeriod.intervalId) {
      this.props.change('loansPolicy.gracePeriod.intervalId', 1);
    }
    if (gracePeriod && gracePeriod.intervalId && !gracePeriod.duration) {
      this.props.change('loansPolicy.gracePeriod.duration', 1);
    }

    this.setState({ policy: allValues });
  };

  saveChanges() {
    delete this.state.policy._cid;  // Hack to deal with STRIPES-425
    this.props.parentMutator.loanPolicies.PUT(this.state.policy);
  };

  beginDelete() {
    this.setState({
      confirmDelete: true,
    });
  };

  deletePolicy(confirmation) {
    if (confirmation) {
      this.props.parentMutator.loanPolicies.DELETE(this.state.policy)
      .then(() => this.props.clearSelection());
    } else {
      this.setState({
        confirmDelete: false,
      });
    }
  };

  render() {
    const policy = this.state.policy;

    // The renewal option fields should only appear if the 'renewable' checkbox is checked
    const renewableOptionFields = (
      <div>
        <Field label="Unlimited renewals" name="renewalsPolicy.unlimited" id="unlimitedRenewals" component={Checkbox}  checked={policy.renewalsPolicy && policy.renewalsPolicy.unlimited} validate={this.validateField} onBlur={this.saveChanges} />
        <p>Number of renewals allowed</p>
        <Row>
          <Col xs={2}>
            <Field label="" name="renewalsPolicy.numberAllowed" id="numRenewals" component={TextField} required rounded validate={this.validateField} onBlur={this.saveChanges} />
            </Col>
        </Row>
        <Field
          label="Renew from"
          name="renewalsPolicy.renewFromId"
          id="renewFrom"
          component={Select}
          dataOptions={renewFromOptions}
          validate={this.validateField}
          onBlur={this.saveChanges}
        />

        <Field label="Renewal period different from original loan" name="renewalsPolicy.differentPeriod" id="diffRenewPeriod" component={Checkbox} checked={policy.renewalsPolicy && policy.renewalsPolicy.differentPeriod} validate={this.validateField} onBlur={this.saveChanges} />
        <Field
          label="Alternate fixed due date schedule for renewals"
          name="renewalsPolicy"
          id="altRenewalFixedDueDate"
          component={Select}
          placeholder="Select schedule"
          dataOptions={[]}
        />
      </div>
    );

    // Loan period fields should only appear for the 'rolling' profile type
    const loanPeriodFields = (
      <div>
        <p>Loan period</p>
        <Row>
          <Col xs={2}>
            <Field label="" name="loansPolicy.period.duration" id="loanPeriodDuration" component={TextField} rounded validate={this.validateField} />
          </Col>
          <Col>
            <Field
              label=""
              name="loansPolicy.period.intervalId"
              id="loanPeriodInterval"
              component={Select}
              placeholder="Select interval"
              dataOptions={intervalPeriods}
              validate={this.validateField}

            />
          </Col>
        </Row>
      </div>
    );

    // Most of the loan option fields should only appear if the 'loanable' checkbox is checked
    const loanableOptionFields = (
      <div>
        <Field
          label="Loan profile"
          name="loansPolicy.profileId"
          id="loanProfile"
          component={Select}
          dataOptions={loanProfileTypes}
          validate={this.validateField}
          onBlur={this.saveChanges}
        />
        {policy.loansPolicy && policy.loansPolicy.profileId == 2 && loanPeriodFields}

        <Field
          label="Fixed due date schedule"
          name="fixedDueDateSchedule"
          id="fixedDueDateSchedule"
          component={Select}
          placeholder="Select schedule"
          dataOptions={[]}
        />
        <Field
          label="Closed library due date management"
          name="loansPolicy.closedLibraryDueDateManagementId"
          id="closedLibraryDueDateMgmt"
          component={Select}
          dataOptions={dueDateManagementOptions}
          validate={this.validateField}
          onBlur={this.saveChanges}
        />
        <Field label="Skip closed dates in intervening period" name="loansPolicy.skipClosed" id="skipClosed" component={Checkbox} checked={policy.loansPolicy && policy.loansPolicy.skipClosed} validate={this.validateField} onBlur={this.saveChanges} />

        <p>Alternate loan period for items with existing requests</p>
        <Row>
          <Col xs={2}>
            <Field label="" name="loansPolicy.existingRequestsPeriod.duration" id="altLoanPeriod" component={TextField} rounded validate={this.validateField} onBlur={this.saveChanges} />
          </Col>
          <Col>
            <Field
              label=""
              name="loansPolicy.existingRequestsPeriod.intervalId"
              id="altLoanPeriodInterval"
              component={Select}
              placeholder="Select interval"
              dataOptions={intervalPeriods}
              validate={this.validateField}
              onBlur={this.saveChanges}
            />
          </Col>
        </Row>

        <p>Grace period</p>
        <Row>
          <Col xs={2}>
            <Field label="" name="gracePeriod" id="loansPolicy.gracePeriod.duration" component={TextField} rounded />
          </Col>
          <Col>
            <Field
              label=""
              name="loansPolicy.gracePeriod.intervalId"
              id="gracePeriodInterval"
              component={Select}
              placeholder="Select interval"
              dataOptions={intervalPeriods}
              validate={this.validateField}
              onBlur={this.saveChanges}
            />
          </Col>
        </Row>

        <fieldset>
          <legend>Renewals</legend>
          <Field label="Renewable" name="renewable" id="renewable" component={Checkbox} checked={policy.renewable} validate={this.validateField} onBlur={this.saveChanges} />
          {policy.renewable && renewableOptionFields}
        </fieldset>
      </div>
    );

    return (
      <div>
        <h2 style={{ marginTop: '0' }}>About</h2>
        <Field label="Policy name" name="name" id="policyName" component={TextField} required fullWidth rounded validate={this.validateField} onBlur={this.saveChanges} />
        <Field label="Policy description" name="description" id="policyDescription" component={TextArea} fullWidth rounded validate={this.validateField} onBlur={this.saveChanges} />
        <Button title="Delete policy" onClick={this.beginDelete} disabled={this.state.confirmDelete}>Delete policy</Button>
        {this.state.confirmDelete && <div>
          <Button title="Confirm delete loan policy" onClick={() => { this.deletePolicy(true); }}>Confirm</Button>
          <Button title="Cancel delete loan policy" onClick={() => { this.deletePolicy(false); }}>Cancel</Button>
        </div>}
        <hr/>
        <h2>Loans</h2>
        <Field label="Loanable" name="loanable" id="loanable" component={Checkbox} checked={policy.loanable} validate={this.validateField} onBlur={this.saveChanges} />
        {policy.loanable && loanableOptionFields}
      {/*  <hr/>
        <h2>Requests</h2>
        <Field label="Requestable" name="requestable" id="requestable" component={Checkbox} /> */}
      </div>
    );

  };

}

export default reduxForm({
  form: 'LoanPolicyForm',
  enableReinitialize: true,
})(LoanPolicyDetail);
