require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 4000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_ID = process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest';

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-vercel-app.vercel.app'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|png|jpg|jpeg/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF and image files (PNG, JPG, JPEG) are allowed!'));
        }
    }
});

// Extract text from PDF
async function extractTextFromPDF(filePath) {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text;
    } catch (error) {
        throw new Error('Failed to extract text from PDF: ' + error.message);
    }
}

// Extract text from image using OCR
async function extractTextFromImage(filePath) {
    try {
        const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
            logger: info => console.log(info)
        });
        return text;
    } catch (error) {
        throw new Error('Failed to extract text from image: ' + error.message);
    }
}

// Generate summary using Gemini AI
async function generateSummary(text, summaryLength = 'medium') {
    try {
        const model = genAI.getGenerativeModel({ model: MODEL_ID });
        
        let prompt = '';
        switch (summaryLength) {
            case 'short':
                prompt = `Please provide a concise summary of the following text in 3-4 lines, highlighting only the most critical points:\n\n${text}`;
                break;
            case 'medium':
                prompt = `Please provide a comprehensive summary of the following text in 5-8 lines, covering the main ideas and key insights:\n\n${text}`;
                break;
            case 'long':
                prompt = `Please provide a detailed summary of the following text in 3 well-structured paragraphs, covering all major points, insights, and conclusions:\n\n${text}`;
                break;
            default:
                prompt = `Please provide a summary of the following text:\n\n${text}`;
        }
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();
        
        // Generate key points
        const keyPointsPrompt = `Extract 5-7 key points or main ideas from the following text as a bullet list:\n\n${text}`;
        const keyPointsResult = await model.generateContent(keyPointsPrompt);
        const keyPointsResponse = await keyPointsResult.response;
        const keyPoints = keyPointsResponse.text();
        
        return { summary, keyPoints };
    } catch (error) {
        throw new Error('Failed to generate summary: ' + error.message);
    }
}

// API Routes
app.get('/', (req, res) => {
    res.send('Welcome to Document Summary Assistant API');
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const summaryLength = req.body.summaryLength || 'medium';
        const filePath = req.file.path;
        const fileExtension = path.extname(req.file.originalname).toLowerCase();
        
        let extractedText = '';
        
        // Extract text based on file type
        if (fileExtension === '.pdf') {
            console.log('Processing PDF file...');
            extractedText = await extractTextFromPDF(filePath);
        } else if (['.png', '.jpg', '.jpeg'].includes(fileExtension)) {
            console.log('Processing image file with OCR...');
            extractedText = await extractTextFromImage(filePath);
        } else {
            // Clean up uploaded file
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: 'Unsupported file format' });
        }
        
        // Check if text was extracted
        if (!extractedText || extractedText.trim().length === 0) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: 'No text could be extracted from the document' });
        }
        
        console.log(`Extracted ${extractedText.length} characters of text`);
        
        // Generate summary using Gemini AI
        console.log('Generating summary with Gemini AI...');
        const { summary, keyPoints } = await generateSummary(extractedText, summaryLength);
        
        // Clean up uploaded file
        fs.unlinkSync(filePath);
        
        // Send response
        res.json({
            success: true,
            data: {
                summary,
                keyPoints,
                meta: {
                    fileName: req.file.originalname,
                    fileSize: req.file.size,
                    fileType: fileExtension,
                    textLength: extractedText.length,
                    summaryLength: summaryLength,
                    processedAt: new Date().toISOString()
                }
            }
        });
        
    } catch (error) {
        console.error('Error processing file:', error);
        
        // Clean up file if it exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({
            success: false,
            error: error.message || 'An error occurred while processing the file'
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File is too large. Maximum size is 50MB.' });
        }
        return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message || 'Internal server error' });
});

app.listen(port, () => {
    console.log(`Document Summary Assistant API running on http://localhost:${port}`);
    // console.log(`Upload endpoint: POST http://localhost:${port}/api/upload`);
});
