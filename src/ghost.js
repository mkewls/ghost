/* -=-=-=-= Ghost Wrapper Function =-=-=-=-=-
 *
 *  Ghost is a child of our AlexaSkill, which we extend here to export to
 *  our app entry file (index.js) for our AWS Lambda Function handler
 *  (1) Import our skill and event/intent handlers
 *  (2) Create our wrapper skill function, incorporating our app id
 *  (3) Extend the skill prototype to our wrapper function
 *  (4) Use the event/intentHandlers functions *.register() to map Ghost and
 *      the object 'skillContext' to those functions
 */

'use strict'
// (1)
const AlexaSkill = require('./AlexaSkill')
const eventHandlers = require('./eventHandlers')
const intentHandlers = require('./intentHandlers')
// (2)
const APP_ID = 'amzn1.ask.skill.df2383a4-5ef9-40e9-a1c2-a4d6a174f34b'
let skillContext = {}

const Ghost = function () {
  AlexaSkill.call(this, APP_ID)
  skillContext.needMoreHelp = true  // note new prop for skillContext obj
}
// (3)
Ghost.prototype = Object.create(AlexaSkill.prototype)
Ghost.prototype.constructor = Ghost
// (4)
eventHandlers.register(Ghost.prototype.eventHandlers, skillContext)
intentHandlers.register(Ghost.prototype.intentHandlers, skillContext)

module.exports = Ghost
