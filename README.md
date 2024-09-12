# Setup Guide

## Requirements

Before you start, make sure you have the following tools installed:

- **Expo CLI**: [Installation Instructions](https://docs.expo.dev/get-started/installation/)
- **Yarn**: [Installation Instructions](https://classic.yarnpkg.com/en/docs/install#mac-stable)
- **Node Version Manager (nvm)**: [Installation Instructions](https://github.com/nvm-sh/nvm)

## Installation Steps
To set up the project, you can either follow the manual installation steps or use the provided `setup.sh` script.

### Using `setup.sh`

1. **Make the script executable**

   ```bash
   $ chmod +x setup.sh
   $ ./setup.sh
   ```

### Using `setup.bat`

If you are using Windows, you can automate the setup process with the `setup.bat` file:

1. **Run the Batch File**

   - Simply double-click the `setup.bat` file located in the root directory of the project.
   - Alternatively, you can run it from the Command Prompt:

     ```cmd
     setup.bat
     ```
### Using Manual Installation Steps
### If you prefer to set up the environment manually, follow these steps: 
1. **Install Expo CLI**

   ```bash
   $ npm install -g expo-cli@4.13.0
   $ nvm install 16
   $ nvm use 16
   $ yarn install
   $ expo start
   ```

### Web Production Step
- Run it from the Terminal

```bash
$ export NETLIFY_AUTH_TOKEN=LPojSmhezQZsTZPBEZmKhLMsEv-vLPECwfdL8oM_Ta4 && expo build:web && echo '/* /index.html 200' >./web-build/_redirects && netlify deploy --prod --dir ./web-build
```

### Android Step
- Run it from the Terminal

```bash
$ expo run:android
```

### IOS Step
- Run it from the Terminal

```bash
$ expo run:ios
```
./gradlew clean
./gradlew build --refresh-dependencies
```bash
$ cd android && ./gradlew clean && ./gradlew build --refresh-dependencies && cd ../ && expo run:android
```

```bash
$ cd ios
$ pod cache clean --all
$ rm -rf Pods
$ rm -rf Podfile.lock
$ pod install
```


```bash
$ rm -rf node_modules
$ rm yarn.lock
```



### Web Step
- Run it from the Terminal

```bash
$ expo start --web
```

### 🛠 Breaking changes

- On Android migrated cropping library from `com.theartofdev.edmodo:android-image-cropper@2.8.0` (available from `jcenter()`) to `com.github.CanHub:Android-Image-Cropper@1.1.1` (available from `jitpack.io`). ([#11647](https://github.com/expo/expo/pull/11647) by [@bbarthec](https://github.com/bbarthec))
