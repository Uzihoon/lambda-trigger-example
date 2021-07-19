/* eslint-disable-line */ const aws = require('aws-sdk');

const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18'
});

exports.handler = async (event, context, callback) => {
  let isAdmin = false;
  const adminEmails = ['dabit3@gmail.com'];

  if (adminEmails.indexOf(event.request.userAttributes.email) !== -1) {
    isAdmin = true;
  }

  const groupParams = {
    GroupName: process.env.GROUP,
    UserPoolId: event.userPoolId
  };
  const addUserParams = {
    GroupName: process.env.GROUP,
    UserPoolId: event.userPoolId,
    Username: event.userName
  };

  if (isAdmin) {
    groupParams.GroupName = 'Admin';
    addUserParams.GroupName = 'Admin';
    try {
      await cognitoidentityserviceprovider
        .adminAddUserToGroup(addUserParams)
        .promise();
      callback(null, event);
    } catch (e) {
      callback(e);
    }
  } else {
    callback(null, event);
  }

  return event;
};
