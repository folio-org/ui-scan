import _ from 'lodash';
// We have to remove node_modules/react to avoid having multiple copies loaded.
// eslint-disable-next-line import/no-unresolved
import React from 'react';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import Button from '@folio/stripes-components/lib/Button';
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';
import { Row, Col } from 'react-bootstrap';
import TextField from '@folio/stripes-components/lib/TextField';

const propTypes = {
  modeSelector: React.PropTypes.element,
  scannedItems: React.PropTypes.arrayOf(React.PropTypes.object),
  onClickCheckin: React.PropTypes.func,
};

function CheckIn(props) {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    width: '100%',
    position: 'absolute',
  };

  const itemListFormatter = {
    title: loan => `${_.get(loan, ['item', 'title'])}`,
    barcode: loan => `${_.get(loan, ['item', 'barcode'])}`,
    loanDate: loan => loan.loanDate.substr(0, 10),
    returnDate: loan => loan.returnDate.substr(0, 10),
  };

  return (
    <div style={containerStyle}>
      <Paneset static>
        <Pane paneTitle="Scanned Items" defaultWidth="100%" firstMenu={props.modeSelector}>
          <div style={{ width: '100%', maxWidth: '1024px', margin: 'auto' }}>
            <Row>
              <Col xs={9}>
                <TextField placeholder="Enter Barcode" aria-label="Item ID" fullWidth id="barcode" />
              </Col>
              <Col xs={3}>
                <Button buttonStyle="primary noRadius" fullWidth onClick={props.onClickCheckin}>+ Add item</Button>
              </Col>
            </Row>
            <MultiColumnList
              visibleColumns={['title', 'barcode', 'loanDate', 'returnDate']}
              rowMetadata={['id']}
              contentData={props.scannedItems}
              formatter={itemListFormatter}
              isEmptyMessage="No items have been entered yet."
              fullWidth
            />
          </div>
        </Pane>
      </Paneset>
    </div>
  );
}

CheckIn.propTypes = propTypes;

export default CheckIn;
