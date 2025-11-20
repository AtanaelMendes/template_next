import { faClose, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import CurriculoResumido from "@/components/candidatos/CurriculoResumido";
import FabAdd, { FabSave } from "@/components/buttons/FloatActionButton";
import { DebouncedSearch } from "@/components/inputs/DebouncedSearch";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputTextArea from "@/components/inputs/InputTextArea";
import { Caption } from "@/components/Layouts/Typography";
import ModalGrid from "@/components/Layouts/ModalGrid";
import Clipboard from "@/components/Layouts/Clipboard";
import InputText from "@/components/inputs/InputText";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Layouts/Loading";
import Button from "@/components/buttons/Button";
import axiosInstance from "@/plugins/axios";

const CandidatosDoGrupo = ({ grupoOnEdit, setShowCandidatos, tabName }) => {
    const [cdPessoaCurriculoResumido, setCdPessoaCurriculoResumido] = useState("");
    const [novosCandidatosDoGrupo, setNovosCandidatosDoGrupo] = useState([]);
    const [candidatosDoGrupo, setCandidatosDoGrupo] = useState([]);
    const [filterCand, setFilterCand] = useState({ search: "" });
    const [showAddCand, setShowAddCand] = useState(false);
    const [readyCand, setReadyCand] = useState(false);
    const { toast, openPageTab } = useAppContext();

    const getCandidatosDoGrupo = useCallback(() => {
        setReadyCand(false);
        axiosInstance
            .get(`grupo/candidatos-list/${grupoOnEdit.CD_TIPO_GRUPO_CANDIDATO}`)
            .then(function (response) {
                if (response.status === 200) {
                    setCandidatosDoGrupo(response.data);
                } else {
                    toast.error("OOps ocorreu um erro ao buscar os candidatos do grupo");
                }
            })
            .catch(function (resp) {
                let error = resp?.response?.data?.error;
                if (Array.isArray(error)) {
                    return toast.error(
                        error.join(" ") || "OOps ocorreu um erro ao buscar os candidatos do grupo"
                    );
                }
                return toast.error(
                    error || "OOps ocorreu um erro ao buscar os candidatos do grupo"
                );
            })
            .finally(() => {
                setReadyCand(true);
            });
    });

    const deleteCandidato = useCallback((nmPessoa, cdPessoa, cdTipoGrupoCandidato) => {
        if (!confirm("Tem certeza que deseja excluir esse candidato?\n" + nmPessoa)) return;

        setReadyCand(false);
        axiosInstance
            .delete(`grupo/candidato/${cdTipoGrupoCandidato}/${cdPessoa}`)
            .then(function (response) {
                if (response.status === 200) {
                    getCandidatosDoGrupo();
                    toast.success("Candidato excluído com sucesso");
                }
            })
            .catch(function (resp) {
                let error = resp?.response?.data?.error;
                if (Array.isArray(error)) {
                    return toast.error(
                        error.join(" ") || "OOps ocorreu um erro ao excluir o canidato"
                    );
                }
                return toast.error(error || "OOps ocorreu um erro ao excluir o canidato");
            })
            .finally(() => {
                setReadyCand(true);
            });
    });

    const inserirCandidatosNoGrupo = useCallback(() => {
        setReadyCand(false);
        let params = {
            cd_tipo_grupo_candidato: grupoOnEdit.CD_TIPO_GRUPO_CANDIDATO,
            candidatos: JSON.stringify(novosCandidatosDoGrupo),
        };

        axiosInstance
            .post(`grupo/candidatos-add`, params)
            .then(function (response) {
                if (response.status === 200) {
                    toast.success("Candidatos adicionados com sucesso");
                    getCandidatosDoGrupo();
                    setShowAddCand(false);
                }
            })
            .catch(function (resp) {
                let error = resp?.response?.data?.error;
                if (Array.isArray(error)) {
                    return toast.error(
                        error.join(" ") || "OOps ocorreu um erro ao adicionar os candidatos"
                    );
                }
                return toast.error(error || "OOps ocorreu um erro ao adicionar os candidatos");
            })
            .finally(() => {
                setReadyCand(true);
            });
    });

    const candidatosDoGrupoFilter = useMemo(() => {
        return candidatosDoGrupo.filter((item) =>
            Object.values(item).some(
                (v) =>
                    typeof v === "string" &&
                    v.toLowerCase().includes(filterCand.search.toLowerCase())
            )
        );
    }, [filterCand, candidatosDoGrupo]);

    const curriculoResumidoCallback = () => {
        setCdPessoaCurriculoResumido("");
    };

    useEffect(() => {
        if (Object.keys(grupoOnEdit).length > 0) {
            getCandidatosDoGrupo();
        }
    }, [grupoOnEdit]);

    const setFilterCandCallback = useCallback(
        (id, value) => {
            setFilterCand((prevState) => ({ ...prevState, search: value }));
        },
        [setFilterCand]
    );

    const setDsObservacoesCandidato = useCallback((cdPessoa, dsObservacao) => {
        let prevState = [...novosCandidatosDoGrupo];
        prevState.find((cand) => cand.cd_pessoa === cdPessoa).ds_observacoes = dsObservacao;
        setNovosCandidatosDoGrupo(prevState);
    });

    const addCandidato = useCallback((cdPessoa, nmPessoa) => {
        setNovosCandidatosDoGrupo((prevState) => [
            ...prevState,
            { cd_pessoa: cdPessoa, nm_pessoa: nmPessoa, ds_observacoes: "" },
        ]);
    });

    const removeCandidato = useCallback((cand, index) => {
        let prevState = [...novosCandidatosDoGrupo];
        prevState.splice(index, 1);
        setNovosCandidatosDoGrupo(prevState);
    });

    const editarDadosCandidato = useCallback(
        (cd_pessoa_candidato) => {
            openPageTab({
                id: "DadosCandidato",
                name: `Dados do candidato`,
                props: {
                    cdPessoaCandidato: cd_pessoa_candidato,
                },
            });
        },
        [openPageTab]
    );

    function dataToHtmlNovosCandidatos() {
        return (
            <div className="grid grid-cols-12">
                {novosCandidatosDoGrupo?.map((row, index) => {
                    return (
                        <div
                            className="col-span-12 even:bg-white odd:bg-slate-200 border-b-2"
                            key={`${row.cd_pessoa}_${index}}`}
                        >
                            <div className="flex flex-row items-center p-2 text-sm">
                                <div className="w-[40%]">
                                    {row.cd_pessoa} - {row.nm_pessoa}
                                </div>
                                <div className="w-1/2">
                                    <InputTextArea
                                        rows={2}
                                        maxLength={1999}
                                        label={"Observações"}
                                        id={`${row.cd_pessoa}_${index}`}
                                        value={
                                            novosCandidatosDoGrupo.find(
                                                (cand) => cand.cd_pessoa === row.cd_pessoa
                                            )?.ds_observacoes
                                        }
                                        onChange={(_id, value) => {
                                            setDsObservacoesCandidato(row.cd_pessoa, value);
                                        }}
                                    />
                                </div>
                                <div className="w-[10%] text-center">
                                    <Button
                                        size="small"
                                        pill
                                        buttonType="danger"
                                        outline
                                        onClick={() => removeCandidato(row.cd_pessoa, index)}
                                        className="py-2"
                                    >
                                        <FontAwesomeIcon icon={faXmark} width="14" height="14" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    function dataToHtmlCandidatosDoGrupo() {
        return candidatosDoGrupoFilter?.map((row, index) => {
            return (
                <div
                    className="grid grid-cols-12 odd:bg-white even:bg-gray-100 p-2 border-b border-slate-300 text-sm relative"
                    key={`row-${index}`}
                >
                    <div className="absolute top-[50%] right-2 transform -translate-y-1/2">
                        <Button
                            size="small"
                            buttonType="danger"
                            outline
                            bordered
                            small
                            onClick={() => {
                                deleteCandidato(
                                    row.NM_PESSOA,
                                    row.CD_PESSOA,
                                    row.CD_TIPO_GRUPO_CANDIDATO
                                );
                            }}
                        >
                            <FontAwesomeIcon icon={faTrash} width="14" height="14" />
                        </Button>
                    </div>

                    <div className="col-span-12">
                        <div className="flex flex-row flex-wrap py-0.5">
                            <div className="flex flex-col w-[80px]">
                                <Caption>SIP:</Caption>
                            </div>
                            <div className="w-fit text-primary">
                                <Clipboard
                                    onClick={() => editarDadosCandidato(row.CD_PESSOA)}
                                    className={`cursor-pointer`}
                                >
                                    {row.CD_PESSOA}
                                </Clipboard>
                            </div>
                        </div>

                        <div className="flex flex-row flex-wrap py-0.5">
                            <div className="flex flex-col w-[80px]">
                                <Caption>Candidato:</Caption>
                            </div>
                            <div
                                className="w-fit font-semibold text-primary hover:underline cursor-pointer"
                                onClick={() => {
                                    setCdPessoaCurriculoResumido(row.CD_PESSOA);
                                }}
                            >
                                {row.NM_PESSOA}
                            </div>
                        </div>

                        <div className="flex flex-row flex-wrap py-0.5">
                            <div className="flex flex-col w-[80px]">
                                <Caption>Incluído em:</Caption>
                            </div>
                            <div className="w-fit">{row.CRIADO_EM}</div>
                        </div>

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
            <div className={`col-span-6 shadow`}>
                <Loading active={!readyCand} />
                {readyCand && (
                    <div className="grid grid-cols-1">
                        <div>
                            <div className="col-span-12 bg-blue-600 py-1 pl-2 pr-1 rounded-t-lg h-8">
                                <div className="grid grid-cols-12">
                                    <div className="col-span-11 text-white">
                                        <span className="italic">
                                            {grupoOnEdit.NM_TIPO_GRUPO_CANDIDATO}
                                        </span>
                                    </div>
                                    <div className="col-span-1 text-right">
                                        <Button
                                            className={`hover:bg-drop-shadow-2 text-white`}
                                            size="small"
                                            pill
                                            onClick={() => {
                                                setShowCandidatos(false);
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={faClose}
                                                width="16"
                                                height="16"
                                            />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`px-2 border-b-2 ${!showAddCand ? "" : "hidden"}`}>
                            <div className="grid grid-cols-12 py-2">
                                <div className="col-start-8 col-span-5">
                                    <InputText
                                        helperText={`Exibindo ${candidatosDoGrupoFilter.length} registros`}
                                        value={filterCand.search}
                                        placeholder="Filtrar"
                                        clearable={true}
                                        onChange={setFilterCandCallback}
                                        id="filtro_candidatos_do_grupo"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={`${showAddCand ? "" : "hidden"} h-fit`}>
                            <div className="flex-row w-full inline-block p-2">
                                <DebouncedSearch.Root id="cd_pessoa_add_cand">
                                    <DebouncedSearch.Label label="Candidato" />
                                    <DebouncedSearch.Select
                                        delayed
                                        setData={addCandidato}
                                        optId="CD_PESSOA"
                                        optLabel="NM_PESSOA_FILTRO"
                                        urlGet="candidato/candidatos"
                                    />
                                </DebouncedSearch.Root>
                            </div>
                            <div className="inline-block flex-row text-right w-full p-2">
                                <Button
                                    id="btn-cancel-add-cand"
                                    buttonType="danger"
                                    outline
                                    size="small"
                                    className="mr-2"
                                    onClick={() => {
                                        setShowAddCand(false);
                                    }}
                                >
                                    CANCELAR
                                </Button>
                            </div>
                        </div>

                        <div className={`max-h-[550px] overflow-y-auto pb-[200px]`}>
                            {showAddCand
                                ? dataToHtmlNovosCandidatos()
                                : dataToHtmlCandidatosDoGrupo()}
                        </div>
                    </div>
                )}
            </div>

            {showAddCand ? (
                <FabSave
                    id="btn-salvar-candidatos"
                    className={`bottom-5 right-5 ${
                        Object.keys(grupoOnEdit).length > 0 ? "" : "hidden"
                    }`}
                    onClick={inserirCandidatosNoGrupo}
                />
            ) : (
                <FabAdd
                    id="btn-add-candidato"
                    className={`bottom-5 right-5 ${
                        Object.keys(grupoOnEdit).length > 0 ? "" : "hidden"
                    }`}
                    onClick={() => {
                        setShowAddCand(true);
                    }}
                />
            )}

            <CurriculoResumido cdPessoaCandidato={cdPessoaCurriculoResumido} closeCallback={curriculoResumidoCallback} tabName={tabName}/>
        </>
    );
};

export default CandidatosDoGrupo;
