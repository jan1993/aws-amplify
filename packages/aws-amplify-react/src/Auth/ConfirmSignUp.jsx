/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

import React, { Component } from 'react';
import { Auth, I18n, Logger } from 'aws-amplify';

import AuthPiece from './AuthPiece';
import AmplifyTheme from '../AmplifyTheme';
import { Header, Footer, InputRow, MessageRow, ButtonRow, Link } from '../AmplifyUI';

const logger = new Logger('ConfirmSignUp');

export default class ConfirmSignUp extends AuthPiece {
    constructor(props) {
        super(props);

        this.confirm = this.confirm.bind(this);
        this.resend = this.resend.bind(this);
    }

    confirm() {
        const username = this.usernameFromAuthData() || this.inputs.username;
        const { code } = this.inputs;
        Auth.confirmSignUp(username, code)
            .then(() => this.changeState('signedUp'))
            .catch(err => this.error(err));
    }

    resend() {
        const username = this.usernameFromAuthData() || this.inputs.username;
        Auth.resendSignUp(username)
            .then(() => logger.debug('code resent'))
            .catch(err => this.error(err));
    }

    render() {
        const { authState, hide } = this.props;
        if (authState !== 'confirmSignUp') { return null; }

        const username = this.usernameFromAuthData();

        const theme = this.props.theme || AmplifyTheme;

        if (hide && hide.includes(ConfirmSignUp)) { return null; }

        return (
            <div className="amplify-form-section" style={theme.formSection}>
                <Header theme={theme}>{I18n.get('Confirm')} {I18n.get('Sign Up')}</Header>
                <div className="amplify-section-body" style={theme.sectionBody}>
                    { username? <MessageRow>{username}</MessageRow>
                            : <InputRow
                                placeholder={I18n.get('Username')}
                                theme={theme}
                                key="username"
                                name="username"
                                onChange={this.handleInputChange}
                            />
                    }
                    <InputRow
                        autoFocus
                        placeholder={I18n.get('Code')}
                        theme={theme}
                        key="code"
                        name="code"
                        onChange={this.handleInputChange}
                    />
                    <div className="amplify-action-row" style={theme.actionRow}>
                        <button style={theme.button} onClick={this.confirm}>
                            {I18n.get('Confirm')}
                        </button>
                        <button style={theme.button} onClick={this.resend}>
                            {I18n.get('Resend Code')}
                        </button>
                    </div>
                </div>
                <Footer theme={theme}>
                    <Link theme={theme} onClick={() => this.changeState('signIn')}>
                        {I18n.get('Back to Sign In')}
                    </Link>
                </Footer>
            </div>
        )
    }
}
