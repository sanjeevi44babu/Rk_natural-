import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SearchBar } from '@/components/common/SearchBar';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

export default function Patients() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'admitted' | 'discharged' | 'outpatient'>('all');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patients } = useData();

  const filteredPatients = (patients || []).filter(patient => {
    const fullName = patient?.fullName || 'Patient';
    const matchesSearch = fullName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    
    // Role-based filtering - therapists see ALL patients
    if (user?.role === 'doctor') {
      const doctorId = user.id || (user as any)._id;
      // Doctors see their assigned patients PLUS any patients with NO assigned doctor yet
      return matchesSearch && matchesStatus && (patient.assignedDoctorId === doctorId || !patient.assignedDoctorId);
    }
    // Physiotherapists and other roles see all patients
    return matchesSearch && matchesStatus;
  });

  const canAddPatient = user?.role === 'doctor' || user?.role === 'supervisor';
  const isAdminViewOnly = user?.role === 'admin';

  const statusFilters = [
    { key: 'all', label: 'All' },
    { key: 'admitted', label: 'Admitted' },
    { key: 'outpatient', label: 'Outpatient' },
    { key: 'discharged', label: 'Discharged' },
  ] as const;

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Patients</h1>
          {canAddPatient && (
            <button
              onClick={() => navigate('/patients/new')}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Patient</span>
            </button>
          )}
        </div>

        {/* Search & Filter */}
        <div className="space-y-4">
          <SearchBar
            placeholder="Search patients..."
            value={search}
            onChange={setSearch}
            showFilter
          />

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {statusFilters.map(filter => (
              <button
                key={filter.key}
                onClick={() => setStatusFilter(filter.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  statusFilter === filter.key 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-accent text-accent-foreground'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Patient List */}
        <div className="space-y-3">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No patients found</p>
            </div>
          ) : (
            filteredPatients.map((patient) => (
              <div key={patient.id || (patient as any)._id} className="user-card" onClick={() => navigate(`/patients/${patient.id || (patient as any)._id}`)}>
                <div className="avatar-wrapper">
                  <span className="text-primary font-semibold">
                    {(patient.fullName || 'Patient').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{patient.fullName || 'No Name'}</h3>
                  <p className="text-sm text-muted-foreground">{patient.age} years • {patient.gender}</p>
                  {patient.roomNumber && (
                    <p className="text-xs text-primary">Room {patient.roomNumber}, {patient.blockName}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    patient.status === 'admitted' ? 'bg-success/10 text-success' :
                    patient.status === 'discharged' ? 'bg-muted text-muted-foreground' :
                    'bg-secondary/10 text-secondary'
                  }`}>
                    {patient.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* FAB for mobile */}
      {canAddPatient && (
        <button 
          className="fab lg:hidden"
          onClick={() => navigate('/patients/new')}
        >
          <Plus size={24} />
        </button>
      )}
    </DashboardLayout>
  );
}
