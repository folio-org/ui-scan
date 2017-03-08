import _ from 'lodash';
// We have to remove node_modules/react to avoid having multiple copies loaded.
// eslint-disable-next-line import/no-unresolved
import React from 'react';

import KeyValue from '@folio/stripes-components/lib/KeyValue';
import { Row, Col } from 'react-bootstrap';

const propTypes = {
  user: React.PropTypes.object,
};

function UserView(props) {
  const user = props.user;
  const userStatus = (_.get(user, ['active'], '') ? 'active' : 'inactive');

  return (
    <Row>
      <Col xs={8} >
        <Row>
          <Col xs={12}>
            <h2>{_.get(user, ['personal', 'last_name'], '')}, {_.get(user, ['personal', 'first_name'], '')}</h2>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="Username" value={_.get(user, ['username'], '')} />
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs={12}>
            <KeyValue label="Status" value={userStatus} />
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs={12}>
            <KeyValue label="Email" value={_.get(user, ['personal', 'email'], '')} />
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs={12}>
            <KeyValue label="Patron group" value={_.get(user, ['patron_group'], '')} />
          </Col>
        </Row>
      </Col>
      <Col xs={4} >
        <img className="floatEnd" src="http://placehold.it/175x175" role="presentation" />
      </Col>
    </Row>);
}

UserView.propTypes = propTypes;
