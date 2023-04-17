//declaração das variáveis para o jogo
var bordas, contexto, ALTURA, LARGURA, frames = 0, maxPulos = 3, velocidade = 6, estadoAtual, record,

estados = { //tipo de status do jogo
	jogar: 0,
	jogando: 1,
	perdeu: 2
},

chao = { //desenho do chao
		y: 550,
		alturachao: 50,
		cor: "#e8da78",

		desenhochao: function(){
			contexto.fillStyle = this.cor;
			contexto.fillRect(0, this.y, LARGURA, this.alturachao);
								}
			},

			bloco = { //desenho do bloco
				x:50,
				y:0,
				alturabloco: 50,
				largurabloco: 50,
				corbloco: "#FF0000",
				gravidade: 1.6,
				velocidade: 0,
				forcaDoPulo: 23.6,
				qtdpulos: 0,
				score: 0,

				atualizabloco: function() { //quando inicia o jogo
				this.velocidade += this.gravidade; 
				this.y += this.velocidade;

				if (this.y > chao.y -this.alturabloco && estadoAtual != estados.perdeu){ //posicao do bloco ao iniciar

						this.y = chao.y -this.alturabloco;	
						this.qtdpulos = 0;
						this.velocidade = 0;
						 } //trava o bloco no chao
			},
				pula: function(){
					if(this.qtdpulos < maxPulos) { //quantidade de pulos do bloco
					this.velocidade = -this.forcaDoPulo;
					this.qtdpulos++;
				}
				},
				reset: function(){
					this.velocidade = 0;
					this.y = 0;

					if(this.score > record){// calculo do score
						localStorage.setItem("record", this.score);
						record = this.score;
					}
					this.score = 0;

				},
			desenhabloco: function () {//desenho do bloco
				contexto.fillStyle = this.corbloco;
				contexto.fillRect (this.x, this.y, this.alturabloco, this.largurabloco);

			}
				},

				obstaculos = { //criação dos obstaculos
				_obs: [], //criando um vetor para os obstaculos
				cores: ["#ffbc1c", "#ff1c1c", "#ff85e1", "#52a7ff", "#78ff5d"], // criando um vetor para 5 cores
				tempoInsere: 0,

				insere: function(){
					this._obs.push({ // o método push adiciona valores a um array.
						x: LARGURA, //gera o obstaculo no final da tela (canvas) 
						//largura_obs: 30 + Math.floor(20 * Math.random()), //função que gera números aleatórios entre 30 a 50px, no caso para largura do obstaculo.
						largura_obs: 50,
						altura_obs: 30 + Math.floor(120 * Math.random()),
						cor: this.cores[Math.floor(5 * Math.random())]
					});

					this.tempoInsere = 30 + Math.floor(21 * Math.random()) // no mínino 30 e no máximo 50 px de espacamento;

				},
				atualiza: function(){	//atualizacao dos obstaculos					
					if(this.tempoInsere == 0)
						this.insere();
					else
						this.tempoInsere--; //chegando ao final do canvas

					for (var i = 0, tam = this._obs.length; i< tam; i++) {
						var obs = this._obs[i];

						obs.x -= velocidade;

						if(bloco.x < obs.x + obs.largura_obs && bloco.x + bloco.largurabloco >= obs.x && bloco.y + bloco.alturabloco >= chao.y - obs.altura_obs)
							estadoAtual = estados.perdeu;
						else if (obs.x == 0)
							bloco.score++;

						else if (obs.x <= -obs.largura_obs){
							this._obs.splice(i, 1); //remove os obstaculos ao final do canvas
							tam--;
							i--;
						}

						
						}

				}, 

				limpa: function(){
					this._obs = [];
				},

				desenha: function(){
						for (var i = 0, tam = this._obs.length; i < tam; i++){ //roda o vetor todo para desenhar todos os blocos do vetor
							var obs = this._obs[i];
							contexto.fillStyle = obs.cor;
							contexto.fillRect(obs.x, chao.y - obs.altura_obs, obs.largura_obs, obs.altura_obs); //y do chao - altura do obstaculo

						}
				}


			}; //variavel que entra como objeto


	
	function Start(){
		ALTURA = window.innerHeight; // devolve o tamanho da altura da janela do usuário
		LARGURA = window.innerWidth; // devolve o tamanho da largura da janela do usuário

		if (LARGURA >= 500) {
			LARGURA = 600;
			ALTURA = 600;
		} // deixar fixo o tamanho da tela. Obs: Esses números são em pixels

		canvas = document.createElement("canvas"); // Cria o elemento canvas
		canvas.width = LARGURA;
		canvas.height = ALTURA;
		canvas.style.border = "1px solid #000"; //cria uma borda preta

		contexto = canvas.getContext("2d"); //desenho em 2d
		document.body.appendChild(canvas); // referencia o canvas do HTML
		document.addEventListener("mousedown", clicar); //verifica se a pessoa clicou

		estadoAtual = estados.jogar;
		record = localStorage.getItem("record");

		if(record == null)
			record = 0;
		
	}
	function clicar(){
		if (estadoAtual == estados.jogando)
		bloco.pula();

		else if(estadoAtual == estados.jogar){
			estadoAtual = estados.jogando;
		}

		else if (estadoAtual == estados.perdeu && bloco.y >= 2 * ALTURA){
			estadoAtual = estados.jogar;
			obstaculos.limpa();
			bloco.reset();
		}
	}
	function Update(){
		atualizar();
		
		contexto.fillStyle = "#1E90FF"
		contexto.fillRect(0, 0 ,LARGURA, ALTURA); //Desenha um retângulo preenchido
		window.requestAnimationFrame(Update); //loop infinito

		desenhar();
	}
	function atualizar(){
		frames ++;

		bloco.atualizabloco();

		if(estadoAtual == estados.jogando)
		obstaculos.atualiza();


		
	}
	function desenhar(){
		contexto.fillStyle = "#fff"; //desenha o score
		contexto.font = "50px Arial"
		contexto.fillText(bloco.score, 30, 50);

		if (estadoAtual == estados.jogar){
			contexto.fillStyle = "green";
			contexto.fillRect(LARGURA / 2 - 50, ALTURA / 2 - 50, 100, 100);
		}

		else if (estadoAtual == estados.perdeu){
			contexto.fillStyle = "red";
			contexto.fillRect(LARGURA / 2 - 50, ALTURA / 2 - 50, 100, 100);

			contexto.save();
			contexto.translate(LARGURA / 2, ALTURA /2);
			contexto.fillStyle = "#fff";

			if (bloco.score > record)
				contexto.fillText("Novo Record! ", -150, -65);

			else if (record < 10)
				 contexto.fillText("Record " + record, -99, -65);

			else if (record >= 10 && record < 100)
				contexto.fillText("Record " + record, -112, -65);

			else
				contexto.fillText("Record " + record, -125, -65);
			
			if(bloco.score < 10)
			contexto.fillText(bloco.score, -13, 19);

			else if (bloco.score >= 10 && bloco.score < 100)
			contexto.fillText(bloco.score, -26, 19);

			contexto.restore();
		}

		else if (estadoAtual == estados.jogando)
			obstaculos.desenha();
		
				
		chao.desenhochao();
		bloco.desenhabloco();
		
	}

Start();
Update();
// inicializa o jogo