export interface personalInformation {
  id?: string,
  profilePicture: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  address: string,
  locality: string,
  phone: string,
  cellphone: string,
  email: string
}

export interface medicalHistory {
  id?: number,
  surgicalIntervention: string,
  aestheticFilling: string,
  disease: string,
  allergy: string,
  medication: string,
  habit: string,
  skinDiseaseHistory: string,
  familyHistory: string
}

export interface homeSupport {
  id?: number,
  currentRoutine: string,
  dayRoutine: string,
  nightRoutine: string,
  weeklyRoutine: string,
  recommendations: string
}

export interface session {
  id?: number,
  observation: string,
  treatment: string,
  date: string
}

export interface skinLesion {
  onset: string,
  onsetLocation: string,
  symptoms: string,
  evolution: string,
  changes: string,
  riskIncreasingFactors: string,
  postTreatment: string
}

export interface diagnosis {
  reasonForConsultation: string,
  skinBiotype: string,
  phototype: string,
  recommendations: string,
  skinLesion: skinLesion
}

export interface routine {
  id?: number,
  name: string,
  multipartFile: string,
  mimeType: string
}

export interface brand {
  id?: number,
  name: string
}

export interface brandSelect {
  label: string,
  brand: brand
}

export interface product {
  id?: number,
  name: string,
  code: string,
  content: string,
  brand?: brand,
  purchasePrice: number
}
