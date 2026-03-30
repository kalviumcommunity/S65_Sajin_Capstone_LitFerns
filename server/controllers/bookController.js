const asyncHandler = require('express-async-handler');
const Book = require('../models/Book');


// Get all books
// GET /api/books
const getBooks = asyncHandler(async (req, res) => {
    const {
        q,
        genre,
        author,
        condition,
        language,
        format,
        available,
        minYear,
        maxYear,
        location,
        minRating,
        sort = 'newest',
        page = 1,
        limit = 20,
    } = req.query;

    const filters = {};
    if (q) {
        const regex = new RegExp(q.trim(), 'i');
        filters.$or = [
            { title: regex },
            { author: regex },
            { genre: regex },
            { description: regex },
        ];
    }
    if (genre) filters.genre = genre;
    if (author) filters.author = author;
    if (condition) filters.condition = condition;
    if (language) filters.language = language;
    if (format) filters.format = format;
    if (available === 'true') filters.isAvailable = true;
    if (available === 'false') filters.isAvailable = false;
    
    if (location) {
        filters.location = new RegExp(location.trim(), 'i');
    }

    if (minYear || maxYear) {
        filters.publishedYear = {};
        if (minYear) filters.publishedYear.$gte = Number(minYear);
        if (maxYear) filters.publishedYear.$lte = Number(maxYear);
    }

    const pageNum = Number(page) || 1;
    const pageSize = Math.min(Number(limit) || 20, 50);

    const sortMap = {
        newest: { createdAt: -1 },
        oldest: { createdAt: 1 },
        rating: { averageRating: -1, ratingsCount: -1 },
        title: { title: 1 },
    };

    const sortOption = sortMap[sort] || sortMap.newest;

    let queryBuilder = Book.find(filters).populate('owner', 'name email averageRating successfulSwaps');

    // If minRating filter is provided, we might need to filter after population if averageRating is on User
    // However, if we want to filter efficiently, we should have averageRating on the Book too (redundant but fast)
    // or use aggregation. For now, let's assume we want to filter by the owner's rating.

    const total = await Book.countDocuments(filters);
    const books = await Book.find(filters)
        .populate('owner', 'name email averageRating successfulSwaps')
        .sort(sortOption)
        .skip(pageSize * (pageNum - 1))
        .limit(pageSize);

    // Apply rating filter manually if needed, or if it's on the model
    let filteredBooks = books;
    if (minRating) {
        filteredBooks = books.filter(b => b.owner && b.owner.averageRating >= Number(minRating));
    }

    res.status(200).json({
        books: filteredBooks,
        page: pageNum,
        pages: Math.ceil(total / pageSize),
        total,
    });
});

// Get single book by ID
// GET /api/books/:id
const getBookById = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id).populate('owner', 'name email');

    if (!book) {
        res.status(404);
        throw new Error('Book not found');
    }

    // Preload related data: similar (same genre) and more by owner
    const [similar, moreByOwner] = await Promise.all([
        Book.find({ _id: { $ne: book._id }, genre: book.genre }).limit(8),
        Book.find({ _id: { $ne: book._id }, owner: book.owner?._id || book.owner }).limit(6),
    ]);

    res.json({
        book,
        similar,
        moreByOwner,
    });
});

// Create a new book
// POST /api/books
const createBook = asyncHandler(async (req, res) => {
    const {
        title,
        author,
        genre,
        condition,
        image,
        description,
        publishedYear,
        language,
        format,
        pages,
        location,
        tags = [],
    } = req.body;
    
    // Validate mandatory fields
    if (!title || !author || !genre || !condition || !description) {
        res.status(400);
        throw new Error('Please fill out all required fields');
    }
    
    // Trim and validate strings
    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();
    const trimmedGenre = genre.trim();
    const trimmedCondition = condition.trim();
    const trimmedDescription = description.trim();
    
    if (trimmedTitle.length === 0 || trimmedTitle.length > 150) {
        res.status(400);
        throw new Error('Title must be between 1 and 150 characters');
    }
    if (trimmedAuthor.length === 0 || trimmedAuthor.length > 120) {
        res.status(400);
        throw new Error('Author must be between 1 and 120 characters');
    }
    if (trimmedDescription.length < 10 || trimmedDescription.length > 2000) {
        res.status(400);
        throw new Error('Description must be between 10 and 2000 characters');
    }
    
    // Validate condition values
    const validConditions = ['Like New', 'Good', 'Fair', 'Poor'];
    if (!validConditions.includes(trimmedCondition)) {
        res.status(400);
        throw new Error('Invalid condition value');
    }
    
    const validFormats = ['Hardcover', 'Paperback', 'Ebook', 'Audiobook', 'Other'];
    if (format && !validFormats.includes(format)) {
        res.status(400);
        throw new Error('Invalid format value');
    }

    const parsedYear = publishedYear ? Number(publishedYear) : undefined;
    if (parsedYear && (parsedYear < 1400 || parsedYear > new Date().getFullYear() + 1)) {
        res.status(400);
        throw new Error('Invalid published year');
    }
    const parsedPages = pages ? Number(pages) : undefined;
    if (parsedPages && parsedPages < 1) {
        res.status(400);
        throw new Error('Pages must be at least 1');
    }
    
    const book = await Book.create({
        owner: req.user._id, 
        title: trimmedTitle,
        author: trimmedAuthor,
        genre: trimmedGenre,
        condition: trimmedCondition,
        image,
        description: trimmedDescription,
        publishedYear: parsedYear,
        language: language?.trim() || undefined,
        format,
        pages: parsedPages,
        location: location?.trim() || undefined,
        tags,
    });

    res.status(201).json(book);
});

// Update an existing book
// PUT /api/books/:id
const updateBook = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
        res.status(404);
        throw new Error('Book not found');
    }
    
    // Verify user owns this book
    if (book.owner.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this book');
    }
    
    // Validate update data if provided
    const payload = { ...req.body };
    if (payload.title) {
        const trimmedTitle = payload.title.trim();
        if (trimmedTitle.length === 0 || trimmedTitle.length > 150) {
            res.status(400);
            throw new Error('Title must be between 1 and 150 characters');
        }
        payload.title = trimmedTitle;
    }
    
    if (payload.author) {
        const trimmedAuthor = payload.author.trim();
        if (trimmedAuthor.length === 0 || trimmedAuthor.length > 120) {
            res.status(400);
            throw new Error('Author must be between 1 and 120 characters');
        }
        payload.author = trimmedAuthor;
    }
    
    if (payload.description) {
        const trimmedDescription = payload.description.trim();
        if (trimmedDescription.length < 10 || trimmedDescription.length > 2000) {
            res.status(400);
            throw new Error('Description must be between 10 and 2000 characters');
        }
        payload.description = trimmedDescription;
    }

    if (payload.condition) {
        const validConditions = ['Like New', 'Good', 'Fair', 'Poor'];
        if (!validConditions.includes(payload.condition)) {
            res.status(400);
            throw new Error('Invalid condition value');
        }
    }

    if (payload.format) {
        const validFormats = ['Hardcover', 'Paperback', 'Ebook', 'Audiobook', 'Other'];
        if (!validFormats.includes(payload.format)) {
            res.status(400);
            throw new Error('Invalid format value');
        }
    }

    if (payload.publishedYear) {
        const parsedYear = Number(payload.publishedYear);
        if (parsedYear < 1400 || parsedYear > new Date().getFullYear() + 1) {
            res.status(400);
            throw new Error('Invalid published year');
        }
        payload.publishedYear = parsedYear;
    }

    if (payload.pages) {
        const parsedPages = Number(payload.pages);
        if (parsedPages < 1) {
            res.status(400);
            throw new Error('Pages must be at least 1');
        }
        payload.pages = parsedPages;
    }

    if (payload.language) {
        payload.language = payload.language.trim();
    }

    if (payload.location) {
        payload.location = payload.location.trim();
    }

    if (payload.tags && Array.isArray(payload.tags)) {
        payload.tags = payload.tags.map((t) => String(t).trim()).filter(Boolean);
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, payload, {
        new: true,
        runValidators: true,
    });

    res.status(200).json(updatedBook);
});


// Delete a book
// DELETE /api/books/:id
const deleteBook = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
        res.status(404);
        throw new Error('Book not found');
    }
    
    // Verify user owns this book
    if (book.owner.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to delete this book');
    }

    await book.deleteOne();

    res.status(200).json({ message: 'Book removed successfully' });
});

// Get logged-in user's books
// GET /api/books/mybooks

const getMyBooks = asyncHandler(async (req, res) => {
    const books = await Book.find({ owner: req.user._id }).populate('owner', 'name email'); 
    res.status(200).json(books);
});


// Get recommended books for user
// GET /api/books/recommendations
const getRecommendations = asyncHandler(async (req, res) => {
    const user = await require('../models/User').findById(req.user._id).populate('wishlist');
    
    // 1. Get genres from wishlist
    const wishlistGenres = [...new Set(user.wishlist.map(b => b.genre))];
    
    // 2. Get genres from user's books (they like what they have)
    const myBooks = await Book.find({ owner: req.user._id });
    const ownedGenres = [...new Set(myBooks.map(b => b.genre))];
    
    const preferredGenres = [...new Set([...wishlistGenres, ...ownedGenres])];
    
    // 3. Find books with preferred genres that user doesn't own and aren't in wishlist
    const excludeIds = [
        req.user._id, 
        ...user.wishlist.map(b => b._id),
        ...myBooks.map(b => b._id)
    ];
    
    let recommendations = await Book.find({
        isAvailable: true,
        owner: { $ne: req.user._id },
        _id: { $nin: excludeIds },
        genre: { $in: preferredGenres }
    })
    .populate('owner', 'name')
    .limit(10);
    
    // If not enough recommendations, fill with popular/new books
    if (recommendations.length < 5) {
        const extra = await Book.find({
            isAvailable: true,
            owner: { $ne: req.user._id },
            _id: { $nin: [...excludeIds, ...recommendations.map(r => r._id)] }
        })
        .populate('owner', 'name')
        .sort({ averageRating: -1, createdAt: -1 })
        .limit(10 - recommendations.length);
        
        recommendations = [...recommendations, ...extra];
    }

    res.json(recommendations);
});

module.exports = {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    getMyBooks,
    getRecommendations,
};