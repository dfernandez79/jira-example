A simple example that exposes Mulesoft JIRA though a simple web API.

**Before running** the example you need to install the required node.js modules:

        npm install


Then run this example you need to pass the user name and password to connect to JIRA. You can do this in two ways:

Using the command line:

      node app.js jirauser password

Or using environment variables:

      export JIRA_USER=user
      export JIRA_PASSWORD=pass
      node app.js

By default the server listen into the port 9090, but you can change that by setting the `PORT` environment variable.