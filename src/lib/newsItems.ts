/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from "./supabaseClient";

const TABLE = "news_items";

export interface NewsItem {
  slug: string;
  title_fr: string;
  title_en: string;
  short_description_fr: string;
  short_description_en: string;
  full_description_fr: string;
  full_description_en: string;
  folder: string;
  images: string[];
  video_url: string | null;
  published: boolean;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export type NewsItemInput = Omit<NewsItem, "created_at" | "updated_at">;

export async function fetchPublishedNewsItems(): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("published", true)
    .order("order_index", { ascending: true });
  if (error) throw error;
  return (data ?? []) as NewsItem[];
}

export async function fetchAllNewsItems(): Promise<NewsItem[]> {
  const { data, error } = await supabase.from(TABLE).select("*").order("order_index", { ascending: true });
  if (error) throw error;
  return (data ?? []) as NewsItem[];
}

export async function fetchPublishedNewsItemBySlug(slug: string): Promise<NewsItem | null> {
  const { data, error } = await supabase.from(TABLE).select("*").eq("slug", slug).eq("published", true).maybeSingle();
  if (error) throw error;
  return data as NewsItem | null;
}

export async function fetchNewsItemBySlug(slug: string): Promise<NewsItem | null> {
  const { data, error } = await supabase.from(TABLE).select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data as NewsItem | null;
}

export async function createNewsItem(item: NewsItemInput): Promise<void> {
  const { error } = await supabase.from(TABLE).insert(item);
  if (error) throw error;
}

export async function updateNewsItem(originalSlug: string, item: NewsItemInput): Promise<void> {
  const { error } = await supabase.from(TABLE).update(item).eq("slug", originalSlug);
  if (error) throw error;
}

export async function deleteNewsItem(slug: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq("slug", slug);
  if (error) throw error;
}

export async function setNewsItemPublished(slug: string, published: boolean): Promise<void> {
  const { error } = await supabase.from(TABLE).update({ published }).eq("slug", slug);
  if (error) throw error;
}

export async function updateNewsItemOrder(slug: string, order_index: number): Promise<void> {
  const { error } = await supabase.from(TABLE).update({ order_index }).eq("slug", slug);
  if (error) throw error;
}
