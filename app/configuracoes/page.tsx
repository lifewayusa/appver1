"use client";
import { useState } from "react";
import Link from "next/link";
import EmpresaForm from "./EmpresaForm";
import CidadeForm from "./CidadeForm";
import UniversidadeForm from "./UniversidadeForm";
import EscolaProfissionalForm from "./EscolaProfissionalForm";
import EscolaInglesForm from "./EscolaInglesForm";
import EscolaRegularForm from "./EscolaRegularForm";
import ApiExternaForm from "./ApiExternaForm";
import ApiExternaList from "./ApiExternaList";

const tabs = [
  { key: "cidades", label: "Cidades" },
  { key: "universidades", label: "Universidades" },
  { key: "escolas_profissionais", label: "Escolas Profissionais" },
  { key: "escolas_ingles", label: "Escolas de Inglês" },
  { key: "escolas_regulares", label: "Escolas Regulares" },
  { key: "listar", label: "Listar/Editar/Excluir" },
  { key: "apis", label: "APIs Externas" },
  { key: "empresa", label: "Perfil da Empresa" },
  { key: "atribuir_role", label: "Atribuir Perfil" },
];

export default function ConfiguracoesPage() {
  const [tab, setTab] = useState("cidades");

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", padding: 24 }}>
      <h1>Configurações</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "8px 16px",
              borderRadius: 4,
              border: tab === t.key ? "2px solid #0070f3" : "1px solid #ccc",
              background: tab === t.key ? "#e6f0ff" : "#fff",
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 24, minHeight: 300 }}>
        {tab === "cidades" && <CidadeForm />}
        {tab === "universidades" && <UniversidadeForm />}
        {tab === "escolas_profissionais" && <EscolaProfissionalForm />}
        {tab === "escolas_ingles" && <EscolaInglesForm />}
        {tab === "escolas_regulares" && <EscolaRegularForm />}
        {tab === "listar" && <div>Listagem/edição/exclusão genérica de qualquer tabela aqui</div>}
        {tab === "apis" && (
          <>
            <ApiExternaForm />
            <ApiExternaList />
          </>
        )}
        {tab === "empresa" && (
          <div>
            <h3>Perfil da Empresa</h3>
            <EmpresaForm />
          </div>
        )}
        {tab === "atribuir_role" && (
          <Link href="/configuracoes/atribuir-role">Ir para atribuição de perfil</Link>
        )}
      </div>
    </div>
  );
}
