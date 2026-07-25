/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeEvent, DragEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowDown, ArrowUp, Loader2, Plus, UploadCloud, X } from "lucide-react";
import { createNewsItem, fetchNewsItemBySlug, NewsItemInput, updateNewsItem } from "../../lib/newsItems";
import { supabase } from "../../lib/supabaseClient";
import AdminNav from "./AdminNav";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const EMPTY_FORM: NewsItemInput = {
  slug: "",
  title_fr: "",
  title_en: "",
  short_description_fr: "",
  short_description_en: "",
  full_description_fr: "",
  full_description_en: "",
  folder: "",
  images: [],
  video_url: null,
  published: false,
  order_index: 0,
};

const inputClass =
  "w-full border border-gray-300 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D32F2F]";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

const NEWS_IMAGES_BUCKET = "news-images";
const MAX_FILE_SIZE_MB = 8;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const NEWS_IMAGES_BASE_URL = supabase.storage.from(NEWS_IMAGES_BUCKET).getPublicUrl("").data.publicUrl;

export default function NewsForm() {
  const { slug: slugParam } = useParams<{ slug: string }>();
  const isEditMode = Boolean(slugParam);
  const navigate = useNavigate();

  const [form, setForm] = useState<NewsItemInput>(EMPTY_FORM);
  const [originalSlug, setOriginalSlug] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [manualPathInput, setManualPathInput] = useState("");

  useEffect(() => {
    if (!slugParam) return;
    let cancelled = false;

    fetchNewsItemBySlug(slugParam)
      .then((item) => {
        if (cancelled) return;
        if (!item) {
          setError("Actualité introuvable.");
          return;
        }
        setForm({
          slug: item.slug,
          title_fr: item.title_fr,
          title_en: item.title_en,
          short_description_fr: item.short_description_fr,
          short_description_en: item.short_description_en,
          full_description_fr: item.full_description_fr,
          full_description_en: item.full_description_en,
          folder: item.folder,
          images: item.images ?? [],
          video_url: item.video_url,
          published: item.published,
          order_index: item.order_index,
        });
        setOriginalSlug(item.slug);
        setSlugTouched(true);
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de charger cette actualité.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slugParam]);

  const handleTitleFrChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title_fr: value,
      slug: slugTouched ? prev.slug : slugify(value),
    }));
  };

  const handleAddManualPath = () => {
    const trimmed = manualPathInput.trim();
    if (!trimmed) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, trimmed] }));
    setManualPathInput("");
  };

  const handleRemoveImage = (index: number) => {
    const image = form.images[index];
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));

    // Best-effort cleanup: only attempt storage deletion for images that actually live in our bucket.
    if (image && NEWS_IMAGES_BASE_URL && image.startsWith(NEWS_IMAGES_BASE_URL)) {
      const path = image.slice(NEWS_IMAGES_BASE_URL.length);
      supabase.storage
        .from(NEWS_IMAGES_BUCKET)
        .remove([path])
        .catch(() => {
          // Non-critical: the reference is already removed from the form either way.
        });
    }
  };

  const handleMoveImage = (index: number, direction: -1 | 1) => {
    setForm((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.images.length) return prev;
      const images = [...prev.images];
      [images[index], images[target]] = [images[target], images[index]];
      return { ...prev, images };
    });
  };

  const uploadFiles = async (fileList: FileList) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    setUploadError(null);
    setIsUploading(true);
    setUploadProgress({ done: 0, total: files.length });

    const uploadedUrls: string[] = [];
    const errors: string[] = [];
    const folderHint = form.slug.trim() || "actualites";

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        errors.push(`${file.name} : format non supporté.`);
      } else if (file.size > MAX_FILE_SIZE_BYTES) {
        errors.push(`${file.name} : fichier trop volumineux (max ${MAX_FILE_SIZE_MB} Mo).`);
      } else {
        const extension = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : "";
        const path = `${folderHint}/${crypto.randomUUID()}${extension}`;
        const { error: uploadErr } = await supabase.storage.from(NEWS_IMAGES_BUCKET).upload(path, file);

        if (uploadErr) {
          errors.push(`${file.name} : échec de l'envoi (${uploadErr.message}).`);
        } else {
          const { data } = supabase.storage.from(NEWS_IMAGES_BUCKET).getPublicUrl(path);
          uploadedUrls.push(data.publicUrl);
        }
      }

      setUploadProgress((prev) => ({ ...prev, done: prev.done + 1 }));
    }

    if (uploadedUrls.length > 0) {
      setForm((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
    }
    if (errors.length > 0) {
      setUploadError(errors.join(" "));
    }

    setIsUploading(false);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
    }
    e.target.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    const payload: NewsItemInput = {
      ...form,
      images: form.images.map((img) => img.trim()).filter(Boolean),
      video_url: form.video_url?.trim() || null,
    };

    try {
      if (isEditMode && originalSlug) {
        await updateNewsItem(originalSlug, payload);
      } else {
        await createNewsItem(payload);
      }
      navigate("/admin");
    } catch {
      setError("Impossible d'enregistrer cette actualité. Vérifiez que le slug n'est pas déjà utilisé.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-6 h-6 text-[#D32F2F] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <AdminNav />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-lg font-bold text-black uppercase tracking-wide mb-6">
          {isEditMode ? "Modifier l'actualité" : "Nouvelle actualité"}
        </h1>

        {error && <p className="text-sm text-[#D32F2F] font-medium mb-6">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <section className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
            <h2 className="text-sm font-black uppercase tracking-wide text-gray-500">Titres &amp; descriptions</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Titre (FR)</label>
                <input
                  required
                  value={form.title_fr}
                  onChange={(e) => handleTitleFrChange(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Titre (EN)</label>
                <input
                  required
                  value={form.title_en}
                  onChange={(e) => setForm((p) => ({ ...p, title_en: e.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Slug</label>
              <input
                required
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm((p) => ({ ...p, slug: slugify(e.target.value) }));
                }}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Description courte (FR)</label>
                <textarea
                  required
                  rows={2}
                  value={form.short_description_fr}
                  onChange={(e) => setForm((p) => ({ ...p, short_description_fr: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className={labelClass}>Description courte (EN)</label>
                <textarea
                  required
                  rows={2}
                  value={form.short_description_en}
                  onChange={(e) => setForm((p) => ({ ...p, short_description_en: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Description complète (FR)</label>
                <textarea
                  required
                  rows={6}
                  value={form.full_description_fr}
                  onChange={(e) => setForm((p) => ({ ...p, full_description_fr: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className={labelClass}>Description complète (EN)</label>
                <textarea
                  required
                  rows={6}
                  value={form.full_description_en}
                  onChange={(e) => setForm((p) => ({ ...p, full_description_en: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
            <h2 className="text-sm font-black uppercase tracking-wide text-gray-500">Médias</h2>

            <div>
              <label className={labelClass}>Nom du dossier</label>
              <input
                required
                placeholder="ex: barcelone, londres, new-york"
                value={form.folder}
                onChange={(e) => setForm((p) => ({ ...p, folder: e.target.value }))}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Images</label>

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingOver(true);
                }}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition-colors ${
                  isDraggingOver ? "border-[#D32F2F] bg-[#D32F2F]/5" : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <UploadCloud className="text-gray-400" size={26} />
                <p className="text-sm text-gray-600 font-medium">Glissez vos images ici ou cliquez pour parcourir</p>
                <p className="text-xs text-gray-400">JPG, PNG, WEBP — {MAX_FILE_SIZE_MB} Mo max par image</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>

              {isUploading && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                  <Loader2 size={16} className="animate-spin" />
                  Envoi en cours... ({uploadProgress.done}/{uploadProgress.total})
                </div>
              )}

              {uploadError && <p className="text-sm text-[#D32F2F] font-medium mt-3">{uploadError}</p>}

              {form.images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                  {form.images.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100"
                    >
                      {image && <img src={image} alt="" className="w-full h-full object-cover" />}

                      {index === 0 && (
                        <span className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">
                          Couverture
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        aria-label="Retirer cette image"
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#D32F2F]"
                      >
                        <X size={14} />
                      </button>

                      <div className="absolute bottom-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveImage(index, -1)}
                          aria-label="Monter dans l'ordre"
                          className="w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center disabled:opacity-30 hover:bg-[#D32F2F]"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          type="button"
                          disabled={index === form.images.length - 1}
                          onClick={() => handleMoveImage(index, 1)}
                          aria-label="Descendre dans l'ordre"
                          className="w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center disabled:opacity-30 hover:bg-[#D32F2F]"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 mt-4">
                <input
                  value={manualPathInput}
                  onChange={(e) => setManualPathInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddManualPath();
                    }
                  }}
                  placeholder="/londres/londres-1.jpg"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={handleAddManualPath}
                  disabled={!manualPathInput.trim()}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#D32F2F] hover:text-[#b02626] disabled:opacity-40 transition-colors flex-shrink-0"
                >
                  <Plus size={16} /> Ajouter
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Pour réutiliser une image déjà présente dans un dossier public existant (ex: /londres/londres-1.jpg).
              </p>
            </div>

            <div>
              <label className={labelClass}>URL vidéo YouTube (optionnel)</label>
              <input
                value={form.video_url ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, video_url: e.target.value }))}
                placeholder="https://www.youtube.com/watch?v=..."
                className={inputClass}
              />
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
            <h2 className="text-sm font-black uppercase tracking-wide text-gray-500">Publication</h2>

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Statut</span>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, published: !p.published }))}
                className={`text-xs font-bold uppercase tracking-wide px-4 py-2 rounded-full transition-colors ${
                  form.published ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {form.published ? "Publié" : "Brouillon"}
              </button>
            </div>

            <div>
              <label className={labelClass}>Ordre d'affichage</label>
              <input
                type="number"
                value={form.order_index}
                onChange={(e) => setForm((p) => ({ ...p, order_index: Number(e.target.value) }))}
                className={`${inputClass} max-w-[160px]`}
              />
            </div>
          </section>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 bg-[#D32F2F] hover:bg-[#b02626] disabled:opacity-60 text-white font-bold text-sm rounded-lg px-6 py-3 transition-colors"
            >
              {isSaving && <Loader2 size={16} className="animate-spin" />}
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="text-sm font-semibold text-gray-600 hover:text-black transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
