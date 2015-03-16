$(document).ready(function(){
	var iW=window.innerWidth;//stores device width
	var iH=window.innerHeight;//stores device height
	var hH=$('header').outerHeight() || 0;//stores header height if exists
	var fH=$('footer').outerHeight() || 0;//stores footer height if exists
	var canvas_ctx;//variable to store canvas context
	var x; // Circle x position
    var y; // Circle Y position
    var ax = 0;//Acceleration X axis
    var ay = 0;//Acceleration Y axis
    var vx = 0;// Velocity x axis
    var vy = 0;// Velocity y axis    
    var DISTANCE_FACTOR = .1;
    var drawID;// Draw time interval.
    var SPEED = 25;//Speed of the accelerometer
    var WIDTH = iW;// Width of canvas
    var HEIGHT = iH-hH-fH;          // Height of canvas
    var RADIUS = 10;                // Width of circle object
    var CIRCLE_COLOR = "#f00";      // Circle color
    var CANVAS_COLOR = "#FAF7F8";   // Color of canvas background
    var watchID;                    // Accelerometer.watchAcceleration return value. 
    var drawID;                     // Draw time interval. 
    var playing = true;             // Boolean if animation is playing. 
	

    function showCanvas(){
        //Method to draw canvas
    	var canvas = document.getElementById("canvas");
        canvas.height=HEIGHT;
        canvas.width=WIDTH;
        canvas_ctx = canvas.getContext("2d");                    
        x = WIDTH / 2 ;
        y = HEIGHT/ 2 ;
        
        startPlay();
    }

    /* Steps to start animation play */
                function startPlay()
                {
                    playing = true;
                    vx = 0;
                    vy = 0;
                    startWatch();
                    drawID = setInterval(draw, SPEED);
                }
                /* Steps to stop animation play */
                function stopPlay()
                {
                    clearInterval(drawID);
                    stopWatch();
                    playing = false;
                }
                /* Draw circle */   
                function circle( x, y, r ) 
                {
                    canvas_ctx.beginPath();
                    canvas_ctx.arc(x, y, r, 0, Math.PI*2, true);
                    canvas_ctx.fill();
                }
                /* Draw rectangle */
                function rect( x, y, w, h ) 
                {
                    canvas_ctx.beginPath();
                    canvas_ctx.rect(x,y,w,h);
                    canvas_ctx.closePath();
                    canvas_ctx.fill();
                }

function success(acceleration){
	//alert("Accel Working");
	 ax = acceleration.x * DISTANCE_FACTOR * -1;
	 ay = acceleration.y * DISTANCE_FACTOR ;
	}
	function failure()
            {
                alert("Error");
            }

     function startWatch(){
     	watch = navigator.accelerometer.watchAcceleration(success, 
          failure, {frequency: 15});
     }

     /* Clear canvas */
                function clear() 
                {
                    canvas_ctx.clearRect(0, 0, WIDTH, HEIGHT);
                }

    function draw() 
                {
                    // Increase velocity by acceleration
                    vx += ax;
                    vy += ay;
                    // Update circle drawing position.
                    x += vx;
                    y += vy;
                    /* Boundaries testing */
                    // Right boundary
                    if ( x + RADIUS > WIDTH  )
                    {
                        x = WIDTH - RADIUS ;
                        vx = 0;
                    }
                    // Left boundary
                    if (x - RADIUS  <= 0)
                    {
                        x = RADIUS   ;
                        vx = 0;
                    }
                    // Bottom boundary
                    if (y +  RADIUS  > HEIGHT)
                    {
                        y = HEIGHT - RADIUS ;
                        vy = 0;
                    }
                    // Top boundary
                    if (y - RADIUS  <= 0)
                    {
                        y = RADIUS  ;
                        vy = 0;
                    }
                    
                    
                    /* Draw frame */
                    // Clear canvas
                    clear();
                    // Draw canvas background
                    canvas_ctx.fillStyle = CANVAS_COLOR;
                    rect( 0, 0, WIDTH, HEIGHT);
                    /* Draw circle */
                    canvas_ctx.fillStyle = CIRCLE_COLOR;
                    circle( x, y, RADIUS );
                }

   document.addEventListener('deviceready',function(){
    	showCanvas();
    });
	//DOM Loaded Fully
});