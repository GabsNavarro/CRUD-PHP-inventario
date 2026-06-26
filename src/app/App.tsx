import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Check, PackageSearch, Loader2 } from "lucide-react";

const API = "http://localhost:8080/productos";

interface Articulo {
  id: number;
  nombre: string;
  marca: string;
  precio_costo: number;
  precio_venta: number;
  stock: number;
}

const emptyForm = {
  nombre: "",
  marca: "",
  precio_costo: "",
  precio_venta: "",
  stock: "",
};

function formatCurrency(n: number) {
  return "$" + n.toLocaleString("es-AR");
}

function margen(costo: number, venta: number) {
  if (costo === 0) return 0;
  return Math.round(((venta - costo) / costo) * 100);
}

export default function App() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Partial<typeof emptyForm>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    setApiError("");
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setArticulos(data);
    } catch (e: any) {
      setApiError("No se pudo conectar con el servidor: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  function validate() {
    const e: Partial<typeof emptyForm> = {};
    if (!form.nombre.trim()) e.nombre = "Requerido";
    if (!form.marca.trim()) e.marca = "Requerido";
    if (!form.precio_costo || isNaN(Number(form.precio_costo)) || Number(form.precio_costo) < 0)
      e.precio_costo = "Valor inválido";
    if (!form.precio_venta || isNaN(Number(form.precio_venta)) || Number(form.precio_venta) < 0)
      e.precio_venta = "Valor inválido";
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0)
      e.stock = "Valor inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function showSuccess(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 2500);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const body = JSON.stringify({
      nombre: form.nombre.trim(),
      marca: form.marca.trim(),
      precio_costo: Number(form.precio_costo),
      precio_venta: Number(form.precio_venta),
      stock: Number(form.stock),
    });

    setSaving(true);
    setApiError("");
    try {
      const url = editingId !== null ? `${API}/${editingId}` : API;
      const method = editingId !== null ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      await fetchAll();
      showSuccess(editingId !== null ? "Artículo actualizado" : "Artículo registrado");
      cancelEdit();
    } catch (e: any) {
      setApiError("Error al guardar: " + e.message);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(a: Articulo) {
    setEditingId(a.id);
    setForm({
      nombre: a.nombre,
      marca: a.marca,
      precio_costo: String(a.precio_costo),
      precio_venta: String(a.precio_venta),
      stock: String(a.stock),
    });
    setErrors({});
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
  }

  async function handleDelete(id: number) {
    setApiError("");
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      await fetchAll();
      setDeleteConfirm(null);
      if (editingId === id) cancelEdit();
      showSuccess("Artículo eliminado");
    } catch (e: any) {
      setApiError("Error al eliminar: " + e.message);
      setDeleteConfirm(null);
    }
  }

  const isEditing = editingId !== null;

  return (
    <div
      className="min-h-screen bg-background text-foreground p-6"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
        <PackageSearch size={22} className="text-primary" />
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground" style={{ fontFamily: "'Geist Mono', monospace" }}>
            INVENTARIO
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gestión de artículos · {articulos.length} registros
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {apiError && (
            <div className="flex items-center gap-1.5 text-xs text-destructive bg-destructive/10 px-3 py-1.5 rounded border border-destructive/20">
              <X size={12} />
              {apiError}
            </div>
          )}
          {successMsg && (
            <div className="flex items-center gap-1.5 text-xs text-primary bg-accent px-3 py-1.5 rounded border border-primary/20">
              <Check size={12} />
              {successMsg}
            </div>
          )}
        </div>
      </div>

      {/* Main layout */}
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Form panel */}
        <div className="bg-card border border-border rounded-lg p-5 h-fit">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "'Geist Mono', monospace" }}>
              {isEditing ? `Editando #${editingId}` : "Nuevo Artículo"}
            </h2>
            {isEditing && (
              <button
                onClick={cancelEdit}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Cancelar"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'Geist Mono', monospace" }}>
                Nombre
              </label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Ej: Monitor 27&quot; 4K"
                className="w-full bg-input-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all"
              />
              {errors.nombre && <p className="text-xs text-destructive mt-1">{errors.nombre}</p>}
            </div>

            {/* Marca */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'Geist Mono', monospace" }}>
                Marca
              </label>
              <input
                type="text"
                value={form.marca}
                onChange={(e) => setForm({ ...form, marca: e.target.value })}
                placeholder="Ej: LG, Samsung..."
                className="w-full bg-input-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all"
              />
              {errors.marca && <p className="text-xs text-destructive mt-1">{errors.marca}</p>}
            </div>

            {/* Precios */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'Geist Mono', monospace" }}>
                  P. Costo
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                  <input
                    type="number"
                    min="0"
                    value={form.precio_costo}
                    onChange={(e) => setForm({ ...form, precio_costo: e.target.value })}
                    placeholder="0"
                    className="w-full bg-input-background border border-border rounded pl-6 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all"
                  />
                </div>
                {errors.precio_costo && <p className="text-xs text-destructive mt-1">{errors.precio_costo}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'Geist Mono', monospace" }}>
                  P. Venta
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                  <input
                    type="number"
                    min="0"
                    value={form.precio_venta}
                    onChange={(e) => setForm({ ...form, precio_venta: e.target.value })}
                    placeholder="0"
                    className="w-full bg-input-background border border-border rounded pl-6 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all"
                  />
                </div>
                {errors.precio_venta && <p className="text-xs text-destructive mt-1">{errors.precio_venta}</p>}
              </div>
            </div>

            {/* Margen preview */}
            {form.precio_costo && form.precio_venta && (
              <div className="bg-accent border border-primary/20 rounded px-3 py-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground" style={{ fontFamily: "'Geist Mono', monospace" }}>Margen estimado</span>
                <span
                  className="text-xs font-semibold"
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    color: margen(Number(form.precio_costo), Number(form.precio_venta)) >= 0 ? "var(--primary)" : "var(--destructive)",
                  }}
                >
                  {margen(Number(form.precio_costo), Number(form.precio_venta))}%
                </span>
              </div>
            )}

            {/* Stock */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'Geist Mono', monospace" }}>
                Stock
              </label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="0"
                className="w-full bg-input-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all"
              />
              {errors.stock && <p className="text-xs text-destructive mt-1">{errors.stock}</p>}
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded py-2.5 text-xs font-semibold uppercase tracking-wider hover:brightness-110 active:brightness-90 transition-all"
                style={{ fontFamily: "'Geist Mono', monospace" }}
              >
                {saving ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : isEditing ? (
                  <><Check size={13} /> Guardar cambios</>
                ) : (
                  <><Plus size={13} /> Registrar artículo</>
                )}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 border border-border rounded py-2.5 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
                  style={{ fontFamily: "'Geist Mono', monospace" }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table panel */}
        <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "'Geist Mono', monospace" }}>
              Artículos registrados
            </h2>
            <span className="text-xs text-muted-foreground bg-accent border border-border rounded px-2 py-0.5" style={{ fontFamily: "'Geist Mono', monospace" }}>
              {articulos.length} items
            </span>
          </div>

          <div className="overflow-auto flex-1">
            <table className="w-full text-xs" style={{ fontFamily: "'Geist Mono', monospace" }}>
              <thead>
                <tr className="border-b border-border text-muted-foreground uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-medium w-10">#</th>
                  <th className="text-left px-4 py-3 font-medium">Nombre</th>
                  <th className="text-left px-4 py-3 font-medium">Marca</th>
                  <th className="text-right px-4 py-3 font-medium">P. Costo</th>
                  <th className="text-right px-4 py-3 font-medium">P. Venta</th>
                  <th className="text-right px-4 py-3 font-medium">Margen</th>
                  <th className="text-right px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium w-20"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-muted-foreground">
                      <Loader2 size={18} className="animate-spin inline-block mr-2" />
                      Cargando...
                    </td>
                  </tr>
                ) : articulos.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-muted-foreground">
                      No hay artículos registrados
                    </td>
                  </tr>
                ) : (
                  articulos.map((a, i) => {
                    const mg = margen(a.precio_costo, a.precio_venta);
                    const isActive = editingId === a.id;
                    const isLowStock = a.stock <= 5;
                    return (
                      <tr
                        key={a.id}
                        className={[
                          "border-b border-border/50 transition-colors",
                          isActive
                            ? "bg-accent"
                            : i % 2 === 0
                            ? "bg-transparent hover:bg-secondary"
                            : "bg-secondary/40 hover:bg-secondary",
                        ].join(" ")}
                      >
                        <td className="px-4 py-3 text-muted-foreground">{a.id}</td>
                        <td className="px-4 py-3 text-foreground font-medium">{a.nombre}</td>
                        <td className="px-4 py-3 text-muted-foreground">{a.marca}</td>
                        <td className="px-4 py-3 text-right text-muted-foreground">{formatCurrency(a.precio_costo)}</td>
                        <td className="px-4 py-3 text-right text-foreground">{formatCurrency(a.precio_venta)}</td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className="inline-block rounded px-1.5 py-0.5"
                            style={{
                              color: mg >= 30 ? "var(--primary)" : mg >= 0 ? "#e8b84b" : "var(--destructive)",
                              background: mg >= 30 ? "rgba(45,189,110,0.12)" : mg >= 0 ? "rgba(232,184,75,0.12)" : "rgba(224,82,82,0.12)",
                            }}
                          >
                            {mg}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className="inline-block rounded px-1.5 py-0.5"
                            style={{
                              color: isLowStock ? "var(--destructive)" : "var(--foreground)",
                              background: isLowStock ? "rgba(224,82,82,0.12)" : "transparent",
                            }}
                          >
                            {a.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            {deleteConfirm === a.id ? (
                              <>
                                <button
                                  onClick={() => handleDelete(a.id)}
                                  className="text-destructive hover:brightness-125 transition-colors"
                                  title="Confirmar eliminación"
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="text-muted-foreground hover:text-foreground transition-colors"
                                  title="Cancelar"
                                >
                                  <X size={14} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEdit(a)}
                                  className={[
                                    "transition-colors",
                                    isActive ? "text-primary" : "text-muted-foreground hover:text-primary",
                                  ].join(" ")}
                                  title="Editar"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(a.id)}
                                  className="text-muted-foreground hover:text-destructive transition-colors"
                                  title="Eliminar"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer stats */}
          {articulos.length > 0 && (
            <div className="border-t border-border px-5 py-3 flex gap-6" style={{ fontFamily: "'Geist Mono', monospace" }}>
              <div>
                <span className="text-xs text-muted-foreground">Total stock</span>
                <span className="text-xs text-foreground ml-2 font-medium">
                  {articulos.reduce((s, a) => s + Number(a.stock), 0)} uds
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Valor inventario</span>
                <span className="text-xs text-primary ml-2 font-medium">
                  {formatCurrency(articulos.reduce((s, a) => s + a.precio_costo * a.stock, 0))}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Stock bajo (&le;5)</span>
                <span className="text-xs ml-2 font-medium" style={{ color: articulos.filter(a => a.stock <= 5).length > 0 ? "var(--destructive)" : "var(--muted-foreground)" }}>
                  {articulos.filter((a) => a.stock <= 5).length} items
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
