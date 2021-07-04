import React, { useState } from '../../frontend/node_modules/@types/react'
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'
import firebase from '../../frontend/node_modules/firebase';
import { NavigationContainer } from '@react-navigation/native';
require('../../frontend/node_modules/firebase/empty-import')

export default function ExploreScreen(props) {
    const [users, setUsers] = useState([])

    const fetchUsers = (searchString) => {
        firebase.firestore()
            .collection('users')
            .where('name', '>=', searchString)
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                });
                setUsers(users);
            })
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <TextInput
                placeholder="search for users"
                onChangeText={(searchString) => fetchUsers(searchString)} />
            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate("Profile", { uid: item.id })
                    }}>
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}


