import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Activity, Calendar, ChevronRight, 
  Building, BedDouble, Plus, Clock, QrCode, CheckCircle, XCircle
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CalendarStrip } from '@/components/common/CalendarStrip';
import { StatCard } from '@/components/common/StatCard';
import { UserCard } from '@/components/common/UserCard';
import { NotificationBell } from '@/components/common/NotificationPanel';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SupervisorDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  const { user } = useAuth();
  const { users, patients, appointments, getAvailableBeds, addAppointment, updateAppointment } = useData();
  const { addNotification } = useNotifications();

  const therapists = users.filter(u => u.role === 'physiotherapist' && u.isApproved);
  const activePatients = patients.filter(p => p.status === 'admitted' || p.status === 'outpatient');
  const admittedPatients = patients.filter(p => p.status === 'admitted');
  const availableBeds = getAvailableBeds();
  const unassignedPatients = admittedPatients.filter(p => !p.assignedPhysiotherapistId);
  
  const todayStr = selectedDate.toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const therapyAppointments = todayAppointments.filter(a => a.physiotherapistId);

  const getTherapistAvailability = (therapistId: string) => {
    const therapistAppointments = todayAppointments.filter(a => a.physiotherapistId === therapistId);
    return {
      bookedSlots: therapistAppointments.length,
      isAvailable: therapistAppointments.length < 5,
      nextFreeSlot: therapistAppointments.length < 5 ? getNextFreeSlot(therapistAppointments) : null,
      appointments: therapistAppointments,
    };
  };

  const getNextFreeSlot = (bookedAppointments: typeof todayAppointments) => {
    const allSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];
    const bookedTimes = bookedAppointments.map(a => a.time);
    return allSlots.find(slot => !bookedTimes.includes(slot)) || null;
  };

  const handleQuickAssign = (therapistId: string, therapistName: string, patientId: string, patientName: string) => {
    const availability = getTherapistAvailability(therapistId);
    if (!availability.nextFreeSlot) {
      toast.error('No available slots for this therapist');
      return;
    }
    
    const newAppointment = {
      id: `apt-${Date.now()}`,
      patientId,
      patientName,
      physiotherapistId: therapistId,
      physiotherapistName: therapistName,
      date: todayStr,
      time: availability.nextFreeSlot,
      duration: 45,
      status: 'upcoming' as const,
      type: 'therapy' as const,
      notes: `Assigned by Supervisor ${user?.fullName}`,
      createdAt: new Date().toISOString(),
    };

    addAppointment(newAppointment);
    addNotification({
      title: 'Therapy Session Scheduled',
      message: `${patientName} assigned to ${therapistName} at ${availability.nextFreeSlot}`,
      type: 'success',
      role: 'all',
    });
    toast.success(`Assigned ${patientName} to ${therapistName} at ${availability.nextFreeSlot}`);
  };

  const handleCancelAppointment = (aptId: string, patientName: string) => {
    updateAppointment(aptId, { status: 'cancelled' });
    addNotification({
      title: 'Appointment Cancelled',
      message: `Supervisor ${user?.fullName} cancelled appointment for ${patientName}`,
      type: 'warning',
      role: 'all',
    });
    toast.success('Appointment cancelled');
  };

  const stats = {
    patients: activePatients.length,
    therapists: therapists.length,
    availableBeds: availableBeds.length,
    todayAppointments: todayAppointments.length,
  };

  // State for quick assign modal
  const [assigningTherapist, setAssigningTherapist] = useState<{ id: string; name: string } | null>(null);

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Welcome Header */}
        <div className="bg-primary rounded-2xl p-6 text-primary-foreground animate-fade-in">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-primary-foreground/80 text-sm">Supervisor</p>
              <h1 className="text-2xl font-bold">{user?.fullName || 'Supervisor'}</h1>
            </div>
            <NotificationBell />
          </div>
          <CalendarStrip selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Users} value={stats.patients} label="Patients" variant="primary" onClick={() => navigate('/patients')} />
          <StatCard icon={Activity} value={stats.therapists} label="Therapists" onClick={() => navigate('/physiotherapists')} />
          <StatCard icon={BedDouble} value={stats.availableBeds} label="Free Beds" onClick={() => navigate('/rooms')} />
          <StatCard icon={Calendar} value={stats.todayAppointments} label="Today" variant="secondary" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <button onClick={() => navigate('/rooms')} className="role-card">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Building size={20} className="text-primary" /></div>
            <div className="flex-1 text-left">
              <p className="font-medium">Room Management</p>
              <p className="text-sm text-muted-foreground">{stats.availableBeds} beds available</p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
          <button onClick={() => navigate('/appointments/new')} className="role-card">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center"><Plus size={20} className="text-secondary" /></div>
            <div className="flex-1 text-left">
              <p className="font-medium">Book Appointment</p>
              <p className="text-sm text-muted-foreground">Schedule therapy session</p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
          <button onClick={() => navigate('/scan-patient')} className="role-card">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center"><QrCode size={20} className="text-success" /></div>
            <div className="flex-1 text-left">
              <p className="font-medium">Scan Patient</p>
              <p className="text-sm text-muted-foreground">Scan QR or enter ID</p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Therapist Availability with Quick Assign */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">Therapist Availability</h2>
              <p className="text-sm text-muted-foreground">Assign patients to therapists</p>
            </div>
            <button onClick={() => navigate('/physiotherapists')} className="text-primary text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {therapists.map((therapist) => {
              const availability = getTherapistAvailability(therapist.id);
              const isAssigning = assigningTherapist?.id === therapist.id;
              return (
                <div key={therapist.id} className="card-medical">
                  <div className="flex items-center gap-4">
                    <div className="avatar-wrapper">
                      <span className="text-primary font-semibold text-sm">
                        {(therapist.fullName || 'User').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{therapist.fullName}</h3>
                      <p className="text-sm text-muted-foreground">{therapist.specialization || 'Physiotherapist'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={12} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{availability.bookedSlots}/5 slots booked</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${availability.isAvailable ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                        {availability.isAvailable ? 'Available' : 'Fully Booked'}
                      </span>
                      {availability.isAvailable && availability.nextFreeSlot && (
                        <span className="text-xs text-secondary">Next: {availability.nextFreeSlot}</span>
                      )}
                      <div className="flex gap-1">
                        {availability.isAvailable && (
                          <>
                            <Button size="sm" className="text-xs h-7" onClick={() => navigate(`/appointments/new?therapist=${therapist.id}`)}>
                              Book
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setAssigningTherapist(isAssigning ? null : { id: therapist.id, name: therapist.fullName })}>
                              Quick Assign
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Assign Patient Selector */}
                  {isAssigning && (
                    <div className="mt-3 pt-3 border-t border-border animate-fade-in">
                      <p className="text-sm font-medium mb-2">Select patient to assign:</p>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {admittedPatients.map((patient) => (
                          <button
                            key={patient.id}
                            onClick={() => {
                              handleQuickAssign(therapist.id, therapist.fullName, patient.id, patient.fullName);
                              setAssigningTherapist(null);
                            }}
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent text-left transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs text-primary font-bold">
                                {(patient.fullName || 'Patient').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{patient.fullName}</p>
                              <p className="text-xs text-muted-foreground">{patient.diagnosis || 'No diagnosis'}</p>
                            </div>
                            <Plus size={14} className="text-primary" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Today's appointments for this therapist */}
                  {availability.appointments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Today's Sessions:</p>
                      <div className="space-y-1">
                        {availability.appointments.map((apt) => (
                          <div key={apt.id} className="flex items-center justify-between p-2 bg-accent rounded-lg">
                            <div>
                              <span className="text-xs font-medium">{apt.patientName}</span>
                              <span className="text-xs text-muted-foreground ml-2">{apt.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                                apt.status === 'completed' ? 'bg-success/10 text-success' :
                                apt.status === 'cancelled' ? 'bg-destructive/10 text-destructive' :
                                'bg-primary/10 text-primary'
                              }`}>{apt.status}</span>
                              {apt.status === 'upcoming' && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-destructive hover:bg-destructive/10"
                                  onClick={() => handleCancelAppointment(apt.id, apt.patientName)}
                                >
                                  <XCircle size={12} />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Patients (Admitted & Outpatient) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Active Patients ({activePatients.length})</h2>
            <button onClick={() => navigate('/patients')} className="text-primary text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {activePatients.slice(0, 5).map((patient) => (
              <UserCard key={patient.id || (patient as any)._id} id={patient.id || (patient as any)._id} name={patient.fullName} subtitle={`${patient.age} Age, ${patient.gender} • ${patient.status === 'admitted' ? `Room ${patient.roomNumber || 'N/A'}` : 'Outpatient'}`} phone={patient.phone} showActions onClick={() => navigate(`/patients/${patient.id || (patient as any)._id}`)} />
            ))}
          </div>
        </div>
      </div>

      <button className="fab" onClick={() => navigate('/appointments/new')}><Plus size={24} /></button>
    </DashboardLayout>
  );
}
