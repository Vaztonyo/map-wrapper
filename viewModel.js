/**
  Copyright (c) 2015, 2017, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
  api url and key = https://maps.googleapis.com/maps/api/js?key=AIzaSyA07vX9UwwikBu3pOhvXgpXJiWCBF9XpVI
*/
define(
    ['ojs/ojcore', 'knockout', 'jquery','gmaps'], function (oj, ko, $) {
    'use strict';

    function ExampleComponentModel(context) {

      var locations = [{name: "LA", lat: "-33.9445", lon: "18.5315"},
      {name: "SR", lat: "-33.9268", lon: "18.4721"},
      {name: "MB", lat: "-33.9500", lon: "18.4959"},
      {name: "CM", lat: "-33.9860", lon: "18.4721"},
      {name: "CT", lat: "-33.93", lon: "18.42"},
      {name: "WB", lat: "-34.0084", lon: "18.4662"}];

        var self = this;
        self.composite = context.element;
        //Example observable

        self.longFrom = ko.observable();
        self.latFrom = ko.observable();

        self.longTo = ko.observable();
        self.latTo = ko.observable();

        self.distance = ko.observable();
        self.duration = ko.observable();

        self.distanceWalk = ko.observable();
        self.durationWalk = ko.observable();

        self.message = ko.observable();


        self.width = ko.observable("400px");
        self.height = ko.observable("400px");
        self.clickhandler = function(evt){
          var from = $("#SelectFrom").val()
          var to = $("#SelectTo").val()

          for(var i=0;i<locations.length;i++){
            if(locations[i].name == from){
              self.longFrom(locations[i].lon)
              self.latFrom(locations[i].lat)
            } else if (locations[i].name == to) {
              self.longTo(locations[i].lon)
              self.latTo(locations[i].lat)
            }
          }
          self.composite.drawMap();
        }
        self.composite.drawMap = function(){
            console.log("long == "+ self.longFrom())
            console.log("lat == "+ self.latFrom())
            var map;
            var mapProp = {
                  center: new google.maps.LatLng(self.latFrom(), self.longFrom()),
                  zoom: 11,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
                 };

                 var startFrom = new google.maps.LatLng(self.latFrom(), self.longFrom());
                 var goTo = new google.maps.LatLng(self.latTo(), self.longTo());
                    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
                    var marker = new google.maps.Marker({
                        position: startFrom,
                        map: map
                      });
//////////////////////////////////////////////////////////////////////////////////////////////////////

                              var marker2 = new google.maps.Marker({
                                  position: goTo,
                                  map: map
                                });

              //var origin1 = 'Wynberg, Cape Town' //new google.maps.LatLng(55.930385, -3.118425);
              //var origin2 = 'Woodstock, ';

              //var destinationA = 'Woodstock, Cape Town';
              //var destinationB = new google.maps.LatLng(50.087692, 14.421150);

              var service = new google.maps.DistanceMatrixService();

              service.getDistanceMatrix(
                {
                  origins: [startFrom],
                  destinations: [goTo],
                  travelMode: 'DRIVING',
                  //transitOptions: TransitOptions,
                  //drivingOptions: DrivingOptions,
                  //unitSystem: UnitSystem,
                  avoidHighways: true,
                  avoidTolls: true,
                }, callback);


                function callback(response, status) {
                  //alert(response);
                  //alert(status);
                  self.distance('Distance: ' + response.rows[0].elements[0].distance.text);
                  self.duration('Duration: ' + response.rows[0].elements[0].duration.text);
                  // var timeDuration = self.duration(response.rows[0].elements[0].duration.text);
                  self.message("We recommend that you take a Taxi which will get you in less than " + response.rows[0].elements[0].duration.text);
                  console.log(response);
                }

              service.getDistanceMatrix(
                {
                  origins: [startFrom],
                  destinations: [goTo],
                  travelMode: 'WALKING',
                  //transitOptions: TransitOptions,
                  //drivingOptions: DrivingOptions,
                  //unitSystem: UnitSystem,
                  avoidHighways: true,
                  avoidTolls: true,
                }, callbackWalk);


                function callbackWalk(response, status) {
                  //alert(response);
                  //alert(status);
                  self.distanceWalk('Distance: ' + response.rows[0].elements[0].distance.text);
                  self.durationWalk('Duration: ' + response.rows[0].elements[0].duration.text);
                  // var timeDuration = self.duration(response.rows[0].elements[0].duration.text);
                  // self.message("We recommend that you take a Taxi which will get you in less than " + response.rows[0].elements[0].duration.text);
                  console.log(response);
                }


            // {lat: 34, lng: -40.605}
            // var _kCord = new google.maps.LatLng(-36.874694, 174.735292);
            // google.maps.geometry.spherical.computeDistanceBetween (latLngA, latLngB);

        }
        context.props.then(function (propertyMap) {
            //Store a reference to the properties for any later use
            self.properties = propertyMap;
            self.width(self.properties.width);
            self.height(self.properties.height);
            // if(self.properties.longitude && self.properties.latitude){
            //     // self.long(self.properties.longitude);
            //     // self.lat(self.properties.latitude);
            // }
            //Parse your component properties here

        });
    };

    //Lifecycle methods - uncomment and implement if necessary
    //ExampleComponentModel.prototype.activated = function(context){
    //};

    ExampleComponentModel.prototype.attached = function(context){




    };

    ExampleComponentModel.prototype.bindingsApplied = function(context){
        context.element.drawMap();


    };

    //ExampleComponentModel.prototype.detached = function(context){
    //};

    return ExampleComponentModel;
});
