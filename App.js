import React, { Component } from 'react';
import config from "./config";
import Authentication from "./Authentication";
import Navigation from "./Navigation";
import ApolloClient from "apollo-boost";
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

function createApolloClient(token){
      return new ApolloClient({
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

export default class App extends React.Component {

    constructor(props) {
        super(props);

        const dev = {
            "authenticationToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVjZDNmZDdjZmFkZjVkMDc4NDhkYzJkZCIsImZpcnN0TmFtZSI6IlRob21hcyIsImxhc3ROYW1lIjoiVmVzdGVyZ2FhcmQiLCJlbWFpbCI6InR2ZXN0ZXJnYWFyZEBob3RtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJGhQcVoyUUJtbVpnVUg4VnBlUlRhMnVqRGprbjBTb2ZXQTh1My5zRS8yLmFaOWZUMHJFaUlhIiwiX192IjowfSwiaWF0IjoxNTU3OTM5NjE3fQ.95Pm7-cRCeMzG-z-aJeXb1gC3xNI8S7htUgeO4fodd4",
            "authenticationUser": {
              "__v": 0,
              "_id": "5cd3fd7cfadf5d07848dc2dd",
              "email": "tvestergaard@hotmail.com",
              "firstName": "Thomas",
              "lastName": "Vestergaard",
              "password": "$2b$10$hPqZ2QBmmZgUH8VpeRTa2ujDjkn0SofWA8u3.sE/2.aZ9fT0rEiIa",
            },
          }

        this.state = dev;
    }

    onAuthentication = (authenticationToken, authenticationUser) => {
        this.setState({ authenticationToken, authenticationUser });
    }

    render() {
        return (
            <ApolloProvider client={createApolloClient(this.state.authenticationToken)}>
                {this.getContents()}
            </ApolloProvider>
        )
    }

    getContents() {

        const authentication = {
            token: this.state.authenticationToken,
            user: this.state.authenticationUser
        }

        if (this.state.authenticationToken)
            return <Navigation screenProps={{authentication}}/>
        else
            return <Authentication onAuthentication={this.onAuthentication} />
    }
}