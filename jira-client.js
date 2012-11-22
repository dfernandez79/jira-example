var Q = require('q'),
    restler = require('restler'),
    config = {
        urlRoot: 'http://www.mulesoft.org/jira'
    }; 

function jiraGet(path) {
    var defer = Q.defer(),
        request = restler.get(config.urlRoot + '/rest/api/2' + path, 
            {username: config.username, password: config.password});
        
    request.on('complete', function (data) {
        defer.resolve(data);        
    });
    
    return defer.promise;
}

module.exports = {
    config: config,
    findIssue: function (id) {
        return jiraGet('/issue/' + id + '?fields=summary,description,status');
    }
}

