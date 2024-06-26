/**
 * @description  : Classe contendo a lógica para a conversão automática de Leads
 * @jira         : https://jfoxagil.atlassian.net/browse/SND-63
 * @author       : Gabriel Diniz, Jéssica Lima
**/
public class LeadConversion {
	
	public class entradaFlow{
		@InvocableVariable(label = 'id do lead')
		public Id recordId;
	}

	public class FlowOutput{
		@InvocableVariable public String convertedContactId;

		public FlowOutput(Id convertedContactId) {
			this.convertedContactId = convertedContactId;
		}
	}
	
	@InvocableMethod(label='converterLead' description='Método para converter o Lead')
	public static FlowOutput[] convertLead(List<entradaFlow> entradas){
		
		Set<Id> ids = new Set<Id>();
		
		for(entradaFlow edf : entradas){
			ids.add(edf.recordId);
		}
		
		List<Lead> leads = getLeadsToConvert(ids);

		Id existingAccID;
		Id existingContactID;
		Set<String> chaveFromLead; //CNPJ OU CPF
		Map<String, Id> accountIdMapByChavePessoa;
		Map<String, Contact> contactIdMapByChavePessoa;
		Database.LeadConvert dbLeadConvert;
		List<Database.LeadConvert> dbLeadConvertList;
		FlowOutput[] contactListId = new List<FlowOutput>();
		
		chaveFromLead = getChaveLead(leads);
		accountIdMapByChavePessoa = getExistingAccounts(leads, chaveFromLead);
		contactIdMapByChavePessoa = getExistingContacts(leads, chaveFromLead);
		
		dbLeadConvertList = new List<Database.LeadConvert>();
		for(Lead ld : leads){
			dbLeadConvert = new Database.LeadConvert();
			
			dbLeadConvert.setLeadId(ld.Id);
			dbLeadConvert.setOwnerId(UserInfo.getUserId());
			dbLeadConvert.setDoNotCreateOpportunity(true);
			dbLeadConvert.setConvertedStatus('Convertido');
						
			if(String.isNotBlank(ld.CNPJ__c)){
				existingAccID = accountIdMapByChavePessoa.get(getOnlyNumbers(ld.CNPJ__c));
			}
			else if(String.isNotBlank(ld.CPF__c)){
				existingAccID = accountIdMapByChavePessoa.get(getOnlyNumbers(ld.CPF__c));
			}
			
			if(String.isNotBlank(existingAccID)){
				dbLeadConvert.setAccountId(existingAccID);
				Contact existingContact = contactIdMapByChavePessoa.get(getOnlyNumbers(ld.CPF__c));
				
				if(existingContact != null){
					if(existingContact.AccountId == existingAccID){
						existingContactID = existingContact.Id;
					}
				}
			}
			

			// Tratar essa atribuição
			if(String.isNotBlank(existingContactID)){
				dbLeadConvert.setContactId(existingContactID);
			}
			
			dbLeadConvertList.add(dbLeadConvert);
		}

		Database.LeadConvertResult[] lcResults = Database.convertLead(dbLeadConvertList);
		for(Database.LeadConvertResult leadConvertido : lcResults){
			contactListId.add(new FlowOutput(leadConvertido.getContactId()));
		}

		return contactListId;
	}

	@TestVisible
	private static List<Lead> getLeadsToConvert(Set<Id> ids){
		List<Lead> leads = new List<Lead>();
		
		try{
			leads = [
				SELECT id, CPF__c, CNPJ__c, Status, LeadSource 
				from Lead 
				Where id IN: ids
			];
		}catch(QueryException qE){
			qE.setMessage('Erro ao buscar os registros de lead para converter.' + qE.getMessage());
			throw qE;
		}
		return leads;
	}
	
	@TestVisible
	private static Map<String, Id> getExistingAccounts(List<Lead> leads, Set<String> chaveFromLead){
		Map<String, Id> accountIdMapByChave = new Map<String, Id>();
		List<Account> accountList;
		
		try{
			accountList = [
				SELECT Id, CNPJ__c, CPF__pc
				FROM Account
				WHERE (CNPJ__c IN :chaveFromLead OR CPF__pc IN :chaveFromLead)
			];
		}catch(QueryException qE){
			qE.setMessage('Erro ao buscar registros existentes para o lead convertido.' + qE.getMessage());
			throw qE;
		}
		
		for(Account acc : accountList){
			String chave = String.isNotBlank(acc.CPF__pc) ? acc.CPF__pc : acc.CNPJ__c;
			accountIdMapByChave.put(getOnlyNumbers(chave), acc.Id);
		}
		
		return accountIdMapByChave;
	}
	
	@TestVisible
	private static Map<String, Contact> getExistingContacts(List<Lead> leads, Set<String> chaveFromLead){
		Map<String, Contact> contactIdMapByChave = new Map<String, Contact>();
		List<Contact> contactList;
		
		try{
			contactList = [
				SELECT Id, CPF__c, AccountId
				FROM Contact
				WHERE CPF__c IN :chaveFromLead
				ORDER BY CreatedDate
			];
		}catch(QueryException qE){
			qE.setMessage('Erro ao buscar registros existentes para o lead convertido.' + qE.getMessage());
			throw qE;
		}
		
		for(Contact cont : contactList){
			contactIdMapByChave.put(getOnlyNumbers(cont.CPF__c), cont);
		}
		
		return contactIdMapByChave;
	}
	
	@TestVisible
	private static Set<String> getChaveLead(List<Lead> leads){
		Set<String> chaveFromLead = new Set<String>();
		
		for(Lead ld : leads){
			if(String.isNotBlank(ld.CPF__c)){
				chaveFromLead.add(ld.CPF__c);
				chaveFromLead.add(getOnlyNumbers(ld.CPF__c));
			}
			if(String.isNotBlank(ld.CNPJ__c)){
				chaveFromLead.add(ld.CNPJ__c);
				chaveFromLead.add(getOnlyNumbers(ld.CNPJ__c));
			}
		}
		
		return chaveFromLead;
	}

	@TestVisible
	private static String getOnlyNumbers(String fieldValue){
		return fieldValue = fieldValue?.replaceAll('[^0-9]', '')?.trim();
	}
}