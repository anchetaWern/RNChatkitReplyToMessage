import React, { Component } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { GiftedChat, Message } from 'react-native-gifted-chat';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import Config from 'react-native-config';

const CHATKIT_INSTANCE_LOCATOR_ID = Config.CHATKIT_INSTANCE_LOCATOR_ID;
const CHATKIT_SECRET_KEY = Config.CHATKIT_SECRET_KEY;
const CHATKIT_TOKEN_PROVIDER_ENDPOINT = Config.CHATKIT_TOKEN_PROVIDER_ENDPOINT;

import ReplyToFooter from '../components/ReplyToFooter';
import ChatBubbleWithReply from '../components/ChatBubbleWithReply';

class Chat extends Component {

  state = {
    messages: [],
    show_load_earlier: false,
    show_reply_to_footer: false,
    reply_to: null,
    reply_to_msg: null
  };


  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      headerTitle: params.room_name
    };
  };
  //

  constructor(props) {
    super(props);
    const { navigation } = this.props;

    this.user_id = navigation.getParam("user_id").toString();
    this.room_id = navigation.getParam("room_id");
  }


  componentWillUnMount() {
    this.currentUser.disconnect();
  }


  async componentDidMount() {

    try {
      const chatManager = new ChatManager({
        instanceLocator: CHATKIT_INSTANCE_LOCATOR_ID,
        userId: this.user_id,
        tokenProvider: new TokenProvider({ url: CHATKIT_TOKEN_PROVIDER_ENDPOINT })
      });

      let currentUser = await chatManager.connect();
      this.currentUser = currentUser;

      await this.currentUser.subscribeToRoomMultipart({
        roomId: this.room_id,
        hooks: {
          onMessage: this.onMessage
        },
        messageLimit: 30
      });

    } catch (chat_mgr_err) {
      console.log("error with chat manager: ", chat_mgr_err);
    }
  }


  onMessage = (data) => {
    const { message } = this.getMessage(data);

    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, message)
    }));

    if (this.state.messages.length > 1) {
      this.setState({
        show_load_earlier: true
      });
    }
  }


  getMessage = ({ id, sender, parts, createdAt }) => {
    const text_parts = parts.filter(part => part.partType === 'inline');
    let msg_data = {
      _id: id,
      text: text_parts[0].payload.content,
      createdAt: new Date(createdAt),
      user: {
        _id: sender.id.toString(),
        name: sender.name,
        avatar: sender.avatarURL
      }
    };

    if (text_parts.length > 1) {
      const replying_to = text_parts[1].payload.content;
      const replying_to_user = replying_to.match(/@[a-zA-Z0-9]+/g);
      const reply_to = replying_to_user[0].substr(1);
      const reply_to_msg = replying_to.replace(reply_to, '').substr(1);

      Object.assign(msg_data, {
        reply_to,
        reply_to_msg
      });
    }

    return {
      message: msg_data
    };
  }


  render() {
    const { messages, show_load_earlier, is_loading } = this.state;
    return (
      <View style={styles.container}>
        {
          is_loading &&
          <ActivityIndicator size="small" color="#0000ff" />
        }
        <GiftedChat
          messages={messages}
          onSend={messages => this.onSend(messages)}
          showUserAvatar={true}
          user={{
            _id: this.user_id
          }}
          loadEarlier={show_load_earlier}
          onLoadEarlier={this.loadEarlierMessages}

          onLongPress={this.onLongPress}
          renderChatFooter={this.renderChatFooter}

          renderMessage={this.renderMessage}
        />
      </View>
    );
  }
  //

  renderMessage = (msg) => {
    const { reply_to, reply_to_msg } = msg.currentMessage;
    const renderBubble = (reply_to && reply_to_msg) ? this.renderPreview : null;

    let modified_msg = {
      ...msg,
      renderBubble
    };

    return <Message {...modified_msg} />
  }
  //

  renderPreview = (bubbleProps) => {
    return (
      <ChatBubbleWithReply {...bubbleProps} />
    );
  }


  onLongPress = (context, message) => {
    this.setState({
      show_reply_to_footer: true,
      reply_to: message.user.name,
      reply_to_msg: message.text
    });
  }


  renderChatFooter = () => {
    const { show_reply_to_footer, reply_to, reply_to_msg } = this.state;
    if (show_reply_to_footer) {
      return (
        <ReplyToFooter
          reply_to={reply_to}
          reply_to_msg={reply_to_msg}
          closeFooter={this.closeReplyToFooter} />
      );
    }
    return null;
  }


  closeReplyToFooter = () => {
    this.setState({
      show_reply_to_footer: false,
      reply_to: null,
      reply_to_msg: null
    });
  }


  loadEarlierMessages = async () => {
    this.setState({
      is_loading: true
    });

    const earliest_message_id = Math.min(
      ...this.state.messages.map(m => parseInt(m._id))
    );

    try {
      let messages = await this.currentUser.fetchMultipartMessages({
        roomId: this.room_id,
        initialId: earliest_message_id,
        direction: "older",
        limit: 10
      });

      if (!messages.length) {
        this.setState({
          show_load_earlier: false
        });
      }

      let earlier_messages = [];
      messages.forEach((msg) => {
        let { message } = this.getMessage(msg);
        earlier_messages.push(message);
      });

      await this.setState(previousState => ({
        messages: previousState.messages.concat(earlier_messages.reverse())
      }));
    } catch (err) {
      console.log("error occured while trying to load older messages", err);
    }

    await this.setState({
      is_loading: false
    });
  }
  //

  onSend = async ([message]) => {
    const { reply_to, reply_to_msg } = this.state;
    try {
      const message_parts = [
        { type: "text/plain", content: message.text }
      ];

      if (reply_to && reply_to_msg) {
        message_parts.push({
          type: "text/plain",
          content: `@${reply_to} ${reply_to_msg}`
        });
      }

      await this.currentUser.sendMultipartMessage({
        roomId: this.room_id,
        parts: message_parts
      });

    } catch (send_msg_err) {
      console.log("error sending message: ", send_msg_err);
    }

    this.setState({
      show_reply_to_footer: false,
      reply_to: null,
      reply_to_msg: null
    });

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Chat;