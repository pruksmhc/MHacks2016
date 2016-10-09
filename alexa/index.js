'use strict';

/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */
// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}


// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = 'Welcome to Tennis VR';
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = 'What is your name?';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = 'Thank you for playing Tennis with us. Have a nice day!';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

/**
 * Gets the down score.
 */
function getDownScore(intent, session, callback) {
  var request = require('request');
  let speechOutput = '';
  const cardTitle = 'Up Score';
  const shouldEndSession = true;
  request('http://13.92.39.143/api/team_1_score', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var body1 = JSON.parse(body);
      const team_1_score = body1.Data;
       request('http://13.92.39.143/api/team_2_score', function (error, response, body) {
          if (!error && response.statusCode == 200) {
           var body2 = JSON.parse(body);
           const team_2_score = body2.Data;
            if (team_1_score > team_2_score) {
                speechOutput = 'Player 2 has the disadvantage';
            }
            else if (team_1_score == team_2_score) {
                speechOutput = 'Both have the same number of points.';
            } else {
                speechOutput = 'Player 1 has the advantage';
            }
          callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
        }
      });
  }
});
}

/** Test function for using Requests from Alexa* */
function getTestGetFromGoogle(intent, session, callback) {
  var request = require('request');
  request('http://www.google.com', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // Show the HTML for the Google homepage.
      callback({}, buildSpeechletResponse("Google", "Google", null, true));
    }
  })
}
/**
 * Gets the up score.
 */
function getUpScore(intent, session, callback) {
    //get the up score, calling Azure DB
    var request = require('request');
    let speechOutput = '';
    const cardTitle = 'Up Score';
    const shouldEndSession = true;
    request('http://13.92.39.143/api/team_1_score', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var body1 = JSON.parse(body);
        const team_1_score = body1.Data;
         request('http://13.92.39.143/api/team_2_score', function (error, response, body) {
            if (!error && response.statusCode == 200) {
             var body2 = JSON.parse(body);
             const team_2_score = body2.Data;
              if (team_1_score > team_2_score) {
                  speechOutput = 'Player 1 has the advantage';
              }
              else if (team_1_score == team_2_score) {
                  speechOutput = 'Both have the same number of points.';
              } else {
                  speechOutput = 'Player 2 has the advantage';
              }
            callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
          }
        });
    }
  });
}

/**
 * Gets if the ball is in or out.
 */

 function getLineJudge(intent, session, callback) {
     //get the line score.
     var request = require('request');
     const cardTitle = 'Line Judge';
     const shouldEndSession = true;
     request('http://13.92.39.143/api/isBallin', function (error, response, body) {
       var body1 = JSON.parse(body);
       console.log(body1);
       if (!error && response.statusCode == 200) {
         const ballIn = body1.Data;
         console.log(ballIn);
         let res = "";
         if (ballIn === true || ballIn == 'True') {
             res = "in";
         } else {
             res = "out";
         }
         const speechOutput = 'The ball is ' + res +"." ;
         const shouldEndSession = true;
         callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
       }
       callback({}, buildSpeechletResponse(cardTitle, 'Could not judge', null, shouldEndSession));
     });
 }

/**
 * Gets the match score
 */

function getMatchScore(intent, session, callback) {
     //get the match score, calling Azure DB
     var request = require('request');
     let speechOutput = '';
     const cardTitle = 'Match Score';
     const shouldEndSession = true;
     request('http://13.92.39.143/api/team_1_score', function (error, response, body) {
       if (!error && response.statusCode == 200) {
         var body1 = JSON.parse(body);
         const team_1_score = body1.Data;
          request('http://13.92.39.143/api/team_2_score', function (error, response, body) {
             if (!error && response.statusCode == 200) {
              var body2 = JSON.parse(body);
              const team_2_score = body2.Data;
              const speechOutput = 'The score for player 1 is ' + team_1_score +
              ' and the score for player 2 is ' + team_2_score;
              callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
            }
          });
      }
    });
}

function getStartReplay(intent, session, callback) {
     const cardTitle = 'Show replay';
     const url = '13.92.39.143/';
     var request = require('request');
     request({
      url: url,
      method: "POST",
      json: {'data': 'Replay'}
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          callback({}, buildSpeechletResponse(cardTitle, 'Replay successful', null, true));
        }
        callback({}, buildSpeechletResponse(cardTitle, 'There was an error in replaying', null, true));
      });
}



// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if (intentName === 'Upscore') {
        getUpScore(intent, session, callback);
    } else if (intentName == 'Downscore') {
        getDownScore(intent, session, callback);
    } else if (intentName === 'MatchScore') {
        getMatchScore(intent, session, callback);
    } else if (intentName == 'StartReplay') {
        getStartReplay(intent, session, callback);
    } else if (intentName == "Test") {
        getTestGetFromGoogle(intent, session, callback);
    } else if (intentName == 'LineJudge') {
        getLineJudge(intent, session, callback);
    } else if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}


// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context, callback) => {
    try {
        //console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.[unique-value-here]') {
             callback('Invalid Application ID');
        }
        */
        if (event.request.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};
