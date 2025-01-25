# Student Market

## Project Overview
The **Student Market** is a simple marketplace application where students can list items for sale, including images and basic details. It allows users to browse, save, and manage their listings while offering an easy-to-use interface for item transactions.

## Core Features
- **User Signup/Login with Email**: Students can create an account and log in using their email and password.
- **List Item with Image and Details**: Users can list items for sale with an image, title, description, and price.
- **Browse All Items**: Users can view all listed items in a grid layout.
- **Save Favorite Items**: Users can save their favorite items for easy access.
- **Delete Own Listings**: Users can delete items they've listed for sale.

## Database Structure
### Users Table (Supabase Auth)
- User authentication with email and password.

### Items Table
- **Title**: The name of the item.
- **Price**: The price of the item.
- **Description**: A brief description of the item.
- **Image URL**: The URL of the uploaded image for the item.
- **User ID**: Reference to the user who listed the item.
- **Status**: The availability status of the item (available or sold).
- **Created at**: Timestamp of when the item was listed.

## UI Requirements
- **Design**: Simple, functional, and user-friendly design with a light theme and vibrant accents.
- **Colors**: 
  - **Primary**: #2563EB (Blue)
  - **Background**: #F3F4F6
  - **Text**: #374151
  - **Accent**: #60A5FA

## Pages
### 1. Login/Signup Page
- Minimal form design with fields for email and password.
- Clear success and error states after form submission.
- Smooth transitions for a better user experience.

### 2. Marketplace Page
- Grid layout with 4 columns for desktop.
- Item cards with shadows for better visual hierarchy.
- Price tag overlay on each item card.
- "Add Item" button in the header for listing new items.
- Basic filtering options for sorting through the listings.

### 3. Item Form
- Image uploader with preview functionality.
- Form for entering item details (title, price, description).
- Price input with validation to ensure correct formatting.
- Loading states for a better user experience while uploading images.

## Technical Focus
- **Image Upload Handling**: Manage image uploads, previews, and storage.
- **Basic CRUD Operations**: Allow users to create, read, update, and delete item listings.
- **Price Formatting**: Ensure that the price input is correctly formatted.
- **Responsive Design**: Ensure the application works well on both desktop and mobile devices.

## Evaluation Criteria
- **Functionality** (40%): Does the app work as expected? Are all features implemented correctly?
- **User Interface** (35%): How visually appealing and user-friendly is the app?
- **Team Presentation** (25%): How well did the team present the project and discuss technical challenges?

## Team Guidelines
- Daily 15-minute team check-ins via call.
- Use Git and GitHub for collaboration.
- Create feature branches for each development task.
- Team lead will review code before merging it to the main branch.

## Deliverables
1. **Working Application**: Deployed online for demonstration and testing.
2. **GitHub Repository**: 
   - Complete source code.
   - README.md with setup instructions.
3. **Group Presentation** (10 minutes):
   - Demonstrating key features.
   - Discussing technical challenges overcome during development.

## Setup Instructions

### Clone the Repository
To get started, clone this repository to your local machine:
```bash
git clone https://github.com/yourusername/student-market.git
