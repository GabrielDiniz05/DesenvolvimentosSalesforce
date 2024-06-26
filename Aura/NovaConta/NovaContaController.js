({
    doInit: function(component, event, helper) {
         
        var recordTypeId = component.get("v.pageReference").state.recordTypeId;
        component.set("v.selectedRecordId", recordTypeId);
        
        let functionRTPessoaJuridica = component.get('c.getRTPessoaJuridica');
        functionRTPessoaJuridica.setCallback(this, function(response){
            component.set('v.pessoa_juridica', response.getReturnValue());
            component.set('v.abrir_tela', recordTypeId == response.getReturnValue());
        });
        $A.enqueueAction(functionRTPessoaJuridica);
    },
    
	handleSubmit : function(cmp, event, helper) {
		// stop the form from submitting
		event.preventDefault();
		let account = {};

		var recordTypeId = cmp.get("v.pageReference").state.recordTypeId;
		console.log(recordTypeId);

		const fields = event.getParam('fields');
        
		let fastTrack = cmp.get('c.callFastTrack');
        fastTrack.setParams({acc : fields, recordType : recordTypeId});
        fastTrack.setCallback(this, function(response){
            let state = response.getState();
			let serverReturn = response.getReturnValue();

            if(state === 'SUCCESS'){
                
                console.log('SUCESSO');
                
				account = serverReturn;
                
				// Remove o spinner
				cmp.set('v.calling_fasttrack', false);

				console.log('account > ' + JSON.stringify(account));

				// Mensagem de sucesso
				// let accountName = ($A.util.isUndefinedOrNull(account.FirstName) ? '' : account.FirstName) + ' ' + account.LastName;
				let accountName;
				if(account.CNPJ__c != null){
					accountName = account.Name;
				} else {
					accountName = account.FirstName + ' ' + account.LastName;	
				}
				accountName = accountName.trim();
				const accountNameMsg = "Conta " + accountName + " foi criada.";
				
				let toastEventSuccess = $A.get("e.force:showToast");
				toastEventSuccess.setParams({
					type: "success",
					mode: "dismissible",
					message: accountNameMsg,
					messageTemplate: 'Conta {0} foi criada.',
					messageTemplateData: [{
						url: '/' + account.Id,
						label: accountName,
					}]
				});
				toastEventSuccess.fire();

				// Navega para o registro criado
				let navEvt = $A.get("e.force:navigateToSObject");
				navEvt.setParams({
					"recordId": account.Id,
					"slideDevName": "detail"
				});
				navEvt.fire();
			}else{
                console.log('ERRO');
                
                let errorMessage;
                let errors = response.getError();
				if (errors) {
					if (errors[0] && errors[0].message) {
						console.error("Error message: " + 
								 errors[0].message);
                        errorMessage = errors[0].message;
					}
				} else {
					console.log("Unknown error");
				}
                
				cmp.set('v.calling_fasttrack', false);
				
                let toastEventError = $A.get("e.force:showToast");
                toastEventError.setParams({
                    type: "error",
                    mode: "sticky",
                    message: errorMessage
                });
                toastEventError.fire();
			}
			cmp.set('v.calling_fasttrack', false);
		});
		
		if(fields.CNPJ__c){
			let toastEventInfo = $A.get("e.force:showToast");
			toastEventInfo.setParams({
				type: "other",
				mode: "dismissible",
				message: 'Buscando informações a partir do CNPJ e salvando o registro'
			});
			toastEventInfo.fire();
        } else {
            let toastEventInfo = $A.get("e.force:showToast");
			toastEventInfo.setParams({
				type: "other",
				mode: "dismissible",
				message: 'Criando a conta'
			});
			toastEventInfo.fire();
        }
		cmp.set('v.calling_fasttrack', true);
        $A.enqueueAction(fastTrack);
	},

	handleCancel : function(cmp, event, helper){
		var urlEvent = $A.get("e.force:navigateToURL");
		urlEvent.setParams({
			"url":"/lightning/o/Account/list?filterName=Recent"
		});
		urlEvent.fire();
	}
})