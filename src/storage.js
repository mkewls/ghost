/* -=-=-=-= Game State / Storage =-=-=-=-
 *
 *  This wrapper function (JS class) stores the game state to assist
 *  the handler functions in making appropriate prompts and responses.
 *
 *  The Game function is itself a wrapper function that stores player names as
 *  an array [John, Kate], the letters for the game underway as a string 'tes',
 *  and the player 'scores' as an object { John: 'gho', Kate: 'g' }.
 *
 *  The Game function also contains prototype methods to check whether the game
 *  is just starting ('isEmptyLetters' indicates whether letters have been played),
 *  is now ending ('clearLetters' sets the game to square one), and gameplay
 *  operations: save(), loadGame(), and newGame().
 *
 */

'use strict'
const AWS = require('aws-sdk')

const storage = (() => {
  const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'})  // ??

  const Game = (session, data) => {
    if (data) {
      this.data = data
    } else {
      this.data = {
        players: [],
        letters: '',
        scores: {}
      }
    }
    this._session = session  // user session information
  }

  Game.prototype = {
    isEmptyLetters: () => {
      let isEmpty = this.data.letters.length > 0
      return isEmpty
    },
    clearLetters: () => {
      this.data.letters = ''
    },
    save: (callback) => {
      this._session.attributes.currentGame = this.data
      // putItem writes to DynamoDB and !! OVERWRITES !! data at the provided
      // primary key (CustomerId) on each put write
      dynamodb.putItem({
        TableName: 'GhostUserData',
        Item: {
          CustomerId: {
            S: this._session.user.userId  // S = 'String'
          },
          Data: {
            S: JSON.stringify(this.data)
          }
        }
      }, (err, data) => {
        if (err) {
          console.log(err, err.stack)
        }
        if (callback) {
          callback()
        }
      })
    }
  }

  return {
    loadGame: (session, callback) => {
      if (session.attributes.currentGame) {
        console.log('get game from session=' + session.attributes.currentGame)
        callback(new Game(session, session.attributes.currentGame))
        return
      }
      // getItem is a read from the database using the primary key (CustomerId)
      dynamodb.getItem({
        TableName: 'GhostUserData',
        Key: {
          CustomerId: {
            S: session.user.userId  // S = 'String'
          }
        }
      },
      // if no read
      (err, data) => {
        let currentGame
        if (err) {
          console.log(err, err.stack)
          currentGame = new Game(session)   // if error, try starting a new game
          session.attributes.currentGame = currentGame.data
          callback(currentGame)
        }
        else if (data.Item === undefined) {
          currentGame = new Game(session)          // if no data, try a new game
          session.attributes.currentGame = currentGame.data
          callback(currentGame)
        } else {            // but if data and no error, try rebuilding the game
          console.log('get game from dynamodb=' + data.Item.Data.S)
          currentGame = new Game(session, JSON.parse(data.Item.Data.S))
          session.attributes.currentGame = currentGame.data
          callback(currentGame)
        }
      })
    },
    newGame: (session) => {
      return new Game(session)
    }
  }
})()

module.exports = storage
