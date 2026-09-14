import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Clear Blue Dispatch',
    short_name: 'ClearBlue',
    description: 'Delivery and docket management for Clear Blue Solutions',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2c4b9c',
    icons: [
      {
        src: '/icons/logo-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/logo-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}