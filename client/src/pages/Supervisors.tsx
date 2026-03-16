import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SearchBar } from '@/components/common/SearchBar';
import { useData } from '@/contexts/DataContext';

export default function Supervisors() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { users } = useData();
  const supervisors = users.filter(u => u.role === 'supervisor' && u.isApproved);
  const filtered = supervisors.filter(s => s.fullName.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        <h1 className="text-2xl font-bold">Supervisors</h1>
        <SearchBar placeholder="Search..." value={search} onChange={setSearch} />
        <div className="space-y-3">
          {filtered.map((sup) => (
            <div key={sup.id || (sup as any)._id} className="card-medical cursor-pointer" onClick={() => navigate(`/supervisors/${sup.id || (sup as any)._id}`)}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-secondary-light flex items-center justify-center"><span className="text-secondary font-bold">{sup.fullName.split(' ').map(n => n[0]).join('')}</span></div>
                <div className="flex-1"><h3 className="font-semibold">{sup.fullName}</h3><p className="text-xs text-muted-foreground">{sup.email}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}