import { z } from "zod";

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}
export const PersonalInfoSchema = z.object({
  // Nombre completo: Obligatorio, mínimo 5 caracteres
  fullName: z
    .string()
    .min(5, "El nombre completo es obligatorio")
    .max(150, "Máximo 150 caracteres"),

  // Correo electrónico: Obligatorio y debe ser un formato de email válido
  email: z
    .string()
    .email("Debe ser un correo electrónico válido")
    .max(100, "Máximo 100 caracteres"),

  // Teléfono: Opcional, pero si se proporciona, se valida con un patrón simple de dígitos
  phone: z
    .string()
    .regex(/^(\+?\d{1,3}[-. ]?)?(\d{2,4}[-. ]?){1,5}\d{1,4}$/, "Formato de teléfono no válido")
    .optional()
    .or(z.literal("")), // Permite que esté vacío ("") si es opcional

  // Ubicación: Obligatorio
  location: z
    .string()
    .min(2, "La ubicación es obligatoria")
    .max(100, "Máximo 100 caracteres"),

  // Resumen: Obligatorio, mínimo 20 caracteres
  summary: z
    .string()
    .min(20, "El resumen es obligatorio (mínimo 20 caracteres)")
    .max(1000, "Máximo 1000 caracteres"),
});



export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}
export const ExperienceSchema = z
  .object({
    // ID: Obligatorio para identificar el ítem (asumimos que es un UUID o string simple)
    id: z.string().min(1, "ID de experiencia requerido"),

    // Empresa: Obligatorio
    company: z
      .string()
      .min(2, "El nombre de la empresa es obligatorio")
      .max(100, "Máximo 100 caracteres"),

    // Posición: Obligatorio
    position: z
      .string()
      .min(2, "El cargo/posición es obligatorio")
      .max(100, "Máximo 100 caracteres"),

    // Fecha de inicio: Obligatorio, formato YYYY-MM
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}$/, "Debe ser una fecha de inicio válida (YYYY-MM)"),

    // Fecha de fin: Puede ser 'Presente' o una fecha YYYY-MM
    endDate: z
      .string()
      .regex(/^(\d{4}-\d{2}|Presente)$/, "Debe ser una fecha de fin válida (YYYY-MM o 'Presente')"),

    // Descripción: Opcional
    description: z
      .string()
      .max(500, "Máximo 500 caracteres")
      .optional()
      .or(z.literal("")),
  })
  // Usamos .superRefine() para la lógica de validación cruzada entre campos
  .superRefine((data, ctx) => {
    // Si la fecha de fin no es 'Presente' y ambas son fechas válidas
    if (data.endDate !== "Presente" && data.startDate > data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "La fecha de fin no puede ser anterior a la fecha de inicio",
      });
    }
  });

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationYear: string;
}

export const EducationSchema = z.object({
  institution: z
    .string()
    .min(3, "La institución es obligatoria")
    .max(100, "Máximo 100 caracteres"),
  degree: z
    .string()
    .min(3, "El título/grado es obligatorio")
    .max(100, "Máximo 100 caracteres"),
  field: z
    .string()
    .optional()
    .or(z.literal("")), // permite vacío
  graduationYear: z
    .string()
    .regex(/^\d{4}$/, "Debe ser un año válido (por ejemplo, 2024)")
    .optional()
    .or(z.literal("")), // permite vacío
});



export interface CVData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
}
export const CVDataSchema = z.object({
  // El objeto PersonalInfo debe seguir su esquema
  personalInfo: PersonalInfoSchema,

  // Experiences debe ser un array donde cada ítem sigue el ExperienceSchema
  experiences: z.array(ExperienceSchema),

  // Education debe ser un array donde cada ítem sigue el EducationSchema
  education: z.array(EducationSchema),
});

// Tipos Inferidos (Opcional, pero recomendado)
// Esto te permite usar los esquemas para crear los tipos de TypeScript automáticamente.
export type PersonalInfoType = z.infer<typeof PersonalInfoSchema>;
export type ExperienceType = z.infer<typeof ExperienceSchema>;
export type EducationType = z.infer<typeof EducationSchema>;
export type CVDataType = z.infer<typeof CVDataSchema>;