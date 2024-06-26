import { LightningElement, track, api } from 'lwc';
import { FlowAttributeChangeEvent, FlowNavigationNextEvent } from 'lightning/flowSupport';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

export default class CalcularParcelasPedido extends LightningElement {
    @api recordId = "";
    @api numeroParcelas;
    @api totalAmount;
    @api orderNumber;

    @api valorPrimeiraParcela;
    valorDemaisParcelas;

    saved = true;
    totalPedido;

    contador;

    @track valor;

    @track parcelas = [];

    connectedCallback() {
        try {
            this.calcularParcelas();
        } catch (e) {
            console.error('Erro ao calcular as parcelas: ', e);
        }

    }

    calcularParcelas() {
        this.totalPedido = this.floor(this.totalAmount);
        let valorUnitario = this.floor(this.totalAmount / this.numeroParcelas);
        let valorParcial = this.floor(valorUnitario * this.numeroParcelas);
        
        let diferenca;
        if (valorParcial > this.totalPedido) {

            diferenca = this.round(valorParcial - this.totalPedido);
            this.valorDemaisParcelas = (valorUnitario - diferenca);

            for (var n = 2; n <= this.numeroParcelas; n++) {
                this.parcelas.push({
                    "numero": n,
                    "valor": this.valorDemaisParcelas
                });
            }

            this.valor = this.floor(valorUnitario + diferenca);
        } else if (valorParcial < this.totalPedido) {

            diferenca = this.round(this.totalPedido - valorParcial);
            this.valorDemaisParcelas = valorUnitario;

            for (var n = 2; n <= this.numeroParcelas; n++) {
                this.parcelas.push({
                    "numero": n,
                    "valor": this.valorDemaisParcelas
                });
            }

            this.valor = this.floor(valorUnitario + diferenca);
            this.valorPrimeiraParcela = this.valor;
        }
    }

    floor(valor) {
        return Math.floor(valor * 100) / 100;
    }

    round(valor) {
        return Math.round(valor * 100) / 100;
    }

    recalcularParcelas(event) {
        this.parcelas = [];
        this.saved = false;

        let input = this.floor(event.target.value);
        
        let resto = this.round(this.totalPedido - input);
        this.valorDemaisParcelas = this.floor(resto / (this.numeroParcelas - 1));
        let valorParcial = (this.valorDemaisParcelas * (this.numeroParcelas - 1)) + input;

        for (var n = 2; n <= this.numeroParcelas; n++) {
            this.parcelas.push({
                "numero": n,
                "valor": this.valorDemaisParcelas
            });
        }
        let diferenca = this.totalPedido - valorParcial;
        this.valorPrimeiraParcela = this.round(input + diferenca);
    }

    handleClick() {
        
        if(!Boolean(this.valorPrimeiraParcela) || this.valorPrimeiraParcela == 0){
            this.parcelas = [];
            this.calcularParcelas();

            this.showToast('Atenção!', 'O valor da primeira parcela deve ser diferente de zero!', true);
        } else if(this.valorDemaisParcelas == 0){
            this.parcelas = [];
            let resto = this.round(0.01 * (this.numeroParcelas - 1));
            this.valorPrimeiraParcela = this.floor(this.totalPedido - resto);

            for (var n = 2; n <= this.numeroParcelas; n++) {
                this.parcelas.push({
                    "numero": n,
                    "valor": 0.01
                });
            }

            this.showToast('Atenção!', 'O valor de todas as parcelas deve ser diferente de zero!', true);
        } else if(this.valorPrimeiraParcela > this.totalPedido){
            
            this.parcelas = [];
            this.calcularParcelas();

            this.showToast('Atenção!', 'O valor da parcela não deve ser maior do que o valor do pedido!', true);
        }

        this.saved = true;
        this.valor = this.valorPrimeiraParcela;
        
        this.template.querySelector('lightning-input').value = this.valorPrimeiraParcela;
        this.dispatchEvent(new FlowAttributeChangeEvent(this.valor.toString()));
    }

    showToast(title, message, isError){
        this.dispatchEvent(new ShowToastEvent({
            title: title,
            message: message,
            variant: isError ? 'error' : 'success',
            mode: 'pester'
        }))
    }
}