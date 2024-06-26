public with sharing class PdfPedidoController {
    @AuraEnabled
    public static Order buscaOrder(Id recordId) {
        System.debug('Order foi chamada');
        System.debug(recordId);

        return [SELECT OrderNumber, Valor_Do_Frete__c, 
        Pedido_Do_Cliente__c, Valor_Da_Comissao__c, ShippingAddress, 
        Condicoes_Do_Frete__c, UsoConsumo__c, Estabelecimento__c, Account.ContatoPrimario__c, Account.ContatoPrimario__r.Name,
        Valor_Despesa__c, Estabelecimento__r.Name, Estabelecimento__r.RazaoSocial__c,
        TotalAmount, Estabelecimento__r.Endereco__c, Estabelecimento__r.Numero__c,
        EffectiveDate, Estabelecimento__r.Complemento__c, Estabelecimento__r.CGCMF__c, Taxa_Financeira__c, Encargo_Financeiro__c,
        Account.Name, Account.CNPJ__c, Conta_Ordem__c, Conta_Ordem__r.Name, Revenda__c, Revenda__r.Name, 
        Tipo_de_Operacao__c, Tipo_de_Operacao__r.Name, Seguir_Com_Pedido__c, Seguir_Com_Pedido__r.OrderNumber, 
        Via_Transportadora__c, Transportadora__c, Transportadora__r.Name, Condicao_de_Pagamento__c, Condicao_de_Pagamento__r.Name FROM Order where id =: recordId ];
    }

    

    @AuraEnabled
    public static List<OrderItem> buscaOrderItem(Id recordId) {
        System.debug('OrderItem foi chamada');
        System.debug(recordId);

        return [SELECT ValorVenda__c, Quantity, TotalPrice, 
        ValorFinalNegociado__c, ValorAjuste__c, ValorComissao__c, 
        ValorDespesaFrete__c, UnitPrice, ICMS__c, ICMSST__c, AliquotaICMS__c, AliquotaIPI__c,
        IPI__c, ISS__c, Cofins__c, PIS__c, Product2.Name, Product2.ProductCode, OrderItemNumber FROM OrderItem where orderId =: recordId ];
    }

    @AuraEnabled
    public static User buscaUser(Id recordId) {
        System.debug('Essa funcao foi chamada');
        System.debug(recordId);
        Id userId = [SELECT OwnerId FROM Order where id =: recordId][0].OwnerId;
        return [SELECT Name, Phone, Email from User where Id =: userId ];
    }

}