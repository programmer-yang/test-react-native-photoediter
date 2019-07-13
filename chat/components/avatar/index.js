import React from "react";
import { View, Image } from "react-native";

const Avatar = ({ path }) => {
  return (
    <View style={{ width: 36, height: 36, borderRadius: 18 }}>
      <Image
        style={{ width: 36, height: 36, borderRadius: 18 }}
        source={path}
      />
    </View>
  );
};

export default Avatar;
