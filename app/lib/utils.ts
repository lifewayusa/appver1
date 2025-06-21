// Utility functions for the app

// Get a consistent image for better hydration
export const getRandomImage = (folder: 'hero' | 'cities' | 'extra' | 'basic', seed?: string) => {
  const imageMap = {
    hero: [
      '/images/hero/home-hero-mobile.webp',
      '/images/hero/image.webp',
      '/images/samuel-yongbo-kwon-F4bA_QiMK6U-unsplash-min.jpg',
      '/images/richard-sagredo-FDJi2t7VWy0-unsplash-min.jpg',
      '/images/noor-vasquez-photo-6pXtLvo-lXs-unsplash-min.jpg',
      '/images/javier-gonzalez-fotografo-ScnyD7znFTk-unsplash-min.jpg'
    ],
    cities: [
      '/images/cities/city1.webp',
      '/images/cities/atlanta.jpg',
      '/images/cities/austin.jpg',
      '/images/cities/boston.jpg',
      '/images/cities/chicago.jpg'
    ],
    extra: [
      '/images/arto-suraj-VTDd6VP7Dps-unsplash-min.jpg',
      '/images/daria-trofimova--c_Slf2pWtk-unsplash-min.jpg',
      '/images/derek-owens-cmzlFICyL6Y-unsplash-min.jpg',
      '/images/dmitry-rodionov-3NeRr1t1wwc-unsplash-min.jpg'
    ],
    basic: [
      '/images/basic/city1.webp',
      '/images/basic/opportunity.webp',
      '/images/basic/security.webp',
      '/images/basic/quality.webp'
    ]
  }
  
  const images = imageMap[folder]
  
  // Use first image by default for SSR consistency
  if (typeof window === 'undefined') {
    return images[0]
  }
  
  // Use seed for consistent selection if provided
  if (seed) {
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return images[Math.abs(hash) % images.length]
  }
  
  return images[Math.floor(Math.random() * images.length)]
}

// Format currency to USD
export const formatUSD = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

// Format number with commas
export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num)
}
