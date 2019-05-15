import React, { Component } from 'react';
import config from "./config";
import Toast from 'react-native-root-toast';
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

export default class Authentication extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: 'tvestergaard@hotmail.com',
            password: '123456',
        }

        this.props.onAuthentication(
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVjZDNmZDdjZmFkZjVkMDc4NDhkYzJkZCIsImZpcnN0TmFtZSI6IlRob21hcyIsImxhc3ROYW1lIjoiVmVzdGVyZ2FhcmQiLCJlbWFpbCI6InR2ZXN0ZXJnYWFyZEBob3RtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJGhQcVoyUUJtbVpnVUg4VnBlUlRhMnVqRGprbjBTb2ZXQTh1My5zRS8yLmFaOWZUMHJFaUlhIiwiX192IjowfSwiaWF0IjoxNTU3OTM5NjE3fQ.95Pm7-cRCeMzG-z-aJeXb1gC3xNI8S7htUgeO4fodd4",
            {
                "__v": 0,
                "_id": "5cd3fd7cfadf5d07848dc2dd",
                "email": "tvestergaard@hotmail.com",
                "firstName": "Thomas",
                "lastName": "Vestergaard",
                "password": "$2b$10$hPqZ2QBmmZgUH8VpeRTa2ujDjkn0SofWA8u3.sE/2.aZ9fT0rEiIa",
            }
        )
    }

    sendAuthenticationRequest = async () => {
        let status = -1;
        return fetch(config.server.authentication, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(this.state)
        }).then(async (response, error) => {
            status = response.status;
            return response.json();
        }).then(body => Promise.resolve({
            status,
            token: body.token,
            user: body.user
        }));
    }

    onAuthenticationAttempt = async () => {
        const response = await this.sendAuthenticationRequest();
        if (response.status == 200) {
            this.props.onAuthentication(response.token, response.user);
            Toast.show("You were successfully authenticated.")
            return;
        }

        Toast.show("Authentication was unsucessful.")
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon} source={{ uri: 'https://png.icons8.com/message/ultraviolet/50/3498db' }} />
                    <TextInput style={styles.inputs}
                        defaultValue={this.state.email}
                        placeholder="Email"
                        keyboardType="email-address"
                        underlineColorAndroid='transparent'
                        onChangeText={(email) => this.setState({ email })} />
                </View>

                <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon} source={{ uri: 'https://png.icons8.com/key-2/ultraviolet/50/3498db' }} />
                    <TextInput style={styles.inputs}
                        defaultValue={this.state.password}
                        placeholder="Password"
                        secureTextEntry={true}
                        underlineColorAndroid='transparent'
                        onChangeText={(password) => this.setState({ password })} />
                </View>

                <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onAuthenticationAttempt()}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DCDCDC',
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        borderBottomWidth: 1,
        width: 250,
        height: 45,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputs: {
        height: 45,
        marginLeft: 16,
        borderBottomColor: '#FFFFFF',
        flex: 1,
    },
    inputIcon: {
        width: 30,
        height: 30,
        marginLeft: 15,
        justifyContent: 'center'
    },
    buttonContainer: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 250,
        borderRadius: 30,
    },
    loginButton: {
        backgroundColor: "#00b5ec",
    },
    loginText: {
        color: 'white',
    }
});