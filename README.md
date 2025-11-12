# Document Summary Assistant (DSA)

A modern, AI-powered web application that extracts text from documents and generates intelligent summaries using Google's Gemini AI. Built with React, Node.js, and Tailwind CSS.

## 🚀 Features

- **📄 Multi-Format Support**: Upload PDF files and images (PNG, JPG, JPEG)
- **🤖 AI-Powered Summaries**: Generate intelligent summaries using Google Gemini AI
- **📋 Key Points Extraction**: Automatically identify and highlight important points
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **💾 Export Functionality**: Download summaries as text files
- **🎨 Modern UI**: Beautiful gradient design with smooth animations
- **⚡ Fast Processing**: Efficient text extraction with OCR support for images

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Tailwind CSS** - Styling and responsive design
- **Lucide React** - Modern icon library
- **Axios** - HTTP client for API calls
- **Styled Components** - Custom animated components

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Multer** - File upload handling
- **pdf-parse** - PDF text extraction
- **Tesseract.js** - OCR for image text extraction
- **Google Generative AI** - AI-powered text summarization

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd DSA
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=4000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Get Google Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file


### Environment Security
**Important:** Before pushing, ensure your `.env` file is not tracked:

```bash
# Check if .env is in .gitignore
cat backend/.gitignore

# If not present, add it:
echo ".env" >> backend/.gitignore
git add backend/.gitignore
git commit -m "Add .env to gitignore for security"
```

### Deployment Considerations
- Never commit API keys or sensitive data
- Use `.env.example` for environment variable templates
- Consider using environment variables in production
- Update README with your actual repository URL


## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm start
# or for development with auto-reload
npm run dev
```
Backend will run on `http://localhost:4000`

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

## 📖 Usage

1. **Upload Document**: Drag and drop or click to select a PDF or image file
2. **Choose Summary Length**: Select from Short (3-4 lines), Medium (5-8 lines), or Long (3 paragraphs)
3. **View Results**: Summary appears in a popup modal with:
   - Document information (file name, size, type, processing time)
   - AI-generated summary
   - Key points extraction
4. **Download**: Export the complete summary as a text file
5. **New Document**: Close modal and upload another document

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | 4000 |
| `NODE_ENV` | Environment mode | development |
| `GEMINI_API_KEY` | Google Gemini API key | Required |
| `GEMINI_MODEL` | Gemini model name | gemini-2.0-flash |

### Supported File Types
- **PDFs**: `.pdf`
- **Images**: `.png`, `.jpg`, `.jpeg`

### File Size Limits
- Maximum file size: 10MB
- Recommended for optimal performance: Under 5MB

## 🏗️ Project Structure

```
DSA/
├── backend/
│   ├── server.js              # Main server file
│   ├── package.json           # Backend dependencies
│   ├── .env                   # Environment variables
│   └── .env.example           # Environment template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUploader.jsx    # File upload component
│   │   │   ├── SummaryModal.jsx    # Summary popup modal
│   │   │   └── Loader.jsx          # Custom loading animation
│   │   ├── App.jsx            # Main application component
│   │   ├── App.css            # Global styles
│   │   └── index.js           # React entry point
│   ├── public/                # Static assets
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Vite configuration
├── README.md                  # Project documentation
├── install-all.bat           # Windows installation script
├── start-backend.bat         # Windows backend start script
└── start-frontend.bat        # Windows frontend start script
```


## 🎨 UI Components

### FileUploader
- Drag-and-drop file upload
- File type validation
- Summary length selection
- Custom loading animation

### SummaryModal
- Popup modal display
- Document information panel
- Formatted summary with paragraphs
- Numbered key points list
- Download functionality
- Responsive design

### Custom Loader
- Animated loading bars
- Bouncing ball animation
- Styled with styled-components
