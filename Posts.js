import React, { Component } from 'react';
import ReactNative, { TextView } from "react-native";
import { gql } from "apollo-boost";
import { Query, ApolloConsumer } from 'react-apollo';
import { View, Text } from 'react-native';
import Markdown from 'react-native-markdown-renderer';
import { ScrollView, BackHandler } from 'react-native';
import Gallery from 'react-native-image-gallery';

const POSTS = gql`
{
    getPosts {
        identifier
        title
        content
        created
        likedByCount
        imagesCount
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

const GET_IMAGES = gql`
query getPostImages($post: ID!) {
    getPostImages(post: $post)
}
`;

export default class Posts extends Component {

    state = {
        posts: [],
        galleryOpen: false,
        galleryImages: []
    }

    render() {

        return (
            <ApolloConsumer>{client => {
                if (this.state.galleryOpen)
                    return (<Gallery
                        style={{ flex: 1, backgroundColor: 'black' }}
                        images={this.state.galleryImages.map(image => ({
                            source: { uri: image }
                        }))}
                    />)

                return <ScrollView style={{ padding: 20, paddingTop: 40 }}>
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
                                    <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{post.likedByCount} likes</Text>
                                    {post.imagesCount && <Text style={{ color: '#728bd4' }} onPress={() => this.viewImages(client, post.identifier)}>View {post.imagesCount} image(s)</Text>}
                                    <View marginBottom={40}>
                                        <Markdown>{post.content.replace('<br>', '')}</Markdown>
                                    </View>
                                </View>);
                            }}
                        </Query>
                    </View>
                </ScrollView>
            }}
            </ApolloConsumer>)
    }

    viewImages = async (client, postId) => {
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress)  
        const {data} = await client.query({query: GET_IMAGES, variables: {post: postId}});
        this.setState({ galleryOpen: true, galleryImages: data.getPostImages })
    }

    onBackButtonPress = () => {
        if (this.state.galleryOpen) {
            this.setState({ galleryOpen: false, galleryImages: [] })
            return true;
        } else {
            return false;
        }
    };
}