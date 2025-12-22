import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GoldMeter - Daily India Gold Prices',
    short_name: 'GoldMeter',
    description: 'Track live 22K & 24K gold prices across Indian cities, compare trends, and calculate jewellery costs.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fffdf7',
    theme_color: '#d97706',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}

