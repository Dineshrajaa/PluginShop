

                      /**Start of Function Definitions**/
      /**TOAST PLUGIN**/
function toastAlert(msg){
  //This is used for showing the alerts in Toast style in Center
  window.plugins.toast.showLongCenter(msg);
}

function customAlert(msg,title){
  navigator.notification.alert(msg,false,title);
}
      /**BATTERY PLUGIN**/
function onBatteryStatus(info) {
    //Callback method of Battery Status plugin
    if (info.isPlugged==true) {
    $("#btp").html(" Phone is Charging and you have <strong>"+ info.level +" % charge</strong>");//Works if Charging
    $("#batterypic").attr("src","img/plugged.png");
  }
    else {
    $("#btp").html(" Phone is on Battery and you have <strong>"+ info.level +" % charge</strong>");//Works on Battery
    $("#batterypic").attr("src","img/unplugged.png");
  }
    
}

      /**CONTACTS PLUGIN**/

function saveContact(){
  //Method to Save Contact in Phone
  var phoneNumbers = [];
  var newcontact=navigator.contacts.create();//Creates a new Contact object
  phoneNumbers[0]=new ContactField('mobile', $("#cnum").val(), true);//Creates a new Mobile number
  newcontact.nickname=$("#cname").val();//Creates a Nick Name in iOS
  newcontact.displayName=$("#cname").val();//creates Displayname in Android
  newcontact.phoneNumbers = phoneNumbers;  
  newcontact.save(onContactSaveSuccess,onContactSaveFail);//Saves the Contact
}
function onContactSaveSuccess(){
  toastAlert("Saved Contact Successfully");
}
function onContactSaveFail(){
  toastAlert("Unable to Save Contact");
}

function searchContact(){
  //Method to Search Contacts
  var options      = new ContactFindOptions();//Creates options for finding contacts
  options.filter   =$("#sname").val();//Creates a filter from the input
  options.multiple = true;//Returns multiple matching results
  
  options.desiredFields = [navigator.contacts.fieldType.phoneNumbers,navigator.contacts.fieldType.id,navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name,navigator.contacts.fieldType.nickname];// , navigator.contacts.fieldType.nickname Desired Fields in which the Filter has to be matched
  
var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name,navigator.contacts.fieldType.phoneNumbers];//,navigator.contacts.fieldType.nickname Fields in which the Filter has to be matched
  navigator.contacts.find(fields, onContactSearchSuccess, onContactSearchError, options);//Find contacts
}

/*function specificContactFetch(uid){
  //Method to Find the details of the specific contact
  var options      = new ContactFindOptions();//Creates options for finding contacts
  options.filter   =uid;//Creates a filter from the input
  options.multiple = false;//Returns multiple matching results
  options.desiredFields = [navigator.contacts.fieldType.id,navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.nickname,navigator.contacts.fieldType.phoneNumbers];//Desired Fields in which the Filter has to be matched
  var fields       = [navigator.contacts.fieldType.id,navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name,navigator.contacts.fieldType.phoneNumbers];//Fields in which the Filter has to be matched
  navigator.contacts.find(fields,onContactSelect,onContactSearchError);
}

function onContactSelect(contacts){
  alert(contacts.length);
}*/

function onContactSearchSuccess(contacts){
//Method to Print the list of contacts  
  $("#contactlist").html(" ");
  var platform=device.platform;
  var contactcontent,nums,namer;
  for(var i=0;i<contacts.length;i++){
    //Creates a Contact list based on the results obtained
    if (contacts[i].phoneNumbers && contacts[i].phoneNumbers.length) nums=contacts[i].phoneNumbers[0].value;
    else nums="No Number Available";
    namer=contacts[i].displayName || contacts[i].nickname || contacts[i].name.formatted;
    //if (platform=="iOS") {
      //Works only on iOS
    //$("#contactlist").append("<li id='"+contacts[i].id+"'><a href='#'>"+contacts[i].nickname+"</a></li>");
    contactcontent="<div data-role='collapsible' id='"+i+"'><h3>"+namer+"</h3> <p>"+nums+"</p></div>";
   // }
    //Works on Android
    // $("#contactlist").append("<li id='"+contacts[i].id+"'><a href='#'>"+contacts[i].displayName+"</a></li>");
    //else {
      //contactcontent="<div data-role='collapsible' id='"+i+"'><h3>"+contacts[i].displayName+"</h3> <p>"+nums+"</p></div>";
    //}
    nums=" ";
    $( "#contactlist" ).append(contactcontent).collapsibleset( "refresh" );
  }
  //$("#contactlist").listview("refresh");
}

function onContactSearchError(contactError){
  alert('onError!');
}

function pickContact(){
  //Method to display Contact Picker
  navigator.contacts.pickContact(onContactPick,onContactSearchError);
}

function onContactPick(contact){
  //Callback Function for ContactPick
  var selectedcontactdata=JSON.stringify(contact);
  var parsedcontact=JSON.parse(selectedcontactdata); 
  var names=parsedcontact.displayName || parsedcontact.nickname;
  var nums; 
  if (contact.phoneNumbers && contact.phoneNumbers.length) nums=contact.phoneNumbers[0].value;
  else nums="No Number Available";
  $(":mobile-pagecontainer").pagecontainer("change","#pickedcontactdata-page");  
  $("#pcp").html("<strong>Name:</strong><br/>"+names+"<br/><strong>Number:</strong><br/>"+nums);

}

      /**DEVICE PLUGIN**/
function deviceCheck(){
    //$("#dp").text("");
    var cordova_version=device.cordova;
    var device_model=device.model;
    var platform=device.platform;
    var uuid=device.uuid;
    var version=device.version;    
    $("#dp").html('<strong>Cordova version:</strong><br/>'+ cordova_version+'<br/>'+'<strong>Device Model:</strong><br/>'+ device_model+'<br/>'+'<strong>OS Name:</strong><br/>'+ platform+'<br/>'+'<strong>UUID:</strong><br/>'+ uuid+'<br/>'+'<strong>OS version:</strong><br/>'+ version);
    if (platform=="iOS") $("#ospic").attr("src","img/ios.png");
    else if (platform=="Android") $("#ospic").attr("src","img/android.png");
    else $("#ospic").remove();
}

      /**GEOLOCATION PLUGIN**/
  //Called to get Geolocation Info
  var geolocationSuccess=function(position){    
    $("#gp").text(" ");
$("#gp").html('Latitude:<br/> '      + position.coords.latitude          + '<br/>' +
          'Longitude:<br/>'         + position.coords.longitude         + '<br/>' +
          'Altitude:<br/>'          + position.coords.altitude          + '<br/>' +
          'Accuracy:<br/>'          + position.coords.accuracy          + '<br/>' +
          'Altitude Accuracy:<br/>' + position.coords.altitudeAccuracy  + '<br/>' +
          'Heading:<br/>'           + position.coords.heading           + '<br/>' +
          'Speed:<br/>'             + position.coords.speed             + '<br/>' +
          'Timestamp:<br/>'         + position.timestamp                + '<br/>');
  }

  //Called on Geolocation Error
  function geolocationError(error){    
  customAlert("Please Turn on GPS","Geolocation Alert");
  }

  //Called to Print Geolocation Value in a Paragraph
  function onGeolocationSuccess(position){
    var geopara=document.getElementById('georeading');
    geopara.innerHTML='Latitude: '  + position.coords.latitude      + '<br/>' +
                        'Longitude: ' + position.coords.longitude     + '<br/>' +
                        '<hr />'      + geopara.innerHTML;
  }

      /**INTERNET-INFORMATION PLUGIN**/
function checkConnection() {
    $("#np").text(" ");
    networkState = navigator.connection.type;
    alert("Network State: "+networkState);    
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
    $("#np").text('Connection type: ' + states[networkState]);
    if(networkState=="none" || "unknown") $("#nwkpic").attr("src","img/none.png");
    else if(networkState=="2g") $("#nwkpic").attr("src","img/2g.png");
    else if(networkState=="3g") $("#nwkpic").attr("src","img/3g.png");
    else if(networkState=="4g") $("#nwkpic").attr("src","img/4g.png");
    else if(networkState=="wifi")    $("#nwkpic").attr("src","img/wifi.png");
    else if(networkState=="ethernet")    $("#nwkpic").attr("src","img/ethernet.png");
    else {
      alert("Came to Else");
      $("#nwkpic").attr("src","img/none.png")
    };

    
}


      /**ACCELEROMETER PLUGIN**/
/*function accelerometerSuccess(acceleration) {
    toastAlert(
          'Acceleration X: ' + acceleration.x + '\n' +
          'Acceleration Y: ' + acceleration.y + '\n' +
          'Acceleration Z: ' + acceleration.z + '\n' +
          'Timestamp: '      + acceleration.timestamp + '\n');
}
//Not Working
function onWatchAccelSuccess(acceleration){
  //toastAlert("I am working");
var acceleratoReading=document.getElementById("accelreading");
      acceleratoReading.innerHTML= 'Acceleration X: ' + acceleration.x + '\n' +
          'Acceleration Y: ' + acceleration.y + '\n' +
          'Acceleration Z: ' + acceleration.z + '\n' +
          'Timestamp: '      + acceleration.timestamp + '\n';
}

function accelerometerError() {
    toastAlert('onError!');
}; 
function accelBall(){  
  //Method to move the ball on screen based on the Device motion
    iW = window.innerWidth-5;//Measures screen width     
    iH = window.innerHeight-88;//Measures screen Height     
    canvas= document.getElementById('myCanvas');//Selects the canvas which is present in the html page
    cnv = canvas.getContext("2d");
    cnv.canvas.width = iW;
    cnv.canvas.height = iH;
    target=new Image();//Creates a new Image object
    target.src = "Bomb.png";//Sets source for Image object
    xPos = (iW-target.width)/2;
    yPos = (iH-target.height)/2;    
    target.onload = function()
      {
          cnv.drawImage(target, xPos, yPos);//Renders Image on screen
      }
   watch = navigator.accelerometer.watchAcceleration(success, 
          failure, {frequency: 100});//Watches accelerometer readings
}
function success(accel){
  cnv.clearRect(0, 0, canvas.width, canvas.height);//clears the canvas
    xPos += -1*(accel.x * 1.5);
    yPos += (accel.y * 1.5);    
    if (xPos>iW||yPos>iH) {
      //If the Ball crosses the Device height it gets cleared 
      cnv.clearRect(0, 0, canvas.width, canvas.height);
      accelBall();
    }
    else cnv.drawImage(target, xPos, yPos);
    
  }
  function failure()
            {
                toastAlert("Error");
            }
*/
      /**CAMERA PLUGIN**/
//Used to save the Picture took in Camera in base64 format
function onDataCameraSuccess(imageData){
    var pic=document.getElementById("picbox");
    pic.src = "data:image/jpeg;base64," + imageData;
}

//Used to save the Picture took in Camera as FileURL
function onFileCameraSuccess(imageURI){
    var pic=document.getElementById("picbox");
    pic.src = imageURI;    
    toastAlert("Picture saved in " +imageURI);    
}


function onCameraFail(message){
  toastAlert(message);
}

      /**DIALOGS PLUGIN**/

          /*Alert Box Methods*/
//Used to Open an Alertbox
function dialogAlerter(){
navigator.notification.alert("This is an Alert box created using Notification Plugin",alertExit,"Alert Dialog","Understood");
}

//Called when alertbox closed
function alertExit(){
  toastAlert("You have closed an Alert box");
}
          /*Confirm Box Methods*/
//Used to Open Confirmbox
function confirmAlerter(){
  navigator.notification.confirm("This is an Confirmbox",confirmExit,"Confirm Dialog",['Ok','Cancel']);
}

//Called when Confirmbox closed
function confirmExit(buttonIndex){
  if (buttonIndex==1) toastAlert("You have Clicked Ok Button");
  else toastAlert("You have Clicked Cancel Button")
}
          /*Prompt Box Methods*/
//Used to Open Promptbox
function promptAlerter(){
  navigator.notification.prompt("Enter Your Name",promptExit,"Prompt Dialog",['Save','Cancel']);
}

//Called when Promptbox Closed
function promptExit(results){
  if (results.buttonIndex==1&&results.input1!="")toastAlert("Welcome "+results.input1);
  else toastAlert("Sorry to let you go"); 
}
          /*Beep Methods*/
//Used to Produce Beep Button
function beepAlerter(){
  navigator.notification.beep(2);
}

          /**End of Function Definitions**/

          /**Start of Function Calls**/

$(document).ready(function(){
    //DOM Fully Loaded
          //Global Declarations
    var iW=window.innerWidth;
    var iH=window.innerHeight;
    var hH=$('header').outerHeight() || 0;
    var fH=$('footer').outerHeight() || 0;
  //var hW=$('header').outerWidth() || 0;
  //var fW=$('footer').outerWidth() || 0;
    var canvas_ctx;
    var x; // Circle x position
    var y; // Circle Y position
    var ax = 0;//Acceleration X axis
    var ay = 0;//Acceleration Y axis
    var vx = 0;// Velocity x axis
    var vy = 0;// Velocity y axis    
    var DISTANCE_FACTOR = .1;
    var drawID;// Draw time interval.
    var SPEED = 180;
    var WIDTH = iW-20;                // Width of canvas
    var HEIGHT = iH-hH-fH-5;               // -(hH+fH)Height of canvas
    var RADIUS = 30;                // Width of circle object
    var CIRCLE_COLOR = "#f00";      // Circle color
    var CANVAS_COLOR = "#FAF7F8";   // Color of canvas background
    var watchID;                    // Accelerometer.watchAcceleration return value. 
    var drawID;                     // Draw time interval. 
    var playing = true;             // Boolean if animation is playing.
    var watch,networkState;
          //var iW,iH,canvas,cnv,target,xPos,yPos
          document.addEventListener("deviceready",function(){
            //Device Ready
            $(document).on("pageinit","#vibration",function() {
        //Makes the Map to appear properly                                
           if (device.platform=="iOS") $("#patternedvib").remove();                        
        });
            

            /**Network Check**/
            if (navigator.connection.type=="none") alert("Please Connect to Internet for best perfomance");


                  /**BATTERY PLUGIN**/

            //Used for checking the battery status
          $("#btcha").tap(function(){ 
            $(":mobile-pagecontainer").pagecontainer("change","#battery");          
            window.addEventListener("batterystatus", onBatteryStatus, false);
                      });

                  /**CAMERA PLUGIN**/

      //Used for taking Picture and returning the picture in Base64 format
      $("#tkpicbasebtn").tap(function(){        
        navigator.camera.getPicture(onDataCameraSuccess,onCameraFail, {quality: 50,allowEdit: true,
    destinationType: Camera.DestinationType.DATA_URL});
              });

      //Used for Taking Picture and returning the File Path
      $("#tkpicfileurlbtn").tap(function(){
          navigator.camera.getPicture(onFileCameraSuccess, onCameraFail, { quality: 50,
    destinationType: Camera.DestinationType.FILE_URI });
        });

      //Used for Opening the Gallery
      /*$("#tkpicgallery").tap(function(){        
        navigator.camera.getPicture(onFileCameraSuccess, onCameraFail,
     {sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM});
      }); */

      $("#tkpiclibrary").tap(function(){
navigator.camera.getPicture(onFileCameraSuccess, onCameraFail,
     {sourceType: Camera.PictureSourceType.PHOTOLIBRARY});
      });

                /**CONTACT PLUGIN**/

      //Used to Prompt a Dialog to Enter new contact details and save 
      $("#scbtn").tap(saveContact);//Method to Save Contacts
      
      $("#secbtn").tap(searchContact);//Method to Search Contacts  

      $("#pickcontactbtn").tap(pickContact);//Method to Pick Contact  

      $(document).on("tap","#contactlist li",function(){
        specificContactFetch($(this).attr("id"));
      });   

                /**DEVICE PLUGIN**/

       //Used for Checking Device Informations
      $("#deviceinfobtn").tap(deviceCheck);

                /**INTERNET-INFORMATION PLUGIN**/

      //Used for Checking Internet Informations
      $("#connectchkbtn").tap(checkConnection);


                /**DEVICE MOTION PLUGIN**/

      //Used for Accelerometer Current Device Position
      $("#accel").tap(function(){
        //navigator.accelerometer.getCurrentAcceleration(accelerometerSuccess, accelerometerError);
        //accelBall();
        showCanvas();
      });

      //Used for Accelerometer Device Movement tracking
      /*$("#accelwatch").tap(function(){
        var accelId=navigator.accelerometer.watchAcceleration(onWatchAccelSuccess,accelerometerError,{frequency:1000});
      });*/

      

                /**DIALOGS PLUGIN**/

    //Used for Opening the Alert box
    $("#alertbtn").tap(dialogAlerter);

    //Used for Opening the Confirm box
    $("#confirmbtn").tap(confirmAlerter);

    //Used for Opening the Prompt box
    $("#promptbtn").tap(promptAlerter);

    //Used for Producing Beep Alert
    $("#beepbtn").tap(beepAlerter);

              /**GEOLOCATION PLUGIN**/

    //Used for Getting the GPS info of the device
    $("#curlocation").tap(function(){
      //toastAlert("I am tapped");
      var geoOptions = {maximumAge: 0, timeout: 10000, enableHighAccuracy:true};
      navigator.geolocation.getCurrentPosition(geolocationSuccess,geolocationError,geoOptions);
    });

    //Used to Print GPS info in a paragraph
    $("#locationwatch").tap(function(){
      var geowatch=navigator.geolocation.watchPosition(onGeolocationSuccess,geolocationError);
    });

    /**Vibration Plugin**/

    $("#simplevib").tap(function(){
      //Generates Simple Vibration
      navigator.vibrate(3000);
    });

    $("#patternedvib").tap(function(){
      //Generates Patterned Vibration
      navigator.vibrate([1000, 1000, 3000, 1000, 5000]);
    });

              /**INAPPBROWSER PLUGIN**/

    //Used for Opening an Inappbrowser
    $("#inappbtn").tap(function(){
      var extPage=window.open('https://www.facebook.com/dineshraja.Labinix', '_blank', 'location=yes');
    });

              /**SPLASHSCREEN PLUGIN**/

    //Used to Show the Splash Screen
    $("#showsplash").tap(function(){
      navigator.splashscreen.show();
      setTimeout(function() {
        navigator.splashscreen.hide();
    }, 3000);
    //navigator.splashscreen.show(3000);
    });  

    //Displays information about the app
    $(".informer").tap(function(){
      customAlert("PluginShop"+"\n"+"Version-0.0.1"+"\n"+"Developer-Dinesh Raja","About");
    });     
    
    StatusBar.overlaysWebView(false);
     
      });         
          },false);
        