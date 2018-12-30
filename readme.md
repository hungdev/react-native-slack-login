# React Native Slack login

<p align="center">
  <img src="https://github.com/hungdev/react-native-slack-login/blob/master/ios.gif?raw=true" width=300/>
</p>

# Install

```js
npm install react-native-slack-login --save
```

* How to get Client ID and clientSecret of slack?

You'll need credentials to use Sign in with Slack. To retrieve your Client ID and secret, [you'll need to create a Slack App if you haven't already.](https://api.slack.com/apps/new)

![](https://github.com/hungdev/react-native-slack-login/blob/master/client.png?raw=true)

in `OAuth & Permissions section`, add Redirect URLs

after that, you must complete steps in `Basic Information`
```
-Add features and functionality
-Install your app to your workspace
-Manage distribution
```

# Usage:

```javascript
import SlackLogin from 'react-native-slack-login'
<View>
    <TouchableOpacity onPress={()=> this.slackLogin.show()}>
        <Text style={{color: 'white'}}>Login</Text>
    </TouchableOpacity>
    <SlackLogin
          ref={ref => this.slackLogin = ref}
          clientId='your client id'
          clientSecret='your client secret'
          redirectUrl='your redirect url'
          scopes={['chat:write:user', 'channels:read']}
          onLoginSuccess={(token) => this.setState({ token })}
          onLoginFailure={(data) => this.setState({ failure: data })}
        />
</View>

```

# Props

Property | Type | Description
------------ | ------------- | -------------
clientId | PropTypes.string | Slack App ClientId, issued when you created your app (required)
clientSecret | PropTypes.string | clientSecret App ClientId, issued when you created your app (required)
scopes | PropTypes.array | [Permissions to request](https://api.slack.com/docs/oauth-scopes)
redirectUrl | PropTypes.string | URL to redirect back to
onLoginSuccess | PropTypes.func | Function will be call back on success
onLoginFailure | PropTypes.func | Function will be call back on error
onClose | PropTypes.func | Function will be call back on close modal
modalVisible | PropTypes.bool | true or false
renderClose | PropTypes.func | Render function for customize close button
containerStyle | PropTypes.object | Customize container style
wrapperStyle | PropTypes.object | Customize wrapper style
closeStyle | PropTypes.object | Customize close style


# Logout

To logout use clear cookies by using https://github.com/joeferraro/react-native-cookies

```js
import CookieManager from 'react-native-cookies';

  logout() {
    CookieManager.clearAll()
      .then((res) => {
        console.log('CookieManager.clearAll =>', res);
        this.setState({ token: '' })
      });
  }
 ```
 
 # Pull request
  Pull requests are welcome!