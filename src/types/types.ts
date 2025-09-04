export interface User {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    username?: string;
    phoneNumber?: string;
    photoUrl?: string;
    role?: string;
    ipAddress?: string;
    status?: string;
    country?: string;
    countryCode?: string;
    loginDevices?: string[];
    lastLoginDate: string;
    createAt: string;
    updateAt: string;
}

export interface UserDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: string;
    photoUrl: string;
    status?: string;
    country?: string;
    countryCode?: string;
}

export interface Language{
    id: number;
    langCode: string;
    languageName: string;
}


export interface  DoctorBasicInfo {
    firstName: string;
    lastName: string;
    displayName: string;
    designation: string;
    phoneNumber: string;
    email?: string;
    languagesSpoken: string[];
};

export interface  DoctorMembership{
    membershipId?: string;
    title: string;
    about: string;
    doctorId?: string;
};

export interface DoctorExperience {
    experienceId?: string
    title: string;
    hospital: string;
    hospitalLogo?: string,
    hospitalLogoFile?: File;
    yearOfExperience: string;
    location: string;
    employmentType: string;
    jobDescription: string;
    startDate: string
    endDate?: string;
    isCurrentlyWorking: boolean;
    doctorId?: string;
};

export interface DoctorEducation  {
    educationId?: string;
    instituteName: string;
    course: string;
    description: string;
    startDate: string
    endDate?: string;
    isCurrentlyOngoing: boolean;
    doctorId?: string;
};

export interface DoctorClinic  {
    clinicId?: string;
    clinicName: string;
    location: string;
    address: string;
    clinicLogos?: string[] | null;
    clinicLogosFile?: File[];
    doctorId?: string;
};