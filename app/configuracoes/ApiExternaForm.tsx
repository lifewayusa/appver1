import { useState } from "react";

const initialState = {
  nome: "",
  tipo: "",
  chave: "",
  descricao: "",
};

const tipos = [
  { value: "supabase", label: "Supabase" },
  { value: "openai", label: "OpenAI" },
  { value: "stripe", label: "Stripe" },
  { value: "unsplash", label: "Unsplash" },
  { value: "pixabay", label: "Pixabay" },
  { value: "pexels", label: "Pexels" },
];

export default function ApiExternaForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    const res = await fetch("/api/admin/apis-externas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setStatus("API cadastrada com sucesso!");
      setForm(initialState);
    } else {
      setStatus("Erro ao cadastrar API.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
      <h3>Cadastro de API Externa</h3>
      <div style={{ marginBottom: 12 }}>
        <label>Nome:<br />
          <input name="nome" value={form.nome} onChange={handleChange} required style={{ width: "100%" }} />
        </label>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Tipo:<br />
          <select name="tipo" value={form.tipo} onChange={handleChange} required style={{ width: "100%" }}>
            <option value="">Selecione...</option>
            {tipos.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </label>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Chave/Token:<br />
          <input name="chave" value={form.chave} onChange={handleChange} required style={{ width: "100%" }} />
        </label>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Descrição:<br />
          <textarea name="descricao" value={form.descricao} onChange={handleChange} style={{ width: "100%" }} />
        </label>
      </div>
      <button type="submit">Salvar</button>
      {status && <div style={{ marginTop: 12 }}>{status}</div>}
    </form>
  );
}
