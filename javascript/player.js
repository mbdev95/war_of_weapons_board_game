// ----- Players Class
class Player {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.weapon = {weapon: []};
    this.score = this.getScore(); 
  } 
  getScore() {
    return +$(`.${this.name}Score`).text();
  }
}

