import React, { Component } from 'react';
import config from "./config";
import Authentication from "./Authentication";
import Navigation from "./Navigation";
import ApolloClient, { gql } from "apollo-boost";
import { ApolloProvider } from "react-apollo";

import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    TouchableHighlight,
    Image,
    Alert
} from 'react-native';

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = { authenticationToken: null, authenticationUser: null };
    }

    onAuthentication = (authenticationToken, authenticationUser) => {
        this.setState({ authenticationToken, authenticationUser });
        this.sendOwnPositionToServer();
    }

    render() {
        return (
            <ApolloProvider client={this.createApolloClient(this.state.authenticationToken)}>
                {this.getContents()}
            </ApolloProvider>
        )
    }

    createApolloClient = (token) => {
        return this.client = new ApolloClient({
            uri: config.server.graphql,
            request: async operation => {
                operation.setContext({
                    headers: {
                        authorization: token ? `Bearer ${token}` : "",
                    }
                });
            },
        });
    }

    getContents() {

        const authentication = {
            token: this.state.authenticationToken,
            user: this.state.authenticationUser
        }

        if (this.state.authenticationToken)
            return <Navigation screenProps={{ authentication }} />
        else
            return <Authentication onAuthentication={this.onAuthentication} />
    }

    sendOwnPositionToServer = () => {
        const UPDATE_OWN_POSITION = gql`
        mutation updateOwnPosition($longitude: Float!, $latitude: Float!) {
            updateOwnPosition(longitude: $longitude, latitude: $latitude) {
                longitude
                latitude
                user {
                    identifier
                }
            }
        }
        `;

        const sendPosition = () => {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.client.mutate({
                        mutation: UPDATE_OWN_POSITION,
                        variables: {
                            longitude: position.coords.longitude,
                            latitude: position.coords.latitude
                        }
                    })
                },
                console.error
            )

        }

        sendPosition()
        setInterval(sendPosition, 10 * 1000);
    }
}