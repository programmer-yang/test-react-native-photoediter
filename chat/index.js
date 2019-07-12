import React, { Component } from "react";
import {
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  Image,
  // NativeModules,
  Keyboard
} from "react-native";
// import { AuroraIMUI } from "aurora-imui";
import { AuroraIMUI, Message, Event } from "./components/aurora-imui";

import MessageTextContent from "./components/aurora-imui/MessageTextContent";

// import LMChat from "rn-lm-chat";

import EmojiSelector from "react-native-emoji-selector";
// import KeyboardSpacer from "react-native-keyboard-spacer";

import audioicon from "../assets/images/audio.png";
import faceicon from "../assets/images/faceicon.png";
import keyboardicon from "../assets/images/keyboard.png";
import plusicon from "../assets/images/plusicon.png";
import photoicon from "../assets/images/photoicon.png";

const { width: screenWidth, height } = Dimensions.get("window");
const screenHeight = height - 90;

const DeviceBottomMargin = 30;

class Index extends Component {
  constructor(props) {
    super(props);
    this.refIMUI = React.createRef();
    this.refInputView = React.createRef();
    this.state = {
      keyboardHeight: 0, // 键盘高度
      moreHeight: 0, // emoji容器高度
      actionIconSmileOrKeyboard: true,
      actionIconMore: false // 更多
    };

    // console.log("c", chat);
    // chat.hx_initializeSDKWithOptions("ssss", "ssss", "ssss", msg => {});
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this.localKeyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this.localKeyboardDidHide
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  localKeyboardDidShow = e => {
    this.setState({ keyboardHeight: e.endCoordinates.height });
  };
  localKeyboardDidHide = e => {
    this.setState({ keyboardHeight: 0 });
  };

  localOnSendText = text => {
    // clickSendMessage={this.localSendMessage}
    //       clickSendPhoto={this.localSendPhoto}
    //       clickSendVoice={this.localSendVoice}
    const { clickSendMessage } = this.props;
    if (typeof clickSendMessage === "function") {
      clickSendMessage(text);
      this.refIMUI.current.appendMessages([
        {
          text,
          msgType: "text",
          msgId: `${Date.now()}`
        }
      ]);
    }
  };

  localOnSend = () => {
    console.log("onSubmitEditing ... ");
    this.refIMUI.current.sendText();
  };

  localChangeInputText = text => {
    console.log(text);
    this.refIMUI.current.changeInputText(text);
  };

  localOnPressIn = () => {
    const { clickSendVoiceBegin } = this.props;
    if (typeof clickSendVoiceBegin === "function") {
      clickSendVoiceBegin();
    }
    // chat.startRecordingVoiceCallback(msg => {});
  };
  localOnPressOut = () => {
    // chat.finishRecordingVoiceCallback(file => {
    //   console.log(file);
    // });
    const { clickSendVoiceEnd } = this.props;
    if (typeof clickSendVoiceEnd === "function") {
      clickSendVoiceEnd();
    }
  };

  localOnPressPhoto = () => {
    const { clickSendPhoto } = this.props;
    if (typeof clickSendPhoto === "function") {
      clickSendPhoto();
    }
  };

  localOnClickSmileOrKeyboard = () => {
    const { actionIconSmileOrKeyboard } = this.state;

    if (!actionIconSmileOrKeyboard) {
      this.refInputView.current.focus();
      this.setState({
        actionIconSmileOrKeyboard: !actionIconSmileOrKeyboard,
        moreHeight: 0,
        actionIconMore: false
      });
    } else {
      Keyboard.dismiss();
      this.setState({
        actionIconSmileOrKeyboard: !actionIconSmileOrKeyboard,
        moreHeight: 200,
        actionIconMore: false
      });
    }
  };

  localInputFocus = () => {
    this.setState({
      actionIconSmileOrKeyboard: true
    });
  };

  localOnClickMore = () => {
    Keyboard.dismiss();
    this.setState({
      // actionIconSmileOrKeyboard: false,
      actionIconMore: true,
      moreHeight: 150
    });
  };

  customRowRender = message => {
    // const message = { ...data.values };
    console.log("=====");
    console.log(message);
    const { msgType: type } = message;
    console.log(type);
    switch (type) {
      // case "event":
      //   return <Event {...message} />;
      // case "text":
      //   return (
      //     <Message
      //       // {...message}
      //       {...{
      //         ...message,
      //         messageContent: message => {
      //           return <MessageTextContent {...{ ...message, text: "123" }} />;
      //         }
      //       }}
      //       // {...{
      //       //   ...message,
      //       //   messageContent: message => {
      //       //     return <MessageTextContent {...message} />;
      //       //   }
      //       // }}
      //       // onMsgClick={this.props.onMsgClick}
      //       // onAvatarClick={this.props.onAvatarClick}
      //       // onStatusViewClick={this.props.onStatusViewClick}
      //       // onMsgContentClick={this.props.onMsgContentClick}
      //       // onMsgContentLongClick={this.props.onMsgContentLongClick}
      //       // avatarContent={this.props.avatarContent}
      //       // stateContainerStyles={this.props.stateContainerStyles}
      //       // avatarContainerStyles={this.props.avatarContainerStyles}
      //     />
      //   );
      default:
        return null;
    }
  };

  render() {
    const {
      keyboardHeight,
      actionIconSmileOrKeyboard,
      moreHeight,
      actionIconMore
    } = this.state;
    let imuiHeight = screenHeight;
    if (keyboardHeight) {
      imuiHeight = imuiHeight - keyboardHeight;
    } else {
      imuiHeight = imuiHeight - DeviceBottomMargin - moreHeight;
    }

    return (
      <View style={{ flex: 1, widht: "100%" }}>
        <AuroraIMUI
          ref={this.refIMUI}
          style={{
            width: screenWidth,
            height: imuiHeight,
            marginTop: 33
          }}
          initialMessages={[
            { msgId: "0", msgType: "event", text: "Text message 1" },
            { msgId: "1", msgType: "text", text: "Text message 2" }
          ]}
          // onInputTextChanged={this.localInputFocus}
          onSendText={this.localOnSendText}
          maxInputViewHeight={screenHeight}
          onInputFocus={this.localInputFocus}
          inputViewStyle={{
            backgroundColor: "white",
            borderTopWidth: 1,
            borderTopColor: "rgba(233, 233, 233, .5)"
          }}
          textInputProps={{
            placeholder: "Input Text message",
            onSubmitEditing: this.localOnSend,
            returnKeyType: "send",
            // multiline: true,
            ref: this.refInputView,
            style: {
              margin: 8,
              padding: 8,
              // color: "red",
              // borderWidth: 1,
              borderRadius: 4,
              borderColor: "rgba(233, 233, 233, .5)"
            }
          }}
          // renderRow={this.customRowRender}
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
              <TouchableOpacity
                onPressIn={this.localOnPressIn}
                onPressOut={this.localOnPressOut}
              >
                <Image style={{ height: 30, width: 30 }} source={audioicon} />
              </TouchableOpacity>
            </View>
          )}
          renderRight={() => (
            <View
              style={{
                height: 30,
                width: 84,
                // borderColor: "red",
                flexDirection: "row",
                paddingLeft: 8,
                paddingRight: 8
              }}
            >
              {actionIconSmileOrKeyboard ? (
                <TouchableOpacity
                  style={{ marginRight: 8 }}
                  onPress={this.localOnClickSmileOrKeyboard}
                >
                  <Image style={{ height: 30, width: 30 }} source={faceicon} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{ marginRight: 8 }}
                  onPress={this.localOnClickSmileOrKeyboard}
                >
                  <Image
                    style={{ height: 30, width: 30 }}
                    source={keyboardicon}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={this.localOnClickMore}>
                <Image style={{ height: 30, width: 30 }} source={plusicon} />
              </TouchableOpacity>
            </View>
          )}
          renderBottom={() => {
            if (actionIconMore) {
              return (
                <View
                  style={{
                    height: moreHeight,
                    overflow: "hidden",
                    // borderWidth: 1,
                    // borderColor: "red",
                    position: "absolute",
                    top: 52,
                    flexDirection: "row",
                    backgroundColor: "#fff",
                    width: "100%",
                    borderTopColor: "rgb(233, 233, 234)",
                    borderTopWidth: 1
                  }}
                >
                  <TouchableOpacity
                    style={{
                      width: 64,
                      margin: 24,
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                    onPress={this.localOnPressPhoto}
                  >
                    <View
                      style={{
                        width: 64,
                        height: 64,
                        backgroundColor: "rgb(244, 245, 245)",
                        borderRadius: 4,
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Image
                        style={{ width: 24, height: 24 }}
                        source={photoicon}
                      />
                    </View>
                    <Text
                      style={{
                        marginTop: 8,
                        fontSize: 12,
                        fontFamily: "PingFang SC"
                      }}
                    >
                      照片
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            } else if (actionIconSmileOrKeyboard) {
              return null;
            } else {
              return (
                <View
                  style={{
                    height: moreHeight,
                    overflow: "hidden",
                    // borderWidth: 1,
                    // borderColor: "red",
                    position: "absolute",
                    top: 52
                  }}
                >
                  <EmojiSelector
                    onEmojiSelected={this.localChangeInputText}
                    showSearchBar={false}
                  />
                </View>
              );
            }
          }}
        />
        {/* <KeyboardSpacer /> */}
      </View>
    );
  }
}

export default Index;
