// ----- CUSTOM JS

// ----- JS Initialization

// ----- Creation of the game board -----
// Each square on the board is created with class, id, data-column, data-row, and a click event listener.
// The click event listener placed on each space created on the board as a part of js initilization will cause a callback function to be called which will pass the space's ID value, which containes the row and column values of the space, as an arguement, which will be used to identify the space the active player clicks.  The clicked space's location will assist in determining the player's location on the board.
// Each newly created space is then placed into a square variable.
// The square variable is placed on the board by applying the square varibale as innerHTML to the board element.
let square = "";
  let board = document.getElementById('board');
  for (var y = 1; y < 11; y++) {
    for (var x = 1; x < 11; x++) {
      square += `<div class="grid-item" id="${x}-${y}" data-column=${x} data-row=${y} onClick="spaceClicked('${x}-${y}')" ></div>`;
    }
  }
//Draw the board Game as HTML within the board element
board.innerHTML = square;

// ----- Placing players on the board -----
/* playerPlacement(num) -----
- The arguement passed through represents the number of iterations of the for loop and thus the number of players to be placed randomly on the board.
- Two random numbers are generated over two iterations of a for loop and used as id values to select a square and add an html player image which is then given a class to size the html player image to fit the square.
- The entire square is then given a class of player 1 or player 2 to signify that a particular square is occupied by a particular player. 
- In addition, the entire square player 1 occupies is given a class of active since by default the first move of the game will be made by player 1, and the active class will be used to show which space on the board is active.
- Another condition determines if there is player 1 in any of the spaces beside player 2, or if the space of player 2 is the same space as player 1. If the condition is true then the iteration number will be set to zero, therfore repeating the loop until player 2 is placed at least a space away from player 1. If the condition is false the loop ends.
*/
const playerPlacement = (num) => {
  let x,y;
  for (let i = 0; i < num; i++) {
    x = Math.floor((Math.random() * 10) + 1);
    y = Math.floor((Math.random() * 10) + 1);
    if ( i < 1 ) {
      $(`#${x}-${y}`).append($("<img src='../img/soldier.svg'>").addClass("player1Img")).addClass("player_1").addClass("active");
    } 
    if ( i === 1 && !$(`#${x}-${y}`).hasClass("player_1") && !$(`#${x + i}-${y}`).hasClass("player_1") && !$(`#${x - i}-${y}`).hasClass("player_1") && !$(`#${x}-${y + i}`).hasClass("player_1") && !$(`#${x}-${y - i}`).hasClass("player_1")) {
      $(`#${x}-${y}`).append($("<img src='../img/warrior.svg'>").addClass("player2Img")).addClass("player_2");
    } else {
      i = 0;
    }
  }
}

// ----- Placing obstacles on the board -----
/* obstaclePlacement(num) -----
- The arguement passed through represents the number of iterations of the for loop and thus the number of obstacles to be placed randomly on the board.
- Randomly generated square id values are used to place an obstacle on the selected square with randomly generated id value as a background image by giving the selected square the class of obstacle, which adds the obstacle as the background image, while ensuring the square is not already taken by another svg.
- If the square is already taken then 1 is subtracted from i and the loop is repeated until a square without an svg is located for the pylon svg to be placed on.
- If player 1's space is surrounded on 4 sides by obstacles so that player 1 is unable to move the iteration will repeat by subtracting an iteration until there are not four obstacles around player 1.
*/
const obstaclePlacement = (num) => {
  let x,y;
  for ( let i = 0; i < num; i++) {
    x = Math.floor((Math.random() * 10) + 1); 
    y = Math.floor((Math.random() * 10) + 1);
    if ( !$("#" + x + "-" + y).hasClass("obstacle") && !$("#" + x + "-" + y).hasClass("player_1") && !$("#" + x + "-" + y).hasClass("player_2") ) {
      $("#" + x + "-" + y).addClass("obstacle");
    } else {
      i -= 1;
    }
    if ( $(`#${x}-${y}`).hasClass("player_1") && $(`#${x + 1}-${y}`).hasClass("obstacle") && $(`#${x - 1}-${y}`).hasClass("obstacle") && $(`#${x}-${y + 1}`).hasClass("obstacle") && $(`#${x}-${y - 1}`).hasClass("obstacle") ) {
      i -= i;
    }
  }
}

// ----- Placing weapons on the board -----
/* weaponPlacement(num) -----
- The arguement passed through represents the number of iterations of the for loop and thus the number of weapons to be placed randomly on the board.
- A loop randomly generates a number between one and 10 twice for a space's x and y value.  Thus, the x and y values are used to randomly select for a space via a space's id.
- A condition is tested to determine if the space already has an obstacle, player or other weapon. If the space does then the loop loses an iteration and will repeat the same iteration again, by subtracting one from the current iteration value, until the condition is fulfilled.
- A further set of conditions tests which iteration is currently iterating, and then for each unique iteration a class generic to all spaces with weapons is added, as well as a weapon specific class which will add the weapon to each space. Thus, each iteration will add a unique weapon asa  background image to each space by giving each space it's own unique weapon class, while also proividing each space with uniform weapon styling by adding a uniform weapon's class to each weapon space.
*/
const weaponPlacement = (num) => {
  let x,y;
  for ( let i = 0; i < num; i++) {
    x = Math.floor((Math.random() * 10) + 1); 
    y = Math.floor((Math.random() * 10) + 1);
    if ( !$("#" + x + "-" + y).hasClass("obstacle") && !$("#" + x + "-" + y).hasClass("player_1") && !$("#" + x + "-" + y).hasClass("player_2") && !$("#" + x + "-" + y).hasClass("weapon") ) {
      if ( i === 0 ) {
        $("#" + x + "-" + y).append($("<img src='../img/hammer.svg'>").addClass("hammer")).addClass("weapon w-hammer");
      } else if ( i === 1 ) {
        $("#" + x + "-" + y).append($("<img src='../img/crossbow.svg'>").addClass("crossbow")).addClass("weapon w-crossbow");
      } else if ( i === 2 ) {
        $("#" + x + "-" + y).append($("<img src='../img/sword.svg'>").addClass("sword")).addClass("weapon w-sword");
      } else {
        $("#" + x + "-" + y).append($("<img src='../img/gun.svg'>").addClass("gun")).addClass("weapon w-gun");
      }
    } else {
      i -= 1;
    }
  } 
}

// ----- Determines initial active spaces at JS initialization -----
/* initialAvailableSpaces() ----- 
 - Two loops determine the initial active player's (player 1) space upon JS initialization and place player 1's space into a variable.
 - Player 1's column and row values are determined by obtaining player 1 space's column and row attributes.
 - Row and Column plus and minus variables are declared for player 2, the inactive player upon JS initialization, and are also declared for the obstacles. These variables will hold the location of player 2 or the obstacles which are within one to three spaces above, below, left or right of player 1.
 - A loop with 3 iterations, i value 1 to 3, is created and the clickable space class is added to each space 3 spaces up, down, left, or right from player 1 causing the initial player 1's available spaces to be highlighted from the styling associated with the clickable spaces class.
 - Available spaces with player 2 and obstacle classes have the clickable space class removed since spaces with an obstacle and inactive player are not clickable in the game.
 - A space found with an obstacle or player 2 within 1 to 3 spaces from player 1 is then stored in let a variable declared earlier.
 - A final condition determines if the available space is beyond ( i.e. hops over) either player 2 or an obstacle, and if so then the space which is on the other side of player 2 or the obstacle will have its clickableSpace class removed to visually show that space is not meant to be clicked.
*/
const initialAvailableSpaces = () => {
  let activePlayerSpace;
  for (let x = 1; x <= 10; x++) {
    for (let y = 1; y <= 10; y++) {
      if ( $(`#${x}-${y}`).hasClass("player_1") ) {
        activePlayerSpace = $(`#${x}-${y}`);
      }
    }
  }
  const activePlayerColumn = +activePlayerSpace.attr("data-column");
  const activePlayerRow = +activePlayerSpace.attr("data-row");
  let obstacleColumnPlus;
  let obstacleColumnMinus;
  let obstacleRowPlus;
  let obstacleRowMinus;
  let player2ColumnPlus;
  let player2ColumnMinus;
  let player2RowPlus;
  let player2RowMinus;
  for ( let i = 1; i < 4; i++ ) {
    // 3 spaces to the right of player 1 are initially given the clickableSpace class and highlighted.
    $(`#${activePlayerColumn + i}-${activePlayerRow}`).addClass("clickableSpace");
    // Conditions to determine which spaces to the right of the player 1 will be given the class clickableSpace and thus highlighted if those spaces are not occupied by player 2 or an obstacle, or if those spaces are not on the other side of player 2 or an obstacle but still less then 4 spaces from the active player.
    if ( $(`#${activePlayerColumn + i}-${activePlayerRow}`).hasClass("player_2") || $(`#${activePlayerColumn + i}-${activePlayerRow}`).hasClass("obstacle") ) {
      $(`#${activePlayerColumn + i}-${activePlayerRow}`).removeClass("clickableSpace");
    }
    if ( $(`#${activePlayerColumn + i}-${activePlayerRow}`).hasClass("obstacle") ) {
      obstacleColumnPlus = +$(`#${activePlayerColumn + i}-${activePlayerRow}`).attr("data-column");
    }
    if ( +$(`#${activePlayerColumn + i}-${activePlayerRow}`).attr("data-column") > obstacleColumnPlus ) {
      $(`#${activePlayerColumn + i}-${activePlayerRow}`).removeClass("clickableSpace");
    }
    if ( $(`#${activePlayerColumn + i}-${activePlayerRow}`).hasClass("player_2") ) {
      player2ColumnPlus = +$(`#${activePlayerColumn + i}-${activePlayerRow}`).attr("data-column");
    }
    if ( +$(`#${activePlayerColumn + i}-${activePlayerRow}`).attr("data-column") > player2ColumnPlus ) {
      $(`#${activePlayerColumn + i}-${activePlayerRow}`).removeClass("clickableSpace");
    }
    // 3 spaces to the left of player 1 are initially given the clickableSpace class and highlighted.
    $(`#${activePlayerColumn - i}-${activePlayerRow}`).addClass("clickableSpace");
    // Conditions to determine which spaces to the left of the player 1 will be given the class clickableSpace and thus highlighted if those spaces are not occupied by player 2 or an obstacle, or if those spaces are not on the other side of player 2 or an obstacle but still less then 4 spaces from the active player.
    if ( $(`#${activePlayerColumn - i}-${activePlayerRow}`).hasClass("player_2") || $(`#${activePlayerColumn - i}-${activePlayerRow}`).hasClass("obstacle") ) {
      $(`#${activePlayerColumn - i}-${activePlayerRow}`).removeClass("clickableSpace");
    }
    if ( $(`#${activePlayerColumn - i}-${activePlayerRow}`).hasClass("obstacle") ) {
      obstacleColumnMinus = +$(`#${activePlayerColumn - i}-${activePlayerRow}`).attr("data-column");
    }
    if ( +$(`#${activePlayerColumn - i}-${activePlayerRow}`).attr("data-column") < obstacleColumnMinus ) {
      $(`#${activePlayerColumn - i}-${activePlayerRow}`).removeClass("clickableSpace");
    }
    if ( $(`#${activePlayerColumn - i}-${activePlayerRow}`).hasClass("player_2") ) {
      player2ColumnMinus = +$(`#${activePlayerColumn - i}-${activePlayerRow}`).attr("data-column");
    }
    if ( +$(`#${activePlayerColumn - i}-${activePlayerRow}`).attr("data-column") < player2ColumnMinus ) {
      $(`#${activePlayerColumn - i}-${activePlayerRow}`).removeClass("clickableSpace");
    }
    // 3 spaces to the below player 1 are initially given the clickableSpace class and highlighted.
    $(`#${activePlayerColumn}-${activePlayerRow + i}`).addClass("clickableSpace");
    // Conditions to determine which spaces below player 1 will be given the class clickableSpace and thus highlighted if those spaces are not occupied by player 2 or an obstacle, or if those spaces are not on the other side of player 2 or an obstacle but still less then 4 spaces from the active player.
    if ( $(`#${activePlayerColumn}-${activePlayerRow + i}`).hasClass("player_2") || $(`#${activePlayerColumn}-${activePlayerRow + i}`).hasClass("obstacle") ) {
      $(`#${activePlayerColumn}-${activePlayerRow + i}`).removeClass("clickableSpace");
    }
    if ( $(`#${activePlayerColumn}-${activePlayerRow + i}`).hasClass("obstacle") ) {
      obstacleRowPlus = +$(`#${activePlayerColumn}-${activePlayerRow + i}`).attr("data-row");
    }
    if ( +$(`#${activePlayerColumn}-${activePlayerRow + i}`).attr("data-row") > obstacleRowPlus ) {
      $(`#${activePlayerColumn}-${activePlayerRow + i}`).removeClass("clickableSpace");
    }
    if ( $(`#${activePlayerColumn}-${activePlayerRow + i}`).hasClass("player_2") ) {
      player2RowPlus = +$(`#${activePlayerColumn}-${activePlayerRow + i}`).attr("data-row");
    }
    if ( +$(`#${activePlayerColumn}-${activePlayerRow + i}`).attr("data-row") > player2RowPlus ) {
      $(`#${activePlayerColumn}-${activePlayerRow + i}`).removeClass("clickableSpace");
    }
    // 3 spaces above player 1 are initially given the clickableSpace class and highlighted.
    $(`#${activePlayerColumn}-${activePlayerRow - i}`).addClass("clickableSpace");
    // Conditions to determine which spaces above player 1 will be given the class clickableSpace and thus highlighted if those spaces are not occupied by player 2 or an obstacle, or if those spaces are not on the other side of player 2 or an obstacle but still less then 4 spaces from the active player.
    if ( $(`#${activePlayerColumn}-${activePlayerRow - i}`).hasClass("player_2") || $(`#${activePlayerColumn}-${activePlayerRow - i}`).hasClass("obstacle") ) {
      $(`#${activePlayerColumn}-${activePlayerRow - i}`).removeClass("clickableSpace");
    }
    if ( $(`#${activePlayerColumn}-${activePlayerRow - i}`).hasClass("obstacle") ) {
      obstacleRowMinus = +$(`#${activePlayerColumn}-${activePlayerRow - i}`).attr("data-row");
    }
    if ( +$(`#${activePlayerColumn}-${activePlayerRow - i}`).attr("data-row") < obstacleRowMinus ) {
      $(`#${activePlayerColumn}-${activePlayerRow - i}`).removeClass("clickableSpace");
    }
    if ( $(`#${activePlayerColumn}-${activePlayerRow - i}`).hasClass("player_2") ) {
      player2RowMinus = +$(`#${activePlayerColumn}-${activePlayerRow - i}`).attr("data-row");
    }
    if ( +$(`#${activePlayerColumn}-${activePlayerRow - i}`).attr("data-row") < player2RowMinus ) {
      $(`#${activePlayerColumn}-${activePlayerRow - i}`).removeClass("clickableSpace");
    }
  }
}

// Calling of the playerPlacement(), obstaclePlacement() and weaponPlacement() functions everytime the page is loaded in order to place the players, obstacles and weapons randomly on the board as a part of the JS initialization of the board game.
playerPlacement(2);
obstaclePlacement(11);
weaponPlacement(4);
initialAvailableSpaces();
// ----- /JS Initializtion

// A function which occurs everytime a space is clicked is called initiating the Game object class while passing the in the clicked space's id value to the game object in order for the clicked space's location to be accessed within the game object as the arguement passed into the game object.
const spaceClicked = (xy) => {
  new Game($(`#${xy}`));
}

// An event listener on the new game button causes the page to reload every time the new game button is clicked by executing the location object's reload method for every new game button click.
$('.rulesButton:nth-child(1)').on('click', function() {
  location.reload();
});



