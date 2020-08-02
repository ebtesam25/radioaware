import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, FlatList } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import Rad from '../assets/img/geiger.png'
import RadA from '../assets/img/radioactive.png'
import RadioRow from '../components/radiorow'
obj = [];
export default class Radio extends Component {

  constructor() {
    super();
    this.state = {
      show: false,
      data: [],
    };
  }

  ShowHideComponent = () => {
    if (this.state.show == true) {
      this.setState({ show: false });
    } else {
      this.setState({ show: true });
    }
  };

  componentDidMount(){
    fetch('https://us-central1-aiot-fit-xlab.cloudfunctions.net/getradvisits', {
        method: 'GET'
     })
     .then((response) => response.json())
     .then((responseJson) => {
       obj  = responseJson.data;
        var i=0; var j = 0;
        
       console.log(obj);
       for(i=0;i<obj.length;i++){
           var temp = parseFloat(obj[i].rads).toFixed(2);
        obj[i].rads = temp;
           console.log(obj[i].rads);
       }
      
       this.setState({data:obj});
     
    
        
     })
     .catch((error) => {
        console.error(error);
     });
    
  }

  render() {
    return (
      <View style={{backgroundColor:'#FFF', flex:1}}>
        <View style={{backgroundColor:'#D08E2F', height:'100%', position:'absolute',zIndex:1, width:'100%'}}>
            <Image  source={RadA} style={{height:1, width:1, position:'absolute', zIndex:2, resizeMode:'contain',marginTop:'16%', marginLeft:'10%' }}></Image>
            <Text style={{fontSize:50,fontFamily:'Avenir', color:'#000000', marginTop:'17%', marginLeft:'20%'}}>RadioAware</Text>
        </View>
        <View style={styles.mapContainer}> 
       
        <FlatList style={{marginTop:'5%'}}
                data={this.state.data}
                renderItem={({ item }) => <RadioRow
                    visit={item.visit}
                    rads = {item.rads}
                    
                    
                    
                />}
            />
      </View>
     <Image source={Rad} style={{ position:'absolute', zIndex:3,bottom:'1%', alignSelf:'center', height:'35%', resizeMode:'contain'}}></Image>
      <Text style={{borderRadius:10, width:'80%', position:'absolute', zIndex:4,bottom:'2.5%', alignSelf:'center',textAlign:'center', height:70,fontFamily:'Avenir', fontSize:30, textAlignVertical:'center', color:'transparent'}}  onPress={() => {
            /* 1. Navigate to the Details route with params */
            this.props.navigation.navigate('Details', {
              latitude: this.state.markers[0].latlng.latitude,
              longitude: this.state.markers[0].latlng.longitude,
              
            });
          }}>Confirm</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'gray'
  },
  mapContainer: {
    height: 350,
    borderRadius:50,
    width:'90%',
    alignSelf:'center',
    position:'absolute',
    zIndex:2,
    top:'20%',
    backgroundColor:'#F2F3F5',
    alignContent:'center',
  },
  map: {
    height: '92%',
    borderRadius:100,
    width:'90%',
    margin:'5%',
    alignSelf:'center',
    
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36
  }
});