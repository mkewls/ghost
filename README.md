# G-H-O-S-T for Alexa

Ghost is a classic word game, where each player provides a single letter in
the aim of spelling a real (dictionary) word, but not completing it. The player
who does complete the word on his or her turn is penalized with a letter from
G-H-O-S-T (just like HORSE in basketball). If a player gets to the T in ghost,
he or she is out!

Some further nuances, which might be considered 'house rules':

1. any words of three or fewer letters do not count toward "completing" a
word for a penalty; and
2. on his or her turn, a player may challenge to
find out if the player on the prior turn has a real word in mind (if not,
the challenged player receives a ghost letter; if so, the challenger
receives a ghost letter.)

## Status

The structure (skeleton) for a working Alexa App is in place, but there's still
a long way to go. Specifically, the Skill class and its sub-class event/intent
handlers are coded, but much of the game remains to be added. I'm spending a
couple of hours a day building it out, but of course, life sometimes gets in
the way of a devoted daily effort. If all goes as planned (haha), I should have
the first version of the game pushed to Amazon for certification by mid-January.

## ToDo

1. Add IntentHandlers for the following game logic pieces:
  * addLetter => basic game play action each user's turn
  * challengeCheck => dictionary check of challenged user's provided word
2. Add sample utterances for the above handlers
3. Create Trie-based dictionary for ending a round when a user spells a word
4. Create game over and game won logic  
5. Deployment via AWS DynamoDB & Lambda for Testing
6. Certification  

## Long-Term ToDo

Create logic for Alexa to play one-on-one with a single player at various levels
of difficulty.

I'd love to hear your feedback as I develop this app. I'm best reached via mw [at] mikewill.net.
