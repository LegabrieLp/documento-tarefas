var tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

$(function () {
    mostrarTabela();

    $("#botao").click(inserirTarefa);
    $(".campoTitulo, .campoObs").keypress(function (e) {
        if (e.which === 13) inserirTarefa();
    });

    $("tbody").on("click", ".botaoConcluir", function (e) {
        e.preventDefault();
        var i = $(this).closest("tr").data("indice");
        tarefas[i].concluida = !tarefas[i].concluida;
        atualizar();
    });

    $("tbody").on("click", ".botaoDeletar", function (e) {
        e.preventDefault();
        if (confirm("Deseja realmente apagar esta tarefa?")) {
            tarefas.splice($(this).closest("tr").data("indice"), 1);
            atualizar();
        }
    });
});

function inserirTarefa() {
    var titulo = $(".campoTitulo").val().trim();
    var obs = $(".campoObs").val().trim();

    if (titulo === "" || obs === "") {
        alert("Preencha o título e a observação antes de cadastrar a tarefa.");
        $(".campoTitulo").focus();
        return;
    }

    tarefas.push({ titulo: titulo, obs: obs, prioridade: $("#campoPrioridade").val(), concluida: false });
    atualizar();

    $(".campoTitulo, .campoObs").val("");
    $("#campoPrioridade").val("Média");
    M.updateTextFields();

    alert("Tarefa cadastrada com sucesso!");
    $(".campoTitulo").focus();
}

function atualizar() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
    mostrarTabela();
}

function mostrarTabela() {
    var html = "";

    $.each(tarefas, function (i, t) {
        html += '<tr data-indice="' + i + '" class="' + (t.concluida ? "concluida" : "") + '">' +
            "<td>" + $("<div>").text(t.titulo).html() + "</td>" +
            "<td>" + $("<div>").text(t.obs).html() + "</td>" +
            '<td><span class="prioridade ' + t.prioridade + '">' + t.prioridade + "</span></td>" +
            '<td class="centro"><a href="#" class="botaoConcluir"><i class="material-icons">' + (t.concluida ? "undo" : "check_circle") + "</i></a></td>" +
            '<td class="centro"><a href="#" class="botaoDeletar"><i class="material-icons">delete</i></a></td>' +
            "</tr>";
    });

    $("tbody").html(html || '<tr><td colspan="5" class="vazio">Nenhuma tarefa cadastrada ainda.</td></tr>');

    var concluidas = tarefas.filter(function (t) { return t.concluida; }).length;
    $("#contador").text("Pendentes: " + (tarefas.length - concluidas) + " | Concluídas: " + concluidas);
}