import React, { useState, useMemo } from 'react';
import { X, Clock } from 'lucide-react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose }) => {
  const availableTimeSlots = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    
    // All possible time slots
    const allTimeSlots = [
      '19:00', '19:30', '20:00', '20:30',
      '21:00', '21:30', '22:00', '22:30'
    ];

    // Filter time slots that are at least 30 minutes from now
    return allTimeSlots.filter(slot => {
      const [hours, minutes] = slot.split(':').map(Number);
      if (currentHour < hours) {
        return true;
      }
      if (currentHour === hours && currentMinutes < minutes) {
        return true;
      }
      return false;
    });
  }, []);

  const [time, setTime] = useState(availableTimeSlots[0] || '19:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get today's date in DD/MM format
    const today = new Date();
    const formattedDate = today.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
    
    const message = `Olá! Gostaria de agendar um pedido para hoje (${formattedDate}) às ${time}h.`;
    window.open(`https://wa.me/5511987654321?text=${encodeURIComponent(message)}`);
    onClose();
  };

  if (!isOpen) return null;

  if (availableTimeSlots.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">Agendamento Indisponível</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-6 text-center">
            <Clock className="mx-auto mb-4 text-orange-500" size={48} />
            <p className="text-gray-600 mb-4">
              Não há mais horários disponíveis para hoje. Por favor, tente novamente amanhã durante nosso horário de funcionamento (19:00 às 23:00).
            </p>
            <button
              onClick={onClose}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Agendar Pedido para Hoje</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Clock size={18} />
                Escolha o horário para hoje
              </div>
            </label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
            >
              {availableTimeSlots.map(slot => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors text-lg font-medium"
          >
            Agendar via WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;