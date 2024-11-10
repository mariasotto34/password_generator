document.addEventListener("DOMContentLoaded", () => {
    console.clear();

    const sliderProps = {
        fill: "#0B1EDF",
        background: "rgba(255, 255, 255, 0.214)"
    };

    const slider = document.querySelector(".range__slider");
    const sliderValue = document.querySelector(".length__title");

    if (slider && slider.querySelector("input")) {
        slider.querySelector("input").addEventListener("input", event => {
            sliderValue.setAttribute("data-length", event.target.value);
            applyFill(event.target);
        });
        applyFill(slider.querySelector("input"));
    }

    function applyFill(slider) {
        const percentage = (100 * (slider.value - slider.min)) / (slider.max - slider.min);
        const bg = `linear-gradient(90deg, ${sliderProps.fill} ${percentage}%, ${sliderProps.background} ${percentage + 0.1}%)`;
        slider.style.background = bg;
        sliderValue.setAttribute("data-length", slider.value);
    }

    const randomFunc = {
        lower: getRandomLower,
        upper: getRandomUpper,
        number: getRandomNumber,
        symbol: getRandomSymbol
    };

    function secureMathRandom() {
        return window.crypto.getRandomValues(new Uint32Array(1))[0] / (Math.pow(2, 32) - 1);
    }

    function getRandomLower() {
        return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    }

    function getRandomUpper() {
        return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    }

    function getRandomNumber() {
        return String.fromCharCode(Math.floor(secureMathRandom() * 10) + 48);
    }

    function getRandomSymbol() {
        const symbols = '~!@#$%^&*()_+{}":?><;.,';
        return symbols[Math.floor(Math.random() * symbols.length)];
    }

    const resultEl = document.getElementById("result");
    const lengthEl = document.getElementById("slider");
    const uppercaseEl = document.getElementById("uppercase");
    const lowercaseEl = document.getElementById("lowercase");
    const numberEl = document.getElementById("number");
    const symbolEl = document.getElementById("symbol");
    const generateBtn = document.getElementById("generate");
    const copyBtn = document.getElementById("copy-btn");
    const copyInfo = document.querySelector(".result__info.right");
    const copiedInfo = document.querySelector(".result__info.left");

    let generatedPassword = false;

    // Ocultar el mensaje de copiado al inicio
    if (copyInfo && copiedInfo) {
        copyInfo.style.opacity = "0";
        copiedInfo.style.opacity = "0";
    }

    // Evento para copiar la contraseña generada
    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            const password = resultEl ? resultEl.textContent : "";
            if (!password || password === "CLICK GENERATE") return;

            navigator.clipboard.writeText(password).then(() => {
                if (copyInfo && copiedInfo) {
                    copyInfo.style.opacity = "0";
                    copiedInfo.style.opacity = "0.75";
                }
            }).catch(err => {
                console.error("Error al copiar al portapapeles", err);
            });
        });
    }

    // Evento para generar la contraseña
    if (generateBtn) {
        generateBtn.addEventListener("click", () => {
            const length = lengthEl ? +lengthEl.value : 0;
            const hasLower = lowercaseEl ? lowercaseEl.checked : false;
            const hasUpper = uppercaseEl ? uppercaseEl.checked : false;
            const hasNumber = numberEl ? numberEl.checked : false;
            const hasSymbol = symbolEl ? symbolEl.checked : false;

            generatedPassword = true;
            if (resultEl) {
                const password = generatePassword(length, hasLower, hasUpper, hasNumber, hasSymbol);
                resultEl.innerText = password ? password : "CLICK GENERATE"; // Mostrar mensaje solo si hay contraseña generada
            }

            if (copyInfo && copiedInfo) {
                copyInfo.style.opacity = "0.75";
                copiedInfo.style.opacity = "0";
            }
        });
    }

    function generatePassword(length, lower, upper, number, symbol) {
        let generatedPassword = "";
        const typesCount = lower + upper + number + symbol;
        const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(item => Object.values(item)[0]);

        if (typesCount === 0) {
            return "";
        }

        for (let i = 0; i < length; i += typesCount) {
            typesArr.forEach(type => {
                const funcName = Object.keys(type)[0];
                generatedPassword += randomFunc[funcName]();
            });
        }

        return generatedPassword.slice(0, length)
            .split('').sort(() => Math.random() - 0.5)
            .join('');
    }

    function disableOnlyCheckbox() {
        let totalChecked = [uppercaseEl, lowercaseEl, numberEl, symbolEl].filter(el => el && el.checked);
        totalChecked.forEach(el => {
            if (el) el.disabled = totalChecked.length === 1;
        });
    }

    [uppercaseEl, lowercaseEl, numberEl, symbolEl].forEach(el => {
        if (el) {
            el.addEventListener('click', () => {
                disableOnlyCheckbox();
            });
        }
    });
});
