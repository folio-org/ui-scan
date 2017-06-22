// We have to remove node_modules/react to avoid having multiple copies loaded.
// eslint-disable-next-line import/no-unresolved
import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Field, FieldArray, reduxForm } from 'redux-form';
import Pane from '@folio/stripes-components/lib/Pane';
import Textfield from '@folio/stripes-components/lib/TextField';
import TextArea from '@folio/stripes-components/lib/TextArea';
import Button from '@folio/stripes-components/lib/Button';
import IfPermission from '@folio/stripes-components/lib/IfPermission';
import RenderFixedDueDateSchedule from './RenderFixedDueDateSchedule';

const RenderSchedules = ({ fields }) => (
  <section>
    <hr />
    <Row>
      <Col xs={5}>
        <h3 className="marginTop0">Contains</h3>
      </Col>
      <Col xs={7}>
        <Button align="end" bottomMargin0 bsRole="toggle" aria-haspopup="true">&#43; Add Row</Button>
      </Col>
    </Row>
    <br />
    {fields.map((member, index) => (
      <RenderFixedDueDateSchedule member={member} index={index} key={index} />
    ))}
  </section>
);

class FixedDueDateScheduleDetails extends Component {
  static propTypes = {
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      connect: PropTypes.func.isRequired,
    }).isRequired,
    selectedSchedule: PropTypes.object,
    parentMutator: PropTypes.shape({
      scheduleSettings: PropTypes.shape({
        DELETE: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired,
      }),
    }),
  };

  constructor(props) {
    super(props);
    this.saveSchedule = this.saveSchedule.bind(this);
    this.addScheduleItem = this.addScheduleItem.bind(this);
    this.removeScheduleItem = this.removeScheduleItem.bind(this);
  }

  saveSchedule() {
    this.props.parentMutator.scheduleSettings.PUT(this.state.selectedSchedule);
  }

  addScheduleItem(schedule) {
    this.state.selectedSchedule.schedules.push(schedule);
    this.saveSchedule();
  }

  removeScheduleItem(schedule) {
    const selectedScheduleSchedules = this.state.selectedSchedule.schedules;
    selectedScheduleSchedules.splice(selectedScheduleSchedules.indexOf(schedule), 1);
    this.saveSchedule();
  }

  render() {
    const { selectedSchedule, stripes } = this.props;
    const disabled = !stripes.hasPerm('perms.permissions.item.put');

    return (
      <Pane paneTitle={`${selectedSchedule.displayName || 'Untitled'}`} defaultWidth="fill" fluidContentWidth>
        <section>
          <h2 style={{ marginTop: '0' }}>About</h2>
          <Field label="Fixed due date schedule name" name="displayName" component={Textfield} required fullWidth rounded onBlur={this.saveSchedule} disabled={disabled} />
          <Field label="Description" name="description" component={TextArea} onBlur={this.saveSchedule} required fullWidth rounded disabled={disabled} />
        </section>
        <FieldArray name="schedules" component={RenderSchedules} />
      </Pane>
    );
  }
}

export default reduxForm({
  form: 'fixedDueDateScheduleForm',
  enableReinitialize: true,
})(FixedDueDateScheduleDetails);
