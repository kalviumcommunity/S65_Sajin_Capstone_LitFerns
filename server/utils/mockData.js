const mockBooks = [
    {
        id: '1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Classic',
        condition: 'Good',
        ownerId: 'user1',
        isAvailable: true,
    },
    {
        id: '2',
        title: '1984',
        author: 'George Orwell',
        genre: 'Dystopian',
        condition: 'Fair',
        ownerId: 'user2',
        isAvailable: true,
    },
    {
        id: '3',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        genre: 'Fiction',
        condition: 'Excellent',
        ownerId: 'user1',
        isAvailable: false, // Example of an unavailable book
    },
    {
        id: '4',
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        genre: 'Fantasy',
        condition: 'Good',
        ownerId: 'user3',
        isAvailable: true,
    },
    {
        id: '5',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        genre: 'Romance',
        condition: 'Used',
        ownerId: 'user2',
        isAvailable: true,
    },
];

module.exports = mockBooks;