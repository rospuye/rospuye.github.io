function displayPedidos(){
    var nenhumPedidoFlag = 0;
    var pedidosCounter = 0;

    var func;
    var funcID;
    for (j=0; j<localStorage.length; j++){
        func = localStorage.getItem(localStorage.key(j));
        if (func.includes('"tipo":"login"')){
            var indexArray5 = [];
            var indexArray6 = [];
            for (m = 0; m < func.length; m++) {
                if (func.charAt(m)==':'){
                    indexArray5.push(m);
                }
                if (func.charAt(m)==','){
                    indexArray6.push(m);
                }
            }
            funcID = func.substring(indexArray5[5]+2,indexArray6[5]-1);
        }
    }

    for (i=0; i<localStorage.length; i++){
        var item = localStorage.getItem(localStorage.key(i));
        var itemName = localStorage.key(i);
        if (item.includes('"tipo":"pedido","estado":"confirmadoSemContrato"') && item.includes('"organizador":"' + funcID + '"')){
            nenhumPedidoFlag = 1;
            var clientID = itemName.substring(23,29);
            var clientNome;
            var clientSobrenome;
            var clientEmail;
            var clientTelemovel;

            for (j=0; j<localStorage.length; j++){
                var item2 = localStorage.getItem(localStorage.key(j));
                var itemName2 = localStorage.key(j);
                if (item2.includes('"tipo":"conta"') || item2.includes('"tipo":"login"')){

                    var indexArray3 = [];
                    var indexArray4 = [];
                    for (k = 0; k < item2.length; k++) {
                        if (item2.charAt(k)==':'){
                            indexArray3.push(k);
                        }
                        if (item2.charAt(k)==','){
                            indexArray4.push(k);
                        }
                    }

                    if (item2.substring(indexArray3[5]+2,indexArray4[5]-1)==clientID){
                        console.log(itemName, item);
                        pedidosCounter++;
                        clientNome = item2.substring(indexArray3[0]+2,indexArray4[0]-1);
                        clientSobrenome = item2.substring(indexArray3[1]+2,indexArray4[1]-1);
                        clientEmail = item2.substring(indexArray3[2]+2,indexArray4[2]-1);
                        clientTelemovel = item2.substring(indexArray3[3]+2,indexArray4[3]-1);

                        var indexArray = [];
                        var indexArray2 = [];
                        var indexArrayAspas = [];
                        for (l = 0; l < item.length; l++) {
                            if (item.charAt(l)==':'){
                                indexArray.push(l);
                            }
                            if (item.charAt(l)==','){
                                indexArray2.push(l);
                            }
                            if (item.charAt(l)=='"'){
                                indexArrayAspas.push(l);
                            }
                        }

                        // colocar o pedido por confirmar em display na p??gina
                        var newDiv = document.createElement("div");
                        newDiv.id = "pedido" + pedidosCounter;
                        newDiv.className = "pedido";
                        newDiv.style = "display: block; background-color: #cb98e9; margin-left: 10%; margin-right: 10%; margin-bottom: 2%; margin-top: 1%; padding: 2%";

                        var title = document.createElement("h5");
                        title.style = "padding-bottom: 2%;";
                        title.innerText = "Pedido #" + pedidosCounter;
                        newDiv.appendChild(title);

                        var rowDiv15 = document.createElement("div");
                        rowDiv15.className = "row";

                        var p25 = document.createElement("p");
                        p25.style = "padding-left: 2%; padding-right: 1%; width: 25%";
                        var b10 = document.createElement("b");
                        b10.innerText = "Cliente: ";
                        p25.appendChild(b10);
                        rowDiv15.appendChild(p25);

                        var p26 = document.createElement("p");   
                        p26.id = "firstName" + pedidosCounter;
                        p26.className = "pedidosElement";
                        p26.innerText = clientNome + " " + clientSobrenome + "\nID: " + clientID + "\nE-mail: " + clientEmail + "\nN?? de telem??vel: " + clientTelemovel;
                        rowDiv15.appendChild(p26);

                        newDiv.appendChild(rowDiv15);

                        var rowDiv = document.createElement("div");
                        rowDiv.className = "row";

                        var p1 = document.createElement("p");
                        p1.style = "padding-left: 2%; padding-right: 1%; width: 25%";
                        var b1 = document.createElement("b");
                        b1.innerText = "Submiss??o: ";
                        p1.appendChild(b1);
                        rowDiv.appendChild(p1);

                        var p2 = document.createElement("p");   
                        p2.id = "dataSubmissao" + pedidosCounter;
                        p2.className = "pedidosElement";
                        p2.innerText = item.substring(indexArray[3]+2, indexArray2[3]-1) + " " + item.substring(indexArray[4]+2, indexArray2[4]-1);
                        rowDiv.appendChild(p2);

                        newDiv.appendChild(rowDiv);

                        for (p=0; p<localStorage.length; p++){
                            var item3 = localStorage.getItem(localStorage.key(p));
                            var itemName3 = localStorage.key(p);
                            if (itemName3.includes('dataConfirmacaoSemContrato - '+itemName)){
                                var rowDiv2 = document.createElement("div");
                                rowDiv2.className = "row";

                                var p3 = document.createElement("p");
                                p3.style = "padding-left: 2%; padding-right: 1%; width: 25%";
                                var b2 = document.createElement("b");
                                b2.innerText = "Confirma????o sem contrato: ";
                                p3.appendChild(b2);
                                rowDiv2.appendChild(p3);

                                var p4 = document.createElement("p");   
                                p4.id = "dataSemContrato" + pedidosCounter;
                                p4.className = "pedidosElement";
                                p4.innerText = item3.substring(9,18) + " " + item3.substring(28,36);
                                rowDiv2.appendChild(p4);

                                newDiv.appendChild(rowDiv2);
                            }
                        }

                        var rowDiv3 = document.createElement("div");
                        rowDiv3.className = "row";

                        var p5 = document.createElement("p");
                        p5.style = "padding-left: 2%; padding-right: 1%; width: 25%";
                        var b3 = document.createElement("b");
                        b3.innerText = "Data de realiza????o do evento: ";
                        p5.appendChild(b3);
                        rowDiv3.appendChild(p5);

                        var p6 = document.createElement("p");   
                        p6.id = "dataInicio" + pedidosCounter;
                        p6.className = "pedidosElement";
                        p6.innerText = item.substring(indexArray[7]+2, indexArray2[5]-1);
                        rowDiv3.appendChild(p6);

                        newDiv.appendChild(rowDiv3);

                        var rowDiv4 = document.createElement("div");
                        rowDiv4.className = "row";

                        var p7 = document.createElement("p");
                        p7.style = "padding-left: 2%; padding-right: 1%; width: 25%";
                        var b4 = document.createElement("b");
                        b4.innerText = "Data de t??rmino: ";
                        p7.appendChild(b4);
                        rowDiv4.appendChild(p7);

                        var p8 = document.createElement("p");   
                        p8.id = "dataTermino" + pedidosCounter;
                        p8.className = "pedidosElement";
                        p8.innerText = item.substring(indexArray[8]+2, indexArray2[6]-1);
                        rowDiv4.appendChild(p8);

                        newDiv.appendChild(rowDiv4);

                        var rowDiv5 = document.createElement("div");
                        rowDiv5.className = "row";

                        var p9 = document.createElement("p");
                        p9.style = "padding-left: 2%; padding-right: 1%; width: 25%";
                        var b5 = document.createElement("b");
                        b5.innerText = "Lota????o do evento: ";
                        p9.appendChild(b5);
                        rowDiv5.appendChild(p9);

                        var p10 = document.createElement("p");   
                        p10.id = "lotacao" + pedidosCounter;
                        p10.className = "pedidosElement";
                        p10.innerText = item.substring(indexArray[9]+2, indexArray2[7]-1) + " pessoas";
                        rowDiv5.appendChild(p10);

                        newDiv.appendChild(rowDiv5);

                        var rowDiv6 = document.createElement("div");
                        rowDiv6.className = "row";

                        var p11 = document.createElement("p");
                        p11.style = "padding-left: 2%; padding-right: 1%; width: 25%";
                        var b6 = document.createElement("b");
                        b6.innerText = "Localiza????o do evento: ";
                        p11.appendChild(b6);
                        rowDiv6.appendChild(p11);

                        var p12 = document.createElement("p");   
                        p12.id = "localizacao" + pedidosCounter;
                        p12.className = "pedidosElement";
                        p12.innerText = item.substring(indexArray[10]+2, indexArray2[8]-1);
                        rowDiv6.appendChild(p12);

                        newDiv.appendChild(rowDiv6);

                        var rowDiv7 = document.createElement("div");
                        rowDiv7.className = "row";

                        var p13 = document.createElement("p");
                        p13.style = "padding-left: 2%; padding-right: 1%; width: 25%";
                        var b7 = document.createElement("b");
                        b7.innerText = "Or??amento: ";
                        p13.appendChild(b7);
                        rowDiv7.appendChild(p13);

                        var p14 = document.createElement("p");   
                        p14.id = "orcamento" + pedidosCounter;
                        p14.className = "pedidosElement";
                        p14.innerText = item.substring(indexArray[11]+2, indexArray2[9]-1) + "???";
                        rowDiv7.appendChild(p14);

                        newDiv.appendChild(rowDiv7);

                        var p15 = document.createElement("p");
                        var b8 = document.createElement("b");
                        b8.innerText = "Descri????o do pedido: ";
                        p15.appendChild(b8);
                        newDiv.appendChild(p15);

                        var p16 = document.createElement("p");
                        p16.id = "descricao" + pedidosCounter;
                        p16.innerText = item.substring(indexArrayAspas[82]+1, indexArrayAspas[83]);
                        newDiv.appendChild(p16);

                        var p25 = document.createElement("p");
                        var b10 = document.createElement("b");
                        b10.innerText = "Confirma????o da Show It: ";
                        p25.appendChild(b10);
                        newDiv.appendChild(p25);

                        var p26 = document.createElement("p");
                        p26.id = "confirma????o" + pedidosCounter;
                        p26.innerText = item.substring(indexArrayAspas[86]+1, indexArrayAspas[87]);
                        newDiv.appendChild(p26);

                        var indexArray5 = [];
                        var indexArray6 = [];
                        for (m = 0; m < item.length; m++) {
                            if (item.charAt(m)=='['){
                                indexArray5.push(m);
                            }
                            if (item.charAt(m)==']'){
                                indexArray6.push(m);
                            }
                        }
                        var areasAtuacao = item.substring(indexArray5[0]+2, indexArray6[0]-1);
                        var areasAtuacaoList = areasAtuacao.split('","');
                        var descricoesAreasAtuacao = item.substring(indexArray5[1]+2, indexArray6[1]-1);
                        var descricoesAreasAtuacaoList = descricoesAreasAtuacao.split('","');
                        console.log(areasAtuacaoList);

                        for (n=0; n<areasAtuacaoList.length; n++){
                            if (areasAtuacaoList[n]=="sim"){
                                var p17 = document.createElement("p");
                                var b9 = document.createElement("b");
                                b9.innerText = "??reas de atua????o: ";
                                p17.appendChild(b9);
                                newDiv.appendChild(p17);
                                break;
                            }
                        }

                        if (areasAtuacaoList[0]=="sim"){

                            var rowDiv8 = document.createElement("div");
                            rowDiv8.className = "row";

                            var p18 = document.createElement("p");
                            p18.innerHTML = "&#9900 Fotografia e Filmografia: " + descricoesAreasAtuacaoList[0];

                            newDiv.appendChild(p18);
                            newDiv.appendChild(rowDiv8);

                        }
                        if (areasAtuacaoList[1]=="sim"){

                            var rowDiv9 = document.createElement("div");
                            rowDiv9.className = "row";

                            var p19 = document.createElement("p");
                            p19.innerHTML = "&#9900 Ilumina????o e Cenografia: " + descricoesAreasAtuacaoList[1];

                            newDiv.appendChild(p19);
                            newDiv.appendChild(rowDiv9);

                        }
                        if (areasAtuacaoList[2]=="sim"){

                            var rowDiv10 = document.createElement("div");
                            rowDiv10.className = "row";

                            var p20 = document.createElement("p");
                            p20.innerHTML = "&#9900 Sistemas de Som: " + descricoesAreasAtuacaoList[2];

                            newDiv.appendChild(p20);
                            newDiv.appendChild(rowDiv10);

                        }
                        if (areasAtuacaoList[3]=="sim"){

                            var rowDiv11 = document.createElement("div");
                            rowDiv11.className = "row";

                            var p21 = document.createElement("p");
                            p21.innerHTML = "&#9900 Instala????o e Manuten????o de Equipamentos: " + descricoesAreasAtuacaoList[3];

                            newDiv.appendChild(p21);
                            newDiv.appendChild(rowDiv11);

                        }
                        if (areasAtuacaoList[4]=="sim"){

                            var rowDiv12 = document.createElement("div");
                            rowDiv12.className = "row";

                            var p22 = document.createElement("p");
                            p22.innerHTML = "&#9900 Seguran??a: " + descricoesAreasAtuacaoList[4];

                            newDiv.appendChild(p22);
                            newDiv.appendChild(rowDiv12);

                        }
                        if (areasAtuacaoList[5]=="sim"){

                            var rowDiv13 = document.createElement("div");
                            rowDiv13.className = "row";

                            var p23 = document.createElement("p");
                            p23.innerHTML = "&#9900 Primeiros Socorros: " + descricoesAreasAtuacaoList[5];

                            newDiv.appendChild(p23);
                            newDiv.appendChild(rowDiv13);

                        }
                        if (areasAtuacaoList[6]=="sim"){

                            var rowDiv14 = document.createElement("div");
                            rowDiv14.className = "row";

                            var p24 = document.createElement("p");
                            p24.innerHTML = "&#9900 Bilheteria: " + descricoesAreasAtuacaoList[6];

                            newDiv.appendChild(p24);
                            newDiv.appendChild(rowDiv14);

                        }

                        var btn = document.createElement("input");
                        btn.setAttribute("id", "contratoAssinado" + pedidosCounter);
                        btn.setAttribute("type", "button");
                        btn.setAttribute("value", "Contrato Assinado");
                        btn.setAttribute("class", "btn btn-light");
                        btn.setAttribute("style", "margin-right:1%");
                        newDiv.appendChild(btn);

                        var currentDiv = document.getElementById("todosOsPedidos"); 
                        document.body.insertBefore(newDiv, currentDiv);

                        document.getElementById("contratoAssinado" + pedidosCounter).onclick = function() {contratoAssinado(parseInt(this.id.substring(16)))};
                    }
                }
            }
        }
    }
    if (nenhumPedidoFlag==0){
        document.getElementById("nenhumPedido").style.display = "block";
    }
    else{
        document.getElementById("nenhumPedido").style.display = "none";
    }
}

function contratoAssinado(num){
    var pedidosCounter3 = 0;
    for (i=0; i<localStorage.length; i++){
        var item = localStorage.getItem(localStorage.key(i));
        var itemName = localStorage.key(i);
        if (item.includes('"tipo":"pedido","estado":"confirmadoSemContrato"')){
            pedidosCounter3++;
            console.log(pedidosCounter3, num);
            if (pedidosCounter3==num){

                var indexArray = [];
                var indexArray2 = [];
                for (i = 0; i < item.length; i++) {
                    if (item.charAt(i)==':'){
                        indexArray.push(i);
                    }
                    if (item.charAt(i)==','){
                        indexArray2.push(i);
                    }
                }

                var firstPart = item.substring(0, indexArray[15]+1);
                var lastPart = item.substring(indexArray2[25]);
                var newItem = firstPart + '"confirmadoComContrato"' + lastPart;
                localStorage.removeItem(item);
                localStorage.setItem(itemName, newItem);
                console.log(newItem);

                n =  new Date();
                y = n.getFullYear();
                m = n.getMonth() + 1;
                d = n.getDate();
                var dataComContrato = d + "/" + m + "/" + y;
                var horaComContrato = new Date().toLocaleTimeString();
                localStorage.setItem('dataConfirmacaoComContrato - ' + itemName, '{"data":"' + dataComContrato + '","hora":"' + horaComContrato + '"}');
            }
        }
    }
    location.reload();
}