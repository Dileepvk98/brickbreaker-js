var un = "";
var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
     un = value;
    // Store UN
    localStorage.setItem("username", un); 
});

// Retrieve UN
un = localStorage.getItem("username");  
un='welcome, ' + un;

function logout(){
  var c = confirm("Are you sure you want exit ?")
  if(c){
      window.location = "login.html"
    }
}
function testpg(){window.location = "test.html"}

//set difficulty
var difficulty = 75;
var d="medium";
function setdifficulty(){

  if (document.getElementById('r1').checked) {
    d=document.getElementById('r1').value;
    difficulty = 60;    
  }
  else if (document.getElementById('r2').checked) {
    d=document.getElementById('r2').value;
    difficulty = 75;    
  }
  else if(document.getElementById('r3').checked){
    d=document.getElementById('r3').value;
    difficulty = 90;    
  }

  // Store
  localStorage.setItem("diff", difficulty);    
  var str=" Difficulty Set to "+d;
  document.getElementById('diffset').innerHTML=str;
}
