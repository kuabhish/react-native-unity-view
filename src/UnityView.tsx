import * as React from 'react'
import { NativeModules, requireNativeComponent, View, ViewProps, ViewPropTypes } from 'react-native'
import * as PropTypes from 'prop-types'
import MessageHandler from './MessageHandler'
import { UnityModule, UnityViewMessage } from './UnityModule'
import { Component, useEffect, useState } from 'react'

const { UIManager } = NativeModules

export interface UnityViewProps extends ViewProps {
    /**
     * Receive string message from unity.
     */
    onMessage?: (message: string) => void;
    /**
     * Receive unity message from unity.
     */
    onUnityMessage?: (handler: MessageHandler) => void;
    /**
     * Receives the gameIndex, if it can help in any way
     */
    // gameIndex: number;

    children?: React.ReactNode
}

let NativeUnityView

class UnityView extends Component<UnityViewProps> {

    state = {
        handle: null
    }

    componentDidMount(): void {
        const { onUnityMessage, onMessage } = this.props
        this.setState({
            handle: UnityModule.addMessageListener(message => {
                if (onUnityMessage && message instanceof MessageHandler) {
                    onUnityMessage(message)
                }
                if (onMessage && typeof message === 'string') {
                    onMessage(message)
                }
            })
        })
    }

    componentWillUnmount(): void {
        UnityModule.removeMessageListener(this.state.handle)
    }

    render() {
        const { props } = this
        return (
            <View {...props}>
            <NativeUnityView
                style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                onUnityMessage={props.onUnityMessage}
                onMessage={props.onMessage}
                // gameIndex={props.gameIndex}
            >
            </NativeUnityView>
            {props.children}
        </View>
        )
    }
}

NativeUnityView = requireNativeComponent('RNUnityView', UnityView)
export default UnityView;
