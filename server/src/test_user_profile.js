async function testProfile() {
  const query = `
    query GetProfile($username: String!) {
      userProfile(username: $username) {
        id
        username
        email
        avatar
        createdAt
        posts {
          id
          caption
          imageUrl
          createdAt
          comments {
            id
            content
            replies {
              id
              content
            }
          }
        }
      }
    }
  `;

  const res = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { username: 'alex' },
    }),
  });

  const data = await res.json();
  console.log('Result for alex:', JSON.stringify(data, null, 2));

  // Test non-existent user
  const resNonExistent = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { username: 'non_existent_user_999' },
    }),
  });
  const dataNonExistent = await resNonExistent.json();
  console.log('Result for non-existent:', JSON.stringify(dataNonExistent, null, 2));
}

testProfile();
