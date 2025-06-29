"use client";
import { useState } from "react";

export default function EscolaProfissionalForm() {
  const [form, setForm] = useState<any>({});
  const [msg, setMsg] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/admin/escolas-profissionais", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) setMsg("Escola profissional cadastrada!");
    else setMsg("Erro ao cadastrar escola profissional");
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
      <label>Nome</label>
      <input name="name" onChange={handleChange} value={form.name || ""} required style={{ width: "100%", marginBottom: 8 }} />
      <label>Área</label>
      <input name="field" onChange={handleChange} value={form.field || ""} style={{ width: "100%", marginBottom: 8 }} />
      <label>Descrição</label>
      <input name="description" onChange={handleChange} value={form.description || ""} style={{ width: "100%", marginBottom: 8 }} />
      <label>Endereço</label>
      <input name="address" onChange={handleChange} value={form.address || ""} style={{ width: "100%", marginBottom: 8 }} />
      <label>Telefone</label>
      <input name="phone" onChange={handleChange} value={form.phone || ""} style={{ width: "100%", marginBottom: 8 }} />
      <label>URL</label>
      <input name="url" onChange={handleChange} value={form.url || ""} style={{ width: "100%", marginBottom: 8 }} />
      <button type="submit">Salvar</button>
      {msg && <p style={{ color: msg.includes("cadastrada") ? "green" : "red" }}>{msg}</p>}
    </form>
  );
}
