import Button from "@/components/buttons/Button";
import CurriculoResumido from "@/components/candidatos/CurriculoResumido";
import TableVagasEncaminhado from "@/components/candidatos/tables/TableVagasEncaminhado";
import TableVagasRelacionadoWeb from "@/components/candidatos/tables/TableVagasRelacionadoWeb";
import Checkbox from "@/components/inputs/Checkbox";
import Modal from "@/components/Layouts/ModalGrid";
import PageTabs from "@/components/Layouts/PageTabs";
import DadosAgendamento from "@/components/selecao/entrar/DadosAgendamento";
import DetalhesVaga from "@/components/selecao/entrar/DetalhesVaga";
import { useAppContext } from "@/context/AppContext";
import { useBuscaCandidatosContext } from "@/context/BuscaCandidatosContext";
import axiosInstance from "@/plugins/axios";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
    faEnvelope,
    faInfoCircle,
    faPlus,
    faSms,
    faSort,
    faTrash,
    faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";

const CandidatosPorPesquisa = ({ active, tabName }) => {
    const { candidatos, nrSelecaoMemo, nrVagaMemo, nrRequisicaoMemo } = useBuscaCandidatosContext();
    const { toast, getCandidatosRelacionados, pesquisaSelecionada, setReloadTabHistoricoDePesquisas } = useAppContext();
    const [cdPessoaCandidatoViewHistoricoVaga, setCdPessoaCandidatoViewHistoricoVaga] = useState("");
    const [nmPessoaCandidatoViewHistoricoVaga, setNmPessoaCandidatoViewHistoricoVaga] = useState("");
    const [cdPessoaCurriculoResumido, setCdPessoaCurriculoResumido] = useState("");
    const [modalRelacionaCanidato, setmodalRelacionaCanidato] = useState(false);
    const [sortedData, setSortedData] = useState(candidatos?.resultado || []);
    const [modalAgendamento, setmodalAgendamentoControl] = useState(false);
    const [modalHistoricoVagas, setmodalHistoricoVagas] = useState(false);
    const [salvarAgendamento, setsalvarAgendamento] = useState(false);
    const [loadingState, setLoadingState] = useState({});
    const [afterSaveData, setAfterSaveData] = useState("");
    const [telefoneMap, setTelefoneMap] = useState({});
    const [loadingMap, setLoadingMap] = useState({});
    const [formRelacionaCandidato, setformRelacionaCandidato] = useState({
        nm_pessoa: "",
        cd_pessoa_candidato: "",
        nr_vaga: "",
    });
    const [toggleView, setToggleView] = useState(null);
    let timeoutId = null;

    const { openPageTab, setLastTab } = useAppContext();

    const [pageTabs, setPageTabs] = useState([
        {
            name: "Relacionado WEB",
            id: "relacionado_web",
            active: true,
            visible: true,
            vaga: false,
        },
        {
            name: "Encaminhado",
            id: "encaminhado",
            active: false,
            visible: true,
            vaga: false,
        },
    ]);

    const changeTab = (nmTab) => {
        setPageTabs(
            pageTabs.map((tab) => {
                tab.active = nmTab === tab.id;
                return tab;
            })
        );
    };

    const editarDadosCandidato = (cd_pessoa_candidato) => {
        openPageTab({
            id: "DadosCandidato",
            name: "Dados do candidato",
            props: {
                cdPessoaCandidato: cd_pessoa_candidato,
                nm_tab: tabName,
            },
        });
    };

    const addPageTabsFunc = (nmTab) => {
        const tabExists = pageTabs.some((tab) => tab.id === nmTab);

        if (!tabExists) {
            let prevState = [...pageTabs];
            prevState = prevState.map((tab) => {
                return { ...tab, active: false };
            });
            prevState.push({
                name: nmTab,
                id: nmTab,
                active: true,
                visible: true,
                vaga: true,
            });
            setPageTabs(prevState);
        } else {
            setPageTabs(pageTabs.map((tab) => { tab.active = tab.id === nmTab; return tab; }));
        }
    };

    const [formAgendamento, setformAgendamento] = useState({
        cd_pessoa: "",
        cd_pessoa_cliente: "",
        nm_cliente: "",
        isFromOpenJob: false,
    });

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

    const afterSaveCallback = () => {
        // clearModalContent();
    };

    const handleMouseEnterCurriculo = (cdPessoaCurriculoResumido) => {
        timeoutId = setTimeout(() => {
            setCdPessoaCurriculoResumido(cdPessoaCurriculoResumido);
        }, 1000); // 1 segundo
    };

    const handleMouseLeaveCurriculo = () => {
        clearTimeout(timeoutId); // Cancela o temporizador se o mouse sair antes de 1 segundo
    };

    useEffect(() => {
        setmodalHistoricoVagas(cdPessoaCandidatoViewHistoricoVaga != "");
    }, [cdPessoaCandidatoViewHistoricoVaga]);

    useEffect(() => {
        setSortedData(candidatos?.resultado || []);
    }, [candidatos]);

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: null,
    });

    const sortData = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    const sortedCandidatos = [...sortedData].sort((a, b) => {
        const { key, direction } = sortConfig;
    
        if (!key) return 0;
    
        let aValue = a[key];
        let bValue = b[key];
    
        // Tratamento especial para datas
        if (key === "DATA") {
            const parseDate = (str) => {
                const [day, month, year] = str.split('/');
                return new Date(`${year}-${month}-${day}`);
            };
            aValue = parseDate(aValue);
            bValue = parseDate(bValue);
        }
    
        if (key === "ID_SELECIONAR") {
            if (aValue === bValue) return 0;
            return direction === "ascending"
                ? aValue ? -1 : 1
                : aValue ? 1 : -1;
        }
    
        if (aValue < bValue) return direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return direction === "ascending" ? 1 : -1;
        return 0;
    });

    const updateCandidatoVisto = async (cd_pessoa, novoValor) => {
        const valorOriginal = sortedData.find(
            (item) => item.CD_PESSOA === cd_pessoa
        )?.ID_SELECIONAR;

        setLoadingState((prevState) => ({ ...prevState, [cd_pessoa]: true }));
        setSortedData((prevData) =>
            prevData.map((item) =>
                item.CD_PESSOA === cd_pessoa ? { ...item, ID_SELECIONAR: novoValor } : item
            )
        );

        const params = {
            nr_selecao: pesquisaSelecionada.nrSelecao,
            cd_pessoa: cd_pessoa,
            cd_valor: novoValor,
        };

        axiosInstance.put("pesquisa-candidatos/candidato-visualizado", params).then((response) => {
            if (response.status === 200) {
                toast.success("Atualizado com sucesso.");
            }
        }).catch((resp) => {
            setSortedData((prevData) =>
                prevData.map((item) =>
                    item.CD_PESSOA === cd_pessoa ? { ...item, ID_SELECIONAR: valorOriginal } : item
                )
            );
            const error = resp?.response?.data?.error;

            if (Array.isArray(error)) {
                return toast.error(error.join(' ') || `Não foi possível atualizar o status de visto do candidato ${cd_pessoa}, tente novamente ou contate o suporte.`);
            }
            return toast.error(error || `Não foi possível atualizar o status de visto do candidato ${cd_pessoa}, tente novamente ou contate o suporte.`);
        }).finally(() => {
            setLoadingState((prevState) => ({
                ...prevState,
                [cd_pessoa]: false,
            }));
        });
    };

    const updateCandidatoDescartado = async (cd_pessoa) => {
        // const candidatoToRemove = sortedData.find((item) => item.CD_PESSOA === cd_pessoa);

        axiosInstance.delete(`pesquisa-candidatos/candidato-descartado`, {
            data: { nr_selecao: nrSelecaoMemo, cd_pessoa: cd_pessoa, nr_vaga: nrVagaMemo, nr_requisicao: nrRequisicaoMemo }
        }).then(function (response) {
            if (response.status === 200) {
                toast.success(`Candidato ${cd_pessoa} descartado com sucesso.`);
                setSortedData((prevData) => prevData.filter((item) => item.CD_PESSOA !== cd_pessoa));
                setReloadTabHistoricoDePesquisas(true);
                setTimeout(() => {
                    setReloadTabHistoricoDePesquisas(false);
                }, 1000);
            }
        }).catch(function (resp) {
            console.error(resp);
            let error = resp?.response?.data?.error;
            if (Array.isArray(error)) {
                return toast.error(error.join(' ') || 'OOps ocorreu um erro ao descartar candidato');
            }
            return toast.error(error || 'OOps ocorreu um erro ao descartar candidato');
        });
    };

    const curriculoResumidoCallback = () => {
        setCdPessoaCurriculoResumido("");
    };

    useEffect(() => {
        if (afterSaveData.status === 1) {
            setSortedData((prevData) =>
                prevData.filter((item) => item.CD_PESSOA != formAgendamento.cd_pessoa)
            );
            clearModalContent();
        }
    }, [afterSaveData]);

    const relacionarCandidato = useCallback(
        (nm_pessoa, cd_pessoa_candidato) => {
            setformRelacionaCandidato({
                ...formRelacionaCandidato,
                nm_pessoa: nm_pessoa,
                cd_pessoa_candidato: cd_pessoa_candidato,
                nr_vaga: nrVagaMemo,
            });
            setmodalRelacionaCanidato(true);
        },
        [formRelacionaCandidato, nrVagaMemo]
    );

    const relacionarVaga = useCallback(() => {
        if (!confirm("Realmente deseja relacionar o candidato a vaga?")) return;

        axiosInstance
            .post("vaga/relacionar-candidato", {
                cd_pessoa_candidato: formRelacionaCandidato.cd_pessoa_candidato,
                nr_vaga: formRelacionaCandidato.nr_vaga,
                cd_estagio_vaga: 3,
            })
            .then((response) => {
                if (response.data.error) {
                    toast.error(response.data.message);
                    return;
                }
                if (response.status == 200) {
                    (async () => await getCandidatosRelacionados())();
                    setSortedData((prevData) =>
                        prevData.map((item) =>
                            item.CD_PESSOA == formRelacionaCandidato.cd_pessoa_candidato
                                ? {
                                    ...item,
                                    POSSUI_RELACIONAMENTO: "RELACIONADO",
                                }
                                : item
                        )
                    );

                    toast.success("Candidato relacionado com sucesso!");
                    setmodalRelacionaCanidato(false);
                }
                if (typeof refreshList === "function") {
                    refreshList();
                }
            })
            .catch((error) => {
                toast.error("Não foi possível relacionar o candidato");
                console.error(error);
            });
    });

    const enviarCurriculo = useCallback(() => {
        if (!confirm("Realmente deseja enviar o currículo?")) return;
        axiosInstance
            .post("vaga/relacionar-candidato", {
                cd_pessoa_candidato: formRelacionaCandidato.cd_pessoa_candidato,
                nr_vaga: formRelacionaCandidato.nr_vaga,
                cd_estagio_vaga: 4,
            })
            .then((response) => {
                if (response.data.error) {
                    toast.error(response.data.message);
                    return;
                }
                if (response.status == 200) {
                    toast.success("Currículo enviado com sucesso!");
                    setmodalRelacionaCanidato(false);
                }
                if (typeof refreshList === "function") {
                    refreshList();
                }
            })
            .catch((error) => {
                toast.error("Não foi possível enviar o currículo");
                console.error(error);
            });
    });

    const encaminharCandidato = useCallback(() => {
        if (!confirm("Realmente deseja encaminhar o candidato?")) return;
        axiosInstance
            .post("vaga/relacionar-candidato", {
                cd_pessoa_candidato: formRelacionaCandidato.cd_pessoa_candidato,
                nr_vaga: formRelacionaCandidato.nr_vaga,
                cd_estagio_vaga: 5,
            })
            .then((response) => {
                if (response.data.error) {
                    toast.error(response.data.message);
                    return;
                }
                if (response.status == 200) {
                    toast.success("Candidato encaminhado com sucesso!");
                    setmodalRelacionaCanidato(false);
                }
                if (typeof refreshList === "function") {
                    refreshList();
                }
            })
            .catch((error) => {
                toast.error("Não foi possível encaminhar o candidato");
                console.error(error);
            });
    });

    async function fetchTelefone(cd_pessoa) {
        if (!cd_pessoa) {
            console.error("cd_pessoa não foi fornecido.");
            return null;
        }

        try {
            const response = await axiosInstance.get(`candidato/dados-candidato/${cd_pessoa}`);
            const data = response.data;

            if (data && data.dadosCandidato) {
                const telefone = data.dadosCandidato.NR_TELEFONE_CEL;

                if (telefone) {
                    return telefone;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } catch (error) {
            if (error.response) {
                console.error("Status:", error.response.status);
                console.error("Dados:", error.response.data);
            } else {
                console.error("Erro desconhecido:", error.message);
            }
            return null;
        }
    }

    const handleMouseEnter = async (cdPessoa) => {
        if (!telefoneMap[cdPessoa]) {
            setLoadingMap((prev) => ({ ...prev, [cdPessoa]: true }));
            const telefone = await fetchTelefone(cdPessoa);
            setTelefoneMap((prev) => ({ ...prev, [cdPessoa]: telefone }));
            setLoadingMap((prev) => ({ ...prev, [cdPessoa]: false }));
        }
    };

    if (!active) return null;

    return (
        <>
            <div className="overflow-x-auto text-sm font-medium">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr>
                            <th
                                className="cursor-pointer py-1 px-6 border"
                                onClick={() => sortData("NM_PESSOA")}
                            >
                                <div className="flex flex-row items-center justify-center gap-1">
                                    Nome do Candidato
                                    <FontAwesomeIcon
                                        height={15}
                                        width={15}
                                        icon={faSort}
                                        className={
                                            sortConfig.key === "NM_PESSOA"
                                                ? "text-blue-500"
                                                : "text-gray-400"
                                        }
                                    />
                                </div>
                            </th>
                            <th
                                className="cursor-pointer py-1 px-1 border"
                                onClick={() => sortData("DATA")}
                            >
                                <div className="flex flex-row items-center justify-center gap-1">
                                    Última Atualização
                                    <FontAwesomeIcon
                                        height={15}
                                        width={15}
                                        icon={faSort}
                                        className={
                                            sortConfig.key === "DATA"
                                                ? "text-blue-500"
                                                : "text-gray-400"
                                        }
                                    />
                                </div>
                            </th>
                            <th
                                className="cursor-pointer py-1 px-1 border"
                                onClick={() => sortData("ID_SELECIONAR")}
                            >
                                <div className="flex flex-row items-center justify-center gap-1">
                                    Visto
                                    <span className="flex">
                                        <FontAwesomeIcon
                                            height={15}
                                            width={15}
                                            icon={faSort}
                                            className={
                                                sortConfig.key === "ID_SELECIONAR"
                                                    ? "text-blue-500"
                                                    : "text-gray-400"
                                            }
                                        />
                                    </span>
                                </div>
                            </th>
                            <th className="py-1 px-1 border">Histórico</th>
                            <th className="py-1 px-1 border">Descartar</th>
                            <th className="py-1 px-1 border">Agendar</th>
                            <th className="py-1 px-1 border">Relacionar</th>
                            {sortedCandidatos.some((item) => item.ENVIO_CANDIDATO == "S") && (
                                <>
                                    <th className="py-1 px-1 border">Email</th>
                                    <th className="py-1 px-1 border">SMS</th>
                                    <th className="py-1 px-1 border">WhatsApp</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedCandidatos.map((item) => {
                            return (
                                <tr key={item.CD_PESSOA}>
                                    <td
                                        className="py-2 px-2 border"
                                        onMouseEnter={() => handleMouseEnter(item.CD_PESSOA)}
                                    >
                                        <div className="flex flex-col">
                                            <span
                                                onMouseEnter={() => { handleMouseEnterCurriculo(item.CD_PESSOA); }}
                                                onMouseLeave={handleMouseLeaveCurriculo}
                                                onClick={() => {
                                                    editarDadosCandidato(item.CD_PESSOA);
                                                    setLastTab("SelecaoEntrar");
                                                }}
                                                className="hover:underline text-primary cursor-pointer text-xs xl:text-base"
                                            >
                                                {item.NM_PESSOA}
                                            </span>
                                            {(item.POSSUI_DEFICIENCIA === 'S') && (
                                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full xl:text-base">
                                                    PCD
                                                </span>
                                            )}
                                            <span className="text-gray-500 text-xs xl:text-base">
                                                {item.NM_BAIRRO + " - " + item.NM_CIDADE}
                                            </span>

                                            {/* Exibição do telefone */}
                                            <div className="mt-2">
                                                <div className="flex items-center space-x-2">
                                                    <a
                                                        href={`https://wa.me/${telefoneMap[item.CD_PESSOA]?.replace(/\D/g, "") || "5588999999999"}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-green-500 hover:text-green-700"
                                                    >
                                                        <FontAwesomeIcon icon={faWhatsapp} width={18} height={18} size="lg" />
                                                    </a>
                                                </div>
                                            </div>

                                        </div>
                                    </td>

                                    <td className="py-2 border text-center text-gray-500">
                                        {item.DATA}
                                    </td>
                                    <td className="py-2 px-2 border text-center text-gray-500">
                                        <Checkbox
                                            checked={item.ID_SELECIONAR == "S"}
                                            disabled={loadingState[item.CD_PESSOA]}
                                            className="justify-center"
                                            onChange={() =>
                                                updateCandidatoVisto(
                                                    item.CD_PESSOA,
                                                    item.ID_SELECIONAR === "S" ? "N" : "S"
                                                )
                                            }
                                        />
                                    </td>
                                    <td className="border text-center">
                                        <Button
                                            buttonType={"ghost"}
                                            onClick={() => {
                                                setCdPessoaCandidatoViewHistoricoVaga(item.CD_PESSOA);
                                                setNmPessoaCandidatoViewHistoricoVaga(item.NM_PESSOA);
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                className="cursor-pointer"
                                                icon={faInfoCircle}
                                                width="16"
                                                height="16"
                                                color="#1c64f2"
                                                title="Histórico de Vagas"
                                            />
                                        </Button>
                                    </td>
                                    <td className="border text-center">
                                        <Button
                                            buttonType={"ghost"}
                                            onClick={() => {
                                                updateCandidatoDescartado(item.CD_PESSOA);
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                className="cursor-pointer"
                                                icon={faTrash}
                                                width="16"
                                                height="16"
                                                color="red"
                                                title="Descartar Candidato"
                                            />
                                        </Button>
                                    </td>
                                    <td className="border text-center">
                                        <Button
                                            buttonType={"ghost"}
                                            onClick={() => {
                                                setModalAgendamento(item.CD_PESSOA, false, 0);
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                className="cursor-pointer"
                                                icon={faPlus}
                                                width="16"
                                                height="16"
                                                color="#1c64f2"
                                                title="Agendar Candidato"
                                            />
                                        </Button>
                                    </td>
                                    <td className="border text-center">
                                        <Button
                                            buttonType={"ghost"}
                                            onClick={() =>
                                                item.POSSUI_RELACIONAMENTO != "RELACIONADO" &&
                                                item.RELACIONADO < 1 &&
                                                relacionarCandidato(item.NM_PESSOA, item.CD_PESSOA)
                                            }
                                            disabled={item.POSSUI_RELACIONAMENTO == "RELACIONADO" ||
                                                item.RELACIONADO > 0}
                                        >
                                            <FontAwesomeIcon
                                                icon={faUserPlus}
                                                width="15"
                                                height="15"
                                                title={
                                                    (item.POSSUI_RELACIONAMENTO == "RELACIONADO" ||
                                                        item.RELACIONADO > 0)
                                                        ? "Candidato já relacionado"
                                                        : "Relacionar Candidato"
                                                }
                                                className={`${(item.POSSUI_RELACIONAMENTO == "RELACIONADO" ||
                                                        item.RELACIONADO > 0)
                                                        ? "text-slate-400 cursor-block"
                                                        : "text-green-500 cursor-pointer"
                                                    }`}
                                            />
                                        </Button>
                                    </td>
                                    {item.ENVIO_CANDIDATO == "S" && (
                                        <>
                                            <td className="border text-center">
                                                <span className="flex justify-center items-center h-full">
                                                    <FontAwesomeIcon
                                                        icon={faEnvelope}
                                                        width="20"
                                                        height="20"
                                                        title={
                                                            item.EMAIL == "N"
                                                                ? "Email ainda não enviado"
                                                                : "Email enviado"
                                                        }
                                                        className={`${item.EMAIL == "N" ? "text-red-500" : "text-green-500"} cursor-pointer`}
                                                    />
                                                </span>
                                            </td>
                                            <td className="border text-center">
                                                <span className="flex justify-center items-center h-full">
                                                    <FontAwesomeIcon
                                                        icon={faSms}
                                                        width="20"
                                                        height="20"
                                                        title={
                                                            item.SMS == "N"
                                                                ? "SMS ainda não enviado"
                                                                : "SMS enviado"
                                                        }
                                                        className={`${item.SMS == "N" ? "text-red-500" : "text-green-500"} cursor-pointer`}
                                                    />
                                                </span>
                                            </td>
                                            <td className="border text-center">
                                                <span className="flex justify-center items-center h-full">
                                                    <FontAwesomeIcon
                                                        icon={faWhatsapp}
                                                        width="20"
                                                        height="20"
                                                        title={
                                                            item.WHATSAPP === null
                                                                ? "Ainda não respondeu"
                                                                : item.WHATSAPP == "N"
                                                                    ? "WhatsApp ainda não enviado"
                                                                    : "WhatsApp enviado"
                                                        }
                                                        className={`${item.WHATSAPP === null
                                                            ? "text-gray-500"
                                                            : item.WHATSAPP == "N"
                                                                ? "text-red-500"
                                                                : "text-green-500"
                                                            } cursor-pointer`}
                                                    />
                                                </span>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <CurriculoResumido cdPessoaCandidato={cdPessoaCurriculoResumido} closeCallback={curriculoResumidoCallback} tabName={tabName} />

            <Modal
                height="h-fit"
                size="md"
                title="Histórico de vaga do candidato"
                btnCancel={"FECHAR"}
                footerClass={`text-right`}
                id={"modal-vagas-relacionado"}
                modalControl={modalHistoricoVagas}
                closeModalCallback={() => {
                    setCdPessoaCandidatoViewHistoricoVaga("");
                    setNmPessoaCandidatoViewHistoricoVaga("");
                    setPageTabs([
                        {
                            name: "Relacionado WEB",
                            id: "relacionado_web",
                            active: true,
                            visible: true,
                            vaga: false,
                        },
                        {
                            name: "Encaminhado",
                            id: "encaminhado",
                            active: false,
                            visible: true,
                            vaga: false,
                        },
                    ]);
                }}
                setModalControl={setmodalHistoricoVagas}
            >
                <div className="col-span-12 min-h-[400px]">
                    <div className="grid grid-cols-1">
                        <PageTabs pageTabs={pageTabs} onClick={changeTab} wordWrap={true} />
                        <div className={`${pageTabs.find((tab) => tab.id === "relacionado_web").active ? "" : "hidden"}`} >
                            <TableVagasRelacionadoWeb cdPessoaCandidato={cdPessoaCandidatoViewHistoricoVaga} nmCandidato={nmPessoaCandidatoViewHistoricoVaga} />
                        </div>
                        <div className={`${pageTabs.find((tab) => tab.id === "encaminhado").active ? "" : "hidden"}`}>
                            <TableVagasEncaminhado
                                addPageTabsFunc={addPageTabsFunc}
                                cdPessoaCandidato={cdPessoaCandidatoViewHistoricoVaga}
                                nmCandidato={nmPessoaCandidatoViewHistoricoVaga}
                            />
                        </div>
                        {pageTabs .filter((tab) => tab.vaga).map((tab) => (
                                <div key={tab.id} className={`max-h-[500px] overflow-y-auto ${tab.active ? "" : "hidden"}`}                                >
                                    <DetalhesVaga nrVaga={tab.id} nmCargo={""} init={tab.active} toggleView={toggleView} setToggleView={setToggleView} />
                                </div>
                            ))}
                    </div>
                </div>
            </Modal>

            <Modal
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
                    setAfterSaveData={setAfterSaveData}
                    isFromOpenJob={formAgendamento.isFromOpenJob}
                    cdPessoa={formAgendamento.cd_pessoa}
                    cdPessoaCliente={formAgendamento.cd_pessoa_cliente}
                    nmCliente={formAgendamento.nm_cliente}
                    triggerClearFields={!modalAgendamento}
                />
            </Modal>

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
                <div className="col-span-12 p-2">
                    <div className="grid grid-cols-1 gap-y-2">
                        <div className="font-semibold text-xl text-center">
                            {formRelacionaCandidato.nm_pessoa}
                        </div>
                        <div>
                            <Button block buttonType="primary" onClick={relacionarVaga}>
                                Em análise (Relacionar a vaga)
                            </Button>
                        </div>
                        <div>
                            <Button block buttonType="primary" onClick={enviarCurriculo}>
                                Enviar Currículo
                            </Button>
                        </div>
                        <div>
                            <Button block buttonType="primary" onClick={encaminharCandidato}>
                                Encaminhar candidato
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default CandidatosPorPesquisa;
