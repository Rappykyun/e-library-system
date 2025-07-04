# E-Library System - Comprehensive API Documentation

## Table of Contents

1. [Backend APIs](#backend-apis)
   - [Authentication APIs](#authentication-apis)
   - [Admin APIs](#admin-apis)
   - [Student APIs](#student-apis)
   - [Models & Relationships](#models--relationships)
   - [Services](#services)
2. [Frontend Components](#frontend-components)
   - [Core Components](#core-components)
   - [UI Components](#ui-components)
   - [TypeScript Interfaces](#typescript-interfaces)
   - [Hooks & Utilities](#hooks--utilities)
3. [Usage Examples](#usage-examples)
4. [Best Practices](#best-practices)

---

## Backend APIs

### Authentication APIs

All authentication endpoints follow Laravel Breeze patterns with Inertia.js integration.

#### Base URL: `/auth`

| Method | Endpoint | Description | Middleware | Parameters |
|--------|----------|-------------|------------|------------|
| `GET` | `/register` | Show registration form | `guest` | - |
| `POST` | `/register` | Create new user account | `guest` | `name`, `email`, `password`, `password_confirmation` |
| `GET` | `/login` | Show login form | `guest` | - |
| `POST` | `/login` | Authenticate user | `guest` | `email`, `password`, `remember` |
| `POST` | `/logout` | Log out user | `auth` | - |
| `GET` | `/forgot-password` | Show forgot password form | `guest` | - |
| `POST` | `/forgot-password` | Send password reset link | `guest` | `email` |
| `GET` | `/reset-password/{token}` | Show password reset form | `guest` | `token`, `email` |
| `POST` | `/reset-password` | Reset password | `guest` | `token`, `email`, `password`, `password_confirmation` |

#### Example Usage:

```typescript
// Login request
const response = await fetch('/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN': csrfToken,
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password',
    remember: true
  })
});
```

### Admin APIs

Admin APIs require authentication and admin/librarian role permissions.

#### Base URL: `/admin`
#### Middleware: `auth`, `verified`, `role:admin|librarian`

#### Books Management

| Method | Endpoint | Description | Parameters | Response |
|--------|----------|-------------|------------|----------|
| `GET` | `/books` | List all books with pagination | `page`, `per_page` | Paginated books with categories |
| `POST` | `/books` | Create new book | Book form data + file upload | Success/Error response |
| `GET` | `/books/{id}` | Show specific book details | - | Book with category |
| `PUT` | `/books/{id}` | Update book | Book form data + optional file | Success/Error response |
| `DELETE` | `/books/{id}` | Delete book | - | Success response |
| `GET` | `/books/{id}/download` | Download book file | - | File stream |

##### Book Creation/Update Parameters:

```typescript
interface BookFormData {
  title: string;              // required, max:255
  author: string;             // required, max:255
  category_id: string;        // required, exists in categories
  description?: string;       // optional
  publisher?: string;         // optional, max:255
  published_year?: string;    // optional, 4 digits
  pages?: string;            // optional, 1-10000
  isbn?: string;             // optional, max:20, unique
  language?: string;         // optional, max:10
  ebook: File;               // required for create, optional for update
                            // accepted: pdf,epub, max:30720KB
}
```

##### Example Usage:

```typescript
// Create a new book
const formData = new FormData();
formData.append('title', 'Sample Book Title');
formData.append('author', 'Author Name');
formData.append('category_id', '1');
formData.append('ebook', fileInput.files[0]);

const response = await fetch('/admin/books', {
  method: 'POST',
  headers: {
    'X-CSRF-TOKEN': csrfToken,
  },
  body: formData
});
```

#### Categories Management

| Method | Endpoint | Description | Parameters | Response |
|--------|----------|-------------|------------|----------|
| `GET` | `/categories` | List all categories | - | Paginated categories with book count |
| `POST` | `/categories` | Create new category | `name`, `description` | Success/Error response |
| `PUT` | `/categories/{id}` | Update category | `name`, `description` | Success/Error response |
| `DELETE` | `/categories/{id}` | Delete category | - | Success response |

##### Example Usage:

```typescript
// Create a new category
const response = await fetch('/admin/categories', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN': csrfToken,
  },
  body: JSON.stringify({
    name: 'Science Fiction',
    description: 'Books about futuristic concepts and technologies'
  })
});
```

#### User Management (Admin Only)

| Method | Endpoint | Description | Middleware | Parameters |
|--------|----------|-------------|------------|------------|
| `GET` | `/users` | List all users | `role:admin` | - |
| `PUT` | `/users/{id}` | Update user | `role:admin` | User data |
| `DELETE` | `/users/{id}` | Delete user | `role:admin` | - |

### Student APIs

Student APIs require authentication and student role.

#### Base URL: `/student`
#### Middleware: `auth`, `verified`, `role:student`

#### Books Browsing

| Method | Endpoint | Description | Parameters | Response |
|--------|----------|-------------|------------|----------|
| `GET` | `/books` | Browse books with filters | `search`, `category`, `page` | Paginated books with user data |
| `GET` | `/books/{id}` | View book details | - | Book details with bookmark status |

##### Query Parameters:

- `search`: String to search in title, author, description, ISBN
- `category`: Category slug to filter by (use 'all' for no filter)
- `page`: Page number for pagination

##### Example Usage:

```typescript
// Browse books with search and category filter
const response = await fetch('/student/books?' + new URLSearchParams({
  search: 'machine learning',
  category: 'computer-science',
  page: '1'
}));

const data = await response.json();
// Returns: { data: Book[], links: PaginationLinks, meta: PaginationMeta }
```

#### Bookmarks Management

| Method | Endpoint | Description | Parameters | Response |
|--------|----------|-------------|------------|----------|
| `GET` | `/bookmarks` | List user's bookmarks | - | Paginated bookmarked books |
| `POST` | `/bookmarks` | Add bookmark | `book_id` | JSON success/error |
| `DELETE` | `/bookmarks` | Remove bookmark | `book_id` | JSON success/error |

##### Example Usage:

```typescript
// Add a bookmark
const response = await fetch('/student/bookmarks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN': csrfToken,
  },
  body: JSON.stringify({
    book_id: 123
  })
});

const result = await response.json();
// Returns: { message: string, bookmarked: boolean }
```

### Models & Relationships

#### User Model

```php
class User extends Authenticatable
{
    // Fillable attributes
    protected $fillable = ['name', 'email', 'password'];

    // Relationships
    public function bookmarks(): HasMany;
    public function ratings(): HasMany;
    public function bookmarkedBooks(): BelongsToMany;
    public function ratedBooks(): BelongsToMany;
}
```

#### Book Model

```php
class Book extends Model
{
    // Fillable attributes
    protected $fillable = [
        'title', 'author', 'publisher', 'description', 'isbn',
        'published_year', 'pages', 'language', 'category_id',
        'cover_image_url', 'cover_image_public_id', 'ebook_url',
        'ebook_public_id', 'views_count', 'thumbnail_public_id',
        'average_rating', 'total_ratings', 'downloads_count'
    ];

    // Relationships
    public function category(): BelongsTo;
    public function bookMarks(): HasMany;
    public function ratings(): HasMany;
    public function bookmarkedByUsers(): BelongsToMany;
    public function ratedByUsers(): BelongsToMany;

    // Helper methods
    public function isBookmarkedBy(?User $user): bool;
    public function getUserRating(?User $user): ?int;
    public function getAverageRating(): void;

    // Query scopes
    public function scopeWithUserData($query, ?User $user);
    public function scopeSearch($query, ?string $search);
    public function scopeFilterBy($query, array $filters);
}
```

#### Category Model

```php
class Category extends Model
{
    protected $fillable = ['name', 'slug', 'description'];

    // Relationships
    public function books(): HasMany;

    // Auto-generates slug from name on creation
}
```

#### Bookmark Model

```php
class Bookmark extends Model
{
    protected $fillable = ['user_id', 'book_id'];

    // Relationships
    public function user(): BelongsTo;
    public function book(): BelongsTo;
}
```

#### Rating Model

```php
class Rating extends Model
{
    protected $fillable = ['user_id', 'book_id', 'rating', 'review'];

    // Relationships
    public function user(): BelongsTo;
    public function book(): BelongsTo;
}
```

### Services

#### AzureBlobService

Handles file uploads, downloads, and management with Azure Blob Storage.

```php
class AzureBlobService
{
    // Upload file to Azure Blob Storage
    public function uploadFile(UploadedFile $file, string $blobName): array;

    // Upload raw content to Azure Blob Storage
    public function uploadRawContent(string $content, string $blobName, string $contentType): array;

    // Delete file from Azure Blob Storage
    public function deleteFile(string $blobName): array;

    // Get public URL for blob
    public function getPublicUrl(string $blobName): string;
}
```

##### Example Usage:

```php
// Upload a file
$uploadResult = $this->azureBlobService->uploadFile($file, 'ebooks/sample.pdf');

if ($uploadResult['success']) {
    $publicUrl = $this->azureBlobService->getPublicUrl('ebooks/sample.pdf');
}
```

---

## Frontend Components

### Core Components

#### BookCard Component

Displays book information in a card format with admin and student variants.

```typescript
interface BookCardProps {
  book: Book;
  categories: Category[];
  showAdminActions?: boolean;
}

export function BookCard({ book, categories, showAdminActions }: BookCardProps);
```

##### Features:
- Responsive card layout
- Thumbnail display with fallback
- Bookmark functionality (student view)
- Admin actions (edit/delete for admin view)
- Category badge and download count
- Hover animations

##### Example Usage:

```typescript
// Student view
<BookCard book={book} categories={categories} />

// Admin view with actions
<BookCard book={book} categories={categories} showAdminActions={true} />
```

#### BookmarkButton Component

Interactive bookmark toggle button with loading states and animations.

```typescript
interface BookmarkButtonProps {
  bookId: number;
  isBookmarked: boolean;
  variant?: 'default' | 'card' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function BookmarkButton(props: BookmarkButtonProps);
```

##### Features:
- Multiple visual variants
- Loading states with spinner
- Toast notifications
- Optimistic UI updates
- Prevents event bubbling

##### Example Usage:

```typescript
// Card overlay variant
<BookmarkButton 
  bookId={book.id} 
  isBookmarked={isBookmarked} 
  variant="card" 
/>

// Default button variant
<BookmarkButton 
  bookId={book.id} 
  isBookmarked={isBookmarked} 
  variant="default" 
  size="lg"
/>
```

#### AppHeader Component

Main navigation header with user menu, search, and responsive design.

```typescript
export function AppHeader();
```

##### Features:
- Responsive navigation
- User profile dropdown
- Search functionality
- Breadcrumb navigation
- Theme toggle integration

#### AppSidebar Component

Collapsible sidebar navigation with role-based menu items.

```typescript
export function AppSidebar();
```

##### Features:
- Role-based navigation items
- Collapsible/expandable
- Active state highlighting
- Permission-based visibility

### UI Components

The project uses shadcn/ui components for consistent design. Key components include:

#### Button Component

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

export function Button(props: ButtonProps);
```

#### Card Component

```typescript
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>);
export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>);
export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>);
export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>);
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>);
export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>);
```

#### Form Components

```typescript
// Input
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>);

// Textarea
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>);

// Select
export function Select({ children, ...props }: SelectProps);
export function SelectContent({ children, ...props }: SelectContentProps);
export function SelectItem({ children, ...props }: SelectItemProps);
export function SelectTrigger({ children, ...props }: SelectTriggerProps);
export function SelectValue(props: SelectValueProps);
```

#### Dialog Components

```typescript
export function Dialog({ children, ...props }: DialogProps);
export function DialogTrigger({ children, ...props }: DialogTriggerProps);
export function DialogContent({ children, ...props }: DialogContentProps);
export function DialogHeader({ children, ...props }: DialogHeaderProps);
export function DialogTitle({ children, ...props }: DialogTitleProps);
export function DialogDescription({ children, ...props }: DialogDescriptionProps);
export function DialogFooter({ children, ...props }: DialogFooterProps);
```

### TypeScript Interfaces

#### Core Data Types

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  roles?: Role[];
}

interface Book {
  id: number;
  title: string;
  author: string;
  description: string | null;
  isbn: string | null;
  cover_image_url: string;
  cover_image_public_id: string | null;
  ebook_url: string | null;
  ebook_public_id: string | null;
  category?: Category;
  publisher: string | null;
  published_year: string | null;
  pages: number | null;
  language: string | null;
  download_count: number;
  views_count: number;
  created_at: string;
  updated_at: string;
  bookmarks?: Bookmark[];
  ratings?: Rating[];
}

interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  created_at: string;
  updated_at: string;
  books_count?: number;
}

interface Bookmark {
  id: number;
  user_id: number;
  book_id: number;
  created_at: string;
  updated_at: string;
}

interface Rating {
  id: number;
  user_id: number;
  book_id: number;
  rating: number;
  review?: string | null;
  created_at: string;
  updated_at: string;
}
```

#### Pagination Types

```typescript
interface Paginated<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

interface PaginatedResponse<T> {
  data: T[];
  links: PaginatedLink[];
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
  path: string;
}
```

#### Navigation Types

```typescript
interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon | null;
  isActive?: boolean;
  permission?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface BreadcrumbItem {
  title: string;
  href: string;
}
```

#### Authentication Types

```typescript
interface Auth {
  user: User | null;
  roles: string[];
  permissions: string[];
}

interface SharedData {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  ziggy: Config & { location: string };
  sidebarOpen: boolean;
  [key: string]: unknown;
}
```

### Hooks & Utilities

#### Custom Hooks

```typescript
// Example custom hook for API calls
function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  const addBookmark = async (bookId: number) => {
    // Implementation
  };

  const removeBookmark = async (bookId: number) => {
    // Implementation
  };

  return { bookmarks, loading, addBookmark, removeBookmark };
}
```

#### Utility Functions

```typescript
// cn - Tailwind CSS class merger
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## Usage Examples

### Creating a New Book (Admin)

```typescript
// 1. Frontend form submission
const handleSubmit = async (formData: BookFormData) => {
  const form = new FormData();
  
  // Add text fields
  Object.entries(formData).forEach(([key, value]) => {
    if (key !== 'ebook' && value) {
      form.append(key, value.toString());
    }
  });
  
  // Add file
  if (formData.ebook) {
    form.append('ebook', formData.ebook);
  }

  try {
    const response = await fetch('/admin/books', {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: form
    });

    if (response.ok) {
      // Success handling
      toast.success('Book created successfully');
      // Redirect or update UI
    } else {
      // Error handling
      const errors = await response.json();
      handleValidationErrors(errors);
    }
  } catch (error) {
    toast.error('Network error occurred');
  }
};
```

### Browsing Books with Filters (Student)

```typescript
// 1. Component with filtering
function BookBrowser() {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    page: 1
  });

  const { data: books, loading } = usePage().props.books as Paginated<Book>;

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updated = { ...filters, ...newFilters, page: 1 };
    setFilters(updated);
    
    // Update URL and fetch new data
    router.get('/student/books', updated, {
      preserveState: true,
      preserveScroll: true
    });
  };

  return (
    <div>
      <BookFilter filters={filters} onFiltersChange={updateFilters} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.data.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      <AppPagination links={books.links} />
    </div>
  );
}
```

### Managing Bookmarks

```typescript
// 1. Bookmark context/hook
const useBookmarkManager = () => {
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());

  const toggleBookmark = async (bookId: number) => {
    const isBookmarked = bookmarks.has(bookId);
    
    try {
      const response = await fetch(
        `/student/bookmarks`,
        {
          method: isBookmarked ? 'DELETE' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
          },
          body: JSON.stringify({ book_id: bookId }),
        }
      );

      if (response.ok) {
        setBookmarks(prev => {
          const newSet = new Set(prev);
          if (isBookmarked) {
            newSet.delete(bookId);
          } else {
            newSet.add(bookId);
          }
          return newSet;
        });
        
        toast.success(isBookmarked ? 'Bookmark removed' : 'Bookmark added');
      }
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  return { bookmarks, toggleBookmark };
};
```

### File Upload with Progress

```typescript
// Enhanced file upload with progress tracking
const uploadBookFile = async (file: File, onProgress?: (progress: number) => void) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('ebook', file);

    // Track upload progress
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = (e.loaded / e.total) * 100;
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    xhr.open('POST', '/admin/books');
    xhr.setRequestHeader('X-CSRF-TOKEN', csrfToken);
    xhr.send(formData);
  });
};
```

---

## Best Practices

### Backend Development

#### 1. Controller Organization
- Use Resource Controllers for CRUD operations
- Implement proper validation using Form Requests
- Keep controllers thin, move business logic to Services
- Use appropriate HTTP status codes

#### 2. Model Relationships
- Always define inverse relationships
- Use eager loading to prevent N+1 queries
- Implement query scopes for reusable logic
- Use proper casting for data types

#### 3. API Responses
- Return consistent JSON structures
- Include proper error messages
- Use HTTP status codes correctly
- Implement pagination for lists

#### 4. Security
- Validate all inputs
- Use middleware for authorization
- Sanitize file uploads
- Implement CSRF protection

### Frontend Development

#### 1. Component Structure
- Keep components focused and reusable
- Use TypeScript interfaces for all props
- Implement proper error boundaries
- Use meaningful component names

#### 2. State Management
- Use local state for component-specific data
- Implement optimistic updates for better UX
- Handle loading and error states
- Use proper data fetching patterns

#### 3. Performance
- Implement lazy loading for images
- Use React.memo for expensive components
- Debounce search inputs
- Implement proper pagination

#### 4. Accessibility
- Use semantic HTML elements
- Implement proper ARIA labels
- Ensure keyboard navigation
- Maintain color contrast ratios

### Error Handling

#### Backend Error Responses

```php
// Validation errors
return response()->json([
    'message' => 'The given data was invalid.',
    'errors' => [
        'email' => ['The email field is required.']
    ]
], 422);

// General errors
return response()->json([
    'message' => 'An error occurred',
    'error' => $exception->getMessage()
], 500);
```

#### Frontend Error Handling

```typescript
// API call with error handling
const handleApiCall = async () => {
  try {
    setLoading(true);
    const response = await fetch('/api/endpoint');
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'An error occurred');
    }
    
    const data = await response.json();
    setData(data);
  } catch (error) {
    console.error('API Error:', error);
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};
```

### Testing Guidelines

#### Backend Testing

```php
// Feature test example
public function test_admin_can_create_book()
{
    $admin = User::factory()->create();
    $admin->assignRole('admin');
    
    $category = Category::factory()->create();
    
    $response = $this->actingAs($admin)
        ->post('/admin/books', [
            'title' => 'Test Book',
            'author' => 'Test Author',
            'category_id' => $category->id,
            'ebook' => UploadedFile::fake()->create('book.pdf', 1000, 'application/pdf')
        ]);
    
    $response->assertRedirect();
    $this->assertDatabaseHas('books', ['title' => 'Test Book']);
}
```

#### Frontend Testing

```typescript
// Component test example
import { render, screen, fireEvent } from '@testing-library/react';
import { BookmarkButton } from '@/components/bookmark-button';

test('bookmark button toggles correctly', async () => {
  render(<BookmarkButton bookId={1} isBookmarked={false} />);
  
  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
  
  fireEvent.click(button);
  
  // Test API call and state change
  await waitFor(() => {
    expect(screen.getByText('Added to bookmarks')).toBeInTheDocument();
  });
});
```

This documentation provides a comprehensive overview of all public APIs, functions, and components in the E-Library System, with practical examples and best practices for development.