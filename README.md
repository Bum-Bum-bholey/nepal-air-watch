## 🚀 Quick Start

This project now includes a **backend server** with multiple air quality APIs!

### Fast Setup (5 minutes)

**1. Backend Setup:**
```bash
cd backend
npm install
copy env.example.txt .env   # Windows
# cp env.example.txt .env   # Mac/Linux

# Edit .env and add API keys (optional - Open-Meteo works without keys)
npm run dev
```

**2. Frontend Setup (new terminal):**
```bash
cd ..
npm install
npm run dev
```

**3. Open browser:**
Navigate to http://localhost:5173

✅ **Done!** Your air quality app is running with real data.

### 📚 Documentation

- `QUICK_START.md` - 5-minute setup guide
- `SETUP_GUIDE.md` - Complete setup with all options
- `CORS_SOLUTION.md` - Technical details about CORS handling

### 🔑 API Keys (Optional but Recommended)

**OpenWeatherMap** (Best results):
1. Sign up: https://openweathermap.org/api
2. Get free API key
3. Add to `backend/.env`: `OPENWEATHER_API_KEY=your_key`

**WAQI** (Optional):
1. Sign up: https://aqicn.org/api/
2. Get free token
3. Add to `backend/.env`: `WAQI_API_TOKEN=your_token`

*Note: Open-Meteo works without any API keys!*

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## ✨ Features

- ✅ **Real-time air quality data** from multiple providers
- ✅ **Multiple API providers** with automatic fallback (OpenWeatherMap, WAQI, Open-Meteo, OpenAQ)
- ✅ **No CORS issues** (backend handles API calls)
- ✅ **Auto-refresh** every 5 minutes
- ✅ **Weather data** (temperature, humidity, wind speed)
- ✅ **All Nepal cities** and districts
- ✅ **Health recommendations** based on AQI
- ✅ **Interactive map** with province overview
- ✅ **School safety alerts** with activity guidelines

## 🏗️ Technologies

**Frontend:**
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Query
- React Router

**Backend:**
- Express.js
- Node.js
- Multiple API integrations
- Automatic provider fallback

## 📖 Project Structure

```
nepal-air-watch/
├── backend/           # Express.js server
│   ├── server.js     # Main server
│   ├── routes/       # API routes
│   └── services/     # API providers
├── src/              # React frontend
│   ├── pages/        # Page components
│   ├── components/   # UI components
│   └── lib/          # API client, data, types
└── package.json      # Frontend dependencies
```

## 🎯 How It Works

1. Frontend calls backend API
2. Backend tries multiple providers in order:
   - OpenWeatherMap (primary)
   - WAQI (secondary)
   - Open-Meteo (tertiary)
   - OpenAQ (fallback)
3. First successful provider returns data
4. Frontend displays real-time air quality

## 📚 Full Documentation

For complete setup instructions, API configuration, and deployment guide, see:
- `QUICK_START.md` - Get started in 5 minutes
- `SETUP_GUIDE.md` - Complete setup with all options
- `backend/README.md` - Backend API documentation

