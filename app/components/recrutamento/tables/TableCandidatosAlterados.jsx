import { useCallback, useEffect, useMemo, useState } from 'react'
import { SortControl } from '@/components/Layouts/SortControl'
import { Pagination } from '@/components/Layouts/Pagination'
import { Caption } from '@/components/Layouts/Typography'
import PillsBadge from '@/components/buttons/PillsBadge'
import NoDataFound from '../../Layouts/NoDataFound'
import InputText from '@/components/inputs/InputText'
import { format } from 'date-fns'
import Clipboard from '@/components/Layouts/Clipboard'
import CurriculoResumido from '@/components/candidatos/CurriculoResumido'

const TableCandidatosAlterados = ({
    data,
    isCandidatoLoading,
    customHeight,
    setFilteredData,
    filteredData,
}) => {
    const [filter, setFilter] = useState({ filtro_candidatos_alterados: '' });
    const [dataPagination, setDataPagination] = useState(null);
    const [applySort, setApplySort] = useState(false);
    const [cdPessoaCurriculoResumido, setCdPessoaCurriculoResumido] = useState("");
    const curriculoResumidoCallback = () => setCdPessoaCurriculoResumido("");

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

    const setFilterTextCallback = (id, value) => {
        setFilter(prevFilterCandidato => ({
            ...prevFilterCandidato,
            [id]: value,
        }))
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
        if (filter.filtro_candidatos_alterados) {
            const filteredData = data.filter(item =>
                Object.values(item).some(
                    v =>
                        typeof v === 'string' &&
                        v.toLowerCase().includes(filter.filtro_candidatos_alterados.toLowerCase())
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

    const dataToHtml = useCallback(() => {
        if (isCandidatoLoading || tempData.length === 0) return (
            <div className="w-full flex items-center justify-start py-8">
                <NoDataFound isLoading={isCandidatoLoading} />
            </div>
        )

        return (
            <div className="flex flex-col divide-y divide-slate-200">
                {tempData.map((row, index) => (
                    <div
                        key={`row-${index}`}
                        className="flex flex-row items-center gap-4 bg-white hover:bg-slate-50 transition-colors px-4 py-3"
                    >
                        <div className="flex flex-col min-w-[130px] text-xs text-slate-500">
                            <Caption>Código:</Caption>
                            <Clipboard className={'hover:underline font-semibold text-blue-600'}>
                                {row.CD_PESSOA}
                            </Clipboard>
                        </div>
                        <div className="flex-1 flex flex-col min-w-0">
                            <Caption>Nome:</Caption>
                            <span
                                className="font-bold text-blue-600 truncate text-sm cursor-pointer hover:underline"
                                onClick={() => setCdPessoaCurriculoResumido(row.CD_PESSOA)}
                            >
                                {row.NM_PESSOA}
                            </span>
                        </div>
                        <div className="flex-1 flex flex-col min-w-0">
                            <Caption>Analista:</Caption>
                            <span className="font-bold text-slate-600 truncate text-sm">
                                {row.NM_USUARIO || 'Não informado'}
                            </span>
                        </div>
                        <div className="flex flex-col min-w-[140px] text-xs text-slate-500">
                            <Caption>{row.ID_TIPO_OPERACAO === 'A' ? 'Alterado' : 'Criado'}:</Caption>
                            <span className="text-slate-700 font-medium">{row.CRIADO_EM}</span>
                        </div>
                    </div>
                ))}
            </div>
        );
    }, [tempData, isCandidatoLoading]);

    return (
        <>
            <CurriculoResumido cdPessoaCandidato={cdPessoaCurriculoResumido} closeCallback={curriculoResumidoCallback} tabName={"relatorioCandidatosAlterados"} />
            <div className="grid grid-rows-[auto,auto,1fr,auto] bg-white h-full">
                {/* Header */}
                <div className="flex items-center gap-2 w-full justify-end border-b-2">
                    <div className="flex-1 flex items-center gap-4 px-4 py-2">
                        <span className="text-base font-semibold text-slate-700">Candidatos</span>
                    </div>
                    <div className="flex justify-end mb-2">
                        <SortControl
                            configOptions={[
                                { label: 'Código', field: 'CD_PESSOA', type: 'int' },
                                { label: 'Nome', field: 'NM_PESSOA', type: 'string' },
                                { label: 'Analista', field: 'NM_USUARIO', type: 'string' },
                                { label: 'Criado Em', field: 'CRIADO_EM', type: 'date' },
                            ]}
                            applySort={applySort}
                            dataObject={filteredData}
                            setApplySortFn={setApplySort}
                            setSortedDataFn={setFilteredData}
                        />
                    </div>
                    <div className="flex flex-col items-end p-0.5 xl:py-2 w-1/3 xl:w-1/4">
                        <InputText
                            className={`p-1.5 text-xs xl:p-2 xl:text-sm`}
                            placeholder="Filtrar"
                            clearable={true}
                            helperText={`Exibindo ${tempData.length} de ${filteredData?.length}`}
                            onChange={setFilterTextCallback}
                            id="filtro_candidatos_alterados"
                        />
                    </div>
                </div>
                <div className={`overflow-y-auto pb-48 ${customHeight || 'max-h-[75vh]'}`}> 
                    {dataToHtml()}
                </div>
                <div className="flex justify-end mb-4 mr-4">
                    <Pagination data={filteredData} callBackChangePage={changePageAndData} size="sm" />
                </div>
            </div>
        </>
    )
}

export default TableCandidatosAlterados