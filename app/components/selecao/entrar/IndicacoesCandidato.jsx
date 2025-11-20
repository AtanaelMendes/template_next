import TableIndicacoesCandidato from "@/components/selecao/entrar/tables/TableIndicacoesCandidato";

const IndicacoesCandidato = ({ active, reload, cdPessoaCandidato, nmCandidato }) => {

    if (!active) return null;
    
    return (
        <div className={`col-span-12 m-2 mt-12 h-[550px] relative`}>
            {active && (<TableIndicacoesCandidato cdPessoaCandidato={cdPessoaCandidato} nmCandidato={nmCandidato} reload={reload} />)}
        </div>
    );
}

export default IndicacoesCandidato;