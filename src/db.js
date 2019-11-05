// Demo array data
const users = [
    {
        id: '1343',
        name: 'hugh',
        email: 'hugh@gmail.com',
        age: 31,
    },
    {
        id: '133443',
        name: 'jean',
        email: 'jean@gmail.com',
    },
    {
        id: '44773',
        name: 'kate',
        email: 'kate@gmail.com',
    }
];
const posts = [
    {
        id: "777",
        title: "Sample Post 1",
        body: "This is the most amazing story.",
        published: true,
        author: '1343'
    },
    {
        id: "778",
        title: "Sample Post 2",
        body: "Our God is an awesome God!",
        published: true,
        author: '1343'
    },
    {
        id: "779",
        title: "Sample Post 3",
        body: "When the oceans rise and thunders roar.",
        published: false,
        author: '44773'
    },
];
const comments = [
    {
        id: '100',
        text: 'Nice, you did a great job!',
        author: '1343',
        post: '778',
    },
    {
        id: '101',
        text: 'Hey, where did you shoot this one?',
        author: '1343',
        post: '778',
    },
    {
        id: '102',
        text: 'Nice post! BTW, I saw you the other day!',
        author: '133443',
        post: '779',
    },
];

const db = {
  users,
  posts,
  comments,
};

export { db as default };
