import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    getProducts, createProduct, updateProduct, deleteProduct,
    getCategories, createCategory, updateCategory, deleteCategory,
    getBrands, createBrand, updateBrand, deleteBrand,
    getPackaging, createPackaging, updatePackaging, deletePackaging,
} from "../api/api";

const TABS = ["Inventory", "Categories", "Brands", "Packaging"];

export default function AdminPortal() {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = React.useState("Inventory");
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        if (!token) navigate("/signin");
    }, [token]);

    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Admin Portal</h1>

                <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm mb-6">
                    {TABS.map((t) => (
                        <button
                            key={t}
                            onClick={() => { setTab(t); setError(""); }}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${tab === t ? "bg-black text-white" : "hover:bg-gray-100"
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

                {tab === "Inventory" && <InventoryTab setError={setError} />}
                {tab === "Categories" && <CrudTab entity="category" fetchAll={getCategories} create={createCategory} update={updateCategory} remove={deleteCategory} fields={["name", "description"]} setError={setError} />}
                {tab === "Brands" && <CrudTab entity="brand" fetchAll={getBrands} create={createBrand} update={updateBrand} remove={deleteBrand} fields={["name", "description", "logoUrl"]} setError={setError} />}
                {tab === "Packaging" && <PackagingTab setError={setError} />}
            </div>
        </div>
    );
}

function InventoryTab({ setError }) {
    const [products, setProducts] = React.useState([]);
    const [categories, setCategories] = React.useState([]);
    const [brands, setBrands] = React.useState([]);
    const [pkgs, setPkgs] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [editing, setEditing] = React.useState(null);
    const [form, setForm] = React.useState({ name: "", description: "", price: "", stock: "", categoryId: "", brandId: "", packagingId: "", imageUrl: "" });

    React.useEffect(() => { load(); }, []);

    async function load() {
        try {
            const [p, c, b, pk] = await Promise.all([getProducts(), getCategories(), getBrands(), getPackaging()]);
            setProducts(p); setCategories(c); setBrands(b); setPkgs(pk);
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    }

    function startEdit(p) {
        setEditing(p.id);
        setForm({
            name: p.name, description: p.description || "", price: p.price, stock: p.stock,
            categoryId: p.category?.id || "", brandId: p.brand?.id || "", packagingId: p.packaging?.id || "",
            imageUrl: p.imageUrl || "",
        });
    }

    function startAdd() {
        setEditing("new");
        setForm({ name: "", description: "", price: "", stock: "100", categoryId: categories[0]?.id || "", brandId: "", packagingId: "", imageUrl: "" });
    }

    async function handleSave() {
        try {
            const payload = {
                name: form.name, description: form.description,
                price: Number(form.price), stock: Number(form.stock),
                categoryId: Number(form.categoryId),
                brandId: form.brandId ? Number(form.brandId) : null,
                packagingId: form.packagingId ? Number(form.packagingId) : null,
                imageUrl: form.imageUrl || null,
            };
            if (editing === "new") await createProduct(payload);
            else await updateProduct(editing, payload);
            setEditing(null);
            await load();
        } catch (err) { setError(err.message); }
    }

    async function handleDelete(id) {
        if (!confirm("Delete this product?")) return;
        try { await deleteProduct(id); await load(); }
        catch (err) { setError(err.message); }
    }

    if (loading) return <p className="text-gray-400 animate-pulse">Loading inventory…</p>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{products.length} products</p>
                <button onClick={startAdd} className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition">+ Add Product</button>
            </div>

            {editing && (
                <div className="bg-white rounded-xl shadow-sm p-5 space-y-3 border-2 border-black">
                    <h3 className="font-bold">{editing === "new" ? "Add Product" : "Edit Product"}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
                        <input placeholder="Image URL" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
                        <input placeholder="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
                        <input placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
                        <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} className="border rounded-lg px-3 py-2 text-sm">
                            <option value="">Select Category</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <select value={form.brandId} onChange={e => setForm({ ...form, brandId: e.target.value })} className="border rounded-lg px-3 py-2 text-sm">
                            <option value="">No Brand</option>
                            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                        <select value={form.packagingId} onChange={e => setForm({ ...form, packagingId: e.target.value })} className="border rounded-lg px-3 py-2 text-sm">
                            <option value="">No Packaging</option>
                            {pkgs.map(p => <option key={p.id} value={p.id}>{p.type}</option>)}
                        </select>
                    </div>
                    <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" rows={2} />
                    <div className="flex gap-2">
                        <button onClick={handleSave} className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800">Save</button>
                        <button onClick={() => setEditing(null)} className="px-4 py-2 border text-sm rounded-lg hover:bg-gray-100">Cancel</button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-gray-400 border-b">
                            <th className="p-3">Image</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Brand</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="p-3">
                                    <img src={p.imageUrl || "https://picsum.photos/40/40"} alt="" className="w-10 h-10 rounded object-cover" />
                                </td>
                                <td className="p-3 font-medium">{p.name}</td>
                                <td className="p-3">₹{Number(p.price).toFixed(0)}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${p.stock > 20 ? "bg-green-100 text-green-700" : p.stock > 0 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                                        {p.stock}
                                    </span>
                                </td>
                                <td className="p-3 text-gray-500">{p.category?.name}</td>
                                <td className="p-3 text-gray-500">{p.brand?.name || "—"}</td>
                                <td className="p-3 text-right space-x-2">
                                    <button onClick={() => startEdit(p)} className="text-blue-600 hover:underline text-xs">Edit</button>
                                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function CrudTab({ entity, fetchAll, create, update, remove, fields, setError }) {
    const [items, setItems] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [editing, setEditing] = React.useState(null);
    const [form, setForm] = React.useState({});

    React.useEffect(() => { load(); }, []);

    async function load() {
        try { setItems(await fetchAll()); }
        catch (err) { setError(err.message); }
        finally { setLoading(false); }
    }

    function startAdd() {
        setEditing("new");
        const f = {};
        fields.forEach(k => f[k] = "");
        setForm(f);
    }

    function startEdit(item) {
        setEditing(item.id);
        const f = {};
        fields.forEach(k => f[k] = item[k] || "");
        setForm(f);
    }

    async function handleSave() {
        try {
            if (editing === "new") await create(form);
            else await update(editing, form);
            setEditing(null);
            await load();
        } catch (err) { setError(err.message); }
    }

    async function handleDelete(id) {
        if (!confirm(`Delete this ${entity}?`)) return;
        try { await remove(id); await load(); }
        catch (err) { setError(err.message); }
    }

    if (loading) return <p className="text-gray-400 animate-pulse">Loading…</p>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{items.length} {entity}(s)</p>
                <button onClick={startAdd} className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800">+ Add</button>
            </div>

            {editing && (
                <div className="bg-white rounded-xl shadow-sm p-5 space-y-3 border-2 border-black">
                    <h3 className="font-bold">{editing === "new" ? `Add ${entity}` : `Edit ${entity}`}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {fields.map(f => (
                            <input key={f} placeholder={f.charAt(0).toUpperCase() + f.slice(1)} value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleSave} className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800">Save</button>
                        <button onClick={() => setEditing(null)} className="px-4 py-2 border text-sm rounded-lg hover:bg-gray-100">Cancel</button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-gray-400 border-b">
                            <th className="p-3">ID</th>
                            {fields.map(f => <th key={f} className="p-3">{f.charAt(0).toUpperCase() + f.slice(1)}</th>)}
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="p-3 text-gray-400">{item.id}</td>
                                {fields.map(f => <td key={f} className="p-3">{item[f] || "—"}</td>)}
                                <td className="p-3 text-right space-x-2">
                                    <button onClick={() => startEdit(item)} className="text-blue-600 hover:underline text-xs">Edit</button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function PackagingTab({ setError }) {
    const [items, setItems] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [editing, setEditing] = React.useState(null);
    const [form, setForm] = React.useState({ type: "", material: "", isEcoFriendly: false });

    React.useEffect(() => { load(); }, []);

    async function load() {
        try { setItems(await getPackaging()); }
        catch (err) { setError(err.message); }
        finally { setLoading(false); }
    }

    function startAdd() { setEditing("new"); setForm({ type: "", material: "", isEcoFriendly: false }); }
    function startEdit(item) { setEditing(item.id); setForm({ type: item.type, material: item.material || "", isEcoFriendly: item.isEcoFriendly || item.ecoFriendly || false }); }

    async function handleSave() {
        try {
            if (editing === "new") await createPackaging(form);
            else await updatePackaging(editing, form);
            setEditing(null);
            await load();
        } catch (err) { setError(err.message); }
    }

    async function handleDelete(id) {
        if (!confirm("Delete this packaging?")) return;
        try { await deletePackaging(id); await load(); }
        catch (err) { setError(err.message); }
    }

    if (loading) return <p className="text-gray-400 animate-pulse">Loading…</p>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{items.length} packaging type(s)</p>
                <button onClick={startAdd} className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800">+ Add</button>
            </div>

            {editing && (
                <div className="bg-white rounded-xl shadow-sm p-5 space-y-3 border-2 border-black">
                    <h3 className="font-bold">{editing === "new" ? "Add Packaging" : "Edit Packaging"}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <input placeholder="Type (e.g. Box)" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
                        <input placeholder="Material" value={form.material} onChange={e => setForm({ ...form, material: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={form.isEcoFriendly} onChange={e => setForm({ ...form, isEcoFriendly: e.target.checked })} className="rounded" />
                        Eco-Friendly
                    </label>
                    <div className="flex gap-2">
                        <button onClick={handleSave} className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800">Save</button>
                        <button onClick={() => setEditing(null)} className="px-4 py-2 border text-sm rounded-lg hover:bg-gray-100">Cancel</button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-gray-400 border-b">
                            <th className="p-3">ID</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">Material</th>
                            <th className="p-3">Eco</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="p-3 text-gray-400">{item.id}</td>
                                <td className="p-3">{item.type}</td>
                                <td className="p-3">{item.material || "—"}</td>
                                <td className="p-3">{(item.isEcoFriendly || item.ecoFriendly) ? "🌿 Yes" : "No"}</td>
                                <td className="p-3 text-right space-x-2">
                                    <button onClick={() => startEdit(item)} className="text-blue-600 hover:underline text-xs">Edit</button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
