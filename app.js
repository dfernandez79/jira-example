var express = require('express'), 
    passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy,
    jira = require('./jira-client'),
    users = require('./users'),
    app = express();

jira.config.username = process.argv[2];
jira.config.password = process.argv[3];

passport.use(new BasicStrategy({}, users.check));
app.use(passport.initialize());

app.get(/\/.*/, 
    passport.authenticate('basic', { session: false }),
    function (req, res, next) { next(); });
 
app.get('/issues/:id', function (req, res) {
    jira.findIssue(req.params.id).then(function (issue) {
        console.log(issue);
        res.json({
            id: issue.key,
            summary: issue.fields.summary,
            description: issue.fields.description,
            status: issue.fields.status.name
        });    
    });
});

app.listen(process.env.PORT);