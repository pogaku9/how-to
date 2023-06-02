// Runtime Node.js 16.x
// Handler index.handler
// Architecture x86_64
// trigger SNSTopic ( add at-least one email on amplify notifications to get SNS topic created )

const https = require("https");

function postRequest(data, webhookUrl) {
  return new Promise((resolve, reject) => {
    const url = new URL(webhookUrl);
    const options = {
      host: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    //create the request object with the callback with the result
    const req = https.request(options, (res) => {
      resolve(JSON.stringify(res.statusCode));
    });

    // handle the possible errors
    req.on('error', (e) => {
      reject(e.message);
    });

    //do the request
    req.write(JSON.stringify(data));

    //finish the request
    req.end();
  })
}

function getStatusColorAndIcon(status) {
    switch (status.toLowerCase()) {
        case "started":
          return {
              color: "#0676e1",
              icon: ":drum_with_drumsticks:"
          };
        case "succeed":
          return {
              color: "#6fcf97",
              icon: ":white_check_mark:"
          };
        case "failed":
          return {
              color: "#eb5757",
              icon: ":alert:"
          };
        default:
          return {
              color: "#f2c94c",
              icon: ":interrobang:"
          };
    }
}

exports.handler = async (event) => {
    const message = event.Records[0].Sns.Message;
    // Get the environment variables
    const slackWebhook = process.env.SLACK_WEBHOOK;
    const customDomain = process.env.CUSTOM_DOMAIN;
    const amplifyRegion = process.env.AMPLIFY_APP_REGION;
    const amplifyAppId = process.env.AMPLIFY_APP_ID;

    let status = "UNKNOWN";
    let branchname = "";
    const branchnameRegex = /https:\/\/(\S+?)\.amplifyapp\.com/;
    const statusRegex = /Your build status is (\w+)/i;
    const match = message.match(branchnameRegex);
    if (match && match[1]) {
      branchname = match[1].split(".")[0];
    }

    const statusMatch = message.match( statusRegex);
    if( statusMatch && statusMatch[0]){
      status = statusMatch[1];
    }

    const utility = getStatusColorAndIcon( status );


    const slackMessage = {
      "attachments": [{
        "color": utility.color,
      	"blocks": [
      		{
      			"type": "context",
      			"elements": [
      				{
      					"type": "mrkdwn",
      					"text": "*Slack App Title*"
      				}
      			]
      		},
      		{
      			"type": "section",
      			"fields": [
      				{
      					"type": "mrkdwn",
      					"text": `*Branch:*\n${branchname}`
      				},
      				{
      					"type": "mrkdwn",
      					"text": `*Status:*\n${status} ${utility.icon}`
      				}
      			]
      		},
      		{
      			"type": "divider"
      		}
      	].concat( message.includes("SUCCEED") ? [{
      			"type": "section",
      			"text": {
      				"type": "mrkdwn",
      				"text": "Visit deployed  App"
      			},
      			"accessory": {
      				"type": "button",
      				"text": {
      					"type": "plain_text",
      					"text": "Click here to view App",
      					"emoji": true
      				},
      				"value": "deployed_app",
      				"url": `https://${branchname}.${customDomain}`,
      				"action_id": "button-action"
      			}
    		}] : [{
    			"type": "section",
    			"text": {
    				"type": "mrkdwn",
    				"text": "View deployment pipeline"
    			},
    			"accessory": {
    				"type": "button",
    				"text": {
    					"type": "plain_text",
    					"text": "Click here for Pipeline",
    					"emoji": true
    				},
    				"value": "pipeline",
    				"url": `https://console.aws.amazon.com/amplify/home?region=${amplifyRegion}#${amplifyAppId}/${branchname?.toLowerCase()}`,
    				"action_id": "button-action"
    			}
    		}])
      }]
    }

    await postRequest(slackMessage, slackWebhook);
}