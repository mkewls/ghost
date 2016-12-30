/**
  *    Copyright 2016 Michael E. Williams
  *
  *    Super Important Legalese (i.e., the MIT License) =>
  *
  *    Permission is hereby granted, free of charge, to any person obtaining a
  *    copy of this software and associated documentation files (the "Software"),
  *    to deal in the Software without restriction, including without limitation
  *    the rights to use, copy, modify, merge, publish, distribute, sublicense,
  *    and/or sell copies of the Software, and to permit persons to whom the
  *    Software is furnished to do so, subject to the following conditions:
  *
  *    The above copyright notice and this permission notice shall be included
  *    in all copies or substantial portions of the Software.
  *
  *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  *    OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  *    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  *    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  *    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  *    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  *    THE SOFTWARE.
  *
  **/

/**
  *           _              _       _    _            _          _
  *          /\ \           / /\    / /\ /\ \         / /\       /\ \
  *         /  \ \         / / /   / / //  \ \       / /  \      \_\ \
  *        / /\ \_\       / /_/   / / // /\ \ \     / / /\ \__   /\__ \
  *       / / /\/_/      / /\ \__/ / // / /\ \ \   / / /\ \___\ / /_ \ \
  *      / / / ______   / /\ \___\/ // / /  \ \_\  \ \ \ \/___// / /\ \ \
  *     / / / /\_____\ / / /\/___/ // / /   / / /   \ \ \     / / /  \/_/
  *    / / /  \/____ // / /   / / // / /   / / /_    \ \ \   / / /
  *   / / /_____/ / // / /   / / // / /___/ / //_/\__/ / /  / / /
  *  / / /______\/ // / /   / / // / /____\/ / \ \/___/ /  /_/ /
  *  \/___________/ \/_/    \/_/ \/_________/   \_____\/   \_\/
  *
  *  Thanks to Patrick Gillespie for creating an ASCII text art generator!
  *  http://patorjk.com
  *
  *  Ghost is a classic word game, where each player provides a single letter in
  *  the aim of spelling a real (dictionary) word, but not completing it. The player
  *  who does complete the word on his or her turn is penalized with a letter from
  *  G-H-O-S-T (just like HORSE in basketball). If a player gets to the T in ghost,
  *  he or she is out! Some nuances, as adapted here:
  *  (1) any words of three or fewer letters do not count toward "completing" a
  *  word for a penalty; and (2) on his or her turn, a player may challenge to
  *  find out if the player on the prior turn has a real word in mind (if not,
  *  the challenged player receives a ghost letter; if so, the challenger
  *  receives a ghost letter.) Enjoy!
  *
  **/

/* -=-=-= INDEX FILE =-=-=-=-
 *
 * (1) Import our wrapper function for Ghost to create an instance
 * (2) Declare our AWS Lambda Function Handler expression
 * => http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html
 *
 */

'use strict'

const Ghost = require('./ghost')

exports.handler = (event, context) => {
  const ghost = new Ghost()
  ghost.execute(event, context)
}
