import { faHistory, faLock, faUsers } from '@fortawesome/free-solid-svg-icons'
import { TooltipComponent } from '@/components/Layouts/TooltipComponent'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Pagination } from '@/components/Layouts/Pagination'
import NoDataFound from '@/components/Layouts/NoDataFound'
import { Caption } from '@/components/Layouts/Typography'
import PillsBadge from '@/components/buttons/PillsBadge'
import ModalGrid from '@/components/Layouts/ModalGrid'
import Clipboard from '@/components/Layouts/Clipboard'
import InputText from '@/components/inputs/InputText'
import { useAppContext } from '@/context/AppContext'
import Loading from '@/components/Layouts/Loading'
import Iframe from '@/components/Layouts/Iframe'
import Button from '@/components/buttons/Button'
import DetalhesVaga from './DetalhesVaga'
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

const TableEncaminhamentos = ({
    data,
    pageView,
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
}) => {
    const { pesquisaSelecionada, user } = useAppContext()
    const [filter, setFilter] = useState({ filtro_encaminhamentos: '' })
    const [modalCadastroCliente, setModalCadastroCliente] = useState(false)
    const [clienteOnView, setClienteOnView] = useState({})
    const [dataPagination, setDataPagination] = useState(null)

    useEffect(() => {
        if (data) {
            setDataPagination(data.slice(0, 50))
        }
    }, [data])

    const changePageAndData = useCallback(
        slicedData => {
            setDataPagination(slicedData)
        },
        [setDataPagination]
    )

    const setFilterTextCallback = useCallback(
        (id, value) => {
            setFilter(prevFilterVaga => ({
                ...prevFilterVaga,
                [id]: value,
            }))
        },
        [setFilter]
    )

    const tempData = useMemo(() => {
        if (!dataPagination) return []
        return dataPagination.filter(item =>
            Object.values(item)
        )
    }, [dataPagination, filter])

    useEffect(() => {
        if (Object.keys(pesquisaSelecionada) > 0) {
            setViewVaga(pesquisaSelecionada.nrVaga)
        }
    }, [pesquisaSelecionada])

    const setViewVaga = useCallback(nr_vaga => {
        setVagaDetalheOnView(nr_vaga)
    }, [])

    useEffect(() => {
        if (filter.filtro_encaminhamentos) {
            const filteredData = data.filter(item =>
                Object.values(item).some(
                    v =>
                        typeof v === 'string' &&
                        v.toLowerCase().includes(filter.filtro_encaminhamentos.toLowerCase())
                )
            )
            setDataPagination(filteredData.slice(0, 50))
            setFilteredData(filteredData)
        } else {
            setDataPagination(data.length > 0 ? data.slice(0, 50) : [])
            setFilteredData(data)
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

    const dataToHtml = useCallback(() => {
        if (isVagasLoading) return <Loading active={true} />
        if (!(tempData?.length > 0)) return <NoDataFound />

        return tempData?.map((row, index) => {
            return (
                <div
                    className={cn(
                        'grid grid-cols-12 odd:bg-white even:bg-gray-100 p-2 border-b border-slate-300 text-sm relative transition-all duration-300',
                        vagaDetalheOnView == row.NR_VAGA && 'shadow-custom-blue m-3 rounded'
                    )}
                    key={`row-${index}`}
                >
                    <div className='absolute top-7 right-2 transform z-10 border border-slate-300 gap-2 flex xl:flex-row lg:flex-col lg:-translate-y-4 '>
                        <TooltipComponent
                            content={
                                <>
                                    <span className='font-semibold'>Ver Candidatos</span>
                                </>
                            }
                            asChild
                        >
                            <div>
                                <Button
                                    buttonType='primary'
                                    size='small'
                                    outline
                                    square={true}
                                    onClick={() => {
                                        getCandidatosVaga(row.NR_VAGA, row.NM_CARGO)
                                    }}
                                    id={`btn_candidatos_vaga_${row.NR_VAGA}`}
                                    className={cn(nrVagaOnView == row.NR_VAGA && pageView == 'vaga' && 'bg-primary text-white')}
                                >
                                    <FontAwesomeIcon icon={faUsers} width='15' height='15' />
                                </Button>
                            </div>
                        </TooltipComponent>

                        <TooltipComponent
                            content={
                                <>
                                    <span className='font-semibold'>Ver Histórico</span>
                                </>
                            }
                            asChild
                        >
                            <div>
                                <Button
                                    buttonType='primary'
                                    size='small'
                                    square={true}
                                    outline
                                    onClick={() => {
                                        getHistoricoVaga(row.NR_VAGA, row.NM_CARGO)
                                    }}
                                    id={`btn_historico_vaga_${row.NR_VAGA}`}
                                    className={cn(nrVagaOnView == row.NR_VAGA && pageView == 'historico' && 'bg-primary text-white')}
                                >
                                    <FontAwesomeIcon icon={faHistory} width='15' height='15' />
                                </Button>
                            </div>
                        </TooltipComponent>
                    </div>

                    <div className='col-span-12 md:col-span-5'>
                        <div className='flex flex-row flex-wrap'>
                            <div className='flex flex-col w-[50px] xl:w-[60px]'>
                                <Caption>Vaga:</Caption>
                            </div>
                            <div
                                className='w-fit inline-flex items-center text-blue-600 cursor-pointer relative'
                            >
                                <Clipboard
                                    className={'hover:underline font-semibold'}
                                    onClick={() => {
                                        setViewVaga(row.NR_VAGA);
                                        setToggleView(toggleView !== null ? null : row.NR_VAGA);
                                    }}
                                >
                                    {row.NR_VAGA}
                                </Clipboard>
                            </div>
                            {row.ID_VAGA_SIGILOSA == "S" && (
                                <PillsBadge type="danger" className="inline-flex items-center ml-2">
                                    Sigilosa
                                    <FontAwesomeIcon icon={faLock} width="12" height="12" className='ml-1' />
                                </PillsBadge>
                            )}
                            {row.ID_VAGA_CONFIDENCIAL == "S" && (
                                <PillsBadge type="danger" className="inline-flex items-center ml-2">
                                    Confidencial
                                    <FontAwesomeIcon icon={faLock} width="12" height="12" className='ml-1' />
                                </PillsBadge>
                            )}
                        </div>

                        <div className="flex flex-row flex-wrap py-0.5">
                            <div className="flex flex-col w-[60px]">
                                <Caption>Data:</Caption>
                            </div>
                            <div className="w-fit">
                                <span className="font-semibold">{row.DT_ENCAMINHAMENTO}</span>
                            </div>
                        </div>

                        <div className="flex flex-row flex-wrap py-0.5">
                            <div className="flex flex-col w-[60px]">
                                <Caption>Status:</Caption>
                            </div>
                            <div className="w-fit">
                                <PillsBadge small type={getSituacaoVagaClass(row.CD_SITUACAO_VAGA)}>
                                    {row.NM_SITUACAO_VAGA}
                                </PillsBadge>
                            </div>
                        </div>
                    </div>

                    <div className='col-span-12 md:col-span-7'>
                        <div className="flex flex-row flex-wrap py-0.5">
                            <div className="flex flex-col w-[60px]">
                                <Caption>Estagio:</Caption>
                            </div>
                            <div className="w-fit">
                                <span className="font-semibold">{`${row.CD_ESTAGIO_VAGA} - ${row.NM_ESTAGIO_VAGA}`}</span>
                            </div>
                        </div>

                        <div className="flex flex-row flex-wrap py-0.5">
                            <div className="flex flex-col w-[60px]">
                                <Caption>Cargo:</Caption>
                            </div>
                            <div className="w-fit">
                                <span className="font-semibold">{row.NM_CARGO}</span>
                            </div>
                        </div>

                        <div className="flex flex-row flex-wrap py-0.5">
                            <div className="flex flex-col w-[60px]">
                                <Caption>Cliente:</Caption>
                            </div>
                            <div className="w-fit">
                                <span className="font-semibold">{row.NM_APELIDO}</span>
                            </div>
                        </div>
                    </div>

                    {vagaDetalheOnView == row.NR_VAGA && (
                        <div className='col-span-12 transition-all duration-500 ease-in-out h-auto min-h-6'>
                            <DetalhesVaga
                                nrVaga={row.NR_VAGA}
                                nmCargo={row.NM_CARGO}
                                init
                                enableEdit
                                toggleView={toggleView}
                                setToggleView={setToggleView}
                            />
                        </div>
                    )}
                </div>
            )
        })
    }, [tempData, vagaDetalheOnView, nrVagaOnView, toggleView, setToggleView, pageView])

    useEffect(() => {
        return () => {
            setVagaDetalheOnView(null)
        }
    }, []);

    return (
        <>
            <div className='flex flex-col bg-white'>
                <div className='flex items-center gap-2 w-full justify-end border-b-2'>
                    <div className='flex justify-end mb-4'>
                        <Pagination data={filteredData} callBackChangePage={changePageAndData} size='sm' />
                    </div>
                    <div className='flex flex-col items-end p-0.5 xl:py-2 w-1/2 xl:w-1/4'>
                        <InputText
                            className={`p-1.5 text-xs xl:p-2 xl:text-sm`}
                            placeholder='Filtrar'
                            clearable={true}
                            helperText={`Exibindo ${tempData.length} registros`}
                            onChange={setFilterTextCallback}
                            id='filtro_encaminhamentos'
                        />
                    </div>
                </div>
                <div className={`flex-1 ${customHeight || 'max-h-[75vh]'} overflow-y-auto pb-48`}>
                    {dataToHtml()}
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
        </>
    )
}

export default TableEncaminhamentos
