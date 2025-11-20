import Button from "@/components/buttons/Button";
import ButtonGroup from "@/components/buttons/ButtonGroup";
import ButtonToggle from "@/components/buttons/ButtonToggle";
import PillsBadge from "@/components/buttons/PillsBadge";
import CurriculoResumido from "@/components/candidatos/CurriculoResumido";
import TableVagasEncaminhado from "@/components/candidatos/tables/TableVagasEncaminhado";
import TableVagasRelacionadoWeb from "@/components/candidatos/tables/TableVagasRelacionadoWeb";
import InputText from "@/components/inputs/InputText";
import Loading from "@/components/Layouts/Loading";
import { default as Modal, default as ModalGrid } from "@/components/Layouts/ModalGrid";
import NoDataFound from "@/components/Layouts/NoDataFound";
import PageTabs from "@/components/Layouts/PageTabs";
import { useAppContext } from "@/context/AppContext";
import axiosInstance from "@/plugins/axios";
import {
    faCalendarCheck,
    faHistory,
    faMars,
    faThumbsDown,
    faUserEdit,
    faUserPlus,
    faVenus,
    faWheelchair
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import DadosAgendamento from "./DadosAgendamento";

const CandidatosWeb = ({ data, active, refreshList, tabName, situacaoVaga }) => {
    const { candidatosWebReady } = useAppContext();
    const [cdPessoaCandidatoViewHistoricoVaga, setCdPessoaCandidatoViewHistoricoVaga] = useState("");
    const [nmPessoaCandidatoViewHistoricoVaga, setNmPessoaCandidatoViewHistoricoVaga] = useState("");
    const [cdPessoaCurriculoResumido, setCdPessoaCurriculoResumido] = useState("");
    const [modalRelacionaCanidato, setmodalRelacionaCanidato] = useState(false);
    const [modalAgendamento, setmodalAgendamentoControl] = useState(false);
    const [modalHistoricoVagas, setmodalHistoricoVagas] = useState(false);
    const [filter, setFilter] = useState({ filtro_candidatos_web: "" });
    const [salvarAgendamento, setsalvarAgendamento] = useState(false);
    const [isVagaCongelada, setIsVagaCongelada] = useState(true);
    const [formIdVisto, setformIdVisto] = useState([]);
    const { toast, openPageTab, user, sendWebSocketMessage } = useAppContext();
    const [formRelacionaCandidato, setformRelacionaCandidato] = useState({
        nm_pessoa: "",
        cd_pessoa_candidato: "",
        nr_vaga: "",
    });
    const [dynamicTabs, setDynamicTabs] = useState([]);
    const [pageTabs, setPageTabs] = useState([
        {
            name: "Relacionado WEB",
            id: "relacionado_web",
            active: true,
        },
        {
            name: "Encaminhado",
            id: "encaminhado",
            active: false,
        },
    ]);

    const [formAgendamento, setformAgendamento] = useState({
        cd_pessoa: "",
        cd_pessoa_cliente: "",
        nm_cliente: "",
        isFromOpenJob: false,
    });

    const changeTab = (nmTab) => {
        setPageTabs(pageTabs.map((tab) => { tab.active = nmTab == tab.id; return tab; }));
    }

    const setFilterTextCallback = (id, value) => {
        setFilter({ [id]: value });
    }

    const candidatosWeb = useMemo(() => {
        return data.filter((item) =>
            Object.values(item).some(
                (v) =>
                    typeof v === "string" &&
                    v.toLowerCase().includes(filter.filtro_candidatos_web.toLowerCase())
            )
        );
    }, [filter, data]);

    function populaFormVisto() {
        setformIdVisto(
            candidatosWeb.map((cand) => {
                return {
                    checked: cand.ID_VISTO === "S",
                    cdPessoaCandidato: cand.CD_PESSOA_CANDIDATO,
                };
            })
        );
    }

    useEffect(() => {
        if (!candidatosWeb) return;
        populaFormVisto();
    }, [candidatosWeb]);

    useEffect(() => {
        if (situacaoVaga == 13) {
            setIsVagaCongelada(true);
            return;
        }
        setIsVagaCongelada(false);
    }, [situacaoVaga, candidatosWebReady]);

    const updateIdVistoStatus = (cdPessoaCandidato, checked) => {
        const updatedCandidates = formIdVisto.map((candidate) => {
            if (candidate.cdPessoaCandidato === cdPessoaCandidato) {
                return { ...candidate, checked: checked };
            }
            return candidate;
        });
        setformIdVisto(updatedCandidates);
    };

    const setModalAgendamento = useCallback(
        (cd_pessoa_candidato, cd_pessoa_cliente, nm_cliente) => {
            setformAgendamento({
                ...formAgendamento,
                cd_pessoa: cd_pessoa_candidato,
                isFromOpenJob: true,
                cd_pessoa_cliente,
                nm_cliente,
            });
            setmodalAgendamentoControl(true);
        }
    );

    const clearModalContent = useCallback(() => {
        setmodalAgendamentoControl(false);
        setformAgendamento({
            cd_pessoa: "",
            cd_pessoa_cliente: "",
            nm_cliente: "",
            isFromOpenJob: false,
        });
    });

    const afterSaveCallback = (cd_usuario_atendimento) => {
        //Fechar o modal
        clearModalContent();
        //Disparar notificação WebSocket
        sendWebSocketMessage('agenda', user.user_sip);
    };

    const curriculoResumidoCallback = () => {
        setCdPessoaCurriculoResumido("");
    };

    const descartarCandidatosVistos = (nr_vaga) => {
        axiosInstance.post(`vaga/descartar-candidatos-vistos-web`,{
                nr_vaga: nr_vaga,
            }            
        ).then(function (response) {
            if (response.status === 200) {
                toast.success("Candidatos vistos descartados com sucesso");
                refreshList();
            }
        }).catch(function (resp) {
            let error = resp?.response?.data?.error;
            if (Array.isArray(error)) {
                return toast.error(error.join(" ") || "OOps ocorreu um erro");
            }
            return toast.error(error || "OOps ocorreu um erro");
        });
    }

    const atualizaCandVisto = useCallback((cd_pessoa_candidato, nr_requisicao, id_visto) => {
        updateIdVistoStatus(cd_pessoa_candidato, id_visto == "S" ? true : false);
        axiosInstance
            .post(`vaga/atualiza-candidato-visto`, {
                nr_requisicao: nr_requisicao,
                cd_pessoa_candidato: cd_pessoa_candidato,
                id_visto: id_visto,
            })
            .then(function (response) {
                if (response.status === 200) {
                    return toast.success(`${cd_pessoa_candidato} atualizado`);
                }
                return toast.error("Não foi possível atualizar o status  de visto");
            })
            .catch(function (error) {
                toast.error("Não foi possível atualizar o status  de visto");
                console.error(error);
            });
    });

    const descartarCandidatoWeb = (cd_pessoa_candidato, nr_requisicao, nr_vaga) => {
        axiosInstance
            .post(`vaga/descartar-candidato-web`, {
                cd_pessoa_candidato: cd_pessoa_candidato,
                nr_requisicao: nr_requisicao,
                nr_vaga: nr_vaga,
            })
            .then(function (response) {
                toast.success(`${cd_pessoa_candidato} descartado`);
                if (typeof refreshList === "function") {
                    refreshList();
                }
            })
            .catch(function (error) {
                toast.error("Não foi possível descartar o candidato");
                console.error(error);
            });
    };

    const agendarCandidato = (cd_pessoa_candidato, cd_pessoa_cliente, nm_cliente) => {
        setModalAgendamento(cd_pessoa_candidato, cd_pessoa_cliente, nm_cliente);
    };

    const editarDadosCandidato = useCallback(
        (cd_pessoa_candidato) => {
            openPageTab({
                id: "DadosCandidato",
                name: `Dados do candidato`,
                props: {
                    cdPessoaCandidato: cd_pessoa_candidato,
                    nm_tab: tabName,
                },
            });
        },
        [openPageTab]
    );

    const relacionarCandidato = (nm_pessoa, cd_pessoa_candidato, nr_vaga) => {
        setformRelacionaCandidato({
            ...formRelacionaCandidato,
            nm_pessoa: nm_pessoa,
            cd_pessoa_candidato: cd_pessoa_candidato,
            nr_vaga: nr_vaga,
        });
        setmodalRelacionaCanidato(true);
    };

    function relacionarVaga(cd_estagio_vaga){
        if (!confirm("Realmente deseja relacionar o candidato a vaga?")) return;
        axiosInstance
            .post("vaga/relacionar-candidato", {
                cd_pessoa_candidato: formRelacionaCandidato.cd_pessoa_candidato,
                nr_vaga: formRelacionaCandidato.nr_vaga,
                cd_estagio_vaga,
            })
            .then(function (response) {
                if (response.data.error) {
                    toast.error(response.data.message);
                    return;
                }

                toast.success("Candidato relacionado com sucesso!");
                setmodalRelacionaCanidato(false);
                if (typeof refreshList === "function") {
                    refreshList();
                }
            })
            .catch(function (error) {
                toast.error("Não foi possível relacionar o candidato");
                console.error(error);
            });
    };

    const modalActions = () => {
        return (
            <>
                <Button
                    className="mx-2"
                    buttonType="success"
                    onClick={() => {
                        setsalvarAgendamento(true);
                    }}
                >
                    SALVAR
                </Button>
            </>
        );
    };

    const [candidatosLiberados, setCandidatosLiberados] = useState({});
    useEffect(() => {
        async function fetchLiberacoes() {
            if (!Array.isArray(candidatosWeb) || candidatosWeb.length === 0) return;

            const cdPessoas = candidatosWeb.map(c => c.CD_PESSOA_CANDIDATO);
            try {
                const response = await axiosInstance.post(`vaga/pode-relacionar-candidatos-nova-vaga`, {
                    cd_pessoas: cdPessoas,
                });

                setCandidatosLiberados(response.data);
            } catch (e) {
                const fallback = {};
                cdPessoas.forEach(cd => fallback[cd] = false);
                setCandidatosLiberados(fallback);
            }
        }

        fetchLiberacoes();
    }, [candidatosWeb]);

    const dataToHml = () => {
        if (!(candidatosWeb?.length > 0)) return <NoDataFound isLoading={!candidatosWebReady} />;

        return candidatosWeb.map((cand) => {
            var action = () => {
                return [
                    {
                        tooltip: `${cand.POSSUI_RELACIONAMENTO == "RELACIONADO" ||
                            !candidatosLiberados[cand.CD_PESSOA_CANDIDATO]
                            ? "Candidato já relacionado"
                            : "Relacionar"
                            }`,
                        id: "btn-relacionar-cand",
                        label: (
                            <FontAwesomeIcon
                                icon={faUserPlus}
                                width="15"
                                height="15"
                                className={`${cand.POSSUI_RELACIONAMENTO == "RELACIONADO" ||
                                    !candidatosLiberados[cand.CD_PESSOA_CANDIDATO] ||
                                    isVagaCongelada
                                    ? "text-slate-400"
                                    : "text-green-500"
                                    }`}
                            />
                        ),
                        onclick: () => {
                            if (isVagaCongelada) {
                                return toast.warning("Vaga congelada, não é possível relacionar candidatos");
                            }
                            if (cand.POSSUI_RELACIONAMENTO == "RELACIONADO" ||
                                !candidatosLiberados[cand.CD_PESSOA_CANDIDATO]                                
                            )
                                return toast.info("Candidato " + cand.NM_PESSOA + " já relacionado");
                            relacionarCandidato(
                                cand.NM_PESSOA,
                                cand.CD_PESSOA_CANDIDATO,
                                cand.NR_VAGA
                            );
                        },
                        className:(isVagaCongelada ? "cursor-not-allowed" :""),
                    },
                    {
                        tooltip: "Agendar",
                        id: "btn-agenda-cand",
                        label: (
                            <FontAwesomeIcon
                                icon={faCalendarCheck}
                                width="15"
                                height="15"
                                className={isVagaCongelada ? "text-blue-300" :"text-primary"}
                            />
                        ),
                        onclick: () => {
                            if (isVagaCongelada) {
                                return toast.warning("Vaga congelada, não é possível agendar candidatos");
                            }
                            agendarCandidato(
                                cand.CD_PESSOA_CANDIDATO,
                                cand.CD_PESSOA_CLIENTE,
                                cand.NM_CLIENTE
                            );
                        },
                        className:(isVagaCongelada ? "cursor-not-allowed" :""),
                    },
                    {
                        tooltip: "Descartar",
                        id: "btn-reprova-cand",
                        label: (
                            <FontAwesomeIcon
                                icon={faThumbsDown}
                                width="15"
                                height="15"
                                className={isVagaCongelada ? "text-red-300" : "text-danger"}
                            />
                        ),
                        onclick: () => {
                            if (isVagaCongelada) {
                                return toast.warning("Vaga congelada, não é possível descartar candidatos");
                            }
                            descartarCandidatoWeb(cand.CD_PESSOA_CANDIDATO, cand.NR_REQUISICAO, cand.NR_VAGA);
                        },
                        className:(isVagaCongelada ? "cursor-not-allowed" :""),
                    },
                    {
                        tooltip: "Historico de vagas",
                        id: "btn-historico-cand",
                        label: (
                            <FontAwesomeIcon
                                icon={faHistory}
                                width="15"
                                height="15"
                                className="text-primary"
                            />
                        ),
                        onclick: () => {
                            setCdPessoaCandidatoViewHistoricoVaga(cand.CD_PESSOA_CANDIDATO);
                            setNmPessoaCandidatoViewHistoricoVaga(cand.NM_PESSOA);
                        },
                    },
                    {
                        tooltip: "Dados do candidato",
                        id: "btn-edit-cand",
                        label: (
                            <FontAwesomeIcon
                                icon={faUserEdit}
                                width="15"
                                height="15"
                                className="text-primary"
                            />
                        ),
                        onclick: () => {
                            editarDadosCandidato(cand.CD_PESSOA_CANDIDATO);
                        },
                    },
                ];
            };

            return (
                <div
                    className="grid grid-cols-12 odd:bg-white even:bg-gray-200 border-b border-slate-300 gap-x-1 p-2 text-sm xl:text-base"
                    key={cand.CD_PESSOA_CANDIDATO}
                >
                    <div className="col-span-12 xl:col-span-6">
                        <div className="grid grid-cols-1 gap-y-1">
                            <div className="flex flex-row gap-x-2">
                                <div className="flex items-center">
                                    <span className="text-xs text-slate-500">SIP:</span>
                                    &nbsp;
                                    <span className="text-primary">{cand.CD_PESSOA_CANDIDATO}</span>
                                    <Rating
                                        style={{ maxWidth: "80px", height: "16px" }}
                                        value={cand.NOTA / 2 || 0}
                                        className="ml-2"
                                        readOnly
                                    />
                                </div>
                                <div className="flex items-center">
                                    <ButtonToggle
                                        small
                                        primary
                                        disabled={isVagaCongelada}
                                        labelOn={`Visto`}
                                        LabelOff="Não visualizado"
                                        onChange={(id, value, checked) => {
                                            atualizaCandVisto(
                                                cand.CD_PESSOA_CANDIDATO,
                                                cand.NR_REQUISICAO,
                                                checked ? "S" : "N"
                                            );
                                        }}
                                        checked={
                                            formIdVisto.find(
                                                (item) =>
                                                    item.cdPessoaCandidato == cand.CD_PESSOA_CANDIDATO
                                            )?.checked || false
                                        }
                                        id={`visualiza-${cand.CD_PESSOA_CANDIDATO}`}
                                    />
                                </div>
                            </div>
                            <div>
                                {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                                <span
                                    className="font-semibold cursor-pointer text-primary hover:underline inline-flex items-center"
                                    onClick={() => {
                                        setCdPessoaCurriculoResumido(cand.CD_PESSOA_CANDIDATO);
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={cand.ID_SEXO === "M" ? faMars : faVenus}
                                        width="20"
                                        height="20"
                                        className={`${cand.ID_SEXO === "M" ? "text-primary" : "text-pink-500"}`}
                                    />
                                    {cand.NM_PESSOA}
                                </span>
                            </div>
                            <div className="italic text-xs">{cand.NM_BAIRRO + " - " + cand.NM_CIDADE}</div>
                        </div>
                    </div>

                    <div className="col-span-12 xl:col-span-6">
                        <div className="grid grid-cols-1 gap-y-1">
                            <div>
                                <span className="text-xs text-slate-500">Relacionado:</span>{" "}
                                <span className="text-sm">{cand.DT}</span>
                            </div>
                            <div className="flex">
                                <ButtonGroup buttons={action()} small />
                                {cand?.ID_POSSUE_DEFICIENCIA == 'S' && (
                                    <div>
                                        <PillsBadge
                                            type="warning"
                                            className="inline-flex items-center ml-2">
                                            PCD
                                            <FontAwesomeIcon
                                                icon={faWheelchair}
                                                width="12"
                                                height="12"
                                                className='ml-1'
                                            />
                                        </PillsBadge>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    };

    if (!active) return null;

    return (
        <>
            <div className={`grid grid-cols-12 max-h-[700px] pr-2 overflow-y-auto bg-white`}>
                <div className="col-span-12 px-2 shadow-lg z-20">
                    <div className="grid grid-cols-12 py-2">
                        {candidatosWeb.length > 0 && (
                            <div className="col-start-4 col-span-3">
                                <Button
                                    className="mx-2"
                                    buttonType="primary"
                                    disabled={isVagaCongelada}   
                                    onClick={() => {
                                        descartarCandidatosVistos(candidatosWeb[0]?.NR_VAGA);
                                    }}
                                >
                                    Descartar Vistos
                                </Button>
                            </div>
                        )}
                        
                        <div className="col-start-7 col-span-6">
                            <InputText
                                placeholder="Filtrar"
                                clearable={true}
                                onChange={setFilterTextCallback}
                                id="filtro_candidatos_web"
                                helperText={`Exibindo ${candidatosWeb.length} registros`}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-span-12 max-h-[400px] xl:max-h-[500px] overflow-y-auto relative">
                    {dataToHml()}
                </div>
            </div>

            <CurriculoResumido cdPessoaCandidato={cdPessoaCurriculoResumido} closeCallback={curriculoResumidoCallback} tabName={tabName} />

            <Modal
                size={"sm"}
                btnCancel
                height={"h-fit"}
                footerClass={`text-right`}
                id={"modal-relaciona-candidato"}
                modalControl={modalRelacionaCanidato}
                setModalControl={setmodalRelacionaCanidato}
                title={"Relacionar candidato"}
            >
                <div className="col-span-12">
                    <div className="grid grid-cols-1 gap-y-2">
                        <div className="font-semibold text-xl text-center">
                            {formRelacionaCandidato.nm_pessoa}
                        </div>
                        <div>
                            <Button block buttonType="primary" onClick={() => {relacionarVaga(3)}}>
                                Em análise (Relacionar a vaga)
                            </Button>
                        </div>
                        <div>
                            <Button block buttonType="primary" onClick={() => {relacionarVaga(4)}}>
                                Enviar Currículo
                            </Button>
                        </div>
                        <div>
                            <Button block buttonType="primary" onClick={() => {relacionarVaga(5)}}>
                                Encaminhar candidato
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                height
                size="md"
                title="Histórico de vaga do candidato"
                btnCancel={"FECHAR"}
                footerClass={`text-right`}
                id={"modal-vagas-relacionado"}
                modalControl={modalHistoricoVagas}
                closeModalCallback={() => {
                    setCdPessoaCandidatoViewHistoricoVaga("");
                    setNmPessoaCandidatoViewHistoricoVaga("");
                }}
                setModalControl={setmodalHistoricoVagas}
            >
                <div className="col-span-12">
                    <div className="grid grid-cols-1">
                        <PageTabs pageTabs={pageTabs} onClick={changeTab} />
                        <div
                            className={`${pageTabs.find((tab) => tab.id === "relacionado_web").active
                                ? ""
                                : "hidden"
                                }`}
                        >
                            <TableVagasRelacionadoWeb
                                cdPessoaCandidato={cdPessoaCandidatoViewHistoricoVaga}
                                nmCandidato={nmPessoaCandidatoViewHistoricoVaga}
                            />
                        </div>
                        <div
                            className={`${pageTabs.find((tab) => tab.id === "encaminhado").active
                                ? ""
                                : "hidden"
                                }`}
                        >
                            <TableVagasEncaminhado
                                cdPessoaCandidato={cdPessoaCandidatoViewHistoricoVaga}
                                nmCandidato={nmPessoaCandidatoViewHistoricoVaga}
                            />
                        </div>
                        {dynamicTabs?.map((dnTab) => {
                            return dnTab;
                        })}
                    </div>
                </div>
            </Modal>

            <ModalGrid
                modalControl={modalAgendamento}
                setModalControl={setmodalAgendamentoControl}
                size="sm"
                height="h-full"
                btnCancel="CANCELAR"
                title={"Novo Agendamento"}
                footer={modalActions()}
                footerClass={`text-right`}
                closeModalCallback={clearModalContent}
            >
                <DadosAgendamento
                    active={modalAgendamento}
                    handleSave={salvarAgendamento}
                    handleSaveFn={setsalvarAgendamento}
                    afterSaveCallback={afterSaveCallback}
                    isFromOpenJob={formAgendamento.isFromOpenJob}
                    cdPessoa={formAgendamento.cd_pessoa}
                    cdPessoaCliente={formAgendamento.cd_pessoa_cliente}
                    nmCliente={formAgendamento.nm_cliente}
                    triggerClearFields={!modalAgendamento}
                />
            </ModalGrid>
        </>
    );
};
export default CandidatosWeb;
