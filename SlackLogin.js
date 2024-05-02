
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Alert,
  Modal,
  Dimensions,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import qs from 'qs';
import WebView from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const patchPostMessageJsCode = `(${String(function () {
  var originalPostMessage = window.postMessage;
  var patchedPostMessage = function (message, targetOrigin, transfer) {
    originalPostMessage(message, targetOrigin, transfer);
  };
  patchedPostMessage.toString = function () {
    return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
  };
  window.postMessage = patchedPostMessage;
})})();`;

export default class SlackLogin extends Component {
  constructor(props) {
    super(props);
    this.state = { modalVisible: false };
  }

  show() {
    this.setState({ modalVisible: true });
  }

  hide() {
    this.setState({ modalVisible: false });
  }

  async getToken(code) {
    const { clientId, clientSecret } = this.props;
    try {
      let response = await fetch(
        `https://slack.com/api/oauth.access?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`,
      );
      let results = await response.json();
      if (results && results.ok) {
        this.props.onLoginSuccess(results.access_token, results);
      } else this.props.onLoginFailure(results);
    } catch (error) {
      console.error(error);
      this.props.onLoginFailure(error);
    }
  }

  _onNavigationStateChange(webViewState) {
    const { url } = webViewState;
    if (url && url.startsWith(this.props.redirectUrl)) {
      const match = url.match(/(#|\?)(.*)/);
      const results = qs.parse(match[2]);
      this.hide();
      if (results.code) {
        this.getToken(results.code);
      }
    }
  }

  _onMessage(reactMessage) {
    try {
      const json = JSON.parse(reactMessage.nativeEvent.data);
      if (json && json.error_type) {
        this.hide();
        this.props.onLoginFailure(json);
      }
    } catch (err) { }
  }

  // _onLoadEnd () {
  //   const scriptToPostBody = "window.postMessage(document.body.innerText, '*')"
  //     this.webView.injectJavaScript(scriptToPostBody)
  // }

  onBackdropPress() {
    const { onBackdropPress } = this.props;
    if (onBackdropPress) {
      this.setState({ modalVisible: false });
    }
  }

  onClose() {
    const { onClose } = this.props;
    if (onClose) onClose();
    this.setState({ modalVisible: false });
  }

  renderClose() {
    const { renderClose } = this.props;
    if (renderClose) return renderClose();
    return (
      <Image source={require('./assets/close-button.png')} style={styles.imgClose} resizeMode="contain" />
    );
  }

  renderWebview() {
    const { clientId, redirectUrl, scopes, language = 'en' } = this.props;
    return (
      <WebView
        {...this.props}
        style={[styles.webView, this.props.styles.webView]}
        source={{
          uri: `https://slack.com/oauth/authorize/?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scopes.join('+')}`,
          headers: {
            "Accept-Language": language,
          }
        }}
        scalesPageToFit
        startInLoadingState
        onNavigationStateChange={this._onNavigationStateChange.bind(this)}
        onError={this._onNavigationStateChange.bind(this)}
        onMessage={this._onMessage.bind(this)}
        ref={(webView) => { this.webView = webView; }}
        injectedJavaScript={patchPostMessageJsCode}
      />
    );
  }

  render() {
    const { containerStyle, wrapperStyle, closeStyle } = this.props;
    return (
      <Modal
        animationType={'slide'}
        visible={this.state.modalVisible}
        onRequestClose={this.hide.bind(this)}
        transparent
      >
        <View style={[styles.container, containerStyle]}>
          <View style={[styles.wrapper, wrapperStyle]}>{this.renderWebview()}</View>
          <TouchableOpacity
            onPress={() => this.onClose()}
            style={[styles.close, closeStyle]}
            accessibilityComponentType={'button'}
            accessibilityTraits={['button']}
          >
            {this.renderClose()}
          </TouchableOpacity>
        </View>

      </Modal >

    );
  }
}
const propTypes = {
  clientId: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string,
  styles: PropTypes.object,
  scopes: PropTypes.array,
  onLoginSuccess: PropTypes.func,
  modalVisible: PropTypes.bool,
  onLoginFailure: PropTypes.func,
  onBackdropPress: PropTypes.bool,
  hideCloseButton: PropTypes.bool,
};

const defaultProps = {
  redirectUrl: 'http://hungvu.net',
  styles: {},
  scopes: ['chat:write:user', 'channels:read'],
  onLoginSuccess: (token) => {
    Alert.alert(
      'Alert Title',
      'Token: ' + token,
      [
        { text: 'OK' }
      ],
      { cancelable: false }
    );
  },
  onLoginFailure: (failureJson) => {
    console.debug(failureJson);
  },
};

SlackLogin.propTypes = propTypes;
SlackLogin.defaultProps = defaultProps;

const styles = StyleSheet.create({
  webView: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 40,
    paddingHorizontal: 10,
  },
  wrapper: {
    flex: 1,
    borderRadius: 5,
    borderWidth: 5,
    borderColor: 'rgba(0, 0, 0, 0.6)',
  },
  close: {
    position: 'absolute',
    top: 35,
    right: 5,
    backgroundColor: '#000',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.4)',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15
  },
  imgClose: {
    width: 30,
    height: 30,
  }
});
