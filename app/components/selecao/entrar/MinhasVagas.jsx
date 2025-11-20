import {
    faClose,
    faDownLeftAndUpRightToCenter,
    faUpRightAndDownLeftFromCenter,
} from "@fortawesome/free-solid-svg-icons";
import CandidatosVaga from "@/components/selecao/entrar/CandidatosVaga";
import HistoricoVaga from "@/components/selecao/entrar/HistoricoVaga";
import TableMinhasVagas from "@/components/selecao/entrar/tables/TableMinhasVagas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import Button from "@/components/buttons/Button";
import { useAppContext } from "@/context/AppContext";
import { cn, empty } from "@/assets/utils";

const MinhasVagas = ({ vagas, isVagasLoading, refreshTab, isRecrutamento }) => {
    const { showHistorico, setNrVagaClienteCtx } = useAppContext();
    
    // Função para salvar estado no cache
    const saveStateToCache = useCallback((state) => {
        try {
            localStorage.setItem('minhasVagasState', JSON.stringify(state));
        } catch (error) {
            console.warn('Erro ao salvar estado no cache:', error);
        }
    }, []);

    // Função para carregar estado do cache
    const loadStateFromCache = useCallback(() => {
        try {
            const cached = localStorage.getItem('minhasVagasState');
            if (cached) {
                return JSON.parse(cached);
            }
        } catch (error) {
            console.warn('Erro ao carregar estado do cache:', error);
        }
        return null;
    }, []);

    // Função para limpar cache do estado
    const clearStateCache = useCallback(() => {
        try {
            localStorage.removeItem('minhasVagasState');
        } catch (error) {
            console.warn('Erro ao limpar cache do estado:', error);
        }
    }, []);

    // Carrega estado inicial do cache
    const initialState = loadStateFromCache() || {};
    
    const [maximizeMinimize, setMaximizeMinimize] = useState(false);
    const [vagasDataModificada, setVagasDataModificada] = useState(false);
    const [nrVagaOnView, setNrVagaOnView] = useState(initialState.nrVagaOnView || "");
    const [vagaDetalheOnView, setVagaDetalheOnView] = useState(initialState.vagaDetalheOnView || null);
    const [nmCargoOnView, setNmCargoOnView] = useState(initialState.nmCargoOnView || "");
    const [pageView, setPageView] = useState(initialState.pageView || "");
    const [activeTab, setActiveTab] = useState(initialState.activeTab || "candidatos_relacionados");
    const [filteredData, setFilteredData] = useState([]);
    const [toggleView, setToggleView] = useState(initialState.toggleView || null);
    const [atualizaDetalhesVaga, setAtualizaDetalhesVaga] = useState(false);

    const getHistoricoVaga = useCallback((nrVaga, nm_cargo) => {
        setNrVagaOnView(nrVaga);
        setNmCargoOnView(nm_cargo);
        setPageView("historico");
    }, []);

    const getCandidatosVaga = useCallback((nrVaga, nm_cargo) => {
        setNrVagaOnView(nrVaga);
        setNmCargoOnView(nm_cargo);
        setPageView("vaga");
    }, []);

    useEffect(() => {
        setNrVagaClienteCtx(nrVagaOnView);
    }, [nrVagaOnView]);

    // Salvar estado no cache sempre que os valores importantes mudarem
    useEffect(() => {
        const stateToCache = {
            nrVagaOnView,
            vagaDetalheOnView,
            nmCargoOnView,
            pageView,
            activeTab,
            toggleView
        };
        saveStateToCache(stateToCache);
    }, [nrVagaOnView, vagaDetalheOnView, nmCargoOnView, pageView, activeTab, toggleView, saveStateToCache]);

    useEffect(() => {
        if (vagas) {
            setVagasDataModificada(
                vagas?.map((vaga) => {
                    return {
                        nr_vaga: vaga.NR_VAGA,
                        cd_situacao_vaga: vaga.CD_SITUACAO_VAGA,
                        nm_cargo: vaga.NM_CARGO,
                        cd_pessoa_cliente: vaga.CD_PESSOA,
                        cd_empresa_cliente: vaga.CD_EMPRESA,
                        cd_empresa_agrupadora: vaga.CD_EMPRESA_AGRUPADORA,
                        nm_apelido_cliente: vaga.NM_APELIDO_CLIENTE,
                        qt_candidatos_estagio: vaga.QT_CANDIDATOS_ESTAGIO,
                        nm_situacao_vaga: vaga.NM_SITUACAO_VAGA,
                        qt_dias_abertura: vaga.QT_DIAS_ABERTURA,
                        qt_dias_estacionada: vaga.QT_DIAS_ESTACIONADA,
                        nm_centro_custo: vaga.NM_CENTRO_CUSTO,
                        cd_turno: vaga.CD_TURNO,
                        nm_turno: vaga.NM_TURNO,
                        cd_usuario_analista: vaga.CD_USUARIO_ANALISTA,
                        cd_pessoa_analista: vaga.CD_PESSOA_ANALISTA,
                        nm_pessoa_analista: vaga.NM_PESSOA_ANALISTA,
                        nr_requisicao: vaga.NR_REQUISICAO,
                        id_recrutamento: vaga.ID_RECRUTAMENTO,
                        id_vaga_sigilosa: vaga.ID_VAGA_SIGILOSA,
                        id_vaga_confidencial: vaga.ID_VAGA_CONFIDENCIAL,
                        id_vaga_pcd: vaga.ID_VAGA_PCD,
                        id_esconde_info_sigilosa: vaga.ID_ESCONDE_INFO_SIGILOSA,
                        candidato_aprovado: vaga.CANDIDATO_APROVADO,
                        qtd_candidatos_relacionados: vaga.QTD_CANDIDATOS_RELACIONADOS,
                        qtd_candidatos_web: vaga.QTD_CANDIDATOS_WEB,
                        qtd_candidatos_descartados: vaga.QTD_CANDIDATOS_DESCARTADOS,
                        tipo_contratacao: vaga.TIPO_CONTRATACAO,
                        tipo_contratacao_string: vaga.TIPO_CONTRATACAO_STRING,
                    };
                })
            );
        }
    }, [vagas]);

    const closeWindow = () => {
        setNrVagaOnView("");
        setNmCargoOnView("");
        setPageView("");
        setMaximizeMinimize(false);
        setActiveTab("candidatos_relacionados");
        clearStateCache();
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeWindow();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (showHistorico) {
            const vagaEncontrada = vagas?.find((vaga) => vaga.NR_VAGA === showHistorico.vaga);
            const nomeCargo = vagaEncontrada ? vagaEncontrada.NM_CARGO : false;
            if (showHistorico.vaga && nomeCargo && showHistorico.tab) {
                getCandidatosVaga(showHistorico.vaga, nomeCargo);
                setActiveTab(showHistorico.tab);
            }
        }
    }, [showHistorico]);

    return (
        <div
            id="minhas-vagas"
            className={cn(`grid grid-cols-12 rounded overflow-y-auto overflow-x-hidden gap-x-2`)}
        >
            {!maximizeMinimize && (
                <div className={cn(`col-span-12 shadow min-h-[400px] relative`, nrVagaOnView ? "md:col-span-7" : "md:col-span-12")}>
                    <TableMinhasVagas
                        data={vagasDataModificada}
                        isVagasLoading={isVagasLoading}
                        dense={true}
                        active={true}
                        getCandidatosVaga={getCandidatosVaga}
                        getHistoricoVaga={getHistoricoVaga}
                        vagaDetalheOnView={vagaDetalheOnView}
                        setVagaDetalheOnView={setVagaDetalheOnView}
                        setFilteredData={setFilteredData}
                        filteredData={filteredData}
                        nrVagaOnView={nrVagaOnView}
                        toggleView={toggleView}
                        setToggleView={setToggleView}
                        setPageView={setPageView}
                        pageView={pageView}
                        closeRightWindow={closeWindow}
                        refreshTab={refreshTab}
                        isRecrutamento={isRecrutamento}
                        renderizadoPorGerencial={false}
                        atualizaDetalhesVaga={atualizaDetalhesVaga}
                    />
                </div>
            )}
                <div className={cn(`col-span-12 shadow`, maximizeMinimize ? "md:col-span-12 z-[51]" : "md:col-span-5", !empty(nrVagaOnView) && pageView == "vaga" ? "" : "hidden")}>
                    <div className="grid grid-cols-12 rounded relative">
                        <div className="col-span-12 bg-blue-600 py-0.5 xl:py-2 pl-2 pr-1 rounded-t-lg h-8">
                            <div className="grid grid-cols-12">
                                <div className="col-span-9 text-white text-sm truncate content-center">
                                    <span className="font-semibold">{nrVagaOnView}</span> -{" "}
                                    <span className="italic">{nmCargoOnView}</span>
                                </div>
                                <div className="col-span-3 text-right">
                                    {maximizeMinimize && (
                                        <Button
                                            className={`hover:bg-drop-shadow-2 text-white`}
                                            size="small"
                                            pill
                                            onClick={() => {
                                                setMaximizeMinimize(!maximizeMinimize);
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={faDownLeftAndUpRightToCenter}
                                                width="16"
                                                height="16"
                                            />
                                        </Button>
                                    )}
                                    {!maximizeMinimize && (
                                        <Button
                                            className={`hover:bg-drop-shadow-2 text-white`}
                                            size="small"
                                            pill
                                            onClick={() => {
                                                setMaximizeMinimize(!maximizeMinimize);
                                            }}
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
                                        onClick={() => {
                                            closeWindow();
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faClose} width="16" height="16" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <CandidatosVaga
                            nrVagaCliente={nrVagaOnView}
                            nmCargo={nmCargoOnView}
                            init={pageView == "vaga"}
                            activeTab={activeTab}
                            setVagaDetalheOnView={setVagaDetalheOnView}
                            tabName="SelecaoEntrar"
                            setToggleView={setToggleView}
                            toggleView={toggleView}
                            atualizaDetalhesVaga={setAtualizaDetalhesVaga}
                        />
                    </div>
                </div>

            {nrVagaOnView && pageView == "historico" && (
                <div className="col-span-12 md:col-span-5 shadow">
                    <HistoricoVaga
                        nrVagaCliente={nrVagaOnView}
                        label={`${nrVagaOnView} - ${nmCargoOnView}`}
                        closeWindowCallback={() => {
                            closeWindow();
                        }}
                    />
                </div>
            )}
        </div>
    );
};
export default MinhasVagas;
