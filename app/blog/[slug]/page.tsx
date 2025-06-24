"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { getBlogPostBySlug } from "../../lib/blog";
import TemplatePages from "../../components/TemplatePages";
import Image from "next/image";
import { Calendar, User, Clock, Tag } from "lucide-react";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      const data = await getBlogPostBySlug(slug);
      if (!data) {
        notFound();
        return;
      }
      setPost(data);
      setLoading(false);
    }
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <TemplatePages
      title={post.title}
      subtitle={post.summary}
      heroImages={post.cover_image_url ? [post.cover_image_url] : undefined}
    >
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="flex items-center gap-4 text-gray-500 text-sm mb-6">
          <User className="w-4 h-4" /> <span>{post.author_name}</span>
          <Calendar className="w-4 h-4 ml-4" /> <span>{post.published_at ? new Date(post.published_at).toLocaleDateString("pt-BR") : ""}</span>
          <Clock className="w-4 h-4 ml-4" /> <span>{post.read_time} min</span>
        </div>
        {post.cover_image_url && (
          <div className="mb-8 rounded-xl overflow-hidden shadow">
            <Image src={post.cover_image_url} alt={post.title} width={800} height={400} className="object-cover w-full h-64" />
          </div>
        )}
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content_html || post.content }} />
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag: any) => (
              <span key={tag.id} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                <Tag className="w-2 h-2 mr-1" />
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </TemplatePages>
  );
}
