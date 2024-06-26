public with sharing class NovaContaController {
	@TestVisible private static final String VAR_ACC_NULL = 'Aconteceu algum erro na transmissão dos dados. Dados nulos.';
	@TestVisible private static final String ERR_INTEGRACAO_RECEITA = 'Erro ao buscar dados na Receita';
	@TestVisible private static final String ERR_INTEGRACAO_SINTEGRA = 'Erro ao buscar dados da Inscrição Estadual';
	@AuraEnabled public final String RT_PESSOA_JURIDICA = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('PessoaJuridica').getRecordTypeId();
	@AuraEnabled public final String RT_CONTA_PESSOAL = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('PersonAccount').getRecordTypeId();


	@AuraEnabled
	public static String getRTPessoaJuridica(){
		return Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('PessoaJuridica').getRecordTypeId();
	}

	@AuraEnabled
	public static String getRTContaPessoal(){
		return Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('PersonAccount').getRecordTypeId();
	}

	@TestVisible
	private static StaticResource resource{
		get{
			if(resource == null){
				resource = [
					SELECT 	Id, Body
					FROM 	StaticResource
					WHERE	Name = 'CNAERevenda'
					LIMIT 	1
				];
			}

			return resource;
		}
		set;
	} 

    @AuraEnabled
	public static Account callFastTrack(Account acc){
		UtilsAPIBody.ResponseReceita receitaResponse;
		UtilsAPIBody.ResponseSintegra sintegraResponse;
		system.debug('Antes de passar pelo IF');

		if(acc == null){
			throw new AuraHandledException(VAR_ACC_NULL);
		}

		system.debug('Passou pelo IF');

		if(String.isNotBlank(acc.CNPJ__c)){
			receitaResponse = buscaDadosReceita(Utils.replaceClean(acc.CNPJ__c));
            System.debug(receitaResponse);
            if(receitaResponse.SituacaoCadastral == 'CNPJ INVÁLIDO'){
				throw new AuraHandledException('O campo do CNPJ é inválido');
			} else if(receitaResponse.SituacaoCadastral != 'ATIVA'){
				throw new AuraHandledException('Não é possível cadastrar este CNPJ pois o mesmo não possui situação ativa na Receita');
            } else {
                preencheCamposReceita(acc, receitaResponse);
    
                if(String.isNotBlank(acc.BillingState)){
                    sintegraResponse = buscaDadosSintegra(Utils.replaceClean(acc.CNPJ__c), acc.BillingState);
                    acc.InscricaoEstadual__c = Utils.isValueBlank(sintegraResponse.InscricaoEstadual) ? 'ISENTO' : sintegraResponse.InscricaoEstadual;
                }
            }
            
            
		}
        
        try {
            insert acc;
			System.enqueueJob(new QueueableClientesERPPost(new List<Account>{acc}));

        } catch (Exception e) {
			if(e.getMessage().contains('DUPLICATES_DETECTED')){
				throw new AuraHandledException('Ocorreu um erro: CNPJ já cadastrado.');
			}else{
				throw new AuraHandledException('Ocorreu um erro ao inserir a conta. Informe o erro ao admnistrador: ' + e.getTypeName());
			}
        }
		return acc;
	}

	@TestVisible
	private static UtilsAPIBody.ResponseReceita buscaDadosReceita(String cnpj){
		UtilsAPIBody.ResponseReceita receitaResponse;
		try {
			receitaResponse = IntegracaoFastTrack.sendRequestReceita(cnpj);
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}

		if(receitaResponse.Sucesso == false){
			throw new AuraHandledException(ERR_INTEGRACAO_RECEITA);
		}

		return receitaResponse;
	}

	@TestVisible
	private static UtilsAPIBody.ResponseSintegra buscaDadosSintegra(String cnpj, String estado){
		UtilsAPIBody.ResponseSintegra sintegraResponse;
		try {
			sintegraResponse = IntegracaoFastTrack.sendRequestSintegra(cnpj, estado);
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}

		if(sintegraResponse.Sucesso == false){
			throw new AuraHandledException(ERR_INTEGRACAO_SINTEGRA);
		}

		return sintegraResponse;
	}

	@TestVisible
	private static void preencheCamposReceita(Account acc, UtilsAPIBody.ResponseReceita receitaResponse){

        acc.Name            = receitaResponse.RazaoSocial;
        acc.NomeFantasia__c = receitaResponse.NomeFantasia;

        // TODO - Fazer De-Para dos valores que vêm na API com os valores do campo picklist
        acc.Situacao__c     = 'Ativo';
        
        List<String> dataArray = receitaResponse.DataAbertura?.split('/');
        acc.DataAbertura__c =       dataArray?.isEmpty() ?
                                    Date.newInstance(
                                        Integer.valueOf(dataArray[2]), 
                                        Integer.valueOf(dataArray[1]), 
                                        Integer.valueOf(dataArray[0])
                                    ) : null;

        acc.BillingStreet          = receitaResponse.Logradouro;
        acc.BillingPostalCode      = receitaResponse.Cep;
        acc.BillingCity            = receitaResponse.Cidade;
        acc.BillingState           = receitaResponse.Estado;
        acc.BillingCountry         = 'BRA';
        acc.BairroCobranca__c      = receitaResponse.Bairro;
        acc.NumeroCobranca__c      = receitaResponse.Numero;
        acc.ComplementoCobranca__c = receitaResponse.Complemento;

        acc.ShippingStreet        = receitaResponse.Logradouro;
        acc.ShippingPostalCode    = receitaResponse.Cep;
        acc.ShippingCity          = receitaResponse.Cidade;
        acc.ShippingState         = receitaResponse.Estado;
        acc.ShippingCountry       = 'BRA';
        acc.BairroEntrega__c      = receitaResponse.Bairro;
        acc.NumeroEntrega__c      = receitaResponse.Numero;
        acc.ComplementoEntrega__c = receitaResponse.Complemento;

        //  TODO: aguardando definição sobre dados serem lista ou objeto
        // acc.TipoDeRelacao__c = 
        // acc.Categoria__c = 
        // acc.Industry = 
        // acc.LeadSource = 
        // acc.RamoDeAtividade__c = 
        
        acc.Porte__c                   = receitaResponse.Porte;
        acc.CapitalSocial__c           = receitaResponse.CapitalSocial;
        acc.DataSituacaoCadastral__c   = receitaResponse.DataSituacaoCadastral;
        acc.MotivoSituacaoCadastral__c = receitaResponse.MotivoSituacaoCadastral;
        acc.SituacaoEspecial__c        = receitaResponse.SituacaoEspecial;
        acc.DataSituacaoEspecial__c    = receitaResponse.DataSituacaoEspecial;
        acc.Matriz__c                  = receitaResponse.Matriz;
        acc.NaturezaJuridica__c        = receitaResponse.NaturezaJuridica;
        acc.EFR__c                     = receitaResponse.EFR;
        
		preencheQSA(acc, receitaResponse);
		preencheCNAE(acc, receitaResponse);
        
        acc.ProntoParaEnvioERP__c = true;
		acc.ReprocessarFastTrack__c = false;
		acc.ErroFastTrack__c = false;
		acc.MensagemErroFastTrack__c = null;
		acc.SucessoFastTrack__c = true;
	}

	@TestVisible
	private static void preencheQSA(Account acc, UtilsAPIBody.ResponseReceita receitaResponse){
		acc.QSA__c = '';
		for(String qsaItem : receitaResponse.LstQSA){
			acc.QSA__c += qsaItem + '\n';
		}
		acc.QSA__c = acc.QSA__c?.removeEnd('\n');
	}
	
	@TestVisible
	private static void preencheCNAE(Account acc, UtilsAPIBody.ResponseReceita receitaResponse){
		List<String> cnaeRevendaList = resource.body.toString().split(';');

		acc.CNAE__c = receitaResponse.CNAE;
		acc.Revenda__c = cnaeRevendaList?.contains(receitaResponse.CNAE?.split(' - ')[0]);

		acc.CnaeSecundario__c = '';
		for(String cnae : receitaResponse.CNAESecundarios){
			acc.CnaeSecundario__c += cnae + '\n';

			if(acc.Revenda__c == false){
				acc.Revenda__c = cnaeRevendaList?.contains(cnae?.split(' - ')[0]);
			}
		}

		acc.CnaeSecundario__c = acc.CnaeSecundario__c.removeEnd('\n');
	}
}