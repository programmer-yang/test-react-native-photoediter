import React, { Component } from "react";
import { Dimensions, View, TouchableOpacity, Text, Image } from "react-native";
import { AuroraIMUI } from "./components/aurora-imui";

const { width: screenWidth, height } = Dimensions.get("window");

const screenHeight = height - 90;

import audioicon from "../assets/images/audio.png";

import faceicon from "../assets/images/faceicon.png";
import plusicon from "../assets/images/plusicon.png";

class Index extends Component {
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
      <View style={{ flex: 1, widht: "100%" }}>
        <AuroraIMUI
          ref={this.refIMUI}
          style={{
            width: screenWidth,
            height: screenHeight - 80,
            marginTop: 33
          }}
          initialMessages={[
            { msgId: "0", msgType: "event", text: "Text message 1" },
            { msgId: "1", msgType: "text", text: "Text message 2" }
          ]}
          onInputTextChanged={textStr => console.log(textStr)}
          onSendText={this.localOnSendText}
          maxInputViewHeight={screenHeight - 80}
          inputViewStyle={{
            backgroundColor: "white",
            borderTopWidth: 1,
            borderTopColor: "rgba(233, 233, 233, .5)"
          }}
          textInputProps={{
            placeholder: "Input Text message",
            onSubmitEditing: ({ nativeEvent }) => console.log(nativeEvent.text),
            // multiline: true,
            style: {
              margin: 8,
              padding: 8,
              color: "red",
              borderWidth: 1,
              borderRadius: 4,
              borderColor: "rgba(233, 233, 233, .5)"
            }
          }}
          renderLeft={() => (
            <View
              style={{
                height: 30,
                width: 46,
                flexDirection: "row",
                paddingLeft: 8,
                paddingRight: 8,
                backgroundColor: "#fff"
              }}
            >
              <TouchableOpacity>
                <Image style={{ height: 30, width: 30 }} source={audioicon} />
              </TouchableOpacity>
            </View>
          )}
          renderRight={() => (
            <View
              style={{
                height: 30,
                width: 84,
                borderColor: "red",
                flexDirection: "row",
                paddingLeft: 8,
                paddingRight: 8
              }}
            >
              <TouchableOpacity style={{ marginRight: 8 }}>
                <Image style={{ height: 30, width: 30 }} source={faceicon} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image style={{ height: 30, width: 30 }} source={plusicon} />
              </TouchableOpacity>
            </View>
          )}
          renderBottom={() => (
            <View style={{ height: 80, borderWidth: 1, borderColor: "red" }} />
          )}
        />
      </View>
    );
  }
}

export default Index;
