/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import CookieManager from 'react-native-cookies';
import SlackLogin from './SlackLogin'


type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  logout() {
    CookieManager.clearAll()
      .then((res) => {
        console.log('CookieManager.clearAll =>', res);
        this.setState({ token: '' })
      });
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {!this.state.token ? (
          <TouchableOpacity
            style={styles.btnLogin}
            onPress={() => this.slackLogin.show()}>
            <Text style={{ color: 'white' }}>Login</Text>
          </TouchableOpacity>
        ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ margin: 10 }}>token: {this.state.token}</Text>
              <TouchableOpacity style={[styles.btnLogin, { backgroundColor: 'green' }]}
                onPress={() => this.logout()}>
                <Text style={{ color: 'white' }}>Logout</Text>
              </TouchableOpacity>
            </View>
          )
        }
        {this.state.failure && <View>
          <Text style={{ margin: 10 }}>failure: {JSON.stringify(this.state.failure)}</Text>
        </View>}
        <SlackLogin
          ref={ref => this.slackLogin = ref}
          clientId='510827975456.512744113879'
          clientSecret='c1b7dd130528fbec6728c263d25481a9'
          redirectUrl='http://hungvu.net'
          scopes={['chat:write:user', 'channels:read']}
          onLoginSuccess={(token) => this.setState({ token })}
          onLoginFailure={(data) => this.setState({ failure: data })}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  btnLogin: {
    borderRadius: 5,
    backgroundColor: 'orange',
    height: 30, width: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
