import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputTextArea from "@/components/inputs/InputTextArea";
import SelectUnidade from "@/components/inputs/SelectUnidade";
import NoDataFound from "@/components/Layouts/NoDataFound";
import { Caption } from "@/components/Layouts/Typography";
import ModalGrid from "@/components/Layouts/ModalGrid";
import InputText from "@/components/inputs/InputText";
import Loading from "@/components/Layouts/Loading";
import Button from "@/components/buttons/Button";
import axiosInstance from "@/plugins/axios";
import { useAppContext } from "@/context/AppContext";
import CandidatosDoGrupo from "./CandidatosDoGrupo";
import { useState, useEffect, useCallback, useMemo } from "react";
import Select2CargosSip from "@/components/inputs/Select2CargosSip";
import { TooltipComponent } from "@/components/Layouts/TooltipComponent";

const GruposDeCandidatos = ({ active, reload, tabName, ...props }) => {
    const { toast, user } = useAppContext();

    const [dadosGruposCandidados, setDadosGruposCandidados] = useState([]);
    const [filterGroup, setFilterGroup] = useState({ search: "" });
    const [showCandidatos, setShowCandidatos] = useState(false);
    const [grupoOnEdit, setGrupoOnEdit] = useState({});
    const [ready, setReady] = useState(false);
    const [modalNovoGrupo, setModalNovoGrupo] = useState(false);
    const [formNovoGrupo, setFormNovoGrupo] = useState({
        cd_pessoa_selecionador_grupo: user.cd_sip,
        cd_empresa_grupo: "",
        nm_tipo_grupo_candidato: "",
        cd_cargo_grupo: "",
        ds_observacoes_grupo: "",
    });

    const getGrupos = () => {
        setReady(false);
        axiosInstance
            .get(`grupo/grupos-list`, { cd_pessoa_selecionador: user.cd_sip })
            .then(function (response) {
                if (response.status === 200) {
                    setDadosGruposCandidados(response.data);
                } else {
                    toast.error("OOps ocorreu um erro ao buscar os grupos de candidatos");
                }
            })
            .catch(function (resp) {
                let error = resp?.response?.data?.error;
                if (Array.isArray(error)) {
                    return toast.error(
                        error.join(" ") || "OOps ocorreu um erro ao buscar os grupos de candidatos"
                    );
                }
                return toast.error(
                    error || "OOps ocorreu um erro ao buscar os grupos de candidatos"
                );
            })
            .finally(() => {
                setReady(true);
            });
    };

    const salvaNovoGrupo = () => {
        axiosInstance
            .post(`grupo/novo-grupo`, formNovoGrupo)
            .then(function (response) {
                if (response.status === 200) {
                    setModalNovoGrupo(false);
                    getGrupos();
                    clearForm();
                    toast.success("Grupo criado com sucesso");
                }
            })
            .catch(function (resp) {
                let error = resp?.response?.data?.error;
                if (Array.isArray(error)) {
                    return toast.error(error.join(" ") || "OOps ocorreu um erro ao criar o grupo");
                }
                return toast.error(error || "OOps ocorreu um erro ao criar o grupo");
            });
    };

    const dadosGruposCandidadosFilter = useMemo(() => {
        return dadosGruposCandidados.filter((item) =>
            Object.values(item).some(
                (v) =>
                    typeof v === "string" &&
                    v.toLowerCase().includes(filterGroup.search.toLowerCase())
            )
        );
    }, [filterGroup, dadosGruposCandidados]);

    useEffect(() => {
        if (active && !ready) {
            getGrupos();
        }
    }, [active]);

    useEffect(() => {
        if (reload) {
            getGrupos();
        }
    }, [reload]);

    const clearForm = useCallback(() => {
        setFormNovoGrupo({
            cd_pessoa_selecionador_grupo: user.cd_sip,
            cd_empresa_grupo: "",
            nm_tipo_grupo_candidato: "",
            cd_cargo_grupo: "",
            ds_observacoes_grupo: "",
        });
    });

    const setFilterGroupCallback = useCallback(
        (id, value) => {
            setFilterGroup((prevState) => ({ ...prevState, search: value }));
        },
        [setFilterGroup]
    );

    const viewCandidatos = useCallback((grupo) => {
        setShowCandidatos(true);
        setGrupoOnEdit(grupo);
    }, []);

    const setFormNovoGrupoValues = useCallback((id, value) => {
        setFormNovoGrupo((prevState) => {
            return { ...prevState, [id]: value };
        });
    });

    function dataToHtml() {
        if (!(dadosGruposCandidadosFilter.length > 0)) {
            return <NoDataFound className="text-2xl" />;
        }

        return dadosGruposCandidadosFilter?.map((row, index) => {
            return (
                <div
                    key={`row-${index}`}
                    className="grid grid-cols-12 odd:bg-white even:bg-gray-100 p-2 border-b border-slate-300 text-sm relative"
                >
                    <TooltipComponent
                        content={<span className="font-semibold">Ver candidatos</span>}
                        asChild
                    >
                        <div className="absolute top-[50%] right-2 transform -translate-y-1/2">
                            <Button
                                id={"btn-candidatos-grupo"}
                                size="small"
                                buttonType="primary"
                                outline
                                bordered
                                onClick={() => viewCandidatos(row)}
                            >
                                <FontAwesomeIcon icon={faUsers} width="14" height="14" />
                            </Button>
                        </div>
                    </TooltipComponent>

                    <div className="col-span-12 md:col-span-5">
                        <div className="flex flex-row flex-wrap py-0.5">
                            <div className="flex flex-col w-[60px]">
                                <Caption>Grupo:</Caption>
                            </div>
                            <div className="w-fit font-semibold">{row.NM_TIPO_GRUPO_CANDIDATO}</div>
                        </div>

                        <div className="flex flex-row flex-wrap py-0.5">
                            <div className="flex flex-col w-[60px]">
                                <Caption>Unidade:</Caption>
                            </div>
                            <div className="w-fit">{row.NM_EMPRESA}</div>
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-7 pr-6">
                        <div className="flex flex-row flex-wrap py-0.5">
                            <div className="flex flex-col w-[80px]">
                                <Caption>Cargo:</Caption>
                            </div>
                            <div className="w-fit text-wrap word-wrap-legado">{row.NM_CARGO}</div>
                        </div>

                        <div className="flex flex-row flex-wrap py-0.5">
                            <div className="flex flex-col w-[80px]">
                                <Caption>Selecionador:</Caption>
                            </div>
                            <div className="w-fit">{row.CRIADO_POR}</div>
                        </div>
                    </div>

                    <div className="col-span-12">
                        <div className="flex flex-row flex-wrap py-0.5">
                            <div className="flex flex-col w-[80px]">
                                <Caption>Observações:</Caption>
                            </div>
                            <div className="w-fit">{row.DS_OBSERVACOES}</div>
                        </div>
                    </div>
                </div>
            );
        });
    }

    return (
        <>
            <div
                className={`grid grid-cols-12 gap-x-2 max-h-screen overflow-y-auto ${!ready ? "min-h-[500px]" : ""
                    } ${active ? "" : "hidden"}`}
            >
                {/* janela de grupos */}
                <div className={`${showCandidatos ? "col-span-6" : "col-span-12"} relative`}>
                    <Loading active={!ready} />

                    <div className="grid grid-cols-1">
                        <div className="px-2 border-b-2">
                            <div className="grid grid-cols-12 py-2">
                                <div
                                    className={`${showCandidatos ? "col-span-3" : "col-span-2"
                                        } content-center`}
                                >
                                    <Button
                                        buttonType="primary"
                                        id="btn-novo-grupo"
                                        onClick={() => {
                                            setModalNovoGrupo(true);
                                        }}
                                    >
                                        NOVO GRUPO
                                    </Button>
                                </div>
                                <div className="col-start-8 col-span-5">
                                    <InputText
                                        helperText={`Exibindo ${dadosGruposCandidadosFilter.length} registros`}
                                        value={filterGroup.search}
                                        placeholder="Filtrar"
                                        clearable={true}
                                        onChange={setFilterGroupCallback}
                                        id="filtro_grupos_candidatos"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="max-h-[550px] overflow-y-auto pb-[200px]">
                            {dataToHtml()}
                        </div>
                    </div>
                </div>
                {/* fim janela de grupos */}

                {/* janela de candidatos */}
                {showCandidatos && (
                    <CandidatosDoGrupo
                        grupoOnEdit={grupoOnEdit}
                        setShowCandidatos={setShowCandidatos}
                    />
                )}
                {/* fim janela de candidatos */}
            </div>

            <ModalGrid
                size="md"
                footer={
                    <Button buttonType="success" onClick={salvaNovoGrupo} className={"ml-2"}>
                        SALVAR
                    </Button>
                }
                closeModalCallback={clearForm}
                btnCancel={"CANCELAR"}
                footerClass="text-right"
                title={"Novo grupo"}
                modalControl={modalNovoGrupo}
                contentClass="px-2"
                setModalControl={setModalNovoGrupo}
            >
                <div className="col-span-12 pt-4">
                    <InputText
                        required
                        id="nm_tipo_grupo_candidato"
                        label="Nome do grupo"
                        value={formNovoGrupo.nm_tipo_grupo_candidato}
                        onChange={setFormNovoGrupoValues}
                    />
                </div>
                <div className="col-span-12 pt-2">
                    <SelectUnidade
                        required
                        label="Unidade"
                        type={"SELECIONADOR"}
                        init={modalNovoGrupo}
                        id="cd_empresa_grupo"
                        onChange={setFormNovoGrupoValues}
                        value={formNovoGrupo.cd_empresa_grupo}
                    />
                </div>
                <div className="col-span-12">
                    <Select2CargosSip
                        required
                        label="Cargo"
                        id="cd_cargo_grupo"
                        init={modalNovoGrupo}
                        value={formNovoGrupo.cd_cargo_grupo}
                        onChange={setFormNovoGrupoValues}
                    />
                </div>
                <div className="col-span-12" />
                <div className="col-span-12 pb-[200px]">
                    <InputTextArea
                        maxLength={1999}
                        id={"ds_observacoes_grupo"}
                        label={"Observações"}
                        value={formNovoGrupo.ds_observacoes_grupo}
                        onChange={setFormNovoGrupoValues}
                    />
                </div>
            </ModalGrid>
        </>
    );
};

export default GruposDeCandidatos;
