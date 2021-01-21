// ----- Game Class
class Game {
  constructor(clickedSpace) {
    this.board = new Board();
    this.players = this.players();
    this.movePlayer = this.movePlayer(clickedSpace);
    this.fighting = false;
  }

// Game - players() - create the players by calling the player class twice with arguements passed unique to player 1 and player 2.  Store both player objects in a player array.
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

// Game - activePlayer() - determines the active player by finding the space with a class of active, and then matching the space with class active's player value with a player name from the player's array. The active player's name is returned.
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

  // Game - activePlayerWeapon() - returns the activePlayer's weapon
  activePlayerWeapon() {
    if ( this.activePlayer() === "player_1" ) {
      return this.players[0].weapon;
    } else {
      return this.players[1].weapon;
    }
  }

  // Game - inactivePlayer() - determines the inactive player by returning the name of the player who's name is not the name of the active player
  inactivePlayer() {
    for (let i = 0; i < this.players.length; i++) {
      if ( this.players[i].name !== this.activePlayer() ) {
        return this.players[i].name; 
      }
    }
  }

// Game - activeSpace() - finds the active space by looping through all the spaces and comparing that spaces player class name to the activePlayer name
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

// Game - inactiveSpace() - an array of the x and y id  values of the space occupied by the inactive player is returned by matching the player names in a given space with the inactive player's name.
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

// Game - switchPlayer() - switches the active player by finding the space which has the active player and removing the class of active and giving the class of active to the space with the inactive player.
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
- The arguement pass through is an array containing the clicked space which is set to the clickedSpace variable, and an array containing the previously active space which is set to the variable previousSpace.
- The activeSpace is derived from the activeSpace method in the Game object class.
- A series of variables to be used in the condition section pertaining to the obstacle's column and row values, and the inactive player's column and row values are then stated.
- Remove the clickableSpace from the top, bottom, left and right of the previous active space.
- Iterate through array of clickable spaces, spaces three spaces top, bottom, left or right of the active space, and add the clickableSpace class to each space three spaces away from the active space.
- A condition is given which removes the clickableSpace class from spaces which have the inactive player or contain an obstacle.
- Another condition checks if there is an obstacle three spaces from the active player and stores the obstacle's column or row value in an obstacle variable.
- Another condition checks if the space with the "clickableSpace" class is beyond the obstacle, and if so then space with the "clickableSpace" class has its "clickableSpace" class removed.
- Another condition checks if there is an inactive player three spaces from the active player and stores the inactive player's column or row value in an inactive player variable.
- Another condition checks if a space with class "clickableSpace" is beyond the inactive player, and if so then the space with the "clickableSpace" class has the "clickableSpace" class removed.
- The above 5 conditions are all given regardless of whether the spaces with the "clickableSpace" class are above, below, left or right by adding or subtracting the iteration's variable's value from both the column and row of the active space every time this function is executed.
*/
  availableSpaces(clickedPreviousSpaceArray) {
    // Variables from the arguement array.
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
    // Variables declared to be used in later condition involving ensuring a space with class "clickableSpace" is not found beyond an inactive player or obstacle.
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
      // 3 spaces to the right of player 1 are initially given the clickableSpace class and highlighted.
      $(`#${activePlayerColumn + i}-${activePlayerRow}`).addClass("clickableSpace");
      // Conditions to determine which spaces to the right of the player 1 will have the class clickableSpace and their highlighting removed.
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

      //  3 spaces to the left of player 1 are initially given the clickableSpace class and highlighted.
      $(`#${activePlayerColumn - i}-${activePlayerRow}`).addClass("clickableSpace");
      // Conditions to determine which spaces to the left of the player 1 will have the class clickableSpace and their highlighting removed.
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

      // 3 spaces to the below player 1 are initially given the clickableSpace class and highlighted.
      $(`#${activePlayerColumn}-${activePlayerRow + i}`).addClass("clickableSpace");
      // // Conditions to determine which spaces below player 1 will have the class clickableSpace and their highlighting removed.
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

      // // // 3 spaces above player 1 are initially given the clickableSpace class and highlighted.
      $(`#${activePlayerColumn}-${activePlayerRow - i}`).addClass("clickableSpace");
      // // Conditions to determine which spaces above player 1 will have the class clickableSpace and their highlighting removed.
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
  - For spaces which have a weapon a further condition determines the type of weapon by selecting for the specific weapon type class of the image of the space containing the weapon.
  - An array containing the space the weapon occupies, the weapon's name, and the weapon's damage are stored in a globally declared variable named after the weapon.
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
- A method which determines if fightTime is set to true so the fight is set to begin and then executes code which makes the fight happen.
- The spaces array is iterated through and a condition determines which spaces have the clickable space class.
- If the condition is met the clickableSpace class is removed on all spaces at the moment when player 1 and player 2 meet beside each other.
*/
  fight() {
    // Remove the clickable space classes since players will no longer be moving.
    // Determine who the activePlayer is. And determine their damage amount and points.
    // Add event listener on attack and defend buttons and subsequently run code which effects the inactive players score.
    // After each move check if the score has reached zero.
    // If the score has reached zero place a modal window using bootstrap which proclaims who the winner and loser's are.
    for ( let col = 1; col <= this.board.columns; col++ ) {
      for ( let row = 1; row <= this.board.rows; row++ ) {
        if ( $(`#${col}-${row}`).hasClass("clickableSpace") ) {
          $(`#${col}-${row}`).removeClass("clickableSpace");
        }
      }
    }
    //Have message coming on the screen here saying the fight is about to begin
    console.log("Get ready to fight.");
    const inactivePlayerScoreSpan = $(`.${this.inactivePlayer()}Score`);
    const activePlayerScoreSpan = $(`.${this.activePlayer()}Score`);
    $(`.btn-attack`).on("click", function(event) {    
      if ( +inactivePlayerScoreSpan.text() === 0 || +activePlayerScoreSpan.text() === 0 ) {
        return "";
      } else {
        let player1Space;
        let player2Space; 
        for ( let x = 1; x < 11; x++ ) {
          for ( let y = 1; y < 11; y++ ) {
            if ( $(`#${x}-${y}`).hasClass("player_1") ) {
              player1Space = $(`#${x}-${y}`);
            }
            if ( $(`#${x}-${y}`).hasClass("player_2") ) {
              player2Space = $(`#${x}-${y}`);
            }
          }
        }
        for ( let x = 1; x < 11; x++ ) {
          for ( let y = 1; y < 11; y++ ) {
            if ( $(`#${x}-${y}`).hasClass("active") ) {
              if ( $(`#${x}-${y}`).hasClass("player_1") ) {
                //player 1 starts as active player and then switches to player 2
                const activePlayer = "player_1";
                if ( $(`#${activePlayer}Attack`).attr("id") !== $(event.target).attr("id") ) {
                  alert("It is player 1's turn.");
                  return "";
                }
                const activePlayerDamage = +$(`.${activePlayer}Info p`).text();
                // const activePlayerAttackButton = $(`#${activePlayer}Attack`);
                const inactivePlayer = "player_2";
                let inactivePlayerScore = +$(`.${inactivePlayer}Score`).text();
                const inactivePlayerScoreSpan = $(`.${inactivePlayer}Score`);
                inactivePlayerScore -= activePlayerDamage;
                inactivePlayerScoreSpan.text(inactivePlayerScore);
                if ( +inactivePlayerScoreSpan.text() < 1 ) {
                  inactivePlayerScoreSpan.text(0);
                  // Have message appear on screen here stating that the game is over.
                  console.log(`${inactivePlayer} has lost the game. ${activePlayer} has won the game.`);
                }
                player1Space.removeClass("active");
                player2Space.addClass("active");
                y = 11;
                x = 11;
              }
              if ( $(`#${x}-${y}`).hasClass("player_2") ) {
                // player 2 starts as active player and then active player switches to player 1
                const activePlayer = "player_2";
                if ( $(`#${activePlayer}Attack`).attr("id") !== $(event.target).attr("id") ) {
                  alert("It is player 2's turn.");
                  return "";
                }
                const activePlayerDamage = +$(`.${activePlayer}Info p`).text();
                // const activePlayerAttackButton = $(`#${activePlayer}Attack`);
                const inactivePlayer = "player_1";
                let inactivePlayerScore = +$(`.${inactivePlayer}Score`).text();
                const inactivePlayerScoreSpan = $(`.${inactivePlayer}Score`);
                inactivePlayerScore -= activePlayerDamage;
                inactivePlayerScoreSpan.text(inactivePlayerScore);
                if ( +inactivePlayerScoreSpan.text() < 1 ) {
                  inactivePlayerScoreSpan.text(0);
                  // Have message appear on screen here stating that the game is over.
                  console.log(`${inactivePlayer} has lost the game. ${activePlayer} has won the game.`);
                }  
                player2Space.removeClass("active");
                player1Space.addClass("active");
                y = 11;
                x = 11;
              }
            }
          } 
        } 
      }
    });
    // const activePlayerDefendButton = $(`#${this.activePlayer()}Defend`);
    // activePlayerDefendButton.on("click", function() {
    //   //
    // });
  }

/* Game - movePlayer() -----
- Establishes a series of conditions which limit a player to moving only on empty spaces for the exception of spaces with weapons.
- Another condition determines that if a click occurs on a space beside an inactive player then the fightTime property of the game object is set from false to true.
- A further set of conditions prevents the activePlayer hopping over the inactive player while stopping the game if the two players are right beside each other.
- A further set of conditions prevents the activePlayer from hopping over a pylon by determing if movement is horizontal or vertical, and which direction the player intends to move, followed by checking if there is an obstacle within three spaces of the direction the player has clicked, and finally seeing if the player clicks past the obstacle.  If the player clicks past the obstacle the loop breaks and the function ends.
- A further set of conditions checks for if the player has passed over or landed on a weapon.
- A further set of conditions limit player movement only 3 spaces up, down, left, or right.
- A condition sets the fightTime property to true allowing the fight to begin if the active player is directly beside the inactive player.
- A further set of conditions determines if the active player has clicked on or passed over a weapon, and if so the weapon clicked on or passed over is picked up, and the active player's current weapon is placed on the board, unless the active player has no weapon.
- If the conditions allow and the player moves the switch player function is called to switch the active player. 
- The fight method is executed at the end of the movePlayer() method. A condition which determines if the fightTime property is set to true or false within the fight method will determine if the code in the fight method will run and thus the fight will begin.
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
    // A condition which determines if the space the player is moving onto is on the board. Also ensures the player does not move onto a space occupied by another player or obstacle.
    if ( !$(clickedSpace).hasClass("player_1") && !$(clickedSpace).hasClass("player_2") && !$(clickedSpace).hasClass("obstacle") ) {
      
      // The start of a for loop which is used to iterate three spaces left, right, up and down
      for ( let i = 1; i < 4; i++ ) {
        // A condition which stops the game and breaks the loop/function when the active player moves beside the inactive player
        if ( $(`#${activePlayerColumn + 1}-${activePlayerRow}`).attr('id') === inactivePlayerId || $(`#${activePlayerColumn - 1}-${activePlayerRow}`).attr('id') === inactivePlayerId || $(`#${activePlayerColumn}-${activePlayerRow + 1}`).attr('id') === inactivePlayerId || $(`#${activePlayerColumn}-${activePlayerRow - 1}`).attr('id') === inactivePlayerId ) {
          break;
        }

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

        // A series of conditions which prevent the active player from hopping over one or two obstacles by breaking the loop/function if an obstacle[s] is hopped over.
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

          // Conditions which determine if the active moving player passes over a weapon.
          // An array filters through the weapons, and returns only those weapon which are not undefined, in other words only the weapons on the board are returned into the array, and not the weapons in a player's possession.
          // The code which runs when a player passes over a weapon, is put through two for loops.  The first loop accounts for the number of spaces to check for a weapon being passed over, while the second loops accounts for the number of weapons on the board to locate.
          // A first condition checks for a weapon three spaces away from the active player, if a player clicks on the space with the weapon three spaces away, or if a space clicked three spaces away at the first running of the loop has a weapon. 
          // It is necessary to check if a weapon is clicked three spaces away since in the event that beside the active player is an empty space followed by a weapon, and then another weapon which is clicked, the weapon two spaces away will remain untouched since the conditions will only be true if a weapon space is clicked or if the space with the weapon is directly beside the active player's space.
          // Another if condition checks the direction of the click, and also is used to determine what the type is of the weapon that was passed over by comparing the id of the weapon's space that was passed over with the id of one of the weapons in the definedWeaponSpacesArray which holds all the weapons currently visible on the board.
          // The definedWeaponSpacesArray iteration which had an id equal to the weapon's space's id is then used to define the correct iteration within the definedWeaponSpacesArray which then with a further index value of 1 yields the name of the weapon, and the name is placed in the variable weaponToBePickedUp, and with index value two gives the damage of the weapon, which is placed in the updatedDamage variable.
          // The space with the weapon that was passed over now has that space's weapon, and type of weapon class  removed, as well as the child weapon image element. 
          // Another further set of conditions checks what that active player's damage value is in order to determine the type of weapon the active player has.  
          // If the damage value is the default 10 then no weapon image is placed onto the space where the active player has just collected a weapon since the active player is not in possession of any weapon.
          // If a player's damage is not 10, then one of the four conditions testing the damage amount will be true, first causing the space with the weapon to be given the weapon type class associated with the weapon which has the same amount of damage as the player currently has on their banner.
          // Secondly, if one of the four conditions testing the damage amount will be true, then the active player's weapon property will be filled with the array iteration within the spacesWithWeapons array which holds the information regarding the weapon the player currently has and is about to leave and replace with the weapon the active player is picking up. The weapon type class is added first since the spacesWithWeapons array filters through the spaces looking for weapons on the basis of the space having a weapon type class, and no space will have the weapon type class of the weapon in the active player's possession since that weapon has not been placed on the board and is still in the active player's possession.
          // Now another condition tests if the player has a weapon, and if so then places that weapon on the space where the previous weapon was removed and adds the appropriate weapon type classes using the active player's weapon property's weapon name iteration.
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
                  // If they're any other weapons in the two spaces away from the space the active player has picked up a weapon then the loop will continue and if not then the loop breaks in order to account for the possibility the clicked space was beyond or at those other two spaces with weapons.
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
                  // If they're any other weapons in the two spaces away from the space the active player has picked up a weapon then the loop will continue and if not then the loop breaks in order to account for the possibility the clicked space was beyond or at those other two spaces with weapons.
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

          //Loops and conditions used to determine whether the space clicked was a weapon, if so what type of weapon inorder for an exhange of weapons to occur.
          // A loop run iterations for the number of spaces to check for weapons.
          for ( let i = 0; i < 1; i++ ) {            
          // A condition which determines if the active moving player lands directly on a weapon.
          // If the clicked space is a weapon a further set of conditions determines the type of weapon occupying the clicked space by checking if the clicked space has a class which represents a weapons name.
          // After determining the type of weapon occupying the clicked space a further condition checks to see what weapon is currently in the player's possesion, if any, by in the condition, selecting for the damage amount of the active player, and then determining if the activePlayer's damage amount is equal to one of the damage amounts of the weapons.  
          // Thus, if the damage amount of the active player is the same as the damage amount of a weapon then that weapon will be the weapon currently possessed by the active player.
          // Once the player's current weapon and weapon to be picked up has been determined the current weapon's class of "w-weapon" will be added while the weapon on the clicked space's class is removed in order to make the clicked space weapon still appear when the spaceswithWeapons() array is called.
          // The activePlayer's weapon's property is updated to reflect the weapon they currently possess, but is not initially in their weapon property since for every click the weapon property is reset to an empty array.  This is why it is necessary to add the "w-weapon" class of the weapon in the active player's possession to the clicked space because the weapon was not on the board, and thus did not have a class to be included in the spacesWithWeapons array.
          // If the damage was the default initial values of 10 then all of the conditions searching for the type of possessed weapon will be by-passed and the damage will be updated to reflect the picked up weapon, the picked up weapon will disappear, and the loop will break to allow the rest of the movePlayer function to finish.
          // If the damage was not the default value then the condition checking if they're any weapons in possession will be true and the weapon in the active player's possession will be placed onto the clicked space by using the weapons name stored in the active player's weapon property to represent the image's name in the source attribute, as well as using the weapon's name in the active player's weapon property to add the class representing active player's previoulsy possessed weapon's name.
          // The damage amount of the active player is updated to reflect the damage amount of the just picked up weapon.

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
              if ( this.activePlayerWeapon().weapon.length > 0 ) {                  
                $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).append($(`<img src='../img/${this.activePlayerWeapon().weapon[1]}.svg'>`).addClass(`${this.activePlayerWeapon().weapon[1]}`)).addClass("weapon");                                  
              }
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
              if ( this.activePlayerWeapon().weapon.length > 0 ) {                  
                $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).append($(`<img src='../img/${this.activePlayerWeapon().weapon[1]}.svg'>`).addClass(`${this.activePlayerWeapon().weapon[1]}`)).addClass("weapon");                                  
              } 
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
              if ( this.activePlayerWeapon().weapon.length > 0 ) {                  
                $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).append($(`<img src='../img/${this.activePlayerWeapon().weapon[1]}.svg'>`).addClass(`${this.activePlayerWeapon().weapon[1]}`)).addClass("weapon");                                  
              } 
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
              if ( this.activePlayerWeapon().weapon.length > 0 ) {                  
                $(`#${clickedSpaceColumn}-${clickedSpaceRow}`).append($(`<img src='../img/${this.activePlayerWeapon().weapon[1]}.svg'>`).addClass(`${this.activePlayerWeapon().weapon[1]}`)).addClass("weapon");                                  
              } 
              $(`.${activePlayer}Info p`).text(50);
              break;   
            }
          }

          // If the appropriate conditions above are met and the loop has not broken the activePlayer's image is removed.
          $(`#${activePlayerColumn}-${activePlayerRow} img:last-of-type`).remove();

          // A condition determines if player 1 is the active player and then removes the class of player 1 from player 1's space, appends the player 1 image to the clicked space while adding player1Img class to player 1's image, and player 1's class to the just clicked on space.
          if ( activePlayer === "player_1") {
            $(`#${activePlayerColumn}-${activePlayerRow}`).removeClass('player_1');
            clickedSpace.append($("<img src='../img/soldier.svg'>").addClass("player1Img")).addClass("player_1");
            const previousPlayerSpace = $(`#${activePlayerColumn}-${activePlayerRow}`);
            this.switchPlayer();
            let clickedPreviousSpaceArray = [];
            clickedPreviousSpaceArray.push(clickedSpace);
            clickedPreviousSpaceArray.push(previousPlayerSpace);
            if ( !this.fighting ) {
              this.availableSpaces(clickedPreviousSpaceArray);     
            }       
          }
          // A condition determines if player 2 is the active player and then removes the class of player 2 from player 2's space, appends the player 2 image to the clicked space while adding player2Img class to player 2's image, and player 2's class to the just clicked on space.
          if ( activePlayer === "player_2") {
            $(`#${activePlayerColumn}-${activePlayerRow}`).removeClass('player_2');
            clickedSpace.append($("<img src='../img/warrior.svg'>").addClass("player2Img")).addClass("player_2");
            const previousPlayerSpace = $(`#${activePlayerColumn}-${activePlayerRow}`);
            this.switchPlayer();
            let clickedPreviousSpaceArray = [];
            clickedPreviousSpaceArray.push(clickedSpace);
            clickedPreviousSpaceArray.push(previousPlayerSpace);
            if ( !this.fighting ) {
              this.availableSpaces(clickedPreviousSpaceArray);     
            }
          }
          // A condition which sets the calls the function which initiats the fight between player 1 and player 2 if the activePlayer is in a square directly left, right, up, or down from the inactive player.
          if ( $(`#${inactivePlayerColumn + 1}-${inactivePlayerRow}`).attr('id') === clickedSpace.attr("id") || $(`#${inactivePlayerColumn - 1}-${inactivePlayerRow}`).attr('id') === clickedSpace.attr("id") || $(`#${inactivePlayerColumn}-${inactivePlayerRow + 1}`).attr('id') === clickedSpace.attr("id") || $(`#${inactivePlayerColumn}-${inactivePlayerRow - 1}`).attr('id') === clickedSpace.attr("id") ) {
            // The fight method is called to determine if the fight is ready to begin by checking if the fightTime property is set to true or false. If true the fight is ready to begin, if false the fight is not ready to begin.
            this.fighting = true;
            this.fight();
          }
        }
      // End of for loop specifying number of spaces
      }
    }
  }
}