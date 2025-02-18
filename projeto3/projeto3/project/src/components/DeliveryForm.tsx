import React, { useState } from 'react';
import { Search } from 'lucide-react';

const DeliveryForm: React.FC = () => {
  const [address, setAddress] = useState({
    cep: '',
    street: '',
    neighborhood: '',
    city: '',
    number: ''
  });

  const fetchAddress = async () => {
    if (!address.cep) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${address.cep}/json/`);
      if (!response.ok) throw new Error('Erro ao buscar o CEP.');
      const data = await response.json();

      if (data.erro || !/votuporanga/i.test(data.localidade)) {
        alert('O CEP fornecido não é válido ou não pertence a Votuporanga.');
        return;
      }

      setAddress(prev => ({
        ...prev,
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || ''
      }));
    } catch (error) {
      console.error(error);
      alert('Erro ao buscar o endereço. Tente novamente.');
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          CEP
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={address.cep}
            onChange={(e) => setAddress(prev => ({ ...prev, cep: e.target.value }))}
            onBlur={fetchAddress}
            placeholder="Digite seu CEP"
            maxLength={9}
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={fetchAddress}
            className="p-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            <Search size={20} />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rua
        </label>
        <input
          type="text"
          value={address.street}
          readOnly
          className="w-full p-2 border rounded bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bairro
        </label>
        <input
          type="text"
          value={address.neighborhood}
          readOnly
          className="w-full p-2 border rounded bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cidade
        </label>
        <input
          type="text"
          value={address.city}
          readOnly
          className="w-full p-2 border rounded bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Número
        </label>
        <input
          type="text"
          value={address.number}
          onChange={(e) => setAddress(prev => ({ ...prev, number: e.target.value }))}
          placeholder="Digite o número"
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  );
};

export default DeliveryForm;