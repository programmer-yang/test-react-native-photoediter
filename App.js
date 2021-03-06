import React, { Component } from "react";
import {
  Dimensions,
  View,
  TouchableOpacity,
  NativeModules,
  Text
} from "react-native";
import { WebIm } from "rn-lm-chat";
import ImagePicker from "react-native-image-picker";
import Message from "./chat";

import avator1 from "./assets/images/avator1.png";

const ClientModule = NativeModules.RNClientModule;

// const { width: screenWidth, height } = Dimensions.get("window");
// const screenHeight = height - 90;

// import img from "./assets/images/card1.png";

class App extends Component {
  constructor(props) {
    super(props);

    // this.refMessage = React.createRef();

    // console.log(ClientModule);
    // WebIm.getHistory(null, msgs => {
    //   console.log(msgs);
    // });

    // 初始化
    // ClientModule.initializeSDKWithOptions("", "", "", msg => {});
    // 初始化登陆
    // ClientModule.initChatRN("yang", "123456", msg => {});
    // 初始化登陆
    ClientModule.initChatRN("yang", "kefuchannelimid_300108", msg => {
      console.log(msg);

      // ClientModule.getHistory("38c762b8ee6948cab80e0c2663b9f40c", msg => {
      //   console.log(msg);
      // });
    });
  }

  localClickSendMessage = message => {
    console.log(message);
    // 发送消息
    ClientModule.sendText(message, msg => {
      console.log(msg);
    });
  };
  localClickSendPhoto = () => {
    // const refIMUI = this.refMessage.current.refIMUI;

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

    console.log("=====|====");
    console.log(options);
    console.log("=====|====");

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        // console.log("User cancelled image picker");
      } else if (response.error) {
        // console.log("ImagePicker Error: ", response.error);
      } else {
        const { fileName: name, type, uri } = response;

        console.log("======");
        console.log(uri);
        console.log("======");

        ClientModule.sendPicture(uri, localUrl => {
          console.log("local img url:", localUrl);

          // refIMUI.current.appendMessages({
          //   localUrl,
          //   msgType: "img",
          //   msgId: `${Date.now()}`
          // });
        });
      }
    });
  };
  localClickSendVoiceBegin = () => {
    ClientModule.voiceRecordingBegin(msg => {
      console.log(msg);
    });
    // console.log("click Voice Begin");
  };
  localClickSendVoiceEnd = file => {
    ClientModule.voiceRecordingEnd((isError, path) => {
      console.log(path);
    });
    // console.log("click Voice End");
  };
  render() {
    return (
      <View style={{ width: "100%", flex: 1 }}>
        <Message
          avatarPath={avator1}
          currentUser="yang"
          // ref={this.refMessage}
          // clickSendMessage={this.localClickSendMessage}
          // clickSendPhoto={this.localClickSendPhoto}
          // clickSendVoiceBegin={this.localClickSendVoiceBegin}
          // clickSendVoiceEnd={this.localClickSendVoiceEnd}
        />
      </View>
    );
  }
}

export default App;
