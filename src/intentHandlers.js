/* -=-=-=-= Intent Handlers =-=-=-=-
 *
 *  These are the primary methods for Alexa's prompts to a user command
 *  during gameplay.
 *
 *  These intent handler methods override the skill's intent handler methods
 *  on the AlexaSkill prototype, which are primarily for declarative purposes
 *  in that functional expression. Indeed, the registerIntentHandlers function
 *  takes the AlexaSkill.intentHandlers method as its first argument.
 *
 */

'use strict'

const textHelper = require('./textHelper')
const storage = require('./storage')

const registerIntentHandlers = (intentHandlers, skillContext) => {
  intentHandlers.NewGameIntent = (intent, session, response) => {
    storage.loadGame(session, (currentGame) => {
      // game needs at least two players
      if (currentGame.data.players.length === 0) {
        response.ask('New game started. Who\'s your first player?',
          'Please tell me your first player\'s name')
        response.ask('Great. Who\'s your second player?',
          'Please tell me your second player\'s name')
        return
      }
      currentGame.data.players.forEach(player => {
        currentGame.data.scores[player] = 'no letters'  // starting score is 'no letters'
      })
      // save new game players and provide callback
      currentGame.save(() => {
        let speechOutput = `New game started with ${currentGame.data.players.length} players.`
          +  'If there are more players, please say Add Player'  // triggers add player intent
        if (skillContext.needMoreHelp) {
          speechOutput += 'You can add a player, check a players score, reset all players or exit.'
            + ' What would you like?'
          let repromptText = 'You can add a player, check a players score, reset all players or exit.'
            + ' What would you like?'
          response.ask(speechOutput, repromptText)
        } else {
          response.tell(speechOutput)
        }
      })
    })
  }

  intentHandlers.AddPlayerIntent = function (intent, session, response) {
    var newPlayerName = textHelper.getPlayerName(intent.slots.PlayerName.value)  // name list
    if (!newPlayerName) {
      response.ask('OK. Who do you want to add?', 'Who do you want to add?')
      return
    }
    storage.loadGame(session, (currentGame) => {
      let speechOutput,
          reprompt
      if (currentGame.data.scores[newPlayerName] !== undefined) {
        speechOutput = newPlayerName + ' has already joined the game.'  // if player already stored
        if (skillContext.needMoreHelp) {
          response.ask(speechOutput + ' What else?', 'What else?')
        } else {
          response.tell(speechOutput)
        }
        return
      }
      speechOutput = newPlayerName + ' has joined your game. '  // successful new player add
      currentGame.data.players.push(newPlayerName)
      currentGame.data.scores[newPlayerName] = 'no letters'
      if (skillContext.needMoreHelp) {
        if (currentGame.data.players.length >= 2) {
          speechOutput += 'You can say, I am Done Adding Players. Or, say the name of another player to add.'
          reprompt = textHelper.nextHelp
        } else {
          speechOutput += 'Who is your next player?'
          reprompt = textHelper.nextHelp
        }
      }
      currentGame.save(() => {
        if (reprompt) {
          response.ask(speechOutput, reprompt)
        } else {
          response.tell(speechOutput)
        }
      })
    })
  }

  // the letters currently in play for the game
  intentHandlers.TellGameLettersIntent = (intent, session, response) => {
    storage.loadGame(session, (currentGame) => {
      let lettersArr = [], speechOutput = '', cardOutput = ''

      lettersArr = currentGame.data.letters.split('')  // letters stored as string
      speechOutput = 'The current letters are '
      lettersArr.forEach((letter, idx) => {
        speechOutput += `${letter}. `                  // period for annunciation
        if (idx === 0) {
          cardOutput += `${letter}`
        } else {
          cardOutput += `-${letter}`  // hyphen for letter spacing on card display
        }
      })

      currentGame.save(() => {
        response.tellWithCard(speechOutput, "Current Letters", cardOutput)
      })
    })
  }

  // scores are not numbers, but an incrementing sub-set of 'g-h-o-s-t'
  intentHandlers.TellScoresIntent = (intent, session, response) => {
    storage.loadGame(session, (currentGame) => {
      let sortedPlayerScores = [],
          speechOutput = '',
          leaderboard = ''
      if (currentGame.data.players.length === 0) {
        response.tell('Nobody has joined the game yet. Please say Add Players to begin.')
        return
      }
      currentGame.data.players.forEach(player => {
        sortedPlayerScores.push({
          score: currentGame.data.scores[player],
          player: player
        })
      })
      sortedPlayerScores.sort((p1, p2) => {
        return p2.score - p1.score
      })
      sortedPlayerScores.forEach((playerScore, index) => {
        let score = '', playerScoreArr = []

        if (playerScore.score === 'no letters') {
          score += playerScore.score
        } else {
          playerScoreArr = playerScore.split('')
          playerScoreArr.forEach((letter) => {
            score += `${letter}. `
          })
        }
        speechOutput = `${playerScore.player} has ${score}`
        leaderboard += `No. ${index + 1} - ${playerScore.player}: ${playerScore.score} \n`
      })
      response.tellWithCard(speechOutput, "Leaderboard", leaderboard)
    })
  }

  // remove all players
  intentHandlers.ResetPlayersIntent = (intent, session, response) => {
    storage.newGame(session).save(() => {
      response.ask('New game started without players, who do you want to add first?', 'Who do you want to add first?')
    })
  }

  // Built-in 'Alexa Help' command
  intentHandlers['AMAZON.HelpIntent'] = (intent, session, response) => {
    let speechOutput = textHelper.completeHelp
    if (skillContext.needMoreHelp) {
      response.ask(textHelper.completeHelp + ' So, how can I help?', 'How can I help?')
    } else {
      response.tell(textHelper.completeHelp)
    }
  }

  // Built-in 'Alexa Cancel' command
  intentHandlers['AMAZON.CancelIntent'] = (intent, session, response) => {
    if (skillContext.needMoreHelp) {
      response.tell('Okay.  Whenever you\'re ready, you can tell me what you\'d like to do.')
    } else {
      response.tell('')
    }
  }

  // Built-in 'Alexa Stop' command
  intentHandlers['AMAZON.StopIntent'] = (intent, session, response) => {
    if (skillContext.needMoreHelp) {
      response.tell('Okay.  Whenever you\'re ready, you can tell me what you\'d like to do.')
    } else {
      response.tell('')
    }
  }
}

exports.register = registerIntentHandlers  // exported as .register() method
