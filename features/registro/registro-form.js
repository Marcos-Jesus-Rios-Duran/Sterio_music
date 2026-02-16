// features/registro/registro-form.js

window.initRegistroLogic = function () {
    console.log("REGISTRO: Inicializando lógica de validación...");
    const captchaContainer = document.getElementById('recaptcha-wrapper');
    // Leemos la llave del HTML
    const siteKey = captchaContainer.getAttribute('data-sitekey');

    try {
        // Verificamos si la librería de Google ya cargó
        if (window.grecaptcha && window.grecaptcha.render) {
            // Renderizamos MANUALMENTE el widget en nuestro div
            // Guardamos el widgetId para poder resetearlo luego
            window.currentCaptchaId = grecaptcha.render('recaptcha-wrapper', {
                'sitekey': siteKey,
                'theme': 'dark' // Tema oscuro para que combine con tu diseño
            });
        }
    } catch (e) {
        console.warn("El Captcha ya estaba renderizado o hubo un error:", e);
    }

    const form = document.getElementById('registroForm');
    const inputs = {
        name: document.getElementById('inputName'),
        user: document.getElementById('inputUser'),
        email: document.getElementById('inputEmail'),
        pass: document.getElementById('inputPass'),
        confirm: document.getElementById('inputPassConfirm'),
        instrument: document.getElementById('inputInstrument'),
        terms: document.getElementById('inputTerms')
    };

    const errors = {
        name: document.getElementById('errorName'),
        user: document.getElementById('errorUser'),
        email: document.getElementById('errorEmail'),
        confirm: document.getElementById('errorPassConfirm'),
        instrument: document.getElementById('errorInstrument'),
        terms: document.getElementById('errorTerms'),
        captcha: document.getElementById('errorCaptcha')
    };

    const checklist = document.getElementById('password-requirements');
    const checklistItems = {
        length: document.getElementById('req-length'),
        upper: document.getElementById('req-upper'),
        lower: document.getElementById('req-lower'),
        number: document.getElementById('req-num'),
        special: document.getElementById('req-special')
    };

    // --- 1. HELPERS DE UI ---
    function showError(key, message) {
        if (errors[key]) {
            errors[key].textContent = message;
            errors[key].classList.add('visible');
            if (inputs[key]) inputs[key].classList.add('input-error');
        }
    }

    function clearError(key) {
        if (errors[key]) {
            errors[key].classList.remove('visible');
            setTimeout(() => errors[key].textContent = '', 300);
            if (inputs[key]) inputs[key].classList.remove('input-error');
        }
    }

    // --- 2. LISTENERS EN TIEMPO REAL ---

    // Nombre
    inputs.name.addEventListener('input', () => {
        const errorMsg = Validators.isValidName(inputs.name.value);
        if (errorMsg) {
            showError('name', errorMsg);
        } else {
            // Si es null, es válido
            clearError('name');
        }
    });

    // Usuario
    inputs.user.addEventListener('input', () => {
        const errorMsg = Validators.isValidUsername(inputs.user.value);
        if (errorMsg) {
            showError('user', errorMsg);
        } else {
            // Si es null, es válido
            clearError('user');
        }
    });

    // Contraseña (Lógica especial de checklist)
    inputs.pass.addEventListener('input', (e) => {
        const val = e.target.value;

        // Mostrar/Ocultar checklist
        if (val.length > 0) {
            checklist.classList.remove('hidden');
        } else {
            checklist.classList.add('hidden');
            return;
        }

        // Validar reglas visualmente
        const strength = Validators.checkPasswordStrength(val);

        // Función helper para pintar items
        const setItemStatus = (item, isValid) => {
            if (isValid) {
                item.classList.add('valid');
                item.classList.remove('invalid');
                item.innerHTML = '✓ ' + item.innerText.replace('✓ ', '').replace('❌ ', ''); // Hack simple
            } else {
                item.classList.remove('valid');
                item.classList.add('invalid');
            }
        };

        setItemStatus(checklistItems.length, strength.length);
        setItemStatus(checklistItems.upper, strength.upper);
        setItemStatus(checklistItems.lower, strength.lower);
        setItemStatus(checklistItems.number, strength.number);
        setItemStatus(checklistItems.special, strength.special);
        if (inputs.confirm.value.length > 0) {
            if (inputs.confirm.value !== val) {
                showError('confirm', 'Las melodías han dejado de coincidir.');
            } else {
                clearError('confirm');
            }
        }
    });

    // Ocultar checklist si se sale del campo y está vacío
    inputs.pass.addEventListener('blur', () => {
        if (inputs.pass.value.length === 0) checklist.classList.add('hidden');
    });

    // Confirmar Contraseña
    inputs.confirm.addEventListener('input', () => {
        if (inputs.confirm.value !== inputs.pass.value) {
            showError('confirm', 'Las melodías no coinciden (contraseñas distintas).');
        } else {
            clearError('confirm');
        }
    });
    // Dentro de tu función window.initRegistroLogic = function() { ...

    // --- A. LÓGICA DE VER/OCULTAR CONTRASEÑA ---
    const toggleButtons = document.querySelectorAll('.toggle-password');

    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const inputId = btn.getAttribute('data-target');
            const input = document.getElementById(inputId);

            if (input.type === 'password') {
                input.type = 'text';
                btn.textContent = 'visibility_off'; // Cambia el icono
            } else {
                input.type = 'password';
                btn.textContent = 'visibility';
            }
        });
    });

    // --- B. LÓGICA DEL NIVEL DE FUERZA (METER) ---
    const inputPass = document.getElementById('inputPass');
    const strengthBar = document.getElementById('strength-bar');

    inputPass.addEventListener('input', (e) => {
        const val = e.target.value;
        const stats = Validators.checkPasswordStrength(val);

        // Contamos cuántas reglas se cumplen (0 a 5)
        const points = Object.values(stats).filter(v => v === true).length;

        // Calculamos porcentaje de la barra
        const percentage = (points / 5) * 100;
        strengthBar.style.width = `${percentage}%`;

        // Cambiamos colores según el nivel
        strengthBar.className = 'bar'; // Reset
        if (points <= 2) {
            strengthBar.classList.add('weak');
        } else if (points <= 4) {
            strengthBar.classList.add('medium');
        } else {
            strengthBar.classList.add('strong');
        }
    });

    // --- 3. SUBMIT DEL FORMULARIO ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValidForm = true;

        // Validaciones finales (Submit time)

        // A. Validar Campos Básicos vacíos o erróneos
        const nameError = Validators.isValidName(inputs.name.value);
        if (nameError) {
            showError('name', nameError); // Usa el mensaje real que viene del validador
            isValidForm = false;
        }
        if (!Validators.isValidUsername(inputs.user.value)) {
            showError('user', 'El nombre de usuario no cumple las reglas.');
            isValidForm = false;
        }
        if (!Validators.isValidEmail(inputs.email.value) || !Validators.isCommonDomain(inputs.email.value)) {
            showError('email', 'Correo inválido o dominio no permitido.');
            isValidForm = false;
        }

        // B. Validar Password Global
        if (!Validators.isPasswordValid(inputs.pass.value)) {
            // Animamos la checklist para llamar la atención
            checklist.classList.add('shake-anim');
            setTimeout(() => checklist.classList.remove('shake-anim'), 500);
            isValidForm = false;
        }
        if (inputs.pass.value !== inputs.confirm.value) {
            showError('confirm', 'Las contraseñas no son iguales.');
            isValidForm = false;
        }

        // C. Validar Select
        if (inputs.instrument.value === "") {
            showError('instrument', 'Por favor, elige tu instrumento.');
            isValidForm = false;
        } else {
            clearError('instrument');
        }

        // D. Validar Términos
        if (!inputs.terms.checked) {
            showError('terms', 'Debes aceptar las reglas del estudio.');
            isValidForm = false;
        } else {
            clearError('terms');
        }

        // E. Validar reCAPTCHA
        const recaptchaResponse = grecaptcha.getResponse();
        if (recaptchaResponse.length === 0) {
            showError('captcha', 'Demuestra que no eres un bot (🤖❌).');
            isValidForm = false;
        } else {
            clearError('captcha');
        }

        if (isValidForm) {
            // ESTADO DE CARGA
            const btn = document.getElementById('btnSubmit');
            const originalText = btn.innerText;

            btn.innerText = "Generando tu perfil musical...";
            btn.classList.add('loading');

            // Simulación de envío a Backend
            setTimeout(() => {
                console.log("Datos enviados:", {
                    name: inputs.name.value,
                    user: inputs.user.value,
                    instrument: inputs.instrument.value,
                    token: recaptchaResponse
                });

                alert("¡Bienvenido a SteroMusic! Tu cuenta ha sido creada.");
                // Router.navigate('/login'); // Ejemplo de redirección

                // Reset form
                btn.innerText = originalText;
                btn.classList.remove('loading');
                grecaptcha.reset(); // Resetear captcha
                form.reset();
            }, 2000);
        }
    });
};