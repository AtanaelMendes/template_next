import {
    faClose,
    faDownLeftAndUpRightToCenter,
    faUpRightAndDownLeftFromCenter,
} from "@fortawesome/free-solid-svg-icons";
import CandidatosVaga from "@/components/selecao/entrar/CandidatosVaga";
import HistoricoVaga from "@/components/selecao/entrar/HistoricoVaga";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableMinhasVagas from "@/components/selecao/entrar/tables/TableMinhasVagas";
import { useCallback, useEffect, useState } from "react";
import { empty } from "@/assets/utils.js";
import Button from "@/components/buttons/Button";
import axiosInstance from "@/plugins/axios";
import { useAppContext } from "@/context/AppContext";
import { foraDaValidade } from "@/assets/regraPauloGoes";
import Blockquote from "@/components/Layouts/Blockquote";
import MinhasVagasNoventaDias from "@/pages/selecao/MinhasVagasNoventaDias";

const VagasSelecao = ({ active, reload, aplicarFiltros, filtrosPesquisa, customHeight }) => {
    const { toast, loader, user } = useAppContext();
    const [maximizeMinimize, setMaximizeMinimize] = useState(false);
    const [vagas, setVagas] = useState([]);
    const [vagasComMaisDeNoventaDias, setVagasComMaisDeNoventaDias] = useState([]);
    const [isVagasLoading, setIsVagasLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [ready, setReady] = useState(false);
    const [nrVagaOnView, setNrVagaOnView] = useState("");
    const [vagaDetalheOnView, setVagaDetalheOnView] = useState(null);
    const [nmCargoOnView, setNmCargoOnView] = useState("");
    const [pageView, setPageView] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [toggleView, setToggleView] = useState(null);

    const getVagasSelecaoGerencial = useCallback(async () => {
        if (vagas.length === 0) loader().show();

        await axiosInstance
            .post(`vaga/vagas-selecao-gerencial`, {
                ...filtrosPesquisa,
            })
            .then(function (response) {
                setVagas(response.data);
            })
            .catch(function (error) {
                loader().hide();
                toast.error("Não foi possível carregar suas vagas.");
                console.error(error);
            })
            .finally(() => {
                setIsVagasLoading(false);
            });
    }, [filtrosPesquisa, vagas]);

    const getHistoricoVaga = useCallback((nrVaga, nm_cargo) => {
        setNrVagaOnView(nrVaga);
        setNmCargoOnView(nm_cargo);
        setPageView("historico");
    });

    useEffect(() => {
        if (active && aplicarFiltros) {
            setVagas([]);
            (async () => {
                setIsVagasLoading(true);
                await getVagasSelecaoGerencial();
            })();
        }
    }, [active, reload, aplicarFiltros]);

    const getCandidatosVaga = (nrVaga, nm_cargo) => {
        setNrVagaOnView(nrVaga);
        setNmCargoOnView(nm_cargo);
        setPageView("vaga");
        setReady(true);
    };

    const mountTableData = () => {
        setTableData(
            vagas?.map((vaga) => {
                return {
                    nr_vaga: vaga.NR_VAGA,
                    nr_requisicao: vaga.NR_REQUISICAO,
                    nm_cargo: vaga.NM_CARGO,
                    cd_pessoa_cliente: vaga.CD_PESSOA,
                    cd_empresa_cliente: vaga.CD_EMPRESA,
                    nm_apelido_cliente: vaga.NM_APELIDO_CLIENTE,
                    cd_situacao_vaga: vaga.CD_SITUACAO_VAGA,
                    qt_candidatos_estagio: vaga.QT_CANDIDATOS_ESTAGIO,
                    nm_situacao_vaga: vaga.NM_SITUACAO_VAGA,
                    qt_dias_abertura: vaga.QT_DIAS_ABERTURA,
                    qt_dias_estacionada: vaga.QT_DIAS_ESTACIONADA,
                    cd_empresa_agrupadora: vaga?.CD_EMPRESA_AGRUPADORA,
                };
            })
        );
    };

    const filterVagas = async () => {
        await getVagasSelecaoGerencial();
    };

    useEffect(() => {
        if (empty(vagas)) return;
        const vgNoventaDias = vagas.filter((vg) => {
            return Number(vg.CD_PESSOA_ANALISTA) === Number(user.cd_sip) && foraDaValidade(Number(vg.CD_EMPRESA), Number(vg.CD_SITUACAO_VAGA), Number(vg.QT_DIAS_ABERTURA), vg.DT_ABERTURA, vg.DT_PRORROGACAO)
        });
        

        console.log("Vagas com mais de 90 dias:", vgNoventaDias);
        setVagasComMaisDeNoventaDias(vgNoventaDias);
    }, [vagas]);

    useEffect(() => {
        mountTableData();
        loader().hide();
    }, [vagas]);

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

    return (
        <>
            {/* REGRA DO PAULO GOES */}
                <div className={`flex flex-col w-full h-full relative ${vagasComMaisDeNoventaDias.length > 0 ? "" : "hidden"}`}>
                    <div className="p-2 text-right">
                        <Blockquote type={"danger"}>É necessario cancelar ou prorrogar as vagas abaixo.</Blockquote>
                    </div>
                    <div className="overflow-y-auto max-h-full pb-100">
                        <MinhasVagasNoventaDias vagas={vagasComMaisDeNoventaDias} reloadCallback={filterVagas} />
                    </div>
                </div>
            {/* REGRA DO PAULO GOES */}

            {vagasComMaisDeNoventaDias.length === 0 && <div id="minhas-vagas" className={`grid grid-cols-12 rounded ${active ? "flex" : "hidden"} overflow-y-auto gap-x-2`}>
                <div className={`col-span-12 shadow ${ nrVagaOnView ? "md:col-span-6" : "md:col-span-12"} ${maximizeMinimize ? "hidden" : ""} overflow-y-hidden max-h-[85vh]`}>
                    <TableMinhasVagas
                        getCandidatosVaga={getCandidatosVaga}
                        getHistoricoVaga={getHistoricoVaga}
                        data={tableData}
                        customHeight={customHeight}
                        setVagaDetalheOnView={setVagaDetalheOnView}
                        vagaDetalheOnView={vagaDetalheOnView}
                        active={active}
                        setFilteredData={setFilteredData}
                        filteredData={filteredData}
                        isVagasLoading={isVagasLoading}
                        nrVagaOnView={nrVagaOnView}
                        toggleView={toggleView}
                        setToggleView={setToggleView}
                        closeRightWindow={closeWindow}
                        setPageView={setPageView}
                        renderizadoPorGerencial={true}
                    />
                </div>

                <div className={`col-span-12 shadow ${maximizeMinimize ? "md:col-span-12" : "md:col-span-6"} ${!empty(nrVagaOnView) && pageView == "vaga" ? "" : "hidden"}`}>
                    <div className="grid grid-cols-12 rounded relative">
                        <div className="col-span-12 bg-blue-600 py-1 pl-2 pr-1 rounded-t-lg h-8">
                            <div className="grid grid-cols-12">
                                <div className="col-span-10 text-white">
                                    <span className="font-semibold text-sm">{nrVagaOnView}</span> -{" "}
                                    <span className="italic">{nmCargoOnView}</span>
                                </div>
                                <div className="col-span-2 text-right">
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
                            init={ready}
                            nrVagaCliente={nrVagaOnView}
                            nmCargo={nmCargoOnView}
                            tabName="SelecaoGerencial"
                            setVagaDetalheOnView={setVagaDetalheOnView}
                            setToggleView={setToggleView}
                            toggleView={toggleView}
                        />
                    </div>
                </div>

                {nrVagaOnView && pageView == "historico" && (
                    <div className="col-span-12 md:col-span-6 shadow">
                        <HistoricoVaga
                            nrVagaCliente={nrVagaOnView}
                            label={`${nrVagaOnView} - ${nmCargoOnView}`}
                            closeWindowCallback={() => {
                                closeWindow();
                            }}
                        />
                    </div>
                )}
            </div>}
        </>
    );
};
export default VagasSelecao;
