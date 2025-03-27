# Capstone Project Plan: LitFerns

## Total Duration: 50 days (including buffer days)  
**Buffer Days:** 5 days  

## Project Idea Brief
### Project Name: LitFerns

**Idea:**  
LitFerns is a website for book lovers who prefer exchanging books rather than buying new ones. The platform enables individuals to list books they own and browse books they desire. Users can make swap requests, communicate with book owners, and monitor swap progress. Additional features like feedback, wishlists, and reminders simplify the book-swapping process.

### Key Features:
- **User Roles:** Readers can list books they own and browse available books.
- **Book Listing & Search:** Users can add book listings with details (title, author, genre, condition) and search for books by filters.
- **Swap Requests:** Users can request book swaps and track swap status (Pending, Accepted, Completed).
- **Messaging System:** In-app chat for users to discuss exchanges.
- **Wishlist Feature:** Users can create a wishlist of books they want to find.
- **Ratings & Reviews:** Users can rate and review their swap experiences.
- **Authentication:** JWT-based authentication with Google OAuth support.
- **Notifications:** Email and in-app alerts for swap updates and new listing matches.

---

## Project Timeline: BookSwap Network

### **Week 1: Project Setup & Planning (5 days)**
- **Day 1:** Finalize project idea and name
- **Day 2:** Create low-fidelity design (wireframes)
- **Day 3:** Create high-fidelity UI mockups
- **Day 4:** Set up GitHub repository (README, issues, project board)
- **Day 5:** Plan database schema and relationships

### **Week 2: Backend Development (7 days)**
- **Day 6-7:** Set up backend server and folder structure
- **Day 8-9:** Implement database schema and test CRUD operations
- **Day 10:** Create API routes (GET, POST, PUT, DELETE)
- **Day 11:** Add authentication (username/password)
- **Day 12:** Implement JWT-based authentication and test APIs

### **Week 3: Frontend Development (7 days)**
- **Day 13:** Initialize React app and set up folder structure
- **Day 14-15:** Build core components (home, profile, book listing)
- **Day 16:** Implement book listing and search functionality
- **Day 17:** Connect frontend to backend (API integration)
- **Day 18-19:** Style components to match high-fidelity designs

### **Week 4: Feature Enhancements (7 days)**
- **Day 20:** Implement 'update' and 'delete' book listing features
- **Day 21:** Add third-party authentication (Google login)
- **Day 22-23:** Implement swap request feature (request, accept, decline)
- **Day 24-25:** Add chat functionality for users to discuss swaps
- **Day 26:** Test complete user flows (listing, searching, swapping)

### **Week 5: Testing & Deployment (7 days)**
- **Day 27-28:** Write unit tests with Jest (at least 5 tests)
- **Day 29-30:** Fix bugs and optimize code
- **Day 31:** Prepare Dockerfile and dockerize app
- **Day 32:** Deploy backend and frontend servers
- **Day 33:** Test deployment and fix deployment issues

### **Week 6: Feedback & Finalization (7 days)**
- **Day 34-35:** Gather feedback from peers/mentors
- **Day 36-37:** Implement feedback and polish UI
- **Day 38-39:** Add final touches to features
- **Day 40:** Create a demo video and project documentation

### **Buffer Days (5 days)**
Reserved for unexpected bugs, delays, or extra features.
