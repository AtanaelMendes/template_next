import {
    faEdit,
    faUserTie,
    faClipboardList,
    faHeadset,
    faQuestionCircle,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Caption, Title, Subtitle, Label } from "@/components/Layouts/Typography";
import { TooltipComponent } from "@/components/Layouts/TooltipComponent";
import CurriculoResumido from "@/components/candidatos/CurriculoResumido";
import { faThumbsDown } from "@fortawesome/free-regular-svg-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NoDataFound from "@/components/Layouts/NoDataFound";
import PillsBadge from "@/components/buttons/PillsBadge";
import ModalGrid from "@/components/Layouts/ModalGrid";
import Clipboard from "@/components/Layouts/Clipboard";
import InputText from "@/components/inputs/InputText";
import { useAppContext } from "@/context/AppContext";
import DadosAgendamento from "../DadosAgendamento";
import Button from "@/components/buttons/Button";
import axiosInstance from "@/plugins/axios";

const TableMinhaAgenda = ({ active, filtrosPesquisa, aplicarFiltros, tabName }) => {
    const [cdPessoaCurriculoResumido, setCdPessoaCurriculoResumido] = useState("");
    const { toast, loader, user, getCandidatosEmEspera } = useAppContext();
    const [modalAgendamento, setmodalAgendamentoControl] = useState(false);
    const [salvarAgendamento, setsalvarAgendamento] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [ready, setReady] = useState(false);
    const [filter, setFilter] = useState("");
    const { openPageTab, sendWebSocketMessage } = useAppContext();
    const [formAgendamento, setformAgendamento] = useState({
        cd_pessoa: "",
        isEdit: "",
        criado_em: "",
    });

    const tableDataFilter = useMemo(() => {
        return tableData?.filter((item) =>
            Object.values(item).some(
                (v) => typeof v === "string" && v.toLowerCase().includes(filter.toLowerCase())
            )
        );
    }, [tableData, filter]);

    const editarDadosCandidato = useCallback((cd_pessoa_candidato, nome_candidato) => {
        openPageTab({
            id: "DadosCandidato",
            name: `Dados do candidato`,
            props: {
                cdPessoaCandidato: cd_pessoa_candidato,
            },
        });
    }, []);

    const applySearchFilters = () => {
        getAgendamentosAnalista();
    };

    useEffect(() => {
        if (aplicarFiltros) {
            applySearchFilters();
        }
    }, [aplicarFiltros]);

    const setModalAgendamento = (cd_pessoa_candidato, isEdit, criado_em) => {
        setformAgendamento({
            ...formAgendamento,
            cd_pessoa: cd_pessoa_candidato,
            cd_pessoa_analista: user.cd_sip,
            isEdit,
            criado_em,
        });
        setmodalAgendamentoControl(true);
    }

    const clearModalContent = useCallback(() => {
        setmodalAgendamentoControl(false);
        setformAgendamento({ cd_pessoa: "", isEdit: "", criado_em: "" });
    }, []);

    const afterSaveCallback = (cd_pessoa_analista) => {
        //Fechar o modal
        clearModalContent();
        //Atualizar a listagem
        getAgendamentosAnalista();
        //Disparar notificação WebSocket
        sendWebSocketMessage('agenda', user.user_sip);
    };

    const getAgendamentosAnalista = () => {
        loader().show();
        axiosInstance
            .post("agendamento/agendamentos-analista", {
                ...filtrosPesquisa,
                cd_pessoa_analista: user.cd_sip,
            })
            .then(function (response) {
                setTableData(response.data);
                setReady(true);
                loader().hide();
            })
            .catch(function (error) {
                loader().hide();
                toast.error("Não foi possível carregar os agendamentos.");
                console.error(error);
            });
    };

    useEffect(() => {
        if (!active) {
            setTableData([]);
            setReady(false);
        } else {
            getAgendamentosAnalista();
        }
    }, [active]);

    const setFilterTextCallback = useCallback(
        (id, value) => {
            setFilter(value);
        },
        [setFilter]
    );

    const setNaoCompareceu = useCallback((cd_pessoa, criado_em, nm_pessoa) => {
        if (confirm(`Deseja salvar que o candidato ${nm_pessoa} não compareceu?`)) {
            loader().show();
            axiosInstance
                .post("agendamento/candidato-nao-compareceu", {
                    cd_pessoa_candidato: cd_pessoa,
                    criado_em,
                })
                .then(function (response) {
                    if (response.status === 200) {
                        getAgendamentosAnalista();
                        getCandidatosEmEspera();
                        return toast.success("Agendamento atualizado com sucesso!");
                    }
                })
                .catch(function (error) {
                    loader().hide();
                    toast.error("Não foi possível atualizar o agendamento.");
                    console.error(error);
                });
        }
    });

    const modalActions = () => (
        <Button className="mx-2" buttonType="success" onClick={() => setsalvarAgendamento(true)}>
            SALVAR
        </Button>
    );

    const getDetalhesTipoAgendamento = (tipoAgendamento) => {
        let label = "Indefinido";
        let icon = faQuestionCircle;
        let id = "indefinido";
        switch (tipoAgendamento) {
            case "T":
                id = "teste";
                label = "Teste";
                icon = faClipboardList;
                break;
            case "E":
                id = "entrevista";
                label = "Entrevista";
                icon = faUserTie;
                break;
            case "C":
                id = "call_center";
                label = "Call Center";
                icon = faHeadset;
                break;
        }
        return {
            label: label,
            icon: icon,
            id: id,
        };
    };

    const curriculoResumidoCallback = () => {
        setCdPessoaCurriculoResumido("");
    };

    const dataToHtml = () => {
        return tableDataFilter?.map((item, index) => {
            let dataChegada = <span className="italic text-xs">Aguardando chegada</span>;
            //Icone de situação (Atrasou)
            if (item.ID_ATRASOU == "A") {
                dataChegada = (
                    <PillsBadge type="danger" small>
                        Atrasado
                    </PillsBadge>
                );
            }

            //Icone de situação (Compareceu)
            if (item.DT_CHEGADA_PRT != "" && item.DT_CHEGADA_PRT != null) {
                dataChegada = (
                    <div className="flex flex-row gap-x-1">
                        <div className="w-[70px]">
                            <Caption>Chegada:&nbsp;</Caption>
                        </div>
                        <div className="italic">
                            {item.DT_CHEGADA_PRT}
                        </div>
                    </div>
                );
            }

            //Icone de tipo de agendamento (Entevista / Teste / Call center)
            const dadosTipoAgendamento = getDetalhesTipoAgendamento(item.ID_TIPO_AGENDAMENTO);
            const tipoAgendamento = (
                <TooltipComponent
                    content={
                        <>
                            <p>
                                <span className="font-semibold uppercase">
                                    {dadosTipoAgendamento.label}
                                </span>
                            </p>
                            <p>Criado em {item.CRIADO_EM_FORMATADO}</p>
                            <p>por {item.CRIADO_POR}</p>
                        </>
                    }
                    asChild
                >
                    <div className="flex items-center content-center justify-center h-full">
                        <FontAwesomeIcon icon={dadosTipoAgendamento.icon} width="20" height="20" className="text-primary" />
                    </div>
                </TooltipComponent>
            );

            return (
                <div className="odd:bg-white even:bg-gray-100 hover:bg-drop-shadow-1 col-span-12 mb-1" key={`row_${index}`}>

                    <div className={`flex text-sm w-full gap-x-1`}>
                        <div className="w-fit xl:w-1/8 content-center">{tipoAgendamento}</div>

                        {/* CANDIDATO */}
                        <div className="w-[25%] xl:w-2/6 py-1 justify-center flex flex-col">
                            <div className={"flex flex-row gap-1 items-center text-primary cursor-pointer w-fit"}>
                                <Clipboard onClick={() => editarDadosCandidato(item.CD_PESSOA, item.NM_PESSOA)} className={`cursor-pointer`}>
                                    {item.CD_PESSOA}
                                </Clipboard>
                            </div>
                            <div>
                                <span className="text-ellipsis hover:underline cursor-pointer text-primary" onClick={() => {setCdPessoaCurriculoResumido(item.CD_PESSOA);}}>
                                    {item.NM_PESSOA.slice(0,30)}{item.NM_PESSOA.length > 30 ? "..." : ""}
                                </span>

                                {item.ID_POSSUE_DEFICIENCIA == "S" && (
                                    <span className="ml-2">
                                        <PillsBadge type="danger">PCD</PillsBadge>
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* ATENDIMENTO */}
                        <div className="w-[25%] xl:w-1/5 py-1">
                            <div className="flex-row">
                                <div className="flex flex-row gap-x-1">
                                    <div className="w-[70px]">
                                        <Caption>Atendimento:</Caption>
                                    </div>
                                    <div className="italic">
                                        {item.DT_ATENDIMENTO}
                                    </div>
                                </div>
                                <div>
                                    {dataChegada}
                                </div>
                            </div>
                        </div>

                        {/* CLIENTE */}
                        <div className="w-[25%] xl:w-2/6 py-1 flex flex-row gap-1 items-center">
                            <Caption>Cliente:</Caption>

                            <TooltipComponent content={item.NM_CLIENTE} asChild>
                                <span>{item.NM_APELIDO || <span className="italic text-xs">Não informado</span>}</span>
                            </TooltipComponent>
                        </div>

                        {/* ACOES */}
                        <div className="w-[25%] xl:w-1/8 py-1 content-center me-2">
                            <div className="flex gap-2">
                                <TooltipComponent
                                    content={<span className="font-semibold"> Editar agendamento </span>}
                                    asChild
                                >
                                    <div>
                                        <button
                                            onClick={() => {
                                                setModalAgendamento(
                                                    item.CD_PESSOA,
                                                    true,
                                                    item.CRIADO_EM
                                                );
                                            }}
                                            id={`btnEdit_${item.CRIADO_EM}`}
                                            className="px-2 py-2 rounded text-primary border border-slate-300 hover:bg-gray-100"
                                        >
                                            <FontAwesomeIcon icon={faEdit} width={"16"} height={"16"} />
                                        </button>
                                    </div>
                                </TooltipComponent>

                                <TooltipComponent
                                    content={<span className="font-semibold">Não compareceu</span>}
                                    asChild
                                >
                                    <div>
                                        <button
                                            onClick={() => {
                                                setNaoCompareceu(
                                                    item.CD_PESSOA,
                                                    item.CRIADO_EM,
                                                    item.NM_PESSOA
                                                );
                                            }}
                                            id={`btnNaoComp_${item.CRIADO_EM}`}
                                            className="px-2 py-2 rounded text-danger border border-slate-300 hover:bg-gray-100"
                                        >
                                            <FontAwesomeIcon
                                                icon={faThumbsDown}
                                                width="16"
                                                height="16"
                                            />
                                        </button>
                                    </div>
                                </TooltipComponent>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    };

    return (
        <>
            <div className={`relative h-[550px] ${ready ? "" : "hidden"}`}>
                <div
                    className={`grid grid-cols-12 relative ${ready ? "" : "hidden"}`}
                    id={"table-agendamentos"}
                >
                    <div className="col-span-9 p-2 flex items-center justify-between">
                        <div className="flex items-center">
                            <Subtitle className="pr-2">Agendamentos do(a) analista</Subtitle>
                            <Title className="mr-4">{user.apelido}</Title>
                        </div>
                        <Button
                            className="ml-44 -translate-y-10 absolute px-2"
                            buttonType="primary"
                            onClick={() => {
                                setModalAgendamento(0, false, 0);
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faPlus}
                                width="20"
                                height="20"
                                className="inline"
                            />
                            <span className="ml-2 text-base">Adicionar agendamento</span>
                        </Button>
                    </div>

                    <div className="col-span-3 p-1">
                        <InputText
                            placeholder="Filtrar"
                            clearable={true}
                            onChange={setFilterTextCallback}
                            id="filtro_minha_agenda"
                            helperText={`Exibindo ${tableDataFilter?.length || 0} registros`}
                            small
                            value={filter}
                        />
                    </div>
                    <div className="col-span-12 bg-white">
                        <div className={`flex-1 max-h-[75vh] overflow-y-auto pb-36`} >
                            <NoDataFound visible={tableDataFilter?.length === 0 || !ready} isLoading={!ready}/>
                            {dataToHtml()}
                        </div>
                    </div>
                </div>
            </div>

            <CurriculoResumido cdPessoaCandidato={cdPessoaCurriculoResumido} closeCallback={curriculoResumidoCallback} tabName={tabName} />

            <ModalGrid
                modalControl={modalAgendamento}
                setModalControl={setmodalAgendamentoControl}
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
                    isEdit={formAgendamento.isEdit}
                    isNew={!formAgendamento.isEdit}
                    cdPessoa={formAgendamento.cd_pessoa}
                    criadoEm={formAgendamento.criado_em}
                    triggerClearFields={!modalAgendamento}
                />
            </ModalGrid>
        </>
    );
};

export default TableMinhaAgenda;
