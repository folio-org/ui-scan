import React, { PropTypes } from 'react';
import _ from 'lodash';

import Pane from '@folio/stripes-components/lib/Pane';
import Paneset from '@folio/stripes-components/lib/Paneset';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Icon from '@folio/stripes-components/lib/Icon';
import NavList from '@folio/stripes-components/lib/NavList';
import NavListSection from '@folio/stripes-components/lib/NavListSection';
import IfPermission from '@folio/stripes-components/lib/IfPermission';
import FixedDueDateScheduleDetails from './FixedDueDateScheduleDetails';

const FIXED_DATE_SCHEDULES = [
  {
    id: 1,
    scheduleName: 'quarter',
    displayName: 'Quarter',
    description: 'Quarter stuff',
    schedules: [
      { id: 1, dateFrom: new Date('2017-09-01T00:00:00'), dateTo: new Date('2017-11-30T00:00:00'), dueDate: new Date('2017-12-15T00:00:00'), firstName: 'Alice' },
      { id: 2, dateFrom: new Date('2017-12-01T00:00:00'), dateTo: new Date('2018-02-28T00:00:00'), dueDate: new Date('2018-03-15T00:00:00'), firstName: 'Betty' },
      { id: 3, dateFrom: new Date('2018-03-01T00:00:00'), dateTo: new Date('2018-05-31T00:00:00'), dueDate: new Date('2018-06-15T00:00:00'), firstName: 'Camilla' },
    ] },
  {
    id: 2,
    scheduleName: 'semester',
    displayName: 'Semester',
    description: 'Semester stuff',
    schedules: [
      { id: 4, dateFrom: new Date('2017-09-01T00:00:00'), dateTo: new Date('2017-12-31T00:00:00'), dueDate: new Date('2018-01-15T00:00:00'), firstName: 'Daphne' },
      { id: 5, dateFrom: new Date('2018-01-01T00:00:00'), dateTo: new Date('2018-05-31T00:00:00'), dueDate: new Date('2018-06-15T00:00:00'), firstName: 'Eve' },
    ] },
  {
    id: 3,
    scheduleName: 'year',
    displayName: 'Year',
    description: 'Year stuff',
    schedules: [
      { id: 6, dateFrom: new Date('2017-01-01T00:00:00'), dateTo: new Date('2017-12-31T00:00:00'), dueDate: new Date('2018-01-15T00:00:00'), firstName: 'Frances' },
      { id: 7, dateFrom: new Date('2018-01-01T00:00:00'), dateTo: new Date('2018-12-31T00:00:00'), dueDate: new Date('2019-01-15T00:00:00'), firstName: 'Gwen' },
    ] },
];

class FixedDueDateScheduleSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
    data: PropTypes.shape({
      scheduleSettings: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
    mutator: PropTypes.shape({
      scheduleSettings: PropTypes.shape({
        POST: PropTypes.func,
        DELETE: PropTypes.func,
        GET: PropTypes.func,
      }),
    }).isRequired,
  };

  /* @@
  static manifest = Object.freeze({
    scheduleSettings: {
      type: 'okapi',
      records: 'fixed-due-date-schedules',
      DELETE: {
        path: 'circulation-storage/fixed-due-date-schedules',
      },
      POST: {
        path: 'circulation-storage/fixed-due-date-schedules',
      },
      GET: {
        path: 'circulation-storage/fixed-due-date-schedules?length=100&query=(mutable=true)',
      },
      path: 'circulation-storage/fixed-due-date-schedules',
    },
  });
  */

  constructor(props) {
    super(props);

    this.fixedDateSchedules = FIXED_DATE_SCHEDULES;

    this.state = {
      selectedSchedule: null,
    };

    this.navList = null;

    this.onSelectSchedule = this.onSelectSchedule.bind(this);
    this.createNewSchedule = this.createNewSchedule.bind(this);
    this.clearSelection = this.clearSelection.bind(this);
  }

  onSelectSchedule(e) {
    e.preventDefault();
    const scheduleId = Number.parseInt(e.target.dataset.id, 10);
    _.forEach(this.fixedDateSchedules, (schedule) => {
      if (schedule.id === scheduleId) {
        this.setSelectedSchedule(schedule);
      }
    });
  }

  setSelectedSchedule(schedule) {
    this.setState({
      selectedSchedule: schedule,
    });
  }

  createNewSchedule() {
    // @@ TODO
    /*
    this.props.mutator.scheduleSettings.POST({
      mutable: true,
    });
    */
  }

  render() {
    // @@ eventually will be const mutator = this.props.mutator
    const mutator = {
      scheduleSettings: {
        POST: () => { console.log('post'); },
        PUT: () => { console.log('put'); },
        DELETE: () => { console.log('delete'); },
        GET: () => { console.log('get'); },
      },
    };

    const RenderedFixedDateSchedules = this.fixedDateSchedules ? this.fixedDateSchedules.map(
      schedule => <a data-id={schedule.id} key={schedule.id} href={`#${schedule.scheduleName}`} onClick={this.onSelectSchedule}>{schedule.displayName ? schedule.displayName : 'Untitled Schedule'}</a>,
    ) : [];

    const FixedScheduleLastMenu = (
      <PaneMenu>
        <button title="Add Fixed Due Date Schedule" onClick={this.createNewSchedule}>
          <Icon icon="plus-sign" />
        </button>
      </PaneMenu>
    );

    return (
      <Paneset nested>
        <Pane defaultWidth="25%" lastMenu={FixedScheduleLastMenu}>
          <NavList>
            <NavListSection activeLink={this.state.selectedSchedule ? `#${this.state.selectedSchedule.id}` : ''}>
              {RenderedFixedDateSchedules}
            </NavListSection>
          </NavList>
        </Pane>
        {this.state.selectedSchedule && <FixedDueDateScheduleDetails
          parentMutator={mutator}
          stripes={this.props.stripes}
          initialValues={this.state.selectedSchedule}
          selectedSchedule={this.state.selectedSchedule}
        />
        }
      </Paneset>
    );
  }
}

export default FixedDueDateScheduleSettings;
