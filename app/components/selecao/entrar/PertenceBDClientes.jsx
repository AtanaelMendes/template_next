import Iframe from "@/components/Layouts/Iframe";

const PertenceBDClientes = ({ active, reload, cdPessoaCandidato, cdUsuarioAnalista }) => {
    let urlParams = {
        'chamada_novo_saas': 1,
        'cd_pessoa': cdPessoaCandidato,
        'user': cdUsuarioAnalista
    };

    if (!active) return null;

    return (
        <div className={`col-span-12 mt-12 h-[550px] relative`}>
            <Iframe
                src={`rhbsaas/selecao/informacoes_bd_clientes.php`}
                id={'pertence_bd_clientes_iframe'}
                title={"Pertence BD Clientes"}
                params={urlParams}
                visible={active}
                active={active}
            />
        </div>
    );
}

export default PertenceBDClientes;