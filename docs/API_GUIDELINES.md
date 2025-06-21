# API Providers - Exact Rate Limits & Guidelines

## 🔑 PEXELS API
- **Rate Limit**: 200 requests/hour (3.33 req/min)
- **Delay Required**: 18 seconds between requests
- **Free Tier**: 200 images/month
- **Image Quality**: High resolution available
- **Terms**: Commercial use allowed with attribution

## 🔑 UNSPLASH API  
- **Rate Limit**: 50 requests/hour (0.83 req/min)
- **Delay Required**: 72 seconds between requests
- **Free Tier**: 50 requests/hour
- **Image Quality**: Highest quality
- **Terms**: Free for commercial use

## 🔑 PIXABAY API
- **Rate Limit**: 100 requests/hour (1.67 req/min) 
- **Delay Required**: 36 seconds between requests
- **Free Tier**: 100 images/hour
- **Image Quality**: Various sizes
- **Terms**: Commercial use allowed

## 📊 OPTIMAL STRATEGY
- **Primary**: Pexels (fastest at 18s intervals)
- **Secondary**: Pixabay (36s intervals)
- **Fallback**: Unsplash (72s intervals)

## ⏱️ TIME ESTIMATES
- **200 cities with Pexels**: 200 × 18s = 60 minutes
- **4544 remaining**: Will use all APIs in rotation
