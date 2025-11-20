import { faFilter, faChevronDown, faBars } from '@fortawesome/free-solid-svg-icons';
import VagasSelecao from "@/components/selecao/entrar/VagasSelecao";
import FiltroVagasCandidato from "../filtros/FiltroVagasCandidato";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from "react";
import Button from "@/components/buttons/Button";

const VagasCandidato = ({ active, reload, cdPessoaCandidato }) => {
    const [aplicarFiltros, setAplicarFiltros] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [filtrosPesquisa, setFiltrosPesquisa] = useState({
        nm_cidade: "SC-JOINVILLE",
        centro: false,
        norte: false,
        sul: false,
        leste: false,
        oeste: false,
        setor: 'S',
        status: 0,
        cd_cargo: ""
    });

    const toggleFilter = () => {
        setIsExpanded(!isExpanded);
        setAplicarFiltros(false);
    };

    const filtrar = () => {
        setIsExpanded(false);
        setAplicarFiltros(true);
    };
    
    if (!active) return null;

    return (
        <>
            <div className={`flex-col flex-wrap w-full h-full p-1 mt-12 relative max-h-[80vh] min-h-[65vh]`}>

                {/* Filtro flutuante */}
                <div className={`absolute col-span-2 m-2 mb-0 flex flex-row flex-wrap max-h-full min-h-10 overflow-hidden rounded-lg bg-white ${isExpanded ? 'w-80' : 'w-40'}`}>
                    <div className={`flex items-center flex-nowrap text-primary gap-x-2 fixed bg-white p-2 z-50 border ${isExpanded ? 'w-80 rounded-t-lg' : 'w-40 shadow rounded-lg'}`} onClick={() => { toggleFilter() }}>
                        <div>
                            <FontAwesomeIcon icon={faFilter} width="20" height="20" className="mr-2" />
                        </div>
                        <div>
                            Filtros
                        </div>
                        <div className="w-full">
                            <FontAwesomeIcon icon={faChevronDown} width="20" height="20" className={`${!isExpanded && "rotate-180"} float-right`} />
                        </div>
                    </div>

                    {isExpanded && (
                        <div className={'w-80 static left-2 top-14 bg-white shadow rounded-lg z-40'} >
                            <div className={`flex-col flex-nowrap border rounded-lg shadow-lg w-full mt-2 relative ${isExpanded ? 'flex' : 'hidden'}`}>
                                <div className="p-4 pb-0 sticky top-10 z-40">
                                    <Button buttonType="primary" size="small" block onClick={() => { filtrar(); }}>Aplicar Filtros</Button>
                                </div>
                                <div className="mt-10 mb-2 pt-0 px-4 overflow-y-auto max-h-[60vh]">
                                    <FiltroVagasCandidato filtrosPesquisa={filtrosPesquisa} setFiltrosPesquisa={setFiltrosPesquisa} cdPessoaCandidato={cdPessoaCandidato} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="col-span-12 m-2" onClick={() => setIsExpanded(false)}>
                    <VagasSelecao
                        active={active}
                        reload={reload}
                        customHeight={"min-h-[70vh]"}
                        aplicarFiltros={aplicarFiltros}
                        filtrosPesquisa={filtrosPesquisa}
                    />
                </div>

            </div>
        </>
    );
}

export default VagasCandidato;