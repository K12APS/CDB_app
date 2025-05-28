import 'dotenv/config';

export default {
  "expo": {
    "name": "CDBapp",
    "slug": "cdb-app",
    "version": "1.2.0",
    "orientation": "portrait",
    "icon": "./assets/images/IconaSplash.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/IconaSplash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.coderdojobza.CDBapp",
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
    },
    "android": {
        "googleServicesFile": process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/Icona.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.coderdojobza.CDBapp"
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/Icona.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-font",
        {
          "fonts": [
            "./assets/fonts/Poppins-Regular.ttf",
            "./assets/fonts/Poppins-SemiBold.ttf",
            "./assets/fonts/Poppins-Bold.ttf"
          ]
        }
      ],
      [
        "expo-build-properties",
        {
          "android": {
            "usesCleartextTraffic": false
          }
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "eas": {
        "projectId": "e41939e9-743d-40da-9092-578723f1d31c"
      },
      "router": {
        "origin": false
      },
    },
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "updates": {
      "url": "https://u.expo.dev/e41939e9-743d-40da-9092-578723f1d31c"
    },
    "owner": "coderdojobza"
  }
};