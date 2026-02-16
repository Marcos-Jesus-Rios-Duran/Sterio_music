/**
 * STERO MUSIC - VALIDATORS LIB
 * Versión 4.0: Blacklist Local + API Saver + Coherencia
 */
const Validators = {
    // 1. VALIDACIÓN LOCAL (Rápida, sin gastar créditos)
    // Sterio_music/core/utils/validators.js

isValidName: (name) => {
        // 1. No estar vacío
        if (validator.isEmpty(name)) return "El nombre es obligatorio.";

        // 2. DETECTAR DOBLES ESPACIOS
        if (name.includes("  ")) return "Error: Has escrito espacios dobles.";

        // 3. SOLO LETRAS (Regex estricto)
        // Esto ya cubre lo que hacía el isAlpha del final.
        if (!validator.matches(name, /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)) {
            return "El nombre solo debe contener letras (sin números ni símbolos).";
        }

        // 4. NOMBRE COMPLETO (Esto evita cosas como 'asdfghjkl' porque exige dos palabras)
        if (!name.trim().includes(' ')) return "Por favor, ingresa tu Nombre y Apellido.";

        // 5. LONGITUD MÍNIMA
        if (!validator.isLength(name, { min: 5 })) return "El nombre es demasiado corto.";

        // 6. DETECTAR REPETICIONES (El anti-gatos caminando por el teclado)
        // Detecta 3 letras iguales seguidas (ej: "Aaa", "rrr")
        if (/(.)\1{2,}/.test(name)) return "Parece que hay letras repetidas incoherentes.";

        return null; // Todo correcto
    },

    isValidUsername: (username) => {
        // 1. Validaciones básicas
        if (validator.isEmpty(username)) return "El usuario es obligatorio.";
        if (username.includes(" ")) return "No se permiten espacios.";
        if (!validator.isLength(username, { min: 5 })) return "Mínimo 5 caracteres.";
        if (!validator.isLength(username, { max: 15 })) return "Máximo 15 caracteres.";

        // 2. Anti-Gatos (Tu regla actual de 3 letras idénticas)
        if (/(.)\1{2,}/.test(username)) {
            return "No repitas la misma letra tantas veces.";
        }

        // --- NUEVAS REGLAS INTELIGENTES ---

        // 3. Regla de la Vocal: ¿Tiene al menos una vocal?
        // (Incluimos vocales con tilde y la 'y' que a veces actúa como vocal)
        if (!/[aeiouyáéíóúü]/i.test(username)) {
            return "El usuario impronunciable (falta alguna vocal).";
        }

        // 4. Regla de Consonantes Consecutivas:
        // Bloquea cosas como "dsdsss" (6 consonantes) o "bcdfgh"
        // Permitimos hasta 4 (ej: 'Schm' en Schmidt), 5 ya es sospechoso.
        if (/[bcdfghjklmnpqrstvwxzñ]{5,}/i.test(username)) {
            return "Parece que te sentaste en el teclado (muchas consonantes).";
        }

        // 5. Validación final de caracteres
        if (!validator.isAlphanumeric(username, 'es-ES')) return "Solo letras y números.";

        return null; // Todo OK
    },

    isValidEmailFormat: (email) => {
        if (typeof validator === 'undefined') return false;
        return validator.isEmail(email);
    },

    // Sterio_music/core/utils/validators.js

    // Lista negra ampliada (puedes agregar más)
    EMAIL_BLACKLIST: [
        "ejemplo.com", "example.com", "test.com", "prueba.com",
        "mailinator.com", "yopmail.com", "10minutemail.com",
        "guerrillamail.com", "temp-mail.org", "fake.com", "hotmail.con", "gmil.com" // Typos comunes
    ],

    verifyEmailReal: async (email) => {
        // 1. SEMÁFORO ROJO: Validación de formato (Librería local, costo 0)
        if (!validator.isEmail(email)) {
            return { isValid: false, msg: "El formato del correo no es válido." };
        }

        // 2. SEMÁFORO AMARILLO: Lista Negra Local (Costo 0)
        const domain = email.split('@')[1].toLowerCase();
        if (Validators.EMAIL_BLACKLIST.includes(domain)) {
            console.log("🚫 Bloqueado localmente: " + domain);
            return { isValid: false, msg: "Este proveedor de correo no está permitido." };
        }

        // 3. SEMÁFORO VERDE: Llamada a la API (Solo llegamos aquí si pasó lo anterior)
        const API_KEY = "6b16da904b1f492d88f71be2497d7aac";
        const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${API_KEY}&email=${email}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            // Si la API dice que no existe o es desechable
            if (data.deliverability === "UNDELIVERABLE") {
                return { isValid: false, msg: "El correo no existe realmente." };
            }
            if (data.is_disposable_email && data.is_disposable_email.value === true) {
                return { isValid: false, msg: "No aceptamos correos temporales." };
            }

            return { isValid: true }; // Todo OK
        } catch (error) {
            console.warn("⚠️ API Error: Dejando pasar el correo por fallo de red.");
            // Fallback: Si la API falla, asumimos que es válido para no bloquear al usuario
            return { isValid: true };
        }
    },
    validatePassword: (password) => {
        if (validator.isEmpty(password)) return "La contraseña es obligatoria.";
        if (password.includes(" ")) return "No se permiten espacios.";
        if (password.length < 8) return "Debe tener al menos 8 caracteres.";
        if (password.length > 15) return "Máximo 15 caracteres.";

        const stats = Validators.checkPasswordStrength(password);
        if (!stats.upper) return "Falta una mayúscula.";
        if (!stats.lower) return "Falta una minúscula.";
        if (!stats.number) return "Falta un número.";
        if (!stats.special) return "Falta un carácter especial.";

        return null;
    },
    checkPasswordStrength: (password) => {
        return {
            length: password.length >= 8,
            upper: /[A-Z]/.test(password),
            lower: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
    },

    isPasswordValid: (password) => {
        const checks = Validators.checkPasswordStrength(password);
        return Object.values(checks).every(Boolean);
    }
};