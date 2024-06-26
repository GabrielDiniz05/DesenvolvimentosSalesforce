@isTest
public class NovoLeadControllerTest {

	@isTest
	static void buscaDadosReceitaTest(){
		UtilsAPIBody.ResponseReceita receitaResponse;
		Test.setMock(HttpCalloutMock.class, new APIReceitaMock());
		Test.startTest();
		receitaResponse = NovoLeadController.buscaDadosReceita('59548653000152');
		Test.stopTest();
		System.assertNotEquals(null, receitaResponse);
	}

	@isTest
	static void preencheCamposReceitaTest(){
		UtilsAPIBody.ResponseReceita receitaResponse;
		Lead ld = new Lead(
			LastName = 'Lead Teste',
			CNPJ__c = '59548653000152'
		);
			
		Test.setMock(HttpCalloutMock.class, new APIReceitaMock());
		Test.startTest();
		receitaResponse = NovoLeadController.buscaDadosReceita(ld.CNPJ__c);
		NovoLeadController.preencheCamposReceita(ld, receitaResponse);
		Test.stopTest();
		System.assertNotEquals(null, ld.CNAEPrincipal__c);
		System.assertEquals(receitaResponse.CNAE, ld.CNAEPrincipal__c);
	}

	@isTest
	static void buscaDadosSintegraTest(){
		UtilsAPIBody.ResponseSintegra sintegraResponse;
		
		Test.setMock(HttpCalloutMock.class, new APISintegraMock());
		Test.startTest();
		sintegraResponse = NovoLeadController.buscaDadosSintegra('59548653000152', 'SP');
		Test.stopTest();

		System.assertNotEquals(null, sintegraResponse);
		System.assertNotEquals(null, sintegraResponse.InscricaoEstadual);
	}

	@isTest
	static void callFastTrackTestSuccess1(){
		Lead ld = new Lead(
			LastName = 'Lead Teste',
			CNPJ__c = '59548653000152'
		);
			
		Test.setMock(HttpCalloutMock.class, new APIReceitaMock());
		Test.startTest();
		ld = NovoLeadController.callFastTrack(ld);
		Test.stopTest();

		ld = [SELECT Id, Name, LastName, CNPJ__c, CNAEPrincipal__c FROM Lead WHERE Id = :ld.Id];

		System.assertNotEquals(null, ld.Id);
		System.assertNotEquals(null, ld.CNAEPrincipal__c);
	}

	@isTest
	static void callFastTrackTestSuccess2(){
		Lead ld = new Lead(
			LastName = 'Lead Teste',
			CNPJ__c = null
		);
			
		Test.setMock(HttpCalloutMock.class, new APIReceitaMock());
		Test.startTest();
		ld = NovoLeadController.callFastTrack(ld);
		Test.stopTest();

		ld = [SELECT Id, Name, LastName, CNPJ__c, CNAEPrincipal__c FROM Lead WHERE Id = :ld.Id];

		System.assertNotEquals(null, ld.Id);
		System.assertEquals(null, ld.CNAEPrincipal__c);
	}

	@isTest
	static void callFastTrackTestError(){
		Lead ld = null;
			
		Test.setMock(HttpCalloutMock.class, new APIReceitaMock());
		Test.startTest();
		try{
			ld = NovoLeadController.callFastTrack(ld);
			System.assert(false, 'Este assert não deveria ser executado');
		} catch(Exception eX){
			System.assertEquals('System.AuraHandledException', eX.getTypeName());
		}
		Test.stopTest();
	}
}