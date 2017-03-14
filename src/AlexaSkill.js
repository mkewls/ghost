/* -=-=-=-= The Skill Itself! =-=-=-=-
 *
 *  This skill foundation, like much of the other files, uses code
 *  from the examples provided within the documentation. Thanks to all those
 *  who contributed and likewise guided my ability to make this skill!
 *
 *  In sum, the skill function wrapper contains methods to handle user requests,
 *  events (e.g., launching the skill), and how to respond to the user via
 *  both the voice interface and the app-based 'cards'.
 *
 *  Given the function size, further documentation is within the code itself.
 *  Also this =>
 *  https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/handling-requests-sent-by-alexa
 */

'use strict'

// Skill wrapper function (JS Class)
const AlexaSkill = (appId) => {
  this._appId = appId   // provided by the ghost.js implementation file
}

// config
AlexaSkill.speechOutputType = {
  PLAIN_TEXT: 'PlainText',
  SSML: 'SSML'  // Speech Synthesis Markup Language
}

// pass user requests to the appropriate eventHandler methods
AlexaSkill.prototype.requestHandlers = {
  LaunchRequest: (event, context, response) => {
    this.eventHandlers.onLaunch.call(this, event.request, event.session, response)
  },

  IntentRequest: (event, context, response) => {
    this.eventHandlers.onIntent.call(this, event.request, event.session, response)
  },

  SessionEndedRequest: (event, context) => {
    this.eventHandlers.onSessionEnded(event.request, event.session)
    context.succeed()
  }
}

// meat and potatoes for handling events
AlexaSkill.prototype.eventHandlers = {
  onSessionStarted: (sessionStartedRequest, session) => {
    // TODO
  },

  onLaunch: (launchRequest, session, response) => {
    throw 'onLaunch should be overriden by subclass'  // TODO: Clarify Error Handling
  },

  // handles user request to do actually do something with the skill based on
  // the skill's intentHandlers
  onIntent: (intentRequest, session, response) => {
    let intent = intentRequest.intent,
      intentName = intentRequest.intent.name,
      intentHandler = this.intentHandlers[intentName]
    if (intentHandler) {
      console.log('dispatch intent = ' + intentName)
      intentHandler.call(this, intent, session, response)
    } else {
      throw 'Unsupported intent = ' + intentName
    }
  },

  onSessionEnded: (sessionEndedRequest, session) => {
    // TODO
  }
}
// instance-based intent handlers
AlexaSkill.prototype.intentHandlers = {}

AlexaSkill.prototype.execute = (event, context) => {
  try {
    console.log('session applicationId: ' + event.session.application.applicationId)

    // Validate that this request originated from authorized source.
    if (this._appId && event.session.application.applicationId !== this._appId) {
      console.log(`The applicationIds don't match: ${event.session.application.applicationId} and
        ${this._appId}`)
      throw 'Invalid applicationId'
    }

    // ensure event.session.attributes prop exists
    if (!event.session.attributes) {
      event.session.attributes = {}
    }

    // start session, if new
    if (event.session.new) {
      this.eventHandlers.onSessionStarted(event.request, event.session)
    }

    // Route the request to the proper handler which may have been overriden.
    let requestHandler = this.requestHandlers[event.request.type]
    requestHandler.call(this, event, context, new Response(context, event.session))
  } catch (e) {
    console.log('Unexpected exception ' + e)
    context.fail(e)
  }
};

// Response wrapper function (JS Class)
const Response = (context, session) => {
  this._context = context
  this._session = session
};

// speech object handler, either SSML or plain text output
const createSpeechObject = (optionsParam) => {
  if (optionsParam && optionsParam.type === 'SSML') {
    return {
      type: optionsParam.type,
      ssml: optionsParam.speech
    }
  } else {
    return {
      type: optionsParam.type || 'PlainText',
      text: optionsParam.speech || optionsParam
    }
  }
}

// IIFE method on the Response class for various means of Alexa speech/card response
Response.prototype = (() => {
  // function to build the response object based on type of speech (e.g., SSML)
  // and means of response (e.g., voice or card)
  const buildSpeechletResponse = (options) => {
    let alexaResponse = {
      outputSpeech: createSpeechObject(options.output),
      shouldEndSession: options.shouldEndSession
    }
    if (options.reprompt) {
      alexaResponse.reprompt = {
        outputSpeech: createSpeechObject(options.reprompt)
      }
    }
    if (options.cardTitle && options.cardContent) {
      alexaResponse.card = {
        type: 'Simple',
        title: options.cardTitle,
        content: options.cardContent
      }
    }
    let returnResult = {
      version: '1.0',
      response: alexaResponse
    }
    if (options.session && options.session.attributes) {
      returnResult.sessionAttributes = options.session.attributes
    }
    return returnResult
  }
  // IIFE produced methods on the Response class
  return {
    tell: (speechOutput) => {
      this._context.succeed(buildSpeechletResponse({
        session: this._session,
        output: speechOutput,
        shouldEndSession: true
      }))
    },
    tellWithCard: (speechOutput, cardTitle, cardContent) => {
      this._context.succeed(buildSpeechletResponse({
        session: this._session,
        output: speechOutput,
        cardTitle: cardTitle,
        cardContent: cardContent,
        shouldEndSession: true
      }))
    },
    ask: (speechOutput, repromptSpeech) => {
      this._context.succeed(buildSpeechletResponse({
        session: this._session,
        output: speechOutput,
        reprompt: repromptSpeech,
        shouldEndSession: false
      }))
    },
    askWithCard: (speechOutput, repromptSpeech, cardTitle, cardContent) => {
      this._context.succeed(buildSpeechletResponse({
        session: this._session,
        output: speechOutput,
        reprompt: repromptSpeech,
        cardTitle: cardTitle,
        cardContent: cardContent,
        shouldEndSession: false
      }))
    }
  }
})()

module.exports = AlexaSkill
