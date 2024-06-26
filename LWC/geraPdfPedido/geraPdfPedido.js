import { LightningElement, api } from 'lwc';
import buscaOrder from '@salesforce/apex/PdfPedidoController.buscaOrder';
import buscaOrderItem from '@salesforce/apex/PdfPedidoController.buscaOrderItem';
import buscaUser from '@salesforce/apex/PdfPedidoController.buscaUser';

import { loadScript } from 'lightning/platformResourceLoader';
import JS_PDF from '@salesforce/resourceUrl/JSPdf';
import AUTOTABLE_RESOURCE from '@salesforce/resourceUrl/AutoTable';


var base64Image2 = "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABGdBTUEAALGeYUxB9wAAACBjSFJNAACHEAAAjBIAAP1NAACBPgAAWesAARIPAAA85gAAGc66ySIyAAABIWlDQ1BJQ0MgUHJvZmlsZQAAKM9jYGAycHRxcmUSYGDIzSspCnJ3UoiIjFJgP8/AxsDMAAaJycUFjgEBPiB2Xn5eKgMG+HaNgRFEX9YFmcVAGuBKLigqAdJ/gNgoJbU4mYGB0QDIzi4vKQCKM84BskWSssHsDSB2UUiQM5B9BMjmS4ewr4DYSRD2ExC7COgJIPsLSH06mM3EATYHwpYBsUtSK0D2MjjnF1QWZaZnlCgYWlpaKjim5CelKgRXFpek5hYreOYl5xcV5BcllqSmANVC3AcGghCFoBDTAGq00GSgMgDFA4T1ORAcvoxiZxBiCJBcWlQGZTIyGRPmI8yYI8HA4L+UgYHlD0LMpJeBYYEOAwP/VISYmiEDg4A+A8O+OQDAxk/9b5LlBAAAAAlwSFlzAAALEwAACxMBAJqcGAAAB6hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+DQo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA5LjEtYzAwMSA3OS5hOGQ0NzUzLCAyMDIzLzAzLzIzLTA4OjU2OjM3ICAgICAgICAiPg0KICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPg0KICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyNC43IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjMtMDktMTFUMDk6MzA6NTMtMDM6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIzLTA5LTExVDA5OjMxOjQ5LTAzOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIzLTA5LTExVDA5OjMxOjQ5LTAzOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4MDkwMGUzOS1kYzRjLTQxNDQtOTk2OS00MGY4MDc3MmNhNmMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpjYTNkOGQwMC0yNGZhLTZjNDMtOTRkMS1iY2ViY2E0NjU0NzgiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1OGZhOTY4Yi1iNzg3LWM4NGYtYjhmYS0wNmQ5ZThlMjMxZjMiPg0KICAgICAgPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4NCiAgICAgICAgPHJkZjpCYWc+DQogICAgICAgICAgPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6NmM3MWI2ZWEtZGFjZi1lMTQyLWE1ZTEtZTczYzE3N2E1MjY3PC9yZGY6bGk+DQogICAgICAgICAgPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6Y2U1M2I1OWQtZTE5ZC04YTQ0LWJlODAtNzY0MzUwNWY3MTU0PC9yZGY6bGk+DQogICAgICAgIDwvcmRmOkJhZz4NCiAgICAgIDwvcGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPg0KICAgICAgPHhtcE1NOkhpc3Rvcnk+DQogICAgICAgIDxyZGY6U2VxPg0KICAgICAgICAgIDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlk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";

var base64Image = "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAABN2lDQ1BBZG9iZSBSR0IgKDE5OTgpAAAokZWPv0rDUBSHvxtFxaFWCOLgcCdRUGzVwYxJW4ogWKtDkq1JQ5ViEm6uf/oQjm4dXNx9AidHwUHxCXwDxamDQ4QMBYvf9J3fORzOAaNi152GUYbzWKt205Gu58vZF2aYAoBOmKV2q3UAECdxxBjf7wiA10277jTG+38yH6ZKAyNguxtlIYgK0L/SqQYxBMygn2oQD4CpTto1EE9AqZf7G1AKcv8ASsr1fBBfgNlzPR+MOcAMcl8BTB1da4Bakg7UWe9Uy6plWdLuJkEkjweZjs4zuR+HiUoT1dFRF8jvA2AxH2w3HblWtay99X/+PRHX82Vun0cIQCw9F1lBeKEuf1UYO5PrYsdwGQ7vYXpUZLs3cLcBC7dFtlqF8hY8Dn8AwMZP/fNTP8gAAAAJcEhZcwAACxMAAAsTAQCanBgAAAcbaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA5LjEtYzAwMSA3OS5hOGQ0NzUzLCAyMDIzLzAzLzIzLTA4OjU2OjM3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjQuNyAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTA5LTExVDA5OjMwOjUzLTAzOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0wOS0xMVQwOTozMTo0OS0wMzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0wOS0xMVQwOTozMTo0OS0wMzowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODA5MDBlMzktZGM0Yy00MTQ0LTk5NjktNDBmODA3NzJjYTZjIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6Y2EzZDhkMDAtMjRmYS02YzQzLTk0ZDEtYmNlYmNhNDY1NDc4IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NThmYTk2OGItYjc4Ny1jODRmLWI4ZmEtMDZkOWU4ZTIzMWYzIj4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjZjNzFiNmVhLWRhY2YtZTE0Mi1hNWUxLWU3M2MxNzdhNTI2NzwvcmRmOmxpPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDpjZTUzYjU5ZC1lMTlkLThhNDQtYmU4MC03NjQzNTA1ZjcxNTQ8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1OGZhOTY4Yi1iNzg3LWM4NGYtYjhmYS0wNmQ5ZThlMjMxZjMiIHN0RXZ0OndoZW49IjIwMjMtMDktMTFUMDk6MzA6NTMtMDM6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyNC43IChXaW5kb3dz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";


export default class PdfPedidoSimples extends LightningElement {
    jsPDFInitialized = false;
    dataOrder;
    dataOrderItem;
    dataAccount;
    dataUser;
    dataProduct;
    @api recordId;

    carregarInfo(){
        buscaOrder({recordId: this.recordId})
        .then(result => {
            this.dataOrder = result;
            console.log('Resultado OrderNumber ---------> ' + this.dataOrder.OrderNumber);
            console.log('Resultado Account.Name ---------> ' + this.dataOrder.Account.Name);
            
        })
        .catch(error => {
            console.error('Erro ao obter a lista de informações', error);
            this.error = true;
        });

        buscaOrderItem({recordId: this.recordId})
        .then(result => {
            this.dataOrderItem = result;
            console.log('Resultado Product2.Name ---------> ' + this.dataOrderItem[0].Product2.Name);
            console.log('Resultado OrderItem.TotalPrice ---------> ' + this.dataOrderItem[0].TotalPrice );
            
        })
        .catch(error => {
            console.error('Erro ao obter a lista de informações', error);
            this.error = true;
        }); 
        
        buscaUser({recordId: this.recordId})
        .then(result => {
            this.dataUser = result;
            console.log('Resultado dataUser---------> ' + this.dataUser.Name);
            
        })
        .catch(error => {
            console.error('Erro ao obter a lista de informações', error);
            this.error = true;
        });  

    }

    renderedCallback(){
        this.carregarInfo();

        if(!this.jsPDFInitialized){
            this.jsPDFInitialized = true;
            loadScript(this, JS_PDF)
                .then(() => {
                    console.log('jsPDF inicializado com sucesso.');

                    loadScript(this, AUTOTABLE_RESOURCE)
                    .then(() => {
                        console.log('autoTable inicializado com sucesso.');
                    })
                    .catch(error => {
                        console.error('Error ao inicializar AutoTable', error);
                    });

                })
                .catch((error) => {
                    console.log('Erro ao inicializar a biblioteca jsPDF', error);
                });
        }
    }

    formatMoney(amount, decimalCount = 2, decimal = ",", thousands = ".") {
        try {
          decimalCount = Math.abs(decimalCount);
          decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
      
          const negativeSign = amount < 0 ? "-R$ " : "R$ ";
      
          let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
          let j = (i.length > 3) ? i.length % 3 : 0;
      
          return negativeSign +
            (j ? i.substring(0, j) + thousands : '') +
            i.substring(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
            (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
        } catch (e) {
          console.log(e)
        }
      };

    gerarPedidoSimples(){
        var doc = new window.jspdf.jsPDF();
        var imgData = 'data:image/png;base64,' + base64Image;
        var imgData2 = 'data:image/png;base64,' + base64Image2;      
        
        if(this.jsPDFInitialized){
            
            // Retângulo auzl com resumo do pedido
            doc.setDrawColor(14,44,86);
            doc.setFillColor(14,44,86);
            doc.roundedRect(82, 3, 48, 12, 2, 2, 'F');
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#FFFFFF');
            doc.text("Resumo do Pedido", 84, 11);

            // Logo SND
            doc.addImage(imgData, 'PNG', 180, 0, 20, 20);

            // Linha azul
            doc.setDrawColor(14,44,86);
            doc.line(5, 20, 205, 20);

            const firstTable = ['Vendedor', 'Nome', 'Nº Pedido', '00000139'];
            let shippingAddress = '';

            let enderecoCobranca = '';

            if(this.dataOrder.ShippingAddress){
                shippingAddress = (this.dataOrder.ShippingAddress) ? this.dataOrder.ShippingAddress : null;

                enderecoCobranca = ((shippingAddress.street) ? shippingAddress.street + ', ' : ' ') + 
                ((shippingAddress.city) ? 'Cidade:' + shippingAddress.city + ', ' : ' ') + 
                ((shippingAddress.state) ? 'UF:' + shippingAddress.state + ', ' : ' ') + 
                ((shippingAddress.postalCode) ? 'CEP:' + shippingAddress.postalCode : ' ');
            }
            
            console.log(shippingAddress);

            const dataFirstTable = [
            [
                { content: 'Vendedor', styles: { fontStyle: 'bold' } },
                (this.dataUser.Name) ? this.dataUser.Name : " " ,
                { content: 'Nº Pedido', styles: { fontStyle: 'bold' } },
                (this.dataOrder.OrderNumber) ? String(this.dataOrder.OrderNumber) : " ",
            ],
            [
                { content: 'Cliente', styles: { fontStyle: 'bold' } },
                (this.dataOrder.Account.Name) ? this.dataOrder.Account.Name : " ",
                { content: 'Frete', styles: { fontStyle: 'bold' } },
                (this.dataOrder.Valor_Do_Frete__c) ? this.formatMoney(this.dataOrder.Valor_Do_Frete__c, 2, ',', '.') : " ",
            ],
            [
                { content: 'Revendas', styles: { fontStyle: 'bold' } },
                (this.dataOrder.Revenda__c != null || this.dataOrder.Revenda__c !== undefined) ? this.dataOrder.Revenda__r.Name : " ",
                { content: 'Pedido Cliente', styles: { fontStyle: 'bold' } },
                (this.dataOrder.Pedido_Do_Cliente__c) ? this.dataOrder.Pedido_Do_Cliente__c : " ",
            ],
            [
                { content: 'CNPJ', styles: { fontStyle: 'bold' } },
                (this.dataOrder.Account.CNPJ__c) ? this.dataOrder.Account.CNPJ__c : " ",
                { content: 'Desc Comissão', styles: { fontStyle: 'bold' } },
                (this.dataOrder.Valor_da_Comissao__c) ? this.formatMoney(this.dataOrder.Valor_da_Comissao__c, 2, ',', '.') : " ",
            ],
            [
                { content: 'Endereço Entrega', styles: { fontStyle: 'bold' } }, 
                { content: (this.dataOrder.ShippingAddress) ?  enderecoCobranca : " ", colSpan: 3}
                
            ],
            ];

            const firstTableOptions = {
            startY: 25, // Posição inicial Y da tabela
            tableWidth: 182, // Define a largura total da tabela
            theme: 'grid',
            showHead: 'never',
            };

            doc.autoTable(firstTable, dataFirstTable, firstTableOptions);

            const dataFrete = [
            [
                { content: 'Frete', styles: { fontStyle: 'bold' } },
                (this.dataOrder.Condicoes_Do_Frete__c) ? this.dataOrder.Condicoes_Do_Frete__c : " ",
                (this.dataOrder.Via_Transportadora__c) ? this.dataOrder.Via_Transportadora__c : " ",
                (this.dataOrder.Transportadora__c != null || this.dataOrder.Transportadora__c !== undefined) ? this.dataOrder.Transportadora__r.Name : " ",
            ],
            ];
            const secondTableY = doc.lastAutoTable.finalY;

            const autoTableOptions3 = {
            startY: secondTableY, // Posição inicial Y da tabela
            tableWidth: 182, // Define a largura total da tabela
            theme: 'grid',
            showHead: 'never',
            };

            doc.autoTable(null, dataFrete, autoTableOptions3);

            const columnsFinal = [
            'Seguir com o pedido',
            '00000110',
            'Uso/Consumo',
            '000000',
            ];

            const thirdTableY = doc.lastAutoTable.finalY;
            const autoTableOptionsFinal = {
            startY: thirdTableY, // Posição inicial Y da tabela
            tableWidth: 182, // Define a largura total da tabela
            theme: 'grid',
            showHead: 'never',
            };
            const dataFinal = [
            [
                { content: 'Seguir com o Pedido', styles: { fontStyle: 'bold' } },
                (this.dataOrder.Seguir_Com_Pedido__c != null || this.dataOrder.Seguir_Com_Pedido__c !== undefined) ? this.dataOrder.Seguir_Com_Pedido__r.OrderNumber : " ",
                { content: 'Uso/Consumo', styles: { fontStyle: 'bold' } },
                (this.dataOrder.UsoConsumo__c) ? this.dataOrder.UsoConsumo__c : " ",
            ],
            [
                { content: 'Tipo de Operação', styles: { fontStyle: 'bold' } },
                (this.dataOrder.Tipo_de_Operacao__c != null || this.dataOrder.Tipo_de_Operacao__c !== undefined) ? this.dataOrder.Tipo_de_Operacao__r.Name : " ",
                { content: 'Conta Ordem', styles: { fontStyle: 'bold' } },
                (this.dataOrder.Conta_Ordem__c != null || this.dataOrder.Conta_Ordem__c !== undefined) ? this.dataOrder.Conta_Ordem__r.Name : " ",
            ],
            ];
            doc.autoTable(columnsFinal, dataFinal, autoTableOptionsFinal);

            const finalY = doc.lastAutoTable.finalY;
            const autoTableOptions = {
                startY: finalY + 3, // Posição inicial Y da tabela
                tableWidth: 182, // Define a largura total da tabela
                theme: 'grid',
                rowPageBreak: 'avoid',
                margin: {bottom: 80},
                showHead: 'firstPage',
                headStyles: {
                    fillColor: [233, 79, 40], // Cor de fundo para o cabeçalho
                    textColor: 255, // Cor do texto para o cabeçalho
                }
                };


            const columns = ["Código do Produto", "Produto Existente", "Qtde", "Valor de Venda", "Valor Total"];
            const data = [];

            for (let i = 0; i < this.dataOrderItem.length ; i++){
                let dataList = [this.dataOrderItem[i].OrderItemNumber,
                  this.dataOrderItem[i].Product2.Name,
                  this.dataOrderItem[i].Quantity,
                  (this.dataOrderItem[i].ValorVenda__c) ? this.formatMoney(this.dataOrderItem[i].ValorVenda__c, 2, ',', '.') : ' ',
                  (this.dataOrderItem[i].TotalPrice) ? this.formatMoney(this.dataOrderItem[i].TotalPrice, 2, ',', '.') : ' '
                  ]
                data.push(dataList);
            }

            let taxaFinanceiraRow = [
                {
                    content: "Taxa Financeira",
                    colSpan: 1, // Número de colunas que a célula irá abranger (um menos que o número total de colunas)
                    styles: { halign: 'center', fontStyle: 'bold' } // Alinhar o conteúdo horizontalmente ao centro
                },
                {
                    content: (this.dataOrder.Taxa_Financeira__c) ? this.dataOrder.Taxa_Financeira__c + '%' : ' ',
                    colSpan: 2
                }, // Coluna vazia para manter a estrutura da tabela
                {
                    content: "Encargo Financeiro",
                    colSpan: 1, // Número de colunas que a célula irá abranger (um menos que o número total de colunas)
                    styles: { halign: 'center', fontStyle: 'bold' } // Alinhar o conteúdo horizontalmente ao centro
                }, // Coluna vazia para manter a estrutura da tabela
                {
                    content: (this.dataOrder.Encargo_Financeiro__c) ? this.dataOrder.Encargo_Financeiro__c + '%' : ' ',
                    colSpan: 1
                }, // Coluna vazia para manter a estrutura da tabela
                '', // Coluna vazia para manter a estrutura da tabela
                '' // Coluna vazia para manter a estrutura da tabela
            ];
            
            // Adicione a lista taxaFinanceiraRow à matriz de dados 'data'
            data.push(taxaFinanceiraRow);



            let condPagamentoRow = [
                {
                    content: "Cond. Pagamento",
                    colSpan: 1, // Número de colunas que a célula irá abranger (um menos que o número total de colunas)
                    styles: { halign: 'center', fontStyle: 'bold' } // Alinhar o conteúdo horizontalmente ao centro
                },
                {
                    content: (this.dataOrder.Condicao_de_Pagamento__c != null || this.dataOrder.Condicao_de_Pagamento__c !== undefined) ? this.dataOrder.Condicao_de_Pagamento__r.Name : ' ',
                    colSpan: 2
                }, // Coluna vazia para manter a estrutura da tabela
                {
                    content: "Valor Total Pedido",
                    colSpan: 1, // Número de colunas que a célula irá abranger (um menos que o número total de colunas)
                    styles: { halign: 'center', fontStyle: 'bold' } // Alinhar o conteúdo horizontalmente ao centro
                }, // Coluna vazia para manter a estrutura da tabela
                {
                    content: (this.dataOrder.TotalAmount) ? this.formatMoney(this.dataOrder.TotalAmount, 2, ',', '.') : ' ',
                    colSpan: 1
                }, // Coluna vazia para manter a estrutura da tabela
                '', // Coluna vazia para manter a estrutura da tabela
                '' // Coluna vazia para manter a estrutura da tabela
            ];
            
            // Adicione a lista condPagamentoRow à matriz de dados 'data'
            data.push(condPagamentoRow);



            let enderecoCompleto;
            if(this.dataOrder.Estabelecimento__c || this.dataOrder.Estabelecimento__c !== undefined){
                let endereco = this.dataOrder.Estabelecimento__r.Endereco__c;

                enderecoCompleto = String(this.dataOrder.Estabelecimento__r.RazaoSocial__c) + 
                ' - ' + String(endereco.street) + ', ' + String(this.dataOrder.Estabelecimento__r.Numero__c) + ' - ' + String(endereco.city) +
                '\n - ' + String(this.dataOrder.Estabelecimento__r.Complemento__c) +
                ' - ' + String(endereco.stateCode) + ' - ' + String(this.dataOrder.Estabelecimento__r.CGCMF__c);
            }
            let footerRow = [
                {
                    content: (enderecoCompleto) ? enderecoCompleto : ' ',
                    colSpan: 7,
                    styles: {halign: 'center', fontStyle: 'bold', textColor: [255, 255, 255], fillColor: [14,44,86]}
                },
                '',
                '',
                '',
                '',
                ''
            ]

            data.push(footerRow);

            doc.autoTable(columns, data, autoTableOptions);
            
            const secondFinalY = doc.lastAutoTable.finalY;

            // Segundo retângulo azul + texto
            doc.setDrawColor(14, 44, 86);
            doc.setFillColor(14, 44, 86);
            doc.roundedRect(5, 260, 200, 15, 2, 2, 'F');
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#FFFFFF');
            doc.text('Acesse nosso site: www.SND.com.br', 10, 268);
            doc.addImage(imgData2, 'PNG', 100, 260, 15, 15);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#FFFFFF');
            doc.text('SP: (11) 2187-8333', 160, 267);
            doc.text('RJ: (21) 4062-5387', 160, 271);
            
            // Texto em negrito no final
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text('"Correspondência de mera cotação, sujeita à previa aprovação da gerência comercial e financeira por conta da', 12, secondFinalY+10);
            doc.text('verificação de disponibilidade de estoques, política de preços e verificação/liberação de crédito do adquirente,', 12, secondFinalY+14);
            doc.text('sem o que não será considerado concluído e formalizado qualquer pedido".', 12, secondFinalY+18);

            doc.setFont('helvetica', 'normal');
            doc.text('Para informações de como receber suas comissões acesse o site www.snd.com.br/comissoes', 12, secondFinalY+28)
            
            doc.save('PedidoSimples.pdf');
        }else{
            console.log('Biblioteca jsPDF não inicializada.')
        }
    }

    gerarPedidoCompleto(){
        var doc = new window.jspdf.jsPDF();
        var imgData = 'data:image/png;base64,' + base64Image;
        var imgData2 = 'data:image/png;base64,' + base64Image2; 

        if(this.jsPDFInitialized){

            // Retângulo auzl com pedido completo
            doc.setDrawColor(14,44,86);
            doc.setFillColor(14,44,86);
            doc.roundedRect(82, 3, 48, 12, 2, 2, 'F');
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#FFFFFF');
            doc.text("Pedido Completo", 86, 11);
 
            // Logo SND
            doc.addImage(imgData, 'PNG', 180, 0, 20, 20);
 
            // Linha azul
            doc.setDrawColor(14,44,86);
            doc.line(5, 20, 205, 20);

            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.text("Pedido Completo:", 10, 30);
            doc.text("Emissão:", 10, 35);
            // - Dados - Pedido Completo, Data de Emissão
            doc.text((this.dataOrder.OrderNumber) ? String(this.dataOrder.OrderNumber) : ' ' , 43, 30);
            
            let dataEmissao = String(this.dataOrder.EffectiveDate).split('-');
            doc.text((this.dataOrder.EffectiveDate || this.dataOrder.EffectiveDate !== undefined) ? dataEmissao[2] + '/' + dataEmissao[1] + '/' + dataEmissao[0] : ' ', 28, 35);

            // Primeiro retângulo cinza
            doc.setDrawColor(190,190,190);
            doc.setFillColor(190,190,190);
            doc.rect(5, 40, 200, 12, 'F');
            doc.setFont('helvetica', 'bold');
            doc.text("Revenda:", 10, 44);
            doc.text("A/C: ", 10, 50);
            // - Dados - Revenda, A/C
            doc.text((this.dataOrder.Revenda__c || this.dataOrder.Revenda__c !== undefined) ? String(this.dataOrder.Revenda__r.Name) : ' ', 30, 44);
            doc.text((this.dataOrder.Account.ContatoPrimario__c || this.dataOrder.Account.ContatoPrimario__c !== undefined) ? String(this.dataOrder.Account.ContatoPrimario__r.Name) : ' ', 22, 50);

            doc.setFont('helvetica', 'normal');
            doc.text("Conforme combinado com V.Sa., estamos enviando nossas condições para fornecimento dos produtos e servicos abaixo", 10, 65);

            doc.setFont('helvetica', 'bold');
            doc.text("Estabelecimento:", 10, 75);
            doc.text("Uso/Consumo:", 10, 80);
            // - Dados - Estabelecimento, Uso/Consumo
            doc.text((this.dataOrder.Estabelecimento__c || this.dataOrder.Estabelecimento__c !== undefined) ? String(this.dataOrder.Estabelecimento__r.Name) : ' ', 40, 75);
            doc.text((this.dataOrder.UsoConsumo__c) ? 'Sim' : 'Não', 38, 80);


            // Tabela do produto
            const autoTableOptions1 = {
                startY: 85, // Posição inicial Y da tabela
                tableWidth: 182, // Define a largura total da tabela
                theme: 'grid',
                rowPageBreak: 'avoid',
                margin: {bottom: 80},
                headStyles: {
                    fillColor: [190, 190, 190], // Cor de fundo para o cabeçalho
                    textColor: [0, 0, 0] // Cor do texto para o cabeçalho
                },
                showHead: 'firstPage'
            };

            const colsTable1 = ["Descrição do Produto", "Quantidade", "Valor Unitário", "Valor Total"];

            const data = [];

            let totalItemQuantity = 0;
            let totalValorUnitario = 0;

            for (let i = 0; i < this.dataOrderItem.length ; i++){
                let dataList = [
                    this.dataOrderItem[i].Product2.Name,
                    this.dataOrderItem[i].Quantity,
                    (this.dataOrderItem[i].UnitPrice) ? this.formatMoney(this.dataOrderItem[i].UnitPrice, 2, ',', '.') : null,
                    (this.dataOrderItem[i].TotalPrice) ? this.formatMoney(this.dataOrderItem[i].TotalPrice, 2, ',', '.') : null]

                totalItemQuantity += this.dataOrderItem[i].Quantity;
                let valUnitarioXQuantidade = this.dataOrderItem[i].UnitPrice * this.dataOrderItem[i].Quantity;
                totalValorUnitario += (valUnitarioXQuantidade) ? valUnitarioXQuantidade : 0;

                data.push(dataList);
            }

            let freteRow = [
                {
                    content: 'Frete',
                    styles: {halign: 'left', fontStyle: 'bold'}
                },
                '',
                '',
                {
                    content: (this.dataOrder.Valor_Do_Frete__c) ?this.formatMoney(this.dataOrder.Valor_Do_Frete__c, 2, ',', '.') : ' ',
            }];
            data.push(freteRow);


            let despesasRow = [
                {
                    content: 'Despesas',
                    styles: {halign: 'left', fontStyle: 'bold'}
                },
                '',
                '',
                {
                    content: (this.dataOrder.Valor_Despesa__c) ? this.formatMoney(this.dataOrder.Valor_Despesa__c, 2, ',', '.') : ' ',
            }];
            data.push(despesasRow);


            let taxaFinanceiraRow = [
                {
                    content: 'Taxa Financeira',
                    styles: {halign: 'left', fontStyle: 'bold'}
                },
                '',
                '',
                {
                    content: (this.dataOrder.Taxa_Financeira__c) ? this.dataOrder.Taxa_Financeira__c + '%' : ' ',
            }];
            data.push(taxaFinanceiraRow);


            let valoresTotaisRow = [
                {
                    content: 'Valores Totais da Cotação (ou frete e taxas)',
                    styles: {halign: 'left', fontStyle: 'bold'}
                },
                {
                    content: totalItemQuantity
                },
                {
                    content: (totalValorUnitario) ?this.formatMoney(totalValorUnitario, 2, ',', '.') : ' '
                },
                {
                    content: (this.dataOrder.TotalAmount) ? this.formatMoney(this.dataOrder.TotalAmount, 2, ',', '.') : ' '
                }
            ];
            data.push(valoresTotaisRow);


            doc.autoTable(colsTable1, data, autoTableOptions1);
            const finalYTable1 = doc.lastAutoTable.finalY || 10;


            // Segunda tabela
            const autoTableOptions2 = {
                startY: finalYTable1 + 20, // Posição inicial Y da tabela
                tableWidth: 182, // Define a largura total da tabela
                theme: 'grid',
                rowPageBreak: 'avoid',
                margin: {bottom: 80},
                headStyles: {
                    fillColor: [190, 190, 190], // Cor de fundo para o cabeçalho
                    textColor: [0, 0, 0] // Cor do texto para o cabeçalho
                },
                showHead: 'firstPage'
            };

            const colsTable2 = ["Código", "Qtde", "ICMS", "ICMS-ST", "IPI", "ISS", "COFINS", "PIS", "Aliq ICMS", "Aliq IPI"];

            const data2 = [];

            for (let i = 0; i < this.dataOrderItem.length ; i++){
                let dataList = [
                    {
                        content:this.dataOrderItem[i].Product2.Name,
                        styles:{cellWidth: 40}
                    },
                    (this.dataOrderItem[i].Quantity) ? this.dataOrderItem[i].Quantity : ' ',
                    (this.dataOrderItem[i].ICMS__c) ?this.formatMoney(this.dataOrderItem[i].ICMS__c, 2, ',', '.') : ' ',
                    (this.dataOrderItem[i].ICMSST__c) ? this.formatMoney(this.dataOrderItem[i].ICMSST__c, 2, ',', '.') : ' ',
                    (this.dataOrderItem[i].IPI__c) ? this.formatMoney(this.dataOrderItem[i].IPI__c, 2, ',', '.') : ' ',
                    (this.dataOrderItem[i].ISS__c) ? this.formatMoney(this.dataOrderItem[i].ISS__c, 2, ',', '.') : ' ',
                    (this.dataOrderItem[i].Cofins__c) ? this.formatMoney(this.dataOrderItem[i].Cofins__c, 2, ',', '.') : ' ',
                    (this.dataOrderItem[i].PIS__c) ? this.formatMoney(this.dataOrderItem[i].PIS__c, 2, ',', '.') : ' ',
                    (this.dataOrderItem[i].AliquotaICMS__c) ? this.dataOrderItem[i].AliquotaICMS__c + '%' : ' ',
                    (this.dataOrderItem[i].AliquotaIPI__c) ? this.dataOrderItem[i].AliquotaIPI__c + '%' : ' ']
                data2.push(dataList);
            }

            doc.autoTable(colsTable2, data2, autoTableOptions2);



            // Segundo retângulo azul + texto
            doc.setDrawColor(14,44,86);
            doc.setFillColor(14,44,86);
            doc.roundedRect(5, 260, 200, 15, 2, 2, 'F');
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#FFFFFF');
            doc.text("Acesse nosso site: www.SND.com.br", 10, 268);
            doc.addImage(imgData2, 'PNG', 100, 260, 15, 15);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#FFFFFF');
            doc.text("SP: (11) 2187-8333", 160, 267);
            doc.text("RJ: (21) 4062-5387", 160, 271);


            //Nova Página
            doc.addPage();

            // Retângulo auzl com pedido completo
            doc.setDrawColor(14, 44, 86);
            doc.setFillColor(14, 44, 86);
            doc.roundedRect(82, 3, 48, 12, 2, 2, 'F');
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#FFFFFF');
            doc.text('Pedido Completo', 86, 11);

            // Logo SND
            doc.addImage(imgData, 'PNG', 180, 0, 20, 20);

            // Linha azul
            doc.setDrawColor(14, 44, 86);
            doc.line(5, 20, 205, 20);

            // Condições comerciais
            doc.setDrawColor(190, 190, 190);
            doc.setFillColor(190, 190, 190);
            doc.rect(5, 40, 200, 10, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(14, 44, 86);
            doc.text('Condições Comerciais:', 6, 46);

            doc.setDrawColor(14, 44, 86);
            doc.line(5, 48, 205, 48);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text((this.dataOrder.Condicao_de_Pagamento__c || this.dataOrder.Condicao_de_Pagamento__c !== undefined) ? '- ' + String(this.dataOrder.Condicao_de_Pagamento__r.Name) : ' ', 20, 60);


            // Condição de Frete
            doc.setDrawColor(190, 190, 190);
            doc.setFillColor(190, 190, 190);
            doc.rect(5, 100, 200, 10, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(14, 44, 86);
            doc.text('Condição de Frete:', 6, 106);

            doc.setDrawColor(14, 44, 86);
            doc.line(5, 108, 205, 108);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text((this.dataOrder.Condicoes_Do_Frete__c) ? '-  ' + String(this.dataOrder.Condicoes_Do_Frete__c) : ' ', 20, 120);


            // Troca e Devolução
            doc.setDrawColor(190, 190, 190);
            doc.setFillColor(190, 190, 190);
            doc.rect(5, 140, 200, 10, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(14, 44, 86);
            doc.text('Troca e Devolução:', 6, 146);

            doc.setDrawColor(14, 44, 86);
            doc.line(5, 148, 205, 148);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text('-  Caso receba um produto avariado, recuse a entrega imediatamente e informe o ocorrido em um período de 24horas.', 20, 160);
            doc.text('-  Para troca ou devolução o produto deverá estar na embalagem original, e com os acessórios intactos.', 20, 167);
            doc.text('-  (Manual/documentação, etc.), alguns fabricantes pedem foto do produto para constatar o estado da mercadoria. \n   Você terá 07 dias corridos para desistir da compra a contar da data do recebimento.', 20, 174);
            doc.text('-  Para qualquer situação acima, entrar em contato com o SAC pelos fones: (11) 2187-8400 e \n   (21) 4062-5387 ou por e-mail: sac@snd.com.br', 20, 185);
            doc.text('-  Para defeitos após 30 dias, entrar em contato com a rede autorizada de garantia do fabricante.', 20, 197);


            // Segundo retângulo azul + texto
            doc.setDrawColor(14, 44, 86);
            doc.setFillColor(14, 44, 86);
            doc.roundedRect(5, 260, 200, 15, 2, 2, 'F');
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#FFFFFF');
            doc.text('Acesse nosso site: www.SND.com.br', 10, 268);
            doc.addImage(imgData2, 'PNG', 100, 260, 15, 15);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#FFFFFF');
            doc.text('SP: (11) 2187-8333', 160, 267);
            doc.text('RJ: (21) 4062-5387', 160, 271);



            //Nova Página
            doc.addPage();

            // Retângulo auzl com pedido completo
            doc.setDrawColor(14, 44, 86);
            doc.setFillColor(14, 44, 86);
            doc.roundedRect(82, 3, 48, 12, 2, 2, 'F');
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#FFFFFF');
            doc.text('Pedido Completo', 86, 11);

            // Logo SND
            doc.addImage(imgData, 'PNG', 180, 0, 20, 20);

            // Linha azul
            doc.setDrawColor(14, 44, 86);
            doc.line(5, 20, 205, 20);
            
            
            // Dados do vendedor
            doc.setDrawColor(190, 190, 190);
            doc.setFillColor(190, 190, 190);
            doc.rect(5, 40, 200, 42, 'F');


            doc.setFont('helvetica', 'bold');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(12);
            doc.text('Dados do Vendedor:', 10, 50);

            doc.text('Nome: ', 15, 60);
            doc.text('Telefone: ', 15, 68);
            doc.text('E-mail: ', 15, 76);
            // - Dados - 
            doc.text((this.dataUser.Name) ? String(this.dataUser.Name) : ' ', 35, 60);
            doc.text((this.dataUser.Phone) ? String(this.dataUser.Phone) : ' ', 35, 68);
            doc.text((this.dataUser.Email) ? String(this.dataUser.Email) : ' ', 35, 76);

            doc.setDrawColor(14, 44, 86);
            doc.line(10, 52, 200, 52);



            //Empresa
            doc.setDrawColor(190, 190, 190);
            doc.setFillColor(190, 190, 190);
            doc.rect(5, 95, 200, 10, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(14, 44, 86);
            doc.text('Empresa:', 6, 101);

            doc.setDrawColor(14, 44, 86);
            doc.line(5, 103, 205, 103);
            // Dados - (Nome da empresa / Nome da conta)
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.text((this.dataOrder.Account.Name) ? String(this.dataOrder.Account.Name) : ' ', 10 ,110);

            
            //CD - REMETENTE
            doc.setDrawColor(190, 190, 190);
            doc.setFillColor(190, 190, 190);
            doc.rect(5, 125, 200, 10, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(14, 44, 86);
            doc.text('CD - Remetente:', 6, 131);

            doc.setDrawColor(14, 44, 86);
            doc.line(5, 133, 205, 133);
            // Dados - (Nome do estabelecimento / SND)
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            
            
            let enderecoCompleto;
            if(this.dataOrder.Estabelecimento__c || this.dataOrder.Estabelecimento__c !== undefined){
                let endereco = this.dataOrder.Estabelecimento__r.Endereco__c;

                enderecoCompleto = String(this.dataOrder.Estabelecimento__r.RazaoSocial__c) + 
                ' - ' + String(endereco.street) + ', ' + String(this.dataOrder.Estabelecimento__r.Numero__c) + ' - ' + String(endereco.city) +
                '\n - ' + String(this.dataOrder.Estabelecimento__r.Complemento__c) +
                ' - ' + String(this.dataOrder.Estabelecimento__r.CGCMF__c);
            }
            doc.text((enderecoCompleto) ? enderecoCompleto : ' ', 10, 140);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text('"Correspondência de mera cotação, sujeita à previa aprovação da gerência comercial e financeira por conta da \nverificação de disponibilidade de estoques, política de preços e verificação/liberação de crédito do adquirente, sem \no que não será considerado concluído e formalizado qualquer pedido".', 5, 160);




            // Segundo retângulo azul + texto
            doc.setDrawColor(14, 44, 86);
            doc.setFillColor(14, 44, 86);
            doc.roundedRect(5, 260, 200, 15, 2, 2, 'F');
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#FFFFFF');
            doc.text('Acesse nosso site: www.SND.com.br', 10, 268);
            doc.addImage(imgData2, 'PNG', 100, 260, 15, 15);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#FFFFFF');
            doc.text('SP: (11) 2187-8333', 160, 267);
            doc.text('RJ: (21) 4062-5387', 160, 271);



            doc.save('PedidoCompletoUsuarioFinal.pdf');
        }else{
            console.log('Biblioteca jsPDF não inicializada.')
        }
    }




    gerarPedidoCompletoRevenda(){
        var doc = new window.jspdf.jsPDF();
        var imgData = 'data:image/png;base64,' + base64Image;
        var imgData2 = 'data:image/png;base64,' + base64Image2; 

        if(this.jsPDFInitialized){

            // Retângulo auzl com pedido completo
            doc.setDrawColor(14,44,86);
            doc.setFillColor(14,44,86);
            doc.roundedRect(82, 3, 48, 12, 2, 2, 'F');
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#FFFFFF');
            doc.text("Pedido Completo", 86, 11);
 
            // Logo SND
            doc.addImage(imgData, 'PNG', 180, 0, 20, 20);
 
            // Linha azul
            doc.setDrawColor(14,44,86);
            doc.line(5, 20, 205, 20);

            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.text("Pedido Completo:", 10, 30);
            doc.text("Emissão:", 10, 35);
            // - Dados - Pedido Completo, Data de Emissão
            doc.text((this.dataOrder.OrderNumber) ? String(this.dataOrder.OrderNumber) : ' ' , 43, 30);
            
            let dataEmissao = String(this.dataOrder.EffectiveDate).split('-');
            doc.text((this.dataOrder.EffectiveDate || this.dataOrder.EffectiveDate !== undefined) ? dataEmissao[2] + '/' + dataEmissao[1] + '/' + dataEmissao[0] : ' ', 28, 35);

            // Primeiro retângulo cinza
            doc.setDrawColor(190,190,190);
            doc.setFillColor(190,190,190);
            doc.rect(5, 40, 200, 12, 'F');
            doc.setFont('helvetica', 'bold');
            doc.text("Revenda:", 10, 44);
            doc.text("A/C: ", 10, 50);
            // - Dados - Revenda, A/C
            doc.text((this.dataOrder.Revenda__c || this.dataOrder.Revenda__c !== undefined) ? String(this.dataOrder.Revenda__r.Name) : ' ', 30, 44);
            doc.text((this.dataOrder.Account.ContatoPrimario__c || this.dataOrder.Account.ContatoPrimario__c !== undefined) ? String(this.dataOrder.Account.ContatoPrimario__r.Name) : ' ', 22, 50);

            doc.setFont('helvetica', 'normal');
            doc.text("Conforme combinado com V.Sa., estamos enviando nossas condições para fornecimento dos produtos e servicos abaixo", 10, 65);

            doc.setFont('helvetica', 'bold');
            doc.text("Estabelecimento:", 10, 75);
            doc.text("Uso/Consumo:", 10, 80);
            // - Dados - Estabelecimento, Uso/Consumo
            doc.text((this.dataOrder.Estabelecimento__c || this.dataOrder.Estabelecimento__c !== undefined) ? String(this.dataOrder.Estabelecimento__r.Name) : ' ', 40, 75);
            doc.text((this.dataOrder.UsoConsumo__c) ? 'Sim' : 'Não', 38, 80);


            // Tabela do produto
            const autoTableOptions1 = {
                startY: 85, // Posição inicial Y da tabela
                tableWidth: 182, // Define a largura total da tabela
                theme: 'grid',
                rowPageBreak: 'avoid',
                margin: {bottom: 80},
                headStyles: {
                    fillColor: [190, 190, 190], // Cor de fundo para o cabeçalho
                    textColor: [0, 0, 0] // Cor do texto para o cabeçalho
                },
                showHead: 'firstPage'
            };

            const colsTable1 = ["Descrição do Produto", "Quantidade", "Valor Unitário", "Valor Total"];

            const data = [];

            let totalItemQuantity = 0;
            let totalValorUnitario = 0;

            for (let i = 0; i < this.dataOrderItem.length ; i++){
                let dataList = [
                    this.dataOrderItem[i].Product2.Name,
                    this.dataOrderItem[i].Quantity,
                    (this.dataOrderItem[i].UnitPrice) ? this.formatMoney(this.dataOrderItem[i].UnitPrice, 2, ',', '.') : null,
                    (this.dataOrderItem[i].TotalPrice) ? this.formatMoney(this.dataOrderItem[i].TotalPrice, 2, ',', '.') : null]

                totalItemQuantity += this.dataOrderItem[i].Quantity;
                let valUnitarioXQuantidade = this.dataOrderItem[i].UnitPrice * this.dataOrderItem[i].Quantity;
                totalValorUnitario += (valUnitarioXQuantidade) ? valUnitarioXQuantidade : 0;

                data.push(dataList);
            }

            let freteRow = [
                {
                    content: 'Frete',
                    styles: {halign: 'left', fontStyle: 'bold'}
                },
                '',
                '',
                {
                    content: (this.dataOrder.Valor_Do_Frete__c) ? this.formatMoney(this.dataOrder.Valor_Do_Frete__c, 2, ',', '.') : ' ',
            }];
            data.push(freteRow);


            let despesasRow = [
                {
                    content: 'Despesas',
                    styles: {halign: 'left', fontStyle: 'bold'}
                },
                '',
                '',
                {
                    content: (this.dataOrder.Valor_Despesa__c) ? this.formatMoney(this.dataOrder.Valor_Despesa__c, 2, ',', '.') : ' ',
            }];
            data.push(despesasRow);


            let taxaFinanceiraRow = [
                {
                    content: 'Taxa Financeira',
                    styles: {halign: 'left', fontStyle: 'bold'}
                },
                '',
                '',
                {
                    content: (this.dataOrder.Taxa_Financeira__c) ? this.dataOrder.Taxa_Financeira__c + '%' : ' ',
            }];
            data.push(taxaFinanceiraRow);


            let valoresTotaisRow = [
                {
                    content: 'Valores Totais da Cotação (ou frete e taxas)',
                    styles: {halign: 'left', fontStyle: 'bold'}
                },
                {
                    content: totalItemQuantity
                },
                {
                    content: (totalValorUnitario) ? this.formatMoney(totalValorUnitario, 2, ',', '.') : ' '
                },
                {
                    content: (this.dataOrder.TotalAmount) ? this.formatMoney(this.dataOrder.TotalAmount, 2, ',', '.') : ' '
                }
            ];
            data.push(valoresTotaisRow);


            doc.autoTable(colsTable1, data, autoTableOptions1);
            const finalYTable1 = doc.lastAutoTable.finalY || 10;


            // Segunda tabela
            const autoTableOptions2 = {
                startY: finalYTable1 + 20, // Posição inicial Y da tabela
                tableWidth: 182, // Define a largura total da tabela
                theme: 'grid',
                rowPageBreak: 'avoid',
                margin: {bottom: 80},
                headStyles: {
                    fillColor: [190, 190, 190], // Cor de fundo para o cabeçalho
                    textColor: [0, 0, 0] // Cor do texto para o cabeçalho
                },
                showHead: 'firstPage'
            };

            const colsTable2 = ["Código", "Qtde", "ICMS", "ICMS-ST", "IPI", "ISS", "COFINS", "PIS", "Aliq ICMS", "Aliq IPI"];

            const data2 = [];

            for (let i = 0; i < this.dataOrderItem.length ; i++){
                let dataList = [
                    {
                        content:this.dataOrderItem[i].Product2.Name, 
                        styles:{cellWidth: 40}
                    },
                    (this.dataOrderItem[i].Quantity) ? this.dataOrderItem[i].Quantity : ' ',
                    (this.dataOrderItem[i].ICMS__c) ? this.formatMoney(this.dataOrderItem[i].ICMS__c, 2, ',', '.') : ' ',
                    (this.dataOrderItem[i].ICMSST__c) ? this.formatMoney(this.dataOrderItem[i].ICMSST__c, 2, ',', '.') : ' ',
                    (this.dataOrderItem[i].IPI__c) ? this.formatMoney(this.dataOrderItem[i].IPI__c, 2, ',', '.') : ' ',
                    (this.dataOrderItem[i].ISS__c) ? this.formatMoney(this.dataOrderItem[i].ISS__c, 2, ',', '.') : ' ',
                    (this.dataOrderItem[i].Cofins__c) ? this.formatMoney(this.dataOrderItem[i].Cofins__c, 2, ',', '.') : ' ',
                    (this.dataOrderItem[i].PIS__c) ? this.formatMoney(this.dataOrderItem[i].PIS__c, 2, ',', '.') : ' ',
                    (this.dataOrderItem[i].AliquotaICMS__c) ? this.dataOrderItem[i].AliquotaICMS__c + '%' : ' ',
                    (this.dataOrderItem[i].AliquotaIPI__c) ? this.dataOrderItem[i].AliquotaIPI__c + '%' : ' ']
                data2.push(dataList);
            }

            doc.autoTable(colsTable2, data2, autoTableOptions2);



            // Segundo retângulo azul + texto
            doc.setDrawColor(14,44,86);
            doc.setFillColor(14,44,86);
            doc.roundedRect(5, 260, 200, 15, 2, 2, 'F');
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#FFFFFF');
            doc.text("Acesse nosso site: www.SND.com.br", 10, 268);
            doc.addImage(imgData2, 'PNG', 100, 260, 15, 15);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#FFFFFF');
            doc.text("SP: (11) 2187-8333", 160, 267);
            doc.text("RJ: (21) 4062-5387", 160, 271);


            //Nova Página
            doc.addPage();

            // Retângulo auzl com pedido completo
            doc.setDrawColor(14, 44, 86);
            doc.setFillColor(14, 44, 86);
            doc.roundedRect(82, 3, 48, 12, 2, 2, 'F');
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#FFFFFF');
            doc.text('Pedido Completo', 86, 11);

            // Logo SND
            doc.addImage(imgData, 'PNG', 180, 0, 20, 20);

            // Linha azul
            doc.setDrawColor(14, 44, 86);
            doc.line(5, 20, 205, 20);

            // Condições comerciais
            doc.setDrawColor(190, 190, 190);
            doc.setFillColor(190, 190, 190);
            doc.rect(5, 40, 200, 10, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(14, 44, 86);
            doc.text('Condições Comerciais:', 6, 46);

            doc.setDrawColor(14, 44, 86);
            doc.line(5, 48, 205, 48);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text((this.dataOrder.Condicao_de_Pagamento__c || this.dataOrder.Condicao_de_Pagamento__c !== undefined) ? '- ' + String(this.dataOrder.Condicao_de_Pagamento__r.Name) : ' ', 20, 60);


            // Condição de Frete
            doc.setDrawColor(190, 190, 190);
            doc.setFillColor(190, 190, 190);
            doc.rect(5, 100, 200, 10, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(14, 44, 86);
            doc.text('Condição de Frete:', 6, 106);

            doc.setDrawColor(14, 44, 86);
            doc.line(5, 108, 205, 108);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text((this.dataOrder.Condicoes_Do_Frete__c) ? '-  ' + String(this.dataOrder.Condicoes_Do_Frete__c) : ' ', 20, 120);


            // Troca e Devolução
            doc.setDrawColor(190, 190, 190);
            doc.setFillColor(190, 190, 190);
            doc.rect(5, 140, 200, 10, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(14, 44, 86);
            doc.text('Troca e Devolução:', 6, 146);

            doc.setDrawColor(14, 44, 86);
            doc.line(5, 148, 205, 148);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text('-  Caso receba um produto avariado, recuse a entrega imediatamente e informe o ocorrido em um período de 24horas.', 20, 160);
            doc.text('-  Para troca ou devolução o produto deverá estar na embalagem original, e com os acessórios intactos.', 20, 167);
            doc.text('-  (Manual/documentação, etc.), alguns fabricantes pedem foto do produto para constatar o estado da mercadoria. \n   Você terá 07 dias corridos para desistir da compra a contar da data do recebimento.', 20, 174);
            doc.text('-  Para qualquer situação acima, entrar em contato com o SAC pelos fones: (11) 2187-8400 e \n   (21) 4062-5387 ou por e-mail: sac@snd.com.br', 20, 185);
            doc.text('-  Para defeitos após 30 dias, entrar em contato com a rede autorizada de garantia do fabricante.', 20, 197);


            // Segundo retângulo azul + texto
            doc.setDrawColor(14, 44, 86);
            doc.setFillColor(14, 44, 86);
            doc.roundedRect(5, 260, 200, 15, 2, 2, 'F');
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#FFFFFF');
            doc.text('Acesse nosso site: www.SND.com.br', 10, 268);
            doc.addImage(imgData2, 'PNG', 100, 260, 15, 15);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#FFFFFF');
            doc.text('SP: (11) 2187-8333', 160, 267);
            doc.text('RJ: (21) 4062-5387', 160, 271);



            //Nova Página
            doc.addPage();

            // Retângulo auzl com pedido completo
            doc.setDrawColor(14, 44, 86);
            doc.setFillColor(14, 44, 86);
            doc.roundedRect(82, 3, 48, 12, 2, 2, 'F');
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#FFFFFF');
            doc.text('Pedido Completo', 86, 11);

            // Logo SND
            doc.addImage(imgData, 'PNG', 180, 0, 20, 20);

            // Linha azul
            doc.setDrawColor(14, 44, 86);
            doc.line(5, 20, 205, 20);
            
            
            // Dados do vendedor
            doc.setDrawColor(190, 190, 190);
            doc.setFillColor(190, 190, 190);
            doc.rect(5, 40, 200, 42, 'F');


            doc.setFont('helvetica', 'bold');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(12);
            doc.text('Dados do Vendedor:', 10, 50);

            doc.text('Nome: ', 15, 60);
            doc.text('Telefone: ', 15, 68);
            doc.text('E-mail: ', 15, 76);
            // - Dados - 
            doc.text((this.dataUser.Name) ? String(this.dataUser.Name) : ' ', 35, 60);
            doc.text((this.dataUser.Phone) ? String(this.dataUser.Phone) : ' ', 35, 68);
            doc.text((this.dataUser.Email) ? String(this.dataUser.Email) : ' ', 35, 76);

            doc.setDrawColor(14, 44, 86);
            doc.line(10, 52, 200, 52);



            //Empresa
            doc.setDrawColor(190, 190, 190);
            doc.setFillColor(190, 190, 190);
            doc.rect(5, 95, 200, 10, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(14, 44, 86);
            doc.text('Empresa:', 6, 101);

            doc.setDrawColor(14, 44, 86);
            doc.line(5, 103, 205, 103);
            // Dados - (Nome da empresa / Nome da conta)
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.text((this.dataOrder.Account.Name) ? String(this.dataOrder.Account.Name) : ' ', 10 ,110);

            
            //CD - REMETENTE
            doc.setDrawColor(190, 190, 190);
            doc.setFillColor(190, 190, 190);
            doc.rect(5, 125, 200, 10, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(14, 44, 86);
            doc.text('CD - Remetente:', 6, 131);

            doc.setDrawColor(14, 44, 86);
            doc.line(5, 133, 205, 133);
            // Dados - (Nome do estabelecimento / SND)
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            
            
            let enderecoCompleto;
            if(this.dataOrder.Estabelecimento__c || this.dataOrder.Estabelecimento__c !== undefined){
                let endereco = this.dataOrder.Estabelecimento__r.Endereco__c;

                enderecoCompleto = String(this.dataOrder.Estabelecimento__r.RazaoSocial__c) + 
                ' - ' + String(endereco.street) + ', ' + String(this.dataOrder.Estabelecimento__r.Numero__c) + ' - ' + String(endereco.city) +
                '\n - ' + String(this.dataOrder.Estabelecimento__r.Complemento__c) +
                ' - ' + String(this.dataOrder.Estabelecimento__r.CGCMF__c);
            }
            doc.text((enderecoCompleto) ? enderecoCompleto : ' ', 10, 140);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text('"Correspondência de mera cotação, sujeita à previa aprovação da gerência comercial e financeira por conta da \nverificação de disponibilidade de estoques, política de preços e verificação/liberação de crédito do adquirente, sem \no que não será considerado concluído e formalizado qualquer pedido".', 5, 160);




            // Segundo retângulo azul + texto
            doc.setDrawColor(14, 44, 86);
            doc.setFillColor(14, 44, 86);
            doc.roundedRect(5, 260, 200, 15, 2, 2, 'F');
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#FFFFFF');
            doc.text('Acesse nosso site: www.SND.com.br', 10, 268);
            doc.addImage(imgData2, 'PNG', 100, 260, 15, 15);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#FFFFFF');
            doc.text('SP: (11) 2187-8333', 160, 267);
            doc.text('RJ: (21) 4062-5387', 160, 271);



            doc.save('PedidoCompletoRevenda.pdf');
        }else{
            console.log('Biblioteca jsPDF não inicializada.')
        }
    }

    gerarComissaoRevenda(){
        var doc = new window.jspdf.jsPDF();
        var imgData = 'data:image/jpeg;base64,' + base64Image; 
        var imgData2 = 'data:image/jpeg;base64,' + base64Image2; 
         
        if(this.jsPDFInitialized){
            doc.addImage(imgData, 'PNG', 180, 0, 20, 20);
            
            // Retângulo auzl com resumo do pedido
            doc.setDrawColor(14,44,86);
            doc.setFillColor(14,44,86);
            doc.roundedRect(82, 3, 48, 12, 2, 2, 'F');
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#FFFFFF');
            doc.text("Resumo do Pedido", 84, 11);

            doc.setDrawColor(14,44,86);
            doc.line(14, 20, 196, 20);
            doc.setDrawColor(14,44,86);
            doc.setFillColor(14,44,86);
            doc.roundedRect(82, 3, 48, 12, 2, 2, 'F');
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#FFFFFF');
            doc.text("Resumo do Pedido", 84, 11);

            const firstTable = ['Vendedor', 'Nome', 'Nº Pedido', '00000139'];

            const dataFirstTable = [
            [
                { content: 'Vendedor', styles: { fontStyle: 'bold' } },
                (this.dataUser.Name) ? this.dataUser.Name : " " ,
                { content: 'Nº Pedido', styles: { fontStyle: 'bold' } },
                (this.dataOrder.OrderNumber) ? String(this.dataOrder.OrderNumber) : " ",
            ],
            [
                { content: 'Cliente', styles: { fontStyle: 'bold' } },
                (this.dataOrder.Account.Name) ? this.dataOrder.Account.Name : " ",
                { content: 'Frete', styles: { fontStyle: 'bold' } },
                (this.dataOrder.Valor_Do_Frete__c) ? this.formatMoney(this.dataOrder.Valor_Do_Frete__c, 2, ',', '.') : " ",
            ],
            [
                { content: 'Revendas', styles: { fontStyle: 'bold' } },
                (this.dataOrder.Revenda__c != null || this.dataOrder.Revenda__c !== undefined) ? this.dataOrder.Revenda__r.Name : " ",
                { content: 'Pedido Cliente', styles: { fontStyle: 'bold' } },
                (this.dataOrder.Pedido_Do_Cliente__c != null) ? this.dataOrder.Pedido_Do_Cliente__c : " ",
            ],
            [
                { content: 'CNPJ', styles: { fontStyle: 'bold' } },
                (this.dataOrder.Account.CNPJ__c) ? this.dataOrder.Account.CNPJ__c : " ",
                { content: 'Desc Comissão', styles: { fontStyle: 'bold' } },
                (this.dataOrder.Valor_da_Comissao__c) ? String(this.dataOrder.Valor_da_Comissao__c) : " ",
            ],
            ];

            const firstTableOptions = {
            startY: 25, // Posição inicial Y da tabela
            tableWidth: 182, // Define a largura total da tabela
            theme: 'grid',
            showHead: 'never',
            };

            doc.autoTable(firstTable, dataFirstTable, firstTableOptions);

            const dataFrete = [
            [
                { content: 'Frete', styles: { fontStyle: 'bold' } },
                (this.dataOrder.Condicoes_Do_Frete__c) ? this.dataOrder.Condicoes_Do_Frete__c : " ",
                (this.dataOrder.Via_Transportadora__c) ? this.dataOrder.Via_Transportadora__c : " ",
                (this.dataOrder.Transportadora__c != null || this.dataOrder.Transportadora__c !== undefined) ? this.dataOrder.Transportadora__r.Name : " ",
            ],
            ];
            const secondTableY = doc.lastAutoTable.finalY;

            const autoTableOptions3 = {
            startY: secondTableY, // Posição inicial Y da tabela
            tableWidth: 182, // Define a largura total da tabela
            theme: 'grid',
            showHead: 'never',
            };

            doc.autoTable(null, dataFrete, autoTableOptions3);

            const columnsFinal = [
            'Seguir com o pedido',
            '00000110',
            'Uso/Consumo',
            '000000',
            ];

            const thirdTableY = doc.lastAutoTable.finalY;
            const autoTableOptionsFinal = {
            startY: thirdTableY, // Posição inicial Y da tabela
            tableWidth: 182, // Define a largura total da tabela
            theme: 'grid',
            showHead: 'never',
            };
            const dataFinal = [
            [
                { content: 'Seguir com o Pedido', styles: { fontStyle: 'bold' } },
                (this.dataOrder.Seguir_Com_Pedido__c != null || this.dataOrder.Seguir_Com_Pedido__c !== undefined) ? this.dataOrder.Seguir_Com_Pedido__r.OrderNumber : " ",
                { content: 'Uso/Consumo', styles: { fontStyle: 'bold' } },
                (this.dataOrder.UsoConsumo__c) ? this.dataOrder.UsoConsumo__c : " ",
            ],
            [
                { content: 'Tipo de Operação', styles: { fontStyle: 'bold' } },
                (this.dataOrder.Tipo_de_Operacao__c != null || this.dataOrder.Tipo_de_Operacao__c !== undefined) ? this.dataOrder.Tipo_de_Operacao__r.Name : " ",
                { content: 'Conta Ordem', styles: { fontStyle: 'bold' } },
                (this.dataOrder.Conta_Ordem__c != null || this.dataOrder.Conta_Ordem__c !== undefined) ? this.dataOrder.Conta_Ordem__r.Name : " ",
            ],
            ];
            doc.autoTable(columnsFinal, dataFinal, autoTableOptionsFinal);

            const productTableY = doc.lastAutoTable.finalY;

            const autoTableOptions = {
            startY: productTableY + 3, // Posição inicial Y da tabela
            tableWidth: 182, // Define a largura total da tabela
            theme: 'grid',
            rowPageBreak: 'avoid',
            margin: {bottom: 80},
            showHead: 'firstPage',
            headStyles: {
                fillColor: [233, 79, 40], // Cor de fundo para o cabeçalho
                textColor: 255, // Cor do texto para o cabeçalho
            }
            };
            const columns = ["Código do Produto", "Produto Existente", "Qtde", "Valor de Venda", "Valor Negociado", "Valor de Ajuste", "Comissão"];
            const data = [];

            let totaisValorVenda = 0;
            let totaisValorNegociado = 0;
            let totaisValorAjuste = 0;
            let totaisValorComissao = 0;

            for (let i = 0; i < this.dataOrderItem.length ; i++){
                let dataList = [this.dataOrderItem[i].OrderItemNumber,
                  this.dataOrderItem[i].Product2.Name,
                  this.dataOrderItem[i].Quantity,
                  (this.dataOrderItem[i].ValorVenda__c) ? this.formatMoney(this.dataOrderItem[i].ValorVenda__c, 2, ',', '.') : null,
                  (this.dataOrderItem[i].ValorFinalNegociado__c) ? this.formatMoney(this.dataOrderItem[i].ValorFinalNegociado__c, 2, ',', '.') : null,
                  (this.dataOrderItem[i].ValorAjuste__c) ? this.formatMoney(this.dataOrderItem[i].ValorAjuste__c, 2, ',', '.') : null,
                  (this.dataOrderItem[i].ValorComissao__c) ? this.formatMoney(this.dataOrderItem[i].ValorComissao__c, 2, ',', '.') : null]

                let auxValorVenda = this.dataOrderItem[i].Quantity * this.dataOrderItem[i].ValorVenda__c;
                let auxValorNegociado = this.dataOrderItem[i].Quantity * this.dataOrderItem[i].ValorFinalNegociado__c;
                let auxValorAjuste = this.dataOrderItem[i].Quantity * this.dataOrderItem[i].ValorAjuste__c;
                
                totaisValorVenda += (auxValorVenda) ? auxValorVenda : 0;
                totaisValorNegociado += (auxValorNegociado) ? auxValorNegociado : 0;
                totaisValorAjuste += (auxValorAjuste) ? auxValorAjuste : 0;
                totaisValorComissao += (this.dataOrderItem[i].ValorComissao__c) ? this.dataOrderItem[i].ValorComissao__c : 0;
                data.push(dataList);
            }

            let totaisRow = [
                {
                    content: "Totais",
                    colSpan: 3, // Número de colunas que a célula irá abranger (um menos que o número total de colunas)
                    styles: { halign: 'right', fontStyle: 'bold' } // Alinhar o conteúdo horizontalmente ao centro
                },
                {
                    content: (totaisValorVenda != null) ? this.formatMoney(totaisValorVenda, 2, ',', '.') : null,
                    colSpan: 1
                }, // Coluna vazia para manter a estrutura da tabela
                {
                    content: (totaisValorNegociado != null) ? this.formatMoney(totaisValorNegociado, 2, ',', '.') : null,
                    colSpan: 1
                }, // Coluna vazia para manter a estrutura da tabela
                {
                    content: (totaisValorAjuste != null) ? this.formatMoney(totaisValorAjuste, 2, ',', '.') : null,
                    colSpan: 1
                }, // Coluna vazia para manter a estrutura da tabela
                {
                    content: (totaisValorComissao != null) ? this.formatMoney(totaisValorComissao, 2, ',', '.') : null,
                    colSpan: 1
                }, // Coluna vazia para manter a estrutura da tabela
                '' // Coluna vazia para manter a estrutura da tabela
            ];
            
            // Adicione a lista totaisRow à matriz de dados 'data'
            data.push(totaisRow);

            let diferencaRow = [
                {
                    content: "Diferenças",
                    colSpan: 3, // Número de colunas que a célula irá abranger (um menos que o número total de colunas)
                    styles: { halign: 'right', fontStyle: 'bold' } // Alinhar o conteúdo horizontalmente ao centro
                },
                {
                    content: (totaisValorVenda != null) ? this.formatMoney((totaisValorVenda*(-1)), 2, ',', '.') : null,
                    colSpan: 2
                }, // Coluna vazia para manter a estrutura da tabela
                {
                    content: (totaisValorAjuste != null) ? this.formatMoney((totaisValorAjuste*(-1)), 2, ',', '.') : null,
                    colSpan: 2
                }, // Coluna vazia para manter a estrutura da tabela
                '', // Coluna vazia para manter a estrutura da tabela
                '', // Coluna vazia para manter a estrutura da tabela
                '' // Coluna vazia para manter a estrutura da tabela
            ];
            
            // Adicione a lista diferencaRow à matriz de dados 'data'
            data.push(diferencaRow);

            let taxaFinanceiraRow = [
                {
                    content: "Taxa Financeira",
                    colSpan: 1, // Número de colunas que a célula irá abranger (um menos que o número total de colunas)
                    styles: { halign: 'center', fontStyle: 'bold' } // Alinhar o conteúdo horizontalmente ao centro
                },
                {
                    content: (this.dataOrder.Taxa_Financeira__c) ? this.dataOrder.Taxa_Financeira__c + '%' : ' ',
                    colSpan: 3
                }, // Coluna vazia para manter a estrutura da tabela
                {
                    content: "Encargo Financeiro",
                    colSpan: 2, // Número de colunas que a célula irá abranger (um menos que o número total de colunas)
                    styles: { halign: 'center', fontStyle: 'bold' } // Alinhar o conteúdo horizontalmente ao centro
                }, // Coluna vazia para manter a estrutura da tabela
                {
                    content: (this.dataOrder.Encargo_Financeiro__c) ? this.dataOrder.Encargo_Financeiro__c + '%' : ' ',
                    colSpan: 1
                }, // Coluna vazia para manter a estrutura da tabela
                '', // Coluna vazia para manter a estrutura da tabela
                '' // Coluna vazia para manter a estrutura da tabela
            ];
            
            // Adicione a lista taxaFinanceiraRow à matriz de dados 'data'
            data.push(taxaFinanceiraRow);



            let condPagamentoRow = [
                {
                    content: "Cond. Pagamento",
                    colSpan: 1, // Número de colunas que a célula irá abranger (um menos que o número total de colunas)
                    styles: { halign: 'center', fontStyle: 'bold' } // Alinhar o conteúdo horizontalmente ao centro
                },
                {
                    content: (this.dataOrder.Condicao_de_Pagamento__c != null || this.dataOrder.Condicao_de_Pagamento__c !== undefined) ? this.dataOrder.Condicao_de_Pagamento__r.Name : ' ',
                    colSpan: 3
                }, // Coluna vazia para manter a estrutura da tabela
                {
                    content: "Valor Total Pedido",
                    colSpan: 2, // Número de colunas que a célula irá abranger (um menos que o número total de colunas)
                    styles: { halign: 'center', fontStyle: 'bold' } // Alinhar o conteúdo horizontalmente ao centro
                }, // Coluna vazia para manter a estrutura da tabela
                {
                    content: (this.dataOrder.TotalAmount) ? this.formatMoney(this.dataOrder.TotalAmount, 2, ',', '.') : ' ',
                    colSpan: 1
                }, // Coluna vazia para manter a estrutura da tabela
                '', // Coluna vazia para manter a estrutura da tabela
                '' // Coluna vazia para manter a estrutura da tabela
            ];
            
            // Adicione a lista condPagamentoRow à matriz de dados 'data'
            data.push(condPagamentoRow);


            
            let enderecoCompleto;
            if(this.dataOrder.Estabelecimento__c || this.dataOrder.Estabelecimento__c !== undefined){
                let endereco = this.dataOrder.Estabelecimento__r.Endereco__c;

                enderecoCompleto = String(this.dataOrder.Estabelecimento__r.RazaoSocial__c) + 
                ' - ' + String(endereco.street) + ', ' + String(this.dataOrder.Estabelecimento__r.Numero__c) + ' - ' + String(endereco.city) +
                '\n - ' + String(this.dataOrder.Estabelecimento__r.Complemento__c) +
                ' - ' + String(endereco.stateCode) + ' - ' + String(this.dataOrder.Estabelecimento__r.CGCMF__c);
            }
            let footerRow = [
                {
                    content: (enderecoCompleto) ? enderecoCompleto : ' ',
                    colSpan: 7,
                    styles: {halign: 'center', fontStyle: 'bold', textColor: [255, 255, 255], fillColor: [14,44,86]}
                },
                '',
                '',
                '',
                '',
                ''
            ]

            data.push(footerRow);
            
            doc.autoTable(columns, data, autoTableOptions);

            const finalY = doc.lastAutoTable.finalY;
            
            // Segundo retângulo azul + texto
            doc.setDrawColor(14, 44, 86);
            doc.setFillColor(14, 44, 86);
            doc.roundedRect(5, 260, 200, 15, 2, 2, 'F');
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#FFFFFF');
            doc.text('Acesse nosso site: www.SND.com.br', 10, 268);
            doc.addImage(imgData2, 'PNG', 100, 260, 15, 15);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#FFFFFF');
            doc.text('SP: (11) 2187-8333', 160, 267);
            doc.text('RJ: (21) 4062-5387', 160, 271);
            
            // Texto em negrito no final
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text('"Correspondência de mera cotação, sujeita à previa aprovação da gerência comercial e financeira por conta da', 12, finalY+10);
            doc.text('verificação de disponibilidade de estoques, política de preços e verificação/liberação de crédito do adquirente,',12, finalY+14);
            doc.text('sem o que não será considerado concluído e formalizado qualquer pedido".', 12, finalY+18);

            doc.setFont('helvetica', 'normal');
            doc.text('Para informações de como receber suas comissões acesse o site www.snd.com.br/comissoes', 12, finalY+28)
            
            doc.save('ComissãoRevenda.pdf');

        }else{
            console.log('Biblioteca jsPDF não inicializada.')
        }
    }

}