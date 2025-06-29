"use client";
import { useEffect, useState } from "react";

export default function AtribuirRolePage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/list-users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/admin/set-user-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: selectedUser, role }),
    });
    const data = await res.json();
    if (res.ok) setMessage("Perfil atualizado com sucesso!");
    else setMessage(data.error || "Erro ao atualizar perfil");
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>Atribuir perfil de usuário</h2>
      <form onSubmit={handleSubmit}>
        <label>Usuário:</label>
        <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} required>
          <option value="">Selecione...</option>
          {users.map((u: any) => (
            <option key={u.id} value={u.id}>{u.name || u.email || u.id}</option>
          ))}
        </select>
        <br /><br />
        <label>Perfil:</label>
        <select value={role} onChange={e => setRole(e.target.value)} required>
          <option value="">Selecione...</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="reader">Leitor</option>
        </select>
        <br /><br />
        <button type="submit">Atribuir</button>
      </form>
      {message && <p style={{ color: message.includes('sucesso') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
}
