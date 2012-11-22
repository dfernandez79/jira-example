var users = {example: 'JiraExample784'};

module.exports = {
    check: function (username, password, done) {
        if (!users[username] || users[username] !== password) {
            return done(null, false);
        }
        return done(null, {username: username});
    }
};

