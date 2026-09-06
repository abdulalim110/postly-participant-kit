async function runTests() {
  const endpoint = 'http://localhost:4000/graphql';

  // 1. Login to get token
  const loginRes = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation { login(identifier: "alex", password: "secret123") { token } }`,
    }),
  }).then((r) => r.json());

  const token = loginRes.data.login.token;

  // 2. Fetch posts
  const feedRes = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query { feed { id caption } }`,
    }),
  }).then((r) => r.json());

  const post1Id = feedRes.data.feed[0].id;
  const post2Id = feedRes.data.feed[1] ? feedRes.data.feed[1].id : post1Id;

  console.log(`Testing with Post1: ${post1Id}, Post2: ${post2Id}`);

  // Test A: Top-level comment
  const topCommentRes = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `mutation ($postId: ID!, $content: String!) {
        createComment(postId: $postId, content: $content) {
          id
          content
          parentId
          author { username }
        }
      }`,
      variables: {
        postId: post1Id,
        content: 'Kopi mantap untuk coding sore!',
      },
    }),
  }).then((r) => r.json());

  console.log('Test A (Top-Level Comment):', JSON.stringify(topCommentRes));
  const topCommentId = topCommentRes.data.createComment.id;

  // Test B: 1-Level Reply
  const replyRes = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `mutation ($postId: ID!, $parentId: ID, $content: String!) {
        createComment(postId: $postId, parentId: $parentId, content: $content) {
          id
          content
          parentId
          author { username }
        }
      }`,
      variables: {
        postId: post1Id,
        parentId: topCommentId,
        content: 'Setuju banget! Apalagi sambil denger musik lo-fi.',
      },
    }),
  }).then((r) => r.json());

  console.log('Test B (Valid 1-Level Reply):', JSON.stringify(replyRes));
  const replyId = replyRes.data.createComment.id;

  // Test C: Invariant 2 - Reject Reply-to-Reply
  const replyToReplyRes = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `mutation ($postId: ID!, $parentId: ID, $content: String!) {
        createComment(postId: $postId, parentId: $parentId, content: $content) {
          id
        }
      }`,
      variables: {
        postId: post1Id,
        parentId: replyId,
        content: 'Mencoba reply bertingkat (wajib ditolak)',
      },
    }),
  }).then((r) => r.json());

  console.log('Test C (Invariant 2 - Reply to Reply Rejection):', JSON.stringify(replyToReplyRes));

  // Test D: Invariant 1 - Reject Mismatch Post Parent
  if (post2Id !== post1Id) {
    const mismatchPostRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `mutation ($postId: ID!, $parentId: ID, $content: String!) {
          createComment(postId: $postId, parentId: $parentId, content: $content) {
            id
          }
        }`,
        variables: {
          postId: post2Id,
          parentId: topCommentId,
          content: 'Mencoba reply parent dari post berbeda (wajib ditolak)',
        },
      }),
    }).then((r) => r.json());

    console.log('Test D (Invariant 1 - Different Post Rejection):', JSON.stringify(mismatchPostRes));
  }
}

runTests().catch(console.error);
