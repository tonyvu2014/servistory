import { Amplify } from 'aws-amplify';

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

function App({ signOut, changePassword, user }) {
  return (
    <>
      <h1>Hello {user.username}</h1>
      <button onClick={changePassword}>Change password</button>
      <button onClick={signOut}>Sign out</button>
    </>
  );
}

export default withAuthenticator(App);