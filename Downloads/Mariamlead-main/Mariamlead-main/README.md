# Mariam Lead Generation Platform

A modern React application for generating business leads using AI.

## Features

- 🎯 AI-powered lead generation using DeepSeek via OpenRouter
- 📊 Real-time progress tracking
- 💾 Local data persistence with browser storage
- 📥 CSV export functionality
- 🎨 Modern UI with Tailwind CSS

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenRouter API key (from https://openrouter.ai/)

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:5173

### Netlify Deployment

1. **Deploy to Netlify:**
   - Connect your GitHub repository to Netlify
   - Netlify will automatically detect the `netlify.toml` configuration

2. **Set Environment Variables:**
   In your Netlify dashboard, go to Site Settings > Environment Variables and add:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

3. **Deploy:**
   - Push your code to GitHub
   - Netlify will automatically build and deploy
   - Your site will be available at `https://your-site-name.netlify.app`

### Local Netlify Development

To test Netlify functions locally:

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Set environment variable:
   ```bash
   export OPENROUTER_API_KEY=your_api_key
   ```

3. Run with Netlify dev:
   ```bash
   netlify dev
   ```

4. Open http://localhost:8888

## How It Works

1. **Lead Generation:** Uses DeepSeek AI model via OpenRouter to generate realistic business leads
2. **Data Storage:** All data is stored locally in the browser using localStorage
3. **Batch Processing:** Leads are generated in configurable batches
4. **Duplicate Prevention:** Automatically removes duplicate leads
5. **Export:** Download leads as CSV files

## API

### Generate Leads Function

**Endpoint:** `/.netlify/functions/generate-leads`

**Method:** POST

**Body:**
```json
{
  "location": "New York, NY",
  "industry": "Restaurant",
  "batchSize": 10,
  "existingLeads": [
    {"business_name": "Existing Business", "phone_contact": "+1-555-0000"}
  ]
}
```

**Response:**
```json
{
  "leads": [
    {
      "business_name": "Sample Restaurant",
      "phone_contact": "+1-555-1234"
    }
  ]
}
```

## Security

- API keys are stored securely on the server-side (Netlify functions)
- No sensitive data is exposed to the client
- CORS is properly configured

## Technologies

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Netlify Functions (Node.js)
- **AI:** DeepSeek via OpenRouter API
- **Storage:** Browser localStorage

## License

MIT License
