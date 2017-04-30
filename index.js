// We have to remove node_modules/react to avoid having multiple copies loaded.
// eslint-disable-next-line import/no-unresolved
import React, { Component, PropTypes } from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Scan from './Scan';
import Settings from './settings';

class ScanRouting extends Component {

  static childContextTypes = {
    stripes: React.PropTypes.object,
  };

  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  }

  getChildContext() {
    return { stripes: this.props.stripes };
  }

  NoMatch() {
    return (
      <div>
        <h2>Uh-oh!</h2>
        <p>How did you get to <tt>{this.props.location.pathname}</tt>?</p>
      </div>
    );
  }

  render() {

    if (this.props.showSettings) {
      return <Settings {...this.props} />
    }

    const { match: { path }, stripes: { connect } } = this.props;
    return (
      <Switch>
        <Route
          path={`${path}`}
          render={() => React.createElement(connect(Scan))}
        />
        <Route component={() => { this.NoMatch(); }} />
      </Switch>
    );
  }
}

export default ScanRouting;
