import React, { Component } from "react";
import {
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  Image,
  // NativeModules,
  Keyboard,
  DeviceEventEmitter
} from "react-native";
import ImagePicker from "react-native-image-picker";
// import { AuroraIMUI } from "aurora-imui";
import { LmChat } from "rn-lm-chat";
import { AuroraIMUI, Message, Event } from "./components/aurora-imui";

import MessageTextContent from "./components/aurora-imui/MessageTextContent";
import Avatar from "./components/avatar";

// import LMChat from "rn-lm-chat";

import EmojiSelector from "react-native-emoji-selector";
// import KeyboardSpacer from "react-native-keyboard-spacer";

import audioicon from "../assets/images/audio.png";
import faceicon from "../assets/images/faceicon.png";
import keyboardicon from "../assets/images/keyboard.png";
import plusicon from "../assets/images/plusicon.png";
import photoicon from "../assets/images/photoicon.png";
import voicepng from "../assets/images/voice.png";

import masterAvator from "./components/aurora-imui/assert/avator2.png";

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
      actionIconMore: false, // 更多
      lastMessageId: undefined
    };

    // console.log("c", chat);
    // chat.hx_initializeSDKWithOptions("ssss", "ssss", "ssss", msg => {});

    console.log(LmChat);
    // 初始化登陆
    LmChat.initChatRN("yang", "kefuchannelimid_300108", msg => {
      console.log("登录成功 ", msg);
    });

    // 监听消息;
    DeviceEventEmitter.addListener("onReceiveMsg", msg => {
      console.log("监听到了消息: ", msg);
    });
  }

  componentDidMount() {
    // this.refIMUI.current.removeAllMessage();
    // LmChat.getHistory(null, historyMessages => {
    //   console.log("首次获取历史记录");
    //   // console.log(historyMessages);
    //   // this.setState({ historyMessages });

    //   this.refIMUI.current.insertMessagesToTop(
    //     historyMessages.map(this.trimMessageFormat)
    //   );
    // });

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
    DeviceEventEmitter.removeListener("onReceiveMsg");
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _onPullToRefresh = () => {
    // this.refIMUI.current.removeAllMessage();
    const { lastMessageId } = this.state;
    console.log(lastMessageId);
    LmChat.getHistory(lastMessageId || null, historyMessages => {
      console.log("获取历史记录");
      console.log(historyMessages);
      // this.setState({ historyMessages });
      this.setState({
        lastMessageId: historyMessages[0].msgId
      });

      this.refIMUI.current.insertMessagesToTop(
        historyMessages.map(this.trimMessageFormat)
      );
    });
  };

  trimMessageFormat = message => {
    const { currentUser } = this.props;
    switch (message.type) {
      case "txt": {
        return {
          ...message,
          msgType: "text",
          isOutgoing: message.from === currentUser,
          text: message.content
        };
      }
      case "img": {
        return {
          ...message,
          msgType: "img",
          isOutgoing: message.from === currentUser,
          text: `file://${message.localUrl}.jpg`
        };
      }
      case "voice": {
        return {
          ...message,
          msgType: "voice",
          isOutgoing: message.from === currentUser,
          text: message.localUrl
        };
      }
      default: {
        return false;
      }
    }
  };

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
    // const { clickSendMessage } = this.props;
    // if (typeof clickSendMessage === "function") {
    //   clickSendMessage(text);
    //   this.refIMUI.current.appendMessages([
    //     {
    //       text,
    //       msgType: "text",
    //       msgId: `${Date.now()}`
    //     }
    //   ]);
    // }
    LmChat.sendText(text, msg => {
      this.refIMUI.current.appendMessages([
        {
          text,
          msgType: "text",
          msgId: `${Date.now()}`,
          isOutgoing: true
        }
      ]);
    });
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
    LmChat.voiceRecordingBegin(msg => {
      console.log(msg);
    });
    // chat.startRecordingVoiceCallback(msg => {});
  };
  localOnPressOut = () => {
    // chat.finishRecordingVoiceCallback(file => {
    //   console.log(file);
    // });
    // LmChat.voiceRecordingEnd((isError, path) => {
    //   console.log(path);
    // });
    // 录音结束
    LmChat.voiceRecordingEnd((voicePath, times) => {
      console.log(voicePath, times);
      // 发送语音
      LmChat.sendVoice(voicePath, times);

      this.refIMUI.current.appendMessages([
        {
          text: voicePath,
          msgType: "voice",
          msgId: `${Date.now()}`,
          isOutgoing: true
        }
      ]);
    });
  };

  // 发送图片
  localOnPressPhoto = () => {
    // const { clickSendPhoto } = this.props;
    // if (typeof clickSendPhoto === "function") {
    //   clickSendPhoto();
    // }

    const options = {
      title: "请选择",
      cancelButtonTitle: "取消",
      takePhotoButtonTitle: "拍照",
      chooseFromLibraryButtonTitle: "从相册中选择",
      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        // console.log("User cancelled image picker");
      } else if (response.error) {
        // console.log("ImagePicker Error: ", response.error);
      } else {
        const { uri } = response;

        LmChat.sendPicture(uri, localUrl => {
          this.refIMUI.current.appendMessages([
            {
              text: localUrl,
              msgType: "img",
              msgId: `${Date.now()}`,
              isOutgoing: true
            }
          ]);
        });
      }
    });
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

  localPlayVoice = path => {
    LmChat.playVoice(path);
  };

  customRowRender = message => {
    const { avatarPath } = this.props;
    // const message = { ...data.values };
    const { msgType: type } = message;
    switch (type) {
      case "img":
        return (
          <Message
            {...message}
            {...{
              ...message,
              messageContent: message => {
                return (
                  <Image
                    style={{ width: 120, height: 120 }}
                    source={{
                      uri: message.remoteUrl ? message.remoteUrl : message.text
                    }}
                  />
                );
              }
            }}
            // onMsgClick={this.props.onMsgClick}
            // onAvatarClick={this.props.onAvatarClick}
            // onStatusViewClick={this.props.onStatusViewClick}
            // onMsgContentClick={this.props.onMsgContentClick}
            // onMsgContentLongClick={this.props.onMsgContentLongClick}
            // avatarContent={this.props.avatarContent}
            avatarContent={avatarProps =>
              this.renderAvatar(avatarProps.isOutgoing)
            }
            // stateContainerStyles={this.props.stateContainerStyles}
            // avatarContainerStyles={this.props.avatarContainerStyles}
          />
        );
      case "voice":
        return (
          <Message
            {...message}
            {...{
              ...message,
              messageContent: message => {
                return (
                  <TouchableOpacity
                    style={{
                      width: 60,
                      height: 40,
                      backgroundColor: "rgb(60, 121, 242)",
                      justifyContent: "center",
                      // alignItems: message.isOutgoing
                      //   ? "flex-end"
                      //   : "flex-start",
                      paddingLeft: 10,
                      transform: [
                        { rotate: message.isOutgoing ? "180deg" : "0deg" }
                      ]
                    }}
                    onPress={this.localPlayVoice.bind(this, message.text)}
                  >
                    <Image
                      style={{
                        width: 20,
                        height: 20
                      }}
                      source={voicepng}
                    />
                  </TouchableOpacity>
                );
              }
            }}
            // onMsgClick={this.props.onMsgClick}
            // onAvatarClick={this.props.onAvatarClick}
            // onStatusViewClick={this.props.onStatusViewClick}
            // onMsgContentClick={this.props.onMsgContentClick}
            // onMsgContentLongClick={this.props.onMsgContentLongClick}
            // avatarContent={this.props.avatarContent}
            avatarContent={avatarProps =>
              this.renderAvatar(avatarProps.isOutgoing)
            }
            // stateContainerStyles={this.props.stateContainerStyles}
            // avatarContainerStyles={this.props.avatarContainerStyles}
          />
        );
      default:
        return null;
    }
  };

  renderAvatar = (type = true) => {
    const { avatarPath } = this.props;
    return type ? <Avatar path={avatarPath} /> : <Avatar path={masterAvator} />;
  };

  render() {
    const {
      keyboardHeight,
      actionIconSmileOrKeyboard,
      moreHeight,
      actionIconMore,
      historyMessages
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
          initialMessages={
            [
              // {
              //   text:
              //     "...",
              //   msgType: "img",
              //   msgId: `${Date.now()}`
              //   // isOutgoing: true
              // }
            ]
          }
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
          onPullToRefresh={this._onPullToRefresh}
          avatarContent={avatarProps =>
            this.renderAvatar(avatarProps.isOutgoing)
          }
          renderRow={this.customRowRender}
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
