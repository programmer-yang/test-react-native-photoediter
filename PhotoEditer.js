import React, { Component } from "react";
import { View, Image, Modal, Button, Text } from "react-native";

import PhotoEditer from "rn-lm-photoediter";

class Photo extends Component {
  state = {
    visible: false,
    uri: ""
  };

  localOnChangeVisible = () => {
    const { visible } = this.state;
    this.setState({ visible: !visible });
  };

  render() {
    const { visible, uri } = this.state;
    console.log(uri);
    return (
      <View style={{ flex: 1, width: "100%" }}>
        <View style={{ marginTop: 50 }}>
          <Button
            onPress={this.localOnChangeVisible}
            title="Learn More"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
        <Modal visible={visible} onRequestClose={() => {}}>
          <PhotoEditer
            style={{ width: "100%", flex: 1 }}
            source="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1561380079906&di=368d275b2ad6dfea75d35034b3c44aa8&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201603%2F06%2F20160306224210_TRBaQ.jpeg"
            marks={[PhotoEditer.toUrl("images/card1.png")]}
            onComplete={msg => {
              this.setState({
                uri: msg.uri,
                visible: false
              });
            }}
            onCancel={() => {
              this.setState({ visible: false });
            }}
            onError={() => {
              // alert(msg.result);
              // console.log(msg.result);
            }}
          />
        </Modal>
        <View style={{ width: "100%", height: 300 }}>
          {uri ? (
            <Image
              style={{ width: "100%", height: 300, resizeMode: "contain" }}
              source={{
                uri: `file://${uri}`
              }}
            />
          ) : null}
        </View>
      </View>
    );
  }
}

export default Photo;
