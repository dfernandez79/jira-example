var users = {example: 'JiraExample784'};

module.exports = {
    check: function (username, password) {
        return users[username] && users[username] === password;
    }
};
