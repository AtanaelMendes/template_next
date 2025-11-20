import PesquisaVagas from "@/pages/selecao/PesquisaVagas";

const VagasCandidatoPCD = ({ active, reload }) => {
    if (!active) return null;

    return (
        <div id="vagas_pcd" className={`col-span-12 m-4 mt-14 h-[570px] relative`}>
            <PesquisaVagas active={active} reload={reload} isPCD={true} setorDefault={'T'} tipoVagasDefault={'M'} />
        </div>
    );
}

export default VagasCandidatoPCD;