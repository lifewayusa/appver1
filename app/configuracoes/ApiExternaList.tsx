import { useEffect, useState } from "react";

export default function ApiExternaList() {
  const [apis, setApis] = useState([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [status, setStatus] = useState<string | null>(null);

  const fetchApis = async () => {
    const res = await fetch("/api/admin/apis-externas");
    const data = await res.json();
    setApis(data);
  };

  useEffect(() => {
    fetchApis();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir esta API?")) return;
    const res = await fetch(`/api/admin/apis-externas?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setStatus("API excluída com sucesso.");
      fetchApis();
    } else {
      setStatus("Erro ao excluir API.");
    }
  };

  const handleEdit = (api: any) => {
    setEditId(api.id);
    setEditForm(api);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    const res = await fetch(`/api/admin/apis-externas?id=${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      setStatus("API atualizada com sucesso.");
      setEditId(null);
      fetchApis();
    } else {
      setStatus("Erro ao atualizar API.");
    }
  };

  return (
    <div style={{ marginTop: 32 }}>
      <h4>APIs Externas Cadastradas</h4>
      {status && <div style={{ marginBottom: 12 }}>{status}</div>}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Chave</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {apis.map((api: any) => (
            <tr key={api.id} style={{ borderBottom: "1px solid #eee" }}>
              {editId === api.id ? (
                <>
                  <td><input name="nome" value={editForm.nome} onChange={handleEditChange} /></td>
                  <td><input name="tipo" value={editForm.tipo} onChange={handleEditChange} /></td>
                  <td><input name="chave" value={editForm.chave} onChange={handleEditChange} /></td>
                  <td><input name="descricao" value={editForm.descricao} onChange={handleEditChange} /></td>
                  <td>
                    <button onClick={handleEditSave}>Salvar</button>
                    <button onClick={() => setEditId(null)}>Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{api.nome}</td>
                  <td>{api.tipo}</td>
                  <td>{api.chave}</td>
                  <td>{api.descricao}</td>
                  <td>
                    <button onClick={() => handleEdit(api)}>Editar</button>
                    <button onClick={() => handleDelete(api.id)} style={{ color: "red" }}>Excluir</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
