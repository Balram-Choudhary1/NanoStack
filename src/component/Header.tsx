import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Header = () => {
  return (
    <View style={styles.containar}>
      <Text style={styles.text}>News Application</Text>
    </View>
  )
}

export default Header;

const styles = StyleSheet.create({
    containar:{
        height:40,
        width:'100%',
        backgroundColor:'black',
        marginBottom:10,
        padding:6
    },
    text:{
        textAlign:'center', 
        color:'#fff',
        justifyContent:'center',
        fontWeight:'700'
    }
})