import {
    faChevronDown,
    faChevronUp,
    faEdit,
    faInfo,
    faLock,
    faSearch,
    faWheelchair,
    faUnlock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import PillsBadge from '@/components/buttons/PillsBadge';
import { cn, empty } from '@/assets/utils.js';
import Modal from '@/components/Layouts/ModalGrid';
import Button from '@/components/buttons/Button';
import { useAppContext } from '@/context/AppContext';
import EditInfoVaga from './EditInfoVaga';
import { BuscaCandidatosProvider } from '@/context/BuscaCandidatosContext';
import PerfilEPesquisaCandidatos from '@/components/busca-candidatos/PerfilEPesquisaCandidatos';
import axiosInstance from '@/plugins/axios';
import Blockquote from "@/components/Layouts/Blockquote";
import { Caption } from "@/components/Layouts/Typography"
import { TooltipComponent } from "@/components/Layouts/TooltipComponent";
import Dialog from '@/components/Layouts/Dialog'
import NoDataFound from '@/components/Layouts/NoDataFound';
import { Popover } from 'flowbite-react'

const DetalhesVaga = ({
    active,
    reload,
    nrVaga,
    nmCargo,
    init,
    enableEdit,
    parentData,
    toggleView,
    setToggleView,
    isRecrutamento,
    setVagaSigilosa,
    setVagaConfidencial,
    disableToggleView,
    onSetVagaDetalheOnView,
    renderizadoPorGerencial,
    ...rest
}) => {
    const { toast, pesquisaSelecionada, setPesquisaSelecionada } = useAppContext();
    const [toggleViewPesquisa, setToggleViewPesquisa] = useState(false);
    const [detalhesVaga, setDetalhesVaga] = useState([]);
    const [analistaVaga, setAnalistaVaga] = useState([]);
    const [modalEditInfoVaga, setModalEditInfoVaga] = useState(false);
    const [ready, setReady] = useState(false);
    const [nrRequisicao, setNrRequisicao] = useState(null)
    const [mostraDialogVagaSigilosa, setMostraDialogVagaSigilosa] = useState(false);
    const [statusVagaSigilosa, setStatusVagaSigilosa] = useState(null);
    const [mostraDialogVagaConfidencial, setMostraDialogVagaConfidencial] = useState(false);
    const [statusVagaConfidencial, setStatusVagaConfidencial] = useState(null);

    useEffect(() => {
        if (pesquisaSelecionada.nrSelecao) {
            setToggleViewPesquisa(true);
        }
    }, [pesquisaSelecionada]);

    const handleToggleViewPesquisa = () => {
        setToggleViewPesquisa(prev => !prev);
    };

    const handleReloadDetalhesVaga = (nrRequisicao, statusSigilosa, statusConfidencial) => {
        if (typeof setVagaSigilosa === 'function') {
            setVagaSigilosa(nrRequisicao, statusSigilosa);
        }

        if (typeof setVagaConfidencial === 'function') {
            setVagaConfidencial(nrRequisicao, statusConfidencial);
        }

        getInfoVaga();
    };

    const getInfoVaga = () => {
        if (empty(nrVaga)) return;
        if (!init) return;

        if (!reload) {
            setReady(false);
        }
        setDetalhesVaga([]);
        setPesquisaSelecionada({});

        axiosInstance
            .get(`vaga/info-vaga/${nrVaga}/${isRecrutamento ? 'R' : 'S'}`)
            .then(function (response) {
                setDetalhesVaga(response.data);
                setReady(true);
            })
            .catch(function (error) {
                setReady(false);
                toast.error('Não foi possível buscar os detalhes da vaga.');
                console.error(error);
            });

        axiosInstance
            .get(`vaga/info-analista-vaga/${nrVaga}`)
            .then(function (response) {
                setAnalistaVaga(response.data);
            })
            .catch(function (error) {
                toast.error('Não foi possível buscar os detalhes do analistas das vaga.');
                console.error(error);
            });
    };

    const alteraVagaSigilosa = (nrRequisicao) => {
        let statusSigilosa = 'S'
        if (statusVagaSigilosa == 'S') {
            statusSigilosa = 'N'
        }
        axiosInstance
            .put(`vaga/vaga-sigilosa`, {
                nrRequisicao: nrRequisicao,
                novoStatus: statusSigilosa,
            })
            .then(function (response) {
                if (response.status === 200) {
                    toast.success('Vaga sigilosa atualizada com sucesso');
                    handleReloadDetalhesVaga(nrRequisicao, statusSigilosa, null);
                }
            })
            .catch(function (resp) {
                let error = resp?.response?.data?.error
                if (Array.isArray(error)) {
                    return toast.error(error.join(' ') || 'Oops ocorreu um erro ao atualizar a vaga sigilosa');
                }
                return toast.error(error || 'Oops ocorreu um erro ao atualizar a vaga sigilosa');
            })
    }

    const alteraVagaConfidencial = (nrRequisicao) => {
        let statusConfidencial = statusVagaConfidencial == 'S' ? 'N' : 'S';

        axiosInstance
            .put(`vaga/vaga-confidencial`, {
                nrRequisicao: nrRequisicao,
                novoStatus: statusConfidencial,
            })
            .then(function (response) {
                if (response.status === 200) {
                    toast.success('Vaga confidencial atualizada com sucesso');
                    handleReloadDetalhesVaga(nrRequisicao, null, statusConfidencial);
                }
            })
            .catch(function (resp) {
                let error = resp?.response?.data?.error
                if (Array.isArray(error)) {
                    return toast.error(error.join(' ') || 'Oops! Ocorreu um erro ao atualizar a vaga confidencial');
                }
                return toast.error(error || 'Oops! Ocorreu um erro ao atualizar a vaga confidencial');
            })
    }

    useEffect(() => {
        if (!init) return;
        getInfoVaga();
    }, [init]);

    useEffect(() => {
        if (!reload) return;
        getInfoVaga()
    }, [reload])

    useEffect(() => {
        if (typeof parentData === "function") {
            parentData(detalhesVaga);
        };
    }, [detalhesVaga]);

    const handleToggleView = () => {
        setToggleView(!toggleView);

        if (!toggleView) {
            setTimeout(() => {
                const elementToScroll = document.getElementById(`detalhe-vaga-${nrVaga}`);
                if (elementToScroll) {
                    elementToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }
    };

    return (
        <>
            {empty(detalhesVaga) && <NoDataFound isLoading={!ready} />}
            <div className={`${!empty(detalhesVaga) ? '' : "hidden"} grid grid-cols-1 relative`} id={`detalhe-vaga-${nrVaga}`}>
                {!disableToggleView && ready && (
                    <div
                        className={cn("absolute hover:bg-blue-300 rounded-full p-1", !toggleView && "rotate-180 duration-200 ease-in-out")}
                        onClick={handleToggleView}
                    >
                        <FontAwesomeIcon icon={faChevronUp} width="18" height="18" color="blue" />
                    </div>
                )}

                {toggleView && ready && (
                    <div className={cn(disableToggleView ? 'px-2' : 'mt-6 border-t border-slate-300')}>
                        <div className="flex flex-col xl:gap-2 text-sm">

                            <div className="w-full pt-2 flex items-center justify-between">
                                <div className="flex flex-row items-center gap-2">
                                    <span className="text-xs text-slate-500">Requisição:</span>
                                    <span
                                        className="text-primary font-semibold cursor-pointer inline-flex items-center gap-1"
                                        onClick={() => {
                                            getInfoRequisicao(detalhesVaga.NR_REQUISICAO);
                                        }}
                                    >
                                        {detalhesVaga.NR_REQUISICAO}
                                        <FontAwesomeIcon icon={faSearch} width="12" height="12" />
                                    </span>
                                    {/* Botão alterar vaga Sigilosa */}
                                    {detalhesVaga.ID_VAGA_CONFIDENCIAL != "S" && <TooltipComponent
                                        content={
                                            <>
                                                <span className='font-semibold'>{detalhesVaga.ID_VAGA_SIGILOSA == 'N' ? "Definir como Sigilosa" : "Definir como não Sigilosa"}</span>
                                            </>
                                        }
                                        asChild
                                    >
                                        <div>
                                            <Button
                                                buttonType={detalhesVaga.ID_VAGA_SIGILOSA == 'N' ? 'success' : 'danger'}
                                                size='small'
                                                outline
                                                bordered
                                                onClick={() => {
                                                    setNrRequisicao(detalhesVaga.NR_REQUISICAO);
                                                    setStatusVagaSigilosa(detalhesVaga.ID_VAGA_SIGILOSA);
                                                    setMostraDialogVagaSigilosa(true);
                                                }}
                                                id={`btn_vaga_sigilosa_${detalhesVaga.NR_REQUISICAO}`}
                                            >
                                                <div className='flex'>
                                                    <FontAwesomeIcon icon={detalhesVaga.ID_VAGA_SIGILOSA == 'N' ? faLock : faUnlock} width='15' height='15' />
                                                    <span className='ml-2'>{detalhesVaga.ID_VAGA_SIGILOSA == 'N' ? "Definir como Sigilosa" : "Definir como não Sigilosa"}</span>
                                                </div>
                                            </Button>
                                        </div>
                                    </TooltipComponent>}
                                    {/* Botão alterar vaga Confidencial */}
                                    {detalhesVaga.ID_VAGA_SIGILOSA != "S" && <TooltipComponent
                                        content={
                                            <>
                                                <span className='font-semibold'>{detalhesVaga.ID_VAGA_CONFIDENCIAL == 'N' ? "Definir como Confidencial" : "Definir como não Confidencial"}</span>
                                            </>
                                        }
                                        asChild
                                    >
                                        <div>
                                            <Button
                                                buttonType={detalhesVaga.ID_VAGA_CONFIDENCIAL == 'N' ? 'success' : 'danger'}
                                                size='small'
                                                outline
                                                bordered
                                                onClick={() => {
                                                    setNrRequisicao(detalhesVaga.NR_REQUISICAO);
                                                    setStatusVagaConfidencial(detalhesVaga.ID_VAGA_CONFIDENCIAL);
                                                    setMostraDialogVagaConfidencial(true);
                                                }}
                                                id={`btn_vaga_confidencial_${detalhesVaga.NR_REQUISICAO}`}
                                            >
                                                <div className='flex'>
                                                    <FontAwesomeIcon icon={detalhesVaga.ID_VAGA_CONFIDENCIAL == 'N' ? faLock : faUnlock} width='15' height='15' />
                                                    <span className='ml-2'>{detalhesVaga.ID_VAGA_CONFIDENCIAL == 'N' ? "Definir como Confidencial" : "Definir como não Confidencial"}</span>
                                                </div>
                                            </Button>
                                        </div>
                                    </TooltipComponent>}
                                    {disableToggleView && detalhesVaga.ID_VAGA_SIGILOSA == "S" && (
                                        <PillsBadge type="danger" className="inline-flex items-center ml-2">
                                            Sigilosa
                                            <FontAwesomeIcon icon={faLock} width="12" height="12" className='ml-1' />
                                        </PillsBadge>
                                    )}
                                    {disableToggleView && detalhesVaga.ID_VAGA_CONFIDENCIAL == "S" && (
                                        <PillsBadge type="danger" className="inline-flex items-center ml-2">
                                            Confidencial
                                            <FontAwesomeIcon icon={faLock} width="12" height="12" className='ml-1' />
                                        </PillsBadge>
                                    )}
                                    {disableToggleView && detalhesVaga.ID_VAGA_PCD == "S" && (
                                        <PillsBadge
                                            type="warning"
                                            className="inline-flex items-center ml-2"
                                        >
                                            PCD
                                            <FontAwesomeIcon
                                                icon={faWheelchair}
                                                width="12"
                                                height="12"
                                                className='ml-1'
                                            />
                                        </PillsBadge>
                                    )}
                                </div>

                                {enableEdit && (
                                    <Button
                                        buttonType='primary'
                                        className='float-right'
                                        onClick={() => {
                                            setModalEditInfoVaga(true);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faEdit} width='16' height='16' />
                                    </Button>
                                )}
                            </div>

                            <Dialog
                                small
                                hideTextArea={true}
                                btnCancel={"CANCELAR"}
                                btnAccept={"CONFIRMAR"}
                                showDialog={mostraDialogVagaSigilosa}
                                setDialogControl={setMostraDialogVagaSigilosa}
                                closeDialogCallback={() => {
                                    setMostraDialogVagaSigilosa(false);
                                }}
                                confirmActionCallback={() => {
                                    alteraVagaSigilosa(nrRequisicao);
                                }}
                                title={`Deseja realmente alterar o status da vaga para ${statusVagaSigilosa === 'S' ? 'NÃO' : ''} sigilosa?`}
                            />

                            <Dialog
                                small
                                hideTextArea={true}
                                btnCancel={"CANCELAR"}
                                btnAccept={"CONFIRMAR"}
                                showDialog={mostraDialogVagaConfidencial}
                                setDialogControl={setMostraDialogVagaConfidencial}
                                closeDialogCallback={() => {
                                    setMostraDialogVagaConfidencial(false);
                                }}
                                confirmActionCallback={() => {
                                    alteraVagaConfidencial(nrRequisicao);
                                }}
                                title={`Deseja realmente alterar o status da vaga para ${statusVagaConfidencial === 'S' ? 'NÃO' : ''} confidencial?`}
                            />
                            <div className="w-full">
                                <div className="flex flex-row flex-wrap w-full gap-y-1 gap-x-4">
                                    <div className="flex flex-row flex-nowrap">
                                        <div className="w-[90px] text-xs text-slate-500">
                                            Qualificação:
                                        </div>
                                        <div className="w-[160px]">
                                            <span>{detalhesVaga.NM_QUALIFICACAO_CARGO}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-row flex-nowrap">
                                        <div className="w-[90px] text-xs text-slate-500">
                                            Unidade:
                                        </div>
                                        <div className="w-[160px]">
                                            {detalhesVaga.NM_EMPRESA}
                                        </div>
                                    </div>

                                    <div className="flex flex-row flex-nowrap">
                                        <div className="w-[90px] text-xs text-slate-500">
                                            Horário:
                                        </div>
                                        <div className="w-[160px]">
                                            {detalhesVaga.NM_TURNO || detalhesVaga.NM_TURNO_REQ}
                                        </div>
                                    </div>

                                    <div className="flex flex-row flex-nowrap">
                                        <div className="w-[90px] text-xs text-slate-500">
                                            Salário:
                                        </div>
                                        <div className="w-[160px]">
                                            {detalhesVaga.VL_SALARIO ?? 0}
                                        </div>
                                    </div>

                                    <div className="flex flex-row flex-nowrap">
                                        <div className="w-[90px] text-xs text-slate-500">
                                            Centro de custo:
                                        </div>
                                        <div className="w-[160px]">
                                            {detalhesVaga?.CD_CENTRO_CUSTO || "Não possui"}
                                        </div>
                                    </div>

                                    <div className="flex flex-row flex-nowrap">
                                        <div className="w-[90px] text-xs text-slate-500">
                                            Abertura:
                                        </div>
                                        <div className="w-[160px] text-xs xl:text-md">
                                            {detalhesVaga.DATA_ABERTURA}
                                        </div>
                                    </div>

                                    <div className="flex flex-row flex-nowrap">
                                        <div className="w-[90px] text-xs text-slate-500">
                                            Requisitante:
                                        </div>
                                        <div className="w-[160px] text-xs xl:text-md">
                                            {detalhesVaga.NM_REQUISITANTE}
                                        </div>
                                    </div>

                                    <div className="flex flex-row flex-nowrap">
                                        <div className="w-[90px] text-xs text-slate-500">
                                            NR° Pedido:
                                        </div>
                                        <div className="w-[160px] text-xs xl:text-md">
                                            {detalhesVaga.NR_PEDIDO_CLIENTE}
                                        </div>
                                    </div>

                                    <div className="flex flex-row flex-nowrap">
                                        <div className="w-[90px] text-xs text-slate-500">
                                            Divulga WEB:
                                        </div>
                                        <div className="w-[160px] text-xs xl:text-md">
                                            {detalhesVaga.DT_LIBERA_INTERNET}
                                        </div>
                                    </div>

                                    <div className="flex flex-row flex-nowrap">
                                        <div className="w-[90px] text-xs text-slate-500">
                                            Retira WEB:
                                        </div>
                                        <div className="w-[160px] text-xs xl:text-md">
                                            {detalhesVaga.DT_RETIRA_INTERNET}
                                        </div>
                                    </div>

                                    <div className="flex flex-row flex-nowrap">
                                        <div className="w-[90px] text-xs text-slate-500">
                                            Criado por:
                                        </div>
                                        <div className="w-fit text-xs xl:text-md">
                                            {detalhesVaga.NM_USUARIO_CRIADO_POR}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`w-full
                                ${(!empty(parseFloat(detalhesVaga?.AD_PC_FATURAMENTO))
                                    || !empty(detalhesVaga?.PC_FAT_ENCAMINHAMENTO)
                                    || !empty(detalhesVaga?.PC_FATURAMENTO)) ? "" : "hidden"
                                }`}
                            >
                                <Blockquote>
                                    <div className="flex flex-col gap-2 text-slate-500">
                                        {/* Entrada */}
                                        {parseFloat(detalhesVaga.FATURAMENTO?.PC_FATURA_ADIANTAMENTO || 0) > 0 && (
                                            <div className="flex flex-row items-center gap-2">
                                                <Caption>Entrada:</Caption>
                                                <div className="text-primary">
                                                    {parseFloat(detalhesVaga.FATURAMENTO?.PC_FATURA_ADIANTAMENTO).toFixed(2)}%
                                                </div>
                                                {detalhesVaga.FATURAMENTO?.ID_ADIANTAMENTO_FATURADO === "S" && (
                                                    <TooltipComponent
                                                        content={
                                                            <>
                                                                <div dangerouslySetInnerHTML={{ __html: detalhesVaga.FATURAMENTO?.DS_HELP_ADIANTAMENTO }} />
                                                                <div>{detalhesVaga.FATURAMENTO?.NM_SITUACAO_TITULO}</div>
                                                                <div>Data de vencimento: {detalhesVaga.FATURAMENTO?.DT_VENCIMENTO}</div>
                                                            </>
                                                        }
                                                        asChild
                                                    >
                                                        <FontAwesomeIcon icon={faInfo} className="bg-primary text-white p-0.5 rounded-full" width={14} height={14} />
                                                    </TooltipComponent>
                                                )}
                                            </div>
                                        )}

                                        {/* Mapeamento */}
                                        {parseFloat(detalhesVaga.FATURAMENTO?.PC_FATURA_ENCAMINHA || 0) > 0 && (
                                            <div className="flex flex-row items-center gap-2">
                                                <Caption>Mapeamento:</Caption>
                                                <div className="text-primary">
                                                    {parseFloat(detalhesVaga.FATURAMENTO?.PC_FATURA_ENCAMINHA).toFixed(2)}%
                                                </div>
                                                {detalhesVaga.FATURAMENTO?.ID_ENCAMINHAMENTO_FATURADO === "S" && (
                                                    <TooltipComponent
                                                        content={
                                                            <div dangerouslySetInnerHTML={{ __html: detalhesVaga.FATURAMENTO?.DS_HELP_ENCAMINHA }} />
                                                        }
                                                        asChild
                                                    >
                                                        <FontAwesomeIcon icon={faInfo} className="bg-primary text-white p-0.5 rounded-full" width={14} height={14} />
                                                    </TooltipComponent>
                                                )}
                                            </div>
                                        )}

                                        {/* Fechamento */}
                                        {(parseFloat(detalhesVaga?.PC_FATURAMENTO || 0) - (
                                            parseFloat(detalhesVaga.FATURAMENTO?.PC_FATURA_ADIANTAMENTO || 0) +
                                            parseFloat(detalhesVaga.FATURAMENTO?.PC_FATURA_ENCAMINHA || 0)
                                        ) > 0) && (
                                                <div className="flex flex-row items-center gap-2">
                                                    <Caption>Fechamento:</Caption>
                                                    <div className="text-primary">
                                                        {(
                                                            (
                                                                parseFloat(detalhesVaga?.PC_FATURAMENTO || 0)
                                                            ) - (
                                                                parseFloat(detalhesVaga.FATURAMENTO?.PC_FATURA_ADIANTAMENTO || 0) +
                                                                parseFloat(detalhesVaga.FATURAMENTO?.PC_FATURA_ENCAMINHA || 0)
                                                            )
                                                        ).toFixed(2)}%
                                                    </div>
                                                    {detalhesVaga.FATURAMENTO?.ID_FECHAMENTO_FATURADO == "S" && (
                                                        <TooltipComponent
                                                            content={
                                                                <div dangerouslySetInnerHTML={{ __html: detalhesVaga.FATURAMENTO?.DS_HELP_FECHAMENTO }} />
                                                            }
                                                            asChild
                                                        >
                                                            <FontAwesomeIcon icon={faInfo} className="bg-primary text-white p-0.5 rounded-full" width={14} height={14} />
                                                        </TooltipComponent>
                                                    )}
                                                </div>
                                            )}

                                        {/* Total */}
                                        {parseFloat(detalhesVaga?.PC_FATURAMENTO || 0) > 0 && (
                                            <div className="flex flex-row items-center gap-2">
                                                <Caption>Total:</Caption>
                                                <div className="text-primary">
                                                    {parseFloat(detalhesVaga?.PC_FATURAMENTO).toFixed(2)}%
                                                </div>
                                            </div>
                                        )}

                                        {/* Data prevista de faturamento */}
                                        {detalhesVaga?.AD_DT_FATURAMENTO && (
                                            <div className="flex flex-row items-center gap-2 text-slate-500">
                                                <Caption>Data prevista de faturamento:</Caption>
                                                <div className="text-primary">
                                                    {detalhesVaga.AD_DT_FATURAMENTO}
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </Blockquote>

                            </div>

                            <div className="w-full border-t border-slate-300 my-2 xl:my-4"></div>

                            <div className="w-full">
                                <Blockquote>
                                    <p className="text-slate-500">Analista</p>
                                    {analistaVaga.NM_PESSOA} - {analistaVaga.EMAIL} -{" "}
                                    {analistaVaga.CELULAR}
                                </Blockquote>
                            </div>

                            <div className="w-full">
                                <div className="flex flex-row flex-wrap gap-1 w-full">
                                    <div className="flex">
                                        <PillsBadge type="primary" className="text-center">
                                            <p className="text-xs text-slate-500">
                                                Tipo contrato
                                            </p>
                                            {detalhesVaga.NM_TIPO_CONTRATACAO}
                                        </PillsBadge>
                                        {(!empty(detalhesVaga?.DS_MOTIVO_TEMP) || !empty(detalhesVaga?.DS_MOTIVO_TEMPS)) && (

                                            <Popover className='shadow-2xl bg-slate-50 border rounded-lg z-50'
                                                content={
                                                    <div className='p-2 text-slate-600 font-semibold'>
                                                        <p>{empty(detalhesVaga?.DS_MOTIVO_TEMP) ? detalhesVaga?.DS_MOTIVO_TEMPS : detalhesVaga?.DS_MOTIVO_TEMP}</p>
                                                    </div>
                                                }
                                                trigger="hover"
                                            >
                                                <div
                                                    className='w-fit inline-flex items-center text-blue-600 cursor-pointer relative'
                                                >
                                                    <FontAwesomeIcon icon={faInfo} className="bg-primary text-white p-0.5 rounded-full" width={14} height={14} />
                                                </div>
                                            </Popover>

                                        )}


                                    </div>
                                    <div className={`flex ${detalhesVaga?.DS_AREA ? "" : "hidden"}`}>
                                        <PillsBadge type="primary" className="text-center">
                                            <p className="text-xs text-slate-500">Setor</p>
                                            <span>{detalhesVaga.DS_AREA}</span>
                                        </PillsBadge>
                                    </div>
                                    <div className="flex">
                                        <PillsBadge type={`${detalhesVaga.ID_DOACAO == "S" ? "danger" : detalhesVaga.ID_LIBERA_INTERNET == "S" ? "success" : "danger"}`} className="text-center">
                                            <p className="text-xs text-slate-500">Internet</p>
                                            <span>
                                                {detalhesVaga.ID_DOACAO == "S" ? "Não" : detalhesVaga.ID_LIBERA_INTERNET == "S" ? "Sim" : "Não"}
                                            </span>
                                        </PillsBadge>
                                    </div>
                                    <div className="flex">
                                        <PillsBadge type={`${detalhesVaga.ID_AUTO_ATENDIMENTO == "S" ? "success" : "danger"}`} className="text-center">
                                            <p className="text-xs text-slate-500">Auto atendimento</p>
                                            <span>
                                                {detalhesVaga.ID_AUTO_ATENDIMENTO == "S" ? "Sim" : "Não"}
                                            </span>
                                        </PillsBadge>
                                    </div>
                                    <div className="flex">
                                        <PillsBadge type={`${detalhesVaga.ID_RECRUTAMENTO == "S" ? "success" : "danger"}`} className="text-center">
                                            <p className="text-xs text-slate-500">Recrutamento</p>
                                            <span>
                                                {detalhesVaga.ID_RECRUTAMENTO == "S" ? "Sim" : "Não"}
                                            </span>
                                        </PillsBadge>
                                    </div>
                                    <div className="flex">
                                        <PillsBadge type={`${detalhesVaga.ID_INSALUBRIDADE == "S" ? "success" : "danger"}`} className="text-center">
                                            <p className="text-xs text-slate-500">Insalubridade</p>
                                            <span>
                                                {detalhesVaga.ID_INSALUBRIDADE == "S" ? "Sim" : "Não"}
                                            </span>
                                        </PillsBadge>
                                    </div>
                                    <div className="flex">
                                        <PillsBadge type={`${detalhesVaga.ID_PERICULOSIDADE == "S" ? "success" : "danger"}`} className="text-center">
                                            <p className="text-xs text-slate-500">Periculosidade</p>
                                            <span>
                                                {detalhesVaga.ID_PERICULOSIDADE == "S" ? "Sim" : "Não"}
                                            </span>
                                        </PillsBadge>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full mt-2">
                                <span className="text-slate-500">
                                    Informações adicionais ou sigilosas:
                                </span>
                                <pre>
                                    <p className="border border-slate-300 p-2 rounded word-wrap-legado text-wrap">
                                        {detalhesVaga.DS_OBSERVACOES || (
                                            <span className="text-slate-500">Sem informações</span>
                                        )}
                                    </p>
                                </pre>
                            </div>

                            {!rest.disablePesquisarCandidatos && (
                                <>
                                    <div
                                        className='hover:bg-blue-300 rounded-full p-2 flex mt-4 w-max h-max cursor-pointer'
                                        onClick={() => {
                                            setToggleViewPesquisa(!toggleViewPesquisa);
                                        }}
                                    >
                                        Perfil / Pesquisa de Candidatos
                                        <div onClick={handleToggleViewPesquisa} className='cursor-pointer'>
                                            <FontAwesomeIcon
                                                icon={faChevronDown}
                                                width='18'
                                                height='18'
                                                color='blue'
                                                className={`ml-2 transform transition-transform duration-300 ${toggleViewPesquisa ? 'rotate-180' : 'rotate-0'
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    <BuscaCandidatosProvider
                                        active={toggleViewPesquisa}
                                        nrVaga={nrVaga}
                                        nrSelecao={pesquisaSelecionada.nrSelecao}
                                        nrRequisicao={detalhesVaga.NR_REQUISICAO}
                                    >
                                        {toggleViewPesquisa && (
                                            <div className='w-full'>
                                                <div id='busca-talentos' className='grid grid-cols-1 rounded'>
                                                    <PerfilEPesquisaCandidatos
                                                        active={toggleViewPesquisa}
                                                        horizontal={true}
                                                        situacaoVaga={detalhesVaga?.SITUACAO_VAGA?.CD_SITUACAO_VAGA}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </BuscaCandidatosProvider>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <Modal
                size='full'
                scrollable
                title={`${nrVaga} ${nmCargo ? ' - ' + nmCargo : ''}`}
                modalControl={modalEditInfoVaga}
                setModalControl={setModalEditInfoVaga}
            >
                {enableEdit && (
                    <EditInfoVaga
                        onEditCallback={handleReloadDetalhesVaga}
                        nrVaga={nrVaga}
                        detalhesVaga={detalhesVaga}
                        nrRequisicao={detalhesVaga.NR_REQUISICAO}
                        analistaVaga={analistaVaga}
                        init={modalEditInfoVaga}
                        renderizadoPorGerencial={typeof renderizadoPorGerencial !== 'undefined' ? renderizadoPorGerencial : null}
                    />
                )}
            </Modal>
        </>
    );
};

export default DetalhesVaga;
