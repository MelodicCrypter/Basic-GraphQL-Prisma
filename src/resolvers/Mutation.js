import uuidv4 from "uuid/v4";

const Mutation = {
    createUser(parent, args, { db }, info) {
        const { name, email, age } = args.data;
        const emailTaken = db.users.some(user => user.email === email);

        if (emailTaken) {
            throw new Error('Email taken.');
        }

        const user = {
            id: uuidv4(),
            ...args.data
        };

        db.users.push(user);

        return user;
    },
    deleteUser(parent, args, { db }, info) {
        const { id } = args;
        const userIndex = db.users.findIndex(user => user.id === id);

        if (userIndex === -1) {
            throw new Error('User not found.');
        }

        const deletedUser = db.users.splice(userIndex, 1)[0];

        db.posts = db.posts.filter((post) => {
            const match = post.author === id;

            if (match) {
                db.comments = db.comments.filter((comment) => comment.post !== post.id);
            }

            return !match;
        });
        db.comments = db.comments.filter((comment) => comment.author !== id);

        return deletedUser;
    },
    updateUser(parent, args, { db }, info) {
        const { id, data } = args;
        const user = db.users.find(user => user.id === id);

        if (!user) {
            throw new Error('User not found.');
        }

        if (typeof data.email === 'string') {
            // if email is already taken, user cannot update his/her email
            const emailTaken = db.users.some(user => user.email === data.email);

            if (emailTaken) {
                throw new Error('Email taken.');
            }

            user.email = data.email;
        }

        if (typeof data.name === 'string') {
            user.name = data.name;
        }

        if (typeof data.age !== 'undefined') {
            user.name = data.name;
        }

        return user;
    },
    createPost(parent, args, { db, pubsub }, info) {
        const { title, body, published, author } = args.data;
        const userExists = db.users.some(user => user.id === author);

        if (!userExists) {
            throw new Error('User does not exist');
        }

        const post = {
            id: uuidv4(),
            ...args.data
        };

        db.posts.push(post);

        if (published) {
            pubsub.publish(`post`, {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            });
        }

        return post;
    },
    deletePost(parent, args, { db, pubsub }, info) {
        const { id } = args;
        const postIndex = db.posts.findIndex(post => post.id === id);

        if (postIndex === -1) {
            throw new Error('Post cannot be found');
        }

        // destructure using Array
        const [deletedPost] = db.posts.splice(postIndex, 1);

        db.comments = db.comments.filter(comment => comment.post !== id);

        if (deletedPost.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: deletedPost
                }
            });
        }

        return deletedPost;
    },
    updatePost(parent, args, { db, pubsub }, info) {
        const { id, data } = args;
        const post = db.posts.find(post => post.id === id);
        const originalPost = { ...post };

        if (!post) {
            throw new Error("Post not found");
        }

        if (typeof data.title === 'string' && data.title !== '') {
            post.title = data.title;
        }

        if (typeof data.body === 'string' && data.body !== '') {
            post.body = data.body;
        }

        if (typeof data.published === 'boolean') {
            post.published = data.published;

            if (originalPost.published && !post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                });
            } else if (!originalPost.published && post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                });
            }
        } else if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            });
        }

        return post;
    },
    createComment(parent, args, { db, pubsub }, info) {
        const { text, author, post } = args.data;
        const userExists = db.users.some(user => user.id === author);
        const postExists = db.posts.some(p => p.id === post && p.published === true);

        if (!userExists || !postExists) {
            throw new Error('User or Post must be valid.');
        }

        const comment = {
            id: uuidv4(),
            ...args.data
        };

        db.comments.push(comment);

        pubsub.publish(`comment ${post}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        });

        return comment;
    },
    updateComment(parent, args, { db, pubsub }, info) {
        const { id, data } = args;
        const comment = db.comments.find(c => c.id === id);

        if (!comment) {
            throw new Error('Comment not found');
        }

        if (typeof data.text === 'string') {
            comment.text = data.text;

            pubsub.publish(`comment ${comment.post}`, {
                comment: {
                    mutation: 'UPDATED',
                    data: comment
                }
            });
        }

        return comment;
    },
    deleteComment(parent, args, { db, pubsub }, info) {
        const { id } = args;
        const commentIndex = db.comments.findIndex(c => c.id === id);

        if (commentIndex === -1) {
            throw new Error('Comment not found');
        }

        const [deletedComment] = db.comments.splice(commentIndex, 1);

        pubsub.publish(`comment ${deletedComment.post}`, {
            comment: {
                mutation: 'DELETED',
                data: deletedComment
            }
        });

        return deletedComment;
    }
};

export { Mutation as default };
