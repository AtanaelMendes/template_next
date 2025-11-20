import { Caption, Title } from "@/components/Layouts/Typography";
import { useCallback, useEffect, useMemo, useState } from "react";
import NoDataFound from "@/components/Layouts/NoDataFound";
import InputText from "@/components/inputs/InputText";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Layouts/Loading";
import axiosInstance from "@/plugins/axios";
import { empty } from "@/assets/utils";

// este datatable tem no maximo 12 colunas
const TableVagasRelacionadoWeb = ({ cdPessoaCandidato, nmCandidato, maxHeight }) => {
    const { toast } = useAppContext();
    const [tableData, setTableData] = useState([]);
    const [ready, setReady] = useState(false);
    const [filter, setFilter] = useState({ filtro_vagas_relacionado: "" });

    const setData = (data) => {
        let tempData = data.map((row) => {
            return {
                nr_requisicao: row.NR_REQUISICAO,
                qtd_vagas: row.QTD_VAGAS,
                ds_cidade_servico: row.DS_CIDADE_SERVICO,
                status_candidato: row.STATUS_CANDIDATO,
                nm_empresa: row.NM_EMPRESA,
                criado_em: row.CRIADO_EM,
            };
        });
        setTableData(tempData);
        setReady(true);
    };

    const tableDataFilter = useMemo(() => {
        return tableData.filter((item) =>
            Object.values(item).some(
                (v) =>
                    typeof v === "string" &&
                    v.toLowerCase().includes(filter.filtro_vagas_relacionado.toLowerCase())
            )
        );
    }, [filter, tableData]);

    const getVagasEncaminhado = () => {
        axiosInstance
            .get(`candidato/historico_vaga_web/${cdPessoaCandidato}`)
            .then(function (response) {
                setData(response.data);
            })
            .catch(function (error) {
                toast.error("Não foi possível buscar o histórico de vagas web do candidato");
                console.error(error);
            });
    };

    useEffect(() => {
        if (empty(cdPessoaCandidato)) {
            setReady(false);
            return;
        }
        getVagasEncaminhado();
    }, [cdPessoaCandidato]);

    const setFilterTextCallback = useCallback(
        (id, value) => {
            setFilter((prevFormFilterStatus) => ({
                ...prevFormFilterStatus,
                [id]: value,
            }));
        },
        [setFilter]
    );

    const dataToHtml = useMemo(() => {
        if (!tableData.length) {
            return (
                <div className="col-span-12">
                    <NoDataFound />
                </div>
            );
        }

        return tableDataFilter.map((item, index) => {
            return (
                <div
                    className="odd:bg-white even:bg-gray-100 hover:bg-drop-shadow-1 col-span-12"
                    key={`row_${index}`}
                >
                    <div className={`grid grid-cols-6 text-sm px-1`}>
                        <div className="col-span-1 py-1">
                            <div>
                                <Caption>Requisicão:&nbsp;</Caption>
                                <span className="text-primary">{item.nr_requisicao}</span>
                            </div>
                            <div>
                                <Caption>Total vagas:&nbsp;</Caption>
                                <span className="text-primary">{item.qtd_vagas}</span>
                            </div>
                        </div>
                        <div className="col-span-2 py-1">
                            <Caption>Unidade:&nbsp;</Caption>
                            <span className="italic">{item.ds_cidade_servico}</span>
                        </div>
                        <div className="col-span-2 py-1">
                            <Caption>Status:&nbsp;</Caption>
                            <span className="font-semibold">{item.status_candidato}</span>
                        </div>
                        <div className="col-span-1 py-1">
                            <Caption>Relacionado:&nbsp;</Caption>
                            <span>{item.criado_em}</span>
                        </div>
                    </div>
                </div>
            );
        });
    }, [tableDataFilter]);

    return (
        <>
            <div
                className={`flex flex-col w-full relative rounded-t-md`}
                id={"table-vagas-relacionado-web"}
            >
                {ready ? (
                    <>
                        <div className="flex flex-row w-full justify-between p-2 bg-slate-300">
                            <div className="w-3/5 content-center">
                                <Title>{nmCandidato}</Title>
                            </div>
                            <div className="flex flex-col w-2/5">
                                <InputText
                                    small
                                    clearable={true}
                                    placeholder="Filtrar"
                                    id="filtro_vagas_relacionado"
                                    onChange={setFilterTextCallback}
                                    helperText={`Exibindo ${
                                        tableDataFilter?.length || 0
                                    } registros`}
                                />
                            </div>
                        </div>
                        <div className="col-span-12 bg-white">
                            <div
                                className={`grid grid-cols-12 max-h-[${
                                    maxHeight || 500
                                }px] overflow-y-auto pb-14`}
                            >
                                {dataToHtml}
                            </div>
                        </div>
                    </>
                ) : (
                    <Loading active={!ready} />
                )}
            </div>
        </>
    );
};
export default TableVagasRelacionadoWeb;
