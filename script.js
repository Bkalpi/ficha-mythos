function calcularModificador(valor) {
  return Math.floor((valor - 10) / 2);
}

function atualizarModificadores() {
  const atributos = document.querySelectorAll('input[data-atributo]');
  atributos.forEach(input => {
    const valor = parseInt(input.value) || 0;
    const modificador = calcularModificador(valor);
    const celulaModificador = input.closest('tr').querySelector('.modificador');
    if (celulaModificador) {
      celulaModificador.textContent = modificador;
    }
  });

  atualizarPVMaximo();
  atualizarSanMaxima();
  atualizarDefesa(); // <-- Chama a função de defesa sempre que os atributos forem atualizados
}

function atualizarPVMaximo() {
  const conInput = document.querySelector('input[data-atributo="CON"]');
  const con = parseInt(conInput?.value) || 0;
  const pvMax = 6 + (con * 2);
  const pvMaxInput = document.getElementById('pv-max');
  pvMaxInput.value = pvMax;
  atualizarBarra('pv-atual', 'pv-max', 'pv-bar');
}

function atualizarSanMaxima() {
  const sabInput = document.querySelector('input[data-atributo="SAB"]');
  const sab = parseInt(sabInput?.value) || 0;
  const sanMax = sab * 5;
  const sanMaxInput = document.getElementById('san-max');
  sanMaxInput.value = sanMax;
  atualizarBarra('san-atual', 'san-max', 'san-bar');
}

function atualizarBarra(idAtual, idMaximo, idBarra) {
  const atual = parseInt(document.getElementById(idAtual)?.value) || 0;
  const max = parseInt(document.getElementById(idMaximo)?.value) || 1;
  const barra = document.getElementById(idBarra);
  const porcentagem = Math.max(0, Math.min(100, (atual / max) * 100));
  barra.style.width = `${porcentagem}%`;
}

function atualizarDefesa() {
  const desInput = document.querySelector('input[data-atributo="DES"]');
  const modDesInput = document.getElementById('mod-des');
  const aleatorioInput = document.getElementById('defesa-bonus');
  const totalInput = document.getElementById('defesa-total');

  const des = parseInt(desInput?.value) || 0;
  const modDes = calcularModificador(des);
  const bonus = parseInt(aleatorioInput?.value) || 0;
  const total = 10 + modDes + bonus;

  if (modDesInput) {
    modDesInput.value = modDes;
    modDesInput.readOnly = true;
  }

  if (totalInput) {
    totalInput.value = total;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  atualizarModificadores();

  document.querySelectorAll('input[data-atributo]').forEach(input => {
    input.addEventListener('input', atualizarModificadores);
  });

  document.getElementById('pv-atual').addEventListener('input', () => {
    atualizarBarra('pv-atual', 'pv-max', 'pv-bar');
  });

  document.getElementById('san-atual').addEventListener('input', () => {
    atualizarBarra('san-atual', 'san-max', 'san-bar');
  });

  document.getElementById('defesa-bonus').addEventListener('input', atualizarDefesa);
});

// Parafernalha de Peícias do Waternuse
function atualizarPericias() {
  document.querySelectorAll('.linha-pericia').forEach(linha => {
    const atributoBase = linha.dataset.atributoBase;
    const inputAtributo = document.querySelector(`input[data-atributo="${atributoBase}"]`);
    const valor = parseInt(inputAtributo?.value) || 0;
    const modificador = Math.floor((valor - 10) / 2);

    const campoModAttr = linha.querySelector('.mod-atributo');
    const campoModExtra = linha.querySelector('.mod-extra');
    const campoTotal = linha.querySelector('.mod-pericia');

    if (campoModAttr) campoModAttr.value = modificador;

    const extra = parseInt(campoModExtra.value) || 0;
    campoTotal.value = modificador + extra;
  });
}

function atualizarPericias() {
  document.querySelectorAll('.linha-pericia').forEach(linha => {
    const atributoBase = linha.dataset.atributoBase;
    const inputAtributo = document.querySelector(`input[data-atributo="${atributoBase}"]`);
    const valor = parseInt(inputAtributo?.value) || 0;
    const modificador = Math.floor((valor - 10) / 2);

    const campoModAttr = linha.querySelector('.mod-atributo');
    const campoModExtra = linha.querySelector('.mod-extra');
    const campoTotal = linha.querySelector('.mod-pericia');

    if (campoModAttr) campoModAttr.value = modificador;

    const extra = parseInt(campoModExtra.value) || 0;
    campoTotal.value = modificador + extra;
  });
}

// 📢 Popup e Áudio
const popup = document.getElementById("resultado-dado");
const texto = document.getElementById("resultado-texto");

// 🔊 Áudio de rolagem de dado (link seguro de .mp3)
const audioDado = new Audio("https://files.catbox.moe/lvohmh.wav");

// 🧠 Função de rolar o dado
function rolarD20(modTotal) {
  // Garante que o áudio esteja no começo
  audioDado.currentTime = 0;
  audioDado.play().catch(e => {
    console.log("Audio play bloqueado, interação necessária");
  });

  // Depois do som, mostra o popup
  setTimeout(() => {
    const rolagem = Math.floor(Math.random() * 20) + 1;
    const resultadoFinal = rolagem + modTotal;

    texto.innerHTML = `D20: ${rolagem}<br>Modificador: ${modTotal >= 0 ? '+' : ''}${modTotal}<br><strong>Total: ${resultadoFinal}</strong>`;
    popup.style.display = "block";
  }, 500); // 0.5 segundo, dá tempo do som tocar
}

// 🚀 Inicialização dos eventos
document.addEventListener('DOMContentLoaded', () => {
  atualizarPericias();

  document.querySelectorAll('input[data-atributo]').forEach(input => {
    input.addEventListener('input', atualizarPericias);
  });

  document.querySelectorAll('.mod-extra').forEach(input => {
    input.addEventListener('input', atualizarPericias);
  });

  document.querySelectorAll('.aptidao-select').forEach(select => {
    select.addEventListener('change', atualizarPericias);
  });

// 🎲 Eventos de rolagem normal nas perícias
document.querySelectorAll('.linha-pericia .dado-botao').forEach(botao => {
  botao.addEventListener('click', (e) => {
    const linha = e.target.closest('.linha-pericia');
    const mod = parseInt(linha.querySelector('.mod-pericia')?.value) || 0;
    rolarD20(mod);
  });
});

// 🎯 Evento de rolagem no combate
document.getElementById('botao-combate').addEventListener('click', () => {
  const expressao = document.getElementById('entrada-combate').value;
  rolarExpressaoDados(expressao);
});
  });

// ❌ Função para fechar o popup
function fecharPopup() {
  document.getElementById("resultado-dado").style.display = "none";
}

function rolarExpressaoDados(expressao) {
  // 🔊 Toca o som do dado
  audioDado.currentTime = 0;
  audioDado.play().catch(e => console.log("Audio play bloqueado"));

  setTimeout(() => {
    const regex = /(\d*)d(3|4|6|8|10|12|20)|([+-]\d+(?!d))/g;
    let match;
    let detalhes = [];
    let total = 0;

    while ((match = regex.exec(expressao.replace(/\s+/g, ''))) !== null) {
      if (match[1] !== undefined) {
        const qtd = parseInt(match[1]) || 1; // Se não colocar número, assume 1
        const faces = parseInt(match[2]);

        if (qtd === 1) {
          // Se for só 1 dado, mostra o valor diretamente
          const resultado = Math.floor(Math.random() * faces) + 1;
          detalhes.push(`d${faces}: ${resultado}`);
          total += resultado;
        } else {
          // Se for mais de 1 dado, soma tudo e mostra o total dos dados
          let somaDados = 0;
          for (let i = 0; i < qtd; i++) {
            somaDados += Math.floor(Math.random() * faces) + 1;
          }
          detalhes.push(`${qtd}d${faces}: ${somaDados}`);
          total += somaDados;
        }
      } else if (match[3] !== undefined) {
        // Modificadores simples (+ ou - número)
        const mod = parseInt(match[3]);
        detalhes.push(`modificador: ${mod >= 0 ? '+' : ''}${mod}`);
        total += mod;
      }
    }

    if (detalhes.length === 0) {
      detalhes.push("Nenhuma rolagem válida detectada.");
    }

    texto.innerHTML = detalhes.join('<br>') + `<br><br><strong>Total: ${total}</strong>`;
    popup.style.display = "block";
  }, 500); // Espera o som antes de mostrar
}

// Botão de rolar d100
document.getElementById('botao-d100').addEventListener('click', () => {
  audioDado.currentTime = 0;
  audioDado.play().catch(e => {
    console.log("Audio play bloqueado, interação necessária");
  });

  setTimeout(() => {
    const rolagem = Math.floor(Math.random() * 100) + 1;

    const popup = document.getElementById("resultado-dado");
    const texto = document.getElementById("resultado-texto");
    texto.innerHTML = `<strong>d100:</strong> ${rolagem}`;
    popup.style.display = "block";
  }, 500); // 0.5 segundo depois do som
});

function criarInput(label, placeholder = "") {
  return `<div>
    <label>${label}</label>
    <input type="text" placeholder="${placeholder}">
  </div>`;
}

function adicionarArma() {
  const html = `
    <div class="inventario-item">
      <button class="botao-remover" onclick="removerItem(this)">X</button>
      <div class="inventario-linha">
        ${criarInput('ARMA')}
        ${criarInput('DANO')}
        ${criarInput('CRÍTICO')}
        ${criarInput('MULTIP.')}
      </div>
      <div class="inventario-linha">
        <div>
          <label>TIPO DE DANO</label>
          <select>
            <option>Perfurante</option>
            <option>Balístico</option>
            <option>Cortante</option>
            <option>Impacto</option>
            <option>Fogo</option>
            <option>Frio</option>
            <option>Elétrico</option>
            <option>Mental</option>
            <option>Pútrido</option>
            <option>Vazio</option>
          </select>
        </div>
        ${criarInput('EFEITO')}
        ${criarInput('ALCANCE')}
      </div>
    </div>`;
  document.getElementById("inventario-conteudo").insertAdjacentHTML("beforeend", html);
}

function adicionarItem() {
  const html = `
    <div class="inventario-item">
      <button class="botao-remover" onclick="removerItem(this)">X</button>
      <div class="inventario-linha">
        ${criarInput('ITEM')}
        <div>
          <label>TIPO</label>
          <select>
            <option>Artefato</option>
            <option>Miscelânea</option>
          </select>
        </div>
        ${criarInput('DESCRIÇÃO')}
      </div>
    </div>`;
  document.getElementById("inventario-conteudo").insertAdjacentHTML("beforeend", html);
}

function adicionarEquipamento() {
  const html = `
    <div class="inventario-item">
      <button class="botao-remover" onclick="removerItem(this)">X</button>
      <div class="inventario-linha">
        ${criarInput('EQUIPAMENTO')}
        <div>
          <label>TIPO</label>
          <select>
            <option>Ferramenta</option>
            <option>Proteção</option>
          </select>
        </div>
        ${criarInput('DESCRIÇÃO')}
      </div>
    </div>`;
  document.getElementById("inventario-conteudo").insertAdjacentHTML("beforeend", html);
}

function removerItem(botao) {
  const item = botao.closest('.inventario-item');
  if (item) item.remove();
}

document.getElementById("inventario-add").addEventListener("click", function (e) {
  e.stopPropagation();
  const dropdown = this.parentElement;
  dropdown.classList.toggle("ativo");
});

document.addEventListener("click", function () {
  document.querySelectorAll(".dropdown").forEach(el => el.classList.remove("ativo"));
});

const botaoMais = document.getElementById('inventario-add');
  const dropdownConteudo = document.querySelector('.dropdown-conteudo');
  const inventarioBox = document.querySelector('.inventario-box');

  botaoMais.addEventListener('click', () => {
    const estaAtivo = dropdownConteudo.classList.toggle('ativo');
    inventarioBox.classList.toggle('dropdown-ativo', estaAtivo);
  });

  // Fechar o dropdown ao clicar numa opção
  const botoesDropdown = dropdownConteudo.querySelectorAll('button');
  botoesDropdown.forEach(btn => {
    btn.addEventListener('click', () => {
      dropdownConteudo.classList.remove('ativo');
      inventarioBox.classList.remove('dropdown-ativo');
    });
  });

  // Sessão Habilidades e Perícias 
function adicionarHabilidade() {
  const container = document.querySelector('.habilidades-container');
  const div = document.createElement('div');
  div.classList.add('habilidade');
  div.innerHTML = `
    <div class="linha-topo">
      <input type="text" placeholder="Nome da Habilidade">
      <button class="botao-remover" onclick="this.closest('.habilidade').remove()">x</button>
    </div>
    <input type="text" placeholder="Custo">
    <textarea placeholder="Descrição"></textarea>
  `;
  container.appendChild(div);
}

function adicionarAptidao() {
  const container = document.querySelector('.habilidades-container');
  const div = document.createElement('div');
  div.classList.add('aptidao');
  div.innerHTML = `
    <div class="linha-topo">
      <input type="text" placeholder="Nome da Aptidão">
      <button class="botao-remover" onclick="this.closest('.aptidao').remove()">x</button>
    </div>
    <select>
      <option value="1">Nível 1</option>
      <option value="2">Nível 2</option>
      <option value="3">Nível 3</option>
    </select>
    <textarea placeholder="Descrição"></textarea>
  `;
  container.appendChild(div);
}

document.addEventListener('DOMContentLoaded', () => {
  const botaoMaisHabilidades = document.getElementById('habilidades-add');
  const dropdownHabilidades = botaoMaisHabilidades?.parentElement;

  if (botaoMaisHabilidades && dropdownHabilidades) {
  const habilidadesBox = document.querySelector('.habilidades-box');

  botaoMaisHabilidades.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownHabilidades.classList.toggle('ativo');

    // Adiciona ou remove a classe que expande a caixa
    if (dropdownHabilidades.classList.contains('ativo')) {
      habilidadesBox.classList.add('dropdown-ativo');
    } else {
      habilidadesBox.classList.remove('dropdown-ativo');
    }
  });

  // Fecha o dropdown se clicar fora
  document.addEventListener('click', () => {
    if (dropdownHabilidades.classList.contains('ativo')) {
      dropdownHabilidades.classList.remove('ativo');
      habilidadesBox.classList.remove('dropdown-ativo');
    }
  });
}
  });

function salvarFicha() {
  const dados = {};
  document.querySelectorAll('input, select, textarea').forEach(el => {
    if (el.id) {
      dados[el.id] = el.value;
    }
  });
  localStorage.setItem('fichaRPG', JSON.stringify(dados));
  alert('Ficha salva com sucesso!');
}

function carregarFicha() {
  const dados = JSON.parse(localStorage.getItem('fichaRPG'));
  if (dados) {
    document.querySelectorAll('input, select, textarea').forEach(el => {
      if (el.id && dados[el.id] !== undefined) {
        el.value = dados[el.id];
      }
    });
    alert('Ficha carregada!');
  } else {
    alert('Nenhuma ficha salva encontrada.');
  }
}

function limparFicha() {
  localStorage.removeItem('fichaRPG');
  alert('Ficha apagada!');
}