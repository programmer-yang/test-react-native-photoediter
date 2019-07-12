import React, { Component } from "react";
import { View, Image, Modal, Button, Text } from "react-native";

import ImagePicker from "react-native-image-picker";

import PhotoEditer from "rn-lm-photoediter";

class Photo extends Component {
  state = {
    visible: false,
    uri: ""
  };

  localOnChangeVisible = () => {
    const { visible } = this.state;
    // this.setState({ visible: !visible });

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
        const { fileName: name, type, uri } = response;

        console.log("======");
        console.log({ uri });
        console.log("======");

        // ClientModule.sendPicture(uri, localUrl => {
        //   console.log("local img url:", localUrl);
        // });
        this.setState({ visible: !visible, uri });
      }
    });
  };

  render() {
    const { visible, uri } = this.state;
    return (
      <View style={{ flex: 1, width: "100%", alignItems: "center" }}>
        <View
          style={{ marginTop: 50, borderWidth: 1, width: 160, borderRadius: 8 }}
        >
          <Button
            onPress={this.localOnChangeVisible}
            title="OpenPhotoEditer"
            color="#841584"
          />
        </View>
        <Modal visible={visible} onRequestClose={() => {}}>
          <View
            style={{
              flex: 1,
              width: "100%",
              paddingBottom: 20,
              backgroundColor: "#000"
            }}
          >
            <PhotoEditer
              style={{ width: "100%", flex: 1 }}
              source={uri}
              marks={[
                PhotoEditer.toUrl("images/mark1.png"),
                PhotoEditer.toUrl("images/mark2.png"),
                PhotoEditer.toUrl("images/mark2.png"),
                PhotoEditer.toUrl("images/mark3.png"),
                PhotoEditer.toUrl("images/mark3.png")
              ]}
              onComplete={msg => {
                console.log("complete", msg);
                this.setState({
                  uri: msg.uri,
                  visible: false
                });
              }}
              onCancel={() => {
                console.log("close");
                this.setState({ visible: false });
              }}
              onError={() => {
                // alert(msg.result);
                // console.log(msg.result);
              }}
            />
          </View>
        </Modal>
        {/* <View style={{ width: "100%", height: 300 }}>
          {uri ? (
            <Image
              key={uriHash}
              style={{ width: "100%", height: 300, resizeMode: "contain" }}
              source={{
                uri: `file://${uri}?t=${Data.now()}`
              }}
            />
          ) : null}
        </View> */}
      </View>
    );
  }
}

export default Photo;
