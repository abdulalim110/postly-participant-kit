# GraphQL Just in Time

Handout ini berisi pengetahuan minimum untuk mengerjakan Postly. Workshop tidak
menuntut peserta menjadi ahli GraphQL.

## Lima istilah yang perlu dipahami

### Schema

Schema adalah kontrak field dan operation yang boleh diminta client. Schema tidak
menjelaskan berapa query database yang terjadi.

### Query

Query membaca data. Frontend Postly memakai operation `PublicFeed` untuk meminta
post beserta relation yang perlu ditampilkan.

### Mutation

Mutation mengubah data. Postly memakai mutation untuk register, login, membuat
post, dan membuat comment atau reply.

### Resolver

Resolver adalah function yang menyediakan value untuk sebuah field. Resolver
dapat membaca database, memakai value dari parent, atau memanggil helper lain.

### Nested field

Client dapat meminta relation di dalam relation. Bentuknya ringkas bagi client,
tetapi setiap nested resolver dapat memicu pekerjaan tambahan di backend.

## Operation yang dipakai feed

```graphql
query PublicFeed {
  feed {
    id
    caption
    author {
      username
    }
    comments {
      id
      parentId
      content
      author {
        username
      }
      replies {
        id
        parentId
        content
        author {
          username
        }
      }
    }
  }
}
```

Satu operation GraphQL tersebut berjalan melalui beberapa resolver. Satu HTTP
request GraphQL tidak menjamin hanya ada satu SQL query.

## Comment dan reply

Postly memakai satu mutation:

```graphql
mutation CreateComment($postId: ID!, $parentId: ID, $content: String!) {
  createComment(postId: $postId, parentId: $parentId, content: $content) {
    id
  }
}
```

- `parentId: null` membuat top-level comment.
- `parentId` berisi ID top-level comment untuk membuat reply.
- Backend harus menolak parent dari post lain.
- Backend harus menolak reply terhadap reply.

## Request path

```text
React
  Apollo Client
    POST /graphql
      Apollo Server
        Resolver
          Prisma Client
            SQLite
```

Apollo Client mengirim operation dan variables. Apollo Server memvalidasi
operation terhadap schema lalu menjalankan resolver yang diperlukan. Prisma
menerjemahkan data access ke query database.

## Pertanyaan pemeriksaan

Sebelum menerima task implementation pertama, peserta harus dapat menjawab:

1. Apa perbedaan schema dan resolver?
2. Apa perbedaan query dan mutation?
3. Mengapa nested field dapat memicu query database berulang?
4. Bagaimana `parentId` membedakan comment dan reply?
5. Mengapa satu GraphQL request belum tentu satu SQL query?

## Yang belum perlu dipelajari

Case ini tidak membutuhkan subscription, realtime transport, federation,
custom directive, persisted query, atau pembahasan caching yang mendalam.
