// Resolvers
// if a query has arguments:
// parent => common and is useful when working with relational data
// args => operation arguments supplied
// ctx => contexual data, might contain an idea of a specific user, product, etc
// info => contains information for

const Query = {
    me() {
        return {
            id: '1234',
            name: 'Hugh',
            address: '118 Splendor Hills'
        }
    },
    users(parent, args, { db }, info) {
        const { query } = args;

        if (!query) {
            return db.users;
        }

        // if has query
        const q = query.toLowerCase();

        return db.users.filter((user) => {
            const { name } = user;

            return name.toLowerCase().includes(q);
        });
    },
    posts(parent, args, { db }, info) {
        const { query } = args;

        if (!query) {
            return db.posts;
        }

        // if has query
        const q = query.toLowerCase();

        return db.posts.filter((post) => {
            const { title, body } = post;
            const isTitleMatched = title.toLowerCase().includes(q);
            const isBodyMatched = body.toLowerCase().includes(q);

            return isTitleMatched || isBodyMatched;
        });
    },
    comments(parent, args, { db }, info) {
        return db.comments;
    }
};

export { Query as default };
