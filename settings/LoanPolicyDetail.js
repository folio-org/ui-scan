import React, { PropTypes } from 'react';
//import { Row, Col } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';

import Button from '@folio/stripes-components/lib/Button';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
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
