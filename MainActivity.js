import React, { Component } from 'react';
import {View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, ToastAndroid, Dimensions} from 'react-native';
import renderIf from './renderif';
import { ceil } from 'react-native-reanimated';

class MainActivity extends Component{
  constructor(props){
    super(props);
    this.state = {
      presentation_id: '',
      user_id: this.makeid(),
      showBtnState: false,
      pitanje: '',
      odgovor: '',
      id_pitanja: null,

      odg2: true,
      odg3: false,
      odg4: false,
    }

    this._checkforQUestions = this._checkforQUestions.bind(this);
    this._hideStartButton = this._hideStartButton.bind(this);
    this._resetScreen = this._resetScreen.bind(this);
  }

  makeid = () =>{
    var length = 5;
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  componentDidMount = () => {
    const {presentation_id} = this.props.route.params;
    this.setState({presentation_id: presentation_id});

  }

  _checkforQUestions = () => {

    var vidljivo, idPitanja, pitanje, brojOdgovora;

    let data = {
      method: 'POST',
      credentials: 'same-origin',
      mode: 'same-origin',
      body: JSON.stringify({
        id: this.state.presentation_id
      }),
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json',
      }
    }

    fetch('https://appinion.ba/checkforanswers', data)
    .then(response => response.json())  // promise
    .then((responseData) => {
      vidljivo = responseData['Vidljivo:'],
      idPitanja = parseInt(responseData['id_pitanja']),
      pitanje = responseData['Pitanje'],
      brojOdgovora = responseData['Broj_odgovora']

      if(vidljivo == 1){

        this._hideStartButton(idPitanja, pitanje);
        if(brojOdgovora == 3){
          this.setState({odg2: false});
          this.setState({odg3: true});
        }else if(brojOdgovora == 4){
          this.setState({odg2: false});
          this.setState({odg3: false});
          this.setState({odg4: true});
        }
      }
      else{

      }

    })
    .done();

  }

  _hideStartButton = (idpitanja, pitanje) => {

    this.setState({showBtnState: true});
    this.setState({pitanje: pitanje});
    this.setState({id_pitanja: idpitanja});
  }


  _sendAnswer = (userOdgovor) => {

    let data = {
      method: 'POST',
      credentials: 'same-origin',
      mode: 'same-origin',
      body: JSON.stringify({
        id_prezentacije: this.state.presentation_id,
        id_pitanja: this.state.id_pitanja,
        userid: this.state.user_id,
        odg: userOdgovor,
      }),
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json',
      }
    }

    fetch('https://appinion.ba/getandroidresponse', data)
    .then(response => response.json())  // promise
    .then((responseData) => {
      message = responseData['Message:'];
      ToastAndroid.show(message, ToastAndroid.SHORT);

      setTimeout(this._resetScreen, 2500);

    })
    .done();
  }

  _resetScreen = () =>{
    this.setState({showBtnState: false});
  }

  render(){

    return(
      <ImageBackground source={require('./images/bg.png')} style={styles.background}>
        {renderIf(!this.state.showBtnState)(
          <TouchableOpacity style={styles.startBtn} onPress={() => this._checkforQUestions()}>
          <View style={styles.startView}>
            <Image style={styles.lockImage} source={require('./images/lock.png')}></Image>
            <Text style={styles.startText}>Pratite predavanje, te pričekajte trenutak kada će se na Vašem displayu pojaviti pitanje.</Text>
          </View>
        </TouchableOpacity>
        )}
        <View style={styles.box}>
            <Image source={require('./images/ic_touch_app_24px.png')} style={styles.touchImage}/>
            <Text style={styles.touchText}>Aktivnost</Text>
          </View>
          <Text style={styles.pitanjeText}>{this.state.pitanje}</Text>
          <View style={styles.whiteBackground}>
            {renderIf(this.state.odg2)(
              <View style={twoButtonStyle.container}>
                <View style={twoButtonStyle.twoButtonViewContainer}>
                    <TouchableOpacity onPress={() => this._sendAnswer('odg1')}><View style={twoButtonStyle.buttonTextContainer}><Text style={twoButtonStyle.buttonText}>A</Text></View></TouchableOpacity>
                </View>
                <View style={twoButtonStyle.twoButtonViewContainer}>
                    <TouchableOpacity onPress={() => this._sendAnswer('odg2')}><View style={twoButtonStyle.buttonTextContainer}><Text style={twoButtonStyle.buttonText}>B</Text></View></TouchableOpacity>
                </View>
              </View>
            )}
            {renderIf(this.state.odg3)(
              <View style={twoButtonStyle.container}>
                <View style={threeButtonStyle.threeButtonViewContainer}>
                    <TouchableOpacity onPress={() => this._sendAnswer('odg1')}><View style={threeButtonStyle.buttonTextContainer}><Text style={threeButtonStyle.buttonText}>A</Text></View></TouchableOpacity>
                </View>
                <View style={threeButtonStyle.threeButtonViewContainer}>
                    <TouchableOpacity onPress={() => this._sendAnswer('odg2')}><View style={threeButtonStyle.buttonTextContainer}><Text style={threeButtonStyle.buttonText}>B</Text></View></TouchableOpacity>
                </View>
                <View style={threeButtonStyle.threeButtonViewContainer}>
                    <TouchableOpacity onPress={() => this._sendAnswer('odg3')}><View style={threeButtonStyle.buttonTextContainer}><Text style={threeButtonStyle.buttonText}>C</Text></View></TouchableOpacity>
                </View>
              </View>
            )}
            {renderIf(this.state.odg4)(
              <View style={fourButtonStyle.container}>
                <View style={fourButtonStyle.fourButtonViewContainer}>
                  <TouchableOpacity onPress={() => this._sendAnswer('odg1')}><View style={twoButtonStyle.buttonTextContainer}><Text style={fourButtonStyle.buttonText}>A</Text></View></TouchableOpacity>
                </View>
                <View style={fourButtonStyle.fourButtonViewContainer}>
                  <TouchableOpacity  onPress={() => this._sendAnswer('odg2')}><View style={twoButtonStyle.buttonTextContainer}><Text style={fourButtonStyle.buttonText}>B</Text></View></TouchableOpacity>
                </View>
                <View style={fourButtonStyle.fourButtonViewContainer}>
                  <TouchableOpacity onPress={() => this._sendAnswer('odg3')}><View style={twoButtonStyle.buttonTextContainer}><Text style={fourButtonStyle.buttonText}>C</Text></View></TouchableOpacity>
                </View>
                <View style={fourButtonStyle.fourButtonViewContainer}>
                  <TouchableOpacity onPress={() => this._sendAnswer('odg4')}><View style={twoButtonStyle.buttonTextContainer}><Text style={fourButtonStyle.buttonText}>D</Text></View></TouchableOpacity>
                </View>
              </View>
            )}
          </View>
      </ImageBackground>
    );
  };
}

var styles = StyleSheet.create({

  startBtn:{
    display: 'flex',
    position: 'absolute',
    bottom: 0,
    flex: 0.1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    zIndex: 50,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    backgroundColor:'rgba(76,48,86, 0.9)',
  },

  startBtnHide:{
    display:'none',
    width: 0,
    height:0,
  },

  startView:{
    flex: 1,
    flexDirection: 'column',
    width: 3*Dimensions.get('window').width/5,
    maxWidth: 3*Dimensions.get('window').width/5,
    justifyContent: 'center',
    alignItems: 'center',

  },

  lockImage:{
    marginBottom: 50,
  },

  startText:{
    color: '#ffffff',
    textAlign: 'center',
  },

  background:{
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover'
  },

  box:{
    position: 'absolute',
    width: 180,
    height: 40,
    marginTop: 120,
    backgroundColor: '#ffffff',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    minHeight: 40,
    padding: 10,
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: "row",
    justifyContent: "space-around",

  },

  touchImage:{
    width: 12,
    height: 16,
  },

  pitanjeText:{
    color: '#ffffff',
    marginTop: 180,
    marginLeft: 40,
  },

  whiteBackground:{
    backgroundColor: '#ffffff',
    width: Dimensions.get('window').width + 140,
    height: Dimensions.get('window').height/2+50,
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    left: -70,
    borderTopLeftRadius: Dimensions.get('window').width/2 + 70,
    borderTopRightRadius: Dimensions.get('window').width/2 + 70,
  },

  buttonText:{
    textAlign:'center',
    color: '#ffffff',
  }
});

var twoButtonStyle = StyleSheet.create({

  container:{
    flex: 1,
    justifyContent: "center",
    alignContent: 'center',
    flexDirection:'row'
  },

  twoButtonViewContainer:{
    backgroundColor:'#E94C55',
    width: Dimensions.get('window').width/5,
    maxWidth: Dimensions.get('window').width/5,
    marginLeft:20,
    marginRight:20,
    marginTop: 50,
    height:Dimensions.get('window').width/5,
    maxHeight:Dimensions.get('window').width/5,
    borderRadius: Dimensions.get('window').width/10,

    flex:1,
    flexDirection: 'column',
    justifyContent: 'center',
  },

  buttonText:{
    textAlign:'center',
    color: '#ffffff',
  },

});

var threeButtonStyle = StyleSheet.create({

  container:{
    flex: 1,
    justifyContent: "center",
    alignContent: 'center',
    flexDirection:'row'
  },

  threeButtonViewContainer:{
    backgroundColor:'#E94C55',
    width: Dimensions.get('window').width/5,
    maxWidth: Dimensions.get('window').width/5,
    marginLeft:20,
    marginRight:20,
    marginTop: 50,
    height:Dimensions.get('window').width/5,
    maxHeight:Dimensions.get('window').width/5,
    borderRadius: Dimensions.get('window').width/10,

    flex:1,
    flexDirection: 'column',
    justifyContent: 'center',
  },

  buttonText:{
    textAlign:'center',
    color: '#ffffff',
  },

});

var fourButtonStyle = StyleSheet.create({

  container:{
    flex: 1,
    justifyContent: "center",
    alignContent: 'center',
    flexDirection:'row'
  },

  fourButtonViewContainer:{
    backgroundColor:'#E94C55',
    width: Dimensions.get('window').width/5,
    maxWidth: Dimensions.get('window').width/5,
    marginLeft:5,
    marginRight:5,
    marginTop: 50,
    height:Dimensions.get('window').width/5,
    maxHeight:Dimensions.get('window').width/5,
    borderRadius: Dimensions.get('window').width/10,

    flex:1,
    flexDirection: 'column',
    justifyContent: 'center',
  },

  buttonText:{
    textAlign:'center',
    color: '#ffffff',
  },

});


export default MainActivity;