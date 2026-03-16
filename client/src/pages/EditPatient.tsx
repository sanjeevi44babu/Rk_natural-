import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';

export default function EditPatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, updatePatient, users } = useData();
  
  const patient = patients.find(p => p.id === id);
  const doctors = users.filter(u => u.role === 'doctor' && u.isApproved);
  const therapists = users.filter(u => u.role === 'physiotherapist' && u.isApproved);
  
  const [formData, setFormData] = useState({
    fullName: patient?.fullName || '',
    phone: patient?.phone || '',
    email: patient?.email || '',
    age: patient?.age?.toString() || '',
    gender: patient?.gender || 'male',
    address: patient?.address || '',
    bloodType: patient?.bloodType || '',
    weight: patient?.weight?.toString() || '',
    height: patient?.height?.toString() || '',
    diagnosis: patient?.diagnosis || '',
    medicalHistory: patient?.medicalHistory || '',
    assignedDoctorId: patient?.assignedDoctorId || '',
    assignedPhysiotherapistId: patient?.assignedPhysiotherapistId || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!patient) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center">Patient not found</div>
      </DashboardLayout>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const doctor = doctors.find(d => d.id === formData.assignedDoctorId);
    const therapist = therapists.find(t => t.id === formData.assignedPhysiotherapistId);

    updatePatient(id!, {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      age: parseInt(formData.age),
      gender: formData.gender as 'male' | 'female' | 'other',
      address: formData.address,
      bloodType: formData.bloodType,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      height: formData.height ? parseFloat(formData.height) : undefined,
      diagnosis: formData.diagnosis,
      medicalHistory: formData.medicalHistory,
      assignedDoctorId: formData.assignedDoctorId || undefined,
      assignedDoctorName: doctor?.fullName,
      assignedPhysiotherapistId: formData.assignedPhysiotherapistId || undefined,
      assignedPhysiotherapistName: therapist?.fullName,
    });

    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success('Patient updated successfully!');
    navigate(`/patients/${id}`);
    setIsLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <h1 className="text-2xl font-bold mb-6">Edit Patient</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card-medical space-y-4">
            <h3 className="font-semibold">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="input-medical"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-medical"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-medical"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="input-medical"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="input-medical"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Blood Type</label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className="input-medical"
                >
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input-medical"
              />
            </div>
          </div>

          <div className="card-medical space-y-4">
            <h3 className="font-semibold">Medical Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="input-medical"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="input-medical"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Diagnosis</label>
              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                rows={2}
                className="input-medical resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Medical History</label>
              <textarea
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                rows={3}
                className="input-medical resize-none"
              />
            </div>
          </div>

          <div className="card-medical space-y-4">
            <h3 className="font-semibold">Assign Staff</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Assigned Doctor</label>
                <select
                  name="assignedDoctorId"
                  value={formData.assignedDoctorId}
                  onChange={handleChange}
                  className="input-medical"
                >
                  <option value="">Select Doctor</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.fullName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Assigned Physiotherapist</label>
                <select
                  name="assignedPhysiotherapistId"
                  value={formData.assignedPhysiotherapistId}
                  onChange={handleChange}
                  className="input-medical"
                >
                  <option value="">Select Physiotherapist</option>
                  {therapists.map(t => (
                    <option key={t.id} value={t.id}>{t.fullName}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
            <Save size={18} className="mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
