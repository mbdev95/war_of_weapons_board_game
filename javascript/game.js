// ----- Game Class
class Game {
  constructor(clickedSpace) {
    this.board = new Board();
    this.players = this.players();
    this.movePlayer = this.movePlayer(clickedSpace);
  }

// Game - players() - create the players object class for player 1 and player 2 by calling the player class twice with arguements passed unique to player 1's and player 2's name, id, and active boolean value.  Store both player objects in a players array, and return the array.
  players() {
    const players = [];
    for (let i = 0; i < 2; i++) {
      if ( i === 0 ) {
        const player1 = new Player("player_1", i, true);
        players.push(player1);
      } else {
        const player2 = new Player("player_2", i, false);
        players.push(player2)
      }
    }
    return players;
  }

// Game - activePlayer() - The active player's name value is determined by finding the space object with a class of active, and then matching the space with class active's player value with a player name from the player's array. The loops have one added since the space objects are in an array starting from zero. The active player's name is returned.
  activePlayer() {
    let initialActiveSpace;
    for ( let x = 0; x < this.board.columns; x++ ) {
      for ( let y = 0; y < this.board.rows; y++  ) {
        if ( $(`#${+x + 1}-${+y + 1}`).hasClass("active") ) { 
          initialActiveSpace = this.board.spaces[x][y];
        }
      }
    }
    for (let i = 0; i < this.players.length; i++) {
      if ( initialActiveSpace.player === this.players[i].name ) {
        return this.players[i].name; 
      }
    }
  }

  // Game - activePlayerWeapon() - returns the activePlayer's weapon by determining who the active player is and then returning the active player weapon property's value from their player object.
  activePlayerWeapon() {
    if ( this.activePlayer() === "player_1" ) {
      return this.players[0].weapon;
    } else {
      return this.players[1].weapon;
    }
  }

  // Game - inactivePlayer() - determines the inactive player by returning the name of the player who's name is not the name of the active player.
  inactivePlayer() {
    for (let i = 0; i < this.players.length; i++) {
      if ( this.players[i].name !== this.activePlayer() ) {
        return this.players[i].name; 
      }
    }
  }

// Game - activeSpace() - finds the active space by looping through all the space objects and comparing that space object's player property's name value to the activePlayer's name. The row and column values of the active space are pushed into an activeSpaceCoordinates array which is then returned.
  activeSpace() {
    const activePlayer = this.activePlayer();
    const activeSpaceCoordinates = [];
    for ( let x = 0; x < +this.board.columns; x++) {
      for ( let y = 0; y < +this.board.rows; y++ ) {
        if ( this.board.spaces[x][y].player === activePlayer ) {
          activeSpaceCoordinates.push(x + 1);
          activeSpaceCoordinates.push(y + 1);
          return activeSpaceCoordinates;
        }
      }
    }
  }

// Game - inactiveSpace() - an array of the row and column values of the space occupied by the inactive player is returned by matching the player names from a given space object's player property with the inactive player's name and then pushing those row and column values into an inactiveSpaceCoordinates array.  The array is returned.
  inactiveSpace() {
    const inactivePlayer = this.inactivePlayer();
    const inactiveSpaceCoordinates = [];
    for ( let x = 0; x < +this.board.columns; x++) {
      for ( let y = 0; y < +this.board.rows; y++ ) {
        if ( this.board.spaces[x][y].player === inactivePlayer ) {
          inactiveSpaceCoordinates.push(x + 1);
          inactiveSpaceCoordinates.push(y + 1);
          return inactiveSpaceCoordinates;
        }
      }
    } 
  }

// Game - switchPlayer() - switches the active player by finding the space object which has the player property name equal to the active player's name and subsequently the class of active is removed from the active player's space and given to the space whose player property's name is equal with the inactive player's name. Since the active player is determined by which player's space has the class of active the player's have now switched.
  switchPlayer() {
    const inactivePlayer = this.inactivePlayer();
    const activePlayer = this.activePlayer();
    for ( let x = 0; x < +this.board.columns; x++) {
      for ( let y = 0; y < +this.board.rows; y++ ) {
        if ( this.board.spaces[x][y].player === activePlayer ) {
          $(`#${x + 1}-${y + 1}`).removeClass("active");
        } else if ( this.board.spaces[x][y].player === inactivePlayer ) {
          $(`#${x + 1}-${y + 1}`).addClass("active");
        }
      }
    }
  }

/* Game - clickableSpaces() -----
- The arguement passed through is an array containing the clicked space (i.e. inactive space now as players have switched by the time the clickable spaces function is called) which is set to the clickedSpace variable, and an array containing the previously active space which is set to the variable previousSpace.
- The active player's space's column and row values are derived from the activeSpace method in the Game object class.
- The inactive player's space is determined by accessing the clicked space's column and row attribute values and using those to establish the id of the space of the now inactive player since the players have already switched.
- A series of variables to be used in the condition section pertaining to the obstacle's column and row values, and the inactive player's column and row values are then stated.
- Remove the clickableSpace from the top, bottom, left and right of the previous active space.
- Iterate through an array of clickable spaces, spaces three spaces top, bottom, left or right of the active space, and add the clickableSpace class to each space three spaces away from the active space.
- A condition is given which removes the clickableSpace class from spaces which have the inactive player or contain an obstacle.
- Another condition checks if there is an obstacle three spaces from the active player and stores the obstacle's column or row value in an obstacle let variable declared at the starting scope of the function.
- Another condition checks if the space with the "clickableSpace" class is beyond the obstacle, and if so then space with the "clickableSpace" class beyond the obstacle has its "clickableSpace" class removed.
- Another condition checks if there is an inactive player three spaces from the active player and stores the inactive player's column or row value in an inactive player let variable declared at the starting scope of the function.
- Another condition checks if a space with class "clickableSpace" is beyond the inactive player, and if so then the space with the "clickableSpace" class beyond the inactive player has the "clickableSpace" class removed.
- The above 5 conditions are all given regardless of whether the spaces with the "clickableSpace" class are above, below, left or right by adding or subtracting the iteration's variable's value from both the column and row of the active space every time this function is executed.
*/
  availableSpaces(clickedPreviousSpaceArray) {
    // Variables from the arguement array representing the clicked space which is now the inactive space and the previously active space.
    const clickedSpace = clickedPreviousSpaceArray[0];
    const previousSpace = clickedPreviousSpaceArray[1];
    // Active player space variables derived from the activeSpace() method in the Game object class.
    const activePlayerColumn = this.activeSpace()[0];
    const activePlayerRow = this.activeSpace()[1];
    // Inactive player variables value is the clicked space passed into the movePlayer function. Since the move has already been made and the players switched by the time this function is called the clicked space is now representative of the inactive player's space.
    const inactivePlayerColumn = +clickedSpace.attr("data-column");
    const inactivePlayerRow = +clickedSpace.attr("data-row");
    const inactiveSpace = $(`#${inactivePlayerColumn}-${inactivePlayerRow}`);
    // The previous player's space is the active player's space before the move was made and the players were switched. The former active player's space is needed in order to remove the highlighted spaces surrounding the former active player once a new move has been made.
    const previousPlayerColumn = +previousSpace.attr("data-column");
    const previousPlayerRow = +previousSpace.attr("data-row");
    // Variables declared to be used in later conditions involving ensuring a space with class "clickableSpace" is not found beyond an inactive player or obstacle.
    let obstacleColumnPlus;
    let obstacleColumnMinus;
    let obstacleRowPlus;
    let obstacleRowMinus;
    let inactivePlayerColumnPlus;
    let inactivePlayerColumnMinus;
    let inactivePlayerRowPlus;
    let inactivePlayerRowMinus;

    // All the previous players nearest 3 spaces right, left, down and up all have the clickableSpace styling class removed.
    for ( let i = 1; i < 4; i++ ) {
      $(`#${previousPlayerColumn + i}-${previousPlayerRow}`).removeClass("clickableSpace");
      $(`#${previousPlayerColumn - i}-${previousPlayerRow}`).removeClass("clickableSpace");
      $(`#${previousPlayerColumn}-${previousPlayerRow + i}`).removeClass("clickableSpace");
      $(`#${previousPlayerColumn}-${previousPlayerRow - i}`).removeClass("clickableSpace");
    }

    for ( let i = 1; i < 4; i++ ) {
      // 3 spaces to the right of the active player are initially given the clickableSpace class and highlighted.
      $(`#${activePlayerColumn + i}-${activePlayerRow}`).addClass("clickableSpace");
      // Conditions to determine if any of the three spaces to the right of the active space will have the class clickableSpace and their highlighting removed if any of the spaces is an obstacle or inactive player, or if the space is on the opposite side of an obstacle or inactive player.
      if ( $(`#${activePlayerColumn + i}-${activePlayerRow}`).attr("id") === inactiveSpace.attr("id") || $(`#${activePlayerColumn + i}-${activePlayerRow}`).hasClass("obstacle") ) {
        $(`#${activePlayerColumn + i}-${activePlayerRow}`).removeClass("clickableSpace");
      }
      if ( $(`#${activePlayerColumn + i}-${activePlayerRow}`).hasClass("obstacle") ) {
        obstacleColumnPlus = +$(`#${activePlayerColumn + i}-${activePlayerRow}`).attr("data-column");
      }
      if ( +$(`#${activePlayerColumn + i}-${activePlayerRow}`).attr("data-column") > obstacleColumnPlus ) {
        $(`#${activePlayerColumn + i}-${activePlayerRow}`).removeClass("clickableSpace");
      }
      if ( $(`#${activePlayerColumn + i}-${activePlayerRow}`).attr("id") === inactiveSpace.attr("id") ) {
        inactivePlayerColumnPlus = +$(`#${activePlayerColumn + i}-${activePlayerRow}`).attr("data-column");
      }
      if ( +$(`#${activePlayerColumn + i}-${activePlayerRow}`).attr("data-column") > inactivePlayerColumnPlus ) {
        $(`#${activePlayerColumn + i}-${activePlayerRow}`).removeClass("clickableSpace");
      }

      //  3 spaces to the left of the active player are initially given the clickableSpace class and highlighted.
      $(`#${activePlayerColumn - i}-${activePlayerRow}`).addClass("clickableSpace");
      // Conditions to determine if any of the three spaces to the left of the active space will have the class clickableSpace and their highlighting removed if any of the spaces is an obstacle or inactive player, or if the space is on the opposite side of an obstacle or inactive player.
      if ( $(`#${activePlayerColumn - i}-${activePlayerRow}`).attr("id") === inactiveSpace.attr("id") || $(`#${activePlayerColumn - i}-${activePlayerRow}`).hasClass("obstacle") ) {
        $(`#${activePlayerColumn - i}-${activePlayerRow}`).removeClass("clickableSpace");
      }
      if ( $(`#${activePlayerColumn - i}-${activePlayerRow}`).hasClass("obstacle") ) {
        obstacleColumnMinus = +$(`#${activePlayerColumn - i}-${activePlayerRow}`).attr("data-column");
      }
      if ( +$(`#${activePlayerColumn - i}-${activePlayerRow}`).attr("data-column") < obstacleColumnMinus ) {
        $(`#${activePlayerColumn - i}-${activePlayerRow}`).removeClass("clickableSpace");
      }
      if ( $(`#${activePlayerColumn - i}-${activePlayerRow}`).attr("id") === inactiveSpace.attr("id") ) {
        inactivePlayerColumnMinus = +$(`#${activePlayerColumn - i}-${activePlayerRow}`).attr("data-column");
      }
      if ( +$(`#${activePlayerColumn - i}-${activePlayerRow}`).attr("data-column") < inactivePlayerColumnMinus ) {
        $(`#${activePlayerColumn - i}-${activePlayerRow}`).removeClass("clickableSpace");
      }

      // 3 spaces to the below the active player are initially given the clickableSpace class and highlighted.
      $(`#${activePlayerColumn}-${activePlayerRow + i}`).addClass("clickableSpace");
      // Conditions to determine if any of the three spaces below the active space will have the class clickableSpace and their highlighting removed if any of the spaces is an obstacle or inactive player, or if the space is on the opposite side of an obstacle or inactive player.
      if ( $(`#${activePlayerColumn}-${activePlayerRow + i}`).attr("id") === inactiveSpace.attr("id") || $(`#${activePlayerColumn}-${activePlayerRow + i}`).hasClass("obstacle") ) {
        $(`#${activePlayerColumn}-${activePlayerRow + i}`).removeClass("clickableSpace");
      }
      if ( $(`#${activePlayerColumn}-${activePlayerRow + i}`).hasClass("obstacle") ) {
        obstacleRowPlus = +$(`#${activePlayerColumn}-${activePlayerRow + i}`).attr("data-row");
      }
      if ( +$(`#${activePlayerColumn}-${activePlayerRow + i}`).attr("data-row") > obstacleRowPlus ) {
        $(`#${activePlayerColumn}-${activePlayerRow + i}`).removeClass("clickableSpace");
      }
      if ( $(`#${activePlayerColumn}-${activePlayerRow + i}`).attr("id") === inactiveSpace.attr("id") ) {
        inactivePlayerRowPlus = +$(`#${activePlayerColumn}-${activePlayerRow + i}`).attr("data-row");
      }
      if ( +$(`#${activePlayerColumn}-${activePlayerRow + i}`).attr("data-row") > inactivePlayerRowPlus ) {
        $(`#${activePlayerColumn}-${activePlayerRow + i}`).removeClass("clickableSpace");
      }

      // 3 spaces above the active player are initially given the clickableSpace class and highlighted.
      $(`#${activePlayerColumn}-${activePlayerRow - i}`).addClass("clickableSpace");
      // Conditions to determine if any of the three spaces above the active space will have the class clickableSpace and their highlighting removed if any of the spaces is an obstacle or inactive player, or if the space is on the opposite side of an obstacle or inactive player.
      if ( $(`#${activePlayerColumn}-${activePlayerRow - i}`).attr("id") === inactiveSpace.attr("id") || $(`#${activePlayerColumn}-${activePlayerRow - i}`).hasClass("obstacle") ) {
        $(`#${activePlayerColumn}-${activePlayerRow - i}`).removeClass("clickableSpace");
      }
      if ( $(`#${activePlayerColumn}-${activePlayerRow - i}`).hasClass("obstacle") ) {
        obstacleRowMinus = +$(`#${activePlayerColumn}-${activePlayerRow - i}`).attr("data-row");
      }
      if ( +$(`#${activePlayerColumn}-${activePlayerRow - i}`).attr("data-row") < obstacleRowMinus ) {
        $(`#${activePlayerColumn}-${activePlayerRow - i}`).removeClass("clickableSpace");
      }
      if ( $(`#${activePlayerColumn}-${activePlayerRow - i}`).attr("id") === inactiveSpace.attr("id") ) {
        inactivePlayerRowMinus = +$(`#${activePlayerColumn}-${activePlayerRow - i}`).attr("data-row");
      }
      if ( +$(`#${activePlayerColumn}-${activePlayerRow - i}`).attr("data-row") < inactivePlayerRowMinus ) {
        $(`#${activePlayerColumn}-${activePlayerRow - i}`).removeClass("clickableSpace");
      }
    }
  }

  /* Game - spacesWithWeapons() -----
  - Iterates through all the spaces to determine which spaces have the class of weapon.
  - For spaces which have a weapon a further condition determines the type of weapon by selecting for that space's weapon specific class name.
  - An array containing the space the weapon occupies, the weapon's name, and the weapon's damage are stored in a let variable declared external to the loops and conditions. The variable is named after the weapon.
  - After iterating through the spaces and the for loop ends the weapon variables are pushed into an array called spacesWithWeapons in the order of the weapons level of damage with least lethal weapon pushed first.
  - The spaceWithWeapons array is then returned.
  */
  spacesWithWeapons() {
    const spacesWithWeapons = [];
    let hammer;
    let crossbow;
    let sword;
    let gun;
    for ( let col = 1; col <= +this.board.columns; col++ ) {
      for ( let row = 1; row <= +this.board.rows; row++ ) {
        if ( $(`#${col}-${row}`).hasClass("w-hammer") ) {
          hammer = [$(`#${col}-${row}`), "hammer", 20];            
        } else if ( $(`#${col}-${row}`).hasClass("w-crossbow") ) {
          crossbow = [$(`#${col}-${row}`), "crossbow", 30];            
        } else if ( $(`#${col}-${row}`).hasClass("w-sword") ) {
          sword = [$(`#${col}-${row}`), "sword", 40];            
        } else if ( $(`#${col}-${row}`).hasClass("w-gun") ) {
          gun = [$(`#${col}-${row}`), "gun", 50];            
        }
      }
    }
    spacesWithWeapons.push(hammer);
    spacesWithWeapons.push(crossbow);
    spacesWithWeapons.push(sword);
    spacesWithWeapons.push(gun);
    return spacesWithWeapons;
  }

/* Game - fight() -----
- The spaces are iterated through and the spaces with a class of clickableSpace are removed since the players will no longer be moving.
- Two setTimeout functions add and remove classes which cause the board to have an overlay as the fight begins of two boxers to visually demonstrate the fight is beginning. After a few seconds the overlay disappears.
- The inactive player and active player score's are stored in variables and two let variables which will contain player 1 and player 2's spaces are declared.
- All the spaces are iterated through and the space with class "player_1" is set to the player1Space variable and the space with class "player_2" is set to the player2Space variable.
- If either player 1 or player 2's space is active the opposing player's attack and defend buttons are disabled since the opposing player will not be making the first attack or defence.
- Two defend variables for each player are set to false and turned to true when that player clicks the defend button.
- An event listener is placed on both attack and defend buttons although only the active player's attack and defend button's will be clickable ensuring the active player can only attack or defend.
- Within the attack event listener a condition determines if the score is zero, and if so empty quotations are returned to end the functions since if the score is zero the game is over.
- Within the attack event listener a loop now iterates through all the spaces and the active space is found, and then a further condition determines whether the active space and thus active player is either player 1 or player 2.
- Within the attack event listener the inactive player's score is updated with the value found by subtracting the active player's damage from the inactive players score.
- Within the attack event listener if the inactive player's defend boolean value is true the amount subtracted from the inactive player is updated to equal only half of the active player's damage amount being subtracted from the inactive player's score.  Also, the inactive player's defend boolean value is reset to false and will only be set to true if the inactive player clicks their defend button again.
- Within the attack event listener now that the active player has made their move their attack and defend buttons are disabled in preperation for the active and inactive players switching.
- Within the attack event listener if the inactive player's newly updated score is less then one, such as -20, it is automatically set to 0 and empty quoations are returned after a game over message appears to end the function, the code and the game.
- Within the attack event listener a game over message appears stating which player has won the game as well as an animation featuring the winning player scaling out and back in while a trophy transtions from zero opacity to 1.  The animations are done using css and js setTimeout functions.
- Within the attack event listener the active class is removed from the active player's space and switched to the inactive player's space, switching the players in the game.
- Finally, Within the attack event listener both loops looping through the spaces have their x and y values set to 11 in order for them to break their loops once the next iteration amount is checked by each for loop's condition since the iterations are not able to exceed the number columns or row (i.e. 10) for either loop.
- Within the defend event listener a condition determines if the score is zero, and if so empty quotations are returned to end the functions since if the score is zero the game is over.
- Within the defend event listener a loop now iterates through all the spaces and the active space is found, and then a further condition determines whether the active space and thus active player is either player 1 or player 2.
- Within the defend event listener the active players defend boolean value is set to true so that the next time the inactive player clicks attack their attack will yeild 50 percent less damage then it otherwise would.
- Within the defend event listener the active player is switched and active player's buttons become disabled while the inactive player's buttons become enabled.
- Finally, Within the defend event listener the two loops iterating through the spaces have the respective x and y values set to 11 to end each loop and end the function.
*/
  fight() {
    // The clickable space classes are removed since players will no longer be moving.
    for ( let col = 1; col <= this.board.columns; col++ ) {
      for ( let row = 1; row <= this.board.rows; row++ ) {
        if ( $(`#${col}-${row}`).hasClass("clickableSpace") ) {
          $(`#${col}-${row}`).removeClass("clickableSpace");
        }
      }
    }
    // After 2 seconds a third class is added to the introductory fight image and text causing the image and text to transition to a zero opacity, causing the game board to fully be visible.
    setTimeout(function() { 
      $(`.startFightImageOpacityOne`).addClass("fightingImageGone");
      $(`.fightingTextOpacityOne`).addClass("fightingTextGone");
    }, 2000);
    // Inactive player and active player score span elements are stored in variables.
    const inactivePlayerScoreSpan = $(`.${this.inactivePlayer()}Score`);
    const activePlayerScoreSpan = $(`.${this.activePlayer()}Score`);
    let player1Space;
    let player2Space; 
    // Each player's space is stored in a let variable declared above in a scope external to the loops iterating through the spaces.
    for ( let x = 1; x < 11; x++ ) {
      for ( let y = 1; y < 11; y++ ) {
        if ( $(`#${x}-${y}`).hasClass("player_1") ) {
          player1Space = $(`#${x}-${y}`);
          if ( $(`#${x}-${y}`).hasClass("active") ) {
            $(`.player_2Info .btn-attack`).attr("disabled", "disabled");
            $(`.player_2Info .btn-defend`).attr("disabled", "disabled");
          }
        }
        if ( $(`#${x}-${y}`).hasClass("player_2") ) {
          player2Space = $(`#${x}-${y}`);
          if ( $(`#${x}-${y}`).hasClass("active") ) {
            $(`.player_1Info .btn-attack`).attr("disabled", "disabled");
            $(`.player_1Info .btn-defend`).attr("disabled", "disabled");
          }
        }
      }
    }
    // The defend boolean values for each player are initially set to false and turn to true when the active player's defend button is clicked.
    let defendPlayer1 = false;
    let defendPlayer2 = false;

    // Attack button event listener.
    $(`.btn-attack`).on("click", function() {
      // Empyt quotes returned if either player's score is zero since the game is over.    
      if ( +inactivePlayerScoreSpan.text() === 0 || +activePlayerScoreSpan.text() === 0 ) {
        return "";
      } else {
        // If the game is not over the player whose active and their space is determined.
        for ( let x = 1; x < 11; x++ ) {
          for ( let y = 1; y < 11; y++ ) {
            if ( $(`#${x}-${y}`).hasClass("active") ) {
              if ( $(`#${x}-${y}`).hasClass("player_1") ) {
                // If player 1 is active then player 2's score will be updated to reflect the value of player 2's score subtract player 1's damage amount.
                const activePlayer = "player_1";
                const activePlayerDamage = +$(`.${activePlayer}Info p`).text();
                const inactivePlayer = "player_2";
                let inactivePlayerScore = +$(`.${inactivePlayer}Score`).text();
                const inactivePlayerScoreSpan = $(`.${inactivePlayer}Score`);
                inactivePlayerScore -= activePlayerDamage;
                inactivePlayerScoreSpan.text(inactivePlayerScore);
                // If player two has a defend boolean value of true then their damage will be increased by half the value of player 1's damage amount and their defend boolean value will be reset to false.
                if ( defendPlayer2 === true ) {
                  inactivePlayerScoreSpan.text(inactivePlayerScore + (activePlayerDamage / 2));
                  defendPlayer2 = false;
                }
                // Player 1's buttons will now be disabled since their turn is over.
                $(`.player_1Info .btn-attack`).attr("disabled", "disabled");
                $(`.player_1Info .btn-defend`).attr("disabled", "disabled");
                // If player 2's score is less then one (i.e 20) their score will become zero and a game over message will appear, after which an empty string value will be returned to end the function and the game.
                if ( +inactivePlayerScoreSpan.text() < 1 ) {
                  inactivePlayerScoreSpan.text(0);
                  // A message appears on screen here stating that the game is over.
                  $(`#board`).append(`<div class="gameOverMessage rounded"><h4>Game Over</h4><img src='../img/soldier.svg' class='player1WinnerImg'><img src='../img/trophy.svg'><p>Player 1 is the winner!</p><button class="btn btn-light btn-playAgain" onclick="location.reload()">Play Again</button><button class="btn btn-secondary btn-close" onclick="$('.gameOverMessage').remove()">Close</button></div>`);
                  // 500ms after message first appears an animation causes the player 1 image to scale out and after the image scales the trophy transitions to a 1 opacity from zero.
                  setTimeout(function() { 
                    $(`.player1WinnerImg`).addClass("player1WinnerScaleOutImg");
                    $(`img[src$="trophy.svg"]`).addClass("trophyOpacity1");
                  }, 500);
                  // After just over 3 seconds and after the trophy has appeared player 1's image scales back down to it's original size.
                  setTimeout(function() { 
                    $(`.player1WinnerImg`).addClass("player1WinnerScaleInImg");
                  }, 3200);
                  return "";
                }
                // The active class is now moved from player 1 to player 2's space making player 2 the active player.
                player1Space.removeClass("active");
                player2Space.addClass("active");
                // Player 2's buttons are enabled since player 2 is now the active player.  
                $(`.player_2Info .btn-attack`).removeAttr("disabled");
                $(`.player_2Info .btn-defend`).removeAttr("disabled");
                // The iteration values become 11 to end the two loops iterating through the spaces.
                y = 11;
                x = 11;
              }
              if ( $(`#${x}-${y}`).hasClass("player_2") ) {
                // If player 2 is active then player 1's score will be updated to reflect the value of player 1's score subtract player 2's damage amount.
                const activePlayer = "player_2";
                const activePlayerDamage = +$(`.${activePlayer}Info p`).text();
                const inactivePlayer = "player_1";
                let inactivePlayerScore = +$(`.${inactivePlayer}Score`).text();
                const inactivePlayerScoreSpan = $(`.${inactivePlayer}Score`);
                inactivePlayerScore -= activePlayerDamage;
                inactivePlayerScoreSpan.text(inactivePlayerScore);
                // If player one has a defend boolean value of true then their damage will be increased by half the value of player 2's damage amount and their defend boolean value will be reset to false. 
                if ( defendPlayer1 === true ) {
                  inactivePlayerScoreSpan.text(inactivePlayerScore + (activePlayerDamage / 2));
                  defendPlayer1 = false;
                }
                // Player 2's buttons will now be disabled since their turn is over.
                $(`.player_2Info .btn-attack`).attr("disabled", "disabled");
                $(`.player_2Info .btn-defend`).attr("disabled", "disabled");
                // If player 1's score is less then one (i.e. 20) their score will become zero and a game over message will appear, after which an empty string value will be returned to end the function and the game.
                if ( +inactivePlayerScoreSpan.text() < 1 ) {
                  inactivePlayerScoreSpan.text(0);
                  // A message appears on screen here stating that the game is over.
                  $(`#board`).append(`<div class="gameOverMessage rounded"><h4>Game Over</h4><img src='../img/warrior.svg' class='player2WinnerImg'><img src='../img/trophy.svg'><p>Player 2 is the winner!</p><button class="btn btn-light btn-playAgain" onclick="location.reload()">Play Again</button><button class="btn btn-secondary btn-close" onclick="$('.gameOverMessage').remove()">Close</button></div>`);
                  // 500ms after message an animation occurs which causes the player 2 image to scale out and after the image scales the trophy transitions to a 1 opacity from zero.
                  setTimeout(function() { 
                    $(`.player2WinnerImg`).addClass("player2WinnerScaleOutImg");
                    $(`img[src$="trophy.svg"]`).addClass("trophyOpacity1");
                  }, 500);
                  // After just over 3 seconds and after the trophy has appeared player 2's image scales back down to it's original size.
                  setTimeout(function() { 
                    $(`.player2WinnerImg`).addClass("player2WinnerScaleInImg");
                  },3200);
                  return "";
                }
                // The active class is now moved from player 2 to player 1 making player 1 the active player. 
                player2Space.removeClass("active");
                player1Space.addClass("active");
                // Player 2's buttons are enabled since player 2 is not the active player.  
                $(`.player_1Info .btn-attack`).removeAttr("disabled");
                $(`.player_1Info .btn-defend`).removeAttr("disabled");
                // The iteration values become 11 to end the two loops iterating through the spaces.
                y = 11;
                x = 11;
              }
            }
          } 
        } 
      }
    });

    // The defend button event listener.
    $(`.btn-defend`).on("click", function() {
      // If either players score value is zero an empty string is returned to end the function since is a player's score is zero then the game is over.
      if ( +inactivePlayerScoreSpan.text() === 0 || +activePlayerScoreSpan.text() === 0 ) {
        return "";
      } else {
        // If the game is not over the player whose active and their space is determined.
        for ( let x = 1; x < 11; x++ ) {
          for ( let y = 1; y < 11; y++ ) {
            if ( $(`#${x}-${y}`).hasClass("active") ) {
              if ( $(`#${x}-${y}`).hasClass("player_1") ) {
                // Player 1's defend boolean value is set to true so when player 2 attacks player 1 will suffer only half the damage.
                defendPlayer1 = true;
                // The players are switched so player 1 is inactive and player 2 is active.
                player1Space.removeClass("active");
                player2Space.addClass("active");
                // Player 1's buttons are disabled and player 2's buttons are enabled since the players have switched.
                $(`.player_1Info .btn-attack`).attr("disabled", "disabled");
                $(`.player_1Info .btn-defend`).attr("disabled", "disabled");
                $(`.player_2Info .btn-attack`).removeAttr("disabled");
                $(`.player_2Info .btn-defend`).removeAttr("disabled");
                // The iteration values become 11 to end the two loops iterating through the spaces.
                y = 11;
                x = 11;
              }
              if ( $(`#${x}-${y}`).hasClass("player_2") ) {
                // Player 2's defend boolean value is set to true so when player 1 attacks player 2 will suffer only half the damage. 
                defendPlayer2 = true;
                // The players are switched so player 2 is inactive and player 1 is active.
                player2Space.removeClass("active");
                player1Space.addClass("active");
                // Player 2's buttons are disabled and player 1's buttons are enabled since the players have switched.
                $(`.player_2Info .btn-attack`).attr("disabled", "disabled");
                $(`.player_2Info .btn-defend`).attr("disabled", "disabled");
                $(`.player_1Info .btn-attack`).removeAttr("disabled");
                $(`.player_1Info .btn-defend`).removeAttr("disabled");
                // The iteration values become 11 to end the two loops iterating through the spaces.
                y = 11;
                x = 11;
              }
            }
          } 
        } 
      }
    });
  }

/* Game - movePlayer(clickedSpace) -----
- The clicked space is passed as the arguement which was originally passed through to the game object when the clicked space was clicked.
- Establishes a series of conditions which limit a player to moving only on certain spaces, which are not occupied by any image other then weapons, and are one to three spaces away from the active player, as well as also ensuring the player is not able to hop over the inactive player or obstacle.
- A first condition ensures that a player cannot move onto a space with the inactive player or an obstacle occupying the space.
- A further set of conditions prevents the activePlayer from hopping over the inactive player.
- A further set of conditions prevents the activePlayer from hopping over a pylon by determing if movement is horizontal or vertical, and which direction the player intends to move, followed by checking if there is an obstacle within three spaces of the direction the player has clicked, and finally seeing if the player clicks past the obstacle.  If the player clicks past the obstacle the loop breaks and the function ends.
- A further set of conditions limit player movement only 1 to 3 spaces up, down, left, or right.
- A further set of conditions determines if the active player has clicked on or passed over a weapon, and if so the weapon clicked on or passed over is picked up and the damage amount is updated to the weapon's damage, and the active player's current weapon is placed on the board, unless the active player has no weapon.
- If the above necessary conditions have been met then the activePlayer's image is removed, and their image and associated class styling is added as html to the clicked space element.
- After the active player moves the switch player function is called to switch the active player and inactive player. 
- The fight method is executed at the end of the movePlayer() method if the condition of the former activePlayer having moved beside the former inactive player is true.
*/
  movePlayer(clickedSpace) {
    // Variable declarations
    const activePlayerColumn = this.activeSpace()[0];
    const activePlayerRow = this.activeSpace()[1];
    const activePlayer = this.activePlayer();
    const inactivePlayerColumn = this.inactiveSpace()[0];
    const inactivePlayerRow = this.inactiveSpace()[1];
    const inactivePlayerId = $(`#${this.inactiveSpace()[0]}-${this.inactiveSpace()[1]}`).attr('id');
    const clickedSpaceColumn = +clickedSpace.attr("data-column");
    const clickedSpaceRow = +clickedSpace.attr("data-row");
    // A condition which ensures the player does not move onto a space occupied by another player or obstacle.
    if ( !$(clickedSpace).hasClass("player_1") && !$(clickedSpace).hasClass("player_2") && !$(clickedSpace).hasClass("obstacle") ) {
      // ----- PREVENTING AN ACTIVE PLAYER FROM HOPPING OVER AN INACTIVE PLAYER -----
      // The start of a for loop which is used to iterate three spaces left, right, up and down.
      for ( let i = 1; i < 4; i++ ) {
        // A series of conditions which prevent the active player from hopping over an inactive player by breaking the loop/function if the active player hops over the inactive player.  
        if ( $(`#${activePlayerColumn + i}-${activePlayerRow}`).attr('id') === inactivePlayerId ) {
          if ( inactivePlayerColumn < clickedSpaceColumn ) {
            break;
          }
        }
        if ( $(`#${activePlayerColumn - i}-${activePlayerRow}`).attr('id') === inactivePlayerId ) {
          if ( inactivePlayerColumn > clickedSpaceColumn ) {
            break;
          }
        }
        if ( $(`#${activePlayerColumn}-${activePlayerRow + i}`).attr('id') === inactivePlayerId ) {
          if ( inactivePlayerRow < clickedSpaceRow ) {
            break;
          }
        }
        if ( $(`#${activePlayerColumn}-${activePlayerRow - i}`).attr('id') === inactivePlayerId ) {
          if ( inactivePlayerRow > clickedSpaceRow ) {
            break;
          }
        }

        // ----- PREVENTING A PLAYER FROM HOPPING OVER AN OBSTACLE -----
        // A further set of conditions prevents the activePlayer from hopping over a pylon by determing if movement is horizontal or vertical, and which direction the player intends to move, followed by checking if there is an obstacle within three spaces of the direction the player has clicked, and finally seeing if the player clicks past the obstacle.  If the player clicks past the obstacle the loop breaks and the function ends.
        if ( activePlayerRow === clickedSpaceRow ) {
          if ( activePlayerColumn < clickedSpaceColumn ) {
            if ( $(`#${activePlayerColumn + i}-${activePlayerRow}`).hasClass("obstacle") ) {
              if ( activePlayerColumn + i < clickedSpaceColumn ) {
                break;
              }
            }
          } else {
            if ( $(`#${activePlayerColumn - i}-${activePlayerRow}`).hasClass("obstacle") ) {
              if ( activePlayerColumn - i > clickedSpaceColumn ) {
                break;
              }
            }
          }
        } else {
          if ( activePlayerRow < clickedSpaceRow ) {
            if ( $(`#${activePlayerColumn}-${activePlayerRow + i}`).hasClass("obstacle") ) {
              if ( activePlayerRow + i < clickedSpaceRow ) {
                break;
              }
            }
          } else {
            if ( $(`#${activePlayerColumn}-${activePlayerRow - i}`).hasClass("obstacle") ) {
              if ( activePlayerRow - i > clickedSpaceRow ) {
                break;
              }
            }
          }
        }

        // A condition which determines if the active player has clicked three spaces up, down, left or right.
        if ( $(`#${activePlayerColumn + i}-${activePlayerRow}`).attr('id') === clickedSpace.attr('id') || $(`#${activePlayerColumn - i}-${activePlayerRow}`).attr('id') === clickedSpace.attr('id') || $(`#${activePlayerColumn}-${activePlayerRow + i}`).attr('id') === clickedSpace.attr('id') || $(`#${activePlayerColumn}-${activePlayerRow - i}`).attr('id') === clickedSpace.attr('id') ) {
          // ----- MOVING PAST A SPACE[S] WITH A WEAPON -----
          // Conditions which determine if the active moving player passes over a weapon.
          // An array filters through the weapons, and returns only those weapon which are not undefined, in other words only the weapons on the board are returned into the array, and not the weapons in a player's possession.
          // The code which runs when a player passes over a weapon, is put through two for loops.  The first loop accounts for the number of spaces to check for a weapon being passed over, while the second loops accounts for the number of weapons on the board to locate.
          // A first condition checks if a player clicks on the space with the weapon three spaces away, or if a space clicked three spaces away at the first running of the loop has a weapon. 
          // It is necessary to check if a weapon is clicked three spaces away since in the event that beside the active player is an empty space followed by a weapon, and then in the next space another weapon which is clicked, the condition allows the weapon two spaces away to not remain untouched since the conditions will now not only be true if a weapon space is clicked or if the space with the weapon is directly beside the active player's space but also if the weapon is two spaces away from the active player and one space past the weapon is a weapon which is clicked. 
          // Another if condition checks the if the click moved past a weapon, and also is used to determine what the type is of the weapon that was passed over by comparing the id of the weapon's space that was passed over with the id of one of the weapons in the definedWeaponSpacesArray which holds all the weapons currently visible on the board.
          // The definedWeaponSpacesArray iteration which had an id equal to the weapon's space's id is then used to define the correct iteration within the definedWeaponSpacesArray which then with a further index value of 1 yields the name of the weapon, and the name is placed in the variable weaponToBePickedUp, and with index value two gives the damage of the weapon, which is placed in the updatedDamage variable.
          // The space with the weapon that was passed over now has that space's weapon, and type of weapon class  removed, as well as the child weapon image element. 
          // Another further set of conditions checks what that active player's damage value is in order to determine the type of weapon the active player has.  
          // If the damage value is the default 10 then no weapon image is placed onto the space where the active player has just collected a weapon since the active player is not in possession of any weapon.
          // If a player's damage is not 10, then one of the four conditions testing the damage amount will be true, first causing the space with the weapon to be given the weapon type class associated with the weapon which has the same amount of damage as the player currently has on their banner.
          // Secondly, if one of the four conditions testing the damage amount will be true, then the active player's weapon property will be filled with the array iteration within the spacesWithWeapons array which holds the information regarding the weapon the player currently has and is about to leave and replace with the weapon the active player is picking up. The weapon type class is added first since the spacesWithWeapons array filters through the spaces looking for weapons on the basis of the space having a weapon type class, and no space will have the weapon type class of the weapon in the active player's possession since that weapon has not been placed on the board and is still in the active player's possession.
          // Now another condition tests if the player has a weapon, and if so then places that weapon on the space where the previous weapon was removed and adds the appropriate weapon type classes using the active player's weapon property's weapon name iteration, as well as adding the weapon class.
          // The new damage amout is now updated using the updatedDamage variable.
          // The loop will now break unless there is a weapon in the next two spaces over from the weapon that was hopped over and picked up, in order to ensure that if the click was past those spaces the weapons occupying those spaces can also have their weapons picked up and the active player's weapon dropped off.
          
          // An array with only weapons found on the board and not in any of player's possession.
          const definedWeaponSpacesArray = this.spacesWithWeapons().filter(function(element) {
            if ( element !== undefined ) {
              return element;
            }
          });
          // A loop used to iterate three spaces away from the active player.
          for ( let i = 1; i < 4; i++ ) {
            // A loop used to iterate through the array containing only weapons found on the board.
            for ( let sww = 0; sww < definedWeaponSpacesArray.length; sww++ ) {
              //Weapons picked up as player moves right passing over the weapon.
              if ( ( $(`#${activePlayerColumn + i}-${activePlayerRow}`).hasClass("weapon") && activePlayerColumn + i !== clickedSpaceColumn ) || ( $(`#${activePlayerColumn + i + 2 }-${activePlayerRow}`).hasClass("weapon") && activePlayerColumn + i + 2 === clickedSpaceColumn ) ) {
                if ( activePlayerColumn + i < clickedSpaceColumn && $(`#${activePlayerColumn + i}-${activePlayerRow}`).attr("id") === $(definedWeaponSpacesArray[sww][0]).attr("id") ) {
                  const weaponToBePickedUp = definedWeaponSpacesArray[sww][1];
                  const updatedDamage = definedWeaponSpacesArray[sww][2];
                  // Remove the weapon to be picked up's associated image and classes.
                  $(`#${activePlayerColumn + i}-${activePlayerRow}`).removeClass("weapon").removeClass(`w-${weaponToBePickedUp}`).children().remove();   
                  // Player has hammer in ititial possession.          
                  if ( +$(`.${activePlayer}Info p`).text() === 20 ) {
                    $(`#${activePlayerColumn + i}-${activePlayerRow}`).addClass("w-hammer");
                    this.activePlayerWeapon().weapon = this.spacesWithWeapons()[0];
                  }
                  // Player has crossbow in initial possession.
                  if ( +$(`.${activePlayer}Info p`).text() === 30 ) {
                    $(`#${activePlayerColumn + i}-${activePlayerRow}`).addClass("w-crossbow");
                    this.activePlayerWeapon().weapon = this.spacesWithWeapons()[1];
                  }
                  // Player has sword in initial possession.
                  if ( +$(`.${activePlayer}Info p`).text() === 40 ) {
                    $(`#${activePlayerColumn + i}-${activePlayerRow}`).addClass("w-sword");
                    this.activePlayerWeapon().weapon = this.spacesWithWeapons()[2];
                  }
                  // Player has gun in initial possession.
                  if ( +$(`.${activePlayer}Info p`).text() === 50 ) {
                    $(`#${activePlayerColumn + i}-${activePlayerRow}`).addClass("w-gun");
                    this.activePlayerWeapon().weapon = this.spacesWithWeapons()[3];
                  }
                  // If a player has a weapon the weapon is placed on the board in replacement of the weapon the active player has just picked up.
                  if ( this.activePlayerWeapon().weapon.length > 0 ) {                   
                    $(`#${activePlayerColumn + i}-${activePlayerRow}`).append($(`<img src='../img/${this.activePlayerWeapon().weapon[1]}.svg'>`).addClass(`${this.activePlayerWeapon().weapon[1]}`)).addClass("weapon");                                  
                  }
                  // The active player's damage amount is updated.
                  $(`.${activePlayer}Info p`).text(updatedDamage);
                  // If they're any other weapons in the two spaces away from the space the active player has picked up a weapon then the loop will continue and if not then the loop breaks in order to account for the possibility the clicked space was on or beyond either of those other two spaces with weapons.
                  if ( $(`#${activePlayerColumn + i + 1 }-${activePlayerRow}`).hasClass("weapon") || $(`#${activePlayerColumn + i + 2 }-${activePlayerRow}`).hasClass("weapon") ) {
                    continue; 
                  } else {
                    i = 3;
                    break;
                  } 
                }
              }
              //Weapons picked up as player moves left passing over the weapon.
              if ( ( $(`#${activePlayerColumn - i}-${activePlayerRow}`).hasClass("weapon") && activePlayerColumn - i !== clickedSpaceColumn ) || ( $(`#${activePlayerColumn - i - 2 }-${activePlayerRow}`).hasClass("weapon") && activePlayerColumn - i - 2 === clickedSpaceColumn ) ) {
                if (  activePlayerColumn - i > clickedSpaceColumn && $(`#${activePlayerColumn - i}-${activePlayerRow}`).attr("id") === $(definedWeaponSpacesArray[sww][0]).attr("id") ) {
                  const weaponToBePickedUp = definedWeaponSpacesArray[sww][1];
                  const updatedDamage = definedWeaponSpacesArray[sww][2];
                  // Remove the weapon to be picked up's associated image and classes.
                  $(`#${activePlayerColumn - i}-${activePlayerRow}`).removeClass("weapon").removeClass(`w-${weaponToBePickedUp}`).children().remove();
                  // Player has hammer in initial possession.           
                  if ( +$(`.${activePlayer}Info p`).text() === 20 ) {
                    $(`#${activePlayerColumn - i}-${activePlayerRow}`).addClass("w-hammer").removeClass(`w-${weaponToBePickedUp}`);
                    this.activePlayerWeapon().weapon = this.spacesWithWeapons()[0];
                  }
                  // Player has crossbow in initial possession.
                  if ( +$(`.${activePlayer}Info p`).text() === 30 ) {
                    $(`#${activePlayerColumn - i}-${activePlayerRow}`).addClass("w-crossbow");
                    this.activePlayerWeapon().weapon = this.spacesWithWeapons()[1];
                  }
                  // Player has sword in initial possession.
                  if ( +$(`.${activePlayer}Info p`).text() === 40 ) {
                    $(`#${activePlayerColumn - i}-${activePlayerRow}`).addClass("w-sword");
                    this.activePlayerWeapon().weapon = this.spacesWithWeapons()[2];
                  }
                  // // Player has gun in initial possession.
                  if ( +$(`.${activePlayer}Info p`).text() === 50 ) {
                    $(`#${activePlayerColumn - i}-${activePlayerRow}`).addClass("w-gun");
                    this.activePlayerWeapon().weapon = this.spacesWithWeapons()[3];
                  } 
                  // If a player has a weapon the weapon is placed on the board in replacement of the weapon the active player has just picked up.
                  if ( this.activePlayerWeapon().weapon.length > 0 ) {                   
                    $(`#${activePlayerColumn - i}-${activePlayerRow}`).append($(`<img src='../img/${this.activePlayerWeapon().weapon[1]}.svg'>`).addClass(`${this.activePlayerWeapon().weapon[1]}`)).addClass("weapon");                                  
                  }
                  // The active player's damage amount is updated.
                  $(`.${activePlayer}Info p`).text(updatedDamage);
                  // If they're any other weapons in the two spaces away from the space the active player has picked up a weapon then the loop will continue and if not then the loop breaks in order to account for the possibility the clicked space was on or beyond either of those other two spaces with weapons.
                  if ( $(`#${activePlayerColumn - i - 1 }-${activePlayerRow}`).hasClass("weapon") || $(`#${activePlayerColumn - i - 2 }-${activePlayerRow}`).hasClass("weapon") ) {
                    continue; 
                  } else {
                    i = 3;
                    break;
                  }
                }
              }
              //Weapons picked up as player moves downward passing over the weapon.
              if ( ( $(`#${activePlayerColumn}-${activePlayerRow + i}`).hasClass("weapon") && activePlayerRow + i !== clickedSpaceRow ) || ( $(`#${activePlayerColumn}-${activePlayerRow + i + 2}`).hasClass("weapon") && activePlayerRow + i + 2 === clickedSpaceRow ) ) {
                if ( activePlayerRow + i < clickedSpaceRow && $(`#${activePlayerColumn}-${activePlayerRow + i}`).attr("id") === $(definedWeaponSpacesArray[sww][0]).attr("id") ) {
                  const weaponToBePickedUp = definedWeaponSpacesArray[sww][1];
                  const updatedDamage = definedWeaponSpacesArray[sww][2];
                  // Remove the weapon to be picked up's associated image and classes.
                  $(`#${activePlayerColumn}-${activePlayerRow + i}`).removeClass("weapon").removeClass(`w-${weaponToBePickedUp}`).children().remove();             
                  // Player has hammer in  initial possession.
                  if ( +$(`.${activePlayer}Info p`).text() === 20 ) {
                    $(`#${activePlayerColumn}-${activePlayerRow + i}`).addClass("w-hammer");
                    this.activePlayerWeapon().weapon = this.spacesWithWeapons()[0];
                  }
                  // Player has crossbow in initial possession.
                  if ( +$(`.${activePlayer}Info p`).text() === 30 ) {
                    $(`#${activePlayerColumn}-${activePlayerRow + i}`).addClass("w-crossbow");
                    this.activePlayerWeapon().weapon = this.spacesWithWeapons()[1];
                  }
                  // Player has sword in initial possession.
                  if ( +$(`.${activePlayer}Info p`).text() === 40 ) {
                    $(`#${activePlayerColumn}-${activePlayerRow + i}`).addClass("w-sword");
                    this.activePlayerWeapon().weapon = this.spacesWithWeapons()[2];
                  }
                  // // Player has gun in initial possession.
                  if ( +$(`.${activePlayer}Info p`).text() === 50 ) {
                    $(`#${activePlayerColumn}-${activePlayerRow + i}`).addClass("w-gun");
                    this.activePlayerWeapon().weapon = this.spacesWithWeapons()[3];
                  } 
                  // If a player has a weapon the weapon is placed on the board in replacement of the weapon the active player has just picked up.
                  if ( this.activePlayerWeapon().weapon.length > 0 ) {                   
                    $(`#${activePlayerColumn}-${activePlayerRow + i}`).append($(`<img src='../img/${this.activePlayerWeapon().weapon[1]}.svg'>`).addClass(`${this.activePlayerWeapon().weapon[1]}`)).addClass("weapon");                                  
                  }
                  // The active player's damage amount is updated.
                  $(`.${activePlayer}Info p`).text(updatedDamage);
                  // If they're any other weapons in the two spaces away from the space the active player has picked up a weapon then the loop will continue and if not then the loop breaks in order to account for the possibility the clicked space was beyond or at those other two spaces with weapons.                
                  if ( $(`#${activePlayerColumn}-${activePlayerRow + i + 1}`).hasClass("weapon") || $(`#${activePlayerColumn}-${activePlayerRow + i + 2 }`).hasClass("weapon") ) {
                    continue; 
                  } else {
                    i = 3;
                    break;
                  } 
                }
              }
              //Weapons picked up as player moves upward passing over the weapon.
              if ( ( $(`#${activePlayerColumn}-${activePlayerRow - i}`).hasClass("weapon") && activePlayerRow - i !== clickedSpaceRow ) || ( $(`#${activePlayerColumn}-${activePlayerRow - i - 2}`).hasClass("weapon") && activePlayerRow - i - 2 === clickedSpaceRow ) ) {
                if ( activePlayerRow - i > clickedSpaceRow && $(`#${activePlayerColumn}-${activePlayerRow - i}`).attr("id") === $(definedWeaponSpacesArray[sww][0]).attr("id") ) {
                  const weaponToBePickedUp = definedWeaponSpacesArray[sww][1];
                  const updatedDamage = definedWeaponSpacesArray[sww][2];
                  // Remove the weapon to be picked up's associated image and classes.
                  $(`#${activePlayerColumn}-${activePlayerRow - i}`).removeClass("weapon").removeClass(`w-${weaponToBePickedUp}`).children().remove();             
                  // Player has hammer initial possession.
                  if ( +$(`.${activePlayer}Info p`).text() === 20 ) {
                    $(`#${activePlayerColumn}-${activePlayerRow - i}`).addClass("w-hammer");
                    this.activePlayerWeapon().weapon = this.spacesWithWeapons()[0];
                  }
                  // Player has crossbow in initial possession.
                  if ( +$(`.${activePlayer}Info p`).text() === 30 ) {
                    $(`#${activePlayerColumn}-${activePlayerRow - i}`).addClass("w-crossbow");
                    this.activePlayerWeapon().weapon = this.spacesWithWeapons()[1];
                  }
                  // Player has sword in initial possession.
                  if ( +$(`.${activePlayer}Info p`).text() === 40 ) {
                    $(`#${activePlayerColumn}-${activePlayerRow - i}`).addClass("w-sword");
                    this.activePlayerWeapon().weapon = this.spacesWithWeapons()[2];
                  }
                  // // Player has gun in initial possession.
                  if ( +$(`.${activePlayer}Info p`).text() === 50 ) {
                    $(`#${activePlayerColumn}-${activePlayerRow - i}`).addClass("w-gun");
                    this.activePlayerWeapon().weapon = this.spacesWithWeapons()[3];
                  } 
                  // If a player has a weapon the weapon is placed on the board in replacement of the weapon the active player has just picked up.
                  if ( this.activePlayerWeapon().weapon.length > 0 ) {                   
                    $(`#${activePlayerColumn}-${activePlayerRow - i}`).append($(`<img src='../img/${this.activePlayerWeapon().weapon[1]}.svg'>`).addClass(`${this.activePlayerWeapon().weapon[1]}`)).addClass("weapon");                                  
                  }
                  // The active player's damage amount is updated.
                  $(`.${activePlayer}Info p`).text(updatedDamage);                
                  // If they're any other weapons in the two spaces away from the space the active player has picked up a weapon then the loop will continue and if not then the loop breaks in order to account for the possibility the clicked space was beyond or at those other two spaces with weapons.
                  if ( $(`#${activePlayerColumn}-${activePlayerRow - i - 1}`).hasClass("weapon") || $(`#${activePlayerColumn}-${activePlayerRow - i - 2 }`).hasClass("weapon")) {
                    continue; 
                  } else {
                    i = 3;
                    break;
                  }
                }
              }
            }
          }

          // ----- CLICKING ON A SPACE WITH A WEAPON -----
          //The conditions are used to determine whether the space clicked was a weapon, if so what type of weapon inorder for an exhange of weapons to occur, or if no weapons are in possession of the active player the weapon clicked on will be picked up only.
          // A loop runs a single iteration over the conditions and code which pick and drop a weapon when a space with a weapon is clicked on in order to ensure that when a weapon is swapped another condition looking for the weapon that just replaced the weapon picked up will cause the weapon on the board to be picked up and be replaced with the weapon originally on the board, giving the appearance that no weapon was picked up at all.
          for ( let i = 0; i < 1; i++ ) {            
          // A first condition checks for the type of weapon which may be occupying the clicked space by checking if the clicked space has a class which represents a weapons name.
          // The clicked space now has the weapon's image removed as well as the classes of weapon and the type of weapon class.
          // After determining the type of weapon occupying the clicked space a further condition checks to see what weapon is currently in the player's possesion, if any, by in the condition, selecting for the damage amount of the active player, and then determining if the activePlayer's damage amount is equal to one of the damage amounts of the weapons.  
          // Thus, if the damage amount of the active player is the same as the damage amount of a weapon then that weapon will be the weapon currently possessed by the active player.
          // Once the player's current weapon and weapon to be picked up has been determined the current weapon's class of "w-'weapon'" will be added while the weapon on the clicked space's class is removed in order to make the clicked space weapon still appear when the spaceswithWeapons() array is called.
          // The activePlayer's weapon's property is updated to reflect the weapon they currently possess, but is not initially in their weapon property since for every click the weapon property is reset to an empty array.  This is why it is necessary to add the "w-weapon" class of the weapon in the active player's possession to the clicked space because the weapon was not on the board, and thus did not have a class to be included in the spacesWithWeapons array.
          // If the damage was the default initial values of 10 then all of the conditions searching for the type of possessed weapon will be by-passed and the damage will be updated to reflect the picked up weapon, the picked up weapon will disappear, and the loop will break to allow the rest of the movePlayer function to finish.
          // If the damage was not the default value then the condition checking if they're any weapons in possession will be true and the weapon in the active player's possession will be placed onto the clicked space by using the weapons name stored in the active player's weapon property to represent the image's name in the source attribute, as well as using the weapon's name in the active player's weapon property to add the class representing active player's previoulsy possessed weapon's name.
          // The damage amount of the active player is updated to reflect the damage amount of the just picked up weapon and the loop breaks.

          // Clicking on the hammer space.
            if ( $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).children().hasClass("hammer") ) {
              // Remove the weapon to be picked up's associated image and classes.
              $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).removeClass("weapon").removeClass("w-hammer").children().remove();
              // Player has crossbow in initial possession.
              if ( +$(`.${activePlayer}Info p`).text() === 30 ) {
                $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).addClass("w-crossbow");
                this.activePlayerWeapon().weapon = this.spacesWithWeapons()[1];
              }
              // Player has sword in initial possession.
              if ( +$(`.${activePlayer}Info p`).text() === 40 ) {
                $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).addClass("w-sword");
                this.activePlayerWeapon().weapon = this.spacesWithWeapons()[2];
              }
              // Player has gun in initial possession.
              if ( +$(`.${activePlayer}Info p`).text() === 50 ) {
                $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).addClass("w-gun");
                this.activePlayerWeapon().weapon = this.spacesWithWeapons()[3];
              } 
              // If a player has a weapon the weapon is placed on the board in replacement of the weapon the active player has just picked up.
              if ( this.activePlayerWeapon().weapon.length > 0 ) {                  
                $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).append($(`<img src='../img/${this.activePlayerWeapon().weapon[1]}.svg'>`).addClass(`${this.activePlayerWeapon().weapon[1]}`)).addClass("weapon");                                  
              }
              // The active player's damage amount is updated and the loop breaks to allow the player to move.
              $(`.${activePlayer}Info p`).text(20);
              break;             
            }
            // Clicking on the crossbow space.
            if ( $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).children().hasClass("crossbow") ) {
              // Remove the weapon to be picked up's associated image and classes.
              $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).removeClass("weapon").removeClass("w-crossbow").children().remove();
              // Player has hammer in initial possession. 
              if ( +$(`.${activePlayer}Info p`).text() === 20 ) {
                $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).addClass("w-hammer");
                this.activePlayerWeapon().weapon = this.spacesWithWeapons()[0];
              }
              // Player has sword in initial possession.
              if ( +$(`.${activePlayer}Info p`).text() === 40 ) {
                $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).addClass("w-sword");
                this.activePlayerWeapon().weapon = this.spacesWithWeapons()[2];
              }
              // Player has gun in initial possession.
              if ( +$(`.${activePlayer}Info p`).text() === 50 ) {
                $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).addClass("w-gun");
                this.activePlayerWeapon().weapon = this.spacesWithWeapons()[3];
              } 
              // If a player has a weapon the weapon is placed on the board in replacement of the weapon the active player has just picked up.
              if ( this.activePlayerWeapon().weapon.length > 0 ) {                  
                $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).append($(`<img src='../img/${this.activePlayerWeapon().weapon[1]}.svg'>`).addClass(`${this.activePlayerWeapon().weapon[1]}`)).addClass("weapon");                                  
              }
              // The active player's damage amount is updated and the loop breaks to allow the player to move.
              $(`.${activePlayer}Info p`).text(30);
              break;   
            }
            // Clicking on the sword space.
            if ( $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).children().hasClass("sword") ) {
              // Remove the weapon to be picked up's associated image and classes.
              $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).removeClass("weapon").removeClass("w-sword").children().remove();
              // Player has hammer in initial possession.
              if ( +$(`.${activePlayer}Info p`).text() === 20 ) {
                $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).addClass("w-hammer");
                this.activePlayerWeapon().weapon = this.spacesWithWeapons()[0];
              }
              // Player has crossbow in initial possession.
              if ( +$(`.${activePlayer}Info p`).text() === 30 ) {
                $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).addClass("w-crossbow");
                this.activePlayerWeapon().weapon = this.spacesWithWeapons()[1];
              }
              // Player has gun in initial possession.
              if ( +$(`.${activePlayer}Info p`).text() === 50 ) {
                $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).addClass("w-gun");
                this.activePlayerWeapon().weapon = this.spacesWithWeapons()[3];
              } 
              // If a player has a weapon the weapon is placed on the board in replacement of the weapon the active player has just picked up.
              if ( this.activePlayerWeapon().weapon.length > 0 ) {                  
                $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).append($(`<img src='../img/${this.activePlayerWeapon().weapon[1]}.svg'>`).addClass(`${this.activePlayerWeapon().weapon[1]}`)).addClass("weapon");                                  
              } 
              // The active player's damage amount is updated and the loop breaks to allow the player to move.
              $(`.${activePlayer}Info p`).text(40);
              break;   
            }
            // Clicking on the gun space.
            if ( $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).children().hasClass("gun") ) {
              // Remove the weapon to be picked up's associated image and classes.
              $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).removeClass("weapon").removeClass("w-gun").children().remove();
              // Player has hammer in initial possession.
              if ( +$(`.${activePlayer}Info p`).text() === 20 ) {
                $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).addClass("w-hammer");
                this.activePlayerWeapon().weapon = this.spacesWithWeapons()[0];
              }
              // Player has crossbow in initial possession.
              if ( +$(`.${activePlayer}Info p`).text() === 30 ) {
                $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).addClass("w-crossbow");
                this.activePlayerWeapon().weapon = this.spacesWithWeapons()[1];
              }
              // Player has sword in initial possession.
              if ( +$(`.${activePlayer}Info p`).text() === 40 ) {
                $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).addClass("w-sword");
                this.activePlayerWeapon().weapon = this.spacesWithWeapons()[2];
              } 
              // If a player has a weapon the weapon is placed on the board in replacement of the weapon the active player has just picked up.
              if ( this.activePlayerWeapon().weapon.length > 0 ) {                  
                $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).append($(`<img src='../img/${this.activePlayerWeapon().weapon[1]}.svg'>`).addClass(`${this.activePlayerWeapon().weapon[1]}`)).addClass("weapon");                                  
              } 
              // The active player's damage amount is updated and the loop breaks to allow the player to move.
              $(`.${activePlayer}Info p`).text(50);
              break;   
            }
          }

          // If the appropriate conditions above are met the activePlayer's image is removed.
          $(`#${activePlayerColumn}-${activePlayerRow} img:last-of-type`).remove();

          // -----  MOVING PLAYER ------
          // A condition determines if player 1 is the active player and then removes the class of player 1 from player 1's space, appends the player 1 image to the clicked space while adding player1Img class to player 1's image, and player 1's class to the just clicked on space. The players are switched.
          // A clickedPreviousSpaceArray contains the clicked space and the previous active player's space which are both then used in the availableSpaces method to highlight available spaces for the new active player's turn.
          if ( activePlayer === "player_1") {
            $(`#${activePlayerColumn}-${activePlayerRow}`).removeClass('player_1');
            clickedSpace.append($("<img src='../img/soldier.svg'>").addClass("player1Img")).addClass("player_1");
            const previousPlayerSpace = $(`#${activePlayerColumn}-${activePlayerRow}`);
            this.switchPlayer();
            let clickedPreviousSpaceArray = [];
            clickedPreviousSpaceArray.push(clickedSpace);
            clickedPreviousSpaceArray.push(previousPlayerSpace);
            this.availableSpaces(clickedPreviousSpaceArray);       
          }
          // A condition determines if player 2 is the active player and then removes the class of player 2 from player 2's space, appends the player 2 image to the clicked space while adding player2Img class to player 2's image, and player 2's class to the just clicked on space. The players are switched.
          // A clickedPreviousSpaceArray contains the clicked space and the previous active player's space which are both then used in the availableSpaces method to highlight available spaces for the new active player's turn.
          if ( activePlayer === "player_2") {
            $(`#${activePlayerColumn}-${activePlayerRow}`).removeClass('player_2');
            clickedSpace.append($("<img src='../img/warrior.svg'>").addClass("player2Img")).addClass("player_2");
            const previousPlayerSpace = $(`#${activePlayerColumn}-${activePlayerRow}`);
            this.switchPlayer();
            let clickedPreviousSpaceArray = [];
            clickedPreviousSpaceArray.push(clickedSpace);
            clickedPreviousSpaceArray.push(previousPlayerSpace);
              this.availableSpaces(clickedPreviousSpaceArray);     
          }

          // ----- START OF FIGHT ----- 
          // A condition which if true calls the function which initiates the fight between player 1 and player 2 if the activePlayer is in a square directly left, right, up, or down from the inactive player.
          if ( $(`#${inactivePlayerColumn + 1}-${inactivePlayerRow}`).attr('id') === clickedSpace.attr("id") || $(`#${inactivePlayerColumn - 1}-${inactivePlayerRow}`).attr('id') === clickedSpace.attr("id") || $(`#${inactivePlayerColumn}-${inactivePlayerRow + 1}`).attr('id') === clickedSpace.attr("id") || $(`#${inactivePlayerColumn}-${inactivePlayerRow - 1}`).attr('id') === clickedSpace.attr("id") ) {
            //Append the html and classes causing the starting fight image and text to appear as an overlay on the board with an initial opacity of zero.
            $(`#board`).append($("<img src='../img/two_boxers.svg'>").addClass("startFightImageOpacityZero"));
            // The player's id plus one (plus one is to account for the player array index starting at 0) is determined in order to use this value as the player's number in the text which appears to tell the player whose turn it is to start the fight.
            let playerId;
            for ( let i = 0; i < this.players.length; i++ ) {
              if ( this.players[i].name === this.activePlayer() ) {
                playerId = this.players[i].id;
              }
            }
            $(`#board`).append($(`<h2>Let the fight begin!<br>It's Player ${+playerId + 1}'s turn.</br></h2>`).addClass("fightingTextOpacityZero"));
            // After 750 milliseconds have passed allowing for the player to visually be seen having moved beside each other a new class will be added to the introductory fight image and text allowing for the image and text to appear slowly as their opacities transition.
            setTimeout( function() {
              $(".startFightImageOpacityZero").addClass("startFightImageOpacityOne");
              $(".fightingTextOpacityZero").addClass("fightingTextOpacityOne");
            }, 750);
            // The fight method is called causing the fight to begin.
            this.fight();
            //Disable the active players defend button for the first move of the fight only.
            $(`.${this.activePlayer()}Info .btn-defend`).attr("disabled", "disabled");
          }
        }
      }
    }
  }
}