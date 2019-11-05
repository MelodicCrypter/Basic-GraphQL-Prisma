import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
    typeDefs: '../prisma/generated/prisma-client/prisma.graphql',
    endpoint: 'localhost:4466'
});

prisma.query.users(null, '{ id name email }').then(data => {
    console.log(data);
});
