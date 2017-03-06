import React from 'react';

import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Select from '@folio/stripes-components/lib/Select';
import Button from '@folio/stripes-components/lib/Button';
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';
import {Row, Col} from 'react-bootstrap';
import TextField from '@folio/stripes-components/lib/TextField';

const propTypes = {
  onChangeMode: React.PropTypes.func,
  modeSelector: React.PropTypes.element,
  items: React.PropTypes.arrayOf(React.PropTypes.object),
  patron: React.PropTypes.object,   // eslint-disable-line
}

class CheckIn extends React.Component{
  constructor(props){
    super(props);
  }
  
  render(){
    const containerStyle = {
      display: 'flex',
      flexDirection:'column',
      justifyContent: 'space-between',
      height: '100%',
      width: '100%',
      position: 'absolute',
    };

    const itemListFormatter = {
      status: item => `${_.get(item, ['status', 'name'], '')}`,
      '': item => <td key={item.id}><Button buttonStyle="negative hollow" align="end" marginBottom0 onClick={()=> {this.props.onClickRemoveItem(item.id);}}>Cancel</Button></td>,
    };

    return(
      <div style={containerStyle}>
      <Paneset static>
        <Pane paneTitle="Scanned Items" defaultWidth='100%' firstMenu={this.props.modeSelector}>
          <div style={{width:'100%', maxWidth:'1024px', margin:'auto'}}>
            <Row>
              <Col xs={9}>
                <TextField placeholder='Enter Barcode' aria-label='Item ID' fullWidth id="barcode"/>
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
          </div>
        </Pane>
      </Paneset>
      {this.props.items && this.props.items.length !== 0 &&
          <Button buttonStyle="primary mega" onClick={this.props.onClickCheckin}>Done</Button>
        }
      </div>
    )
  }
  
}

export default CheckIn;
