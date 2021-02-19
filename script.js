const numOfPlayers = document.querySelector("#no-of-players");
const units = document.querySelector("#units-of-play");
const playersHolder = document.querySelector("#players-almost .players");

let confirmedUnit  = 5  ;

document.querySelector("#players-num-btn").addEventListener("click", function () { 
  if (units.value  == '' || numOfPlayers.value == '') { 
    alert('Neither values can be empty')
  } 
  else { 
      let playersNum = parseInt(Math.round(numOfPlayers.value));  
      confirmedUnit = formatToTwoDecimal(parseFloat(units.value)) ; 
       
      newPlayerDetails(playersNum);
  }
  });

function newPlayerDetails(num) {
  playersHolder.innerHTML = "";
  for (let i = 1; i <= num; i++) {
    let div = document.createElement("div");
    div.innerText = "Player " + i + " Name: ";
    div.classList.add("player-name");
    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.classList.add("no-outline-border", "players-name-input");

    input.setAttribute("placeholder", "Enter name");
    let br = document.createElement("br");

    playersHolder.appendChild(div);
    playersHolder.appendChild(input);
    playersHolder.appendChild(br);
  }

  let button = document.createElement("button");
  button.classList.add("no-outline-border", "roboto", "five-hundred");
  button.setAttribute("id", "submit-players-names");
  button.innerText = "Submit Players";
  playersHolder.append(button);
  addSubmitEvent();
}

const table = document.querySelector("table tbody");  
function newRow(name , score ,rowSerial) { 
  //rowSerial = rowSerial.toString(); 

  score = formatToTwoDecimal(score)
  let rowData = "<td class='serial text-center'> " + rowSerial + "</td><td class='names'> " + name +"</td> <td class='scores text-center'> " + score +"</td><td class='pointer add text-center'><i class='material-icons change'> arrow_circle_up </i> <div class='add-subtract-text'> Add Points </div> + </td><td class='pointer subtract text-center'><i class='material-icons change'> arrow_circle_down </i> <div class='add-subtract-text'>Subtract Points </div> - </td> <td class='pointer delete text-center'>Delete</td>";
  let row = document.createElement("tr");
  row.innerHTML = rowData;
  table.appendChild(row) ; 
}

function addIncreaseDecreaseEvent(unit) {
  let addBtn = document.querySelectorAll(".add");
  let subBtn = document.querySelectorAll(".subtract");
  let scores = document.querySelectorAll(".scores");
  let delBtn = document.querySelectorAll(".delete") ; 
  let row = document.querySelectorAll('tbody tr') ;  

  localStorage.setItem('unit' , unit)
    for (let i = 0 ; i < row.length ; i++) { 
        addBtn[i].addEventListener ('click' , function () {   
           scores[i].innerText =  formatToTwoDecimal(parseFloat(scores[i].innerText) + parseFloat(unit)) ; 
        })
        subBtn[i].addEventListener('click', function() { 
            scores[i].innerText =  formatToTwoDecimal(parseFloat(scores[i].innerText) - parseFloat(unit)) ;
        }) 

        delBtn[i].addEventListener('click' , function () {
            row[i].remove() 
            if (checkRow () == 0 ) {  
              switchBetweenCreatedAndActivePlayers ('none' , 'block')

            } ; 
        })
    }
}

function checkRow() {
    return(document.querySelectorAll('tbody tr').length) ; 
   
}

function nameSubmitted() { 
   
  let names = document.querySelectorAll(".players-name-input"); 
  let checkValues  = "" ; 
  
  for (let a = 0 ; a < names.length ; a++ ) { 
    if(names[a].value == '' ) { 
      checkValues = 'empty'
    }
    else { 
      checkValues = 'notEmpty'
    }
  }
  
  if (checkValues != 'empty') { 
    for (var i = 0; i < names.length; i++) {
      newRow(names[i].value , 0  , (i+1)); 
      switchBetweenCreatedAndActivePlayers('block' , 'none')
  }
  }
  else { 
    alert ('All names required for start')
  }

  addIncreaseDecreaseEvent(confirmedUnit);
}

function addSubmitEvent() {
  document.querySelector("#submit-players-names").addEventListener("click", nameSubmitted);
}
document.querySelector("#submit-players-names").addEventListener("click", nameSubmitted);


const saveButton = document.querySelector('#save-game-data') ; 
const clearSaveButton  = document.querySelector('#clear-game-data') ; 
 
saveButton.addEventListener('click' , function () { 
  let names = document.querySelectorAll('.names') ; 
  let scores = document.querySelectorAll('.scores') ; 
  let row = document.querySelectorAll('tbody tr') ;  
  let saveArray = new Array () ; 

for (let i = 0 ; i < row.length ; i++) { 
    saveArray.push ( new Profiles (names[i].innerText , scores[i].innerText) )
  }  
  localStorage.setItem('saveGameProgress' , JSON.stringify(saveArray)) ; 
  location.reload() ; 
})

function Profiles (name , score )  { 
  this.name = name , 
  this.score = score 
}
clearSaveButton.addEventListener('click' , function () { 
  localStorage.removeItem('saveGameProgress');   
  localStorage.removeItem('unit') 
  localStorage.removeItem('note')
  location.reload() ; 
})


document.addEventListener('DOMContentLoaded' , function () { 
  if (localStorage.getItem('saveGameProgress')) { 
    switchBetweenCreatedAndActivePlayers('block' , 'none ') 
    document.querySelector('#required-players').style.display = 'none' ; 
    /*let row = document.querySelectorAll('tbody tr') ;  */
    let recievedArray = JSON.parse(localStorage.getItem('saveGameProgress') )  ; 
    for ( var i = 0 ; i < recievedArray.length ; i++ ) { 
      newRow(recievedArray[i].name , recievedArray[i].score , (i+1) )
    }  

    addIncreaseDecreaseEvent(JSON.parse(localStorage.getItem('unit'))) ;  

  } 
  
})

function switchBetweenCreatedAndActivePlayers ( created , almost ) {  
  document.querySelector("#created-players").style.display = created   ;  
  document.querySelector("#players-almost .players").style.display = almost ; 
}




function formatToTwoDecimal (toFormat) { 
  let f = new Intl.NumberFormat('en' , { 
    style : 'decimal' , 
    maximumFractionDigits : 2 , 
  }) 
  let formatted = f.format(toFormat) 
  return(formatted)
}

document.querySelector('#clear-note').addEventListener('click', function () {   
  localStorage.setItem('note', 'cleared') ; 
  document.querySelector('#footer').style.display = 'none' ;
})
document.addEventListener('DOMContentLoaded', function () { 
  if (localStorage.getItem('note') == 'cleared') { 
  document.querySelector('#footer').style.display = 'none' ;
  }
})

