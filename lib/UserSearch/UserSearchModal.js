import React, { Component, PropTypes } from 'react';
import { isDirty } from 'redux-form';

import Users from '@folio/users';
import Modal from '@folio/stripes-components/lib/Modal';
import Button from '@folio/stripes-components/lib/Button';

import css from './UserSearch.css';

export default class UserSearchModal extends Component {

    static propTypes = {
        stripes: PropTypes.shape({
            connect: PropTypes.func.isRequired,
        }).isRequired
    }

    constructor(props) {
        super(props);
        this.connectedApp = props.connect(Users);
    }

    render() {
        return (
            <Modal onClose={this.props.closeCB} size="large" open={this.props.openWhen} label="Select User" dismissible>
                <div className={css.userSearchModal}>
                    <this.connectedApp {...this.props} />
                </div>
            </Modal>
        ); 
    };
}