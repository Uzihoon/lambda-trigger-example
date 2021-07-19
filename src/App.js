import Auth from '@aws-amplify/auth';
import { AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react';
import React, { useEffect, useState } from 'react';

function App() {
  const [user, updateUser] = useState(null);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => updateUser(user))
      .catch(err => console.log(err));
  }, []);

  let isAdmin = false;

  if (user) {
    const {
      signInUserSession: {
        idToken: { payload }
      }
    } = user;
    console.log('payload: ', payload);

    if (
      payload['cognito:groups'] &&
      payload['cognito:groups'].includes('Admin')
    ) {
      isAdmin = true;
    }
  }

  return (
    <div>
      <header>
        <h1>Hello World!</h1>
        {isAdmin && <p>Welcome, Admin</p>}
      </header>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
