var express = require('express'),
    users = require('./users'),
    issueResources = require('./resources/issues.js'),
    https = require('https'),
    fs = require('fs'),
    app = express(),
    port = (process.env.PORT) ? process.env.PORT : 9090;

app.use(express.compress());
app.use(express.basicAuth(users.check));
app.use(express.bodyParser());

issueResources(app, {
    jira: {
        username: (process.env.JIRA_USER) ? process.env.JIRA_USER : process.argv[2],
        password: (process.env.JIRA_PASSWORD) ? process.env.JIRA_PASSWORD : process.argv[3]
    }
});

https.createServer({
    key: fs.readFileSync('keys/server-key.pem'),
    cert: fs.readFileSync('keys/server-cert.pem')
}, app).listen(port);

console.log("Running on port " + port);