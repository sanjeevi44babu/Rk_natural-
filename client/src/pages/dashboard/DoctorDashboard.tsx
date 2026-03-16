import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, UserPlus, ChevronRight, Plus, Clock, QrCode, XCircle, FileText, Stethoscope } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CalendarStrip } from '@/components/common/CalendarStrip';
import { StatCard } from '@/components/common/StatCard';
import { UserCard } from '@/components/common/UserCard';
import { AppointmentCard } from '@/components/common/AppointmentCard';
import { NotificationBell } from '@/components/common/NotificationPanel';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function DoctorDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patients, appointments, updateAppointment, healthRecords } = useData();
  const { addNotification } = useNotifications();

  const doctorId = user?.id || (user as any)?._id;
  const myPatients = (patients || []).filter(p => p.assignedDoctorId === doctorId || !p.assignedDoctorId);
  const myAppointments = (appointments || []).filter(a => a.doctorId === doctorId);
  const todayAppointments = myAppointments.filter(a => 
    isSameDay(new Date(a.date), selectedDate) && a.status !== 'cancelled'
  );
  const completedAppointments = myAppointments.filter(a => a.status === 'completed');
  const upcomingAppointments = myAppointments.filter(a => a.status === 'upcoming');

  const handleCancelAppointment = (aptId: string, patientName: string) => {
    updateAppointment(aptId, { status: 'cancelled' });
    addNotification({
      title: 'Appointment Cancelled',
      message: `Dr. ${user?.fullName} cancelled appointment for ${patientName}`,
      type: 'warning',
      role: 'all',
    });
    toast.success('Appointment cancelled');
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Welcome Header */}
        <div className="bg-primary rounded-2xl p-6 text-primary-foreground animate-fade-in">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-primary-foreground/80 text-sm">Doctor</p>
              <h1 className="text-2xl font-bold">{user?.fullName || 'Doctor'}</h1>
              {user?.specialization && (
                <p className="text-primary-foreground/80 text-sm">{user.specialization}</p>
              )}
            </div>
            <NotificationBell />
          </div>
          <CalendarStrip selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <StatCard icon={Users} value={myPatients.length} label="Patients" variant="primary" onClick={() => navigate('/patients')} />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <StatCard icon={Calendar} value={todayAppointments.length} label="Today" variant="secondary" onClick={() => navigate('/appointments')} />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <StatCard icon={Clock} value={upcomingAppointments.length} label="Upcoming" onClick={() => navigate('/appointments')} />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.25s' }}>
            <StatCard icon={Calendar} value={completedAppointments.length} label="Completed" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
  
          <button onClick={() => navigate('/scan-patient')} className="role-card w-full animate-fade-in hover:scale-[1.02] transition-transform duration-200" style={{ animationDelay: '0.33s' }}>
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center"><QrCode size={20} className="text-secondary" /></div>
            <span className="flex-1 text-left font-medium">Scan Patient QR</span>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
          <button onClick={() => navigate('/my-schedule')} className="role-card w-full animate-fade-in hover:scale-[1.02] transition-transform duration-200" style={{ animationDelay: '0.35s' }}>
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center"><Clock size={20} className="text-accent-foreground" /></div>
            <span className="flex-1 text-left font-medium">My Schedule</span>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
          <button onClick={() => navigate('/patients')} className="role-card w-full animate-fade-in hover:scale-[1.02] transition-transform duration-200" style={{ animationDelay: '0.4s' }}>
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center"><Users size={20} className="text-success" /></div>
            <span className="flex-1 text-left font-medium">All Patients</span>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Today's Appointments with Cancel */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Today's Appointments ({todayAppointments.length})</h2>
            <button onClick={() => navigate('/appointments')} className="text-primary text-sm font-medium hover:underline">View All</button>
          </div>
          {todayAppointments.length === 0 ? (
            <div className="card-medical text-center py-8">
              <Calendar size={40} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No appointments for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id || (appointment as any)._id} className="card-medical">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <Stethoscope size={20} className="text-secondary" />
                    </div>
                    <div className="flex-1 cursor-pointer" onClick={() => navigate(`/appointments/${appointment.id || (appointment as any)._id}`)}>
                      <h3 className="font-semibold">{appointment.patientName || 'Patient'}</h3>
                      <p className="text-sm text-muted-foreground">{appointment.time || 'TBD'} • {appointment.type || 'Session'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        appointment.status === 'upcoming' ? 'bg-primary/10 text-primary' :
                        appointment.status === 'completed' ? 'bg-success/10 text-success' :
                        'bg-destructive/10 text-destructive'
                      }`}>{appointment.status}</span>
                      {appointment.status === 'upcoming' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelAppointment(appointment.id || (appointment as any)._id, appointment.patientName || 'Patient');
                          }}
                        >
                          <XCircle size={16} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Patients with History & Reports */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">My Patients ({myPatients.length})</h2>
            <button onClick={() => navigate('/patients')} className="text-primary text-sm font-medium hover:underline">View All</button>
          </div>
          {myPatients.length === 0 ? (
            <div className="card-medical text-center py-8">
              <Users size={40} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No patients assigned yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myPatients.slice(0, 5).map((patient) => {
                const patientRecords = healthRecords.filter(r => r.patientId === patient.id);
                const lastRecord = patientRecords[patientRecords.length - 1];
                return (
                  <div key={patient.id} className="card-medical">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                        <span className="text-primary font-bold text-sm">
                          {(patient.fullName || 'Patient').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div className="flex-1 cursor-pointer" onClick={() => navigate(`/patients/${patient.id}`)}>
                        <h3 className="font-semibold">{patient.fullName}</h3>
                        <p className="text-sm text-muted-foreground">{patient.age}y • {patient.gender} • {patient.diagnosis || 'No diagnosis'}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        patient.status === 'admitted' ? 'bg-success/10 text-success' :
                        patient.status === 'discharged' ? 'bg-muted text-muted-foreground' :
                        'bg-secondary/10 text-secondary'
                      }`}>{patient.status}</span>
                    </div>
                    {/* Last record summary */}
                    {lastRecord && (
                      <div className="bg-accent rounded-xl p-2 mb-2">
                        <p className="text-xs text-muted-foreground">Last Record: {lastRecord.date}</p>
                        <div className="flex gap-2 flex-wrap mt-1">
                          {lastRecord.bloodPressure && <span className="text-xs bg-background px-2 py-0.5 rounded">BP: {lastRecord.bloodPressure}</span>}
                          {lastRecord.prescription && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">💊 {lastRecord.prescription}</span>}
                        </div>
                      </div>
                    )}
                    {/* Quick actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => navigate(`/patients/${patient.id}`)}>
                        <FileText size={14} className="mr-1" /> History
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => navigate(`/patients/${patient.id}/health-check`)}>
                        <Stethoscope size={14} className="mr-1" /> Check
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => navigate(`/scan-patient`)}>
                        <QrCode size={14} className="mr-1" /> Scan
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </DashboardLayout>
  );
}
