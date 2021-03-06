import React, { useState } from 'react'
import { View, TextInput, Image, Button } from 'react-native'
import firebase from 'firebase'
import { NavigationContainer } from '@react-navigation/native'
require("firebase/firestore")
require("firebase/firebase-storage")


export default function Save(props, navigation) {
    const [caption, setCaption] = useState("")
    const [likes, startLikes] = useState(0)
    const uploadImage = async () => {
        const uri = props.route.params.image;
        const response = await fetch(uri)
        const blob = await response.blob();
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;

        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob);

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot);
                console.log(snapshot)
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted);
    }

    const savePostData = (downloadURL) => {
        firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .add({
                downloadURL,
                caption,
                likes,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            }).then((function () {
                props.navigation.popToTop()
            }))
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .update({
                posts: firebase.firestore.FieldValue.increment(1)
            })
    }

    return (
        <View style={{ flex: 1 }}>
            <Image
                source={{ uri: props.route.params.image }}
            />
            <TextInput
                placeholder="enter a caption"
                onChangeText={(caption) => { setCaption(caption), setLikes(0); }}
            />

            <Button
                title="Save"
                onPress={() =>
                    uploadImage()}
            />
        </View>
    )
}
