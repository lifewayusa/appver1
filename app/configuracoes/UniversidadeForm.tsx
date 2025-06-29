"use client";
import { useState } from "react";

export default function UniversidadeForm() {
  const [form, setForm] = useState<any>({});
  const [msg, setMsg] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/admin/universidades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) setMsg("Universidade cadastrada!");
    else setMsg("Erro ao cadastrar universidade");
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
      <label>Nome</label>
      <input name="name" onChange={handleChange} value={form.name || ""} required style={{ width: "100%", marginBottom: 8 }} />
      <label>Campus</label>
      <input name="campus_name" onChange={handleChange} value={form.campus_name || ""} style={{ width: "100%", marginBottom: 8 }} />
      <label>F1 Certified</label>
      <select name="f1_certified" onChange={handleChange} value={form.f1_certified || ""} style={{ width: "100%", marginBottom: 8 }}>
        <option value="">Selecione...</option>
        <option value="true">Sim</option>
        <option value="false">Não</option>
      </select>
      <label>M1 Certified</label>
      <select name="m1_certified" onChange={handleChange} value={form.m1_certified || ""} style={{ width: "100%", marginBottom: 8 }}>
        <option value="">Selecione...</option>
        <option value="true">Sim</option>
        <option value="false">Não</option>
      </select>
      <label>Campus ID</label>
      <input name="campus_id" onChange={handleChange} value={form.campus_id || ""} style={{ width: "100%", marginBottom: 8 }} />
      <label>URL</label>
      <input name="url" onChange={handleChange} value={form.url || ""} style={{ width: "100%", marginBottom: 8 }} />
      <button type="submit">Salvar</button>
      {msg && <p style={{ color: msg.includes("cadastrada") ? "green" : "red" }}>{msg}</p>}
    </form>
  );
}
