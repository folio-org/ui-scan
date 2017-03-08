import _ from 'lodash';
// We have to remove node_modules/react to avoid having multiple copies loaded.
// eslint-disable-next-line import/no-unresolved
import React from 'react';

import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import Button from '@folio/stripes-components/lib/Button';
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';
import TextField from '@folio/stripes-components/lib/TextField';
import { Row, Col } from 'react-bootstrap';


const propTypes = {
  modeSelector: React.PropTypes.element,
  items: React.PropTypes.arrayOf(React.PropTypes.object),
  patrons: React.PropTypes.arrayOf(React.PropTypes.object),
  patron: React.PropTypes.object,
  onClickRemoveItem: React.PropTypes.func,
  onClickFindPatron: React.PropTypes.func,
  onClickAddItem: React.PropTypes.func,
  onClickCheckout: React.PropTypes.func,
};

function CheckOut(props) {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    width: '100%',
    position: 'absolute',
  };

  if (props.patron !== null && props.items.length !== 0) {
    containerStyle.height = '98.6%';
  }

  const itemListFormatter = {
    status: item => `${_.get(item, ['status', 'name'], '')}`,
    '': item => <td key={item.id}><Button buttonStyle="negative hollow" align="end" marginBottom0 onClick={() => { props.onClickRemoveItem(item.id); }}>Cancel</Button></td>,
  };

  const patronsListFormatter = {
    Active: user => user.active,
    Name: user => `${_.get(user, ['personal', 'last_name'], '')}, ${_.get(user, ['personal', 'first_name'], '')}`,
    Username: user => user.username,
    Email: user => _.get(user, ['personal', 'email']),
  };

  return (
    <div style={containerStyle}>
      <Paneset static>
        <Pane defaultWidth="50%" paneTitle="Patron" firstMenu={props.modeSelector}>
          <Row>
            <Col xs={9}>
              <TextField placeholder="Enter Patron's username" aria-label="Patron ID" fullWidth id="patronid" />
            </Col>
            <Col xs={3}>
              <Button buttonStyle="primary noRadius" fullWidth onClick={props.onClickFindPatron}>Find Patron</Button>
            </Col>
          </Row>
          <MultiColumnList
            contentData={props.patrons}
            rowMetadata={['id', 'username']}
            formatter={patronsListFormatter}
            visibleColumns={['Active', 'Name', 'Username', 'Email']}
            fullWidth
            isEmptyMessage={'No patron selected'}
          />
        </Pane>
        <Pane defaultWidth="50%" paneTitle="Scanned Items">
          <Row>
            <Col xs={9}>
              <TextField placeholder="Enter Barcode" aria-label="Item ID" fullWidth id="barcode" />
            </Col>
            <Col xs={3}>
              <Button buttonStyle="primary noRadius" fullWidth onClick={props.onClickAddItem}>+ Add item</Button>
            </Col>
          </Row>
          <MultiColumnList
            visibleColumns={['barcode', 'status', '']}
            rowMetadata={['id']}
            contentData={props.items}
            formatter={itemListFormatter}
            isEmptyMessage="No items have been entered yet."
            fullWidth
          />
        </Pane>

      </Paneset>
      {props.patrons && props.patrons.length !== 0 && props.items && props.items.length !== 0 ?
        <Button buttonStyle="primary mega" onClick={props.onClickCheckout} >Done</Button> : null
      }
    </div>
  );
}

CheckOut.propTypes = propTypes;

export default CheckOut;
