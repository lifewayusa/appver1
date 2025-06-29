"use client";
import { useEffect, useState } from "react";

const campos = [
  { name: "nome", label: "Nome da Empresa" },
  { name: "endereco", label: "Endereço" },
  { name: "cidade", label: "Cidade" },
  { name: "zip", label: "CEP" },
  { name: "estado", label: "Estado" },
  { name: "email", label: "E-mail" },
  { name: "whatsapp", label: "WhatsApp" },
  { name: "slogan", label: "Slogan" },
  { name: "facebook", label: "Página no Facebook" },
  { name: "instagram", label: "Instagram" },
  { name: "x", label: "X (Twitter)" },
  { name: "youtube", label: "Canal no YouTube" },
  { name: "linkedin", label: "LinkedIn" },
];

export default function EmpresaForm() {
  const [form, setForm] = useState<any>({});
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/empresa")
      .then((res) => res.json())
      .then((data) => data.empresa && setForm(data.empresa));
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/admin/empresa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) setMsg("Dados salvos com sucesso!");
    else setMsg("Erro ao salvar dados");
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
      {campos.map((c) => (
        <div key={c.name} style={{ marginBottom: 12 }}>
          <label>{c.label}</label>
          <input
            type="text"
            name={c.name}
            value={form[c.name] || ""}
            onChange={handleChange}
            style={{ width: "100%", padding: 6, borderRadius: 4, border: "1px solid #ccc" }}
          />
        </div>
      ))}
      <button type="submit">Salvar</button>
      {msg && <p style={{ color: msg.includes("sucesso") ? "green" : "red" }}>{msg}</p>}
    </form>
  );
}
