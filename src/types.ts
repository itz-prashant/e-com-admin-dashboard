export type Credentials = {
    email: string;
    password: string
}

export type User = {
    id: number
    email: string
    firstName: string
    lastName: string
    createdAt:string
    tenant: Tenant | null
}

export type CreateUserData = {
    id: number
    email: string
    firstName: string
    lastName: string,
    role: string,
    tenantId: number,
    password:string
}

export type Tenant ={
    id: number,
    name: string
    address: string
}

export type createTenantData = {
    name: string;
    address: string
}

export type FieldData = {
    name: string[],
    value?: string
}

export type Category = {
    _id: string,
    name: string
}