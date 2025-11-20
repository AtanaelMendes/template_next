import { faClose, faDownLeftAndUpRightToCenter, faHistory, faUpRightAndDownLeftFromCenter, faUserEdit, faUsers } from "@fortawesome/free-solid-svg-icons";
import { DebouncedSearch } from '@/components/inputs/DebouncedSearch';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TooltipComponent } from "../Layouts/TooltipComponent";
import CandidatosVaga from "../selecao/entrar/CandidatosVaga";
import HistoricoVaga from "../selecao/entrar/HistoricoVaga";
import DetalhesVaga from "../selecao/entrar/DetalhesVaga";
import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import ButtonToggle from "../buttons/ButtonToggle";
import Button from '@/components/buttons/Button';
import ModalGrid from "../Layouts/ModalGrid";
import axiosInstance from "@/plugins/axios";

const Vaga = ({ init, nrVaga, enableEdit, disableToggleView, isRecrutamento, nmCargo }) => {
    const { user, toast, sendWebSocketMessage } = useAppContext();
    const [formAlteraAnalista, setFormAlteraAnalista] = useState({ cd_pessoa_analista: "", id_recrutamento: "N" });
    const [activeTab, setActiveTab] = useState("candidatos_relacionados");
    const [modalAlteraAnalista, setModalAlteraAnalista] = useState(false);
    const [viewHistoricoVaga, setViewHistoricoVaga] = useState(false);
    const [maximizeMinimize, setMaximizeMinimize] = useState(false);
    const [vagaDetalheOnView, setVagaDetalheOnView] = useState("");
    const [viewCandidatos, setViewCandidatos] = useState(false);
    const [toggleView, setToggleView] = useState(false);
    const [infoVaga, setInfoVaga] = useState({});
    const [reloadDetalhesVaga, setReloadDetalhesVaga] = useState(false);

    const handleChange = (key, value) => {
        setFormAlteraAnalista((prev) => ({
            ...prev,
            [key]: value
        }));
    };

    useEffect(() => {
        if (!reloadDetalhesVaga) return;
        setTimeout(() => {
            setReloadDetalhesVaga(false);
        }, 1000);
    }, [reloadDetalhesVaga]);

    useEffect(() => {
        setFormAlteraAnalista(prevState => ({ ...prevState, cd_pessoa_analista: infoVaga.CD_ANALISTA, id_recrutamento: infoVaga.ID_RECRUTAMENTO || "N" }));
    }, [infoVaga]);

    const salvarAnalistaVaga = () => {
        const salvarAnalista = (Number(infoVaga.CD_ANALISTA) !== Number(formAlteraAnalista.cd_pessoa_analista));

        axiosInstance
            .post(`vaga/${nrVaga}/alterar-analista-vaga`, {
                cd_pessoa_analista: formAlteraAnalista.cd_pessoa_analista,
                nr_requisicao:  infoVaga.NR_REQUISICAO,
                id_recrutamento: formAlteraAnalista.id_recrutamento,
                salvar_analista: salvarAnalista
            })
            .then(response => {
                if (response.status === 200) {
                    toast.success(response.data.message);
                    setModalAlteraAnalista(false);
                    setFormAlteraAnalista({ cd_pessoa_analista: "", id_recrutamento: "N" });
                    setReloadDetalhesVaga(true);
                    sendWebSocketMessage('vaga', user.cd_sip);
                }
            }).catch(function (resp) {
                console.error(resp)
                let error = resp?.response?.data?.error
                if (Array.isArray(error)) {
                    return toast.error(error.join(' ') || 'OOps ocorreu um erro ao alterar o analista')
                }
                return toast.error(error || 'OOps ocorreu um erro ao alterar o analista')
            });

    };

    return (
        <div className="flex flex-wrap w-full">

            {/* BOTOES */}
            <div className="flex flex-row-reverse w-full gap-1 p-1 xl:p-2">
                {/* VER CANDIDATOS */}
                <div>
                    <TooltipComponent
                        content={<span className='font-semibold'>Ver Candidatos</span>}
                        asChild
                    >
                        <div>
                            <Button
                                buttonType='primary'
                                outline={!viewCandidatos}
                                bordered
                                onClick={()=>{setViewCandidatos(!viewCandidatos); setViewHistoricoVaga(false);}}
                                id={`btn_candidatos_vaga_${nrVaga}`}
                            >
                                <FontAwesomeIcon icon={faUsers} width='16' height='16' />
                            </Button>
                        </div>
                    </TooltipComponent>
                </div>
                {/* // VER CANDIDATOS */}

                {/* HISTORICO DA VAGA */}
                <div>
                    <TooltipComponent
                        content={<span className='font-semibold'>Ver Histórico</span>}
                        asChild
                    >
                        <div>
                            <Button
                                buttonType='primary'
                                outline={!viewHistoricoVaga}
                                bordered
                                onClick={()=>{setViewCandidatos(false); setViewHistoricoVaga(!viewHistoricoVaga);}}
                                id={`btn_historico_vaga_${nrVaga}`}
                            >
                                <FontAwesomeIcon icon={faHistory} width='16' height='16' />
                            </Button>
                        </div>
                    </TooltipComponent>
                </div>
                {/* // HISTORICO DA VAGA */}

                {/* ALTERAR ANALISTA */}
                <div>
                    <TooltipComponent content={<span className='font-semibold'>Alterar Analista</span>} asChild>
                        <div>
                            <Button
                                buttonType='primary'
                                outline
                                bordered
                                disabled={Number(infoVaga?.SITUACAO_VAGA?.CD_SITUACAO_VAGA) !== 1}
                                onClick={setModalAlteraAnalista.bind(null, true)}
                                id={`btn_historico_vaga_${nrVaga}`}
                            >
                                <FontAwesomeIcon icon={faUserEdit} width='16' height='16' />
                            </Button>
                        </div>
                    </TooltipComponent>
                </div>
                {/* // ALTERAR ANALISTA */}
            </div>
            {/* BOTOES */}

            <div className={`
                overflow-y-auto h-[84vh]
                ${maximizeMinimize && viewCandidatos ? "hidden" : viewCandidatos || viewHistoricoVaga ? "size-1/2" : "size-full"}
            `}>
                <DetalhesVaga
                    reload={reloadDetalhesVaga}
                    nrVaga={nrVaga}
                    init={init}
                    enableEdit={enableEdit}
                    toggleView={nrVaga}
                    disableToggleView={disableToggleView}
                    isRecrutamento={isRecrutamento}
                    parentData={setInfoVaga}
                />
            </div>

            {/* CANDIDATOS VAGA */}
            <div className={`h-[84vh] overflow-hidden ${maximizeMinimize ? "size-full" : "size-1/2"} ${viewCandidatos ? "" : "hidden"}`}>
                <div className="grid grid-cols-12 rounded relative">
                    <div className="col-span-12 bg-primary rounded-t-lg text-right">
                        {maximizeMinimize && <Button
                            className={`hover:bg-drop-shadow-2 text-white`}
                            size="small"
                            pill
                            onClick={setMaximizeMinimize.bind(null, false)}
                        >
                            <FontAwesomeIcon
                                icon={faDownLeftAndUpRightToCenter}
                                width="16"
                                height="16"
                            />
                        </Button>}
                        {!maximizeMinimize && (
                            <Button
                                className={`hover:bg-drop-shadow-2 text-white`}
                                size="small"
                                pill
                                onClick={setMaximizeMinimize.bind(null, true)}
                            >
                                <FontAwesomeIcon
                                    icon={faUpRightAndDownLeftFromCenter}
                                    width="16"
                                    height="16"
                                />
                            </Button>
                        )}
                        <Button
                            className={`hover:bg-drop-shadow-2 text-white`}
                            size="small"
                            pill
                            onClick={setViewCandidatos.bind(null, false)}
                        >
                            <FontAwesomeIcon icon={faClose} width="16" height="16" />
                        </Button>
                    </div>
                    <CandidatosVaga
                        nrVagaCliente={nrVaga}
                        nmCargo={"teste"}
                        init={viewCandidatos}
                        activeTab={activeTab}
                        setVagaDetalheOnView={setVagaDetalheOnView}
                        tabName={nrVaga}
                        setToggleView={setToggleView}
                        toggleView={toggleView}
                    />
                </div>
            </div>

            {/* HISTORICO DA VAGA */}
            <div className={`h-[84vh] overflow-y-auto size-1/2 ${viewHistoricoVaga ? "" : "hidden"}`}>
                <HistoricoVaga
                    init={viewHistoricoVaga}
                    nrVagaCliente={nrVaga}
                    closeWindowCallback={setViewHistoricoVaga.bind(null, false)}
                />
            </div>

            {/* Modal para alteração do Analista */}
            <ModalGrid
                size='sm'
                btnCancel={'CANCELAR'}
                btnSubmit={'SALVAR'}
                headerClass='py-3 px-4'
                contentClass='py-3 px-4'
                footerClass='py-1 px-4'
                closeOnSubmit={true}
                submitCallBack={() => {
                    salvarAnalistaVaga();
                    setReloadDetalhesVaga(true);
                    setTimeout(() => {
                        setReloadDetalhesVaga(false);
                    }, 300);
                }}
                modalControl={modalAlteraAnalista}
                setModalControl={setModalAlteraAnalista}
                title={`Alterar Analista ${nrVaga}`}
            >
                <div>
                    <DebouncedSearch.Root>
                        <DebouncedSearch.Select
                            onChange={value => handleChange("cd_pessoa_analista", value)}
                            value={formAlteraAnalista.cd_pessoa_analista}
                            urlGet={`analista/selecionadores/${nrVaga}`}
                            optId={'CD_PESSOA_ANALISTA'}
                            optLabel={'NM_PESSOA_ANALISTA'}
                            elevateMenu={true}
                        />
                    </DebouncedSearch.Root>

                    <div className='flex-row mt-2'>
                        <ButtonToggle
                            primary
                            label='Recrutamento'
                            id={'id_recrutamento'}
                            onChange={(id, value, checked) => handleChange("id_recrutamento", checked ? "S" : "N")}
                            checked={formAlteraAnalista.id_recrutamento === "S"}
                        />
                    </div>

                </div>
            </ModalGrid>
        </div>
    );
};
export default Vaga;