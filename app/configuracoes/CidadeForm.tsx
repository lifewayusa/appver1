"use client";
import { useState } from "react";

export default function CidadeForm() {
  const [form, setForm] = useState<any>({});
  const [msg, setMsg] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/admin/cidades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) setMsg("Cidade cadastrada!");
    else setMsg("Erro ao cadastrar cidade");
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
      <label>Nome</label>
      <input name="name" onChange={handleChange} value={form.name || ""} required style={{ width: "100%", marginBottom: 8 }} />
      <label>Estado</label>
      <input name="state" onChange={handleChange} value={form.state || ""} required style={{ width: "100%", marginBottom: 8 }} />
      <label>População</label>
      <input name="population" type="number" onChange={handleChange} value={form.population || ""} style={{ width: "100%", marginBottom: 8 }} />
      <label>Slogan</label>
      <input name="slogan" onChange={handleChange} value={form.slogan || ""} style={{ width: "100%", marginBottom: 8 }} />
      <label>Imagem (URL)</label>
      <input name="image_url" onChange={handleChange} value={form.image_url || ""} style={{ width: "100%", marginBottom: 8 }} />
      <button type="submit">Salvar</button>
      {msg && <p style={{ color: msg.includes("cadastrada") ? "green" : "red" }}>{msg}</p>}
    </form>
  );
}
