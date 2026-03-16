import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Edit, Heart, Stethoscope, LogOut, Plus, QrCode, Copy, Check, Printer, Droplets, Thermometer, Weight, Ruler, Activity, XCircle, FileText } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { toast } from 'sonner';

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, healthRecords, appointments, updateAppointment } = useData();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'appointments'>('profile');
  const [copied, setCopied] = useState(false);

  const patient = (patients || []).find(p => p.id === id || (p as any)._id === id);
  const patientRecords = healthRecords.filter(r => r.patientId === id);
  const patientAppointments = appointments.filter(a => a.patientId === id);

  if (!patient) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center">Patient not found</div>
      </DashboardLayout>
    );
  }

  const isAdmin = user?.role === 'admin';
  const isDoctor = user?.role === 'doctor';
  const isSupervisor = user?.role === 'supervisor';
  const isTherapist = user?.role === 'physiotherapist';

  const canEdit = isDoctor || isSupervisor;
  const canHealthCheck = isDoctor || isTherapist;
  const canDischarge = isDoctor || isSupervisor;
  const canSchedule = isSupervisor;

  const copyPatientId = () => {
    const pId = patient.id || (patient as any)._id || 'N/A';
    navigator.clipboard.writeText(pId.toUpperCase());
    setCopied(true);
    toast.success('Patient ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const qrData = JSON.stringify({
    patientId: patient.id,
    name: patient.fullName,
    age: patient.age,
    gender: patient.gender,
    bloodType: patient.bloodType,
    phone: patient.phone,
  });

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {/* Patient ID Card with QR */}
        <div className="card-medical bg-primary/5 border-primary/20 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <QRCodeSVG value={qrData} size={64} level="M" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Patient ID</p>
              <p className="text-xl font-bold font-mono text-primary">{(patient.id || (patient as any)._id || 'N/A').toUpperCase()}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyPatientId}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate(`/patients/${id}/qr-tag`)}>
                <Printer size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Patient Header */}
        <div className="card-medical mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar name={patient.fullName} size="xl" />
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold">{patient.fullName}</h1>
              <p className="text-muted-foreground">{patient.age} years • {patient.gender}</p>
              {patient.diagnosis && (
                <span className="badge-primary inline-block mt-2">{patient.diagnosis}</span>
              )}
              {patient.roomNumber && (
                <p className="text-sm text-secondary mt-1">
                  Room {patient.roomNumber}, {patient.blockName} - Bed {patient.bedNumber}
                </p>
              )}
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              patient.status === 'admitted' ? 'bg-success/10 text-success border border-success/20' :
              patient.status === 'discharged' ? 'bg-muted text-muted-foreground' :
              'bg-secondary/10 text-secondary border border-secondary/20'
            }`}>
              {(patient.status || 'outpatient').charAt(0).toUpperCase() + (patient.status || 'outpatient').slice(1)}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        {!isAdmin && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {canEdit && (
              <Button variant="outline" className="flex-col h-auto py-3" onClick={() => navigate(`/patients/${id}/edit`)}>
                <Edit size={20} className="mb-1" />
                <span className="text-xs">Edit</span>
              </Button>
            )}
            {canHealthCheck && (
              <Button variant="outline" className="flex-col h-auto py-3" onClick={() => navigate(`/patients/${id}/health-check`)}>
                <Stethoscope size={20} className="mb-1" />
                <span className="text-xs">Health Check</span>
              </Button>
            )}
            {canSchedule && (
              <Button variant="outline" className="flex-col h-auto py-3" onClick={() => navigate('/appointments/new')}>
                <Plus size={20} className="mb-1" />
                <span className="text-xs">Schedule</span>
              </Button>
            )}
            <Button variant="outline" className="flex-col h-auto py-3" onClick={() => navigate(`/patients/${id}/qr-tag`)}>
              <QrCode size={20} className="mb-1" />
              <span className="text-xs">QR Tag</span>
            </Button>
            {canDischarge && patient.status === 'admitted' && (
              <Button variant="outline" className="flex-col h-auto py-3 text-warning hover:text-warning" onClick={() => navigate(`/patients/${id}/discharge`)}>
                <LogOut size={20} className="mb-1" />
                <span className="text-xs">Discharge</span>
              </Button>
            )}
          </div>
        )}

        {isAdmin && (
          <div className="bg-muted/50 border border-border rounded-xl p-4 mb-6 text-center">
            <p className="text-sm text-muted-foreground">
              👁️ Admin View Only - You can view patient details but cannot modify them
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          {(['profile', 'history', 'appointments'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-4 animate-fade-in">
            {/* Vitals */}
            <div className="card-medical">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Heart size={18} className="text-destructive" />
                Current Vitals & Measurements
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="text-center p-3 bg-accent rounded-xl">
                  <Droplets size={20} className="mx-auto mb-1 text-destructive" />
                  <p className="text-lg font-bold text-primary">{patient.bloodPressure || '—'}</p>
                  <p className="text-xs text-muted-foreground">Blood Pressure</p>
                </div>
                <div className="text-center p-3 bg-accent rounded-xl">
                  <Thermometer size={20} className="mx-auto mb-1 text-warning" />
                  <p className="text-lg font-bold text-warning">{patient.temperature ? `${patient.temperature}°F` : '—'}</p>
                  <p className="text-xs text-muted-foreground">Temperature</p>
                </div>
                <div className="text-center p-3 bg-accent rounded-xl">
                  <Weight size={20} className="mx-auto mb-1 text-primary" />
                  <p className="text-lg font-bold text-secondary">{patient.weight ? `${patient.weight} kg` : '—'}</p>
                  <p className="text-xs text-muted-foreground">Weight</p>
                </div>
                <div className="text-center p-3 bg-accent rounded-xl">
                  <Ruler size={20} className="mx-auto mb-1 text-foreground" />
                  <p className="text-lg font-bold text-foreground">{patient.height ? `${patient.height} cm` : '—'}</p>
                  <p className="text-xs text-muted-foreground">Height</p>
                </div>
                <div className="text-center p-3 bg-accent rounded-xl">
                  <Activity size={20} className="mx-auto mb-1 text-success" />
                  <p className="text-lg font-bold text-success">{patient.weight && patient.height ? (patient.weight / ((patient.height/100) ** 2)).toFixed(1) : '—'}</p>
                  <p className="text-xs text-muted-foreground">BMI</p>
                </div>
                <div className="text-center p-3 bg-destructive/5 rounded-xl border border-destructive/20">
                  <Droplets size={20} className="mx-auto mb-1 text-destructive" />
                  <p className="text-lg font-bold text-destructive">{patient.bloodType || '—'}</p>
                  <p className="text-xs text-muted-foreground">Blood Group</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="card-medical">
              <h3 className="font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Phone size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{patient.phone}</p>
                  </div>
                </div>
                {patient.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Mail size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{patient.email}</p>
                    </div>
                  </div>
                )}
                {patient.address && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MapPin size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{patient.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Medical Info */}
            <div className="card-medical">
              <h3 className="font-semibold mb-4">Medical Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Blood Group</p>
                  <p className="font-medium text-lg">{patient.bloodType || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Admission Date</p>
                  <p className="font-medium">{patient.admissionDate || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Assigned Doctor</p>
                  <p className="font-medium">{patient.assignedDoctorName || 'Not Assigned'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Assigned Therapist</p>
                  <p className="font-medium">{patient.assignedPhysiotherapistName || 'Not Assigned'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{patient.status}</p>
                </div>
                {patient.dischargeDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Discharge Date</p>
                    <p className="font-medium">{patient.dischargeDate}</p>
                  </div>
                )}
              </div>
              {patient.diagnosis && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">Diagnosis</p>
                  <p className="font-medium mt-1">{patient.diagnosis}</p>
                </div>
              )}
              {patient.medicalHistory && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">Medical History</p>
                  <p className="font-medium mt-1">{patient.medicalHistory}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3 animate-fade-in">
            {patientRecords.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground"><p>No health records found</p></div>
            ) : (
              patientRecords.map((record) => (
                <div key={record.id} className="card-medical">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="badge-secondary">{record.date}</span>
                      <p className="text-sm text-muted-foreground mt-1">{record.doctorName || record.physiotherapistName}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                    {record.bloodPressure && (<div className="text-center p-2 bg-accent rounded-lg"><p className="text-sm font-medium">{record.bloodPressure}</p><p className="text-xs text-muted-foreground">BP</p></div>)}
                    {record.temperature && (<div className="text-center p-2 bg-accent rounded-lg"><p className="text-sm font-medium">{record.temperature}°F</p><p className="text-xs text-muted-foreground">Temp</p></div>)}
                    {record.heartRate && (<div className="text-center p-2 bg-accent rounded-lg"><p className="text-sm font-medium">{record.heartRate}</p><p className="text-xs text-muted-foreground">Heart Rate</p></div>)}
                    {record.weight && (<div className="text-center p-2 bg-accent rounded-lg"><p className="text-sm font-medium">{record.weight} kg</p><p className="text-xs text-muted-foreground">Weight</p></div>)}
                  </div>
                  {record.notes && <p className="text-sm text-muted-foreground">{record.notes}</p>}
                  {record.prescription && (
                    <div className="mt-2 p-2 bg-primary/5 rounded-lg">
                      <p className="text-xs text-primary font-medium">Prescription: {record.prescription}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="space-y-3 animate-fade-in">
            {patientAppointments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground"><p>No appointments found</p></div>
            ) : (
              patientAppointments.map((apt) => (
                <div key={apt.id} className="card-medical">
                  <div className="flex items-center justify-between">
                    <div className="cursor-pointer flex-1" onClick={() => navigate(`/appointments/${apt.id}`)}>
                      <p className="font-medium">{apt.date} at {apt.time}</p>
                      <p className="text-sm text-muted-foreground capitalize">{apt.type}</p>
                      {apt.doctorName && <p className="text-xs text-primary">Doctor: {apt.doctorName}</p>}
                      {apt.physiotherapistName && <p className="text-xs text-secondary">Therapist: {apt.physiotherapistName}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        apt.status === 'upcoming' ? 'bg-primary/10 text-primary' :
                        apt.status === 'completed' ? 'bg-success/10 text-success' :
                        'bg-destructive/10 text-destructive'
                      }`}>{apt.status}</span>
                      {apt.status === 'upcoming' && (isDoctor || isSupervisor) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            updateAppointment(apt.id, { status: 'cancelled' });
                            addNotification({
                              title: 'Appointment Cancelled',
                              message: `Appointment for ${patient.fullName} on ${apt.date} at ${apt.time} was cancelled`,
                              type: 'warning',
                              role: 'all',
                            });
                            toast.success('Appointment cancelled');
                          }}
                        >
                          <XCircle size={16} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
