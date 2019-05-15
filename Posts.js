import React, { Component } from 'react';
import ReactNative, { TextView } from "react-native";
import { gql } from "apollo-boost";
import { Query, ApolloConsumer } from 'react-apollo';
import { View, Text } from 'react-native';

const POSTS = gql`
{
    getPosts {
        identifier
        title
        content
        created
        position {
          longitude
          latitude
        }
        author {
          identifier
          firstName
          lastName
        }
    }
}
`;

export default class Posts extends Component {

    state = {
        posts: []
    }

    render() {
        return (
            <View style={{ padding: 20, paddingTop: 40 }}>
                <Query query={POSTS}>
                    {({ loading, error, data, refetch }) => {
                        if (loading)
                            return <Text>The posts are loading.</Text>
                        if (error)
                            return <Text>Could not load posts.</Text>

                        return data.getPosts.map(post => <View key={post.identifier}>
                            <Text>{post.title}</Text>
                        </View>);
                    }}
                </Query>
            </View>)
    }
}