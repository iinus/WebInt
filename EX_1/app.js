/* Map */

var map;
var infoWindow;
var geocoder;
var currentPos;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(initMap);
  } else { 
  }
}

function initMap(position) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 11
    });

    infoWindow = new google.maps.InfoWindow;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found.');
        infoWindow.open(map);
        map.setCenter(pos);
        currentPos = true;

        geocoder = new google.maps.Geocoder;
        geocoder.geocode({'location': pos}, function(results, status) {
            if (status === 'OK') {
              if (results[0]) {
                var marker = new google.maps.Marker({
                  position: pos,
                  map: map
                });
                infoWindow.setContent(results[0].formatted_address);
                infoWindow.open(map, marker);
                fillForm(results);
              } else {
                window.alert('No results found');
              }
            } else {
              window.alert('Geocoder failed due to: ' + status);
            }
          });
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      handleLocationError(false, infoWindow, map.getCenter());
    }
}

function updateMap(){
    var latitude;
    var longitude;

    if (!currentPos){
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 11
        });
    }

    var street = document.getElementById("street").value;
    var city = document.getElementById("city").value;
    var zipcode = document.getElementById("zipcode").value;
    var country = document.getElementById("country").value;
    var address = street + ", " + zipcode + ", " + city + ", " + country; 

    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          latitude = results[0].geometry.location.lat();
          longitude = results[0].geometry.location.lng();
          var pos = {
            lat: latitude,
            lng: longitude
        };
        
        map.setCenter(pos);
        infoWindow.setPosition(pos);
        infoWindow.setContent('New location found.');
        infoWindow.open(map);
        }
        else {
           window.alert('Geocoder failed due to: ' + status);
      }
    })
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function fillForm(geoLocation){
    var address = geoLocation[0].formatted_address; 
    var addressComponents = geoLocation[0].address_components;
    var streetElement = document.getElementById("street");
    var cityElement = document.getElementById("city");
    var zipcodeElement = document.getElementById("zipcode");
    var countryElement = document.getElementById("country");

    for (i in addressComponents){
        if (addressComponents[i].types[0] == "locality" || addressComponents[i].types[0] == "postal_town" || addressComponents[i].types[0] == "administrative_area_level_2"){
            cityElement.setAttribute("value", addressComponents[i].long_name )
        }
        if (addressComponents[i].types[0] == "country"){
            countryElement.setAttribute("value", addressComponents[i].long_name )
        }
        if (addressComponents[i].types[0] == "postal_code"){
            zipcodeElement.setAttribute("value", addressComponents[i].long_name )
        }
        if (addressComponents[i].types[0] == "route"){
            streetElement.setAttribute("value", addressComponents[i].long_name )
        }
    }
    streetElement.setAttribute("value", address.split(', ')[0]);

    var form = document.getElementById("form02")[2];
    console.log("form " + form);
}

/* Video */

function loadNewVideo(){
    var url = document.getElementById("url").value;

    if (isURL(url) && (url.endsWith(".mp4"))){
        var urlInput = document.getElementById('videosource');
        urlInput.setAttribute("src", url);
        document.getElementById("video01").load(); 
    }
}

function jumpToOffset(){
    var seconds = document.getElementById("jump").value;
    var video = document.getElementById("video01");
    console.log(video);

    video.currentTime = seconds; 
}

var rotation = 0;

function rotateVideo() {
    rotation = (rotation + 180)
    var video = document.getElementById("video01");
    video.style.transform = "rotate("+rotation+"deg)"
}

function previewVideo(){
    var video = document.getElementById("video01");
    if (!video.hasAttribute("poster")){
        var src = document.getElementById("videosource").src;
        video.setAttribute("poster", src + "#t=" + video.currentTime );
    }
    else {
        video.removeAttribute("poster");
    }
}

/* This function only works as intended for Safari */

function mirrorVideo(){
    var canvas = document.getElementById("canvas01");
    var ctx = canvas.getContext("2d");
    var videosource = document.getElementById("videosource");
    canvasContainer = document.getElementById("canvas-container");
    mirrorButton = document.getElementById("mirror");

    var childrenNodes = canvasContainer.children;
    canvas.width = 0;
    canvas.height = 0;

    if (childrenNodes.length == 1){
        var newVideo = document.createElement("video");
        newVideo.setAttribute("controls", "controls");
        canvasContainer.appendChild(newVideo);
        newVideo.setAttribute("src", videosource.src);
        draw(newVideo,ctx,250,250);
    }
    else{
        newVideo = childrenNodes[1];
    }

    console.log(newVideo);

    function draw(video,context,w,h) {
        if(video.currentTime == 0) {
            return false;
        } else{
            newVideo.addEventListener("click", function(){
                var length = newVideo.duration;
                newVideo.playbackRate = -1;
                newVideo.currentTime = length;
      
                if (video.paused == true) {
                    video.play();
                  } else {
                    video.pause();
                }
                newVideo.play();
            },false);
        }
    }
}

function showHideControls(){
    var video = document.getElementById("video01");
    if (video.hasAttribute("controls")){
        video.removeAttribute("controls");
    }
    else{
        video.setAttribute("controls", "controls");
    }
}

function playlist(){
    linkList = [];
    currentVideo = 0;
    video = document.getElementById("video02");
    videoLinks = document.getElementsByTagName("figcaption")[0];
    source = document.getElementById("playlistsource");
    title = document.getElementById("videotitle")

    allLinks = videoLinks.children;
    console.log(allLinks);
    linkNum = allLinks.length;

    if (video.hasAttribute("controls")){
        video.removeAttribute("controls");
    }

    video.addEventListener("click", function() {
        if (video.paused == true) {
          video.play();
        } else {
          video.pause();
        }
    });

    (function() {
    function playVideo(index) {
    videoLinks.children[index].classList.add("currentvideo");
        source.setAttribute("src", allLinks[index].href);
        title.innerHTML = "Playing video " + allLinks[index].title;
        currentVideo = index;
        try {
            video.load();
            video.play(); 
        } catch (DomExcpetion) {
            console.log(DomExcpetion);  
        }
    }

    for (var i=0; i<linkNum; i++) {
    (function(index){
            allLinks[i].onclick = function(i){
            i.preventDefault();  
            for (var i=0; i<linkNum; i++) {
            allLinks[i].classList.remove("currentvideo");
            }
            playVideo(index);
            }    
        })(i);
    }

    video.addEventListener('ended', function () {
        console.log("event: ended");
        allLinks[currentVideo].classList.remove("currentvid");
        if ((currentVideo + 1) >= linkNum) { 
            nextVid = 0 
        } else { 
            nextVid = currentVideo+1 
        }
        playVideo(nextVid);
    })

    var indexOf = function(needle) {
        if(typeof Array.prototype.indexOf === 'function') {
            indexOf = Array.prototype.indexOf;
        } else {
            indexOf = function(needle) {
                var i = -1, index = -1;
                for(i = 0; i < this.length; i++) {
                    if(this[i] === needle) {
                        index = i;
                        break;
                    }}
                return index;
            };}
        return indexOf.call(this, needle);
    };
        index = indexOf.call(allLinks);
    })(); 
}

function playPauseBubble(){
    video = document.getElementById("video-bubble");
    if (video.paused == true) {
        video.play();
      } else {
        video.pause();
    }
}

function isURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(str);
}
