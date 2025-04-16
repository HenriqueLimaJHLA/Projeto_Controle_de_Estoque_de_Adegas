const FormLogin = document.getElementById('FormLogin');
const EmailUserLogin = document.getElementById('user_login');
const PasswordLogin = document.getElementById('user_password');

window.onload = function () {
    $.ajax({
        url: "./paginas/functions/efetuarLogin.php",
        method: "POST",
        data: { update_session: "true" },
        dataType: "json",
        success: function (data) {
            document.querySelector('input[type=hidden]').value = data;
        }
    });
};

// Deixar caracteres do email tudo minúsculas 
EmailUserLogin.addEventListener('keyup', (write) => {
    const input_email = write.target
    input_email.value = input_email.value.toLowerCase();
});

// Formulário de Login do Usuário
FormLogin.addEventListener('submit', (login) => {
    login.preventDefault();
    const ____ = document.querySelector('input[type=hidden]').value;

    const dadosLogin = {
        disparo: 'true',
        EmailUsuario: EmailUserLogin.value,
        SenhaUsuario: PasswordLogin.value,
        ___csrf_token: ____
    }
    $.ajax({
        url: "./paginas/functions/efetuarLogin.php",
        method: "POST",
        data: dadosLogin,
        dataType: "json",
        success: function (data) {
            EmailUserLogin.value = '';
            PasswordLogin.value = '';

            if (data === 'not_registred') {
                $.ajax({
                    url: "./paginas/functions/efetuarLogin.php",
                    method: "POST",
                    data: { user_not_registred: "true" },
                    dataType: "json",
                    success: function (data) {
                        document.querySelector('input[type=hidden]').value = data;
                    }
                });

                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3500,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    }
                });
                Toast.fire({
                    icon: "error",
                    title: "Usuário não está cadastrado no sistema da Adega Moreira's!"
                });
            }
            else if (data === 'login_autenticated') {
                window.location.href = "./paginas/home.php";
            }
            else if (data === 'not_autenticated') {
                $.ajax({
                    url: "./paginas/functions/efetuarLogin.php",
                    method: "POST",
                    data: { not_autenticated_user: "true" },
                    dataType: "json",
                    success: function (data) {
                        document.querySelector('input[type=hidden]').value = data;
                    }
                });

                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3500,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    }
                });
                Toast.fire({
                    icon: "error",
                    title: "Usuário e/ou Senha estão incorretos!! Tente Novamente!"
                });
            }
        },
        error(xhr, responseText) {
            console.log(xhr.responseText);
        }
    });
});

// Pegar ano automaticamente 
const date = new Date();
const year = String(date.getFullYear());

document.querySelector('.direitos').textContent = `©${year} LPITech. Todos os direitos reservados.`;

// Modo Dark e Light
const btnDarkLight = document.getElementById('dark_light');
let ModoDark = localStorage.getItem('dark-light');

if (!ModoDark) {
    ModoDark = 0;
    localStorage.setItem('dark-light', 0)
}

if (ModoDark == 0) {
    btnDarkLight.innerHTML = 'dark_mode';
    document.documentElement.style.setProperty("--cores-principais_2", "var(--cores-normal_corLogo2)");
    document.documentElement.style.setProperty("--cores-principais_1", "var(--cores-dark_corLogo1)");

    document.documentElement.style.setProperty("--cor-index_cor2", "var(--cores-dark_corLogo1)");
    document.documentElement.style.setProperty("--cor-index_cor1", "var(--cores-normal_corLogo2)");
    
    document.documentElement.style.setProperty("--cor-index_cor_border_input", "var(--cor-index_cor_border_input2)");

    document.documentElement.style.setProperty("--cor-index_cor_box-shadow1", "var(--cor-index_cor_box-shadow3)");

    document.getElementById('img_adega_moreiras').src = './media/Adega_Moreiras_Branco.jpg';
}
else {
    btnDarkLight.innerHTML = 'light_mode';
    document.documentElement.style.setProperty("--cores-principais_2", "var(--cores-dark_corLogo1)");
    document.documentElement.style.setProperty("--cores-principais_1", "var(--cores-normal_corLogo2)");

    document.documentElement.style.setProperty("--cor-index_cor2", "var(--cores-dark_corLogo2)");
    document.documentElement.style.setProperty("--cor-index_cor1", "var(--cor-index_cor3)");

    document.documentElement.style.setProperty("--cor-index_cor_border_input", "var(--cor-index_cor3)");

    document.documentElement.style.setProperty("--cor-index_cor_box-shadow1", "var(--cor-index_cor_box-shadow2)");

    document.getElementById('img_adega_moreiras').src = './media/Adega_Moreiras_Preto.jpg';
}

btnDarkLight.addEventListener('click', () => {
    if (ModoDark == 1) {
        btnDarkLight.innerHTML = 'dark_mode';
        localStorage.setItem('dark-light', 0);

        document.documentElement.style.setProperty("--cores-principais_2", "var(--cores-normal_corLogo2)");
        document.documentElement.style.setProperty("--cores-principais_1", "var(--cores-dark_corLogo1)");

        document.documentElement.style.setProperty("--cor-index_cor2", "var(--cores-dark_corLogo1)");
        document.documentElement.style.setProperty("--cor-index_cor1", "var(--cores-normal_corLogo2)");

        document.documentElement.style.setProperty("--cor-index_cor_border_input", "var(--cor-index_cor_border_input2)");
        document.documentElement.style.setProperty("--cor-index_cor_box-shadow1", "var(--cor-index_cor_box-shadow3)");

        document.getElementById('img_adega_moreiras').src = './media/Adega_Moreiras_Branco.jpg';
        ModoDark = 0;
    } else {
        btnDarkLight.innerHTML = 'light_mode';
        localStorage.setItem('dark-light', 1);

        document.documentElement.style.setProperty("--cores-principais_2", "var(--cores-dark_corLogo1)");
        document.documentElement.style.setProperty("--cores-principais_1", "var(--cores-dark_corLogo2)");

        document.documentElement.style.setProperty("--cor-index_cor2", "var(--cores-dark_corLogo2)");
        document.documentElement.style.setProperty("--cor-index_cor1", "var(--cor-index_cor3)");
    
        document.documentElement.style.setProperty("--cor-index_cor_border_input", "var(--cor-index_cor3)");
        document.documentElement.style.setProperty("--cor-index_cor_box-shadow1", "var(--cor-index_cor_box-shadow2)");
        document.getElementById('img_adega_moreiras').src = './media/Adega_Moreiras_Preto.jpg';
        ModoDark = 1;
    }
});