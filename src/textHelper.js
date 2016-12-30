/* -=-=-=-= Help =-=-=-=-
 *
 *  This wrapper function (JS class) provides a list of things the user can do,
 *  should the user ask for help during the game.
 *
 *  Note that it also provides a check against mis-recognition of a user-
 *  provided name, should Alexa incorrectly store that name as 'player' or
 *  'players'.
 *
 */

'use strict'

const textHelper = (() => {
  const invalidNames = {
    player: 1,
    players: 1
  }

  return {
    completeHelp: 'Here are some things you can say,'
    + ' add mike.'
    + ' what are the current letters.'
    + ' tell me mike\'s score.'
    + ' check a challenge word'
    + ' new game.'
    + ' reset.'
    + ' and exit.',

    nextHelp: 'You can add a player, get a player\'s score, or start a new game. What would you like?',

    getPlayerName: (recognizedPlayerName) => {
      if (!recognizedPlayerName) {
        return undefined
      }
      let split = recognizedPlayerName.indexOf(' '), newName

      if (split < 0) {
        newName = recognizedPlayerName
      } else {
        //the name should only contain a first name, so ignore the second part if any
        newName = recognizedPlayerName.substring(0, split)
      }
      if (invalidNames[newName]) {
        //if the name is 'player' or 'players', it must be mis-recognition
        return undefined
      }
      return newName
    }
  }
})()

module.exports = textHelper
