

                      /**Start of Function Definitions**/
      /**TOAST PLUGIN**/
function toastAlert(msg){
  //This is used for showing the alerts in Toast style in Center
  window.plugins.toast.showLongCenter(msg);
}

function customAlert(msg,title){
  //This is a common template for generating native looking alerts
  navigator.notification.alert(msg,false,title);
}
      /**BATTERY PLUGIN**/
function onBatteryStatus(info) {
    //Callback method of Battery Status plugin
    if (info.isPlugged==true) {
      //Works if device is on charge
    $("#btp").html(" Phone is Charging and you have <strong>"+ info.level +" % charge</strong>");//Prints the battery status in a div
    $("#batterypic").attr("src","img/plugged.png");//shows charging picture
  }
    else {
      //works when device is on battery
    $("#btp").html(" Phone is on Battery and you have <strong>"+ info.level +" % charge</strong>");//Prints the battery status in a div
    $("#batterypic").attr("src","img/unplugged.png");//shows on battery picture
  }
    
}

      /**CONTACTS PLUGIN**/

function saveContact(){
  //Method to Save Contact in device contacts database
  var phoneNumbers = [];
  var newcontact=navigator.contacts.create();//Creates a new Contact object
  phoneNumbers[0]=new ContactField('mobile', $("#cnum").val(), true);//Creates a new Mobile number
  newcontact.nickname=$("#cname").val();//Creates a Nick Name in iOS
  newcontact.displayName=$("#cname").val();//creates Displayname in Android
  newcontact.phoneNumbers = phoneNumbers;  
  newcontact.save(onContactSaveSuccess,onContactSaveFail);//Saves the Contact
}
function onContactSaveSuccess(){
  //Success Callback function of saveContact method
  toastAlert("Saved Contact Successfully");
}
function onContactSaveFail(){
  //Failure Callback function of saveContact method
  customAlert("Unable to Save Contact","Contact Error");
}

function searchContact(){
  //Method to Search Contacts
  var options      = new ContactFindOptions();//Creates options for finding contacts
  options.filter   =$("#sname").val();//Creates a filter from the input
  options.multiple = true;//Returns multiple matching results
  
  options.desiredFields = [navigator.contacts.fieldType.phoneNumbers,navigator.contacts.fieldType.id,navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name,navigator.contacts.fieldType.nickname];//Fields that has to be in results
  
var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name,navigator.contacts.fieldType.phoneNumbers];//Fields in which the Filter has to be matched
  navigator.contacts.find(fields, onContactSearchSuccess, onContactSearchError, options);//Find contacts
}



function onContactSearchSuccess(contacts){
//Success Callback function of searchContact method  
  $("#contactlist").html(" ");//Removes all the results from the list  
  var contactcontent,nums,namer;
  for(var i=0;i<contacts.length;i++){
    //Creates a Contact list based on the results obtained
    if (contacts[i].phoneNumbers && contacts[i].phoneNumbers.length) nums=contacts[i].phoneNumbers[0].value;//If the contact have phonenumber the preffered contact will be stored
    else nums="No Number Available";//If no number available for the contact
    namer=contacts[i].displayName || contacts[i].nickname || contacts[i].name.formatted; //Based on the platform the name will be assigned   
    contactcontent="<div data-role='collapsible' id='"+i+"'><h3>"+namer+"</h3> <p>"+nums+"</p></div>";
   //Creates data for collapsible
    nums=" ";
    $( "#contactlist" ).append(contactcontent).collapsibleset( "refresh" );//Creates the collapsible
  }
  //$("#contactlist").listview("refresh");
}

function onContactSearchError(contactError){
  //Failure Callback function of searchContact method
  customAlert("Unable to Search Contact","Contact Error");
}

function pickContact(){
  //Method to display Contact Picker
  navigator.contacts.pickContact(onContactPick,onContactSearchError);//Opens the native contact picker of the device
}

function onContactPick(contact){
  //Callback Function for pickContact method
  var selectedcontactdata=JSON.stringify(contact);
  var parsedcontact=JSON.parse(selectedcontactdata); 
  var names=parsedcontact.displayName || parsedcontact.nickname;
  var nums; 
  if (contact.phoneNumbers && contact.phoneNumbers.length) nums=contact.phoneNumbers[0].value;
  else nums="No Number Available";
  $(":mobile-pagecontainer").pagecontainer("change","#pickedcontactdata-page");  
  $("#pcp").html("<strong>Name:</strong><br/>"+names+"<br/><strong>Number:</strong><br/>"+nums);

}

function listAllContacts(){
  //Method to search all the contacts 
  $(":mobile-pagecontainer").pagecontainer("change","#listcontact-page");//Change to contact listing page
  $.mobile.loading( "show", {
text: "Loading Contacts",
textVisible: true,
theme: "b"
});//Displays Loading while the contacts are being appended
  var options      = new ContactFindOptions();
  options.filter   ="";//To return all the contacts no filter is specified
  options.multiple = true;
  options.desiredFields = [navigator.contacts.fieldType.phoneNumbers,navigator.contacts.fieldType.id,navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name,navigator.contacts.fieldType.nickname];//Results needed to be returned
  var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name,navigator.contacts.fieldType.phoneNumbers];//Fields on which pattern has to be matched
  navigator.contacts.find(fields, onContactListSuccess, onContactSearchError, options);

}

function onContactListSuccess(contacts){
  
 //Method to append all the contacts to the ContactList 
  $("#fullcontactlist").html(" ");//Clears the previous results to avoid redundant data 
  setTimeout(function(){$.mobile.loading("hide")},5000);//Set timeout to hide the loader  
  var contactcontent;
  var nums,namer;
  for(var i=0;i<contacts.length;i++){
    if (contacts[i].phoneNumbers && contacts[i].phoneNumbers.length) nums=contacts[i].phoneNumbers[0].value;//If the contact have a number it will be added
    else nums="No Number Available";
    namer=contacts[i].displayName || contacts[i].nickname || contacts[i].name.formatted;
    //contactcontent="<div data-role='collapsible' id='"+i+"'><h3>"+namer+"</h3> <p>"+nums+"</p></div>";
    contactcontent="<li><a href='#'><h3>"+namer+"</h3><p>"+nums+"</p></a></li>";
    nums=" "; 
    $( "#fullcontactlist" ).append(contactcontent).listview( "refresh" );//Creates the listview with the data gathered   
  }

  
}



      /**DEVICE PLUGIN**/
function deviceCheck(){
    //$("#dp").text("");
    var cordova_version=device.cordova;//stores cordova webview version
    var device_model=device.model;//stores the device model
    var platform=device.platform;//stores the platform running on the device
    var uuid=device.uuid;//stores the uuid of the device
    var version=device.version;//stores the os version of the device   
    $("#dp").html('<strong>Cordova version:</strong><br/>'+ cordova_version+'<br/>'+'<strong>Device Model:</strong><br/>'+ device_model+'<br/>'+'<strong>OS Name:</strong><br/>'+ platform+'<br/>'+'<strong>UUID:</strong><br/>'+ uuid+'<br/>'+'<strong>OS version:</strong><br/>'+ version);//Prints the data in a div
    if (platform=="iOS") $("#ospic").attr("src","img/ios.png");//shows ios logo if the platform is iOS
    else if (platform=="Android") $("#ospic").attr("src","img/android.png");//shows android logo if the platform is Android
    else $("#ospic").remove();//Removes the picture frame if its neither Android nor iOS
}

      /**GEOLOCATION PLUGIN**/
  //Success Callback function of Geolocation plugin
  var geolocationSuccess=function(position){
  var lat=position.coords.latitude || 11.0347316;
  var lon=position.coords.longitude || 76.9518059;
  var alt=position.coords.altitude || 193.1;
  var acc=position.coords.accuracy || 96;
  var altacc=position.coords.altitudeAccuracy  || 12.38632639123;
  var head=position.coords.heading || 306;
  var speed=position.coords.speed || 0;
  var ts=position.timestamp;
    $("#gp").text(" ");//clears the old data
$("#gp").html('Latitude:<br/> '     + lat          + '<br/>' +
          'Longitude:<br/>'         + lon          + '<br/>' +
          'Altitude:<br/>'          + alt          + '<br/>' +
          'Accuracy:<br/>'          + acc          + '<br/>' +
          'Altitude Accuracy:<br/>' + altacc       + '<br/>' +
          'Heading:<br/>'           + head         + '<br/>' +
          'Speed:<br/>'             + speed        + '<br/>' +
          'Timestamp:<br/>'         + ts           + '<br/>');
  }

  
  function geolocationError(error){
  //Failure Callback function of Geolocation plugin    
  customAlert("Please Turn on GPS","Geolocation Alert");
  }

  
      /**INTERNET-INFORMATION PLUGIN**/
function checkConnection() {
  //Method to Check the network information of the device
    $("#np").text(" ");//Clears the old data
    networkState = navigator.connection.type;//checks the networkstate
        
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

    switch(navigator.connection.type){
      //Switch loop to show the picture based on the network type
      case Connection.UNKNOWN:
        $("#nwkpic").attr("src","img/none.png");//Unknown internet
        break;
      case Connection.CELL_2G:
        $("#nwkpic").attr("src","img/2g.png");//2G internet
        break;
      case Connection.CELL_3G:
        $("#nwkpic").attr("src","img/3g.png");//3G internet
        break;
      case Connection.CELL_4G:
        $("#nwkpic").attr("src","img/4g.png");//4G internet
        break;
      case Connection.WIFI:
        $("#nwkpic").attr("src","img/wifi.png");//WiFi internet
        break;
      default:
         $("#nwkpic").attr("src","img/none.png");//No internet
         break;     
    }

    
}


      
      /**CAMERA PLUGIN**/
function onDataCameraSuccess(imageData){
  //Success Callback function of dataCamera method    
    $("#picbox").attr("src","data:image/jpeg;base64,"+imageData);//Used to display the Picture took in Camera as DataURL
}


function onFileCameraSuccess(imageURI){
  //Success Callback function of fileCamera method      
      $("#picbox").attr("src",imageURI);//Used to display the Picture took in Camera as FileURL
    toastAlert("Picture saved in " +imageURI);    
}


function onCameraFail(message){
  //Failure Callback function of Camera methods
  customAlert(message,"Camera Error");//shows a customAlert
}

                        /**DIALOGS PLUGIN**/

          /*Alert Box Methods*/ 
function dialogAlerter(){
  //Method to Open a Alertbox
navigator.notification.alert("This is an Alert box created using Notification Plugin",alertExit,"Alert Dialog","Understood");
}


function alertExit(){
  //Success Callback function of dialogAlerter method
  toastAlert("You have closed an Alert box");
}
          /*Confirm Box Methods*/
function confirmAlerter(){
  //Method to open a confirm dialog
  navigator.notification.confirm("This is an Confirmbox",confirmExit,"Confirm Dialog",['Ok','Cancel']);
}

//Called when Confirmbox closed
function confirmExit(buttonIndex){
  //Success Callback function of confirmAlerter method
  if (buttonIndex==1) toastAlert("You have Clicked Ok Button");//Based on the button pressed alerts shown
  else toastAlert("You have Clicked Cancel Button")
}
          /*Prompt Box Methods*/
 
function promptAlerter(){
  //Method to open a Promptbox
  navigator.notification.prompt("Enter Your Name",promptExit,"Prompt Dialog",['Save','Cancel']);
}


function promptExit(results){
  //Success Callback function of promptAlerter method
  if (results.buttonIndex==1&&results.input1!="")toastAlert("Welcome "+results.input1);
  else toastAlert("Sorry to let you go"); 
}
          
 
function beepAlerter(){
  //Method to generate default notification sound of the device twice
  navigator.notification.beep(2);
}

          /**End of Function Definitions**/

          /**Start of Function Calls**/

$(document).ready(function(){
    //DOM Fully Loaded
          //Global Declarations
         
          var watch,networkState;          
          document.addEventListener("deviceready",function(){
                      //Device Ready
           
            $(document).on("pageinit","#vibration",function() {
                      //During the creation of vibration page                  
           if (device.platform=="iOS") $("#patternedvib").remove();  //If platform is iOS remove the patterned vibration button                      
        });
            

            /**Network Check**/
            if (navigator.connection.type=="none") customAlert("Please Connect to Internet for best perfomance","Network Request");//If no internet is available during the deviceready alert generated


                  /**BATTERY PLUGIN call**/

            //Used for checking the battery status
          $("#btcha").tap(function(){ 
            //Binded with btcha li
            $(":mobile-pagecontainer").pagecontainer("change","#battery"); //Change to Battery page         
            window.addEventListener("batterystatus", onBatteryStatus, false);//Add batterystatus event
                      });

                  /**CAMERA PLUGIN calls **/

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
      
      //Used for opening picture library
      $("#tkpiclibrary").tap(function(){
navigator.camera.getPicture(onFileCameraSuccess, onCameraFail,
     {sourceType: Camera.PictureSourceType.PHOTOLIBRARY});
      });

                /**CONTACT PLUGIN calls **/

      //Used to Prompt a Dialog to Enter new contact details and save 
      $("#scbtn").tap(saveContact);//Invokes saveContact method
      
      $("#secbtn").tap(searchContact);//Invokes searchContact method  

      $("#pickcontactbtn").tap(pickContact);//Invokes pickContact method 

      $("#listcontactbtn").tap(listAllContacts);//Invokes listAllContacts method



                /**DEVICE PLUGIN calls **/

       //Used for Checking Device Informations
      $("#deviceinfobtn").tap(deviceCheck);//Invokes deviceCheck method

                /**INTERNET-INFORMATION PLUGIN call**/

      //Used for Checking Internet Informations
      $("#connectchkbtn").tap(checkConnection);//Invokes checkConnection method
                

      

                /**DIALOGS PLUGIN calls**/

    //Used for Opening the Alert box
    $("#alertbtn").tap(dialogAlerter);//Invokes dialogAlerter method

    //Used for Opening the Confirm box
    $("#confirmbtn").tap(confirmAlerter);//Invokes confirmAlerter method

    //Used for Opening the Prompt box
    $("#promptbtn").tap(promptAlerter);//Invokes promptAlerter method

    //Used for Producing Beep Alert
    $("#beepbtn").tap(beepAlerter);//Invokes beepAlerter method

              /**GEOLOCATION PLUGIN call**/

    //Used for Getting the GPS info of the device
    $("#curlocation").tap(function(){  
      //Binded with curlocation    
      var geoOptions = {maximumAge: 0, timeout: 10000, enableHighAccuracy:true};
      navigator.geolocation.getCurrentPosition(geolocationSuccess,geolocationError,geoOptions);
    });

    

            /**VIBRATION PLUGIN call**/

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
      navigator.splashscreen.show();//Shows splash screen
      setTimeout(function() {
        navigator.splashscreen.hide();
    }, 3000);//Hides splash screen after 3 secs    
    });  

    //Displays information about the app
    $(".informer").tap(function(){
      customAlert("PluginShop"+"\n"+"Version-0.0.1"+"\n"+"Developer-Dinesh Raja","About");
    });     
    
    StatusBar.overlaysWebView(false);//Avoids  Statusbar overlaying webview    
      });         
          },false);
        