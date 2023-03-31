# 3Squared Group Two

Last edited 31/03/2023

A National Map is a schematic map which displays routes, stops and train progress of the Rail Network in the UK. This National Map can be used to view live information about a train such as details about its consist, progress through its journey and the different stops and passes the train goes through on its journey.

To view the map open the following link if you preferred browser:

https://3squaredgroup2.azurewebsites.net/

To run in the terminal on Visual Studio Code, first run "npm install", then "node server" in the terminal.

Alternatively, you can use the "Run Code" button from the server.js file once you have installed the dependancies.

Type http://localhost:3000/ into your broser to view the national map.

Select a location from the side menu and the a route.
The menu displays if the train was on time or late to each station. If there is no data for a station, it will display the expected time of arrival for that station.

The start and end point are plotted on the map, a trail shows the route between. The green portion shows the distance left on the journey, and the blue will show the distance completed by the train. 
You can veiw all tiplocks along the journey by clicking the "Show all TIPLOCs" button in the bottom right, next to the key. 

The map will automatically update every 20 seconds. The current time and the last updated time are displayed in the top right of the site.
