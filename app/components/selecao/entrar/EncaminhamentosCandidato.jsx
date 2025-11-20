import { faClose, faDownLeftAndUpRightToCenter, faUpRightAndDownLeftFromCenter } from "@fortawesome/free-solid-svg-icons";
import CandidatosVaga from "@/components/selecao/entrar/CandidatosVaga";
import HistoricoVaga from "@/components/selecao/entrar/HistoricoVaga";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableEncaminhamentos from "./TableEncaminhamentos";
import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Button from "@/components/buttons/Button";
import axiosInstance from "@/plugins/axios";
import { cn } from "@/assets/utils";

const EncaminhamentosCandidato = ({ active, reload, cdPessoaCandidato, isVagasLoading }) => {
    const [activeTab, setActiveTab] = useState("candidatos_relacionados");
    const [vagaDetalheOnView, setVagaDetalheOnView] = useState(null);
    const [maximizeMinimize, setMaximizeMinimize] = useState(false);
    const [nmCargoOnView, setNmCargoOnView] = useState("");
    const { showHistorico, user, toast } = useAppContext();
    const [filteredData, setFilteredData] = useState([]);
    const [nrVagaOnView, setNrVagaOnView] = useState("");
    const [toggleView, setToggleView] = useState(null);
    const [pageView, setPageView] = useState("");
    const [vagas, setVagas] = useState([]);

    useEffect(() => {
        if (active) {
            getEncaminhamentos();
        }
    }, [reload, active]);

    const getEncaminhamentos = () => {
        if (cdPessoaCandidato == 0) {
            setVagas([]);
            return;
        }

        axiosInstance
            .get(`candidato/encaminhamentos/${cdPessoaCandidato}/${user.cd_sip}`)
            .then(function (response) {
                setVagas(response.data);
            })
            .catch(function (error) {
                toast.error("Não foi possível carregar os encaminhamentos.");
                console.error(error);
            });
    };

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

    const closeWindow = () => {
        setNrVagaOnView("");
        setNmCargoOnView("");
        setPageView("");
        setMaximizeMinimize(false);
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
            className={cn(`grid grid-cols-12 rounded overflow-y-auto overflow-x-hidden gap-x-2`, active ? '' : 'hidden')}
        >
            {!maximizeMinimize && (
                <div
                    className={cn(
                        `col-span-12 shadow min-h-[400px] relative`,
                        nrVagaOnView ? "md:col-span-7" : "md:col-span-12"
                    )}
                >
                    <TableEncaminhamentos
                        data={vagas}
                        pageView={pageView}
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
                    />
                </div>
            )}

            {nrVagaOnView && pageView == "vaga" && (
                <div className={cn(`col-span-12 shadow`, maximizeMinimize ? "md:col-span-12 z-[51]" : "md:col-span-5")}>
                    <div className="grid grid-cols-12 rounded relative">
                        <div className="col-span-12 bg-blue-600 py-0.5 xl:py-2 pl-2 pr-1 rounded-t-lg h-8">
                            <div className="grid grid-cols-12">
                                <div className="col-span-9 text-white">
                                    <span className="font-semibold text-sm">{nrVagaOnView}</span>
                                    <span className="italic">{nmCargoOnView ? ' - ' + nmCargoOnView : ''}</span>
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
                            init={true}
                            activeTab={activeTab}
                            setVagaDetalheOnView={setVagaDetalheOnView}
                            tabName="SelecaoEntrar"
                            setToggleView={setToggleView}
                            toggleView={toggleView}
                        />
                    </div>
                </div>
            )}

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
export default EncaminhamentosCandidato;
