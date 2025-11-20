import { Caption } from "@/components/Layouts/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useCallback } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import NoDataFound from "@/components/Layouts/NoDataFound";
import InputText from "@/components/inputs/InputText";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Layouts/Loading";
import axiosInstance from "@/plugins/axios";

const TableRelatorioCandidatos = ({ active, reload, aplicarFiltros, filtrosPesquisa }) => {
    const { user, openPageTab } = useAppContext();
    const [tableDataFilter, setTableDataFilter] = useState([]);
    const [showLoading, setShowLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [filter, setFilter] = useState("");

    const getMovimentacaoCandidatos = useCallback(() => {
        setShowLoading(true);
        axiosInstance
            .post(`candidato/relatorio-mov-cand`, { ...filtrosPesquisa, cd_usuario: user.user_sip })
            .then(function (response) {
                setData(response.data);
            })
            .catch(function (error) {
                setShowLoading(false);
                console.error(error);
            });
    });

    useEffect(() => {
        if (active || aplicarFiltros) {
            getMovimentacaoCandidatos();
        }
    }, [active, reload, aplicarFiltros]);

    const setData = (data) => {
        setTableData(data);
        setTableDataFilter(data);
        setShowLoading(false);
    };

    const editarDadosCandidato = useCallback((cd_pessoa_candidato) => {
        openPageTab({
            id: "DadosCandidato",
            name: `Dados do candidato`,
            props: {
                cdPessoaCandidato: cd_pessoa_candidato,
            },
        });
    });

    const setFilterTextCallback = useCallback(
        (id, value) => {
            setFilter(value);
        },
        [setFilter]
    );

    useEffect(() => {
        if (tableData) {
            setTableDataFilter(
                tableData.filter((item) =>
                    Object.values(item).some(
                        (v) =>
                            typeof v === "string" && v.toLowerCase().includes(filter.toLowerCase())
                    )
                )
            );
        }
    }, [filter]);

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
                            <div className="flex flex-col">
                                <Caption>SIP:</Caption>
                            </div>
                            <div
                                className="w-fit ml-2 inline-flex items-center text-blue-600 cursor-pointer"
                                onClick={() => {
                                    editarDadosCandidato(row.CD_PESSOA);
                                }}
                            >
                                <span className="font-semibold">{row.CD_PESSOA}</span>
                                &nbsp;
                                <FontAwesomeIcon icon={faSearch} width="12" height="12" />
                            </div>
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-4">
                        <div className="flex flex-row flex-wrap py-0.5">
                            <div className="flex flex-col">
                                <Caption>Candidato:</Caption>
                            </div>
                            <div className="w-fit ml-2">
                                <span className="font-semibold">{row.NM_PESSOA}</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-4">
                        <div className="flex flex-row flex-wrap py-0.5">
                            <div className="flex flex-col">
                                <Caption>Data de alteração:</Caption>
                            </div>
                            <div className="w-fit ml-2">
                                <span className="font-semibold">{row.CRIADO_EM}</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="grid grid-cols-12 bg-white relative">
            <Loading active={showLoading} />
            <div className="col-span-12 px-2 border-b-2">
                <div className="grid grid-cols-12 pb-2">
                    <div className="col-start-9 col-span-4">
                        <InputText
                            placeholder="Filtrar"
                            clearable={true}
                            helperText={`Exibindo ${tableDataFilter.length} registros`}
                            onChange={setFilterTextCallback}
                            id="filtro_relatorio_candidato"
                        />
                    </div>
                </div>
            </div>
            <div className={`col-span-12 max-h-[65vh] overflow-y-auto`}>{renderBody()}</div>
        </div>
    );
};

export default TableRelatorioCandidatos;
