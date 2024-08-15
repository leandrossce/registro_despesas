class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados() {
		for(let i in this) {
			if(this[i] == undefined || this[i] == '' || this[i] == null) {
				return false
			}
		}
		return true
	}
}

class Bd {

	constructor() {
		let id = localStorage.getItem('id')

		if(id === null) {
			localStorage.setItem('id', 0)
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}

	gravar(d) {
		//console.log(d)
		let id = this.getProximoId()

		localStorage.setItem(id, JSON.stringify(d))

		localStorage.setItem('id', id)
	}

	recuperarTodosRegistros() {

		//array de despesas
		let despesas = Array()

		let id = localStorage.getItem('id')

		//recuperar todas as despesas cadastradas em localStorage
		for(let i = 1; i <= id; i++) {

			//recuperar a despesa
			let despesa = JSON.parse(localStorage.getItem(i))

			//existe a possibilidade de haver índices que foram pulados/removidos
			//nestes casos nós vamos pular esses índices
			if(despesa === null) {
				continue
			}
			despesa.id = i
			despesas.push(despesa)
		}

		return despesas
	}

	pesquisar(despesa){

		let despesasFiltradas = Array()
		despesasFiltradas = this.recuperarTodosRegistros()
		console.log(despesasFiltradas);
		console.log(despesa)

		//ano
		if(despesa.ano != ''){
			console.log("filtro de ano");
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
		}
			
		//mes
		if(despesa.mes != ''){
			console.log("filtro de mes");
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		}

		//dia
		if(despesa.dia != ''){
			console.log("filtro de dia");
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
		}

		//tipo
		if(despesa.tipo != ''){
			console.log("filtro de tipo");
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		}

		//descricao
		if(despesa.descricao != ''){
			console.log("filtro de descricao");
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		}

		//valor
		if(despesa.valor != ''){
			console.log("filtro de valor");
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
		}

		
		return despesasFiltradas
		

	}

	remover(id){
		localStorage.removeItem(id)
	}
}

let bd = new Bd()


function cadastrarDespesa() {
		
	let data = document.getElementById('data-exibida').value;
	
	console.log('data:', data);
	
	let ano = ""
	let mes = ""
	let dia = ""

	// Divide a data no formato "dd/mm/aaaa" em partes
	let partesData = data.split('-');
	
	console.log('partesData:', partesData);
	
	// Atribui os valores às variáveis correspondentes
	dia = partesData[2];  // Dia
	mes = partesData[1];  // Mês
	ano = partesData[0];  // Ano

	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')
	let tipo = document.getElementById('tipo')
	//console.log('Dia:', dia);
	//console.log('Mês:', mes);
	//console.log('Ano:', ano);

	let despesa = new Despesa(
		ano, 
		mes, 
		dia, 
		tipo.value, 
		descricao.value,
		valor.value
	)


	if(despesa.validarDados()) {
		bd.gravar(despesa)

		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
		document.getElementById('modal_btn').innerHTML = 'Voltar'
		document.getElementById('modal_btn').className = 'btn btn-success'

		//dialog de sucesso
		$('#modalRegistraDespesa').modal('show') 

		ano.value = '' 
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''
		document.getElementById('data-exibida').value = ''		
		
	} else {
		
		document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
		document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!'
		document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
		document.getElementById('modal_btn').className = 'btn btn-danger'

		//dialog de erro
		$('#modalRegistraDespesa').modal('show') 
	}
}

function carregaListaDespesas(despesas = Array(), filtro = false) {

    if(despesas.length == 0 && filtro == false){
		despesas = bd.recuperarTodosRegistros() 

	}
	
	/*
	<tr>
		<td>15/03/2018</td>
		<td>Alimentação</td>
		<td>Compras do mês</td>
		<td>444.75</td>
	</tr>
	*/

	let listaDespesas = document.getElementById("listaDespesas")
    listaDespesas.innerHTML = ''
	despesas.forEach(function(d){

		//Criando a linha (tr)
		var linha = listaDespesas.insertRow();

		//Criando as colunas (td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` 

		//Ajustar o tipo
		switch(d.tipo){
			case '1': d.tipo = 'Alimentação'
				break
			case '2': d.tipo = 'Educação'
				break
			case '3': d.tipo = 'Lazer'
				break
			case '4': d.tipo = 'Saúde'
				break
			case '5': d.tipo = 'Transporte'
				break
			
		}
		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor

		//Criar o botão de exclusão
		let btn = document.createElement('button')
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fa fa-times"  ></i>'
		btn.id = `id_despesa_${d.id}`
		btn.onclick = function(){
			let id = this.id.replace('id_despesa_','')
			//alert(id)
			bd.remover(id)
			window.location.reload()
		}
		linha.insertCell(4).append(btn)
		console.log(d)
	})

 }

 
 function pesquisarDespesa(){

	let data = document.getElementById('data-exibida').value;
	
	console.log('data:', data);
	
	let ano = ""
	let mes = ""
	let dia = ""

	// Divide a data no formato "dd/mm/aaaa" em partes
	let partesData = data.split('-');
	
	console.log('partesData:', partesData);
	
	// Atribui os valores às variáveis correspondentes
	dia = partesData[2];  // Dia
	mes = partesData[1];  // Mês
	ano = partesData[0];  // Ano

	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value
	let tipo = document.getElementById('tipo').value
	//console.log('Dia:', dia);
	//console.log('Mês:', mes);
	//console.log('Ano:', ano);

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
	
	console.log('despesa pesquisa ->', despesa)
	

	let despesas = bd.pesquisar(despesa)
	 
	this.carregaListaDespesas(despesas, true)




 }
 
 

function openYearPicker() {
  const input = document.getElementById('data-exibida');
  
  // Configura o input para o tipo 'date'
    input.focus();
  input.type = 'date';


let valor=""
  // Quando o valor é alterado, formata e exibe a data no formato "dd/mm/yyyy"
	input.addEventListener('change', function() {
    const selectedDate = new Date(this.value);
    if (!isNaN(selectedDate)) {
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      valor = `${day}/${month}/${year}`; // Formata a data como "dd/mm/yyyy"
    }
//this.type = 'text'; // Retorna o tipo para texto após a seleção
	
	});
	
	
}
