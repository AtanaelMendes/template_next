import { cn, empty } from "@/assets/utils";
import Button from "@/components/buttons/Button";
import ButtonGroup from "@/components/buttons/ButtonGroup";
import FabAdd, { FabSave } from "@/components/buttons/FloatActionButton";
import PillsBadge from "@/components/buttons/PillsBadge";
import CurriculoResumido from "@/components/candidatos/CurriculoResumido";
import { DebouncedSearch } from "@/components/inputs/DebouncedSearch";
import InputText from "@/components/inputs/InputText";
import Radio from "@/components/inputs/Radio";
import ModalGrid from "@/components/Layouts/ModalGrid";
import NoDataFound from "@/components/Layouts/NoDataFound";
import { TooltipComponent } from "@/components/Layouts/TooltipComponent";
import GeraCurriculo from "@/components/selecao/entrar/GeraCurriculo";
import { useAppContext } from "@/context/AppContext";
import axiosInstance from "@/plugins/axios";
import {
    faEnvelopeOpen,
    faEnvelopeOpenText,
    faFileLines,
    faFileSignature,
    faInfoCircle,
    faMars,
    faThumbsDown,
    faThumbsUp,
    faTrashRestore,
    faVenus,
    faWheelchair,
    faXmark,
    faReply
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { addDays, format } from "date-fns";
import { Datepicker } from "flowbite-react";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";

const CandidatosRelacionados = ({ data, active, refreshList, nrVaga, tabName, atualizaDetalhesVaga, situacaoVaga }) => {
    const { candidatosRelacionadosReady } = useAppContext();
    const [cdPessoaCurriculoResumido, setCdPessoaCurriculoResumido] = useState("");
    const [filter, setFilter] = useState({ filtro_candidatos_relacionados: "" });
    const { toast, user } = useAppContext();
    const [modalGeraCurriculo, setModalGeraCurriculo] = useState({
        show: false,
        cdPessoaCandidato: "",
        nome: "",
    });
    const [modalAprovaCandidato, setModalAprovaCandidato] = useState(false);
    const formAprovaCandidatoDefault = {
        nm_candidato: "",
        cd_pessoa_candidato: "",
        nr_vaga: "",
        dt_faturamento: moment().format("YYYY-MM-DD"),
        dt_inicio_trabalho: moment().format("YYYY-MM-DD"),
    };
    const [formAprovaCandidato, setFormAprovaCandidato] = useState(formAprovaCandidatoDefault);
    const [candidatosParaRelacionar, setCandidatosParaRelacionar] = useState([]);
    const [showRelacionar, setShowRelacionar] = useState(false);
    const [showDatepicker, setShowDatepicker] = useState(false);
    const [modifyedData, setModifyedData] = useState(undefined);
    const [isVagaCongelada, setIsVagaCongelada] = useState(true);

    const getNextSunday = () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
        return addDays(today, daysUntilSunday);
    };

    const [dtFaturamento, setDtFaturamento] = useState(() => getNextSunday());
    const [dtInicioTrabalho, setDtInicioTrabalho] = useState(() => addDays(getNextSunday(), 1));

    const curriculoResumidoCallback = () => {
        setCdPessoaCurriculoResumido("");
    };

    useEffect(() => {
        if (Array.isArray(data) && data.length > 0) {
            const tipoContratacao = parseInt(data[0].CD_TIPO_CONTRATACAO, 10);
            setShowDatepicker(tipoContratacao === 1);
        }
    }, [data]);

    const changeModalGeraCurriculo = (state, cdPessoaCandidato, nome, relacionar) => {
        if (isVagaCongelada) {
            return toast.warning("Vaga congelada, não é possível gerar currículo");
        }
        if (relacionar) relacionarCandidato(cdPessoaCandidato, 4);

        setModalGeraCurriculo((prev) => ({
            ...prev,
            show: state,
            cdPessoaCandidato,
            nome,
        }));
    };

    const changeModalGeraCurriculoVisibility = (state) => {
        if (state) setModalGeraCurriculo((prev) => ({ ...prev, show: state }));
        else
            setModalGeraCurriculo((prev) => ({
                ...prev,
                show: state,
                cdPessoaCandidato: "",
                nome: "",
            }));
    };

    const onChangeFormAprovaCand = (inputId, value) => {
        setFormAprovaCandidato((prev) => ({
            ...prev,
            [inputId]: value,
        }));
    };

    useEffect(() => {
        setFormAprovaCandidato((prev) => ({
            ...prev,
            dt_faturamento: format(dtFaturamento, "yyyy-MM-dd"),
            dt_inicio_trabalho: format(dtInicioTrabalho, "yyyy-MM-dd"),
        }));
    }, [dtFaturamento, dtInicioTrabalho]);

    useEffect(() => {
        if (situacaoVaga == 13) {
            setIsVagaCongelada(true);
            return;
        }
        setIsVagaCongelada(false)
    }, [situacaoVaga, candidatosRelacionadosReady]);

    const setFilterTextCallback = (id, value) => {
        setFilter({ [id]: value });
    };

    const getCandidatoAprovarInfo = (nm_candidato, cd_pessoa_candidato, nr_vaga) => {
        if (isVagaCongelada) {
            return toast.warning("Vaga congelada, não é possível aprovar candidato");
        }
        setFormAprovaCandidato({
            ...formAprovaCandidato,
            nm_candidato: nm_candidato,
            cd_pessoa_candidato: cd_pessoa_candidato,
            nr_vaga: nr_vaga,
        });
        setModalAprovaCandidato(true);
    };

    const voltarCandidatoAprovado = (cd_pessoa_candidato, nr_vaga) =>{
        axiosInstance
            .post("vaga/voltar-candidato-aprovado", {
                cd_pessoa_candidato: cd_pessoa_candidato,
                nr_vaga: nr_vaga,
            })
            .then(function (response) {
                if (response.status === 200) {
                    refreshList();
                    toast.success("Candidato foi removido da situação aprovado com sucesso!");
                    if (typeof atualizaDetalhesVaga === 'function') {
                        atualizaDetalhesVaga(true);
                    }
                    return;
                }
            })
            .catch(function (response) {
                if(response?.response?.data?.error) {   
                    return toast.error(response.response.data.details);
                }
                toast.error("Não foi possível remover o candidato da situação aprovado.");
            });
    }

    const restaurarCandidato = useCallback((cd_pessoa_candidato, nr_vaga) => {
        axiosInstance
            .post("vaga/restaurar-candidato", {
                cd_pessoa_candidato: cd_pessoa_candidato,
                nr_vaga: nr_vaga,
            })
            .then(function (response) {
                if (response.status === 200) {
                    refreshList();
                    return toast.success("Candidato restaurado com sucesso");
                }
            })
            .catch(function (response) {
                if(response?.response?.data?.error) {   
                    return toast.error(response.response.data.details);
                }
                toast.error("Não foi possível restaurar o candidato.");
            });
    });

    const reprovarCandidato = (cd_pessoa_candidato, nr_vaga) => {
        axiosInstance
            .post("vaga/reprovar-candidato", {
                cd_pessoa_candidato: cd_pessoa_candidato,
                nr_vaga: nr_vaga,
            })
            .then(function (response) {
                if (response.status === 200) {
                    refreshList();
                    return toast.success("Candidato reprovado com sucesso");
                }
            })
            .catch(function (response) {
                if(response?.response?.data?.error) {   
                    return toast.error(response.response.data.details);
                }
                toast.error("Não foi possível reprovar o candidato.");
            });
    };

    const setGerarEncaminhamento = (nrVaga, cdPessoaCandidato) => {
        axiosInstance
            .post(`candidato/aprova-candidato-estagio-vaga/${nrVaga}/${cdPessoaCandidato}/5`)
            .then(function (response) {
                if (response.data.status == 0) {
                    toast.error(response.data.msg);
                    return;
                }

                toast.success(response.data.msg);
                refreshList();
            })
            .catch(function (resp) {
                console.error(resp);
                let error = resp?.response?.data?.error;

                if (Array.isArray(error)) {
                    return toast.error(error.join(' ') || 'Ops ocorreu um erro ao buscar os dados da vaga');
                }
                return toast.error(error || 'Ops ocorreu um erro ao buscar os dados da vaga');
            });
    };

    useEffect(() => {
        const isAnyApproved = data.some(
            (cand) => (cand.ID_SITUACAO === "A" && parseInt(cand.CD_ESTAGIO_VAGA) >= 6) || parseInt(cand.CD_ESTAGIO_VAGA) >= 7
        );

        const mapedData = data?.map((cand) => {
            if (parseInt(cand.CD_ESTAGIO_VAGA) >= 7 && (cand.ID_SITUACAO == "" || cand.ID_SITUACAO == null)) {
                cand.ID_SITUACAO = "A";
            }
            const situacaoVaga = cand.CD_SITUACAO_ATUAL_VAGA;
            const tipoContratacao = cand.CD_TIPO_CONTRATACAO;

            const action = [
                {
                    tooltip: "Gerar currículo",
                    id: "btn-gera-curriculo",
                    label: (
                        <FontAwesomeIcon
                            icon={faFileLines}
                            width="15"
                            height="15"
                            className={isVagaCongelada ? "text-blue-300" :"text-primary"}
                        />
                    ),
                    onclick: () => {
                        changeModalGeraCurriculo(
                            true,
                            cand.CD_PESSOA,
                            cand.NM_PESSOA,
                            parseInt(cand.CD_ESTAGIO_VAGA) < 4
                        );
                    },
                    className:(isVagaCongelada ? "cursor-not-allowed" :""),
                }
            ];
            //Botões que não devem ser exibidos para candidatos reprovados (ID_SITUACAO "R" ou ID_SITUACAO vazio quando tiver alguem aprovado na vaga)
            if ((cand.ID_SITUACAO === "A" && parseInt(cand.CD_ESTAGIO_VAGA) >= 6) || (!isAnyApproved && cand.ID_SITUACAO !== "R")) {
                action.push({
                    tooltip: "Gerar encaminhamento",
                    id: "btn-gera-encaminhamento",
                    label: (
                        <FontAwesomeIcon
                            icon={faFileSignature}
                            width="15"
                            height="15"
                            className={isVagaCongelada ? "text-blue-300" :"text-primary"}
                        />
                    ),
                    onclick: () => {
                        if (isVagaCongelada) {
                            return toast.warning("Vaga congelada, não é possível gerar encaminhamento");
                        }
                        parseInt(cand.CD_ESTAGIO_VAGA) >= 5
                            ? abrirEncaminhamento(cand.CD_PESSOA)
                            : gerarEncaminhamento(cand.CD_PESSOA);

                        setGerarEncaminhamento(nrVaga, cand.CD_PESSOA);
                    },
                    className:(isVagaCongelada ? "cursor-not-allowed" :""),
                },
                    {
                        tooltip: `${cand.ID_ENVIA_EMAIL_REPROV == "S" ? "Desabilitar" : "Habilitar"
                            } envio de email`,
                        id: "btn-envia-email",
                        label: (
                            <FontAwesomeIcon
                                icon={
                                    cand.ID_ENVIA_EMAIL_REPROV == "S"
                                        ? faEnvelopeOpenText
                                        : faEnvelopeOpen
                                }
                                width="15"
                                height="15"
                                className={isVagaCongelada ? "text-blue-300" :
                                    (cand.ID_ENVIA_EMAIL_REPROV == "S" 
                                        ? "text-primary"
                                        : "text-gray-300")
                                }
                            />
                        ),
                        onclick: () => {
                            toggleEmailAprovacao(
                                cand.CD_PESSOA,
                                cand.ID_ENVIA_EMAIL_REPROV == "S" ? "N" : "S"
                            );
                        },
                        className: (isVagaCongelada ? "cursor-not-allowed" : ""),
                    });
            }

            if (cand.ID_SITUACAO !== "R" && !isAnyApproved) {
                let btnDisabled = (parseInt(cand.CD_SITUACAO_ATUAL_VAGA) == 7); 

                let tooltipDisabled = "Status da Vaga precisa estar 'Aberta'";

                action.push(
                    {
                        tooltip: btnDisabled == false ? "Aprovar candidato" : tooltipDisabled,
                        id: "btn-aprova-cand",
                        disabled: btnDisabled,
                        label: (
                            <FontAwesomeIcon
                                icon={faThumbsUp}
                                width="15"
                                height="15"
                                className={isVagaCongelada ? "text-green-200" :"text-green-500"}
                            />
                        ),
                        onclick: () => {
                            getCandidatoAprovarInfo(
                                cand.NM_PESSOA,
                                cand.CD_PESSOA,
                                cand.NR_VAGA
                            );
                        },
                        className:(isVagaCongelada ? "cursor-not-allowed" :""),
                    },
                    {
                        tooltip: btnDisabled == false ? "Reprovar candidato" : tooltipDisabled,
                        id: "btn-reprova-cand",
                        disabled: btnDisabled,
                        label: (
                            <FontAwesomeIcon
                                icon={faThumbsDown}
                                width="15"
                                height="15"
                                className={isVagaCongelada ? "text-red-300" : "text-red-500"}
                            />
                        ),
                        onclick: () => {
                            if (isVagaCongelada) {
                                return toast.warning("Vaga congelada, não é possível gerar encaminhamento");
                            }
                            if (
                                !confirm(
                                    "Tem certeza que deseja reprovar esse candidato?\n" +
                                    cand.NM_PESSOA
                                )
                            )
                                return;
                            reprovarCandidato(cand.CD_PESSOA, cand.NR_VAGA);
                        },
                        className:(isVagaCongelada ? "cursor-not-allowed" :""),
                    }
                );
            }

            if (cand.ID_SITUACAO == "A" && parseInt(cand.CD_ESTAGIO_VAGA) >= 6 && isAnyApproved && 
            (tipoContratacao == 1 || tipoContratacao == 1) &&
            situacaoVaga != 6) {
                action.push(
                    {
                        tooltip:  "Voltar Candidato Aprovado" ,
                        id: "btn-volta-cand-aprovado",
                        label: (
                            <FontAwesomeIcon
                                icon={faReply}
                                width="15"
                                height="15"
                                className={"text-red-500"}
                            />
                        ),
                        onclick: () => {
                            if (!confirm("Tem certeza que deseja voltar o candidato aprovado para pendente?")) return;
                            voltarCandidatoAprovado(
                                cand.CD_PESSOA,
                                cand.NR_VAGA
                            );
                        },
                    });
            }

            return {
                CD_ESTAGIO_VAGA: parseInt(cand.CD_ESTAGIO_VAGA),
                NR_VAGA: cand.NR_VAGA,
                IS_REPROVADO: cand.ID_SITUACAO === "R",
                IS_APROVADO: parseInt(cand.CD_ESTAGIO_VAGA) >= 6 && cand.ID_SITUACAO === "A",
                STATUS:
                    cand.ID_SITUACAO === "R"
                        ? "Reprovado"
                        : parseInt(cand.CD_ESTAGIO_VAGA) >= 6 && cand.ID_SITUACAO === "A"
                            ? "Aprovado"
                            : "",
                NOTA: cand.NOTA / 2,
                ID_SEXO: cand.ID_SEXO,
                ID_POSSUE_DEFICIENCIA: cand.ID_POSSUE_DEFICIENCIA,
                CD_PESSOA: cand.CD_PESSOA,
                NM_CANDIDATO: cand.NM_PESSOA,
                RELACIONADO:
                    cand.ANALISTA_VAGA.split("-")[0] + " - " + cand.ANALISTA_VAGA.split("-")[1],
                DT_SITUACAO_ATUAL: cand.DT,
                CRIADO_EM: cand.CRIADO_EM,
                DT_CURRICULO: cand.DT_CURRICULO,
                DT_ENCAMINHAMENTO: cand.DT_ENCAMINHAMENTO,
                CD_ORIGEM_RELACIONAMENTO: cand.CD_ORIGEM_RELACIONAMENTO,
                OPCOES: <ButtonGroup buttons={action} small />,
            };
        }) || [];

        setModifyedData(mapedData.length > 0 ? mapedData : []);
    }, [data]);

    const aprovarCandidato = () => {
        if (!confirm("Tem certeza que deseja aprovar esse candidato?")) return;

        if (formAprovaCandidato.dt_faturamento == moment().format("YYYY-MM-DD")) {
            return toast.error("A data do faturamento não pode ser a data atual.");
        }

        const fourteenDaysAgo = moment().subtract(14, 'days').format("YYYY-MM-DD");

        if (formAprovaCandidato.dt_inicio_trabalho <= fourteenDaysAgo) {
            return toast.error("A data de início de trabalho deve ser maior que 14 dias atrás.");
        }

        axiosInstance
            .post("vaga/aprovar-candidato", {
                ...formAprovaCandidato,
                cd_pessoa_analista: user.cd_sip,
            })
            .then(function (response) {
                if (response.status === 200) {
                    refreshList();
                    setModalAprovaCandidato(false);
                    
                    if (typeof atualizaDetalhesVaga === 'function') {
                        atualizaDetalhesVaga(true);
                    }
                    
                    return toast.success("Candidato aprovado com sucesso");
                }
            })
            .catch(function (error) {
                toast.error("Não foi possível aprovar o candidato.");
            });
    };

    const cancelaAprovacao = () => {
        setFormAprovaCandidato(formAprovaCandidatoDefault);
        setModalAprovaCandidato(false);
    };

    const addCandidatoParaRelacionar = (val, label) => {
        const nomeLimpo = label.split(" | ")[0].trim();

        setCandidatosParaRelacionar(prevState => [
            ...prevState,
            { CD_PESSOA_CANDIDATO: val, NM_PESSOA: nomeLimpo, CD_ESTAGIO_VAGA: 3 },
        ]);
    };

    const removerCandidatoParaRelacionar = (cd_pessoa) => {
        setCandidatosParaRelacionar(
            candidatosParaRelacionar.filter((cand) => cand.CD_PESSOA_CANDIDATO !== cd_pessoa)
        );
    };

    const changeTipoRelacionamento = (cd_pessoa, value) => {
        setCandidatosParaRelacionar(
            candidatosParaRelacionar.map((cand) => {
                if (cand.CD_PESSOA_CANDIDATO === cd_pessoa) {
                    return { ...cand, CD_ESTAGIO_VAGA: value };
                }
                return cand;
            })
        );
    };

    const relacionarCandidatos = async () => {
        await axiosInstance
            .post("vaga/relacionar-candidatos", {
                candidatos: candidatosParaRelacionar,
                nr_vaga: nrVaga,
            })
            .then(function (response) {
                if (response.status === 200) {
                    refreshList();
                    setShowRelacionar(false);
                    setCandidatosParaRelacionar([]);

                    if (Array.isArray(response.data)) {
                        const successMessages = response.data
                            .filter((msg) => msg.message && !msg.error)
                            .map((msg) => msg.message);

                        const errorMessages = response.data
                            .filter((msg) => msg.message && msg.error)
                            .map((msg) => msg.message);

                        if (successMessages.length > 0) toast.success(successMessages.join("\n"));
                        if (errorMessages.length > 0) toast.error(errorMessages.join("\n"));

                        return;
                    }

                    toast[response.data.error ? "error" : "success"](response.data.message);
                }
            })
            .catch(function () {
                toast.error("Não foi possível relacionar os candidatos.");
            });
    };

    const relacionarCandidato = (cd_pessoa_candidato, cd_estagio_vaga) => {
        axiosInstance
            .post("vaga/relacionar-candidato", {
                cd_pessoa_candidato,
                cd_estagio_vaga,
                nr_vaga: nrVaga,
            })
            .then(function (response) {
                if (response.status === 200) {
                    refreshList();
                    switch (cd_estagio_vaga) {
                        case 4:
                            return toast.success(
                                "Situação do candidato alterada para 'Currículo gerado'"
                            );
                        case 5:
                            return toast.success(
                                "Situação do candidato alterada para 'Encaminhado'"
                            );
                    }
                }
            })
            .catch(function () {
                toast.error("Não foi possível relacionar os candidatos.");
            });
    };

    const abrirEncaminhamento = (cd_pessoa) => {
        const { hostname, protocol } = window.location;

        window.open(
            `${protocol}//${hostname}/rhbsaas/selecao/gera_encaminhamento.php?cd=${cd_pessoa}&vg=${nrVaga}`,
            "_blank"
        );
    };

    const gerarEncaminhamento = (cd_pessoa) => {
        relacionarCandidato(cd_pessoa, 5);
        abrirEncaminhamento(cd_pessoa);
    };

    const toggleEmailAprovacao = (cd_pessoa, email_reprovacao) => {
        if (isVagaCongelada) 
            return toast.warning("Vaga congelada, não é possível alterar o email de reprovação");
        axiosInstance
            .post(`candidato/toggle-email-reprovacao/${cd_pessoa}/${nrVaga}`, { email_reprovacao })
            .then(function (response) {
                if (response.status === 200) {
                    refreshList();
                    return toast.success("Email de reprovação alterado com sucesso");
                }
            })
            .catch(function (error) {
                toast.error("Não foi possível alterar o email de reprovação.");
            });
    };

    const ModalAprovaCandidatoFooter = () => {
        return (
            <>
                <Button buttonType="danger" outline size="small" onClick={cancelaAprovacao}>
                    CANCELAR
                </Button>
                <Button
                    buttonType="success"
                    size="small"
                    onClick={aprovarCandidato}
                    className="ml-2"
                >
                    APROVAR
                </Button>
            </>
        );
    };

    const renderCandidatosRelacionados = useMemo(() => {
        if (empty(modifyedData)) return <NoDataFound isLoading={!candidatosRelacionadosReady} />;

        const origem_relacionamento = {
            "1": "Recrutamento",
            "99": "Callcenter"
        };

        const isAnyApproved = data.some(
            (cand) => (cand.ID_SITUACAO === "A" && parseInt(cand.CD_ESTAGIO_VAGA) >= 6) || parseInt(cand.CD_ESTAGIO_VAGA) >= 7
        );

        let renderedData = (modifyedData.filter((item) => Object.values(item).some((v) => typeof v === "string" && v.toLowerCase().includes(filter.filtro_candidatos_relacionados.toLowerCase())))?.map((cand, index) => (
            <div
                className={`flex flex-wrap odd:bg-white even:bg-gray-200 text-sm hover:bg-drop-shadow-1 p-2 border-b border-slate-300 ${index >= 2 && index === modifyedData?.length - 1 ? "mb-20" : ""
                    }`}
                key={`relacionado-${cand.CD_PESSOA}`}
            >
                <div className={`w-full xl:w-7/12`}>
                    <div className="flex flex-col gap-y-1">
                        <div className="flex items-center gap-1">
                            <span className="text-xs text-slate-500">SIP:</span>
                            <span className="text-primary">{cand.CD_PESSOA}</span>
                            <Rating
                                style={{ maxWidth: "80px", height: "16px" }}
                                value={cand.NOTA || 0}
                                readOnly
                            />
                            <PillsBadge type={"primary"}>
                                {origem_relacionamento[cand.CD_ORIGEM_RELACIONAMENTO] || "Seleção"}
                            </PillsBadge>
                        </div>
                        <div className="flex flex-row gap-1">
                            <span
                                className="font-semibold cursor-pointer flex items-center gap-1 text-primary hover:underline"
                                onClick={() => {
                                    setCdPessoaCurriculoResumido(cand.CD_PESSOA);
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={cand.ID_SEXO === "M" ? faMars : faVenus}
                                    width="20"
                                    height="20"
                                    className={`${cand.ID_SEXO === "M" ? "text-primary" : "text-pink-500"}`}
                                />
                                {cand.NM_CANDIDATO}
                                <>
                                    {cand.IS_APROVADO && (
                                        <PillsBadge type={`success`} className="w-min">
                                            Aprovado
                                        </PillsBadge>
                                    )}
                                    {(cand.IS_REPROVADO || (isAnyApproved && !cand.IS_APROVADO)) && (
                                        <PillsBadge type={`danger`} className="w-min">
                                            Reprovado
                                        </PillsBadge>
                                    )}
                                </>
                            </span>
                        </div>
                        <div className="flex flex-row gap-1">
                            <TooltipComponent content={`Relacionado em ${cand.CRIADO_EM}`} >
                                <span className="text-xs text-slate-500">Relacionado por:</span>
                                <span className="text-xs cursor-pointer"> {cand.RELACIONADO}</span>
                            </TooltipComponent>
                        </div>
                        <div className="flex flex-row gap-1 ">
                            <span className="text-xs text-slate-500">Currículo gerado:</span>
                            {cand.DT_CURRICULO ? (
                                cand.DT_CURRICULO
                            ) : (
                                <span className={"text-xs italic font-semibold"}>
                                    Não gerado
                                </span>
                            )}
                        </div>
                        <div className="flex flex-row gap-1 ">
                            <span className="text-xs text-slate-500">Encaminhamento:</span>
                            {cand.DT_ENCAMINHAMENTO ? (
                                cand.DT_ENCAMINHAMENTO
                            ) : (
                                <span className={"text-xs italic font-semibold"}>
                                    Não encaminhado
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className={`w-full xl:w-4/12 flex items-center`}>
                    <div className="flex flex-row flex-wrap gap-y-2">
                        {cand.OPCOES}

                        {cand.IS_REPROVADO &&
                            !isAnyApproved && (
                                <Button
                                    size="small"
                                    buttonType="danger"
                                    className={`inline-flex items-center ml-2`}
                                    disabled={isVagaCongelada}
                                    onClick={() => {
                                        if (
                                            !confirm(
                                                "Tem certeza que deseja restaurar o candidato?\n" + cand.NM_CANDIDATO
                                            )
                                        )
                                            return;
                                        restaurarCandidato(cand.CD_PESSOA, cand.NR_VAGA);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTrashRestore} width="16" height="16" />
                                    &nbsp;Restaurar
                                </Button>
                            )}
                    </div>
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
        ))
        );
        return renderedData;
    }, [data, candidatosRelacionadosReady, modifyedData, filter]);

    const renderCandidatosParaRelacionar = useCallback(() => {
        if (candidatosParaRelacionar.length === 0) return <NoDataFound />;
        return (
            candidatosParaRelacionar?.map((cand) => (
                <div
                    className="flex flex-wrap odd:bg-white even:bg-gray-200 text-sm hover:bg-drop-shadow-1 p-2 border-b border-slate-300"
                    key={`relacionado-${cand.CD_PESSOA_CANDIDATO}`}
                >
                    <div className="flex flex-row items-center gap-1 w-full">
                        <div className="flex flex-col items-center p-2 text-sm w-full gap-2">
                            <span className="w-full">
                                {cand.NM_PESSOA}
                            </span>
                            <div className="w-full flex flex-row justify-between">
                                <Radio
                                    id={`relacionar_${cand.CD_PESSOA_CANDIDATO}`}
                                    label="Relacionar candidato"
                                    name={`cd_estagio_vaga_${cand.CD_PESSOA_CANDIDATO}`}
                                    onChange={() =>
                                        changeTipoRelacionamento(cand.CD_PESSOA_CANDIDATO, 3)
                                    }
                                    checked={parseInt(cand.CD_ESTAGIO_VAGA) === 3}
                                />
                                <Radio
                                    id={`curriculo_${cand.CD_PESSOA_CANDIDATO}`}
                                    label="Enviar currículo"
                                    name={`cd_estagio_vaga_${cand.CD_PESSOA_CANDIDATO}`}
                                    onChange={() =>
                                        changeTipoRelacionamento(cand.CD_PESSOA_CANDIDATO, 4)
                                    }
                                    checked={parseInt(cand.CD_ESTAGIO_VAGA) === 4}
                                />
                                <Radio
                                    id={`encaminhar_${cand.CD_PESSOA_CANDIDATO}`}
                                    label="Encaminhar candidato"
                                    name={`cd_estagio_vaga_${cand.CD_PESSOA_CANDIDATO}`}
                                    onChange={() =>
                                        changeTipoRelacionamento(cand.CD_PESSOA_CANDIDATO, 5)
                                    }
                                    checked={parseInt(cand.CD_ESTAGIO_VAGA) === 5}
                                />
                            </div>
                        </div>
                        <Button
                            size="small"
                            pill
                            buttonType="danger"
                            outline
                            onClick={() => removerCandidatoParaRelacionar(cand.CD_PESSOA_CANDIDATO)}
                            className="py-2"
                            bordered
                        >
                            <FontAwesomeIcon icon={faXmark} width="14" height="14" />
                        </Button>
                    </div>
                </div>
            )) || []
        );
    }, [candidatosParaRelacionar]);

    if (!active) return null;

    const temCandAprovado = data.some(
        (cand) => (cand.ID_SITUACAO === "A" && parseInt(cand.CD_ESTAGIO_VAGA) >= 6) || parseInt(cand.CD_ESTAGIO_VAGA) >= 7
    );
    const OpcaoCandidato = ({ option }) => {
        const [relacionado, setRelacionado] = useState(null); // null: verificando, true/false: pronto

        if (!option?.label) return null;

        const parts = option.label.split("|").map(part => part.trim());

        const name = parts[0] || "Nome desconhecido";
        const cpf = parts.find(part => part.includes("CPF"))?.split(":")[1]?.trim();
        const nameWithCpf = cpf ? `${name} - CPF: ${cpf}` : name;
        const cd_pessoa = name.split(" - ")[0];
        const inativo = parts.find(part => part.includes("INATIVO"))?.split(":")[1]?.trim();
        const bloqueado = parts.find(part => part.includes("BLOQUEIO"))?.split(":")[1]?.trim();

        useEffect(() => {
            let isMounted = true;
            setRelacionado(null); // enquanto carrega
            axiosInstance.post(`vaga/pode-relacionar-candidato-nova-vaga`, { cd_pessoa })
                .then((response) => {
                    if (isMounted) {
                        setRelacionado(response.data === false); // false = está relacionado
                    }
                }).catch(() => {
                    if (isMounted) setRelacionado(false); // erro = considerado relacionado
                });
            return () => { isMounted = false; };
        }, [cd_pessoa]);

        const isDisabled = inativo !== "N/A" || bloqueado !== "N/A" || relacionado === true || relacionado === null;

        return (
            <div
                className={`flex flex-col items-start gap-1 p-2 rounded-sm border-b ${isDisabled ? 'bg-gray-200 cursor-not-allowed opacity-50' : 'hover:bg-gray-100 cursor-pointer'
                    }`}
                onMouseDown={(e) => {
                    if (isDisabled) {
                        e.preventDefault();
                        e.stopPropagation();
                        toast.warning("Este candidato não pode ser selecionado pois está inativo, bloqueado ou já relacionado.");
                    }
                }}
                onClick={(e) => {
                    if (isDisabled) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }}
            >
                <p className="text-black font-medium">{nameWithCpf}</p>
                {relacionado === null && <PillsBadge type={'info'}>Verificando...</PillsBadge>}
                {relacionado === true && <PillsBadge type={'warning'}>RELACIONADO</PillsBadge>}
                {inativo !== "N/A" && <PillsBadge type={'warning'}>INATIVO</PillsBadge>}
                {bloqueado !== "N/A" && <PillsBadge type={'danger'}>BLOQUEADO</PillsBadge>}
            </div>
        );
    };
    
    return (
        <div className="flex flex-col relative min-h-[500px] bg-white">
            <CurriculoResumido cdPessoaCandidato={cdPessoaCurriculoResumido} closeCallback={curriculoResumidoCallback} tabName={tabName} />
            <div className="w-full shadow-lg z-20 h-fit">
                {showRelacionar ? (
                    <div className="flex flex-col py-2">
                        <div className="flex flex-col w-full p-2">
                            <DebouncedSearch.Root id="cd_pessoa_add_cand">
                                <div className="flex flex-row items-center">
                                    <DebouncedSearch.Label label="Candidato" />
                                    <div className="rounded-full -translate-y-0.5">
                                        <TooltipComponent
                                            content="A busca retornará apenas usuários desbloqueados"
                                        >
                                            <FontAwesomeIcon
                                                icon={faInfoCircle}
                                                width='16'
                                                height='16'
                                                color='blue'
                                                className='self-start ml-2'
                                                tabIndex={-1}
                                            />
                                        </TooltipComponent>
                                    </div>
                                </div>
                                <DebouncedSearch.Select
                                    delayed
                                    setData={addCandidatoParaRelacionar}
                                    optId="CD_PESSOA"
                                    optLabel="NM_PESSOA_FILTRO"
                                    urlGet="candidato/candidatos"
                                    renderOptionLabel={(option) => <OpcaoCandidato option={option} />}
                                />

                            </DebouncedSearch.Root>
                        </div>
                        <div className="flex justify-end w-full p-2">
                            <Button
                                id="btn-cancel-add-cand"
                                buttonType="danger"
                                outline
                                size="small"
                                className="mr-2"
                                onClick={() => {
                                    setShowRelacionar(false);
                                }}
                            >
                                CANCELAR
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex py-2">
                        <div className="ml-auto w-1/2">
                            <InputText
                                placeholder="Filtrar"
                                clearable={true}
                                onChange={setFilterTextCallback}
                                helperText={`Exibindo ${modifyedData?.length || 0} registros`}
                                id="filtro_candidatos_relacionados"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="w-full max-h-[400px] xl:max-h-[500px] overflow-y-auto relative">
                {showRelacionar ? renderCandidatosParaRelacionar() : renderCandidatosRelacionados}
            </div>

            {!temCandAprovado &&
                (showRelacionar ? (
                    <FabSave
                        id="btn-salvar-candidatos"
                        className={cn("bottom-5 right-5 z-10")}
                        onClick={relacionarCandidatos}
                        disabled={candidatosParaRelacionar.length === 0}
                        disableZIndex={true}
                    />
                ) : (
                    <FabAdd
                        id="btn-add-candidato"
                        className={cn("bottom-5 right-5 z-10")}
                        onClick={() => setShowRelacionar(true)}
                        disabled={isVagaCongelada}
                        disableZIndex={true}
                    />
                ))}

            <ModalGrid
                height={"h-3/6"}
                customMargin={"-mt-40"}
                title="Aprovar candidato"
                modalControl={modalAprovaCandidato}
                size={"sm"}
                setModalControl={setModalAprovaCandidato}
                id={`modal-aprova-candidato`}
                footer={<ModalAprovaCandidatoFooter />}
                footerClass="text-right"
            >
                <div className="w-full">
                    <div className="w-full font-semibold text-2xl">
                        {formAprovaCandidato.nm_candidato}
                    </div>

                    <div className="flex flex-row items-center gap-2 pt-2 lg:scale-95">
                        {showDatepicker ? (
                            <div className="flex flex-row w-full justify-start">
                                <div className="w-full mb-5">
                                    <label
                                        htmlFor="dt_faturamento"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Data de faturamento
                                    </label>
                                    <div className="absolute">
                                        <Datepicker
                                            language="pt-br"
                                            labelClearButton="Limpar"
                                            labelTodayButton="Hoje"
                                            showClearButton={true}
                                            autoHide={true}
                                            defaultDate={dtFaturamento}
                                            onSelectedDateChanged={(date) => {
                                                setDtFaturamento(date);
                                                onChangeFormAprovaCand("dt_faturamento", format(date, "yyyy-MM-dd"));
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        <div className="flex flex-row w-full justify-start">
                            <div className="w-full mb-5">
                                <label
                                    htmlFor="dt_inicio_trabalho"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Data de início de trabalho
                                </label>
                                <div className="absolute">
                                    <Datepicker
                                        className=""
                                        language="pt-br"
                                        labelClearButton="Limpar"
                                        labelTodayButton="Hoje"
                                        showClearButton={true}
                                        autoHide={true}
                                        defaultDate={dtInicioTrabalho}
                                        onSelectedDateChanged={(date) => {
                                            setDtInicioTrabalho(date);
                                            onChangeFormAprovaCand("dt_inicio_trabalho", format(date, 'yyyy-MM-dd'));
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </ModalGrid>

            <ModalGrid
                size="md"
                height={"h-full"}
                id="modal-gera-curriculo"
                modalControl={modalGeraCurriculo.show}
                setModalControl={changeModalGeraCurriculoVisibility}
                scrollable
                title={`Gerar currículo de ${modalGeraCurriculo.nome}`}
            >
                <GeraCurriculo
                    active={true}
                    cdPessoaCandidato={modalGeraCurriculo.cdPessoaCandidato}
                    refreshList={refreshList}
                    nrVaga={nrVaga}
                />
            </ModalGrid>
        </div>
    );
};

export default CandidatosRelacionados;
