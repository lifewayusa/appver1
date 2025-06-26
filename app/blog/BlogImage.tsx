'use client'

import Image from 'next/image'

interface BlogImageProps {
  slug: string
  title: string
  className?: string
}

export default function BlogImage({ slug, title, className = '' }: BlogImageProps) {
  return (
    <Image
      src={`/images/blog/${slug}.jpg`}
      alt={title}
      fill
      className={`object-cover ${className}`}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}
