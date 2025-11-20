import Title, { Caption } from "@/components/Layouts/Typography";
import { useState, useEffect, useCallback, useMemo } from "react";
import NoDataFound from "@/components/Layouts/NoDataFound";
import InputText from "@/components/inputs/InputText";
import { useAppContext } from "@/context/AppContext";
import axiosInstance from "@/plugins/axios";

const RelacionadosWebCandidato = ({ active, reload, cdPessoaCandidato }) => {
    const { toast, loader } = useAppContext();
    const [nrVagaOnView, setNrVagaOnView] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [filter, setFilter] = useState("");
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (active && !ready) {
            (async () => await getRelacionadosWeb())();
        }
    }, [active, ready]);

    useEffect(() => {
        if (reload && active) {
            (async () => await getRelacionadosWeb())();
        }
    }, [reload, active]);

    const getRelacionadosWeb = async () => {
        setReady(false);
        await axiosInstance
            .get(`candidato/relacionados-web/${cdPessoaCandidato}`)
            .then(function (response) {
                setTableData(response.data);
                setReady(true);
            })
            .catch(function (error) {
                setReady(true);
                toast.error("Não foi possível carregar os relacionados web.");
                console.error(error);
            });
    };

    const setFilterTextCallback = useCallback(
        (id, value) => {
            setFilter(value);
        },
        [setFilter]
    );

    const setViewVaga = useCallback((nr_vaga) => {
        if (!nrVagaOnView.includes(nr_vaga)) {
            setNrVagaOnView([...nrVagaOnView, nr_vaga]);
        }
    });

    const tableDataFilter = useMemo(() => {
        return tableData.filter((item) =>
            Object.values(item).some(
                (v) => typeof v === "string" && v.toLowerCase().includes(filter.toLowerCase())
            )
        );
    }, [filter, tableData]);

    const renderBody = () => {
        if (tableDataFilter.length == 0) {
            return (
                <div className="col-span-12">
                    <NoDataFound />
                </div>
            );
        }

        return tableDataFilter?.map((row, index) => {
            return (
                <div
                    className="grid grid-cols-12 odd:bg-white even:bg-gray-100 p-2 border-b border-slate-300 text-sm relative"
                    key={`row-${index}`}
                >
                    <div className="col-span-12 md:col-span-4">
                        <div className="flex flex-row flex-wrap py-0.5">
                            <div className="flex flex-col w-[100px]">
                                <Caption>Nr. Requisição:</Caption>
                            </div>
                            <div className="w-fit">
                                <span className="font-semibold">{row.NR_REQUISICAO}</span>
                            </div>
                        </div>

                        <div className="flex flex-row flex-wrap py-0.5">
                            <div className="flex flex-col w-[100px]">
                                <Caption>Qtd. vaga:</Caption>
                            </div>
                            <div className="w-fit">
                                <span className="font-semibold">{row.QTD_VAGAS}</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-4">
                        <div className="flex flex-row flex-wrap py-0.5">
                            <div className="flex flex-col w-[110px]">
                                <Caption>Serviço:</Caption>
                            </div>
                            <div className="w-fit">
                                <span className="font-semibold">{row.DS_CIDADE_SERVICO}</span>
                            </div>
                        </div>

                        <div className="flex flex-row flex-wrap py-0.5">
                            <div className="flex flex-col w-[110px]">
                                <Caption>Status do candidato:</Caption>
                            </div>
                            <div className="w-fit">
                                <span className="font-semibold">{row.ID_DESCARTAR}</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-4">
                        <div className="flex flex-row flex-wrap py-0.5">
                            <div className="flex flex-col w-[100px]">
                                <Caption>Relacionado em:</Caption>
                            </div>
                            <div className="w-fit">
                                <span className="font-semibold">{row.CRIADO_EM}</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    };

    if (!active) return null;

    return (
        <div id="encaminhamentos" className={`col-span-12 m-2 mt-14 relative`}>
            <div
                className={`grid grid-cols-12 bg-primary rounded-t-md`}
                id={"table-encaminhamentos"}
            >
                <div className="col-span-7 p-2 text-white">
                    <Title className={"pr-2"}>Relacionados WEB</Title>
                </div>
                <div className="col-span-5 p-1">
                    <div className="flex flex-row items-center w-full gap-1">
                        <div className="flex p-1 text-xs w-full justify-end text-white">
                            Exibindo {tableDataFilter?.length || 0} registros
                        </div>
                        <InputText
                            placeholder="Filtrar"
                            clearable={true}
                            onChange={setFilterTextCallback}
                            id="filtro_pesquisa_rel_web"
                            small
                        />
                    </div>
                </div>
                <div className="col-span-12 bg-white border-l border-r max-h-[520px] overflow-y-auto">
                    {renderBody()}
                </div>
            </div>
        </div>
    );
};

export default RelacionadosWebCandidato;
