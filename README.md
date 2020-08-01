# Waldo: HwaTang COVID-19  App
The app that helps you narrow down your search for your pandemic related needs. Our application uses user reported data to share the availability of COVID-19 related in demand goods. Reports filed allow us to display information on the `Map` in the form of markers or viewed in the Search functionality. The full list of goods we track can be viewed below.  

For a visual demonstration of our application, please see this video:
[Waldo Demo](https://youtu.be/qqXvjzSxkVk)

## Table of Contents
* [Technologies](#technologies)
* [Deploy](#deploy)
* [Features](#features)
* [Good We Track](#goods-we-track)
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

        Within the "Waldo" directory run:
        ```
        ionic cap open ios
        ```
        When using XCode we did notice, one particular piece of information needed to be set in order to build and run the application. Select `App` in the Project Navigator on the left-hand side, then within the `Signing & Capabilites` section, select your development team. 

        You can then run our app on a simulator or IOS device!
    * Run on Android

        Within the "Waldo" directory run:
        ```
        ionic cap open android
        ```
        As a team we did not experience any permissions issues with Android devices. If they occur, please reference the link above for guidance.
    * Run on Google Chrome Browser

        Within the "Waldo" directory run:
        ```
        ionic serve
        ```
        This will start our application on a local host port. It will generate in the default browser for your system. Simply open a Google Chrome Browser and copy the link from your default into the search bar. 

        On certain systems, we have experienced an interesting phenomenon. When arriving at the Google Chrome Browser, you may be told to run the command `ionic cordova run browser`. In which case you will need to install Cordova and carry out the command in order to deploy this way. 

## Features
### Map
Upon opening the application, the first screen you will see is the `Map`. The `Map` is powered by Google Maps and will start centered around the location of your system, or California is your system does not allow location services. The `Map` has the ability to zoom in, zoom out, refocus on your location with "Where I Am", and change to street or terrain view. The `Map` has red markers throughout to indicate that a `Report` about product availability has been filed about that establishment. When you click on the red marker, you will be able to see the establishment's name, any products that are currently not stocked or sold there, and when the data about the store was last updated. Finally, the `Map` has a blue plus button in the bottom left corner where a user can file a `Report`.

### Report 
When the `Report` button is selected, two possible chains of events can occur. If a user is not logged in, an alert box is triggered asking a user to log in and allows one to navigate to the `Login` screen. We require a user to be logged in so that we may hold users accountable for the information they spread. 

If a user is logged in when the `Report` button is selected, the user is directed to a page to enter information about the store they select. The list of goods is long so not all fields must be selected. When the user submits the report, if successful, an alert will let them know it was successfully filed. Then the user will be given the option to file another report or return to the `Map`.

### Search
On the `Search` page is a search bar so that a user may seek information regarding a specific store. The search bar will use your current location to populate results of establishments nearest to you first. If more information is supplied such as a city or state, the results will be tailored to better fit it. 

Once a location is selected from the search results, a card of information will be displayed. It includes the name of the establishment, its address, and an image associated with it. Additionally, any product availability reported by users is displayed along with who filed the most recent and at what time. 

### Login
On the `Login` a user is asked to enter their username and associated password. This information is then verified with our SQL database. If the credentials are incorrect, the user will be alerted. Otherwise, the page will populate with the user's first name, last name, and address. From here, the user may also log out. Users can view store information without an account but may not report it. 

There is a link on the `Login` page for users that do not have an account. This will redirect them to the `Registration` page. 

### Registration
The `Registration` page allows a user to create an account. This requires a user to provide their first name, last name, preferred username, password (twice to confirm it has been provided correctly), and their address. Their address is reformatted by our program before being submitted. All fields must be filled before submission, if they are not an alert is triggered. If the username has already been taken, an alert will trigger. If the passwords do not match, an alert is triggered. 

If the information is provided correctly, an alert will be triggered to allow the user to confirm all information has been entered correctly. The user can then cancel to correct the information or accept it. If it is accepted, the user will be redirected to the `Login` page and logged in. Therefore they will see their first name, last name, and address as above. 

## Goods We Track
### Personal Protective Equipment:

* Masks
* Gloves

### Household Essentials:

* Hand Sanitizer
* Paper Towels
* Toilet Paper
* Liquid Soap 
* Bar Soap
* Cleaning Wipes
* Aerosol Disinfectants
* Bleach
* Flushable wipes
* Tissues
* Diapers
* Water Filters

### Medicinal Supplies:

* Cold Remedies
* Cough Remedies
* Rubbing Alcohol
* Antiseptic
* Thermometer
* First Aid Kits

### Groceries:
* Water Bottles
* Eggs
* Milk
* Bread
* Beef
* Chicken
* Pork
* Yeast

## Our API
For our application we also wrote our own API. This API contacts an SQL database that we use to store information on our users and stores. It was written completely in C# and is being hosted on Azure.

You can find our API here: [WaldoAPI](https://github.com/HwaA18/WaldoAPI)