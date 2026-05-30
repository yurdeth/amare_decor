import { z } from 'zod';

// ============== CLIENTE SCHEMA ==============
export const clientSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),

  email: z.string()
    .email('Email inválido')
    .toLowerCase()
    .max(255, 'El email no puede exceder 255 caracteres'),

  phone: z.string()
    .regex(/^\+?[\d\s\-()]+$/, 'Número de teléfono inválido')
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .max(20, 'El teléfono no puede exceder 20 caracteres'),

  address: z.string()
    .max(500, 'La dirección no puede exceder 500 caracteres')
    .optional(),

  notes: z.string()
    .max(1000, 'Las notas no pueden exceder 1000 caracteres')
    .optional()
    .nullable()
});

export type ClientInput = z.infer<typeof clientSchema>;

// ============== PRODUCT SCHEMA ==============
export const productSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(200, 'El nombre no puede exceder 200 caracteres'),

  category: z.enum(['Mesas', 'Sillas', 'Decoración', 'Iluminación', 'Textilos', 'Otros'], {
    message: 'Categoría inválida'
  }),

  quantity: z.number()
    .int('La cantidad debe ser un número entero')
    .min(0, 'La cantidad no puede ser negativa')
    .max(10000, 'La cantidad no puede exceder 10000'),

  status: z.enum(['available', 'in-use', 'maintenance'], {
    errorMap: () => ({ message: 'Estado inválido' })
  }),

  estimatedValue: z.number()
    .min(0, 'El valor estimado no puede ser negativo')
    .max(1000000, 'El valor estimado no puede exceder $1,000,000'),

  description: z.string()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional()
    .nullable()
});

export type ProductInput = z.infer<typeof productSchema>;

// ============== EVENT SCHEMA ==============
export const eventSchema = z.object({
  clientId: z.string()
    .min(1, 'El ID del cliente es requerido'),

  clientName: z.string()
    .min(2, 'El nombre del cliente es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),

  date: z.string()
    .refine((val) => !isNaN(Date.parse(val)), 'Fecha inválida')
    .refine((val) => new Date(val) >= new Date(), 'La fecha debe ser futura'),

  type: z.enum(['Boda', 'Cumpleaños', 'Corporativo', 'Aniversario', 'Otros'], {
    errorMap: () => ({ message: 'Tipo de evento inválido' })
  }),

  budget: z.number()
    .min(0, 'El presupuesto no puede ser negativo')
    .max(10000000, 'El presupuesto no puede exceder $10,000,000')
    .refine((val) => val > 0, 'El presupuesto debe ser mayor que 0'),

  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled'], {
    errorMap: () => ({ message: 'Estado inválido' })
  }),

  items: z.array(z.object({
    productId: z.string().min(1, 'ID de producto requerido'),
    productName: z.string().min(1, 'Nombre de producto requerido'),
    quantity: z.number().int().min(1, 'Cantidad mínima 1').max(1000, 'Cantidad máxima 1000')
  })).optional().default([]),

  notes: z.string()
    .max(2000, 'Las notas no pueden exceder 2000 caracteres')
    .optional()
    .nullable()
});

export type EventInput = z.infer<typeof eventSchema>;

// ============== INCOME SCHEMA ==============
export const incomeSchema = z.object({
  eventId: z.string()
    .min(1, 'El ID del evento es requerido'),

  eventName: z.string()
    .min(2, 'El nombre del evento es requerido')
    .max(200, 'El nombre no puede exceder 200 caracteres'),

  amount: z.number()
    .min(0, 'El monto no puede ser negativo')
    .max(10000000, 'El monto no puede exceder $10,000,000')
    .refine((val) => val > 0, 'El monto debe ser mayor que 0'),

  date: z.string()
    .refine((val) => !isNaN(Date.parse(val)), 'Fecha inválida'),

  category: z.string()
    .min(1, 'La categoría es requerida')
    .max(100, 'La categoría no puede exceder 100 caracteres')
});

export type IncomeInput = z.infer<typeof incomeSchema>;

// ============== EXPENSE SCHEMA ==============
export const expenseSchema = z.object({
  amount: z.number()
    .min(0, 'El monto no puede ser negativo')
    .max(10000000, 'El monto no puede exceder $10,000,000')
    .refine((val) => val > 0, 'El monto debe ser mayor que 0'),

  date: z.string()
    .refine((val) => !isNaN(Date.parse(val)), 'Fecha inválida'),

  category: z.enum(['Materiales', 'Mano de obra', 'Transporte', 'Alquiler', 'Otros'], {
    errorMap: () => ({ message: 'Categoría inválida' })
  }),

  description: z.string()
    .min(5, 'La descripción debe tener al menos 5 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres')
});

export type ExpenseInput = z.infer<typeof expenseSchema>;

// ============== QUOTATION SCHEMA ==============
export const quotationBasicInfoSchema = z.object({
  clientName: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),

  eventType: z.string()
    .min(2, 'El tipo de evento es requerido')
    .max(100, 'El tipo no puede exceder 100 caracteres'),

  eventDate: z.string()
    .refine((val) => !isNaN(Date.parse(val)), 'Fecha inválida')
    .refine((val) => new Date(val) >= new Date(), 'La fecha debe ser futura'),

  guestCount: z.number()
    .int('La cantidad de invitados debe ser un número entero')
    .min(1, 'Debe haber al menos 1 invitado')
    .max(10000, 'No más de 10,000 invitados'),

  location: z.string()
    .min(5, 'La ubicación debe tener al menos 5 caracteres')
    .max(500, 'La ubicación no puede exceder 500 caracteres'),

  estimatedBudget: z.number()
    .min(0, 'El presupuesto estimado no puede ser negativo')
    .max(10000000, 'El presupuesto no puede exceder $10,000,000')
    .refine((val) => val > 0, 'El presupuesto debe ser mayor que 0'),

  notes: z.string()
    .max(2000, 'Las notas no pueden exceder 2000 caracteres')
    .optional()
    .nullable()
});

export type QuotationBasicInfoInput = z.infer<typeof quotationBasicInfoSchema>;

// ============== AUTH SCHEMA ==============
export const loginSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .toLowerCase(),

  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(128, 'La contraseña no puede exceder 128 caracteres')
});

export type LoginInput = z.infer<typeof loginSchema>;

// ============== HELPER FUNCTIONS ==============
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));

    throw new Error(`Validación fallida: ${JSON.stringify(errors)}`);
  }

  return result.data;
}

export function getValidationErrors(schema: z.ZodSchema, data: unknown): Record<string, string> {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.errors.forEach(err => {
      const field = err.path.join('.');
      errors[field] = err.message;
    });
    return errors;
  }

  return {};
}