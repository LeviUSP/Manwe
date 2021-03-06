import React, { useState, useEffect, useContext } from "react";

import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  AsyncStorage,
  Image
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import NeomorphicButton from "../components/NeomorphicButton";
import EventSection from "../components/EventSection";

import api, { BASE_URL } from "../services/api";

const TopBar = ({ navigation }) => {
  const signOut = async () => {
    await AsyncStorage.clear();
    navigation.navigate("Auth");
  };

  return (
    <View style={styles.topBar}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Home", { update: true })}
      >
        <Ionicons name="ios-arrow-back" color="#fff" size={20} />
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginLeft: "auto" }}
        onPress={() => signOut()}
      >
        <MaterialCommunityIcons name="logout" color="#999" size={15} />
      </TouchableOpacity>
    </View>
  );
};

const RenderImage = ({ radius, imageURL }) => {
  if (imageURL) {
    return (
      <Image
        source={{ uri: `${imageURL}` }}
        style={[styles.logo, { borderRadius: radius }]}
      />
    );
  } else {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Ionicons name="ios-add" size={30} color="#fff" />
      </View>
    );
  }
};

const UserInformation = ({ user }) => {
  return (
    <View style={{ alignItems: "center" }}>
      <NeomorphicButton width={80} height={80}>
        <RenderImage radius={25} imageURL={user.imageURL} />
      </NeomorphicButton>

      <Text style={styles.name}>{user.name}</Text>
    </View>
  );
};

export default function Profile({ navigation }) {
  const [user, setUser] = useState({});
  useEffect(() => {
    StatusBar.setHidden(true);
    _getUserAsync();
  }, []);

  const _getUserAsync = async () => {
    const id = await AsyncStorage.getItem("user");

    const { data } = await api.get("/user", { headers: { id } });

    setUser(data);
  };

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <UserInformation user={user} />
      <EventSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#282828",
    alignItems: "center",
    paddingTop: 30,
    paddingHorizontal: 30
  },

  topBar: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center"
  },

  name: {
    marginTop: 10,
    color: "#F8A700",
    fontSize: 16,
    fontWeight: "bold"
  },
  logo: {
    height: 80,
    width: 80
  }
});
