import React, { PropTypes } from 'react';
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
    initialValues: PropTypes.object.isRequired,
    change: PropTypes.func.isRequired,
    parentMutator: PropTypes.shape({
      loanPolicies: PropTypes.shape({
        DELETE: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired,
      }),
    }).isRequired,
    clearSelection: PropTypes.func.isRequired,
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
  }

  // TODO: This feels like an abuse of the 'validate' parameter, using it to do an
  // immediate save instead of actual validation ....
  validateField(fieldValue, allValues) {
    // TODO: This is a bad hack to deal with constraints that both fields of
    // a "period" object have to exist in the record. This should be rewritten ASAP
    const period = (allValues.loansPolicy && allValues.loansPolicy.period);
    if (period && period.duration && !period.intervalId) {
      this.props.change('loansPolicy.period.intervalId', 1);
    }
    if (period && period.intervalId && !period.duration) {
      this.props.change('loansPolicy.period.duration', 1);
    }
    const existingPeriod = (allValues.loansPolicy && allValues.loansPolicy.existingRequestsPeriod);
    if (existingPeriod && existingPeriod.duration && !existingPeriod.intervalId) {
      this.props.change('loansPolicy.existingRequestsPeriod.intervalId', 3);
    }
    if (existingPeriod && existingPeriod.intervalId && !existingPeriod.duration) {
      this.props.change('loansPolicy.existingRequestsPeriod.duration', 1);
    }
    const gracePeriod = (allValues.loansPolicy && allValues.loansPolicy.gracePeriod);
    if (gracePeriod && gracePeriod.duration && !gracePeriod.intervalId) {
      this.props.change('loansPolicy.gracePeriod.intervalId', 1);
    }
    if (gracePeriod && gracePeriod.intervalId && !gracePeriod.duration) {
      this.props.change('loansPolicy.gracePeriod.duration', 1);
    }
    const altRenewPeriod = (allValues.renewalsPolicy && allValues.renewalsPolicy.period);
    if (altRenewPeriod && altRenewPeriod.duration && !altRenewPeriod.intervalId) {
      this.props.change('renewalsPolicy.period.intervalId', 1);
    }
    if (altRenewPeriod && altRenewPeriod.intervalId && !altRenewPeriod.duration) {
      this.props.change('renewalsPolicy.period.duration', 1);
    }

    this.setState({ policy: allValues });
  }

  saveChanges() {
    // Hacks to deal with STRIPES-425
    delete this.state.policy._cid; // eslint-disable-line no-underscore-dangle
    delete this.state.policy.busy;
    delete this.state.policy.pendingCreate;
    delete this.state.policy.pendingUpdate;

    this.props.parentMutator.loanPolicies.PUT(this.state.policy);
  }

  beginDelete() {
    this.setState({
      confirmDelete: true,
    });
  }

  deletePolicy(confirmation) {
    if (confirmation) {
      this.props.parentMutator.loanPolicies.DELETE(this.state.policy)
      .then(() => this.props.clearSelection());
    } else {
      this.setState({
        confirmDelete: false,
      });
    }
  }

  render() {
    const policy = this.state.policy;

    // Conditional field labels
    let dueDateScheduleFieldLabel = 'Fixed due date schedule';
    let altRenewalScheduleLabel = 'Alternate fixed due date schedule for renewals';
    if (policy.loansPolicy && policy.loansPolicy.profileId === '2') {
      dueDateScheduleFieldLabel += ' (due date limit)';
      altRenewalScheduleLabel = 'Alternate fixed due date schedule (due date limit) for renewals';
    }

    return (
      <div>
        {/* Primary information: policy name and description, plus delete button */}
        <h2 style={{ marginTop: '0' }}>About</h2>
        <Field label="Policy name" name="name" id="policyName" component={TextField} required fullWidth rounded validate={this.validateField} onBlur={this.saveChanges} />
        <Field label="Policy description" name="description" id="policyDescription" component={TextArea} fullWidth rounded validate={this.validateField} onBlur={this.saveChanges} />
        <Button title="Delete policy" onClick={this.beginDelete} disabled={this.state.confirmDelete}>Delete policy</Button>
        {this.state.confirmDelete && <div>
          <Button title="Confirm delete loan policy" onClick={() => { this.deletePolicy(true); }}>Confirm</Button>
          <Button title="Cancel delete loan policy" onClick={() => { this.deletePolicy(false); }}>Cancel</Button>
        </div>}
        <hr />

        {/* Loan detail section */}
        <h2>Loans</h2>
        {/* loanable: boolean determining visibility of all subsequent elements */}
        <Field
          label="Loanable"
          name="loanable"
          component={Checkbox}
          checked={policy.loanable}
          validate={this.validateField}
          onBlur={this.saveChanges}
        />
        {/* loan profile. Value affects visibility of several subsequent elements */}
        { policy.loanable &&
          <Field
            label="Loan profile"
            name="loansPolicy.profileId"
            component={Select}
            dataOptions={loanProfileTypes}
            validate={this.validateField}
            onBlur={this.saveChanges}
          />
        }
        {/* loan period - only appears when profile is "rolling" */}
        { (policy.loanable && policy.loansPolicy.profileId === '2') &&
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
                  component={Select}
                  placeholder="Select interval"
                  dataOptions={intervalPeriods}
                  validate={this.validateField}
                />
              </Col>
            </Row>
          </div>
        }
        {/* fixed due date schedule - appears when profile is "fixed" or "rolling",
            but with different labels */}
        { (policy.loanable && policy.loansPolicy && policy.loansPolicy.profileId !== '3') &&
          <Field
            label={dueDateScheduleFieldLabel}
            name="loansPolicy.fixedDueDateSchedule"
            component={Select}
            placeholder="Select schedule"
            dataOptions={[]}
          />
        }
        {/* closed library due date management - Select */}
        { policy.loanable &&
          <Field
            label="Closed library due date management"
            name="loansPolicy.closedLibraryDueDateManagementId"
            component={Select}
            dataOptions={dueDateManagementOptions}
            validate={this.validateField}
            onBlur={this.saveChanges}
          />
        }
        {/* skip closed dates - boolean */}
        { policy.loanable &&
          <Field
            label="Skip closed dates in intervening period"
            name="loansPolicy.skipClosed"
            component={Checkbox}
            checked={policy.loansPolicy && policy.loansPolicy.skipClosed}
            validate={this.validateField}
            onBlur={this.saveChanges}
          />
        }
        {/* alternate loan period */}
        { policy.loanable &&
          <div>
            <p>Alternate loan period for items with existing requests</p>
            <Row>
              <Col xs={2}>
                <Field
                  label=""
                  name="loansPolicy.existingRequestsPeriod.duration"
                  component={TextField}
                  rounded
                  validate={this.validateField}
                  onBlur={this.saveChanges}
                />
              </Col>
              <Col>
                <Field
                  label=""
                  name="loansPolicy.existingRequestsPeriod.intervalId"
                  component={Select}
                  placeholder="Select interval"
                  dataOptions={intervalPeriods}
                  validate={this.validateField}
                  onBlur={this.saveChanges}
                />
              </Col>
            </Row>
          </div>
        }
        {/* grace period */}
        { policy.loanable &&
          <div>
            <p>Grace period</p>
            <Row>
              <Col xs={2}>
                <Field
                  label=""
                  name="loansPolicy.gracePeriod.duration"
                  component={TextField}
                  rounded
                  validate={this.validateField}
                  onBlur={this.saveChanges}
                />
              </Col>
              <Col>
                <Field
                  label=""
                  name="loansPolicy.gracePeriod.intervalId"
                  component={Select}
                  placeholder="Select interval"
                  dataOptions={intervalPeriods}
                  validate={this.validateField}
                  onBlur={this.saveChanges}
                />
              </Col>
            </Row>
          </div>
        }

        {/************* renewals section **************/}
        { policy.loanable &&
          <fieldset>
            <legend>Renewals</legend>

            {/* renewable (bool) - affects visibility of most subsequent fields */}
            <Field
              label="Renewable"
              name="renewable"
              component={Checkbox}
              checked={policy.renewable}
              validate={this.validateField}
              onBlur={this.saveChanges}
            />
            {/* unlimited renewals (bool) */}
            <Field
              label="Unlimited renewals"
              name="renewalsPolicy.unlimited"
              component={Checkbox}
              checked={policy.renewalsPolicy && policy.renewalsPolicy.unlimited} validate={this.validateField}
              onBlur={this.saveChanges}
            />
            {/* number of renewals allowed */}
            { policy.renewalsPolicy.unlimited === false &&
              <div>
                <p>Number of renewals allowed</p>
                <Row>
                  <Col xs={2}>
                    <Field
                      label=""
                      name="renewalsPolicy.numberAllowed"
                      component={TextField}
                      required
                      rounded
                      validate={this.validateField}
                      onBlur={this.saveChanges}
                    />
                  </Col>
                </Row>
              </div>
            }
            {/* renew from */}
            <Field
              label="Renew from"
              name="renewalsPolicy.renewFromId"
              component={Select}
              dataOptions={renewFromOptions}
              validate={this.validateField}
              onBlur={this.saveChanges}
            />
            {/* different renewal period (bool) */}
            <Field
              label="Renewal period different from original loan" name="renewalsPolicy.differentPeriod"
              component={Checkbox}
              checked={policy.renewalsPolicy && policy.renewalsPolicy.differentPeriod} validate={this.validateField}
              onBlur={this.saveChanges}
            />
            {/* alternate loan period for renewals ("rolling" profile only) */}
            { policy.renewalsPolicy.differentPeriod && policy.loansPolicy.profileId === '2' &&
              <div>
                <p>Alternate loan period for renewals</p>
                <Row>
                  <Col xs={2}>
                    <Field
                      label=""
                      name="renewalsPolicy.period.duration"
                      component={TextField}
                      rounded
                      validate={this.validateField}
                    />
                  </Col>
                  <Col>
                    <Field
                      label=""
                      name="renewalsPolicy.period.intervalId"
                      component={Select}
                      placeholder="Select interval"
                      dataOptions={intervalPeriods}
                      validate={this.validateField}
                    />
                  </Col>
                </Row>
              </div>
            }
            {/* alt fixed due date schedule for renewals - appears when profile is
              "fixed" or "rolling", but with different labels */}
            { policy.renewalsPolicy.differentPeriod && policy.loansPolicy.profileId !== '3' &&
              <Field
                label={altRenewalScheduleLabel}
                name="renewalsPolicy"       // TODO: Need to hook this up with the right schema component when it's ready
                component={Select}
                placeholder="Select schedule"
                dataOptions={[]}
              />
            }
          </fieldset>
        }

      </div>
    );
  }
}

export default reduxForm({
  form: 'LoanPolicyForm',
  enableReinitialize: true,
})(LoanPolicyDetail);
