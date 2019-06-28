import React, { Component } from "react";
import { Dimensions } from "react-native";
import { AuroraIMUI } from "aurora-imui";

const { width: screenWidth, height } = Dimensions.get("window");

const screenHeight = height - 90;

// import img from "./assets/images/card1.png";

class App extends Component {
  constructor(props) {
    super(props);
    this.refIMUI = React.createRef();
  }

  localOnSendText = text => {
    console.log(this.refIMUI);
    this.refIMUI.current.appendMessages([
      {
        text,
        msgType: "text",
        msgId: `${Date.now()}`
      }
    ]);
  };
  render() {
    return (
      <AuroraIMUI
        ref={this.refIMUI}
        style={{
          width: screenWidth,
          height: screenHeight,
          marginTop: 33
        }}
        initialMessages={[
          { msgId: "0", msgType: "event", text: "Text message 1" },
          { msgId: "1", msgType: "text", text: "Text message 2" }
        ]}
        onSendText={this.localOnSendText}
      />
    );
  }
}

export default App;
