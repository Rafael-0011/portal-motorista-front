'use client';

import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/src/components/ProtectedRoute';
import { Card } from '@/src/components/Card';
import { MotoristaForm, MotoristaFormData } from '@/src/components/MotoristaForm';
import { useCreateMotorista } from '@/src/hooks/useMotoristas';

/**
 * Página de cadastro de novo motorista
 */
function NovoMotoristaContent() {
  const router = useRouter();
  const createMotorista = useCreateMotorista();

  const handleSubmit = async (data: MotoristaFormData) => {
    try {
      if (!data.senha) {
        alert('Senha é obrigatória para criar um novo motorista');
        return;
      }
      
      const payload: any = { ...data };
      
      if (!payload.tiposVeiculo || payload.tiposVeiculo.length === 0) {
        delete payload.tiposVeiculo;
      }
      
      await createMotorista.mutateAsync(payload);
      alert('Motorista cadastrado com sucesso!');
      router.push('/motoristas');
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
        'Erro ao cadastrar motorista. Verifique os dados e tente novamente.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#FDB913] shadow-sm border-b border-yellow-600">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Novo Motorista</h1>
          <p className="text-sm text-gray-800 mt-1">
            Preencha os dados para cadastrar um novo motorista
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <MotoristaForm
            onSubmit={handleSubmit}
            isLoading={createMotorista.isPending}
          />
        </Card>
      </main>
    </div>
  );
}

export default function NovoMotoristaPage() {
  return (
    <ProtectedRoute>
      <NovoMotoristaContent />
    </ProtectedRoute>
  );
}
