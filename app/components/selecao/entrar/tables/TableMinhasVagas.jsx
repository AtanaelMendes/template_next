import { faHistory, faLock, faUserEdit, faUsers, faWheelchair, faStar, faFaceMeh, faFaceGrinWide, faFaceFrownOpen } from '@fortawesome/free-solid-svg-icons'
import { TooltipComponent } from '@/components/Layouts/TooltipComponent'
import { DebouncedSearch } from '@/components/inputs/DebouncedSearch'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SortControl } from '@/components/Layouts/SortControl'
import { Pagination } from '@/components/Layouts/Pagination'
import { Caption } from '@/components/Layouts/Typography'
import ButtonToggle from '@/components/buttons/ButtonToggle'
import PillsBadge from '@/components/buttons/PillsBadge'
import NoDataFound from '../../../Layouts/NoDataFound'
import ModalGrid from '@/components/Layouts/ModalGrid'
import Clipboard from '@/components/Layouts/Clipboard'
import InputText from '@/components/inputs/InputText'
import { useAppContext } from '@/context/AppContext'
import Select2 from '@/components/inputs/Select2'
import Iframe from '@/components/Layouts/Iframe'
import Button from '@/components/buttons/Button'
import axiosInstance from '@/plugins/axios'
import DetalhesVaga from '../DetalhesVaga'
import { Popover } from 'flowbite-react'
import { toast } from 'react-toastify'
import { cn } from '@/assets/utils'

const REQUISICAO_CRIADA = 0
const ABERTA = 1
const CANCELADA = 5
const FECHADA = 6
const CLIENTE = 7
const CANCELADA_COM_SELECAO_SEM_CANDIDATO = 8
const CANCELADA_COM_FATURAMENTO = 9
const BLOQUEADO = 10
const COMERCIAL = 11
const PROSPECCAO = 12
const CONGELADA = 13

const TableMinhasVagas = ({
	data,
	isVagasLoading,
	active,
	customHeight,
	getHistoricoVaga,
	getCandidatosVaga,
	vagaDetalheOnView,
	setVagaDetalheOnView,
	setFilteredData,
	filteredData,
	nrVagaOnView,
	toggleView,
	setToggleView,
	setPageView,
	pageView,
	closeRightWindow,
	refreshTab,
	isRecrutamento,
	renderizadoPorGerencial,
	atualizaDetalhesVaga
}) => {
	const { pesquisaSelecionada, user, sendWebSocketMessage } = useAppContext();
	const [filter, setFilter] = useState({ filtro_minhas_vagas: '' });
	const [modalCadastroCliente, setModalCadastroCliente] = useState(false);
	const [modalAlteraAnalista, setModalAlteraAnalista] = useState(false);
	const [clienteOnView, setClienteOnView] = useState({});
	const [dataPagination, setDataPagination] = useState(null);
	const [analistaVaga, setAnalistaVaga] = useState(null);
	const [analistaSelecionado, setAnalistaSelecionado] = useState(null);
	const [nrVagaEdit, setNrVagaEdit] = useState(null);
	const [reloadDetalhesVaga, setReloadDetalhesVaga] = useState(false);
	const [idRecrutamento, setIdRecrutamento] = useState('N');
	const [nrRequisicao, setNrRequisicao] = useState(null);
	const [applySort, setApplySort] = useState(false);
	const [listCdPessoaRecrutamento, setListCdPessoaRecrutamento] = useState([]);

	useEffect(() => {
		axiosInstance.get(`analista/aviso-recrutamento/${user.cd_unid}`)
			.then(response => {
				if (response.status === 200) {
					setListCdPessoaRecrutamento(response.data);
				}
			})
			.catch(error => {
				toast.error('Erro ao carregar analistas de recrutamento: ' + error.message);
			});
	}, []);

	const setFormTipoVagaRecSelToggle = (id, value, checked) => {
		setIdRecrutamento(checked ? 'S' : 'N')
	}

	useEffect(() => {
		if (data) {
			setDataPagination(data.slice(0, 50))
		}
	}, [data])

	useEffect(() => {
		//Atualiza os detalhes da vaga para refletir alteração do analista
		if (atualizaDetalhesVaga) {
			setReloadDetalhesVaga(true);
			setTimeout(() => {
				setReloadDetalhesVaga(false);
			}, 300);
		}
	}, [atualizaDetalhesVaga])

	const changePageAndData = useCallback(
		slicedData => {
			setDataPagination(slicedData)
		},
		[setDataPagination]
	)

	const setFilterTextCallback = (id, value) => {
		setFilter(prevFilterVaga => ({
			...prevFilterVaga,
			[id]: value,
		}))
	}

	const setVagaSigilosa = (requisicao, value) => {
		//Altera o objeto original para não precisar fazer uma nova pesquisa
		data.map((item) => {
			if (item.nr_requisicao === requisicao) {
				item.id_vaga_sigilosa = value;
				item.id_esconde_info_sigilosa = value;
			}
		});

		//Atualiza a paginação para refletir a alteração
		setDataPagination(data.slice(0, 50))
	}

	const setVagaConfidencial = (requisicao, value) => {
		//Altera o objeto original para não precisar fazer uma nova pesquisa
		data.map((item) => {
			if (item.nr_requisicao === requisicao) {
				item.id_vaga_confidencial = value;
			}
		});

		//Atualiza a paginação para refletir a alteração
		setDataPagination(data.slice(0, 50))
	}

	const viewCadastroCliente = (cdPessoaCliente, cd_empresa_agrupadora) => {
		//essa merda chamada "pro" é pra definir a tela de onde o cadastro do cliente é chamado e definir o botao de voltar da tela.
		//no caso adicionei o 3 chamada novo saas o botao nao deve aparecer

		setClienteOnView({
			cd: cdPessoaCliente,
			cd_unid: cd_empresa_agrupadora,
			cd_empresa_usuario: user.cd_unid,
			pro: 3,
			codigo: '13y'
		})

		setModalCadastroCliente(true)
	}

	//Abre a modal de alteração de analista
	const alterarAnalistaVaga = (nrVaga, idRecrutamento, nrRequisicao) => {
		axiosInstance.get(`vaga/info-analista-vaga/${nrVaga}`)
			.then(response => {
				if (response.status === 200) {
					setAnalistaVaga(response.data.CD_PESSOA);
				}
			})
			.catch(error => {
				toast.error('Erro ao carregar analistas de recrutamento: ' + error.message);
			});

		setNrVagaEdit(nrVaga);
		closeRightWindow();
		setPageView('analista');
		setModalAlteraAnalista(true);
		setNrRequisicao(nrRequisicao);
		setIdRecrutamento(idRecrutamento ?? 'N');
	}


	//Salva o novo analista
	const salvarAnalistaVaga = () => {
		const salvarAnalista = (analistaVaga !== analistaSelecionado);

		axiosInstance
			.post(`vaga/${nrVagaEdit}/alterar-analista-vaga`, {
				cd_pessoa_analista: analistaSelecionado,
				nr_requisicao: nrRequisicao,
				id_recrutamento: idRecrutamento,
				salvar_analista: salvarAnalista
			})
			.then(response => {
				if (response.status === 200) {
					toast.success(response.data.message)
				}

				sendWebSocketMessage('vaga', user.cd_sip);

				if (idRecrutamento === 'S' && listCdPessoaRecrutamento.includes(analistaSelecionado)) {
					sendWebSocketMessage('vagaRecrutamento', user.cd_sip);
				}

				setAnalistaVaga(analistaSelecionado);
				setModalAlteraAnalista(false);
				setNrVagaEdit(null);
				if (typeof refreshTab === 'function') {
					refreshTab();
				}

				data.map((row) => {
					if (row.nr_vaga === nrVagaEdit) {
						row.id_recrutamento = idRecrutamento;
					}
				});

				setIdRecrutamento('N');
				setNrRequisicao(null);
			})
	}

	const tempData = useMemo(() => {
		if (!dataPagination) return []
		return dataPagination.map(item => ({
			...item,
			nr_requisicao: item.nr_requisicao || '',
		})).filter(item =>
			Object.values(item)
		)
	}, [dataPagination, filter])

	useEffect(() => {
		if (Object.keys(pesquisaSelecionada) > 0) {
			setViewVaga(pesquisaSelecionada.nrVaga)
		}
	}, [pesquisaSelecionada])

	const setViewVaga = (nr_vaga) => {
		setVagaDetalheOnView(nr_vaga)
	}

	useEffect(() => {
		if (filter.filtro_minhas_vagas) {
			const filteredData = data.filter(item =>
				Object.values(item).some(
					v =>
						typeof v === 'string' &&
						v.toLowerCase().includes(filter.filtro_minhas_vagas.toLowerCase())
				)
			)
			setDataPagination(filteredData.slice(0, 50))
			setFilteredData(filteredData)
		} else {
			setDataPagination(data.length > 0 ? data.slice(0, 50) : [])
			setFilteredData(data)
		}

		//Caso a pesquisa retorne resultados, aplica a ordenação quando algum filtro for alterado
		if (data.length > 0) {
			setApplySort(true);
		}
	}, [filter, data, setFilteredData])

	function getSituacaoVagaClass(cdSituacaoVaga) {
		let classSituacoaoVaga = ''
		switch (parseInt(cdSituacaoVaga)) {
			case REQUISICAO_CRIADA:
			case ABERTA:
				classSituacoaoVaga = 'success'
				break
			case FECHADA:
			case CANCELADA:
			case BLOQUEADO:
			case CANCELADA_COM_FATURAMENTO:
			case CANCELADA_COM_SELECAO_SEM_CANDIDATO:
				classSituacoaoVaga = 'danger'
				break
			case CLIENTE:
			case COMERCIAL:
				classSituacoaoVaga = 'warning'
				break
			case PROSPECCAO:
				classSituacoaoVaga = 'primary'
				break
			default:
				classSituacoaoVaga = 'primary'
				break
		}
		return classSituacoaoVaga
	}
	// TODO : refatorar aqui utilizar usememo.
	const dataToHtml = useCallback(() => {
		if (!(tempData?.length > 0)) return <NoDataFound isLoading={isVagasLoading} />

		return tempData?.map((row, index) => {
			return (
				<div
					className={cn(
						'grid grid-cols-12 odd:bg-white even:bg-gray-100 p-2 border-b border-slate-300 text-sm relative transition-all duration-300',
						vagaDetalheOnView == row.nr_vaga && 'shadow-custom-blue m-3 rounded'
					)}
					key={`row-${index}`}
				>
					<div className={'absolute top-2 right-11 transform z-10 border border-slate-300 gap-2'}>
						<TooltipComponent content={<span className='font-semibold'>Alterar Analista</span>} asChild>
							<div>
								<Button
									buttonType='primary'
									size='small'
									square={true}
									outline
									disabled={![ABERTA, CONGELADA].includes(Number(row?.cd_situacao_vaga))}
									onClick={() => { alterarAnalistaVaga(row.nr_vaga, row.id_recrutamento, row.nr_requisicao); }}
									id={`btn_historico_vaga_${row.nr_vaga}`}
									className={cn(nrVagaEdit == row.nr_vaga && pageView == 'analista' && 'bg-primary text-white')}
								>
									<FontAwesomeIcon icon={faUserEdit} width='15' height='15' />
								</Button>
							</div>
						</TooltipComponent>
					</div>

					<div className='absolute top-2 right-2 transform z-10 gap-1 '>
						<div className='border border-slate-300'>
							<TooltipComponent
								content={<span className='font-semibold'>Ver Candidatos</span>}
								asChild
							>
								<div>
									<Button
										buttonType='primary'
										size='small'
										outline
										square={true}
										onClick={() => {
											getCandidatosVaga(row.nr_vaga, row.nm_cargo)
										}}
										id={`btn_candidatos_vaga_${row.nr_vaga}`}
										className={cn(nrVagaOnView == row.nr_vaga && pageView == 'vaga' && 'bg-primary text-white')}
									>
										<FontAwesomeIcon icon={faUsers} width='15' height='15' />
									</Button>
								</div>
							</TooltipComponent>
						</div>
						<div className='border border-slate-300 mt-1'>
							<TooltipComponent
								content={<span className='font-semibold'>Ver Histórico</span>}
								asChild
							>
								<div>
									<Button
										buttonType='primary'
										size='small'
										square={true}
										outline
										onClick={() => {
											getHistoricoVaga(row.nr_vaga, row.nm_cargo)
										}}
										id={`btn_historico_vaga_${row.nr_vaga}`}
										className={cn(nrVagaOnView == row.nr_vaga && pageView == 'historico' && 'bg-primary text-white')}
									>
										<FontAwesomeIcon icon={faHistory} width='15' height='15' />
									</Button>
								</div>
							</TooltipComponent>
						</div>
					</div>

					<div className='col-span-12 md:col-span-6'>
						<div className='flex flex-row flex-wrap'>
							<div className='flex flex-col w-[50px] xl:w-[80px]'>
								<Caption>Vaga:</Caption>
							</div>
							<Popover className='shadow-2xl bg-slate-50 border rounded-lg z-50'
								content={
									<div className='p-2 text-blue-600 font-semibold'>
										<p><strong>Centro de Custo:</strong> {row?.nm_centro_custo}</p>
										<p><strong>Turno:</strong> {row?.cd_turno}</p>
										<p><strong>Horário:</strong> {row?.nm_turno}</p>
									</div>
								}
								trigger="hover"
							>
								<div
									className='w-fit inline-flex items-center text-blue-600 cursor-pointer relative'
								>
									<Clipboard
										className={'hover:underline font-semibold'}
										onClick={() => {
											setViewVaga(row.nr_vaga);
											setToggleView(toggleView !== null ? null : row.nr_vaga);
										}}
									>
										{row.nr_vaga}
									</Clipboard>
								</div>
							</Popover>

							{row.tipo_contratacao && row.tipo_contratacao_string && (

								<TooltipComponent
									content={<span className='font-semibold'>{row.tipo_contratacao_string}</span>}
									asChild
								>
									<div>
										<PillsBadge type="default" className="inline-flex items-center ml-2">
											{row.tipo_contratacao}
										</PillsBadge>
									</div>
								</TooltipComponent>
							)}

							{row.id_vaga_sigilosa == "S" && (
								<PillsBadge type="danger" className="inline-flex items-center ml-2">
									Sigilosa
									<FontAwesomeIcon icon={faLock} width="12" height="12" className='ml-1' />
								</PillsBadge>
							)}
							{row.id_vaga_confidencial == "S" && (
								<PillsBadge type="danger" className="inline-flex items-center ml-2">
									Confidencial
									<FontAwesomeIcon icon={faLock} width="12" height="12" className='ml-1' />
								</PillsBadge>
							)}
							{row.id_vaga_pcd == "S" && (
								<PillsBadge
									type="warning"
									className="inline-flex items-center ml-2"
								>
									PCD
									<FontAwesomeIcon
										icon={faWheelchair}
										width="12"
										height="12"
										className='ml-1'
									/>
								</PillsBadge>
							)}
						</div>

						<div className='flex flex-row flex-wrap mt-0.5 xl:mt-1'>
							<div className='flex flex-col w-[50px] xl:w-[80px]'>
								<Caption>Cargo:</Caption>
							</div>
							<div className='w-fit'>
								<span className='italic'>{row.nm_cargo}</span>
							</div>
						</div>

						<div className='flex flex-row flex-wrap mt-0.5 xl:mt-1'>
							<div className='flex flex-col w-[50px] xl:w-[80px]'>
								<Caption>Cliente:</Caption>
							</div>
							{row.id_esconde_info_sigilosa == "S" ? (
								<div
									className='w-fit inline-flex items-center text-primary'
								>
									<span className='font-semibold'>Informação Sigilosa</span>
								</div>
							) : (
								<div
									className='w-fit inline-flex items-center cursor-pointer text-primary hover:underline'
									onClick={() => viewCadastroCliente(row.cd_pessoa_cliente, row.cd_empresa_agrupadora)}
								>
									<span className='font-semibold'>{row.nm_apelido_cliente}</span>
								</div>
							)}
						</div>
					</div>

					<div className='col-span-12 md:col-span-6'>
						<div className='flex flex-row flex-wrap'>
							<div className='flex flex-col w-[100px]'>
								<Caption>Candidatos:</Caption>
							</div>
							<div className='w-fit'>
								{row.candidato_aprovado >= 1 ? (
									<Popover className='shadow-xl bg-slate-50 border border-slate-300 rounded-lg z-50 text-sm'
										content={
											<div className='max-w-50'>
												<div className='p-2 text-slate-600 font-semibold text-center'>
													<p>Já existe um candidato</p>
													<p>aprovado para esta vaga</p>
												</div>
												<div className='grid grid-cols-12 ms-4 mb-2'>
													<div className='col-span-3'>
														<p><PillsBadge small type='primary' className='mt-2 mr-4'>{row.qtd_candidatos_relacionados} </PillsBadge></p>
													</div>

													<div className='col-span-9'>
														Relacionado
													</div>

													<div className='col-span-3'>
														<p><PillsBadge small type='primary' className='mt-2 mr-4'>{row.qtd_candidatos_web} </PillsBadge></p>
													</div>

													<div className='col-span-9'>
														Candidatos Web
													</div>

													<div className='col-span-3'>
														<p><PillsBadge small type='primary' className='mt-2 mr-4'>{row.qtd_candidatos_descartados} </PillsBadge></p>
													</div>

													<div className='col-span-9'>
														Descartados
													</div>
												</div>
											</div>
										}
										trigger="hover"
									>
										<div type='primary'>
											<FontAwesomeIcon icon={faStar} width='16' height='16' className='text-yellow-400' />
										</div>
									</Popover>
								) : (
									<PillsBadge small type={row.qt_candidatos_estagio > 0 ? 'primary' : 'default'}>
										{row.qt_candidatos_estagio}
									</PillsBadge>
								)}
							</div>
						</div>

						<div className='flex flex-row flex-wrap mt-0.5 xl:mt-1'>
							<div className='flex flex-col w-[100px]'>
								<Caption>Status:</Caption>
							</div>
							<div className='w-fit'>
								<TooltipComponent 
									content={row.cd_situacao_vaga == CONGELADA ? 'AGUARDANDO PGTO ADTO' : row.nm_situacao_vaga} 
									asChild
								>
									<div>
										<PillsBadge small type={getSituacaoVagaClass(row.cd_situacao_vaga)}>
											{row.nm_situacao_vaga}
										</PillsBadge>
									</div>
								</TooltipComponent>
							</div>
						</div>

						<div className='flex flex-row flex-wrap mt-0.5 xl:mt-1'>
							<div className='flex flex-col w-[100px]'>
								<Caption>Dias aberta:</Caption>
							</div>
							<div className='w-fit flex gap-1'>
								<Popover className='shadow-xl bg-slate-50 border border-slate-300 rounded-lg z-50 text-sm'
									content={
										<div className='max-w-50'>
											<div className='p-2 text-slate-600 font-semibold text-center'>
												<p>{`Aberta a ${row.qt_dias_abertura} dias.`}</p>
												<p>{`Há ${row.qt_dias_estacionada} dias estacionada.`}</p>
											</div>
										</div>
									}
									trigger="hover"
								>
									<FontAwesomeIcon
										width='16'
										height='16'
										icon={row.qt_dias_estacionada <= 5 ? faFaceGrinWide : (row.qt_dias_estacionada <= 10 ? faFaceMeh : faFaceFrownOpen)}
										className={row.qt_dias_estacionada <= 5 ? 'text-green-500' : (row.qt_dias_estacionada <= 10 ? 'text-orange-400' : 'text-red-500')}
									/>
								</Popover>
							</div>
						</div>
					</div>

					{vagaDetalheOnView == row.nr_vaga && (
						<div className='col-span-12 transition-all duration-500 ease-in-out h-auto min-h-6'>
							<DetalhesVaga
								nrVaga={row.nr_vaga}
								nmCargo={row.nm_cargo}
								init
								enableEdit
								toggleView={toggleView}
								setToggleView={setToggleView}
								reload={reloadDetalhesVaga}
								isRecrutamento={isRecrutamento}
								setVagaSigilosa={setVagaSigilosa}
								setVagaConfidencial={setVagaConfidencial}
								renderizadoPorGerencial={renderizadoPorGerencial}
							/>
						</div>
					)}
				</div>
			)
		})
	}, [tempData, vagaDetalheOnView, nrVagaOnView, toggleView, setToggleView, pageView, reloadDetalhesVaga])

	useEffect(() => {
		return () => {
			setVagaDetalheOnView(null)
		}
	}, []);

	return (
		<>
			<div className='flex flex-col bg-whitep'>
				<div className='flex items-center gap-2 w-full justify-end border-b-2 pb-4'>
					<div className='flex justify-end'>
						<SortControl
							configOptions={[
								{ label: 'Analista', field: 'nm_pessoa_analista', type: 'string' },
								{ label: 'Cargo', field: 'nm_cargo', type: 'string' },
								{ label: 'Cliente', field: 'nm_apelido_cliente', type: 'string' },
								{ label: 'Tipo', field: 'tipo_contratacao', type: 'string' },
								{ label: 'Candidato Aprovado', field: 'candidato_aprovado', type: 'number' },
								{ label: 'Dias Estacionada', field: 'qt_dias_estacionada', type: 'number' },
							]}
							applySort={applySort}
							dataObject={filteredData}
							setApplySortFn={setApplySort}
							setSortedDataFn={setFilteredData}
						/>
					</div>
					<div className='flex flex-col items-end p-0.5 xl:py-2 w-1/3 xl:w-1/4'>
						<InputText
							placeholder='Filtrar'
							clearable={true}
							helperText={`Exibindo ${tempData.length} de ${filteredData?.length}`}
							onChange={setFilterTextCallback}
							id='filtro_minhas_vagas'
						/>
					</div>
				</div>
				<div className={`flex-1 ${customHeight || 'max-h-[75vh]'} overflow-y-auto pb-48`}>
					{dataToHtml()}
				</div>
				<div className='flex justify-center mb-4'>
					<Pagination data={filteredData} callBackChangePage={changePageAndData} size='sm' />
				</div>
			</div>

			<ModalGrid
				size='full'
				btnCancel={'FECHAR'}
				footerClass='text-right'
				closeModalCallback={() => {
					setClienteOnView({})
				}}
				modalControl={modalCadastroCliente}
				setModalControl={setModalCadastroCliente}
				title='Dados do Cliente'
			>
				<div className='flex-1'>
					<Iframe
						active={active && clienteOnView}
						id='iframe_cadastro_cliente'
						src='rhbsaas/ger_v2/prospects_edit.php'
						params={clienteOnView}
						className={'h-[80vh]'}
						visible={modalCadastroCliente}
					/>
				</div>
			</ModalGrid>

			{/* Modal para alteração do Analista */}
			<ModalGrid
				size='sm'
				btnCancel={'CANCELAR'}
				btnSubmit={'SALVAR'}
				headerClass='py-3 px-4'
				contentClass='py-3 px-4'
				footerClass='py-1 px-4'
				submitCallBack={() => {
					salvarAnalistaVaga();
					setReloadDetalhesVaga(true);
					setTimeout(() => {
						setReloadDetalhesVaga(false);
					}, 300);
				}}
				closeModalCallback={() => {
					setModalAlteraAnalista(false);
					setPageView('');
				}}
				modalControl={modalAlteraAnalista}
				setModalControl={setModalAlteraAnalista}
				title={`Alterar Analista - Vaga ${nrVagaEdit}`}
			>
				<div>
					<DebouncedSearch.Root>
						<DebouncedSearch.Select
							onChange={value => { setAnalistaSelecionado(value) }}
							value={analistaVaga}
							urlGet={`analista/selecionadores/${nrVagaEdit}`}
							optId={'CD_PESSOA_ANALISTA'}
							optLabel={'NM_PESSOA_ANALISTA'}
							elevateMenu={true}
						/>
					</DebouncedSearch.Root>

					<div className='flex-row mt-2'>
						<ButtonToggle
							primary
							label='Recrutamento'
							id={'id_recrutamento'}
							onChange={setFormTipoVagaRecSelToggle}
							checked={idRecrutamento == 'S'}
						/>
					</div>

				</div>
			</ModalGrid>
		</>
	)
}

export default TableMinhasVagas