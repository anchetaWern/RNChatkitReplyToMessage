# RNChatkitReplyToMessage
A React Native Chat app which shows how to implement a "reply to message" feature.

Full tutorial is available at: [https://pusher.com/tutorials/reply-message-react-native-chat](https://pusher.com/tutorials/reply-message-react-native-chat)

## Prerequisites

-   React Native development environment
-   [Node.js](https://nodejs.org/en/)
-   [Yarn](https://yarnpkg.com/en/)
-   [Chatkit app instance](https://pusher.com/chatkit) - enable test token provider.
-   [ngrok account](https://ngrok.com/)

## Getting Started

1. Clone the repo:

```
git clone https://github.com/anchetaWern/RNChatkitReplyToMessage.git
cd RNChatkitReplyToMessage
```

2. Install the dependencies:

```
yarn
react-native eject
react-native link react-native-gesture-handler
react-native link react-native-config
react-native link react-native-vector-icons
```

3. Update `android/app/build.gradle` file to include React Native Config:

```
apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle" // 2nd line
```

4. Update the `.env` and `server/.env` file with your credentials:

```
// .env
CHATKIT_INSTANCE_LOCATOR_ID="YOUR CHATKIT INSTANCE LOCATOR ID"
CHATKIT_SECRET_KEY="YOUR CHATKIT SECRET KEY"
CHATKIT_TOKEN_PROVIDER_ENDPOINT="YOUR CHATKIT TOKEN PROVIDER ENDPOINT"
```

```
// server/.env
CHATKIT_INSTANCE_LOCATOR_ID="YOUR CHATKIT INSTANCE LOCATOR ID"
CHATKIT_SECRET_KEY="YOUR CHATKIT SECRET KEY"
```

5. Run the server:

```
node server/index.js
~/ngrok http 5000
```

6. Update `src/screens/Rooms.js` file with your ngrok HTTPS URL:

```
const CHAT_SERVER = "YOUR NGROK HTTPS URL";
```

7. Run the app:

```
react-native run-android
react-native run-ios
```

## Built With

-   [React Native](http://facebook.github.io/react-native/)
-   [Chatkit](https://pusher.com/chatkit)
