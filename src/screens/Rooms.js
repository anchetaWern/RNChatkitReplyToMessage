import React, { Component } from 'react';
import { View, Text, FlatList, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

const CHAT_SERVER = "YOUR NGROK HTTPS URL";

class Rooms extends Component {
  static navigationOptions = {
    title: "Rooms"
  };


  state = {
    rooms: [],
    rooms_loaded: false
  };


  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.user_id = navigation.getParam("id");
  }


  async componentDidMount() {
    try {
      const response = await axios.post(`${CHAT_SERVER}/rooms`, { user_id: this.user_id });
      const { rooms } = response.data;
      this.setState({
        rooms,
        rooms_loaded: true
      });
    } catch (get_rooms_err) {
      console.log("error getting rooms: ", get_rooms_err);
    }
  }


  render() {
    const { rooms, rooms_loaded } = this.state;
    return (
      <View style={styles.container}>
        {
          !rooms_loaded &&
          <ActivityIndicator size="large" color="#0000ff" />
        }

        {
          rooms &&
          <FlatList
            keyExtractor={(item) => item.id.toString()}
            data={rooms}
            renderItem={this.renderRoom}
          />
        }
      </View>
    );
  }
  //

  renderRoom = ({ item }) => {
    return (
      <View style={styles.list_item}>
        <Text style={styles.list_item_text}>{item.name}</Text>
        {
          item.joined &&
          <Button title="Enter" color="#0064e1" onPress={() => {
            this.enterChat(item);
          }} />
        }
        {
          !item.joined &&
          <Button title="Join" color="#484848" onPress={() => {
            this.joinRoom(item);
          }} />
        }
      </View>
    );
  }
  //

  goToChatScreen = async (room) => {
    this.props.navigation.navigate("Chat", {
      user_id: this.user_id,
      room_id: room.id,
      room_name: room.name
    });
  }
  //

  enterChat = async (room) => {
    this.goToChatScreen(room);
  }


  joinRoom = async (room) => {
    try {
      await axios.post(`${CHAT_SERVER}/user/join`, { room_id: room.id, user_id: this.user_id });
      Alert.alert("Joined Room", `You are now a member of [${room.name}]`);
      this.goToChatScreen(room);
    } catch (join_room_err) {
      console.log('error: ', join_room_err);
    }
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  list_item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  list_item_text: {
    marginLeft: 10,
    fontSize: 20,
  }
});

export default Rooms;