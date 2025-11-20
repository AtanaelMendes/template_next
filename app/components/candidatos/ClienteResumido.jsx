import { Caption, Subtitle, Title, Label } from "@/components/Layouts/Typography";
import { faMobileAlt, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CadastroCliente from "../cliente/CadastroCliente";
import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import NoDataFound from "../Layouts/NoDataFound";
import axiosInstance from "@/plugins/axios";
import { cn, empty } from "@/assets/utils";
import { Popover } from 'flowbite-react';
import Button from "../buttons/Button";

const ClienteResumido = ({ cdPessoaCliente, cdEmpresaCliente, closeCallback }) => {
    const [dadosCliente, setDadosCliente] = useState([]);
    const [dadosContato, setDadosContato] = useState([]);
    const { toast, addTabWithComponent } = useAppContext();

    useEffect(() => {
        if (!cdPessoaCliente) return;

        axiosInstance.get(`/cliente/dados-resumidos/${cdPessoaCliente}/${cdEmpresaCliente}`)
            .then((response) => {
                setDadosCliente(response.data.CLIENTE);
                setDadosContato(response.data.CONTATO);
            })
            .catch((error) => {
                if (error?.text) {
                    return toast.error(error?.text);
                }
                return toast.error("Erro ao buscar dados do cliente.");
            });
    }, [cdEmpresaCliente, cdPessoaCliente]);

    const handleClose = () => {
        if (typeof closeCallback === "function") {
            closeCallback();
        }
    };

    const abrirDadosDoCliente = () => {
        addTabWithComponent(
            'tab_' + cdPessoaCliente,
            'Cliente ' + cdPessoaCliente,
            <CadastroCliente
                cdPessoaCliente={cdPessoaCliente}
                cdEmpresa={cdEmpresaCliente}
                className={'min-h-[90vh]'}
            />
        );
    };

    const getEstadoCivil = (idEstadoCivil) => {
        switch (idEstadoCivil) {
            case 'C':
                return 'Casado(a)';
            case 'S':
                return 'Solteiro(a)';
            case 'D':
                return 'Divorciado(a)';
            case 'V':
                return 'Viúvo(a)';
            case 'A':
                return 'União Estável';
            case 'J':
                return 'Separação Judicial';
            default:
                return '';
        }
    };

    function formatarTelefone(nrTelefone) {
        if (!nrTelefone) return '';

        const nrTel = nrTelefone.toString().replace(/\D/g, '');

        if (nrTel.length === 11) {
            return nrTel.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }

        if (nrTel.length === 10) {
            return nrTel.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }

        return nrTelefone;
    }

    const getTelefoneComercial = (data) => {
        if (!data) return null;

        let telComercial = data.find(tel => tel.CD_TIPO_TELEFONE === '11');
        if (!telComercial) {
            telComercial = data.find(tel => tel.CD_TIPO_TELEFONE === '2');
        }

        if (!telComercial) {
            return "";
        }

        let ramal = telComercial.NR_RAMAL ? ` (Ramal: ${telComercial.NR_RAMAL})` : '';

        return (
            <>
                <div className="flex">
                    <FontAwesomeIcon className="text-slate-600 mr-1" icon={faPhone} width={"14"} height={"14"} />
                    <Label className="text-slate-800 font-semibold">{formatarTelefone(telComercial.NR_TELEFONE) + ramal}</Label>
                </div>
            </>
        );
    };

    const getTelefoneCelular = (data) => {
        if (!data) return null;

        let celular = data.find(tel => tel.CD_TIPO_TELEFONE === '5');

        if (!celular) {
            return "";
        }

        return (
            <>
                <div className="flex">
                    <FontAwesomeIcon className="text-slate-600 mr-1" icon={faMobileAlt} width={"14"} height={"14"} />
                    <Label className="text-slate-800 font-semibold">{formatarTelefone(celular.NR_TELEFONE)}</Label>
                </div>
            </>
        );
    };

    const clienteToHtml = useMemo(() => {
        if (Object.keys(dadosCliente)?.length === 0) {
            return <NoDataFound />
        };

        return (
            <>
                <div className="flex-col mx-2">
                    <div className="flex-row mt-2 text-center text-slate-700 border-b border-slate-300 pb-2">
                        <Title>{`Cliente - ${dadosCliente.CD_PESSOA} - ${dadosCliente.NM_APELIDO}`}</Title>
                    </div>
                    <div className="grid grid-cols-12 ml-2">
                        <div className={cn('col-span-12')}>
                            <Caption>Endereço:</Caption> <Label>{`${dadosCliente.CD_TIPO_LOGRADOURO} ${dadosCliente.NM_CEP}, ${dadosCliente.NR_ENDERECO} ${dadosCliente.DS_COMPLEMENTO ? ' - ' + dadosCliente.DS_COMPLEMENTO : ''}`}</Label>
                        </div>
                        <div className={cn('col-span-12', dadosCliente?.NM_BAIRRO ? "" : "hidden")}>
                            <Caption>Bairro:</Caption> <Label>{dadosCliente.NM_BAIRRO}</Label> <Label>({dadosCliente.NM_REGIAO || 'Bairro sem região cadastrada'})</Label>
                        </div>
                        <div className={cn('col-span-12', dadosCliente?.NM_CIDADE ? "" : "hidden")}>
                            <Caption>Localidade:</Caption> <Label>{dadosCliente.NM_CIDADE}/{dadosCliente.CD_UF}</Label>
                        </div>
                        <div className={cn('col-span-12', dadosCliente?.CD_CENTRO_CUSTO ? "" : "hidden")}>
                            <Caption>Telefone:</Caption> <Label>{dadosCliente.CD_CENTRO_CUSTO}</Label>
                        </div>
                        <div className={cn('col-span-12', dadosCliente?.DS_EMAIL ? "" : "hidden")}>
                            <Caption>E-mail:</Caption> <Label>{dadosCliente.DS_EMAIL}</Label>
                        </div>
                        <div className={cn('col-span-12', dadosCliente?.NM_PESSOA ? "" : "hidden")}>
                            <Caption>Comercial RHB:</Caption> <Label>{dadosCliente.NM_PESSOA}</Label>
                        </div>
                    </div>
                </div>
            </>
        );
    }, [cdPessoaCliente, dadosCliente]);

    const contatosToHtml = useMemo(() => {
        if (Object.keys(dadosCliente)?.length === 0) {
            return;
        };

        if (!dadosContato) return null;

        return (
            <>
                <div className="flex-row mt-2 text-center text-slate-700 border-b border-t pt-2 border-slate-300 pb-2 mx-2">
                    <Title>{`Contatos`}</Title>
                </div>
                {Object.entries(dadosContato).map(([key, contato]) => {
                    return (
                        <div key={key} className={"flex-col px-2 odd:bg-white even:bg-gray-100 border-b border-slate-300"}>
                            <div className="grid grid-cols-12">
                                <div className={'col-span-6 truncate'}>
                                    <Popover className='shadow-xl bg-slate-50 border border-slate-300 rounded-lg z-50 text-sm'
                                        content={
                                            <div className='p-2 text-slate-600 font-semibold'>
                                                <p className={contato?.CD_PESSOA ? '' : 'hidden'}><strong>Sip:</strong> {contato?.CD_PESSOA}</p>
                                                <p className={contato?.NM_CARGO ? '' : 'hidden'}><strong>Cargo:</strong> {contato?.NM_CARGO}</p>
                                                <p className={contato?.NM_SEXO ? '' : 'hidden'}><strong>Sexo:</strong> {contato?.NM_SEXO}</p>
                                                <p className={contato?.DT_NASCIMENTO ? '' : 'hidden'}><strong>Data Nasc.:</strong> {contato?.DT_NASCIMENTO}</p>
                                                <p className={contato?.ID_ESTADO_CIVIL ? '' : 'hidden'}><strong>Estado Civil:</strong> {getEstadoCivil(contato?.ID_ESTADO_CIVIL)}</p>
                                                <p className={contato?.DS_EMAIL ? '' : 'hidden'}><strong>E-mail:</strong> {contato?.DS_EMAIL}</p>
                                            </div>
                                        }
                                        trigger="hover"
                                    >
                                        <div className='w-fit items-center text-blue-600 cursor-pointer relative text-sm py-2 hover:underline' >
                                            <Label>{contato.NM_PESSOA}</Label>
                                        </div>
                                    </Popover>
                                </div>
                                <div className={'col-span-6 flex gap-2 items-center justify-end'}>
                                    {getTelefoneComercial(contato.TELEFONES)} {getTelefoneCelular(contato.TELEFONES)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </>
        );
    }, [cdPessoaCliente, dadosContato]);

    return (
        <div
            className={`fixed top-0 left-0 w-full h-screen max-h-screen overflow-hidden z-50  ${!empty(cdPessoaCliente) ? "" : "hidden"}`}>
            <div
                className={`relative top-5 mx-auto my-auto border border-slate-400 flex-col h-[80vh] shadow-lg rounded-lg w-1/2 shadow-blue-600  overflow-hidden bg-white`}>
                <div className="max-h-full overflow-y-auto">
                    {clienteToHtml}
                    {contatosToHtml}
                    {/* Espaço adicional para os botões não esconderem o conteudo */}
                    <div className="flex flex-col pb-100" />
                </div>
                <div className="flex flex-col p-2 absolute bottom-0 bg-white w-full border-t mt-2 border-slate-300">
                    <div className="flex flex-row-reverse w-full">
                        <div className="inline-flex w-fit">
                            <Button buttonType={"danger"} outline={true} onClick={handleClose} size="small">
                                FECHAR
                            </Button>
                        </div>
                        <div className="inline-flex w-fit">
                            <Button buttonType={"primary"} outline={true} onClick={abrirDadosDoCliente} size="small">
                                DADOS DO CLIENTE
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ClienteResumido;