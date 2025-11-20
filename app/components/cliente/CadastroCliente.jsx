import Iframe from "../Layouts/Iframe";
const CadastroCliente = ({cdPessoaCliente, cdEmpresa, className}) => {
    return (
        <Iframe active={true} visible={true} className={className || ''} src="rhbsaas/ger_v2/prospects_edit.php" params={{cd: cdPessoaCliente, cd_unid: cdEmpresa, pro:2}} />
    );
}
export default CadastroCliente;