import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ReplyToFooter = ({ reply_to, reply_to_msg, closeFooter }) => {
  return (
    <View style={styles.reply_to_footer}>
      <View style={styles.reply_to_border}></View>
      <View style={styles.reply_to_container}>
          <Text style={styles.reply_to_text}>Reply to {reply_to}:</Text>
          <Text style={styles.reply_to_msg_text}>{reply_to_msg}</Text>
      </View>
      <View style={styles.close_button_container}>
        <TouchableOpacity onPress={closeFooter}>
          <Icon name="close" size={13} color="#4e4e4e" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
//

const styles = StyleSheet.create({
  reply_to_footer: {
    height: 50,
    flexDirection: 'row'
  },
  reply_to_border: {
    height: 50,
    width: 5,
    backgroundColor: '#0078ff'
  },
  reply_to_container: {
    flexDirection: 'column'
  },
  reply_to_text: {
    color: '#0078ff',
    paddingLeft: 10,
    paddingTop: 5
  },
  reply_to_msg_text: {
    color: 'gray',
    paddingLeft: 10,
    paddingTop: 5
  },
  close_button_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'flex-end',
    paddingRight: 10
  }
});

export default ReplyToFooter;