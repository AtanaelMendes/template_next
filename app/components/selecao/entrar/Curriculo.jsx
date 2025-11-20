import {
    faUser,
    faIdCard,
    faHome,
    faLock,
    faLockOpen,
    faExternalLinkAlt,
    faUserCheck,
    faUserTimes,
    faCheck,
    faGraduationCap,
    faLanguage,
    faLaptop,
    faSitemap,
    faKey,
    faUserCog,
    faExclamationCircle,
    faArrowRight,
    faPhone,
    faUsers,
    faFileText,
    faSearch,
    faUserClock,
    faRotateRight,
    faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
    faClipboard,
    faIdBadge,
    faQuestionCircle,
    faTimesCircle,
} from "@fortawesome/free-regular-svg-icons";
import Image from "next/image";
import { CardEditCompetencia, CardNovaCompetencia } from "@/components/cards/CardCompetencia";
import { CardEditSoftware, CardNovoSoftware } from "@/components/cards/CardSoftware";
import { CardNovoEmprego, CardEditEmprego } from "@/components/cards/CardEmprego";
import { CardNovoIdioma, CardEditIdioma } from "@/components/cards/CardIdioma";
import { CardNovoCurso, CardEditCurso } from "@/components/cards/CardCurso";
import SelectOrgaoEmissor from "@/components/inputs/SelectOrgaoEmissor";
import { FieldLabel, Subtitle } from "@/components/Layouts/Typography";
import { CardAddPCD, CardEditPCD } from "@/components/cards/CardPCD";
import WarningMessage from "@/components/Layouts/WarningMessage";
import { FabSave } from "@/components/buttons/FloatActionButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import InputTextArea from "@/components/inputs/InputTextArea";
import InputPassword from "@/components/inputs/InputPassword";
import ButtonToggle from "@/components/buttons/ButtonToggle";
import SelectEstado from "@/components/inputs/SelectEstado";
import SelectCidade from "@/components/inputs/SelectCidade";
import SelectBairro from "@/components/inputs/SelectBairro";
import MiniSidebar from "@/components/Layouts/MiniSidebar";
import InputNumber from "@/components/inputs/InputNumber";
import PillsBadge from "@/components/buttons/PillsBadge";
import Blockquote from "@/components/Layouts/Blockquote";
import { useCallback, useEffect, useRef, useState } from "react";
import InputEmail from "@/components/inputs/InputEmail";
import SelectPais from "@/components/inputs/SelectPais";
import InputText from "@/components/inputs/InputText";
import InputDate from "@/components/inputs/InputDate";
import Checkbox from "@/components/inputs/Checkbox";
import Fieldset from "@/components/inputs/Fieldset";
import InputCPF from "@/components/inputs/InputCPF";
import InputPIS from "@/components/inputs/InputPIS";
import InputNIT from "@/components/inputs/InputNIT";
import AddGrupoCandidato from "./AddGrupoCandidato";
import Button from "@/components/buttons/Button";
import { cn, validateForm } from "@/assets/utils.js";
import Dialog from "@/components/Layouts/Dialog";
import Select from "@/components/inputs/Select";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { useAppContext } from "@/context/AppContext";
import { empty, isBelowXl } from "@/assets/utils";
import moment from "moment";
import axiosInstance from "@/plugins/axios";
import ParecerCandidato from "./ParecerCandidato";
import { TooltipComponent } from "@/components/Layouts/TooltipComponent";
import BuscarCEP from "./BuscarCEP";
import ModalGrid from "@/components/Layouts/ModalGrid";
import RichText from "@/components/inputs/RichText";
import Confirm from "@/components/Layouts/Confirm";
import { FormSkeleton } from "@/components/Layouts/Skeleton";
import ProfilePicture from "@/components/inputs/ProfilePicture";
import { faEdit } from "@fortawesome/free-regular-svg-icons";

const Curriculo = ({ active, reload, cdPessoa, resetValues }) => {
    const { toast, user, openPageTab } = useAppContext();
    const [showConfirmRemoveProfileImg, setShowConfirmRemoveProfileImg] = useState(false);
    const [showBtnRemoveProfilePicture, setShowBtnRemoveProfilePicture] = useState(false);
    const [dadosCardEditCompetenciaAux, setDadosCardEditCompetenciaAux] = useState([]);
    const [modalUpdateProfilePicture, setModalUpdateProfilePicture] = useState(false);
    const [statusCandidatoLiberado, setStatusCandidatoLiberado] = useState(false);
    const [dadosCardEditCompetencia, setDadosCardEditCompetencia] = useState([]);
    const [dadosCardNovaCompetencia, setDadosCardNovaCompetencia] = useState([]);
    const [dadosCardEditSoftwareAux, setDadosCardEditSoftwareAux] = useState([]);
    const [dadosCardEditEmpregoAux, setDadosCardEditEmpregoAux] = useState([]);
    const [opcoesSelectCompetencia, setOpcoesSelectCompetencia] = useState([]);
    const [showDialogInativaCand, setShowDialogInativaCand] = useState(false);
    const [enableFieldsetEventos, setEnableFieldsetEventos] = useState(false);
    const [dadosCardEditIdiomaAux, setDadosCardEditIdiomaAux] = useState([]);
    const [disableDsRespSociais, setDisableDsRespSociais] = useState(false);
    const [showDialogStatusCand, setShowDialogStatusCand] = useState(false);
    const [showConfirmUsoImagem, setShowConfirmUsoImagem] = useState(false);
    const [dadosCardEditCursoAux, setDadosCardEditCursoAux] = useState([]);
    const [dadosCardEditSoftware, setDadosCardEditSoftware] = useState([]);
    const [dadosCardNovoSoftware, setDadosCardNovoSoftware] = useState([]);
    const [showDialogGrupoCand, setShowDialogGrupoCand] = useState(false);
    const [showModalBuscarCEP, setShowModalBuscarCEP] = useState(false);
    const [lembreteSenhaValido, setLembreteSenhaValido] = useState(true);
    const [dadosCardNovoEmprego, setDadosCardNovoEmprego] = useState([]);
    const [dadosCardEditEmprego, setDadosCardEditEmprego] = useState([]);
    const [cdCargosSelecionados, setCdCargosSelecionados] = useState([]);
    const [opcoesSelectSoftware, setOpcoesSelectSoftware] = useState([]);
    const [tamanhoSenhaValido, setTamanhoSenhaValido] = useState(true);
    const [dadosCardEditIdioma, setDadosCardEditIdioma] = useState([]);
    const [dadosCardNovoIdioma, setDadosCardNovoIdioma] = useState([]);
    const [dadosCardEditPCDAux, setDadosCardEditPCDAux] = useState([]);
    const [mensagemIdadeMinima, setMensagemIdadeMinima] = useState("");
    const [showDialogESocial, setShowDialogESocial] = useState(false);
    const [showValidaESocial, setShowValidaESocial] = useState(false);
    const [dadosCardNovoCurso, setDadosCardNovoCurso] = useState([]);
    const [dadosCardEditCurso, setDadosCardEditCurso] = useState([]);
    const [cargosSelecionados, setCargosSelecionados] = useState([]);
    const [statusESocialClass, setStatusESocialClass] = useState("");
    const [opcoesSelectIdioma, setOpcoesSelectIdioma] = useState([]);
    const [disableDsHobbies, setDisableDsHobbies] = useState(false);
    const [statusESocialText, setStatusESocialText] = useState("");
    const [cdPessoaCandidato, setCdPessoaCandidato] = useState("");
    const [autorizaUsoImagem, setAutorizaUsoImagem] = useState(2);
    const [isValidCPFValue, setIsValidCPFValue] = useState(true);
    const [isValidPISValue, setIsValidPISValue] = useState(true);
    const [isValidNITValue, setIsValidNITValue] = useState(true);
    const [dadosCardEditPCD, setDadosCardEditPCD] = useState([]);
    const [candidatoAtivo, setCandidatoAtivo] = useState(true);
    const [disableNrFilho, setDisableNrFilho] = useState(true);
    const [dadosCardAddPCD, setDadosCardAddPCD] = useState([]);
    const [senhasConferem, setSenhasConferem] = useState(true);
    const [grupoAtivo, setGrupoAtivo] = useState("pessoal");
    const [showLoading, setShowLoading] = useState(false);
    const [estiloIMC, setEstiloIMC] = useState("default");
    const [showEstados, setShowEstados] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [disableCPF, setDisableCPF] = useState(false);
    const [disableNIT, setDisableNIT] = useState(true);
    const [filtroCargo, setFiltroCargo] = useState("");
    const [cargosAux, setCargosAux] = useState([]);
    const [showPCD, setShowPCD] = useState(false);
    const [valorIMC, setValorIMC] = useState(0);
    const [bairros, setBairros] = useState({});
    const [cargos, setCargos] = useState([]);
    const [loadedBasicInfo, setLoadedBasicInfo] = useState(false);
    const [formUpdateProfilePicture, setFormUpdateProfilePicture] = useState({
        cd_pessoa_candidato: "",
        ds_foto_candidato: null,
    });
    const [profilePicture, setProfilePicture] = useState("/images/default/user-no-image.png");

    const empregosRef = useRef(null);
    const userImgRef = useRef(null);

    const defaultFields = {
        nr_nota_candidato: 0,
        id_situacao_esocial: "",
        dt_inativo: "",
        nm_pessoa: "",
        nm_apelido: "",
        nr_documento_cpf: "",
        ds_email: "",
        id_primeiro_emprego: false,
        nr_documento_pis: "",
        nr_documento_nit: "",
        dt_nascimento: "",
        id_estado_civil: "",
        id_sexo: "",
        id_possue_deficiencia: false,
        nr_altura: "",
        id_fumante: "",
        nr_peso: "",
        cd_pais: 1,
        cd_uf: "",
        nm_cidade_origem: "",
        nr_ano_chegada_brasil: "",
        id_cutis: "",
        id_cabelo: "",
        id_olho: "",
        nr_calcado: "",
        id_tamanho_calca: "",
        id_tamanho_camisa: "",
        id_experiencia: false,
        id_abordagem: false,
        id_demonstracao: false,
        id_reposicao: false,
        ds_inf_experiencia: "",
        nm_pessoa_mae: "",
        nm_pessoa_pai: "",
        possui_filhos: false,
        nr_filho: 0,
        possui_veiculo: false,
        cd_habilitacao_cat: "",
        ds_www: "",
        check_responsabilidades_sociais: false,
        ds_responsabilidades_sociais: "",
        check_hobbies: false,
        ds_hobbies: "",
        cd_cep: "",
        nm_cep: "",
        nm_cidade_reside: "",
        nm_estado_reside: "",
        cd_uf_reside: "",
        cd_pais_reside: "",
        nm_bairro: "",
        nr_endereco: "",
        ds_complemento: "",
        ds_referencia: "",
        nr_telefone_cel: "",
        ds_observacao_cel: "",
        id_possui_whatsapp_cel: false,
        nr_telefone_rec: "",
        ds_observacao_rec: "",
        id_possui_whatsapp_rec: false,
        nr_telefone_res: "",
        ds_observacao_res: "",
        nr_documento_ctps: "",
        nr_serie_ctps: "",
        dt_emissao_ctps: "",
        cd_estado_emite_ctps: "",
        nm_cidade_emite_ctps: "",
        nr_documento_rg: "",
        dt_emissao_rg: "",
        orgao_emissor_rg: "",
        cd_estado_emite_rg: "",
        nm_cidade_emite_rg: "",
        nm_senha_web: "",
        nm_confirma_senha_web: "",
        ds_lembrete_senha_web: "",
        id_turno_normal: "",
        id_turno_matutino: "",
        id_turno_vespertino: "",
        id_turno_noturno: "",
        id_revezamento: "",
        pretensao_salarial: "",
        ds_experiencia_profissional: "",
        ds_laudo: "",
        idade: "",
        ds_foto_candidato: "",
    };

    const [dadosCurriculo, setDadosCurriculo] = useState(defaultFields);

    let [loadingCount, setLoadingCount] = useState(0);
    const qtdLoadings = 7;

    useEffect(() => {
        if (active || (cdPessoa != cdPessoaCandidato)) {
            //Valores padrão dos selects
            getOptionsForCards();

            if (cdPessoa) {
                setShowLoading(true);
                setCdPessoaCandidato(cdPessoa);
                setIsEditMode(true);
            }
        }
    }, [cdPessoa]);

    useEffect(() => {
        if (active && cdPessoaCandidato) {
            onLoadActions();
        }
    }, [cdPessoaCandidato]);

    useEffect(() => {
        if (active && reload && cdPessoaCandidato) {
            setShowLoading(true);
            onLoadActions();
        }
    }, [reload]);

    //Carregar as opções que não dependem do cd_pessoa
    useEffect(() => {
        if (resetValues) {
            setGrupoAtivo("pessoal"); //Direciona para a página pessoal
            getOptionsForCards();
        }
    }, [resetValues, active]);

    const onLoadActions = () => {
        limparDadoscurriculo();

        //Buscar dados do candidato
        getDadosCandidato();
    };

    const limparDadoscurriculo = () => {
        removeTodosCargos();
        setDadosCardAddPCD([]);
        setDadosCardNovoCurso([]);
        setDadosCardNovoIdioma([]);
        setDadosCardNovoEmprego([]);
        setDadosCardNovoSoftware([]);
        setDadosCardNovaCompetencia([]);
        setDadosCurriculo(defaultFields);
    };

    //Busca os valores para os selects que não precisam do cd_pessoa
    const getOptionsForCards = () => {
        if (active && !loadedBasicInfo) {
            loadBasicInfo();
        }
    };

    const loadBasicInfo = async () => {
        try {
            const response = await axiosInstance.get("curriculo/dados-base");
            const result = response.data;

            setOpcoesSelectIdioma(result.idiomas || []);
            setOpcoesSelectSoftware(result.softwares || []);
            setOpcoesSelectCompetencia(result.competencias || []);
            setCargos(result.cargos || []);
            setCargosAux(result.cargos || []);
            setLoadedBasicInfo(true);
        } catch (error) {
            toast.error("Erro ao buscar [cargos, idiomas, softwares, competências] do curriculo.");
            setLoadedBasicInfo(false);
            console.error("Error in loadBasicInfo:", error);
        }
    };

    const formataValorSalario = new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const [validaDadosPessoais, setValidaDadosPessoais] = useState({
        nm_pessoa: {
            error: false,
            errorMsg: "Necessário informar o nome!",
        },
        nr_documento_cpf: {
            error: false,
            errorMsg: "Necessário informar o CPF!",
        },
        ds_email: {
            error: false,
            errorMsg: "Necessário informar um e-mail válido!",
        },
        dt_nascimento: {
            error: false,
            errorMsg: "Necessário informar a data de nascimento!",
        },
        id_estado_civil: {
            error: false,
            errorMsg: "Necessário informar o estado civil!",
        },
        id_sexo: {
            error: false,
            errorMsg: "Necessário informar o sexo!",
        },
        cd_pais: {
            error: false,
            errorMsg: "Necessário informar o país de nacionalidade!",
        },
        cd_uf: {
            error: false,
            errorMsg: "Necessário selecionar um estado de naturalidade!",
            dependsOn: ["cd_pais|notEmpty:0"],
        },
        nm_cidade_origem: {
            error: false,
            errorMsg: "Necessário selecionar uma cidade de naturalidade!",
            dependsOn: ["cd_pais|notEmpty:0"],
            ignoreItem: dadosCurriculo.cd_pais != 1,
        },
        nr_ano_chegada_brasil: {
            error: false,
            errorMsg: "Necessário informar o ano de chegada ao Brasil!",
            dependsOn: ["cd_pais|notEmpty:0"],
            ignoreItem: dadosCurriculo.cd_pais == 1,
        },
    });

    const [validaAcesso, setValidaAcesso] = useState({
        nm_senha_web: {
            error: false,
            errorMsg: "Necessário informar uma senha!",
        },
        nm_confirma_senha_web: {
            error: false,
            errorMsg: "Necessário informar a confirmação da senha!",
        },
    });

    const [validaEndereco, setValidaEndereco] = useState({
        nm_cep: {
            error: false,
            errorMsg: "Necessário informar um CEP válido!",
        },
        nm_bairro: {
            error: false,
            errorMsg: "Necessário informar o bairro em que você reside!",
        },
    });

    const dateToday = moment().format("YYYY-MM-DD");

    const setDadosCurriculoCallback = useCallback((id, value) => {
        setDadosCurriculo((prevState) => ({ ...prevState, [id]: value }));
    });

    const handleSaveButton = () => {
        // Valida o preenchimento dos campos requeridos
        if (validaCamposCurriculo()) {
            return;
        }

        salvarDados();
    };

    // Valida o preenchimento dos campos do curriculo
    // Retorna true case exista algum erro
    const validaCamposCurriculo = () => {
        setShowLoading(true);

        //Alterado para pegar o valor dinamicamente
        validaDadosPessoais.nr_ano_chegada_brasil.ignoreItem = dadosCurriculo.cd_pais == 1;
        validaDadosPessoais.nm_cidade_origem.ignoreItem = dadosCurriculo.cd_pais != 1;

        validaDadosPessoais.cd_uf.ignoreItem = dadosCurriculo.cd_pais != 1;

        if (validateForm(validaDadosPessoais, setValidaDadosPessoais, dadosCurriculo, toast)) {
            setGrupoAtivo("pessoal"); //Direciona para a página de dados pessoais
            setShowLoading(false);
            return true;
        }

        let dataAtual = moment();
        let dataNascimento = moment(dadosCurriculo.dt_nascimento, "YYYY-MM-DD");
        let idadeTmp = dataAtual.diff(dataNascimento, "years");

        if (idadeTmp < 14) {
            toast.error("Data de nascimento inválida!");
            setShowLoading(false);
            return true;
        }

        // Valida os dados informados no campo CPF
        if (!isValidCPFValue) {
            toast.error("Informe um CPF válido!");
            setShowLoading(false);
            return true;
        }

        // Valida os dados informados no campo PIS
        if (!isValidPISValue) {
            toast.error("Informe um PIS válido!");
            setShowLoading(false);
            return true;
        }

        // Valida os dados informados no campo NIT
        if (!isValidNITValue) {
            toast.error("Informe um NIT válido!");
            setShowLoading(false);
            return true;
        }

        // Valida se existe algum card de deficiencia sem o "tipo de deficiencia" selecionado
        //showPCD - true quando o check "Possui deficiencia" estiver marcado
        if (showPCD) {
            let hasErrors = false;

            if (dadosCardAddPCD.length > 0) {
                const result = dadosCardAddPCD.filter((dadosPCD) =>
                    empty(dadosPCD.cd_tipo_deficiencia)
                );
                hasErrors = result.length > 0 ? true : hasErrors;
            }

            if (dadosCardEditPCDAux.length > 0) {
                const result = dadosCardEditPCDAux.filter((dadosPCD) =>
                    empty(dadosPCD.cd_tipo_deficiencia)
                );
                hasErrors = result.length > 0 ? true : hasErrors;
            }

            if (hasErrors) {
                setGrupoAtivo("pessoal"); //Direciona para a página de dados pessoais
                toast.error("Necessário selecionar um tipo de deficiência!");
                setShowLoading(false);
                return true;
            }
        }

        // Valida se os campos de senha foram preenchidos, o tamanho da senha, se as senha conferem e se o lembrete não contém a senha
        if (
            validateForm(validaAcesso, setValidaAcesso, dadosCurriculo, toast) ||
            !senhasConferem ||
            !lembreteSenhaValido ||
            !tamanhoSenhaValido
        ) {
            setGrupoAtivo("acesso"); //Direciona para a página de acesso WEB

            if (
                dadosCurriculo.nm_senha_web.length > 0 &&
                dadosCurriculo.nm_confirma_senha_web.length > 0 &&
                (!senhasConferem || !lembreteSenhaValido || !tamanhoSenhaValido)
            ) {
                toast.error("Verifique os dados das senhas!");
            }

            setShowLoading(false);
            return true;
        }

        if (validateForm(validaEndereco, setValidaEndereco, dadosCurriculo, toast)) {
            setGrupoAtivo("endereco"); //Direciona para a página de endereço
            setShowLoading(false);
            return true;
        }

        const qtdMinPhone = 2; //Quantidade minima de telefones preenchidos
        let qtdPhone = 0;
        qtdPhone = empty(dadosCurriculo.nr_telefone_cel) ? qtdPhone : qtdPhone + 1;
        qtdPhone = empty(dadosCurriculo.nr_telefone_rec) ? qtdPhone : qtdPhone + 1;
        qtdPhone = empty(dadosCurriculo.nr_telefone_res) ? qtdPhone : qtdPhone + 1;

        if (qtdPhone < qtdMinPhone) {
            setGrupoAtivo("contato"); //Direciona para a página de contato
            toast.error("Informe ao menos 2 telefones para contato!");
            setShowLoading(false);
            return true;
        }

        if (dadosCardEditCursoAux.length === 0 && dadosCardNovoCurso.length === 0) {
            toast.error("É necessário informar ao menos um grau de formação!");
            setGrupoAtivo("formacao"); //Direciona para a página de formação
            setShowLoading(false);
            return true;
        }

        if (cargosSelecionados.length === 0) {
            toast.error("É necessário selecionar ao menos um cargo pretendido!");
            setGrupoAtivo("cargo"); //Direciona para a página de cargo
            setShowLoading(false);
            return true;
        }

        //Validação dos empregos anteriores
        //O nome da empresa, cargo e a data de admissão são obrigatórios
        if (Object.keys(dadosCardNovoEmprego).length > 0) {
            let hasErrors = false;
            let message = [];

            Object.keys(dadosCardNovoEmprego).forEach((key) => {
                if (empty(dadosCardNovoEmprego[key].nm_pessoa_empresa)) {
                    hasErrors = true;
                    message.push("O nome da empresa deve ser informado.");
                }

                if (empty(dadosCardNovoEmprego[key].nm_cargo)) {
                    hasErrors = true;
                    message.push("O último cargo na empresa deve ser informado.");
                }

                if (empty(dadosCardNovoEmprego[key].dt_inicio)) {
                    hasErrors = true;
                    message.push("A data de admissão deve ser informada.");
                }

                if (!empty(dadosCardNovoEmprego[key].dt_fim)) {
                    let dataInicio = moment(dadosCardNovoEmprego[key].dt_inicio, "YYYY-MM-DD");
                    let dataFim = moment(dadosCardNovoEmprego[key].dt_fim, "YYYY-MM-DD");
                    if (dataInicio.isAfter(dataFim)) {
                        hasErrors = true;
                        message.push("A data de admissão deve ser menor ou igual a data de demissão.");
                    }
                }
            });

            if (hasErrors) {
                Object.keys(message).forEach((key) => {
                    toast.error(message[key]);
                });

                setGrupoAtivo("empregos");
                setShowLoading(false);
                return true;
            }
        }

        if (Object.keys(dadosCardEditEmprego).length > 0) {
            let hasErrors = false;
            let message = [];

            Object.keys(dadosCardEditEmprego).forEach((key) => {
                if (empty(dadosCardEditEmprego[key].nm_pessoa_empresa)) {
                    hasErrors = true;
                    message.push("O nome da empresa deve ser informado.");
                }

                if (empty(dadosCardEditEmprego[key].nm_cargo)) {
                    hasErrors = true;
                    message.push("O último cargo na empresa deve ser informado.");
                }

                if (empty(dadosCardEditEmprego[key].dt_inicio)) {
                    hasErrors = true;
                    message.push("A data de admissão deve ser informada.");
                }

                if (!empty(dadosCardEditEmprego[key].dt_fim)) {
                    let dataInicio = moment(dadosCardEditEmprego[key].dt_inicio, "YYYY-MM-DD");
                    let dataFim = moment(dadosCardEditEmprego[key].dt_fim, "YYYY-MM-DD");

                    if (dataInicio.isAfter(dataFim)) {
                        hasErrors = true;
                        message.push("A data de admissão deve ser menor ou igual a data de demissão.");
                    }
                }
            });

            if (hasErrors) {
                Object.keys(message).forEach((key) => {
                    toast.error(message[key]);
                });

                setGrupoAtivo("empregos");
                setShowLoading(false);
                return true;
            }
        }
        return false;
    };

    const salvarDados = () => {
        setShowLoading(true);

        let data = new FormData();

        data.append("cd_pessoa_candidato", cdPessoaCandidato);
        data.append("cd_usuario", user.user_sip);

        //Dados pessoais
        //Valor de campos checkbox são "true" ou "false", para salvar precisa converter para "S" e "N"
        Object.entries(dadosCurriculo).forEach((dados, index) => {
            let valor = dados[1];

            if (dados[1] === true) {
                valor = "S";
            }

            if (dados[1] === false) {
                valor = "N";
            }

            data.append(dados[0], valor);
        });

        //Dados PCD
        let tempAddPCD = [];
        dadosCardAddPCD.forEach((item, index) => {
            item.index = index;
            tempAddPCD.push(JSON.stringify(item));
            data.append(`arquivo_laudo_${index}`, item.arquivo_laudo);
        });

        data.append("addPcd", tempAddPCD);

        //Edição PCD
        let tempEditPCD = [];
        dadosCardEditPCD.forEach((item) => {
            tempEditPCD.push(JSON.stringify(item));
            data.append(`arquivo_laudo_${item.id_cid_candidato}`, item.arquivo_laudo);
        });

        data.append("editPcd", tempEditPCD);

        //Cargos
        let tempAddCargo = [];
        cargosSelecionados.forEach((cargo) => {
            tempAddCargo.push(JSON.stringify(cargo));
        });

        data.append("cargosSelecionados", tempAddCargo);

        //Novos empregos
        let tempAddEmprego = [];
        dadosCardNovoEmprego.forEach((item, index) => {
            tempAddEmprego.push(JSON.stringify(item));
        });

        data.append("addEmprego", tempAddEmprego);

        //Edição de emprego
        let tempEditEmprego = [];
        dadosCardEditEmprego.forEach((item) => {
            if (item.id != "") {
                tempEditEmprego.push(JSON.stringify(item));
            }
        });

        data.append("editEmprego", tempEditEmprego);

        //Novos cursos
        let tempAddCurso = [];
        dadosCardNovoCurso.forEach((item, index) => {
            tempAddCurso.push(JSON.stringify(item));
        });

        data.append("addCurso", tempAddCurso);

        //Edição de curso
        let tempEditCurso = [];
        dadosCardEditCurso.forEach((item) => {
            tempEditCurso.push(JSON.stringify(item));
        });

        data.append("editCurso", tempEditCurso);

        //Novos idiomas
        let tempAddIdioma = [];
        dadosCardNovoIdioma.forEach((item, index) => {
            tempAddIdioma.push(JSON.stringify(item));
        });

        data.append("addIdioma", tempAddIdioma);

        //Edição de idioma
        let tempEditIdioma = [];
        dadosCardEditIdioma.forEach((item) => {
            tempEditIdioma.push(JSON.stringify(item));
        });

        data.append("editIdioma", tempEditIdioma);

        //Novos softwares
        let tempAddSoftware = [];
        dadosCardNovoSoftware.forEach((item) => {
            tempAddSoftware.push(JSON.stringify(item));
        });

        data.append("addSoftware", tempAddSoftware);

        //Edição de softwares
        let tempEditSoftware = [];
        dadosCardEditSoftware.forEach((item) => {
            tempEditSoftware.push(JSON.stringify(item));
        });

        data.append("editSoftware", tempEditSoftware);

        //Novos competencias
        let tempAddCompetencia = [];
        dadosCardNovaCompetencia.forEach((item) => {
            tempAddCompetencia.push(JSON.stringify(item));
        });

        data.append("addCompetencia", tempAddCompetencia);

        //Edição de competencias
        let tempEditCompetencia = [];
        dadosCardEditCompetencia.forEach((item) => {
            tempEditCompetencia.push(JSON.stringify(item));
        });

        data.append("editCompetencia", tempEditCompetencia);

        try {
            axiosInstance
                .post("candidato/salvar-curriculo", data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(function (response) {
                    if (response.status === 200) {
                        //Se foi salvo sem erros
                        if (response.data.status == 1) {
                            //Se o candidato foi criado, seta a tela como edição
                            if (!isEditMode && resetValues) {
                                //Redireciona para a edição dos dados do candidato
                                openPageTab({
                                    id: "DadosCandidato",
                                    name: `Dados do candidato`,
                                    props: {
                                        cdPessoaCandidato: response.data.cd_pessoa,
                                    },
                                });
                            }

                            //Limpa os estados e busca as informações no banco, para criar os cards corretamente
                            limparDadoscurriculo();
                            onLoadActions();

                            setShowLoading(false);
                            return toast.success(response.data.message);
                        }

                        //Se houve algum erro ao salvar
                        setShowLoading(false);
                        return toast.error(response.data.message);
                    }
                    setShowLoading(false);
                })
                .catch(function (error) {
                    setShowLoading(false);
                    toast.error(
                        isEditMode
                            ? "Erro ao atualizar dados do candidato."
                            : "Erro ao cadastrar candidato."
                    );
                    console.error(error);
                });
        } catch (error) {
            setShowLoading(false);
            console.error("Erro na rota de salvar curriculo:", error);
        }
    };

    useEffect(() => {
        //Valida se as senha conferem
        setTamanhoSenhaValido(dadosCurriculo.nm_senha_web.length >= 6);

        //Valida se as senha conferem
        setSenhasConferem(
            empty(dadosCurriculo.nm_confirma_senha_web) ||
            dadosCurriculo.nm_confirma_senha_web === dadosCurriculo.nm_senha_web
        );

        //Valida se o lembrete contém a senha
        //Verifica o lembrete apenas na criação do curriculo (resetValues = true), para não ficar dando alerta para os analistas sem necessidade ao editar
        let lembreteValido = !dadosCurriculo.ds_lembrete_senha_web.toUpperCase().includes(dadosCurriculo.nm_senha_web.toUpperCase());
        setLembreteSenhaValido(resetValues ? lembreteValido : true);

        if (dadosCurriculo.nm_senha_web.length === 0) {
            setLembreteSenhaValido(true);
        }
    }, [
        dadosCurriculo.nm_senha_web,
        dadosCurriculo.nm_confirma_senha_web,
        dadosCurriculo.ds_lembrete_senha_web,
    ]);

    const selecionaCargo = (cdCargo) => {
        const cargoSelecionado = cargos.find((cargo) => cargo.CD_CARGO === cdCargo);

        if (cargoSelecionado) {
            // Adiciona o cargo aos selecionados
            setCargosSelecionados([...cargosSelecionados, cargoSelecionado]);
        }
    };

    const removeCargo = (cdCargo) => {
        const cargoSelecionado = cargos.find((cargo) => cargo.CD_CARGO === cdCargo);

        if (cargoSelecionado) {
            // Remove o cargo dos cargos selecionados
            const cargosRestantes = cargosSelecionados.filter(
                (cargo) => cargo.CD_CARGO !== cdCargo
            );
            setCargosSelecionados(cargosRestantes);
        }
    };

    // Remove todos os cargos selecionados
    const removeTodosCargos = () => {
        setCargosSelecionados([]);
    };

    const atualizaExperienciaCargo = useCallback((cdCargo, nrExperiencia) => {
        // Cria um novo array de cargos, atualizando a experiencia
        const cargoAtualizado = cargosSelecionados.map((tmpCargo) => {
            if (tmpCargo.CD_CARGO === cdCargo) {
                // Atualiza a experiencia
                return {
                    ...tmpCargo,
                    NR_EXPERIENCIA: nrExperiencia,
                };
            }
            // Retorna o objeto original se não for o cargo a ser atualizado
            return tmpCargo;
        });

        setCargosSelecionados(cargoAtualizado);
    });

    // Filtro de pesquisa da lista de cargos
    useEffect(() => {
        // Criar um novo objeto, removendo do array completo todos os itens que já foram selecionados
        const cargosNaoSelecionados = cargos.filter(
            (tmpCargo) => !cdCargosSelecionados.includes(tmpCargo.CD_CARGO)
        );

        //Se algo foi digitado na caixa de pesquisa
        if (filtroCargo.length > 0) {
            //Altera para maiusculo e divide o filtro em palavras separadas
            const palavrasFiltro = filtroCargo
                .toUpperCase()
                .split(" ")
                .filter((palavra) => palavra.trim() !== "");

            const cargosFiltrados = cargosNaoSelecionados.filter((cargo) => {
                // Verifica se todas as palavras do filtro estão contidas no nome do cargo
                return palavrasFiltro.every((palavra) => cargo.NM_CARGO.includes(palavra));
            });

            setCargosAux(cargosFiltrados);
        } else {
            //Se não tiver filtro, mostra todos os não selecionados
            setCargosAux(cargosNaoSelecionados);
        }
    }, [filtroCargo]);

    // Recria o array auxiliar de cargos com todos menos os selecionados
    useEffect(() => {
        // Cria uma lista com os códigos dos cargos selecionados e armazena em memória para uso posterior
        const listaCdCargosSelecionados = cargosSelecionados.map((tmpCargo) => tmpCargo.CD_CARGO);
        setCdCargosSelecionados(listaCdCargosSelecionados);

        //Se não existir uma pesquisa ativa, atualiza a lista de cargos
        if (filtroCargo.length === 0) {
            // Filtra o array principal, removendo os cargos com código selecionado
            const cargosNaoSelecionados = cargos.filter(
                (tmpCargo) => !listaCdCargosSelecionados.includes(tmpCargo.CD_CARGO)
            );
            setCargosAux(cargosNaoSelecionados);
        } else {
            // Filtra o array auxiliar, para remover os itens selecionados
            const cargosNaoSelecionados = cargos.filter(
                (tmpCargo) => !listaCdCargosSelecionados.includes(tmpCargo.CD_CARGO)
            );

            // Aplica a pesquisa novamente, para atualizar os resultados
            // Divide o filtro em palavras separadas
            const palavrasFiltro = filtroCargo
                .toUpperCase()
                .split(" ")
                .filter((palavra) => palavra.trim() !== "");

            const cargosFiltrados = cargosNaoSelecionados.filter((cargo) => {
                // Verifica se todas as palavras do filtro estão contidas no nome do cargo
                return palavrasFiltro.every((palavra) => cargo.NM_CARGO.includes(palavra));
            });

            setCargosAux(cargosFiltrados);
        }
    }, [cargosSelecionados]);

    const getDadosCandidato = async () => {
        if (empty(cdPessoaCandidato)) {
            return;
        }

        try {
            const response = await axiosInstance.get(`candidato/dados-candidato/${cdPessoaCandidato}`);
            insereDadosCurriculo(response.data);
        } catch (error) {
            console.error("Error in getDadosCandidato:", error);
            toast.error(
                error.response?.status === 404
                    ? "Candidato não encontrado."
                    : "Erro ao buscar dados do candidato."
            );
            setShowLoading(false);
        }
    };

    const insereDadosCurriculo = (response) => {
        let dadosGerais = response.dadosCandidato;

        let url_foto = "/images/default/user-no-image.png";
        if (!empty(dadosGerais.DS_FOTO_CANDIDATO)) {
            url_foto = process.env.NEXT_PUBLIC_BASE_URL + "/site/imagem_candidato/" + dadosGerais.DS_FOTO_CANDIDATO;
        }
        setProfilePicture(url_foto);
        setShowBtnRemoveProfilePicture(!url_foto.includes("user-no-image.png"));

        const dadosCandidato = {
            nr_nota_candidato: dadosGerais.NR_NOTA_CANDIDATO / 2 || 0,
            ds_esocial: dadosGerais.DS_ESOCIAL || "",
            id_situacao_esocial: dadosGerais.ID_SITUACAO_ESOCIAL || "",
            dt_inativo: dadosGerais.DT_INATIVO || "",
            nm_pessoa: dadosGerais.NM_PESSOA || "",
            nm_apelido: dadosGerais.NM_APELIDO || "",
            nr_documento_cpf: dadosGerais.NR_DOCUMENTO_CPF || "",
            nr_documento_pis: dadosGerais.NR_DOCUMENTO_PIS || "",
            nr_documento_nit: dadosGerais.NR_DOCUMENTO_NIT || "",
            ds_email: dadosGerais.DS_EMAIL || "",
            id_primeiro_emprego: dadosGerais.ID_PRIMEIRO_EMPREGO == "S",
            dt_nascimento: dadosGerais.DT_NASCIMENTO || "",
            id_estado_civil: dadosGerais.ID_ESTADO_CIVIL || "",
            id_sexo: dadosGerais.ID_SEXO || "",
            id_possue_deficiencia: dadosGerais.POSSUE_DEFICIENCIA == "S",
            nr_altura: dadosGerais.NR_ALTURA || "",
            nr_peso: dadosGerais.NR_PESO || "",
            id_fumante: dadosGerais.ID_FUMANTE == "S",
            cd_pais: !empty(dadosGerais.CD_PAIS_ORIGEM) ? parseInt(dadosGerais.CD_PAIS_ORIGEM) : 0,
            cd_uf: dadosGerais.CD_UF_ORIGEM || "",
            nm_cidade_origem: dadosGerais.NM_CIDADE_ORIGEM || "",
            nr_ano_chegada_brasil: dadosGerais.NR_ANO_CHEGADA_BRASIL || "",
            id_cutis: dadosGerais.ID_CUTIS || "",
            id_cabelo: dadosGerais.ID_CABELO || "",
            id_olho: dadosGerais.ID_OLHO || "",
            nr_calcado: dadosGerais.NR_CALCADO || "",
            id_tamanho_calca: dadosGerais.ID_TAMANHO_CALCA || "",
            id_tamanho_camisa: dadosGerais.ID_TAMANHO_CAMISA || "",
            id_experiencia:
                !empty(dadosGerais.DS_INF_EXPERIENCIA) ||
                !empty(dadosGerais.ID_ABORDAGEM) ||
                !empty(dadosGerais.ID_DEMONSTRACAO) ||
                !empty(dadosGerais.ID_REPOSICAO),
            id_abordagem: dadosGerais.ID_ABORDAGEM == "S",
            id_demonstracao: dadosGerais.ID_DEMONSTRACAO == "S",
            id_reposicao: dadosGerais.ID_REPOSICAO == "S",
            ds_inf_experiencia: dadosGerais.DS_INF_EXPERIENCIA || "",
            nm_pessoa_mae: dadosGerais.NM_MAE || "",
            nm_pessoa_pai: dadosGerais.NM_PAI || "",
            possui_filhos: parseInt(dadosGerais.NR_FILHO) > 0,
            nr_filho: parseInt(dadosGerais.NR_FILHO) || 0,
            possui_veiculo: dadosGerais.ID_VEICULO == "S",
            cd_habilitacao_cat: dadosGerais.CD_HABILITACAO_CAT || "",
            ds_www: dadosGerais.DS_WWW || "",
            check_responsabilidades_sociais: !empty(dadosGerais.DS_RESPONSABILIDADES_SOCIAIS),
            ds_responsabilidades_sociais: dadosGerais.DS_RESPONSABILIDADES_SOCIAIS || "",
            check_hobbies: !empty(dadosGerais.DS_HOBBIES),
            ds_hobbies: dadosGerais.DS_HOBBIES || "",
            cd_cep: dadosGerais.CD_CEP || "",
            nm_cep: `${dadosGerais.NM_TIPO_LOGRADOURO} ${dadosGerais.NM_CEP}` || "",
            nm_cidade_reside: dadosGerais.NM_CIDADE || "",
            cd_uf_reside: dadosGerais.CD_UF_RESIDE || "",
            cd_pais_reside: !empty(dadosGerais.CD_PAIS_RESIDE)
                ? parseInt(dadosGerais.CD_PAIS_RESIDE)
                : 0,
            nm_estado_reside: dadosGerais.NM_UF || "",
            nm_bairro: dadosGerais.NM_BAIRRO || "",
            nr_endereco: dadosGerais.NR_ENDERECO || "",
            ds_complemento: dadosGerais.DS_COMPLEMENTO || "",
            ds_referencia: dadosGerais.DS_REFERENCIA || "",
            nr_telefone_cel: dadosGerais.NR_TELEFONE_CEL || "",
            ds_observacao_cel: dadosGerais.DS_OBSERVACAO_CEL || "",
            id_possui_whatsapp_cel: dadosGerais.ID_POSSUI_WHATSAPP_CEL == "S",
            nr_telefone_rec: dadosGerais.NR_TELEFONE_REC || "",
            ds_observacao_rec: dadosGerais.DS_OBSERVACAO_REC || "",
            id_possui_whatsapp_rec: dadosGerais.ID_POSSUI_WHATSAPP_REC == "S",
            nr_telefone_res: dadosGerais.NR_TELEFONE_RES || "",
            ds_observacao_res: dadosGerais.DS_OBSERVACAO_RES || "",
            nr_documento_ctps: dadosGerais.NR_CTPS || "",
            nr_serie_ctps: dadosGerais.NR_SERIE_CTPS || "",
            dt_emissao_ctps: dadosGerais.DT_EMISSAO_CTPS || "",
            nm_cidade_emite_ctps: dadosGerais.NM_CIDADE_EMITE_CTPS || "",
            cd_estado_emite_ctps: dadosGerais.CD_ESTADO_EMITE_CTPS || "",
            nr_documento_rg: dadosGerais.NR_RG || "",
            dt_emissao_rg: dadosGerais.DT_EMISSAO_RG || "",
            orgao_emissor_rg: dadosGerais.NM_ORGAO_EMITE_RG || "",
            cd_estado_emite_rg: dadosGerais.CD_ESTADO_EMITE_RG || "",
            nm_cidade_emite_rg: dadosGerais.NM_CIDADE_EMITE_RG || "",
            nm_senha_web: dadosGerais.NM_SENHA_WEB || "",
            nm_confirma_senha_web: dadosGerais.NM_SENHA_WEB || "",
            ds_lembrete_senha_web: dadosGerais.DS_LEMBRETE_SENHA_WEB || "",
            pretensao_salarial: !empty(dadosGerais.VL_PRETENSAO_SALARIAL)
                ? formataValorSalario.format(
                    dadosGerais.VL_PRETENSAO_SALARIAL.replace(/\D/g, "") / 100
                )
                : "",
            id_turno_normal: dadosGerais.ID_TURNO_NORMAL == "S",
            id_turno_matutino: dadosGerais.ID_TURNO_MATUTINO == "S",
            id_turno_vespertino: dadosGerais.ID_TURNO_VESPERTINO == "S",
            id_turno_noturno: dadosGerais.ID_TURNO_NOTURNO == "S",
            id_revezamento: dadosGerais.ID_REVEZAMENTO == "S",
            ds_experiencia_profissional: dadosGerais.DS_EXPERIENCIA_PROFISSIONAL || "",
            ds_laudo: dadosGerais.DS_LAUDO || "",
            idade: !empty(dadosGerais.IDADE) ? dadosGerais.IDADE + ' anos' : "",
            ds_foto_candidato: url_foto
        };

        setFormUpdateProfilePicture(prevState => ({ ...prevState, cd_pessoa_candidato: cdPessoa }));
        setCardsCompetenciaForEdit(response.competencias);
        setCardsSoftwareForEdit(response.softwares);
        setCardsEmpregoForEdit(response.empregos);
        setCardsIdiomaForEdit(response.idioma);
        setCargosSelecionados(response.cargos);
        setCardsPCDForEdit(response.dadosPCD);
        setCardsCursoForEdit(response.cursos);

        setIsValidCPFValue(true);
        setIsValidPISValue(true);
        setIsValidNITValue(true);
        setDadosCurriculo(dadosCandidato);
        setDisableNrFilho(dadosCandidato.nr_filho < 1);
        setShowPCD(dadosCandidato.id_possue_deficiencia);
        setDisableDsHobbies(dadosCandidato.check_hobbies);
        setDisableNIT(!dadosCandidato.id_primeiro_emprego);
        setCandidatoAtivo(empty(dadosGerais.DT_INATIVO));
        getStatusESocial(dadosCandidato.id_situacao_esocial);
        setEnableFieldsetEventos(dadosCandidato.id_experiencia);
        setDisableCPF(!empty(dadosCandidato.nr_documento_cpf));
        setStatusCandidatoLiberado(empty(dadosGerais.DT_BLOQUEIO_CANDIDATO));
        setDisableDsRespSociais(dadosCandidato.check_responsabilidades_sociais);
        getBairros(dadosCandidato.nm_cidade_reside, dadosCandidato.cd_uf_reside);
        setShowValidaESocial(
            dadosCandidato.id_situacao_esocial != "V" && dadosCandidato.id_situacao_esocial != "L"
        );
        setAutorizaUsoImagem(dadosGerais.USO_IMAGEM);

        setLoadingCount(loadingCount++);
        if (loadingCount >= qtdLoadings) {
            setTimeout(() => setShowLoading(false), 100);
        }
    };

    const getStatusESocial = (idSituacaoESocial) => {
        let eSocialClass = "bg-red-500";
        let eSocialText = "Não Enviado";

        switch (idSituacaoESocial) {
            case "V":
                eSocialClass = "bg-green-600";
                break;
            case "I":
            case "":
            case "N":
            case "R":
                eSocialClass = "bg-red-500";
                break;
            case "E":
            case "L":
                eSocialClass = "bg-orange-500";
                break;
        }

        switch (idSituacaoESocial) {
            case "V":
                eSocialText = "Validado";
                break;
            case "I":
                eSocialText = "Inválido";
                break;
            case "E":
                eSocialText = "Enviado";
                break;
            case "N":
            case "":
                eSocialText = "Não Enviado";
                break;
            case "L":
                eSocialText = "Validado Temp.";
                break;
            case "R":
                eSocialText = "Rejeitado";
                break;
        }

        setStatusESocialClass(eSocialClass);
        setStatusESocialText(eSocialText.toUpperCase());
    };

    const validarESocial = (status, historyMessage) => {
        setShowLoading(true);

        try {
            axiosInstance
                .post(`candidato/status-esocial`, {
                    status: status,
                    cd_usuario: user.user_sip,
                    description: historyMessage,
                    cd_pessoa_candidato: cdPessoaCandidato,
                })
                .then(function (response) {
                    switch (response.data.status) {
                        case 0:
                            toast.error(response.data.message);
                            break;
                        case 1:
                            toast.success(response.data.message);
                            break;
                        case 2:
                            toast.warning(response.data.message);
                            break;
                        default:
                            toast.warning(
                                "Ocorreu um erro inesperado, se o mesmo persistir, contate a TI."
                            );
                            console.error(response);
                            break;
                    }

                    setShowValidaESocial(false);
                    getDadosCandidato();
                    setShowLoading(false);
                })
                .catch(function (error) {
                    toast.error("Erro ao atualizar a situação do e-Social.");
                    setShowLoading(false);
                    console.error(error);
                });
        } catch (error) {
            setShowLoading(false);
            console.error("Erro na comunicação com o back-end:", error);
        }
    };

    const addCardPCD = () => {
        const newField = {
            id: `newCardPcd_${dadosCardAddPCD.length + 1}`,
            cd_tipo_deficiencia: "",
            ds_observacao: "",
            arquivo_laudo: {},
            dt_validade: "",
            cd_cid: "",
        };

        setDadosCardAddPCD((prevState) => [...prevState, newField]);
    };

    const addCardEmprego = () => {
        const newField = {
            id: `newCardEmprego_${dadosCardNovoEmprego.length + 1}`,
            ds_experiencia_profissional: "",
            vl_ultimo_salario: "",
            nm_pessoa_empresa: "",
            ds_motivo_saida: "",
            card_title: "",
            dt_inicio: "",
            nm_cargo: "",
            dt_fim: "",
        };

        setDadosCardNovoEmprego((prevState) => [...prevState, newField]);

        setTimeout(() => {
            empregosRef.current.scrollTop = empregosRef.current.scrollHeight;
        }, 500);

    };

    const addCardCurso = () => {
        const newField = {
            id: `newCardCurso_${dadosCardNovoCurso.length + 1}`,
            nm_pessoa_estab_ensino: "",
            dt_conclusao_curso: "",
            nr_carga_horaria: "",
            ds_observacoes: "",
            id_situacao: "",
            cd_nivel: "",
            ds_serie: "",
            nm_curso: "",
        };

        setDadosCardNovoCurso((prevState) => [...prevState, newField]);
    };

    const addCardIdioma = () => {
        const newField = {
            id: `newCardIdioma_${dadosCardNovoIdioma.length + 1}`,
            cd_idioma: 0,
            id_leitura: 2,
            id_escrita: 2,
            id_fala: 2,
        };

        setDadosCardNovoIdioma((prevState) => [...prevState, newField]);
    };

    const addCardSoftware = () => {
        const newField = {
            id: `newCardSoftware_${dadosCardNovoSoftware.length + 1}`,
            cd_conhecimento: 0,
            id_conhecimento: 1,
        };

        setDadosCardNovoSoftware((prevState) => [...prevState, newField]);
    };

    const addCardCompetencia = () => {
        const newField = {
            id: `newCardCompetencia_${dadosCardNovaCompetencia.length + 1}`,
            id_mostra_curriculo: false,
            cd_competencia: 0,
            nr_nota: 1,
        };

        setDadosCardNovaCompetencia((prevState) => [...prevState, newField]);
    };

    const deleteCardEditEmprego = (nrSequencia) => {
        if (confirm("Deseja realmente excluir o emprego?")) {
            setShowLoading(true);

            handleSaveButton();

            try {
                axiosInstance
                    .get(`candidato/exclui-emprego/${nrSequencia}`)
                    .then(function (response) {
                        if (empty(response.data)) {
                            toast.error("Erro ao excluir emprego");
                            setShowLoading(false);
                            return;
                        }

                        toast.success("Experiência excluída com sucesso.");
                        getDadosEmprego(); //Remontar os cards de emprego salvos
                        setShowLoading(false);
                    })
                    .catch(function (error) {
                        setShowLoading(false);
                        toast.error("Não foi possível excluir o emprego.");
                        console.error(error);
                    });
            } catch (error) {
                setShowLoading(false);
                console.error("Erro na comunicação com o back-end:", error);
            }
        }
    };

    const deleteCardEditCurso = (nrSequencia) => {
        if (confirm("Deseja realmente excluir o curso/formação?")) {
            setShowLoading(true);

            try {
                axiosInstance
                    .get(`candidato/exclui-curso/${nrSequencia}`)
                    .then(function (response) {
                        if (empty(response.data)) {
                            toast.error("Erro ao excluir curso/formação");
                            setShowLoading(false);
                            return;
                        }

                        toast.success("Curso/formação excluída com sucesso.");
                        getDadosCursos(); //Remontar os cards de curso salvos
                        setShowLoading(false);
                    })
                    .catch(function (error) {
                        setShowLoading(false);
                        toast.error("Não foi possível excluir o curso/formação.");
                        console.error(error);
                    });
            } catch (error) {
                setShowLoading(false);
                console.error("Erro na comunicação com o back-end:", error);
            }
        }
    };

    const deleteCardEditIdioma = (cdIdioma) => {
        if (confirm("Deseja realmente excluir o idioma?")) {
            setShowLoading(true);

            try {
                axiosInstance
                    .get(`candidato/exclui-idioma/${cdPessoaCandidato}/${cdIdioma}`)
                    .then(function (response) {
                        if (empty(response.data)) {
                            toast.error("Erro ao excluir idioma");
                            setShowLoading(false);
                            return;
                        }

                        toast.success("Idioma excluído com sucesso.");
                        getDadosIdiomas(); //Remontar os cards de idioma salvos
                        setShowLoading(false);
                    })
                    .catch(function (error) {
                        setShowLoading(false);
                        toast.error("Não foi possível excluir o idioma.");
                        console.error(error);
                    });
            } catch (error) {
                setShowLoading(false);
                console.error("Erro na comunicação com o back-end:", error);
            }
        }
    };

    const deleteCardEditSoftware = (cdConhecimento) => {
        if (confirm("Deseja realmente excluir o software?")) {
            setShowLoading(true);

            try {
                axiosInstance
                    .get(`candidato/exclui-software/${cdPessoaCandidato}/${cdConhecimento}`)
                    .then(function (response) {
                        if (empty(response.data)) {
                            toast.error("Erro ao excluir software");
                            setShowLoading(false);
                            return;
                        }

                        toast.success("Software excluído com sucesso.");
                        getDadosSoftwares(); //Remontar os cards de software salvos
                        setShowLoading(false);
                    })
                    .catch(function (error) {
                        setShowLoading(false);
                        toast.error("Não foi possível excluir o software.");
                        console.error(error);
                    });
            } catch (error) {
                setShowLoading(false);
                console.error("Erro na comunicação com o back-end:", error);
            }
        }
    };

    const deleteCardEditCompetencia = (cdCompetencia) => {
        if (confirm("Deseja realmente excluir a competência?")) {
            setShowLoading(true);

            try {
                axiosInstance
                    .get(`candidato/exclui-competencia/${cdPessoaCandidato}/${cdCompetencia}`)
                    .then(function (response) {
                        if (empty(response.data)) {
                            toast.error("Erro ao excluir competência");
                            setShowLoading(false);
                            return;
                        }

                        toast.success("Competência excluída com sucesso.");
                        getDadosCompetencia(); //Remontar os cards de software salvos
                        setShowLoading(false);
                    })
                    .catch(function (error) {
                        setShowLoading(false);
                        toast.error("Não foi possível excluir a competência.");
                        console.error(error);
                    });
            } catch (error) {
                setShowLoading(false);
                console.error("Erro na comunicação com o back-end:", error);
            }
        }
    };

    const deleteCardNovoEmprego = (id) => {
        if (confirm("Deseja realmente excluir o emprego?")) {
            const remainingCards = dadosCardNovoEmprego.filter((field) => field.id !== id);

            setDadosCardNovoEmprego(remainingCards);
        }
    };

    const deleteCardNovoCurso = (id) => {
        if (confirm("Deseja realmente excluir o curso/formação?")) {
            const remainingCards = dadosCardNovoCurso.filter((field) => field.id !== id);

            setDadosCardNovoCurso(remainingCards);
        }
    };

    const deleteCardNovoIdioma = (id) => {
        if (confirm("Deseja realmente excluir o idioma?")) {
            const remainingCards = dadosCardNovoIdioma.filter((field) => field.id !== id);

            setDadosCardNovoIdioma(remainingCards);
        }
    };

    const deleteCardNovoSoftware = (id) => {
        if (confirm("Deseja realmente excluir o software?")) {
            const remainingCards = dadosCardNovoSoftware.filter((field) => field.id !== id);

            setDadosCardNovoSoftware(remainingCards);
        }
    };

    const deleteCardNovaCompetencia = (id) => {
        if (confirm("Deseja realmente excluir a competência?")) {
            const remainingCards = dadosCardNovaCompetencia.filter((field) => field.id !== id);

            setDadosCardNovaCompetencia(remainingCards);
        }
    };

    const setCardsPCDForEdit = (dadosPCD) => {
        let tempDataPCD = [];
        tempDataPCD = dadosPCD.map((dados) => {
            return {
                id: `editCardPcd_${dados.ID_CID_CANDIDATO}`,
                id_cid_candidato: dados.ID_CID_CANDIDATO || "",
                cd_tipo_deficiencia: dados.CD_TIPO_DEFICIENCIA || "",
                ds_observacao: dados.DS_OBSERVACAO || "",
                ds_caminho_laudo: dados.DS_CAMINHO_LAUDO || "",
                dt_validade: dados.DT_VALIDADE_YMD || "",
                nm_status: dados.NM_STATUS || "",
                id_status: dados.ID_STATUS || "",
                criado_em: dados.CRIADO_EM || "",
                cd_cid: dados.CD_CID || "",
                arquivo_laudo: null,
            };
        });

        setDadosCardEditPCD(tempDataPCD);
        setDadosCardEditPCDAux(tempDataPCD);

        setLoadingCount(loadingCount++);
        if (loadingCount >= qtdLoadings) {
            setShowLoading(false);
        }
    };

    const setCardsEmpregoForEdit = (dadosEmprego) => {
        let tempDataEmprego = [];
        tempDataEmprego = dadosEmprego.map((dados, index) => {
            let cardTitle = "";
            switch (index) {
                case 0:
                    cardTitle = "Último emprego";
                    break;
                case 1:
                    cardTitle = "Penúltimo emprego";
                    break;
                case 2:
                    cardTitle = "Antepenúltimo emprego";
                    break;
                default:
                    cardTitle = `Emprego nº ${index + 1}`;
                    break;
            }

            let ultimoSalario = "";
            if (dados?.VL_ULTIMO_SALARIO != "" && dados?.VL_ULTIMO_SALARIO != null) {
                ultimoSalario = formataValorSalario.format(
                    dados.VL_ULTIMO_SALARIO.trim().replace(/\D/g, "") / 100
                );
            }

            return {
                id: `editCardEmprego_${dados.NR_SEQUENCIA}`,
                ds_experiencia_profissional: dados?.DS_EXPERIENCIA_PROFISSIONAL || "",
                vl_ultimo_salario: ultimoSalario,
                nm_pessoa_empresa: dados.NM_PESSOA_EMPRESA || "",
                ds_motivo_saida: dados.DS_MOTIVO_SAIDA || "",
                nr_sequencia: dados.NR_SEQUENCIA || "",
                card_title: cardTitle,
                dt_inicio: dados.DT_INICIO || "",
                nm_cargo: dados.NM_CARGO || "",
                dt_fim: dados.DT_FIM || "",
            };
        });

        setDadosCardEditEmprego(tempDataEmprego);
        setDadosCardEditEmpregoAux(tempDataEmprego);

        setLoadingCount(loadingCount++);
        if (loadingCount >= qtdLoadings) {
            setShowLoading(false);
        }
    };

    const setCardsCursoForEdit = (dadosCurso) => {
        let tempDataCurso = [];
        tempDataCurso = dadosCurso.map((dados, index) => {
            let cardTitle = "";

            switch (index) {
                case 0:
                    cardTitle = "Última Formação / Formação Atual";
                    break;
                case 1:
                    cardTitle = "Penúltima Formação";
                    break;
                case 2:
                    cardTitle = "Antepenúltima Formação";
                    break;
                default:
                    cardTitle = `Formação nº ${index + 1}`;
                    break;
            }

            return {
                id: `editCardCurso_${dados.NR_SEQUENCIA}`,
                nm_pessoa_estab_ensino: dados.NM_PESSOA_ESTAB_ENSINO || "",
                dt_conclusao_curso: dados.DT_CONCLUSAO_CURSO || "",
                nr_carga_horaria: dados.NR_CARGA_HORARIA || "",
                ds_observacoes: dados.DS_OBSERVACOES || "",
                nr_sequencia: dados.NR_SEQUENCIA || "",
                id_situacao: dados.ID_SITUACAO || "",
                cd_nivel: dados.CD_NIVEL || "",
                ds_serie: dados.DS_SERIE || "",
                nm_curso: dados.NM_CURSO || "",
                card_title: cardTitle,
            };
        });

        setDadosCardEditCurso(tempDataCurso);
        setDadosCardEditCursoAux(tempDataCurso);

        setLoadingCount(loadingCount++);
        if (loadingCount >= qtdLoadings) {
            setShowLoading(false);
        }
    };

    const setCardsIdiomaForEdit = (dadosIdioma) => {
        let tempDataIdiomas = [];
        tempDataIdiomas = dadosIdioma.map((dados, index) => {
            return {
                id: `editCardIdioma_${dados.CD_IDIOMA}`,
                cd_idioma: dados.CD_IDIOMA,
                id_leitura: dados.ID_LEITURA,
                id_escrita: dados.ID_ESCRITA,
                id_fala: dados.ID_FALA,
                card_title: `Idioma nº ${index + 1}`,
            };
        });

        setDadosCardEditIdioma(tempDataIdiomas);
        setDadosCardEditIdiomaAux(tempDataIdiomas);

        setLoadingCount(loadingCount++);
        if (loadingCount >= qtdLoadings) {
            setShowLoading(false);
        }
    };

    const setCardsSoftwareForEdit = (dadosSoftware) => {
        let tempDataSoftware = [];
        tempDataSoftware = dadosSoftware.map((dados, index) => {
            return {
                id: `editCardSoftware_${dados.CD_CONHECIMENTO}`,
                cd_conhecimento: dados.CD_CONHECIMENTO,
                id_conhecimento: dados.ID_CONHECIMENTO,
                card_title: `Software nº ${index + 1}`,
            };
        });

        setDadosCardEditSoftware(tempDataSoftware);
        setDadosCardEditSoftwareAux(tempDataSoftware);

        setLoadingCount(loadingCount++);
        if (loadingCount >= qtdLoadings) {
            setShowLoading(false);
        }
    };

    const setCardsCompetenciaForEdit = (dadosCompetencia) => {
        let tempDataCompetencia = [];
        tempDataCompetencia = dadosCompetencia.map((dados, index) => {
            return {
                id: `editCardCompetencia_${dados.CD_COMPETENCIA}`,
                id_mostra_curriculo: dados.ID_MOSTRA_CURRICULO == "S",
                card_title: `Competência nº ${index + 1}`,
                cd_competencia: dados.CD_COMPETENCIA,
                nr_nota: dados.NR_NOTA,
            };
        });

        setDadosCardEditCompetencia(tempDataCompetencia);
        setDadosCardEditCompetenciaAux(tempDataCompetencia);

        setLoadingCount(loadingCount++);
        if (loadingCount >= qtdLoadings) {
            setShowLoading(false);
        }
    };

    const handleChangeCardPCD = (id, data) => {
        const updatedCards = dadosCardAddPCD.map((field) =>
            field.id === id ? { ...field, ...data } : field
        );

        setDadosCardAddPCD(updatedCards);
    };

    const handleChangeCardEditPCD = (id, data) => {
        const updatedCards = dadosCardEditPCD.map((field) =>
            field.id === id ? { ...field, ...data } : field
        );

        setDadosCardEditPCD(updatedCards);
    };

    const handleChangeCardEditEmprego = (id, data) => {
        const updatedCards = dadosCardEditEmprego.map((field) =>
            field.id === id ? { ...field, ...data } : field
        );

        setDadosCardEditEmprego(updatedCards);
    };

    const handleChangeCardNovoEmprego = (id, data) => {
        const updatedCards = dadosCardNovoEmprego.map((field) =>
            field.id === id ? { ...field, ...data } : field
        );

        setDadosCardNovoEmprego(updatedCards);
    };

    const handleChangeCardEditCurso = (id, data) => {
        const updatedCards = dadosCardEditCurso.map((field) =>
            field.id === id ? { ...field, ...data } : field
        );

        setDadosCardEditCurso(updatedCards);
    };

    const handleChangeCardNovoCurso = (id, data) => {
        const updatedCards = dadosCardNovoCurso.map((field) =>
            field.id === id ? { ...field, ...data } : field
        );

        setDadosCardNovoCurso(updatedCards);
    };

    const handleChangeCardEditIdioma = (id, data) => {
        const updatedCards = dadosCardEditIdioma.map((field) =>
            field.id === id ? { ...field, ...data } : field
        );

        setDadosCardEditIdioma(updatedCards);
    };

    const handleChangeCardNovoIdioma = (id, data) => {
        const updatedCards = dadosCardNovoIdioma.map((field) =>
            field.id === id ? { ...field, ...data } : field
        );

        setDadosCardNovoIdioma(updatedCards);
    };

    const handleChangeCardEditSoftware = (id, data) => {
        const updatedCards = dadosCardEditSoftware.map((field) =>
            field.id === id ? { ...field, ...data } : field
        );

        setDadosCardEditSoftware(updatedCards);
    };

    const handleChangeCardNovoSoftware = (id, data) => {
        const updatedCards = dadosCardNovoSoftware.map((field) =>
            field.id === id ? { ...field, ...data } : field
        );

        setDadosCardNovoSoftware(updatedCards);
    };

    const handleChangeCardEditCompetencia = (id, data) => {
        const updatedCards = dadosCardEditCompetencia.map((field) =>
            field.id === id ? { ...field, ...data } : field
        );

        setDadosCardEditCompetencia(updatedCards);
    };

    const handleChangeCardNovaCompetencia = (id, data) => {
        const updatedCards = dadosCardNovaCompetencia.map((field) =>
            field.id === id ? { ...field, ...data } : field
        );

        setDadosCardNovaCompetencia(updatedCards);
    };

    const handleOpenSocialMedia = () => {
        if (empty(dadosCurriculo.ds_www)) {
            return;
        }

        //split para pegar o primeiro site, caso tenha mais que um
        let url = dadosCurriculo.ds_www.split(" ")[0];

        if (!url.includes("www")) {
            url = `www.${url}`;
        }

        if (!url.includes("http")) {
            url = `http://${url}`;
        }

        window.open(url, "_blank");
    };

    const deleteCardPCD = (id) => {
        const remainingCards = dadosCardAddPCD.filter((field) => field.id !== id);

        setDadosCardAddPCD(remainingCards);
    };

    const deleteSavedCardPCD = (id) => {
        if (confirm("Deseja realmente excluir o laudo?\nEsta ação não poderá ser desfeita.")) {
            setShowLoading(true);

            try {
                axiosInstance
                    .post("candidato/exclui-laudo-pcd", {
                        id_cid_candidato: id,
                        cd_usuario: user.user_sip,
                    })
                    .then(function (response) {
                        switch (response.data.status) {
                            case 0:
                                toast.error(response.data.message);
                                break;
                            case 1:
                                toast.success(response.data.message);
                                break;
                            case 2:
                                toast.warning(response.data.message);
                                break;
                            default:
                                toast.warning(
                                    "Ocorreu um erro inesperado, se o mesmo persistir, contate a TI."
                                );
                                console.error(response);
                                break;
                        }

                        getDadosPCD(); //Remontar os cards PCD
                    })
                    .catch(function (error) {
                        setShowLoading(false);
                        toast.error("Não foi possível excluir o laudo.");
                        console.error(error);
                    });
            } catch (error) {
                setShowLoading(false);
                console.error("Erro na comunicação com o back-end:", error);
            }
        }
    };

    const disableCardPCD = (id) => {
        if (confirm("Deseja realmente inativar o laudo?")) {
            setShowLoading(true);

            try {
                axiosInstance
                    .post("candidato/inativa-laudo-pcd", {
                        id_cid_candidato: id,
                        cd_usuario: user.user_sip,
                    })
                    .then(function (response) {
                        switch (response.data.status) {
                            case 0:
                                toast.error(response.data.message);
                                break;
                            case 1:
                                toast.success(response.data.message);
                                break;
                            case 2:
                                toast.warning(response.data.message);
                                break;
                            default:
                                toast.warning(
                                    "Ocorreu um erro inesperado, se o mesmo persistir, contate a TI."
                                );
                                console.error(response);
                                break;
                        }

                        getDadosPCD(); //Remontar os cards PCD
                        setShowLoading(false);
                    })
                    .catch(function (error) {
                        setShowLoading(false);
                        toast.error("Não foi possível inativar o laudo.");
                        console.error(error);
                    });
            } catch (error) {
                setShowLoading(false);
                console.error("Erro na comunicação com o back-end:", error);
            }
        }
    };

    const enableCardPCD = (id) => {
        if (confirm("Deseja realmente reativar o laudo?")) {
            setShowLoading(true);

            try {
                axiosInstance
                    .post("candidato/reativa-laudo-pcd", {
                        id_cid_candidato: id,
                        cd_usuario: user.user_sip,
                    })
                    .then(function (response) {
                        switch (response.data.status) {
                            case 0:
                                toast.error(response.data.message);
                                break;
                            case 1:
                                toast.success(response.data.message);
                                break;
                            case 2:
                                toast.warning(response.data.message);
                                break;
                            default:
                                toast.warning(
                                    "Ocorreu um erro inesperado, se o mesmo persistir, contate a TI."
                                );
                                console.error(response);
                                break;
                        }

                        getDadosPCD(); //Remontar os cards PCD
                    })
                    .catch(function (error) {
                        setShowLoading(false);
                        toast.error(
                            "Houve um erro ao reativar o laudo. Caso o problema persista, contate a TI."
                        );
                        console.error(error);
                    });
            } catch (error) {
                setShowLoading(false);
                console.error("Erro na comunicação com o back-end:", error);
            }
        }
    };

    const getDadosPCD = async () => {
        if (empty(cdPessoaCandidato)) {
            return;
        }

        setDadosCardEditPCD([]);
        setDadosCardEditPCDAux([]);
        toast.info("Buscando dados PCD");

        try {
            const response = await axiosInstance.get(`candidato/dados-pcd/${cdPessoaCandidato}`);
            setCardsPCDForEdit(response.data);
        } catch (error) {
            console.error("Error in getDadosPCD:", error);
            toast.error(
                error.response?.status === 404
                    ? "Dados PCD do candidato não encontrados."
                    : "Erro ao buscar dados do candidato PCD."
            );
            setShowLoading(false);
        }
    };

    const getDadosEmprego = async () => {
        if (empty(cdPessoaCandidato)) {
            return;
        }

        // Clear existing data in memory
        setDadosCardEditEmprego([]);
        setDadosCardEditEmpregoAux([]);

        try {
            const response = await axiosInstance.get(`candidato/empregos/${cdPessoaCandidato}`);
            setCardsEmpregoForEdit(response.data);
        } catch (error) {
            console.error("Error in getDadosEmprego:", error);
            toast.error(
                error.response?.status === 404
                    ? "Dados de empregos do candidato não encontrados."
                    : "Erro ao buscar empregos do candidato."
            );
            setShowLoading(false);
        }
    };

    const getDadosCursos = async () => {
        if (empty(cdPessoaCandidato)) {
            return;
        }

        try {
            const response = await axiosInstance.get(`candidato/cursos/${cdPessoaCandidato}`);
            setCardsCursoForEdit(response.data);
        } catch (error) {
            console.error("Error in getDadosCursos:", error);
            toast.error(
                error.response?.status === 404
                    ? "Dados de cursos do candidato não encontrados."
                    : "Erro ao buscar cursos do candidato."
            );
            setShowLoading(false);
        }
    };

    const getDadosIdiomas = async () => {
        if (empty(cdPessoaCandidato)) {
            return;
        }

        setDadosCardEditIdioma([]);
        setDadosCardEditIdiomaAux([]);

        try {
            const response = await axiosInstance.get(`candidato/idiomas/${cdPessoaCandidato}`);
            setCardsIdiomaForEdit(response.data);
        } catch (error) {
            console.error("Error in getDadosIdiomas:", error);
            toast.error(
                error.response?.status === 404
                    ? "Dados de idiomas do candidato não encontrados."
                    : "Erro ao buscar idiomas do candidato."
            );
            setShowLoading(false);
        }
    };

    const getDadosSoftwares = async () => {
        if (empty(cdPessoaCandidato)) {
            return;
        }

        setDadosCardEditSoftware([]);
        setDadosCardEditSoftwareAux([]);

        try {
            const response = await axiosInstance.get(`candidato/softwares/${cdPessoaCandidato}`);
            setCardsSoftwareForEdit(response.data);
        } catch (error) {
            console.error("Error in getDadosSoftwares:", error);
            toast.error(
                error.response?.status === 404
                    ? "Dados de softwares do candidato não encontrados."
                    : "Erro ao buscar softwares do candidato."
            );
            setShowLoading(false);
        }
    };

    const getDadosCompetencia = async () => {
        if (empty(cdPessoaCandidato)) {
            return;
        }

        //limpar os dados existentes em memoria
        setDadosCardEditCompetencia([]);
        setDadosCardEditCompetenciaAux([]);

        try {
            const response = await axiosInstance.get(`candidato/competencias/${cdPessoaCandidato}`);
            setCardsCompetenciaForEdit(response.data);
        } catch (error) {
            console.error("Error in getDadosCompetencia:", error);
            toast.error(
                error.response?.status === 404
                    ? "Dados de competências do candidato não encontrados."
                    : "Erro ao buscar competências do candidato."
            );
            setShowLoading(false);
        }
    };

    const handleClickFilhos = (id, checked) => {
        setDadosCurriculoCallback(id, checked);
        setDisableNrFilho(!checked);
        if (!checked) {
            setDadosCurriculoCallback("nr_filho", 0);
        }
    };

    const handleExperienciaEventos = (id, checked) => {
        setEnableFieldsetEventos(checked);
        setDadosCurriculoCallback(id, checked);

        if (!checked) {
            setDadosCurriculoCallback("id_abordagem", false);
            setDadosCurriculoCallback("id_demonstracao", false);
            setDadosCurriculoCallback("id_reposicao", false);
        }
    };

    const handleAtividadesSociais = (id, checked) => {
        setDisableDsRespSociais(checked);
        setDadosCurriculoCallback(id, checked);
    };

    const handleClickHobbies = (id, checked) => {
        setDisableDsHobbies(checked);
        setDadosCurriculoCallback(id, checked);
    };

    const setStatusCandidato = useCallback((description) => {
        if (empty(cdPessoaCandidato)) {
            return;
        }

        setShowLoading(true);

        let url = `${process.env.NEXT_PUBLIC_API_URL}${statusCandidatoLiberado
            ? "/candidato/bloquear-candidato"
            : "/candidato/desbloquear-candidato"
            }`;
        let action = statusCandidatoLiberado ? "bloquear" : "desbloquear";

        axiosInstance
            .post(url, {
                cd_usuario: user.user_sip,
                cd_pessoa_candidato: cdPessoaCandidato,
                status_candidato: statusCandidatoLiberado ? 0 : 1,
                ds_observacoes: description,
            })
            .then(function (response) {
                switch (response.data.status) {
                    case 0:
                        toast.error(response.data.message);
                        break;
                    case 1:
                        toast.success(response.data.message);
                        setStatusCandidatoLiberado(!statusCandidatoLiberado);
                        break;
                    case 2:
                        toast.warning(response.data.message);
                        setStatusCandidatoLiberado(!statusCandidatoLiberado);
                        break;
                    default:
                        toast.warning(
                            "Ocorreu um erro inesperado, se o mesmo persistir, contate a TI."
                        );
                        console.error(response);
                        break;
                }

                setShowLoading(false);
            })
            .catch(function (error) {
                toast.error(`Erro ao ${action} candidato.`);
                setShowLoading(false);
                console.error(error);
            });
    });

    const handleInativaCandidato = useCallback(() => {
        if (empty(dadosCurriculo.dt_inativo)) {
            toast.warn("Informe a data limite da inativação.");
            return;
        }

        let dtInativo = moment(dadosCurriculo.dt_inativo, "YYYY-MM-DD");

        if (dtInativo.isValid()) {
            setShowDialogInativaCand(true);
        }
    });

    const inativarCandidato = useCallback((description) => {
        if (empty(cdPessoaCandidato)) {
            return;
        }

        setShowLoading(true);

        const urlRoute = candidatoAtivo
            ? "/candidato/inativar-candidato"
            : "/candidato/ativar-candidato";

        let url = `${process.env.NEXT_PUBLIC_API_URL}${urlRoute}`;
        let action = candidatoAtivo ? "inativar" : "ativar";

        axiosInstance
            .post(url, {
                cd_usuario: user.user_sip,
                cd_pessoa_candidato: cdPessoaCandidato,
                dt_inativo: candidatoAtivo ? dadosCurriculo.dt_inativo : "",
                ds_observacoes: description,
            })
            .then(function (response) {
                switch (response.data.status) {
                    case 0:
                        toast.error(response.data.message);
                        break;
                    case 1:
                        //Se não estava ativo, limpa a data de inativação, pois foi ativado
                        if (!candidatoAtivo) {
                            setDadosCurriculoCallback("dt_inativo", "");
                        }

                        toast.success(response.data.message);
                        setCandidatoAtivo(!candidatoAtivo);
                        break;
                    case 2:
                        toast.warning(response.data.message);
                        setCandidatoAtivo(!candidatoAtivo);
                        break;
                    default:
                        toast.warning(
                            "Ocorreu um erro inesperado, se o mesmo persistir, contate a TI."
                        );
                        console.error(response);
                        break;
                }

                setShowLoading(false);
            })
            .catch(function (error) {
                toast.error(`Erro ao ${action} candidato.`);
                setShowLoading(false);
                console.error(error);
            });
    });

    const handleCEPSearch = useCallback((cepParam) => {
        const cep = cepParam ?? dadosCurriculo.cd_cep;

        if (!cep || cep === "" || cep.length > 9) {
            toast.error("CEP inválido.");
            return;
        }

        setShowLoading(true);

        axiosInstance
            .get(`endereco/buscar-cep/${cep}`)
            .then(function (response) {
                const dados = response.data.dados_cep;
                setDadosCurriculoCallback("nm_cep", dados.ENDERECO);
                setDadosCurriculoCallback("nm_cidade_reside", dados.NM_CIDADE);
                setDadosCurriculoCallback("nm_estado_reside", dados.NM_UF);
                setDadosCurriculoCallback("cd_uf_reside", dados.CD_UF);
                setDadosCurriculoCallback("cd_pais_reside", dados.CD_PAIS);
                setDadosCurriculoCallback("nm_bairro", response.data.bairro_viacep);
                setBairros(response.data.bairros);

                setShowLoading(false);
            })
            .catch(function (error) {
                toast.error("Erro ao buscar dados do CEP.");
                setShowLoading(false);
                console.error(error);
            });
    }, [dadosCurriculo.cd_cep]);


    const getBairros = (nm_cidade, cd_uf) => {
        setShowLoading(true);

        axiosInstance
            .get(`endereco/bairros/${nm_cidade}/${cd_uf}`)
            .then(function (response) {
                setBairros(response.data);
                setShowLoading(false);
            })
            .catch(function (error) {
                toast.error("Erro ao buscar os bairros.");
                setShowLoading(false);
                console.error(error);
            });
    };

    const handleWhatsApp = (phone) => {
        phone = phone.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/\s]/gi, "");

        if (phone.length < 10) {
            toast.warning("Número de telefone incompleto!");
            return;
        }

        window.open(`https://wa.me/55${phone}`, "_blank");
    };

    const validaDataNascimento = (dtNascimento) => {
        if (dtNascimento.length < 10) {
            setMensagemIdadeMinima("");
            return false;
        }

        let dataAtual = moment();
        let dtNasc = moment(dtNascimento);
        let idadeTmp = dataAtual.diff(dtNasc, "years");

        if (idadeTmp < 14) {
            setMensagemIdadeMinima("A idade mínima para cadastrar-se é de 14 anos!");
            toast.error("A idade mínima para cadastrar-se é de 14 anos!");
            return false;
        }

        setMensagemIdadeMinima("");
        return true;
    };

    const calculaImc = () => {
        let imc = dadosCurriculo.nr_peso / (dadosCurriculo.nr_altura * dadosCurriculo.nr_altura);
        setValorIMC(imc.toFixed(2));
        imc = parseFloat(imc.toFixed(2));

        if (imc < 18.5 || imc > 35) {
            return setEstiloIMC("danger");
        }

        if (imc >= 18.5 && imc <= 24.9) {
            return setEstiloIMC("success");
        }

        if (imc >= 25 && imc <= 34.9) {
            return setEstiloIMC("warning");
        }
    };

    useEffect(() => {
        setValorIMC(0);
        setEstiloIMC("default");

        if (!empty(dadosCurriculo.nr_peso) && !empty(dadosCurriculo.nr_altura)) {
            calculaImc();
        }
    }, [dadosCurriculo.nr_peso, dadosCurriculo.nr_altura]);

    const groups = () => {
        const isInvalidDadosPessoais = validateForm(
            validaDadosPessoais,
            null,
            dadosCurriculo,
            null
        );

        const isInvalidAcesso =
            validateForm(validaAcesso, null, dadosCurriculo, null) ||
            !senhasConferem ||
            !lembreteSenhaValido ||
            !tamanhoSenhaValido;

        const isInvalidEndereco = validateForm(validaEndereco, null, dadosCurriculo, null);

        const isAnyFormInvalid = isInvalidDadosPessoais || isInvalidAcesso || isInvalidEndereco;

        const listGroups = [
            {
                id: "pessoal",
                label: "Pessoal",
                icon: faUser,
            },
            {
                id: "endereco",
                label: "Endereço",
                icon: faHome,
                disabled: !isEditMode ? isInvalidAcesso : false,
            },
            {
                id: "contato",
                label: "Contato",
                icon: faPhone,
                disabled: !isEditMode ? isAnyFormInvalid : false,
            },
            {
                id: "documentos",
                label: "Documentos",
                icon: faIdCard,
                disabled: !isEditMode ? isAnyFormInvalid : false,
            },
            {
                id: "formacao",
                label: "Formação",
                icon: faGraduationCap,
                disabled: !isEditMode ? isAnyFormInvalid : false,
            },
            {
                id: "cargo",
                label: "Cargo",
                icon: faSitemap,
                disabled: !isEditMode ? isAnyFormInvalid : false,
            },
            {
                id: "empregos",
                label: "Empregos anteriores",
                icon: faIdBadge,
                disabled: !isEditMode ? isAnyFormInvalid : false,
            },
            {
                id: "idiomas",
                label: "Idiomas",
                icon: faLanguage,
                disabled: !isEditMode ? isAnyFormInvalid : false,
            },
            {
                id: "softwares",
                label: "Softwares",
                icon: faLaptop,
                disabled: !isEditMode ? isAnyFormInvalid : false,
            },
            {
                id: "competencias",
                label: "Competências",
                icon: faUserCheck,
                disabled: !isEditMode ? isAnyFormInvalid : false,
            },
            {
                id: "acesso",
                label: "Acesso WEB",
                icon: faKey,
                disabled: !isEditMode ? isInvalidDadosPessoais : false,
            },
        ];

        if (isEditMode) {
            listGroups.push({
                id: "",
                label: "",
                itemClassName: "border-b-2 mx-4 mb-2",
                hoverClassName: "p-0",
            });
            listGroups.push({
                id: "experiencia",
                label: "Experiência",
                icon: faUserCog,
            });
            listGroups.push({ id: "laudo", label: "Laudo", icon: faClipboard });
            listGroups.push({ id: "parecer", label: "Parecer", icon: faFileText });
            listGroups.push({
                id: "",
                label: "",
                itemClassName: "border-b-2 mx-4 mb-2",
                hoverClassName: "p-0",
            });
            listGroups.push({
                id: "grupo",
                label: "Add. grupo de cand.",
                icon: faUsers,
            });
        }

        return listGroups;
    };

    const handleChangeCountry = (id, value) => {
        setDadosCurriculoCallback(id, value);
        setDadosCurriculoCallback("cd_uf", "");
        setDadosCurriculoCallback("nm_cidade_origem", "");
    };

    const handleChangeState = (id, value) => {
        setDadosCurriculoCallback(id, value);
        setDadosCurriculoCallback("nm_cidade_origem", "");
    };

    const handleItemClick = (itemId) => {
        if (itemId === "grupo") {
            showDialogAddCandidatoAoGrupo();
            return;
        }

        if (itemId !== "") {
            setGrupoAtivo(itemId);
        }
    };

    const showDialogAddCandidatoAoGrupo = () => {
        setShowDialogGrupoCand(true);
    };

    const handleShowBuscarCEP = () => {
        let estadoAtual = showModalBuscarCEP
        setShowModalBuscarCEP(!estadoAtual);
    };

    const handleSetCEPSelecionado = (CEP) => {
        // setCEPSelecionado(CEP);
        setDadosCurriculoCallback("cd_cep", CEP);
        setShowModalBuscarCEP(false);
        handleCEPSearch(CEP);
    };

    const incluirGrupoCandidato = (cdGrupo, descricao) => {
        let params = {
            cd_tipo_grupo_candidato: parseInt(cdGrupo),
            candidatos: JSON.stringify([
                { cd_pessoa: cdPessoaCandidato, ds_observacoes: descricao },
            ]),
        };

        axiosInstance
            .post(`grupo/candidatos-add`, params)
            .then(function (response) {
                if (response.status === 200) {
                    toast.success("Candidato adicionado com sucesso!");
                }
            })
            .catch(function (resp) {
                console.error(resp?.response?.data?.error);
                return toast.error("Não foi possível adicionar o candidato ao grupo.");
            });

        setShowDialogGrupoCand(false);
    };

    const atualizaNotaCandidato = (nr_nota_candidato) => {
        const novaNota = nr_nota_candidato * 2;
        try {
            axiosInstance
                .get(`candidato/atualiza-nota/${cdPessoaCandidato}/${novaNota}`)
                .then(function (response) {
                    if (empty(response.data)) {
                        toast.error("Erro ao atualizar nota do candidato");
                        return;
                    }

                    //Atualiza a nota em memória, após atualizar no banco com sucesso
                    setDadosCurriculoCallback("nr_nota_candidato", nr_nota_candidato);
                })
                .catch(function (error) {
                    toast.error("Não foi possível atualizar a nota do candidato.");
                    console.error(error);
                });
        } catch (error) {
            console.error("Erro na comunicação com o back-end:", error);
        }
    };

    const solicitaAutorizacaoUsoImagem = () => {
        try {
            axiosInstance
                .get(`candidato/autoriza-uso-imagem/${cdPessoaCandidato}/${user.user_sip}`)
                .then(function (response) {
                    if (empty(response.data)) {
                        toast.error("Erro ao enviar autorização de uso de imagem do candidato");
                        return;
                    }

                    setAutorizaUsoImagem(0);
                })
                .catch(function (error) {
                    toast.error("Não foi possível enviar autorização de uso de imagem do candidato");
                    console.error(error);
                });
        } catch (error) {
            console.error("Erro na comunicação com o back-end:", error);
        }
    };

    const cancelUpdateProfilePicture = () => {
        // Limpar o formulário de foto
        setFormUpdateProfilePicture(prevState => ({
            ...prevState,
            ds_foto_candidato: null
        }));
    };

    const handleUpdateProfilePicture = async () => {
        // Validação - verificar se tem foto selecionada
        if (!formUpdateProfilePicture.ds_foto_candidato) {
            toast.error('Por favor, selecione uma foto');
            return;
        }

        try {
            // Criar FormData para envio de arquivo
            const formData = new FormData();
            formData.append('ds_foto_candidato', formUpdateProfilePicture.ds_foto_candidato);

            // Fazer o upload usando FormData
            const response = await axiosInstance.post(
                `candidato/update-profile-picture/${formUpdateProfilePicture.cd_pessoa_candidato}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );

            // Sucesso - fechar modal e atualizar foto
            setModalUpdateProfilePicture(false);
            toast.success('Foto atualizada com sucesso!');

            // Recarregar dados do candidato para atualizar a foto
            await getDadosCandidato();

        } catch (resp) {
            console.error(resp);
            let error = resp?.response?.data?.error || resp?.response?.data?.message;
            if (Array.isArray(error)) {
                return toast.error(error.join(' ') || 'Ops! Ocorreu um erro ao atualizar a foto');
            }
            return toast.error(error || 'Ops! Ocorreu um erro ao atualizar a foto');
        }
    };

    const removeUserProfilePicture = () => {
        setShowLoading(true);
        try {
            axiosInstance
                .post(`candidato/remove-profile-picture/${cdPessoa}`, {})
                .then(function (response) {
                    if (response) {
                        // Recarregar dados do candidato para atualizar a foto
                        getDadosCandidato();
                    }
                })
                .catch(function (error) {
                    setShowLoading(false);
                    toast.error("Não foi possível excluir a foto do perfil.");
                    console.error(error);
                });
        } catch (error) {
            setShowLoading(false);
            console.error("Erro na comunicação com o back-end:", error);
        }
    };

    return (
        <div className={`col-span-12 ${resetValues ? "" : "mt-12"} relative ${active ? "" : "hidden"}`}>
            <div className={`grid grid-cols-12 gap-2 relative`}>
                <div className="col-span-1 md:col-span-2 pt-0.5 xl:pt-2 shadow-lg max-h-[90%] overflow-y-auto overflow-x-hidden">
                    <div
                        className="w-[136px] h-[136px] relative xl:mx-auto group"
                        ref={userImgRef}
                    >
                        <Image
                            src={profilePicture}
                            alt="User Image"
                            fill
                            priority
                            style={{ objectFit: 'cover' }}
                            className="transition-opacity duration-200 group-hover:opacity-80 rounded-full"
                        />
                        {/* Overlay com ícones de editar e excluir no hover */}
                        <div className="absolute inset-0 bg-white bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white text-xs font-medium space-y-6">
                            {/* Botão de editar */}
                            <div className="flex flex-col items-center">
                                <Button onClick={setModalUpdateProfilePicture.bind(null, true)} buttonType={"primary"} small className="flex items-center">
                                    <FontAwesomeIcon icon={faEdit} width="16" height="16" className="mr-2"/>
                                    Alterar Foto
                                </Button>
                            </div>

                            {/* Botão de excluir */}
                            <div className={cn("flex flex-col items-center", showBtnRemoveProfilePicture ? 'block' : 'hidden')}>
                                <Button onClick={setShowConfirmRemoveProfileImg.bind(null, true)} className="flex items-center" buttonType={"danger"} small>
                                    <FontAwesomeIcon icon={faTrashAlt} width="16" height="16" className="mr-2"/>
                                    Excluir Foto
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <MiniSidebar
                            items={groups()}
                            onItemClick={handleItemClick}
                            filtroAtivo={grupoAtivo}
                        />
                    </div>
                    <Confirm
                        visible={showConfirmRemoveProfileImg}
                        setVisible={setShowConfirmRemoveProfileImg}
                        cancelActionCallback={() => {
                            setShowConfirmRemoveProfileImg(false);
                        }}
                        confirmActionCallback={() => {
                            removeUserProfilePicture();
                        }}
                        btnDecline={"Não"}
                        primaryText={'Deseja realmente remover a foto do perfil?'}
                    ></Confirm>
                </div>


                {/* PESSOAL */}
                <div className={`col-span-11 md:col-span-10 py-2 p-2 pb-4 transition-opacity duration-300 h-[85vh] overflow-y-auto ${grupoAtivo == "pessoal" ? "" : "hidden"}`}>
                    {showLoading && <FormSkeleton />}
                    <div className="grid grid-cols-12 gap-x-2 gap-y-5 mb-20">

                        {/* CANDIDATO, NOTA, STATUS, E-SOCIAL, PCD, INATIVAR */}
                        <div className="col-span-12">
                            <div className="flex flex-row w-full gap-2 justify-between items-baseline">
                                {/* Informações exibidas na edição de candidato */}
                                <div className={`${isEditMode ? "" : "hidden"}`}>
                                    <FieldLabel>Candidato:</FieldLabel>
                                    <div>
                                        <PillsBadge type="primary">{cdPessoaCandidato}</PillsBadge>
                                    </div>
                                </div>

                                {/* NOTA CANDIDATO */}
                                <div className={`${isEditMode ? "" : "hidden"}`} >
                                    <FieldLabel>Nota:</FieldLabel>
                                    <Rating
                                        value={parseInt(dadosCurriculo.nr_nota_candidato)}
                                        className="max-w-[100px] h-[20px] mt-1"
                                        onChange={(value) => atualizaNotaCandidato(value)}
                                    />
                                </div>

                                {/* STATUS CANDIDATO */}
                                <div className={`${isEditMode ? "" : "hidden"}`}>
                                    <FieldLabel>Status:</FieldLabel>
                                    <div className={`mt-1 w-[120px] ${statusCandidatoLiberado ? "hidden" : "flex"}`} >
                                        <Button
                                            size="small"
                                            buttonType="danger"
                                            className={`flex shadow`}
                                            onClick={() => {
                                                setShowDialogStatusCand(true);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faLock} width="14" height="14" />
                                            <span className={"ml-2"}>BLOQUEADO</span>
                                        </Button>
                                    </div>
                                    <div className={`mt-1 w-[100px] ${statusCandidatoLiberado ? "flex" : "hidden"}`} >
                                        <Button
                                            size="small"
                                            buttonType="success"
                                            className={`flex shadow`}
                                            onClick={() => {
                                                setShowDialogStatusCand(true);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faLockOpen} width="14" height="14" />
                                            <span className={"ml-2"}>LIBERADO</span>
                                        </Button>
                                    </div>
                                    <Dialog
                                        small
                                        textAreaMinLength={40}
                                        btnCancel={"CANCELAR"}
                                        btnAccept={"CONFIRMAR"}
                                        showDialog={showDialogStatusCand}
                                        setDialogControl={setShowDialogStatusCand}
                                        confirmActionCallback={(description) => {
                                            setStatusCandidato(description);
                                        }}
                                        title={`Deseja realmente ${statusCandidatoLiberado ? "bloquear" : "desbloquear"} este candidato?`}
                                    />
                                </div>

                                {/* E-SOCIAL */}
                                <div className={`${isEditMode ? "" : "hidden"}`} >
                                    <FieldLabel>Status e-Social:</FieldLabel>
                                    <div className={`flex mt-1`}>
                                        <div className={`text-white px-2 py-1 rounded w-fit justify-center text-center flex ${statusESocialClass}`} >
                                            <FieldLabel className={"!mb-0 text-white"}>
                                                {statusESocialText}
                                            </FieldLabel>
                                        </div>
                                        <TooltipComponent content={"Consultar e-Social"} asChild>
                                            <div tabIndex={-1}>
                                                <Button
                                                    onClick={() => {
                                                        window.open(
                                                            "https://consultacadastral.inss.gov.br/Esocial/pages/qualificacao/qualificar.xhtml",
                                                            "_blank"
                                                        );
                                                    }}
                                                    className={`text-blue-700 border rounded-md shadow px-2 py-1 ml-2 hover:bg-blue-700 hover:text-white`}
                                                >
                                                    <FontAwesomeIcon icon={faExternalLinkAlt} width="18" height="18"/>
                                                </Button>
                                            </div>
                                        </TooltipComponent>

                                        <TooltipComponent content={"Validar e-Social"} asChild>
                                            <div tabIndex={-1} className={`${showValidaESocial ? "" : "hidden"}`}>
                                                <Button
                                                    onClick={() => { setShowDialogESocial(true); }}
                                                    className={`text-blue-700 border rounded-md shadow px-2 py-1 ml-2 hover:bg-blue-700 hover:text-white`}
                                                >
                                                    <FontAwesomeIcon icon={faCheck} width="18" height="18" />
                                                </Button>
                                            </div>
                                        </TooltipComponent>
                                    </div>
                                    <Dialog
                                        hideTextArea={true}
                                        btnCancel={"NÃO CONFIRMO"}
                                        btnAccept={"CONFIRMO VALIDAÇÃO"}
                                        showDialog={showDialogESocial}
                                        setDialogControl={setShowDialogESocial}
                                        confirmActionCallback={() => {
                                            validarESocial(
                                                "V",
                                                "<strong>eSocial:</strong> Foi liberado como válido na Ficha de Qualificação Cadastral."
                                            );
                                        }}
                                        title={`Confirma que este candidato está válido na Ficha de Qualificação Cadastral?`}
                                    />
                                </div>

                                {/* @db_field SIP_CANDIDATOS.DT_INATIVO */}
                                <div className={`${isEditMode ? "" : "hidden"} self-end min-w-[200px]`} >
                                    <div className={`flex items-center`}>
                                        <InputDate
                                            variant={!candidatoAtivo ? "danger" : "default"}
                                            id={"dt_inativo"}
                                            minDate={dateToday}
                                            className={`w-full ${candidatoAtivo ? "" : "font-semibold"}`}
                                            label={`${candidatoAtivo ? "Inativar candidato até:" : "Candidato inativo até:"}`}
                                            value={dadosCurriculo.dt_inativo}
                                            disabled={`${candidatoAtivo ? "" : "disabled"}`}
                                            onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                                        />
                                        {/* Se o candidato estiver inativo */}
                                        {/* Abrir modal para confirmar a reativação ao clicar em ativar candidato - Realmente deseja ativar esse candidato? - textarea "Motivo" - descrição minima 40 caracteres */}

                                        <TooltipComponent content={"Ativar candidato"} asChild>
                                            <div className={`ml-1 md:col-span-4 flex self-end ${candidatoAtivo ? "hidden" : "flex"}`} tabIndex={-1}>
                                                <Button buttonType="primary" onClick={() => { setShowDialogInativaCand(true); }}>
                                                    <FontAwesomeIcon icon={faUserCheck} width="18" height="18" />
                                                </Button>
                                            </div>
                                        </TooltipComponent>

                                        {/* Se o candidato não estiver inativo */}
                                        {/* Abrir modal para confirmar a inativação ao inserir data - Realmente deseja inativar esse candidato? - textarea "Motivo" - descrição minima 40 caracteres */}
                                        <TooltipComponent content={"Inativar candidato"} asChild>
                                            <div className={`ml-1 flex self-end ${candidatoAtivo ? "flex" : "hidden"}`} tabIndex={-1}>
                                                <Button buttonType="danger" onClick={() => { handleInativaCandidato(); }} >
                                                    <FontAwesomeIcon icon={faUserTimes} width="18" height="18" />
                                                </Button>
                                            </div>
                                        </TooltipComponent>
                                    </div>
                                    <Dialog
                                        small
                                        textAreaMinLength={40}
                                        btnCancel={"CANCELAR"}
                                        btnAccept={"CONFIRMAR"}
                                        showDialog={showDialogInativaCand}
                                        setDialogControl={setShowDialogInativaCand}
                                        confirmActionCallback={(description) => {
                                            inativarCandidato(description);
                                        }}
                                        title={`Deseja realmente ${candidatoAtivo ? "inativar" : "ativar"} este candidato?`}
                                    />
                                </div>

                                {/* USO DE IMAGEM */}
                                <div className={`lg:col-span-3 sm:col-span-3 md:col-span-3`} >
                                    <FieldLabel>Uso de imagem:</FieldLabel>
                                    <div className="flex">
                                        <div className={`${autorizaUsoImagem == 2 ? "flex" : "hidden"}`} >
                                            <div className={`text-white bg-red-700 px-2 py-1 rounded w-fit items-center flex`} >
                                                <FontAwesomeIcon icon={faLock} width="14" height="14" />
                                                <FieldLabel className={"text-white ms-2"}>NEGADO</FieldLabel>
                                            </div>
                                            <TooltipComponent content={"Reenviar consentimento"} asChild>
                                                <div tabIndex={-1}>
                                                    <Button
                                                        onClick={() => { setShowConfirmUsoImagem(true); }}
                                                        className={`text-blue-700 border rounded-md shadow px-2 py-1 ml-2 hover:bg-blue-700 hover:text-white`}
                                                    >
                                                        <FontAwesomeIcon icon={faRotateRight} width="16" height="16" />
                                                    </Button>
                                                </div>
                                            </TooltipComponent>
                                            <Confirm
                                                visible={showConfirmUsoImagem}
                                                setVisible={setShowConfirmUsoImagem}
                                                cancelActionCallback={() => {
                                                    setShowConfirmUsoImagem(false);
                                                }}
                                                confirmActionCallback={() => {
                                                    solicitaAutorizacaoUsoImagem();
                                                }}
                                                btnDecline={"Não"}
                                                primaryText={'Deseja realmente solicitar autorização para uso de imagem?'}
                                                secondaryText={"Esta ação irá gerar histórico no cadastro do candidato."}
                                            ></Confirm>
                                        </div>
                                        <div className={`${autorizaUsoImagem == 1 ? "flex" : "hidden"}`} >
                                            <div className={`text-white bg-green-600 px-2 py-1 rounded w-fit items-center flex`} >
                                                <FontAwesomeIcon icon={faLockOpen} width="14" height="14" />
                                                <FieldLabel className={"text-white ms-2"}>LIBERADO</FieldLabel>
                                            </div>
                                        </div>
                                        <div className={`${autorizaUsoImagem == 0 ? "flex" : "hidden"}`} >
                                            <div className={`text-white bg-slate-500 px-2 py-1 rounded w-fit items-center flex`} >
                                                <FontAwesomeIcon icon={faUserClock} width="14" height="14" />
                                                <FieldLabel className={"text-white ms-2"}>PENDENTE</FieldLabel>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* // USO DE IMAGEM */}

                                {/* TAG PCD */}
                                <div className={`lg:col-span-1 sm:col-span-1 md:col-span-1 ${showPCD ? "" : "hidden"}`} >
                                    <FieldLabel></FieldLabel>
                                    <div className={`flex`}>
                                        <div className={`text-white bg-red-700 px-2 py-1 rounded w-fit items-center flex`} >
                                            <FieldLabel className={"text-white"}>PCD</FieldLabel>
                                        </div>
                                    </div>
                                </div>
                                {/* // TAG PCD */}

                            </div>
                        </div>

                        {/* Informações padrão do curriculo */}
                        {/* @db_field SIP_PESSOAS.NM_PESSOA */}
                        <div className="col-span-12 md:col-span-6">
                            <InputText
                                id="nm_pessoa"
                                required={validaDadosPessoais}
                                label={"Nome completo:"}
                                value={dadosCurriculo.nm_pessoa}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        {/* @db_field SIP_PESSOAS.NM_APELIDO */}
                        <div className="col-span-12 md:col-span-6">
                            <InputText
                                id="nm_apelido"
                                value={dadosCurriculo.nm_apelido}
                                label={"Como quero ser chamado(a):"}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        {/* @db_field SIP_DOCUMENTOS_PESSOA.NR_DOCUMENTO (CD_DOCUMENTO_LEGAL = 2) */}
                        <div className="col-span-12 md:col-span-6">
                            <InputCPF
                                label={"CPF:"}
                                id="nr_documento_cpf"
                                disabled={disableCPF}
                                cdPessoa={cdPessoaCandidato}
                                required={validaDadosPessoais}
                                isValidValue={setIsValidCPFValue}
                                value={dadosCurriculo.nr_documento_cpf}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        {/* @db_field SIP_PESSOAS.DS_EMAIL */}
                        <div className="col-span-12 md:col-span-6">
                            <InputEmail
                                id="ds_email"
                                label={"E-mail:"}
                                required={validaDadosPessoais}
                                value={dadosCurriculo.ds_email}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        {/* @db_field SIP_DADOS_PESSOAIS.DT_NASCIMENTO */}
                        <div className={"col-span-12 md:col-span-4"}>
                            <InputDate
                                id={"dt_nascimento"}
                                label={`Data de nascimento: ${dadosCurriculo.idade}`}
                                required={validaDadosPessoais}
                                value={dadosCurriculo.dt_nascimento}
                                copy={true}
                                onBlur={(id, value) => validaDataNascimento(value)}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                            {mensagemIdadeMinima !== "" && (
                                <div className="text-xs text-red-600 font-semibold">
                                    {mensagemIdadeMinima}
                                </div>
                            )}
                        </div>

                        {/* @db_field SIP_DADOS_PESSOAIS.ID_ESTADO_CIVIL */}
                        <div className="col-span-12 md:col-span-4">
                            <Select
                                label="Estado civil"
                                options={[
                                    { label: "Solteiro", value: "S" },
                                    { label: "Casado", value: "C" },
                                    { label: "Divorciado", value: "D" },
                                    { label: "União Estável", value: "A" },
                                    { label: "Viúvo", value: "V" },
                                    { label: "Separação Judicial", value: "J" },
                                ]}
                                hideClearButton
                                id={"id_estado_civil"}
                                required={validaDadosPessoais}
                                placeholder={"Selecione"}
                                value={dadosCurriculo.id_estado_civil}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        {/* @db_field SIP_DADOS_PESSOAIS.ID_SEXO */}
                        <div className="col-span-12 md:col-span-4">
                            <Select
                                label="Sexo"
                                options={[
                                    { label: "Feminino", value: "F" },
                                    { label: "Masculino", value: "M" },
                                ]}
                                id={"id_sexo"}
                                hideClearButton
                                required={validaDadosPessoais}
                                placeholder={"Selecione"}
                                value={dadosCurriculo.id_sexo}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        {/* @db_field SIP_PESSOAS.CD_PAIS */}
                        <div className="col-span-12 md:col-span-4">
                            <SelectPais
                                id="cd_pais"
                                init={active}
                                required={validaDadosPessoais}
                                label="Nacionalidade (País):"
                                value={dadosCurriculo.cd_pais}
                                onChange={(id, value) => handleChangeCountry(id, value)}
                            />
                        </div>

                        {/* @db_field SIP_PESSOAS.CD_UF */}
                        <div className={`col-span-12 md:col-span-4 ${showEstados ? "" : "hidden"}`}>
                            {/* Estados são exibidos apenas para o Brasil, para outros paises, lista as cidades e oculta o campo "nm_cidade_origem" */}
                            <SelectEstado
                                id="cd_uf"
                                init={active}
                                value={dadosCurriculo.cd_uf}
                                required={validaDadosPessoais}
                                cdPais={dadosCurriculo.cd_pais}
                                setShowEstados={setShowEstados}
                                onChange={(id, value) => handleChangeState(id, value)}
                                label={`Naturalidade (${dadosCurriculo.cd_pais == 1 ? "Estado" : "Cidade"
                                    }):`}
                            />
                        </div>

                        {/* @db_field SIP_PESSOAS.NM_CIDADE */}
                        <div className={`col-span-12 md:col-span-4 ${dadosCurriculo.cd_pais == 1 ? "" : "hidden"}`} >
                            <SelectCidade
                                id="nm_cidade_origem"
                                cdUF={dadosCurriculo.cd_uf}
                                label="Naturalidade (Cidade):"
                                required={validaDadosPessoais}
                                cdPais={dadosCurriculo.cd_pais}
                                value={dadosCurriculo.nm_cidade_origem}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        {/* @db_field SIP_PESSOAS.NR_ANO_CHEGADA_BRASIL */}
                        <div className={`col-span-12 md:col-span-4 ${dadosCurriculo.cd_pais == 1 ? "hidden" : ""}`} >
                            <InputText
                                required={validaDadosPessoais}
                                maxLength={4}
                                mask="numeric"
                                label="Ano de chegada:"
                                id="nr_ano_chegada_brasil"
                                value={dadosCurriculo.nr_ano_chegada_brasil}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        {/* @db_field SIP_PARENTES.NM_PESSOA (CD_GRAU_PARENTESCO = 3) */}
                        <div className="col-span-12 lg:col-span-6">
                            <InputText
                                id="nm_pessoa_mae"
                                label={"Nome da Mãe:"}
                                value={dadosCurriculo.nm_pessoa_mae}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        {/* @db_field SIP_PARENTES.NM_PESSOA (CD_GRAU_PARENTESCO = 2) */}
                        <div className="col-span-12 lg:col-span-6">
                            <InputText
                                id="nm_pessoa_pai"
                                label={"Nome do Pai:"}
                                value={dadosCurriculo.nm_pessoa_pai}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        {/* @db_field SIP_CANDIDATOS.ID_PRIMEIRO_EMPREGO */}
                        <div className="col-span-12 md:col-span-3">
                            <div>
                                <FieldLabel>É seu primeiro emprego?</FieldLabel>
                            </div>
                            <div>
                                <ButtonToggle
                                    primary
                                    labelOn={"Sim"}
                                    LabelOff={"Não"}
                                    id={"id_primeiro_emprego"}
                                    checked={dadosCurriculo.id_primeiro_emprego}
                                    onClick={(checked) => setDisableNIT(!checked)}
                                    onChange={(id, value, checked) =>
                                        setDadosCurriculoCallback(id, checked)
                                    }
                                />
                            </div>
                        </div>

                        {/* @db_field SIP_DOCUMENTOS_PESSOA.NR_DOCUMENTO (CD_DOCUMENTO_LEGAL = 8) */}
                        <div className="col-span-12 md:col-span-4">
                            <InputPIS
                                isValidValue={setIsValidPISValue}
                                value={dadosCurriculo.nr_documento_pis}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        {/* @db_field SIP_DOCUMENTOS_PESSOA.NR_DOCUMENTO (CD_DOCUMENTO_LEGAL = 19) */}
                        <div className="col-span-12 md:col-span-4">
                            <InputNIT
                                disabled={disableNIT}
                                isValidValue={setIsValidNITValue}
                                value={dadosCurriculo.nr_documento_nit}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        {/* @db_field SIP_DADOS_PESSOAIS.ID_POSSUE_DEFICIENCIA */}
                        <div className="col-span-12 md:col-span-3">
                            <div className="inline-flex items-center">
                                <FieldLabel>Pessoa com Deficiência:</FieldLabel>
                            </div>
                            <div>
                                <ButtonToggle
                                    primary
                                    labelOn={"Sim"}
                                    LabelOff={"Não"}
                                    id={"id_possue_deficiencia"}
                                    onClick={(checked) => setShowPCD(checked)}
                                    checked={dadosCurriculo.id_possue_deficiencia}
                                    onChange={(id, value, checked) =>
                                        setDadosCurriculoCallback(id, checked)
                                    }
                                />
                            </div>
                        </div>

                        {/* CID - PCD */}
                        <div className={`col-span-12 ${showPCD ? "" : "hidden"}`}>
                            {/* Mensagem de nenhuma deficiência adicionada */}
                            {dadosCardEditPCDAux.length === 0 && dadosCardAddPCD.length === 0 && (
                                <div className={"border rounded-lg mb-4"}>
                                    <WarningMessage
                                        iconSize={33}
                                        className={"!my-4"}
                                        subTitle={"Nenhuma deficiência adicionada!"}
                                        text={"Utilize o botão abaixo para adicionar deficiências."}
                                    />
                                </div>
                            )}

                            {/* Cards para edição criados a partir dos dados salvos */}
                            {dadosCardEditPCDAux.length > 0 &&
                                dadosCardEditPCDAux.map((card) => (
                                    <CardEditPCD
                                        id={card.id}
                                        dados={card}
                                        key={card.id}
                                        onChange={(data) => handleChangeCardEditPCD(card.id, data)}
                                        enableCardFunction={() => {
                                            enableCardPCD(card.id_cid_candidato);
                                        }}
                                        disableCardFunction={() => {
                                            disableCardPCD(card.id_cid_candidato);
                                        }}
                                        deleteCardFunction={() => {
                                            deleteSavedCardPCD(card.id_cid_candidato);
                                        }}
                                    />
                                ))}

                            {/* Novos cards criados dinamicamente */}
                            {dadosCardAddPCD.length > 0 &&
                                dadosCardAddPCD.map((card) => (
                                    <CardAddPCD
                                        id={card.id}
                                        dados={card}
                                        key={card.id}
                                        onChange={(data) => handleChangeCardPCD(card.id, data)}
                                        deleteCardFunction={() => {
                                            deleteCardPCD(card.id);
                                        }}
                                    />
                                ))}
                            {/* Adicionar nova deficiência */}
                            <div className={`w-full justify-center flex`}>
                                <Button buttonType="primary" onClick={() => addCardPCD()}>
                                    Adicionar deficiência
                                </Button>
                            </div>
                        </div>

                        {/* @db_field SIP_DADOS_PESSOAIS.NR_ALTURA */}
                        <div className="col-span-12 md:col-span-4">
                            <InputText
                                mask={"altura"}
                                id={"nr_altura"}
                                label={"Altura:"}
                                value={dadosCurriculo.nr_altura}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        {/* @db_field SIP_DADOS_PESSOAIS.NR_PESO */}
                        <div className="col-span-12 md:col-span-4">
                            <InputText
                                maxLength={3}
                                id={"nr_peso"}
                                label={"Peso:"}
                                mask={"numeric"}
                                value={dadosCurriculo.nr_peso}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        {/* IMC */}
                        <div className="col-span-12 md:col-span-1">
                            <div>
                                <FieldLabel>IMC:</FieldLabel>
                            </div>
                            <div className={"mt-1"}>
                                <PillsBadge type={estiloIMC} className={"shadow border"}>
                                    {valorIMC}
                                </PillsBadge>
                            </div>
                        </div>

                        {/* @db_field SIP_DADOS_PESSOAIS.ID_CUTIS */}
                        <div className="col-span-12 md:col-span-4">
                            <Select
                                label="Cutis (Cor):"
                                options={[
                                    { label: "Não informado", value: "I" },
                                    { label: "Amarela", value: "A" },
                                    { label: "Branca", value: "B" },
                                    { label: "Indígena", value: "G" },
                                    { label: "Negra", value: "N" },
                                    { label: "Parda", value: "M" },
                                ]}
                                hideClearButton
                                id={"id_cutis"}
                                placeholder={"Selecione"}
                                value={dadosCurriculo.id_cutis}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        {/* @db_field SIP_DADOS_PESSOAIS.ID_CABELO */}
                        <div className="col-span-12 md:col-span-4">
                            <Select
                                label="Cabelo (Cor):"
                                options={[
                                    { label: "Castanho", value: "C" },
                                    { label: "Loiro", value: "L" },
                                    { label: "Negro", value: "N" },
                                    { label: "Ruivo", value: "R" },
                                ]}
                                hideClearButton
                                id={"id_cabelo"}
                                placeholder={"Selecione"}
                                value={dadosCurriculo.id_cabelo}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        {/* @db_field SIP_DADOS_PESSOAIS.ID_OLHO */}
                        <div className="col-span-12 md:col-span-4">
                            <Select
                                label="Olhos (Cor):"
                                options={[
                                    { label: "Azul", value: "A" },
                                    { label: "Castanho", value: "C" },
                                    { label: "Negro", value: "N" },
                                    { label: "Verde", value: "V" },
                                ]}
                                id={"id_olho"}
                                placeholder={"Selecione"}
                                value={dadosCurriculo.id_olho}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                                hideClearButton
                            />
                        </div>

                        {/* @db_field SIP_DADOS_PESSOAIS.NR_CALCADO */}
                        <div className="col-span-12 md:col-span-4">
                            <Select
                                label="Nº Sapato:"
                                options={[
                                    { label: "25", value: "25" },
                                    { label: "26", value: "26" },
                                    { label: "27", value: "27" },
                                    { label: "28", value: "28" },
                                    { label: "29", value: "29" },
                                    { label: "30", value: "30" },
                                    { label: "31", value: "31" },
                                    { label: "32", value: "32" },
                                    { label: "33", value: "33" },
                                    { label: "34", value: "34" },
                                    { label: "35", value: "35" },
                                    { label: "36", value: "36" },
                                    { label: "37", value: "37" },
                                    { label: "38", value: "38" },
                                    { label: "39", value: "39" },
                                    { label: "40", value: "40" },
                                    { label: "41", value: "41" },
                                    { label: "42", value: "42" },
                                    { label: "43", value: "43" },
                                    { label: "44", value: "44" },
                                    { label: "45", value: "45" },
                                    { label: "46", value: "46" },
                                    { label: "47", value: "47" },
                                    { label: "48", value: "48" },
                                    { label: "49", value: "49" },
                                    { label: "50", value: "50" },
                                    { label: "51", value: "51" },
                                    { label: "52", value: "52" },
                                ]}
                                hideClearButton
                                id={"nr_calcado"}
                                placeholder={"Selecione"}
                                value={dadosCurriculo.nr_calcado}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        {/* @db_field SIP_DADOS_PESSOAIS.ID_TAMANHO_CALCA */}
                        <div className="col-span-12 md:col-span-4">
                            <Select
                                label="Nº Calça:"
                                options={[
                                    { label: "34", value: "34" },
                                    { label: "36", value: "36" },
                                    { label: "38", value: "38" },
                                    { label: "40", value: "40" },
                                    { label: "42", value: "42" },
                                    { label: "44", value: "44" },
                                    { label: "46", value: "46" },
                                    { label: "48", value: "48" },
                                    { label: "50", value: "50" },
                                    { label: "52", value: "52" },
                                    { label: "54", value: "54" },
                                    { label: "56", value: "56" },
                                    { label: "58", value: "58" },
                                    { label: "60", value: "60" },
                                ]}
                                hideClearButton
                                id={"id_tamanho_calca"}
                                placeholder={"Selecione"}
                                value={dadosCurriculo.id_tamanho_calca}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        {/* @db_field SIP_DADOS_PESSOAIS.ID_TAMANHO_CAMISA */}
                        <div className="col-span-12 md:col-span-4">
                            <Select
                                label="Nº Camisa:"
                                options={[
                                    { label: "P", value: "P" },
                                    { label: "M", value: "M" },
                                    { label: "G", value: "G" },
                                    { label: "GG", value: "GG" },
                                    { label: "EGG", value: "EGG" },
                                    { label: "G1", value: "G1" },
                                    { label: "G2", value: "G2" },
                                    { label: "G3", value: "G3" },
                                ]}
                                id={"id_tamanho_camisa"}
                                placeholder={"Selecione"}
                                value={dadosCurriculo.id_tamanho_camisa}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                                hideClearButton
                            />
                        </div>

                        {/* FILHOS */}
                        <div className="col-span-6 md:col-span-4 lg:col-span-2 flex items-center">
                            <Checkbox
                                id={"possui_filhos"}
                                label={"Possui Filhos?"}
                                required={validaDadosPessoais}
                                checked={dadosCurriculo.possui_filhos}
                                onChange={handleClickFilhos}
                            />
                        </div>

                        {/* @db_field SIP_DADOS_PESSOAIS.NR_FILHO */}
                        <div className="col-span-6 md:col-span-4 lg:col-span-2">
                            <InputNumber
                                id="nr_filho"
                                label={"Quantidade:"}
                                className={"!w-[70px]"}
                                disabled={disableNrFilho}
                                value={dadosCurriculo.nr_filho}
                                min={dadosCurriculo.possui_filhos ? 1 : 0}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        {/* FUMANTE */}
                        <div className="col-span-6 md:col-span-4 lg:col-span-2 flex items-center">
                            <Checkbox
                                id={"id_fumante"}
                                label={"Fumante?"}
                                checked={dadosCurriculo.id_fumante}
                                onChange={setDadosCurriculoCallback}
                            />
                        </div>

                        {/* VEICULO */}
                        <div className="col-span-6 md:col-span-4 lg:col-span-2 flex items-center">
                            <Checkbox
                                id={"possui_veiculo"}
                                label={"Possui Veiculo?"}
                                checked={dadosCurriculo.possui_veiculo}
                                onChange={setDadosCurriculoCallback}
                            />
                        </div>

                        {/* @db_field SIP_DADOS_PESSOAIS.CD_HABILITACAO_CAT */}
                        <div className="col-span-6 md:col-span-8 lg:col-span-4">
                            <Select
                                label="Carteira de Habilitação:"
                                options={[
                                    { label: "A", value: "A" },
                                    { label: "B", value: "B" },
                                    { label: "C", value: "C" },
                                    { label: "D", value: "D" },
                                    { label: "E", value: "E" },
                                    { label: "AB", value: "AB" },
                                    { label: "AC", value: "AC" },
                                    { label: "AD", value: "AD" },
                                    { label: "AE", value: "AE" },
                                ]}
                                id={"cd_habilitacao_cat"}
                                placeholder={"Selecione"}
                                value={dadosCurriculo.cd_habilitacao_cat}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                                hideClearButton
                            />
                        </div>

                        {/* @db_field SIP_CANDIDATOS.ID_EXPERIENCIA */}
                        <div className={`col-span-12 mt-2`}>
                            <Fieldset
                                label={
                                    <Checkbox
                                        id={"id_experiencia"}
                                        required={validaDadosPessoais}
                                        checked={dadosCurriculo.id_experiencia}
                                        label={"Experiência na área de eventos?"}
                                        onChange={handleExperienciaEventos}
                                    />
                                }
                            >
                                <div className={"w-1/4 pr-2 pl-2 self-start"}>
                                    <FieldLabel>Qual o tipo de ação?</FieldLabel>
                                    {/* @db_field SIP_CANDIDATOS.ID_ABORDAGEM */}
                                    <Checkbox
                                        id={"id_abordagem"}
                                        label={"Abordagem"}
                                        className={"py-1"}
                                        disabled={!enableFieldsetEventos}
                                        checked={dadosCurriculo.id_abordagem}
                                        onChange={(id, checked) =>
                                            setDadosCurriculoCallback(id, checked)
                                        }
                                    />
                                    {/* @db_field SIP_CANDIDATOS.ID_DEMONSTRACAO */}
                                    <Checkbox
                                        id={"id_demonstracao"}
                                        label={"Demonstração"}
                                        className={"py-1"}
                                        disabled={!enableFieldsetEventos}
                                        checked={dadosCurriculo.id_demonstracao}
                                        onChange={(id, checked) =>
                                            setDadosCurriculoCallback(id, checked)
                                        }
                                    />
                                    {/* @db_field SIP_CANDIDATOS.ID_REPOSICAO */}
                                    <Checkbox
                                        id={"id_reposicao"}
                                        label={"Reposição"}
                                        className={"py-1"}
                                        disabled={!enableFieldsetEventos}
                                        checked={dadosCurriculo.id_reposicao}
                                        onChange={(id, checked) =>
                                            setDadosCurriculoCallback(id, checked)
                                        }
                                    />
                                </div>
                                <div className={"w-3/4 pl-2"}>
                                    {/* @db_field SIP_CANDIDATOS.DS_INF_EXPERIENCIA */}
                                    <div className={"w-full pr-2"}>
                                        <InputTextArea
                                            rows="3"
                                            maxLength={200}
                                            id="ds_inf_experiencia"
                                            label={"Informações adicionais da experiência:"}
                                            disabled={!enableFieldsetEventos}
                                            value={dadosCurriculo.ds_inf_experiencia}
                                            onChange={(id, checked) =>
                                                setDadosCurriculoCallback(id, checked)
                                            }
                                        />
                                    </div>
                                </div>
                            </Fieldset>
                        </div>

                        {/* ATIVIDADES SOCIAIS */}
                        <div className={`col-span-12 mt-2`}>
                            <Fieldset
                                label={
                                    <Checkbox
                                        required={validaDadosPessoais}
                                        onChange={handleAtividadesSociais}
                                        id={"check_responsabilidades_sociais"}
                                        label={"Desenvolve atividades sociais?"}
                                        checked={dadosCurriculo.check_responsabilidades_sociais}
                                    />
                                }
                            >
                                <div className={"w-full m-2"}>
                                    {/* @db_field SIP_DADOS_PESSOAIS.DS_RESPONSABILIDADES_SOCIAIS */}
                                    <InputTextArea
                                        rows="3"
                                        maxLength={2000}
                                        disabled={!disableDsRespSociais}
                                        id="ds_responsabilidades_sociais"
                                        label={"Descreva as suas atividades sociais:"}
                                        value={dadosCurriculo.ds_responsabilidades_sociais}
                                        onChange={(id, checked) =>
                                            setDadosCurriculoCallback(id, checked)
                                        }
                                    />
                                </div>
                            </Fieldset>
                        </div>

                        {/* @db_field SIP_PESSOAS.DS_WWW */}
                        <div className="col-span-12 relative">
                            <InputText
                                id="ds_www"
                                value={dadosCurriculo.ds_www}
                                label={"URL (Redes Sociais):"}
                                placeholder={"https://www.exemplo.com/"}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                            <div className={"absolute top-[29px] right-[4px]"}>
                                <Button
                                    size="small"
                                    buttonType="primary"
                                    outline
                                    bordered
                                    className={`flex shadow`}
                                    onClick={() => {
                                        handleOpenSocialMedia();
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={faExternalLinkAlt}
                                        width="15"
                                        height="15"
                                    />
                                    <span className={"ml-2"}>Visitar link</span>
                                </Button>
                            </div>
                        </div>

                        {/* HOBBIES */}
                        <div className={`col-span-12 mt-2`}>
                            <Fieldset
                                label={
                                    <Checkbox
                                        required={validaDadosPessoais}
                                        onChange={handleClickHobbies}
                                        id={"check_hobbies"}
                                        label={"Possui algum Hobbie ou Lazer?"}
                                        checked={dadosCurriculo.check_hobbies}
                                    />
                                }
                            >
                                {/* @db_field SIP_DADOS_PESSOAIS.DS_HOBBIES */}
                                <div className={"w-full m-2"}>
                                    <InputTextArea
                                        rows="3"
                                        id="ds_hobbies"
                                        maxLength={2000}
                                        disabled={!disableDsHobbies}
                                        value={dadosCurriculo.ds_hobbies}
                                        label={"Descreva as suas atividades de Lazer ou Hobbie:"}
                                        onChange={(id, checked) =>
                                            setDadosCurriculoCallback(id, checked)
                                        }
                                    />
                                </div>
                            </Fieldset>
                        </div>
                    </div>
                </div>

                {/* ENDERECO */}
                <div
                    className={`col-span-9 lg:col-span-10 py-2 p-2 pb-4 transition-opacity
                    duration-300 h-[85vh] overflow-y-auto ${grupoAtivo == "endereco" ? "" : "hidden"}`}
                >
                    {/* @db_field SIP_ENDERECOS.CD_CEP */}
                    <div className="grid grid-cols-12 gap-x-2 gap-y-5 mt-2">
                        <div className="col-span-12 md:col-span-4 lg:col-span-6">
                            <InputText
                                mask={"cep"}
                                id={"cd_cep"}
                                label={"CEP:"}
                                required={validaDadosPessoais}
                                placeholder={"Digite o CEP"}
                                value={dadosCurriculo.cd_cep}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        <div className="col-span-6 md:col-span-3 lg:col-span-2">
                            <Button buttonType="primary" onClick={() => handleCEPSearch()}>
                                Atualizar
                            </Button>
                        </div>

                        <div className="col-span-6 md:col-span-4 lg:col-span-3 self-end mb-1">
                            <Button
                                buttonType="primary"
                                outline
                                bordered
                                className={`flex shadow`}
                                onClick={handleShowBuscarCEP}
                            >
                                <FontAwesomeIcon icon={faSearch} width="15" height="15" />
                                <span className={"ml-2"}>Buscar CEP</span>
                            </Button>
                        </div>

                        <div className="col-span-12 md:col-span-6">
                            {/* @db_field SIP_CEPS.NM_TIPO_LOGRADOURO + SIP_CEPS.NM_CEP */}
                            <InputText
                                id={"nm_cep"}
                                disabled
                                label={"Endereço:"}
                                required={validaDadosPessoais}
                                value={dadosCurriculo.nm_cep}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        <div className="col-span-6 md:col-span-2">
                            {/* @db_field SIP_ENDERECOS.NR_ENDERECO */}
                            <InputText
                                mask={"numeric"}
                                label={"Número:"}
                                id={"nr_endereco"}
                                value={dadosCurriculo.nr_endereco}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        <div className="col-span-6 md:col-span-4">
                            {/* @db_field SIP_ENDERECOS.DS_COMPLEMENTO */}
                            <InputText
                                id={"ds_complemento"}
                                label={"Complemento:"}
                                value={dadosCurriculo.ds_complemento}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            {/* @db_field SIP_ENDERECOS.NM_BAIRRO */}
                            <SelectBairro
                                id={"nm_bairro"}
                                label={"Bairro:"}
                                options={bairros}
                                required={validaDadosPessoais}
                                value={dadosCurriculo.nm_bairro}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            {/* @db_field SIP_ENDERECOS.NM_CIDADE */}
                            <InputText
                                disabled
                                id={"nm_cidade_reside"}
                                label={"Cidade:"}
                                required={validaDadosPessoais}
                                value={dadosCurriculo.nm_cidade_reside}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            <InputText
                                disabled
                                id={"nm_estado_reside"}
                                label={"Estado:"}
                                required={validaDadosPessoais}
                                value={dadosCurriculo.nm_estado_reside}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        <div className="col-span-12 md:col-span-12">
                            {/* @db_field SIP_ENDERECOS.DS_REFERENCIA */}
                            <InputText
                                id={"ds_referencia"}
                                label={"Referência:"}
                                value={dadosCurriculo.ds_referencia}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>
                    </div>
                </div>

                {/* CONTATO */}
                <div className={`col-span-9 lg:col-span-10 py-2 p-2 pb-4 transition-opacity duration-300 h-[85vh] overflow-y-auto ${grupoAtivo == "contato" ? "" : "hidden"}`} >
                    <Blockquote type="primary">
                        <div className="flex">
                            <FontAwesomeIcon icon={faExclamationCircle} width="19" height="19" />
                            <span className="ml-2">Informe ao menos 2 telefones para contato</span>
                        </div>
                    </Blockquote>

                    <div className="grid grid-cols-12 gap-x-2 gap-y-5 mt-4">
                        <div className="col-span-6 md:col-span-4 flex">
                            {/* @db_field SIP_TELEFONES_PESSOA.NR_TELEFONE (CD_TIPO_TELEFONE = 5) */}
                            <div className={`w-full`}>
                                <InputText
                                    mask={"phone"}
                                    label={"Celular:"}
                                    id={"nr_telefone_cel"}
                                    placeholder={"(00) 00000-0000"}
                                    value={dadosCurriculo.nr_telefone_cel}
                                    onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                                />
                            </div>
                            <div className={`${dadosCurriculo.id_possui_whatsapp_cel ? "flex" : "hidden"} w-[40px] items-center ml-2`}>
                                <TooltipComponent content={"Conversar pelo WhatsApp"} asChild>
                                    <span data-tooltip-id="hintWhats">
                                        <Button
                                            buttonType="success"
                                            onClick={() =>
                                                handleWhatsApp(dadosCurriculo.nr_telefone_cel)
                                            }
                                            className={"!rounded-lg !py-1 !px-1"}
                                        >
                                            <FontAwesomeIcon icon={faWhatsapp} width="25" height="25"/>
                                        </Button>
                                    </span>
                                </TooltipComponent>
                            </div>
                        </div>
                        <div className="col-span-6 md:col-span-4">
                            {/* @db_field SIP_TELEFONES_PESSOA.DS_OBSERVACAO (CD_TIPO_TELEFONE = 5) */}
                            <InputText
                                label={"Falar com"}
                                id={"ds_observacao_cel"}
                                placeholder={"Falar com"}
                                value={dadosCurriculo.ds_observacao_cel}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>
                        <div className="col-span-12 md:col-span-2 flex items-center">
                            {/* @db_field SIP_TELEFONES_PESSOA.ID_POSSUI_WHATSAPP (CD_TIPO_TELEFONE = 5) */}
                            <Checkbox
                                className={"text-nowrap"}
                                label={"Possui WhatsApp?"}
                                id={"id_possui_whatsapp_cel"}
                                checked={dadosCurriculo.id_possui_whatsapp_cel}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        <div className="col-span-6 md:col-span-4 flex">
                            {/* @db_field SIP_TELEFONES_PESSOA.NR_TELEFONE (CD_TIPO_TELEFONE = 4) */}
                            <div className={`w-full`}>
                                <InputText
                                    mask={"phone"}
                                    label={"Recado:"}
                                    id={"nr_telefone_rec"}
                                    placeholder={"(00) 00000-0000"}
                                    value={dadosCurriculo.nr_telefone_rec}
                                    onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                                />
                            </div>
                            <div
                                className={`${dadosCurriculo.id_possui_whatsapp_rec ? "flex" : "hidden"
                                    } w-[40px] items-end ml-2`}
                            >
                                <span>
                                    <Button
                                        buttonType="success"
                                        onClick={() =>
                                            handleWhatsApp(dadosCurriculo.nr_telefone_rec)
                                        }
                                        className={"!rounded-lg !py-1 !px-1"}
                                    >
                                        <FontAwesomeIcon icon={faWhatsapp} width="25" height="25" />
                                    </Button>
                                </span>
                            </div>
                        </div>
                        <div className="col-span-6 md:col-span-4">
                            {/* @db_field SIP_TELEFONES_PESSOA.DS_OBSERVACAO (CD_TIPO_TELEFONE = 4) */}
                            <InputText
                                label={"Falar com"}
                                id={"ds_observacao_rec"}
                                placeholder={"Falar com"}
                                value={dadosCurriculo.ds_observacao_rec}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>
                        <div className="col-span-12 md:col-span-2 flex items-center">
                            {/* @db_field SIP_TELEFONES_PESSOA.ID_POSSUI_WHATSAPP (CD_TIPO_TELEFONE = 5) */}
                            <Checkbox
                                className={"text-nowrap"}
                                label={"Possui WhatsApp?"}
                                id={"id_possui_whatsapp_rec"}
                                checked={dadosCurriculo.id_possui_whatsapp_rec}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        <div className="col-span-6 md:col-span-4">
                            {/* @db_field SIP_TELEFONES_PESSOA.NR_TELEFONE (CD_TIPO_TELEFONE = 3) */}
                            <InputText
                                mask={"phone"}
                                label={"Residencial:"}
                                id={"nr_telefone_res"}
                                placeholder={"(00) 0000-0000"}
                                value={dadosCurriculo.nr_telefone_res}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>
                        <div className="col-span-6 md:col-span-4">
                            {/* @db_field SIP_TELEFONES_PESSOA.DS_OBSERVACAO (CD_TIPO_TELEFONE = 3) */}
                            <InputText
                                label={"Falar com"}
                                id={"ds_observacao_res"}
                                placeholder={"Falar com"}
                                value={dadosCurriculo.ds_observacao_res}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>
                    </div>
                </div>

                {/* DOCUMENTOS */}
                <div className={`col-span-9 lg:col-span-10 py-2 p-2 pb-4 transition-opacity duration-300 h-[85vh] overflow-y-auto ${grupoAtivo == "documentos" ? "" : "hidden"}`}>
                    <Fieldset label="Carteira de Trabalho">
                        <div className="grid grid-cols-12 w-full gap-x-2 gap-y-5 p-2">
                            <div className="col-span-12 md:col-span-4">
                                {/* @db_field SIP_DOCUMENTOS_PESSOA.NR_DOCUMENTO (CD_DOCUMENTO_LEGAL = 6) */}
                                <InputText
                                    mask={"numeric"}
                                    label={"Número:"}
                                    id="nr_documento_ctps"
                                    value={dadosCurriculo.nr_documento_ctps}
                                    onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                                />
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                {/* @db_field SIP_DOCUMENTOS_PESSOA.NR_SERIE (CD_DOCUMENTO_LEGAL = 6) */}
                                <InputText
                                    mask={"numeric2"}
                                    id="nr_serie_ctps"
                                    label={"Número de série:"}
                                    value={dadosCurriculo.nr_serie_ctps}
                                    onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                                />
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                {/* @db_field SIP_DOCUMENTOS_PESSOA.DT_EMISSAO (CD_DOCUMENTO_LEGAL = 6) */}
                                <InputDate
                                    id="dt_emissao_ctps"
                                    label={"Data de emissão:"}
                                    value={dadosCurriculo.dt_emissao_ctps}
                                    onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                                />
                            </div>

                            <div className="col-span-12 md:col-span-4">
                                {/* @db_field SIP_DOCUMENTOS_PESSOA.CD_ESTADO_EMITE (CD_DOCUMENTO_LEGAL = 6) */}
                                <SelectEstado
                                    cdPais={1}
                                    init={active}
                                    label={`UF:`}
                                    id="cd_estado_emite_ctps"
                                    value={dadosCurriculo.cd_estado_emite_ctps}
                                    onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                                />
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                {/* @db_field SIP_DOCUMENTOS_PESSOA.NM_CIDADE_EMITE (CD_DOCUMENTO_LEGAL = 6) */}
                                <SelectCidade
                                    label="Cidade:"
                                    id="nm_cidade_emite_ctps"
                                    cdUF={dadosCurriculo.cd_estado_emite_ctps}
                                    value={dadosCurriculo.nm_cidade_emite_ctps}
                                    onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                                />
                            </div>
                        </div>
                    </Fieldset>

                    <Fieldset label="RG" className="mt-4">
                        <div className="grid grid-cols-12 w-full gap-x-2 gap-y-5 p-2">
                            <div className="col-span-12 md:col-span-4">
                                {/* @db_field SIP_DOCUMENTOS_PESSOA.NR_DOCUMENTO (CD_DOCUMENTO_LEGAL = 4) */}
                                <InputText
                                    maxLength={14}
                                    label={"Número:"}
                                    id="nr_documento_rg"
                                    value={dadosCurriculo.nr_documento_rg}
                                    onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                                />
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                {/* @db_field SIP_DOCUMENTOS_PESSOA.NR_SERIE (CD_DOCUMENTO_LEGAL = 4) */}
                                <SelectOrgaoEmissor
                                    init={active}
                                    label="Órgão:"
                                    id="orgao_emissor_rg"
                                    value={dadosCurriculo.orgao_emissor_rg}
                                    onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                                />
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                {/* @db_field SIP_DOCUMENTOS_PESSOA.DT_EMISSAO (CD_DOCUMENTO_LEGAL = 4) */}
                                <InputDate
                                    id="dt_emissao_rg"
                                    label={"Data de emissão:"}
                                    value={dadosCurriculo.dt_emissao_rg}
                                    onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                                />
                            </div>

                            <div className="col-span-12 md:col-span-4">
                                {/* @db_field SIP_DOCUMENTOS_PESSOA.CD_ESTADO_EMITE (CD_DOCUMENTO_LEGAL = 4) */}
                                <SelectEstado
                                    cdPais={1}
                                    init={active}
                                    label={`UF:`}
                                    id="cd_estado_emite_rg"
                                    value={dadosCurriculo.cd_estado_emite_rg}
                                    onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                                />
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                {/* @db_field SIP_DOCUMENTOS_PESSOA.NM_CIDADE_EMITE (CD_DOCUMENTO_LEGAL = 4) */}
                                <SelectCidade
                                    label="Cidade:"
                                    id="nm_cidade_emite_rg"
                                    cdUF={dadosCurriculo.cd_estado_emite_rg}
                                    value={dadosCurriculo.nm_cidade_emite_rg}
                                    onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                                />
                            </div>
                        </div>
                    </Fieldset>
                </div>

                {/* EMPREGOS */}
                <div
                    ref={empregosRef}
                    className={`col-span-9 lg:col-span-10 transition-opacity duration-300 h-[85vh] overflow-y-auto pb-[100px] ${grupoAtivo == "empregos" ? "" : "hidden"}`}
                >
                    <div className={`w-full sticky top-0 right-0 z-10 pb-2 bg-white-shadow-9`}>
                        <Button buttonType="primary" onClick={() => addCardEmprego()} size={isBelowXl() ? "small" : "medium"}>
                            Adicionar Experiência
                        </Button>
                    </div>

                    {/* Mensagem de nenhum emprego adicionado */}
                    {dadosCardEditEmpregoAux.length === 0 && dadosCardNovoEmprego.length === 0 && (
                        <WarningMessage title={"Nenhum emprego adicionado!"} subTitle={"Utilize o botão abaixo para adicionar empregos anteriores."}/>
                    )}
                    {/* Cards salvos em banco */}
                    {dadosCardEditEmpregoAux.length > 0 &&
                        dadosCardEditEmpregoAux.map((card) => (
                            <CardEditEmprego
                                dados={card}
                                id={card.id}
                                key={card.id}
                                deleteCardFunction={() => {
                                    deleteCardEditEmprego(card.nr_sequencia);
                                }}
                                onChange={(data) => handleChangeCardEditEmprego(card.id, data)}
                            />
                        ))}

                    {/* Novos cards criados dinamicamente */}
                    {dadosCardNovoEmprego.length > 0 &&
                        dadosCardNovoEmprego.map((card) => (
                            <CardNovoEmprego
                                dados={card}
                                id={card.id}
                                key={card.id}
                                deleteCardFunction={() => {
                                    deleteCardNovoEmprego(card.id);
                                }}
                                onChange={(data) => handleChangeCardNovoEmprego(card.id, data)}
                            />
                        ))}
                </div>

                {/* FORMACAO */}
                <div className={`col-span-9 lg:col-span-10 py-2 p-2 pb-4 transition-opacity duration-300 h-[85vh] overflow-y-auto ${grupoAtivo == "formacao" ? "" : "hidden"}`}>
                    {/* Mensagens exibidas quando não tiver nenhum curso adicionado */}
                    {dadosCardEditCursoAux.length === 0 && dadosCardNovoCurso.length === 0 && (
                        <>
                            <Blockquote type="primary">
                                <div className="flex">
                                    <FontAwesomeIcon
                                        icon={faExclamationCircle}
                                        width="19"
                                        height="19"
                                    />
                                    <span className="ml-2">Informe ao menos uma formação</span>
                                </div>
                            </Blockquote>

                            <WarningMessage
                                title={"Nenhuma formação adicionada!"}
                                subTitle={"Utilize o botão abaixo para adicionar formações."}
                            />
                        </>
                    )}

                    {/* Cards salvos em banco */}
                    {dadosCardEditCursoAux.length > 0 &&
                        dadosCardEditCursoAux.map((card) => (
                            <CardEditCurso
                                dados={card}
                                id={card.id}
                                key={card.id}
                                deleteCardFunction={() => {
                                    deleteCardEditCurso(card.nr_sequencia);
                                }}
                                onChange={(data) => handleChangeCardEditCurso(card.id, data)}
                            />
                        ))}

                    {/* Novos cards criados dinamicamente */}
                    {dadosCardNovoCurso.length > 0 &&
                        dadosCardNovoCurso.map((card) => (
                            <CardNovoCurso
                                dados={card}
                                id={card.id}
                                key={card.id}
                                deleteCardFunction={() => {
                                    deleteCardNovoCurso(card.id);
                                }}
                                onChange={(data) => handleChangeCardNovoCurso(card.id, data)}
                            />
                        ))}

                    <div className={`w-full justify-center flex`}>
                        <Button buttonType="primary" onClick={() => addCardCurso()}>
                            Adicionar formação
                        </Button>
                    </div>
                </div>

                {/* IDIOMAS */}
                <div className={`col-span-9 lg:col-span-10 py-2 p-2 pb-4 transition-opacity duration-300 h-[85vh] overflow-y-auto ${grupoAtivo == "idiomas" ? "" : "hidden"}`}>
                    {/* Mensagem de nenhum idioma adicionado */}
                    {dadosCardEditIdiomaAux.length === 0 && dadosCardNovoIdioma.length === 0 && (
                        <WarningMessage
                            title={"Nenhum idioma adicionado!"}
                            subTitle={"Utilize o botão abaixo para adicionar idiomas."}
                        />
                    )}

                    {/* Mensagem com dicas para duvidas sobre nivel */}
                    {(dadosCardEditIdiomaAux.length > 0 || dadosCardNovoIdioma.length > 0) && (
                        <Blockquote type="primary" className="mb-4">
                            <div className="flex">
                                <FontAwesomeIcon icon={faQuestionCircle} width="19" height="19" />
                                <span className="ml-2">
                                    Dúvidas sobre qual seu nível correto de idioma?
                                </span>

                                <TooltipComponent
                                    content={"A pessoa conhece as estruturas gramaticais e vocábulos mas não consegue manter um diálogo claro e objetivo."}
                                    asChild
                                    placement="bottom"
                                >
                                    <span className="ml-2 font-semibold hover:underline hover:cursor-pointer">
                                        Intermediário
                                    </span>
                                </TooltipComponent>

                                <TooltipComponent
                                    content={"A pessoa é capaz de expressar tudo o que pensa no idioma, porém tem dificuldades de verbalizar outro idioma."}
                                    asChild
                                >
                                    <span className="ml-2 font-semibold hover:underline hover:cursor-pointer" data-tooltip-id="help_avancado"                                    >
                                        Avançado
                                    </span>
                                </TooltipComponent>

                                <TooltipComponent
                                    content={"A pessoa consegue expressar tudo o que pensa no idioma com riqueza de vocabulario"}
                                    asChild
                                >
                                    <span className="ml-2 font-semibold hover:underline hover:cursor-pointer" data-tooltip-id="help_fluente">
                                        Fluente
                                    </span>
                                </TooltipComponent>
                            </div>
                        </Blockquote>
                    )}

                    {/* Cards salvos em banco */}
                    {dadosCardEditIdiomaAux.length > 0 &&
                        dadosCardEditIdiomaAux.map((card) => (
                            <CardEditIdioma
                                dados={card}
                                id={card.id}
                                key={card.id}
                                options={opcoesSelectIdioma}
                                deleteCardFunction={() => {
                                    deleteCardEditIdioma(card.cd_idioma);
                                }}
                                onChange={(data) => handleChangeCardEditIdioma(card.id, data)}
                            />
                        ))}

                    {/* Novos cards criados dinamicamente */}
                    {dadosCardNovoIdioma.length > 0 &&
                        dadosCardNovoIdioma.map((card) => (
                            <CardNovoIdioma
                                dados={card}
                                id={card.id}
                                key={card.id}
                                options={opcoesSelectIdioma}
                                deleteCardFunction={() => {
                                    deleteCardNovoIdioma(card.id);
                                }}
                                onChange={(data) => handleChangeCardNovoIdioma(card.id, data)}
                            />
                        ))}

                    <div className={`w-full justify-center flex`}>
                        <Button buttonType="primary" onClick={() => addCardIdioma()}>
                            Adicionar idioma
                        </Button>
                    </div>
                </div>

                {/* SOFTWARES */}
                <div className={`col-span-9 lg:col-span-10 py-2 p-2 pb-4 transition-opacity duration-300 h-[85vh] overflow-y-auto ${grupoAtivo == "softwares" ? "" : "hidden"}`}>
                    {/* Mensagem de nenhum software adicionado */}
                    {dadosCardEditSoftwareAux.length === 0 && dadosCardNovoSoftware.length === 0 && (
                        <WarningMessage title={"Nenhum software adicionado!"} subTitle={"Utilize o botão abaixo para adicionar softwares."}/>
                    )}

                    {/* Cards salvos em banco */}
                    {dadosCardEditSoftwareAux.length > 0 && dadosCardEditSoftwareAux.map((card) => (
                            <CardEditSoftware
                                id={card.id}
                                dados={card}
                                key={card.id}
                                options={opcoesSelectSoftware}
                                deleteCardFunction={() => {
                                    deleteCardEditSoftware(card.cd_conhecimento);
                                }}
                                onChange={(data) => handleChangeCardEditSoftware(card.id, data)}
                            />
                        ))}

                    {/* Novos cards criados dinamicamente */}
                    {dadosCardNovoSoftware.length > 0 && dadosCardNovoSoftware.map((card) => (
                            <CardNovoSoftware
                                id={card.id}
                                dados={card}
                                key={card.id}
                                options={opcoesSelectSoftware}
                                deleteCardFunction={() => {
                                    deleteCardNovoSoftware(card.id);
                                }}
                                onChange={(data) => handleChangeCardNovoSoftware(card.id, data)}
                            />
                        ))}

                    <div className={`w-full justify-center flex`}>
                        <Button buttonType="primary" onClick={() => addCardSoftware()}>
                            Adicionar software
                        </Button>
                    </div>
                </div>

                {/* COMPETENCIAS */}
                <div className={`col-span-9 lg:col-span-10 py-2 p-2 pb-4 transition-opacity duration-300 h-[85vh] overflow-y-auto ${grupoAtivo == "competencias" ? "" : "hidden"}`}>
                    {/* Mensagem de nenhuma competência adicionada */}
                    {dadosCardEditCompetenciaAux.length === 0 &&
                        dadosCardNovaCompetencia.length === 0 && (
                            <WarningMessage
                                title={"Nenhuma competência adicionada!"}
                                subTitle={"Utilize o botão abaixo para adicionar competências."}
                            />
                        )}

                    {/* Cards salvos em banco */}
                    {dadosCardEditCompetenciaAux.length > 0 &&
                        dadosCardEditCompetenciaAux.map((card) => (
                            <CardEditCompetencia
                                id={card.id}
                                dados={card}
                                key={card.id}
                                options={opcoesSelectCompetencia}
                                deleteCardFunction={() => {
                                    deleteCardEditCompetencia(card.cd_competencia);
                                }}
                                onChange={(data) => handleChangeCardEditCompetencia(card.id, data)}
                            />
                        ))}

                    {/* Novos cards criados dinamicamente */}
                    {dadosCardNovaCompetencia.length > 0 &&
                        dadosCardNovaCompetencia.map((card) => (
                            <CardNovaCompetencia
                                id={card.id}
                                dados={card}
                                key={card.id}
                                options={opcoesSelectCompetencia}
                                deleteCardFunction={() => {
                                    deleteCardNovaCompetencia(card.id);
                                }}
                                onChange={(data) => handleChangeCardNovaCompetencia(card.id, data)}
                            />
                        ))}

                    <div className={`w-full justify-center flex`}>
                        <Button buttonType="primary" onClick={() => addCardCompetencia()}>
                            Adicionar competência
                        </Button>
                    </div>
                </div>

                {/* CARGO */}
                <div className={`col-span-9 lg:col-span-10 py-2 p-2 pb-4 transition-opacity duration-300 h-[85vh] overflow-y-auto ${grupoAtivo == "cargo" ? "" : "hidden"}`}>
                    <div className="grid grid-cols-12 w-full gap-x-2 gap-y-5">
                        <div className="col-span-8">
                            <InputText
                                value={filtroCargo}
                                id={"filtro_cargos"}
                                label={"Digite o cargo desejado:"}
                                placeholder={"Ex.: Auxiliar administrativo"}
                                onChange={(id, value) => setFiltroCargo(value)}
                            />
                        </div>

                        {/* @db_field SIP_CANDIDATOS.VL_PRETENSAO_SALARIAL */}
                        <div className={"col-span-4"}>
                            <InputText
                                maxLength={9}
                                mask={"currency"}
                                placeholder={"0,00"}
                                id={"pretensao_salarial"}
                                label={"Pretensão salarial:"}
                                value={dadosCurriculo.pretensao_salarial}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        <div className="col-span-6 mt-2 mr-4">
                            <Subtitle>Selecione os cargos:</Subtitle>
                            <div className={"max-h-[340px] border-2 rounded-lg overflow-y-auto"}>
                                <ul className="w-full divide-y divide-gray-300 my-2">
                                    {/* Mensagem de nenhum cargo para listar */}
                                    {cargosAux.length === 0 && (
                                        <div className={"h-[320px] flex items-center"}>
                                            <WarningMessage
                                                iconSize={30}
                                                subTitle={"Nenhum cargo encontrado."}
                                                text={"Verifique os filtros e tente novamente."}
                                            />
                                        </div>
                                    )}

                                    {cargosAux.length > 0 &&
                                        cargosAux.map((cargoTmp) => (
                                            <li
                                                key={`cargo_item_${cargoTmp.CD_CARGO}`}
                                                className="py-2 mx-2 text-gray-900 hover:bg-blue-600 border-white hover:rounded-lg hover:text-white hover:cursor-pointer"
                                                onClick={() => {
                                                    selecionaCargo(cargoTmp.CD_CARGO);
                                                }}
                                            >
                                                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                                    <div className="flex min-w-0 w-full">
                                                        <span className="text-sm font-medium truncate pl-4 w-full">
                                                            {cargoTmp.NM_CARGO}
                                                        </span>
                                                        <div className={"mr-4"}>
                                                            <FontAwesomeIcon
                                                                icon={faArrowRight}
                                                                width="14"
                                                                height="14"
                                                                color="white"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </div>
                        <div className="col-span-6 mt-2">
                            <div className="flex justify-between mr-4">
                                <Subtitle>Cargos selecionados:</Subtitle>
                                <Subtitle>Experiência (anos):</Subtitle>
                            </div>
                            <div
                                className={`${cargosSelecionados.length === 0 ? "" : "h-[292px]"
                                    } border-2 rounded-lg overflow-y-auto`}
                            >
                                <ul className="w-full">
                                    {/* Mensagem de nenhum cargo selecionado */}
                                    {cargosSelecionados.length === 0 && (
                                        <div className={"h-[336px] flex items-center"}>
                                            <WarningMessage
                                                iconSize={30}
                                                subTitle={"Nenhum cargo selecionado."}
                                                text={"Selecione um cargo no campo ao lado."}
                                            />
                                        </div>
                                    )}

                                    {cargosSelecionados.length > 0 &&
                                        cargosSelecionados.map((cargoTmp, index) => (
                                            <li
                                                key={`cargo_selecionado_${cargoTmp.CD_CARGO}`}
                                                className={`py-2 text-gray-900 h-[48px] border-b ${index % 2 === 0 ? "" : "bg-blue-50"
                                                    }`}
                                            >
                                                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                                    <div className="flex min-w-0 w-full items-center">
                                                        <label
                                                            htmlFor={`nr_experiencia_${cargoTmp.CD_CARGO}`}
                                                            className="text-sm font-medium truncate pl-4 w-full"
                                                        >
                                                            {cargoTmp.NM_CARGO}
                                                        </label>
                                                        <div className={"mr-4"}>
                                                            <InputNumber
                                                                min="0"
                                                                small={true}
                                                                className={"!w-[70px]"}
                                                                value={
                                                                    cargoTmp?.NR_EXPERIENCIA || 0
                                                                }
                                                                id={`nr_experiencia_${cargoTmp.CD_CARGO}`}
                                                                onChange={(id, value) =>
                                                                    atualizaExperienciaCargo(
                                                                        cargoTmp.CD_CARGO,
                                                                        value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <TooltipComponent
                                                            content={"Remover cargo"}
                                                            asChild
                                                        >
                                                            <div
                                                                className={
                                                                    "mr-4 text-blue-600 hover:text-red-500 hover:cursor-pointer"
                                                                }
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={faTimesCircle}
                                                                    width="26"
                                                                    height="26"
                                                                    onClick={() => {
                                                                        removeCargo(
                                                                            cargoTmp.CD_CARGO
                                                                        );
                                                                    }}
                                                                />
                                                            </div>
                                                        </TooltipComponent>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                </ul>
                            </div>

                            {cargosSelecionados.length > 0 && (
                                <div className={"flex justify-center mt-3"}>
                                    <Button
                                        buttonType="danger"
                                        onClick={() => {
                                            removeTodosCargos();
                                        }}
                                    >
                                        Remover todos o cargos selecionados
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="col-span-12 mt-2">
                            <Fieldset label="Turnos pretendidos">
                                <div
                                    className={cn(
                                        "grid gap-2 w-full",
                                        "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
                                        "px-2"
                                    )}
                                >
                                    {/* @db_field SIP_CANDIDATOS.ID_TURNO_NORMAL */}
                                    <ButtonToggle
                                        primary
                                        label="Normal"
                                        required={validaDadosPessoais}
                                        id="id_turno_normal"
                                        checked={dadosCurriculo.id_turno_normal}
                                        onChange={(id, value, checked) =>
                                            setDadosCurriculoCallback(id, checked)
                                        }
                                        className="w-full justify-center"
                                    />

                                    {/* @db_field SIP_CANDIDATOS.ID_TURNO_MATUTINO */}
                                    <ButtonToggle
                                        primary
                                        label="Manhã"
                                        required={validaDadosPessoais}
                                        id="id_turno_matutino"
                                        checked={dadosCurriculo.id_turno_matutino}
                                        onChange={(id, value, checked) =>
                                            setDadosCurriculoCallback(id, checked)
                                        }
                                        className="w-full justify-center"
                                    />

                                    {/* @db_field SIP_CANDIDATOS.ID_TURNO_VESPERTINO */}
                                    <ButtonToggle
                                        primary
                                        label="Tarde"
                                        required={validaDadosPessoais}
                                        id="id_turno_vespertino"
                                        checked={dadosCurriculo.id_turno_vespertino}
                                        onChange={(id, value, checked) =>
                                            setDadosCurriculoCallback(id, checked)
                                        }
                                        className="w-full justify-center"
                                    />

                                    {/* @db_field SIP_CANDIDATOS.ID_TURNO_NOTURNO */}
                                    <ButtonToggle
                                        primary
                                        label="Noite"
                                        required={validaDadosPessoais}
                                        id="id_turno_noturno"
                                        checked={dadosCurriculo.id_turno_noturno}
                                        onChange={(id, value, checked) =>
                                            setDadosCurriculoCallback(id, checked)
                                        }
                                        className="w-full justify-center"
                                    />

                                    {/* @db_field SIP_CANDIDATOS.ID_REVEZAMENTO */}
                                    <ButtonToggle
                                        primary
                                        label="Revezamento"
                                        id="id_revezamento"
                                        required={validaDadosPessoais}
                                        checked={dadosCurriculo.id_revezamento}
                                        onChange={(id, value, checked) =>
                                            setDadosCurriculoCallback(id, checked)
                                        }
                                        className="w-full justify-center"
                                    />
                                </div>
                            </Fieldset>
                        </div>
                    </div>
                </div>

                {/* {ACESSO} */}
                <div className={`col-span-9 lg:col-span-10 py-2 p-2 pb-4 transition-opacity duration-300 h-[85vh] overflow-y-auto ${grupoAtivo == "acesso" ? "" : "hidden"}`}>
                    {/* Mensagem sobre tamanho da senha */}
                    <Blockquote type="primary">
                        <div className="flex">
                            <FontAwesomeIcon icon={faQuestionCircle} width="19" height="19" />
                            <span className="ml-2">
                                A senha de acesso ao sistema deve ter entre 6 e 10 dígitos.
                            </span>
                        </div>
                    </Blockquote>

                    <div className="grid grid-cols-12 w-full gap-x-2 gap-y-5">
                        <div className="lg:col-span-6 col-span-12 mt-2">
                            {/* @db_field SIP_CANDIDATOS.NM_SENHA_WEB */}
                            {active && (
                                <InputPassword
                                    maxLength={10}
                                    label={"Senha:"}
                                    id={"nm_senha_web"}
                                    required={true}
                                    value={dadosCurriculo.nm_senha_web}
                                    onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                                    showTogglePassword={false}
                                /> 
                            )}

                            {dadosCurriculo.nm_senha_web.length > 0 && !tamanhoSenhaValido && (
                                <div className="col-span-12 text-xs text-red-600 font-semibold">
                                    A senha deve possuir ao menos 6 dígitos!
                                </div>
                            )}
                        </div>
                        <div className="col-span-6 mt-2 hidden lg:block"></div>
                        <div className="lg:col-span-6 col-span-12 mt-2">
                            {active &&( 
                                <InputPassword
                                    maxLength={10}
                                    required={true}
                                    label={"Confirma senha:"}
                                    id={"nm_confirma_senha_web"}
                                    value={dadosCurriculo.nm_confirma_senha_web}
                                    onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                                    showTogglePassword={false}
                                /> 
                            )}

                            {!senhasConferem && (
                                <div className="col-span-12 text-xs text-red-600 font-semibold">
                                    A confirmação está diferente da senha!
                                </div>
                            )}
                        </div>
                        <div className="col-span-6 mt-2 hidden lg:block"></div>
                        <div className="lg:col-span-6 col-span-12 mt-2">
                            <InputText
                                required={true}
                                label={"Lembrete de senha:"}
                                id={"ds_lembrete_senha_web"}
                                value={dadosCurriculo.ds_lembrete_senha_web}
                                onChange={(id, value) => setDadosCurriculoCallback(id, value)}
                            />
                        </div>

                        {!lembreteSenhaValido && (
                            <div className="col-span-12 text-xs text-red-600 font-semibold">
                                O lembrete não pode conter a sua senha!
                            </div>
                        )}
                    </div>
                </div>

                {/* EXPERIENCIA */}
                <div className={`col-span-9 lg:col-span-10 py-2 p-2 pb-4 transition-opacity duration-300 h-[85vh] overflow-y-auto ${grupoAtivo == "experiencia" ? "" : "hidden"}`}>
                    <div className="w-full">
                        {/* @db_field SIP_CANDIDATOS.DS_EXPERIENCIA_PROFISSIONAL */}
                        <RichText
                            height={400}
                            id="ds_experiencia_profissional"
                            value={dadosCurriculo.ds_experiencia_profissional}
                            onChange={(id, checked) => setDadosCurriculoCallback(id, checked)}
                        />
                    </div>
                </div>

                {/* LAUDO */}
                <div className={`col-span-9 lg:col-span-10 py-2 p-2 pb-4 transition-opacity duration-300 h-[85vh] overflow-y-auto ${grupoAtivo == "laudo" ? "" : "hidden"}`}>
                    <div className="w-full">
                        {/* @db_field SIP_CANDIDATOS_LAUDO.DS_LAUDO */}
                        <RichText
                            height={400}
                            id="ds_laudo"
                            value={dadosCurriculo.ds_laudo}
                            onChange={(id, checked) => setDadosCurriculoCallback(id, checked)}
                        />
                    </div>
                </div>

                {/* PARECER */}
                <div className={`col-span-9 lg:col-span-10 py-2 p-2 pb-4 transition-opacity duration-300 h-[85vh] overflow-y-auto ${grupoAtivo == "parecer" ? "" : "hidden"}`}>
                    <div className="w-full">
                        <ParecerCandidato cdPessoa={cdPessoa} />
                    </div>
                </div>

                {/* Botão de salvar flutuante */}
                <FabSave
                    className={"fixed bottom-[20px] right-[20px]"}
                    onClick={() => {
                        handleSaveButton();
                    }}
                />
            </div>

            <AddGrupoCandidato
                showDialog={showDialogGrupoCand}
                nmPessoa={dadosCurriculo.nm_pessoa}
                cdPessoaCandidato={cdPessoaCandidato}
                setDialogControl={setShowDialogGrupoCand}
                confirmActionCallback={(cdGrupo, description) => {
                    incluirGrupoCandidato(cdGrupo, description);
                }}
            />

            <ModalGrid
                id="modal_buscar_cep"
                setModalControl={setShowModalBuscarCEP}
                modalControl={showModalBuscarCEP}
                closeModalCallback={handleShowBuscarCEP}
                size="md"
                height="h-fit"
                contentClass={"h-full"}
                title={"Buscar CEP"}
                footerClass="justify-end gap-x-2"
                btnCancel={"Cancelar"}
            >
                <BuscarCEP
                    cdUfCandidato={dadosCurriculo.cd_uf}
                    cepSelecionadoCallBack={handleSetCEPSelecionado}
                />
            </ModalGrid>

            <ModalGrid
                id="modal_update_ds_foto_candidato"
                modalControl={modalUpdateProfilePicture}
                setModalControl={setModalUpdateProfilePicture}
                closeModalCallback={cancelUpdateProfilePicture}
                submitCallBack={handleUpdateProfilePicture}
                size="lg"
                title={"Atualizar Foto"}
                btnSubmit={"Salvar"}
                btnCancel={"Cancelar"}
                footerClass="justify-end gap-x-2"
            >
                <div className="h-full">
                    <ProfilePicture init={modalUpdateProfilePicture} onChange={(id, file) => { setFormUpdateProfilePicture(prevState => ({ ...prevState, ds_foto_candidato: file })); }} />
                </div>
            </ModalGrid>
        </div>
    );
};

export default Curriculo;
