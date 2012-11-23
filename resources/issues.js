var _ = require('underscore'),
    jira = require('./jiraClient');

function reportJiraError(res, error) {
    res.status(502).json({
        message: 'JIRA returned a ' + error.statusCode + ' error response',
        cause: { statusCode: error.statusCode }});
}

var defaultConfiguration = {urlRoot: 'http://www.mulesoft.org/jira', pointsField: 'customfield_10130'};

module.exports = function (app, cfg) {
    var config = _.defaults((cfg) ? cfg.jira : {}, defaultConfiguration),
        client = jira.createClient(config);

    function issueDataFromJira(issue) {
        return {
            id: issue.key,
            summary: issue.fields.summary,
            description: issue.fields.description,
            status: issue.fields.status.name,
            estimate: {
                points: issue.fields[config.pointsField],
                time: issue.fields.timetracking.originalEstimate
            }
        };
    }

    function issueUpdateFromRequest(data) {
        return _(data).chain().map(function (elem) {
            var result = {key: elem.id, fields: {}};

            if (elem.estimate && elem.estimate.points) {
                result.fields[config.pointsField] = elem.estimate.points;
            }
            if (elem.estimate && elem.estimate.time) {
                result.fields.timetracking = {originalEstimate: elem.estimate.points };
            }
            return result;
        }).filter(function (elem) {
                return _.keys(elem.fields).length > 0;
            }).value();
    }

    app.get('/issues/:id', function (req, res) {
            client.findIssue(req.params.id, ['summary', 'description', 'status', config.pointsField, 'timetracking'])
                .then(function (issue) {
                    res.json(issueDataFromJira(issue));
                }).fail(_(reportJiraError).bind(this, res));
        }
    );

    app.put('/issues/estimates', function (req, res) {
        if (_.isArray(req.body)) {
            client.updateIssues(issueUpdateFromRequest(req.body)).then(function () {
                res.send(200);
            }).fail(_(reportJiraError).bind(this, res));
        } else {
            res.send(400);
        }
    });
};