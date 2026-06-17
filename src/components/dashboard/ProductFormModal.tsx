import { useState } from "react"
import { X } from "lucide-react"
import { apiRequest } from "../../lib/api"

interface ProductFormModalProps {
  initialData?: any
  onClose: () => void
  onSaved: (product: any) => void
}

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  isFeatured: false,
  imageURLs: "",
  category: "",
  brand: "",
  releaseDate: "",
  features: "",
  averageRating: "",
  reviewCount: "",
}

export default function ProductFormModal({ initialData, onClose, onSaved }: ProductFormModalProps) {
  const isEdit = Boolean(initialData)

  const [form, setForm] = useState(() => {
    if (!initialData) return emptyForm
    return {
      name: initialData.name || "",
      description: initialData.description || "",
      price: initialData.price ?? "",
      stock: initialData.stock ?? "",
      isFeatured: Boolean(initialData.isFeatured),
      imageURLs: Array.isArray(initialData.imageURLs) ? initialData.imageURLs.join(", ") : "",
      category: initialData.category || "",
      brand: initialData.brand || "",
      releaseDate: initialData.releaseDate ? String(initialData.releaseDate).slice(0, 10) : "",
      features: Array.isArray(initialData.features) ? initialData.features.join(", ") : "",
      averageRating: initialData.averageRating ?? "",
      reviewCount: initialData.reviewCount ?? "",
    }
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const update = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!form.name.trim() || !form.description.trim() || form.price === "" || form.stock === "") {
      setError("Name, description, price and stock are required.")
      return
    }

    const payload: Record<string, any> = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      isFeatured: form.isFeatured,
      imageURLs: form.imageURLs
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean),
    }

    if (form.category.trim()) payload.category = form.category.trim()
    if (form.brand.trim()) payload.brand = form.brand.trim()
    if (form.releaseDate) payload.releaseDate = form.releaseDate
    if (form.features.trim()) {
      payload.features = form.features
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)
    }
    if (form.averageRating !== "") payload.averageRating = Number(form.averageRating)
    if (form.reviewCount !== "") payload.reviewCount = Number(form.reviewCount)

    setSaving(true)
    try {
      const result = isEdit
        ? await apiRequest(`/product/update-product/${initialData._id || initialData.id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
          })
        : await apiRequest("/product/create-product", {
            method: "POST",
            body: JSON.stringify(payload),
          })

      onSaved(result?.data || result)
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content product-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? "Edit Product" : "Add Product"}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          {error && <div className="form-error">{error}</div>}

          <div className="form-row">
            <label>
              Name *
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Product name"
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Description *
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Product description"
                rows={3}
                required
              />
            </label>
          </div>

          <div className="form-grid-2">
            <label>
              Price ($) *
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                placeholder="1199"
                required
              />
            </label>
            <label>
              Stock *
              <input
                type="number"
                value={form.stock}
                onChange={(e) => update("stock", e.target.value)}
                placeholder="50"
                required
              />
            </label>
          </div>

          <div className="form-grid-2">
            <label>
              Category
              <input
                type="text"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                placeholder="Electronics / iphone / shoes"
              />
            </label>
            <label>
              Brand
              <input
                type="text"
                value={form.brand}
                onChange={(e) => update("brand", e.target.value)}
                placeholder="Apple, Nike, Adidas..."
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Image URLs (comma separated)
              <input
                type="text"
                value={form.imageURLs}
                onChange={(e) => update("imageURLs", e.target.value)}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              />
            </label>
          </div>

          <div className="form-grid-2">
            <label>
              Release Date
              <input
                type="date"
                value={form.releaseDate}
                onChange={(e) => update("releaseDate", e.target.value)}
              />
            </label>
            <label>
              Features (comma separated)
              <input
                type="text"
                value={form.features}
                onChange={(e) => update("features", e.target.value)}
                placeholder="4G, 5G, Wireless Charging"
              />
            </label>
          </div>

          <div className="form-grid-2">
            <label>
              Average Rating
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.averageRating}
                onChange={(e) => update("averageRating", e.target.value)}
                placeholder="4.5"
              />
            </label>
            <label>
              Review Count
              <input
                type="number"
                min="0"
                value={form.reviewCount}
                onChange={(e) => update("reviewCount", e.target.value)}
                placeholder="100"
              />
            </label>
          </div>

          <div className="form-row checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => update("isFeatured", e.target.checked)}
              />
              Featured product
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
