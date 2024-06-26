({
	handleSubmit : function(cmp, event, helper) {
		// stop the form from submitting
		event.preventDefault();
		let lead = {};

		var allValid = false;

		let phone = cmp.find('phone');
		let value1 = phone.get('v.value');

		if(value1.toString().length == 14 || value1.toString().length == 15){
			allValid = true;
		}else{
			allValid = false;
		}

		let email = cmp.find('email');
		let value2 = email.get('v.value');

		let cargo = cmp.find('cargo');
		let value3 = cargo.get('v.value');

		let cpf = cmp.find('cpf');
		let value4 = cpf.get('v.value');

		let cnpj = cmp.find('cnpj');
		let value5 = cnpj.get('v.value');


		let aux = event.getParam('fields');

		aux.Phone = value1.toString();
		aux.Email = value2.toString();
		aux.Cargo__c = value3.toString();
		aux.CPF__c = value4.toString();
		aux.CNPJ__c = value5.toString();
		
		const fields = aux;

		if (allValid) {
			let fastTrack = cmp.get('c.callFastTrack');
			fastTrack.setParams({ld : fields});
			fastTrack.setCallback(this, function(response){
				let state = response.getState();
				let serverReturn = response.getReturnValue();

				if(state === 'SUCCESS'){
					lead = serverReturn;

					// Remove o spinner
					cmp.set('v.calling_fasttrack', false);

					console.log('Lead > ' + JSON.stringify(lead));

					// Mensagem de sucesso
					let leadName = ($A.util.isUndefinedOrNull(lead.FirstName) ? '' : lead.FirstName) + ' ' + lead.LastName;
					leadName = leadName.trim();
					const leadNameMsg = "Lead " + leadName + " foi criado.";
					
					let toastEventSuccess = $A.get("e.force:showToast");
					toastEventSuccess.setParams({
						type: "success",
						mode: "dismissible",
						message: leadNameMsg,
						messageTemplate: 'Lead {0} foi criado.',
						messageTemplateData: [{
							url: '/' + lead.Id,
							label: leadName,
						}]
					});
					toastEventSuccess.fire();

					// Navega para o registro criado
					let navEvt = $A.get("e.force:navigateToSObject");
					navEvt.setParams({
						"recordId": lead.Id,
						"slideDevName": "detail"
					});
					navEvt.fire();
				}else {		
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
			}
			cmp.set('v.calling_fasttrack', true);
			$A.enqueueAction(fastTrack);
		}else{
			let toastEventError = $A.get("e.force:showToast");
			toastEventError.setParams({
				type: "error",
				mode: "sticky",
				message: "Telefone inválido. Favor preencher corretamente."
			});
			toastEventError.fire();
		}
	},

	handleCancel : function(cmp, event, helper){
		var urlEvent = $A.get("e.force:navigateToURL");
		urlEvent.setParams({
			"url": "/lightning/o/Lead/list?filterName=Recent"
		});	
		urlEvent.fire();
	},

	handlePhoneMask : function(cmp, event, helper){
		var x = event.target.value;
		x = x.replace(/\D/g,"")
		if(x.length > 2){
			x = x.replace(/(.{2})/,"($1) ")
		}
		x = x.replace(/(.{4})/,"$1")
		if(x.length == 10) {
			x = x.replace(/(.{1})$/,"-$1")
		}else if(x.length == 11) {
			x = x.replace(/(.{2})$/,"-$1")
		}else if(x.length == 12) {
			x = x.replace(/(.{3})$/,"-$1")
		}else if(x.length >= 13) {
			x = x.replace(/(.{4})$/,"-$1")
		}
		event.target.value = x;
	}
})