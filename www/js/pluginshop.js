

                      /**Start of Function Definitions**/
      /**TOAST PLUGIN**/
function toastAlert(msg){
  //This is used for showing the alerts in Toast style in Center
  window.plugins.toast.showLongCenter(msg);
}
      /**BATTERY PLUGIN**/
function onBatteryStatus(info) {
    $("#btp").text(" ");
    if (info.isPlugged==true) $("#btp").text(" Phone is Charging and you have "+ info.level +" % charge");
    else $("#btp").text(" Phone is on Battery and you have "+ info.level +" % charge"); 
    /*setTimeout(function() {
        $(document).off("batterystatus", function(info){
          alert("Removed Battery Status");
        });
    }, 3000);   */
}

      /**CONTACTS PLUGIN**/

/*function contactPrompt(){
  navigator.notification.prompt("Contact Name","Contact Number",contactPromptExit,"Create New Contact",['Save','Cancel']);
}*/
function saveContact(){
  //Method to Save Contact in Phone
  var phoneNumbers = [];
  var newcontact=navigator.contacts.create();
  phoneNumbers[0]=new ContactField('mobile', $("#cnum").val(), true);
  newcontact.nickname=$("#cname").val();
  newcontact.displayName=$("#cname").val();
  newcontact.phoneNumbers = phoneNumbers;  
  newcontact.save(onContactSaveSuccess,onContactSaveFail);
}
function onContactSaveSuccess(){
  toastAlert("Saved Contact Successfully");
}
function onContactSaveFail(){
  toastAlert("Unable to Save Contact");
}

function searchContact(){
  //Method to Search Contacts
  var options      = new ContactFindOptions();
  options.filter   =$("#sname").val();
  options.multiple = true;
  options.desiredFields = [navigator.contacts.fieldType.id,navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
  var fields       = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
  navigator.contacts.find(fields, onContactSearchSuccess, onContactSearchError, options);
}

function onContactSearchSuccess(contacts){
  //alert('Found ' + contacts.length + ' contacts.');
  $("#contactlist").html(" ");
  var platform=device.platform;
  for(var i=0;i<contacts.length;i++){
    if (platform=="iOS") {
    $("#contactlist").append("<li id='"+i+"'><a href='#'>"+contacts[i].nickname+"</a></li>");
    }
    else $("#contactlist").append("<li id='"+i+"'><a href='#'>"+contacts[i].displayName+"</a></li>");
  }
  $("#contactlist").listview("refresh");
}

function onContactSearchError(contactError){
  alert('onError!');
}

      /**DEVICE PLUGIN**/
function deviceCheck(){
    $("#dp").text("");
    var cordova_version=device.cordova;
    var device_model=device.model;
    var platform=device.platform;
    var uuid=device.uuid;
    var version=device.version;    
    $("#dp").text(
        "Cordova version:"+ cordova_version+"\n"+ 
        "Device Model:"+ device_model+"\n"+
        "OS Name:"+ platform+"\n"+
        "UUID:"+ uuid+"\n"+
        "OS version:"+ version
        );
}

      /**GEOLOCATION PLUGIN**/
  //Called to get Geolocation Info
  var geolocationSuccess=function(position){    
    $("#gp").text(" ");
$("#gp").text('Latitude: '      + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
  }

  //Called on Geolocation Error
  function geolocationError(error){
    //alert('code: '    + error.code    + '\n' +
          //'message: ' + error.message + '\n');
  alert("Please Turn on GPS");
  }

  //Called to Print Geolocation Value in a Paragraph
  function onGeolocationSuccess(position){
    var geopara=document.getElementById('georeading');
    geopara.innerHTML='Latitude: '  + position.coords.latitude      + '\n' +
                        'Longitude: ' + position.coords.longitude     + '\n' +
                        '<hr />'      + geopara.innerHTML;
  }

      /**INTERNET-INFORMATION PLUGIN**/
function checkConnection() {
    $("#np").text(" ");
    networkState = navigator.connection.type;
    //alert(networkState);
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
}; */
function accelBall(){
  //alert("I am Going to Accelerate Ball");
     iW = window.innerWidth;
     iH = window.innerHeight;
     //alert("iW: "+iW+"iH: "+iH);
     canvas= document.getElementById('myCanvas');
    cnv = canvas.getContext("2d");
    cnv.canvas.width = iW;
    cnv.canvas.height = iH-40;
    target=new Image();
    target.src = "Bomb.png";
    xPos = (iW-target.width)/2;
    yPos = (iH-target.height)/2;
    //alert("xpos: "+xPos+"ypos: "+yPos);
    target.onload = function()
      {
          cnv.drawImage(target, xPos, yPos);
      }
   watch = navigator.accelerometer.watchAcceleration(success, 
          failure, {frequency: 100});
}
function success(accel){
  cnv.clearRect(0, 0, canvas.width, canvas.height);
    xPos += -1*(accel.x * 1.5);
    yPos += (accel.y * 1.5);
    //alert("cxpos: "+xPos+"cypos: "+yPos);
    if (xPos>iW||yPos>iH) {
      cnv.clearRect(0, 0, canvas.width, canvas.height);
      accelBall();}
    else cnv.drawImage(target, xPos, yPos);
    
  }
  function failure()
            {
                toastAlert("Error");
            }

      /**CAMERA PLUGIN**/
//Used to save the Picture took in Camera in base64 format
function onDataCameraSuccess(imageData){
    var pic=document.getElementById("picbox");
  pic.src = "data:image/jpeg;base64," + imageData;
}

//Used to save the Picture took in Camera as FileURL
function onFileCameraSuccess(imageURI){
    var pic=document.getElementById("picbox");
    pic.src="";
    toastAlert("Picture saved in " +imageURI);
    pic.src = imageURI;
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

          var iW,iH,canvas,cnv,target,xPos,yPos,watch,networkState;
          document.addEventListener("deviceready",function(){
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
      $("#tkpicgallery").tap(function(){
        
        navigator.camera.getPicture(onFileCameraSuccess, onCameraFail,
     {sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM});
      });

      $("#tkpiclibrary").tap(function(){
navigator.camera.getPicture(onFileCameraSuccess, onCameraFail,
     {sourceType: Camera.PictureSourceType.PHOTOLIBRARY});
      });

                /**CONTACT PLUGIN**/
      //Used to Prompt a Dialog to Enter new contact details and save 
      $("#scbtn").tap(saveContact);//Method to Save Contacts
      
      $("#secbtn").tap(searchContact);//Method to Search Contacts        

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
        accelBall();
      });
      //Used for Accelerometer Device Movement tracking
      $("#accelwatch").tap(function(){
        var accelId=navigator.accelerometer.watchAcceleration(onWatchAccelSuccess,accelerometerError,{frequency:1000});
      });

      

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
      navigator.vibrate(3000);
    });

    $("#patternedvib").tap(function(){
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
      /*navigator.splashscreen.show();
      setTimeout(function() {
        navigator.splashscreen.hide();
    }, 2000);*/
    navigator.splashscreen.show(3000);
    });  

    $(".informer").tap(function(){
      alert("PluginShop"+"\n"+"Version-0.0.1"+"\n"+"Developer-Dinesh Raja");
    })     
    
     
      });         
          },false);
        