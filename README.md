# Waldo: HwaTang COVID-19  App
The app that helps you narrow down your search for your pandemic related needs.
## Table of Contents
* [Technologies](#technologies)
* [Deploy](#deploy)
* [Features](#features)
* [Access Our API](#our-api)
## Technologies
* Angular 9
* Ionic Framework: @ionic/angular 5.2.2
## Deploy
In order to run our application on a variety devices we have provided build files within our repository for Android and IOS devices. In order to deploy our application you will need to have Git, Node, Ionic and Angular installed on your system. 

### Follow the steps below to deploy our application:

1. Clone our git repository to your system:
    ```
    git clone https://github.com/HwaA18/waldo.git
    ```
2. Install the necessary libraries for the application:
    ```
    cd ./Waldo
    npm install
    npm i -g native-run
    ```
3. Run the application

    Our application can be run on IOS devices, Android devices, and in a Google Chrome Browser. 
    
    For any clarification on deploying to IOS or Android that was not clear below, can be found here: [ionicframework.com](https://ionicframework.com/docs/angular/your-first-app/6-deploying-mobile)

    * Run on IOS
        ```
        ionic cap open ios
        ```
        When using XCode we did notice, one particular piece of information needed to be set in order to build and run the application. Select `App` in the Project Navigator on the left-hand side, then within the `Signing & Capabilites` section, select your development team. 

        You can then run our app on a simulator or IOS device!
    * Run on Android
        ```
        ionic cap open android
        ```
        As a team we did not experience any permissions issues with Android devices. If they occur, please reference the link above for guidance.
    * Run on Google Chrome Browser
        ```
        ionic serve
        ```
        This will start our application on a local host port. It will generate in the default browser for your system. Simply open a Google Chrome Browser and copy the link from your default into the search bar. 

        On certain systems, we have experienced an interesting phenomenon. When arriving at the Google Chrome Browser, you may be told to run the command `ionic cordova run browser`. In which case you will need to install Cordova and carry out the command in order to deploy this way. 
        
## Features

## Our API