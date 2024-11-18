# Twitter Image Similarity Checker

## Description
A Chrome extension that blurs Twitter images and uses AWS Rekognition to compare them against a reference image, revealing only images that don't match.

## Features
- Automatically detects Twitter media images
- Uses AWS Rekognition for face comparison
- Dynamically blurs and unblurs images based on similarity

## Prerequisites
- AWS Account
- AWS Rekognition access
- Chrome Browser

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/oktayla/twitter-image-checker.git
cd twitter-image-checker
```

### 2. Configuration
1. Copy `config.example.js` to `config.js`
2. Fill in your AWS credentials in `config.js`
3. Add reference image URL in `config.js`

### 3. Load as Chrome Extension
1. Open Chrome Extensions (chrome://extensions/)
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the extension directory

## Dependencies
- AWS SDK
- Modern browser supporting ES6 async/await

## Limitations
- Requires active AWS Rekognition subscription
- Performance depends on AWS API response time
- Works only with Twitter image URLs

## Contributing
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create pull request

## Troubleshooting
- Ensure AWS credentials are valid
- Check browser console for errors
- Verify network connectivity
