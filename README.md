# 🐕 Dog Breed Viewer

A beautiful, responsive React application for exploring dog breeds and viewing stunning photos from the Dog CEO API.

## 🌐 Live Demo

**[View Live App](https://dog-breed-viewer.vercel.app/)**

## ✨ Features

### Core Features
- 🐾 **Browse 100+ Dog Breeds** - Explore a comprehensive list of dog breeds
- 🖼️ **Beautiful Photo Gallery** - View 3 random high-quality images per breed
- 🔍 **Real-time Search** - Find breeds instantly with 200ms debounced search
- 📱 **Fully Responsive** - Perfect experience on mobile, tablet, and desktop
- ⚡ **Fast Loading** - Optimized performance with loading states
- 🛡️ **Error Handling** - Graceful error recovery with retry functionality

### Advanced Features
- 🗄️ **Smart Caching** - 5-minute breed list cache for improved performance
- 🔄 **Rate Limit Handling** - Exponential backoff retry logic for API failures
- 🔐 **Optional Authentication** - Sign in with DummyJSON for enhanced features
- ⚠️ **Image Issue Detection** - Visual warnings for breeds with broken images
- 🧪 **Unit Tests** - Comprehensive testing with Vitest
- 🎨 **Custom Typography** - Beautiful Caveat font for headers

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Testing**: Vitest + React Testing Library
- **API**: Dog CEO API + DummyJSON (auth)
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dog-breed-viewer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm test             # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:coverage # Run tests with coverage

# Code Quality
npm run lint         # Run ESLint
```

## 🎮 How to Use

### Getting Started
1. **Welcome Screen** - The app starts with an optional login screen
2. **Continue Without Signing In** - Click to access the main app immediately
3. **Browse Breeds** - Use the sidebar to search and select dog breeds
4. **View Photos** - See 3 beautiful random photos for each selected breed

### Authentication (Optional)
- **Demo Credentials**: 
  - Username: `emilys`
  - Password: `emilyspass`
- **Features**: User profile display and session persistence
- **Source**: Powered by [DummyJSON](https://dummyjson.com/)

### Pro Tips
- 🔍 **Search**: Type in the breed search box for instant filtering
- 🖱️ **Image Hover**: Hover over images to see "View Full Size" option
- ⚠️ **Warnings**: Look for warning icons next to breeds with image issues
- 🔧 **API Testing**: Use the "Test API Endpoints" button in the footer
- 🎯 **Console**: Check browser console for a cool welcome message!

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── BreedSelector.tsx   # Searchable breed list
│   ├── ImageGrid.tsx       # Photo gallery
│   ├── LoginForm.tsx       # Authentication form
│   ├── UserProfile.tsx     # User info display
│   ├── ErrorBanner.tsx     # Error handling
│   └── Loader.tsx          # Loading spinner
├── hooks/              # Custom React hooks
│   └── useDebounce.ts     # 200ms search debounce
├── services/           # API integration
│   ├── dogApi.ts          # Dog CEO API + caching
│   └── authApi.ts         # DummyJSON authentication
├── store/              # Zustand state management
│   ├── dogStore.ts        # Main app state
│   └── authStore.ts       # Authentication state
├── types/              # TypeScript definitions
│   ├── dog.ts             # App-related types
│   └── auth.ts            # Auth-related types
├── utils/              # Utility functions
│   └── http.ts            # HTTP client with retry logic
└── test/               # Test configuration
    └── setup.ts           # Test environment setup
```

## 🌟 Key Implementation Details

### Caching Strategy
- **Breed List**: Cached for 5 minutes to reduce API calls
- **Smart Invalidation**: Cache cleared on errors for data freshness

### Error Handling
- **Retry Logic**: Exponential backoff for failed requests
- **User Feedback**: Clear error messages with retry options
- **Graceful Degradation**: App continues working despite API issues

### Performance Optimizations
- **Debounced Search**: 200ms delay prevents excessive API calls
- **Loading States**: Multiple granular loading indicators
- **Image Optimization**: Proper loading and error states per image

### Accessibility
- **Semantic HTML**: Proper heading structure and landmarks
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: ARIA labels and descriptions
- **Color Contrast**: WCAG compliant color scheme

## 🧪 Testing

The project includes comprehensive unit tests:

```bash
# Run all tests
npm test

# Run specific test file
npm test useDebounce

# Generate coverage report
npm run test:coverage
```

**Test Coverage**:
- ✅ Custom hooks (useDebounce)
- ✅ Utility functions (HTTP client)
- ✅ Component rendering
- ✅ User interactions

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the Vite configuration
3. Deploy with zero configuration needed

### Manual Build
```bash
npm run build
# Deploy the 'dist' folder to your hosting provider
```

## 🔗 API Endpoints

### Dog CEO API
- **Breeds List**: `https://dog.ceo/api/breeds/list/all`
- **Random Images**: `https://dog.ceo/api/breed/{breed}/images/random/3`

### DummyJSON (Authentication)
- **Login**: `https://dummyjson.com/auth/login`
- **User Info**: `https://dummyjson.com/auth/me`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **[Dog CEO API](https://dog.ceo/dog-api/)** - For providing the amazing dog breed data and images
- **[DummyJSON](https://dummyjson.com/)** - For the authentication API
- **[Tailwind CSS](https://tailwindcss.com/)** - For the beautiful styling system
- **[Zustand](https://github.com/pmndrs/zustand)** - For simple and effective state management

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
