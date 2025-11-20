import { Caption, Title } from "@/components/Layouts/Typography"
import { useCallback, useEffect, useMemo, useState } from "react";
import NoDataFound from "@/components/Layouts/NoDataFound";
import InputText from "@/components/inputs/InputText";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Layouts/Loading";
import axiosInstance from "@/plugins/axios";
import { empty } from "@/assets/utils";

// este datatable tem no maximo 12 colunas
const TableVagasEncaminhado = ({ cdPessoaCandidato, nmCandidato, maxHeight, addPageTabsFunc, init }) => {
    const { toast } = useAppContext();
    const [tableData, setTableData] = useState([]);
    const [ready, setReady] = useState(false);
    const [filter, setFilter] = useState({ filtro_vagas_encaminhado: "" });

    const setData = (data) => {
        let tempData = data?.map((row) => {
            return {
                nr_vaga: row.NR_VAGA,
                dt_encaminhamento: row.DT_ENCAMINHAMENTO,
                cd_estagio_vaga: row.CD_ESTAGIO_VAGA,
                nm_cargo: row.NM_CARGO,
                nm_empresa: row.NM_EMPRESA,
                nm_situacao_vaga: row.NM_SITUACAO_VAGA
            }
        });
        setTableData(tempData);
        setReady(true);
    }

    const tableDataFilter = useMemo(() => {
        if (empty(tableData)) return [];

        return tableData.filter(item =>
            Object.values(item).some(v =>
                typeof v === 'string' && v.toLowerCase().includes(filter.filtro_vagas_encaminhado.toLowerCase())
            )
        )
    }, [filter, tableData])

    function handleAddTabs(nmTab) {
        if (typeof addPageTabsFunc === 'function') {
            addPageTabsFunc(nmTab);
        }
    }

    const getVagasEncaminhado = () => {
        axiosInstance.get(`candidato/historico_vaga_encaminhado/${cdPessoaCandidato}`)
            .then(function (response) {
                setData(response?.data || []);
            })
            .catch(function (error) {
                toast.error("Não foi possível buscar o histórico de vagas web do candidato");
                console.error(error);
            });
    }

    useEffect(() => {
        if (!init) return;
        if (empty(cdPessoaCandidato)) {
            setReady(false);
        } else {
            getVagasEncaminhado();
        }
    }, [init, cdPessoaCandidato]);

    const setFilterTextCallback = useCallback((id, value) => {
        setFilter(prevFormFilterStatus => ({
            ...prevFormFilterStatus,
            [id]: value
        }));
    }, [setFilter]);

    const dataToHtml = useMemo(() => {
        if (!tableData.length > 0) {
            return (
                <div className="col-span-12">
                    <NoDataFound />
                </div>
            );
        }

        return tableDataFilter?.map((item, index) => {
            return (
                <div className="odd:bg-white even:bg-gray-100 hover:bg-drop-shadow-1 col-span-12 px-1" key={`row_${index}`}>
                    <div className={`grid grid-cols-3 text-sm`}>
                        <div className="col-span-1 py-1">
                            <div>
                                <Caption>Vaga:&nbsp;</Caption><span className="text-primary cursor-pointer" onClick={() => {handleAddTabs(item.nr_vaga);}}>{item.nr_vaga}</span>
                            </div>
                            <div>
                                <Caption>Data:&nbsp;</Caption>{item.dt_encaminhamento}
                            </div>
                        </div>
                        <div className="col-span-1 py-1">
                            <div>
                                <Caption>Estágio:&nbsp;</Caption><span className="text-primary">{item.cd_estagio_vaga}</span>
                            </div>
                            <div>
                                <Caption>Cargo:&nbsp;</Caption>{item.nm_cargo}
                            </div>
                        </div>
                        <div className="col-span-1 py-1">
                            <div>
                                <Caption>Situação:&nbsp;</Caption><span className="font-semibold">{item.nm_situacao_vaga}</span>
                            </div>
                            <div>
                                <Caption>Cliente:&nbsp;</Caption><span className="italic">{item.nm_empresa}</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        })
    }, [tableDataFilter]);

    return (
        <>
            <div className={`grid grid-cols-12 bg-slate-300 relative rounded-t-md`} id={"table-vagas-encaminhado"}>
                <Loading active={!ready} />
                <div className="col-span-7 p-2 inline-flex items-center">
                    <Title>
                        {nmCandidato || ""}
                    </Title>
                </div>
                <div className="col-span-5 p-1">
                    <InputText
                        small
                        clearable={true}
                        placeholder="Filtrar"
                        id="filtro_vagas_encaminhado"
                        onChange={setFilterTextCallback}
                        helperText={`Exibindo ${tableDataFilter?.length || 0} registros`}
                    />
                </div>
                <div className="col-span-12 bg-white">
                    <div className={`grid grid-cols-12 max-h-[500px] overflow-y-auto pb-14`}>
                        {dataToHtml}
                    </div>
                </div>
            </div>
        </>
    );
}
export default TableVagasEncaminhado;