const confLevels = require('../data/confLevels');

module.exports.permlevel = function (message) {

  let permlvl = 0;
  const permOrder = confLevels.permLevels.sort((p, c) => p.level < c.level ? 1 : -1);

  for(let perm in permOrder){
    let currentLevel = permOrder[perm]
    if(currentLevel.check(message)){
      permlvl = currentLevel.level
      break
    }
  }

  return permlvl;
}