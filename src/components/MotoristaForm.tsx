'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/src/components/Input';
import { Select } from '@/src/components/Select';
import { MultiSelect } from '@/src/components/MultiSelect';
import { Button } from '@/src/components/Button';
import { TipoVeiculo, TipoVeiculoLabels, Role, Status } from '@/types';
import { UFS } from '@/utils/helpers';
import { useVehicleTypes } from '@/src/hooks/useVehicleTypes';

// Schema base compartilhado
const baseSchema = {
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  cidade: z.string().min(2, 'Cidade é obrigatória'),
  uf: z.string().length(2, 'Selecione uma UF'),
  tiposVeiculo: z.array(z.enum(TipoVeiculo)).optional(),
  role: z.enum(Role),
  status: z.enum(Status),
};

// Schema para criação (senha obrigatória)
const createSchema = z.object({
  ...baseSchema,
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

// Schema para edição (senha opcional)
const editSchema = z.object({
  ...baseSchema,
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').optional().or(z.literal('')),
});

export type CreateMotoristaFormData = z.infer<typeof createSchema>;
export type EditMotoristaFormData = z.infer<typeof editSchema>;
export type MotoristaFormData = CreateMotoristaFormData | EditMotoristaFormData;

interface MotoristaFormProps {
  initialData?: Partial<EditMotoristaFormData>;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  isEdit?: boolean;
}

/**
 * Formulário reutilizável para cadastro e edição de motorista
 * Utiliza react-hook-form com zod para validação
 */
export function MotoristaForm({
  initialData,
  onSubmit,
  isLoading = false,
  isEdit = false,
}: MotoristaFormProps) {
  const { data: vehicleTypes, isLoading: loadingVehicleTypes } = useVehicleTypes();
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(isEdit ? editSchema : createSchema),
    defaultValues: {
      nome: initialData?.nome || '',
      email: initialData?.email || '',
      senha: '',
      telefone: initialData?.telefone || '',
      cidade: initialData?.cidade || '',
      uf: initialData?.uf || '',
      tiposVeiculo: initialData?.tiposVeiculo || [],
      role: initialData?.role || Role.MOTORISTA,
      status: initialData?.status || Status.ATIVO,
    },
  });

  const selectedTipos = watch('tiposVeiculo') || [];

  const handleFormSubmit = async (data: any) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Informações Básicas */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Informações Básicas</h3>
        
        <Input
          label="Nome Completo"
          placeholder="Ex: João Silva"
          error={errors.nome?.message as string}
          {...register('nome')}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="email@exemplo.com"
            error={errors.email?.message as string}
            {...register('email')}
            required
          />

          <Input
            label={isEdit ? 'Nova Senha (opcional)' : 'Senha'}
            type="password"
            placeholder={isEdit ? 'Deixe em branco para manter' : 'Mínimo 6 caracteres'}
            error={errors.senha?.message as string}
            {...register('senha')}
            required={!isEdit}
          />
        </div>

        <Input
          label="Telefone"
          placeholder="Ex: (11) 91111-1111"
          error={errors.telefone?.message as string}
          {...register('telefone')}
          required
        />
      </div>

      {/* Localização */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Localização</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Cidade"
              placeholder="Ex: São Paulo"
              error={errors.cidade?.message as string}
              {...register('cidade')}
              required
            />
          </div>

          <Select
            label="Estado (UF)"
            placeholder="Selecione"
            error={errors.uf?.message as string}
            options={UFS.map((uf) => ({ value: uf, label: uf }))}
            {...register('uf')}
            required
          />
        </div>
      </div>

      {/* Tipos de Veículo */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Tipos de Veículo
          <span className="text-red-500 ml-1">*</span>
        </h3>
        
        <Controller
          name="tiposVeiculo"
          control={control}
          render={({ field }) => (
            <MultiSelect
              placeholder="Selecione os tipos de veículo"
              options={vehicleTypes || []}
              value={field.value || []}
              onChange={field.onChange}
              disabled={loadingVehicleTypes}
              error={errors.tiposVeiculo?.message as string}
            />
          )}
        />
      </div>

      {/* Permissões e Status */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Permissões e Status
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Tipo de Usuário"
            error={errors.role?.message as string}
            options={[
              { value: Role.MOTORISTA, label: 'Motorista' },
              { value: Role.USUARIO, label: 'Usuário' },
              { value: Role.ADMIN, label: 'Administrador' },
            ]}
            {...register('role')}
            required
          />

          <Select
            label="Status"
            error={errors.status?.message as string}
            options={[
              { value: Status.ATIVO, label: 'Ativo' },
              { value: Status.INATIVO, label: 'Inativo' },
              { value: Status.BLOQUEADO, label: 'Bloqueado' },
            ]}
            {...register('status')}
            required
          />
        </div>
      </div>

      {/* Ações */}
      <div className="flex gap-3 pt-4 border-t">
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Atualizar Motorista' : 'Cadastrar Motorista'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
