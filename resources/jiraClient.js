var Q = require('q'),
    restler = require('restler');

function JiraClient(config) {
    this.urlRoot = config.urlRoot;
    this.username = config.username;
    this.password = config.password;
}

JiraClient.prototype = {
    get: function (path) {
        var defer = Q.defer(),
            request = restler.get(this.urlRoot + '/rest/api/2' + path, {
                username: this.username,
                password: this.password
            });

        request.on('complete',function (data) {
            defer.resolve(data);
        }).on('fail', function () {
                defer.reject();
            });

        return defer.promise;
    },

    findIssue: function (id) {
        return this.get('/issue/' + id + '?fields=summary,description,status');
    }
};

module.exports = {
    createClient: function (config) {
        return new JiraClient(config);
    }
};
