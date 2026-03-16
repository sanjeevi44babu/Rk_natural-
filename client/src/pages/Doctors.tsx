import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SearchBar } from '@/components/common/SearchBar';
import { useData } from '@/contexts/DataContext';

export default function Doctors() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { users, patients } = useData();
  const doctors = users.filter(u => u.role === 'doctor' && u.isApproved);
  const filtered = doctors.filter(d => d.fullName.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        <h1 className="text-2xl font-bold">Doctors</h1>
        <SearchBar placeholder="Search doctors..." value={search} onChange={setSearch} />
        <div className="space-y-3">
          {filtered.map((doc) => (
            <div key={doc.id || (doc as any)._id} className="card-medical cursor-pointer" onClick={() => navigate(`/doctors/${doc.id || (doc as any)._id}`)}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center"><span className="text-primary font-bold">{doc.fullName.split(' ').map(n => n[0]).join('')}</span></div>
                <div className="flex-1"><h3 className="font-semibold">{doc.fullName}</h3><p className="text-sm text-primary">{doc.specialization || 'General'}</p></div>
                <p className="text-lg font-bold text-primary">{patients.filter(p => p.assignedDoctorId === doc.id || p.assignedDoctorId === (doc as any)._id).length}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}