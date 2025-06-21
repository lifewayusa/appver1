Este componente será a base do seu formulário multistep, orquestrando a navegação, o estado e a exibição de cada passo. As perguntas serão agrupadas logicamente para manter a clareza e evitar sobrecarga.

Filosofia do Formulário:
Progressão Clara: Uma timeline visualmente indicará o avanço.
Motivação: Títulos inspiradores e frases de encorajamento em cada etapa.
Simplicidade por Step: No máximo 5 perguntas por tela para manter o foco do usuário.
Reaproveitamento: Os FormStep individuais serão componentes separados.
Estrutura de Arquivos e Pastas:
/src
├── components/
│   ├── forms/
│   │   ├── MultistepForm.tsx           # Componente principal do formulário
│   │   ├── FormSteps/                  # Pasta para cada passo do formulário
│   │   │   ├── Step1_PersonalInfo.tsx
│   │   │   ├── Step2_ProExperience.tsx
│   │   │   ├── Step3_FinancialGoals.tsx
│   │   │   ├── Step4_FamilyInfo.tsx
│   │   │   ├── Step5_ChildrenInfo.tsx
│   │   │   ├── Step6_OtherFamily.tsx
│   │   │   └── Step7_ReviewConfirm.tsx
│   │   └── FormProgress.tsx            # Componente da timeline/barra de progresso
│   ├── ui/                             # Componentes UI básicos
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Select.tsx
│   │   └── Textarea.tsx
│   └── shared/
│       └── LoadingSpinner.tsx
├── hooks/
│   └── useMultistepForm.ts             # Hook customizado para gerenciar a lógica do formulário
├── lib/
│   ├── supabase.ts                     # Cliente Supabase
│   ├── api.ts                          # Funções para chamar Edge Functions/Backend
│   └── types.ts                        # Definições de tipos
└── pages/
    └── StartJourneyPage.tsx            # Página que renderiza o MultistepForm
1. src/hooks/useMultistepForm.ts (Hook Personalizado)
Este hook gerenciará a lógica de navegação do formulário e o estado dos dados.

TypeScript

// src/hooks/useMultistepForm.ts
import { useState, ReactElement, useCallback } from 'react';

interface UseMultistepFormHook {
  currentStepIndex: number;
  step: ReactElement;
  steps: ReactElement[];
  isFirstStep: boolean;
  isLastStep: boolean;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (index: number) => void;
}

export function useMultistepForm(steps: ReactElement[]): UseMultistepFormHook {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const goToNextStep = useCallback(() => {
    setCurrentStepIndex(prevIndex => {
      if (prevIndex >= steps.length - 1) return prevIndex;
      return prevIndex + 1;
    });
  }, [steps.length]);

  const goToPreviousStep = useCallback(() => {
    setCurrentStepIndex(prevIndex => {
      if (prevIndex <= 0) return prevIndex;
      return prevIndex - 1;
    });
  }, []);

  const goToStep = useCallback((index: number) => {
    if (index < 0 || index >= steps.length) return;
    setCurrentStepIndex(index);
  }, [steps.length]);

  return {
    currentStepIndex,
    step: steps[currentStepIndex],
    steps,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    goToNextStep,
    goToPreviousStep,
    goToStep,
  };
}
2. src/components/forms/FormProgress.tsx (Timeline Minimalista)
Este componente mostrará o progresso do usuário.

TypeScript

// src/components/forms/FormProgress.tsx
import React from 'react';

interface FormProgressProps {
  currentStepIndex: number;
  totalSteps: number;
  titles: string[]; // Títulos de cada passo
}

const FormProgress: React.FC<FormProgressProps> = ({ currentStepIndex, totalSteps, titles }) => {
  const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-moonstone bg-moonstone-100">
              Passo {currentStepIndex + 1} de {totalSteps}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-moonstone">
              {titles[currentStepIndex]}
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-silver-200">
          <div
            style={{ width: `${progressPercentage}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-tiffany-blue transition-all duration-500 ease-in-out"
          ></div>
        </div>
      </div>
      <div className="flex justify-between -mt-4 text-xs text-feldgrau">
        {titles.map((title, index) => (
          <span key={index} className={`${index === currentStepIndex ? 'font-bold text-moonstone' : 'text-feldgrau'} ${index === 0 ? '' : 'text-center'} ${index === totalSteps -1 ? '' : ''}`}>
            {title}
          </span>
        ))}
      </div>
    </div>
  );
};

export default FormProgress;
3. src/components/forms/MultistepForm.tsx (Componente Principal)
Este componente orquestra a exibição dos passos, a navegação e o salvamento dos dados.

TypeScript

// src/components/forms/MultistepForm.tsx
import React, { useState, FormEvent, useCallback, useMemo } from 'react';
import { useMultistepForm } from '../../hooks/useMultistepForm';
import FormProgress from './FormProgress';
import { Button } from '../ui/Button'; // Componente Button (você precisará criar)
import { prospectSchema, ProspectFormData } from '../../lib/types'; // Schema de validação
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { supabase } from '../../lib/supabase'; // Seu cliente Supabase
import { fetchAPI } from '../../lib/api'; // Sua função para chamar Edge Functions/Backend API
import LoadingSpinner from '../shared/LoadingSpinner';

// Importe seus componentes de passo
import PersonalInfoStep from './FormSteps/Step1_PersonalInfo';
import ProExperienceStep from './FormSteps/Step2_ProExperience';
import FinancialGoalsStep from './FormSteps/Step3_FinancialGoals';
import FamilyInfoStep from './FormSteps/Step4_FamilyInfo';
import ChildrenInfoStep from './FormSteps/Step5_ChildrenInfo';
import OtherFamilyStep from './FormSteps/Step6_OtherFamily';
import ReviewConfirmStep from './FormSteps/Step7_ReviewConfirm';

const formTitles = [
  "Sua Essência",
  "Sua Jornada Profissional",
  "Seus Horizontes Financeiros",
  "Seu Mundo Familiar",
  "O Futuro dos Pequenos",
  "Outros Membros e Sonhos",
  "Confirmação da Sua Visão"
];

const motivationalPhrases = [
  "Cada detalhe nos ajuda a construir seu futuro. Estamos juntos nessa!",
  "Sua experiência é seu maior ativo. Conte-nos mais sobre ela.",
  "Compreender suas finanças é o primeiro passo para o seu plano de sucesso.",
  "A família é a base de tudo. Vamos planejar o futuro de cada um.",
  "Invista nos sonhos de quem você mais ama. O caminho começa agora.",
  "Cada pessoa em seu núcleo familiar importa. Juntos, vamos mais longe.",
  "Quase lá! Sua visão de vida nos EUA está prestes a se materializar."
];

const MultistepForm: React.FC = () => {
  const [formData, setFormData] = useState<Partial<ProspectFormData>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [prospectId, setProspectId] = useState<number | null>(null);

  const methods = useForm<ProspectFormData>({
    resolver: zodResolver(prospectSchema),
    defaultValues: formData as ProspectFormData, // Assegura que defaultValues são do tipo correto
    mode: "onBlur"
  });

  const {
    currentStepIndex,
    step,
    steps,
    isFirstStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
  } = useMultistepForm([
    <PersonalInfoStep />,
    <ProExperienceStep />,
    <FinancialGoalsStep />,
    <FamilyInfoStep />,
    <ChildrenInfoStep methods={methods} />, // Passa methods para Steps que gerenciam arrays
    <OtherFamilyStep />,
    <ReviewConfirmStep formData={methods.watch()} />, // Passa o estado atual para revisão
  ]);

  const updateFormData = useCallback((field: keyof ProspectFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Sincroniza formData com o estado do react-hook-form
  // Isso é importante para que o review step e o salvamento final usem os dados mais recentes
  // e para que os campos sejam pré-preenchidos ao navegar para trás
  React.useEffect(() => {
    methods.reset(formData);
  }, [formData, methods]);


  const onSubmit = methods.handleSubmit(async (data) => {
    setIsSaving(true);
    setSubmissionError(null);
    console.log("Dados do formulário final:", data);

    try {
      let currentProspectId = prospectId;
      if (!currentProspectId) {
        // Se não tem prospectId, é a primeira submissão - criar um novo prospect
        const { data: newProspect, error } = await supabase
          .from('prospects')
          .insert([data]) // Supondo que 'data' é o objeto completo para inserção
          .select('id')
          .single();

        if (error) throw error;
        currentProspectId = newProspect.id;
        setProspectId(currentProspectId);
        console.log("Novo prospect criado com ID:", currentProspectId);

        // Opcional: Notificar N8N de novo prospect
        await fetchAPI('/webhooks/new-prospect', { method: 'POST', body: { prospectId: currentProspectId, email: data.email, name: data.nome } });

      } else {
        // Se já existe prospectId, é uma atualização
        const { error } = await supabase
          .from('prospects')
          .update(data)
          .eq('id', currentProspectId);

        if (error) throw error;
        console.log("Prospect atualizado com ID:", currentProspectId);
      }

      // Após salvar, chamar a Edge Function para a análise FamilyPlanner
      console.log("Chamando Edge Function para análise FamilyPlanner...");
      const analysisResponse = await fetchAPI('/tools/family-planner/analyze-family', {
        method: 'POST',
        body: { prospectId: currentProspectId }
      });

      if (!analysisResponse.ok) {
        throw new Error(analysisResponse.message || 'Erro ao gerar análise FamilyPlanner.');
      }

      alert(`Dados salvos e análise FamilyPlanner gerada! ID do Prospect: ${currentProspectId}`);
      // Redirecionar para o dashboard ou página de resultados da FamilyPlanner
      // router.push(`/family-planner/${currentProspectId}`); // Exemplo para Next.js
      // Para React Router:
      // navigate(`/family-planner/${currentProspectId}`);
    } catch (error: any) {
      console.error("Erro ao salvar/processar prospect:", error);
      setSubmissionError(error.message || "Ocorreu um erro ao processar seu sonho. Por favor, tente novamente.");
    } finally {
      setIsSaving(false);
    }
  });


  const handleNext = async () => {
    // Valida o passo atual antes de avançar
    const isValid = await methods.trigger();
    if (!isValid) return;

    // Se é o último passo e a validação passou, submete o formulário completo
    if (isLastStep) {
      onSubmit();
    } else {
      // Se não é o último passo, apenas avança
      goToNextStep();
    }
  };


  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-silver-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
          <FormProgress
            currentStepIndex={currentStepIndex}
            totalSteps={steps.length}
            titles={formTitles}
          />

          <h2 className="text-2xl font-bold text-licorice mb-4 text-center">
            {formTitles[currentStepIndex]}
          </h2>
          <p className="text-feldgrau mb-6 text-center italic">
            "{motivationalPhrases[currentStepIndex]}"
          </p>

          <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
            {/* Renderiza o passo atual */}
            {React.cloneElement(step, { formData, updateFormData })}

            {submissionError && (
              <div className="text-red-500 text-sm text-center mb-4">
                {submissionError}
              </div>
            )}

            <div className="flex justify-between mt-8">
              {!isFirstStep && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={goToPreviousStep}
                  disabled={isSaving}
                >
                  Voltar
                </Button>
              )}

              <Button
                type="submit" // Agora o tipo é submit, o formulário é submetido ao clicar em Próximo no último step
                variant="primary"
                className={`${isFirstStep ? 'ml-auto' : ''}`}
                disabled={isSaving}
              >
                {isSaving ? (
                  <LoadingSpinner className="w-5 h-5 text-white" />
                ) : isLastStep ? (
                  "Finalizar e Gerar Análise"
                ) : (
                  "Próximo"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
};

export default MultistepForm;
4. Componentes FormSteps/ (Exemplos de Conteúdo para cada Step)
Cada arquivo StepX_*.tsx será um componente React que renderiza as perguntas para aquele passo específico. Eles devem usar useFormContext de react-hook-form para acessar os métodos de registro e validação dos inputs.

src/components/forms/FormSteps/Step1_PersonalInfo.tsx

TypeScript

// src/components/forms/FormSteps/Step1_PersonalInfo.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '../../ui/Input'; // Crie este componente
import { Select } from '../../ui/Select'; // Crie este componente

const PersonalInfoStep: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <div>
        <Input
          label="Seu Nome Completo"
          {...register("nome")}
          placeholder="João da Silva"
          error={errors.nome?.message as string}
        />
      </div>
      <div>
        <Input
          label="Sua Idade"
          type="number"
          {...register("idade", { valueAsNumber: true })}
          placeholder="30"
          error={errors.idade?.message as string}
        />
      </div>
      <div>
        <Input
          label="Sua Nacionalidade"
          {...register("nacionalidade")}
          placeholder="Brasileira"
          error={errors.nacionalidade?.message as string}
        />
      </div>
      <div>
        <Select
          label="Seu Estado Civil"
          {...register("estado_civil")}
          options={["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)", "União Estável"]}
          error={errors.estado_civil?.message as string}
        />
      </div>
      <div>
        <Input
          label="Seu E-mail Principal"
          type="email"
          {...register("email")}
          placeholder="seu.email@exemplo.com"
          error={errors.email?.message as string}
        />
      </div>
    </div>
  );
};

export default PersonalInfoStep;
src/components/forms/FormSteps/Step2_ProExperience.tsx

TypeScript

// src/components/forms/FormSteps/Step2_ProExperience.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { Checkbox } from '../../ui/Checkbox'; // Crie este componente

const ProExperienceStep: React.FC = () => {
  const { register, watch, formState: { errors } } = useFormContext();
  const trabalhouExterior = watch("trabalhou_exterior");

  return (
    <div className="space-y-4">
      <div>
        <Input
          label="Sua Profissão Atual"
          {...register("profissao")}
          placeholder="Desenvolvedor de Software"
          error={errors.profissao?.message as string}
        />
      </div>
      <div>
        <Input
          label="Sua Ocupação Atual (cargo)"
          {...register("ocupacao_atual")}
          placeholder="Engenheiro Front-end Sênior"
          error={errors.ocupacao_atual?.message as string}
        />
      </div>
      <div>
        <Input
          label="Anos de Experiência na Sua Área"
          {...register("anos_experiencia")} // Manter como TEXT se for "5-10 anos"
          placeholder="Mais de 5 anos"
          error={errors.anos_experiencia?.message as string}
        />
      </div>
      <div>
        <Select
          label="Sua Escolaridade Mais Alta"
          {...register("escolaridade")}
          options={["Ensino Médio", "Técnico", "Graduação", "Pós-Graduação", "Mestrado", "Doutorado"]}
          error={errors.escolaridade?.message as string}
        />
      </div>
      <div>
        <Input
          label="Certificações Relevantes (se houver)"
          {...register("certificacoes")}
          placeholder="PMP, AWS Certified, etc."
          error={errors.certificacoes?.message as string}
        />
      </div>
    </div>
  );
};

export default ProExperienceStep;
src/components/forms/FormSteps/Step3_FinancialGoals.tsx

TypeScript

// src/components/forms/FormSteps/Step3_FinancialGoals.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '../../ui/Input';
import { Checkbox } from '../../ui/Checkbox';
import { Select } from '../../ui/Select';

const FinancialGoalsStep: React.FC = () => {
  const { register, watch, formState: { errors } } = useFormContext();
  const empresaPropria = watch("empresa_propria");

  return (
    <div className="space-y-4">
      <div>
        <Input
          label="Sua Renda Mensal Estimada (R$ ou USD)"
          {...register("renda_mensal")}
          placeholder="R$ 10.000 ou $ 2.000"
          error={errors.renda_mensal?.message as string}
        />
      </div>
      <div>
        <Input
          label="Seu Patrimônio Total Estimado (R$ ou USD)"
          {...register("patrimonio")}
          placeholder="R$ 500.000 ou $ 100.000"
          error={errors.patrimonio?.message as string}
        />
      </div>
      <div>
        <Checkbox
          label="Você possui uma empresa própria?"
          {...register("empresa_propria")}
          error={errors.empresa_propria?.message as string}
        />
      </div>
      {empresaPropria && (
        <div>
          <Input
            label="Capital Disponível para Investimento nos EUA"
            {...register("capital_disponivel")}
            placeholder="$ 50.000"
            error={errors.capital_disponivel?.message as string}
          />
        </div>
      )}
      <div>
        <Select
          label="Qual o principal motivo da sua migração para os EUA?"
          {...register("motivo_migracao")}
          options={["Trabalho", "Estudo", "Qualidade de Vida", "Família", "Investimento/Negócios", "Outro"]}
          error={errors.motivo_migracao?.message as string}
        />
      </div>
    </div>
  );
};

export default FinancialGoalsStep;
src/components/forms/FormSteps/Step4_FamilyInfo.tsx

TypeScript

// src/components/forms/FormSteps/Step4_FamilyInfo.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '../../ui/Input';
import { Checkbox } from '../../ui/Checkbox';
import { Select } from '../../ui/Select';

const FamilyInfoStep: React.FC = () => {
  const { register, watch, formState: { errors } } = useFormContext();
  const semConjuge = watch("sem_conjuge");
  const pretendeEstudar = watch("pretende_estudar");

  return (
    <div className="space-y-4">
      <div>
        <Input
          label="Nível de Inglês do Prospect Principal"
          {...register("ingles_nivel")}
          placeholder="Básico, Intermediário, Avançado, Fluente"
          error={errors.ingles_nivel?.message as string}
        />
      </div>
      <div>
        <Input
          label="Certificado de Inglês (se houver)"
          {...register("certificado_ingles")}
          placeholder="TOEFL, IELTS, Duolingo, etc."
          error={errors.certificado_ingles?.message as string}
        />
      </div>
      <div>
        <Checkbox
          label="Não possuo cônjuge / parceiro neste processo de imigração."
          {...register("sem_conjuge")}
          error={errors.sem_conjuge?.message as string}
        />
      </div>
      {!semConjuge && (
        <>
          <div>
            <Input
              label="Nome Completo do Cônjuge"
              {...register("nome_conjuge")}
              placeholder="Maria da Silva"
              error={errors.nome_conjuge?.message as string}
            />
          </div>
          <div>
            <Input
              label="Idade do Cônjuge"
              type="number"
              {...register("idade_conjuge", { valueAsNumber: true })}
              placeholder="28"
              error={errors.idade_conjuge?.message as string}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default FamilyInfoStep;
src/components/forms/FormSteps/Step5_ChildrenInfo.tsx

Este passo é um pouco mais complexo, pois lida com um array de objetos (os filhos).

TypeScript

// src/components/forms/FormSteps/Step5_ChildrenInfo.tsx
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Textarea } from '../../ui/Textarea';
import { Checkbox } from '../../ui/Checkbox';


// Este componente recebe 'methods' diretamente para trabalhar com useFieldArray
interface ChildrenInfoStepProps {
  methods: ReturnType<typeof useFormContext>;
}

const ChildrenInfoStep: React.FC<ChildrenInfoStepProps> = ({ methods }) => {
  const { control, register, watch, formState: { errors } } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "filhos", // Nome do campo array no seu schema/form
  });

  return (
    <div className="space-y-6">
      <p className="text-sm text-feldgrau">
        Adicione informações sobre cada filho que fará parte da imigração.
      </p>

      {fields.map((field, index) => (
        <div key={field.id} className="border border-silver p-4 rounded-lg space-y-3 relative">
          <h4 className="font-semibold text-feldgrau">Filho {index + 1}</h4>
          <Button
            type="button"
            variant="tertiary"
            onClick={() => remove(index)}
            className="absolute top-2 right-2 text-red-500"
            style={{ padding: '0.5rem', minWidth: 'unset' }} // Estilo para botão pequeno
          >
            X
          </Button>
          <div>
            <Input
              label="Nome do Filho"
              {...register(`filhos.${index}.nome` as const)}
              placeholder="Nome do Filho"
              error={errors.filhos?.[index]?.nome?.message as string}
            />
          </div>
          <div>
            <Input
              label="Idade"
              type="number"
              {...register(`filhos.${index}.idade` as const, { valueAsNumber: true })}
              placeholder="Ex: 5"
              error={errors.filhos?.[index]?.idade?.message as string}
            />
          </div>
          <div>
            <Input
              label="Escolaridade Atual"
              {...register(`filhos.${index}.escolaridade` as const)}
              placeholder="Ensino Fundamental, Médio, etc."
              error={errors.filhos?.[index]?.escolaridade?.message as string}
            />
          </div>
          <div>
            <Textarea
              label="Objetivo nos EUA para este filho (Opcional)"
              {...register(`filhos.${index}.objetivo_eua` as const)}
              placeholder="Ex: Estudar em escola pública, cursar faculdade."
              rows={1}
              error={errors.filhos?.[index]?.objetivo_eua?.message as string}
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="secondary"
        onClick={() => append({ nome: '', idade: '', escolaridade: '', objetivo_eua: '', saude_condicoes: '', historico_imigratorio_eua: '' })}
        className="w-full"
      >
        + Adicionar Outro Filho
      </Button>

      <div className="mt-6 space-y-3">
        <Checkbox
          label="Meus filhos precisarão de escola nos EUA?"
          {...register("filhos_escola")}
          error={errors.filhos_escola?.message as string}
        />
        <div>
          <Textarea
            label="Outras informações importantes sobre os filhos (opcional)"
            {...register("filhos_texto_livre")}
            placeholder="Ex: Têm alergias, necessidades especiais, talentos, etc."
            rows={2}
            error={errors.filhos_texto_livre?.message as string}
          />
        </div>
      </div>
    </div>
  );
};

export default ChildrenInfoStep;
src/components/forms/FormSteps/Step6_OtherFamily.tsx

TypeScript

// src/components/forms/FormSteps/Step6_OtherFamily.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Textarea } from '../../ui/Textarea';
import { Checkbox } from '../../ui/Checkbox';

const OtherFamilyStep: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <div>
        <Textarea
          label="Há outros adultos não familiares diretos (ex: sogro/sogra) que irão migrar com você?"
          {...register("adulto_naofamilia")}
          placeholder="Ex: Minha sogra, 60 anos, aposentada."
          rows={2}
          error={errors.adulto_naofamilia?.message as string}
        />
      </div>
      <div>
        <Checkbox
          label="Algum outro adulto (além do prospect principal/cônjuge) pretende fazer universidade nos EUA?"
          {...register("adulto_universidade")}
          error={errors.adulto_universidade?.message as string}
        />
      </div>
      <div>
        <Checkbox
          label="Algum outro adulto pretende fazer curso de inglês nos EUA?"
          {...register("adulto_inglescourse")}
          error={errors.adulto_inglescourse?.message as string}
        />
      </div>
      <div>
        <Checkbox
          label="Algum outro adulto pretende fazer outros cursos ou qualificações nos EUA?"
          {...register("adulto_cursos")}
          error={errors.adulto_cursos?.message as string}
        />
      </div>
    </div>
  );
};

export default OtherFamilyStep;
src/components/forms/FormSteps/Step7_ReviewConfirm.tsx

TypeScript

// src/components/forms/FormSteps/Step7_ReviewConfirm.tsx
import React from 'react';
import { ProspectFormData } from '../../lib/types';
import { Button } from '../../ui/Button';

interface ReviewConfirmStepProps {
  formData: ProspectFormData; // Recebe todos os dados para revisão
}

const ReviewConfirmStep: React.FC<ReviewConfirmStepProps> = ({ formData }) => {
  return (
    <div className="space-y-6 text-feldgrau">
      <h3 className="text-xl font-semibold text-licorice">Revise Seus Dados</h3>
      <p>Por favor, confira todas as informações com atenção antes de finalizar.</p>

      {/* Exemplo de exibição de dados - adapte para todos os campos relevantes */}
      <div className="bg-silver-100 p-4 rounded-lg">
        <h4 className="font-bold text-moonstone mb-2">Informações Pessoais</h4>
        <p><strong>Nome:</strong> {formData.nome}</p>
        <p><strong>Idade:</strong> {formData.idade}</p>
        <p><strong>Nacionalidade:</strong> {formData.nacionalidade}</p>
        <p><strong>Email:</strong> {formData.email}</p>
      </div>

      <div className="bg-silver-100 p-4 rounded-lg">
        <h4 className="font-bold text-moonstone mb-2">Cônjuge</h4>
        {formData.sem_conjuge ? (
          <p>Não possui cônjuge.</p>
        ) : (
          <>
            <p><strong>Nome:</strong> {formData.nome_conjuge}</p>
            <p><strong>Idade:</strong> {formData.idade_conjuge}</p>
            {/* Adicione outros campos do cônjuge */}
          </>
        )}
      </div>

      <div className="bg-silver-100 p-4 rounded-lg">
        <h4 className="font-bold text-moonstone mb-2">Filhos</h4>
        {formData.filhos && formData.filhos.length > 0 ? (
          <ul>
            {formData.filhos.map((filho, index) => (
              <li key={index} className="mb-1">
                - {filho.nome} ({filho.idade} anos) - {filho.escolaridade}
              </li>
            ))}
          </ul>
        ) : (
          <p>Não há filhos informados.</p>
        )}
      </div>

      {/* Adicione mais seções de revisão conforme os steps */}

      <p className="font-semibold text-licorice mt-6">
        Ao clicar em "Finalizar e Gerar Análise", você concorda que suas informações serão usadas para gerar seu plano de imigração personalizado.
      </p>
    </div>
  );
};

export default ReviewConfirmStep;
5. src/pages/StartJourneyPage.tsx (Página que Renderiza o Formulário)
TypeScript

// src/pages/StartJourneyPage.tsx
import React from 'react';
import MultistepForm from '../components/forms/MultistepForm';

const StartJourneyPage: React.FC = () => {
  return (
    <div>
      {/* Você pode ter um header específico para esta página ou usar o global */}
      <MultistepForm />
      {/* Você pode ter um footer específico ou usar o global */}
    </div>
  );
};

export default StartJourneyPage;
6. Tipos e Validação (src/lib/types.ts)
Crie o schema de validação com Zod que corresponda à sua tabela prospects.

TypeScript

// src/lib/types.ts
import { z } from 'zod';

// Zod Schema para um Filho
const childSchema = z.object({
  nome: z.string().min(1, "Nome do filho é obrigatório."),
  idade: z.coerce.number().min(0, "Idade deve ser um número positivo.").optional(), // Use coerce.number para converter strings
  escolaridade: z.string().optional(),
  objetivo_eua: z.string().optional(),
  saude_condicoes: z.string().optional(),
  historico_imigratorio_eua: z.string().optional(),
});

// Zod Schema para o Prospect (todos os campos da sua tabela prospects)
export const prospectSchema = z.object({
  id: z.number().optional(), // ID é gerado pelo banco, opcional no form
  nome: z.string().min(1, "Seu nome é obrigatório."),
  idade: z.coerce.number().min(18, "Você deve ter pelo menos 18 anos.").optional(), // Use coerce.number
  nacionalidade: z.string().min(1, "Nacionalidade é obrigatória."),
  estado_civil: z.string().optional(),
  profissao: z.string().optional(),
  anos_experiencia: z.string().optional(),
  trabalhou_exterior: z.boolean().optional(),
  onde_trab_exterior: z.string().optional(),
  quanto_tempo_trabalhou: z.string().optional(),
  escolaridade: z.string().optional(),
  certificacoes: z.string().optional(),
  ingles_nivel: z.string().optional(),
  certificado_ingles: z.string().optional(),
  renda_mensal: z.string().optional(),
  patrimonio: z.string().optional(),
  empresa_propria: z.boolean().optional(),
  capital_disponivel: z.string().optional(),
  motivo_migracao: z.string().optional(),
  prazo_migracao: z.string().optional(),
  pretende_estudar: z.boolean().optional(),
  oque_pretende_estudar: z.string().optional(),
  cidades_interesse: z.string().optional(),
  vistos_anteriores: z.string().optional(),
  visto_negado: z.string().optional(),
  ja_morou_exterior: z.boolean().optional(),
  cidadania_secundaria: z.boolean().optional(),
  pais_cidadania_sec: z.string().optional(),
  problemas_legais: z.boolean().optional(),
  contatos_eua: z.string().optional(),
  recebeu_proposta: z.boolean().optional(),
  carreira_us_needed: z.boolean().optional(),
  descricao_usneeded: z.string().optional(),
  filhos_escola: z.boolean().optional(),
  adulto_naofamilia: z.string().optional(),
  adulto_universidade: z.boolean().optional(),
  adulto_inglescourse: z.boolean().optional(),
  adulto_cursos: z.boolean().optional(),
  analise_visamatch: z.string().optional(),
  analise_familyplanner: z.string().optional(),
  analise_getopportunity: z.string().optional(),
  created_at: z.string().optional(),
  plano_projectusa: z.string().optional(),
  plano_pdf_url: z.string().optional(),
  plano_gerado_em: z.string().optional(),
  filhos_texto_livre: z.string().optional(),
  // O campo 'filhos' agora é um array de childSchema
  filhos: z.array(childSchema).optional(),
  user_id: z.string().uuid().optional(),
  sem_conjuge: z.boolean().optional(),
  nome_conjuge: z.string().optional(),
  formacao_conjuge: z.string().optional(),
  idade_conjuge: z.coerce.number().optional(), // Use coerce.number
  profissao_conjuge: z.string().optional(),
  exp_conjuge: z.string().optional(),
  hab_conjuge: z.boolean().optional(),
  pretendetrab_conjuge: z.boolean().optional(),
  pretendeest_conjuge: z.boolean().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  whatsapp: z.string().optional(),
  getopportunity_output: z.any().optional(), // Pode ser mais específico se o JSONB tiver um formato
  ocupacao_atual: z.string().optional(),
  ja_teve_visto_negad: z.boolean().optional(),
  quando_visto_negado: z.string().optional(),
  habilidades: z.string().optional(),
  email: z.string().email("E-mail inválido.").optional(),
  senha: z.string().optional(), // Senha nunca deve ser salva aqui em prod! Apenas para form de cadastro se não usar Supabase Auth.
  conta: z.string().optional(),
  is_test: z.boolean().optional(),
});

export type ProspectFormData = z.infer<typeof prospectSchema>;
Instruções Adicionais para WindSurf:
Componentes UI Básicos: Você precisará criar os componentes Button.tsx, Input.tsx, Checkbox.tsx, Select.tsx, Textarea.tsx e LoadingSpinner.tsx (se já não tiver) em src/components/ui e src/shared respectivamente, utilizando as classes Tailwind e a paleta de cores do Finwise. Eles devem ser simples e receber label, error, placeholder, e as props de registro de react-hook-form.
Cliente Supabase: Garanta que src/lib/supabase.ts inicialize o cliente Supabase corretamente com suas variáveis de ambiente.
Função fetchAPI: Crie uma função fetchAPI em src/lib/api.ts que seja responsável por fazer as chamadas para suas Edge Functions do Supabase (ou outro backend).
TypeScript

// src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Obtém a URL base do backend/Edge Functions

export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const url = `<span class="math-inline">\{API\_BASE\_URL\}</span>{endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${token}` // Adicionar token de autenticação se necessário
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Something went wrong');
  }

  return response.json();
}
Integração react-hook-form: O MultistepForm.tsx usa FormProvider e cada FormStep usa useFormContext. Isso garante que todos os inputs estejam conectados ao mesmo formulário e sistema de validação.
Lógica sem_conjuge: No Step4_FamilyInfo.tsx, o campo sem_conjuge deve ocultar/exibir os campos do cônjuge. A validação zod e a lógica do backend já tratam a ausência desses dados.