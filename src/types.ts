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

export type ProductAttribute = {
    name: string;
    value : string | undefined
}

export type Product ={
    _id: string
    name: string
    description: string
    category: Category
    isPublished: boolean
    priceConfiguration: PriceConfiguration;
    attributes: ProductAttribute[]
    creadtedAt: string
    image: string
}

export interface PriceConfiguration {
    [key: string]: {
        priceType: "base" | "additional";
        availableOptions: string[];
    };
}

export interface Attribute {
    name: string;
    widgetType: "switch" | "radio";
    defaultValue: string;
    availableOptions: string[];
}

export interface Category {
     _id: string,
    name: string;
    priceConfiguration: PriceConfiguration;
    attributes: Attribute[];
}

export type ImageField = {file: File}

export type CreateProductData = Product & {
    image:ImageField
}

export enum OrderStatus {
    RECEIVED = 'received',
    CONFIRMED = 'confirmed',
    PREPARED = 'prepared',
    OUT_FOR_DELIVERY = 'out_for_delivery',
    DELIVERED = 'delivered',
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
}

export enum PaymentMode {
    CARD = 'card',
    CASH = 'cash',
}

export type Topping = {
    id: string;
    name: string;
    price: number;
    image: string;
};

export interface CartItem extends Pick<Product, '_id' | 'name' | 'image' | 'priceConfiguration'> {
    chosenConfiguration: {
        priceConfiguration: {
            [key: string]: string;
        };
        selectedToppings: Topping[];
    };
    qty: number;
}

export interface Customer {
    _id: string;
    firstName: string;
    lastName: string;
}
export interface Order {
    _id: string;
    image: any;
    cart: CartItem[];
    customerId: Customer;
    total: number;
    discount: number;
    taxes: number;
    deliveryCharges: number;
    address: string;
    tenantId: string;
    comment?: string;
    paymentMode: PaymentMode;
    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentId?: string;
    createdAt: string;
}
