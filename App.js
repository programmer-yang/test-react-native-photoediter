import React, { Component } from "react";
import { Dimensions, View, TouchableOpacity } from "react-native";
import Message from "./chat";

// const { width: screenWidth, height } = Dimensions.get("window");
// const screenHeight = height - 90;

// import img from "./assets/images/card1.png";

class App extends Component {
  localClickSendMessage = message => {
    console.log(message);
  };
  localClickSendPhoto = () => {
    console.log("clickPhoto");
  };
  localClickSendVoiceBegin = () => {
    console.log("click Voice Begin");
  };
  localClickSendVoiceEnd = file => {
    console.log("click Voice End");
  };
  render() {
    return (
      <View style={{ width: "100%", flex: 1 }}>
        <Message
          clickSendMessage={this.localClickSendMessage}
          clickSendPhoto={this.localClickSendPhoto}
          clickSendVoiceBegin={this.localClickSendVoiceBegin}
          clickSendVoiceEnd={this.localClickSendVoiceEnd}
        />
      </View>
    );
  }
}

export default App;
