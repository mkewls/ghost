/* -=-=-=-= Event Handlers =-=-=-=-
 *
 *  These are the primary methods for Alexa's prompts to a user event,
 *  specifically to keep the game moving on start and when help is needed.
 *
 *  These event handler methods override the skill's event handler methods
 *  on the AlexaSkill prototype, which are primarily for declarative purposes
 *  in that functional expression. Indeed, the registerEventHandlers function takes
 *  the AlexaSkill.eventHandlers method as its first argument.
 *
 */

'use strict'

const storage = require('./storage')
const textHelper = require('./textHelper')

// Our event handlers
const registerEventHandlers = (eventHandlers, skillContext) => {
  eventHandlers.onSessionStarted = (sessionStartedRequest, session) => {
    skillContext.needMoreHelp = false  // assumes user issued a command
  }

  eventHandlers.onLaunch = (launchRequest, session, response) => {
    storage.loadGame(session, (currentGame) => {   // note callback
      let speechOutput = '',
          reprompt
      if (currentGame.data.players.length === 0) {
        speechOutput += 'ScoreKeeper, Let\'s start your game. Who\'s your first player?';
        reprompt = "Please tell me who is your first player?";
      } else if (currentGame.isEmptyScore()) {
          speechOutput += 'ScoreKeeper, '
              + 'you have ' + currentGame.data.players.length + ' player';
          if (currentGame.data.players.length > 1) {
              speechOutput += 's';
          }
          speechOutput += ' in the game. You can give a player points, add another player, reset all players or exit. Which would you like?';
          reprompt = textHelper.completeHelp;
      } else {
          speechOutput += 'ScoreKeeper, What can I do for you?';
          reprompt = textHelper.nextHelp;
      }
      response.ask(speechOutput, reprompt);
    })
  }
}

exports.register = registerEventHandlers  // exported as .register() method
