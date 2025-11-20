import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RichText from "@/components/inputs/RichText";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import FabAdd from "@/components/buttons/FloatActionButton";
import Timeline from "@/components/Layouts/Timeline";
import Button from "@/components/buttons/Button";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Layouts/Loading";
import axiosInstance from "@/plugins/axios";

const HistoricoVaga = ({init, nrVagaCliente, label, closeWindowCallback }) => {
    const { toast, user } = useAppContext();
    const [timelineData, setTimelineData] = useState([]);
    const [rawData, setRawData] = useState([]);
    const [controlInsertStory, setControlInsertStory] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dsHistorico, setDsHistorico] = useState({ ds_historico: "" });
    const [isVagaCongelada, setIsVagaCongelada] = useState(true);
    const divStory = useRef();

    const setDsHistoricoCallback = (id, value) => {
        setDsHistorico({ ...dsHistorico, [id]: value });
    };

    const MAX_HIST_LEN = 3999;
    const MIN_HIST_LEN = 20;

    function htmlToPlain(html = "") {
        // remove tags
        let text = html.replace(/<[^>]*>/g, " ");
        // troca entidades básicas &nbsp; e múltiplos espaços/linhas
        text = text.replace(/&nbsp;/gi, " ").replace(/\s+/g, " ");
        return text.trim();
    }

    const insertHistorico = () => {
        const plain = htmlToPlain(dsHistorico.ds_historico);
        if (plain.length < MIN_HIST_LEN) {
            return toast.error(`Informe o histórico, mínimo ${MIN_HIST_LEN} caracteres`);
        }

        setLoading(true);
        axiosInstance
            .post(`vaga/timeline`, {
                ...dsHistorico,
                nr_vaga: nrVagaCliente,
                cd_usuario: user.user_sip,
                ds_historico: dsHistorico.ds_historico.replace(/\u200B/g,''),
            })
            .then(function () {
                setLoading(false);
                toast.success("Novo histórico inserido");
                setDsHistorico({ ds_historico: "" });
                getHistoricoVaga();
                scrollToTop();
            })
            .catch(function (error) {
                setLoading(false);
                toast.error("Não foi possível inserir o histórico");
                console.error(error);
            });
    };

    const getHistoricoVaga = () => {
        setLoading(true);
        axiosInstance
            .get(`vaga/timeline/${user.cd_sip}/${nrVagaCliente}`)
            .then(function (response) {
                setLoading(false);
                setRawData(response.data || []);
            })
            .catch(function (error) {
                setLoading(false);
                console.error(error);
            });
    };

    const getSituacaoVaga = () => {
        axiosInstance
            .get(`vaga/situacao/${nrVagaCliente}`)
            .then(function (response) {
                if (response.status != 200){
                    toast.error("Não foi possível buscar a situação da vaga");
                    return;
                }
                let situacao = response.data;
                setIsVagaCongelada(situacao == 13);
            })
            .catch(function (error) {
                toast.error("Não foi possível buscar a situação da vaga");
            });
    }

    useEffect(() => {
        if (nrVagaCliente) {
            getHistoricoVaga();
            getSituacaoVaga();
        }
    }, [nrVagaCliente]);

    useEffect(() => {
        setTimelineData(
            rawData.map((row) => {
                return {
                    title: row.NM_USUARIO,
                    time: row.DT_HISTORICO,
                    description: row.DS_HISTORICO,
                };
            })
        );
    }, [rawData]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeWindowCallback();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    function scrollToTop() {
        divStory.current.scrollTop = 0;
        let timeline = divStory.current.querySelector("ol");
        let firstLi = timeline.querySelector("li:first-child");
        if (firstLi) {
            firstLi.classList.add("bg-green-300");
        }
        setTimeout(() => {
            firstLi.classList.remove("bg-green-300");
        }, 1000);
    }

    return (
        <div className="grid grid-cols-12 rounded bg-white pr-1 relative">
            <Loading active={loading} />
            <div className="col-span-12 bg-blue-600 py-1 pl-2 pr-1 rounded-t-lg h-8">
                <div className="grid grid-cols-12">
                    <div className="col-span-11 text-white">
                        <span className="font-semibold text-sm">{label || ""}</span>
                    </div>
                    <div className="col-span-1 text-right">
                        <Button
                            className={`hover:bg-drop-shadow-2 text-white`}
                            size="small"
                            pill
                            onClick={() => {
                                closeWindowCallback();
                            }}
                        >
                            <FontAwesomeIcon icon={faClose} width="16" height="16" />
                        </Button>
                    </div>
                </div>
            </div>
            <div className="col-span-12 p-2">
                <div
                    className={`grid grid-cols-1 shadow rounded-lg p-1 ${
                        controlInsertStory || "hidden"
                    }`}
                >
                    <div className="col-span-1">
                        <RichText
                            id="ds_historico"
                            label="Inserir histórico"
                            value={dsHistorico.ds_historico}
                            onChange={setDsHistoricoCallback}
                            required={false}
                            maxLength={MAX_HIST_LEN}
                            small={false}
                            className="shadow"
                        />
                    </div>
                    <div className="col-span-1 py-2 flex justify-end">
                        <Button
                            buttonType="danger"
                            outline
                            size="small"
                            onClick={() => {
                                setControlInsertStory(false);
                            }}
                        >
                            CANCELAR
                        </Button>
                        <Button
                            buttonType="success"
                            size="small"
                            className="ml-2"
                            onClick={() => {
                                insertHistorico();
                            }}
                        >
                            SALVAR
                        </Button>
                    </div>
                </div>
            </div>
            <div className="col-span-12 pl-4 pt-2 max-h-[600px] overflow-y-auto" ref={divStory}>
                <Timeline data={timelineData} />
                <FabAdd
                    disabled={isVagaCongelada}
                    onClick={() => {
                        setControlInsertStory(true);
                    }}
                    className={"bottom-5 right-5"}
                />
            </div>
        </div>
    );
};
export default HistoricoVaga;
