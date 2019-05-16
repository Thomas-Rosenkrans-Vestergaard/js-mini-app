import React, { Component } from 'react';
import ReactNative, { TextView, StyleSheet, View, Text, BackHandler, TextInput, Button } from "react-native";
import { gql } from "apollo-boost";
import { Query, ApolloConsumer } from 'react-apollo';
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

const NEARBY_USERS = gql`
query getNearbyUsers($radiusMeters: Int!) {
    getNearbyUsers(radiusMeters: $radiusMeters) {
        user {
            identifier
            firstName
            lastName
        }
        latitude
        longitude
        timestamp
      }
}
`;

export default class Nearby extends Component {

    state = {
        radius: "1000",
        mapOpen: false,
        mapNearby: []
    }

    render() {
        return (
            <View>
                {this.state.mapOpen ? this.createMap() :
                    <View padding={20} paddingTop={40} >
                        <View marginBottom={20}>
                            <TextInput 
                            style={{ backgroundColor: '#ddd' }} 
                            keyboardType='numeric' 
                            padding={10} 
                            marginBottom={20} 
                            value={this.state.radius}
                            onChange={this.onRadiusChange} />
                        </View>
                        <Query query={NEARBY_USERS} variables={{ radiusMeters: parseInt(this.state.radius) }}>
                            {({ loading, error, data, refetch }) => {
                                if (loading)
                                    return <Text>Searching for nearby players.</Text>
                                if (error)
                                    return <Text>An error occured.</Text>

                                if (data.getNearbyUsers.length < 1)
                                    return <Text>There are no nearby users.</Text>

                                return data.getNearbyUsers.map(nearby =>
                                    <View marginBottom={40} key={nearby.user.identifier}>
                                        <Text>{nearby.user.firstName} {nearby.user.lastName}</Text>
                                        <Text>Longitude: {nearby.longitude}</Text>
                                        <Text>Latitude: {nearby.latitude}</Text>
                                        <Text style={{ color: '#728bd4' }} onPress={() => this.viewSingleUserOnMap(nearby)}>View on map</Text>
                                    </View>);
                            }}
                        </Query>
                    </View >
                }
            </View>)
    }

    onRadiusChange = e => {
        this.setState({ radius: e.nativeEvent.text });
    }

    viewSingleUserOnMap = (nearby) => {
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress)
        this.setState(prevState => ({
            mapOpen: true,
            mapNearby: [...prevState.mapNearby, nearby]
        }));
    }

    onBackButtonPress = () => {
        if (this.state.mapOpen) {
            this.setState({ mapOpen: false, mapNearby: [] })
            return true;
        } else {
            return false;
        }
    };

    createMap = () => {
        return <MapView style={styles.map} provider={PROVIDER_GOOGLE} >
            {this.state.mapNearby.map(nearby =>
                <MapView.Marker
                    key={nearby.user.identifier}
                    id={nearby.user.identifier}
                    coordinate={nearby}
                />
                /*    <Text>{nearby.user.firstName + " " + nearby.user.lastName}</Text>
            </MapView.Marker>*/)}
        </MapView>
    }
}

const styles = StyleSheet.create({
    map: {
        height: 800,
        width: 400
    },
});