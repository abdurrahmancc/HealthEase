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
