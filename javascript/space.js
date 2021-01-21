// Space Class
class Space {
  constructor(space, col, row) {
    this.space = space;
    this.col = col;
    this.row = row;
    this.player = this.player();
  }

// Space - player() - The method tests each space to determine if each space has a player 1 or player 2 and then if there is a player 1 or player 2 there name is returned as a string value to be used in other conditions.
  player() {
    if ( $(this.space).hasClass("player_1") ) {
      return "player_1";
    } else if ( $(this.space).hasClass("player_2") ) {
      return "player_2";
    }
  }
}