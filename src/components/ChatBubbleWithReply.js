import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MessageText, MessageImage, Time } from 'react-native-gifted-chat';

const ChatBubbleWithReply = (props) => {
  const { position, children, currentMessage } = props;
  const reply_header = (position == 'right') ? `you replied to ${currentMessage.reply_to}` : `${currentMessage.user.name} replied to ${currentMessage.reply_to}`;
  const reply_to_color = (position == 'right') ? '#d4d4d4' : '#a0a0a0';
  const reply_to_msg_color = (position == 'right') ? '#eee' : '#616161';

  return (
    <View style={styles[`${position}_container`]}>
      <View style={styles[`${position}_wrapper`]}>
        <View style={styles.reply_to_container}>
          <Text style={[styles.reply_to, { color: reply_to_color }]}>{reply_header}:</Text>
          <View style={styles.reply_to_msg_container}>
            <Text style={[styles.reply_to_msg, { color: reply_to_msg_color }]}>"{currentMessage.reply_to_msg}"</Text>
          </View>
        </View>
        <MessageText {...props} />
        {
          currentMessage.image &&
          <MessageImage {...props} />
        }
        {children}
        <Time {...props} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  left_container: {
    flex: 1,
    alignItems: 'flex-start',
  },
  left_wrapper: {
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    marginRight: 60,
    minHeight: 20,
    justifyContent: 'flex-end',
  },
  right_container: {
    flex: 1,
    alignItems: 'flex-end',
  },
  right_wrapper: {
    borderRadius: 15,
    backgroundColor: '#0084ff',
    marginLeft: 60,
    minHeight: 20,
    justifyContent: 'flex-end',
  },
  reply_to_container: {
    marginRight: 5,
    marginLeft: 5,
    marginTop: 5
  },
  reply_to: {
    fontSize: 11
  },
  reply_to_msg_container: {
    marginRight: 10,
    marginLeft: 10,
    marginTop: 3
  },
  reply_to_msg: {
    fontStyle: 'italic',
    fontSize: 14
  }
});

export default ChatBubbleWithReply;