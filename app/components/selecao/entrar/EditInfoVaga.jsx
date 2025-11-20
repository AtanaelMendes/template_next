import { useCallback, useEffect, useState } from 'react'
import { empty, unmaskTelefone, validateForm } from '@/assets/utils.js'
import Button from '@/components/buttons/Button'
import ButtonToggle from '@/components/buttons/ButtonToggle'
import { FabSave } from '@/components/buttons/FloatActionButton'
import PillsBadge from '@/components/buttons/PillsBadge'
import AtualizaCargoCliente from '@/components/cargos/AtualizaCargoCliente'
import CentroDeCustoList from '@/components/centroDeCusto/CentroDeCustoList'
import { DebouncedSearch } from '@/components/inputs/DebouncedSearch'
import Fieldset from '@/components/inputs/Fieldset'
import InputDate from '@/components/inputs/InputDate'
import InputNumber from '@/components/inputs/InputNumber'
import InputText from '@/components/inputs/InputText'
import InputTextArea from '@/components/inputs/InputTextArea'
import Radio from '@/components/inputs/Radio'
import RangeSlider from '@/components/inputs/RangeSlider'
import Select from '@/components/inputs/Select'
import Blockquote from '@/components/Layouts/Blockquote'
import Loading from '@/components/Layouts/Loading'
import MiniSidebar from '@/components/Layouts/MiniSidebar'
import ModalGrid from '@/components/Layouts/ModalGrid'
import Confirm from '@/components/Layouts/Confirm'
import TurnosList from '@/components/turnos/TurnosList'
import { useAppContext } from '@/context/AppContext'
import axiosInstance from '@/plugins/axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { add, format } from 'date-fns'
import { DivulgaRedesSociais } from './DivulgaRedesSociais'
import {
    faBrazilianRealSign, faBriefcase,
    faClock, faComment,
    faEdit, faGlobe,
    faHandHoldingDollar, faHandHoldingHeart,
    faHome, faListCheck,
    faPeopleGroup, faReceipt,
    faShare, faTrash,
    faTriangleExclamation, faUserEdit,
    faUserTie, faX, faXmarksLines, faInfoCircle
} from '@fortawesome/free-solid-svg-icons'
import SelectEstado from '@/components/inputs/SelectEstado'
import SelectCidade from '@/components/inputs/SelectCidade'

// TODO: SEPARAR EM PASTA E ARQUIVOS DIFERENTES PARA CADA TAB
const EditInfoVaga = ({
	init,
	nrVaga,
	defaultTab,
	nrRequisicao,
	analistaVaga,
	detalhesVaga,
	onEditCallback,
	renderizadoPorGerencial,
	isVagaExperidada,
	onlyTabs,
	...props
}) => {
	const [updateInsalubridadePericulosidadeReady, setUpdateInsalubridadePericulosidadeReady] = useState(false);
	const [formRequisitanteVaga, setFormRequisitanteVaga] = useState({ nm_requisitante: '', nr_vaga: ''});
	const [confirmarDelecaoTelefoneAnalista, setConfirmarDelecaoTelefoneAnalista] = useState(false);
	const [amanha, setAmanha] = useState(add(new Date(), { days: 1 }).toISOString().split('T')[0]);
	const [divulgaAutoatendimentoReady, setDivulgaAutoatendimentoReady] = useState(false);
	const [dadosDivulgaAutoatendimento, setDadosDivulgaAutoatendimento] = useState([]);
	const [updateTipoVagaRecSelReady, setUpdateTipoVagaRecSelReady] = useState(false);
	const [atualizaRequisitanteReady, setAtualizaRequisitanteReady] = useState(false);
	const [dadosVagaRequisicaoVagaWeb, setDadosVagaRequisicaoVagaWeb] = useState([]);
	const [tabControl, setTabControl] = useState(defaultTab || 'tab_descricao_vaga');
	const [updateCentroDeCustoReady, setUpdateCentroDeCustoReady] = useState(false);
	const [atualizaFaturamentoReady, setAtualizaFaturamentoReady] = useState(false);
	const [updateCargoSalarioReady, setUpdateCargoSalarioReady] = useState(false);
	const [motivosCancelamentoData, setMotivosCancelamentoData] = useState([]);
	const [unidadesAutoatendimento, setunidadesAutoatendimento] = useState([]);
	const [faturamentoFechamento, setFaturamentoFechamento] = useState(null);
	const [dataFaturamentoValida, setDataFaturamentoValida] = useState(true);
	const [updateDescricaoReady, setUpdateDescricaoReady] = useState(false);
	const [dadosRequisitanteVaga, setDadosRequisitanteVaga] = useState([]);
	const [updateNrPedidoReady, setUpdateNrPedidoReady] = useState(false);
	const [updateSituacaoReady, setUpdateSitucaoReady] = useState(false);
	const [editCentroDeCusto, setEditCentroDeCusto] = useState(false);
	const [updateTurnoReady, setUpdateTurnoReady] = useState(false);
	const [updateSetorReady, setUpdateSetorReady] = useState(false);
	const [exibeAlteraCargo, setExibeAlteraCargo] = useState(false);
	const [divulgaWebReady, setDivulgaWebReady] = useState(false);
	const [beneficiosReady, setbeneficiosReady] = useState(false);
	const [cdUfVaga, setCdUfVaga] = useState('');
	const [nmCidadeVaga, setNmCidadeVaga] = useState('');
	const [dadosFaturameto, setDadosFaturameto] = useState([]);
	const [dadosDivulgaWeb, setDadosDivulgaWeb] = useState([]);
	const [dropsLocalVisivel, setDropsLocalVisivel] = useState(false);
	const [trocaSituacao, setTrocaSituacao] = useState(true);
	const [isVagaCongelada, setIsVagaCongelada] = useState(true);
	const [confirmarCancelamentoCongelada, setConfirmarCancelamentoCongelada] = useState(false);
	const [editTurno, setEditTurno] = useState(false);
	const [statusOptions, setStatusOptions] = useState([]);
	const { toast, user, sendWebSocketMessage } = useAppContext();
	const [tabs, setTabs] = useState([
		{
			id: 'tab_descricao_vaga',
			label: 'Descrição da vaga',
			className: '',
			hoverClassName: 'hover:bg-gray-200',
			icon: faComment,
		},
		{
			id: 'tab_cargo_salario',
			label: 'Cargo/Salário',
			className: '',
			hoverClassName: 'hover:bg-gray-200',
			icon: faBrazilianRealSign,
		},
		{
			id: 'tab_expediente',
			label: 'Horário',
			className: '',
			hoverClassName: 'hover:bg-gray-200',
			icon: faClock,
		},
		{
			id: 'tab_centro_de_custo',
			label: 'Centro de custo',
			className: '',
			hoverClassName: 'hover:bg-gray-200',
			icon: faHandHoldingDollar,
		},
		{
			id: 'tab_analista',
			label: 'Analista',
			className: '',
			hoverClassName: 'hover:bg-gray-200',
			icon: faUserTie,
		},
		{
			id: 'tab_insalubridade_periculosidade',
			label: 'Insalubridade/Periculosidade',
			className: '',
			hoverClassName: 'hover:bg-gray-200',
			icon: faTriangleExclamation,
		},
		{
			id: 'tab_nr_pedido',
			label: 'N° Pedido',
			className: '',
			hoverClassName: 'hover:bg-gray-200',
			icon: faXmarksLines,
		},
		{
			id: 'tab_requisitante_vaga',
			label: 'Requisitante',
			className: '',
			hoverClassName: 'hover:bg-gray-200',
			icon: faUserEdit,
		},
		{
			id: 'tab_setor',
			label: 'Setor',
			className: '',
			hoverClassName: 'hover:bg-gray-200',
			icon: faBriefcase,
		},
		{
			id: 'tab_divulga_web',
			label: 'Divulga Web',
			className: '',
			hoverClassName: 'hover:bg-gray-200',
			icon: faGlobe,
		},
		{
			id: 'tab_divulga_redessociais',
			label: 'Divulgar Redes Sociais',
			className: '',
			hoverClassName: 'hover:bg-gray-200',
			icon: faShare,
		},
		{
			id: 'tab_divulga_autoatendimento',
			label: 'Divulga Autoatendimento',
			className: '',
			hoverClassName: 'hover:bg-gray-200',
			icon: faHome,
		},
		{
			id: 'tab_beneficios',
			label: 'Benefícios',
			className: '',
			hoverClassName: 'hover:bg-gray-200',
			icon: faHandHoldingHeart,
		},
		{
			id: 'tab_recrutamento',
			label: 'Recrutamento',
			className: '',
			hoverClassName: 'hover:bg-gray-200',
			icon: faPeopleGroup,
		},
		{
			id: 'tab_situacao_vaga',
			label: 'Situação da vaga',
			className: '',
			hoverClassName: 'hover:bg-gray-200',
			icon: faListCheck,
		},
	]);
	const [formFaturamento, setFormFaturamento] = useState({
		nr_vaga: '',
		dt_faturamento: '',
		pc_faturamento: 0,
		pc_adiantamento: 0,
		dt_adiantamento: '',
		pc_encaminhamento: 0,
		dt_encaminhamento: ''
	});
	const [formDivulgaVagaWeb, setFormDivulgaVagaWeb] = useState({
		id_libera_internet: false,
		id_divulga_redes_sociais: false,
		id_local_trabalho: '',
		envia_email_alteracoes: false,
		replica_descricao: true,
		qt_candidatos_vaga_web: 100,
		ds_observacao_internet: '',
		ds_requisitos_internet: '',
		ds_atividades_internet: '',
		cd_uf_atuacao: '',
		nm_cidade_atuacao: '',
		nr_requisicao: '',
		cd_pessoa_analista: '',
		nm_pessoa_analista: '',
		dt_email_divulgacao_internet: '',
		dt_libera_internet: '',
		dt_retira_internet: '',
		nr_vaga: nrVaga,
	});
	const [formBeneficios, setFormBeneficios] = useState({
		nr_requisicao: '',
		nr_vaga: '',
		id_alimentacao: false,
		ds_obs_alimentacao: '',
		id_transporte: 'N',
		ds_obs_transporte: 'N',
		id_desconto: 'N',
		id_plano_saude: false,
		ds_obs_plano_saude: '',
		id_plano_odontologico: false,
		ds_obs_plano_odontologico: '',
		id_previdencia_privada: false,
		id_auxilio_creche: false,
		id_bolsa_estudo: false,
		id_farmacia: false,
		ds_obs_farmacia: '',
		id_vale_refeicao: false,
		ds_obs_vale_refeicao: '',
		id_cesta_basica: false,
		ds_obs_cesta_basica: '',
		id_seguro_vida: false,
		ds_obs_seguro_vida: '',
		id_possui_ppr: false,
		ds_obs_quotas_ppr: '',
		ds_obs_outros_beneficios: '',
	});
	const [formDivulgaAutoatendimento, setformDivulgaAutoatendimento] = useState({
		nr_requisicao: nrRequisicao,
		nr_vaga: nrVaga,
		cd_unidade_autoatendimento: 'N',
		replica_descricao: false,
	});
	const [formLocalAtuacao, setformLocalAtuacao] = useState([
		{
			id: 'cidade_cliente',
			checked: true,
		},
		{
			id: 'local_atuacao',
			checked: false,
		},
	]);
	const [formValidate, setformValidate] = useState({
		ds_observacao_internet: {
			error: false,
			errorMsg: 'Descrição da vaga Min. de 20 caracteres!',
			dependsOn: ['id_libera_internet|bool:true'],
		},
		qt_candidatos_vaga_web: {
			error: false,
			errorMsg: 'Quantidade de candidatos deve ser maior que 0',
			dependsOn: ['id_libera_internet|bool:true'],
		},
		ds_requisitos_internet: {
			error: false,
			errorMsg: 'Requisitos da vaga. Min. de 20 caracteres',
			dependsOn: ['id_divulga_redes_sociais|bool:true'],
		},
		ds_atividades_internet: {
			error: false,
			errorMsg: 'Atividade da vaga. Min. de 20 caracteres',
			dependsOn: ['id_divulga_redes_sociais|bool:true'],
		},
		cd_uf_atuacao: {
			error: false,
			errorMsg: 'Informe o estado de atuação',
			dependsOn: ['id_local_trabalho|string:"L"'],
		},
		nm_cidade_atuacao: {
			error: false,
			errorMsg: 'Informe a cidade de atuação',
			dependsOn: ['id_local_trabalho|string:"L"'],
		},
	});
	const [formCargoSalario, setFormCargoSalario] = useState({
		nr_vaga: '',
		cd_empresa: '',
		vl_salario: '',
		id_salario: '',
		nm_cargo_cliente: '',
		cd_cargo_cliente: '',
	});
	const [formDescricaoVaga, setFormDescricaoVaga] = useState({
		nr_vaga:'',
		nr_requisicao: '',
		ds_observacoes: '',
	});
	const [formTurno, setFormTurno] = useState({
		nr_vaga: nrVaga,
		nm_turno: '',
		cd_turno: '',
	});
	const [formCentroDeCusto, setFormCentroDeCusto] = useState({
		nr_vaga: nrVaga,
		nm_centro_custo: '',
		cd_centro_custo: '',
	});
	const [formInsalubridadePericulosidade, setformInsalubridadePericulosidade] = useState({
		nr_vaga: nrVaga,
		id_insalubridade: 'N',
		id_periculosidade: 'N',
		vl_insalubridade: 0,
		vl_periculosidade: 0,
	});
	const [formNrPedido, setFormNrPedido] = useState({
		nr_vaga: nrVaga,
		nr_pedido_cliente: '',
	});
	const [formSetor, setFormSetor] = useState({
		nr_vaga: nrVaga,
		ds_area: '',
	});
	const [formTipoVagaRecSel, setFormTipoVagaRecSel] = useState({
		nr_vaga: nrVaga,
		nr_requisicao: nrRequisicao,
		id_recrutamento: '',
	});
	const [formSituacaoVaga, setFormSituacaoVaga] = useState({
		nr_vaga: nrVaga,
		nr_requisicao: nrRequisicao,
		nm_apelido: '',
		cd_pessoa_session: user.cd_sip,
		cd_usuario_session: user.user_sip,
		cd_empresa: '',
		cd_pessoa_cliente: '',
		cd_situacao_vaga: '',
		cd_situacao_vaga_old: '',
		ds_situacao_vaga: '',
		replica_alteracao: 'N',
		cd_motivo_cancelamento: '',
		ds_motivo_cancelamento: '',
		dt_faturamento: '',
		cd_qualificacao_cargo: '',
        cd_tipo_contratacao: '',
        justifica_cancelamento_vaga_old: 'N',
        ds_justifica_cancelamento_vaga_old: '',
        justifica_cancelamento_vaga: 'N',
        ds_justifica_cancelamento_vaga: '',
        situacao_mutavel: detalhesVaga.PERMITE_ATUALIZAR?.atualiza,
	});
	const [formAnalista, setFormAnalista] = useState({
		cd_pessoa_analista: '',
		nr_telefone_analista: '',
	});

	const getProximoDomingo = (dataAtual = new Date()) => {
		const diaSemana = dataAtual.getUTCDay(); // 0 = domingo, ..., 6 = sábado
		const diasAteDomingo = 7 - diaSemana;
		const proximoDomingo = new Date(dataAtual);
		proximoDomingo.setUTCDate(proximoDomingo.getUTCDate() + diasAteDomingo);
		return proximoDomingo.toISOString().split('T')[0];
	};

	const reloadDetalhesVaga = () => {
		if (typeof onEditCallback === 'function') {
			onEditCallback()
		}
	}

	const getMotivosCancelamento = () => {
		if (!empty(motivosCancelamentoData)) {
			return
		}
		axiosInstance
			.get(`vaga/motivos-cancelamento-vaga-list`)
			.then(function (response) {
				setMotivosCancelamentoData(response.data)
			})
			.catch(function (resp) {
				console.error(resp)
				let error = resp?.response?.data?.error

				if (Array.isArray(error)) {
					return toast.error(error.join(' ') || 'OOps ocorreu um erro ao buscar os motivos de cancelamento')
				}
				return toast.error(error || 'OOps ocorreu um erro ao buscar os motivos de cancelamento')
			});
	}

	const getDadosDivulgaWeb = () => {
		axiosInstance
			.get(`vaga/dados-vaga/${nrVaga}`)
			.then(function (response) {
				setDadosDivulgaWeb(response.data)
			})
			.catch(function (resp) {
				console.error(resp)
				let error = resp?.response?.data?.error

				if (Array.isArray(error)) {
					return toast.error(error.join(' ') || 'OOps ocorreu um erro ao buscar os dados de divulga WEB')
				}
				return toast.error(error || 'OOps ocorreu um erro ao buscar os dados de divulga WEB')
			})
	}

	function getBeneficiosRequisicaoVagaWeb() {
		axiosInstance
			.get(`vaga/beneficios-requisicao-vaga-web/${nrRequisicao}`)
			.then(function (response) {
				if(!response.data){
					setDadosVagaRequisicaoVagaWeb([])
					return toast.info("Ainda não há benefícios cadastrados para esta vaga");
				}
				setDadosVagaRequisicaoVagaWeb(response.data)
			})
			.catch(function (resp) {
				console.error(resp)
				let error = resp?.response?.data?.error

				if (Array.isArray(error)) {
					return toast.error(
						error.join(' ') || 'OOps ocorreu um erro ao buscar os dados da requisicao vaga WEB'
					)
				}
				return toast.error(error || 'OOps ocorreu um erro ao buscar os dados da requisicao vaga WEB')
			})
	}

	function getDadosDivulgaAutoatendimento() {
		axiosInstance
			.get(`vaga/dados-autoatendimento/${nrVaga}`)
			.then(function (response) {
				setDadosDivulgaAutoatendimento(response.data)
			})
			.catch(function (resp) {
				console.error(resp)
				let error = resp?.response?.data?.error

				if (Array.isArray(error)) {
					return toast.error(
						error.join(' ') || 'OOps ocorreu um erro ao buscar os dados de autoatendimento'
					)
				}
				return toast.error(error || 'OOps ocorreu um erro ao buscar os dados de autoatendimento')
			})
	}

	function getUnidadesAutoatendimento() {
		axiosInstance
			.get(`vaga/unidades-autoatendimento`)
			.then(function (response) {
				setunidadesAutoatendimento(response.data)
			})
			.catch(function (resp) {
				let error = resp?.response?.data?.error

				if (Array.isArray(error)) {
					return toast.error(
						error.join(' ') || 'OOps ocorreu um erro ao buscar as unidades autoatendimento'
					)
				}
				return toast.error(error || 'OOps ocorreu um erro ao buscar as unidades autoatendimento')
			})
	}

	function getDadosRequisitanteVaga() {
		setAtualizaRequisitanteReady(false)
		axiosInstance
			.get(`vaga/requisitante-vaga/${nrVaga}`)
			.then(function (response) {
				setAtualizaRequisitanteReady(true)
				setDadosRequisitanteVaga(response.data)
			})
			.catch(function (resp) {
				setAtualizaRequisitanteReady(true)
				console.error(resp)
				let error = resp?.response?.data?.error

				if (Array.isArray(error)) {
					return toast.error(
						error.join(' ') || 'OOps ocorreu um erro ao buscar os dados do requisitante'
					)
				}
				return toast.error(error || 'OOps ocorreu um erro ao buscar os dados do requisitante')
			})
	}

	function getDadosFaturamento() {
		axiosInstance
			.get(`vaga/dados-faturamento/${nrVaga}`)
			.then(function (response) {
				setDadosFaturameto(response.data)
			})
			.catch(function (resp) {
				console.error(resp)
				let error = resp?.response?.data?.error

				if (Array.isArray(error)) {
					return toast.error(
						error.join(' ') || 'OOps ocorreu um erro ao buscar dados do faturamento'
					)
				}
				return toast.error(error || 'OOps ocorreu um erro ao buscar dados do faturamento')
			})
	}

	function updateCargoSalario() {
		if (hasDetalheChangedSinceStart(formCargoSalario)) {
			setUpdateCargoSalarioReady(false)
			axiosInstance
				.post(`vaga/atualiza-cargo-salario`, formCargoSalario)
				.then(function (response) {
					setUpdateCargoSalarioReady(true)
					if (response.status === 200) {
						reloadDetalhesVaga()
						toast.success('Cargo/Salário atualizado com sucesso')
					}
				})
				.catch(function (resp) {
					setUpdateCargoSalarioReady(true)
					let error = resp?.response?.data?.error
					if (Array.isArray(error)) {
						return toast.error(
							error.join(' ') || 'OOps ocorreu um erro ao atualizar o Cargo/Salário'
						)
					}
					return toast.error(error || 'OOps ocorreu um erro ao atualizar o Cargo/Salário')
				})
		} else {
			toast.info("Não há dados para atualizar");
		}
	}

	function updateSetor() {
		if (hasDetalheChangedSinceStart(formSetor)) {
			setUpdateSetorReady(false)
			axiosInstance
				.put(`vaga/setor-vaga`, formSetor)
				.then(function (response) {
					setUpdateSetorReady(true)
					if (response.status === 200) {
						reloadDetalhesVaga()
						toast.success('Setor atualizado com sucesso')
					}
				})
				.catch(function (resp) {
					setUpdateSetorReady(true)
					let error = resp?.response?.data?.error
					if (Array.isArray(error)) {
						return toast.error(error.join(' ') || 'OOps ocorreu um erro ao atualizar o Setor')
					}
					return toast.error(error || 'OOps ocorreu um erro ao atualizar o Setor')
				})
		} else {
			toast.info("Não há dados para atualizar");
		}
	}

	function updateTipoVagaRecSel() {
		if (hasDetalheChangedSinceStart(formTipoVagaRecSel)) {
			setUpdateTipoVagaRecSelReady(false)
			axiosInstance
				.put(`vaga/tipo-vaga`, formTipoVagaRecSel)
				.then(function (response) {
					setUpdateTipoVagaRecSelReady(true)
					reloadDetalhesVaga()
					if (response.status === 200) {
						toast.success("Tipo vaga atualizado com sucesso");
					}
				}).catch(function (resp) {
					setUpdateTipoVagaRecSelReady(true)
					let error = resp?.response?.data?.error
					if (Array.isArray(error)) {
						return toast.error(error.join(' ') || 'OOps ocorreu um erro ao atualizar o tipo da vaga')
					}
					return toast.error(error || 'OOps ocorreu um erro ao atualizar o tipo da vaga')
				})
		} else {
			toast.info("Não há dados para atualizar");
		}
	}

	function updateNrPedido() {
		if (hasDetalheChangedSinceStart(formNrPedido)) {
			setUpdateNrPedidoReady(false)
			axiosInstance
				.put(`vaga/nr-pedido-vaga`, formNrPedido)
				.then(function (response) {
					setUpdateNrPedidoReady(true)
					reloadDetalhesVaga()
					if (response.status === 200) {
						toast.success("Nr. do pedido atualizado com sucesso");
					}
				})
				.catch(function (resp) {
					setUpdateNrPedidoReady(true)
					let error = resp?.response?.data?.error
					if (Array.isArray(error)) {
						return toast.error(
							error.join(' ') || 'OOps ocorreu um erro ao atualizar o Nr. do pedido'
						)
					}
					return toast.error(error || 'OOps ocorreu um erro ao atualizar o Nr. do pedido')
				})
		} else {
			toast.info("Não há dados para atualizar");
		}
	}
    
    async function disparaAtualizacoes()
    {
        let tiposAtualizacao = {
            'situacao': false,
            'justificativa': false,
        };

        const situacaoAlterada = formSituacaoVaga.cd_situacao_vaga !== formSituacaoVaga.cd_situacao_vaga_old;

        const justificativaAlterada = (formSituacaoVaga.justifica_cancelamento_vaga !== formSituacaoVaga.justifica_cancelamento_vaga_old
                || formSituacaoVaga.ds_justifica_cancelamento_vaga !== formSituacaoVaga.ds_justifica_cancelamento_vaga_old);

        if (formSituacaoVaga.situacao_mutavel) {
            tiposAtualizacao.justificativa = justificativaAlterada;
            tiposAtualizacao.situacao = situacaoAlterada;

            if (![5, 6, 9].includes(formSituacaoVaga.cd_situacao_vaga)) {
                setFormSituacaoVaga({
                    ...formSituacaoVaga,
                    justifica_cancelamento_vaga: "N",
                });
                tiposAtualizacao.justificativa = true;
            }
        } else if(justificativaAlterada) {
            tiposAtualizacao.justificativa = true;
        }

        let situacaoOk = false;

        if (tiposAtualizacao.situacao) {
            situacaoOk = await updateSituacaoVaga();
		}
		
		if (tiposAtualizacao.justificativa && situacaoOk) {
			updateJustificativaVaga();
		}

        setTimeout(() => {
            reloadDetalhesVaga();
        }, 500);
    }

	function updateJustificativaVaga() {
        axiosInstance
            .put(`vaga/justificativa-vaga`, formSituacaoVaga)
            .then(function (response) {
                return toast.success('Justificativa da vaga atualizada com sucesso.')
            })
            .catch(function (resp) {
                let error = resp?.response?.data?.error
                if (Array.isArray(error)) {
                    return toast.error(
                        error.join(' ') || 'OOps ocorreu um erro ao atualizar a justificativa da vaga'
                    )
                }
                return toast.error(error || 'OOps ocorreu um erro ao atualizar a justificativa da vaga')
            })
	}

	async function updateSituacaoVaga() {
		if (!hasDetalheChangedSinceStart(formSituacaoVaga)) {
			toast.info("Não há dados para atualizar");
			return false;
		}

		try {
			setUpdateSitucaoReady(false);
			await axiosInstance.put(`vaga/situacao-vaga`, formSituacaoVaga);
			toast.success('Situação da vaga atualizada com sucesso.');
			return true;
		} catch (resp) {
			let error = resp?.response?.data?.error;
			if (Array.isArray(error)) {
				toast.error(error.join(' ') || 'Ocorreu um erro ao atualizar a situação da vaga');
			} else {
				toast.error(error || 'Ocorreu um erro ao atualizar a situação da vaga');
			}
			return false;
		} finally {
			setUpdateSitucaoReady(true);
		}
	}

	function updateInsalubridadePericulosidade() {
		if (hasDetalheChangedSinceStart(formInsalubridadePericulosidade)) {
			setUpdateInsalubridadePericulosidadeReady(false)
			axiosInstance
				.put(`vaga/insalubridade-periculosidade-vaga`, formInsalubridadePericulosidade)
				.then(function (response) {
					setUpdateInsalubridadePericulosidadeReady(true)
					reloadDetalhesVaga()
					if (response.status === 200) {
						toast.success(
							"Insalubridade/Periculosidade atualizado com sucesso"
						);
					}
				})
				.catch(function (resp) {
					setUpdateInsalubridadePericulosidadeReady(true)
					let error = resp?.response?.data?.error
					if (Array.isArray(error)) {
						return toast.error(
							error.join(' ') || 'OOps ocorreu um erro ao atualizar Insalubridade/Periculosidade'
						)
					}
					return toast.error(
						error || 'OOps ocorreu um erro ao atualizar Insalubridade/Periculosidade'
					)
				})
		} else {
			toast.info("Não há dados para atualizar");
		}
	}

	function updateCentroDeCusto() {
		if (hasDetalheChangedSinceStart(formCentroDeCusto)) {
			setUpdateCentroDeCustoReady(false)
			axiosInstance
				.put(`centro-custo/atualiza-vaga`, formCentroDeCusto)
				.then(function (response) {
					setUpdateCentroDeCustoReady(true);
					reloadDetalhesVaga();
					toast.success("Centro de custo atualizado com sucesso.");
				})
				.catch(function (resp) {
					setUpdateCentroDeCustoReady(true)
					let error = resp?.response?.data?.error
					if (Array.isArray(error)) {
						return toast.error(
							error.join(' ') || 'OOps ocorreu um erro ao atualizar o centro de custo'
						)
					}
					return toast.error(error || 'OOps ocorreu um erro ao atualizar o centro de custo')
				})
		} else {
			toast.info("Não há dados para atualizar");
		}
	}

	function updateDescricaoVaga() {
		if (hasDetalheChangedSinceStart(formDescricaoVaga)) {
			setUpdateDescricaoReady(false)
			axiosInstance
				.put(`vaga/descricao-vaga`, formDescricaoVaga)
				.then(function (response) {
					toast.success('Descrição atualizada com sucesso')
					setUpdateDescricaoReady(true)
					reloadDetalhesVaga()
				})
				.catch(function (resp) {
					setUpdateDescricaoReady(true)
					let error = resp?.response?.data?.error
					if (Array.isArray(error)) {
						return toast.error(error.join(' ') || 'OOps ocorreu um erro ao atualizar a descrição')
					}
					return toast.error(error || 'OOps ocorreu um erro ao atualizar a descrição')
				})
		} else {
			toast.info("Não há dados para atualizar");
		}
	}

	function updateTurnoVaga() {
		if (hasDetalheChangedSinceStart(formTurno)) {
			setUpdateTurnoReady(false)
			axiosInstance
				.put(`vaga/turno-vaga`, formTurno)
				.then(function (response) {
					setUpdateTurnoReady(true)
					reloadDetalhesVaga()
					if (response.status === 200) {
						toast.success("Turno atualizado com sucesso");
					}
				})
				.catch(function (resp) {
					setUpdateTurnoReady(true)
					let error = resp?.response?.data?.error
					if (Array.isArray(error)) {
						return toast.error(error.join(' ') || 'OOps ocorreu um erro ao atualizar o turno')
					}
					return toast.error(error || 'OOps ocorreu um erro ao atualizar o turno')
				})
		} else {
			toast.info("Não há dados para atualizar");
		}
	}

	function divulgaVagaWeb() {
		if (validateForm(formValidate, setformValidate, formDivulgaVagaWeb, toast)) return

		if (hasDetalheChangedSinceStart(formDivulgaVagaWeb)) {
			axiosInstance
				.post(`vaga/divulga-vaga-web`, formDivulgaVagaWeb)
				.then(function (response) {
					reloadDetalhesVaga()
					if (response.status === 200) {
						return toast.success("Informações de divulga WEB atualizadas com sucesso");
					}
				}).catch(function (resp) {
					console.error(resp)
					let error = resp?.response?.data?.error

					if (Array.isArray(error)) {
						return toast.error(
							error.join(' ') || 'OOps ocorreu um erro ao atualizar os dados divulga web'
						)
					}
					return toast.error(error || 'OOps ocorreu um erro ao atualizar os dados divulga web')
				})
		}
	}

	function updateBeneficios() {
		if (!nrRequisicao) return toast.error('Número da requisição obrigatório')
		if (hasDetalheChangedSinceStart(formBeneficios)) {
			setbeneficiosReady(false)
			axiosInstance
				.post(`vaga/beficios-requisicao-vaga`, formBeneficios)
				.then(function (response) {
					setbeneficiosReady(true)
					reloadDetalhesVaga()
					if (response.status === 200) {
						return toast.success(
							"Benefícios da vaga atualizado com sucesso"
						);
					}
				})
				.catch(function (resp) {
					setbeneficiosReady(true)
					console.error(resp)
					let error = resp?.response?.data?.error

					if (Array.isArray(error)) {
						return toast.error(error.join(' ') || 'OOps ocorreu um erro ao atualizar os benefícios')
					}
					return toast.error(error || 'OOps ocorreu um erro ao atualizar os benefícios')
				})
		} else {
			toast.info("Não há dados para atualizar");
		}
	}

	function updateAutoatendimento() {
		if (hasDetalheChangedSinceStart(formDivulgaAutoatendimento)) {
			axiosInstance
				.post(`vaga/dados-autoatendimento`, formDivulgaAutoatendimento)
				.then(function (response) {
					reloadDetalhesVaga()
					if (response.status === 200) {
						toast.success("Dados autoatendimento atualizados com sucesso");
					}
				})
				.catch(function (resp) {
					console.error(resp)
					let error = resp?.response?.data?.error

					if (Array.isArray(error)) {
						return toast.error(
							error.join(' ') || 'OOps ocorreu um erro ao atualizar o autoatendimento'
						)
					}
					return toast.error(error || 'OOps ocorreu um erro ao atualizar o autoatendimento')
				})
		} else {
			toast.info("Não há dados para atualizar");
		}
	}

	function updateRequisitante() {
		if (hasDetalheChangedSinceStart(formRequisitanteVaga)) {
			setAtualizaRequisitanteReady(false)
			axiosInstance
				.post(`vaga/requisitante-vaga`, formRequisitanteVaga)
				.then(function (response) {
					setAtualizaRequisitanteReady(true)
					if (response.status === 200) {
						reloadDetalhesVaga()
						toast.success('Requisitante atualizado com sucesso')
					}
				})
				.catch(function (resp) {
					setAtualizaRequisitanteReady(true)
					console.error(resp)
					let error = resp?.response?.data?.error

					if (Array.isArray(error)) {
						return toast.error(
							error.join(' ') || 'OOps ocorreu um erro ao atualizar o requisitante'
						)
					}
					return toast.error(error || 'OOps ocorreu um erro ao atualizar o requisitante')
				})
		} else {
			toast.info("Não há dados para atualizar");
		}
	}

	function updateFaturamento() {
		if (hasDetalheChangedSinceStart(formFaturamento)) {
			axiosInstance
				.post(`vaga/dados-faturamento`, {
					...formFaturamento,
					dt_faturamento: formFaturamento.dt_faturamento ? new Date(formFaturamento.dt_faturamento).toISOString().split('T')[0] : '',
				})
				.then(function (response) {
					if (response.status === 200) {
						reloadDetalhesVaga()
						toast.success('Faturamento atualizado com sucesso')
					}
				})
				.catch(function (resp) {
					console.error(resp)
					let error = resp?.response?.data?.error

					if (Array.isArray(error)) {
						return toast.error(error.join(' ') || 'OOps ocorreu um erro ao atualizar o faturamento')
					}
					return toast.error(error || 'OOps ocorreu um erro ao atualizar o faturamento')
				})
		} else {
			toast.info("Não há dados para atualizar");
		}
	}

	function populaFormBeneficios() {
		setFormBeneficios({
			nr_requisicao: nrRequisicao,
			nr_vaga: nrVaga,
			id_alimentacao: dadosVagaRequisicaoVagaWeb.ID_ALIMENTACAO == 'S' ? true : false,
			ds_obs_alimentacao: dadosVagaRequisicaoVagaWeb?.DS_OBS_ALIMENTACAO || '',
			id_transporte: dadosVagaRequisicaoVagaWeb.ID_TRANSPORTE || 'N',
			ds_obs_transporte: dadosVagaRequisicaoVagaWeb.DS_OBS_TRANSPORTE || '',
			id_plano_saude: dadosVagaRequisicaoVagaWeb.ID_PLANO_SAUDE == 'S' ? true : false,
			ds_obs_plano_saude: dadosVagaRequisicaoVagaWeb?.DS_OBS_PLANO_SAUDE || '',
			id_plano_odontologico: dadosVagaRequisicaoVagaWeb.ID_PLANO_ODONTOLOGICO == 'S' ? true : false,
			ds_obs_plano_odontologico: dadosVagaRequisicaoVagaWeb?.DS_OBS_PLANO_ODONTOLOGICO || '',
			id_previdencia_privada:
				dadosVagaRequisicaoVagaWeb.ID_PREVIDENCIA_PRIVADA == 'S' ? true : false,
			id_auxilio_creche: dadosVagaRequisicaoVagaWeb.ID_AUXILIO_CRECHE == 'S' ? true : false,
			id_bolsa_estudo: dadosVagaRequisicaoVagaWeb.ID_BOLSA_ESTUDO == 'S' ? true : false,
			id_farmacia: dadosVagaRequisicaoVagaWeb.ID_FARMACIA == 'S' ? true : false,
			ds_obs_farmacia: dadosVagaRequisicaoVagaWeb?.DS_OBS_FARMACIA || '',
			id_vale_refeicao: dadosVagaRequisicaoVagaWeb.ID_VALE_REFEICAO == 'S' ? true : false,
			ds_obs_vale_refeicao: dadosVagaRequisicaoVagaWeb?.DS_OBS_VALE_REFEICAO || '',
			id_cesta_basica: dadosVagaRequisicaoVagaWeb.ID_CESTA_BASICA == 'S' ? true : false,
			ds_obs_cesta_basica: dadosVagaRequisicaoVagaWeb?.DS_OBS_CESTA_BASICA || '',
			id_seguro_vida: dadosVagaRequisicaoVagaWeb.ID_SEGURO_VIDA == 'S' ? true : false,
			ds_obs_seguro_vida: dadosVagaRequisicaoVagaWeb?.DS_OBS_SEGURO_VIDA || '',
			id_possui_ppr: dadosVagaRequisicaoVagaWeb.ID_POSSUI_PPR == 'S' ? true : false,
			ds_obs_quotas_ppr: dadosVagaRequisicaoVagaWeb?.DS_OBS_QUOTAS_PPR || '',
			ds_obs_outros_beneficios: dadosVagaRequisicaoVagaWeb?.DS_OBS_OUTROS_BENEFICIOS || '',
		})
		setbeneficiosReady(true)
	}

	function populaForm() {
		setFormDivulgaVagaWeb({
			id_libera_internet: dadosDivulgaWeb.ID_LIBERA_INTERNET == 'S' ? true : false,
			id_divulga_redes_sociais: dadosDivulgaWeb.ID_DIVULGA_REDES_SOCIAIS == 'S' ? true : false,
			id_local_trabalho: dadosDivulgaWeb.ID_LOCAL_TRABALHO || '',
			envia_email_alteracoes: false,
			qt_candidatos_vaga_web: dadosDivulgaWeb.QT_CANDIDATOS_VAGA_WEB || '',
			ds_observacao_internet: dadosDivulgaWeb.DS_OBSERVACAO_INTERNET || '',
			ds_requisitos_internet: dadosDivulgaWeb.DS_REQUISITOS_INTERNET || '',
			ds_atividades_internet: dadosDivulgaWeb.DS_ATIVIDADES_INTERNET || '',
			ds_local_atuacao_internet: dadosDivulgaWeb.DS_LOCAL_ATUACAO_INTERNET || '',
			nr_requisicao: dadosDivulgaWeb.NR_REQUISICAO,
			dt_libera_internet: dadosDivulgaWeb.DT_LIBERA_INTERNET,
			dt_retira_internet: dadosDivulgaWeb.DT_RETIRA_INTERNET,
			dt_email_divulgacao_internet: dadosDivulgaWeb.DT_EMAIL_DIVULGACAO_INTERNET,
			cd_pessoa_analista: analistaVaga?.CD_PESSOA,
			nm_pessoa_analista: analistaVaga?.NM_PESSOA,
			cd_uf_atuacao: cdUfVaga || '',
			nm_cidade_atuacao: nmCidadeVaga || '',
		})
		let localAtuacao =
			dadosDivulgaWeb.ID_LOCAL_TRABALHO == 'C'
				? 'cidade_cliente'
				: dadosDivulgaWeb.ID_LOCAL_TRABALHO == 'L'
					? 'local_atuacao'
					: ''
		setFormdataLocalAtuacao(localAtuacao)
		setDivulgaWebReady(true)
	}

	function populaFormAutoatendimento() {
		setformDivulgaAutoatendimento({
			nr_requisicao: nrRequisicao,
			nr_vaga: nrVaga,
			cd_unidade_autoatendimento: dadosDivulgaAutoatendimento.CD_UNIDADE_AUTOATENDIMENTO || 'N',
			replica_descricao: false,
		})
		setDivulgaAutoatendimentoReady(true)
	}

	function populaFormRequisitante() {
		setFormRequisitanteVaga({
			nm_requisitante: dadosRequisitanteVaga || '',
			nr_vaga: nrVaga,
		})
		setAtualizaRequisitanteReady(true)
	}

	function converteDataParaISO(dataBR) {
		if (!dataBR) return '';
		const partes = dataBR.split('/');
		if (partes.length !== 3) return dataBR; // Retorna a original se o formato estiver errado
		const [dia, mes, ano] = partes;
		return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
	}

	function populaFormFaturamento() {
		setFormFaturamento({
			nr_vaga: nrVaga,
			dt_faturamento: converteDataParaISO(dadosFaturameto.DT_FATURAMENTO || ''),
			pc_faturamento: dadosFaturameto.PC_FATURAMENTO || '',
			dt_adiantamento: converteDataParaISO(dadosFaturameto.AD_DT_FATURAMENTO || ''),
			pc_adiantamento: dadosFaturameto.AD_PC_FATURAMENTO || '',
			dt_encaminhamento: converteDataParaISO(dadosFaturameto.DT_FAT_ENCAMINHAMENTO || ''),
			pc_encaminhamento: dadosFaturameto.PC_FAT_ENCAMINHAMENTO || '',
		})
		setAtualizaFaturamentoReady(true)
	}

	function populaFormCargoSalario() {
		setFormCargoSalario({
			nr_vaga: nrVaga,
			cd_empresa: detalhesVaga.CD_EMPRESA || '',
			vl_salario: detalhesVaga?.VL_SALARIO || '',
			id_salario: detalhesVaga?.ID_SALARIO || '',
			nm_cargo_cliente: detalhesVaga.NM_CARGO_CLIENTE || '',
			cd_cargo_cliente: detalhesVaga.CD_CARGO_CLIENTE || '',
		})
		setUpdateCargoSalarioReady(true)
	}

	function populaFormDescricaoVaga() {
		setFormDescricaoVaga({
			nr_vaga: nrVaga,
			nr_requisicao: nrRequisicao,
			ds_observacoes: detalhesVaga.DS_OBSERVACOES,
		})
		setUpdateDescricaoReady(true)
	}

	function populaFormTurno() {
		setFormTurno({
			nr_vaga: nrVaga,
			cd_turno: detalhesVaga.CD_TURNO || '',
			nm_turno: detalhesVaga.NM_TURNO || '',
		})
		setUpdateTurnoReady(true)
	}

	function populaFormCentroDeCusto() {
		setFormCentroDeCusto({
			nr_vaga: nrVaga,
			cd_centro_custo: detalhesVaga.CD_CENTRO_CUSTO || '',
			nm_centro_custo: detalhesVaga.NM_CENTRO_CUSTO || '',
		})
		setUpdateCentroDeCustoReady(true)
	}

	function populaFormInsalubridadePericulosidade() {
		setformInsalubridadePericulosidade({
			nr_vaga: nrVaga,
			id_insalubridade: detalhesVaga.ID_INSALUBRIDADE,
			id_periculosidade: detalhesVaga.ID_PERICULOSIDADE,
			vl_insalubridade: detalhesVaga.VL_INSALUBRIDADE || 0,
			vl_periculosidade: detalhesVaga.VL_PERICULOSIDADE || 0,
		})
		setUpdateInsalubridadePericulosidadeReady(true)
	}

	function populaFormNrPedido() {
		setFormNrPedido({
			nr_vaga: nrVaga,
			nr_pedido_cliente: detalhesVaga.NR_PEDIDO_CLIENTE || '',
		})
		setUpdateNrPedidoReady(true)
	}

	function populaFormSetor() {
		setFormSetor({
			nr_vaga: nrVaga,
			ds_area: detalhesVaga.DS_AREA || '',
		})
		setUpdateSetorReady(true)
	}

	function populaFormTipoVagaRecSel() {
		setFormTipoVagaRecSel({
			nr_vaga: nrVaga,
			nr_requisicao: nrRequisicao,
			id_recrutamento: detalhesVaga.ID_RECRUTAMENTO || 'N',
		})
		setUpdateTipoVagaRecSelReady(true)
	}

	function populaFormSituacaoVaga() {
		setFormSituacaoVaga({
			nr_vaga: nrVaga,
			nr_requisicao: nrRequisicao,
			nm_apelido: detalhesVaga.NM_APELIDO,
			cd_pessoa_session: user.cd_sip,
			cd_usuario_session: user.user_sip,
			cd_empresa: detalhesVaga.CD_EMPRESA,
			cd_pessoa_cliente: detalhesVaga.CD_PESSOA,
			cd_situacao_vaga: detalhesVaga?.SITUACAO_VAGA?.CD_SITUACAO_VAGA,
			cd_situacao_vaga_old: detalhesVaga?.SITUACAO_VAGA?.CD_SITUACAO_VAGA,
			ds_situacao_vaga: detalhesVaga?.SITUACAO_VAGA?.DS_SITUACAO_VAGA || '',
			replica_alteracao: 'N',
			cd_motivo_cancelamento: '',
			dt_faturamento: getProximoDomingo(),
			cd_qualificacao_cargo: detalhesVaga.CD_QUALIFICACAO_CARGO,
            cd_tipo_contratacao: detalhesVaga.CD_TIPO_CONTRATACAO,
            justifica_cancelamento_vaga_old: detalhesVaga?.ID_CANCELADA_JUST || 'N',
            ds_justifica_cancelamento_vaga_old: detalhesVaga?.DS_HISTORICO || '',
            justifica_cancelamento_vaga: detalhesVaga?.ID_CANCELADA_JUST || 'N',
            ds_justifica_cancelamento_vaga: detalhesVaga?.DS_HISTORICO || '',
            situacao_mutavel: detalhesVaga.PERMITE_ATUALIZAR?.atualiza,
		})
		setUpdateSitucaoReady(true)
	}

	function populaFormAnalista() {
		handleOnChangeAnalista(analistaVaga?.CD_PESSOA, analistaVaga?.NM_PESSOA)
	}

	const handleOnChangeAnalista = value => {
		if (!value) {
			setFormAnalista({
				cd_pessoa_analista: '',
				nr_telefone_analista: '',
			})
			return
		}

		axiosInstance.get(`analista/telefone/${value}`).then(response => {
			setFormAnalista({
				cd_pessoa_analista: value,
				nr_telefone_analista: response.data.NR_TELEFONE,
			})
		})
	}

	const handleOnChangeTelefoneAnalista = value => {
		setFormAnalista({
			...formAnalista,
			nr_telefone_analista: unmaskTelefone(value),
		})
	}

	const handleSalvarAnalista = () => {
		if (!formAnalista.cd_pessoa_analista) {
			return toast.error('Selecione um analista')
		}

		axiosInstance
			.post(`vaga/${nrVaga}/salvar-analista-vaga`, {
				cd_pessoa_analista: formAnalista.cd_pessoa_analista,
				nr_telefone_analista: formAnalista.nr_telefone_analista,
			})
			.then(response => {
				if (response.status === 200) {
					reloadDetalhesVaga()
					toast.success(response.data.message)
				}

				sendWebSocketMessage('vaga', user.cd_sip);
			})
	}

	const handleDeletarTelefoneAnalista = () => {
		setFormAnalista({
			...formAnalista,
			nr_telefone_analista: '',
		})

		axiosInstance
			.post(`analista/deletar-telefone-analista-vaga/${formAnalista.cd_pessoa_analista}`)
			.then(() => toast.success('Telefone do analista deletado com sucesso'))

		setConfirmarDelecaoTelefoneAnalista(false)
	}

	const getUfCidadeAgrupadoraVaga = (nrVaga) => {
		if (!nrVaga) {
			return toast.error('Vaga não informada')
		}

		axiosInstance
			.get(`vaga/uf-cidade-agrupadora-vaga/${nrVaga}`, {
				nr_vaga: nrVaga
			})
			.then(response => {
				if (response.status === 200) {
					setCdUfVaga(response.data.CD_UF);
					setNmCidadeVaga(response.data.NM_CIDADE);
				}
			})
	}

	// Caso necessario romover outras tabs ou deixar tabs especificas visíveis, utilize o useEffect abaixo para filtrar as tabs com base no array onlyTabs.
	useEffect(() => {
		if (empty(onlyTabs)) return;
		setTabs(tabs.filter(tab => onlyTabs.includes(tab.id)));
	}, [onlyTabs]);
	
	useEffect(() => {
		handleLocalAtuacaoRadio('cidade_cliente');
		if (formDivulgaVagaWeb.replica_descricao === false) {
			populaForm();
			setDropsLocalVisivel(false);
		}
	}, [formDivulgaVagaWeb.replica_descricao]);

	useEffect(() => {
		if (formFaturamento.pc_faturamento === null || formFaturamento.pc_faturamento === undefined || formFaturamento.pc_faturamento === 0) {
			setFaturamentoFechamento(null);
			return;
		}
		const pcFaturamento = Number(formFaturamento.pc_faturamento) || 0;
		const pcAdiantamento = Number(formFaturamento.pc_adiantamento) || 0;
		const pcEncaminhamento = Number(formFaturamento.pc_encaminhamento) || 0;
		let pcFaturamentoFechamento = pcFaturamento - (pcAdiantamento + pcEncaminhamento);
		setFaturamentoFechamento(pcFaturamentoFechamento > 0 ? pcFaturamentoFechamento : null);
	},[formFaturamento]);

	useEffect(() => {
		if (formAnalista.cd_pessoa_analista) {
			setConfirmarDelecaoTelefoneAnalista(false)
		}
	}, [formAnalista.cd_pessoa_analista])

	useEffect(() => {
		let selected = formLocalAtuacao.find(item => item.checked)
		let idLocal = ''
		if (selected?.id === 'cidade_cliente') {
			idLocal = 'C'
		} else if (selected?.id === 'local_atuacao') {
			idLocal = 'L'
			getUfCidadeAgrupadoraVaga(nrVaga);
			setFormDivulgaVagaWeb((prevForm) => ({ ...prevForm, ['cd_uf_atuacao']: cdUfVaga, ['nm_cidade_atuacao']: nmCidadeVaga }))
		}
		setFormDivulgaWebValues('id_local_trabalho', idLocal)
	}, [formLocalAtuacao])

	useEffect(() => {
		if (!dadosDivulgaWeb) return
		populaForm()
	}, [dadosDivulgaWeb])

	useEffect(() => {
		if (empty(detalhesVaga)) return
		populaFormSetor()
		populaFormTurno()
		populaFormNrPedido()
		populaFormCargoSalario()
		populaFormSituacaoVaga()
		populaFormDescricaoVaga()
		populaFormCentroDeCusto()
		populaFormTipoVagaRecSel()
		populaFormInsalubridadePericulosidade()
		populaFormAnalista()

		if ([5, 9, 10].includes(Number(detalhesVaga.SITUACAO_VAGA.CD_SITUACAO_VAGA))) {
			setTrocaSituacao(false)
		}

		if (
			![1, 10].includes(Number(detalhesVaga.CD_TIPO_CONTRATACAO)) &&
			!empty(detalhesVaga.SITUACAO_VAGA.CD_PESSOA_CANDIDATO_APROVADO)
		) {
			setTrocaSituacao(false)
		}

		if (detalhesVaga.CD_TIPO_CONTRATACAO != 2 && detalhesVaga.CD_TIPO_CONTRATACAO != 6 && !isVagaExperidada) {
			let tempTabs = [...tabs];
			if (!tempTabs.find(tab => tab.id === 'tab_faturamento_vaga')) {
				tempTabs.unshift({
					id: 'tab_faturamento_vaga',
					label: 'Faturamento',
					className: '',
					hoverClassName: 'hover:bg-gray-200',
					icon: faReceipt,
				});
				setTabs(tempTabs);
			}
		}

		// OBS: Para vagas EFETIVAS ou DREAM JOB, a situação da vaga pode ser alterada mesmo quando já fechada.
		// Caso a vaga esteja FECHADA, adiciona a opção "Fechada" na lista de situações, para exibir corretamente a situação da vaga
		// Vagas com faturamento ou vagas com situação (CANCELADA ou BLOQUEADA) não podem ter a situação alterada
		if (detalhesVaga.SITUACOES_VAGA) {
			let listaSituacoesVaga = [...detalhesVaga.SITUACOES_VAGA];
			if (detalhesVaga.SITUACAO_VAGA.CD_SITUACAO_VAGA == 6) {
				listaSituacoesVaga = [{ "CD_SITUACAO_VAGA": "6", "NM_SITUACAO_VAGA": "Fechada" }, ...detalhesVaga.SITUACOES_VAGA];
			}
			if (detalhesVaga.SITUACAO_VAGA.CD_SITUACAO_VAGA == 13) {
				listaSituacoesVaga = [{ "CD_SITUACAO_VAGA": "13", "NM_SITUACAO_VAGA": "Congelada - Aguardando Pgto Adto" }, { "CD_SITUACAO_VAGA": "5", "NM_SITUACAO_VAGA": "Cancelada" }];
			}
			let situacoesVaga = [];
			if (isVagaExperidada) {
				situacoesVaga = listaSituacoesVaga?.filter(sit => [5,9].includes(Number(sit.CD_SITUACAO_VAGA)));
				setFormSituacaoVaga(prev => ({ ...prev, cd_situacao_vaga: 5, is_cancelamento_expirada: true }));
			} else {
				situacoesVaga = listaSituacoesVaga?.filter(sit => !(detalhesVaga.SITUACAO_VAGA.CD_SITUACAO_VAGA == 5 && sit.CD_SITUACAO_VAGA == 1));
			}
			setStatusOptions(situacoesVaga?.map(sit => ({
				value: sit.CD_SITUACAO_VAGA,
				label: `${sit.NM_SITUACAO_VAGA}`,
			})));
		}
	}, [detalhesVaga])

	useEffect(() => {
		if (!(tabControl == 'tab_beneficios')) return
		if (!dadosVagaRequisicaoVagaWeb) return
		populaFormBeneficios()
	}, [dadosVagaRequisicaoVagaWeb])

	useEffect(() => {
		if (!(tabControl == 'tab_divulga_autoatendimento')) return
		if (!dadosDivulgaAutoatendimento) return
		populaFormAutoatendimento()
	}, [dadosDivulgaAutoatendimento])

	useEffect(() => {
		if (!(tabControl == 'tab_requisitante_vaga')) return
		populaFormRequisitante()
		if (!dadosRequisitanteVaga) return
	}, [dadosRequisitanteVaga])

	useEffect(() => {
		if (tabControl == 'tab_faturamento_vaga' && dadosFaturameto) {
			populaFormFaturamento()
		}
	}, [dadosFaturameto])

	useEffect(() => {
		if (nrVaga && init) {
			getDadosDivulgaWeb()
		}
	}, [nrVaga, init])

	useEffect(() => {
		if (nrRequisicao && init && tabControl == 'tab_beneficios') {
			getBeneficiosRequisicaoVagaWeb()
		}
	}, [nrRequisicao, init, tabControl])

	useEffect(() => {
		if (nrVaga && init && tabControl == 'tab_requisitante_vaga') {
			getDadosRequisitanteVaga()
		}
	}, [nrVaga, init, tabControl])

	useEffect(() => {
		if (init && tabControl == 'tab_divulga_autoatendimento') {
			getUnidadesAutoatendimento()
			getDadosDivulgaAutoatendimento()
		}
	}, [init, tabControl])

	useEffect(() => {
		if (init && tabControl == 'tab_faturamento_vaga') {
			getDadosFaturamento()
		}
	}, [init, tabControl])

	useEffect(() => {
		if (init && tabControl == 'tab_situacao_vaga') {
			getMotivosCancelamento()
		}
	}, [init, tabControl, formSituacaoVaga])

	useEffect(() => {
		let isDataValida = isDataSuperiorAtual(formSituacaoVaga.dt_faturamento)
		setDataFaturamentoValida(isDataValida)
	}, [formSituacaoVaga.dt_faturamento])

	useEffect(() => {
		setIsVagaCongelada(Number(detalhesVaga?.SITUACAO_VAGA?.CD_SITUACAO_VAGA) === 13);
	}, [detalhesVaga?.SITUACAO_VAGA?.CD_SITUACAO_VAGA]);

	const setCargoCallback = cargo => {
		setFormCargoSalario({
			...formCargoSalario,
			nm_cargo_cliente: cargo.NM_CARGO_CLIENTE,
			cd_cargo_cliente: cargo.CD_CARGO_CLIENTE,
		})
	}

	const isDataSuperiorAtual = (data) => {
		const hoje = new Date();
		const dataComparar = new Date(data + 'T00:00:00'); 
		return dataComparar > hoje;
	};

	const setTurnoCallback = ({ CD_TURNO, NM_TURNO }) => {
		setFormTurno({ ...formTurno, cd_turno: CD_TURNO, nm_turno: NM_TURNO })
	}

	const setCentroCustoCallback = ({ CD_CENTRO_CUSTO, NM_CENTRO_CUSTO }) => {
		setFormCentroDeCusto({
			...formCentroDeCusto,
			cd_centro_custo: CD_CENTRO_CUSTO,
			nm_centro_custo: NM_CENTRO_CUSTO,
		})
	}

	const setFormCargoSalarioValues = (id, value) => {
		setFormCargoSalario(prevForm => ({ ...prevForm, [id]: value }))
	}

	const setFormDivulgaWebToggle = (id, value, checked) => {
		setFormDivulgaVagaWeb(prevForm => ({
			...prevForm,
			[id]: checked,
		}))
	}

	const setFormdataLocalAtuacao = (id, value, checked) => {
		setformLocalAtuacao(
			formLocalAtuacao.map(radio => {
				radio.checked = id == radio.id
				return radio
			})
		)
	}

	const handleLocalAtuacaoRadio = (id, value, checked) => {
		const replica = formDivulgaVagaWeb.replica_descricao;
		if (!replica) return;
		setFormdataLocalAtuacao(id, value, checked);
		setDropsLocalVisivel(replica && checked && id === 'local_atuacao');
	}

	const setFormDivulgaWebValues = (id, value) => {
		setFormDivulgaVagaWeb(prevForm => ({ ...prevForm, [id]: value }))
	}

	const setFormBeneficiosToggle = (id, value, checked) => {
		setFormBeneficios(prevForm => ({ ...prevForm, [id]: checked }))
	}

	const setFormBeneficiosValues = (id, value) => {
		setFormBeneficios(prevForm => ({ ...prevForm, [id]: value }))
	}

	const setFormDivulgaAutoatendimentoToggle = (id, value, checked) => {
		setformDivulgaAutoatendimento(prevForm => ({
			...prevForm,
			[id]: checked,
		}))
	}

	const setformDivulgaAutoatendimentoValues = (id, value) => {
		setformDivulgaAutoatendimento(prevForm => ({
			...prevForm,
			[id]: value,
		}))
	}

	const setFormFaturamentoValues = (id, value) => {
		setFormFaturamento(prevForm => ({ ...prevForm, [id]: value }));
	}

	const setFormInsalubridadePericulosidadeValues = (id, value) => {
		setformInsalubridadePericulosidade(prevForm => ({
			...prevForm,
			[id]: value,
		}))
	}

	const setFormInsalubridadePericulosidadeToggle = (id, _value, checked) => {
		setformInsalubridadePericulosidade(prevForm => ({
			...prevForm,
			[id]: checked ? 'S' : 'N',
			[id === 'id_insalubridade' ? 'id_periculosidade' : 'id_insalubridade']: checked
				? 'N'
				: prevForm[id === 'id_insalubridade' ? 'id_periculosidade' : 'id_insalubridade'],
		}))
	}

	const setFormNrPedidoValues = (id, value) => {
		setFormNrPedido(prevForm => ({ ...prevForm, [id]: value }))
	}

	const setFormSetorValues = (id, value) => {
		setFormSetor(prevForm => ({ ...prevForm, [id]: value }))
	}

	const setFormTipoVagaRecSelToggle = (id, value, checked) => {
		setFormTipoVagaRecSel(prevForm => ({
			...prevForm,
			[id]: checked ? 'S' : 'N',
		}))
	}

	const isFieldDependent = field => {
		if (
			field.every(f => {
				const fieldId = f.split('|')[0]
				const fieldVal = f.split('|')[1].split(':')[1]
				return formDivulgaVagaWeb[fieldId] == !!fieldVal
			})
		) {
			return true
		}
	}

	const onClickSetTabControl = tab => {
		setTabControl(tab)
	}

	const hasDetalheChangedSinceStart = form => {
		const didIt = Object.keys(form).some(key => {
			if (!form[key] && !detalhesVaga[key.toUpperCase()]) return false
			if (key == 'replica_alteracao' || key == 'replica_descricao') return false

			if (key == 'nr_vaga') return form[key] != nrVaga
			if (key == 'nr_requisicao') return form[key] != nrRequisicao
			if (key == 'cd_situacao_vaga_old')
				return form[key] != detalhesVaga.SITUACAO_VAGA.CD_SITUACAO_VAGA
			if (key == 'cd_situacao_vaga')
				return form[key] != detalhesVaga.SITUACAO_VAGA.CD_SITUACAO_VAGA
			if (key == 'cd_pessoa_cliente') return form[key] != detalhesVaga.CD_PESSOA
			if (key == 'cd_usuario_session') return form[key] != user.user_sip
			if (key == 'cd_pessoa_session') return form[key] != user.cd_sip

			// Justificativa de cancelamento - Help 540099
			if (key == 'justifica_cancelamento_vaga_old')
				return form[key] != detalhesVaga?.ID_CANCELADA_JUST
			if (key == 'justifica_cancelamento_vaga')
				return form[key] != detalhesVaga?.ID_CANCELADA_JUST
			if (key == 'ds_justifica_cancelamento_vaga_old')
				return form[key] != detalhesVaga?.DS_HISTORICO
			if (key == 'ds_justifica_cancelamento_vaga')
				return form[key] != detalhesVaga?.DS_HISTORICO

			return form[key] != detalhesVaga[key.toUpperCase()]
		})
		return didIt
	}

	return (
		<>
			<div className='col-span-12 md:col-span-8 md:col-start-3 xl:col-span-6 xl:col-start-4 mt-2'>
				<div className='grid grid-cols-12'>
					<div className='col-span-12 md:col-span-3'>
						<MiniSidebar
							items={tabs}
							onItemClick={onClickSetTabControl}
							className={`mr-2 shadow`}
							filtroAtivo={tabControl}
						/>
					</div>
					
					<div className='col-span-12 md:col-span-9 pl-2 min-h-[500px] relative pb-[200px]'>
						{isVagaCongelada && (
							<Blockquote type="primary" className='col-span-12 md:col-span-9 mb-2'>
								<div className='flex flex-row'>
									<FontAwesomeIcon icon={faInfoCircle} width='18' height='18'className="mr-2" />
									<span>Não será possível editar alguns dados da vaga pois está congelada.</span>
								</div>
							</Blockquote>
						)}
						
					{/* situacao da vaga */}
					{tabControl == 'tab_situacao_vaga' && (
						<div className={`col-span-12 md:col-span-9 pl-2 min-h-[500px] relative pb-[200px]`}>
							
							<Loading active={!updateSituacaoReady} />
							<FabSave
								id={'save_situacao_vaga'}
								onClick={() =>{
									if (isVagaCongelada && detalhesVaga?.FATURAMENTO?.ID_ADIANTAMENTO_FATURADO == 'S'){
										setConfirmarCancelamentoCongelada(true);
										return;
									}
									disparaAtualizacoes();
								}}
								className='top-[84%] right-3 md:right-[6%] lg:right-[10%] '
							/>

							{!trocaSituacao && (
								<div>
									<InputText
										label={'Situação'}
										value={detalhesVaga?.SITUACAO_VAGA?.NM_SITUACAO}
										disabled
									/>
									{['5', '8', '9'].includes(String(detalhesVaga?.SITUACAO_VAGA?.CD_SITUACAO_VAGA)) && (
										<div className={'flex-row mt-2'}>
											<InputText
												label={'Motivo Cancelamento'}
												value={detalhesVaga?.SITUACAO_VAGA?.DS_MOTIVO_CANCELAMENTO}
												disabled
											/>
										</div>
									)}
								</div>
							)}

							{trocaSituacao && (
								<div className='flex-row mt-2'>
									<Select
										label={'Situação'}
										id={'cd_situacao_vaga'}
										value={formSituacaoVaga.cd_situacao_vaga}
										onChange={(id, value) => {
											setFormSituacaoVaga({
												...formSituacaoVaga,
												cd_situacao_vaga: value,
												ds_situacao_vaga: '',
											})
										}}
										options={statusOptions}
										disabled={!detalhesVaga.PERMITE_ATUALIZAR?.atualiza}
										hint={detalhesVaga.PERMITE_ATUALIZAR?.mensagem}
										hideClearButton={true}
									/>
                                </div>
							)}

                            {['4088158', '81988', '5134659', '81952', '3032056', '500936', '4525492', '3524367'].includes(String(formSituacaoVaga.cd_pessoa_session)) &&
                                ['5', '6', '9'].includes(String(formSituacaoVaga.cd_situacao_vaga)) ? (
                                <div>
                                    <div className={'mt-2'}>
                                        <ButtonToggle
                                            primary
                                            checked={formSituacaoVaga.justifica_cancelamento_vaga === 'S'}
                                            id={'justifica_cancelamento_vaga'}
                                            label={'Justificar cancelamento?'}
                                            onChange={(id, value, checked) => {
                                                setFormSituacaoVaga({
                                                    ...formSituacaoVaga,
                                                    justifica_cancelamento_vaga: checked ? 'S' : 'N',
                                                })
                                            }}
											disabled={!trocaSituacao}
                                        />
                                    </div>
                                    {formSituacaoVaga.justifica_cancelamento_vaga === 'S' ? 
                                        <div className={`flex-row mt-2`}>
                                            <div>
                                                <InputTextArea
                                                    id={'ds_justifica_cancelamento_vaga'}
                                                    rows={10}
                                                    label='Justificativa do Cancelamento'
                                                    onChange={(id, value) => {
                                                        setFormSituacaoVaga({
                                                            ...formSituacaoVaga,
                                                            ds_justifica_cancelamento_vaga: value,
                                                        })
                                                    }}
                                                    maxLength={1999}
                                                    value={formSituacaoVaga.ds_justifica_cancelamento_vaga}
                                                    helperText='Minimo 20'
                                                />
                                            </div>
                                        </div>
                                    : null}
                                </div>
							):null}


							{String(formSituacaoVaga.cd_situacao_vaga) == '9' &&
								!['9'].includes(String(detalhesVaga?.SITUACAO_VAGA?.CD_SITUACAO_VAGA)) && (
									<div className={`flex-row mt-2`}>
										<InputDate
											required
											label='Data de faturamento'
											id='dt_faturamento'
											onChange={(id, value) => {
												setFormSituacaoVaga(prevForm => ({
													...prevForm,
													[id]: value,
												}))
											}}
											value={formSituacaoVaga.dt_faturamento}
											minDate={trocaSituacao ? amanha : format(new Date(), 'yyyy-MM-dd')}
										/>
										{!dataFaturamentoValida && (
											<Blockquote type={'danger'}>
												Data de faturamento deve ser maior que a data atual!
											</Blockquote>
										)}
									</div>
								)}

							{[5, 8, 9].includes(Number(formSituacaoVaga.cd_situacao_vaga)) &&
								formSituacaoVaga.cd_situacao_vaga != detalhesVaga?.SITUACAO_VAGA?.CD_SITUACAO_VAGA &&
								trocaSituacao ? (
								<div className={'flex-row mt-2'}>
									<Fieldset label='Motivo Cancelamento' className={`flex-row flex-wrap`} required>
										{motivosCancelamentoData?.map(motivo => {
											return (
												<Radio
													className='w-full mt-2'
													value={motivo.CD_MOTIVO_CANCELAMENTO}
													label={motivo.DS_MOTIVO_CANCELAMENTO}
													id={`motivo_${motivo.CD_MOTIVO_CANCELAMENTO}`}
													key={`motivo_${motivo.CD_MOTIVO_CANCELAMENTO}`}
													onChange={(id, value, checked) => {
														setFormSituacaoVaga({
															...formSituacaoVaga,
															cd_motivo_cancelamento: value,
														})
													}}
													checked={formSituacaoVaga.cd_motivo_cancelamento == motivo.CD_MOTIVO_CANCELAMENTO}
												/>
											)
										})}
									</Fieldset>
								</div>
							) : null}

							<div className={`flex-row mt-2`}>
								<div>
									<InputTextArea
										id={'ds_situacao_vaga'}
										rows={10}
										label='Descrição'
										onChange={(id, value) => {
											setFormSituacaoVaga({
												...formSituacaoVaga,
												ds_situacao_vaga: value,
											})
										}}
										maxLength={1999}
										value={formSituacaoVaga.ds_situacao_vaga}
										helperText='Minimo 20'
										disabled={!trocaSituacao}
									/>
								</div>

								<div className={'mt-2'}>
									<ButtonToggle
										primary
										checked={formSituacaoVaga.replica_alteracao === 'S'}
										id={'replica_alteracao'}
										label={<>
											Replicar essa alteração para todas as vagas desta requisição?
											{(formSituacaoVaga.replica_alteracao === 'S' &&
												formSituacaoVaga.justifica_cancelamento_vaga === 'S'
											) ? (
												<span style={{ color: 'red', marginLeft: 4 }}>
													*A justificativa será salva apenas nesta vaga
												</span>
											) : null}
										</>}
										onChange={(id, value, checked) => {
											setFormSituacaoVaga({
												...formSituacaoVaga,
												replica_alteracao: checked ? 'S' : 'N',
											})
											if (checked && formSituacaoVaga.justifica_cancelamento_vaga === 'S'
											) { toast.warning('A justificativa será salva apenas nesta vaga');}
										}}
									/>
								</div>
							</div>
						</div>
					)}

					{/* atualiza vaga recrutamento/selecao */}
					{tabControl == 'tab_recrutamento' && (
						<div className={`col-span-12 md:col-span-9 pl-2 min-h-[500px] relative`}>
							<Loading active={!updateTipoVagaRecSelReady} />
							<FabSave
								id={'save_tipo_vaga'}
								onClick={updateTipoVagaRecSel}
								className='top-[84%] right-3 md:right-[6%] lg:right-[10%] '
								disabled={isVagaCongelada}
							/>

							<div className='flex-row mt-2'>
								<ButtonToggle
									primary
									label='Recrutamento'
									id={'id_recrutamento'}
									onChange={setFormTipoVagaRecSelToggle}
									checked={formTipoVagaRecSel.id_recrutamento == 'S'}
									disabled={isVagaCongelada}
								/>
							</div>
							<div className='flex-row mt-2'>
								<Blockquote type={'danger'}>
									A alteração do tipo da vaga efetuará atualização em todas as vagas da mesma
									requisição.
								</Blockquote>
							</div>
						</div>
					)}

					{/* atualiza setor */}
					{tabControl == 'tab_setor' && (
						<div className={`col-span-12 md:col-span-9 pl-2 min-h-[500px] relative `}>
							<Loading active={!updateSetorReady} />
							<FabSave
								id={'save_setor'}
								onClick={updateSetor}
								className='top-[84%] right-3 md:right-[6%] lg:right-[10%] '								
								disabled={isVagaCongelada}

							/>
							<InputText
								label={'Setor'}
								id={'ds_area'}
								value={formSetor.ds_area}
								onChange={setFormSetorValues}
								disabled={isVagaCongelada}

							/>
						</div>
					)}

					{/* nr_pedido_cliente */}
					{tabControl == 'tab_nr_pedido' && (
						<div className={`col-span-12 md:col-span-9 pl-2 min-h-[500px]  relative`}>
							<Loading active={!updateNrPedidoReady} />
							<FabSave
								id={'save_nr_pedido'}
								onClick={updateNrPedido}
								className='top-[84%] right-3 md:right-[6%] lg:right-[10%] '
								disabled={isVagaCongelada}
							/>
							<InputText
								label={'NR. Pedido'}
								id={'nr_pedido_cliente'}
								value={formNrPedido.nr_pedido_cliente}
								onChange={setFormNrPedidoValues}
								disabled={isVagaCongelada}
							/>
						</div>
					)}

					{/* periculosidade insalubridade */}
					{tabControl == 'tab_insalubridade_periculosidade' && (
						<div className={`col-span-12 md:col-span-9 pl-2 min-h-[500px] relative`}>
							<Loading active={!updateInsalubridadePericulosidadeReady} />
							<FabSave
								id={'save_insalubridade_periculosidade'}
								onClick={updateInsalubridadePericulosidade}
								className='top-[84%] right-3 md:right-[6%] lg:right-[10%]'
								disabled={isVagaCongelada}
							/>
							<div className='flex flex-row flex-no-wrap w-full mt-2'>
								<ButtonToggle
									primary
									label='Insalubridade'
									id={'id_insalubridade'}
									onChange={setFormInsalubridadePericulosidadeToggle}
									checked={formInsalubridadePericulosidade.id_insalubridade == 'S' || isVagaCongelada}
									disabled={detalhesVaga?.SITUACAO_VAGA?.CD_SITUACAO_VAGA != 1}
								/>
							</div>
							<div className='flex flex-row flex-no-wrap w-full mt-2'>
								<RangeSlider
									value={formInsalubridadePericulosidade.vl_insalubridade}
									disabled={formInsalubridadePericulosidade.id_insalubridade == 'N' || isVagaCongelada}
									onChange={setFormInsalubridadePericulosidadeValues}
									onClick={setFormInsalubridadePericulosidadeValues}
									id={'vl_insalubridade'}
									enableMinMax={true}
								/>
							</div>

							<div className='flex flex-row flex-no-wrap w-full mt-2'>
								<ButtonToggle
									primary
									label='Periculosidade'
									id={'id_periculosidade'}
									onChange={setFormInsalubridadePericulosidadeToggle}
									checked={formInsalubridadePericulosidade.id_periculosidade == 'S'}
									disabled={detalhesVaga?.SITUACAO_VAGA?.CD_SITUACAO_VAGA != 1 || isVagaCongelada}
								/>
							</div>
							<div className='flex flex-row flex-no-wrap w-full mt-2'>
								<RangeSlider
									value={formInsalubridadePericulosidade.vl_periculosidade}
									disabled={formInsalubridadePericulosidade.id_periculosidade == 'N' || isVagaCongelada}
									onClick={setFormInsalubridadePericulosidadeValues}
									onChange={setFormInsalubridadePericulosidadeValues}
									id={'vl_periculosidade'}
									enableMinMax={true}
									className='w-1/2'
								/>
							</div>
						</div>
					)}

					{tabControl == 'tab_analista' && (
						<div className={`col-span-12 md:col-span-9 pl-2 min-h-[500px] relative`}>
							<Loading active={false} />
							<FabSave
								id={'save_analista'}
								onClick={handleSalvarAnalista}
								className='top-[84%] right-3 md:right-[6%] lg:right-[10%] '
							/>
							<div className='flex flex-row gap-4 flex-no-wrap w-full mt-2'>
								<div className='w-1/2 xl:w-1/4'>
									<DebouncedSearch.Root>
										<DebouncedSearch.Label label={'Analista'} />
										<DebouncedSearch.Select
											onChange={value => {
												handleOnChangeAnalista(value)
											}}
											value={formAnalista.cd_pessoa_analista}
											urlGet={`analista/selecionadores/${nrVaga}`}
											optId={'CD_PESSOA_ANALISTA'}
											optLabel={'NM_PESSOA_ANALISTA'}
										/>
									</DebouncedSearch.Root>
								</div>
								<div className='flex flex-row items-end gap-2 w-1/2 xl:w-1/4'>
									<div className='w-full'>
										<InputText
											label={'Telefone'}
											id={'nr_telefone_analista'}
											mask='phone'
											value={formAnalista.nr_telefone_analista}
											onChange={(id, value) => {
												handleOnChangeTelefoneAnalista(value)
											}}
											disabled={!user?.grupos?.includes('32') && user?.cd_setor != '2'}
										/>
									</div>
									<Button
										buttonType={'danger'}
										onClick={() => {
											setConfirmarDelecaoTelefoneAnalista(true)
										}}
										className='p-3'
										size='medium'
										disabled={
											(!user.grupos.includes('32') && user.cd_setor != '2') ||
											!formAnalista.nr_telefone_analista
										}
									>
										<FontAwesomeIcon icon={faTrash} className='text-white' height={12} width={12} />
									</Button>
								</div>
							</div>
						</div>
					)}

					{/* centro de custo */}
					{tabControl == 'tab_centro_de_custo' && (
						<div className={`col-span-12 md:col-span-9 pl-2 min-h-[500px] relative`}>
							<Loading active={!updateCentroDeCustoReady} />
							<FabSave
								id={'save_centro_de_custo'}
								onClick={updateCentroDeCusto}
								className='top-[84%] right-3 md:right-[6%] lg:right-[10%] '
								disabled={isVagaCongelada}
							/>
							<div className='flex flex-row flex-no-wrap w-full mt-2'>
								<div className='w-full inline-flex gap-2'>
									<div className='w-1/2'>
										<InputText
											label={'Centro de custo'}
											id='nm_centro_de_custo'
											disabled
											value={formCentroDeCusto.nm_centro_custo}
										/>
									</div>
									<div className='flex w-1/2 items-baseline self-end'>
										{!editCentroDeCusto && (
											<Button
												buttonType='primary'
												className={'ml-2'}
												onClick={() => {
													setEditCentroDeCusto(true)
												}}
												disabled={isVagaCongelada}
											>
												<FontAwesomeIcon icon={faEdit} width='18' height='18' />
											</Button>
										)}
										{editCentroDeCusto && (
											<Button
												buttonType='danger'
												className={'ml-2'}
												onClick={() => {
													setEditCentroDeCusto(false)
													populaFormCentroDeCusto()
												}}
												disabled={isVagaCongelada}
											>
												<FontAwesomeIcon icon={faX} width='18' height='18' />
											</Button>
										)}
									</div>
								</div>
							</div>

							<div className='flex flex-row flex-no-wrap mt-2 w-full'>
								<CentroDeCustoList
									init={editCentroDeCusto}
									callBack={setCentroCustoCallback}
									cdEmpresa={detalhesVaga.CD_EMPRESA}
									cdPessoaCliente={detalhesVaga.CD_PESSOA}
									className={`${editCentroDeCusto ? '' : 'hidden'}`}
									contentClass={`max-h-[300px] overflow-y-auto`}
								/>
							</div>
						</div>
					)}

					{/* atualiza turno */}
					{tabControl == 'tab_expediente' && (
						<div className={`col-span-12 md:col-span-9 pl-2 min-h-[500px] relative `}>
							<Loading active={!updateTurnoReady} />
							<FabSave
								id={'save_expediente'}
								onClick={updateTurnoVaga}
								className='top-[84%] right-3 md:right-[6%] lg:right-[10%] '
								disabled={isVagaCongelada}
							/>
							<div className='flex flex-row flex-no-wrap w-full mt-2'>
								<div className='w-full inline-flex gap-2'>
									<div className='w-1/2'>
										<InputText label={'Turno'} id='nm_turno' disabled value={formTurno.nm_turno} />
									</div>
									<div className='flex w-1/2 items-baseline self-end'>
										{!editTurno && (
											<Button
												buttonType='primary'
												className={'ml-2'}
												onClick={() => {
													setEditTurno(true)
												}}
												disabled={isVagaCongelada}
											>
												<FontAwesomeIcon icon={faEdit} width='18' height='18' />
											</Button>
										)}
										{editTurno && (
											<Button
												buttonType='danger'
												className={'ml-2'}
												onClick={() => {
													setEditTurno(false)
													populaFormTurno()
												}}
												disabled={isVagaCongelada}
											>
												<FontAwesomeIcon icon={faX} width='18' height='18' />
											</Button>
										)}
									</div>
								</div>
							</div>

							<div className='flex flex-row flex-no-wrap mt-2 w-full'>
								<TurnosList
									init={editTurno}
									callBack={setTurnoCallback}
									className={`${editTurno ? '' : 'hidden'}`}
									contentClass={`max-h-[300px] overflow-y-auto`}
									cdTipoContratacao={detalhesVaga.CD_TIPO_CONTRATACAO}
								/>
							</div>
						</div>
					)}

					{/* atualiza descricao vaga */}
					{tabControl == 'tab_descricao_vaga' && (
						<div className={`col-span-12 md:col-span-9 pl-2 min-h-[500px] relative`}>
							<Loading active={!updateDescricaoReady} />
							<FabSave
								id={'save_descricao'}
								onClick={updateDescricaoVaga}
								className='top-[84%] right-3 md:right-[6%] lg:right-[10%] '
								disabled={isVagaCongelada}
							/>
							<InputTextArea
								rows={20}
								label='Informações adicionais ou sigilosas'
								id='ds_observacoes'
								onChange={(id, value) => {
									setFormDescricaoVaga({
										...formDescricaoVaga,
										ds_observacoes: value,
									})
								}}
								maxLength={3000}
								value={formDescricaoVaga.ds_observacoes}
								disabled={isVagaCongelada}
							/>
						</div>
					)}

					{/* Atualiza cargo/salario */}
					<div
						className={`col-span-12 md:col-span-9 pl-2 min-h-[500px] relative ${tabControl == 'tab_cargo_salario' ? '' : 'hidden'
							}`}
					>
						<Loading active={!updateCargoSalarioReady} />
						<FabSave
							id={'save_salario'}
							onClick={updateCargoSalario}
							className='top-[84%] right-3 md:right-[6%] lg:right-[10%] '
							disabled={isVagaCongelada}
						/>
						<div className='flex flex-row flex-no-wrap w-full mt-2'>
							<div className='w-full inline-flex gap-2'>
								<div className='w-1/2'>
									<InputText
										label={'Cargo cliente'}
										id={'nm_cargo_cliente'}
										value={formCargoSalario.nm_cargo_cliente}
										disabled
									/>
								</div>
								<div className='flex w-1/2 items-baseline self-end'>
									{!exibeAlteraCargo && (
										<Button
											buttonType='primary'
											onClick={() => {
												setExibeAlteraCargo(true)
											}}
											disabled={isVagaCongelada}
										>
											<FontAwesomeIcon icon={faEdit} width='18' height='18' />
										</Button>
									)}
									{exibeAlteraCargo && (
										<Button
											buttonType='danger'
											onClick={() => {
												setExibeAlteraCargo(false)
												populaFormCargoSalario()
											}}
											disabled={isVagaCongelada}
										>
											<FontAwesomeIcon icon={faX} width='18' height='18' />
										</Button>
									)}
								</div>
							</div>
						</div>

						<AtualizaCargoCliente
							nmCargoCliente={detalhesVaga.NM_CARGO_CLIENTE}
							cdCargoCliente={detalhesVaga.CD_CARGO_CLIENTE}
							cdPessoaCliente={detalhesVaga.CD_PESSOA}
							cdEmpresaCliente={detalhesVaga.CD_EMPRESA}
							init={exibeAlteraCargo}
							callBack={setCargoCallback}
							className={`${exibeAlteraCargo ? '' : 'hidden'}`}
							contentclass={`max-h-[200px] overflow-y-auto`}
						/>

						<div className='flex flex-row flex-no-wrap w-full gap-2 mt-2'>
							<div className='w-full md:w-1/2'>
								<InputText
									id={'vl_salario'}
									label='Salário'
									value={formCargoSalario.vl_salario}
									onChange={setFormCargoSalarioValues}
									mask={'currency'}
									disabled={isVagaCongelada}
								/>
							</div>
							<div className='w-full md:w-1/2'>
								<Select
									label={'Tipo Salário'}
									id='id_salario'
									value={formCargoSalario.id_salario}
									onChange={setFormCargoSalarioValues}
									disabled={isVagaCongelada}
									options={[
										{ label: 'Selecione', value: '' },
										{ label: 'Horista', value: 'H' },
										{ label: 'Diarista', value: 'D' },
										{ label: 'Mensalista', value: 'M' },
										{
											label: 'Sem remuneração',
											value: 'S',
										},
										{ label: 'Comissão', value: 'C' },
									]}
								/>
							</div>
						</div>
					</div>

					{/* DIVULGA WEB */}
					{tabControl == 'tab_divulga_web' && (
						<div className={`col-span-12 md:col-span-9 pl-2 relative pb-20 min-h-[500px]`}>
							<Loading active={!divulgaWebReady} />
							<div className={`grid grid-cols-12 pt-2 ${divulgaWebReady ? '' : 'hidden'}`}>
								<FabSave
									id={'save_divulga_web'}
									onClick={divulgaVagaWeb}
									className='top-[84%] right-3 md:right-[6%] lg:right-[10%] '
								/>

								<div className='col-span-12 border-b-2 pb-2'>
									<ButtonToggle
										id={'id_libera_internet'}
										primary
										onChange={setFormDivulgaWebToggle}
										label={'Divulgar vaga na internet?'}
										checked={formDivulgaVagaWeb.id_libera_internet}
									/>
								</div>

								<div className={`col-span-12 border-b-2 h-fit`}>
									<div className='mt-2'>
										{formDivulgaVagaWeb.dt_libera_internet && (
											<PillsBadge type={'primary'}>
												divulgado: {formDivulgaVagaWeb.dt_libera_internet}
											</PillsBadge>
										)}

										{formDivulgaVagaWeb.dt_retira_internet && (
											<PillsBadge type={'warning'} className={'ml-2'}>
												retirado: {formDivulgaVagaWeb.dt_retira_internet}
											</PillsBadge>
										)}
									</div>

									<div className={`mt-2`}>
										<InputNumber
											label={'Quantidade de candidatos web'}
											value={formDivulgaVagaWeb.qt_candidatos_vaga_web}
											onChange={setFormDivulgaWebValues}
											max={200}
											id={'qt_candidatos_vaga_web'}
											required={isFieldDependent(formValidate.qt_candidatos_vaga_web.dependsOn)}
										/>
									</div>

									<div className={`mt-2`}>
										<InputTextArea
											label='Descrição'
											id='ds_observacao_internet'
											onChange={setFormDivulgaWebValues}
											required={isFieldDependent(formValidate.ds_observacao_internet.dependsOn)}
											maxLength={1999}
											helperText='Minimo 20'
											value={formDivulgaVagaWeb.ds_observacao_internet}
											disabled={!formDivulgaVagaWeb.replica_descricao}
										/>
									</div>

									<div className='mt-1'>
										<Blockquote size={'sm'} type={'primary'}>
											Para editar os detalhes de divulgação, é necessário replicar para todas as vagas
										</Blockquote>
									</div>

									<div className={`mt-2`}>
										<ButtonToggle
											id={'replica_descricao'}
											primary
											onChange={setFormDivulgaWebToggle}
											label={'Replicar essa descrição para todas as vagas da requisição?'}
											checked={formDivulgaVagaWeb.replica_descricao}
										/>
									</div>

									<div className={`mt-2`}>
										<ButtonToggle
											id={'id_divulga_redes_sociais'}
											primary
											onChange={setFormDivulgaWebToggle}
											label={'Deseja divulgar nas redes sociais?'}
											checked={formDivulgaVagaWeb.id_divulga_redes_sociais}
											disabled={!formDivulgaVagaWeb.replica_descricao}
										/>
									</div>

									<div className='mt-2'>
										<ButtonToggle
											id={'envia_email_alteracoes'}
											primary
											onChange={setFormDivulgaWebToggle}
											label={'Deseja enviar um email com as alterações?'}
											checked={formDivulgaVagaWeb.envia_email_alteracoes}
											disabled={!formDivulgaVagaWeb.replica_descricao}
										/>
									</div>

									<div className={`mt-2`}>
										<p>A oportunidade de trabalho é para qual estado/cidade?</p>
										<div className='inline-flex mt-2'>
											<Radio
												label={'Cidade do cliente'}
												id={'cidade_cliente'}
												checked={
													formLocalAtuacao.find(radio => radio.id === 'cidade_cliente').checked
												}
												onChange={handleLocalAtuacaoRadio}
											/>
											<Radio
												label={'Local de atuação'}
												id={'local_atuacao'}
												checked={
													formLocalAtuacao.find(radio => radio.id === 'local_atuacao').checked
												}
												onChange={handleLocalAtuacaoRadio}
												className='ml-2'
											/>
										</div>
									</div>

									<div className={`grid grid-cols-2 gap-2 mt-2 ${dropsLocalVisivel ? '' : 'hidden'}`}>
										<div className={`my-2`}>
											<SelectEstado
												id={"cd_uf_atuacao"}
												init={dropsLocalVisivel}
												label={"Estado:"}
												value={cdUfVaga}
												required={dropsLocalVisivel}
												cdPais={1}
												onChange={(id, value) => {
													setCdUfVaga(value);
													setFormDivulgaVagaWeb((prevForm) => ({ ...prevForm, [id]: value }))
												}}
											/>
										</div>
										<div className={`my-2`}>
											<SelectCidade
												id={"nm_cidade_atuacao"}
												init={dropsLocalVisivel}
												label={"Cidade:"}
												cdUF={cdUfVaga}
												required={dropsLocalVisivel}
												cdPais={1}
												value={nmCidadeVaga}
												onChange={(id, value) => {
													setFormDivulgaVagaWeb((prevForm) => ({ ...prevForm, [id]: value, ['ds_local_atuacao_internet']: value }))
												}}
											/>
										</div>
									</div>

									<div className='mt-2'>
										<Blockquote size={'sm'} type={'danger'}>
											Os dados aqui preenchidos serão utilizados para criação de uma imagem de
											divulgação da vaga nas Redes Sociais da RHBrasil. Tente ser o mais breve e
											direto possível!
										</Blockquote>
									</div>

									<div className={`mt-2`}>
										<InputTextArea
											label='Requisitos da vaga'
											id='ds_requisitos_internet'
											onChange={setFormDivulgaWebValues}
											required={isFieldDependent(formValidate.ds_requisitos_internet.dependsOn)}
											maxLength={199}
											helperText='Minimo 20'
											value={formDivulgaVagaWeb.ds_requisitos_internet}
											disabled={!formDivulgaVagaWeb.replica_descricao}
										/>
									</div>

									<div className={`mt-2`}>
										<InputTextArea
											label='Atividades da vaga'
											id='ds_atividades_internet'
											onChange={setFormDivulgaWebValues}
											required={isFieldDependent(formValidate.ds_atividades_internet.dependsOn)}
											maxLength={199}
											helperText='Minimo 20'
											value={formDivulgaVagaWeb.ds_atividades_internet}
											disabled={!formDivulgaVagaWeb.replica_descricao}
										/>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* DIVULGA REDES SOCIAIS*/}
					{tabControl == 'tab_divulga_redessociais' && (
						<DivulgaRedesSociais nrRequisicao={nrRequisicao} nrVaga={nrVaga} />
					)}

					{/* BENEFICIOS */}
					{tabControl == 'tab_beneficios' && (
						<div className={`col-span-12 md:col-span-9 pl-2 relative min-h-[500px]`}>
							<Loading active={!beneficiosReady} />
							<div
								className={`grid grid-cols-12 gap-y-3 pt-2 pb-[200px] ${beneficiosReady ? '' : 'hidden'
									}`}
							>
								<FabSave
									id={'save_beneficios'}
									onClick={updateBeneficios}
									className='top-[84%] right-3 md:right-[6%] lg:right-[10%]'
									disabled={isVagaCongelada}
								/>

								{/* aliemtacao */}
								<div className='col-span-12'>
									<div>
										<ButtonToggle
											id={'id_alimentacao'}
											primary
											onChange={setFormBeneficiosToggle}
											label={'Alimentação'}
											checked={formBeneficios.id_alimentacao}
											disabled={isVagaCongelada}
										/>
									</div>
									<div className={`${formBeneficios.id_alimentacao ? '' : 'hidden'}`}>
										<InputTextArea
											disabled={!formBeneficios.id_alimentacao || isVagaCongelada}
											label='Observações alimentação'
											id='ds_obs_alimentacao'
											onChange={setFormBeneficiosValues}
											maxLength={500}
											helperText='Minimo 5'
											value={formBeneficios.ds_obs_alimentacao}
										/>
									</div>
								</div>

								{/* transporte */}
								<div className='col-span-12 inline-flex gap-2'>
									<Select
										id={'id_transporte'}
										label={'Transporte'}
										onChange={setFormBeneficiosValues}
										options={[
											{ label: 'Não', value: 'N' },
											{ label: 'Coletivo', value: 'C' },
											{ label: 'Especial', value: 'E' },
										]}
										value={formBeneficios.id_transporte}
										disabled={isVagaCongelada}
									/>
									<Select
										id={'ds_obs_transporte'}
										label={'Desconto'}
										onChange={setFormBeneficiosValues}
										options={[
											{ value: '', label: 'Todos' },
											{
												value: 1,
												label: 'Percentual sobre total',
											},
											{
												value: 2,
												label: 'Valor total passes',
											},
											{
												value: 3,
												label: 'Desc. 6% salário',
											},
											{
												value: 4,
												label: 'Valor Fixo / Transp. Especial',
											},
										]}
										value={formBeneficios.ds_obs_transporte}
										disabled={isVagaCongelada}
									/>
								</div>

								{/* plano de saude */}
								<div className='col-span-12'>
									<div>
										<ButtonToggle
											id={'id_plano_saude'}
											primary
											onChange={setFormBeneficiosToggle}
											label={'Plano de Saúde'}
											checked={formBeneficios.id_plano_saude}
											disabled={isVagaCongelada}
										/>
									</div>
									<div className={`${formBeneficios.id_plano_saude ? '' : 'hidden'}`}>
										<InputTextArea
											disabled={!formBeneficios.id_plano_saude || isVagaCongelada}
											label='Observações do plano de saúde'
											id='ds_obs_plano_saude'
											onChange={setFormBeneficiosValues}
											maxLength={500}
											helperText='Minimo 5'
											value={formBeneficios.ds_obs_plano_saude}
										/>
									</div>
								</div>

								{/* plano odonto */}
								<div className='col-span-12'>
									<div>
										<ButtonToggle
											id={'id_plano_odontologico'}
											primary
											onChange={setFormBeneficiosToggle}
											label={'Plano odontológico'}
											checked={formBeneficios.id_plano_odontologico}
											disabled={isVagaCongelada}
										/>
									</div>
									<div className={`${formBeneficios.id_plano_odontologico ? '' : 'hidden'}`}>
										<InputTextArea
											disabled={!formBeneficios.id_plano_odontologico || isVagaCongelada}
											label='Observações do plano odontológico'
											id='ds_obs_plano_odontologico'
											onChange={setFormBeneficiosValues}
											maxLength={500}
											helperText='Minimo 5'
											value={formBeneficios.ds_obs_plano_odontologico}
										/>
									</div>
								</div>

								{/* previdencia privada */}
								<div className='col-span-12'>
									<ButtonToggle
										id={'id_previdencia_privada'}
										primary
										onChange={setFormBeneficiosToggle}
										label={'Previdência privada'}
										checked={formBeneficios.id_previdencia_privada}
										disabled={isVagaCongelada}
									/>
								</div>

								{/* auxilio creche */}
								<div className='col-span-12'>
									<ButtonToggle
										id={'id_auxilio_creche'}
										primary
										onChange={setFormBeneficiosToggle}
										label={'Auxilio creche'}
										checked={formBeneficios.id_auxilio_creche}
										disabled={isVagaCongelada}
									/>
								</div>

								{/* bolsa estudo */}
								<div className='col-span-12'>
									<ButtonToggle
										id={'id_bolsa_estudo'}
										primary
										onChange={setFormBeneficiosToggle}
										label={'Bolsa estudo'}
										checked={formBeneficios.id_bolsa_estudo}
										disabled={isVagaCongelada}
									/>
								</div>

								{/* farmacia */}
								<div className='col-span-12'>
									<div>
										<ButtonToggle
											id={'id_farmacia'}
											primary
											onChange={setFormBeneficiosToggle}
											label={'Farmácia'}
											checked={formBeneficios.id_farmacia}
											disabled={isVagaCongelada}
										/>
									</div>
									<div className={`${formBeneficios.id_farmacia ? '' : 'hidden'}`}>
										<InputTextArea
											disabled={!formBeneficios.id_farmacia || isVagaCongelada}
											label='Observações do convênio de farmácia'
											id='ds_obs_farmacia'
											onChange={setFormBeneficiosValues}
											maxLength={500}
											helperText='Min:imo 5'
											value={formBeneficios.ds_obs_farmacia}
										/>
									</div>
								</div>

								{/* vale refeicao */}
								<div className='col-span-12'>
									<div>
										<ButtonToggle
											id={'id_vale_refeicao'}
											primary
											onChange={setFormBeneficiosToggle}
											label={'Vale refeição'}
											checked={formBeneficios.id_vale_refeicao}
											disabled={isVagaCongelada}
										/>
									</div>
									<div className={`${formBeneficios.id_vale_refeicao ? '' : 'hidden'}`}>
										<InputTextArea
											disabled={!formBeneficios.id_vale_refeicao || isVagaCongelada}
											label='Observações do vale refeição'
											id='ds_obs_vale_refeicao'
											onChange={setFormBeneficiosValues}
											maxLength={500}
											helperText='Minimo 5'
											value={formBeneficios.ds_obs_vale_refeicao}
										/>
									</div>
								</div>

								{/* cesta basica */}
								<div className='col-span-12'>
									<div>
										<ButtonToggle
											id={'id_cesta_basica'}
											primary
											onChange={setFormBeneficiosToggle}
											label={'Cesta básica'}
											checked={formBeneficios.id_cesta_basica}
											disabled={isVagaCongelada}
										/>
									</div>
									<div className={`${formBeneficios.id_cesta_basica ? '' : 'hidden'}`}>
										<InputTextArea
											disabled={!formBeneficios.id_cesta_basica || isVagaCongelada}
											label='Observações da cesta basica'
											id='ds_obs_cesta_basica'
											onChange={setFormBeneficiosValues}
											maxLength={500}
											helperText='Minimo 5'
											value={formBeneficios.ds_obs_cesta_basica}
										/>
									</div>
								</div>

								{/* seguro de vida */}
								<div className='col-span-12'>
									<div>
										<ButtonToggle
											id={'id_seguro_vida'}
											primary
											onChange={setFormBeneficiosToggle}
											label={'Seguro de vida'}
											checked={formBeneficios.id_seguro_vida}
											disabled={isVagaCongelada}
										/>
									</div>
									<div className={`${formBeneficios.id_seguro_vida ? '' : 'hidden'}`}>
										<InputTextArea
											disabled={!formBeneficios.id_seguro_vida || isVagaCongelada}
											label='Observações do seguro de vida'
											id='ds_obs_seguro_vida'
											onChange={setFormBeneficiosValues}
											maxLength={500}
											helperText='Minimo 5'
											value={formBeneficios.ds_obs_seguro_vida}
										/>
									</div>
								</div>

								{/* ppr */}
								<div className='col-span-12'>
									<div>
										<ButtonToggle
											id={'id_possui_ppr'}
											primary
											onChange={setFormBeneficiosToggle}
											label={'PPR'}
											checked={formBeneficios.id_possui_ppr}
											disabled={isVagaCongelada}
										/>
									</div>
									<div className={`${formBeneficios.id_possui_ppr ? '' : 'hidden'}`}>
										<InputTextArea
											disabled={!formBeneficios.id_possui_ppr || isVagaCongelada}
											label='Observações do PPR'
											id='ds_obs_quotas_ppr'
											onChange={setFormBeneficiosValues}
											maxLength={500}
											helperText='Minimo 5'
											value={formBeneficios.ds_obs_quotas_ppr}
										/>
									</div>
								</div>
								<div className='col-span-12'>
									<InputTextArea
										label='Outros benefícios'
										id='ds_obs_outros_beneficios'
										onChange={setFormBeneficiosValues}
										maxLength={500}
										helperText='Minimo 5'
										value={formBeneficios.ds_obs_outros_beneficios}
										disabled={isVagaCongelada}
									/>
								</div>
							</div>
						</div>
					)}

					{/* Divulga autoatendimento */}
					{tabControl == 'tab_divulga_autoatendimento' && (
						<div className={`col-span-12 md:col-span-9 pl-2 relative min-h-[500px]`}>
							<Loading active={!divulgaAutoatendimentoReady} />
							<div
								className={`grid grid-cols-12 gap-2 pt-2 ${divulgaAutoatendimentoReady ? '' : 'hidden'
									}`}
							>
								<FabSave
									id={'update-autoatendimento'}
									onClick={updateAutoatendimento}
									className='top-[84%] right-3 md:right-[6%] lg:right-[10%] '
									disabled={isVagaCongelada}
								/>
								<div className='col-span-12'>
									<Select
										label={'Unidade'}
										options={[
											{ label: 'Não', value: 'N' },
											...unidadesAutoatendimento?.map(unidade => {
												return {
													value: unidade.CD_UNIDADE_AUTOATENDIMENTO,
													label: unidade.NM_UNIDADE_AUTOATENDIMENTO,
												}
											}),
										]}
										id='cd_unidade_autoatendimento'
										onChange={setformDivulgaAutoatendimentoValues}
										value={formDivulgaAutoatendimento.cd_unidade_autoatendimento}
										disabled={isVagaCongelada}
									/>
								</div>
								<div className='col-span-12'>
									<ButtonToggle
										id={'replica_descricao'}
										primary
										onChange={setFormDivulgaAutoatendimentoToggle}
										label={'Replicar essa descrição para todas as vagas desta requisição?'}
										checked={formDivulgaAutoatendimento.replica_descricao}
										disabled={isVagaCongelada}
									/>
								</div>
							</div>
						</div>
					)}

					{/* atualiza requisitante */}
					{tabControl == 'tab_requisitante_vaga' && (
						<div className={`col-span-12 md:col-span-9 pl-2 relative min-h-[500px]`}>
							<Loading active={!atualizaRequisitanteReady} />
							<div className={`${atualizaRequisitanteReady ? '' : 'hidden'}`}>
								<FabSave
									id={'save_requisitante'}
									onClick={updateRequisitante}
									className='top-[84%] right-3 md:right-[6%] lg:right-[10%] '
									disabled={isVagaCongelada}
								/>
								<InputText
									id={'nm_requisitante'}
									label='Requisitante'
									value={formRequisitanteVaga.nm_requisitante}
									onChange={(id, value) => {
										setFormRequisitanteVaga({
											...formRequisitanteVaga,
											nm_requisitante: value,
										})
									}}
									disabled={isVagaCongelada}
								/>
							</div>
						</div>
					)}

					{/* atualiza faturamento */}
					{tabControl == 'tab_faturamento_vaga' && (
						<div className={`col-span-12 md:col-span-9 pl-2 relative min-h-[500px]`}>
							<Loading active={!atualizaFaturamentoReady} />
							<div
								className={`${atualizaFaturamentoReady ? '' : 'hidden'} grid grid-cols-12 gap-2`}
							>
								<FabSave
									id={'save_faturamento'}
									onClick={updateFaturamento}
									className='top-[84%] right-3 md:right-[6%] lg:right-[10%] '
									disabled={isVagaCongelada}
								/>
								<div className='col-span-12 font-semibold'>
									<div className='flex flex-row gap-1'>
										Já faturado
										<p>
											<span className='text-primary'>{dadosFaturameto.PC_TOTAL_FATURADO}</span>%
										</p>
									</div>
								</div>
								
								{(dadosFaturameto.AD_PC_FATURAMENTO !== null && dadosFaturameto.AD_PC_FATURAMENTO !== undefined && dadosFaturameto.AD_PC_FATURAMENTO !== '' && dadosFaturameto.AD_PC_FATURAMENTO > 0) && (
									<div className='col-span-12 grid grid-cols-12 gap-2'>
										<div className='col-span-12 md:col-span-6'>
											<InputNumber
												label='Entrada:'
												id={'pc_adiantamento'}
												onChange={setFormFaturamentoValues}
												disabled={(trocaSituacao && dadosFaturameto.ID_ADIANTAMENTO_FATURADO === 'S') || isVagaCongelada}
												value={formFaturamento.pc_adiantamento}
											/>
										</div>
										<div className='col-span-12 md:col-span-6'>
											<InputDate
												label='Data de faturamento'
												id='dt_adiantamento'
												onChange={setFormFaturamentoValues}
												value={formFaturamento.dt_adiantamento}
												disabled={(trocaSituacao && dadosFaturameto.ID_ADIANTAMENTO_FATURADO === 'S') || isVagaCongelada}
												minDate={trocaSituacao ? amanha : ''}
											/>
										</div>
									</div>
								)}

								{(dadosFaturameto.PC_FAT_ENCAMINHAMENTO !== null && dadosFaturameto.PC_FAT_ENCAMINHAMENTO !== undefined && dadosFaturameto.PC_FAT_ENCAMINHAMENTO !== '' && dadosFaturameto.PC_FAT_ENCAMINHAMENTO > 0) && (
									<div className='col-span-12 grid grid-cols-12 gap-2'>
										<div className='col-span-12 md:col-span-6'>
											<InputNumber
												label='Mapeamento:'
												id={'pc_encaminhamento'}
												onChange={setFormFaturamentoValues}
												value={formFaturamento.pc_encaminhamento}
												disabled={(trocaSituacao && dadosFaturameto.ID_ENCAMINHAMENTO_FATURADO === 'S') || isVagaCongelada}
											/>
										</div>
										<div className='col-span-12 md:col-span-6'>
											<InputDate
												label='Data de faturamento'
												id='dt_encaminhamento'
												onChange={setFormFaturamentoValues}
												value={formFaturamento.dt_encaminhamento}
												disabled={(trocaSituacao && dadosFaturameto.ID_ENCAMINHAMENTO_FATURADO === 'S') || isVagaCongelada}
												minDate={trocaSituacao ? amanha : ''}
											/>
										</div>
									</div>
								)}
							
								<div className='col-span-12 grid grid-cols-12 gap-2'>
									<div className='col-span-12 md:col-span-6'>
										<InputNumber
											label='Total faturamento:'
											id={'pc_faturamento'}
											onChange={setFormFaturamentoValues}
											value={formFaturamento.pc_faturamento}
											min={detalhesVaga.FATURAMENTO?.PC_TOTAL_FATURADO}
											max={150}
											disabled={dadosFaturameto.ID_FECHAMENTO_FATURADO === 'S' || isVagaCongelada}
											helperText={faturamentoFechamento !== null ? `${faturamentoFechamento}% no fechamento` : null}
										/>
									</div>
									<div className='col-span-12 md:col-span-6'>
										<InputDate
											label='Data de faturamento'
											id='dt_faturamento'
											onChange={setFormFaturamentoValues}
											value={formFaturamento.dt_faturamento}
											disabled={dadosFaturameto.ID_FECHAMENTO_FATURADO === 'S' || isVagaCongelada}
											minDate={trocaSituacao ? amanha : ''}
										/>
									</div>
								</div>
							</div>
						</div>
					)}
					</div>
				</div>
			</div>
			<ModalGrid
				modalControl={confirmarDelecaoTelefoneAnalista}
				setModalControl={setConfirmarDelecaoTelefoneAnalista}
				btnCancel='Cancelar deleção'
				btnSubmit='Deletar telefone'
				title={`Deletar telefone de analista`}
				submitCallBack={handleDeletarTelefoneAnalista}
				size='sm'
				height='h-fit'
				width='w-fit'
			>
				<div className='text-center'>
					<p className='text-normal'>Tem certeza que deseja deletar o telefone do(a) analista?</p>
				</div>
			</ModalGrid>
			<Confirm
				visible={confirmarCancelamentoCongelada}
				setVisible={setConfirmarCancelamentoCongelada}
				btnAccept={'Entendi'}
				primaryText='Cancelar Vaga com Cobrança de Adiantamento'
				secondaryText='Antes de cancelar esta vaga, entre em contato com o financeiro para fazer o cancelamento da fatura do adiantamento/entrada.'
			/>
		</>
	)
}

export default EditInfoVaga
