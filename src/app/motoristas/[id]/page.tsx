'use client';

import { useRouter, useParams } from 'next/navigation';
import { ProtectedRoute } from '@/src/components/ProtectedRoute';
import { Card } from '@/src/components/Card';
import { MotoristaForm, MotoristaFormData } from '@/src/components/MotoristaForm';
import { useMotorista, useUpdateMotorista } from '@/src/hooks/useMotoristas';

/**
 * Página de edição de motorista
 */
function EditarMotoristaContent() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data: motorista, isLoading: loadingMotorista } = useMotorista(id);
  const updateMotorista = useUpdateMotorista();

  const handleSubmit = async (data: MotoristaFormData) => {
    try {
      const payload: any = { ...data };
      
      if (!payload.tiposVeiculo || payload.tiposVeiculo.length === 0) {
        delete payload.tiposVeiculo;
      }
      
      if (!payload.senha || payload.senha === '') {
        delete payload.senha;
      }
      
      await updateMotorista.mutateAsync({ id, data: payload });
      alert('Motorista atualizado com sucesso!');
      router.push('/motoristas');
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
        'Erro ao atualizar motorista. Verifique os dados e tente novamente.'
      );
    }
  };

  if (loadingMotorista) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97316] mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando motorista...</p>
        </div>
      </div>
    );
  }

  if (!motorista) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <p className="text-red-600">Motorista não encontrado.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#FDB913] shadow-sm border-b border-yellow-600">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Editar Motorista</h1>
          <p className="text-sm text-gray-800 mt-1">
            Atualize os dados do motorista {motorista.nome}
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <MotoristaForm
            initialData={motorista}
            onSubmit={handleSubmit}
            isLoading={updateMotorista.isPending}
            isEdit={true}
          />
        </Card>
      </main>
    </div>
  );
}

export default function EditarMotoristaPage() {
  return (
    <ProtectedRoute>
      <EditarMotoristaContent />
    </ProtectedRoute>
  );
}
