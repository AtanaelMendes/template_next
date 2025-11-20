import TableAgendaCandidato from "./tables/TableAgendaCandidato";

const AgendamentosCandidato = ({ active, reload, cdPessoaCandidato, nmCandidato }) => {

    return (
        <div className={`col-span-12 m-2 mt-14 relative`}>
            <TableAgendaCandidato active={active} reload={reload} cdPessoaCandidato={cdPessoaCandidato} nmCandidato={nmCandidato} />
        </div>
    );
}

export default AgendamentosCandidato;