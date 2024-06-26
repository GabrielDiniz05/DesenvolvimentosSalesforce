@isTest
public class MergeRecordsTest {

	@TestSetup
	static void makeData(){
		Contact contact1 = new Contact(LastName = 'test', Email = 'test@example.com', CPF__c = '12552112397');
		Contact contact2 = new Contact(LastName = 'test', Email = 'test@example.com', CPF__c = contact1.CPF__c);
		List<Contact> contatos = new List<Contact>{contact1, contact2};
		insert contatos;

		DuplicateRule dupRuleRecord = [SELECT Id FROM DuplicateRule WHERE DeveloperName = 'RegraContatoDuplicado' LIMIT 1];
		DuplicateRecordSet dupRecordSet = new DuplicateRecordSet(
			DuplicateRuleId = dupRuleRecord.Id
		);
		insert dupRecordSet;

		List<DuplicateRecordItem> contatosDuplicadosManualmente = new List<DuplicateRecordItem>();
		for(Contact contato : contatos){
			contatosDuplicadosManualmente.add(
				new DuplicateRecordItem(
					DuplicateRecordSetId = dupRecordSet.Id,
					RecordId = contato.Id
				)
			);
		}
		insert contatosDuplicadosManualmente;
	}

	@isTest
	public static void mergeContactsTest(){
		DuplicateRecordSet conjuntoRegistroDuplicado = [SELECT Id FROM DuplicateRecordSet LIMIT 1];
		List<Contact> contatosDuplicadosAntesMerge = [SELECT Id FROM Contact WHERE Id IN (SELECT RecordId FROM DuplicateRecordItem WHERE DuplicateRecordSetId = :conjuntoRegistroDuplicado.Id)];
	
		List<MergeRecords.entradaFlow> inputList = new List<MergeRecords.entradaFlow>();
		MergeRecords.entradaFlow entrada1 = new MergeRecords.entradaFlow();
		entrada1.DuplicateRecordSetId = conjuntoRegistroDuplicado.Id;
		inputList.add(entrada1);
	
		Test.startTest();
		MergeRecords.mergeContacts(inputList);
		Test.stopTest();

		List<Contact> contatosDuplicadosDepoisMerge = [SELECT Id FROM Contact WHERE Id IN :contatosDuplicadosAntesMerge];
		System.assertNotEquals(contatosDuplicadosAntesMerge.size(), contatosDuplicadosDepoisMerge.size(), 'Os contatos não sofreram merge');
	}
}