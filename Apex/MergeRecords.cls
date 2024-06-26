/**
 * @description  : Classe contendo a lógica para  fazer o merge dos contatos duplicados
 * @jira         : https://jfoxagil.atlassian.net/browse/SND-63
 * @author       : Gabriel Diniz, Jéssica Lima
**/
public class MergeRecords {

	public class EntradaFlow{
		@InvocableVariable(label = 'ID do conjunto de registros duplicados')
		public Id DuplicateRecordSetId;
	}

	/**
	* @description 
	* @author	Hugo Mendes | 2023-12-15 
	* @param	Lista criada no flow que converte o lead com IDs de DuplicateRecordSet. 
	**/
	@InvocableMethod(label='Merge Contatos Duplicados' description='Merge dos contatos duplicados')
	public static void mergeContacts(List<EntradaFlow> entradas){
		Set<Id> duplicateRecordSet = new Set<Id>();
		List<DuplicateRecordItem> contatosDuplicados;
		Map<Id, List<DuplicateRecordItem>> contatosDuplicadosAgrupados;

		// Obtém o ID do registros de DuplicateRecordSet
		for(EntradaFlow edf : entradas){
			duplicateRecordSet.add(edf.DuplicateRecordSetId);
		}
		
		/**
		 * Encontro os registros duplicados entre si e cria um map lógico que agrupa os registros
		 * do mesmo conjunto
		*/
		contatosDuplicados = getContatosDuplicados(duplicateRecordSet);
		contatosDuplicadosAgrupados = getContatosDuplicadosAgrupadosBySetId(contatosDuplicados);
		
		/**
		 * Faz o merge para cada conjunto.
		 * O Map foi construído de forma que o primeiro elemento de cada conjunto é o mestre
		 * e os restantes são os elementos que sofrerão a mesclagem
		 */
		for(Id grupoContatoDuplicadoId : contatosDuplicadosAgrupados.keySet()){
			List<DuplicateRecordItem> contatosDuplicadosTemp = contatosDuplicadosAgrupados.get(grupoContatoDuplicadoId);
			Contact mestre = new Contact(
				Id = contatosDuplicadosTemp.get(0).RecordId
			);
			
			for(Integer i = 1; i < contatosDuplicadosTemp.size(); i++){
				DuplicateRecordItem contatoDuplicadoItem = contatosDuplicadosTemp.get(i);
				Contact duplicado = new Contact(
					Id = contatoDuplicadoItem.RecordId
				);

				merge mestre duplicado;
			}
		}
	}

	/**
	* @description 
	* @author 	Hugo Mendes | 2023-12-15 
	* @param	Set de IDs de DuplicateRecordSet. Lista criada no flow que converte o lead
	* @return	Lista de itens duplicados
	**/
	@TestVisible
	private static List<DuplicateRecordItem> getContatosDuplicados(Set<Id> duplicateRecordSet){
		List<DuplicateRecordItem> contatosDuplicados;

		try{
			contatosDuplicados = [
				SELECT Id, DuplicateRecordSetId, RecordId
				FROM DuplicateRecordItem 
				WHERE DuplicateRecordSetId IN :duplicateRecordSet
				ORDER BY DuplicateRecordSetId, DuplicateRecordItem.CreatedDate DESC
			];
		}catch(QueryException qE){
			qE.setMessage('Erro ao buscar registros de contatos duplicados.' + qE.getMessage());
			throw qE;
		}
		
		return contatosDuplicados;
	}

	/**
	* @description 
	* @author	Hugo Mendes | 2023-12-15 
	* @param	Lista de DuplicateRecordItem para ser ordenada e mapeada a partir do campo DuplicateRecordSetId
	* @return	Map a partir do campo DuplicateRecordSetId
	**/
	@testVisible
	private static Map<Id, List<DuplicateRecordItem>> getContatosDuplicadosAgrupadosBySetId(List<DuplicateRecordItem> contatosDuplicados){
		Map<Id, List<DuplicateRecordItem>> contatosDuplicadosAgrupados = new Map <Id, List<DuplicateRecordItem>>();

		for(DuplicateRecordItem duplicado: contatosDuplicados){
			if(contatosDuplicadosAgrupados.containsKey(duplicado.DuplicateRecordSetId)){
				contatosDuplicadosAgrupados.get(duplicado.DuplicateRecordSetId).add(duplicado);
			}
			else{
				contatosDuplicadosAgrupados.put(duplicado.DuplicateRecordSetId, new List<DuplicateRecordItem>{duplicado});
			}
		}
		
		return contatosDuplicadosAgrupados;
	}
}