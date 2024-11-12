// Script relacionado ao módulo de acomodacaos

// Array principal armazenado no navegador
if (localStorage.getItem('listaAcomodacoes') == null) {
    listaAcomodacoes = [];
    localStorage.setItem('listaAcomodacoes', JSON.stringify(listaAcomodacoes));
} else {
    listaAcomodacoes = JSON.parse(localStorage.getItem('listaAcomodacoes'));
}

// Aguarda o carregamento do HTML para ser executado
document.addEventListener('DOMContentLoaded', function () {

    // Chamadas
    listar();

    // Salva cadastro e edição
    document.querySelector('#bt-salvar').addEventListener('click', function () {
        // Pega os dados dos campos do formulário
        let id = document.querySelector('#campo-id').value;
        let nome = document.querySelector('#campo-nome').value;
        let valorDiaria = document.querySelector('#campo-valor-diaria').value;
        let limiteHospedes = document.querySelector('#campo-limite-hospedes').value;
        let descricao = document.querySelector('#campo-descricao').value;
        let funcionario = document.querySelector('#campo-funcionario').value;

        // Validações de campos
        if (nome == "") {
            alerta("Nome é um campo obrigatório!");
            return;
        } else if (valorDiaria == "") {
            alerta("Valor da diária é um campo obrigatório!");
            return;
        } else if (limiteHospedes == "") {
            alerta("Limite de hóspedes é um campo obrigatório!");
            return;
        } else if (funcionario == "") {
            alerta("Funcionário é um campo obrigatório!");
            return;
        }

        // Cria objeto
        let acomodacao = {
            id: (id != "") ? id : getMaiorIdLista() + 1,
            nome: nome,
            valorDiaria: valorDiaria,
            limiteHospedes: limiteHospedes,
            descricao: descricao,
            funcionario: funcionario
        };

        // Altera ou insere uma posição no array principal
        if (id != "") {
            let indice = getIndiceListaPorId(id)
            listaAcomodacoes[indice] = acomodacao;
        } else {
            listaAcomodacoes.push(acomodacao);
        }

        // Armazena a lista atualizada no navegador
        localStorage.setItem('listaAcomodacoes', JSON.stringify(listaAcomodacoes));

        // Reseta o formulário e recarrega a tabela de listagem
        this.blur();
        resetarForm()

        // Recarrega listagem
        carregar("Salvo com sucesso!");
        listar();
    });

    // Cancelamento de edição
    document.querySelector('#bt-cancelar').addEventListener('click', function () {
        resetarForm();
    });

    

});

// Funções

function listar() {
    document.querySelector('table tbody').innerHTML = "";
    document.querySelector('#total-registros').textContent = listaAcomodacoes.length;
    listaAcomodacoes.forEach(function (objeto) {
        // Cria string html com os dados da lista
        let htmlAcoes = "";
        htmlAcoes += '<button class="bt-tabela bt-editar" title="Editar"><i class="ph ph-pencil"></i></button>';
        htmlAcoes += '<button class="bt-tabela bt-excluir" title="Excluir"><i class="ph ph-trash"></i></button>';

        let htmlColunas = "";
        htmlColunas += "<td>" + objeto.id + "</td>";
        htmlColunas += "<td>" + objeto.nome + "</td>";
        htmlColunas += "<td>" + objeto.valorDiaria + "</td>";
        htmlColunas += "<td>" + objeto.limiteHospedes + "</td>";
        if (objeto.descricao.length === 0) {
            htmlColunas += "<td>" + "Sem descrição" + "</td>";
        } else {
            htmlColunas += "<td>" + objeto.descricao + "</td>";
        }
        htmlColunas += "<td>" + objeto.funcionario + "</td>";
        htmlColunas += "<td>" + htmlAcoes + "</td>";

        // Adiciona a linha ao corpo da tabela
        let htmlLinha = '<tr id="linha-' + objeto.id + '">' + htmlColunas + '</tr>';
        document.querySelector('table tbody').innerHTML += htmlLinha;
    });

    eventosListagem();
    carregar();
}

let botaoAtualExcluir;

function eventosListagem() {
    // Ação de editar objeto
    document.querySelectorAll('.bt-editar').forEach(function (botao) {
        botao.addEventListener('click', function () {
            // Pega os dados do objeto que será alterado
            let linha = botao.parentNode.parentNode;
            let colunas = linha.getElementsByTagName('td');
            let id = colunas[0].textContent;
            let nome = colunas[1].textContent;
            let valorDiaria = colunas[2].textContent;
            let limiteHospedes = colunas[3].textContent;
            let descricao;
            if (colunas[4].textContent == "Sem descrição")
                descricao = "";
            else 
                descricao = colunas[4].textContent;
            let funcionario = colunas[5].textContent;

            // Popula os campos do formulário
            document.querySelector('#campo-id').value = id;
            document.querySelector('#campo-nome').value = nome;
            document.querySelector('#campo-valor-diaria').value = valorDiaria;
            document.querySelector('#campo-limite-hospedes').value = limiteHospedes;
            document.querySelector('#campo-descricao').value = descricao;
            document.querySelector('#campo-funcionario').value = funcionario;

            // Exibe botão de cancelar edição
            document.querySelector('#bt-cancelar').style.display = 'flex';
        });
    });

    // Ação de excluir objeto
    document.querySelectorAll('.bt-excluir').forEach(function (botao) {
        botao.addEventListener('click', function () {
            botaoAtualExcluir = botao;
            confirmar("Deseja realmente excluir?", "excluirObjeto");
        });
    });
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// CORREÇÃO DE BUG: o popup do alerta novo ta bugada e excluindo mais de um elemento (EU ACHO Q TA RESOLVIDO)
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function excluirObjeto() {
    // Remove objeto da lista
    let linha = botaoAtualExcluir.parentNode.parentNode;
    let id = linha.id.replace('linha-', '');
    let indice = getIndiceListaPorId(id);
    listaAcomodacoes.splice(indice, 1);

    // Armazena a lista atualizada no navegador
    localStorage.setItem('listaAcomodacoes', JSON.stringify(listaAcomodacoes));

    // Recarrega a listagem
    listar();
}

function getIndiceListaPorId(id) {
    indiceProcurado = null;
    listaAcomodacoes.forEach(function (objeto, indice) {
        if (id == objeto.id) {
            indiceProcurado = indice;
        }
    });
    return indiceProcurado;
}

function getMaiorIdLista() {
    if (listaAcomodacoes.length > 0) {
        return parseInt(listaAcomodacoes[listaAcomodacoes.length - 1].id);
    } else {
        return 0;
    }
}

function resetarForm() {
    document.querySelector('#bt-cancelar').style.display = 'none';
    document.querySelector('#campo-id').value = "";
    document.querySelector('#campo-nome').value = "";
    document.querySelector('#campo-valor-diaria').value = "";
    document.querySelector('#campo-limite-hospedes').value = "";
    document.querySelector('#campo-descricao').value = "";
    document.querySelector('#campo-funcionario').value = "";
}

function alerta(mensagem) {

    document.querySelector('#botaoTipoAlerta').style.display = "";
    document.querySelector('#botaoTipoConfirmar').style.display = "";

    document.querySelector('#mensagemAlerta').innerHTML = mensagem;
    document.querySelector('#botaoTipoAlerta').style.display = "flex";
    document.querySelector('#alerta').style.display = "flex";

    document.getElementById('botaoAlerta').onclick = function() {
        document.querySelector('#alerta').style.display = "";
        document.querySelector('#botaoTipoAlerta').style.display = "";
    };
}

let funcaoAtual;

function confirmar(mensagem, funcao) {

    document.querySelector('#botaoTipoAlerta').style.display = "";
    document.querySelector('#botaoTipoConfirmar').style.display = "";

    funcaoAtual = funcao;
    
    document.querySelector('#mensagemAlerta').innerHTML = mensagem;
    document.querySelector('#botaoTipoConfirmar').style.display = "flex";
    document.querySelector('#alerta').style.display = "flex";

    document.getElementById('botaoConfirmarSim').onclick = function() {
        document.querySelector('#alerta').style.display = "";
        document.querySelector('#botaoTipoConfirmar').style.display = "";
        eval(funcao + "()");
    };

    document.getElementById('botaoConfirmarNao').onclick = function() {
        document.querySelector('#alerta').style.display = "";
        document.querySelector('#botaoTipoConfirmar').style.display = "";
    };

    // addEventListener da uma bugada, nao sei pq mas só funciona com o onclick msm

    // document.querySelector('#botaoConfirmarSim').addEventListener('click', function () {
    //     document.querySelector('#alerta').style.display = "";
    //     document.querySelector('#botaoTipoConfirmar').style.display = "";
    //     eval(funcao + "()");
    //     return;
    // });

    // document.querySelector('#botaoConfirmarNao').addEventListener('click', function () {
    //     document.querySelector('#alerta').style.display = "";
    //     document.querySelector('#botaoTipoConfirmar').style.display = "";
    //     return;
    // });
}

function exemplosAcomodacoes() {
    listaAcomodacoes = [
        {
            "id": 1,
            "nome": "Domo",
            "valorDiaria": "590",
            "limiteHospedes": "2",
            "descricao": "Os valores exibidos no site estão sujeitos a constantes atualizações. Nos feriados e datas comemorativas o valor da diária também é diferenciado. Para mais detalhes entre em contato por telefone. O Domo é a grande novidade da pousada. Uma acomodação totalmente diferenciada construída nos padrões arquitetônicos dos domos geodésicos modernos. (Arraste a imagem de capa para o lado para ver mais fotos da acomodação)",
            "funcionario": "João Costa Oliveira"
        },
        {
            "id": "2",
            "nome": "Charrua (Bus)",
            "valorDiaria": "490",
            "limiteHospedes": "2",
            "descricao": "Os valores exibidos no site estão sujeitos a constantes atualizações. Nos feriados e datas comemorativas o valor da diária também é diferenciado. Para mais detalhes entre em contato por telefone. O Charrua é uma das grandes novidades da pousada. A seguir alguns detalhes que acompanham esta acomodação especial: Roupas de cama; Roupas de banho; Banheira de hidromassagem; Cozinha básica; Taças; Churrasqueira; Televisão; Soundbar Jbl Cinema; Cafeteira com cápsula; Rede de descanso; Área com vista para o mar; Deck externo com fogueira; Acompanha uma cesta de café da manhã; (Arraste a imagem de capa para o lado para ver mais fotos da acomodação)",
            "funcionario": "Beatriz Martínez García"
        },
        {
            "id": "3",
            "nome": "Suíte Com Cozinha",
            "valorDiaria": "390",
            "limiteHospedes": "3",
            "descricao": "Os valores exibidos no site estão sujeitos a constantes atualizações. Para mais detalhes entre em contato por telefone. Com ampla vista para o mar, esta acomodação possui cama de casal, cama extra, ar-condicionado e TV, além de possuir também uma pequena cozinha com utensílios básicos e banheiro. Na sua parte externa possui deck com churrasqueira. A acomodação é ideal para duas pessoas, podendo comportar até três. (Arraste a imagem de capa para o lado para ver mais fotos da acomodação)",
            "funcionario": "Beatriz Martínez García"
        },
        {
            "id": "4",
            "nome": "Chalé Família",
            "valorDiaria": "590",
            "limiteHospedes": "5",
            "descricao": "Os valores exibidos no site estão sujeitos a constantes atualizações. Para mais detalhes entre em contato por telefone. Esta acomodação possui dois quartos, um dos quartos com cama de casal e TV e o outro com cama de casal e uma de solteiro. Ambos os quartos são equipados com ar-condicionado. Possui também banheiro, cozinha com utensílios básicos e churrasqueira. Na sua parte externa possui sacada com ampla vista para o mar. A acomodação é ideal para até cinco pessoas. (Arraste a imagem de capa para o lado para ver mais fotos da acomodação)",
            "funcionario": "João Costa Oliveira"
        },
        {
            "id": "5",
            "nome": "Cabana",
            "valorDiaria": "490",
            "limiteHospedes": "3",
            "descricao": "Os valores exibidos no site estão sujeitos a constantes atualizações. Para mais detalhes entre em contato por telefone. Esta acomodação está localizada em uma área mais reservada da pousada. Possui cama de casal, uma cama de solteiro, cama extra, ar-condicionado, TV, cozinha com utensílios básicos e banheiro. Na área externa possui varanda e deck com churrasqueira, tendo ampla vista para o mar. A acomodação é ideal para três pessoas, podendo comportar até quatro. (Arraste a imagem de capa para o lado para ver mais fotos da acomodação)",
            "funcionario": "João Costa Oliveira"
        },
        {
            "id": "6",
            "nome": "Estacionamento Para Overlanders",
            "valorDiaria": "100",
            "limiteHospedes": "0",
            "descricao": "Os valores exibidos no site estão sujeitos a constantes atualizações. Para mais detalhes entre em contato por telefone. A pousada conta também com um espaço plano com vista para o mar, destinado a estacionamento de overlanders, tendo disponível para uso ponto de água e luz. Possui também banheiro e churrasqueira para uso comum destes viajantes. (Arraste a imagem de capa para o lado para ver mais fotos da acomodação)",
            "funcionario": "Beatriz Martínez García"
        },
        {
            "id": 7,
            "nome": "Exemplo sem Descrição",
            "valorDiaria": "0",
            "limiteHospedes": "0",
            "descricao": "",
            "funcionario": "Beatriz Martínez García"
        }
    ];

    localStorage.setItem('listaAcomodacoes', JSON.stringify(listaAcomodacoes));
    listar();
}