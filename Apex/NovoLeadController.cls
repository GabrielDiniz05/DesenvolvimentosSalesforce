public without sharing class NovoLeadController {
	@TestVisible private static final String VAR_LEAD_NULL = 'Aconteceu algum erro na transmissão dos dados. Dados nulos.';
	@TestVisible private static final String ERR_INTEGRACAO_RECEITA = 'Erro ao buscar dados na Receita';
	@TestVisible private static final String ERR_INTEGRACAO_SINTEGRA = 'Erro ao buscar dados da Inscrição Estadual';

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
	public static Lead callFastTrack(Lead ld){
		UtilsAPIBody.ResponseReceita receitaResponse;
		UtilsAPIBody.ResponseSintegra sintegraResponse;
		system.debug('Antes de passar pelo IF');

		if(ld == null){
			throw new AuraHandledException(VAR_LEAD_NULL);
		}

		system.debug('Passou pelo IF');

		if(String.isNotBlank(ld.CNPJ__c)){
			receitaResponse = buscaDadosReceita(ld.CNPJ__c);
            System.debug(receitaResponse);
			if(receitaResponse.SituacaoCadastral == 'CNPJ INVÁLIDO'){
				throw new AuraHandledException('O CNPJ informado não é válido');
			} else if(receitaResponse.SituacaoCadastral != 'ATIVA'){
				throw new AuraHandledException('Não é possível cadastrar este CNPJ pois o mesmo não possui situação ativa na Receita');
            } else {
                preencheCamposReceita(ld, receitaResponse);
    
                if(String.isNotBlank(ld.State)){
                    sintegraResponse = buscaDadosSintegra(ld.CNPJ__c, ld.State);
                    ld.InscricaoEstadual__c = Utils.isValueBlank(sintegraResponse.InscricaoEstadual) ? 'ISENTO' : sintegraResponse.InscricaoEstadual;
                }

				ld.SucessoFastTrack__c = true;
            }            
		}
        
		String VALIDAR_CPF = 'ValidarCPF';

        try {
            insert ld;
        } catch (Exception e) {
			if (e.getMessage().containsIgnoreCase(VALIDAR_CPF)) {
            	throw new AuraHandledException('O CPF informado não é válido.');
			} else {
				throw new AuraHandledException(e.getMessage());
			}
        }

		return ld;
	}

	@TestVisible
	private static UtilsAPIBody.ResponseReceita buscaDadosReceita(String cnpj){
		UtilsAPIBody.ResponseReceita receitaResponse;
		try {
			receitaResponse = IntegracaoFastTrack.sendRequestReceita(cnpj);
		} catch (Exception e) {
			if(e.getMessage().contains('Read Timed Out') || e.getMessage().contains('ReadTimedOut')){
				throw new AuraHandledException('Ocorreu um erro de comunicação com a Receita, tente novamente mais tarde.');
			}else{
				throw new AuraHandledException('Ocorreu um erro de comunicação com a Receita, entre em contato com o administrador.');
			}
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
			if(e.getMessage().contains('Read Timed Out') || e.getMessage().contains('ReadTimedOut')){
				throw new AuraHandledException('Ocorreu um erro de comunicação com a Sintegra, tente novamente mais tarde.');
			}else{
				throw new AuraHandledException('Ocorreu um erro de comunicação com a Sintegra, entre em contato com o administrador.');
			}
		}

		if(sintegraResponse.Sucesso == false){
			throw new AuraHandledException(ERR_INTEGRACAO_SINTEGRA);
		}

		return sintegraResponse;
	}

	@TestVisible
	private static void preencheCamposReceita(Lead ld, UtilsAPIBody.ResponseReceita receitaResponse){
		ld.NomeFantasia__c = receitaResponse.NomeFantasia;
		ld.Company         = receitaResponse.RazaoSocial;

        ld.Situacao__c	   = 'Ativo';
		
		List<String> dataArray = receitaResponse.DataAbertura?.split('/');
		ld.DataDeAbertura__c =
			dataArray?.isEmpty() == false ?
				Date.newInstance(
					Integer.valueOf(dataArray[2]), 
					Integer.valueOf(dataArray[1]), 
					Integer.valueOf(dataArray[0])
				) : null;

		ld.Street         = receitaResponse.Logradouro;
		ld.PostalCode     = receitaResponse.Cep;
		ld.City           = receitaResponse.Cidade;
		ld.State          = receitaResponse.Estado;
		ld.Country        = 'BRA';
		ld.Bairro__c      = receitaResponse.Bairro;
		ld.Numero__c      = receitaResponse.Numero;
		ld.Complemento__c = receitaResponse.Complemento;		
		ld.Porte__c                   = receitaResponse.Porte;
		ld.CapitalSocial__c           = receitaResponse.CapitalSocial;
		ld.DataSituacaoCadastral__c   = receitaResponse.DataSituacaoCadastral;
		ld.MotivoSituacaoCadastral__c = receitaResponse.MotivoSituacaoCadastral;
		ld.SituacaoEspecial__c        = receitaResponse.SituacaoEspecial;
		ld.DataSituacaoEspecial__c    = receitaResponse.DataSituacaoEspecial;
		ld.Matriz__c                  = receitaResponse.Matriz;
		ld.NaturezaJuridica__c        = receitaResponse.NaturezaJuridica;
		ld.EFR__c                     = receitaResponse.EFR;

		preencheQSA(ld, receitaResponse);
		preencheCNAE(ld, receitaResponse);
	}

	@TestVisible
	private static void preencheQSA(Lead ld, UtilsAPIBody.ResponseReceita receitaResponse){
		ld.QSA__c = '';
		for(String qsaItem : receitaResponse.LstQSA){
			ld.QSA__c += qsaItem + '\n';
		}
		ld.QSA__c = ld.QSA__c?.removeEnd('\n');
	}
	
	@TestVisible
	private static void preencheCNAE(Lead ld, UtilsAPIBody.ResponseReceita receitaResponse){
		List<String> cnaeRevendaList = resource.body.toString().split(';');

		ld.CNAEPrincipal__c = receitaResponse.CNAE;
		ld.Revenda__c = cnaeRevendaList?.contains(receitaResponse.CNAE?.split(' - ')[0]);

		ld.CNAEsSecundarios__c = '';
		for(String cnae : receitaResponse.CNAESecundarios){
			ld.CNAEsSecundarios__c += cnae + '\n';

			if(ld.Revenda__c == false){
				ld.Revenda__c = cnaeRevendaList?.contains(cnae?.split(' - ')[0]);
			}
		}

		ld.CNAEsSecundarios__c = ld.CNAEsSecundarios__c.removeEnd('\n');
	}
}