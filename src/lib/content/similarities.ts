/**
 * Similarity-based post retrieval utilities
 * Computes similarity dynamically based on categories and tags at build/runtime
 */

import type { BlogPost } from "@/types/blog";

interface SimilarPost {
  slug: string;
  title: string;
  similarity: number;
}

/**
 * Calculate Jaccard similarity coefficient between two sets
 */
function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 0;
  
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  
  return intersection.size / union.size;
}

/**
 * Extract features from a post for similarity calculation
 */
function extractFeatures(post: BlogPost): Set<string> {
  const features = new Set<string>();
  
  // Add tags with prefix
  const tags = post.data.tags ?? [];
  for (const tag of tags) {
    features.add(`tag:${tag.toLowerCase()}`);
  }
  
  // Add categories with prefix
  const categories = post.data.categories ?? [];
  for (const cat of categories) {
    if (Array.isArray(cat)) {
      // Nested categories like ['笔记', '前端']
      for (const c of cat) {
        features.add(`cat:${c.toLowerCase()}`);
      }
    } else {
      features.add(`cat:${cat.toLowerCase()}`);
    }
  }
  
  return features;
}

/**
 * Calculate similarity score between two posts
 * Uses weighted combination of tag and category similarity
 */
function calculateSimilarity(postA: BlogPost, postB: BlogPost): number {
  const featuresA = extractFeatures(postA);
  const featuresB = extractFeatures(postB);
  
  // Calculate Jaccard similarity
  const similarity = jaccardSimilarity(featuresA, featuresB);
  
  return Math.round(similarity * 1000) / 1000; // Round to 3 decimal places
}

/**
 * Get related posts with full post data
 * Computes similarity dynamically based on tags and categories
 * @param currentPost Current post
 * @param allPosts All available posts
 * @param count Number of related posts to return
 * @returns Array of BlogPost objects sorted by similarity
 */
export function getRelatedPosts(currentPost: BlogPost, allPosts: BlogPost[], count: number = 5): BlogPost[] {
  try {
    const currentSlug = currentPost.data.link ?? currentPost.id;
    
    // Calculate similarity for all other posts
    const similarities: Array<{ post: BlogPost; similarity: number }> = [];
    
    for (const post of allPosts) {
      const postSlug = post.data.link ?? post.id;
      if (postSlug === currentSlug) continue; // Skip current post
      
      const similarity = calculateSimilarity(currentPost, post);
      if (similarity > 0) {
        similarities.push({ post, similarity });
      }
    }
    
    // Sort by similarity (descending) and return top N
    similarities.sort((a, b) => b.similarity - a.similarity);
    
    return similarities.slice(0, count).map(item => item.post);
  } catch (error) {
    console.warn("Failed to get related posts:", error);
    return [];
  }
}

/**
 * Get related post slugs for a given post (for backward compatibility)
 * @param currentSlug Current post's slug
 * @param allPosts All available posts
 * @param count Number of related posts to return
 * @returns Array of similar post data with similarity scores
 */
export function getRelatedPostSlugs(
  currentSlug: string, 
  allPosts: BlogPost[], 
  count: number = 5
): SimilarPost[] {
  // Find current post
  const currentPost = allPosts.find(p => 
    (p.data.link ?? p.id).toLowerCase() === currentSlug.toLowerCase()
  );
  
  if (!currentPost) return [];
  
  const relatedPosts = getRelatedPosts(currentPost, allPosts, count);
  
  return relatedPosts.map(post => ({
    slug: post.data.link ?? post.id,
    title: post.data.title,
    similarity: calculateSimilarity(currentPost, post),
  }));
}

/**
 * Check if similarity computation is available (always true for dynamic computation)
 */
export function hasSimilarityData(): boolean {
  return true;
}
