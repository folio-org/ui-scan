import React from 'react';

import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Select from '@folio/stripes-components/lib/Select';
import Button from '@folio/stripes-components/lib/Button';
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';
import TextField from '@folio/stripes-components/lib/TextField';
import {Row, Col} from 'react-bootstrap';

import UserView from './UserView';

const propTypes = {
  onChangeMode: React.PropTypes.func,
  modeSelector: React.PropTypes.element,
  items: React.PropTypes.arrayOf(React.PropTypes.object),
  patrons: React.PropTypes.arrayOf(React.PropTypes.object),
}

class CheckOut extends React.Component{

  constructor(props) {
    super(props);
  }

  render() {

    const containerStyle = {
      display: 'flex',
      flexDirection:'column',
      justifyContent: 'space-between',
      height: '100%',
      width: '100%',
      position: 'absolute',
    };
    
    if(this.props.patron !== null && this.props.items.length !== 0){
      containerStyle.height = '98.6%';
    }
    
    const itemListFormatter = {
      status: item => `${_.get(item, ['status', 'name'], '')}`,
      '': item => <td key={item.id}><Button buttonStyle="negative hollow" align="end" marginBottom0 onClick={()=> {this.props.onClickRemoveItem(item.id);}}>Cancel</Button></td>,
    }

    const patronsListFormatter = {
      Active: user => user.active,
      Name: user => `${_.get(user, ['personal', 'last_name'], '')}, ${_.get(user, ['personal', 'first_name'], '')}`,
      Username: user => user.username,
      Email: user => _.get(user, ['personal', 'email']),
    };

    return(
      <div style={containerStyle}>
        <Paneset static>
          <Pane defaultWidth="50%" paneTitle="Patron" firstMenu={this.props.modeSelector}>
            <Row>
              <Col xs={9}>
                <TextField placeholder="Enter Patron's username" aria-label='Patron ID' fullWidth id="patronid" />
              </Col>
              <Col xs={3}>
                <Button buttonStyle="primary noRadius" fullWidth onClick={this.props.onClickFindPatron}>Find Patron</Button>
              </Col>
            </Row>
            <MultiColumnList
              contentData={this.props.patrons}
              rowMetadata={['id', 'username']}
              formatter={patronsListFormatter}
              visibleColumns={['Active', 'Name', 'Username', 'Email']}
              fullWidth
              isEmptyMessage={`No patron selected`}
            />
          </Pane>
          <Pane defaultWidth="50%" paneTitle="Scanned Items">
          <Row>
            <Col xs={9}>
              <TextField placeholder='Enter Barcode' aria-label='Item ID' fullWidth id="barcode" />
            </Col>
            <Col xs={3}>
              <Button buttonStyle="primary noRadius" fullWidth onClick={this.props.onClickAddItem}>+ Add item</Button>
            </Col>
          </Row>
          <MultiColumnList
            visibleColumns={['barcode', 'status', '']}
            rowMetadata={['id']}
            contentData={this.props.items} 
            formatter={itemListFormatter} 
            isEmptyMessage="No items have been entered yet."
            fullWidth
          />
          </Pane>

        </Paneset>
        {this.props.patrons && this.props.patrons.length !== 0 && this.props.items && this.props.items.length !== 0 ?
          <Button buttonStyle="primary mega" onClick={this.props.onClickCheckout} >Done</Button> : null
        }
      </div>
    );
  }
}

CheckOut.propTypes = propTypes;

export default CheckOut;


