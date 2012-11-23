var _ = require('underscore'),
    Q = require('q'),
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
                headers: { Accept: 'application/json'},
                username: this.username,
                password: this.password
            });

        request.on('complete',function (data) {
            defer.resolve(data);
        }).on('fail', function (data, error) {
                defer.reject({statusCode: error.statusCode});
            });

        return defer.promise;
    },

    put: function (path, data) {
        var defer = Q.defer(),
            request = restler.put(this.urlRoot + '/rest/api/2' + path, {
                headers: { Accept: 'application/json', "Content-Type": "application/json" },
                username: this.username,
                password: this.password,
                data: JSON.stringify(data)
            });

        request.on('complete',function (data) {
            defer.resolve(data);
        }).on('fail', function (data, error) {
                defer.reject({statusCode: error.statusCode});
            });

        return defer.promise;
    },

    findIssue: function (id, fields) {
        var fieldsQuery = '';
        if (fields) {
            fieldsQuery = '?' + fields.join(',');
        }

        return this.get('/issue/' + id + fieldsQuery);
    },

    updateIssues: function (data) {
        var self = this;
        return Q.all(_(data).map(function (updateInfo) {
            return self.put('/issue/' + updateInfo.key, {fields: updateInfo.fields});
        }));
    }
};

module.exports = {
    createClient: function (config) {
        return new JiraClient(config);
    }
};
