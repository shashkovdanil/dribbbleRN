// @flow
import React, { PureComponent } from 'react';
import { FlatList, Dimensions, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

import { Shot } from '../Components';
import fetchData from '../Utils/apiHelper';

const Container = styled.View`
  flex: 1;
  background-color: white;
`;

const Avatar = styled.Image`
  width: 90;
  height: 90;
  border-radius: 45;
`;

const AuthorInfoContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Name = styled.Text`
  font-size: 24;
  text-align: center;
`;

const Location = styled.Text`
  font-size: 20;
  text-align: center;
  color: darkgray;
`;

const Bio = styled.Text`
  font-size: 16;
  text-align: center;
  padding-top: 8;
  padding-right: 16;
  padding-left: 16;
`;

const LastShots = styled.Text`
  padding-top: 16;
  font-size: 16;
  text-align: center;
`;

const ShotListContainer = styled.View`
  width: ${props => props.width};
  height: ${props => props.width / 1.5};
  flex: 0.5;
`;

class Author extends PureComponent {
  state = {
    shots: [],
  };

  componentDidMount() {
    this.fetchShots();
  }

  fetchShots = () => {
    const params = this.props.navigation.state.params;
    const { authorShotsUrl } = params;
    setTimeout(() => {
      fetchData(authorShotsUrl).then(receivedShots =>
        this.setState(prevState => ({
          shots: [...prevState.shots, ...receivedShots],
        })),
      );
    }, 1500);
  };

  props: {
    navigation: {
      navigate: () => any,
      state: {
        params: {
          avatar: string,
          authorName: string,
          authorLocation: string,
          authorBio: string,
          authorShotsUrl: string,
        },
      },
    },
  };

  render() {
    const { navigate } = this.props.navigation;
    const { width } = Dimensions.get('window');
    const { shots } = this.state;
    const {
      avatar,
      authorName,
      authorLocation,
      authorBio,
      authorShotsUrl,
    } = this.props.navigation.state.params;
    return (
      <Container>
        <AuthorInfoContainer>
          <Avatar source={{ uri: avatar }} />
          <Name>
            {authorName}
          </Name>
          <Location>
            {authorLocation}
          </Location>
          <Bio>
            {authorBio}
          </Bio>
          <LastShots>Recent Shots ↓↓↓</LastShots>
        </AuthorInfoContainer>
        <ShotListContainer width={width}>
          <FlatList
            horizontal
            data={shots}
            renderItem={({ item }) =>
              (<TouchableOpacity
                onPress={() =>
                  navigate('ShotDetails', {
                    avatar,
                    createdAt: item.created_at,
                    title: item.title,
                    authorName,
                    shot: item.images.normal,
                    likesCount: item.likes_count,
                    commentsCount: item.comments_count,
                    viewsCount: item.views_count,
                    description: item.description,
                    commentsUrl: item.comments_url,
                    authorBio,
                    authorLocation,
                    authorShotsUrl,
                  })}
              >
                <Shot widthShot={width / 1.5} heightShot={width / 1.5} uri={item.images.normal} />
              </TouchableOpacity>)}
            keyExtractor={item => item.id}
          />
        </ShotListContainer>
      </Container>
    );
  }
}

export { Author };
