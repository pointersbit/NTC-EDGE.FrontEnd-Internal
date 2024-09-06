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
     > setup.bat
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
   
   
