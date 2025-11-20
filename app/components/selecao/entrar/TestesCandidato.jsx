import Title, { Caption, Subtitle } from "@/components/Layouts/Typography";
import TesteConfiabilidade from "@/components/testes/TesteConfiabilidade";
import TesteLearningStyles from "@/components/testes/TesteLearningStyles";
import TesteLearningMeans from "@/components/testes/TesteLearningMeans";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonDropDown from "@/components/buttons/ButtonDropDown";
import { useState, useEffect, useCallback } from "react";
import NoDataFound from "@/components/Layouts/NoDataFound";
import ButtonGroup from "@/components/buttons/ButtonGroup";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import ModalGrid from "@/components/Layouts/ModalGrid";
import InputText from "@/components/inputs/InputText";
import Loading from "@/components/Layouts/Loading";
import Button from "@/components/buttons/Button";
import { useAppContext } from "@/context/AppContext";
import { empty } from "@/assets/utils";
import DadosTeste from "./DadosTeste";
import axiosInstance from "@/plugins/axios";

const TestesCandidato = ({ active, reload, cdPessoaCandidato, nmCandidato }) => {
    const [showModalTesteConfiabilidade, setShowModalTesteConfiabilidade] = useState(false);
    const [salvarTesteConfiabilidade, setSalvarTesteConfiabilidade] = useState(false);
    const [isEditModeConfiabilidade, setIsEditModeConfiabilidade] = useState(false);
    const [idAvaliacaoConfiabilidade, setIdAvaliacaoConfiabilidade] = useState("");
    const [testesDisponiveis, setTestesDisponiveis] = useState(false);
    const [showModalTesteLM, setShowModalTesteLM] = useState(false);
    const [showModalTesteLS, setShowModalTesteLS] = useState(false);
    const [showModalTeste, setShowModalTeste] = useState(false);
    const [tableDataFilter, setTableDataFilter] = useState([]);
    const [salvarTesteLM, setSalvarTesteLM] = useState(false);
    const [salvarTesteLS, setSalvarTesteLS] = useState(false);
    const { toast, loader } = useAppContext();
    const [showLoading, setShowLoading] = useState(false);
    const [salvarTeste, setSalvarTeste] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [idTeste, setIdTeste] = useState("");
    const [ready, setReady] = useState(false);
    const [filter, setFilter] = useState("");

    //Abre o modal para edição, caso seja setado um ID para editar
    useEffect(() => {
        if (!empty(idTeste)) {
            setIsEditMode(true);
            setShowLoading(true);
            setShowModalTeste(true);
        }
    }, [idTeste]);

    useEffect(() => {
        if (!empty(testesDisponiveis)) {
            //Setar dados dos testes LM, LS e CONF
            //Seta o id da avaliacao de confiabilidade, para abrir os dados no modal
            setIdAvaliacaoConfiabilidade(testesDisponiveis.CONF);
        }
    }, [testesDisponiveis]);

    const editarTeste = useCallback((idTeste) => {
        setIdTeste(idTeste);
    });

    const editAvaliacaoConfiabilidade = useCallback(() => {
        if (!empty(idAvaliacaoConfiabilidade)) {
            setIsEditModeConfiabilidade(true);
            setShowModalTesteConfiabilidade(true);
        }
    });

    const incluirTesteConfiabilidade = useCallback(() => {
        setIsEditModeConfiabilidade(false);
        setShowModalTesteConfiabilidade(true);
    });

    const incluirTeste = useCallback(() => {
        setShowModalTeste(true);
        setShowLoading(false);
        setIsEditMode(false);
        setIdTeste("");
    });

    const incluirTesteLM = useCallback(() => {
        setShowModalTesteLM(true);
    });

    const incluirTesteLS = useCallback(() => {
        setShowModalTesteLS(true);
    });

    const clearModalContentConf = useCallback(() => {
        setShowModalTesteConfiabilidade(false);
        setIsEditModeConfiabilidade(false);
    });

    const clearModalLMContent = useCallback(() => {
        setShowModalTesteLM(false);
    });

    const clearModalLSContent = useCallback(() => {
        setShowModalTesteLS(false);
    });

    const clearModalContent = useCallback(() => {
        setShowModalTeste(false);
        setIsEditMode(false);
        setIdTeste("");
    });

    const setData = (data) => {
        setTableDataFilter(data);
        setTableData(data);
        setReady(true);
    };

    const afterSaveCallback = () => {
        clearModalContent();
        onLoadActions();
    };

    const afterSaveConfCallback = () => {
        clearModalContentConf();
        onLoadActions();
    };

    const afterSaveLMCallback = () => {
        clearModalLMContent();
        onLoadActions();
    };

    const afterSaveLSCallback = () => {
        clearModalLSContent();
        onLoadActions();
    };

    const onLoadActions = () => {
        getTestesDisponiveis();
        getTestesCandidato();
    };

    const getTestesCandidato = () => {
        loader().show();
        axiosInstance
            .get(`teste/testes-candidato/${cdPessoaCandidato}`)
            .then(function (response) {
                setData(response?.data || []);
                setReady(true);
                loader().hide();
            })
            .catch(function (error) {
                loader().hide();
                toast.error("Não foi possível carregar os testes.");
                console.error(error);
            });
    };

    const excluirTeste = useCallback((idTeste) => {
        if (confirm(`Deseja realmente excluir este teste?`)) {
            loader().show();
            axiosInstance
                .delete(`teste/excluir-teste/${idTeste}`)
                .then(function (response) {
                    if (response.data === 1) {
                        onLoadActions();
                        return toast.success("Teste excluído com sucesso!");
                    }
                    loader().hide();
                    toast.error("Erro ao excluir o teste.");
                })
                .catch(function (error) {
                    loader().hide();
                    toast.error("Não foi possível excluir o teste.");
                    console.error(error);
                });
        }
    });

    const getTestesDisponiveis = useCallback(() => {
        axiosInstance
            .get(`teste/testes-disponiveis/${cdPessoaCandidato}`)
            .then(function (response) {
                if (response.status === 200) {
                    setTestesDisponiveis(response.data);
                }
            })
            .catch(function (error) {
                toast.error("Não foi possível obter todos os testes disponiveis.");
                console.error(error);
            });
    });

    useEffect(() => {
        if (active) {
            onLoadActions();
        }
    }, [active]);

    useEffect(() => {
        if (active && reload) {
            onLoadActions();
        }
    }, [reload, active]);

    useEffect(() => {
        if (tableData.length > 0) {
            setTableDataFilter(
                tableData.filter((item) =>
                    Object.values(item).some(
                        (v) =>
                            v != null &&
                            typeof v === "string" &&
                            v.toLowerCase().includes(filter.toLowerCase())
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
                        setSalvarTeste(true);
                    }}
                >
                    SALVAR
                </Button>
            </>
        );
    };

    const salvarModalTesteConfiabilidade = () => {
        return (
            <>
                <Button
                    className="mx-2"
                    buttonType="success"
                    onClick={() => {
                        setSalvarTesteConfiabilidade(true);
                    }}
                >
                    SALVAR
                </Button>
            </>
        );
    };

    const salvarModalTesteLM = () => {
        return (
            <>
                <Button
                    className="mx-2"
                    buttonType="success"
                    onClick={() => {
                        setSalvarTesteLM(true);
                    }}
                >
                    SALVAR
                </Button>
            </>
        );
    };

    const salvarModalTesteLS = () => {
        return (
            <>
                <Button
                    className="mx-2"
                    buttonType="success"
                    onClick={() => {
                        setSalvarTesteLS(true);
                    }}
                >
                    SALVAR
                </Button>
            </>
        );
    };

    const renderBody = () => {
        if (!tableData.length) {
            return (
                <div className="col-span-12">
                    <NoDataFound />
                </div>
            );
        }

        return tableDataFilter.map((item, index) => {
            let actionsArray = [];
            const editButton = {
                onclick: () => {
                    editarTeste(item.ID);
                },
                label: (
                    <FontAwesomeIcon
                        icon={faEdit}
                        width="18"
                        height="18"
                        className="text-primary"
                    />
                ),
                tooltip: "Editar teste",
                tooltipPosition: "left",
                id: `btnEdit_${item.ID}`,
            };

            const deleteButton = {
                label: (
                    <FontAwesomeIcon
                        icon={faTrashAlt}
                        width="18"
                        height="18"
                        className="text-danger"
                    />
                ),
                onclick: () => {
                    excluirTeste(item.ID);
                },
                tooltip: "Excluir teste",
                tooltipPosition: "left",
                id: `btnExcluir_${item.ID}`,
            };

            if (item.CAN_EDIT === "S") {
                actionsArray.push(editButton);
            }

            if (item.CAN_EDIT === "CONF") {
                const editConfButton = {
                    label: (
                        <FontAwesomeIcon
                            icon={faEdit}
                            width="18"
                            height="18"
                            className="text-primary"
                        />
                    ),
                    onclick: () => {
                        editAvaliacaoConfiabilidade();
                    },
                    tooltip: "Editar teste",
                    tooltipPosition: "left",
                    id: `btnEditConf_${item.ID}`,
                };

                actionsArray.push(editConfButton);
            }

            if (item.CAN_DELETE === "S") {
                actionsArray.push(deleteButton);
            }

            var actions = () => {
                return actionsArray;
            };

            return (
                <div
                    className="odd:bg-white even:bg-gray-100 hover:bg-drop-shadow-1 col-span-12 p-1"
                    key={`row_${index}`}
                >
                    <div className={`grid grid-cols-12 gap-2 text-sm`}>
                        <div className="col-span-4 pl-2 flex items-center">
                            <Caption>Teste:</Caption>
                            <span className="font-semibold pl-2">{item.DS_TESTE}</span>
                        </div>
                        <div className="col-span-2 flex items-center">
                            <Caption>Data:</Caption>
                            <span className="font-semibold pl-2">{item.DT_TESTE}</span>
                        </div>
                        <div className="col-span-2 flex items-center">
                            <Caption>Grau teste:</Caption>
                            <span className="font-semibold pl-2">
                                {item.NR_NOTA || item.CD_GRAU_TESTE}
                            </span>
                        </div>
                        <div className="col-span-2 flex items-center">
                            <Caption>Gera laudo:</Caption>
                            <span className="font-semibold pl-2">
                                {item.ID_GERA_LAUDO == "S" ? "Sim" : "Não"}
                            </span>
                        </div>
                        <div className="col-span-2 h-7">
                            <div className={"flex justify-center items-center"}>
                                <ButtonGroup buttons={actions()} small />
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    };

    //Retorna os testes que o candidato pode adicionar (LM = Learning Means, LS = Learning Styles, Conf = Confiabilidade)
    //testesDisponiveis é um contador dos testes adicionados, 0 significa que não foi respondido ainda
    const getMenuItems = () => {
        let menuItems = [];

        if (parseInt(testesDisponiveis.LS) === 0) {
            menuItems.push({
                id: "ls",
                action: incluirTesteLS,
                label: "Learning Styles",
            });
        }

        if (parseInt(testesDisponiveis.LM) === 0) {
            menuItems.push({
                id: "ls",
                action: incluirTesteLM,
                label: "Learning Means",
            });
        }

        if (parseInt(testesDisponiveis.CONF) === 0) {
            menuItems.push({
                id: "ls",
                label: "Confiabilidade",
                action: incluirTesteConfiabilidade,
            });
        }

        menuItems.push({
            id: "demais_testes",
            action: incluirTeste,
            label: "Selecionar teste",
        });

        return menuItems;
    };

    if (!active) return null;

    return (
        <div className={`m-2 mt-14 col-span-12 relative`}>
            <div
                className={`grid grid-cols-12 relative bg-primary rounded-t-md ${
                    ready ? "" : "hidden"
                }`}
                id={"table-testes"}
            >
                <div className="col-span-7 p-2 text-white">
                    <Subtitle className={"pr-2"}>Testes do candidato</Subtitle>
                    <Title>{nmCandidato}</Title>
                </div>
                <div className="col-span-5 p-1">
                    <div className="flex flex-row items-center w-full gap-1">
                        <div className="flex w-full justify-end">
                            <ButtonDropDown
                                className={"py-2 w-1/2"}
                                type="primary"
                                small
                                label="Adicionar teste"
                                items={getMenuItems()}
                            />
                        </div>
                        <div className="flex p-1 text-xs w-full justify-end text-white">
                            Exibindo {tableDataFilter?.length || 0} registros
                        </div>
                        <InputText
                            placeholder="Filtrar"
                            onChange={(id, value) => setFilter(value)}
                            id="filtro"
                            small
                            clearable={true}
                        />
                    </div>
                </div>
                <div className="col-span-12 bg-white">
                    <div className={`grid grid-cols-12 max-h-[530px] overflow-y-auto`}>
                        {renderBody()}
                    </div>
                </div>
            </div>

            {/* Modal de testes simples */}
            <ModalGrid
                size="sm"
                height="h-[80%]"
                btnCancel="CANCELAR"
                id={"modalDadosTeste"}
                footer={modalActions()}
                footerClass={`text-right`}
                modalControl={showModalTeste}
                setModalControl={setShowModalTeste}
                closeModalCallback={clearModalContent}
                title={`${isEditMode ? "Editar" : "Novo"} teste`}
            >
                <Loading active={showLoading} />
                <DadosTeste
                    idTeste={idTeste}
                    isEdit={isEditMode}
                    active={showModalTeste}
                    handleSave={salvarTeste}
                    handleSaveFn={setSalvarTeste}
                    setShowLoading={setShowLoading}
                    triggerClearFields={!showModalTeste}
                    afterSaveCallback={afterSaveCallback}
                    cdPessoaCandidato={cdPessoaCandidato}
                />
            </ModalGrid>

            {/* Modal do teste de confiabilidade */}
            <ModalGrid
                size="lg"
                btnCancel="CANCELAR"
                height="h-full h-[80%]"
                footerClass={`text-right`}
                id={"modalDadosTesteConfiabilidade"}
                modalControl={showModalTesteConfiabilidade}
                footer={salvarModalTesteConfiabilidade()}
                closeModalCallback={clearModalContentConf}
                setModalControl={setShowModalTesteConfiabilidade}
                title={`${isEditModeConfiabilidade ? "Editar" : "Novo"} teste de confiabilidade`}
            >
                <TesteConfiabilidade
                    active={showModalTesteConfiabilidade}
                    cdPessoaCandidato={cdPessoaCandidato}
                    handleSave={salvarTesteConfiabilidade}
                    idAvaliacao={idAvaliacaoConfiabilidade}
                    afterSaveCallback={afterSaveConfCallback}
                    handleSaveFn={setSalvarTesteConfiabilidade}
                />
            </ModalGrid>

            {/* Modal do teste Learning Means */}
            <ModalGrid
                size="lg"
                btnCancel="CANCELAR"
                height="h-full h-[80%]"
                id={"modalDadosTesteLM"}
                footerClass={`text-right`}
                footer={salvarModalTesteLM()}
                title={`Teste Learning Means`}
                modalControl={showModalTesteLM}
                setModalControl={setShowModalTesteLM}
                closeModalCallback={clearModalLMContent}
            >
                <TesteLearningMeans
                    active={showModalTesteLM}
                    handleSave={salvarTesteLM}
                    handleSaveFn={setSalvarTesteLM}
                    cdPessoaCandidato={cdPessoaCandidato}
                    afterSaveCallback={afterSaveLMCallback}
                />
            </ModalGrid>

            {/* Modal do teste Learning Styles */}
            <ModalGrid
                size="lg"
                btnCancel="CANCELAR"
                height="h-full h-[80%]"
                id={"modalDadosTesteLM"}
                footerClass={`text-right`}
                footer={salvarModalTesteLS()}
                title={`Teste Learning Styles`}
                modalControl={showModalTesteLS}
                setModalControl={setShowModalTesteLS}
                closeModalCallback={clearModalLSContent}
            >
                <TesteLearningStyles
                    active={showModalTesteLS}
                    handleSave={salvarTesteLS}
                    handleSaveFn={setSalvarTesteLS}
                    cdPessoaCandidato={cdPessoaCandidato}
                    afterSaveCallback={afterSaveLSCallback}
                />
            </ModalGrid>
        </div>
    );
};

export default TestesCandidato;
