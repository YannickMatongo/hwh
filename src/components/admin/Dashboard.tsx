/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import {
  deleteNewsItem,
  fetchAllNewsItems,
  NewsItem,
  setNewsItemPublished,
  updateNewsItemOrder,
} from "../../lib/newsItems";
import AdminNav from "./AdminNav";

export default function Dashboard() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  const loadItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setItems(await fetchAllNewsItems());
    } catch {
      setError("Impossible de charger les actualités.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleTogglePublished = async (item: NewsItem) => {
    setError(null);
    setPendingSlug(item.slug);
    try {
      await setNewsItemPublished(item.slug, !item.published);
      setItems((prev) => prev.map((i) => (i.slug === item.slug ? { ...i, published: !i.published } : i)));
    } catch {
      setError("Impossible de mettre à jour le statut de cette actualité.");
    } finally {
      setPendingSlug(null);
    }
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const originalOrderBySlug = new Map(items.map((i) => [i.slug, i.order_index]));

    const reordered = [...items];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    const renumbered = reordered.map((item, i) => ({ ...item, order_index: i }));

    const changed = renumbered.filter((item) => originalOrderBySlug.get(item.slug) !== item.order_index);
    if (changed.length === 0) return;

    setError(null);
    setIsReordering(true);
    try {
      await Promise.all(changed.map((item) => updateNewsItemOrder(item.slug, item.order_index)));
      setItems(renumbered);
    } catch {
      setError("Impossible de modifier l'ordre d'affichage.");
    } finally {
      setIsReordering(false);
    }
  };

  const handleDelete = async (item: NewsItem) => {
    if (!window.confirm(`Supprimer définitivement "${item.title_fr}" ? Cette action est irréversible.`)) return;
    setError(null);
    setPendingSlug(item.slug);
    try {
      await deleteNewsItem(item.slug);
      setItems((prev) => prev.filter((i) => i.slug !== item.slug));
    } catch {
      setError("Impossible de supprimer cette actualité.");
    } finally {
      setPendingSlug(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <AdminNav />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            {items.length} actualité{items.length !== 1 ? "s" : ""}
          </p>
          <Link
            to="/admin/new"
            className="inline-flex items-center gap-2 bg-[#D32F2F] hover:bg-[#b02626] text-white font-bold text-sm rounded-lg px-4 py-2.5 transition-colors"
          >
            <Plus size={16} /> Nouvelle actualité
          </Link>
        </div>

        {error && <p className="text-sm text-[#D32F2F] font-medium mb-4">{error}</p>}

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 text-[#D32F2F] animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-500 py-12 text-center">Aucune actualité pour le moment.</p>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            {items.map((item, index) => (
              <div key={item.slug} className="flex items-center gap-4 px-5 py-4">
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMove(index, -1)}
                    disabled={index === 0 || isReordering}
                    aria-label="Monter dans l'ordre d'affichage"
                    className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-[#D32F2F] flex items-center justify-center transition-colors disabled:opacity-30 disabled:hover:bg-gray-100 disabled:hover:text-gray-500"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 1)}
                    disabled={index === items.length - 1 || isReordering}
                    aria-label="Descendre dans l'ordre d'affichage"
                    className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-[#D32F2F] flex items-center justify-center transition-colors disabled:opacity-30 disabled:hover:bg-gray-100 disabled:hover:text-gray-500"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>

                <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                  {item.images?.[0] && <img src={item.images[0]} alt="" className="w-full h-full object-cover" />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-black truncate">{item.title_fr}</p>
                  <p className="text-xs text-gray-400 truncate">
                    /{item.slug} · ordre {item.order_index}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleTogglePublished(item)}
                  disabled={pendingSlug === item.slug}
                  aria-pressed={item.published}
                  aria-label={item.published ? "Dépublier cette actualité" : "Publier cette actualité"}
                  className="flex items-center gap-2.5 flex-shrink-0 disabled:opacity-50"
                >
                  <span
                    className={`text-xs font-bold uppercase tracking-wide transition-colors ${
                      item.published ? "text-green-700" : "text-gray-500"
                    }`}
                  >
                    {item.published ? "Publié" : "Brouillon"}
                  </span>
                  <span
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                      item.published ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-300 ${
                        item.published ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </span>
                </button>

                <Link
                  to={`/admin/edit/${item.slug}`}
                  className="p-2 text-gray-500 hover:text-[#D32F2F] transition-colors flex-shrink-0"
                  aria-label="Modifier"
                >
                  <Pencil size={18} />
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(item)}
                  disabled={pendingSlug === item.slug}
                  className="p-2 text-gray-500 hover:text-[#D32F2F] transition-colors disabled:opacity-50 flex-shrink-0"
                  aria-label="Supprimer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
