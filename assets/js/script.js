// Script principal

// Aguarda o carregamento do HTML para ser executado
document.addEventListener('DOMContentLoaded', function () {

    carregar();

});

// Simulação de carregamento da tela
function carregar(mensagem = null) {
    let loading = document.querySelector('#loading');
    loading.style.display = 'flex';
    setTimeout(function () {
        loading.style.display = 'none';
        if (mensagem != null) {
            alerta(mensagem);
        }
    }, 1000);
}

// Formatações de data

function formatarDataParaBR(dataParaFormatar) {
    if(dataParaFormatar == "") return "";
    const data = new Date(dataParaFormatar);
    const dataFormatada = new Intl.DateTimeFormat('pt-BR').format(data);
    return dataFormatada;
}

function formatarDataParaISO(dataBR) {
    if(dataBR == "") return "";
    const partes = dataBR.split('/');
    const dataISO = `${partes[2]}-${partes[1]}-${partes[0]}`;
    return dataISO;
}