import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';

interface CalendarStripProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function CalendarStrip({ selectedDate, onDateSelect }: CalendarStripProps) {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const today = new Date();

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const goToPreviousWeek = () => {
    setWeekStart(addDays(weekStart, -7));
  };

  const goToNextWeek = () => {
    setWeekStart(addDays(weekStart, 7));
  };

  return (
    <div className="bg-primary rounded-2xl p-4 text-primary-foreground">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={goToPreviousWeek}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="font-semibold">
          {format(weekStart, 'MMMM yyyy')}
        </span>
        <button 
          onClick={goToNextWeek}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex justify-between gap-1">
        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 ${
                isSelected 
                  ? 'bg-white text-primary shadow-md' 
                  : isToday
                  ? 'bg-white/20'
                  : 'hover:bg-white/10'
              }`}
            >
              <span className="text-xs font-medium uppercase">
                {format(day, 'EEE')}
              </span>
              <span className={`text-lg font-bold ${isSelected ? 'text-primary' : ''}`}>
                {format(day, 'd')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
