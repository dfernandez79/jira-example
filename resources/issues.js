var _ = require('underscore'),
    jira = require('./jiraClient');

function jsonResponseFromJiraIssue(issue) {
    console.log(issue);
    return {
        id: issue.key,
        summary: issue.fields.summary,
        description: issue.fields.description,
        status: issue.fields.status.name
    };
}

function sendErrorResponse(error, res) {
    res.status(500);
}

module.exports = function (app, config) {
    var client = jira.createClient(_.defaults((config) ? config.jira : {}, {urlRoot: 'http://www.mulesoft.org/jira'}));

    app.get('/issues/:id', function (req, res) {
        client.findIssue(req.params.id).then(function (issue) {
            res.json(jsonResponseFromJiraIssue(issue));
        }).fail(function (error) {
                sendErrorResponse(error, res);
            });
    });
};