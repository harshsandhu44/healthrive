import { create } from "zustand";
import { Patient } from "@/lib/schemas/patient";

interface PatientDialogState {
  // Dialog visibility states
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;

  // Current patient data
  editingPatient: Patient | null;
  deletingPatient: Patient | null;

  // Loading states
  isSubmitting: boolean;

  // Actions
  openAddDialog: () => void;
  closeAddDialog: () => void;
  openEditDialog: (patient: Patient) => void;
  closeEditDialog: () => void;
  openDeleteDialog: (patient: Patient) => void;
  closeDeleteDialog: () => void;
  setSubmitting: (loading: boolean) => void;
  reset: () => void;
}

export const usePatientDialogStore = create<PatientDialogState>((set) => ({
  // Initial state
  isAddDialogOpen: false,
  isEditDialogOpen: false,
  isDeleteDialogOpen: false,
  editingPatient: null,
  deletingPatient: null,
  isSubmitting: false,

  // Actions
  openAddDialog: () => set({ isAddDialogOpen: true }),
  
  closeAddDialog: () => set({ 
    isAddDialogOpen: false,
    isSubmitting: false 
  }),

  openEditDialog: (patient: Patient) => set({ 
    isEditDialogOpen: true, 
    editingPatient: patient 
  }),
  
  closeEditDialog: () => set({ 
    isEditDialogOpen: false, 
    editingPatient: null,
    isSubmitting: false 
  }),

  openDeleteDialog: (patient: Patient) => set({ 
    isDeleteDialogOpen: true, 
    deletingPatient: patient 
  }),
  
  closeDeleteDialog: () => set({ 
    isDeleteDialogOpen: false, 
    deletingPatient: null,
    isSubmitting: false 
  }),

  setSubmitting: (loading: boolean) => set({ isSubmitting: loading }),

  reset: () => set({
    isAddDialogOpen: false,
    isEditDialogOpen: false,
    isDeleteDialogOpen: false,
    editingPatient: null,
    deletingPatient: null,
    isSubmitting: false,
  }),
}));