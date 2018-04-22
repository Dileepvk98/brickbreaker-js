//to exit 
function logout(){
    var c=confirm("Are you sure you want exit ?")
    if(c){window.location = "login.html"}
}

//Game code
var canvas, ctx, ballX,ballY,ballSpeedX=3,ballSpeedY=3;score=0, paddleX=0,lives;
var PADDLE_LENGTH=100, WINSCORE=2, paddleX=0, score=0, lives,padDelta=0;
const PADDLE_WIDTH=10;
var showWinDisp=false, start=true;

var brickWidth = 75, brickHeight = 20;
var brickPadding = 12.5, brickOffsetTop = 45, brickOffsetLeft = 20;
var brick_row=4,brick_col=10;
var bricks = [];
lives=2;
window.onload=function() {
    
    canvas=document.getElementById("gamecanvas");
    ctx=canvas.getContext("2d");
    ctx.font="25px Arial";
    paddleX=400;

    // Retrieve and set difficulty | Lives are 1 less than given variable
    var fps = localStorage.getItem("diff");   
    if(fps==60){
        padDelta=0;   lives=4; brick_row=4;  }
    else if(fps==75){
        padDelta=35;  lives=3; brick_row=6; brick_col=13; brickPadding =7; brickWidth = 60, brickHeight = 15; }
    else if(fps==90){
        padDelta=55;  lives=2; brick_row=9; brick_col=16; brickPadding =4.5; brickWidth = 50, brickHeight = 10; }

    for(var r=0; r<brick_row; r++) {
        bricks[r] = [];
        for(var c=0; c<brick_col; c++) {
            bricks[r][c] = { x: 0, y: 0 ,status:1};
        }
    }

    ballReset();

    setInterval(function (){
        moveBall();
        drawEverything();
    },1000/fps);
    canvas.addEventListener('mousedown', 
    function(evt){ 
        if(start){ 
            start=false; 
        } 
        if(showWinDisp){ 
            score=0; showWinDisp=false; 
        } 
    });
    canvas.addEventListener('mousemove',
        function(evt){
            var mousePos=calcMousePos(evt);
            paddleX=mousePos.x-PADDLE_LENGTH/2;
    });        
}    
function calcMousePos(evt){
    //evt is mouse info
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return{
        x:mouseX, y:mouseY //(x,y) of mouse is returned to functionlistener
    };
}

function moveBall(){
    if(showWinDisp){ return; }
    ballX+=ballSpeedX;  ballY+=ballSpeedY;
    //change X
    if(ballX<10 || ballX>canvas.width-10){
        ballSpeedX=-ballSpeedX;
    }
    //change Y
    if(ballY<10){
        ballSpeedY=-ballSpeedY;
    }
    if(ballX>paddleX && ballX<paddleX+PADDLE_LENGTH){
        if(ballY>canvas.height-20){
            ballSpeedY=-ballSpeedY;
            if(ballX<paddleX+PADDLE_LENGTH/3 || ballX>paddleX+PADDLE_LENGTH*2/3){
                 if(ballSpeedX>0) ballSpeedX=4.5;
                 else ballSpeedX=-4.5;
            }
            else{
                if(ballSpeedX>0) ballSpeedX=3;
                 else ballSpeedX=-3;
            }
        }
    }
    if(ballY>canvas.height-15){
        ballReset();
    }
}
function ballReset(){
    lives--;
    if(lives==0){ showWinDisp=true;}
    //ballSpeedX=-ballSpeedX;
    ballSpeedY=-3;
    ballX=canvas.width/2;
    ballY=canvas.height-25;
} 
function colorRect(leftX,topY,width,height,color){  //draw rectangles
    ctx.fillStyle=color;
    ctx.fillRect(leftX,topY,width,height);
}
function colorBall(X,Y,r){                          //draw ball
    ctx.fillStyle="white";
    ctx.beginPath();
    ctx.arc(X,Y,r,0,Math.PI*2,true);
    ctx.fill();
}
function drawBricks() {                             //draw grid of bricks
    for(r=0; r<brick_row; r++){
        for(c=0; c<brick_col; c++){
            if(bricks[r][c].status==1){
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[r][c].x = brickX;
                bricks[r][c].y = brickY;
                colorRect(brickX, brickY, brickWidth, brickHeight,"lime");
            }
        }
    }
}
function collisionDetect(){                         //collision detection
    for(var r=0; r<brick_row; r++){
        for(var c=0; c<brick_col; c++){
            var b=bricks[r][c];
            if((ballY>b.y && ballY<b.y+brickHeight) && 
            (ballX>b.x && ballX<b.x+brickWidth) && b.status==1){
                score++;   
                ballSpeedY=-ballSpeedY; 
                b.status=0;
                if(score == brick_row*brick_col) {
                    showWinDisp=true;
                }
            }        
        }
    }
}
function drawEverything(){ 
    //draw black canvas
    ctx.font="25px Arial";
    colorRect(0,0,canvas.width,canvas.height,'black');
    ctx.fillStyle="yellow";
   if(start){ 
       ctx.fillText("Click to Start !",canvas.width/2-70,250); return;  
    }
    if(showWinDisp){
        if(lives==0){ 
            ctx.fillText("Game Over !",canvas.width/2-65,canvas.height/2-50);    
        }
        else{ 
            ctx.fillText("Congratulations You WON !",canvas.width/2-140,canvas.height/2-50); 
        }
        ctx.fillText("Click to Continue",canvas.width/2-90,300);
        score=0;
        drawBricks();
        return;
    }
    ctx.font="16px Arial";
    if(lives==3){ padcolor='yellow';}
    else if(lives==2) { padcolor='orange';}
    else padcolor="red";
    colorRect(paddleX,canvas.height-15,PADDLE_LENGTH-padDelta/0.8,PADDLE_WIDTH,padcolor); //draw player pad
    colorBall(ballX,ballY,10);    //draw ball
    drawBricks();
    collisionDetect();  
    //draw score
    ctx.fillStyle="yellow";
    ctx.fillText("Score : ",20,30);
    ctx.fillText(score,80,30);
    //draw lives
    ctx.fillStyle="yellow";
    ctx.fillText("Lives : ",canvas.width-85,30);
    ctx.fillText(lives-1,canvas.width-30,30);  
}