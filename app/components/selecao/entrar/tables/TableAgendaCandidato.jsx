import {
    faEdit,
    faUserTie,
    faClipboardList,
    faQuestionCircle,
    faHeadset,
    faEye,
} from "@fortawesome/free-solid-svg-icons";
import { Caption, Title, Subtitle } from "@/components/Layouts/Typography";
import { TooltipComponent } from "@/components/Layouts/TooltipComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonGroup from "@/components/buttons/ButtonGroup";
import FabAdd from "@/components/buttons/FloatActionButton";
import NoDataFound from "@/components/Layouts/NoDataFound";
import { useCallback, useEffect, useState } from "react";
import ModalGrid from "@/components/Layouts/ModalGrid";
import InputText from "@/components/inputs/InputText";
import { useAppContext } from "@/context/AppContext";
import ResumoAgendamento from "../ResumoAgendamento";
import DadosAgendamento from "../DadosAgendamento";
import Button from "@/components/buttons/Button";
import axiosInstance from "@/plugins/axios";
import { empty } from "@/assets/utils";

const TableAgendaCandidato = ({ active, reload, cdPessoaCandidato, nmCandidato }) => {
    const [showResumoAgendamento, setShowResumoAgendamento] = useState(false);
    const [modalAgendamento, setmodalAgendamentoControl] = useState(false);
    const [salvarAgendamento, setsalvarAgendamento] = useState(false);
    const [tableDataFilter, setTableDataFilter] = useState([]);
    const { toast, loader, user, sendWebSocketMessage } = useAppContext();
    const [tableData, setTableData] = useState([]);
    const [ready, setReady] = useState(false);
    const [filter, setFilter] = useState("");
    const [formAgendamento, setformAgendamento] = useState({
        cd_pessoa: "",
        isEdit: "",
        criado_em: "",
    });

    const setModalAgendamento = useCallback((cd_pessoa_candidato, isEdit, criado_em) => {
                setformAgendamento({
            ...formAgendamento,
            cd_pessoa: cd_pessoa_candidato,
            isEdit,
            criado_em,
        });
        setmodalAgendamentoControl(true);
    });

    const exibeResumoAgendamento = useCallback((criadoEm) => {
        setformAgendamento({
            ...formAgendamento,
            criado_em: criadoEm,
        });
        setShowResumoAgendamento(true);
    });

    const clearModalContent = useCallback(() => {
        setmodalAgendamentoControl(false);
        setformAgendamento({ cd_pessoa: "", isEdit: "", criado_em: "" });
    });
    
    const closeResumoAgendamento = useCallback(() => {
        setShowResumoAgendamento(false);
        setformAgendamento({ cd_pessoa: "", isEdit: "", criado_em: "" });
    });

    const setData = (data) => {
        setTableData(data);
        setTableDataFilter(data);
        setReady(true);
    };

    const afterSaveCallback = (cd_usuario_atendimento) => {
        //Fechar o modal
        clearModalContent();
        //Atualizar a listagem
        getAgendamentosAnalista();
        //Disparar notificação WebSocket
        sendWebSocketMessage('agenda', user.user_sip);
    };

    const getAgendamentosAnalista = async () => {
        loader().show();
        await axiosInstance
            .get(`agendamento/agendamentos-candidato/${cdPessoaCandidato}`)
            .then(function (response) {
                setData(response.data);
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
            return;
        }
        (async () => await getAgendamentosAnalista())();
    }, [active, reload]);

    const setFilterTextCallback = useCallback(
        (id, value) => {
            setFilter(value);
        },
        [setFilter]
    );

    useEffect(() => {
        if (tableData.length > 0) {
            setTableDataFilter(
                tableData.filter((item) =>
                    Object.values(item).some(
                        (v) =>
                            typeof v == "string" && v.toLowerCase().includes(filter.toLowerCase())
                    )
                )
            );
        }
    }, [filter]);

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

    const renderBody = () => {
        if (tableDataFilter.length == 0) {
            return (
                <div className="col-span-12">
                    <NoDataFound />
                </div>
            );
        }

        return tableDataFilter.map((item, index) => {
            //Icone de tipo de agendamento (Entevista ou Teste)
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
                    <div>
                        <FontAwesomeIcon
                            icon={dadosTipoAgendamento.icon}
                            width="20"
                            height="20"
                            className="text-primary"
                        />
                    </div>
                </TooltipComponent>
            );

            var actions = () => {
                if (!empty(item.DT_ENCERRAMENTO)) {
                    return [
                        {
                            label: (
                                <FontAwesomeIcon
                                    icon={faEye}
                                    width="18"
                                    height="18"
                                    className="text-primary"
                                />
                            ),
                            onclick: () => {
                                exibeResumoAgendamento(item.CRIADO_EM);
                            },
                            tooltip: "Visualizar agendamento",
                            tooltipPosition: "left",
                            id: `btnView_${item.CRIADO_EM}`,
                        },
                    ];
                }

                return [
                    {
                        label: (
                            <FontAwesomeIcon
                                icon={faEdit}
                                width="18"
                                height="18"
                                className="text-primary"
                            />
                        ),
                        onclick: () => {
                            setModalAgendamento(item.CD_PESSOA, true, item.CRIADO_EM);
                        },
                        tooltip: "Editar agendamento",
                        tooltipPosition: "left",
                        id: `btnEdit_${item.CRIADO_EM}`,
                    },
                ];
            };

            return (
                <div
                    className="odd:bg-white even:bg-gray-100 hover:bg-drop-shadow-1 col-span-12 px-1"
                    key={`row_${index}`}
                >
                    <div className={`flex text-sm`}>
                        <div className="w-1/8 py-1 content-center px-2">{tipoAgendamento}</div>
                        <div className="w-2/6 py-1">
                            <div>
                                <Caption>Atendimento:&nbsp;</Caption>
                                <span className="font-semibold">{item.DT_ATENDIMENTO}</span>
                            </div>
                        </div>
                        <div className="w-2/6 py-1">
                            <Caption>Analista:&nbsp;</Caption>
                            <span className="font-semibold text-ellipsis">
                                {item.NM_USUARIO_ATENDIMENTO}
                            </span>
                        </div>
                        <div className="w-2/6 py-1">
                            <TooltipComponent content={item.NM_CLIENTE} asChild>
                                <div>
                                    <Caption>Cliente:&nbsp;</Caption>
                                    <span className="font-semibold">{item.NM_APELIDO}</span>
                                </div>
                            </TooltipComponent>
                        </div>
                        <div className="w-1/8 py-1 content-center">
                            <div>
                                <ButtonGroup buttons={actions()} small />
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
            <div className={`relative h-[73vh]`}>
                <div
                    className={`grid grid-cols-12 bg-primary rounded-t-md`}
                    id={"table-agendamentos"}
                >
                    <div className="col-span-7 p-2 text-white">
                        <Subtitle className={"pr-2"}>Agendamentos do candidato</Subtitle>
                        <Title>{nmCandidato}</Title>
                    </div>
                    <div className="col-span-5 p-1">
                        <div className="flex flex-row items-center w-full gap-1">
                            <div className="flex p-1 text-xs w-full justify-end text-white">
                                Exibindo {tableDataFilter?.length || 0} registros
                            </div>
                            <InputText
                                placeholder="Filtrar"
                                onChange={setFilterTextCallback}
                                id="filtro_pesquisa_cand"
                                small
                                clearable={true}
                            />
                        </div>
                    </div>
                    <div className="col-span-12 bg-white">
                        <div
                            className={`grid grid-cols-12 max-h-[60vh] overflow-y-auto border-l border-r`}
                        >
                            {renderBody()}
                        </div>
                    </div>
                </div>
            </div>

            <FabAdd
                className={`right-[25px] bottom-[25px]`}
                onClick={() => {
                    setModalAgendamento(0, false, 0);
                }}
            />

            <ModalGrid
                modalControl={modalAgendamento}
                setModalControl={setmodalAgendamentoControl}
                size="sm"
                height="h-auto"
                btnCancel="CANCELAR"
                contentClass={"h-full"}
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
                    cdPessoa={cdPessoaCandidato}
                    criadoEm={formAgendamento.criado_em}
                    triggerClearFields={!modalAgendamento}
                    isFromCandidato={true}
                />
            </ModalGrid>

            <ResumoAgendamento
                active={showResumoAgendamento}
                cdPessoa={cdPessoaCandidato}
                criadoEm={formAgendamento.criado_em}
                handleClose={closeResumoAgendamento}
            />
        </>
    );
};

export default TableAgendaCandidato;
