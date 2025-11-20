import { faCalendarDays, faThumbsUp, faThumbsDown } from "@fortawesome/free-regular-svg-icons";
import CurriculoResumido from "@/components/candidatos/CurriculoResumido";
import RelacionarCandidato from "../selecao/entrar/RelacionarCandidato";
import DadosAgendamento from "../selecao/entrar/DadosAgendamento";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRecycle, faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { TooltipComponent } from "../Layouts/TooltipComponent";
import { Caption } from "@/components/Layouts/Typography";
import { useCallback, useEffect, useRef, useState } from "react";
import Clipboard from '@/components/Layouts/Clipboard';
import VagaResumida from "../candidatos/VagaResumida";
import { useAppContext } from "@/context/AppContext";
import ButtonToggle from "../buttons/ButtonToggle";
import NoDataFound from "../Layouts/NoDataFound";
import ModalGrid from "../Layouts/ModalGrid";
import axiosInstance from "@/plugins/axios";
import Confirm from "../Layouts/Confirm";
import Button from "../buttons/Button";
import Dialog from "../Layouts/Dialog";
import { cn } from "@/assets/utils";
import Loading from "../Layouts/Loading";
import Vaga from "@/components/vagas/Vaga";
import ReciclarCandidato from "./autoatendimento/ReciclarCandidato";

const Autoatendimento = ({ candidatos, active, reload, reloadDataFunction, ready, setReady }) => {
    let timeoutId = null;
    let timeoutIdVaga = null;
    const candidatosRef = useRef([]);
    const tabName = "recrutamentoAutoatendimento";
    const [nrVagaOnView, setNrVagaOnView] = useState("");
    const [candidatosLista, setCandidatosLista] = useState([]);
    const [dadosAtendimento, setDadosAtendimento] = useState("");
    const [modalAgendamento, setmodalAgendamento] = useState(false);
    const [modalReciclagem, setModalReciclagem] = useState(false);
    const [salvarAgendamento, setsalvarAgendamento] = useState(false);
    const [showConfirmAtendeCand, setShowConfirmAtendeCand] = useState(false);
    const [showDialogReprovarCand, setShowDialogReprovarCand] = useState(false);
    const [showRelacionarCandidato, setShowRelacionarCandidato] = useState(false);
    const [showConfirmEncerraAtend, setShowConfirmEncerraAtend] = useState(false);
    const [showConfirmNaoCompareceu, setShowConfirmNaoCompareceu] = useState(false);
    const [cdPessoaCurriculoResumido, setCdPessoaCurriculoResumido] = useState("");
    const [formAgendamento, setformAgendamento] = useState({
        cd_pessoa: "",
        nm_pessoa: "",
        nr_vaga: "",
    });

    const [formReciclagem, setFormReciclagem] = useState({
        cd_pessoa_candidato: "",
        nr_vaga: "",
        data_agenda: "",
    });

    const { user, toast, openPageTab, setLastTab, addTabWithComponent, sendWebSocketMessage, onWebSocketMessage } = useAppContext();

    useEffect(() => {
        if (candidatos) {
            setCandidatosLista(candidatos);
            candidatosRef.current = candidatos;
        }
    }, [candidatos]);

    useEffect(() => {
        if (active && reload) {
            reloadDataFunction();
        }
    }, [reload]);

    useEffect(() => {
        setReady(true);
    }, [candidatosLista]);

    const handleEncaminhar = useCallback(
        (data) => {
            setformAgendamento({
                cd_pessoa: data.CD_PESSOA_CANDIDATO,
                nm_pessoa: data.NM_PESSOA_SOCIAL,
                nr_vaga: data.NR_VAGA,
            });
            setShowRelacionarCandidato(true);
        },
        [formAgendamento]
    );

    const handleReprovar = useCallback((cdPessoaCandidato, nrVaga, nmCandidato) => {
        setformAgendamento({
            cd_pessoa: cdPessoaCandidato,
            nm_pessoa: nmCandidato,
            nr_vaga: nrVaga,
        });

        setShowDialogReprovarCand(true);
    });

    const reprovarCandidato = useCallback((motivo) => {
        axiosInstance
            .put(`recrutamento/descartar-candidato`, {
                cd_pessoa_candidato: formAgendamento.cd_pessoa,
                nr_vaga: formAgendamento.nr_vaga,
                cd_usuario: user.user_sip,
                motivo: motivo,
            })
            .then(function (response) {
                if (!response.data) {
                    toast.error("Não foi possível reprovar o candidato! Verifique se o candidato ainda não foi reprovado ou tente novamente mais tarde.");
                    setformAgendamento({});
                    return;
                }

                toast.success(`Candidato: ${formAgendamento.cd_pessoa} - ${formAgendamento.nm_pessoa} descartado.`);
                setformAgendamento({});
                setShowDialogReprovarCand(false);
                reloadDataFunction();
            })
            .catch(function (error) {
                toast.error("Erro ao tentar reprovar o candidato");
                console.error(error);
            });
    });

    const handleAgendar = (data) => {
        setformAgendamento({
            nr_vaga: data.NR_VAGA,
            cd_pessoa: data.CD_PESSOA_CANDIDATO,
            nm_pessoa: data.NM_PESSOA_SOCIAL,
            cd_pessoa_cliente: data.CD_PESSOA_CLIENTE,
            nm_pessoa_cliente: data.NM_PESSOA_CLIENTE,
            cd_usuario_analista: data.CD_USUARIO_ANALISTA,
            nm_pessoa_analista: data.NM_PESSOA_ANALISTA,
        });
        setmodalAgendamento(true);
    };

    const handleRecicalgem = (data) => {
        setFormReciclagem({
            cd_pessoa_candidato: data.CD_PESSOA_CANDIDATO,
            nr_vaga: data.NR_VAGA,
            data_agenda: data.DATA_AGENDA,
        });

        setModalReciclagem(true);
    }

    const handleNaoCompareceu = useCallback((data) => {
        setformAgendamento({
            cd_pessoa_candidato: data.CD_PESSOA_CANDIDATO,
            nm_pessoa: data.NM_PESSOA_SOCIAL,
            nr_vaga: data.NR_VAGA,
            cd_empresa: data.CD_EMPRESA,
            dt_historico: data.DT_HISTORICO,
            cd_usuario: user.user_sip,
        });
        setShowConfirmNaoCompareceu(true);
    });

    const salvarCandidatoNaoCompareceu = useCallback(() => {
        axiosInstance
            .put("recrutamento/candidato-nao-compareceu", {
                cd_pessoa_candidato: formAgendamento.cd_pessoa_candidato,
                nm_pessoa: formAgendamento.nm_pessoa,
                nr_vaga: formAgendamento.nr_vaga,
                cd_empresa: formAgendamento.cd_empresa,
                dt_historico: formAgendamento.dt_historico,
                cd_usuario: formAgendamento.cd_usuario,
            })
            .then(function (response) {
                if (!response.data) {
                    toast.error("Não foi possível realizar a alteração. Tente novamente mais tarde.");
                    setformAgendamento({});
                    return;
                }

                if (response.status === 200) {
                    toast.success("Alteração realizada com sucesso!");
                    setShowConfirmNaoCompareceu(false);
                    setformAgendamento({});
                    reloadDataFunction();
                }
            })
            .catch(function (error) {
                toast.error("Erro ao salvar que o candidato não compareceu.");
                console.error(error);
            });
    });

    const atualizaCandAtendimento = (cdPessoa, id_atendimento, cdEmpresa, nrVaga, dtHistorico) => {
        setDadosAtendimento({
            id_atendimento: id_atendimento,
            cdEmpresa: cdEmpresa,
            dtHistorico: dtHistorico,
            cdPessoa: cdPessoa,
            nrVaga: nrVaga
        });

        if (id_atendimento === 'S') {
            setShowConfirmAtendeCand(true);
        } else {
            setShowConfirmEncerraAtend(true);
        }
    };

    const handleAtendimentoCandidato = () => {
        if (!dadosAtendimento) {
            return;
        }

        atualizaAtendimentoCandidato();
    };

    function atualizaAtendimentoCandidato() {
        const params = {
            cd_pessoa_candidato: dadosAtendimento.cdPessoa,
            id_atendimento: dadosAtendimento.id_atendimento,
            cd_empresa: dadosAtendimento.cdEmpresa,
            dt_historico: dadosAtendimento.dtHistorico,
            nr_vaga: dadosAtendimento.nrVaga,
            cd_usuario: user.user_sip
        };

        axiosInstance.put("recrutamento/atendimento-candidato", params).then((response) => {
            if (response.status === 200 && response.data) {
                toast.success("Atualizado com sucesso.");

                //Chama a função que busca os dados no banco para atualizar a lista
                reloadDataFunction();
                setDadosAtendimento("");

                //Dispara mensagem no WebSocket para atualizar a tela dos demais analistas
                sendWebSocketMessage(
                    'autoatendimento',
                    user.user_sip,
                    {
                        nr_vaga: dadosAtendimento.nrVaga,
                        candidato: dadosAtendimento.cdPessoa,
                        id_atendimento: dadosAtendimento.id_atendimento
                    }
                );
            }
        }).catch((resp) => {
            toast.error("Não foi possivel atualizar o atendimento.");
        });
    }

    //Altera o status do atendimento no objeto
    const handleWebSocketMessage = (data) => {
        if (data.type !== 'autoatendimento' || data.sender === user.user_sip || Object.keys(candidatosRef.current).length === 0) {
            return;
        }

        let novaLista = candidatosRef.current.map(item =>
            parseInt(item.NR_VAGA) === parseInt(data.nr_vaga) && parseInt(item.CD_PESSOA_CANDIDATO) === parseInt(data.candidato)
                ? { ...item, ID_ATENDIMENTO: data.id_atendimento }
                : item
        );

        setCandidatosLista(novaLista);
        candidatosRef.current = novaLista;
    }

    useEffect(() => {
        const messageListener = onWebSocketMessage((data) => {
            if (data.type === 'autoatendimento' && data.sender !== user.user_sip) {
                handleWebSocketMessage(data);
            }
        });

        return messageListener; // remove listener ao desmontar
    }, [user?.user_sip]);

    const curriculoResumidoCallback = () => {
        setCdPessoaCurriculoResumido("");
    };

    const handleMouseEnterCurriculo = (cdPessoaCurriculoResumido) => {
        timeoutId = setTimeout(() => {
            setCdPessoaCurriculoResumido(cdPessoaCurriculoResumido);
        }, 1000);
    };

    const handleMouseLeaveCurriculo = () => {
        clearTimeout(timeoutId);
    };

    const vagaResumidaCallback = () => {
        setNrVagaOnView("");
    };

    const handleMouseEnterVaga = (nrVaga) => {
        timeoutIdVaga = setTimeout(() => {
            setNrVagaOnView(nrVaga);
        }, 1000);
    };

    const handleMouseLeaveVaga = () => {
        clearTimeout(timeoutIdVaga);
    };

    const handleClickVaga = (nrVaga) => {
        addTabWithComponent(
            'tab_' + nrVaga,
            'Vaga ' + nrVaga,
            <Vaga
                nrVaga={nrVaga}
                init={true}
                enableEdit={true}
                toggleView={nrVaga}
                isRecrutamento={true}
                disableToggleView={true}
            />
        );
    };

    const editarDadosCandidato = (cd_pessoa_candidato) => {
        setLastTab("recrutamentoAutoatendimento");
        openPageTab({
            id: "DadosCandidato",
            name: "Dados do candidato",
            props: {
                cdPessoaCandidato: cd_pessoa_candidato,
                nm_tab: tabName,
            },
        });

        handleMouseLeaveCurriculo(); //Não abrir o mini-curriculo ao clicar
    };

    const clearModalContent = () => {
        setmodalAgendamento(false);
        setformAgendamento({});
    };

    const afterSaveCallback = (cd_usuario_atendimento) => {
        //Fechar o modal
        clearModalContent();

        //Atualizar a listagem
        reloadDataFunction();

        //Disparar notificação WebSocket
        sendWebSocketMessage('agenda', user.user_sip);
    };

    const relacionaCandidatoCallback = () => {
        setShowRelacionarCandidato(false);
        reloadDataFunction();
    };

    const modalActions = () => (
        <Button className="mx-2" buttonType="success" onClick={() => setsalvarAgendamento(true)}>
            SALVAR
        </Button>
    );

    return (
        <div className={cn("bg-white py-2 mt-2 min-h-[500px] max-h-[80vh] overflow-y-auto pb-[100px] border-t", active ? '' : 'hidden')}>
            <Loading active={!ready} />
            {candidatosLista.map((row, index) => (
                <div key={row.CD_PESSOA_CANDIDATO + '-' + row.NR_VAGA} className={`pb-1 px-4 border-b ${index % 2 === 0 ? "bg-white" : "bg-gray-200"}`}>
                    <div className="grid grid-cols-12 gap-2 text-sm items-center">
                        <div className="col-span-5">
                            <div className="flex flex-row">
                                <Caption className={"mt-1"} >Data Agenda: </Caption>
                                <span className="ml-1 text-nowrap truncate">{row.DT_HISTORICO}</span>
                            </div>

                            <div className="flex flex-row">
                                <Caption className={"mt-1"} >Candidato: </Caption>
                                <span
                                    className="ml-1 mt-1 text-nowrap truncate text-primary font-semibold cursor-pointer hover:underline text-xs xl:text-base"
                                    onMouseEnter={() =>
                                        handleMouseEnterCurriculo(row.CD_PESSOA_CANDIDATO)
                                    }
                                    onMouseLeave={handleMouseLeaveCurriculo}
                                    onClick={() => {
                                        editarDadosCandidato(row.CD_PESSOA_CANDIDATO);
                                    }}
                                >
                                    {row.CD_PESSOA_CANDIDATO + ' - ' + row.NM_PESSOA_SOCIAL}
                                </span>
                                <Clipboard className={'ml-1 text-primary font-semibold cursor-pointer hover:underline'} textToStore={row.CD_PESSOA_CANDIDATO}>
                                </Clipboard>
                            </div>

                            <div className="col-span-1">
                                <div className="flex flex-row">
                                    <Caption className={"mt-1"} >Sexo: </Caption>
                                    <span className="ml-1 mt-0.5">{row.SEXO}</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-5">
                            <div className="flex flex-row">
                                <Caption className={"mt-1"} >Analista: </Caption>
                                <span className="ml-1 text-nowrap truncate">{row.NM_ANALISTA}</span>
                            </div>

                            <div className="flex flex-row">
                                <Caption className={"mt-1"} >Vaga: </Caption>
                                <Clipboard className={'ml-1 text-primary font-semibold cursor-pointer hover:underline'} textToStore={row.NR_VAGA} >
                                    <span
                                        className="text-primary font-semibold cursor-pointer hover:underline text-xs xl:text-base"
                                        onMouseEnter={() =>
                                            handleMouseEnterVaga(row.NR_VAGA)
                                        }
                                        onMouseLeave={handleMouseLeaveVaga}
                                        onClick={() => {
                                            handleMouseLeaveVaga(); //Não abrir o resumo da vaga ao clicar
                                            handleClickVaga(row.NR_VAGA);
                                        }}
                                    >
                                        {row.NR_VAGA}
                                    </span>
                                </Clipboard>
                            </div>

                            <div className="flex flex-row">
                                {/* <TooltipComponent content={row.ID_ATENDIMENTO === 'S' ? "Encerrar atendimento do candidato" : "Iniciar atendimento do candidato"}> */}
                                <ButtonToggle
                                    small
                                    primary
                                    labelOn={`Canditato em atendimento`}
                                    LabelOff="Atender candidato"
                                    onChange={(id, value, checked) => {
                                        atualizaCandAtendimento(
                                            row.CD_PESSOA_CANDIDATO,
                                            checked ? "S" : "N",
                                            row.CD_EMPRESA,
                                            row.NR_VAGA,
                                            row.DT_HISTORICO,
                                        );
                                    }}
                                    checked={row.ID_ATENDIMENTO === 'S'}
                                    id={`atender-${row.CD_PESSOA_CANDIDATO}`}
                                />
                                {/* </TooltipComponent> */}
                            </div>
                        </div>

                        <div className="col-span-2">
                            <div className="flex justify-end gap-2">

                                {row.CD_SITUACAO_ATUAL == 1 ? (
                                    <>
                                        <TooltipComponent content={"Encaminhar"} asChild>
                                            <button
                                                onClick={() => handleEncaminhar(row)}
                                                className="px-2 py-2 rounded text-green-500 border border-slate-300 hover:bg-gray-100"
                                            >
                                                <FontAwesomeIcon icon={faThumbsUp} width={"16"} height={"16"} />
                                            </button>
                                        </TooltipComponent>
                                        <TooltipComponent content={"Reprovar"} asChild>
                                            <button
                                                onClick={() => handleReprovar(row.CD_PESSOA_CANDIDATO, row.NR_VAGA, row.NM_PESSOA_SOCIAL)}
                                                className="px-2 py-2 rounded text-red-600 border border-slate-300 hover:bg-gray-100"
                                            >
                                                <FontAwesomeIcon icon={faThumbsDown} width={"16"} height={"16"} />
                                            </button>
                                        </TooltipComponent>
                                        <TooltipComponent content={"Agendar"} asChild>
                                            <button
                                                onClick={() => handleAgendar(row)}
                                                className=" px-2 py-2 rounded text-primary border border-slate-300 hover:bg-gray-100"
                                            >
                                                <FontAwesomeIcon icon={faCalendarDays} width={"16"} height={"16"} />
                                            </button>
                                        </TooltipComponent>
                                        <TooltipComponent content={"Não compareceu"} asChild>
                                            <button
                                                onClick={() => handleNaoCompareceu(row)}
                                                className=" px-2 py-2 rounded text-primary border border-slate-300 hover:bg-gray-100"
                                            >
                                                <FontAwesomeIcon icon={faUserSlash} width={"16"} height={"16"} />
                                            </button>
                                        </TooltipComponent>
                                    </>
                                ) : (
                                    <>
                                        <TooltipComponent content={"Reciclar Candidato"} asChild>
                                            <button
                                                onClick={() => handleRecicalgem(row)}
                                                className="px-2 py-2 rounded text-primary border border-slate-300 hover:bg-gray-100"
                                            >
                                                <FontAwesomeIcon icon={faRecycle} width={"16"} height={"16"} />
                                            </button>
                                        </TooltipComponent>
                                        <TooltipComponent content={"Reprovar"} asChild>
                                            <button
                                                onClick={() => handleReprovar(row.CD_PESSOA_CANDIDATO, row.NR_VAGA, row.NM_PESSOA_SOCIAL)}
                                                className="px-2 py-2 rounded text-red-600 border border-slate-300 hover:bg-gray-100"
                                            >
                                                <FontAwesomeIcon icon={faThumbsDown} width={"16"} height={"16"} />
                                            </button>
                                        </TooltipComponent>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <Confirm
                visible={showConfirmAtendeCand}
                setVisible={setShowConfirmAtendeCand}
                cancelActionCallback={() => {
                    setShowConfirmAtendeCand(false);
                    setDadosAtendimento("");
                }}
                confirmActionCallback={() => {
                    handleAtendimentoCandidato();
                }}
                btnDecline={"Não"}
                primaryText={'Tem certeza que deseja informar que o candidato está em atendimento?'}
                secondaryText={"Esta ação irá gerar histórico no cadastro do candidato."}
            ></Confirm>

            <Confirm
                visible={showConfirmEncerraAtend}
                setVisible={setShowConfirmEncerraAtend}
                cancelActionCallback={() => {
                    setShowConfirmEncerraAtend(false);
                    setDadosAtendimento("");
                }}
                confirmActionCallback={() => {
                    handleAtendimentoCandidato();
                }}
                btnDecline={"Não"}
                primaryText={'Deseja retirar este candidato do seu atendimento?'}
                secondaryText={"Esta ação irá gerar histórico no cadastro do candidato."}
            ></Confirm>

            <Confirm
                visible={showConfirmNaoCompareceu}
                setVisible={setShowConfirmNaoCompareceu}
                cancelActionCallback={() => {
                    setShowConfirmNaoCompareceu(false);
                    setformAgendamento("");
                }}
                confirmActionCallback={() => {
                    salvarCandidatoNaoCompareceu();
                }}
                btnDecline={"Não"}
                primaryText={`Tem certeza que o candidato ${formAgendamento?.nm_pessoa || ''} não compareceu?`}
                secondaryText={"Esta ação irá gerar histórico no cadastro do candidato."}
            ></Confirm>

            <CurriculoResumido
                cdPessoaCandidato={cdPessoaCurriculoResumido}
                closeCallback={curriculoResumidoCallback}
                tabName={tabName}
            />

            <VagaResumida
                mostrarPerfil={true}
                nrVaga={nrVagaOnView}
                closeCallback={vagaResumidaCallback}
            />

            <RelacionarCandidato
                active={showRelacionarCandidato}
                handleClose={setShowRelacionarCandidato}
                onSaveCallback={relacionaCandidatoCallback}
                cdPessoaCandidato={formAgendamento.cd_pessoa}
                nmPessoaCandidato={formAgendamento.nm_pessoa}
                nrVagaAutoatendimento={formAgendamento.nr_vaga}
            />

            <Dialog
                small
                textAreaMinLength={10}
                btnCancel={"CANCELAR"}
                btnAccept={"CONFIRMAR"}
                showDialog={showDialogReprovarCand}
                setDialogControl={setShowDialogReprovarCand}
                confirmActionCallback={(description) => {
                    reprovarCandidato(description);
                }}
                title={"Deseja realmente descartar o candidato?"}
            />

            <ModalGrid
                modalControl={modalAgendamento}
                setModalControl={setmodalAgendamento}
                size="sm"
                height="h-full"
                btnCancel="CANCELAR"
                title={`${formAgendamento.isEdit ? "Editar" : "Novo"} Agendamento`}
                footer={modalActions()}
                footerClass={`text-right`}
                closeModalCallback={clearModalContent}
            >
                <DadosAgendamento
                    active={modalAgendamento}
                    handleSave={salvarAgendamento}
                    handleSaveFn={setsalvarAgendamento}
                    afterSaveCallback={afterSaveCallback}
                    isEdit={false}
                    isNew={true}
                    isFromCandidato={true}
                    isFromRecrutamento={true}
                    nrVaga={formAgendamento.nr_vaga}
                    cdPessoa={formAgendamento.cd_pessoa}
                    nmPessoa={formAgendamento.nm_pessoa}
                    cdPessoaCliente={formAgendamento.cd_pessoa_cliente}
                    nmCliente={formAgendamento.nm_pessoa_cliente}
                    cdUsuarioAnalista={formAgendamento.cd_usuario_analista}
                    cdPessoaAnalista={formAgendamento.cd_pessoa_analista}
                    nmPessoaAnalista={formAgendamento.nm_pessoa_analista}
                    triggerClearFields={!modalAgendamento}
                />
            </ModalGrid>

            <ModalGrid
                modalControl={modalReciclagem}
                setModalControl={setModalReciclagem}
                size="md"
                height="70%"
                btnCancel="CANCELAR"
                title={`Reciclar Candidato`}
                footerClass={`text-right`}
                closeModalCallback={() => setModalReciclagem(false)}
            >
                <ReciclarCandidato
                    cdPessoaCandidato={formReciclagem.cd_pessoa_candidato}
                    nrVagaCancelada={formReciclagem.nr_vaga}
                    dataAgenda={formReciclagem.data_agenda}
                    onSuccess={() => {
                        setModalReciclagem(false);
                        reloadDataFunction();
                    }}
                />

            </ModalGrid>

            {Object.keys(candidatosLista)?.length === 0 && <NoDataFound />}
        </div>
    );
};

export default Autoatendimento;