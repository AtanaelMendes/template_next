import TableVagasRelacionadoWeb from "@/components/candidatos/tables/TableVagasRelacionadoWeb";
import TableVagasEncaminhado from "@/components/candidatos/tables/TableVagasEncaminhado";
import { faVenus, faMars, faHistory, faWheelchair } from "@fortawesome/free-solid-svg-icons";
import CurriculoResumido from "@/components/candidatos/CurriculoResumido";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NoDataFound from "@/components/Layouts/NoDataFound";
import InputText from "@/components/inputs/InputText";
import PageTabs from "@/components/Layouts/PageTabs";
import Modal from "@/components/Layouts/ModalGrid";
import Button from "@/components/buttons/Button";
import { Rating } from "@smastrom/react-rating";
import DetalhesVaga from "./DetalhesVaga";
import PillsBadge from "@/components/buttons/PillsBadge";
import { useAppContext } from "@/context/AppContext";

const CandidatosDescartados = ({ data, active, refreshList, tabName }) => {
    const {candidatosDescartadosReady} = useAppContext();
    const [cdPessoaCandidatoViewHistoricoVaga, setCdPessoaCandidatoViewHistoricoVaga] = useState("");
    const [nmPessoaCandidatoViewHistoricoVaga, setNmPessoaCandidatoViewHistoricoVaga] = useState("");
    const [cdPessoaCurriculoResumido, setCdPessoaCurriculoResumido] = useState("");
    const [filter, setFilter] = useState({ filtro_vagas_relacionado: "" });
    const [modalHistoricoVagas, setmodalHistoricoVagas] = useState(false);
    const [pageTabs, setPageTabs] = useState([
        {
            name: "Relacionado WEB",
            id: "relacionado_web",
            active: true,
            visible: true,
            vaga: false,
        },
        {
            name: "Encaminhado",
            id: "encaminhado",
            active: false,
            visible: true,
            vaga: false,
        },
    ]);
    const [toggleView, setToggleView] = useState(null);

    const changeTab = useCallback((nmTab) => {
        setPageTabs(
            pageTabs.map((tab) => {
                tab.active = nmTab === tab.id;
                return tab;
            })
        );
    });

    const addPageTabsFunc = (nmTab) => {
        const tabExists = pageTabs.some((tab) => tab.id === nmTab);

        if (!tabExists) {
            let prevState = [...pageTabs];
            prevState = prevState.map((tab) => {
                return { ...tab, active: false };
            });
            prevState.push({
                name: nmTab,
                id: nmTab,
                active: true,
                visible: true,
                vaga: true,
            });
            setPageTabs(prevState);
        } else {
            setPageTabs(
                pageTabs.map((tab) => {
                    tab.active = tab.id === nmTab;
                    return tab;
                })
            );
        }
    };

    const setFilterTextCallback = (id, value) => {
        setFilter({ [id]: value });
    };

    const candidatosDescartados = useMemo(() => {
        return data.filter((item) =>
            Object.values(item).some(
                (v) =>
                    typeof v === "string" &&
                    v.toLowerCase().includes(filter.filtro_vagas_relacionado.toLowerCase())
            )
        );
    }, [filter, data]);

    useEffect(() => {
        setmodalHistoricoVagas(cdPessoaCandidatoViewHistoricoVaga != "");
    }, [cdPessoaCandidatoViewHistoricoVaga]);

    const curriculoResumidoCallback = () => {
        setCdPessoaCurriculoResumido("");
    };

    const dataToHtml = () => {
        if (!(candidatosDescartados?.length > 0)) return <NoDataFound isLoading={!candidatosDescartadosReady}/>;

        return candidatosDescartados?.map((cand) => {
            return (
                <div
                    className="grid grid-cols-12 odd:bg-white even:bg-gray-200 border-b border-slate-300 gap-x-1 p-1 text-sm xl:text-base relative" key={cand.CD_PESSOA_CANDIDATO}
                >
                    <div className="col-span-12 xl:col-span-6 mb-1">
                        <div className="grid grid-cols-1 gap-y-1">
                            <div className="inline-flex items-center">
                                <span className="text-xs text-slate-500">SIP:</span>{" "}
                                <span className="text-primary mx-2">{cand.CD_PESSOA_CANDIDATO}</span>
                                <span>
                                    <Rating
                                        style={{ maxWidth: "80px", height: "16px" }}
                                        value={cand.NOTA || 0}
                                        onChange={(rate) => {
                                            console.log(rate);
                                        }}
                                    />
                                </span>
                            </div>
                            <div>
                                <span
                                    className="font-semibold cursor-pointer text-primary hover:underline inline-flex items-center"
                                    onClick={() => {
                                        setCdPessoaCurriculoResumido(cand.CD_PESSOA_CANDIDATO);
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={cand.ID_SEXO === "M" ? faMars : faVenus}
                                        width="20"
                                        height="20"
                                        className={`${cand.ID_SEXO === "M" ? "text-primary" : "text-pink-500"}`}
                                    />
                                    {cand.NM_PESSOA}
                                </span>
                            </div>
                            <div className="italic text-xs">
                                {cand.DS_LOCALIDADE_SEM_CEP}
                            </div>
                        </div>
                    </div>

                    <div className="col-span-12 xl:col-span-4">
                        <div className="grid grid-cols-1">
                            <div>
                                <span className="text-xs text-slate-500">Relacionado:</span>{" "}
                                <span className="text-sm">{cand.DT}</span>
                            </div>
                            <div>
                                <span className="text-xs text-slate-500">Descartado:</span>{" "}
                                <span className="text-sm">{cand.ALTERADO_EM}</span>
                            </div>
                            <div className="flex w-[150px] invisible xl:visible h-0 xl:h-fit">
                                <PillsBadge type="danger" className="text-center h-fit text-xs">
                                    <span className="text-slate-500">descartado: </span>{cand?.ID_TIPO === "ELASTIC" ? "pesquisa" : "WEB"}
                                </PillsBadge>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-12 xl:col-span-2">
                        <div className="flex flex-row xl:flex-row-reverse flex-nowrap w-full">
                            <div className="absolute right-2 top-2">
                            {/* <div className="invisible xl:visible w-0 xl:w-fit"> */}
                                <Button
                                    className="h-fit"
                                    buttonType="secondary"
                                    bordered
                                    outline
                                    size="small"
                                    onClick={() => {
                                        setCdPessoaCandidatoViewHistoricoVaga(cand.CD_PESSOA_CANDIDATO);
                                        setNmPessoaCandidatoViewHistoricoVaga(cand.NM_PESSOA);
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={faHistory}
                                        width="14"
                                        height="14"
                                        className="text-primary"
                                    />
                                </Button>
                            </div>
                            {cand?.ID_POSSUE_DEFICIENCIA == 'S' &&(
                                <div className="absolute right-2 bottom-2">
                                    <PillsBadge
                                        type="warning"
                                        className="inline-flex items-center ml-2">
                                        PCD
                                        <FontAwesomeIcon
                                            icon={faWheelchair}
                                            width="12"
                                            height="12"
                                            className='ml-1'
                                        />
                                    </PillsBadge>
                                </div>
                            )}
                            <div className="flex w-[150px] visible xl:invisible">
                                <PillsBadge type="danger" className="text-center h-fit text-xs">
                                    <span className="text-slate-500">descartado: </span>{cand?.ID_TIPO === "ELASTIC" ? "pesquisa" : "WEB"}
                                </PillsBadge>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    };

    if (!active) return null;

    return (
        <>
            <div className={`grid grid-cols-12 pr-2 bg-white`}>
                <div className="col-span-12 px-2 shadow-lg z-20">
                    <div className="grid grid-cols-12 py-2">
                        <div className="col-start-7 col-span-6">
                            <InputText
                                placeholder="Filtrar"
                                clearable={true}
                                onChange={setFilterTextCallback}
                                id="filtro_vagas_relacionado"
                                helperText={`Exibindo ${candidatosDescartados.length} registros`}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-span-12 max-h-[400px] xl:max-h-[500px] overflow-y-auto pb-[100px] overflow-x-hidden max-w-full">
                    {dataToHtml()}
                </div>
            </div>

            <CurriculoResumido cdPessoaCandidato={cdPessoaCurriculoResumido} closeCallback={curriculoResumidoCallback} tabName={tabName}/>

            <Modal
                height="h-fit"
                size="md"
                title="Histórico de vaga do candidato"
                btnCancel={"FECHAR"}
                footerClass={`text-right`}
                id={"modal-vagas-relacionado"}
                modalControl={modalHistoricoVagas}
                closeModalCallback={() => {
                    setCdPessoaCandidatoViewHistoricoVaga("");
                    setNmPessoaCandidatoViewHistoricoVaga("");
                    setPageTabs([
                        {
                            name: "Relacionado WEB",
                            id: "relacionado_web",
                            active: true,
                            visible: true,
                            vaga: false,
                        },
                        {
                            name: "Encaminhado",
                            id: "encaminhado",
                            active: false,
                            visible: true,
                            vaga: false,
                        },
                    ]);
                }}
                setModalControl={setmodalHistoricoVagas}
            >
                <div className="col-span-12 min-h-[400px]">
                    <div className="grid grid-cols-1">
                        <PageTabs pageTabs={pageTabs} onClick={changeTab} wordWrap={true} />
                        <div className={`${pageTabs.find((tab) => tab.id === "relacionado_web").active ? "" : "hidden"}`}>
                            <TableVagasRelacionadoWeb
                                cdPessoaCandidato={cdPessoaCandidatoViewHistoricoVaga}
                                nmCandidato={nmPessoaCandidatoViewHistoricoVaga}
                            />
                        </div>
                        <div
                            className={`${
                                pageTabs.find((tab) => tab.id === "encaminhado").active
                                    ? ""
                                    : "hidden"
                            }`}
                        >
                            <TableVagasEncaminhado
                                addPageTabsFunc={addPageTabsFunc}
                                cdPessoaCandidato={cdPessoaCandidatoViewHistoricoVaga}
                                nmCandidato={nmPessoaCandidatoViewHistoricoVaga}
                            />
                        </div>
                        {pageTabs
                            .filter((tab) => tab.vaga)
                            .map((tab) => (
                                <div
                                    key={tab.id}
                                    className={`max-h-[500px] overflow-y-auto `}
                                >
                                    <DetalhesVaga nrVaga={tab.id} nmCargo={""} init={tab.active} setToggleView={setToggleView} toggleView={toggleView} />
                                </div>
                            ))}
                    </div>
                </div>
            </Modal>
        </>
    );
};
export default CandidatosDescartados;
