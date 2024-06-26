/**
 * @description  : Classe para testar os métodos da classe LeadConversion
 * @jira         : https://jfoxagil.atlassian.net/browse/SND-63
 * @author       : Josiane Alves, Jéssica Lima
**/
@isTest
public class LeadConversionTest {

   @isTest
    static void testConvertedLeadCPF() {
        
        Lead lead = new Lead();
        lead.FirstName = 'Teste';
        lead.LastName = 'Teste';
        lead.CPF__c = '76152060060';
        lead.LeadSource = 'Outros';
        //lead.Status = 'Novo';
        insert lead;

        lead.Status = 'Convertido';
        update lead;
        
        LeadConversion.entradaFlow inputLead = new LeadConversion.entradaFlow();
        inputLead.recordId = lead.Id;
        
        List<LeadConversion.entradaFlow> inputList = new List<LeadConversion.entradaFlow>();
        inputList.add(inputLead);
        
        LeadConversion.FlowOutput[] result = LeadConversion.convertLead(inputList);
        
        System.assertNotEquals(null, result);
        System.assertNotEquals(0, result.size());
      
	}
    
    @IsTest
    static void GetExistingAccountsTest(){
        
        Account contaTeste = new Account();
        contaTeste.LastName = 'Teste3';
        contaTeste.CNPJ__C = '21455992000111';
        insert contaTeste;
   
        
        Lead lead3 = new Lead();
        lead3.FirstName = 'Teste3';
        lead3.LastName = 'Teste3';
        lead3.CNPJ__c = contaTeste.CNPJ__c;
        lead3.LeadSource = 'Outros';
        lead3.Status = 'Novo';
        insert lead3;

        lead3.Status = 'Convertido';
        update lead3;
        
        LeadConversion.entradaFlow inputLead3 = new LeadConversion.entradaFlow();
        inputLead3.recordId = lead3.Id;
        
        List<LeadConversion.entradaFlow> inputList3 = new List<LeadConversion.entradaFlow>();
        inputList3.add(inputLead3);
        
        LeadConversion.FlowOutput[] result = LeadConversion.convertLead(inputList3);
        
        System.assertNotEquals(null, result);
        System.assertNotEquals(0, result.size());
        
        Set<String> chaveCNPJ = new Set<String>{contaTeste.CNPJ__C};
        List<Lead> leadList = new List<Lead>{lead3};
            
        Map<String, Id> accountIdMap = LeadConversion.getExistingAccounts(leadList,chaveCNPJ);
        

    }
}