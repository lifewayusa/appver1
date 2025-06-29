"use client";
import { useState } from "react";

export default function EscolaRegularForm() {
  const [form, setForm] = useState<any>({});
  const [msg, setMsg] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/admin/escolas-regulares", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) setMsg("Escola regular cadastrada!");
    else setMsg("Erro ao cadastrar escola regular");
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
      <label>Nome</label>
      <input name="name" onChange={handleChange} value={form.name || ""} required style={{ width: "100%", marginBottom: 8 }} />
      <label>Tipo</label>
      <input name="type" onChange={handleChange} value={form.type || ""} style={{ width: "100%", marginBottom: 8 }} />
      <label>Endereço</label>
      <input name="address" onChange={handleChange} value={form.address || ""} style={{ width: "100%", marginBottom: 8 }} />
      <label>Telefone</label>
      <input name="phone" onChange={handleChange} value={form.phone || ""} style={{ width: "100%", marginBottom: 8 }} />
      <label>CEP</label>
      <input name="zip" onChange={handleChange} value={form.zip || ""} style={{ width: "100%", marginBottom: 8 }} />
      <label>Pré-escola?</label>
      <select name="has_pre_kindergarten" onChange={handleChange} value={form.has_pre_kindergarten || ""} style={{ width: "100%", marginBottom: 8 }}>
        <option value="">Selecione...</option>
        <option value="true">Sim</option>
        <option value="false">Não</option>
      </select>
      <label>Jardim de infância?</label>
      <select name="has_kindergarten" onChange={handleChange} value={form.has_kindergarten || ""} style={{ width: "100%", marginBottom: 8 }}>
        <option value="">Selecione...</option>
        <option value="true">Sim</option>
        <option value="false">Não</option>
      </select>
      <label>URL</label>
      <input name="url" onChange={handleChange} value={form.url || ""} style={{ width: "100%", marginBottom: 8 }} />
      <button type="submit">Salvar</button>
      {msg && <p style={{ color: msg.includes("cadastrada") ? "green" : "red" }}>{msg}</p>}
    </form>
  );
}
