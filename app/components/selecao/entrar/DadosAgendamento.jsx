import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { Subtitle, Caption, FieldLabel } from "@/components/Layouts/Typography";
import RadioTipoProcesso from "@/components/inputs/RadioTipoProcesso";
import Select2Candidato from "@/components/inputs/Select2Candidato";
import Select2Analista from "@/components/inputs/Select2Analista";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select2Cliente from "@/components/inputs/Select2Cliente";
import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import InputTextArea from "@/components/inputs/InputTextArea";
import ButtonToggle from "@/components/buttons/ButtonToggle";
import Select2Vaga from "@/components/inputs/Select2Vaga";
import PillsBadge from "@/components/buttons/PillsBadge";
import DataHora from "@/components/inputs/DataHora";
import { empty, validateForm } from "@/assets/utils.js";
import Radio from "@/components/inputs/Radio";
import { useAppContext } from "@/context/AppContext";
import axiosInstance from "@/plugins/axios";
import { useMemo } from "react";
import moment from "moment";

const DadosAgendamento = forwardRef(({
    active,
    cdPessoa,
    nmPessoa,
    cdPessoaCliente,
    nmCliente,
    cdUsuarioAnalista,
    cdPessoaAnalista,
    nmPessoaAnalista,
    isNew,
    isEdit,
    isFromOpenJob,
    isFromCandidato,
    isFromRecrutamento,
    criadoEm,
    triggerClearFields,
    handleSave,
    handleSaveFn,
    setAfterSaveData,
    afterSaveCallback,
    id,
    nrVaga,
    hideFields = [],
    disabledFields = [],
    idOrigem,
    idChatbotConversa,
}, ref) => {
    const { toast, user } = useAppContext();
    const [IgnoreProcessType, setIgnoreProcessType] = useState(true);
    const [nomeCandidato, setNomeCandidato] = useState("");
    const [analista, setAnalista] = useState("");
    const [cliente, setCliente] = useState({});
    const defaultFields = {
        cd_usuario_atendimento: "",
        cd_pessoa_analista: "",
        cd_pessoa_candidato: cdPessoa || "",
        id_compareceu: false,
        cd_pessoa_cliente: "",
        tipo_agendamento: "E",
        dt_atendimento: "",
        data_encerramento: "",
        tipo_processo: "",
        isEditMode: false,
        data_chegada: "",
        descricao: "",
        criado_em: "",
        nr_vaga: nrVaga || "",
    };
    const [dadosFormulario, setDadosFormulario] = useState(defaultFields);
    const [formValidate, setformValidate] = useState({
        cd_pessoa_candidato: {
            error: false,
            errorMsg: "Necessário informar o candidato!",
        },
        cd_pessoa_analista: {
            error: false,
            errorMsg: "Necessário informar o usuário de atendimento!",
        },
        dt_atendimento: {
            error: false,
            errorMsg: "Necessário informar a data e a hora do atendimento!",
        },
        tipo_processo: {
            error: false,
            errorMsg: "Necessário selecionar um tipo de processo!",
            dependsOn: ["cd_pessoa_cliente|notEmpty:null"],
            ignoreItem: IgnoreProcessType,
        },
    });

    const suffix = Date.now().toString(36); //Sufixo aleatorio
    const novaData = moment(new Date());
    const dataHoje = novaData.format("YYYY-MM-DD");
    const dataTresMeses = novaData.add(90, "days").format("YYYY-MM-DD");

    // Expondo as funções para o pai
    useImperativeHandle(ref, () => ({
        handleSaveButton
    }));

    const handleSaveButton = () => {
        if (validateForm(formValidate, setformValidate, dadosFormulario, toast)) {
            return;
        }

        if (
            dadosFormulario.descricao &&
            dadosFormulario.descricao != "" &&
            dadosFormulario.descricao.length < 10
        ) {
            toast.error("A descrição deve possuir no mínimo 10 caracteres!");
            return;
        }

        if (dadosFormulario.isEditMode) {
            return atualizarDados();
        }

        salvarDados();
    };

    useEffect(() => {
        if (handleSave) {
            handleSaveButton();
            //Volta o estado do botão Salvar
            handleSaveFn(false);
        }
    }, [handleSave]);

    const salvarDados = () => {
        try {
            // Realiza uma chamada POST usando Axios
            axiosInstance
                .post("agendamento/salvar-agendamento", {
                    ...dadosFormulario,
                    usuario: user.user_sip,
                    cdPessoaCandidato: cdPessoa,
                    isFromCandidato: isFromCandidato,
                    isFromRecrutamento: isFromRecrutamento,
                })
                .then(function (response) {
                    if (setAfterSaveData) {
                        setAfterSaveData(response.data);
                    }
                    if (response.status === 200) {
                        if (response.data.status == 1) {

                            if (typeof afterSaveCallback === "function") {
                                //Função para fechar modal e atualizar a "grid"
                                afterSaveCallback(dadosFormulario.cd_usuario_atendimento);
                            }
                            return toast.success(response.data.message);
                        }

                        return toast.error(response.data.message);
                    }
                    
                })
                .catch(function (error) {
                    if (!empty(error.response.data.error))
                        return toast.error(error.response.data.error);

                    toast.error("Não foi possível salvar o agendamento.");
                    console.error(error);
                });
        } catch (error) {

            console.error("Erro ao enviar dados:", error);
        }
    };

    const atualizarDados = () => {
        try {
            // Realiza uma chamada POST usando Axios
            axiosInstance
                .post("agendamento/atualizar-agendamento", {
                    ...dadosFormulario
                })
                .then(function (response) {
                    if (response.status === 200) {
                        if (response.data.status == 1) {

                            //Função para fechar modal e atualizar a "grid"
                            afterSaveCallback(dadosFormulario.cd_usuario_atendimento);
                            return toast.success(response.data.message);
                        }

                        return toast.error(response.data.message);
                    }

                })
                .catch(function (error) {

                    toast.error("Não foi possível atualizar o agendamento.");
                    console.error(error);
                });
        } catch (error) {

            console.error("Erro ao enviar dados:", error);
        }
    };

    const setFormAgendamentoCallback = (id, value) => {
        setDadosFormulario((prevState) => ({ ...prevState, [id]: value }));
    };

    const setFormTipoProcesso = (id, value, checked) => {
        setDadosFormulario((prevState) => ({ ...prevState, tipo_processo: value }));
    };

    const setVagaRelacionada = (nrVaga) => {
        setDadosFormulario((prevState) => ({ ...prevState, nr_vaga: nrVaga }));

        if (nrVaga != "") {
            const novaData = moment(new Date());
            const dataHoje = novaData.format("DD/MM/YYYY");

            setFormAgendamentoCallback(
                "descricao",
                `Candidato foi relacionado na vaga Nº ${nrVaga} no dia ${dataHoje}.`
            );
        }
    };

    const setNaoCompareceu = (isChecked) => {
        setDadosFormulario((prevState) => ({ ...prevState, id_compareceu: isChecked }));
    
        if (!isChecked) {
            return setFormAgendamentoCallback("descricao", "");
        }
    
        let dtAtendimento = moment(dadosFormulario.dt_atendimento).format("DD/MM/YYYY");
        const tipoAgendamento =
            dadosFormulario.tipo_agendamento == "T" ? "ao teste agendado" : "a entrevista agendada";
        let descricao = `Nao compareceu ${tipoAgendamento} para ${dtAtendimento}.`;
        if (cliente.label != "") {
            descricao = `Nao compareceu ${tipoAgendamento} para o cliente ${cliente.label} no dia ${dtAtendimento}.`;
        }
        setFormAgendamentoCallback("descricao", descricao);
    };

    const setDadosCandidato = (cd_pessoa_candidato, nm_pessoa_candidato) => {
        setDadosFormulario((prevState) => ({
            ...prevState,
            cd_pessoa_candidato: cd_pessoa_candidato,
        }));
    };

    const setDadosAnalista = (cd_pessoa_analista, nm_usuario) => {
        setDadosFormulario((prevState) => ({ ...prevState, cd_pessoa_analista: cd_pessoa_analista }));
        setAnalista({
            value: cd_pessoa_analista,
            label: cd_pessoa_analista ? `${cd_pessoa_analista} - ${nm_usuario}` : "",
        });
    };
    
    const setDadosCliente = (cd_pessoa_cliente, nm_pessoa_cliente) => {
        setDadosFormulario((prevState) => ({ ...prevState, tipo_processo: "" }));
        setDadosFormulario((prevState) => ({ ...prevState, cd_pessoa_cliente: cd_pessoa_cliente }));
    
        setCliente({
            value: cd_pessoa_cliente,
            label: cd_pessoa_cliente ? `${cd_pessoa_cliente} - ${nm_pessoa_cliente}` : "",
        });
    };

    //Edição
    const setFormValues = (data) => {
        //Define o analista salvo
        if (data.CD_PESSOA_ANALISTA) {
            setAnalista({
                value: data.CD_PESSOA_ANALISTA,
                label: `${data.CD_PESSOA_ANALISTA} - ${data.NM_USUARIO_ATENDIMENTO}`,
            });
        }

        //Define o cliente
        if (data.CD_PESSOA_CLIENTE) {
            setCliente({
                value: data.CD_PESSOA_CLIENTE,
                label: `${data.CD_PESSOA_CLIENTE} - ${data.NM_PESSOA_CLIENTE}`,
            });
        }

        // Campos estáticos
        setNomeCandidato(
            <>
                {data.CD_PESSOA} - {data.NM_PESSOA}{" "}
                {data.ID_POSSUE_DEFICIENCIA == "S" && (
                    <span className="ml-2">
                        <PillsBadge type="danger">PCD</PillsBadge>
                    </span>
                )}
            </>
        );

        // Campos editáveis - setar estado do campo
        setDadosCliente(data.CD_PESSOA_CLIENTE, data.NM_PESSOA_CLIENTE);

        // Campos editáveis - form com os valores para atualizar
        setDadosFormulario({
            cd_pessoa_analista: data?.CD_PESSOA_ANALISTA || user.cd_sip,
            cd_usuario_atendimento: data.CD_USUARIO_ATENDIMENTO || "",
            cd_pessoa_candidato: data.CD_PESSOA || "",
            cd_pessoa_cliente: data.CD_PESSOA_CLIENTE || "",
            tipo_agendamento: data.ID_TIPO_AGENDAMENTO || "",
            dt_atendimento: data.DT_ATENDIMENTO_YMD || "",
            data_atendimento: data.DT_ATENDIMENTO || "",
            data_chegada: data.DT_CHEGADA_YMD || "",
            tipo_processo: data.ID_TIPO_PROCESSO || "",
            data_encerramento: "",
            id_compareceu: false,
            isEditMode: true,
            criado_em: criadoEm,
            descricao: data?.DS_OBSERVACAO || "",
            nr_vaga: "",
        });
    };

    //Edição
    const getAgendamento = () => {
        axiosInstance
            .get(`agendamento/dados-agendamento/${cdPessoa}/${criadoEm}`)
            .then(function (response) {
                setFormValues(response.data);

            })
            .catch(function (error) {
                toast.error("Não foi possível carregar os dados do agendamento.");
                console.error(error);
            });
    };

    useEffect(() => {
        clearFields();

        if (isEdit) {
            return getAgendamento();
        }

        if (cdPessoaCliente) {
            setDadosCliente(cdPessoaCliente, nmCliente);
        }
        
        if (!isFromOpenJob && cdPessoaAnalista) {
            setDadosAnalista(cdPessoaAnalista, nmPessoaAnalista);
        }

        if (idChatbotConversa) {
            setDadosFormulario((prevState) => ({
                ...prevState,
                id_chatbot_conversa: idChatbotConversa,
                id_origem: idOrigem
            }));
        }
        
        setFormAgendamentoCallback("cd_pessoa_candidato", cdPessoa);

        //Campos preenchidos por padrão para novos agendamentos
        if (isFromOpenJob) {
            setFormAgendamentoCallback("cd_usuario_atendimento", user.user_sip);
            setAnalista({
                value: user.user_sip,
                label: `${user.user_sip} - ${user.apelido}`,
            });
        }
    }, [isEdit, isFromOpenJob, isFromRecrutamento]);

    //Limpa as variaveis
    const clearFields = () => {
        setNomeCandidato("");
        setAnalista("");
        setCliente("");
        setDadosFormulario(defaultFields);
    };

    useEffect(() => {
        if (triggerClearFields) {
            clearFields();
        }
    }, [triggerClearFields]);

    {/*Radios do tipo de agendamento - não mostra quando for agendamento do callcenter */}
    const radiosTipoAgendamento = (
        <div className="pt-2">
            <span className="inline-flex">
                {
                    <FontAwesomeIcon
                        icon={faAsterisk}
                        width="10"
                        height="10"
                        color="red"
                        className="self-start mr-1"
                    />
                }
                <FieldLabel>Tipo de agendamento:</FieldLabel>
            </span>
            <div className="flex">
                <div>
                    <Radio
                        value="E"
                        label="Entrevista"
                        id={`radio_entrevista${suffix}`}
                        onChange={(id, value) =>
                            setFormAgendamentoCallback("tipo_agendamento", value)
                        }
                        checked={dadosFormulario.tipo_agendamento == "E"}
                    />
                </div>
                <div className="pl-4">
                    <Radio
                        value="T"
                        label="Teste"
                        id={`radio_teste${suffix}`}
                        onChange={(id, value) =>
                            setFormAgendamentoCallback("tipo_agendamento", value)
                        }
                        checked={dadosFormulario.tipo_agendamento == "T"}
                    />
                </div>
            </div>
        </div>
    );

    { /*campo somente leitura do tipo de agendamento -  quando for call center */ }
    const labelTipoAgendamento = isEdit && (
        <div className="pt-2">
            <Caption>Tipo de agendamento: </Caption>
            <Subtitle>Call Center</Subtitle>
        </div>
    );

    {/*campo somente leitura do candidato - edição OU criação pela agenda do candidato */}
    const labelCandidato = (isEdit && !isFromCandidato) || (isFromRecrutamento && nmPessoa) && (
        <div className="pt-2">
            <Caption>Candidato: </Caption>
            <Subtitle>{nomeCandidato || nmPessoa}</Subtitle>
        </div>
    );

    {/*Campo editavel de candidato - apenas criação - Não mostra quando o agendamento é criado em seleção > vagas > candidatos web */}
    const inputCandidato = isNew && !isFromCandidato && (
        <div className="pt-4">
            <Select2Candidato
                isDisabled={disabledFields.includes("candidatoAgendamento")}
                id={`cd_pessoa_candidato${suffix}`}
                label="Candidato"
                value={dadosFormulario.cd_pessoa_candidato}
                onChange={setDadosCandidato}
                required={formValidate}
            />
        </div>
    );

    {/*Campo editavel do usuario de atendimento - apenas criação*/}
    const inputUsuarioAtendimento = (isNew || isFromOpenJob || isFromCandidato) && (
            <div className="pt-4">
                <Select2Analista
                    isDisabled={disabledFields.includes("cd_pessoa_analista")}
                    id={`cd_pessoa_analista${suffix}`}
                    label="Usuário de atendimento"
                    value={dadosFormulario.cd_pessoa_analista}
                    onChange={setDadosAnalista}
                    required={formValidate}
                />
            </div>
        );

    {/*campo somente leitura do analista - não pode alterar o analista pela agenda do candidato */}
    const labelUsuarioAtendimento = isFromCandidato && (
        <div className="pt-2">
            <Caption>Usuário de atendimento: </Caption>
            <Subtitle>{analista.label}</Subtitle>
        </div>
    );

    {/*campo somente leitura da data/hora de atendimento - apenas edição */}
    const labelAtendimento = isEdit && !isFromCandidato && (
        <div className="pt-2">
            <Caption>Atendimento: </Caption>
            <Subtitle>{dadosFormulario.data_atendimento}</Subtitle>
        </div>
    );

    const inputCliente = (
        <div className="pt-4">
            <Select2Cliente
                isDisabled={disabledFields.includes("clienteAgendamento")}
                id="clienteAgendamento"
                label="Cliente"
                value={dadosFormulario.cd_pessoa_cliente}
                onChange={setDadosCliente}
                maxChars={50}
            />
        </div>
    );

    {/*Radios do tipo de processo - depende do campo Cliente */}
    const inputTipoProcesso = useMemo(() => {
        if (dadosFormulario.tipo_agendamento === "E") return;
        return (
            <div className="pt-2">
                <RadioTipoProcesso
                    disabled={disabledFields.includes("tipoProcessoAgendamento")}
                    init={true}
                    vertical
                    label="Tipo de processo"
                    cdPessoaAnalista={cdPessoaAnalista || user.cd_sip}
                    required={formValidate}
                    id={`tipo_processo${suffix}`}
                    value={dadosFormulario.tipo_processo}
                    onChange={setFormTipoProcesso}
                    setIgnoreProcessType={setIgnoreProcessType}
                    cdPessoaCliente={dadosFormulario.cd_pessoa_cliente}
                />
            </div>
        );
    }, [dadosFormulario]);
    
    {/*Seleção de vaga - Não mostra quando o agendamento é criado em seleção > vagas > candidatos web */}
    const inputRelacionaVaga = isEdit && !isFromCandidato && (
        <div className="pt-2">
            <Select2Vaga
                disabled={disabledFields.includes("vagaRelacionadaAgendamento")}
                id={`nr_vaga${suffix}`}
                label="Relaciona a vaga"
                onChange={(value) => setVagaRelacionada(value)}
            />
        </div>
    );

    {/*O agendamento não pode ser retroativo ou para datas posteriores a 90 dias */}
    const inputAtendimento = (isNew || isFromOpenJob || isFromCandidato) && (
        <div className="pt-4">
            <DataHora
                disabled={disabledFields.includes("dataHoraAtendimentoAgendamento")}
                minDate={dataHoje}
                label="Atendimento"
                maxDate={dataTresMeses}
                required={formValidate}
                id={`dt_atendimento${suffix}`}
                onChangeFunction={(data, hora) =>
                    setFormAgendamentoCallback("dt_atendimento", `${data} ${hora}`)
                }
                value={dadosFormulario.dt_atendimento}
            />
        </div>
    );

    {/*Data e hora da chegada do candidato - deve ser editavel mas carregar valor quando tiver - sempre monta */}
    const inputChegada = () => {
        if (hideFields.includes("dataChegadaAgendamento")) return;
        return <div className="pt-4">
            <DataHora
                disabled={disabledFields.includes("dataChegadaAgendamento")}
                id={`dt_chegada${suffix}`}
                label="Chegada"
                value={dadosFormulario.data_chegada}
                onChangeFunction={(data, hora) =>
                    setFormAgendamentoCallback("data_chegada", `${data} ${hora}`)
                }
            />
        </div>
    };

    {/*Data e hora do encerramento do atendimento - apenas edição */}
    const inputEncerramento = isEdit && !isFromCandidato && (
        <div className="pt-4">
            <DataHora
                disabled={disabledFields.includes("dataEncerramentoAgendamento")}
                id={`dt_encerramento${suffix}`}
                label="Encerramento"
                onChangeFunction={(data, hora) =>
                    setFormAgendamentoCallback("data_encerramento", `${data} ${hora}`)
                }
            />
        </div>
    );

    {/*Candidato não compareceu ao atendimento - apenas edição */}
    const inputNaoCompareceu = isEdit && !isFromCandidato && (
        <div className="pt-2 pl-1">
            <ButtonToggle
                disabled={disabledFields.includes("naoCompareceuAgendamento")}
                id={`id_compareceu${suffix}`}
                label="Não compareceu"
                primary
                onChange={(id, value, isChecked) => setNaoCompareceu(isChecked)}
            />
        </div>
    );

    {/* rhbsaas/selecao/agenda_descricao.php */}
    const inputDescricao = (
        <div className="pt-2 block">
            <InputTextArea
                rows="4"
                disabled={disabledFields.includes("descricaoAgendamento")}
                maxLength={2000}
                id={`ds_observacao${suffix}`}
                value={dadosFormulario.descricao}
                helperText={"Mínimo 10 caracteres"}
                onChange={(id, value) => setFormAgendamentoCallback("descricao", value)}
            />
        </div>
    );

    return (
        <>
            <div id={id} className={`col-span-12 ${active ? "block" : "hidden"} mx-2`}>
                {radiosTipoAgendamento}
                {labelTipoAgendamento}
                {inputCandidato}
                {labelCandidato}
                {inputUsuarioAtendimento}
                {labelAtendimento}
                {inputCliente}
                {inputTipoProcesso}
                {inputRelacionaVaga}
                {inputAtendimento}
                {inputChegada()}
                {inputEncerramento}
                {inputNaoCompareceu}
                {inputDescricao}
            </div>
        </>
    );
});

DadosAgendamento.displayName = 'DadosAgendamento';

export default DadosAgendamento;
