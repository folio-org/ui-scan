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

class EntrySelector extends React.Component {

  static propTypes = {
    addButtonTitle: PropTypes.string,
    detailComponent: PropTypes.object.isRequired,
    parentMutator: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    allEntries: PropTypes.arrayOf(
      PropTypes.object,
    ).isRequired,
    entryCreator: PropTypes.func.isRequired,
    paneTitle: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.activeLink = this.activeLink.bind(this);
    this.clearSelection = this.clearSelection.bind(this);
    this.linkPath = this.linkPath.bind(this);
  }

  activeLink(links) {
    return this.props.location.pathname || this.linkPath(links[0].key);
  }

  linkPath(id) {
    return `${this.props.match.path}/${id}`;
  }

  clearSelection() {
    const { allEntries } = this.props;
    let id;
    if (allEntries.length > 0) { id = allEntries[0].id; }
    this.props.history.push(`${this.props.match.path}/${id}`);
  }

  render() {
    const { addButtonTitle, allEntries, entryCreator, location, paneTitle, parentMutator } = this.props;

    const links = _.sortBy(allEntries, ['name']).map(e => (
      <Link key={e.id} to={this.linkPath(e.id)}>{e.name}</Link>
    ));

    const ComponentToRender = this.props.detailComponent;

    const routes = allEntries.map(e => (
      <Route
        key={e.id}
        path={this.linkPath(e.id)}
        render={() => (
          <Pane paneTitle={e.name} defaultWidth="fill">
            <ComponentToRender
              clearSelection={this.clearSelection}
              initialValues={e}
              loanPolicies={allEntries}
              parentMutator={parentMutator}
            />
          </Pane>
        )}
      />
    ));

    const LastMenu = (
      <PaneMenu>
        <button title={addButtonTitle} onClick={entryCreator}>
          <Icon icon="plus-sign" />
        </button>
      </PaneMenu>
    );

    return (
      <Paneset nested defaultWidth="80%">
        <Pane defaultWidth="25%" lastMenu={LastMenu} paneTitle={paneTitle}>
          <NavList>
            <NavListSection activeLink={this.activeLink(links)}>
              {links}
            </NavListSection>
          </NavList>
        </Pane>

        <Switch>
          {routes}
        </Switch>
      </Paneset>
    );
  }
}

export default EntrySelector;
