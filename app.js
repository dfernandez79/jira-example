var express = require('express'),
    basicAuthentication = require('./security/basicAuthentication.js'),
    issueResources = require('./resources/issues.js'),
    app = express();

basicAuthentication(app);

issueResources(app, {
    jira: {
        username: (process.env.JIRA_USER) ? process.env.JIRA_USER : process.argv[2],
        password: (process.env.JIRA_PASSWORD) ? process.env.JIRA_PASSWORD : process.argv[3]
    }
});

app.listen(process.env.PORT);
