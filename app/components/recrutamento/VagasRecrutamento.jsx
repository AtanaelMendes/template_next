import { faFilter, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import MinhasVagas from "@/components/selecao/entrar/MinhasVagas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RecrutamentoFiltro from "./entrar/RecrutamentoFiltro";
import { useAppContext } from "@/context/AppContext";
import Button from "@/components/buttons/Button";
import axiosInstance from "@/plugins/axios";
import { format, subDays } from "date-fns";
import { foraDaValidade } from "@/assets/regraPauloGoes";
import { empty } from "@/assets/utils";
import Blockquote from "../Layouts/Blockquote";
import MinhasVagasNoventaDias from "@/pages/selecao/MinhasVagasNoventaDias";

const VagasRecrutamento = ({ active, reload }) => {
    const dtToday = format(new Date(), "yyyy-MM-dd");
    const dtInicio = format(subDays(new Date(), 90), "yyyy-MM-dd");

    const [vagas, setVagas] = useState([]);
    const { user, toast } = useAppContext();
    const [isVagasLoading, setIsVagasLoading] = useState(false);
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);
    const [vagasComMaisDeNoventaDias, setVagasComMaisDeNoventaDias] = useState([]);
    const [filtrosPesquisa, setFiltrosPesquisa] = useState({
        tipo_vagas: "M",
        nm_cargo: "",
        nm_empresa: "",
        nr_vaga: "",
        cc_vaga: "",
        nr_requisicao: "",
        cd_unidade: "",
        nm_cidade: "",
        centro: false,
        norte: false,
        sul: false,
        leste: false,
        oeste: false,
        setor: "S", //S é recrutamento mesmo :)
        somente_pcd: false,
        last_24hr: false,
        inicio: '',
        termino: dtToday,
        cd_empresa: "",
        cd_usuario: user.user_sip || "",
        cd_pessoa_analista: user.cd_sip || "",
        aberta: true,
        cliente: false,
    });

    useEffect(() => {
        if (empty(vagas)) return;
        const vgNoventaDias = vagas.filter(vg => Number(vg.CD_PESSOA_ANALISTA) === Number(user.cd_sip) && foraDaValidade(vg.CD_EMPRESA, vg.CD_SITUACAO_VAGA, Number(vg.QT_DIAS_ABERTURA), vg.DT_ABERTURA, vg.DT_PRORROGACAO));
        setVagasComMaisDeNoventaDias(vgNoventaDias);
    }, [vagas]);

    useEffect(() => {
        if (!(Object.keys(filtrosPesquisa).length > 0) && !active) return;

        setFiltrosPesquisa((prevState) => ({
            ...prevState,
            termino: dtToday,
            cd_usuario: user.user_sip,
            cd_pessoa_analista: user.cd_sip || ""
        }));
    }, [active]);

    const getVagasAnalista = async () => {
        setIsVagasLoading(true);
        const filtrosJoin = Object.entries(filtrosPesquisa)
            .map(([key, value]) => `${key}=${value}`)
            .join("&");
        await axiosInstance
            .get(`recrutamento/vagas-recrutamento${filtrosJoin ? `?${encodeURI(filtrosJoin)}` : ""}`)
            .then((response) => {
                setIsVagasLoading(false);
                setVagas(response.data);
            })
            .catch((error) => {
                setIsVagasLoading(false);
                toast.error("Não foi possível carregar suas vagas.");
                console.error(error);
            })
            .finally(() => {
                setIsVagasLoading(false);
            });
    };

    const filterVagas = async () => {
        setIsFilterExpanded(false);
        await getVagasAnalista();
    };

    useEffect(() => {
        if (!active) return;
        filterVagas();
    }, [active]);

    useEffect(() => {
        if (active && reload) {
            getVagasAnalista();
        }
    }, [active, reload]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (isFilterExpanded && event.key === "Enter") {
                filterVagas();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isFilterExpanded, filterVagas]);

    return (
        <div className={`flex flex-col flex-wrap w-full h-full relative min-h-[75vh] ${active ? "" : "hidden"} overflow-y-hidden`}>
            {/* REGRA DO PAULO GOES */}
            <div className={`flex flex-col w-full h-full relative ${vagasComMaisDeNoventaDias.length > 0 ? "" : "hidden"}`}>
                <div className="p-2">
                    <Blockquote type={"danger"}>É necessario cancelar ou prorrogar as vagas abaixo.</Blockquote>
                </div>
                <div className="overflow-y-auto max-h-full pb-100">
                    <MinhasVagasNoventaDias vagas={vagasComMaisDeNoventaDias} reloadCallback={filterVagas} />
                </div>
            </div>
            {/* REGRA DO PAULO GOES */}

            { vagasComMaisDeNoventaDias.length === 0 && <div className={`absolute col-span-2 mx-1 xl:mx-2 mt-2 xl:mt-[15px] mb-0 flex flex-row flex-wrap max-h-full min-h-10 overflow-hidden rounded-lg bg-white ${isFilterExpanded ? "w-80" : "w-40"}`}>
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
                            className={`flex-col flex-nowrap border rounded-lg shadow-lg w-full mt-2 relative flex`}
                        >
                            <div className="p-2 xl:p-4 pb-0 sticky top-2 z-40">
                                <Button
                                    buttonType="primary"
                                    size="small"
                                    block
                                    onClick={filterVagas}
                                >
                                    Aplicar Filtros
                                </Button>
                            </div>

                            <div className="mt-2 xl:mt-5 mb-3 pt-0 p-2 xl:px-4 overflow-y-auto max-h-[60vh]">
                                <RecrutamentoFiltro
                                    filtrosPesquisa={filtrosPesquisa}
                                    setFiltrosPesquisa={setFiltrosPesquisa}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>}

            {vagasComMaisDeNoventaDias.length === 0 && <div className="col-span-12 m-2" onClick={() => setIsFilterExpanded(false)}>
                {!reload && <MinhasVagas vagas={vagas} isVagasLoading={isVagasLoading} refreshTab={filterVagas} isRecrutamento={true} />}
            </div>}
        </div>
    );
};

export default VagasRecrutamento;
