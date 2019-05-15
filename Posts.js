import React, { Component } from 'react';
import ReactNative, { TextView } from "react-native";
import { gql } from "apollo-boost";
import { Query, ApolloConsumer } from 'react-apollo';
import { View, Text } from 'react-native';
import Markdown from 'react-native-markdown-renderer';
import { ScrollView } from 'react-native';

const POSTS = gql`
{
    getPosts {
        identifier
        title
        content
        created
        likedBy {
            identifier
        }
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
            <ScrollView style={{ padding: 20, paddingTop: 40 }}>
                <View marginBottom={40}>
                    <Query query={POSTS}>
                        {({ loading, error, data, refetch }) => {
                            if (loading)
                                return <Text>The posts are loading.</Text>
                            if (error)
                                return <Text>Could not load posts.</Text>

                            return data.getPosts.map(post => <View key={post.identifier}>
                                <Text style={{ fontSize: 20, marginBottom: 10 }}>{post.title}</Text>
                                <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{post.author.firstName} {post.author.lastName}</Text>
                                <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{post.created}</Text>
                                <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{post.likedBy.length} likes</Text>
                                <View marginBottom={40}>
                                    <Markdown>{post.content.replace('<br>', '')}</Markdown>
                                </View>
                            </View>);
                        }}
                    </Query>
                </View>
            </ScrollView>)
    }
}