import { useAppContext } from "@/context/AppContext";
import axiosInstance from "@/plugins/axios";
import Button from "@/components/buttons/Button";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faFilter } from "@fortawesome/free-solid-svg-icons";
import FiltroBuscaCandidatos from "@/components/selecao/filtros/FiltroBuscaCandidatos";
import TableBuscaCandidatos from "@/components/selecao/entrar/tables/TableBuscaCandidatos";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const BuscaCandidatos = ({ active, reload, tabName }) => {
    const { toast, user } = useAppContext();
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [filtrosPesquisa, setFiltrosPesquisa] = useState({
        cpf: "",
        nome: "",
        cd_pessoa: "",
        estado: "SC",
        cidade: "JOINVILLE",
        bloqueado: "N",
    });
    const [candidatos, setCandidatos] = useState([]);
    const [candidatosCount, setCandidatosCount] = useState(0);
    const [candidatoTextFilter, setCandidatoTextFilter] = useState("");

    const handleFilterState = useCallback(
        (toggle) => {
            setIsFilterExpanded(toggle);
        },
        [isFilterExpanded]
    );

    const getUserCity = async () => {
        try {
            const response = await axiosInstance.get(`cidades/cidade-padrao-usuario/${user.user_sip}/${user.cd_unid}`);

            const result = response.data;
            setFiltrosPesquisa(prev => ({
                ...prev,
                estado: result.CD_UF || 'SC',
                cidade: result.NM_CIDADE || 'JOINVILLE'
            }));
        } catch (error) {
            console.error("Erro ao obter a cidade padrão do usuário logado:", error);
        }
    };

    useEffect(() => {
        if (active) {
            getUserCity();
        }
    }, [active]);

    useEffect(() => {
        if (reload) {
            aplicarFiltros();
        }
    }, [reload]);

    const aplicarFiltros = useCallback(() => {
        let filtersJoin = "";
        for (let [key, value] of Object.entries(filtrosPesquisa)) {
            if (value) {
                filtersJoin += `/${key}=${value}`;
            }
        }

        try {
            Promise.all([
                axiosInstance.get(`candidato/pesquisa${encodeURI(filtersJoin)}`),
                axiosInstance.get(`candidato/count/pesquisa${encodeURI(filtersJoin)}`),
            ]).then(([dataResponse, countResponse]) => {
                setCandidatos(dataResponse.data);
                setCandidatosCount(countResponse.data);

                if (countResponse.data >= 200) {
                    toast.warning(
                        "Apenas 200 resultados retornados, aplique mais filtros para resultados precisos"
                    );
                }
                setIsLoading(false);
            });
        } catch (error) {
            console.error(error);
            toast.error("Erro ao aplicar filtros, muitos resultados. Aplique mais filtros");
        }
    }, [filtrosPesquisa]);

    const filterCandidatos = useCallback(() => {
        setIsLoading(true);
        handleFilterState(false);
        aplicarFiltros();
    }, [handleFilterState, filtrosPesquisa]);

    const candidatosFiltered = useMemo(() => {
        if (!candidatoTextFilter) return candidatos;

        return candidatos.filter((candidato) => {
            return (
                candidato.NOME_PESSOA.toLowerCase().includes(candidatoTextFilter.toLowerCase()) ||
                candidato.CPF.includes(candidatoTextFilter) ||
                candidato.CODIGO_PESSOA.includes(candidatoTextFilter)
            );
        });
    }, [candidatoTextFilter, candidatos]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (isFilterExpanded && event.key === "Enter") {
                filterCandidatos();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isFilterExpanded, filterCandidatos]);

    return (
        <div className={`flex-col flex-wrap w-full h-full p-1 relative max-h-[80vh] min-h-[75vh] flex ${active ? "" : "hidden"}`}>
            <div
                className={`absolute col-span-2 mx-2 mb-2 flex flex-row flex-wrap max-h-full min-h-10 overflow-hidden rounded-lg bg-white ${
                    isFilterExpanded ? "w-80" : "w-32"
                }`}
            >
                <div
                    className={`flex items-center flex-nowrap text-primary justify-between fixed bg-white mt-2 px-2 py-1 z-40 border ${isFilterExpanded ? "w-80 rounded-t-lg" : "w-32 shadow rounded-lg"}`}
                    onClick={() => {handleFilterState(!isFilterExpanded);}}>
                    <div className="flex flex-row gap-2 items-center">
                        <FontAwesomeIcon icon={faFilter} width="16" height="16" />
                        Filtros
                    </div>
                    <FontAwesomeIcon
                        icon={faChevronDown}
                        width="16"
                        height="16"
                        className={`${!isFilterExpanded && "rotate-180"} float-right`}
                    />
                </div>

                {isFilterExpanded && (
                    <div className={`w-80 static left-2 top-14 bg-white shadow rounded-lg z-40`}>
                        <div className={`flex-col flex-nowrap border rounded-lg shadow-lg w-full mt-2 relative flex`}>
                            <div className="flex flex-row p-2 xl:p-4 pb-0 sticky top-2 z-40 gap-x-1 items-center">
                                <div className="w-[90%]">
                                    <Button buttonType="primary" size="small" block onClick={filterCandidatos}>
                                        Aplicar Filtros
                                    </Button>
                                </div>
                                <div>
                                    <Button buttonType="primary" size="small" outline block onClick={setIsFilterExpanded.bind(null, false)}>
                                        <FontAwesomeIcon icon={faClose} width="16" height="16" className="h-full" />
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-2 mb-3 pt-0 px-4 overflow-y-auto max-h-[60vh] min-h-[400px]">
                                <FiltroBuscaCandidatos filtrosPesquisa={filtrosPesquisa} setFiltrosPesquisa={setFiltrosPesquisa} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {!reload && <div className="col-span-12 m-2" onClick={() => setIsFilterExpanded(false)}>
                <TableBuscaCandidatos
                    candidatos={candidatosFiltered}
                    setCandidatoTextFilter={setCandidatoTextFilter}
                    isLoading={isLoading}
                    tabName={tabName}
                />
            </div>}
        </div>
    );
};

export default BuscaCandidatos;
