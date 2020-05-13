import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import StartActivity from './StartActivity';
import MainActivity from './MainActivity';

const Stack = createStackNavigator();

function App(){
  return(

    <NavigationContainer>
      <Stack.Navigator initialRouteName="StartActivity" screenOptions={{
            headerShown: false
          }}>
        <Stack.Screen name="StartActivity" component={StartActivity} />
        <Stack.Screen name="MainActivity" component={MainActivity} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}


export default App;