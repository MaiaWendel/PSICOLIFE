// terms.js
document.addEventListener('DOMContentLoaded', () => {
    const acceptCheckbox = document.querySelector('#acceptTerms');
    const submitButton = document.querySelector('#submitButton');

    acceptCheckbox.addEventListener('change', () => {
        submitButton.disabled = !acceptCheckbox.checked;
    });

    submitButton.addEventListener('click', () => {
        alert('Obrigado por aceitar os Termos e Condições. Você pode continuar!');
        // Aqui você pode adicionar um redirecionamento ou funcionalidade adicional
    });
});
