import { View, Text , StyleSheet, TextInput} from 'react-native'
import React, { useState, FC } from 'react'

const NewsScreen:FC = () => {
  const [search, setSearch] = useState('')
  return (
    <View style={styles.container}>
      <TextInput style={{height:40, width:"80%", borderWidth:2, borderRadius:6}}
       value={search} onChangeText={setSearch}
          placeholder='Search a Data'
       />
    </View>
  )
}

export default NewsScreen;

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  }
})