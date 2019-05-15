import React, { Component } from 'react';
import ReactNative, { TextView, StyleSheet, View, Text, BackHandler } from "react-native";
import { gql } from "apollo-boost";
import { Query, ApolloConsumer } from 'react-apollo';
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

const NEARBY_USERS = gql`
{
    getNearbyUsers(radiusMeters: 5000) {
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
        mapOpen: false,
        mapNearby: []
    }

    render() {
        return (
            <View>
                {this.state.mapOpen ? this.createMap() :
                    <View padding={20} paddingTop={40} >
                        <Query query={NEARBY_USERS}>
                            {({ loading, error, data, refetch }) => {
                                if (loading)
                                    return <Text>Searching for nearby players.</Text>
                                if (error)
                                    return <Text>An error occured.</Text>

                                return data.getNearbyUsers.map(nearby =>
                                    <View marginBottom={30} key={nearby.user.identifier}>
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