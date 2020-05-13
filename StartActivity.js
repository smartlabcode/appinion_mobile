import React, { Component } from 'react';
import {View, Text, StyleSheet, Image, ImageBackground, TextInput, TouchableOpacity, ToastAndroid} from 'react-native';

class StartActivity extends Component{

  _newActivity = (message, presentationid) => {
    ToastAndroid.show(message, ToastAndroid.LONG);
    this.props.navigation.navigate('MainActivity', {presentation_id: presentationid});
  }
  
  _showError = (message) =>{
    ToastAndroid.show(message, ToastAndroid.LONG);
  }
  
  _handlePressJoin = () => {
    var inputid = this.refs.inputid._lastNativeText;
    var responseCode;
    var responseMessage;
  
    let data = {
      method: 'POST',
      credentials: 'same-origin',
      mode: 'same-origin',
      body: JSON.stringify({
        id: inputid
      }),
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json',
      }
    }
  
    fetch('https://appinion.ba/joinpresentation', data)
        .then(response => response.json())  // promise
        .then((responseData) => {
          responseCode = responseData['StatusCode:'],
          responseMessage = responseData['Message:']

          if(responseCode == 200){
            this._newActivity(responseMessage, inputid);
          }
          else{
            this._showError(responseMessage);
          }
        })
        .done();
  }

  render(){ 
    return(
        <ImageBackground source={require('./images/bg.png')} style={styles.background}>
          <View style={styles.container}>
            <Image source={require('./images/logo.png')} style={styles.logo}/>
            <Text style={styles.description}>Da biste se priključili predavanju, unesite kod.</Text>
            <TextInput ref="inputid" style={styles.input} placeholder="Kod prezentacije" placeholderTextColor='rgba(255, 255, 255, 0.35)' autoCapitalize='none' maxLength={5}></TextInput>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={this._handlePressJoin.bind(this)} title="Pridruži se" style={styles.button}><Text style={styles.buttonText}>Pridruži se</Text></TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      );
    };
  }

  const styles = StyleSheet.create({
    background:{
      flex: 1,
      width: null,
      height: null,
      resizeMode: 'cover'
    },
  
    input:{
      height: 40, 
      width: 200,
      borderColor: '#ffffff',
      borderWidth: 1,
      marginBottom: 50,
      color:'#ffffff',
    },
  
    buttonContainer:{
      width: 150,
    },
  
    button:{
      paddingTop:15,
      paddingBottom:15,
      backgroundColor:'#E94C55',
      borderRadius:25,
      borderWidth: 0,
      borderColor: '#fff'
    },
  
    buttonText:{
      textAlign:'center',
      color: '#ffffff'
    },
  
    container:{
      flex: 2,
      alignItems:"center",
      marginTop: 120,
    },
  
    logo:{
      marginBottom: 40,
      height: 80,
      width: 120,
    },
  
    description:{
      marginTop: 20,
      marginBottom: 30,
      color: "#ffffff"
    }
  
  });

  export default StartActivity;