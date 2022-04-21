The Gate Tracker is an app to track the state of the garage gate via mobile phone.
You can monitor gate status at any point of the globe via the web application.

Gate Tracker is a minimal example of how IoT can be integrated into the Smart House System.

A microcontroller with a proximity sensor and access to the Internet is placed 
to monitor the gate. Once the gate is opened or closed, the microcontroller sends data to 
the webserver.

Once the webserver gets the status of the gate from the microcontroller it sends a push notification
for the subscribed users.

While this system is simple, the idea can be extended to much featureful 
application. 
The API could be extended so that we could close and open the gate remotely via the web application.
Also, other than gates, we can use this system to monitor and control windows, electricity, heating,
air conditioning, and many more.

The microcontroller we used is Arduino Uno with Ethernet Shield. We send data using a web client interface
provided by Ethernet.h library. You can look for more details in WebClient.ino file. 

The web server is Node.js server, written in JavaScript in app.js file. It provides an API for getting and setting the
gate status and subscribing for notifications. A simple static web page is needed for the users to subscribe 
for notifications. The client functionality is implemented in /client folder.



