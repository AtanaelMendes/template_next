import { faFilter, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppContext } from "@/context/AppContext";
import Button from "@/components/buttons/Button";
import axiosInstance from "@/plugins/axios";
import { format, subDays } from "date-fns";
import RecrutamentoFiltroCandidato from "./entrar/RecrutamentoFiltroCandidato";
import CandidatosAlterados from "./entrar/CandidatosAlterados";

const RelatorioCandidatoRecrutamento = ({ active, reload }) => {
    const [candidatos, setCandidatos] = useState([]);
    const { user, toast } = useAppContext();
    const [isCandidatosLoading, setIsCandidatosLoading] = useState(false);
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);
    const [filtrosPesquisa, setFiltrosPesquisa] = useState({
        analistas: [],
        inicio: format(subDays(new Date(), 30), "yyyy-MM-dd"),
        termino: format(new Date(), "yyyy-MM-dd"),
        tipo_registro: "A",
    });

    useEffect(() => {
        if (!(Object.keys(filtrosPesquisa).length > 0) && !active) return;

        setFiltrosPesquisa((prevState) => ({
            ...prevState,
            analistas: filtrosPesquisa.analistas,
            inicio: filtrosPesquisa.inicio,
            termino: filtrosPesquisa.termino,
            tipo_registro: filtrosPesquisa.tipo_registro || "A",
        }));
    }, [active]);

    const getCandidadosRelatorio = async () => {
        setIsCandidatosLoading(true);
        await axiosInstance
            .post("recrutamento/consulta-candidatos-relatorio", filtrosPesquisa)
            .then((response) => {
                setIsCandidatosLoading(false);
                if (response.data.length === 0) {
                    toast.error("Nenhum candidato encontrado com os filtros aplicados.");
                }
                setCandidatos(response.data);
            })
            .catch((error) => {
                setIsCandidatosLoading(false);
                toast.error("Não foi possível carregar os candidatos.");
                console.error(error);
            })
            .finally(() => {
                setIsCandidatosLoading(false);
            });
    };

    const filterCandidatos = async () => {
        if (!active) return;
        
        if (filtrosPesquisa.inicio > filtrosPesquisa.termino) {
            toast.error("A data de início não pode ser maior que a data de término.");
            return;
        }

        setIsFilterExpanded(false);
        await getCandidadosRelatorio();
    };

    useEffect(() => {
        if (!active) return;
        filterCandidatos();
    }, [active]);

    useEffect(() => {
        if (active && reload) {
            getCandidadosRelatorio();
        }
    }, [active, reload]);

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
        <div
            className={`flex flex-col flex-wrap w-full h-full relative min-h-[75vh] ${active ? "" : "hidden"} overflow-y-hidden`}
        >
            <div
                className={`absolute col-span-2 mx-1 xl:mx-2 mt-2 xl:mt-[15px] mb-0 flex flex-row flex-wrap max-h-full min-h-10 overflow-hidden rounded-lg bg-white ${isFilterExpanded ? "w-90" : "w-40"
                    }`}
            >
                <div
                    className={`flex items-center flex-nowrap text-primary justify-between fixed bg-white p-1 xl:p-2 z-40 border ${isFilterExpanded ? " w-80 rounded-t-lg " : " w-32 shadow rounded-lg"
                        }`}
                    onClick={() => { setIsFilterExpanded(!isFilterExpanded); }}
                >
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
                        <div
                            className={`flex-col flex-nowrap border rounded-lg shadow-lg w-full mt-2 relative flex h-[50vh]`}
                        >
                            <div className="p-2 xl:p-4 pb-0 sticky top-2 z-40">
                                <Button
                                    buttonType="primary"
                                    size="small"
                                    block
                                    onClick={filterCandidatos}
                                >
                                    Aplicar Filtros
                                </Button>
                            </div>

                            <div className="mt-2 xl:mt-5 mb-3 pt-0 p-2 xl:px-4 overflow-y-auto max-h-[70vh]">
                                <RecrutamentoFiltroCandidato
                                    filtrosPesquisa={filtrosPesquisa}
                                    setFiltrosPesquisa={setFiltrosPesquisa}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="col-span-12 m-2" onClick={() => setIsFilterExpanded(false)}>
                {!reload && <CandidatosAlterados candidatos={candidatos} isCandidatoLoading={isCandidatosLoading} refreshTab={filterCandidatos}/>}
            </div>
        </div>
    );
};

export default RelatorioCandidatoRecrutamento;
