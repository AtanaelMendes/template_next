import React, { useEffect, useCallback, useState, useMemo } from "react";
import { Title, Subtitle, Caption } from "@/components/Layouts/Typography";
import NoDataFound from "@/components/Layouts/NoDataFound";
import axiosInstance from "@/plugins/axios";
import InputText from "@/components/inputs/InputText";
import FabAdd from "@/components/buttons/FloatActionButton";
import ModalGrid from "@/components/Layouts/ModalGrid";
import { ModalIndicacao } from "../ModalIndicacao";
import Button from "@/components/buttons/Button";
import DataLoading from "@/components/Layouts/DataLoading";
import { ellipsize, validateForm } from "@/assets/utils";
import { format } from "@/assets/dateUtils";
import { toast } from "react-toastify";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover } from "flowbite-react";
import { TooltipComponent } from "@/components/Layouts/TooltipComponent";

function TableIndicacoesCandidato({ cdPessoaCandidato, nmCandidato, reload }) {
    const [indicacoes, setIndicacoes] = useState([]);
    const [indicacoesFiltradas, setIndicacoesFiltradas] = useState([]);
    const [indicacoesCount, setIndicacoesCount] = useState(0);
    const [filterIndicacao, setFilterIndicacao] = useState("");
    const [modalIndicacaoOpen, setModalIndicacaoOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editIndicacao, setEditIndicacao] = useState(false);
    const [requiresTipoIndicacao, setRequiresTipoIndicacao] = useState(false);
    const defaultIndicacao = {
        dt_indicacao: format(new Date(), "dd/MM/yyyy"),
        cd_pessoa_indica: null,
        ds_area_secao_indicador: null,
        ds_cargo_indicador: null,
        id_trabalhou_empresa_indicacao: null,
        id_grau_afinidade_indicador: null,
        cd_pessoa_cliente: null,
        ds_matricula_indicador: null,
        ds_turno_indicador: null,
        nm_superior_indicador: null,
        ds_observacao: null,
        nr_telefone_indicador: null,
        cd_pessoa: cdPessoaCandidato,
        //FIXO 1 SIM!
        cd_empresa: 1,
        //FIXO 1 SIM!
        cd_empresa_cliente: 1,
        id_processo_pm: null,
        // O/M/A
        id_tipo_indicacao: null,
    };
    const [indicacao, setIndicacao] = useState(defaultIndicacao);

    const onChangeForm = (id, value) => {
        setIndicacao((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    const [formValidate, setFormValidate] = useState({
        dt_indicacao: {
            error: false,
            errorMsg: "Necessário informar a data da indicação",
        },
        cd_pessoa_indica: {
            error: false,
            errorMsg: "Necessário informar o indicador",
        },
        id_trabalhou_empresa_indicacao: {
            error: false,
            errorMsg: "Necessário informar se trabalhou na empresa",
        },
        cd_pessoa_cliente: {
            error: false,
            errorMsg: "Necessário informar a empresa cliente",
        },
    });

    const getIndicacoes = useCallback(async () => {
        setLoading(true);
        await axiosInstance
            .get(`candidato/indicacoes/${cdPessoaCandidato}`)
            .then((response) => {
                setIndicacoes(response.data);
                setIndicacoesFiltradas(response.data);
                setIndicacoesCount(response.data.length);
                setLoading(false);
            })
            .catch(function (resp) {
                console.error(resp);
                let error = resp?.response?.data?.error;

                if (Array.isArray(error)) {
                    return toast.error(
                        error.join(" ") || "OOps ocorreu um erro ao buscar os dados da vaga"
                    );
                }
                return toast.error(error || "OOps ocorreu um erro ao buscar os dados da vaga");
            });
    }, [cdPessoaCandidato]);

    useEffect(() => {
        getIndicacoes();
    }, []);

    useEffect(() => {
        if (reload) {
            getIndicacoes();
            resetForm();
        }
    }, [reload]);

    useEffect(() => {
        filterIndicacoes();
    }, [filterIndicacao]);

    const resetForm = () => {
        setIndicacao(defaultIndicacao);
    };

    const onChangeFilterIndicacoes = useCallback((id, value) => {
        setFilterIndicacao(value);
    }, []);

    const filterIndicacoes = useCallback(() => {
        if (indicacoes.length > 0) {
            const filtered = indicacoes.filter((indicacao) => {
                return Object.values(indicacao).some(
                    (v) =>
                        typeof v == "string" &&
                        v.toLowerCase().includes(filterIndicacao.toLowerCase())
                );
            });
            setIndicacoesFiltradas(filtered);
        }
    }, [filterIndicacao, indicacoes]);

    const openEditIndicacao = (indicacao) => {
        setEditIndicacao(true);

        const indicacaoToEdit = {};

        Object.keys(indicacao).forEach((key) => {
            indicacaoToEdit[key.toLowerCase()] = indicacao[key];
        });

        setIndicacao({
            ...indicacaoToEdit,
            cd_pessoa_indica_antiga: indicacaoToEdit.cd_pessoa_indica,
        });

        setModalIndicacaoOpen(true);
    };

    const criarIndicacao = useCallback(async () => {

        if (requiresTipoIndicacao && !indicacao.id_tipo_indicacao) {
            setFormValidate(prev => ({
                ...prev,
                id_tipo_indicacao: {
                    ...prev.id_tipo_indicacao,
                    error: true
                }
            }));
            toast.warn("Necessário informar o tipo de indicação.");
            return;
        }

        if (validateForm(formValidate, setFormValidate, indicacao, toast)) {
            return;
        }

        await axiosInstance
            .post(`candidato/indicacoes/${cdPessoaCandidato}`, indicacao)
            .then(() => {
                setModalIndicacaoOpen(false);
                getIndicacoes();
            })
            .catch(function (resp) {
                console.error(resp);
                let error = resp?.response?.data?.error;

                if (Array.isArray(error)) {
                    return toast.error(
                        error.join(" ") || "OOps ocorreu um erro ao buscar os dados da vaga"
                    );
                }
                return toast.error(error || "OOps ocorreu um erro ao buscar os dados da vaga");
            });
    }, [indicacao]);

    const confirmarEdicao = async () => {
        await axiosInstance
            .put(`candidato/indicacoes/${cdPessoaCandidato}`, indicacao)
            .then(() => {
                handleCloseModal();
                getIndicacoes();
            })
            .catch(function (resp) {
                console.error(resp);
                let error = resp?.response?.data?.error;

                if (Array.isArray(error)) {
                    return toast.error(
                        error.join(" ") || "OOps ocorreu um erro ao buscar os dados da vaga"
                    );
                }
                return toast.error(error || "OOps ocorreu um erro ao buscar os dados da vaga");
            });
    };

    const renderTipoIndicacao = useCallback((tipo, cd_pessoa_cliente) => {
        switch (tipo) {
            case "O":
                return "Operacional";
            case "M":
                if (cd_pessoa_cliente == 80011) {
                    return "Operacional Efetivo";
                } else {
                    return "Jovem Ap. Prod.";
                }
            case "A":
                return "Jovem Ap. Adm.";
            case "T":
                return "Jovem Ap. Manut.";
        }
    }, []);

    const RenderTable = useMemo(() => {
        return (
            indicacoesFiltradas &&
            indicacoesFiltradas.map((indicacao, index) => (
                <div
                    className="odd:bg-white even:bg-gray-100 hover:bg-drop-shadow-1 flex flex-row items-center gap-4 px-1"
                    key={`row_${index}`}
                >
                    <div
                        className={`flex flex-row justify-between items-center text-sm py-1 w-full gap-1`}
                    >
                        <div className="flex flex-col gap-1 w-1/12">
                            <Caption>Data Indicação:</Caption>
                            <span className="font-semibold">{indicacao.DT_INDICACAO}</span>
                        </div>
                        <div className="flex flex-col gap-1 w-1/4">
                            <div className="flex flex-row gap-1">
                                <Caption>Pessoa:</Caption>
                                <span className="text-primary text-ellipsis">
                                    {indicacao.CD_PESSOA_INDICA}
                                </span>
                            </div>
                            <div className="flex flex-row gap-1">
                                {indicacao.NM_PESSOA_INDICA ? (
                                    <span className="font-semibold text-ellipsis">
                                        {ellipsize(indicacao.NM_PESSOA_INDICA, 32)}
                                    </span>
                                ) : (
                                    <span className="italic">Sem nome</span>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 w-1/4">
                            <Caption>Empresa:</Caption>
                            <Popover
                                content={<div className="p-2">{indicacao.NM_PESSOA}</div>}
                                position="auto"
                                trigger="hover"
                            >
                                <span className="font-semibold w-fit">
                                    {ellipsize(indicacao.NM_PESSOA, 40)}
                                </span>
                            </Popover>
                        </div>
                        <div className="flex flex-col gap-1 w-1/6">
                            <Caption>Tipo Indicação:</Caption>
                            {indicacao.ID_TIPO_INDICACAO ? (
                                <span className="font-semibold">
                                    {renderTipoIndicacao(indicacao.ID_TIPO_INDICACAO, indicacao.CD_PESSOA_CLIENTE)}
                                </span>
                            ) : (
                                <span className="italic">Sem tipo</span>
                            )}
                        </div>
                        <div className="flex flex-col gap-1 w-1/6">
                            <Caption>Observações:</Caption>
                            {indicacao.DS_OBSERVACAO ? (
                                <Popover
                                    content={<div className="p-2">{indicacao.DS_OBSERVACAO}</div>}
                                    position="top"
                                    trigger="hover"
                                >
                                    <span className="font-semibold text-ellipsis">
                                        {ellipsize(indicacao.DS_OBSERVACAO, 30)}
                                    </span>
                                </Popover>
                            ) : (
                                <span className="italic text-ellipsis">Sem observações</span>
                            )}
                        </div>

                        <TooltipComponent
                            content={
                                <>
                                    <span className="font-semibold">Editar indicação</span>
                                </>
                            }
                            asChild
                        >
                            <div className="flex flex-col gap-1 w-12">
                                <Button
                                    buttonType={"primary"}
                                    outline
                                    bordered
                                    className="text-primary hover:text-white"
                                    onClick={() => {
                                        openEditIndicacao(indicacao);
                                    }}
                                    size="small"
                                >
                                    <FontAwesomeIcon icon={faEdit} width="18" height="18" />
                                </Button>
                            </div>
                        </TooltipComponent>
                    </div>
                </div>
            ))
        );
    }, [indicacoesFiltradas]);

    const handleOpenModal = (editMode) => {
        setEditIndicacao(editMode);
        setModalIndicacaoOpen(true);
    };

    const handleCloseModal = () => {
        setModalIndicacaoOpen(false);
        setEditIndicacao(false);
        resetForm();
    };

    return (
        <div className="relative">
            <div
                className={`flex flex-col bg-primary rounded-t-md`}
                id={"table-indicacoes-candidato"}
            >
                <div className="flex flex-row justify-between text-white">
                    <div className="flex flex-row items-center gap-1 p-2 w-full">
                        <Subtitle className={"pr-2"}>Indicações do candidato</Subtitle>
                        <Title>{nmCandidato}</Title>
                    </div>
                    <div className="flex flex-row gap-1 items-center w-full ">
                        <div className="flex p-1 text-xs w-full justify-end">
                            Exibindo {indicacoesCount} indicações
                        </div>
                        <div className="p-1 w-full">
                            <InputText
                                placeholder="Filtrar"
                                clearable={true}
                                onChange={onChangeFilterIndicacoes}
                                id="filtro_indicao"
                                small
                            />
                        </div>
                    </div>
                </div>
                <div className="flex bg-white">
                    <div
                        className={`flex flex-col max-h-[60vh] overflow-y-auto border-l border-r w-full`}
                    >
                        {loading ? (
                            <DataLoading />
                        ) : indicacoes.length <= 0 ? (
                            <NoDataFound />
                        ) : (
                            RenderTable
                        )}
                    </div>
                </div>
            </div>

            {!modalIndicacaoOpen && (
                <FabAdd
                    className={`right-[25px] bottom-[25px]`}
                    onClick={() => handleOpenModal(false)}
                />
            )}

            <ModalGrid
                modalControl={modalIndicacaoOpen}
                closeModalCallback={handleCloseModal}
                size="md"
                height="h-fit"
                contentClass={"h-full"}
                title={editIndicacao ? "Editar indicação" : "Nova indicação"}
                footer={
                    <Button
                        buttonType={"primary"}
                        onClick={() => (editIndicacao ? confirmarEdicao() : criarIndicacao())}
                    >
                        Confirmar
                    </Button>
                }
                footerClass={`text-right`}
                dismissible={false}
            >
                <ModalIndicacao
                    indicacao={indicacao}
                    onChangeForm={onChangeForm}
                    editMode={editIndicacao}
                    onRequireTipoIndicacao={setRequiresTipoIndicacao}
                />
            </ModalGrid>
        </div>
    );
}

export default TableIndicacoesCandidato;
